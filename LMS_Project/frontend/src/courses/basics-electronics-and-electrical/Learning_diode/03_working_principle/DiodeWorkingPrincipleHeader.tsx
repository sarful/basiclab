"use client";

export function DiodeWorkingPrincipleHeader() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-emerald-700">
            Lesson 3
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Diode Working Principle
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Study how the PN junction is built, how the depletion barrier forms, and how forward or reverse bias changes conduction through the diode.
          </p>
        </div>

        <div className="self-start rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-emerald-700">
            Training Mode
          </p>
          <p className="mt-1 text-sm font-black text-slate-900">Interactive Study</p>
        </div>
      </div>
    </section>
  );
}
