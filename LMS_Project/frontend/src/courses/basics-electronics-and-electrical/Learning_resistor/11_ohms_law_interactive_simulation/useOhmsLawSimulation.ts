"use client";

import { useMemo, useState } from "react";

import {
  clamp,
  getSafeLedStatus,
  ledOptions,
  nearestStandardResistor,
} from "./logic";
import type { LedOption, SolveMode } from "./types";

export function useOhmsLawSimulation() {
  const [mode, setMode] = useState<SolveMode>("current");
  const [voltage, setVoltage] = useState(12);
  const [currentInput, setCurrentInput] = useState(0.12);
  const [resistance, setResistance] = useState(100);
  const [selectedLed, setSelectedLed] = useState<LedOption>(ledOptions[0]);

  const solved = useMemo(() => {
    if (mode === "current") {
      const current = voltage / resistance;
      return {
        voltage,
        current,
        resistance,
        formula: `I = V / R = ${voltage} / ${resistance}`,
      };
    }

    if (mode === "voltage") {
      const calculatedVoltage = currentInput * resistance;
      return {
        voltage: calculatedVoltage,
        current: currentInput,
        resistance,
        formula: `V = I x R = ${currentInput} x ${resistance}`,
      };
    }

    const calculatedResistance = voltage / currentInput;
    return {
      voltage,
      current: currentInput,
      resistance: calculatedResistance,
      formula: `R = V / I = ${voltage} / ${currentInput}`,
    };
  }, [mode, voltage, currentInput, resistance]);

  const ledBrightness = clamp(solved.current / (selectedLed.safeCurrentMa / 1000), 0, 1);
  const power = solved.current * solved.current * solved.resistance;
  const ledStatus = getSafeLedStatus(solved.current, selectedLed.safeCurrentMa);
  const ledSupplyVoltage = solved.voltage;
  const requiredLedResistor = Math.max(
    0,
    (ledSupplyVoltage - selectedLed.ledDrop) / (selectedLed.safeCurrentMa / 1000),
  );
  const roundedLedResistor = nearestStandardResistor(requiredLedResistor);

  function resetSimulation() {
    setMode("current");
    setVoltage(12);
    setCurrentInput(0.12);
    setResistance(100);
    setSelectedLed(ledOptions[0]);
  }

  return {
    mode,
    voltage,
    currentInput,
    resistance,
    selectedLed,
    solved,
    ledBrightness,
    power,
    ledStatus,
    ledSupplyVoltage,
    requiredLedResistor,
    roundedLedResistor,
    setMode,
    setVoltage,
    setCurrentInput,
    setResistance,
    setSelectedLed,
    resetSimulation,
  };
}
