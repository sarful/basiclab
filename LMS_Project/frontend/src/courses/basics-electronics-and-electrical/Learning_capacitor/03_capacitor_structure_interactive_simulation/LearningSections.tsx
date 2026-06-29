import { CapacitorPartsCard } from "./CapacitorPartsCard";
import { CapacitorStructureInsightCard } from "./CapacitorStructureInsightCard";
import { ConstructionEffectCard } from "./ConstructionEffectCard";
import type { DielectricOption } from "./types";

type LearningSectionsProps = {
  plateArea: number;
  plateDistance: number;
  dielectric: DielectricOption;
  relativeEffect: number;
};

export function LearningSections({
  plateArea,
  plateDistance,
  dielectric,
  relativeEffect,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ConstructionEffectCard
        plateArea={plateArea}
        plateDistance={plateDistance}
        dielectric={dielectric}
        relativeEffect={relativeEffect}
      />
      <CapacitorPartsCard />
      <CapacitorStructureInsightCard />
    </div>
  );
}
