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
      <style>{`.page-title{color:#10241c}.page-title::after{content:"";display:block;width:4.75rem;height:4px;margin-top:.65rem;border-radius:999px;background:linear-gradient(90deg,#1f8a5b,#c6a15b,#c4532a)}`}</style>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">{eyebrow}</p>
        <h1 className="page-title mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight">{title}</h1>
        <p className="mt-2 max-w-3xl text-base font-medium leading-7 text-[#243d32]">{description}</p>
      </div>
      {actions}
    </div>
  );
}
