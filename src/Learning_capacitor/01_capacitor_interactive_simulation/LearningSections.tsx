import { ChargeBar } from "./ChargeBar";

type LearningSectionsProps = {
  chargeLevel: number;
  capacitorVoltage: number;
  supplyVoltage: number;
  current: number;
  maxCurrent: number;
};

export function LearningSections({
  chargeLevel,
  capacitorVoltage,
  supplyVoltage,
  current,
  maxCurrent,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Charge & Current Distribution</h2>
        <div className="space-y-4">
          <ChargeBar
            label="Charge Level"
            value={chargeLevel}
            maxValue={1}
            color="#8b5cf6"
            note="How much of the capacitor's full charge is present right now."
          />
          <ChargeBar
            label="Voltage Level"
            value={capacitorVoltage}
            maxValue={supplyVoltage}
            color="#2563eb"
            note="How close capacitor voltage is to the source voltage."
          />
          <ChargeBar
            label="Current Level"
            value={Math.abs(current)}
            maxValue={maxCurrent}
            color="#16a34a"
            note="Charging current starts high and falls as the capacitor fills."
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is Capacitor?</h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Definition</p>
          <p className="mt-1">
            A capacitor is an electronic component that stores electrical charge.
            It is usually made from two metal plates separated by a dielectric material.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Main Rule</p>
          <p className="mt-1">
            Higher capacitance stores more charge at the same voltage. Formula:
            Q = C x V.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Capacitor blocks steady DC</p>
            <p className="mt-1">
              After a capacitor is fully charged, ideal DC current no longer keeps flowing.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Current starts high</p>
            <p className="mt-1">
              Charging current is strongest at the beginning, then drops as capacitor voltage rises.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Energy is stored in a field</p>
            <p className="mt-1">
              The stored energy lives in the electric field between the two plates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
