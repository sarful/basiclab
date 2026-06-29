export function CapacitorComparisonCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Comparison</h2>
      <div className="space-y-4 text-sm text-slate-700">
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="font-semibold text-orange-700">Polarized</p>
          <p className="mt-1">High capacitance, DC filtering, polarity sensitive.</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Non-Polarized</p>
          <p className="mt-1">AC coupling, ceramic/film type, no polarity restriction.</p>
        </div>
      </div>
    </div>
  );
}
