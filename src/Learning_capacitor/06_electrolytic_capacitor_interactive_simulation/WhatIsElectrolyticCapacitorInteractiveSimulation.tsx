"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ElectrolyticVisual } from "./ElectrolyticVisual";
import { LearningSections } from "./LearningSections";
import { computeElectrolyticSnapshot, formatCapacitance, formatEnergy, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";
import type { PolarityMode } from "./types";

export default function WhatIsElectrolyticCapacitorInteractiveSimulation() {
  const [capacitance, setCapacitance] = useState(470);
  const [voltageRating, setVoltageRating] = useState(25);
  const [appliedVoltage, setAppliedVoltage] = useState(12);
  const [esr, setEsr] = useState(0.22);
  const [rippleCurrent, setRippleCurrent] = useState(0.4);
  const [polarity, setPolarity] = useState<PolarityMode>("correct");

  const snapshot = useMemo(
    () =>
      computeElectrolyticSnapshot({
        capacitance,
        voltageRating,
        appliedVoltage,
        esr,
        rippleCurrent,
        polarity,
      }),
    [capacitance, voltageRating, appliedVoltage, esr, rippleCurrent, polarity],
  );

  function resetSimulation() {
    setCapacitance(470);
    setVoltageRating(25);
    setAppliedVoltage(12);
    setEsr(0.22);
    setRippleCurrent(0.4);
    setPolarity("correct");
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Electrolytic Capacitor Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            An electrolytic capacitor is a polarized high-capacitance component.
            This lesson focuses on stripe marking, polarity, ESR, and voltage rating.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Capacitance"
            value={formatCapacitance(capacitance).replace(" uF", "").replace(" mF", "")}
            unit={capacitance >= 1000 ? "mF" : "uF"}
            tone="text-orange-600"
          />
          <MetricCard
            label="Stored Energy"
            value={formatEnergy(snapshot.storedEnergy).split(" ")[0]}
            unit={formatEnergy(snapshot.storedEnergy).split(" ")[1]}
            tone="text-blue-600"
          />
          <MetricCard
            label="Voltage Margin"
            value={formatNumber(voltageRating - appliedVoltage, 1)}
            unit="V"
            tone={voltageRating >= appliedVoltage ? "text-green-600" : "text-red-600"}
          />
          <MetricCard
            label="ESR Heat"
            value={formatNumber(snapshot.heatLoss * 1000, 2)}
            unit="mW"
            tone="text-red-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            capacitance={capacitance}
            setCapacitance={setCapacitance}
            voltageRating={voltageRating}
            setVoltageRating={setVoltageRating}
            appliedVoltage={appliedVoltage}
            setAppliedVoltage={setAppliedVoltage}
            esr={esr}
            setEsr={setEsr}
            rippleCurrent={rippleCurrent}
            setRippleCurrent={setRippleCurrent}
            polarity={polarity}
            setPolarity={setPolarity}
            storedEnergy={snapshot.storedEnergy}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <ElectrolyticVisual
              capacitance={capacitance}
              voltageRating={voltageRating}
              appliedVoltage={appliedVoltage}
              esr={esr}
              rippleCurrent={rippleCurrent}
              polarity={polarity}
            />
          </div>
        </div>

        <LearningSections
          smoothingLevel={snapshot.smoothingLevel}
          safetyMargin={snapshot.safetyMargin}
          leakageRisk={snapshot.leakageRisk}
          heatLoss={snapshot.heatLoss}
        />
      </div>
    </div>
  );
}
