import { useEffect, useState } from "react";
import Icon from "../components/Icon.tsx";
import { PageHero } from "../components/page/Page.tsx";
import { links } from "../lib/links.ts";
import { INVITE, inviteCode, probe } from "../lib/probe.ts";

/**
 * Where the forum's "server" link lands. It checks the way through before
 * sending anyone on, so a visitor behind a filter is told why nothing opened
 * instead of landing on the filter's own error page.
 */

const COUNTDOWN_S = 3;

type State =
  | { kind: "missing" }
  | { kind: "checking"; target: string }
  | { kind: "open"; target: string; left: number }
  | { kind: "blocked"; target: string };

function initial(): State {
  const code = inviteCode(window.location.search);
  return code === null ? { kind: "missing" } : { kind: "checking", target: INVITE + encodeURIComponent(code) };
}

export default function Server() {
  const [state, setState] = useState<State>(initial);

  // Only means anything to someone who followed the forum's link.
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.append(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    const code = inviteCode(window.location.search);
    if (code === null) return;
    let cancelled = false;
    void probe(code, (url, init) => fetch(url, init)).then((reach) => {
      if (cancelled) return;
      setState((now) =>
        now.kind === "checking"
          ? reach === "open"
            ? { kind: "open", target: now.target, left: COUNTDOWN_S }
            : { kind: "blocked", target: now.target }
          : now,
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.kind !== "open") return;
    if (state.left === 0) {
      window.location.replace(state.target);
      return;
    }
    const timer = window.setTimeout(() => setState({ ...state, left: state.left - 1 }), 1000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const back = (
    <a className="button button-ghost" href={links.forum}>
      Back to the forum
    </a>
  );

  return (
    <div className="page notice-page server-page">
      {state.kind === "missing" && (
        <>
          <PageHero eyebrow="JTECH SERVER" title="This link is missing its invite">
            <p className="lede">Use the server link on the forum.</p>
          </PageHero>
          <div className="page-actions page-actions-center">{back}</div>
        </>
      )}

      {state.kind === "checking" && (
        <PageHero eyebrow="JTECH SERVER" title="Checking your connection">
          <p className="lede server-checking" role="status">
            One moment.
          </p>
        </PageHero>
      )}

      {state.kind === "open" && (
        <>
          <PageHero eyebrow="JTECH SERVER" title="Opening the JTech server">
            <p className="server-count" aria-hidden="true">
              {state.left}
            </p>
            <p className="sr-only" role="status">
              {state.left > 0 ? `Opening in ${state.left}` : "Opening"}
            </p>
          </PageHero>
          <div className="page-actions page-actions-center">
            <a className="button" href={state.target}>
              Go now <Icon />
            </a>
            {back}
          </div>
        </>
      )}

      {state.kind === "blocked" && (
        <>
          <PageHero eyebrow="JTECH SERVER" title="Seems like your filter doesn’t allow this">
            <p className="lede" role="status">
              The server didn’t answer from this connection.
            </p>
          </PageHero>
          <div className="page-actions page-actions-center">
            {back}
            <a className="button button-ghost" href={state.target}>
              Try anyway <Icon name="external" size={16} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
