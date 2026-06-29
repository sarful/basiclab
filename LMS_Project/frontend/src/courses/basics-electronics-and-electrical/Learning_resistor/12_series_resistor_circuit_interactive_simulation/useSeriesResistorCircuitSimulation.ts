"use client";

import { useMemo, useState } from "react";

import type { ResistorItem } from "./types";

export function useSeriesResistorCircuitSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [resistors, setResistors] = useState<ResistorItem[]>([
    { id: 1, value: 1000 },
    { id: 2, value: 2200 },
  ]);

  const totalResistance = useMemo(
    () => resistors.reduce((sum, item) => sum + item.value, 0),
    [resistors],
  );
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

  return {
    supplyVoltage,
    resistors,
    totalResistance,
    current,
    voltageDrops,
    totalPower,
    setSupplyVoltage,
    updateResistor,
    addResistor,
    removeResistor,
    resetCircuit,
  };
}
