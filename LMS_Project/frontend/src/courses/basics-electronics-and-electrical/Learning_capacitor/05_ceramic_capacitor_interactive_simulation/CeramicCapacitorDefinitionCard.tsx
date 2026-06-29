export function CeramicCapacitorDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is a Ceramic Capacitor?</h2>
      <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
        <p className="font-semibold text-orange-700">Definition</p>
        <p className="mt-1">
          A ceramic capacitor uses ceramic as its dielectric material. It is small,
          affordable, non-polarized, and useful at high frequency.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Code Reading</p>
        <p className="mt-1">
          In the 3-digit code, the first two digits are the base number and the last digit is the number of zeros in pF.
        </p>
      </div>
    </div>
  );
}
