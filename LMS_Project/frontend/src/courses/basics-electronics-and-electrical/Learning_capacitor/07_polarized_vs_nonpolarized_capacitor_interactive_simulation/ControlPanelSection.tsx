import { FrequencySlider } from "./FrequencySlider";
import { KeyDifferenceCard } from "./KeyDifferenceCard";
import { PolarityModeSelector } from "./PolarityModeSelector";
import { VoltageSlider } from "./VoltageSlider";

type ControlPanelSectionProps = {
  voltage: number;
  setVoltage: (value: number) => void;
  reverse: boolean;
  setReverse: (value: boolean) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  voltage,
  setVoltage,
  reverse,
  setReverse,
  frequency,
  setFrequency,
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

      <VoltageSlider voltage={voltage} setVoltage={setVoltage} />
      <PolarityModeSelector reverse={reverse} setReverse={setReverse} />
      <FrequencySlider frequency={frequency} setFrequency={setFrequency} />
      <KeyDifferenceCard />
    </div>
  );
}
