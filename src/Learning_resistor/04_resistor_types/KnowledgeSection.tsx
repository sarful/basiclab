"use client";

import { ComparisonTable } from "./ComparisonTable";
import type { ResistorType } from "./types";

export function KnowledgeSection({ selected }: { selected: ResistorType }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <ComparisonTable selected={selected} />
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Definition</p>
              <p className="mt-1">{selected.short}</p>
              <p className="mt-3 text-xs text-slate-600">{selected.valueLabel}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 text-sm text-slate-700 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Real-world Application</p>
              <p className="mt-1">{selected.application}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
              <p className="font-semibold text-red-700">Limitation</p>
              <p className="mt-1">{selected.limitation}</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Learning Point</p>
              <p className="mt-1">Choosing the correct resistor type makes a circuit safer, more stable, and more reliable.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Quick Classification Map</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">Fixed Resistor</p>
            <p className="mt-1 text-sm text-slate-600">Carbon, metal film, and wire wound types hold a mostly fixed value.</p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Variable Resistor</p>
            <p className="mt-1 text-sm text-slate-600">Potentiometers let the user manually adjust the resistance path.</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Sensor Resistor</p>
            <p className="mt-1 text-sm text-slate-600">Thermistors and LDRs change value automatically with the environment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
