"use client";

import { PowerFormulaCard } from "./PowerFormulaCard";
import { PowerRatingDefinitionCard } from "./PowerRatingDefinitionCard";
import { PowerRatingSelector } from "./PowerRatingSelector";
import { RecommendationCard } from "./RecommendationCard";
import { ResistanceSelector } from "./ResistanceSelector";
import { VoltageSlider } from "./VoltageSlider";

export function ControlPanelSection({
  voltage,
  resistance,
  current,
  power,
  powerByI2R,
  powerByV2R,
  safetyMargin,
  rating,
  selectedPackageLabel,
  statusMessage,
  recommendedLabel,
  onVoltageChange,
  onResistanceChange,
  onRatingChange,
}: {
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  powerByI2R: number;
  powerByV2R: number;
  safetyMargin: number;
  rating: number;
  selectedPackageLabel: string;
  statusMessage: string;
  recommendedLabel: string;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onRatingChange: (value: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

        <VoltageSlider voltage={voltage} onVoltageChange={onVoltageChange} />

        <ResistanceSelector
          resistance={resistance}
          onResistanceChange={onResistanceChange}
        />

        <PowerRatingSelector
          rating={rating}
          selectedPackageLabel={selectedPackageLabel}
          onRatingChange={onRatingChange}
        />

        <RecommendationCard
          statusMessage={statusMessage}
          recommendedLabel={recommendedLabel}
        />
      </div>

      <PowerRatingDefinitionCard />

      <PowerFormulaCard
        voltage={voltage}
        resistance={resistance}
        current={current}
        power={power}
        powerByI2R={powerByI2R}
        powerByV2R={powerByV2R}
      />

      {/* <SelectionGuideCard
        safetyMargin={safetyMargin}
        recommendedLabel={recommendedLabel}
      /> */}
    </div>
  );
}
