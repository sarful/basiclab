"use client";

import { CircuitDiagram } from "./CircuitDiagram";
import { ControlPanelSection } from "./ControlPanelSection";
import { OhmsGraph } from "./OhmsGraph";
import { OhmsLawInsights } from "./OhmsLawInsights";
import type { LedOption, SolveMode } from "./types";

export function OhmsLawVisualSection({
  mode,
  voltage,
  currentInput,
  resistance,
  formula,
  ledBrightness,
  solvedVoltage,
  solvedResistance,
  solvedCurrent,
  selectedLed,
  onVoltageChange,
  onCurrentInputChange,
  onResistanceChange,
}: {
  mode: SolveMode;
  voltage: number;
  currentInput: number;
  resistance: number;
  formula: string;
  ledBrightness: number;
  solvedVoltage: number;
  solvedResistance: number;
  solvedCurrent: number;
  selectedLed: LedOption;
  onVoltageChange: (value: number) => void;
  onCurrentInputChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <ControlPanelSection
          mode={mode}
          voltage={voltage}
          currentInput={currentInput}
          resistance={resistance}
          formula={formula}
          ledBrightness={ledBrightness}
          onVoltageChange={onVoltageChange}
          onCurrentInputChange={onCurrentInputChange}
          onResistanceChange={onResistanceChange}
        />

        <div className="lg:col-span-2">
          <CircuitDiagram
            voltage={solvedVoltage}
            resistance={solvedResistance}
            current={solvedCurrent}
            ledBrightness={ledBrightness}
            led={selectedLed}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OhmsGraph resistance={solvedResistance} voltage={solvedVoltage} />
        <OhmsLawInsights />
      </div>
    </>
  );
}
