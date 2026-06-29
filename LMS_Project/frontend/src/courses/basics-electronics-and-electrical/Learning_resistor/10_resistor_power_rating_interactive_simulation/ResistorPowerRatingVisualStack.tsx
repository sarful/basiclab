"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { PowerVisual } from "./PowerVisual";
import type { ResistorPackage } from "./types";

export function ResistorPowerRatingVisualStack({
  voltage,
  resistance,
  rating,
  selectedPackage,
  current,
  power,
  powerByI2R,
  powerByV2R,
  safetyMargin,
  recommendedLabel,
  onRatingChange,
}: {
  voltage: number;
  resistance: number;
  rating: number;
  selectedPackage: ResistorPackage;
  current: number;
  power: number;
  powerByI2R: number;
  powerByV2R: number;
  safetyMargin: number;
  recommendedLabel: string;
  onRatingChange: (value: number) => void;
}) {
  return (
    <>
      <PowerVisual
        voltage={voltage}
        resistance={resistance}
        rating={rating}
        selectedPackage={selectedPackage}
      />
      <KnowledgeSection
        voltage={voltage}
        resistance={resistance}
        current={current}
        power={power}
        powerByI2R={powerByI2R}
        powerByV2R={powerByV2R}
        safetyMargin={safetyMargin}
        recommendedLabel={recommendedLabel}
        rating={rating}
        onRatingChange={onRatingChange}
      />
    </>
  );
}
