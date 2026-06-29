export function CapacitorPartsCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Main Parts of a Capacitor</h2>
      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">1. Conductive Plates</p>
        <p className="mt-1">
          Two metal plates connect to the terminals. One gathers negative charge and the other becomes positive.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">2. Dielectric Material</p>
        <p className="mt-1">
          The insulating layer between the plates prevents a short and increases capacitance.
        </p>
      </div>
    </div>
  );
}
