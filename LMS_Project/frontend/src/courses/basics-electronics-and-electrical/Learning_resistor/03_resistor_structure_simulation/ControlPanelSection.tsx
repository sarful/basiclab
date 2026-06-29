"use client";

import { materials } from "./logic";
import type { MaterialKey, StructureMode } from "./types";

export function ControlPanelSection({
  mode,
  materialKey,
  voltage,
  baseResistance,
  temperature,
  rotation,
  showComparison,
  onModeChange,
  onMaterialChange,
  onVoltageChange,
  onBaseResistanceChange,
  onTemperatureChange,
  onRotationChange,
  onToggleComparison,
  onReset,
}: {
  mode: StructureMode;
  materialKey: MaterialKey;
  voltage: number;
  baseResistance: number;
  temperature: number;
  rotation: number;
  showComparison: boolean;
  onModeChange: (value: StructureMode) => void;
  onMaterialChange: (value: MaterialKey) => void;
  onVoltageChange: (value: number) => void;
  onBaseResistanceChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onToggleComparison: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button onClick={onReset} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
          Reset
        </button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          { id: "assembled", label: "Assembled" },
          { id: "cutaway", label: "Cutaway" },
          { id: "exploded", label: "Exploded" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id as StructureMode)}
            className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
              mode === item.id ? "border-orange-400 bg-orange-50 text-orange-700 ring-2 ring-orange-200" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-5 space-y-2">
        {materials.map((item) => (
          <button
            key={item.key}
            onClick={() => onMaterialChange(item.key)}
            className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
              materialKey === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"
            }`}
          >
            <p className="font-semibold text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-600">{item.note}</p>
          </button>
        ))}
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
        <input type="range" min="1" max="30" step="1" value={voltage} onChange={(event) => onVoltageChange(Number(event.target.value))} className="w-full accent-blue-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Base Resistance: {baseResistance >= 1000 ? `${(baseResistance / 1000).toFixed(2)} kΩ` : `${baseResistance} Ω`}</label>
        <input type="range" min="100" max="5000" step="100" value={baseResistance} onChange={(event) => onBaseResistanceChange(Number(event.target.value))} className="w-full accent-yellow-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Temperature: {temperature}°C</label>
        <input type="range" min="0" max="150" step="5" value={temperature} onChange={(event) => onTemperatureChange(Number(event.target.value))} className="w-full accent-red-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Rotation: {rotation}°</label>
        <input type="range" min="-18" max="18" step="1" value={rotation} onChange={(event) => onRotationChange(Number(event.target.value))} className="w-full accent-purple-500" />
      </div>

      <button onClick={onToggleComparison} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800">
        {showComparison ? "Hide" : "Show"} Material Comparison
      </button>
    </div>
  );
}
