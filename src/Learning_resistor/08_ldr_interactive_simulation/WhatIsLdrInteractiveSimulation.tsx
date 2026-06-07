"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { KnowledgeSection } from "./KnowledgeSection";
import { calculateLdrResistance, clamp, formatNumber, formatResistance } from "./logic";
import { LdrGraph } from "./LdrGraph";
import { LdrVisual } from "./LdrVisual";
import { MetricCard } from "./MetricCard";

export default function WhatIsLdrInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [lightPercent, setLightPercent] = useState(35);
  const [darkResistance, setDarkResistance] = useState(100000);
  const [fixedResistor, setFixedResistor] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(() => calculateLdrResistance(lightPercent, darkResistance), [lightPercent, darkResistance]);
  const current = voltage / Math.max(resistance + fixedResistor, 1);
  const outputVoltage = voltage * (resistance / (fixedResistor + resistance));
  const lampLevel = clamp(outputVoltage / Math.max(voltage, 1), 0, 1);
  const lampStatus =
    lampLevel > 0.65
      ? { label: "LIGHT ON", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
      : lampLevel > 0.25
        ? { label: "DIM / TRANSITION", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
        : { label: "LIGHT OFF", tone: "text-slate-700", bg: "bg-slate-50 border-slate-200" };

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-yellow-50 via-white to-slate-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">LDR Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Explore how an LDR changes resistance with light and controls a simple street-light response.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              lightPercent={lightPercent}
              darkResistance={darkResistance}
              fixedResistor={fixedResistor}
              voltage={voltage}
              onLightPercentChange={setLightPercent}
              onDarkResistanceChange={setDarkResistance}
              onFixedResistorChange={setFixedResistor}
              onVoltageChange={setVoltage}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Light Intensity" value={formatNumber(lightPercent, 0)} unit="%" tone="text-yellow-600" />
              <MetricCard
                label="LDR Resistance"
                value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "").replace(" MΩ", "")}
                unit={resistance >= 1000000 ? "MΩ" : resistance >= 1000 ? "kΩ" : "Ω"}
                tone="text-yellow-700"
              />
              <MetricCard label="Output Voltage" value={formatNumber(outputVoltage, 2)} unit="V" tone="text-purple-600" />
              <div className={`rounded-2xl border p-4 shadow-sm ${lampStatus.bg}`}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Street Light</p>
                <p className={`mt-2 text-xl font-bold ${lampStatus.tone}`}>{lampStatus.label}</p>
              </div>
            </div>

            <LdrVisual lightPercent={lightPercent} resistance={resistance} voltage={voltage} fixedResistor={fixedResistor} />

            <div className="grid gap-6 lg:grid-cols-3">
              <LdrGraph darkResistance={darkResistance} lightPercent={lightPercent} />
              <KnowledgeSection resistance={resistance} outputVoltage={outputVoltage} current={current} voltage={voltage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
