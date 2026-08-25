import { Link } from "react-router-dom";

const NEWS_ITEMS = [
  {
    category: "Markets",
    title: "Global currency markets remain active",
    description:
      "Stay informed about movements that can affect exchange rates and international money transfers.",
  },
  {
    category: "Kenya",
    title: "Kenyan shilling market watch",
    description:
      "Follow developments that may influence the value of the Kenyan shilling.",
  },
  {
    category: "Travel",
    title: "What currency movements mean for travellers",
    description:
      "Understand how exchange-rate changes can affect your travel budget.",
  },
];

export default function News() {
  return (
    <div className="relative min-h-screen max-w-6xl font-display text-[#17201B]">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-72 w-72 rounded-full bg-hero-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Discover
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Financial news
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#69756D]">
          Keep up with currencies, markets, economies, and events
          that could affect your money.
        </p>
      </header>

      {/* Featured news */}
      <section className="relative mb-8">
        <div className="overflow-hidden rounded-3xl border border-black/6 bg-[#17201B] p-6 text-white shadow-xl sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-hero-accent/15 px-3 py-1 text-xs font-medium text-hero-accent">
              Market watch
            </span>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Understand what is happening before you move your money.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/55">
              PesaRate brings financial information closer to the
              decisions you make about currency, travel, and
              international transfers.
            </p>
          </div>
        </div>
      </section>

      {/* News cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Latest
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Market information
            </h2>
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-medium text-accent hover:text-[#0D9F7D]"
          >
            Back to workspace →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-black/6 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {item.category}
                </span>

                <i className="ti ti-arrow-up-right text-[#A0AAA3] transition group-hover:text-accent" />
              </div>

              <h3 className="text-base font-semibold leading-snug">
                {item.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[#7B867F]">
                {item.description}
              </p>

              <div className="mt-6 border-t border-black/6 pt-4">
                <span className="text-xs font-medium text-accent">
                  Read more →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}