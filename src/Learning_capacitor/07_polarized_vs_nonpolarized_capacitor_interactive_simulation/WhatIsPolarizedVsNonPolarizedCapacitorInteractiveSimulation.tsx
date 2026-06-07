"use client";

import { useMemo, useState } from "react";

import { computeComparisonSnapshot, formatNumber } from "./logic";
import { ControlPanelSection } from "./ControlPanelSection";
import { LearningSections } from "./LearningSections";
import { MetricCard } from "./MetricCard";
import { NonPolarizedCapacitorCard } from "./NonPolarizedCapacitorCard";
import { PolarizedCapacitorCard } from "./PolarizedCapacitorCard";

export default function WhatIsPolarizedVsNonPolarizedCapacitorInteractiveSimulation() {
  const [voltage, setVoltage] = useState(12);
  const [reverse, setReverse] = useState(false);
  const [frequency, setFrequency] = useState(1000);

  const snapshot = useMemo(
    () =>
      computeComparisonSnapshot({
        voltage,
        frequency,
      }),
    [voltage, frequency],
  );

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Polarized vs Non-Polarized Capacitor Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Polarized capacitors care about direction. Non-polarized capacitors can be
            connected either way. This lesson compares both behaviors side by side.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Applied Voltage"
            value={formatNumber(voltage, 0)}
            unit="V"
            tone="text-orange-600"
          />
          <MetricCard
            label="Voltage Safety"
            value={formatNumber(snapshot.safeMargin * 100, 0)}
            unit="%"
            tone={snapshot.safeMargin > 0.2 ? "text-green-600" : "text-red-600"}
          />
          <MetricCard
            label="AC Frequency"
            value={formatNumber(frequency, 0)}
            unit="Hz"
            tone="text-blue-600"
          />
          <MetricCard
            label="AC Behavior"
            value={formatNumber(snapshot.acBehavior * 100, 0)}
            unit="%"
            tone="text-purple-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            voltage={voltage}
            setVoltage={setVoltage}
            reverse={reverse}
            setReverse={setReverse}
            frequency={frequency}
            setFrequency={setFrequency}
          />

          <div className="grid gap-6 lg:col-span-2">
            <PolarizedCapacitorCard voltage={voltage} reverse={reverse} />
            <NonPolarizedCapacitorCard frequency={frequency} />
          </div>
        </div>

        <LearningSections />
      </div>
    </div>
  );
}
