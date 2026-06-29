import { PrincipleBar } from "./PrincipleBar";

type WorkingBehaviorCardProps = {
  capacitorVoltage: number;
  supplyVoltage: number;
  current: number;
  maxCurrent: number;
  storedEnergy: number;
  maxEnergy: number;
};

export function WorkingBehaviorCard({
  capacitorVoltage,
  supplyVoltage,
  current,
  maxCurrent,
  storedEnergy,
  maxEnergy,
}: WorkingBehaviorCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Working Behavior</h2>

      <div className="space-y-4">
        <PrincipleBar
          label="Stored Voltage"
          value={capacitorVoltage}
          maxValue={supplyVoltage}
          color="#2563eb"
          note="Capacitor voltage rises during charging."
        />

        <PrincipleBar
          label="Current Decay"
          value={Math.abs(current)}
          maxValue={maxCurrent}
          color="#16a34a"
          note="Current gradually decreases over time."
        />

        <PrincipleBar
          label="Energy Storage"
          value={storedEnergy}
          maxValue={maxEnergy}
          color="#8b5cf6"
          note="Stored electric field energy increases as charge builds."
        />
      </div>
    </div>
  );
}
