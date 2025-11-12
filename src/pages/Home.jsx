import { useEffect, useMemo, useRef, useState } from 'react';

const heroLines = [
  'Welcome to JTech Forums.',
  'The leading Jewish filtering & tech forum.',
  'Everything here is written by the community for the community.',
];

const previewLines = [
  'Every post in this feed is written by real JTech members solving real kosher tech problems.',
  'Browse the latest app drops, FAQs, and walkthroughs, then jump into the thread when you need more.',
];

const adminProfiles = [
  {
    name: 'Usher Weiss',
    handle: '@TripleU',
    role: 'Forums Owner & Maintainer',
    avatar: 'https://forums.jtechforums.org/user_avatar/forums.jtechforums.org/tripleu/144/488_2.png',
    profileUrl: 'https://forums.jtechforums.org/u/tripleu',
  },
  {
    name: 'Avrumi Sternheim',
    handle: '@ars18',
    role: 'Forums Admin & Moderator',
    avatar: 'https://forums.jtechforums.org/user_avatar/forums.jtechforums.org/ars18/144/2336_2.png',
    profileUrl: 'https://forums.jtechforums.org/u/ars18',
  },
  {
    name: 'Offline Software Solutions',
    handle: '@flipadmin',
    role: 'Forum Founder & Developer',
    avatar: 'https://forums.jtechforums.org/user_avatar/forums.jtechforums.org/flipadmin/144/2891_2.png',
    profileUrl: 'https://forums.jtechforums.org/u/flipadmin',
  },
];

const HERO_PORTION = 0.6; // 60% of the journey for hero copy
const CARD_STAGE_END = 0.85; // point in the journey when the card is fully in place
const PREVIEW_END = 1; // second screen fully rendered
const ADMIN_PAUSE = 0.15; // dead zone after preview before admin section
const ADMIN_STAGE_LENGTH = 0.3;
const ADMIN_STAGE_START = PREVIEW_END + ADMIN_PAUSE;
const ADMIN_STAGE_END = ADMIN_STAGE_START + ADMIN_STAGE_LENGTH;
const MAX_PROGRESS = ADMIN_STAGE_END;

const AUTO_SPEED = 0.0008;
const PREVIEW_AUTO_SPEED = 0.0006;
const SCROLL_FACTOR = 0.0009;
const PREVIEW_SCROLL_STRETCH = 6; // makes preview text require more scroll distance
const PREVIEW_SCROLL_SCALE =
  HERO_PORTION > 0 ? Math.max(((PREVIEW_END - CARD_STAGE_END) / HERO_PORTION) / PREVIEW_SCROLL_STRETCH, 0.0001) : 1;

