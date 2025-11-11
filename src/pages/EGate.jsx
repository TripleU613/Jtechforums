import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';

const features = [
  {
    title: 'Factory reset & ADB protection',
    body: 'Blocks resets, OEM unlock, and developer options so eGate cannot be removed without authorization.',
  },
  {
    title: 'App restrictions',
    body: 'Remove the Play Store, hide apps, block installs, and disable removable storage from one policy.',
  },
  {
    title: 'Connectivity controls',
    body: 'Kill Wi-Fi, tethering, Bluetooth sharing, and MMS when the deployment demands zero side channels.',
  },
  {
    title: 'Web filtering',
    body: 'DNS category controls plus WebView blocking keep in-app browsers honest while allowing explicit exceptions.',
  },
  {
    title: 'Accessibility-based security',
    body: 'Accessibility services enforce app guards, disable WebView, and stop creative workarounds before they start.',
  },
  {
    title: 'Remote management',
    body: 'Reseller portal lets partners toggle profiles, push commands, and audit fleets without touching each phone.',
  },
];

const spotlights = [
  {
    title: 'Easy-to-use design',
    body: 'Non-technical coordinators can approve requests, push profiles, and see compliance at a glance.',
    image: '/img/home/lines.png',
  },
  {
    title: 'Reseller portal',
    body: 'Gain discounted licensing, shared scripts, and remote toggles tailored for MSPs and yeshiva IT leads.',
    image: '/img/home/reseller.png',
  },
  {
    title: 'Device builder',
    body: 'Pick a handset, launcher, and allowed apps to generate a battle-tested stack in minutes.',
    image: '/img/home/android.png',
  },
];

const faqs = [
  {
    question: 'Who is eGate for?',
    answer:
      'Families, schools, resellers, and MSPs who want GrapheneOS-level guardrails without wrestling with dozens of disconnected tools.',
  },
  {
    question: 'What makes eGate different from a VPN or DNS filter?',
    answer:
      'It combines filtering with MDM controls: app allowlists, hardware restrictions, accessibility locks, web controls, and reseller tooling.',
  },
  {
    question: 'Can I manage eGate myself?',
    answer:
      'Yes. Power users can purchase a license directly, while larger deployments often partner with a JTech-verified reseller.',
  },
];

export default function EGate() {
  return (
    <div className="space-y-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="section-label text-xs uppercase text-sky-200">eGate filter</p>
          <h1 className="text-5xl font-semibold text-white sm:text-6xl">Enterprise-grade control for kosher devices</h1>
          <p className="text-lg text-slate-300">
            eGate layers MDM policies, filtering, and accessibility locks so you can deploy Android or flip phones with zero guesswork. Designed for
            mechanchim, admins, and MSPs who need to keep people productive without loopholes.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://payhip.com/b/vxf1i"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950"
            >
              Buy a license
            </a>
            <a
              href="https://forums.jtechforums.org/t/what-is-egate-software/235"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white"
            >
              Learn more <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
        <div className="flex-1">
          <div className="glass-panel relative rounded-[2.5rem] p-6 text-center shadow-2xl">
            <img src="/img/home/android.png" alt="Phone mock" className="mx-auto w-64 object-contain" />
            <p className="mt-6 text-sm uppercase tracking-[0.4em] text-slate-400">Live telemetry</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">0 escalations · 97% satisfaction</h3>
            <p className="mt-2 text-sm text-slate-300">Q4 build · Pixel 8a · eGate multi-profile beta</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Everything you need" title="Why choose eGate?" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <GlassCard key={feature.title} title={feature.title} description={feature.body} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Highlights" description="A control tower for every persona" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {spotlights.map((card) => (
            <GlassCard key={card.title}>
              <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{card.body}</p>
              <img src={card.image} alt={card.title} className="mt-6 h-48 w-full rounded-2xl object-cover" />
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="glass-panel rounded-4xl border border-white/10 bg-slate-950/80 p-8">
          <SectionHeading label="FAQ" title="Still deciding?" align="center" />
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

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="glass-panel flex flex-col items-center gap-6 rounded-4xl border border-white/10 bg-gradient-to-r from-purple-500/20 to-sky-500/20 px-8 py-12 text-center">
          <h2 className="text-3xl font-semibold text-white">Ready to roll out eGate?</h2>
          <p className="text-base text-slate-200">Loop in a reseller or contact the JTech team—we will scope it together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900">
              Talk to a specialist
            </a>
            <a href="https://forums.jtechforums.org" target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white">
              Ask the community
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
