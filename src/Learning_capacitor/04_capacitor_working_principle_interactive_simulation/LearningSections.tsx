import { PrincipleBar } from "./PrincipleBar";

type LearningSectionsProps = {
  capacitorVoltage: number;
  supplyVoltage: number;
  current: number;
  maxCurrent: number;
  storedEnergy: number;
  maxEnergy: number;
  capacitanceFarad: number;
};

export function LearningSections({
  capacitorVoltage,
  supplyVoltage,
  current,
  maxCurrent,
  storedEnergy,
  maxEnergy,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Core Working Principle</h2>

        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">1. Charge Separation</p>
          <p className="mt-1">
            When the battery is connected, electrons collect on one plate and leave the other.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">2. Electric Field Formation</p>
          <p className="mt-1">
            The space between the plates develops an electric field, and that field stores the energy.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Current initially high</p>
            <p className="mt-1">
              At the start of charging, current is higher because the capacitor is still uncharged.
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Fully charged capacitor</p>
            <p className="mt-1">
              Once fully charged, an ideal capacitor blocks steady DC current.
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Discharge releases energy</p>
            <p className="mt-1">
              During discharge, the stored energy is returned back into the circuit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
