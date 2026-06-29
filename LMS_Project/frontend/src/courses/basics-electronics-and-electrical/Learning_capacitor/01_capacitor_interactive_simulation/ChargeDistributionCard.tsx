"use client";

import { ChargeBar } from "./ChargeBar";

export function ChargeDistributionCard({
  chargeLevel,
  capacitorVoltage,
  supplyVoltage,
  current,
  maxCurrent,
}: {
  chargeLevel: number;
  capacitorVoltage: number;
  supplyVoltage: number;
  current: number;
  maxCurrent: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Charge & Current Distribution</h2>
      <div className="space-y-4">
        <ChargeBar
          label="Charge Level"
          value={chargeLevel}
          maxValue={1}
          color="#8b5cf6"
          note="How much of the capacitor is charged."
        />
        <ChargeBar
          label="Voltage Level"
          value={capacitorVoltage}
          maxValue={supplyVoltage}
          color="#2563eb"
          note="How close Vc is to the source voltage."
        />
        <ChargeBar
          label="Current Level"
          value={Math.abs(current)}
          maxValue={maxCurrent}
          color="#16a34a"
          note="Charging current falls with time."
        />
      </div>
    </div>
  );
}
