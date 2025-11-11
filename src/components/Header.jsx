import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Guides', to: '/guides' },
  { label: 'eGate', to: '/egate' },
  { label: 'Apps', to: '/apps' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const baseLinkClasses =
  'text-sm font-semibold tracking-wide uppercase text-white/90 hover:text-white transition';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <NavLink to="/" className="flex items-center">
          <img src="/img/whitelogo.png" alt="JTech logo" className="h-10 w-auto" />
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? 'text-sky-300' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://forums.jtechforums.org"
            target="_blank"
            rel="noopener"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Join the Forum
          </a>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-white/15 p-3 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-semibold text-white">
            {navLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className="uppercase tracking-wide">
                {label}
              </NavLink>
            ))}
            <a
              href="https://forums.jtechforums.org"
              target="_blank"
              rel="noopener"
              className="rounded-full bg-sky-500 px-4 py-3 text-center font-semibold text-slate-950"
              onClick={() => setOpen(false)}
            >
              Join the Forum
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
