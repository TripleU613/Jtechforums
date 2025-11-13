import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchForumApi, getForumWebBase } from '../lib/forumApi';

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

const topCaption = 'How it is all possible';
const bottomCaption = "You're in good hands";

const LEADERBOARD_ID = 6;
const LEADERBOARD_PERIOD = 'monthly';
const LEADERBOARD_LIMIT = 3;
const forumBaseUrl = getForumWebBase();
const cheersFormatter = new Intl.NumberFormat('en-US');
const placementAccentClasses = [
  'border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-amber-300/5 text-amber-100',
  'border-sky-400/40 bg-gradient-to-br from-sky-500/15 to-sky-300/5 text-sky-100',
  'border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-emerald-300/5 text-emerald-100',
];

const HERO_PORTION = 0.6; // 60% of the journey for hero copy
const CARD_STAGE_END = 0.85; // point in the journey when the card is fully in place
const PREVIEW_END = 1; // second screen fully rendered
const ADMIN_PAUSE = 0.15; // dead zone after preview before admin section
const ADMIN_STAGE_LENGTH = 0.6;
const ADMIN_STAGE_START = PREVIEW_END + ADMIN_PAUSE;
const ADMIN_STAGE_END = ADMIN_STAGE_START + ADMIN_STAGE_LENGTH;
const ADMIN_PANEL_ANCHOR = 0.8;
const CAPTION_PAUSE = 0.05;
const CAPTION_STAGE_LENGTH = 0.7;
const CAPTION_STAGE_START = ADMIN_STAGE_END + CAPTION_PAUSE;
const CAPTION_STAGE_END = CAPTION_STAGE_START + CAPTION_STAGE_LENGTH;
const CAPTION_TOP_DURATION = 0.6;
const TEXT_SLOWNESS = 7;
const MAX_PROGRESS = CAPTION_STAGE_END;

const AUTO_SPEED = 0.0008;
const PREVIEW_AUTO_SPEED = 0.0006;
const SCROLL_FACTOR = 0.0009;
const PREVIEW_SCROLL_STRETCH = 6; // makes preview text require more scroll distance
const PAUSE_SCROLL_STRETCH = 4; // makes the between-page pause require extra scrolling
const PREVIEW_SCROLL_SCALE =
  HERO_PORTION > 0 ? Math.max(((PREVIEW_END - CARD_STAGE_END) / HERO_PORTION) / PREVIEW_SCROLL_STRETCH, 0.0001) : 1;

