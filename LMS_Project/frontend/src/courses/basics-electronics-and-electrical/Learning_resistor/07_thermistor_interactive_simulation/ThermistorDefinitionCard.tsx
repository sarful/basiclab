"use client";

export function ThermistorDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is Thermistor?</h2>
      <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Definition</p>
        <p className="mt-1">
          A thermistor is a resistor whose value changes with temperature.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
        <p className="font-semibold text-yellow-700">Main Idea</p>
        <p className="mt-1">
          In NTC devices temperature rise lowers resistance, while in PTC devices
          temperature rise increases resistance.
        </p>
      </div>
    </div>
  );
}
