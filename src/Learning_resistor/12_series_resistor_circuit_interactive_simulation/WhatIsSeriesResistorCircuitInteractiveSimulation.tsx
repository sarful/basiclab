"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { DropBar } from "./DropBar";
import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { KnowledgeSection } from "./KnowledgeSection";
import { MetricCard } from "./MetricCard";
import { SeriesCircuitVisual } from "./SeriesCircuitVisual";
import type { ResistorItem } from "./types";

function LessonContent() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [resistors, setResistors] = useState<ResistorItem[]>([
    { id: 1, value: 1000 },
    { id: 2, value: 2200 },
  ]);

  const totalResistance = useMemo(() => resistors.reduce((sum, item) => sum + item.value, 0), [resistors]);
  const current = supplyVoltage / totalResistance;
  const voltageDrops = resistors.map((item) => current * item.value);
  const totalPower = supplyVoltage * current;

  function updateResistor(id: number, value: number) {
    setResistors((items) => items.map((item) => (item.id === id ? { ...item, value } : item)));
  }

  function addResistor() {
    if (resistors.length >= 5) return;
    setResistors((items) => [...items, { id: Date.now(), value: 1000 }]);
  }

  function removeResistor(id: number) {
    if (resistors.length <= 1) return;
    setResistors((items) => items.filter((item) => item.id !== id));
  }

  function resetCircuit() {
    setSupplyVoltage(12);
    setResistors([
      { id: 1, value: 1000 },
      { id: 2, value: 2200 },
    ]);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-700">Interactive Electronics Trainer</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Series Resistor Circuit Simulation</h1>
        <p className="mt-2 text-sm text-slate-600">In a series circuit, resistors are connected one after another. Total resistance adds together, current stays the same, and voltage is divided.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Resistance" value={formatResistance(totalResistance).replace(" Ω", "").replace(" kΩ", "")} unit={totalResistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
        <MetricCard label="Same Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
        <MetricCard label="Supply Voltage" value={formatNumber(supplyVoltage, 1)} unit="V" tone="text-blue-600" />
        <MetricCard label="Total Power" value={formatNumber(totalPower, 3)} unit="W" tone="text-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ControlPanelSection
          supplyVoltage={supplyVoltage}
          resistors={resistors}
          onSupplyVoltageChange={setSupplyVoltage}
          onUpdateResistor={updateResistor}
          onAddResistor={addResistor}
          onRemoveResistor={removeResistor}
          onResetCircuit={resetCircuit}
        />

        <div className="lg:col-span-2">
          <SeriesCircuitVisual supplyVoltage={supplyVoltage} resistors={resistors} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Voltage Distribution</h2>
          <div className="space-y-4">
            {voltageDrops.map((drop, index) => (
              <DropBar
                key={resistors[index].id}
                label={`R${index + 1} Voltage Drop`}
                value={drop}
                total={supplyVoltage}
                color={["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ef4444"][index] || "#64748b"}
              />
            ))}
          </div>
        </div>

        <KnowledgeSection />
      </div>
    </div>
  );
}

export default function WhatIsSeriesResistorCircuitInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
