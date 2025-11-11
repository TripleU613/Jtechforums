import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="section-label text-xs uppercase text-sky-200">404</p>
      <h1 className="text-4xl font-semibold text-white">Couldn’t find that page</h1>
      <p className="text-base text-slate-300">It might have moved or been renamed. Try heading back to the homepage.</p>
      <Link to="/" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950">
        Home
      </Link>
    </div>
  );
}
