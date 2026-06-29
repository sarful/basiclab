"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { ParallelCircuitVisual } from "./ParallelCircuitVisual";
import type { BranchItem } from "./types";

export function ParallelCircuitVisualSection({
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
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        supplyVoltage={supplyVoltage}
        branches={branches}
        onSetSupplyVoltage={onSetSupplyVoltage}
        onUpdateBranch={onUpdateBranch}
        onRemoveBranch={onRemoveBranch}
        onAddBranch={onAddBranch}
        onReset={onReset}
      />

      <div className="lg:col-span-2">
        <ParallelCircuitVisual supplyVoltage={supplyVoltage} branches={branches} />
      </div>
    </div>
  );
}
