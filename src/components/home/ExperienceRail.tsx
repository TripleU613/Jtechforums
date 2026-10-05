import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { asset } from "../../lib/asset.ts";
import { forumSearch, links } from "../../lib/links.ts";
import EgateScreens from "../EgateScreens.tsx";
import Icon from "../Icon.tsx";
import ThemedShot from "../ThemedShot.tsx";
import TerminalToy from "./TerminalToy.tsx";
import { DESKTOP_MOTION, gsap, ScrollTrigger } from "./gsap.ts";

type SlideType = "guides" | "apps" | "egate" | "installer";

interface Slide {
  id: string;
  label: string;
  title: ReactNode;
  text: string;
  to: string;
  action: string;
  type: SlideType;
}

const slides: Slide[] = [
  {
    id: "01",
    label: "GUIDES",
    title: (
      <>
        Step-by-step{" "}
        <br />
        guides
      </>
    ),
    text: "Walkthroughs written by members and checked by moderators: unlocking and rooting the Kyocera E4810, flashing a TCL Flip, VoLTE on the Qin F21 Pro, 35 useful ADB commands.",
    to: links.guides,
    action: "Read the guides",
    type: "guides",
  },
  {
    id: "02",
    label: "ANDROID APPS",
    title: (
      <>
        Apps for{" "}
        <br />
        your phone
      </>
    ),
    text: "Apps members built or reworked for keypad and touch phones, from D-pad texting to a Matrix client, each with its own thread for help and updates.",
    to: links.androidApps,
    action: "Browse Android Apps",
    type: "apps",
  },
  {
    id: "03",
    label: "OFFLINE DEVICE MANAGER",
    title: (
      <>
        eGate{" "}
        <br />
        filter
      </>
    ),
    text: "An Android device manager from Offline Software Solutions. One license, no subscription, locked with a password you choose.",
    to: "/egate",
    action: "About eGate",
    type: "egate",
  },
  {
    id: "04",
    label: "IN YOUR BROWSER",
    title: (
      <>
        MDM{" "}
        <br />
        installer
      </>
    ),
    text: "Connect an Android phone to a computer and install one of over a dozen filters and device managers from the browser. It checks the phone and walks you through USB debugging first.",
    to: links.installer,
    action: "Open the installer",
    type: "installer",
  },
];

const APP_ICONS = [
  ["Waze", "Waze.webp"],
  ["Musicolet", "Musicolet.png"],
  ["WeNote", "WeNote.webp"],
  ["eGate", "eGate.webp"],
  ["TetherFi", "TetherFi.webp"],
  ["File Manager+", "FileManagerPlus.webp"],
  ["Google Translate", "GoogleTranslate.webp"],
  ["Button Mapper", "ButtonMapper.webp"],
  ["ColorNote", "ColorNote.webp"],
] as const;

/** The forum's Guides category as it looks now, in the page's own mode. */
function GuidesShot({ alt }: { alt: string }) {
  return <ThemedShot base="/img/forum/guides" alt={alt} />;
}

function GuidePreview() {
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (expanded) dialog.current?.showModal();
  }, [expanded]);
  const close = () => {
    setExpanded(false);
    opener.current?.focus();
  };
  return (
    <>
      <div className="rail-guide-stack">
        <div className="guide-screen">
          <div className="guide-screen-top">
            <span>● ● ●</span>
            <span>JTECH / GUIDES</span>
            <Icon name="external" size={12} />
          </div>
          <button
            type="button"
            ref={opener}
            className="guide-expand"
            onClick={() => setExpanded(true)}
            aria-label="Expand guide preview"
          >
            <GuidesShot alt="The forum's Guides category" />
            <span>
              EXPAND PREVIEW <Icon name="plus" size={16} />
            </span>
          </button>
        </div>
        <div className="guide-popover">
          <Icon name="check" />
          <span>
            Written by members.{" "}
            <br />
            <strong>Checked by moderators.</strong>
          </span>
        </div>
      </div>
      {expanded && (
        <dialog
          ref={dialog}
          className="image-lightbox"
          onCancel={close}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="lightbox-toolbar">
            <span>JTECH / GUIDE PREVIEW</span>
            <button type="button" onClick={close} aria-label="Close guide preview">
              <Icon name="close" />
            </button>
          </div>
          <GuidesShot alt="The forum's Guides category, full size" />
        </dialog>
      )}
    </>
  );
}

function SlideVisual({ type }: { type: SlideType }) {
  if (type === "apps")
    return (
      <div className="rail-app-wall">
        {APP_ICONS.map(([name, file], i) => (
          <div key={name} style={{ "--tile": i } as CSSProperties}>
            <a href={forumSearch(name)} title={`${name} on the forum`}>
              <img src={asset(`/img/apps/${file}`)} alt={`${name}: search the forum`} loading="lazy" />
            </a>
          </div>
        ))}
      </div>
    );
  if (type === "egate")
    return (
      <div className="rail-phone">
        <span className="phone-speaker" />
        <EgateScreens />
        <div className="phone-dial">◉</div>
        <div className="phone-keys">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>{i < 9 ? i + 1 : ["*", "0", "#"][i - 9]}</span>
          ))}
        </div>
      </div>
    );
  if (type === "installer") return <TerminalToy />;
  return <GuidePreview />;
}

