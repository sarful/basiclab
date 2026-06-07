"use client";

import { BranchBar } from "./BranchBar";
import type { BranchItem } from "./types";

export function BranchCurrentSection({
  branches,
  branchCurrents,
  totalCurrent,
}: {
  branches: BranchItem[];
  branchCurrents: number[];
  totalCurrent: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Branch Current Distribution</h2>
      <div className="space-y-4">
        {branchCurrents.map((current, index) => (
          <BranchBar
            key={branches[index].id}
            label={`Branch ${index + 1} Current`}
            current={current}
            totalCurrent={totalCurrent}
            color={
              ["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ef4444"][index] ||
              "#64748b"
            }
          />
        ))}
      </div>
    </div>
  );
}
