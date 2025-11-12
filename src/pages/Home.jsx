import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';

const heroStats = [
  { value: '32k+', label: 'Threads answered' },
  { value: '5.1k', label: 'Active helpers' },
  { value: '24/6', label: 'Live dispatch' },
];

const dispatchFeed = [
  {
    tag: 'Phones',
    title: 'Qin F21 shipped with patched launcher',
    note: 'Use MDN Installer v3.2 to keep Hebrew keyboard.',
    time: '18:42',
  },
  {
    tag: 'Filtering',
    title: 'eGate beta enables multi-profile',
    note: 'Toggle the Layers flag for patrons before rollout.',
    time: '15:20',
  },
  {
    tag: 'Deployment',
    title: 'Yeshiva lockdown template updated',
    note: 'New VLAN map + Wi-Fi reminders poster.',
    time: '09:05',
  },
];

const resourceCards = [
  {
    title: 'Community Forum',
    body:
      'Ask questions, explore guides, and help others. Threads are moderated so every answer stays accurate and respectful.',
    cta: 'Join now →',
    href: 'https://forums.jtechforums.org',
  },
  {
    title: 'Guides Library',
    body:
      'We mirror the forum’s best walkthroughs—flashing firmware, configuring filters, onboarding families, and more.',
    cta: 'View guides →',
    href: '/guides',
  },
];

const previewPosts = [
  {
    title: 'Beginner’s guide to getting started',
    tag: 'Guide',
    blurb: 'A friendly checklist that walks brand-new members through phones, filters, and terminology.',
  },
  {
    title: 'What is ADB and how do I use it?',
    tag: 'Android guide',
    blurb: 'Explains how to control a phone from a computer so you can tweak launches without touching the device.',
  },
  {
    title: 'What is the eGate filter?',
    tag: 'eGate',
    blurb: 'Breaks down how the MDM works, why it’s hard to bypass, and how resellers stay compliant.',
  },
  {
    title: 'Beginner questions megathread',
    tag: 'Community',
    blurb: 'No judgment zone for parents, mechanchim, and MSPs who need fast help.',
  },
];

const adminProfiles = [
  {
    name: 'Usher Weiss',
    handle: '@TripleU',
    role: 'Forums Owner & Maintainer',
    avatar: '/img/appslist.png',
  },
  {
    name: 'Avrumi Sternheim',
    handle: '@ars18',
    role: 'Forums Admin & Moderator',
    avatar: '/img/home/android.png',
  },
  {
    name: 'Offline Software Solutions',
    handle: '@flipadmin',
    role: 'Forum Founder & Developer',
    avatar: '/img/home/reseller.png',
  },
];

const statsSnapshot = [
  { label: 'Signups last month', value: '305+' },
  { label: 'Page visits', value: '100k+' },
  { label: 'Posts last month', value: '15k+' },
  { label: 'User visits', value: '1.6k+' },
];

const testimonials = [
  {
    quote:
      '“I was stuck configuring a flip phone. A forum volunteer and the published guide walked me through every command. Problem solved before lunch.”',
    author: '@Simple_Yid · Forum member',
  },
  {
    quote:
      '“JTech MDM Installer saved us thousands. We can flash filters in-house without chasing paid installers.”',
    author: '@Chevra_Man · Forum member',
  },
  {
    quote:
      '“When Apps4Flip closed we needed a replacement fast. JTech became the trustworthy source for kosher tech.”',
    author: '@kosherboy · Moderator',
  },
];

const faqs = [
  {
    question: 'Is JTech only for techies?',
    answer:
      'It’s a moderated space for the Orthodox community to discuss kosher technology, share guides, and request help without noise.',
  },
  {
    question: 'What type of information can I find?',
    answer:
      'Guides, firmware, scripts, app recommendations, policy templates, and daily status updates from real deployments.',
  },
  {
    question: 'How do I contact moderators?',
    answer:
      'Sign in to the forum, open the Users tab, and direct-message any listed moderator or admin. You can also use the contact form.',
  },
];

const fallbackLeaders = [
  { username: '@TripleU', points: 1280, avatar: '/img/whitelogo.png' },
  { username: '@ars18', points: 940, avatar: '/img/home/metadata.png' },
  { username: '@flipadmin', points: 775, avatar: '/img/home/lines.png' },
];

