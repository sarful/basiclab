"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import LearningSections from "./LearningSections";
import { computeTransformerSnapshot, formatNumber } from "./logic";
import MetricCard from "./MetricCard";
import TransformerVisual from "./TransformerVisual";

export default function WhatIsTransformerInteractiveSimulation() {
  const [inputVoltage, setInputVoltage] = useState(220);
  const [primaryTurns, setPrimaryTurns] = useState(10);
  const [secondaryTurns, setSecondaryTurns] = useState(5);
  const [frequency, setFrequency] = useState(50);

  const { turnsRatio, outputVoltage, efficiency, fluxLevel } = useMemo(
    () =>
      computeTransformerSnapshot({
        inputVoltage,
        primaryTurns,
        secondaryTurns,
        frequency,
      }),
    [frequency, inputVoltage, primaryTurns, secondaryTurns],
  );

  function resetSimulation() {
    setInputVoltage(220);
    setPrimaryTurns(10);
    setSecondaryTurns(5);
    setFrequency(50);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-purple-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            What is Transformer - Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A transformer is an electrical device that uses a changing magnetic
            field to step AC voltage up or down. It works on the principle of
            electromagnetic induction.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Input Voltage"
            value={formatNumber(inputVoltage, 0)}
            unit="V"
            tone="text-blue-600"
          />
          <MetricCard
            label="Output Voltage"
            value={formatNumber(outputVoltage, 1)}
            unit="V"
            tone="text-red-600"
          />
          <MetricCard
            label="Turns Ratio"
            value={formatNumber(turnsRatio, 2)}
            unit="ratio"
            tone="text-purple-600"
          />
          <MetricCard
            label="Efficiency"
            value={formatNumber(efficiency * 100, 0)}
            unit="%"
            tone="text-green-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            inputVoltage={inputVoltage}
            setInputVoltage={setInputVoltage}
            primaryTurns={primaryTurns}
            setPrimaryTurns={setPrimaryTurns}
            secondaryTurns={secondaryTurns}
            setSecondaryTurns={setSecondaryTurns}
            frequency={frequency}
            setFrequency={setFrequency}
            outputVoltage={outputVoltage}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <TransformerVisual
              primaryTurns={primaryTurns}
              secondaryTurns={secondaryTurns}
              inputVoltage={inputVoltage}
              frequency={frequency}
            />
          </div>
        </div>

        <LearningSections
          fluxLevel={fluxLevel}
          turnsRatio={turnsRatio}
          efficiency={efficiency}
        />
      </div>
    </div>
  );
}
