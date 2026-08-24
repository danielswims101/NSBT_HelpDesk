import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Page({
  title,
  kicker,
  purpose,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  kicker?: string;
  /** One calm sentence: why this page exists. */
  purpose?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8", className)}>
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {kicker && (
            <p className="mb-1 text-xs font-medium tracking-wide text-muted uppercase">{kicker}</p>
          )}
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{title}</h1>
          {purpose && (
            <p className="mt-3 rounded-md bg-primary/6 px-3 py-2 text-base leading-relaxed text-ink">
              This page is for: {purpose}
            </p>
          )}
          {description && <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}
