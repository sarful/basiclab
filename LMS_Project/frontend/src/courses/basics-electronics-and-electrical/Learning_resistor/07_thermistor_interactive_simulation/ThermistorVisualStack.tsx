"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { ThermistorVisual } from "./ThermistorVisual";
import type { ThermistorMode } from "./types";

export function ThermistorVisualStack({
  mode,
  temperature,
  resistance,
  voltage,
  current,
}: {
  mode: ThermistorMode;
  temperature: number;
  resistance: number;
  voltage: number;
  current: number;
  nominalResistance: number;
}) {
  return (
    <div className="space-y-6">
      <ThermistorVisual
        mode={mode}
        temperature={temperature}
        resistance={resistance}
        voltage={voltage}
      />

      <KnowledgeSection
        mode={mode}
        resistance={resistance}
        voltage={voltage}
        current={current}
      />
    </div>
  );
}
