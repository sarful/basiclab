import { ControlPanelSection } from "./ControlPanelSection";
import { ElectrolyticVisual } from "./ElectrolyticVisual";
import type { PolarityMode } from "./types";

type ElectrolyticVisualSectionProps = {
  capacitance: number;
  setCapacitance: (value: number) => void;
  voltageRating: number;
  setVoltageRating: (value: number) => void;
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
  esr: number;
  setEsr: (value: number) => void;
  rippleCurrent: number;
  setRippleCurrent: (value: number) => void;
  polarity: PolarityMode;
  setPolarity: (value: PolarityMode) => void;
  storedEnergy: number;
  resetSimulation: () => void;
};

export function ElectrolyticVisualSection({
  capacitance,
  setCapacitance,
  voltageRating,
  setVoltageRating,
  appliedVoltage,
  setAppliedVoltage,
  esr,
  setEsr,
  rippleCurrent,
  setRippleCurrent,
  polarity,
  setPolarity,
  storedEnergy,
  resetSimulation,
}: ElectrolyticVisualSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        capacitance={capacitance}
        setCapacitance={setCapacitance}
        voltageRating={voltageRating}
        setVoltageRating={setVoltageRating}
        appliedVoltage={appliedVoltage}
        setAppliedVoltage={setAppliedVoltage}
        esr={esr}
        setEsr={setEsr}
        rippleCurrent={rippleCurrent}
        setRippleCurrent={setRippleCurrent}
        polarity={polarity}
        setPolarity={setPolarity}
        storedEnergy={storedEnergy}
        resetSimulation={resetSimulation}
      />

      <div className="lg:col-span-2">
        <ElectrolyticVisual
          capacitance={capacitance}
          voltageRating={voltageRating}
          appliedVoltage={appliedVoltage}
          esr={esr}
          rippleCurrent={rippleCurrent}
          polarity={polarity}
        />
      </div>
    </div>
  );
}
