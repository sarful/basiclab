"use client";

import { formatResistance, resistorOptions } from "./logic";
import type { BranchItem } from "./types";

export function ControlPanelSection({
  supplyVoltage,
  branches,
  onSetSupplyVoltage,
  onUpdateBranch,
  onRemoveBranch,
  onAddBranch,
  onReset,
}: {
  supplyVoltage: number;
  branches: BranchItem[];
  onSetSupplyVoltage: (value: number) => void;
  onUpdateBranch: (id: number, value: number) => void;
  onRemoveBranch: (id: number) => void;
  onAddBranch: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={onReset}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Supply Voltage: {supplyVoltage}V
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={supplyVoltage}
          onChange={(event) => onSetSupplyVoltage(Number(event.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div className="space-y-4">
        {branches.map((branch, index) => (
          <div
            key={branch.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Branch R{index + 1}: {formatResistance(branch.value)}
              </label>
              <button
                onClick={() => onRemoveBranch(branch.id)}
                disabled={branches.length <= 1}
                className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            </div>
            <select
              value={branch.value}
              onChange={(event) => onUpdateBranch(branch.id, Number(event.target.value))}
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

      <button
        onClick={onAddBranch}
        disabled={branches.length >= 5}
        className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Add Branch
      </button>
    </div>
  );
}
