"use client";

export function KnowledgeCards({
  materialLabel,
  materialNote,
}: {
  materialLabel: string;
  materialNote: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Main Parts</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Outer Coating</p>
            <p className="mt-1">Protects the resistor body from dust, handling damage, and excess moisture.</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">Resistive Layer</p>
            <p className="mt-1">This layer creates opposition to current and determines most of the resistance value.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-800">Terminal Leads</p>
            <p className="mt-1">The leads connect the resistor into the circuit and guide current through the body.</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Material Behavior</h2>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Selected: {materialLabel}</p>
          <p className="mt-1">{materialNote}</p>
          <p className="mt-3 text-xs text-slate-600">
            Different materials change the temperature rise, stability, and precision of the resistor.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Failure Insight</p>
          <p className="mt-1">When heat stress stays too high, the resistive layer can drift, crack, or go open-circuit.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Formula Visualizer</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Resistance relation</p>
            <p className="mt-1 text-lg font-bold text-slate-900">R = ρL / A</p>
            <p className="mt-1">Longer path means more resistance. Larger cross-sectional area means less resistance.</p>
          </div>
          <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
            <p className="font-semibold text-yellow-700">Power heat</p>
            <p className="mt-1 text-lg font-bold text-slate-900">P = VI = I²R</p>
            <p className="mt-1">As power rises, more electrical energy is converted into heat inside the resistor body.</p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Practical takeaway</p>
            <p className="mt-1">Material choice matters when a resistor must be precise, quiet, or able to handle heat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
