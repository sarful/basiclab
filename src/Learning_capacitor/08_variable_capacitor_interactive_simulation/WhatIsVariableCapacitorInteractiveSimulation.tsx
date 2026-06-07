"use client";

import { useMemo, useState } from "react";

import { computeVariableCapacitorSnapshot, formatCapacitance, formatFrequency, formatNumber } from "./logic";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { MetricCard } from "./MetricCard";
import { VariableCapacitorVisual } from "./VariableCapacitorVisual";

export default function WhatIsVariableCapacitorInteractiveSimulation() {
  const [rotation, setRotation] = useState(90);
  const [minCapacitance, setMinCapacitance] = useState(10);
  const [maxCapacitance, setMaxCapacitance] = useState(365);
  const [inductanceUh, setInductanceUh] = useState(220);
  const [plateCount, setPlateCount] = useState(7);

  const snapshot = useMemo(
    () =>
      computeVariableCapacitorSnapshot({
        rotation,
        minCapacitance,
        maxCapacitance,
        inductanceUh,
      }),
    [rotation, minCapacitance, maxCapacitance, inductanceUh],
  );

  function resetSimulation() {
    setRotation(90);
    setMinCapacitance(10);
    setMaxCapacitance(365);
    setInductanceUh(220);
    setPlateCount(7);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Variable Capacitor Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A variable capacitor changes capacitance through mechanical rotation.
            It is commonly used for radio tuning and oscillator circuits.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Capacitance"
            value={formatCapacitance(snapshot.capacitance).split(" ")[0]}
            unit={formatCapacitance(snapshot.capacitance).split(" ")[1]}
            tone="text-purple-600"
          />
          <MetricCard
            label="Overlap"
            value={formatNumber(snapshot.overlapRatio * 100, 0)}
            unit="%"
            tone="text-blue-600"
          />
          <MetricCard
            label="Tuned Frequency"
            value={formatFrequency(snapshot.frequency).split(" ")[0]}
            unit={formatFrequency(snapshot.frequency).split(" ")[1]}
            tone="text-green-600"
          />
          <MetricCard
            label="Plate Count"
            value={String(plateCount)}
            unit="plates"
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            rotation={rotation}
            setRotation={setRotation}
            minCapacitance={minCapacitance}
            setMinCapacitance={setMinCapacitance}
            maxCapacitance={maxCapacitance}
            setMaxCapacitance={setMaxCapacitance}
            inductanceUh={inductanceUh}
            setInductanceUh={setInductanceUh}
            plateCount={plateCount}
            setPlateCount={setPlateCount}
            frequencyLabel={formatFrequency(snapshot.frequency)}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <VariableCapacitorVisual
              rotation={rotation}
              minCapacitance={minCapacitance}
              maxCapacitance={maxCapacitance}
              inductanceUh={inductanceUh}
              plateCount={plateCount}
            />
          </div>
        </div>

        <LearningSections
          overlapRatio={snapshot.overlapRatio}
          capacitance={snapshot.capacitance}
          minCapacitance={minCapacitance}
          maxCapacitance={maxCapacitance}
          tuningPercent={snapshot.tuningPercent}
        />
      </div>
    </div>
  );
}
