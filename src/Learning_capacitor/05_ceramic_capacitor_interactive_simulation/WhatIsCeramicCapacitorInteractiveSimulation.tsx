"use client";

import { useMemo, useState } from "react";

import { CeramicCapacitorVisual } from "./CeramicCapacitorVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { computeCeramicSnapshot, dielectricOptions, formatCapacitancePf, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

export default function WhatIsCeramicCapacitorInteractiveSimulation() {
  const [code, setCode] = useState("104");
  const [dielectricIndex, setDielectricIndex] = useState(1);
  const [appliedVoltage, setAppliedVoltage] = useState(5);
  const [voltageRating, setVoltageRating] = useState(50);
  const [frequency, setFrequency] = useState(1000);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeCeramicSnapshot({
        code,
        dielectric,
        appliedVoltage,
        voltageRating,
        frequency,
      }),
    [code, dielectric, appliedVoltage, voltageRating, frequency],
  );

  function resetSimulation() {
    setCode("104");
    setDielectricIndex(1);
    setAppliedVoltage(5);
    setVoltageRating(50);
    setFrequency(1000);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ceramic Capacitor Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A ceramic capacitor is a non-polarized capacitor that uses ceramic as the dielectric.
            It is widely used for noise filtering, bypassing, and high-frequency work.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Capacitance"
            value={formatCapacitancePf(snapshot.capacitancePf).split(" ")[0]}
            unit={formatCapacitancePf(snapshot.capacitancePf).split(" ")[1]}
            tone="text-orange-600"
          />
          <MetricCard label="Code" value={code} unit="marking" tone="text-blue-600" />
          <MetricCard
            label="Safety Margin"
            value={formatNumber(snapshot.safePercent, 0)}
            unit="%"
            tone="text-green-600"
          />
          <MetricCard
            label="Reactance"
            value={formatNumber(
              snapshot.reactanceOhm >= 1000 ? snapshot.reactanceOhm / 1000 : snapshot.reactanceOhm,
              2,
            )}
            unit={snapshot.reactanceOhm >= 1000 ? "kOhm" : "Ohm"}
            tone="text-purple-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            code={code}
            setCode={setCode}
            dielectricIndex={dielectricIndex}
            setDielectricIndex={setDielectricIndex}
            appliedVoltage={appliedVoltage}
            setAppliedVoltage={setAppliedVoltage}
            voltageRating={voltageRating}
            setVoltageRating={setVoltageRating}
            frequency={frequency}
            setFrequency={setFrequency}
            reactanceOhm={snapshot.reactanceOhm}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <CeramicCapacitorVisual
              code={code}
              dielectricIndex={dielectricIndex}
              appliedVoltage={appliedVoltage}
              voltageRating={voltageRating}
              frequency={frequency}
            />
          </div>
        </div>

        <LearningSections
          filterEffect={snapshot.filterEffect}
          safePercent={snapshot.safePercent}
          stabilityPercent={snapshot.stabilityPercent}
          dielectric={dielectric}
        />
      </div>
    </div>
  );
}
