import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children, isDesktopHome = false }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // For home page, we allow natural scroll - no overflow-hidden or fixed height
  const rootClasses = 'relative flex min-h-screen flex-col bg-slate-950 text-white';
  const mainClasses = isHome
    ? 'relative z-10 flex-1 overflow-x-hidden'
    : 'relative z-10 flex-1 min-h-0 overflow-x-hidden pb-16 pt-10';

  return (
    <div className={rootClasses}>
      {/* Background blobs - only show on non-home pages to avoid conflict with home's own backgrounds */}
      {!isHome && (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-500 blur-blob"></div>
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500 blur-blob"></div>
          <img
            src="/img/home/lines.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
          />
        </div>
      )}
      <Header />
      <main className={mainClasses}>{children}</main>
      {!isHome && <Footer />}
    </div>
  );
}
