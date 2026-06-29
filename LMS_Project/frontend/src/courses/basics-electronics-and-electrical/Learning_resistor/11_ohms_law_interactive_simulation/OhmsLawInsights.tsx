"use client";

export function OhmsLawInsights() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="font-semibold text-blue-600">Voltage increases current</p>
          <p className="mt-1 text-slate-600">
            If resistance stays constant, increasing voltage increases current.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="font-semibold text-yellow-600">Resistance reduces current</p>
          <p className="mt-1 text-slate-600">
            If voltage stays constant, increasing resistance reduces current.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="font-semibold text-green-600">LED brightness follows current</p>
          <p className="mt-1 text-slate-600">
            More current makes the LED brighter, less current makes it dimmer.
          </p>
        </div>
      </div>
    </div>
  );
}
