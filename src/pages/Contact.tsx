import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageHero } from "../components/page/Page.tsx";
import Icon from "../components/Icon.tsx";
import { usingSample } from "../lib/forum.ts";
import { links } from "../lib/links.ts";

/**
 * The form posts to the Firebase function behind /api/contact, which checks
 * a reCAPTCHA Enterprise token and emails the team. When the reCAPTCHA
 * script can't load (filters and ad blockers often block Google), sending
 * would only fail, so the page says so and offers email instead, with the
 * message already written.
 */

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const TEAM_EMAIL = "admin@jtechforums.org";
const CAPTCHA_WAIT_MS = 12000;

interface Grecaptcha {
  enterprise?: {
    ready: (callback: () => void) => void;
    execute: (key: string, options: { action: string }) => Promise<string>;
  };
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

type Status = "idle" | "sending" | "sent" | "error" | "blocked";
type CaptchaState = "off" | "loading" | "ready" | "failed";

let captchaScript: Promise<void> | null = null;

/** Load reCAPTCHA Enterprise once, and settle when it's usable or clearly isn't. */
function loadCaptcha(): Promise<void> {
  captchaScript ??= new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("reCAPTCHA took too long to load")), CAPTCHA_WAIT_MS);
    const done = () => {
      window.clearTimeout(timer);
      resolve();
    };
    const whenReady = () => {
      const enterprise = window.grecaptcha?.enterprise;
      if (enterprise?.ready) enterprise.ready(done);
      else window.setTimeout(whenReady, 100);
    };
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(SITE_KEY)}`;
    script.async = true;
    script.onload = whenReady;
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("reCAPTCHA was blocked"));
    };
    document.head.append(script);
  }).catch((error: unknown) => {
    captchaScript = null; // let a later visit try again
    throw error;
  });
  return captchaScript;
}

function mailtoFor(form: HTMLFormElement | null): string {
  const data = form ? new FormData(form) : null;
  const value = (key: string) => String(data?.get(key) ?? "").trim();
  const body = [value("message"), "", value("name"), value("phone")].filter(Boolean).join("\n");
  const subject = value("name") ? `Message from ${value("name")}` : "Message from the website";
  return `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaState>(SITE_KEY ? "loading" : "off");

  useEffect(() => {
    if (!SITE_KEY) return;
    let live = true;
    loadCaptcha().then(
      () => live && setCaptcha("ready"),
      () => live && setCaptcha("failed"),
    );
    return () => {
      live = false;
    };
  }, []);

  async function token(): Promise<string> {
    if (!SITE_KEY) return "";
    await loadCaptcha();
    const enterprise = window.grecaptcha?.enterprise;
    if (!enterprise) throw new Error("reCAPTCHA isn't available");
    return enterprise.execute(SITE_KEY, { action: "contact" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingSample) {
      setStatus("error");
      setMessage("This local preview isn't connected to the contact service, so nothing was sent.");
      return;
    }
    setStatus("sending");
    setMessage("");
    const formElement = event.currentTarget;
    const payload = new URLSearchParams();
    new FormData(formElement).forEach((value, key) => {
      if (typeof value === "string") payload.append(key, value);
    });
    let recaptchaToken = "";
    try {
      recaptchaToken = await token();
    } catch {
      setCaptcha("failed");
      setStatus("blocked");
      return;
    }
    if (recaptchaToken) payload.append("recaptchaToken", recaptchaToken);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        if (response.status === 400 && /human/i.test(result.error ?? "")) {
          setStatus("blocked");
          return;
        }
        throw new Error(result.error || "The message couldn't be sent.");
      }
      formElement.reset();
      setStatus("sent");
      setMessage("Sent. Thanks for writing; we'll reply by email.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The message couldn't be sent.");
    }
  }

  return (
    <div className="page contact-page">
      <PageHero eyebrow="CONTACT" title="Contact the team">
        <p className="lede">
          Questions about the forum, your account, or this site. For help with a phone or a filter,
          the forum is faster: more people will see it.
        </p>
      </PageHero>

      <form ref={form} onSubmit={submit} className="page-panel contact-form" autoComplete="on">
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
        <div className="contact-fields">
          <label className="field">
            <span>Name</span>
            <input name="name" required autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Your name" />
          </label>
          <label className="field">
            <span>Phone number</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" enterKeyHint="next" placeholder="(123) 456-7890" />
          </label>
          <label className="field field-wide">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" inputMode="email" enterKeyHint="next" placeholder="you@example.com" />
          </label>
          <label className="field field-wide">
            <span>Message</span>
            <textarea name="message" rows={6} required enterKeyHint="send" placeholder="What can we help with?" />
          </label>
        </div>
        <button type="submit" className="button contact-submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {captcha === "loading" && status === "idle" && (
          <p className="contact-fineprint">Protected by Google reCAPTCHA.</p>
        )}
        {(status === "blocked" || (captcha === "failed" && status === "idle")) && (
          <div className="notice notice-warn" role="alert">
            {captcha === "failed" ? (
              <>
                <strong>The spam check couldn't load.</strong>
                <p>
                  This form needs Google reCAPTCHA, which filters and ad blockers often block. Send
                  your message by email instead; it's already written:
                </p>
              </>
            ) : (
              <>
                <strong>The spam check didn't let this through.</strong>
                <p>
                  Google reCAPTCHA wasn't sure this came from a person. Send it by email instead;
                  it's already written:
                </p>
              </>
            )}
            <p className="notice-actions">
              <a
                className="button"
                href={mailtoFor(form.current)}
                onClick={(event) => {
                  event.currentTarget.href = mailtoFor(form.current);
                }}
              >
                <Icon name="mail" size={18} /> Email {TEAM_EMAIL}
              </a>
              <a className="text-link" href={links.siteFeedback}>
                Or post in Site Feedback <Icon />
              </a>
            </p>
          </div>
        )}
        {(status === "sent" || status === "error") && (
          <p className={`notice ${status === "sent" ? "notice-ok" : "notice-error"}`} role="status">
            {message}
            {status === "error" && (
              <>
                {" "}
                You can also email <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>.
              </>
            )}
          </p>
        )}
      </form>

      <p className="contact-alternatives">
        Prefer email? <a href={links.email}>{TEAM_EMAIL}</a>
        <span aria-hidden="true">·</span>
        Something wrong with the forum? <a href={links.siteFeedback}>Site Feedback</a>
      </p>
    </div>
  );
}
