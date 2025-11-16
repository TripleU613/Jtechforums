import Reveal from './Reveal';

export default function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  reveal = true,
}) {
  const wrapperClasses = align === 'center' ? 'text-center' : '';
  const renderContent = () => (
    <>
      {label && <p className="section-label text-xs uppercase text-sky-300">{label}</p>}
      {title && (
        <h2 className={`mt-4 text-3xl font-semibold text-white ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}>
          {title}
        </h2>
      )}
      {description && (
        <p className={`mt-3 text-base text-slate-300 ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>
          {description}
        </p>
      )}
    </>
  );

  if (!reveal) {
    return <div className={wrapperClasses}>{renderContent()}</div>;
  }

  return (
    <Reveal as="div" className={wrapperClasses} amount={0.2}>
      {renderContent()}
    </Reveal>
  );
}
