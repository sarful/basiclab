import { CeramicCapacitorDefinitionCard } from "./CeramicCapacitorDefinitionCard";
import { CeramicCapacitorInsightCard } from "./CeramicCapacitorInsightCard";
import { PerformanceIndicatorsCard } from "./PerformanceIndicatorsCard";
import type { DielectricOption } from "./types";

type LearningSectionsProps = {
  filterEffect: number;
  safePercent: number;
  stabilityPercent: number;
  dielectric: DielectricOption;
};

export function LearningSections({
  filterEffect,
  safePercent,
  stabilityPercent,
  dielectric,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PerformanceIndicatorsCard
        filterEffect={filterEffect}
        safePercent={safePercent}
        stabilityPercent={stabilityPercent}
        dielectric={dielectric}
      />
      <CeramicCapacitorDefinitionCard />
      <CeramicCapacitorInsightCard />
    </div>
  );
}
