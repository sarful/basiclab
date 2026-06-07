import { EffectBar } from "./EffectBar";
import type { DielectricOption } from "./types";

type LearningSectionsProps = {
  plateArea: number;
  plateDistance: number;
  dielectric: DielectricOption;
  capacitanceLevel: number;
};

export function LearningSections({
  plateArea,
  plateDistance,
  dielectric,
  capacitanceLevel,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Capacitance Factors</h2>
        <div className="space-y-4">
          <EffectBar
            label="Plate Area Effect"
            value={plateArea}
            maxValue={90}
            color="#2563eb"
            note="Larger plate area increases capacitance."
          />
          <EffectBar
            label="Dielectric Effect"
            value={dielectric.k}
            maxValue={10}
            color="#8b5cf6"
            note="A higher dielectric constant increases capacitance."
          />
          <EffectBar
            label="Distance Effect"
            value={20 - plateDistance}
            maxValue={18}
            color="#16a34a"
            note="Smaller plate spacing gives higher capacitance."
          />
          <EffectBar
            label="Overall C Level"
            value={capacitanceLevel}
            maxValue={1}
            color="#f97316"
            note="Combined capacitance level from all factors."
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is Capacitance?</h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Definition</p>
          <p className="mt-1">
            Capacitance is the ability of a capacitor to store charge. The more charge
            it can store per volt, the higher the capacitance.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Unit</p>
          <p className="mt-1">
            The SI unit of capacitance is the farad. One farad means one coulomb per volt.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">More C means more charge</p>
            <p className="mt-1">
              At the same voltage, a larger capacitance stores more charge.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Plate area matters</p>
            <p className="mt-1">
              Larger plates support more separated charge, which raises capacitance.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Distance reduces C</p>
            <p className="mt-1">
              When the plates move farther apart, field coupling drops and capacitance falls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
