"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { KnowledgeSection } from "./KnowledgeSection";
import { calculateThermistorResistance, formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";
import { ThermistorGraph } from "./ThermistorGraph";
import { ThermistorVisual } from "./ThermistorVisual";
import type { ThermistorMode } from "./types";

export default function WhatIsThermistorInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [mode, setMode] = useState<ThermistorMode>("ntc");
  const [temperature, setTemperature] = useState(25);
  const [nominalResistance, setNominalResistance] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(() => calculateThermistorResistance(mode, nominalResistance, temperature), [mode, nominalResistance, temperature]);
  const current = voltage / Math.max(resistance, 1);
  const status =
    temperature > 85
      ? { label: "HIGH TEMP", tone: "text-red-600", bg: "bg-red-50 border-red-200" }
      : temperature > 55
        ? { label: "WARM", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
        : { label: "NORMAL", tone: "text-green-600", bg: "bg-green-50 border-green-200" };

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-red-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-red-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Thermistor Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Explore how thermistors respond to temperature and how that changes resistance and current.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              mode={mode}
              temperature={temperature}
              nominalResistance={nominalResistance}
              voltage={voltage}
              onModeChange={setMode}
              onTemperatureChange={setTemperature}
              onNominalResistanceChange={setNominalResistance}
              onVoltageChange={setVoltage}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Temperature" value={formatNumber(temperature, 0)} unit="°C" tone="text-red-600" />
              <MetricCard
                label="Resistance"
                value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "").replace(" MΩ", "")}
                unit={resistance >= 1000000 ? "MΩ" : resistance >= 1000 ? "kΩ" : "Ω"}
                tone="text-yellow-600"
              />
              <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
              <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className={`mt-2 text-2xl font-bold ${status.tone}`}>{status.label}</p>
              </div>
            </div>

            <ThermistorVisual mode={mode} temperature={temperature} resistance={resistance} voltage={voltage} />

            <div className="grid gap-6 lg:grid-cols-3">
              <ThermistorGraph mode={mode} nominalResistance={nominalResistance} />
              <KnowledgeSection mode={mode} resistance={resistance} voltage={voltage} current={current} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
