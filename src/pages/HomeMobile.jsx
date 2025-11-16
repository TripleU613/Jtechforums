import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Footer from '../components/Footer';
import { fetchForumApi, getForumWebBase } from '../lib/forumApi';
import { firestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import faqEntries from '../data/faqEntries';

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

const sectionContainer = 'mx-auto w-full max-w-2xl px-4 sm:px-6';
const TERMINAL_SCROLL_STEP = 0.0009;
const TERMINAL_TOUCH_STEP = 0.002;

const terminalEntries = [
  {
    command: 'whoami',
    output: ['=> Community member. Here because something on your phone went boom.'],
  },
  {
    command: 'hostname',
    output: ['=> forums.jtechforums.org'],
  },
  {
    command: 'uname -a',
    output: ['=> Linux JTech-Server #1 running stable since the last “how do I block WhatsApp Status?” post.'],
  },
  {
    command: 'id',
    output: ['=> uid=1000(you) groups=android_linux,windows,mac,panic-posters'],
  },
  {
    command: 'df -h',
    output: ['=> 87% space used by screenshots people uploaded instead of describing the situation.'],
  },
  {
    command: 'faq --question="Is everything kosher here?"',
    output: [
      '=> Yes. Strict content standards. No inappropriate links.',
      '   This forum is built for families — and indexed by Google.',
      '   Keep it clean.',
    ],
  },
  {
    command: 'faq --question="Can I post any random files?"',
    output: [
      '=> No Google Drive dumps.',
      '   No mystery APKs.',
      '   Only trusted, safe sources allowed.',
    ],
  },
  {
    command: 'grep -R "MDM" ./Hacking',
    output: ['=> Found: download and install guides, fix guides, and “pls help my kid found Developer Options”.'],
  },
  {
    command: 'top -b -n1 | head',
    output: [
      '=> PID   TASK         CPU   DESCRIPTION',
      '=> 101   mods          98%   deleting nonsense',
      '=> 203   helpers       75%   answering same question for 12th time',
      '=> 404   panicd        60%   “I factory reset and now nothing works plz help”',
    ],
  },
  {
    command: 'sudo -l',
    output: ['=> Sorry, you don’t have moderator permissions. Nice try though.'],
  },
  {
    command: 'dmesg | tail',
    output: [
      '=> ALERT: new thread detected about FIG phones being “hacked”',
      '=> RESPONSE: highly unlikely. They’re not magic, relax.',
    ],
  },
  {
    command: 'stat ~/first_post.txt',
    output: ['=> size: 0 bytes', '=> meaning: please include details when asking for help.'],
  },
  {
    command: 'join --mode=ask',
    output: [
      '=> Provide device, model, clear issue, and what you tried.',
      '   The more info you give, the faster you’ll get helped.',
    ],
  },
  {
    command: 'exit',
    output: [
      '=> JTech Forums — keeping your tech smooth, your devices kosher,',
      '   and your sanity intact.',
    ],
  },
];

const feedbackShowcase = [
  {
    id: 'fb-1',
    name: 'Sara K.',
    handle: '@kosherandroid',
    context: 'Galaxy A14 + TAG Guardian',
    quote: '“The apps section walked me through every step. My phone is locked down, but still useful.”',
    fromFirestore: false,
  },
  {
    id: 'fb-2',
    name: 'Eli D.',
    handle: '@flipguy',
    context: 'Nokia 2780 & Kosher config',
    quote: '“Every time I break something, the forum already has the answer. Huge time saver.”',
    fromFirestore: false,
  },
  {
    id: 'fb-3',
    name: 'Malky R.',
    handle: '@techmom',
    context: 'Moto G Pure for the family',
    quote: '“Needed a safe phone setup for our teens. The guidance here kept it calm, kosher, and doable.”',
    fromFirestore: false,
  },
];

const LEADERBOARD_ID = 6;
const LEADERBOARD_PERIOD = 'monthly';
const LEADERBOARD_LIMIT = 3;
const forumBaseUrl = getForumWebBase();
const cheersFormatter = new Intl.NumberFormat('en-US');

const MAX_FEEDBACK_NAME = 32;
const MIN_FEEDBACK_LENGTH = 20;
const SUPPRESSED_FEEDBACK_MESSAGES = ['Missing or insufficient permissions', 'We could not save that just yet'];

export default function HomeMobile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isAdmin = Boolean(profile?.isAdmin);
  const [leaderboardState, setLeaderboardState] = useState({ entries: [], status: 'idle', error: '' });
  const [feedbackEntries, setFeedbackEntries] = useState(feedbackShowcase);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', context: '', quote: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const initialFaqCount = Math.min(faqEntries.length, 3);
  const [visibleFaqIndices, setVisibleFaqIndices] = useState(() =>
    Array.from({ length: initialFaqCount }, (_, index) => index)
  );
  const [nextFaqIndex, setNextFaqIndex] = useState(initialFaqCount);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [terminalProgress, setTerminalProgress] = useState(0);
  const terminalTouchRef = useRef({ active: false, lastY: 0 });

  useEffect(() => {
    const controller = new AbortController();
    const loadLeaderboard = async () => {
      setLeaderboardState((prev) => ({ ...prev, status: 'loading', error: '' }));
      try {
        const response = await fetchForumApi(
          `/forum/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Leaderboard request failed.');
        const payload = await response.json();
        const entries = normalizeLeaderboardUsers(payload?.users);
        setLeaderboardState({ entries, status: 'ready', error: '' });
      } catch (error) {
        if (controller.signal.aborted) return;
        setLeaderboardState({ entries: [], status: 'error', error: error?.message || 'Unable to load leaderboard.' });
      }
    };
    loadLeaderboard();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const feedbackRef = collection(firestore, 'feedback');
    const feedbackQuery = query(feedbackRef, orderBy('createdAt', 'desc'), limit(6));
    setFeedbackStatus('loading');
    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setFeedbackEntries(feedbackShowcase);
          setFeedbackStatus('empty');
          return;
        }
        const docs = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() || {};
          return {
            id: docSnap.id,
            name: data.authorDisplayName || data.authorName || 'Forum member',
            handle: data.authorHandle || '@community',
            context: data.context || 'Shared setup',
            quote: data.quote || '',
            fromFirestore: true,
          };
        });
        setFeedbackEntries(docs);
        setFeedbackStatus('ready');
      },
      (error) => {
        setFeedbackEntries(feedbackShowcase);
        setFeedbackStatus('error');
        setFeedbackMessage(error?.message || 'Unable to load feedback right now.');
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleOpenFeedback = () => {
      setFeedbackModalOpen(true);
    };
    window.addEventListener('openFeedbackModal', handleOpenFeedback);
    return () => window.removeEventListener('openFeedbackModal', handleOpenFeedback);
  }, []);

  const handleFeedbackInput = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'name' ? value.slice(0, MAX_FEEDBACK_NAME) : value;
    setFeedbackForm((prev) => ({ ...prev, [name]: nextValue }));
    setFeedbackMessage('');
  };

  const handleFeedbackSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!user) {
        setFeedbackMessage('Sign in first so we can link your feedback to the right account.');
        return;
      }
      const nameValue = feedbackForm.name.trim().slice(0, MAX_FEEDBACK_NAME);
      const quoteValue = feedbackForm.quote.trim();
      const contextValue = feedbackForm.context.trim();
      if (!nameValue) {
        setFeedbackMessage('Add the name you want other members to see.');
        return;
      }
      if (quoteValue.length < MIN_FEEDBACK_LENGTH) {
        setFeedbackMessage('Share a short quote before submitting.');
        return;
      }
      setFeedbackSubmitting(true);
      setFeedbackMessage('');
      try {
        await addDoc(collection(firestore, 'feedback'), {
          uid: user.uid,
          authorName: user.displayName || user.email?.split('@')[0] || 'Forum member',
          authorDisplayName: nameValue || user.displayName || user.email?.split('@')[0] || 'Forum member',
          authorHandle: user.email ? `@${user.email.split('@')[0]}` : `@${user.uid.slice(0, 6)}`,
          context: contextValue || 'Custom setup',
          quote: quoteValue,
          createdAt: serverTimestamp(),
        });
        setFeedbackForm({ name: '', context: '', quote: '' });
        setFeedbackMessage('Submitted! A moderator will publish it shortly.');
        setFeedbackModalOpen(false);
      } catch (error) {
        setFeedbackMessage(error?.message || 'Unable to submit feedback right now.');
      } finally {
        setFeedbackSubmitting(false);
      }
    },
    [feedbackForm, user]
  );

  const handleFeedbackCta = useCallback(() => {
    if (user) {
      setFeedbackModalOpen(true);
      return;
    }
    navigate('/signin');
  }, [user, navigate]);

  const incrementTerminalProgress = useCallback((delta) => {
    setTerminalProgress((prev) => clamp(prev + delta, 0, 1));
  }, []);

  const toggleFaq = useCallback(
    (clickedIndex) => {
      if (!faqEntries.length) return;
      const isClosing = activeFaqIndex === clickedIndex;
      const previouslyActive = activeFaqIndex;

      setActiveFaqIndex(isClosing ? null : clickedIndex);

      if (previouslyActive !== null && !isClosing) {
        setVisibleFaqIndices((current) => {
          const newIndices = [...current];
          const indexToReplace = newIndices.indexOf(previouslyActive);

          if (indexToReplace !== -1) {
            let nextIndexToInsert = faqEntries.length ? nextFaqIndex % faqEntries.length : 0;
            const otherVisible = newIndices.filter((value) => value !== previouslyActive);
            let guard = 0;
            while (faqEntries.length && otherVisible.includes(nextIndexToInsert) && guard < faqEntries.length) {
              nextIndexToInsert = (nextIndexToInsert + 1) % faqEntries.length;
              guard += 1;
            }

            if (faqEntries.length) {
              newIndices[indexToReplace] = nextIndexToInsert;
              setNextFaqIndex((nextIndexToInsert + 1) % faqEntries.length);
            }
            return newIndices;
          }
          return current;
        });
      }
    },
    [activeFaqIndex, nextFaqIndex]
  );

  const handleDeleteFeedback = useCallback(
    async (entryId) => {
      if (!entryId || !isAdmin) return;
      try {
        await deleteDoc(doc(firestore, 'feedback', entryId));
        setFeedbackEntries((prev) => prev.filter((entry) => entry.id !== entryId));
        setFeedbackMessage('Feedback removed.');
      } catch (error) {
        setFeedbackMessage(error?.message || 'Unable to remove feedback right now.');
      }
    },
    [isAdmin]
  );

  const renderFeedbackCard = useCallback(
    (entry) => {
      if (!entry) return null;
      const canRemove = Boolean(isAdmin && entry.fromFirestore && entry.id);
      return (
        <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="truncate">{entry.context || 'Shared setup'}</span>
            {canRemove && (
              <button type="button" onClick={() => handleDeleteFeedback(entry.id)} className="text-rose-200">
                Remove
              </button>
            )}
          </div>
          <p className="mt-3 flex-1 text-base text-slate-100">{entry.quote || 'Shared by the community.'}</p>
          <p className="mt-4 text-sm font-semibold">
            {entry.name || 'Forum member'}{' '}
            {entry.handle && <span className="text-xs text-slate-400">{entry.handle}</span>}
          </p>
        </article>
      );
    },
    [handleDeleteFeedback, isAdmin]
  );

  const handleTerminalWheel = useCallback(
    (event) => {
      const deltaY = event.deltaY;
      if ((terminalProgress <= 0 && deltaY < 0) || (terminalProgress >= 1 && deltaY > 0)) {
        return;
      }
      event.preventDefault();
      const clampedDelta = clamp(deltaY, -80, 80) * TERMINAL_SCROLL_STEP;
      incrementTerminalProgress(clampedDelta);
    },
    [incrementTerminalProgress, terminalProgress]
  );

  const handleTerminalTouchStart = useCallback((event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    terminalTouchRef.current = { active: true, lastY: touch.clientY };
  }, []);

  const handleTerminalTouchMove = useCallback(
    (event) => {
      const touch = event.touches?.[0];
      if (!touch || !terminalTouchRef.current.active) return;
      const delta = terminalTouchRef.current.lastY - touch.clientY;
      terminalTouchRef.current.lastY = touch.clientY;
      if ((terminalProgress <= 0 && delta < 0) || (terminalProgress >= 1 && delta > 0)) {
        terminalTouchRef.current.active = terminalProgress < 1;
        return;
      }
      event.preventDefault();
      const limitedDelta = clamp(delta, -80, 80);
      incrementTerminalProgress(limitedDelta * TERMINAL_TOUCH_STEP);
    },
    [incrementTerminalProgress, terminalProgress]
  );

  const handleTerminalTouchEnd = useCallback(() => {
    terminalTouchRef.current.active = false;
  }, []);

  const feedbackList = useMemo(() => {
    if (Array.isArray(feedbackEntries) && feedbackEntries.length > 0) {
      return feedbackEntries;
    }
    return feedbackShowcase;
  }, [feedbackEntries]);
  const feedbackLoopEntries = useMemo(
    () => (feedbackList.length > 0 ? [...feedbackList, ...feedbackList] : []),
    [feedbackList]
  );
  const feedbackCarouselDuration = feedbackList.length > 0 ? Math.max(feedbackList.length * 6, 24) : 24;
  const leaderboardEntries = leaderboardState.entries;
  const leaderboardStatus = leaderboardState.status;
  const leaderboardLink = `${forumBaseUrl}/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`;
  const feedbackCtaLabel = user ? 'Share your feedback' : 'Log in to share feedback';
  const visibleFeedbackMessage =
    feedbackMessage && !SUPPRESSED_FEEDBACK_MESSAGES.some((phrase) => feedbackMessage?.includes(phrase))
      ? feedbackMessage
      : '';
  const feedbackStatusMessage = (() => {
    if (feedbackStatus === 'loading') return 'Syncing the latest shout-outs...';
    if (feedbackStatus === 'ready') return 'Updated whenever someone shares a win or fix.';
    if (feedbackStatus === 'empty') return 'Be the first to leave a note for the next member.';
    if (feedbackStatus === 'error' && !visibleFeedbackMessage) return 'Forum stories are offline right now.';
    return '';
  })();
  const visibleFaqCards = useMemo(() => {
    if (!faqEntries.length || visibleFaqIndices.length === 0) return [];
    return visibleFaqIndices.map((index) => {
      const normalizedIndex = ((index % faqEntries.length) + faqEntries.length) % faqEntries.length;
      return { index: normalizedIndex, ...faqEntries[normalizedIndex] };
    });
  }, [visibleFaqIndices]);
  const terminalTypingState = useMemo(
    () => buildTerminalTypingState(terminalEntries, terminalProgress),
    [terminalProgress]
  );
  const terminalComplete = terminalProgress >= 0.999;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className={`${sectionContainer} py-12 text-center`}>
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Hey there</p>
        <h1 className="mx-auto mt-4 max-w-md text-3xl font-semibold leading-snug text-white sm:text-4xl">{heroLines[0]}</h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-slate-200 sm:text-xl">{heroLines[1]}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400 sm:text-base">{heroLines[2]}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://forums.jtechforums.org"
            target="_blank"
            rel="noopener"
            className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto sm:px-6 sm:text-base"
          >
            Join the forum
          </a>
          <a
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60 sm:w-auto sm:px-6 sm:text-base"
          >
            Talk with the team
          </a>
        </div>
      </section>

      <section className={`${sectionContainer} pb-8`}>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div className="space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
              <img
                src="/img/forum.png"
                alt="JTech Forums preview"
                className="h-48 w-full object-cover sm:h-64"
              />
            </div>
            {previewLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionContainer} space-y-6 py-6`}>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Admins</span>
            <span className="text-slate-300">Daily coverage</span>
          </div>
          <div className="mt-6 space-y-4">
            {adminProfiles.map((admin) => (
              <a
                key={admin.name}
                href={admin.profileUrl}
                target="_blank"
                rel="noopener"
                className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3 transition hover:border-sky-400 hover:bg-slate-900/70"
              >
                <img src={admin.avatar} alt={`${admin.handle} avatar`} className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">{admin.name}</p>
                  <p className="text-xs text-slate-400">{admin.handle}</p>
                  <p className="text-xs text-slate-300">{admin.role}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Leaderboard</span>
            <a
              href={leaderboardLink}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              View
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">Top cheers this month from the JTech Champions board.</p>
          <div className="mt-4 space-y-3">
            {leaderboardStatus === 'loading' &&
              Array.from({ length: LEADERBOARD_LIMIT }).map((_, index) => (
                <div key={`skeleton-${index}`} className="h-16 rounded-2xl bg-slate-800/60" />
              ))}
            {leaderboardStatus === 'ready' &&
              leaderboardEntries.map((entry, index) => (
                <a
                  key={entry.id}
                  href={entry.profileUrl}
                  target="_blank"
                  rel="noopener"
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                    getPlacementBadgeClass(index)
                  }`}
                >
                  <img src={entry.avatar} alt={entry.username} className="h-10 w-10 rounded-2xl object-cover" />
                  <div>
                    <p className="font-semibold text-white">@{entry.username}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200">
                      Cheers {cheersFormatter.format(entry.cheers)}
                    </p>
                  </div>
                </a>
              ))}
            {leaderboardStatus === 'ready' && leaderboardEntries.length === 0 && (
              <p className="text-sm text-slate-400">Nobody has logged cheers yet -- check back soon.</p>
            )}
            {leaderboardStatus === 'error' && (
              <p className="text-sm text-rose-200">{leaderboardState.error || 'Leaderboard is offline right now.'}</p>
            )}
          </div>
        </div>
      </section>

      <section className={`${sectionContainer} py-6`}>
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Terminal view</p>
          </div>
          <div
            className="mt-6 rounded-3xl border border-white/15 bg-[#050914]/90 shadow-[0_25px_70px_rgba(2,6,23,0.45)]"
            onWheel={handleTerminalWheel}
            onTouchStart={handleTerminalTouchStart}
            onTouchMove={handleTerminalTouchMove}
            onTouchEnd={handleTerminalTouchEnd}
            onTouchCancel={handleTerminalTouchEnd}
            style={{ touchAction: terminalProgress < 1 ? 'none' : 'pan-y' }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-400/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-400/80"></span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">jtech terminal</p>
              <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                cli
              </span>
            </div>
            <div className="relative h-[360px] overflow-hidden px-4 py-5 font-mono text-xs text-slate-200 sm:text-sm">
              <div role="log" aria-live="polite">
                {terminalTypingState.map((entry, entryIndex) => {
                  const baseEntry = terminalEntries[entryIndex];
                  return (
                    <div key={`${baseEntry?.command || 'terminal'}-${entryIndex}`} className="pb-4 last:pb-0">
                      <p className="text-sky-300">
                        <span className="text-white/70">jtech@forums:~$</span>{' '}
                        <LineCharacters chars={entry.command} />
                      </p>
                      {entry.outputs.map((line, lineIndex) => (
                        <p key={`${entryIndex}-${lineIndex}`} className="mt-1 text-white/80">
                          <LineCharacters chars={line} />
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
              {!terminalComplete && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050914] to-transparent" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionContainer} py-6`}>
        <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Community stories</p>
              <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">Real feedback from JTech members</h2>
            </div>
            <button
              type="button"
              onClick={handleFeedbackCta}
              className="w-full rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/50 sm:w-auto"
            >
              {feedbackCtaLabel}
            </button>
          </div>
          {feedbackStatusMessage && (
            <p className="text-xs text-slate-400" aria-live="polite">
              {feedbackStatusMessage}
            </p>
          )}
          {visibleFeedbackMessage && (
            <p className="text-sm text-slate-300" aria-live="polite">
              {visibleFeedbackMessage}
            </p>
          )}
          {feedbackLoopEntries.length > 0 ? (
            <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:h-[420px] sm:p-5">
              <MotionConfig reducedMotion="never">
                <motion.div
                  className="flex flex-col gap-4"
                  animate={{ y: ['0%', '-50%'] }}
                  transition={{
                    duration: feedbackCarouselDuration,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                  }}
                  aria-live="polite"
                >
                  {feedbackLoopEntries.map((entry, loopIndex) => (
                    <div key={`${entry?.id || entry?.name || 'feedback'}-${loopIndex}`} className="w-full">
                      {renderFeedbackCard(entry)}
                    </div>
                  ))}
                </motion.div>
              </MotionConfig>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/50 p-6 text-center text-sm text-slate-300">
              Nobody has posted feedback yet -- share the first win.
            </div>
          )}
        </div>
      </section>

      <section className={`${sectionContainer} py-6`}>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">FAQ</p>
              <h2 className="text-2xl font-semibold leading-snug text-white">Quick answers</h2>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200">
              Rotating Q&amp;A
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {visibleFaqCards.length === 0 ? (
              <p className="text-sm text-slate-400">More answers are loading shortly.</p>
            ) : (
              visibleFaqCards.map(({ index, question, answer }) => {
                const isOpen = activeFaqIndex === index;
                return (
                  <article
                    key={`${question}-${index}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 shadow-[0_20px_50px_rgba(2,6,23,0.4)]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <span className="text-sm font-semibold text-white">{question}</span>
                      {faqToggleIcon(isOpen)}
                    </button>
                    {isOpen && <p className="mt-3 text-sm text-slate-300">{answer}</p>}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className={`${sectionContainer} pb-10`}>
        <Footer />
      </section>

      {user && isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.7)]">
            <button
              type="button"
              aria-label="Close feedback modal"
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute right-4 top-4 text-sm text-slate-400 transition hover:text-white"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-white">Share your feedback</h3>
            <p className="mt-1 text-xs text-slate-400">Tell us how the forum or apps helped your kosher setup.</p>
            <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label htmlFor="name-modal" className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Display name
                </label>
                <input
                  id="name-modal"
                  name="name"
                  type="text"
                  value={feedbackForm.name}
                  onChange={handleFeedbackInput}
                  placeholder="ex. Usher W."
                  maxLength={MAX_FEEDBACK_NAME}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white outline-none transition focus:border-white/40"
                />
              </div>
              <div>
                <label htmlFor="context-modal" className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Setup context
                </label>
                <input
                  id="context-modal"
                  name="context"
                  type="text"
                  value={feedbackForm.context}
                  onChange={handleFeedbackInput}
                  placeholder="ex. Pixel 8a + TAG Guardian"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white outline-none transition focus:border-white/40"
                />
              </div>
              <div>
                <label htmlFor="quote-modal" className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Feedback
                </label>
                <textarea
                  id="quote-modal"
                  name="quote"
                  rows={4}
                  value={feedbackForm.quote}
                  onChange={handleFeedbackInput}
                  placeholder="Share the story (at least 20 characters)…"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
                />
              </div>
              <div className="space-y-2 text-center">
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                >
                  {feedbackSubmitting ? 'Sending…' : 'Submit feedback'}
                </button>
                {visibleFeedbackMessage && <p className="text-xs text-slate-300">{visibleFeedbackMessage}</p>}
              </div>
            </form>
          </div>
        </div>
      )}
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
  const placementAccentClasses = [
    'border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-amber-300/5 text-amber-100',
    'border-sky-400/40 bg-gradient-to-br from-sky-500/15 to-sky-300/5 text-sky-100',
    'border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-emerald-300/5 text-emerald-100',
  ];
  return placementAccentClasses[index] || 'border-white/15 bg-white/5 text-white';
}

function faqToggleIcon(open = false) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white transition ${
        open ? 'rotate-45 border-sky-400 text-sky-300' : 'bg-white/5 text-white/80'
      }`}
    >
      <i className="fa-solid fa-plus text-[13px]"></i>
    </span>
  );
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

function buildTerminalTypingState(entries, ratio = 0) {
  const safeRatio = clamp(ratio, 0, 1);
  const descriptors = [];
  let totalChars = 0;

  entries.forEach((entry, entryIndex) => {
    const commandText = entry.command || '';
    descriptors.push({ entryIndex, type: 'command', text: commandText });
    totalChars += commandText.length;
    entry.output.forEach((line, lineIndex) => {
      const lineText = line || '';
      descriptors.push({ entryIndex, type: 'output', lineIndex, text: lineText });
      totalChars += lineText.length;
    });
  });

  const baseState = entries.map((entry) => ({
    command: [],
    outputs: entry.output.map(() => []),
  }));

  if (totalChars === 0 || safeRatio <= 0) {
    return baseState;
  }

  let remaining = Math.floor(totalChars * safeRatio);

  descriptors.forEach((item) => {
    if (remaining <= 0) return;
    if (item.type === 'command') {
      const take = Math.min(item.text.length, remaining);
      baseState[item.entryIndex].command = buildSolidCharacters(item.text, take);
      remaining -= take;
      return;
    }

    const take = Math.min(item.text.length, remaining);
    const chars = buildSolidCharacters(item.text, take);
    if (typeof item.lineIndex === 'number') {
      baseState[item.entryIndex].outputs[item.lineIndex] = chars;
    }
    remaining -= take;
  });

  return baseState;
}

function buildSolidCharacters(text = '', length) {
  if (!text || length <= 0) return [];
  return text
    .slice(0, length)
    .split('')
    .map((char) => ({ char, opacity: 1 }));
}

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}


