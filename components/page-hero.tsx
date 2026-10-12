export function PageHero({
  eyebrow,
  title,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          compact ? "py-12 sm:py-16" : "py-16 sm:py-24"
        }`}
      >
        {eyebrow ? (
          <p className="mb-3 text-sm font-medium tracking-wider text-accent uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
        {children ? <div className="mt-6 max-w-3xl text-lg text-muted-foreground">{children}</div> : null}
      </div>
    </section>
  );
}
