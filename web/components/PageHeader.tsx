export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">{eyebrow}</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-3xl text-base leading-7 text-muted">{description}</p>
      </div>
      {actions}
    </div>
  );
}
