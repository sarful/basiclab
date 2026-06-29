export function ElectrolyticInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">High capacitance in small size</p>
          <p className="mt-1">
            Electrolytic capacitors can provide capacitance from uF into mF range in a compact size.
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Best for bulk smoothing</p>
          <p className="mt-1">
            They are commonly used after rectifiers to reduce ripple in power supplies.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Reverse polarity danger</p>
          <p className="mt-1">
            Reverse polarity or over-voltage can cause heat, leakage, venting, or explosion.
          </p>
        </div>
      </div>
    </div>
  );
}
