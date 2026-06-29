export function ExplanationSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span className="h-2 w-2 rounded-full bg-cyan-500" />
        Beginner Summary
      </div>
      <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-950 md:text-[1.8rem]">
        Keep the comparison picture in mind
      </h2>
      <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
        This lesson becomes easier when you keep one picture in mind: series is
        one path, and parallel is many paths. That one difference changes how the
        whole circuit behaves.
      </p>

      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4">
        <p className="text-[0.98rem] leading-7 text-cyan-900">
          Same parts can behave very differently when the layout changes.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">Series</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Series circuits have one path. Resistances add together, and the same current flows through every part.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">Parallel</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Parallel circuits have multiple paths. Each branch gets the same voltage, while current splits between the branches.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">Key comparison</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            With the same resistors, parallel usually draws more total current because the equivalent resistance is lower than in series.
          </p>
        </article>
      </div>
    </section>
  );
}
