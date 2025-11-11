import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';

const stats = [
  { value: '4.2k+', label: 'Families, yeshivos & IT partners' },
  { value: '180+', label: 'Curated devices & filter stacks' },
  { value: '24/6', label: 'Signal from real deployments' },
];

const missionCards = [
  {
    icon: 'fa-mobile-screen',
    title: 'Phones & hardware',
    body: 'Profiles for flip, Android, and iOS setups with tested firmware, launchers, and safe defaults.',
    bullets: ['Side-by-side comparisons', 'MDM installers & recovery images', 'Battery + UX optimization tips'],
  },
  {
    icon: 'fa-shield-heart',
    title: 'Filtering intelligence',
    body: 'Recipes for eGate, Netspark, Gentech, and bespoke filters including maintenance scripts.',
    bullets: ['Change logs & regression alerts', 'Allow/deny-lists per demographic', 'Crisis-mode playbooks'],
  },
  {
    icon: 'fa-comments',
    title: 'Support & community',
    body: 'Moderated spaces where mechanchim, parents, and MSPs share wins, fails, and open tickets.',
    bullets: ['Verified responses within hours', 'Field notes from deployments', 'Warm intros to vetted partners'],
  },
];

const signalHighlights = [
  {
    tag: 'Phones',
    title: 'Qin F21 shipped with patched launcher',
    body: 'Use MDN Installer v3.2 to keep Hebrew keyboard.',
    color: 'text-sky-200',
  },
  {
    tag: 'Filtering',
    title: 'eGate beta finally supports multi-profile',
    body: 'Available to forum patrons; add the feature flag “Layers”.',
    color: 'text-emerald-200',
  },
  {
    tag: 'Deployment',
    title: 'Yeshiva network lockdown template',
    body: 'Shared VLAN map + wifi reminders poster (PDF).',
    color: 'text-indigo-200',
  },
];

const featuredGuides = [
  {
    image: '/img/home/egatesquare.png',
    eyebrow: 'Filter stack',
    title: 'Zero-downtime eGate rollout',
    description: 'Blueprint for deploying school-wide filtering with staged automation.',
    href: '/egate',
  },
  {
    image: '/img/apps/eGate.png',
    eyebrow: 'App list',
    title: 'Apps that actually behave on kosher phones',
    description: 'Tested utilities with accessibility, Hebrew, and offline notes.',
    href: '/guides',
  },
  {
    image: '/img/home/reseller.png',
    eyebrow: 'Support',
    title: 'Crisis response cheat-sheet',
    description: 'Escalation tree, communication templates, and verification checklists.',
    href: '/contact',
  },
];

const toolkitIcons = [
  { icon: 'fa-lock', title: 'Policy templates', subtitle: 'For shuls, schools, and SMBs' },
  { icon: 'fa-code', title: 'MDM scripts', subtitle: 'PowerShell + bash installers' },
  { icon: 'fa-user-shield', title: 'Vetted partners', subtitle: 'Technicians, mechanchim, MSPs' },
];

const bundleCards = [
  { title: 'Family pack', description: '5 device licenses + install day kit' },
  { title: 'School launch', description: 'Network map, posters, hotline script' },
];

const integrations = ['GrapheneOS', 'eGate', 'Kosher Launcher', 'Simple Mods', 'Netspark', 'KosherPhone DB'];

const testimonials = [
  {
    eyebrow: 'Voice note',
    title: '“I stopped guessing.”',
    quote: '“Before JTech I was drowning in WhatsApp forwards. Now I open Signal Report, see the verdict, and move on.”',
    author: 'Rabbi Glaser • Mechanech',
  },
  {
    eyebrow: 'Community',
    title: '“Frictionless rollouts.”',
    quote: '“We used the eGate launch kit for 230 devices. Parents felt heard, staff felt equipped.”',
    author: 'Esti T. • School IT lead',
  },
  {
    eyebrow: 'Partner',
    title: '“Better than vendor docs.”',
    quote: '“We reference JTech threads in our SOPs. Real screenshots, real people, real fixes.”',
    author: 'Avi R. • MSP owner',
  },
];

const faqs = [
  {
    question: 'Is JTech only for techies?',
    answer: 'No. Half our members are parents and mechanchim. We translate every recommendation into human terms.',
  },
  {
    question: 'How often is the intel refreshed?',
    answer: 'Moderators post micro-updates daily. Formal briefs ship every Thursday night before Shabbos.',
  },
  {
    question: 'Can I submit my own guide?',
    answer: 'Absolutely. Follow our review template, share reproducible proof, and a moderator will polish it with you.',
  },
  {
    question: 'Do you sell hardware?',
    answer: 'We stay vendor-neutral. Instead we point you to trusted partners and publish evaluation checklists.',
  },
];

