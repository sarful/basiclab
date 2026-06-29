"use client";

import { useMemo, useState } from "react";

import { calculateBaseCurrent, clamp, formatNumber } from "./logic";
import type { TransistorType } from "./types";

export function useTransistorStructureSimulation() {
  const [transistorType, setTransistorType] = useState<TransistorType>("NPN");
  const [active, setActive] = useState(true);
  const [dopingLevel, setDopingLevel] = useState(70);
  const [collectorVoltage, setCollectorVoltage] = useState(11);
  const [baseVoltage, setBaseVoltage] = useState(0.9);
  const [baseResistance, setBaseResistance] = useState(8000);
  const [loadResistance, setLoadResistance] = useState(300);
  const [showPhysics, setShowPhysics] = useState(true);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showElectronFlow, setShowElectronFlow] = useState(true);

  const transistorGain = useMemo(
    () => clamp(dopingLevel * 2, 20, 200),
    [dopingLevel],
  );
  const baseCurrent = useMemo(
    () => calculateBaseCurrent(active, Math.abs(baseVoltage), baseResistance),
    [active, baseVoltage, baseResistance],
  );
  const isBiased = baseCurrent >= 0.00002;
  const collectorCurrent = useMemo(
    () =>
      isBiased
        ? clamp(baseCurrent * transistorGain, 0, collectorVoltage / loadResistance)
        : 0,
    [isBiased, baseCurrent, transistorGain, collectorVoltage, loadResistance],
  );
  const lampGlow = useMemo(
    () =>
      clamp(
        collectorCurrent / Math.max(collectorVoltage / loadResistance, 0.00001),
        0,
        1,
      ),
    [collectorCurrent, collectorVoltage, loadResistance],
  );

  return {
    transistorType,
    setTransistorType,
    active,
    setActive,
    dopingLevel,
    setDopingLevel,
    collectorVoltage,
    setCollectorVoltage,
    baseVoltage,
    setBaseVoltage,
    baseResistance,
    setBaseResistance,
    loadResistance,
    setLoadResistance,
    showPhysics,
    setShowPhysics,
    showCurrent,
    setShowCurrent,
    showElectronFlow,
    setShowElectronFlow,
    transistorGain,
    baseCurrent,
    isBiased,
    collectorCurrent,
    lampGlow,
    carrierState: active && isBiased ? "ON" : active ? "LOW" : "OFF",
    collectorCurrentLabel: `${formatNumber(collectorCurrent * 1000, 1)}mA`,
    gainLabel: `Beta ${formatNumber(transistorGain, 0)}`,
  };
}