export default function Home() {
  const [progress, setProgress] = useState(0); // 0 - hero start, 1 - preview finished
  const autoDisabledRef = useRef(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let rafId;
    const tick = () => {
      setProgress((prev) => {
        if (autoDisabledRef.current || prev >= HERO_PORTION) return prev;
        return Math.min(HERO_PORTION, prev + AUTO_SPEED);
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY * SCROLL_FACTOR;
      if (delta < 0) {
        autoDisabledRef.current = true;
      }
      setProgress((prev) => {
        const virtualPrev = expandPreviewProgress(prev);
        const virtualNext = virtualPrev + delta;
        const next = collapsePreviewProgress(virtualNext);
        return clamp(next, 0, MAX_PROGRESS);
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    let rafId;
    const tick = () => {
      setProgress((prev) => {
        if (autoDisabledRef.current || prev < CARD_STAGE_END || prev >= PREVIEW_END) return prev;
        return Math.min(PREVIEW_END, prev + PREVIEW_AUTO_SPEED);
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const backgroundStyles = useMemo(
    () => ({
      backgroundImage: 'url(/img/home/reseller.png)',
    }),
    []
  );

const heroProgress = clamp(progress / HERO_PORTION, 0, 1);
const cardProgress =
  progress <= HERO_PORTION ? 0 : clamp((progress - HERO_PORTION) / (CARD_STAGE_END - HERO_PORTION), 0, 1);
const previewProgress =
  progress <= CARD_STAGE_END ? 0 : clamp((progress - CARD_STAGE_END) / (PREVIEW_END - CARD_STAGE_END), 0, 1);
const adminStageProgress =
  progress <= ADMIN_STAGE_START ? 0 : clamp((progress - ADMIN_STAGE_START) / (ADMIN_STAGE_END - ADMIN_STAGE_START), 0, 1);

const heroLineCharacters = useMemo(() => buildLineCharacters(heroLines, heroProgress), [heroProgress]);
const previewLineCharacters = useMemo(() => buildLineCharacters(previewLines, previewProgress), [previewProgress]);
const heroActiveLine = useMemo(() => activeLineIndex(heroLines, heroProgress), [heroProgress]);
const previewActiveLine = useMemo(() => activeLineIndex(previewLines, previewProgress), [previewProgress]);

const FADE_START = 0.15;
const CARD_ENTRY_START = 0.8;
const heroFadeProgress = cardProgress <= FADE_START ? 0 : (cardProgress - FADE_START) / (1 - FADE_START);
const heroOpacity = 1 - heroFadeProgress;
const heroTranslate = -heroFadeProgress * 12;
const heroBlur = heroFadeProgress * 4;
const cardSlideProgress =
  cardProgress <= CARD_ENTRY_START
    ? 0
    : clamp((cardProgress - CARD_ENTRY_START) / (1 - CARD_ENTRY_START), 0, 1);

  return (
    <div className="relative h-full overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 -z-20 h-full w-full opacity-60"
        style={{ ...backgroundStyles, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/95 backdrop-blur-[12px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-screen [background-image:radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_55%)]" />

      <div className="relative flex h-full items-center justify-center px-2 py-6 sm:px-6 lg:px-12">
        <div className="w-full translate-y-2 sm:translate-y-4 max-w-[min(2000px,92vw)] mx-auto">
         <div className="relative min-h-[36rem] sm:min-h-[70vh] lg:min-h-[82vh]">
           <div
             className="space-y-5 transition duration-500 ease-out"
              style={{
                opacity: heroOpacity,
                transform: `translateY(${heroTranslate}px)`,
                filter: heroBlur ? `blur(${heroBlur}px)` : 'none',
              }}
            >
              <span className="block text-xs uppercase tracking-[0.6em] text-slate-300/80">Hey there</span>
              <div className="min-h-[12rem] space-y-4 text-3xl font-medium leading-tight text-slate-100 sm:text-4xl">
                {heroLines.map((line, idx) => (
                  <span
                    key={`${idx}-${line}`}
                    className={`block ${
                      idx === 1 ? 'text-sky-300' : idx === 2 ? 'text-slate-200/80' : 'text-slate-100'
                    }`}
                  >
                    <LineCharacters chars={heroLineCharacters[idx]} />
                    <Cursor active={heroProgress < 1 && heroActiveLine === idx} />
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center" aria-hidden={cardSlideProgress === 0}>
              <div
                className="flex w-full max-w-[min(1700px,88vw)] flex-col rounded-[32px] border border-white/10 bg-slate-950/95 p-4 sm:p-10 lg:p-14 shadow-[0_70px_240px_rgba(2,6,23,0.78)] transition duration-600 ease-out min-h-[34rem] sm:min-h-[42rem] lg:min-h-[52rem]"
                style={{
                  opacity: cardSlideProgress * (1 - adminStageProgress * 1.1),
                  transform: `translateY(${(1 - cardSlideProgress) * 80}px) translateX(${-adminStageProgress * 140}px) scale(${
                    1 - adminStageProgress * 0.05
                  })`,
                  pointerEvents: cardSlideProgress > 0.05 ? 'auto' : 'none',
                }}
              >
                <div className="relative w-full overflow-hidden rounded-[24px] border border-white/15 bg-slate-900 aspect-[16/9.5] mx-auto">
                  <img
                    src="/img/forum.png"
                    alt="JTech Forums preview"
                    className="h-full w-full object-contain bg-slate-950"
                    style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}
                    loading="lazy"
                  />
                </div>
                <div className="mt-6 space-y-3 text-base font-medium text-slate-100 sm:text-lg">
                  {previewLines.map((line, idx) => (
                    <p
                      key={`${idx}-${line}`}
                      className={`text-slate-200/90 ${previewActiveLine === idx && previewProgress < 1 ? 'text-white' : ''}`}
                      style={{ minHeight: '2.2rem' }}
                    >
                      <LineCharacters chars={previewLineCharacters[idx]} />
                      <Cursor active={previewProgress < 1 && previewActiveLine === idx} className="h-5" />
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center" aria-hidden={adminStageProgress === 0}>
              <div
                className="flex w-full max-w-[min(1500px,86vw)] flex-col gap-8 rounded-[32px] border border-white/10 bg-slate-900/90 p-6 sm:p-10 lg:p-14 shadow-[0_40px_160px_rgba(2,6,23,0.7)] transition duration-700"
                style={{
                  opacity: adminStageProgress,
                  transform: `translateX(${(1 - adminStageProgress) * 180}px)`,
                }}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.65em] text-slate-400">Community</p>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">Meet our admins</h2>
                    <span className="text-sm text-slate-400">Dedicated volunteers keeping things kosher-friendly</span>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {adminProfiles.map((admin) => (
                    <a
                      key={admin.name}
                      href={admin.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur transition hover:border-white/30 hover:bg-slate-900/80"
                    >
                      <div className="mb-5">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                          <img src={admin.avatar} alt={`${admin.handle} avatar`} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-white">{admin.name}</p>
                      <p className="text-sm text-slate-400">{admin.handle}</p>
                      <p className="mt-3 text-sm text-slate-300">{admin.role}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cursor({ active, className = '' }) {
  return (
    <span
      className={`ml-1 inline-block w-[3px] align-middle transition-opacity duration-150 ${
        active ? 'bg-white/90 animate-pulse' : 'bg-transparent'
      } ${className || 'h-7 translate-y-1'}`}
    />
  );
}

function activeLineIndex(lines, ratio) {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const target = Math.max(0, Math.min(totalChars - 1, Math.floor(totalChars * ratio)));
  let cumulative = 0;
  for (let i = 0; i < lines.length; i += 1) {
    cumulative += lines[i].length;
    if (target < cumulative) return i;
  }
  return lines.length - 1;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildLineCharacters(lines, ratio) {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  if (totalChars === 0) return lines.map(() => []);
  const target = totalChars * ratio;
  let offset = 0;
  return lines.map((line) => {
    const chars = [];
    for (let i = 0; i < line.length; i += 1) {
      const position = offset + i;
      const opacity = clamp(target - position, 0, 1);
      if (opacity <= 0) break;
      chars.push({ char: line[i], opacity });
    }
    offset += line.length;
    return chars;
  });
}

function LineCharacters({ chars }) {
  if (!chars || chars.length === 0) {
    return <span className="inline-block opacity-0">&nbsp;</span>;
  }
  return chars.map(({ char, opacity }, idx) => (
    <span
      key={idx}
      className="inline-block transition-all duration-150"
      style={{ opacity, transform: `translateY(${(1 - opacity) * 6}px)` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

const PREVIEW_SECTION_LENGTH = PREVIEW_END - CARD_STAGE_END;
const PREVIEW_EXPANDED_LENGTH =
  PREVIEW_SECTION_LENGTH <= 0 ? 0 : PREVIEW_SECTION_LENGTH / PREVIEW_SCROLL_SCALE;
const PREVIEW_EXTRA_LENGTH = Math.max(PREVIEW_EXPANDED_LENGTH - PREVIEW_SECTION_LENGTH, 0);

function expandPreviewProgress(value) {
  if (value <= CARD_STAGE_END || PREVIEW_SECTION_LENGTH <= 0) return value;
  if (value <= PREVIEW_END) {
    return CARD_STAGE_END + (value - CARD_STAGE_END) / PREVIEW_SCROLL_SCALE;
  }
  return value + PREVIEW_EXTRA_LENGTH;
}

function collapsePreviewProgress(value) {
  if (value <= CARD_STAGE_END || PREVIEW_SECTION_LENGTH <= 0) return value;
  const expandedPreviewEnd = CARD_STAGE_END + PREVIEW_EXPANDED_LENGTH;
  if (value <= expandedPreviewEnd) {
    return CARD_STAGE_END + (value - CARD_STAGE_END) * PREVIEW_SCROLL_SCALE;
  }
  return value - PREVIEW_EXTRA_LENGTH;
}


