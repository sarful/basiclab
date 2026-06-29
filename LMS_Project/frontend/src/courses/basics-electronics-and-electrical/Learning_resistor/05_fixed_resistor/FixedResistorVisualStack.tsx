"use client";

import { FixedResistorVisual } from "./FixedResistorVisual";
import { KnowledgeSection } from "./KnowledgeSection";
import type { FixedType } from "./types";

export function FixedResistorVisualStack({
  selected,
  resistance,
  tolerance,
  powerRating,
  voltage,
  power,
  recommendedPower,
}: {
  selected: FixedType;
  resistance: number;
  tolerance: number;
  powerRating: number;
  voltage: number;
  power: number;
  recommendedPower: string;
}) {
  return (
    <div className="space-y-6">
      <FixedResistorVisual
        type={selected}
        resistance={resistance}
        tolerance={tolerance}
        powerRating={powerRating}
        voltage={voltage}
      />
      <KnowledgeSection
        selected={selected}
        power={power}
        recommendedPower={recommendedPower}
      />
    </div>
  );
}
