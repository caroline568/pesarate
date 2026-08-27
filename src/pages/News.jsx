import { ArrowUpRight, BookOpen } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";

const ITEMS = [
  ["Kenya", "What a stronger or weaker shilling means for you", "Exchange-rate movement changes the cost of imported goods, travel and international transfers."],
  ["Travel", "Your exchange rate is only part of the trip cost", "Fees, provider markups and spending habits can matter just as much as the headline rate."],
  ["Transfers", "Compare what arrives, not what is advertised", "A provider with a low visible fee can still deliver less if its exchange-rate markup is higher."],
];

export default function News() {
  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="Understand before you move."
        description="Short, practical context for the currency decisions behind your numbers."
      />

      <div className="ticket mb-5 p-7 sm:p-9">
        <BookOpen className="text-lime" size={22} />
        <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-2xl font-medium sm:text-3xl">
          PesaRate turns currency information into decision context.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/55">
          Instead of flooding you with financial news, the workspace surfaces the information
          most useful to the money decision in front of you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ITEMS.map(([cat, title, desc]) => (
          <Card key={title} className="p-5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-lime">{cat}</span>
            <h3 className="mt-4 font-semibold leading-snug">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/55">{desc}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-lime">
              Context note <ArrowUpRight size={14} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
