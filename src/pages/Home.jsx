import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Footer from '../components/Footer';
import { fetchForumApi, getForumWebBase } from '../lib/forumApi';
import { firestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

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
const cardTopCaption = 'Take a look, here me out';
const cardBottomCaption = 'So you get it?';

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
const HERO_TO_CARD_PAUSE = 0.04;
const CARD_TO_PREVIEW_PAUSE = 0.04;
const CARD_STAGE_LENGTH = 0.25; // duration of the card animation itself
const PREVIEW_STAGE_LENGTH = 0.15; // duration of the preview copy animation
const CARD_STAGE_START = HERO_PORTION + HERO_TO_CARD_PAUSE;
const CARD_STAGE_END = CARD_STAGE_START + CARD_STAGE_LENGTH; // point when the card is fully in place
const PREVIEW_STAGE_START = CARD_STAGE_END + CARD_TO_PREVIEW_PAUSE;
const PREVIEW_END = PREVIEW_STAGE_START + PREVIEW_STAGE_LENGTH; // second screen fully rendered
const ADMIN_PAUSE = 0.15; // dead zone after preview before admin section
const ADMIN_STAGE_LENGTH = 0.6;
const ADMIN_STAGE_START = PREVIEW_END + ADMIN_PAUSE;
const ADMIN_STAGE_END = ADMIN_STAGE_START + ADMIN_STAGE_LENGTH;
const ADMIN_PANEL_ANCHOR = 0.8;
const CAPTION_PAUSE = 0.05;
const CAPTION_STAGE_LENGTH = 0.9;
const CAPTION_STAGE_START = ADMIN_STAGE_END + CAPTION_PAUSE;
const CAPTION_STAGE_END = CAPTION_STAGE_START + CAPTION_STAGE_LENGTH;
const CAPTION_TOP_STAGE = 0.55;
const CAPTION_BOTTOM_STAGE = 0.25;
const CAPTION_FAKE_STAGE = 0.2;
const CAPTION_POST_PAUSE = 0.15; // dead-scroll window after captions finish
const TERMINAL_STAGE_LENGTH = 0.4;
const TERMINAL_STAGE_START = CAPTION_STAGE_END + CAPTION_POST_PAUSE;
const TERMINAL_STAGE_END = TERMINAL_STAGE_START + TERMINAL_STAGE_LENGTH;
const TERMINAL_TYPE_TRAIL = 0.8;
const TERMINAL_CHAR_SCROLL_MULT = 20;
const TERMINAL_AUTO_CHAR_RATE = 45; // baseline characters per second when auto-typing kicks in
const TERMINAL_SCROLL_MARGIN_RATIO = 0.12; // keep ~12% of viewport visible above latest line
const TERMINAL_SCROLL_LINE_STEP = 28; // px advance per revealed line when pinned
const FEEDBACK_STAGE_PAUSE = 0.05;
const FEEDBACK_STAGE_LENGTH = 0.4;
const FEEDBACK_STAGE_START = TERMINAL_STAGE_END + FEEDBACK_STAGE_PAUSE;
const FEEDBACK_STAGE_END = FEEDBACK_STAGE_START + FEEDBACK_STAGE_LENGTH;
const TEXT_SLOWNESS = 7;
const CARD_CAPTION_TOP_PHASE = 0.65;
const CARD_CAPTION_START = CARD_STAGE_START + 0.1;
const MAX_PROGRESS = FEEDBACK_STAGE_END + TERMINAL_TYPE_TRAIL;
const MIN_FEEDBACK_LENGTH = 20;
const MAX_FEEDBACK_NAME = 32;
const SUPPRESSED_FEEDBACK_MESSAGES = [
  'Missing or insufficient permissions',
  'We could not save that just yet',
];
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
    output: ['=> Linux JTech-Server #1 running stable since the last “how do I block WhatsApp Status” post.'],
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
    output: ['=> Found: download and install guides, fix guides, and “pls help my kid found Developer Options”'],
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
  {
    command: '',
    output: [' '],
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
  {
    id: 'fb-4',
    name: 'Binyomin S.',
    handle: '@flipfixer',
    context: 'CAT S22 + KosherOS',
    quote: '“Followed the sticky, flashed the profile, phone runs smooth with zero loopholes.”',
    fromFirestore: false,
  },
  {
    id: 'fb-5',
    name: 'Rivky P.',
    handle: '@momtech',
    context: 'iPhone + ScreenTime',
    quote: '“Shared our ScreenTime recipe—already helped two other families calm the chaos.”',
    fromFirestore: false,
  },
  {
    id: 'fb-6',
    name: 'Chaim L.',
    handle: '@appscoach',
    context: 'TAG Guardian tips',
    quote: '“We posted our Guardian checklist; now the bochurim set up phones in 5 minutes.”',
    fromFirestore: false,
  },
];

const faqEntries = [
  {
    question: 'What is JTech Forums?',
    answer:
      "This forum meets the diverse tech needs of the Jewish Orthodox community—from kosher phones to coding tips—so you can find everything in one respectful space.",
  },
  {
    question: 'What type of information can be found here?',
    answer:
      'Guides, walkthroughs, shared apps, troubleshooting threads, and beginner questions all contributed by the community to help each other out.',
  },
  {
    question: 'What if I’m not sure if my post is kosher or allowed?',
    answer: 'Ask before you publish. Moderators will gladly clarify so we keep every thread appropriate and on-mission.',
  },
  {
    question: 'Can I share random download links?',
    answer: 'Please don’t. To keep members safe, only link to trusted, verifiable sources—never anonymous drives or file dumps.',
  },
  {
    question: 'How do I keep my posts helpful?',
    answer:
      'Use clear titles, stay on-topic, search before posting, and add real value—tips, steps, or lessons learned.',
  },
  {
    question: 'What if I see spam or inappropriate content?',
    answer: 'Flag it and move on. Enough flags alert moderators quickly, and we’ll handle the cleanup.',
  },
  {
    question: 'Are disagreements allowed?',
    answer:
      'Absolutely. Just challenge ideas, not people. Be respectful so discussions stay productive and family-friendly.',
  },
  {
    question: 'What counts as unacceptable content?',
    answer: 'Anything obscene, offensive, hateful, or unsafe for families. Search engines index us, so keep it clean.',
  },
  {
    question: 'Can I post things I didn’t create?',
    answer: 'No. Avoid copyrighted, pirated, or mystery files unless you have permission and can vouch for them.',
  },
  {
    question: 'Who runs this site?',
    answer:
      'You do. Moderators guide the tone, but every member keeps the platform running by sharing and reporting responsibly.',
  },
  {
    question: 'Where do I go if I have forum questions?',
    answer: 'Open a topic in Site Feedback or reach out to staff directly if it’s urgent.',
  },
  {
    question: 'Do I need to agree to the Terms of Service?',
    answer: 'Yes. Using the forum means you accept the TOS, which protects both you and the community.',
  },
];

const terminalTabs = [
  {
    id: 'tab-primary',
    label: 'C:\\WINDOWS\\system32\\cmd.exe',
    active: true,
  },
];

const SCROLL_FACTOR = 0.00045;
const PREVIEW_SCROLL_STRETCH = 6; // makes preview text require more scroll distance
const PAUSE_SCROLL_STRETCH = 4; // makes the between-page pause require extra scrolling
const PREVIEW_SCROLL_SCALE =
  HERO_PORTION > 0 ? Math.max(((PREVIEW_END - CARD_STAGE_END) / HERO_PORTION) / PREVIEW_SCROLL_STRETCH, 0.0001) : 1;
const PREVIEW_PRIMARY_SHARE = 0.65;

export default function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0); // 0 - hero start, 1 - preview finished
  const autoDisabledRef = useRef(false);
  const [terminalTypedChars, setTerminalTypedChars] = useState(0);
  const typingAccumulatorRef = useRef(0);
  const terminalTypedCharsRef = useRef(0);
  const terminalContainerRef = useRef(null);
  const terminalScrollingRef = useRef(null);
  const progressRef = useRef(0);
  const feedbackSectionRef = useRef(null);
  const { user, profile } = useAuth();
  const isAdmin = Boolean(profile?.isAdmin);
  const [feedbackEntries, setFeedbackEntries] = useState(feedbackShowcase);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', context: '', quote: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [visibleFaqIndices, setVisibleFaqIndices] = useState([0, 1, 2]);
  const [nextFaqIndex, setNextFaqIndex] = useState(3);
  const [leaderboardState, setLeaderboardState] = useState({
    entries: [],
    status: 'idle',
    error: '',
  });
  const totalTerminalChars = useMemo(
    () =>
      terminalEntries.reduce(
        (sum, entry) =>
          sum +
          (entry.command?.length || 0) +
          entry.output.reduce((acc, line) => acc + (line?.length || 0), 0),
        0
      ),
    [terminalEntries]
  );
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
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data() || {};
          return {
            id: doc.id,
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
    progressRef.current = progress;
  }, [progress]);

  const handleFeedbackInput = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'name' ? value.slice(0, MAX_FEEDBACK_NAME) : value;
    setFeedbackForm((prev) => ({ ...prev, [name]: nextValue }));
    setFeedbackMessage('');
  };

  const handleFeedbackSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const nameValue = feedbackForm.name.trim().slice(0, MAX_FEEDBACK_NAME);
      const quoteValue = feedbackForm.quote.trim();
      const contextValue = feedbackForm.context.trim();
      if (!user) {
        setFeedbackMessage('Sign in first so we can link your feedback to the right account.');
        return;
      }
      if (!nameValue) {
        setFeedbackMessage('Add the name you want other members to see.');
        return;
      }
      if (!quoteValue) {
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

  const handleFeedbackCardKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleFeedbackCta();
      }
    },
    [handleFeedbackCta]
  );

  const toggleFaq = useCallback((clickedIndex) => {
    const isClosing = activeFaqIndex === clickedIndex;
    const previouslyActive = activeFaqIndex;
    
    setActiveFaqIndex(isClosing ? null : clickedIndex);

    if (previouslyActive !== null && !isClosing) {
      setVisibleFaqIndices(currentIndices => {
        const newIndices = [...currentIndices];
        const indexToReplace = newIndices.indexOf(previouslyActive);

        if (indexToReplace !== -1) {
          let nextIndexToInsert = nextFaqIndex;
          const otherVisibleIndices = newIndices.filter(i => i !== previouslyActive);
          while(otherVisibleIndices.includes(nextIndexToInsert)) {
            nextIndexToInsert = (nextIndexToInsert + 1) % faqEntries.length;
          }
          
          newIndices[indexToReplace] = nextIndexToInsert;
          
          setNextFaqIndex((nextIndexToInsert + 1) % faqEntries.length);
          return newIndices;
        }
        return currentIndices;
      });
    }
  }, [activeFaqIndex, nextFaqIndex]);

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
    [firestore, isAdmin]
  );

  const renderFeedbackCard = useCallback(
    (entry, index) => {
      if (!entry) return null;
      const cardKey = entry.id || `${entry.name || 'member'}-${index}`;
      const canRemoveEntry = Boolean(isAdmin && entry.fromFirestore && entry.id);
      return (
        <article
          key={cardKey}
          className="flex min-w-[260px] flex-1 flex-col rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-900/60 p-5 text-left shadow-[0_25px_90px_rgba(2,6,23,0.35)]"
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-slate-400">
            <span className="truncate">{entry.context || 'Shared setup'}</span>
            {canRemoveEntry && (
              <button
                type="button"
                onClick={() => handleDeleteFeedback(entry.id)}
                className="text-[10px] font-semibold text-rose-200 transition hover:text-white"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-4 flex-1 text-lg leading-relaxed text-slate-100">
            <span className="text-sky-300">“</span>
            <span className="line-clamp-4">{entry.quote || 'Shared by the community.'}</span>
          </p>
          <div className="mt-5 text-sm font-semibold text-white">
            {entry.name || 'Forum member'}
            {entry.handle && <span className="ml-2 text-xs font-normal text-slate-400">{entry.handle}</span>}
          </div>
        </article>
      );
    },
    [handleDeleteFeedback, isAdmin]
  );

  const skipTerminalStage = useCallback(() => {
    typingAccumulatorRef.current = 0;
    if (totalTerminalChars > 0) {
      terminalTypedCharsRef.current = totalTerminalChars;
      setTerminalTypedChars(totalTerminalChars);
    }
    setProgress((prev) => Math.max(prev, FEEDBACK_STAGE_START));
  }, [totalTerminalChars]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      const delta = event.deltaY * SCROLL_FACTOR;
      const isTerminalContext = progressRef.current >= TERMINAL_STAGE_START && progressRef.current < FEEDBACK_STAGE_START;
      const insideTerminal = terminalContainerRef.current?.contains(event.target);
      const feedbackNode = feedbackSectionRef.current;
      const isFeedbackContext = progressRef.current >= FEEDBACK_STAGE_START && feedbackNode?.contains(event.target);

      if (isFeedbackContext && feedbackNode) {
        const atTop = feedbackNode.scrollTop <= 0;
        const atBottom = Math.ceil(feedbackNode.scrollTop + feedbackNode.clientHeight) >= feedbackNode.scrollHeight;
        const scrollingDown = delta > 0;
        const scrollingUp = delta < 0;
        const canScrollInside =
          (scrollingDown && !atBottom) ||
          (scrollingUp && !atTop);
        if (canScrollInside) {
          return;
        }
      }

      if (isTerminalContext) {
        event.preventDefault();
      }

      if (delta < 0) {
        autoDisabledRef.current = true;
      }

      setProgress((prev) => {
        const isCurrentlyTerminal = prev >= TERMINAL_STAGE_START && prev < FEEDBACK_STAGE_START;
        if (isCurrentlyTerminal && delta > 0 && !insideTerminal) {
          if (totalTerminalChars > 0) {
            typingAccumulatorRef.current = 0;
            terminalTypedCharsRef.current = totalTerminalChars;
            setTerminalTypedChars(totalTerminalChars);
          }
          return clamp(Math.max(prev, FEEDBACK_STAGE_START), 0, MAX_PROGRESS);
        }

        const virtualPrev = expandProgressForScroll(prev);
        const virtualNext = virtualPrev + delta;

        if (totalTerminalChars > 0 && (virtualPrev >= TERMINAL_STAGE_START || virtualNext >= TERMINAL_STAGE_START)) {
          typingAccumulatorRef.current += delta * TERMINAL_CHAR_SCROLL_MULT;
          let charDelta = 0;
          while (
            typingAccumulatorRef.current >= 1 &&
            terminalTypedCharsRef.current + charDelta < totalTerminalChars
          ) {
            typingAccumulatorRef.current -= 1;
            charDelta += 1;
          }
          while (
            typingAccumulatorRef.current <= -1 &&
            terminalTypedCharsRef.current + charDelta > 0
          ) {
            typingAccumulatorRef.current += 1;
            charDelta -= 1;
          }
          if (charDelta !== 0) {
            setTerminalTypedChars((prevChars) => clamp(prevChars + charDelta, 0, totalTerminalChars));
          }
        }

        const next = collapseProgressForScroll(virtualNext);
        return clamp(next, 0, MAX_PROGRESS);
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [totalTerminalChars]);

  useEffect(() => {
    terminalTypedCharsRef.current = terminalTypedChars;
  }, [terminalTypedChars]);

  useEffect(() => {
    const handleFeedbackModalRequest = () => {
      handleFeedbackCta();
    };
    window.addEventListener('openFeedbackModal', handleFeedbackModalRequest);
    return () => window.removeEventListener('openFeedbackModal', handleFeedbackModalRequest);
  }, [handleFeedbackCta]);

  useEffect(() => {
    if (progress <= TERMINAL_STAGE_START && (terminalTypedCharsRef.current !== 0 || typingAccumulatorRef.current !== 0)) {
      typingAccumulatorRef.current = 0;
      setTerminalTypedChars(0);
    }
  }, [progress]);

useEffect(() => {
  if (typeof window === 'undefined' || totalTerminalChars <= 0) return undefined;
  let rafId = null;
  let lastTime = window.performance.now();

    const tick = (time) => {
      const deltaSeconds = Math.max(0, (time - lastTime) / 1000);
      lastTime = time;
      const autoActive =
        progressRef.current >= TERMINAL_STAGE_START && terminalTypedCharsRef.current < totalTerminalChars;
      if (autoActive && deltaSeconds > 0) {
        const charDelta = deltaSeconds * TERMINAL_AUTO_CHAR_RATE;
        if (charDelta > 0) {
          setTerminalTypedChars((prev) => {
            if (prev >= totalTerminalChars) return prev;
            return Math.min(totalTerminalChars, prev + charDelta);
          });
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame((time) => {
      lastTime = time;
      tick(time);
    });

  return () => window.cancelAnimationFrame(rafId);
}, [totalTerminalChars]);


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
  progress <= CARD_STAGE_START
    ? 0
    : clamp((progress - CARD_STAGE_START) / Math.max(CARD_STAGE_END - CARD_STAGE_START, 0.0001), 0, 1);
const rawPreviewProgress =
  progress <= PREVIEW_STAGE_START
    ? 0
    : clamp((progress - PREVIEW_STAGE_START) / Math.max(PREVIEW_END - PREVIEW_STAGE_START, 0.0001), 0, 1);
const adminStageProgress =
  progress <= ADMIN_STAGE_START ? 0 : clamp((progress - ADMIN_STAGE_START) / (ADMIN_STAGE_END - ADMIN_STAGE_START), 0, 1);
const captionStageProgress =
  progress <= CAPTION_STAGE_START ? 0 : clamp((progress - CAPTION_STAGE_START) / (CAPTION_STAGE_END - CAPTION_STAGE_START), 0, 1);
const terminalStageProgress =
  progress <= TERMINAL_STAGE_START ? 0 : clamp((progress - TERMINAL_STAGE_START) / (TERMINAL_STAGE_LENGTH || 0.0001), 0, 1);
const terminalTypingProgress = totalTerminalChars > 0 ? terminalTypedChars / totalTerminalChars : 0;
const rawFeedbackStageProgress =
  progress <= FEEDBACK_STAGE_START ? 0 : clamp((progress - FEEDBACK_STAGE_START) / (FEEDBACK_STAGE_LENGTH || 0.0001), 0, 1);
const feedbackStageProgress = terminalTypingProgress >= 0.999 ? rawFeedbackStageProgress : 0;
const terminalFocusOpacity = clamp(terminalStageProgress * (1 - feedbackStageProgress * 1.2), 0, 1);
const terminalFocusScale = 1 + feedbackStageProgress * 0.35;
const terminalFocusTranslateY = feedbackStageProgress * -20;
const feedbackSectionStyle = {
  opacity: feedbackStageProgress,
  transform: `translateY(${(1 - feedbackStageProgress) * 520}px) scale(${0.9 + feedbackStageProgress * 0.12})`,
  pointerEvents: feedbackStageProgress > 0.02 ? 'auto' : 'none',
  maxHeight: 'calc(100vh - 56px)',
};
const terminalTypingState = useMemo(
  () => buildTerminalTypingState(terminalEntries, terminalTypingProgress),
  [terminalEntries, terminalTypingProgress]
);
const typedLineCount = useMemo(() => {
  let count = 0;
  terminalTypingState.forEach((entry) => {
    if (!entry) return;
    if (entry.command?.length) count += 1;
    entry.outputs?.forEach((line) => {
      if (line?.length) count += 1;
    });
  });
  return count;
}, [terminalTypingState]);
const terminalTotalLines = useMemo(() => {
  let total = 0;
  terminalEntries.forEach((entry) => {
    if (!entry) return;
    if (entry.command) total += 1;
    if (Array.isArray(entry.output)) total += entry.output.length;
  });
  return Math.max(total, 1);
}, []);
const feedbackList = feedbackEntries && feedbackEntries.length > 0 ? feedbackEntries : feedbackShowcase;
const showFeedbackCarousel = feedbackList.length > 3;
const feedbackQuoteLengths = feedbackList.map((entry) => Math.max(entry?.quote?.length || 0, 0));
const avgFeedbackChars =
  feedbackQuoteLengths.length > 0
    ? Math.round(feedbackQuoteLengths.reduce((sum, value) => sum + value, 0) / feedbackQuoteLengths.length)
    : 0;
const feedbackHighlights = [
  { label: 'Live stories', value: `${feedbackList.length}+`, detail: 'Approved community shout-outs' },
  { label: 'Avg. note length', value: avgFeedbackChars ? `${avgFeedbackChars} chars` : '—', detail: 'Plenty of context without rambling' },
  { label: 'Mod turnaround', value: 'Under 12h', detail: 'Human review before anything publishes' },
];
const trimmedName = feedbackForm.name.trim().slice(0, MAX_FEEDBACK_NAME);
const trimmedContext = feedbackForm.context.trim();
const trimmedQuote = feedbackForm.quote.trim();
const remainingChars = Math.max(MIN_FEEDBACK_LENGTH - trimmedQuote.length, 0);
const remainingNameChars = Math.max(MAX_FEEDBACK_NAME - feedbackForm.name.length, 0);
const canSubmitFeedback = Boolean(user && trimmedName && remainingChars <= 0);
const feedbackCtaLabel = user ? 'Open feedback form' : 'Log in to share feedback';
const feedbackCtaSupportingText = user
  ? 'Turn your fix or pep talk into relief for the next member.'
  : 'Log in to drop your story and help the next member breathe easier.';
const visibleFeedbackMessage =
  feedbackMessage && !SUPPRESSED_FEEDBACK_MESSAGES.some((phrase) => feedbackMessage?.includes(phrase))
    ? feedbackMessage
    : '';
const visibleFaqCards =
  faqEntries.length > 0
    ? visibleFaqIndices.map((index) => {
        const normalizedIndex = ((index % faqEntries.length) + faqEntries.length) % faqEntries.length;
        return { index: normalizedIndex, ...faqEntries[normalizedIndex] };
      })
    : [];
const faqToggleIcon = (open) => (
  <svg
    className={`h-4 w-4 transition ${open ? 'rotate-45 text-sky-300' : 'text-white/70'}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

useEffect(() => {
  const scroller = terminalScrollingRef.current;
  if (!scroller) return undefined;

  const syncScrollPosition = () => {
    const available = scroller.scrollHeight - scroller.clientHeight;
    if (available <= 0) {
      scroller.scrollTop = 0;
      return;
    }

    const margin = scroller.clientHeight * TERMINAL_SCROLL_MARGIN_RATIO;
    const maxScrollable = Math.max(available - margin, 0);
    const linesBeyondStart = Math.max(typedLineCount - 5, 0);
    const totalBeyondStart = Math.max(terminalTotalLines - 5, 1);
    const ratio = clamp(linesBeyondStart / totalBeyondStart, 0, 1);

    scroller.scrollTo({
      top: ratio * maxScrollable,
      behavior: 'smooth',
    });
  };

  syncScrollPosition();
  const observer = new ResizeObserver(syncScrollPosition);
  observer.observe(scroller);

  return () => observer.disconnect();
}, [typedLineCount, terminalTotalLines]);

const leaderboardEntries = leaderboardState.entries;
const leaderboardStatus = leaderboardState.status;
const leaderboardError = leaderboardState.error;
const leaderboardLink = `${forumBaseUrl}/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`;

const heroLineCharacters = useMemo(() => buildLineCharacters(heroLines, heroProgress), [heroProgress]);
const heroActiveLine = useMemo(() => activeLineIndex(heroLines, heroProgress), [heroProgress]);

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
const textRevealProgress = captionStageProgress;
const fakeStageProgress =
  captionStageProgress <= CAPTION_TOP_STAGE + CAPTION_BOTTOM_STAGE
    ? 0
    : clamp(
        (captionStageProgress - CAPTION_TOP_STAGE - CAPTION_BOTTOM_STAGE) / Math.max(CAPTION_FAKE_STAGE, 0.0001),
        0,
        1
      );
const topTypingPhase = Math.pow(
  clamp(captionStageProgress / Math.max(CAPTION_TOP_STAGE, 0.0001), 0, 1),
  TEXT_SLOWNESS
);
const bottomTypingPhase =
  captionStageProgress <= CAPTION_TOP_STAGE
    ? 0
    : Math.pow(
        clamp(
          (captionStageProgress - CAPTION_TOP_STAGE) / Math.max(CAPTION_BOTTOM_STAGE, 0.0001),
          0,
          1
        ),
        TEXT_SLOWNESS
      );
const totalCaptionChars = topCaption.length + bottomCaption.length;
const topCharShare = totalCaptionChars > 0 ? topCaption.length / totalCaptionChars : 0;
const bottomCharShare = totalCaptionChars > 0 ? bottomCaption.length / totalCaptionChars : 0;
let captionTypingProgress = topTypingPhase * topCharShare;
if (captionStageProgress > CAPTION_TOP_STAGE && bottomCharShare > 0) {
  captionTypingProgress = topCharShare + bottomTypingPhase * bottomCharShare;
}
captionTypingProgress = clamp(captionTypingProgress, 0, 1);
const adminPanelStyle = {
  opacity: adminStageProgress * clamp(1 - terminalStageProgress * 1.1, 0, 1),
  transform: `translateX(${(1 - adminStageProgress) * 180 - terminalStageProgress * 300}px) scale(${0.9 + Math.min(adminStageProgress, ADMIN_PANEL_ANCHOR) * 0.1})`,
  pointerEvents: adminStageProgress > 0.05 && terminalStageProgress < 0.1 ? 'auto' : 'none',
};
const showcaseRevealProgress =
  captionStageProgress <= CAPTION_TOP_STAGE
    ? 0
    : clamp(
        (captionStageProgress - CAPTION_TOP_STAGE) / Math.max(CAPTION_BOTTOM_STAGE, 0.0001),
        0,
        1
      );
const leaderboardRevealCount =
  leaderboardStatus === 'ready' ? Math.min(leaderboardEntries.length, LEADERBOARD_LIMIT) : 0;
const totalShowcaseItems = adminProfiles.length + leaderboardRevealCount;
const getAdminReveal = (index) =>
  totalShowcaseItems === 0 ? 0 : staggerReveal(showcaseRevealProgress, index, totalShowcaseItems);
const getLeaderboardReveal = (index) =>
  totalShowcaseItems === 0
    ? 0
    : staggerReveal(showcaseRevealProgress, adminProfiles.length + index, totalShowcaseItems);
const [topCaptionChars = [], bottomCaptionChars = []] = useMemo(
  () => buildLineCharacters([topCaption, bottomCaption], captionTypingProgress),
  [captionTypingProgress]
);
const fakeTypingChars = buildLineCharacters(['â–ˆ'.repeat(100)], fakeStageProgress)[0] || [];
const showFakeLine = fakeStageProgress > 0 && fakeStageProgress < 1;
const textLayerOpacity = textRevealProgress * clamp(1 - terminalStageProgress * 2, 0, 1);
const cardCaptionProgress =
  progress <= CARD_CAPTION_START
    ? 0
    : clamp(
        (progress - CARD_CAPTION_START) / Math.max(CARD_STAGE_END - CARD_CAPTION_START, 0.0001),
        0,
        1
      );
const cardTopPhase = Math.pow(
  clamp(
    cardCaptionProgress / Math.max(CARD_CAPTION_TOP_PHASE, 0.0001),
    0,
    1
  ),
  TEXT_SLOWNESS
);
const cardBottomPhase =
  cardCaptionProgress <= CARD_CAPTION_TOP_PHASE
    ? 0
    : Math.pow(
        clamp(
          (cardCaptionProgress - CARD_CAPTION_TOP_PHASE) / Math.max(1 - CARD_CAPTION_TOP_PHASE, 0.0001),
          0,
          1
        ),
        TEXT_SLOWNESS
      );
const totalCardCaptionChars = cardTopCaption.length + cardBottomCaption.length;
const cardTopShare = totalCardCaptionChars > 0 ? cardTopCaption.length / totalCardCaptionChars : 0;
const cardBottomShare = totalCardCaptionChars > 0 ? cardBottomCaption.length / totalCardCaptionChars : 0;
let cardCaptionTypingProgress = cardTopPhase * cardTopShare;
if (cardCaptionProgress > CARD_CAPTION_TOP_PHASE && cardBottomShare > 0) {
  cardCaptionTypingProgress = cardTopShare + cardBottomPhase * cardBottomShare;
}
cardCaptionTypingProgress = clamp(cardCaptionTypingProgress, 0, 1);
const cardCaptionComplete = cardCaptionProgress >= 0.999;
const previewProgress = cardCaptionComplete ? rawPreviewProgress : 0;
const cardCaptionOpacity = clamp(cardCaptionProgress * 1.4, 0, 1) * clamp(1 - adminStageProgress * 1.4, 0, 1);
const [cardTopCaptionChars = [], cardBottomCaptionChars = []] = useMemo(
  () => buildLineCharacters([cardTopCaption, cardBottomCaption], cardCaptionTypingProgress),
  [cardCaptionTypingProgress]
);
const feedbackInteractive = feedbackStageProgress > 0.05;
const footerReveal = clamp((feedbackStageProgress - 0.65) / 0.35, 0, 1);
const previewLineProgresses = useMemo(() => {
  if (!Array.isArray(previewLines) || previewLines.length === 0) return [];
  const remainderShare = Math.max(1 - PREVIEW_PRIMARY_SHARE, 0);
  const secondaryShare =
    previewLines.length <= 1 ? 0 : remainderShare / Math.max(previewLines.length - 1, 1);
  let start = 0;
  return previewLines.map((_, index) => {
    const share = index === 0 ? PREVIEW_PRIMARY_SHARE : secondaryShare;
    if (share <= 0) {
      return previewProgress >= start ? 1 : 0;
    }
    const lineProgress = clamp((previewProgress - start) / share, 0, 1);
    start += share;
    return lineProgress;
  });
}, [previewLines, previewProgress]);

const previewLineCharacters = useMemo(
  () =>
    previewLines.map((line, index) => {
      const chars = buildLineCharacters([line], previewLineProgresses[index] || 0);
      return chars[0] || [];
    }),
  [previewLines, previewLineProgresses]
);

const previewActiveLine = useMemo(() => {
  for (let i = 0; i < previewLineProgresses.length; i += 1) {
    if (previewLineProgresses[i] < 1) return i;
  }
  return previewLineProgresses.length - 1;
}, [previewLineProgresses]);
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

            {cardCaptionOpacity > 0 && (
              <>
                <div
                  className="pointer-events-none absolute left-1/2 top-[6%] z-10 w-full max-w-[min(1200px,88vw)] -translate-x-1/2 text-center text-2xl uppercase tracking-[0.4em] text-white transition duration-300"
                  style={{ opacity: cardCaptionOpacity }}
                >
                  <LineCharacters chars={cardTopCaptionChars} />
                </div>
                <div
                  className="pointer-events-none absolute left-1/2 bottom-[8%] z-10 w-full max-w-[min(1200px,88vw)] -translate-x-1/2 text-center text-base uppercase tracking-[0.35em] text-slate-100 transition duration-300"
                  style={{ opacity: cardCaptionOpacity }}
                >
                  <LineCharacters chars={cardBottomCaptionChars} />
                </div>
              </>
            )}

            <div className="absolute inset-0 flex items-center justify-center pt-12 sm:pt-16 lg:pt-20" aria-hidden={cardSlideProgress === 0}>
              <div
                className="flex w-full max-w-[min(1400px,92vw)] flex-col gap-8 rounded-[32px] border border-white/10 bg-slate-950/95 px-5 py-6 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:py-16 shadow-[0_70px_240px_rgba(2,6,23,0.78)] transition duration-600 ease-out"
                style={{
                  opacity: cardSlideProgress * (1 - adminStageProgress * 1.1),
                  transform: `translateY(${(1 - cardSlideProgress) * 80}px) translateX(${-adminStageProgress * 140}px) scale(${
                    1 - adminStageProgress * 0.05
                  })`,
                  pointerEvents: feedbackInteractive ? 'none' : cardSlideProgress > 0.05 ? 'auto' : 'none',
                }}
              >
                <div className="relative mx-auto aspect-[16/9.2] w-full overflow-hidden rounded-[24px] border border-white/15 bg-slate-900 shadow-[0_30px_120px_rgba(2,6,23,0.45)] lg:flex-[1.8]">
                  <img
                    src="/img/forum.png"
                    alt="JTech Forums preview"
                    className="h-full w-full object-contain bg-slate-950"
                    style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}
                    loading="lazy"
                  />
                </div>
                <div className="mx-auto w-full max-w-[580px] text-center text-base font-medium text-slate-100 sm:text-lg lg:flex-1 lg:text-left">
                  {previewLines.map((line, idx) => (
                    <p
                      key={`${idx}-${line}`}
                      className={`mb-2 text-slate-200/90 ${previewActiveLine === idx && previewProgress < 1 ? 'text-white' : ''}`}
                    >
                      <LineCharacters chars={previewLineCharacters[idx]} />
                      <Cursor active={previewProgress < 1 && previewActiveLine === idx} className="h-5" />
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden={feedbackStageProgress === 0}
              style={{ zIndex: feedbackStageProgress > 0 ? 10 : 'auto' }}
            >
              <section
                ref={feedbackSectionRef}
                className="scrollbar-hide flex w-full max-w-[min(1150px,90vw)] flex-col rounded-[28px] border border-white/10 bg-slate-950/92 p-5 sm:p-8 shadow-[0_50px_150px_rgba(2,6,23,0.6)] transition duration-500 overflow-y-auto overscroll-contain"
                style={{ ...feedbackSectionStyle, minHeight: 'min(80vh, 880px)' }}
              >
                <div className="text-center space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">What our users say</p>
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">Real voices from the JTech forums</h2>
                  <p className="text-sm text-slate-400">Stories pulled straight from the feedback wall so you never feel stuck alone.</p>
                </div>
                <div className="mt-8 flex-1 space-y-6">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.7fr)]">
                    <div className="flex flex-col gap-6">
                      {showFeedbackCarousel ? (
                        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-4 shadow-inner">
                          <motion.div
                            className="flex gap-4"
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{
                              duration: Math.max(feedbackList.length * 4, 16),
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          >
                            {[...feedbackList, ...feedbackList].map((entry, index) => renderFeedbackCard(entry, index))}
                          </motion.div>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">{feedbackList.map((entry, index) => renderFeedbackCard(entry, index))}</div>
                      )}
                      <div className="text-center text-xs text-slate-500 lg:text-left">
                        {feedbackStatus === 'loading' && 'Syncing the latest shout-outs...'}
                        {feedbackStatus === 'ready' && 'Updated whenever someone shares a win or fix.'}
                        {feedbackStatus === 'empty' && 'Be the first to leave a note for the next member.'}
                        {feedbackStatus === 'error' && !visibleFeedbackMessage && 'Forum stories are offline right now.'}
                        {feedbackStatus === 'idle' && 'Live pull from the share wall.'}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-5 lg:pr-8">
                      <article
                        role="button"
                        tabIndex={0}
                        onClick={handleFeedbackCta}
                        onKeyDown={handleFeedbackCardKeyDown}
                        className="group w-full cursor-pointer rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/60 p-5 text-left shadow-[0_24px_90px_rgba(2,6,23,0.4)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 lg:mr-8"
                      >
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Share your feedback</p>
                          <h3 className="text-[1.35rem] font-semibold text-white">Drop a fix for the next member</h3>
                          <p className="text-sm text-slate-300">{feedbackCtaSupportingText}</p>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleFeedbackCta();
                            }}
                            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 sm:flex-none sm:px-5"
                          >
                            {feedbackCtaLabel}
                          </button>
                          {!user && <span className="text-xs text-slate-400">Log in to share feedback.</span>}
                        </div>
                        {visibleFeedbackMessage && (
                          <p className="mt-4 text-xs text-slate-300" aria-live="polite">
                            {visibleFeedbackMessage}
                          </p>
                        )}
                      </article>
                      <div className="w-full rounded-[24px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_20px_70px_rgba(2,6,23,0.3)] lg:mr-8">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Snapshot</p>
                        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                          {feedbackHighlights.map((stat) => (
                            <li key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-left">
                              <p className="text-[9px] uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                              <p className="text-base font-semibold text-white">{stat.value}</p>
                              <p className="text-xs text-slate-400">{stat.detail}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <article className="mx-auto w-full max-w-[min(100%,960px)] rounded-[26px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_25px_90px_rgba(2,6,23,0.35)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Real voices Q&amp;A</p>
                        <h3 className="text-xl font-semibold text-white">So you get it?</h3>
                        <p className="text-sm text-slate-300">Tap through the quick answers we repeat all day.</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-200">FAQ</span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {visibleFaqCards.length === 0 ? (
                        <p className="text-sm text-slate-400 md:col-span-2">More answers are loading shortly.</p>
                      ) : (
                        visibleFaqCards.map(({ index, question, answer }) => {
                          const isOpen = activeFaqIndex === index;
                          return (
                            <div key={`${question}-${index}`} className="rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3">
                              <button
                                type="button"
                                className="flex w-full items-center justify-between gap-3 text-left"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={isOpen}
                              >
                                <span className="text-sm font-semibold text-white">{question}</span>
                                {faqToggleIcon(isOpen)}
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.p
                                    key={`faq-content-${index}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden pt-3 text-sm leading-relaxed text-slate-300"
                                  >
                                    {answer}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </article>
                </div>
                <div className="mt-8 flex justify-center">
                  <div
                    className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 transition duration-500"
                    style={{
                      opacity: footerReveal,
                      transform: `translateY(${(1 - footerReveal) * 80}px)`,
                      pointerEvents: footerReveal > 0.35 ? 'auto' : 'none',
                    }}
                  >
                    <Footer />
                  </div>
                </div>
              </section>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden={adminStageProgress === 0 && terminalStageProgress === 0}
              style={{ pointerEvents: feedbackInteractive ? 'none' : adminStageProgress > 0.05 ? 'auto' : 'none' }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-[5%] z-10 w-full max-w-[min(1400px,88vw)] -translate-x-1/2 text-center text-2xl uppercase tracking-[0.4em] text-white transition duration-300"
                style={{ opacity: textLayerOpacity }}
              >
                <LineCharacters chars={topCaptionChars} />
              </div>
              <div
                className="pointer-events-none absolute left-1/2 bottom-[5%] z-10 w-full max-w-[min(1400px,88vw)] -translate-x-1/2 text-center text-base uppercase tracking-[0.35em] text-slate-100 transition duration-300"
                style={{ opacity: textLayerOpacity }}
              >
                <LineCharacters chars={bottomCaptionChars} />
              </div>
              {showFakeLine && (
                <div
                  className="pointer-events-none absolute left-1/2 bottom-[8%] z-10 w-full max-w-[min(1400px,88vw)] -translate-x-1/2 text-center font-mono text-xs tracking-[0.3em] text-transparent"
                  style={{ opacity: textLayerOpacity * 0.2 }}
                >
                  <LineCharacters chars={fakeTypingChars} />
                </div>
              )}
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
                        const reveal = getAdminReveal(index);
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
                        const reveal = getLeaderboardReveal(index);
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
                                  Cheers â€¢ {cheersFormatter.format(entry.cheers)}
                                </p>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                      {leaderboardStatus === 'ready' && leaderboardEntries.length === 0 && (
                        <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                          Nobody has logged cheers yetâ€”check back soon!
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center" aria-hidden={terminalStageProgress === 0}>
              <div
                ref={terminalContainerRef}
                className="w-full max-w-[min(1100px,80vw)] rounded-[18px] border border-[#1d2231] bg-[#0b0f1d] shadow-[0_40px_140px_rgba(5,7,15,0.8)] transition duration-700"
                style={{
                  opacity: terminalFocusOpacity,
                  transform: `translateX(${(1 - terminalStageProgress) * 220}px) translateY(${terminalFocusTranslateY}px) scale(${terminalFocusScale})`,
                  pointerEvents: feedbackInteractive ? 'none' : 'auto',
                }}
              >
                <div className="flex items-center justify-between rounded-t-[18px] border-b border-[#151926] bg-[#0f131f] px-3 pt-2 pb-1">
                  <div className="flex items-end gap-1.5">
                    {terminalTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`group hidden items-center gap-2 rounded-t-2xl border px-3.5 text-[11px] font-semibold transition-all sm:flex ${
                          tab.active
                            ? 'mb-[-1px] rounded-b-none border-[#323b54] border-b-0 bg-gradient-to-b from-[#1f2538] to-[#141a27] pb-2 pt-1 text-white shadow-[0_12px_24px_rgba(3,4,10,0.55)]'
                            : 'border-transparent bg-transparent pb-1.5 pt-1 text-[#7a8098] hover:border-[#242938] hover:bg-[#151a27] hover:text-[#d7dcf9]'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border text-[9px] font-mono ${
                            tab.active
                              ? 'border-[#444a63] bg-[#06080d] text-[#f4f5ff]'
                              : 'border-[#2f3444] bg-[#0a0e16] text-[#b8bed9]'
                          }`}
                        >
                          C:
                        </span>
                        <span className="whitespace-nowrap">{tab.label}</span>
                        <span
                          className={`text-sm text-[#7c829d] transition ${
                            tab.active ? 'opacity-100 group-hover:text-white' : 'opacity-0 group-hover:opacity-100 group-hover:text-[#f5f6ff]'
                          }`}
                        >
                          ×
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[#d0d3e0]">
                    <button
                      type="button"
                      aria-label="Minimize"
                      onClick={skipTerminalStage}
                      className="inline-flex h-6 w-9 items-center justify-center rounded-sm text-lg leading-none hover:bg-[#1f222b]"
                    >
                      &#8722;
                    </button>
                    <button
                      type="button"
                      aria-label="Maximize"
                      onClick={skipTerminalStage}
                      className="inline-flex h-6 w-9 items-center justify-center rounded-sm text-sm leading-none hover:bg-[#1f222b]"
                    >
                      &#9634;
                    </button>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={skipTerminalStage}
                      className="inline-flex h-6 w-9 items-center justify-center rounded-sm text-base leading-none hover:bg-[#40242c] hover:text-[#ffd8dd]"
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
                <div
                  ref={terminalScrollingRef}
                  className="max-h-[58vh] space-y-4 overflow-hidden px-6 py-6 font-mono text-[13px] leading-relaxed text-[#d9d9e3] sm:text-[14px] scroll-smooth"
                >
                  {terminalEntries.map((entry, index) => (
                    <TerminalBlock
                      key={`${entry.command}-${index}`}
                      command={entry.command}
                      output={entry.output}
                      commandChars={terminalTypingState[index]?.command}
                      outputChars={terminalTypingState[index]?.outputs}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                <p className="mt-1 text-xs text-slate-500">{`${remainingNameChars} characters left`}</p>
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
                {remainingChars > 0 && (
                  <p className="mt-1 text-xs text-slate-500">{`Add ${remainingChars} more characters so others get the full picture.`}</p>
                )}
              </div>
              <div className="space-y-2 text-center">
                <button
                  type="submit"
                  disabled={!canSubmitFeedback || feedbackSubmitting}
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

function TerminalBlock({ command, output, commandChars = [], outputChars = [] }) {
  const showPrompt = commandChars && commandChars.length > 0;
  return (
    <div className="space-y-1">
      <p className="text-[#d9d9e3]">
        <span
          className={`text-[#7dd3fc] font-semibold transition-opacity duration-150 ${
            showPrompt ? 'opacity-100' : 'opacity-0'
          }`}
        >
          jtech@forums:~$
        </span>
        <span className="ml-3 inline-flex min-h-[1.2em] flex-wrap">
          <LineCharacters chars={commandChars} />
        </span>
      </p>
      {output.map((line, idx) => (
        <p key={`${command}-${idx}`} className="text-[#d9d9e3]/90">
          <LineCharacters chars={(outputChars && outputChars[idx]) || []} />
        </p>
      ))}
    </div>
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
      baseState[item.entryIndex].command = buildSolidCharacters(item.text, item.text.length);
      remaining -= item.text.length;
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












