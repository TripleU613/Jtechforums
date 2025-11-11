import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
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
      <main className="relative z-10 flex-1 pb-16 pt-10">{children}</main>
      <Footer />
    </div>
  );
}
