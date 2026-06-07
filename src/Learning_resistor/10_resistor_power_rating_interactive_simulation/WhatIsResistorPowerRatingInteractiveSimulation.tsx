"use client";

import { useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { getStatus, formatCurrent, formatNumber, packages, recommendedPackage, resistorValues } from "./logic";
import { KnowledgeSection } from "./KnowledgeSection";
import { MetricCard } from "./MetricCard";
import { PowerVisual } from "./PowerVisual";

export default function WhatIsResistorPowerRatingInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(220);
  const [rating, setRating] = useState(0.25);

  const selectedPackage = packages.find((item) => item.watt === rating) || packages[1];
  const current = voltage / resistance;
  const power = voltage * current;
  const powerByI2R = current * current * resistance;
  const powerByV2R = (voltage * voltage) / resistance;
  const status = getStatus(power, rating);
  const recommended = recommendedPackage(power);
  const safetyMargin = rating / Math.max(power, 0.000001);

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-red-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Resistor Power Rating Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Learn how resistor wattage limits heat dissipation and how to choose a safer package.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              voltage={voltage}
              resistance={resistance}
              rating={rating}
              selectedPackageLabel={selectedPackage.label}
              statusMessage={status.message}
              recommendedLabel={recommended.label}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
              onRatingChange={setRating}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Actual Power" value={formatNumber(power, 3)} unit="W" tone={power > rating ? "text-red-600" : "text-orange-600"} />
              <MetricCard label="Power Rating" value={formatNumber(rating, 3)} unit="W" tone="text-blue-600" />
              <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
              <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className={`mt-2 text-xl font-bold ${status.tone}`}>{status.label}</p>
              </div>
            </div>

            <PowerVisual voltage={voltage} resistance={resistance} rating={rating} selectedPackage={selectedPackage} />

            <KnowledgeSection
              voltage={voltage}
              resistance={resistance}
              current={current}
              power={power}
              powerByI2R={powerByI2R}
              powerByV2R={powerByV2R}
              safetyMargin={safetyMargin}
              recommendedLabel={recommended.label}
              rating={rating}
              onRatingChange={setRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
