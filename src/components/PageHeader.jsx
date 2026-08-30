export default function PageHeader({ eyebrow, title, description, action }) {
  return <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{eyebrow}</p><h1 className="mt-1 text-[18px] font-bold">{title}</h1>{description&&<p className="mt-1 max-w-2xl text-[10px] text-slate-400">{description}</p>}</div>{action}</section>;
}
