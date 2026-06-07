"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { KnowledgeSection } from "./KnowledgeSection";
import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";
import { PotentiometerVisual } from "./PotentiometerVisual";
import type { Mode } from "./types";

export default function WhatIsPotentiometerInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [mode, setMode] = useState<Mode>("voltageDivider");
  const [supplyVoltage, setSupplyVoltage] = useState(5);
  const [totalResistance, setTotalResistance] = useState(10000);
  const [wiperPercent, setWiperPercent] = useState(50);

  const ratio = wiperPercent / 100;
  const rLeft = totalResistance * ratio;
  const rRight = totalResistance * (1 - ratio);
  const terminal1Voltage = 0;
  const terminal3Voltage = supplyVoltage;
  const outputVoltage = supplyVoltage * ratio;
  const wiperVoltage = mode === "voltageDivider" ? outputVoltage : supplyVoltage;
  const rheostatResistance = Math.max(rLeft, 1);
  const rheostatCurrent = supplyVoltage / rheostatResistance;
  const dividerCurrent = supplyVoltage / totalResistance;
  const activeCurrent = mode === "voltageDivider" ? dividerCurrent : rheostatCurrent;
  const power = activeCurrent * activeCurrent * (mode === "voltageDivider" ? totalResistance : rheostatResistance);

  const status = useMemo(() => {
    if (activeCurrent > 0.05) return { label: "HIGH CURRENT", tone: "text-red-600", bg: "bg-red-50 border-red-200" };
    if (activeCurrent > 0.02) return { label: "MEDIUM CURRENT", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    return { label: "SAFE LOW CURRENT", tone: "text-green-600", bg: "bg-green-50 border-green-200" };
  }, [activeCurrent]);

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Potentiometer — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Understand voltage divider and rheostat behavior by moving the wiper and watching voltage, resistance, and current change live.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            mode={mode}
            supplyVoltage={supplyVoltage}
            totalResistance={totalResistance}
            wiperPercent={wiperPercent}
            onModeChange={setMode}
            onSupplyVoltageChange={setSupplyVoltage}
            onTotalResistanceChange={setTotalResistance}
            onWiperPercentChange={setWiperPercent}
          />

          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Wiper Voltage" value={formatNumber(wiperVoltage, 2)} unit="V" tone="text-purple-600" />
              <MetricCard
                label={mode === "voltageDivider" ? "Total Resistance" : "Active Resistance"}
                value={formatResistance(mode === "voltageDivider" ? totalResistance : rheostatResistance).replace(" Ω", "").replace(" kΩ", "")}
                unit={mode === "voltageDivider" ? (totalResistance >= 1000 ? "kΩ" : "Ω") : (rheostatResistance >= 1000 ? "kΩ" : "Ω")}
                tone="text-yellow-600"
              />
              <MetricCard label="Current" value={formatCurrent(activeCurrent).replace(" A", "").replace(" mA", "")} unit={activeCurrent >= 1 ? "A" : "mA"} tone="text-green-600" />
              <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className={`mt-2 text-xl font-bold ${status.tone}`}>{status.label}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600">Terminal 1 Voltage</p>
                <p className="mt-2 text-2xl font-bold text-blue-700">{formatNumber(terminal1Voltage, 2)}V</p>
                <p className="mt-1 text-xs text-slate-600">Usually connected to Ground / 0V</p>
              </div>
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-purple-600">Wiper Voltage</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">{formatNumber(wiperVoltage, 2)}V</p>
                <p className="mt-1 text-xs text-slate-600">Changes with knob position</p>
              </div>
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-green-600">Terminal 3 Voltage</p>
                <p className="mt-2 text-2xl font-bold text-green-700">{formatNumber(terminal3Voltage, 2)}V</p>
                <p className="mt-1 text-xs text-slate-600">Connected to supply voltage</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-purple-600">R1 / Terminal 1 → Wiper</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">{formatResistance(rLeft)}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600">R2 / Wiper → Terminal 3</p>
                <p className="mt-2 text-2xl font-bold text-blue-700">{formatResistance(rRight)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Logic</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {mode === "voltageDivider"
                    ? "Wiper changes the R1/R2 split while total resistance stays the same."
                    : "Wiper changes the active resistance, so current changes with I = V/R."}
                </p>
              </div>
            </div>

            <PotentiometerVisual
              mode={mode}
              supplyVoltage={supplyVoltage}
              totalResistance={totalResistance}
              wiperPercent={wiperPercent}
              terminal1Voltage={terminal1Voltage}
              terminal3Voltage={terminal3Voltage}
              wiperVoltage={wiperVoltage}
            />
          </div>
        </div>

        <KnowledgeSection
          supplyVoltage={supplyVoltage}
          ratio={ratio}
          wiperVoltage={wiperVoltage}
          dividerCurrent={dividerCurrent}
          rheostatResistance={rheostatResistance}
          rheostatCurrent={rheostatCurrent}
        />
      </div>
    </div>
  );
}
