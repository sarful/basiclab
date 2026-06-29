"use client";

import { FixedResistorDefinitionCard } from "./FixedResistorDefinitionCard";
import { PerformanceProfileCard } from "./PerformanceProfileCard";
import { SelectionGuideCard } from "./SelectionGuideCard";
import type { FixedType } from "./types";

export function KnowledgeSection({
  selected,
  power,
  recommendedPower,
}: {
  selected: FixedType;
  power: number;
  recommendedPower: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PerformanceProfileCard selected={selected} />
      <FixedResistorDefinitionCard selected={selected} />
      <SelectionGuideCard
        selected={selected}
        power={power}
        recommendedPower={recommendedPower}
      />
    </div>
  );
}
