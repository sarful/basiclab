import { ConstructionBar } from "./ConstructionBar";
import type { DielectricOption } from "./types";

type ConstructionEffectCardProps = {
  plateArea: number;
  plateDistance: number;
  dielectric: DielectricOption;
  relativeEffect: number;
};

export function ConstructionEffectCard({
  plateArea,
  plateDistance,
  dielectric,
  relativeEffect,
}: ConstructionEffectCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Construction Effect</h2>
      <div className="space-y-4">
        <ConstructionBar
          label="Plate Area Effect"
          value={plateArea}
          maxValue={90}
          color="#2563eb"
          note="More area increases capacitance."
        />
        <ConstructionBar
          label="Dielectric Effect"
          value={dielectric.k}
          maxValue={10}
          color="#8b5cf6"
          note="A higher dielectric constant increases capacitance."
        />
        <ConstructionBar
          label="Distance Penalty"
          value={20 - plateDistance}
          maxValue={18}
          color="#16a34a"
          note="Smaller spacing gives higher capacitance."
        />
        <ConstructionBar
          label="Overall Capacitance Effect"
          value={relativeEffect}
          maxValue={1}
          color="#f97316"
          note="Combined effect from area, spacing, and dielectric."
        />
      </div>
    </div>
  );
}
