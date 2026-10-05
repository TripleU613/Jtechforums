import type { ReactNode } from "react";
import Icon, { type IconName } from "../Icon.tsx";

/** The building blocks the inner pages share. */

export function PageHero({
  eyebrow,
  title,
  children,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "start";
}) {
  return (
    <header className={`page-hero page-hero-${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
      {children}
    </header>
  );
}

export function SectionHead({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div className="page-section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

export function Card({
  icon,
  title,
  children,
  action,
}: {
  icon?: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <article className="page-card">
      {icon && (
        <span className="page-card-icon">
          <Icon name={icon} size={22} />
        </span>
      )}
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </article>
  );
}

export function Stat({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="page-stat">
      <span className="page-stat-label">{label}</span>
      <strong>{value}</strong>
      {detail && <span className="page-stat-detail">{detail}</span>}
    </div>
  );
}

export const formatCount = (value: number | undefined): string =>
  typeof value === "number" ? value.toLocaleString("en-US") : "—";
