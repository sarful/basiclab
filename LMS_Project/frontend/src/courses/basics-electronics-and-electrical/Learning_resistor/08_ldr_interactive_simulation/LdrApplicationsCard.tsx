"use client";

export function LdrApplicationsCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Automatic Street Light</p>
          <p className="mt-1">
            Used to switch street lights on automatically when the environment
            becomes dark.
          </p>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="font-semibold text-orange-700">Light Sensor Module</p>
          <p className="mt-1">
            Useful in light detection, brightness control, and alarm systems.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Limitation</p>
          <p className="mt-1">
            Response is slower and precision is lower, so it is not ideal for
            high-speed sensing.
          </p>
        </div>
      </div>
    </div>
  );
}
