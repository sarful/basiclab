"use client";

import { CapacitanceDefinitionCard } from "./CapacitanceDefinitionCard";
import { CapacitanceFactorsCard } from "./CapacitanceFactorsCard";
import { CapacitanceInsightCard } from "./CapacitanceInsightCard";
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
      <CapacitanceFactorsCard
        plateArea={plateArea}
        plateDistance={plateDistance}
        dielectric={dielectric}
        capacitanceLevel={capacitanceLevel}
      />
      <CapacitanceDefinitionCard />
      <CapacitanceInsightCard />
    </div>
  );
}