export default function Home() {
  return (
    <Reveal as="div" className="space-y-20" amount={0.1}>
      <section className="mx-auto max-w-6xl px-6 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="section-label text-xs uppercase text-sky-300">Community-first filtering intel</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Shaping kosher tech that people actually enjoy using.
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              JTech distills nonstop experimentation from power users, mechanchim, resellers, and IT leads into clear playbooks.
              Build a safer digital experience without sacrificing polish or productivity.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://jtechforums.org"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Join the Forum
              </a>
              <a
                href="/guides"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:border-white/50"
              >
                Browse Guides
              </a>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel relative overflow-hidden rounded-3xl p-8">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full bg-green-500/10 px-3 py-1 font-semibold text-green-300">Live Radar</span>
                <span>Deploy status • Q4</span>
              </div>
              <p className="mt-6 text-2xl font-semibold text-white">Pixel 8a + eGate stack</p>
              <p className="mt-3 text-sm text-slate-400">0 escalations · Battery +18% vs legacy build</p>
              <div className="mt-8 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Policy push</span>
                  <span>18:42</span>
                </div>
                <p className="mt-2 text-base font-medium text-white">Updated LMS allowlist for South Campus (125 users).</p>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Support</span>
                  <span>15:03</span>
                </div>
                <p className="mt-2 text-base font-medium text-white">Unblocked navigation buttons on KosherLauncher build.</p>
              </div>
              <img src="/img/home/android.png" alt="Custom Android build" className="mt-8 h-64 w-full rounded-2xl object-cover" />
              <div className="absolute -right-4 top-8 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg">
                97% user satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label="What we solve"
            title="Everything kosher mobile in one playbook"
            description="We obsess over phones, filters, app stores, governance, and support so you can focus on people."
          />
          <a href="/about" className="inline-flex items-center gap-3 text-sm font-semibold text-sky-300 hover:text-white">
            Learn how we operate
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {missionCards.map((card) => (
            <GlassCard key={card.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                <i className={`fa-solid ${card.icon} text-xl`}></i>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{card.body}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="glass-panel grid gap-6 rounded-4xl border border-white/10 p-8 shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              label="Signal report"
              title="Latest reads from the field"
              description="Moderators publish concise briefs so you can see what changed without scrolling 600 replies."
            />
            <div className="mt-8 space-y-5 text-sm text-slate-300">
              {signalHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
                  <p className={`text-xs uppercase tracking-[0.3em] ${item.color}`}>{item.tag}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <GlassCard title="Inside the kosher Pixel lab" eyebrow="Deep dive">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Field note</span>
                <span>13 min read</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                How we layered GrapheneOS with curated launchers, biometric guardrails, and Hebrew UX while keeping support painless.
              </p>
              <a href="/guides" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                Read the teardown <i className="fa-solid fa-arrow-right"></i>
              </a>
              <img src="/img/home/techie.png" alt="Pixel teardown" className="mt-6 h-52 w-full rounded-2xl object-cover" />
            </GlassCard>
            <GlassCard title="Town hall: What broke last week?" eyebrow="Audio recap">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Community voice</span>
                <span>6 min</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                A quick rundown of AppBlock changes, new SIM swaps, and how the mod team responded.
              </p>
              <audio controls className="mt-4 w-full rounded-full">
                <source src="/img/home/qinf21.mp4" type="audio/mp4" />
                Your browser does not support the audio element.
              </audio>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            label="Featured guides"
            title="Actionable docs maintained by the community"
            description="Every guide includes context, risk callouts, and rollback steps so you can ship confidently."
          />
          <a href="/guides" className="text-sm font-semibold text-sky-300 hover:text-white">
            View all resources →
          </a>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {featuredGuides.map((guide) => (
            <GlassCard key={guide.title} className="transition hover:-translate-y-1">
              <img src={guide.image} alt={guide.title} className="h-48 w-full rounded-2xl object-cover" />
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-400">{guide.eyebrow}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{guide.description}</p>
              <a href={guide.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                Explore <i className="fa-solid fa-arrow-right"></i>
              </a>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="glass-panel grid gap-8 rounded-4xl border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/60 p-8 md:grid-cols-2">
          <div>
            <SectionHeading
              label="Toolkit"
              title="Handpicked utilities & service partners"
              description="Everything we reference is vetted and reproducible—no shady APKs or mystery storefronts."
            />
            <ul className="mt-8 space-y-4 text-sm text-slate-200">
              {toolkitIcons.map((item) => (
                <li key={item.title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <GlassCard title="Ready-to-use bundles" description="Updated weekly">
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {bundleCards.map((bundle) => (
                  <div key={bundle.title} className="rounded-2xl border border-white/5 bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-400">{bundle.title}</p>
                    <p className="text-lg font-semibold text-white">{bundle.description}</p>
                  </div>
                ))}
              </div>
              <a href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                Request a bundle <i className="fa-solid fa-arrow-right"></i>
              </a>
            </GlassCard>
            <GlassCard title="Integrations we lean on">
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-300">
                {integrations.map((name) => (
                  <div key={name} className="rounded-2xl border border-white/5 px-2 py-5">
                    {name}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.title} eyebrow={item.eyebrow} title={item.title}>
              <p className="mt-3 text-sm text-slate-300">{item.quote}</p>
              <p className="mt-4 text-sm font-semibold text-slate-200">{item.author}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="glass-panel rounded-4xl border border-white/10 bg-slate-950/80 p-8">
          <SectionHeading label="FAQ" title="Still wondering?" description="Here are the questions we hear every week." />
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-white/5 bg-slate-900/60 p-5" open={faq.question === faqs[0].question}>
                <summary className="cursor-pointer text-lg font-semibold text-white">{faq.question}</summary>
                <p className="mt-3 text-sm text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="glass-panel flex flex-col items-center gap-6 rounded-4xl border border-white/10 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 px-8 py-12 text-center">
          <p className="section-label text-xs uppercase text-sky-200">Next step</p>
          <h2 className="text-3xl font-semibold text-white">Let’s build the next kosher tech standard together</h2>
          <p className="text-base text-slate-200">
            Show up with questions, screenshots, or a crazy idea. The community will meet you there with empathy and receipts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://jtechforums.org"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Jump into the forum
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
