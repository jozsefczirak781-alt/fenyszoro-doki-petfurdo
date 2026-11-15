import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="px-5 pt-8 pb-5 animate-rise md:px-8 md:pt-14 md:pb-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h1 className="mt-1 text-4xl font-extrabold uppercase leading-none md:text-6xl">{title}</h1>
      {children && <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:max-w-2xl md:text-base">{children}</p>}
    </header>
  );
}

export function Section({ title, step, children }: { title: string; step?: number; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2.5 text-lg font-bold uppercase">
        {step !== undefined && (
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 font-sans text-xs font-bold text-primary">
            {step}
          </span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SuccessPanel({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
  return (
    <div className="mx-5 mt-10 rounded-3xl md:mx-auto md:mt-16 md:max-w-lg border border-border bg-card-gradient p-7 text-center shadow-card animate-rise">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-beam shadow-glow">
        <svg viewBox="0 0 24 24" className="size-8 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-5 text-3xl font-extrabold uppercase">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
      <div className="mt-6">{action}</div>
    </div>
  );
}
