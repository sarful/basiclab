"use client";

import { useMemo, useState } from "react";

import { equivalentParallel } from "./logic";
import type { BranchItem } from "./types";

export function useParallelResistorCircuitSimulation() {
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

  return {
    supplyVoltage,
    branches,
    eqResistance,
    branchCurrents,
    totalCurrent,
    totalPower,
    setSupplyVoltage,
    updateBranch,
    addBranch,
    removeBranch,
    resetCircuit,
  };
}
