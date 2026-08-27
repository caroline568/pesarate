import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";

const COUNTRIES = [
  ["USD", "United States", "🇺🇸"],
  ["GBP", "United Kingdom", "🇬🇧"],
  ["EUR", "Eurozone", "🇪🇺"],
  ["AED", "United Arab Emirates", "🇦🇪"],
  ["TZS", "Tanzania", "🇹🇿"],
  ["UGX", "Uganda", "🇺🇬"],
  ["ZAR", "South Africa", "🇿🇦"],
  ["JPY", "Japan", "🇯🇵"],
];

export default function Explore() {
  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Currencies in context."
        description="Explore destinations, currencies and what your Kenyan shillings mean there."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTRIES.map(([code, name, flag]) => (
          <Link key={code} to={`/explore/${code}`}>
            <Card className="p-5 transition hover:-translate-y-1">
              <div className="flex justify-between">
                <span className="text-2xl">{flag}</span>
                <ArrowRight size={16} className="text-paper/40" />
              </div>
              <h3 className="mt-5 font-semibold">{name}</h3>
              <p className="mt-1 text-xs text-paper/45">{code} · Compare from KES</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
