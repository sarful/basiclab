"use client";

import { DropBar } from "./DropBar";
import type { ResistorItem } from "./types";

export function VoltageDistributionCard({
  voltageDrops,
  resistors,
  supplyVoltage,
}: {
  voltageDrops: number[];
  resistors: ResistorItem[];
  supplyVoltage: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Voltage Distribution</h2>
      <div className="space-y-4">
        {voltageDrops.map((drop, index) => (
          <DropBar
            key={resistors[index].id}
            label={`R${index + 1} Voltage Drop`}
            value={drop}
            total={supplyVoltage}
            color={
              ["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ef4444"][index] || "#64748b"
            }
          />
        ))}
      </div>
    </div>
  );
}
