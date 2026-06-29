export function CoreWorkingPrincipleCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Core Working Principle</h2>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">1. Charge Separation</p>
        <p className="mt-1">
          When the battery is connected, electrons collect on one plate and leave the other.
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">2. Electric Field Formation</p>
        <p className="mt-1">
          The space between the plates develops an electric field, and that field stores the energy.
        </p>
      </div>
    </div>
  );
}
