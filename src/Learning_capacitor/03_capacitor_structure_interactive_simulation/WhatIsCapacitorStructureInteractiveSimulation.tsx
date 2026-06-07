"use client";

import { useMemo, useState } from "react";

import { CapacitorStructureVisual } from "./CapacitorStructureVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { MetricCard } from "./MetricCard";
import { computeStructureSnapshot, dielectricOptions, formatCapacitance, formatNumber } from "./logic";

export default function WhatIsCapacitorStructureInteractiveSimulation() {
  const [plateArea, setPlateArea] = useState(40);
  const [plateDistance, setPlateDistance] = useState(8);
  const [dielectricIndex, setDielectricIndex] = useState(1);
  const [showField, setShowField] = useState(true);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeStructureSnapshot({
        plateArea,
        plateDistance,
        dielectricK: dielectric.k,
      }),
    [plateArea, plateDistance, dielectric.k],
  );

  function resetStructure() {
    setPlateArea(40);
    setPlateDistance(8);
    setDielectricIndex(1);
    setShowField(true);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Capacitor Structure Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A capacitor is usually made from two conductive plates and a dielectric material between them.
            This simulation shows how structure changes capacitance.
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
            label="Plate Area"
            value={formatNumber(plateArea, 0)}
            unit="cm2"
            tone="text-blue-600"
          />
          <MetricCard
            label="Plate Distance"
            value={formatNumber(plateDistance, 1)}
            unit="mm"
            tone="text-green-600"
          />
          <MetricCard
            label="Dielectric k"
            value={formatNumber(dielectric.k, 1)}
            unit="relative"
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            plateArea={plateArea}
            setPlateArea={setPlateArea}
            plateDistance={plateDistance}
            setPlateDistance={setPlateDistance}
            dielectricIndex={dielectricIndex}
            setDielectricIndex={setDielectricIndex}
            showField={showField}
            setShowField={setShowField}
            capacitance={snapshot.capacitance}
            resetStructure={resetStructure}
          />

          <div className="lg:col-span-2">
            <CapacitorStructureVisual
              plateArea={plateArea}
              plateDistance={plateDistance}
              dielectricIndex={dielectricIndex}
              showField={showField}
            />
          </div>
        </div>

        <LearningSections
          plateArea={plateArea}
          plateDistance={plateDistance}
          dielectric={dielectric}
          relativeEffect={snapshot.relativeEffect}
        />
      </div>
    </div>
  );
}