export default function ExperienceRail() {
  const shell = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const trigger = useRef<Trigger | null>(null);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const shellEl = shell.current;
      const rootEl = root.current;
      const trackEl = track.current;
      const viewportEl = viewport.current;
      if (!shellEl || !rootEl || !trackEl || !viewportEl) return;
      const headerHeight = () =>
        document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const distance = () => trackEl.scrollWidth - viewportEl.clientWidth;
      const sizeShell = () => {
        shellEl.style.setProperty("--story-top", `${headerHeight()}px`);
        shellEl.style.height = `${rootEl.offsetHeight + distance()}px`;
      };
      shellEl.classList.add("is-scroll-story");
      sizeShell();
      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: shellEl,
          start: () => `top ${headerHeight()}px`,
          refreshPriority: 1,
          onRefreshInit: sizeShell,
          end: () => `+=${distance()}`,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(3, Math.round(self.progress * 3))),
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      const scenes: gsap.core.Tween[] = [];
      gsap.utils.toArray<HTMLElement>(".experience-panel", rootEl).forEach((panel, index) => {
        if (index === 0) return;
        const visual = panel.querySelector(".panel-visual");
        const copy = panel.querySelector(".panel-copy");
        scenes.push(
          gsap.fromTo(
            visual,
            { scale: 0.65, rotate: 8, opacity: 0.15, y: 65 },
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 95%",
                end: "left 18%",
                scrub: 0.5,
              },
            },
          ),
          gsap.fromTo(
            copy,
            { y: 80, opacity: 0.1 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 80%",
                end: "left 15%",
                scrub: 0.5,
              },
            },
          ),
        );
      });
      void document.fonts.ready.then(() => {
        if (trigger.current) ScrollTrigger.refresh();
      });
      return () => {
        for (const scene of scenes) {
          scene.scrollTrigger?.kill();
          scene.revert();
        }
        trigger.current = null;
        tween.scrollTrigger?.kill();
        tween.revert();
        shellEl.classList.remove("is-scroll-story");
        shellEl.style.removeProperty("height");
        shellEl.style.removeProperty("--story-top");
      };
    });
    return () => mm.revert();
  }, []);

  function go(index: number) {
    const pinned = trigger.current;
    if (pinned) {
      window.scrollTo({
        top: pinned.start + ((pinned.end - pinned.start) * index) / 3,
        behavior: "smooth",
      });
    } else if (viewport.current && track.current) {
      const panel = track.current.children[index] as HTMLElement | undefined;
      viewport.current.scrollTo({
        left: (panel?.offsetLeft ?? 0) - track.current.offsetLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
    setActive(index);
  }

  return (
    <div className="story-pin-shell" ref={shell}>
      <section className="experience-rail" id="resources" ref={root} aria-label="Where to start">
        <div className="rail-heading">
          <div>
            <span className="eyebrow">WHERE PEOPLE START</span>
            <h2>
              Start with{" "}
              <br />
              <span>one of these.</span>
            </h2>
          </div>
          <div className="rail-heading-right">
            <span>FOUR PLACES TO START.</span>
            <p>
              Keep scrolling. <span>↗</span>
            </p>
          </div>
        </div>
        <div
          className="rail-viewport"
          ref={viewport}
          onScroll={() => {
            if (trigger.current || !track.current || !viewport.current) return;
            const width = track.current.children[0]?.getBoundingClientRect().width || 1;
            setActive(Math.min(3, Math.round(viewport.current.scrollLeft / (width + 24))));
          }}
        >
          <div className="rail-track" ref={track}>
            {slides.map((slide, i) => (
              <article
                className={`experience-panel panel-${slide.type}`}
                key={slide.id}
                onFocusCapture={() => {
                  if (trigger.current && active !== i) go(i);
                }}
              >
                <div className="panel-copy">
                  <span className="eyebrow">{slide.label}</span>
                  <h3>{slide.title}</h3>
                  <p>{slide.text}</p>
                  {slide.to.startsWith("http") ? (
                    <a className="panel-link" href={slide.to}>
                      {slide.action}
                      <Icon name="arrow" />
                    </a>
                  ) : (
                    <Link viewTransition className="panel-link" to={slide.to}>
                      {slide.action}
                      <Icon name="arrow" />
                    </Link>
                  )}
                </div>
                <div className="panel-visual">
                  <SlideVisual type={slide.type} />
                </div>
                <span className="panel-number">/{slide.id}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="rail-footer">
          <div className="rail-pagination" aria-label="Places to start">
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => go(i)}
                aria-label={`Show ${slide.label.toLowerCase()}`}
                aria-current={active === i ? "true" : undefined}
              >
                <span>{slide.id}</span>
                <i />
              </button>
            ))}
          </div>
          <span className="rail-footer-label">
            SCROLL / SWIPE TO EXPLORE <Icon />
          </span>
        </div>
      </section>
    </div>
  );
}
