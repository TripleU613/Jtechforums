import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Footer from '../components/Footer';
import { fetchForumApi, getForumWebBase } from '../lib/forumApi';
import { firestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import faqEntries from '../data/faqEntries';

const forumBaseUrl = getForumWebBase();

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

const LEADERBOARD_ID = 6;
const LEADERBOARD_PERIOD = 'monthly';
const LEADERBOARD_LIMIT = 3;

const MIN_FEEDBACK_LENGTH = 40;
const MAX_FEEDBACK_LENGTH = 600;
const MAX_FEEDBACK_NAME = 32;

export default function HomeMobile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isAdmin = Boolean(profile?.isAdmin);

  const [feedbackEntries, setFeedbackEntries] = useState(feedbackShowcase);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', context: '', quote: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [leaderboardState, setLeaderboardState] = useState({ entries: [], status: 'idle', error: '' });

  // Load feedback
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
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().authorDisplayName || docSnap.data().authorName || 'Forum member',
          handle: docSnap.data().authorHandle || '@community',
          context: docSnap.data().context || 'Shared setup',
          quote: docSnap.data().quote || '',
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
    try { await deleteDoc(doc(firestore, 'feedback', entryId)); } catch {}
  }, [isAdmin]);

  const feedbackList = feedbackStatus === 'ready' ? feedbackEntries : feedbackShowcase;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(/img/home/phonegrid.png)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/60 to-[#030712]" />
        </div>

        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/20 blur-[100px]" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <p className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase mb-4">Welcome to the community</p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            <span className="block">JTech</span>
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Forums</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-sm mx-auto">
            The leading Jewish tech & filtering community.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://forums.jtechforums.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full"
            >
              Join the Forum
            </a>
            <a
              href="/guides"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full"
            >
              Browse Guides
            </a>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-red-400 font-mono text-xs tracking-[0.2em] uppercase">The Problem</p>
          <h2 className="font-display text-3xl font-bold text-white leading-tight">
            Tech forums can be <span className="text-red-400">overwhelming</span>
          </h2>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img src="/img/home/techie.png" alt="Confused user" className="w-full" referrerPolicy="no-referrer" />
          </div>
          <p className="text-slate-400 leading-relaxed">
            Reddit threads go off-topic. XDA posts get buried. And none of them understand the unique needs of the frum community.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Off-topic noise', 'Inappropriate content', 'Outdated info'].map((item) => (
              <span key={item} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-300 text-xs">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase">The Solution</p>
          <h2 className="font-display text-3xl font-bold text-white leading-tight">
            A forum built for <span className="text-cyan-400">our community</span>
          </h2>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-cyan-500/10">
            <img src="/img/forum.png" alt="JTech Forums" className="w-full" referrerPolicy="no-referrer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
              <span className="text-green-400 text-lg">✓</span>
              <p className="text-white font-semibold text-sm mt-2">Moderated Daily</p>
              <p className="text-slate-400 text-xs">By frum volunteers</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
              <span className="text-blue-400 text-lg">📱</span>
              <p className="text-white font-semibold text-sm mt-2">Kosher-First</p>
              <p className="text-slate-400 text-xs">Family-friendly</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-4">What You'll Find</p>
        <h2 className="font-display text-3xl font-bold text-white mb-8">Everything in one place</h2>

        <div className="space-y-8">
          {[
            { title: 'Step-by-Step Guides', image: '/img/guides.png', desc: 'Detailed walkthroughs for every device and setup.' },
            { title: 'Curated App Library', image: '/img/home/gps.webp', desc: 'Trusted, safe apps vetted by the community.' },
            { title: 'eGate Filter Support', image: '/img/home/egatesquare.png', desc: 'Enterprise-grade filtering solutions.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src={feature.image} alt={feature.title} className="w-full" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
        <p className="text-indigo-400 font-mono text-xs tracking-[0.2em] uppercase mb-4">The People</p>
        <h2 className="font-display text-3xl font-bold text-white mb-8">You're in good hands</h2>

        {/* Admins */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">👤</span> Forum Leaders
          </h3>
          <div className="space-y-3">
            {adminProfiles.map((admin) => (
              <a
                key={admin.name}
                href={admin.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5"
              >
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-12 h-12 rounded-xl object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold text-white text-sm">{admin.name}</p>
                  <p className="text-xs text-slate-400">{admin.role}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">🏆</span> Top Contributors
          </h3>
          <div className="space-y-3">
            {leaderboardState.status === 'loading' && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            )}
            {leaderboardState.status === 'ready' && leaderboardState.entries.map((entry, i) => (
              <a
                key={entry.id}
                href={entry.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-slate-400/20 text-slate-300' :
                  'bg-orange-600/20 text-orange-400'
                }`}>
                  #{entry.position}
                </div>
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-10 h-10 rounded-xl object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold text-white text-sm">@{entry.username}</p>
                  <p className="text-xs text-slate-400">{entry.cheers.toLocaleString()} cheers</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-2">Community Stories</p>
            <h2 className="font-display text-2xl font-bold text-white">Real feedback</h2>
          </div>
          <button
            onClick={() => user ? setFeedbackModalOpen(true) : navigate('/signin')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm font-semibold"
          >
            Share
          </button>
        </div>

        <div className="space-y-4">
          {feedbackList.slice(0, 3).map((entry) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-slate-900/50 border border-white/5 rounded-2xl p-5"
            >
              {isAdmin && entry.fromFirestore && (
                <button
                  onClick={() => handleDeleteFeedback(entry.id)}
                  className="absolute top-3 right-3 text-xs text-red-400"
                >
                  Remove
                </button>
              )}
              <p className="text-cyan-400/60 font-mono text-xs uppercase tracking-wider mb-3">{entry.context}</p>
              <p className="text-slate-200 leading-relaxed mb-4">{entry.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center text-white font-bold text-sm">
                  {entry.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.handle}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-transparent to-slate-900/30">
        <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-4">FAQ</p>
        <h2 className="font-display text-2xl font-bold text-white mb-6">Quick answers</h2>

        <div className="space-y-3">
          {faqEntries.slice(0, 5).map((faq, i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-white text-sm pr-4">{faq.question}</span>
                <motion.span
                  animate={{ rotate: activeFaqIndex === i ? 45 : 0 }}
                  className="text-cyan-400 text-lg flex-shrink-0"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {activeFaqIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative space-y-6"
          >
            <h2 className="font-display text-3xl font-bold text-white leading-tight">
              Ready to join the <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">community?</span>
            </h2>
            <p className="text-slate-400">Thousands of members are already helping each other stay connected—safely.</p>
            <div className="flex flex-col gap-3 pt-4">
              <a
                href="https://forums.jtechforums.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full"
              >
                Join JTech Forums
              </a>
              <a href="/contact" className="px-8 py-4 border border-white/20 text-white font-bold rounded-full">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <Footer />
      </footer>

      {/* Feedback Modal */}
      <AnimatePresence>
        {user && isFeedbackModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setFeedbackModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-slate-900 border-t border-white/10 rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-6">Share your feedback</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Display name</label>
                  <input
                    name="name"
                    value={feedbackForm.name}
                    onChange={handleFeedbackInput}
                    placeholder="e.g. Usher W."
                    maxLength={MAX_FEEDBACK_NAME}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Setup context</label>
                  <input
                    name="context"
                    value={feedbackForm.context}
                    onChange={handleFeedbackInput}
                    placeholder="e.g. Pixel 8a + TAG Guardian"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Your feedback</label>
                  <textarea
                    name="quote"
                    value={feedbackForm.quote}
                    onChange={handleFeedbackInput}
                    rows={3}
                    placeholder="Share your experience..."
                    maxLength={MAX_FEEDBACK_LENGTH}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {feedbackForm.quote.length < MIN_FEEDBACK_LENGTH
                      ? `${MIN_FEEDBACK_LENGTH - feedbackForm.quote.length} more characters needed`
                      : `${MAX_FEEDBACK_LENGTH - feedbackForm.quote.length} remaining`}
                  </p>
                </div>
                {feedbackMessage && <p className="text-sm text-cyan-400">{feedbackMessage}</p>}
                <button
                  type="submit"
                  disabled={feedbackSubmitting || feedbackForm.quote.trim().length < MIN_FEEDBACK_LENGTH || !feedbackForm.name.trim()}
                  className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
