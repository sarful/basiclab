"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { computeWorkingPrincipleSnapshot, formatCharge, formatCurrent, formatEnergy, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";
import { WorkingPrincipleVisual } from "./WorkingPrincipleVisual";
import type { WorkingMode } from "./types";

export default function WhatIsCapacitorWorkingPrincipleInteractiveSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [resistance, setResistance] = useState(1000);
  const [capacitance, setCapacitance] = useState(470);
  const [time, setTime] = useState(0.6);
  const [mode, setMode] = useState<WorkingMode>("charging");

  const snapshot = useMemo(
    () =>
      computeWorkingPrincipleSnapshot({
        supplyVoltage,
        resistance,
        capacitance,
        time,
        mode,
      }),
    [supplyVoltage, resistance, capacitance, time, mode],
  );

  function resetSimulation() {
    setSupplyVoltage(12);
    setResistance(1000);
    setCapacitance(470);
    setTime(0.6);
    setMode("charging");
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Capacitor Working Principle Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A capacitor stores energy through charge separation and electric field formation.
            This lesson animates both charging and discharging behavior.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Capacitor Voltage"
            value={formatNumber(snapshot.capacitorVoltage, 2)}
            unit="V"
            tone="text-purple-600"
          />
          <MetricCard
            label="Current"
            value={formatCurrent(snapshot.current).split(" ")[0]}
            unit={formatCurrent(snapshot.current).split(" ")[1]}
            tone="text-blue-600"
          />
          <MetricCard
            label="Stored Charge"
            value={formatCharge(snapshot.storedCharge).split(" ")[0]}
            unit="uC"
            tone="text-green-600"
          />
          <MetricCard
            label="Stored Energy"
            value={formatEnergy(snapshot.storedEnergy).split(" ")[0]}
            unit="mJ"
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            supplyVoltage={supplyVoltage}
            setSupplyVoltage={setSupplyVoltage}
            resistance={resistance}
            setResistance={setResistance}
            capacitance={capacitance}
            setCapacitance={setCapacitance}
            time={time}
            setTime={setTime}
            maxTime={snapshot.maxTime}
            mode={mode}
            setMode={setMode}
            timeConstant={snapshot.timeConstant}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <WorkingPrincipleVisual
              supplyVoltage={supplyVoltage}
              resistance={resistance}
              capacitance={capacitance}
              timeConstant={snapshot.timeConstant}
              chargeRatio={snapshot.chargeRatio}
              capacitorVoltage={snapshot.capacitorVoltage}
              current={snapshot.current}
              mode={mode}
            />
          </div>
        </div>

        <LearningSections
          capacitorVoltage={snapshot.capacitorVoltage}
          supplyVoltage={supplyVoltage}
          current={snapshot.current}
          maxCurrent={supplyVoltage / resistance}
          storedEnergy={snapshot.storedEnergy}
          maxEnergy={0.5 * snapshot.capacitanceFarad * supplyVoltage * supplyVoltage}
          capacitanceFarad={snapshot.capacitanceFarad}
        />
      </div>
    </div>
  );
}
