"use client";

const hazardCards = [
  {
    body: "Always identify whether the source is DC, AC, or fully powered off before moving the dial.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
    title: "Source Check",
  },
  {
    body: "Keep the black lead in COM and use the correct red jack before testing a live circuit.",
    tone: "border-sky-200 bg-sky-50 text-sky-950",
    title: "Lead Check",
  },
  {
    body: "Never use resistance or continuity mode on a powered circuit because the meter injects its own test current.",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
    title: "Power-Off Rule",
  },
] as const;

export default function BasicCircuitSafetyPracticeBoard() {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f5_0%,#ffffff_100%)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Safety Mission
          </p>
          <h3 className="mt-2 text-[1.45rem] font-black tracking-[-0.02em] text-slate-950">
            Pre-Measurement Safety Pass
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-600">
            This lesson is ready for the next interactive build. For now, the simulation area is split into reusable sections so each safety scenario can be wired in cleanly.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Build Status
          </p>
          <p className="mt-2 text-[20px] font-black tracking-tight text-emerald-950">
            Module Ready
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {hazardCards.map((item) => (
          <article
            key={item.title}
            className={`rounded-2xl border p-4 ${item.tone}`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em]">
              {item.title}
            </p>
            <p className="mt-2 text-[14px] leading-6">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
