export function ExplanationSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span className="h-2 w-2 rounded-full bg-cyan-500" />
        Beginner Summary
      </div>
      <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-950 md:text-[1.8rem]">
        Keep this power picture in mind
      </h2>
      <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
        This lesson becomes easier when you remember one simple picture:
        voltage gives the push, current shows the flow, and power tells you how
        strongly the circuit is working.
      </p>

      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4">
        <p className="text-[0.98rem] leading-7 text-cyan-900">
          Higher power means the circuit is using electrical energy more quickly.
          Lower power means the device is doing less electrical work.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">What power means</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Power tells us how quickly a circuit is using or delivering electrical energy.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">More voltage</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If current stays the same, more voltage usually means more power.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">More current</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            If voltage stays the same, more current also means more power.
          </p>
        </article>
      </div>
    </section>
  );
}
