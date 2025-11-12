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

const HERO_PORTION = 0.6; // 60% of the journey for hero copy, rest for preview card.
const AUTO_SPEED = 0.0008;
const SCROLL_FACTOR = 0.0009;

export default function Home() {
  const [progress, setProgress] = useState(0); // 0 → hero start, 1 → preview finished
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
      setProgress((prev) => Math.min(1, Math.max(0, prev + delta)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const backgroundStyles = useMemo(
    () => ({
      backgroundImage: 'url(/img/home/reseller.png)',
    }),
    []
  );

const heroProgress = clamp(progress / HERO_PORTION, 0, 1);
const previewProgress = progress <= HERO_PORTION ? 0 : clamp((progress - HERO_PORTION) / (1 - HERO_PORTION), 0, 1);

const heroRender = useMemo(() => sliceLines(heroLines, heroProgress), [heroProgress]);
const previewRender = useMemo(() => sliceLines(previewLines, previewProgress), [previewProgress]);
const heroActiveLine = useMemo(() => activeLineIndex(heroLines, heroProgress), [heroProgress]);
const previewActiveLine = useMemo(() => activeLineIndex(previewLines, previewProgress), [previewProgress]);

const FADE_START = 0.15;
const CARD_ENTRY_START = 0.8;
const heroFadeProgress = previewProgress <= FADE_START ? 0 : (previewProgress - FADE_START) / (1 - FADE_START);
const heroOpacity = 1 - heroFadeProgress;
const heroTranslate = -heroFadeProgress * 12;
const heroBlur = heroFadeProgress * 4;
const cardSlideProgress =
  heroFadeProgress <= CARD_ENTRY_START
    ? 0
    : clamp((heroFadeProgress - CARD_ENTRY_START) / (1 - CARD_ENTRY_START), 0, 1);

  return (
    <div className="relative h-full overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 -z-20 h-full w-full opacity-60"
        style={{ ...backgroundStyles, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/95 backdrop-blur-[12px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-screen [background-image:radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_55%)]" />

      <div className="relative flex h-full items-center justify-center px-6 py-8 sm:px-10">
        <div className="w-full max-w-5xl translate-y-8 sm:translate-y-16">
         <div className="relative min-h-[32rem]">
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
                    {heroRender[idx] || '\u00A0'}
                    <Cursor active={heroProgress < 1 && heroActiveLine === idx} />
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden={cardSlideProgress === 0}>
              <div
                className="flex w-full flex-col rounded-[28px] border border-white/10 bg-slate-950/90 p-10 shadow-2xl backdrop-blur transition duration-600 ease-out"
                style={{
                  opacity: cardSlideProgress,
                  transform: `translateX(${(1 - cardSlideProgress) * 90}px)`,
                  pointerEvents: cardSlideProgress > 0.05 ? 'auto' : 'none',
                }}
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900 aspect-[21/9]">
                  <img
                    src="/img/forum.png"
                    alt="JTech Forums preview"
                    className="h-full w-full rounded-xl object-cover"
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
                      {previewRender[idx] || '\u00A0'}
                      <Cursor active={previewProgress < 1 && previewActiveLine === idx} className="h-5" />
                    </p>
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

function sliceLines(lines, ratio) {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const target = Math.round(totalChars * ratio);
  let remaining = target;
  return lines.map((line) => {
    if (remaining <= 0) return '';
    const length = Math.min(line.length, remaining);
    remaining -= length;
    return line.slice(0, length);
  });
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
