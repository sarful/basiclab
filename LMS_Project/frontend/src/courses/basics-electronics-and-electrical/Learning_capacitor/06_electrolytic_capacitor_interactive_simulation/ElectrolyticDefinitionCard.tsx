export function ElectrolyticDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is an Electrolytic Capacitor?</h2>
      <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
        <p className="font-semibold text-orange-700">Definition</p>
        <p className="mt-1">
          An electrolytic capacitor uses electrolyte and a very thin oxide dielectric
          to achieve high capacitance values.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Real Marking</p>
        <p className="mt-1">
          The stripe on the body usually marks the negative terminal. The longer lead is commonly positive.
        </p>
      </div>
    </div>
  );
}
