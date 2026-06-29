"use client";

import { BranchEditorList } from "./BranchEditorList";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";
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

      <SupplyVoltageSlider
        supplyVoltage={supplyVoltage}
        onSetSupplyVoltage={onSetSupplyVoltage}
      />
      <BranchEditorList
        branches={branches}
        onUpdateBranch={onUpdateBranch}
        onRemoveBranch={onRemoveBranch}
      />

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
