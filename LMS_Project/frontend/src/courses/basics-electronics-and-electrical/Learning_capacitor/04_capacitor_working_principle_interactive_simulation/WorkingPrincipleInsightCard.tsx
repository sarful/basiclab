export function WorkingPrincipleInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>

      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Current initially high</p>
          <p className="mt-1">
            At the start of charging, current is higher because the capacitor is still uncharged.
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Fully charged capacitor</p>
          <p className="mt-1">
            Once fully charged, an ideal capacitor blocks steady DC current.
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Discharge releases energy</p>
          <p className="mt-1">
            During discharge, the stored energy is returned back into the circuit.
          </p>
        </div>
      </div>
    </div>
  );
}
