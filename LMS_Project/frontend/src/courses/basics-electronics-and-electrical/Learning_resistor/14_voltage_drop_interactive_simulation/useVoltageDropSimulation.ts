"use client";

import { useState } from "react";

export function useVoltageDropSimulation() {
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

  function toggleR3() {
    setShowR3((value) => !value);
  }

  return {
    supplyVoltage,
    r1,
    r2,
    r3,
    showR3,
    resistors,
    totalResistance,
    current,
    drops,
    sumDrop,
    powerTotal,
    setSupplyVoltage,
    setR1,
    setR2,
    setR3,
    toggleR3,
  };
}
