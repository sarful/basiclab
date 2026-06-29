"use client";

import { formatResistance, resistorOptions } from "./logic";
import type { BranchItem } from "./types";

export function BranchEditorList({
  branches,
  onUpdateBranch,
  onRemoveBranch,
}: {
  branches: BranchItem[];
  onUpdateBranch: (id: number, value: number) => void;
  onRemoveBranch: (id: number) => void;
}) {
  return (
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
  );
}
