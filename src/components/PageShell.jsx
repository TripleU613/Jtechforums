import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const baseMain = 'relative z-10 flex-1 min-h-0 overflow-x-hidden';
  const mainClasses = isHome ? `${baseMain} flex overflow-hidden` : `${baseMain} pb-16 pt-10`;
  const rootClasses = isHome
    ? 'relative flex h-screen flex-col bg-slate-950 text-white'
    : 'relative flex min-h-screen flex-col bg-slate-950 text-white';

  return (
    <div className={rootClasses}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-500 blur-blob"></div>
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500 blur-blob"></div>
        <img
          src="/img/home/lines.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        />
      </div>
      <Header />
      <main className={mainClasses}>{children}</main>
      {!isHome && <Footer />}
    </div>
  );
}
