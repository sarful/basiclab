export function ExplanationSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span className="h-2 w-2 rounded-full bg-cyan-500" />
        Beginner Summary
      </div>
      <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-950 md:text-[1.8rem]">
        Keep the one-path idea in mind
      </h2>
      <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
        This lesson becomes easy when you remember one simple picture: a series
        circuit is one full path, so the same current moves through every component
        in that line.
      </p>

      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4">
        <p className="text-[0.98rem] leading-7 text-cyan-900">
          One path means shared current. More series resistance means less current.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">One path only</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Current has only one route, so every component must sit in the same loop.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">Same current</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            The current through resistor one, resistor two, and the LED is the same.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">Resistance adds up</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Adding more series resistance makes the total resistance larger and the current smaller.
          </p>
        </article>
      </div>
    </section>
  );
}