export default function Home() {
  const leaderboardUrl = import.meta.env.VITE_FORUM_LEADERBOARD_ENDPOINT;
  const leaderboardKey = import.meta.env.VITE_FORUM_API_KEY;
  const [leaders, setLeaders] = useState(fallbackLeaders);
  const [leaderLoading, setLeaderLoading] = useState(Boolean(leaderboardUrl));

  useEffect(() => {
    if (!leaderboardUrl) {
      setLeaderLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchLeaders = async () => {
      try {
        const response = await fetch(leaderboardUrl, {
          headers: leaderboardKey ? { 'x-api-key': leaderboardKey } : undefined,
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Leaderboard request failed');
        const payload = await response.json();
        if (Array.isArray(payload?.leaders)) {
          setLeaders(
            payload.leaders.slice(0, 3).map((entry, index) => ({
              username: entry.username || ('@helper' + (index + 1)),
              points: entry.points ?? entry.score ?? 0,
              avatar: entry.avatar || fallbackLeaders[index]?.avatar,
            }))
          );
        }
      } catch (error) {
        console.warn('Unable to load leaderboard', error);
      } finally {
        setLeaderLoading(false);
      }
    };

    fetchLeaders();
    return () => controller.abort();
  }, [leaderboardUrl, leaderboardKey]);

  return (
    <Reveal as="div" className="space-y-20">
      <section className="relative isolate overflow-hidden bg-slate-950 px-6 pt-20 pb-24">
        <img src="/img/phonegrid.png" alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-20" />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <p className="section-label text-xs uppercase text-sky-300">Community resources</p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">The leading Jewish filtering & tech forum.</h1>
            <p className="text-lg text-slate-300">
              JTech empowers the community with precise, current filtering intel—phones, firmware, eGate scripts, hashkafic guardrails, and support lines.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href="https://forums.jtechforums.org"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Jump into the forum
              </a>
              <a
                href="/guides"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:border-white/60"
              >
                Browse guides
              </a>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 text-sm text-white shadow-2xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-300">
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 font-semibold text-emerald-200">Live radar</span>
              <span>Deploy status • Q4</span>
            </div>
            <div className="mt-6 space-y-4">
              {dispatchFeed.map(({ tag, title, note, time }) => (
                <div key={title} className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    <span>{tag}</span>
                    <span>{time}</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-300">{note}</p>
                </div>
              ))}
            </div>
            <img src="/img/home/android.png" alt="Live build" className="mt-6 h-60 w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {resourceCards.map((card) => (
            <GlassCard key={card.title} title={card.title} description={card.body}>
              <a href={card.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                {card.cta}
              </a>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Forum preview" title="Guides people are reading right now" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {previewPosts.map((post) => (
            <GlassCard key={post.title} eyebrow={post.tag} title={post.title} description={post.blurb} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Moderation team" title="Meet our admins" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {adminProfiles.map((admin) => (
            <div key={admin.name} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <img src={admin.avatar} alt={admin.name} className="mx-auto h-16 w-16 rounded-full object-cover" />
              <p className="mt-4 text-lg font-semibold text-white">{admin.name}</p>
              <p className="text-sm text-sky-300">{admin.handle}</p>
              <p className="mt-2 text-sm text-slate-300">{admin.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Leaderboard" title="Helpers keeping the forum running" />
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          {leaderLoading ? (
            <p className="text-sm text-slate-300">Fetching latest leaderboard…</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {leaders.map((leader) => (
                <div key={leader.username} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <img src={leader.avatar} alt={leader.username} className="mx-auto h-14 w-14 rounded-full object-cover" />
                  <p className="mt-3 text-base font-semibold text-white">{leader.username}</p>
                  <p className="text-sm text-slate-300">{leader.points} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Quick search" title="Find what you need instantly" />
        <form
          action={import.meta.env.VITE_FORUM_SEARCH_URL || 'https://forums.jtechforums.org/search'}
          method="get"
          className="mt-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white md:flex-row"
        >
          <input
            type="search"
            name="q"
            required
            placeholder="Search the forum..."
            className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
          <button type="submit" className="rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-sky-400">
            Search
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Stats" title="Forum health at a glance" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsSnapshot.map((stat) => (
            <GlassCard key={stat.label} title={stat.value} description={stat.label} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Testimonials" title="What our members are saying" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.author}>
              <p className="text-sm text-slate-200">{item.quote}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">{item.author}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="glass-panel rounded-4xl border border-white/10 bg-slate-950/80 p-8">
          <SectionHeading label="FAQ" title="Frequently asked questions" />
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-white/5 bg-slate-900/60 p-5">
                <summary className="cursor-pointer text-lg font-semibold text-white">{faq.question}</summary>
                <p className="mt-3 text-sm text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="glass-panel flex flex-col items-center gap-6 rounded-4xl border border-white/10 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 px-8 py-12 text-center">
          <p className="section-label text-xs uppercase text-sky-200">Next step</p>
          <h2 className="text-3xl font-semibold text-white">Join our community forum today</h2>
          <p className="text-base text-slate-200">
            Ask questions, find answers, explore in-depth guides, and help the next person ship a kosher device the right way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://forums.jtechforums.org"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Join now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:border-white/70"
            >
              Request a walkthrough
            </a>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
