"use client";

import { useMemo, useState } from "react";

import { CapacitanceVisual } from "./CapacitanceVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { MetricCard } from "./MetricCard";
import {
  computeCapacitanceSnapshot,
  dielectricOptions,
  formatCapacitance,
  formatCharge,
  formatEnergy,
  formatNumber,
} from "./logic";

export default function WhatIsCapacitanceInteractiveSimulation() {
  const [plateArea, setPlateArea] = useState(45);
  const [plateDistance, setPlateDistance] = useState(6);
  const [dielectricIndex, setDielectricIndex] = useState(2);
  const [voltage, setVoltage] = useState(12);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeCapacitanceSnapshot({
        plateArea,
        plateDistance,
        dielectricK: dielectric.k,
        voltage,
      }),
    [plateArea, plateDistance, dielectric.k, voltage],
  );

  function resetSimulation() {
    setPlateArea(45);
    setPlateDistance(6);
    setDielectricIndex(2);
    setVoltage(12);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            What is Capacitance? Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Capacitance is a capacitor&apos;s charge storing ability. Change plate area,
            plate distance, dielectric material, and voltage to see how stored charge changes.
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
            label="Stored Charge"
            value={formatCharge(snapshot.charge).split(" ")[0]}
            unit={formatCharge(snapshot.charge).split(" ")[1]}
            tone="text-blue-600"
          />
          <MetricCard
            label="Voltage"
            value={formatNumber(voltage, 1)}
            unit="V"
            tone="text-green-600"
          />
          <MetricCard
            label="Stored Energy"
            value={formatEnergy(snapshot.energy).split(" ")[0]}
            unit={formatEnergy(snapshot.energy).split(" ")[1]}
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            voltage={voltage}
            setVoltage={setVoltage}
            plateArea={plateArea}
            setPlateArea={setPlateArea}
            plateDistance={plateDistance}
            setPlateDistance={setPlateDistance}
            dielectricIndex={dielectricIndex}
            setDielectricIndex={setDielectricIndex}
            capacitance={snapshot.capacitance}
            resetSimulation={resetSimulation}
          />

          <div className="lg:col-span-2">
            <CapacitanceVisual
              plateArea={plateArea}
              plateDistance={plateDistance}
              dielectricIndex={dielectricIndex}
              voltage={voltage}
            />
          </div>
        </div>

        <LearningSections
          plateArea={plateArea}
          plateDistance={plateDistance}
          dielectric={dielectric}
          capacitanceLevel={snapshot.capacitanceLevel}
        />
      </div>
    </div>
  );
}
