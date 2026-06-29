export function CapacitorStructureInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Area increases capacitance</p>
          <p className="mt-1">
            Bigger plates provide more effective field surface, so capacitance rises.
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Distance reduces capacitance</p>
          <p className="mt-1">
            When the plates are farther apart, field coupling weakens and capacitance falls.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Dielectric prevents short</p>
          <p className="mt-1">
            Because the dielectric is an insulator, direct current cannot pass straight between the plates.
          </p>
        </div>
      </div>
    </div>
  );
}
