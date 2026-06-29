"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { LdrVisual } from "./LdrVisual";

export function LdrVisualStack({
  lightPercent,
  darkResistance,
  resistance,
  outputVoltage,
  current,
  voltage,
  fixedResistor,
}: {
  lightPercent: number;
  darkResistance: number;
  resistance: number;
  outputVoltage: number;
  current: number;
  voltage: number;
  fixedResistor: number;
}) {
  return (
    <>
      <LdrVisual
        lightPercent={lightPercent}
        resistance={resistance}
        voltage={voltage}
        fixedResistor={fixedResistor}
      />
      <div className="grid gap-6">
        <KnowledgeSection
          resistance={resistance}
          outputVoltage={outputVoltage}
          current={current}
          voltage={voltage}
        />
      </div>
    </>
  );
}
