"use client";

import { useMemo, useState } from "react";

import { BranchCurrentSection } from "./BranchCurrentSection";
import { ControlPanelSection } from "./ControlPanelSection";
import { equivalentParallel, formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";
import { ParallelCircuitVisual } from "./ParallelCircuitVisual";
import type { BranchItem } from "./types";
import { KnowledgeSection } from "./KnowledgeSection";

function LessonContent() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [branches, setBranches] = useState<BranchItem[]>([
    { id: 1, value: 1000 },
    { id: 2, value: 2200 },
  ]);

  const eqResistance = useMemo(() => equivalentParallel(branches), [branches]);
  const branchCurrents = branches.map((item) => supplyVoltage / item.value);
  const totalCurrent = branchCurrents.reduce((sum, value) => sum + value, 0);
  const totalPower = supplyVoltage * totalCurrent;

  function updateBranch(id: number, value: number) {
    setBranches((items) =>
      items.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  }

  function addBranch() {
    if (branches.length >= 5) return;
    setBranches((items) => [...items, { id: Date.now(), value: 1000 }]);
  }

  function removeBranch(id: number) {
    if (branches.length <= 1) return;
    setBranches((items) => items.filter((item) => item.id !== id));
  }

  function resetCircuit() {
    setSupplyVoltage(12);
    setBranches([
      { id: 1, value: 1000 },
      { id: 2, value: 2200 },
    ]);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
          Interactive Electronics Trainer
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Parallel Resistor Circuit Simulation
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          In a parallel circuit, resistors are connected in separate branches.
          Voltage stays the same, current divides, and equivalent resistance
          decreases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Equivalent Resistance"
          value={formatResistance(eqResistance).replace(" Ω", "").replace(" kΩ", "")}
          unit={eqResistance >= 1000 ? "kΩ" : "Ω"}
          tone="text-purple-600"
        />
        <MetricCard
          label="Total Current"
          value={formatCurrent(totalCurrent).replace(" A", "").replace(" mA", "")}
          unit={totalCurrent >= 1 ? "A" : "mA"}
          tone="text-green-600"
        />
        <MetricCard
          label="Supply Voltage"
          value={formatNumber(supplyVoltage, 1)}
          unit="V"
          tone="text-blue-600"
        />
        <MetricCard
          label="Total Power"
          value={formatNumber(totalPower, 3)}
          unit="W"
          tone="text-orange-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ControlPanelSection
          supplyVoltage={supplyVoltage}
          branches={branches}
          onSetSupplyVoltage={setSupplyVoltage}
          onUpdateBranch={updateBranch}
          onRemoveBranch={removeBranch}
          onAddBranch={addBranch}
          onReset={resetCircuit}
        />

        <div className="lg:col-span-2">
          <ParallelCircuitVisual supplyVoltage={supplyVoltage} branches={branches} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BranchCurrentSection
          branches={branches}
          branchCurrents={branchCurrents}
          totalCurrent={totalCurrent}
        />
        <KnowledgeSection />
      </div>
    </div>
  );
}

export default function WhatIsParallelResistorCircuitInteractiveSimulation({
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
