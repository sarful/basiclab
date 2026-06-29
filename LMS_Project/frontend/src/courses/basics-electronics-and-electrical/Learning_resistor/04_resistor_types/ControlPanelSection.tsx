"use client";

import { resistorTypes } from "./resistorTypeDefinitions";
import type { Category, ResistorType, ResistorTypeKey } from "./types";

export function ControlPanelSection({
  selected,
  filteredTypes,
  controlValue,
  environmentValue,
  filter,
  onFilterChange,
  onSelectedKeyChange,
  onControlValueChange,
  onEnvironmentValueChange,
}: {
  selected: ResistorType;
  filteredTypes: ResistorType[];
  controlValue: number;
  environmentValue: number;
  filter: Category;
  onFilterChange: (value: Category) => void;
  onSelectedKeyChange: (value: ResistorTypeKey) => void;
  onControlValueChange: (value: number) => void;
  onEnvironmentValueChange: (value: number) => void;
}) {
  const environmentLabel = selected.key === "thermistor" ? "Temperature" : selected.key === "ldr" ? "Light" : "Environment";
  const environmentUnit = selected.key === "thermistor" ? "°C" : "%";

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Type Filter</h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Fixed", "Variable", "Sensor"].map((item) => (
            <button
              key={item}
              onClick={() => onFilterChange(item as Category)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                filter === item ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Select Resistor Type</h2>
        <div className="grid gap-3">
          {filteredTypes.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelectedKeyChange(item.key)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                selected.key === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.short}</p>
                </div>
                <span className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: item.color }}>
                  {item.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

        {selected.category === "Variable" && (
          <div className="mb-5">
            <label className="mb-2 block text-sm text-slate-700">Knob / Wiper Position: {controlValue}%</label>
            <input type="range" min="0" max="100" value={controlValue} onChange={(event) => onControlValueChange(Number(event.target.value))} className="w-full accent-purple-500" />
            <p className="mt-1 text-xs text-slate-500">Changing the wiper changes the output resistance or voltage.</p>
          </div>
        )}

        {selected.category === "Sensor" && (
          <div className="mb-5">
            <label className="mb-2 block text-sm text-slate-700">{environmentLabel}: {environmentValue}{environmentUnit}</label>
            <input type="range" min="0" max="100" value={environmentValue} onChange={(event) => onEnvironmentValueChange(Number(event.target.value))} className="w-full accent-orange-500" />
            <p className="mt-1 text-xs text-slate-500">Sensor resistor values change with environmental conditions.</p>
          </div>
        )}

        {selected.category === "Fixed" && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">Fixed Resistor</p>
            <p className="mt-1">This type keeps nearly the same value. Choose it based on precision, power rating, and cost.</p>
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Best Use</p>
          <p className="mt-1">{selected.bestFor}</p>
        </div>
      </div>
    </div>
  );
}
