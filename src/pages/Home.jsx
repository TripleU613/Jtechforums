import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Footer from '../components/Footer';
import { fetchForumApi, getForumWebBase } from '../lib/forumApi';
import { firestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import faqEntries from '../data/faqEntries';

const forumBaseUrl = getForumWebBase();

const LEADERBOARD_ID = 6;
const LEADERBOARD_PERIOD = 'monthly';
const LEADERBOARD_LIMIT = 3;

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

const feedbackShowcase = [
  {
    id: 'fb-1',
    name: 'Sara K.',
    handle: '@kosherandroid',
    context: 'Galaxy A14 + TAG Guardian',
    quote: '"The apps section walked me through every step. My phone is locked down, but still useful."',
    fromFirestore: false,
  },
  {
    id: 'fb-2',
    name: 'Eli D.',
    handle: '@flipguy',
    context: 'Nokia 2780 & Kosher config',
    quote: '"Every time I break something, the forum already has the answer. Huge time saver."',
    fromFirestore: false,
  },
  {
    id: 'fb-3',
    name: 'Malky R.',
    handle: '@techmom',
    context: 'Moto G Pure for the family',
    quote: '"Needed a safe phone setup for our teens. The guidance here kept it calm, kosher, and doable."',
    fromFirestore: false,
  },
];

const MIN_FEEDBACK_LENGTH = 40;
const MAX_FEEDBACK_LENGTH = 600;
const MAX_FEEDBACK_NAME = 32;

export default function Home() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isAdmin = Boolean(profile?.isAdmin);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // State
  const [feedbackEntries, setFeedbackEntries] = useState(feedbackShowcase);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', context: '', quote: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [leaderboardState, setLeaderboardState] = useState({ entries: [], status: 'idle', error: '' });

  // Load feedback from Firestore
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
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().authorDisplayName || doc.data().authorName || 'Forum member',
          handle: doc.data().authorHandle || '@community',
          context: doc.data().context || 'Shared setup',
          quote: doc.data().quote || '',
          fromFirestore: true,
        }));
        setFeedbackEntries(docs);
        setFeedbackStatus('ready');
      },
      () => {
        setFeedbackEntries(feedbackShowcase);
        setFeedbackStatus('error');
      }
    );
    return unsubscribe;
  }, []);

  // Load leaderboard
  useEffect(() => {
    const controller = new AbortController();
    const loadLeaderboard = async () => {
      setLeaderboardState((prev) => ({ ...prev, status: 'loading' }));
      try {
        const response = await fetchForumApi(`/forum/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed');
        const payload = await response.json();
        const entries = (payload?.users || []).slice(0, LEADERBOARD_LIMIT).map((u, i) => ({
          id: u.id || `${u.username}-${i}`,
          username: u.username || `member-${i + 1}`,
          position: u.position || i + 1,
          cheers: Number(u.total_score) || 0,
          avatar: u.avatar_template ? (u.avatar_template.startsWith('http') ? u.avatar_template.replace('{size}', '160') : `${forumBaseUrl}${u.avatar_template.replace('{size}', '160')}`) : `${forumBaseUrl}/letter_avatar_proxy/v4/letter/j/ce7236/160.png`,
          profileUrl: `${forumBaseUrl}/u/${encodeURIComponent(u.username || '')}`,
        }));
        setLeaderboardState({ entries, status: 'ready', error: '' });
      } catch {
        if (!controller.signal.aborted) setLeaderboardState({ entries: [], status: 'error', error: 'Unable to load' });
      }
    };
    loadLeaderboard();
    return () => controller.abort();
  }, []);

  // Feedback handlers
  const handleFeedbackInput = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({ ...prev, [name]: name === 'name' ? value.slice(0, MAX_FEEDBACK_NAME) : value }));
    setFeedbackMessage('');
  };

  const handleFeedbackSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!user) { setFeedbackMessage('Sign in first.'); return; }
    const nameVal = feedbackForm.name.trim().slice(0, MAX_FEEDBACK_NAME);
    const quoteVal = feedbackForm.quote.trim().slice(0, MAX_FEEDBACK_LENGTH);
    if (!nameVal) { setFeedbackMessage('Add your display name.'); return; }
    if (quoteVal.length < MIN_FEEDBACK_LENGTH) { setFeedbackMessage(`At least ${MIN_FEEDBACK_LENGTH} characters needed.`); return; }
    setFeedbackSubmitting(true);
    try {
      await addDoc(collection(firestore, 'feedback'), {
        uid: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Forum member',
        authorDisplayName: nameVal,
        authorHandle: user.email ? `@${user.email.split('@')[0]}` : `@${user.uid.slice(0, 6)}`,
        context: feedbackForm.context.trim() || 'Custom setup',
        quote: quoteVal,
        createdAt: serverTimestamp(),
      });
      setFeedbackForm({ name: '', context: '', quote: '' });
      setFeedbackMessage('Submitted!');
      setFeedbackModalOpen(false);
    } catch {
      setFeedbackMessage('Unable to submit right now.');
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackForm, user]);

  const handleDeleteFeedback = useCallback(async (entryId) => {
    if (!entryId || !isAdmin) return;
    try {
      await deleteDoc(doc(firestore, 'feedback', entryId));
    } catch {}
  }, [isAdmin]);

  const feedbackList = feedbackStatus === 'ready' ? feedbackEntries : feedbackShowcase;

  return (
    <div ref={containerRef} className="relative bg-[#030712]">
      {/* Fixed progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* ===== SECTION 1: Hero with zoom ===== */}
      <HeroSection />

      {/* ===== SECTION 2: The Problem - Zoom reveal ===== */}
      <ProblemSection />

      {/* ===== SECTION 3: The Solution - Scale up reveal ===== */}
      <SolutionSection />

      {/* ===== SECTION 4: Features with scroll animations ===== */}
      <FeaturesSection />

      {/* ===== SECTION 5: Community - Admins & Leaderboard ===== */}
      <CommunitySection
        adminProfiles={adminProfiles}
        leaderboardState={leaderboardState}
        forumBaseUrl={forumBaseUrl}
      />

      {/* ===== SECTION 6: Testimonials ===== */}
      <TestimonialsSection
        feedbackList={feedbackList}
        user={user}
        isAdmin={isAdmin}
        onOpenModal={() => user ? setFeedbackModalOpen(true) : navigate('/signin')}
        onDelete={handleDeleteFeedback}
      />

      {/* ===== SECTION 7: FAQ ===== */}
      <FaqSection
        faqEntries={faqEntries}
        activeFaqIndex={activeFaqIndex}
        setActiveFaqIndex={setActiveFaqIndex}
      />

      {/* ===== SECTION 8: CTA ===== */}
      <CtaSection />

      {/* ===== Footer ===== */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030712]">
        <Footer />
      </footer>

      {/* Feedback Modal */}
      <AnimatePresence>
        {user && isFeedbackModalOpen && (
          <FeedbackModal
            feedbackForm={feedbackForm}
            feedbackMessage={feedbackMessage}
            feedbackSubmitting={feedbackSubmitting}
            onClose={() => setFeedbackModalOpen(false)}
            onInput={handleFeedbackInput}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   HERO SECTION - Animated Aurora Background
============================================ */
function HeroSection() {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // 0-1 range, center default
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Direct mouse tracking (0-1 range for position on screen)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1a]">

      {/* Main gradient that follows mouse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(34, 211, 238, 0.15) 0%,
            rgba(59, 130, 246, 0.1) 25%,
            rgba(99, 102, 241, 0.08) 50%,
            transparent 70%)`,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
      />

      {/* Secondary color bloom that follows mouse with delay */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: (mousePos.x - 0.5) * window.innerWidth * 0.5,
          y: (mousePos.y - 0.5) * window.innerHeight * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />

      {/* Ambient glow - top left */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, transparent 60%)',
          filter: 'blur(80px)',
          left: '-5%',
          top: '-10%',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ambient glow - bottom right */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          filter: 'blur(70px)',
          right: '-5%',
          bottom: '-5%',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
      </div>

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,15,26,0.4) 80%, rgba(10,15,26,0.7) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase">
            Welcome to the community
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-6xl sm:text-7xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tight mb-8"
        >
          <span className="block">JTech</span>
          <motion.span
            className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Forums
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          The leading Jewish tech & filtering community.
          <span className="text-slate-500 block mt-2">Built by the community, for the community.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="https://forums.jtechforums.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-cyan-500/25"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34,211,238,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Join the Forum</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/guides"
              className="block px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              Browse Guides
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-3 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================
   PROBLEM SECTION - Dramatic zoom reveal
============================================ */
function ProblemSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [3, 0]);
  const textX = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-slate-900/50 to-[#030712]" />

      {/* Red warning glow */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[150px]"
        style={{ opacity }}
      />

      <motion.div style={{ scale, opacity }} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with zoom */}
          <motion.div className="relative" style={{ scale: imageScale, rotate: imageRotate }}>
            <div className="relative rounded-3xl overflow-hidden border border-red-500/20 shadow-2xl shadow-red-500/10">
              <img src="/img/home/techie.png" alt="Confused user" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -bottom-4 -right-4 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2 backdrop-blur-xl"
            >
              <motion.span
                className="text-red-400 font-mono text-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ??? Help ???
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Text with slide */}
          <motion.div style={{ x: textX }} className="space-y-6">
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-red-400 font-mono text-sm tracking-[0.2em] uppercase"
            >
              The Problem
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight"
            >
              Tech forums can be
              <span className="text-red-400"> overwhelming</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 text-lg text-slate-400 leading-relaxed"
            >
              <p>
                Reddit threads go off-topic. XDA posts get buried. Stack Overflow feels intimidating.
                And none of them understand the unique needs of the frum community.
              </p>
              <p>
                You just want a straight answer about setting up a kosher phone—without wading through
                inappropriate content or irrelevant advice.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {['Off-topic noise', 'Inappropriate content', 'Outdated info', 'No moderation'].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-300 text-sm"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================
   SOLUTION SECTION - Browser mockup zoom in
============================================ */
function SolutionSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.6, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [20, 0]);

  return (
    <section ref={ref} className="relative min-h-[130vh] flex items-center py-32 overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-cyan-500/10 blur-[200px]"
        style={{ opacity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div style={{ opacity, y }} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase mb-4"
          >
            The Solution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto"
          >
            A forum built for
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"> our community</span>
          </motion.h2>
        </motion.div>

        <motion.div
          style={{ scale, rotateX, transformPerspective: 1200 }}
          className="relative"
        >
          {/* Browser mockup */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/20">
            {/* Browser bar */}
            <div className="bg-slate-800/90 px-4 py-3 flex items-center gap-3 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 bg-slate-900/50 rounded-lg px-4 py-1.5 text-sm text-slate-400 font-mono">
                forums.jtechforums.org
              </div>
            </div>
            {/* Screenshot */}
            <img src="/img/forum.png" alt="JTech Forums" className="w-full" />
          </div>

          {/* Floating feature cards */}
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="absolute -left-12 top-1/4 bg-slate-900/95 border border-green-500/20 rounded-2xl p-5 backdrop-blur-xl shadow-xl hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-2xl">✓</span>
              </div>
              <div>
                <p className="text-white font-semibold">Moderated Daily</p>
                <p className="text-slate-400 text-sm">By frum volunteers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="absolute -right-12 bottom-1/3 bg-slate-900/95 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-xl shadow-xl hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-2xl">📱</span>
              </div>
              <div>
                <p className="text-white font-semibold">Kosher-First</p>
                <p className="text-slate-400 text-sm">Family-friendly content</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-indigo-500/20 rounded-2xl px-6 py-4 backdrop-blur-xl shadow-xl hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 text-xl">🔒</span>
              <p className="text-white font-semibold">Safe & Trusted Community</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   HORIZONTAL SCROLL FEATURES SECTION
============================================ */
gsap.registerPlugin(ScrollTrigger);

function FeaturesSection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const cardsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: 'Step-by-Step Guides',
      description: 'Detailed walkthroughs for every device and setup. From flip phones to smartphones, we\'ve got you covered.',
      image: '/img/guides.png',
      color: 'cyan',
      link: '/guides',
    },
    {
      title: 'Curated App Library',
      description: 'Trusted, safe apps vetted by the community. No mystery APKs—just apps that work.',
      image: '/img/home/gps.webp',
      color: 'green',
      link: '/apps',
    },
    {
      title: 'eGate Filter Support',
      description: 'Enterprise-grade filtering solutions with dedicated community support and setup guides.',
      image: '/img/home/egatesquare.png',
      color: 'indigo',
      link: '/egate',
    },
    {
      title: 'Filter Installer',
      description: 'A simple place to install all kosher MDMs, simplified for even someone without any filtering knowledge.',
      image: '/img/home/mdm-installer.png',
      color: 'violet',
      link: 'https://installer.jtechforums.org/',
      external: true,
      hasBackground: true,
    },
  ];

  const colorMap = {
    cyan: { border: 'border-cyan-500/30', glow: 'bg-cyan-500/30', text: 'text-cyan-400' },
    green: { border: 'border-green-500/30', glow: 'bg-green-500/30', text: 'text-green-400' },
    indigo: { border: 'border-indigo-500/30', glow: 'bg-indigo-500/30', text: 'text-indigo-400' },
    violet: { border: 'border-violet-500/30', glow: 'bg-violet-500/30', text: 'text-violet-400' },
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    // Calculate how far to scroll horizontally
    const getScrollAmount = () => {
      const cardsWidth = cards.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(cardsWidth - viewportWidth + viewportWidth * 0.05);
    };

    const ctx = gsap.context(() => {
      // Base scroll distance for horizontal movement
      const baseScrollDistance = Math.abs(getScrollAmount());
      // Add extra scroll distance for pause at end (1700px worth of scrolling where nothing moves)
      const totalScrollDistance = baseScrollDistance + 1700;

      // Use a custom ease that stops the animation at ~85% progress
      // This means the last 15% of scrolling will have no horizontal movement (pause effect)
      gsap.to(cards, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${totalScrollDistance}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Calculate effective progress - movement stops at 85%
            const moveProgress = Math.min(self.progress / 0.85, 1);

            // Update active index based on movement progress
            const newIndex = Math.min(
              features.length - 1,
              Math.floor(moveProgress * features.length)
            );
            setActiveIndex(newIndex);

            // Manually clamp the x position so it doesn't overshoot
            if (self.progress > 0.85) {
              gsap.set(cards, { x: getScrollAmount() });
            }
          },
          onLeave: () => {
            // Refresh ScrollTrigger when leaving to fix downstream section calculations
            ScrollTrigger.refresh();
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [features.length]);

  return (
    <section ref={sectionRef} className="relative">
      <div ref={triggerRef} className="h-screen flex items-center overflow-hidden bg-[#030712]">
        {/* Header */}
        <div className="absolute top-16 left-0 right-0 z-10 text-center px-6">
          <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase mb-2">What You'll Find</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Everything in one place</h2>
        </div>

        {/* Horizontal scrolling cards */}
        <div ref={cardsRef} className="flex gap-6 pl-[5%]">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[45vw] h-[65vh] flex items-center"
            >
              <div className="w-full grid lg:grid-cols-5 gap-6 lg:gap-10 items-center">
                {/* Image - takes 3 columns - all boxes same size */}
                <div className="lg:col-span-3 relative">
                  <div className={`absolute -inset-8 ${colorMap[feature.color].glow} blur-[60px] opacity-40`} />
                  <div className={`relative rounded-2xl overflow-hidden border ${colorMap[feature.color].border} shadow-2xl h-[280px] sm:h-[320px] lg:h-[360px] ${feature.hasBackground ? 'bg-gradient-to-br from-slate-900 via-violet-950/50 to-slate-900' : ''}`}>
                    {index === 0 ? (
                      /* Box 1: Scrolling animation - image taller than container */
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full animate-pan-vertical"
                      />
                    ) : feature.hasBackground ? (
                      /* Box 4: Centered smaller image with background */
                      <div className="flex items-center justify-center h-full p-10">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="max-h-[65%] max-w-[65%] object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                        />
                      </div>
                    ) : (
                      /* Boxes 2 & 3: Standard full cover */
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* Number badge */}
                  <div className={`absolute -top-4 -left-4 w-14 h-14 rounded-xl bg-slate-900/90 border ${colorMap[feature.color].border} flex items-center justify-center backdrop-blur-xl`}>
                    <span className={`text-2xl font-bold ${colorMap[feature.color].text}`}>0{index + 1}</span>
                  </div>
                </div>

                {/* Text - takes 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.external ? (
                    <a
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 ${colorMap[feature.color].text} font-semibold hover:opacity-80 transition-opacity`}
                    >
                      <span>Explore</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={feature.link}
                      className={`inline-flex items-center gap-2 ${colorMap[feature.color].text} font-semibold hover:opacity-80 transition-opacity`}
                    >
                      <span>Explore</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
                index <= activeIndex ? 'bg-cyan-400 opacity-100' : 'bg-cyan-400 opacity-30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   COMMUNITY SECTION - Uses GSAP ScrollTrigger for animations
============================================ */
function CommunitySection({ adminProfiles, leaderboardState, forumBaseUrl }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const adminCardsRef = useRef([]);
  const leaderboardCardsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: () => setIsVisible(true),
          },
        }
      );

      // Left column slide in
      gsap.fromTo(leftColRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Right column slide in
      gsap.fromTo(rightColRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Admin cards stagger
      gsap.fromTo(adminCardsRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Animate leaderboard cards when data loads
  useLayoutEffect(() => {
    if (leaderboardState.status !== 'ready' || !isVisible) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(leaderboardCardsRef.current.filter(Boolean),
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
        }
      );
    });

    return () => ctx.revert();
  }, [leaderboardState.status, isVisible]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-indigo-950/20 to-[#030712]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16 opacity-0">
          <p className="text-indigo-400 font-mono text-sm tracking-[0.2em] uppercase mb-4">The People</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            You're in good hands
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Admins */}
          <div ref={leftColRef} className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm opacity-0">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl">👤</span>
              Forum Leaders
            </h3>
            <div className="space-y-4">
              {adminProfiles.map((admin, i) => (
                <a
                  key={admin.name}
                  ref={el => adminCardsRef.current[i] = el}
                  href={admin.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-indigo-500/30 hover:scale-[1.02] hover:translate-x-2 transition-all group opacity-0"
                >
                  <img src={admin.avatar} alt={admin.name} className="w-14 h-14 rounded-xl object-cover" crossOrigin="anonymous" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{admin.name}</p>
                    <p className="text-sm text-slate-500">{admin.handle}</p>
                    <p className="text-sm text-slate-400 mt-1">{admin.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div ref={rightColRef} className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm opacity-0">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl">🏆</span>
              Top Contributors
            </h3>
            <div className="space-y-4">
              {leaderboardState.status === 'loading' && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-slate-800/50 animate-pulse" />
                  ))}
                </div>
              )}
              {leaderboardState.status === 'ready' && leaderboardState.entries.map((entry, i) => (
                <a
                  key={entry.id}
                  ref={el => leaderboardCardsRef.current[i] = el}
                  href={entry.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-amber-500/30 hover:scale-[1.02] hover:-translate-x-2 transition-all group opacity-0"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    'bg-orange-600/20 text-orange-400'
                  }`}>
                    #{entry.position}
                  </div>
                  <img src={entry.avatar} alt={entry.username} className="w-12 h-12 rounded-xl object-cover" crossOrigin="anonymous" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-amber-300 transition-colors">@{entry.username}</p>
                    <p className="text-sm text-slate-400">{entry.cheers.toLocaleString()} cheers</p>
                  </div>
                </a>
              ))}
              {leaderboardState.status === 'error' && (
                <p className="text-slate-400 text-center py-8">Unable to load leaderboard</p>
              )}
            </div>
            <a
              href={`${forumBaseUrl}/leaderboard/${LEADERBOARD_ID}?period=${LEADERBOARD_PERIOD}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-indigo-400 hover:text-indigo-300 mt-6 transition-colors"
            >
              View full leaderboard →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS SECTION - Uses GSAP ScrollTrigger for animations
============================================ */
function TestimonialsSection({ feedbackList, user, isAdmin, onOpenModal, onDelete }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards stagger animation
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 60, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [feedbackList]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-slate-900/30 to-[#030712]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 opacity-0">
          <div>
            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase mb-4">Community Stories</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Real feedback
            </h2>
          </div>
          <button
            onClick={onOpenModal}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-semibold hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            {user ? 'Share your story' : 'Sign in to share'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackList.map((entry, i) => (
            <article
              key={entry.id}
              ref={el => cardsRef.current[i] = el}
              className="relative bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-cyan-500/20 hover:-translate-y-2 hover:scale-[1.02] transition-all group opacity-0"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {isAdmin && entry.fromFirestore && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="absolute top-4 right-4 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              )}
              <p className="text-cyan-400/60 font-mono text-xs uppercase tracking-wider mb-4">{entry.context}</p>
              <p className="text-slate-200 text-lg leading-relaxed mb-6">{entry.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center text-white font-bold">
                  {entry.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{entry.name}</p>
                  <p className="text-sm text-slate-500">{entry.handle}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FAQ SECTION - Uses GSAP ScrollTrigger for animations
============================================ */
function FaqSection({ faqEntries, activeFaqIndex, setActiveFaqIndex }) {
  const displayedFaqs = faqEntries.slice(0, 6);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const faqItemsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // FAQ items stagger with alternating direction
      faqItemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.08,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [displayedFaqs.length]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] to-slate-900/50" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12 opacity-0">
          <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Quick answers
          </h2>
        </div>

        <div className="space-y-4">
          {displayedFaqs.map((faq, i) => (
            <div
              key={i}
              ref={el => faqItemsRef.current[i] = el}
              className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden opacity-0"
            >
              <button
                onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <span
                  className={`text-cyan-400 text-xl flex-shrink-0 transition-transform duration-300 ${activeFaqIndex === i ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {activeFaqIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 text-slate-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CTA SECTION - Uses GSAP ScrollTrigger for animations
============================================ */
function CtaSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const highlightRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content container scale and fade
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Heading
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Highlight text
      gsap.fromTo(highlightRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Description
      gsap.fromTo(descRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Buttons
      gsap.fromTo(buttonsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full bg-cyan-500/20 blur-[200px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center opacity-0">
        <div className="space-y-8">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <span ref={headingRef} className="block opacity-0">Ready to join the</span>
            <span
              ref={highlightRef}
              className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent opacity-0"
            >
              community?
            </span>
          </h2>
          <p ref={descRef} className="text-xl text-slate-400 max-w-2xl mx-auto opacity-0">
            Thousands of community members are already sharing guides, troubleshooting setups, and helping each other stay connected—safely.
          </p>
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center pt-4 opacity-0">
            <a
              href="https://forums.jtechforums.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="relative z-10">Join JTech Forums</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </a>
            <Link
              to="/contact"
              className="block px-10 py-5 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/5 hover:border-white/40 hover:scale-105 active:scale-95 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FEEDBACK MODAL
============================================ */
function FeedbackModal({ feedbackForm, feedbackMessage, feedbackSubmitting, onClose, onInput, onSubmit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Share your feedback</h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            &times;
          </motion.button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Display name</label>
            <input
              name="name"
              value={feedbackForm.name}
              onChange={onInput}
              placeholder="e.g. Usher W."
              maxLength={MAX_FEEDBACK_NAME}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Setup context</label>
            <input
              name="context"
              value={feedbackForm.context}
              onChange={onInput}
              placeholder="e.g. Pixel 8a + TAG Guardian"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Your feedback</label>
            <textarea
              name="quote"
              value={feedbackForm.quote}
              onChange={onInput}
              rows={4}
              placeholder="Share your experience..."
              maxLength={MAX_FEEDBACK_LENGTH}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              {feedbackForm.quote.length < MIN_FEEDBACK_LENGTH
                ? `${MIN_FEEDBACK_LENGTH - feedbackForm.quote.length} more characters needed`
                : `${MAX_FEEDBACK_LENGTH - feedbackForm.quote.length} characters remaining`}
            </p>
          </div>

          {feedbackMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-cyan-400"
            >
              {feedbackMessage}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={feedbackSubmitting || feedbackForm.quote.trim().length < MIN_FEEDBACK_LENGTH || !feedbackForm.name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
