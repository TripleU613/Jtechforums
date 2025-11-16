import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

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
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goHome = useCallback(() => {
    navigate('/', { state: { resetHome: Date.now() } });
  }, [navigate]);

  useEffect(() => {
    setProfileOpen(false);
  }, [user]);

  const forumCta = (
    <a
      href="https://forums.jtechforums.org"
      target="_blank"
      rel="noopener"
      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
    >
      Join the Forum
    </a>
  );

  const avatar = user?.photoURL ? (
    <img src={user.photoURL} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-950">
      {(user?.displayName?.[0] || user?.email?.[0] || '?').toUpperCase()}
    </div>
  );

  const handleSignOut = async () => {
    await signOut(auth);
    setProfileOpen(false);
    setOpen(false);
  };

  const handleFeedbackShortcut = () => {
    setProfileOpen(false);
    setOpen(false);
    const trigger = () => window.dispatchEvent(new CustomEvent('openFeedbackModal'));
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(trigger, 150);
    } else {
      trigger();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <button type="button" className="flex items-center" onClick={goHome}>
          <img src="/img/whitelogo.png" alt="JTech logo" className="h-10 w-auto" />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, to }) => {
            const isHome = to === '/';
            return (
              <NavLink
                key={to}
                to={to}
                onClick={isHome ? (event) => { event.preventDefault(); goHome(); } : undefined}
                className={({ isActive }) => `${baseLinkClasses} ${isActive ? 'text-sky-300' : ''}`}
              >
                {label}
              </NavLink>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <NavLink
                to="/signin"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400"
              >
                Sign in
              </NavLink>
              {forumCta}
            </>
          ) : (
            <>
              {forumCta}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-white/15 px-2 py-1 text-white"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  {avatar}
                  <i className={`fa-solid ${profileOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs text-white/70`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-sm text-white shadow-lg"
                    >
                      <p className="truncate text-xs text-slate-300">{user.email}</p>
                      <NavLink
                        to="/apps"
                        className="mt-3 block rounded-full border border-white/15 px-3 py-2 text-center font-semibold hover:border-sky-400"
                        onClick={() => setProfileOpen(false)}
                      >
                        Apps dashboard
                      </NavLink>
                      <button
                        type="button"
                        className="mt-2 w-full rounded-full border border-sky-500/40 px-3 py-2 font-semibold text-sky-300 hover:border-sky-300"
                        onClick={handleFeedbackShortcut}
                      >
                        Share feedback
                      </button>
                      <button
                        type="button"
                        className="mt-2 w-full rounded-full bg-slate-800 px-3 py-2 font-semibold hover:bg-slate-700"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
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
            {navLinks.map(({ label, to }) => {
              const isHome = to === '/';
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={
                    isHome
                      ? (event) => {
                          event.preventDefault();
                          setOpen(false);
                          goHome();
                        }
                      : () => setOpen(false)
                  }
                  className="uppercase tracking-wide"
                >
                  {label}
                </NavLink>
              );
            })}
            {!user ? (
              <NavLink
                to="/signin"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 px-4 py-3 text-center font-semibold"
              >
                Sign in
              </NavLink>
            ) : (
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-3 text-center font-semibold"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            )}
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