export default function Home() {
  const [progress, setProgress] = useState(0); // 0 - hero start, 1 - preview finished
  const autoDisabledRef = useRef(false);
  const [leaderboardState, setLeaderboardState] = useState({
    entries: [],
    status: 'idle',
    error: '',
  });

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
        const virtualPrev = expandProgressForScroll(prev);
        const virtualNext = virtualPrev + delta;
        const next = collapseProgressForScroll(virtualNext);
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

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const loadLeaderboard = async () => {
      setLeaderboardState((prev) => ({
        ...prev,
        status: 'loading',
        error: '',
      }));

      try {
        const init = { signal: controller.signal };
        const response = await fetchForumApi(
          `/forum/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`,
          init
        );

        if (!response.ok) {
          throw new Error('Leaderboard request failed.');
        }

        const payload = await response.json();
        const entries = normalizeLeaderboardUsers(payload?.users);

        if (!cancelled) {
          setLeaderboardState({
            entries,
            status: 'ready',
            error: '',
          });
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setLeaderboardState({
          entries: [],
          status: 'error',
          error: error?.message || 'Unable to load leaderboard right now.',
        });
      }
    };

    loadLeaderboard();

    return () => {
      cancelled = true;
      controller.abort();
    };
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
const captionStageProgress =
  progress <= CAPTION_STAGE_START ? 0 : clamp((progress - CAPTION_STAGE_START) / (CAPTION_STAGE_END - CAPTION_STAGE_START), 0, 1);

const leaderboardEntries = leaderboardState.entries;
const leaderboardStatus = leaderboardState.status;
const leaderboardError = leaderboardState.error;
const leaderboardLink = `${forumBaseUrl}/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`;

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
const revealPhase = clamp(
  (adminStageProgress - ADMIN_PANEL_ANCHOR) / Math.max(1 - ADMIN_PANEL_ANCHOR, 0.0001),
  0,
  1
);
const textRevealProgress = captionStageProgress;
const slowTypedProgress = Math.pow(textRevealProgress, TEXT_SLOWNESS);
const topCaptionProgress = clamp(
  slowTypedProgress / Math.max(CAPTION_TOP_DURATION, 0.0001),
  0,
  1
);
const bottomCaptionProgress =
  slowTypedProgress <= CAPTION_TOP_DURATION
    ? 0
    : clamp((slowTypedProgress - CAPTION_TOP_DURATION) / (1 - CAPTION_TOP_DURATION), 0, 1);
const adminPanelStyle = {
  opacity: adminStageProgress,
  transform: `translateX(${(1 - adminStageProgress) * 180}px) scale(${0.9 + Math.min(adminStageProgress, ADMIN_PANEL_ANCHOR) * 0.1})`,
  pointerEvents: adminStageProgress > 0.05 ? 'auto' : 'none',
};
const typedTopCaption = typeWriter(topCaption, topCaptionProgress);
const typedBottomCaption = typeWriter(bottomCaption, bottomCaptionProgress);
const topCaptionChars = buildLineCharacters([typedTopCaption], topCaptionProgress)[0];
const bottomCaptionChars = buildLineCharacters([typedBottomCaption], bottomCaptionProgress)[0];

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
                className="pointer-events-none absolute left-1/2 top-[5%] z-10 w-full max-w-[min(1400px,88vw)] -translate-x-1/2 text-center text-2xl uppercase tracking-[0.4em] text-white transition duration-300"
                style={{ opacity: textRevealProgress }}
              >
                <LineCharacters chars={topCaptionChars} />
              </div>
              <div
                className="pointer-events-none absolute left-1/2 bottom-[5%] z-10 w-full max-w-[min(1400px,88vw)] -translate-x-1/2 text-center text-base uppercase tracking-[0.35em] text-slate-100 transition duration-300"
                style={{ opacity: textRevealProgress }}
              >
                <LineCharacters chars={bottomCaptionChars} />
              </div>
              <div
                className="flex w-full max-w-[min(1500px,86vw)] flex-col gap-6 rounded-[32px] border border-white/10 bg-slate-900/90 p-5 sm:p-9 lg:p-12 shadow-[0_40px_160px_rgba(2,6,23,0.7)] transition duration-700"
                style={adminPanelStyle}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
                  <section className="flex-1 rounded-[28px] border border-white/10 bg-slate-950/85 p-5 sm:p-6">
                    <div className="mb-4 space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Admins</p>
                      <p className="text-sm text-slate-400">Forum shepherds who moderate threads, guides, and submissions daily.</p>
                    </div>
                    <div className="flex flex-col divide-y divide-white/5 border-t border-white/10 pt-2">
                      {adminProfiles.map((admin, index) => {
                        const reveal = staggerReveal(revealPhase, index, adminProfiles.length);
                        return (
                          <a
                            key={admin.name}
                            href={admin.profileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-4 py-4 transition hover:text-white ${index === 0 ? 'pt-1' : ''}`}
                            style={{
                              opacity: reveal,
                              transform: `translateY(${(1 - reveal) * 18}px)`,
                              pointerEvents: reveal > 0.2 ? 'auto' : 'none',
                            }}
                          >
                            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10">
                              <img src={admin.avatar} alt={`${admin.handle} avatar`} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">{admin.name}</p>
                              <p className="text-[11px] text-slate-400">{admin.handle}</p>
                              <p className="mt-1.5 text-xs text-slate-300">{admin.role}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </section>

                  <section className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 p-5 sm:p-6 lg:max-w-sm">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-slate-400">
                      <span>Leaderboard</span>
                      <a
                        href={leaderboardLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/20 px-3 py-1 text-[10px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
                      >
                        View
                      </a>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Top cheers this month from the JTech Champions board.</p>
                    <div className="mt-4 flex flex-col gap-2">
                      {leaderboardStatus === 'loading' &&
                        Array.from({ length: LEADERBOARD_LIMIT }).map((_, index) => (
                          <div
                            key={`leaderboard-skeleton-${index}`}
                            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3"
                          >
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
                            <div className="flex flex-1 flex-col gap-1">
                              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                              <div className="h-2.5 w-36 animate-pulse rounded bg-white/5" />
                            </div>
                          </div>
                        ))}
                      {leaderboardStatus === 'error' && (
                        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100">
                          {leaderboardError || 'Unable to load the leaderboard right now.'}
                        </p>
                      )}
                      {leaderboardEntries.map((entry, index) => {
                        const reveal = staggerReveal(revealPhase, index, leaderboardEntries.length || LEADERBOARD_LIMIT);
                        return (
                          <a
                            key={entry.id || entry.username || index}
                            href={entry.profileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 p-3 transition hover:border-white/30 hover:bg-slate-900/80"
                            style={{
                              opacity: reveal,
                              transform: `translateY(${(1 - reveal) * 18}px)`,
                              pointerEvents: reveal > 0.2 ? 'auto' : 'none',
                            }}
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-semibold uppercase tracking-[0.3em] ${getPlacementBadgeClass(
                                index
                              )}`}
                            >
                              #{entry.position}
                            </div>
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
                                <img src={entry.avatar} alt={`${entry.username} avatar`} className="h-full w-full object-cover" loading="lazy" />
                              </div>
                              <div className="min-w-0 text-xs">
                                <p className="truncate font-semibold text-white">@{entry.username}</p>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                                  Cheers • {cheersFormatter.format(entry.cheers)}
                                </p>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                      {leaderboardStatus === 'ready' && leaderboardEntries.length === 0 && (
                        <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                          Nobody has logged cheers yet—check back soon!
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeLeaderboardUsers(users) {
  if (!Array.isArray(users)) return [];

  return users
    .filter(Boolean)
    .slice(0, LEADERBOARD_LIMIT)
    .map((user, index) => {
      const username = user.username || `member-${index + 1}`;
      const cheers = Number(user.total_score);
      return {
        id: user.id ?? `${username}-${index}`,
        username,
        position: user.position || index + 1,
        cheers: Number.isFinite(cheers) ? cheers : 0,
        avatar: buildAvatarUrl(user.avatar_template),
        profileUrl: buildProfileUrl(username),
      };
    });
}

function buildProfileUrl(username = '') {
  if (!username) return forumBaseUrl;
  return `${forumBaseUrl}/u/${encodeURIComponent(username)}`;
}

function buildAvatarUrl(template = '', size = 160) {
  if (!template) {
    return `${forumBaseUrl}/letter_avatar_proxy/v4/letter/j/ce7236/${size}.png`;
  }
  const resolved = template.replace('{size}', size);
  if (/^https?:\/\//i.test(resolved)) {
    return resolved;
  }
  return `${forumBaseUrl}${resolved}`;
}

function getPlacementBadgeClass(index = 0) {
  return placementAccentClasses[index] || 'border-white/15 bg-white/5 text-white';
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

function staggerReveal(progress, index, total) {
  if (total <= 0) return progress;
  const perItem = 1 / total;
  return clamp((progress - perItem * index) / perItem, 0, 1);
}

function typeWriter(text, progress) {
  if (progress <= 0) return '';
  const length = Math.floor(text.length * clamp(progress, 0, 1));
  return text.slice(0, Math.min(length, text.length));
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

const PAUSE_SECTION_LENGTH = ADMIN_STAGE_START - PREVIEW_END;
const PAUSE_EXPANDED_LENGTH = PAUSE_SECTION_LENGTH <= 0 ? 0 : PAUSE_SECTION_LENGTH * PAUSE_SCROLL_STRETCH;
const PAUSE_EXTRA_LENGTH = Math.max(PAUSE_EXPANDED_LENGTH - PAUSE_SECTION_LENGTH, 0);

const EXPANDED_PREVIEW_END = CARD_STAGE_END + PREVIEW_EXPANDED_LENGTH;
const EXPANDED_PAUSE_END = EXPANDED_PREVIEW_END + PAUSE_EXPANDED_LENGTH;

function expandProgressForScroll(value) {
  if (value <= CARD_STAGE_END) return value;
  let expanded = value;
  if (value <= PREVIEW_END && PREVIEW_SECTION_LENGTH > 0) {
    expanded = CARD_STAGE_END + (value - CARD_STAGE_END) / PREVIEW_SCROLL_SCALE;
  } else if (value <= ADMIN_STAGE_START && PAUSE_SECTION_LENGTH > 0) {
    expanded = EXPANDED_PREVIEW_END + (value - PREVIEW_END) * PAUSE_SCROLL_STRETCH;
  } else {
    expanded = value + PREVIEW_EXTRA_LENGTH + PAUSE_EXTRA_LENGTH;
  }
  return expanded;
}

function collapseProgressForScroll(value) {
  if (value <= CARD_STAGE_END) return value;
  let collapsed = value;
  if (value <= EXPANDED_PREVIEW_END && PREVIEW_SECTION_LENGTH > 0) {
    collapsed = CARD_STAGE_END + (value - CARD_STAGE_END) * PREVIEW_SCROLL_SCALE;
  } else if (value <= EXPANDED_PAUSE_END && PAUSE_SECTION_LENGTH > 0) {
    collapsed = PREVIEW_END + (value - EXPANDED_PREVIEW_END) / PAUSE_SCROLL_STRETCH;
  } else {
    collapsed = value - (PREVIEW_EXTRA_LENGTH + PAUSE_EXTRA_LENGTH);
  }
  return collapsed;
}


