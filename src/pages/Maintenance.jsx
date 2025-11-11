import { Link } from 'react-router-dom';

export default function Maintenance() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="section-label text-xs uppercase text-sky-200">Maintenance</p>
      <h1 className="text-4xl font-semibold text-white">We’re tuning up the site</h1>
      <p className="text-base text-slate-300">
        Scheduled maintenance is in progress. Most guides remain available on the forum if you need urgent access.
      </p>
      <Link to="/" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950">
        Back to home
      </Link>
    </div>
  );
}
