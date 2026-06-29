"use client";

export function ThermistorApplicationsCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Temperature Sensor</p>
          <p className="mt-1">
            Used in battery packs, thermostats, room sensing, and cooling fan control.
          </p>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="font-semibold text-orange-700">Protection Circuit</p>
          <p className="mt-1">
            Useful for over-temperature protection and inrush current limiting.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Limitation</p>
          <p className="mt-1">
            Thermistor response is non-linear, so calibration may be required.
          </p>
        </div>
      </div>
    </div>
  );
}
