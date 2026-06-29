"use client";

import { VoltageBar } from "./VoltageBar";

export function VoltageDistributionCard({
  drops,
  supplyVoltage,
  showR3,
}: {
  drops: number[];
  supplyVoltage: number;
  showR3: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Voltage Drop Distribution</h2>
      <div className="space-y-4">
        <VoltageBar label="R1 Drop" value={drops[0]} total={supplyVoltage} color="#2563eb" />
        <VoltageBar label="R2 Drop" value={drops[1]} total={supplyVoltage} color="#16a34a" />
        {showR3 && <VoltageBar label="R3 Drop" value={drops[2]} total={supplyVoltage} color="#f97316" />}
      </div>
    </div>
  );
}
