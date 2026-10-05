import type { ReactNode } from "react";
import { PageHero } from "./Page.tsx";

/** A short full-page message: not found, maintenance, an error. */
export default function NoticePage({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="page notice-page">
      <PageHero eyebrow={eyebrow} title={title}>
        <p className="lede">{children}</p>
      </PageHero>
      <div className="page-actions page-actions-center">{actions}</div>
    </div>
  );
}
