"use client";

export function ExplanationSection({
  state,
}: {
  state: ReturnType<typeof import("./logic").getBridgeRectifierState>;
}) {
  return (
    <section className="rounded-3xl bg-blue-50 p-5 shadow-sm ring-1 ring-blue-200">
      <h2 className="text-xl font-black text-slate-900">Bridge Rectifier Working</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <h3 className="font-black text-green-700">Positive half cycle</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            When the upper AC terminal is positive, D1 and D4 conduct together so the
            load current keeps the same direction.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <h3 className="font-black text-green-700">Negative half cycle</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            When the lower AC terminal is positive, D2 and D3 conduct together and the
            load current still flows in the same direction.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Average DC</p>
          <p className="mt-1 text-lg font-black text-slate-900">{state.avg.toFixed(2)} V</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">RMS Output</p>
          <p className="mt-1 text-lg font-black text-slate-900">{state.rms.toFixed(2)} V</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Avg Load Current</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {(state.avgCurrent * 1000).toFixed(2)} mA
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Conduction</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {state.conductionPercent.toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
        D1+D4 conduction: {state.d1Percent.toFixed(0)}% | D2+D3 conduction:{" "}
        {state.d2Percent.toFixed(0)}% | Status: {state.ledStatus}
      </div>
    </section>
  );
}
