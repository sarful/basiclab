"use client";

import { useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { VisualPanelSection } from "./VisualPanelSection";
import {
  digitColors,
  findDigit,
  findMultiplier,
  findTempCoeff,
  findTolerance,
  formatResistance,
  multiplierColors,
  multiplierText,
  presets,
  tempCoeffs,
  toleranceColors,
} from "./logic";
import type { Preset, ResistorLessonTwoProps } from "./types";

export default function WhatIsResistorInteractiveSimulation({
  panelOnly = false,
  visualOnly = false,
}: ResistorLessonTwoProps) {
  const [mode, setMode] = useState<4 | 5 | 6>(4);
  const [voltage, setVoltage] = useState(5);
  const [b1, setB1] = useState(digitColors[1]);
  const [b2, setB2] = useState(digitColors[0]);
  const [b3, setB3] = useState(digitColors[0]);
  const [mult, setMult] = useState(multiplierColors[1]);
  const [tol, setTol] = useState(toleranceColors[5]);
  const [tc, setTc] = useState(tempCoeffs[0]);

  const significant = mode === 4 ? b1.value * 10 + b2.value : b1.value * 100 + b2.value * 10 + b3.value;
  const resistance = significant * mult.multiplier;
  const current = voltage / resistance;
  const currentDisplay = current >= 1 ? `${current.toFixed(2)} A` : `${(current * 1000).toFixed(2)} mA`;
  const currentFormula = `I = V / R = ${voltage} / ${resistance} = ${currentDisplay}`;
  const inlineExplanation = `${b1.name} (${b1.value}) | ${b2.name} (${b2.value})${mode > 4 ? ` | ${b3.name} (${b3.value})` : ""} | ${mult.name} (${multiplierText(mult.multiplier)}) = ${formatResistance(resistance)}`;
  const selectedRows = [
    { band: "Band 1", role: "1st Digit", color: b1.name, value: b1.value, hex: b1.hex },
    { band: "Band 2", role: "2nd Digit", color: b2.name, value: b2.value, hex: b2.hex },
    ...(mode > 4 ? [{ band: "Band 3", role: "3rd Digit", color: b3.name, value: b3.value, hex: b3.hex }] : []),
    { band: mode === 4 ? "Band 3" : "Band 4", role: "Multiplier", color: mult.name, value: multiplierText(mult.multiplier), hex: mult.hex },
    { band: mode === 4 ? "Band 4" : "Band 5", role: "Tolerance", color: tol.name, value: tol.tolerance, hex: tol.hex },
    ...(mode === 6 ? [{ band: "Band 6", role: "Temp. Coefficient", color: tc.name, value: tc.ppm, hex: tc.hex }] : []),
  ];

  function applyPreset(preset: Preset) {
    setMode(preset.mode);
    setB1(findDigit(preset.b1));
    setB2(findDigit(preset.b2));
    setB3(findDigit(preset.b3 || "Black"));
    setMult(findMultiplier(preset.mult));
    setTol(findTolerance(preset.tol));
    setTc(findTempCoeff(preset.tc || "Brown"));
  }

  const controlPanel = (
    <ControlPanelSection
      mode={mode}
      voltage={voltage}
      presets={presets}
      digitColors={digitColors}
      multiplierColors={multiplierColors}
      toleranceColors={toleranceColors}
      tempCoeffs={tempCoeffs}
      b1={b1}
      b2={b2}
      b3={b3}
      mult={mult}
      tol={tol}
      tc={tc}
      onModeChange={setMode}
      onVoltageChange={setVoltage}
      onPresetApply={applyPreset}
      onB1Change={(value) => setB1(findDigit(value))}
      onB2Change={(value) => setB2(findDigit(value))}
      onB3Change={(value) => setB3(findDigit(value))}
      onMultiplierChange={(value) => setMult(findMultiplier(value))}
      onToleranceChange={(value) => setTol(findTolerance(value))}
      onTempCoeffChange={(value) => setTc(findTempCoeff(value))}
    />
  );

  const visualPanel = (
    <VisualPanelSection
      mode={mode}
      b1={b1}
      b2={b2}
      b3={b3}
      mult={mult}
      tol={tol}
      tc={tc}
      resistance={resistance}
      currentDisplay={currentDisplay}
      currentFormula={currentFormula}
      inlineExplanation={inlineExplanation}
      selectedRows={selectedRows}
      current={current}
      voltage={voltage}
    />
  );

  if (panelOnly) return controlPanel;
  if (visualOnly) return visualPanel;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div>{controlPanel}</div>
      <div>{visualPanel}</div>
    </div>
  );
}
