export function CeramicCapacitorInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">No polarity</p>
          <p className="mt-1">
            Ceramic capacitors usually have no plus/minus polarity, so they can be placed either way.
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Good for noise filtering</p>
          <p className="mt-1">
            A 100 nF ceramic capacitor is very common for bypassing high-frequency power-line noise.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Respect voltage rating</p>
          <p className="mt-1">
            Running near or above the rated voltage can cause heat, leakage, or failure.
          </p>
        </div>
      </div>
    </div>
  );
}
