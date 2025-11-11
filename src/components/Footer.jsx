export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">JTech Forums</p>
          <p className="mt-1 text-slate-400">Community-run tech & filtering intelligence.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <a href="/privacy-policy" className="hover:text-white">Privacy</a>
          <a href="/about" className="hover:text-white">About</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </div>
        <p>
          &copy; <span>{new Date().getFullYear()}</span> JTech. Built with love and late-night coffee.
        </p>
      </div>
    </footer>
  );
}
