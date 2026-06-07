"use client";

import { useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { KnowledgeSection } from "./KnowledgeSection";
import { MetricCard } from "./MetricCard";
import { VoltageBar } from "./VoltageBar";
import { VoltageDropCircuit } from "./VoltageDropCircuit";

function LessonContent() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [r1, setR1] = useState(1000);
  const [r2, setR2] = useState(2200);
  const [r3, setR3] = useState(4700);
  const [showR3, setShowR3] = useState(false);

  const resistors = showR3 ? [r1, r2, r3] : [r1, r2];
  const totalResistance = resistors.reduce((sum, value) => sum + value, 0);
  const current = supplyVoltage / totalResistance;
  const drops = resistors.map((resistance) => current * resistance);
  const sumDrop = drops.reduce((sum, value) => sum + value, 0);
  const powerTotal = supplyVoltage * current;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-700">
          Interactive Electronics Trainer
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Voltage Drop Simulation
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Voltage drop means the supply voltage is shared across resistors in a
          series circuit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Supply Voltage" value={formatNumber(supplyVoltage, 1)} unit="V" tone="text-blue-600" />
        <MetricCard
          label="Current"
          value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
          unit={current >= 1 ? "A" : "mA"}
          tone="text-green-600"
        />
        <MetricCard
          label="Total Resistance"
          value={formatResistance(totalResistance).replace(" Ω", "").replace(" kΩ", "")}
          unit={totalResistance >= 1000 ? "kΩ" : "Ω"}
          tone="text-yellow-600"
        />
        <MetricCard label="Total Power" value={formatNumber(powerTotal, 3)} unit="W" tone="text-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ControlPanelSection
          supplyVoltage={supplyVoltage}
          r1={r1}
          r2={r2}
          r3={r3}
          showR3={showR3}
          onSetSupplyVoltage={setSupplyVoltage}
          onSetR1={setR1}
          onSetR2={setR2}
          onSetR3={setR3}
          onToggleR3={() => setShowR3(!showR3)}
        />

        <div className="lg:col-span-2">
          <VoltageDropCircuit
            supplyVoltage={supplyVoltage}
            r1={r1}
            r2={r2}
            r3={r3}
            showR3={showR3}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Voltage Drop Distribution</h2>
          <div className="space-y-4">
            <VoltageBar label="R1 Drop" value={drops[0]} total={supplyVoltage} color="#2563eb" />
            <VoltageBar label="R2 Drop" value={drops[1]} total={supplyVoltage} color="#16a34a" />
            {showR3 && <VoltageBar label="R3 Drop" value={drops[2]} total={supplyVoltage} color="#f97316" />}
          </div>
        </div>

        <KnowledgeSection
          supplyVoltage={supplyVoltage}
          totalResistance={totalResistance}
          current={current}
          showR3={showR3}
          sumDrop={sumDrop}
        />
      </div>
    </div>
  );
}

export default function WhatIsVoltageDropInteractiveSimulation({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
