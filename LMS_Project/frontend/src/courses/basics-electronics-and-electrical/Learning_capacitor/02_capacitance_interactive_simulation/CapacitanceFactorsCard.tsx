"use client";

import { EffectBar } from "./EffectBar";
import type { DielectricOption } from "./types";

export function CapacitanceFactorsCard({
  plateArea,
  plateDistance,
  dielectric,
  capacitanceLevel,
}: {
  plateArea: number;
  plateDistance: number;
  dielectric: DielectricOption;
  capacitanceLevel: number;
}) {
  return (
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
  );
}
