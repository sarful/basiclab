"use client";

import { ComparisonPanel } from "./ComparisonPanel";
import { KnowledgeCards } from "./KnowledgeCards";
import { StructureCanvas } from "./StructureCanvas";
import type { MaterialSpec, StructureMode } from "./types";

export function ResistorStructureVisualStack({
  mode,
  material,
  voltage,
  baseResistance,
  temperature,
  rotation,
  showComparison,
}: {
  mode: StructureMode;
  material: MaterialSpec;
  voltage: number;
  baseResistance: number;
  temperature: number;
  rotation: number;
  showComparison: boolean;
}) {
  return (
    <div className="space-y-6">
      <StructureCanvas
        mode={mode}
        material={material}
        voltage={voltage}
        baseResistance={baseResistance}
        temperature={temperature}
        rotation={rotation}
      />
      {showComparison ? (
        <ComparisonPanel
          voltage={voltage}
          baseResistance={baseResistance}
          temperature={temperature}
        />
      ) : null}
      <KnowledgeCards materialLabel={material.label} materialNote={material.note} />
    </div>
  );
}
