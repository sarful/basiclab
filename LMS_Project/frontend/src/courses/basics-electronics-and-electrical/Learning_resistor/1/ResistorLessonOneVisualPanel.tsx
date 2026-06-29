"use client";

import { ComparisonPanel } from "./ComparisonPanel";
import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";
import { StructureVisual } from "./StructureVisual";
import type { FlowMode, Material, ViewMode } from "./types";

export function ResistorLessonOneVisualPanel({
  resistance,
  current,
  power,
  temperature,
  mode,
  material,
  voltage,
  baseResistance,
  rotation,
  flowMode,
  showComparison,
}: {
  resistance: number;
  current: number;
  power: number;
  temperature: number;
  mode: ViewMode;
  material: Material;
  voltage: number;
  baseResistance: number;
  rotation: number;
  flowMode: FlowMode;
  showComparison: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Resistance"
          value={formatResistance(resistance).replace(" Î©", "").replace(" kÎ©", "")}
          unit={resistance >= 1000 ? "kÎ©" : "Î©"}
          tone="text-yellow-600"
        />
        <MetricCard
          label="Current"
          value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
          unit={current >= 1 ? "A" : "mA"}
          tone="text-green-600"
        />
        <MetricCard
          label="Temperature"
          value={formatNumber(temperature, 0)}
          unit="Â°C"
          tone="text-red-600"
        />
        <MetricCard
          label="Power / Heat"
          value={formatNumber(power, 3)}
          unit="W"
          tone="text-orange-600"
        />
      </div>

      <StructureVisual
        mode={mode}
        material={material}
        voltage={voltage}
        baseResistance={baseResistance}
        rotation={rotation}
        temperature={temperature}
        flowMode={flowMode}
      />

      {showComparison ? (
        <ComparisonPanel
          voltage={voltage}
          baseResistance={baseResistance}
          temperature={temperature}
        />
      ) : null}
    </div>
  );
}
