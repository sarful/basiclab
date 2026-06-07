"use client";

import { useMemo, useState } from "react";

import { CapacitorCircuitVisual } from "./CapacitorCircuitVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { MetricCard } from "./MetricCard";
import {
  computeCapacitorSnapshot,
  formatCapacitance,
  formatCurrent,
  formatEnergy,
  formatNumber,
} from "./logic";
import type { CircuitMode } from "./types";

export default function WhatIsCapacitorInteractiveSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [capacitance, setCapacitance] = useState(470);
  const [resistance, setResistance] = useState(1000);
  const [time, setTime] = useState(1);
  const [mode, setMode] = useState<CircuitMode>("charge");

  const snapshot = useMemo(
    () =>
      computeCapacitorSnapshot({
        supplyVoltage,
        capacitance,
        resistance,
        time,
        mode,
      }),
    [supplyVoltage, capacitance, resistance, time, mode],
  );

  function resetCircuit() {
    setSupplyVoltage(12);
    setCapacitance(470);
    setResistance(1000);
    setTime(1);
    setMode("charge");
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            What is a Capacitor? Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A capacitor stores charge and energy by building an electric field between
            two conductive plates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Capacitance"
            value={formatCapacitance(capacitance).replace(" uF", "").replace(" mF", "")}
            unit={capacitance >= 1000 ? "mF" : "uF"}
            tone="text-purple-600"
          />
          <MetricCard
            label="Capacitor Voltage"
            value={formatNumber(snapshot.capacitorVoltage, 2)}
            unit="V"
            tone="text-blue-600"
          />
          <MetricCard
            label="Instant Current"
            value={formatCurrent(Math.abs(snapshot.current)).replace(" A", "").replace(" mA", "")}
            unit={Math.abs(snapshot.current) >= 1 ? "A" : "mA"}
            tone="text-green-600"
          />
          <MetricCard
            label="Stored Energy"
            value={formatEnergy(snapshot.storedEnergy).replace(" mJ", "").replace(" uJ", "")}
            unit={snapshot.storedEnergy >= 0.001 ? "mJ" : "uJ"}
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            supplyVoltage={supplyVoltage}
            setSupplyVoltage={setSupplyVoltage}
            capacitance={capacitance}
            setCapacitance={setCapacitance}
            resistance={resistance}
            setResistance={setResistance}
            time={time}
            setTime={setTime}
            maxTime={snapshot.maxTime}
            mode={mode}
            setMode={setMode}
            storedCharge={snapshot.storedCharge}
            resetCircuit={resetCircuit}
          />

          <div className="lg:col-span-2">
            <CapacitorCircuitVisual
              supplyVoltage={supplyVoltage}
              resistance={resistance}
              capacitance={capacitance}
              chargeLevel={snapshot.chargeLevel}
              capacitorVoltage={snapshot.capacitorVoltage}
              current={snapshot.current}
              mode={mode}
              timeConstant={snapshot.timeConstant}
            />
          </div>
        </div>

        <LearningSections
          chargeLevel={snapshot.chargeLevel}
          capacitorVoltage={snapshot.capacitorVoltage}
          supplyVoltage={supplyVoltage}
          current={snapshot.current}
          maxCurrent={supplyVoltage / resistance}
        />
      </div>
    </div>
  );
}
