export function CapacitorUseCasesCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Where Used?</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Power Supply</p>
          <p className="mt-1">
            Polarized electrolytic capacitors are widely used for ripple smoothing.
          </p>
        </div>
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Audio / RF</p>
          <p className="mt-1">
            Non-polarized capacitors are common in AC coupling and tuning circuits.
          </p>
        </div>
      </div>
    </div>
  );
}
