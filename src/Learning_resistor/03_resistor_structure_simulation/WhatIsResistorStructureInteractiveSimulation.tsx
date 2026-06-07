"use client";

import { useMemo, useState } from "react";

import { ComparisonPanel } from "./ComparisonPanel";
import { ControlPanelSection } from "./ControlPanelSection";
import { KnowledgeCards } from "./KnowledgeCards";
import { clamp, formatCurrent, formatResistance, formatValue, materials } from "./logic";
import { MetricCard } from "./MetricCard";
import { StructureCanvas } from "./StructureCanvas";
import type { MaterialKey, StructureMode } from "./types";

export default function WhatIsResistorStructureInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [mode, setMode] = useState<StructureMode>("cutaway");
  const [materialKey, setMaterialKey] = useState<MaterialKey>("metal-film");
  const [voltage, setVoltage] = useState(9);
  const [baseResistance, setBaseResistance] = useState(1000);
  const [temperature, setTemperature] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [showComparison, setShowComparison] = useState(true);

  const material = useMemo(() => materials.find((item) => item.key === materialKey) ?? materials[1], [materialKey]);
  const resistance = baseResistance * material.resistanceFactor * (1 + (temperature - 25) * 0.004);
  const current = voltage / Math.max(resistance, 1);
  const power = voltage * current;

  function resetSimulation() {
    setMode("cutaway");
    setMaterialKey("metal-film");
    setVoltage(9);
    setBaseResistance(1000);
    setTemperature(25);
    setRotation(0);
    setShowComparison(true);
  }

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">Industrial-Grade Electronics Learning Engine</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Resistor Structure Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">
            Explore how the shell, core, and resistive material respond to voltage, heat, and construction style.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Resistance" value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "")} unit={resistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
          <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
          <MetricCard label="Temperature" value={formatValue(temperature, 0)} unit="°C" tone="text-red-600" />
          <MetricCard label="Power / Heat" value={formatValue(power, 3)} unit="W" tone="text-orange-600" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              mode={mode}
              materialKey={materialKey}
              voltage={voltage}
              baseResistance={baseResistance}
              temperature={temperature}
              rotation={rotation}
              showComparison={showComparison}
              onModeChange={setMode}
              onMaterialChange={setMaterialKey}
              onVoltageChange={setVoltage}
              onBaseResistanceChange={setBaseResistance}
              onTemperatureChange={setTemperature}
              onRotationChange={setRotation}
              onToggleComparison={() => setShowComparison((value) => !value)}
              onReset={resetSimulation}
            />
          </div>
          <div className="space-y-6">
            <StructureCanvas mode={mode} material={material} voltage={voltage} baseResistance={baseResistance} temperature={temperature} rotation={rotation} />
            {showComparison && <ComparisonPanel voltage={voltage} baseResistance={baseResistance} temperature={temperature} />}
            <KnowledgeCards materialLabel={material.label} materialNote={material.note} />
          </div>
        </div>
      </div>
    </div>
  );
}
