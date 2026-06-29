import { AppliedVoltageSlider } from "./AppliedVoltageSlider";
import { CapacitanceSelector } from "./CapacitanceSelector";
import { EnergyFormulaCard } from "./EnergyFormulaCard";
import { EsrSelector } from "./EsrSelector";
import { PolaritySelector } from "./PolaritySelector";
import { RippleCurrentSlider } from "./RippleCurrentSlider";
import { VoltageRatingSelector } from "./VoltageRatingSelector";
import type { PolarityMode } from "./types";

type ControlPanelSectionProps = {
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

export function ControlPanelSection({
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
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <PolaritySelector polarity={polarity} setPolarity={setPolarity} />
      <CapacitanceSelector capacitance={capacitance} setCapacitance={setCapacitance} />
      <VoltageRatingSelector
        voltageRating={voltageRating}
        setVoltageRating={setVoltageRating}
      />
      <AppliedVoltageSlider
        appliedVoltage={appliedVoltage}
        setAppliedVoltage={setAppliedVoltage}
        voltageRating={voltageRating}
      />
      <EsrSelector esr={esr} setEsr={setEsr} />
      <RippleCurrentSlider
        rippleCurrent={rippleCurrent}
        setRippleCurrent={setRippleCurrent}
      />
      <EnergyFormulaCard storedEnergy={storedEnergy} />
    </div>
  );
}
