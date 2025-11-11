export default function GlassCard({ title, eyebrow, description, children, className = '' }) {
  return (
    <article className={`glass-panel relative rounded-3xl border border-white/10 p-6 ${className}`}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{eyebrow}</p>}
      {title && <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>}
      {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}
      {children}
    </article>
  );
}
