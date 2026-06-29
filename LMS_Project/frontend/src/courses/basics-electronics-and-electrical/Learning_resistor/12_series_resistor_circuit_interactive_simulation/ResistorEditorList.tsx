"use client";

import { formatResistance, resistorOptions } from "./logic";
import type { ResistorItem } from "./types";

export function ResistorEditorList({
  resistors,
  onUpdateResistor,
  onRemoveResistor,
}: {
  resistors: ResistorItem[];
  onUpdateResistor: (id: number, value: number) => void;
  onRemoveResistor: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      {resistors.map((resistor, index) => (
        <div key={resistor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-800">
              R{index + 1}: {formatResistance(resistor.value)}
            </label>
            <button
              onClick={() => onRemoveResistor(resistor.id)}
              disabled={resistors.length <= 1}
              className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <select
            value={resistor.value}
            onChange={(event) => onUpdateResistor(resistor.id, Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white p-3"
          >
            {resistorOptions.map((value) => (
              <option key={value} value={value}>
                {formatResistance(value)}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
