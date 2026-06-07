export function LearningSections() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Wrong polarity danger</p>
            <p className="mt-1">
              Reversing a polarized capacitor can damage the component.
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">AC friendly</p>
            <p className="mt-1">
              Non-polarized capacitors can handle both positive and negative AC cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
