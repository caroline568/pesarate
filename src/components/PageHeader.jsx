export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="font-mono text-xs uppercase tracking-[.2em] text-lime">{eyebrow}</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.05] sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/55">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
