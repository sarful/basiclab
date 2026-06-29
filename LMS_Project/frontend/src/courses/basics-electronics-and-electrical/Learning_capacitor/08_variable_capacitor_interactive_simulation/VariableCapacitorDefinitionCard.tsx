export function VariableCapacitorDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is a Variable Capacitor?</h2>
      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">Definition</p>
        <p className="mt-1">
          A variable capacitor is a capacitor whose capacitance can be adjusted mechanically.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Working Principle</p>
        <p className="mt-1">
          A movable rotor changes overlap with fixed stator plates. Changing the effective area changes capacitance.
        </p>
      </div>
    </div>
  );
}
