export function VariableCapacitorInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">More overlap, more C</p>
          <p className="mt-1">
            More plate overlap increases the effective field area, so capacitance rises.
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Used in radio tuning</p>
          <p className="mt-1">
            A variable capacitor shifts LC resonance so a radio can tune to a desired station.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Usually air dielectric</p>
          <p className="mt-1">
            Traditional variable capacitors often use air between the plates, which keeps loss low.
          </p>
        </div>
      </div>
    </div>
  );
}
