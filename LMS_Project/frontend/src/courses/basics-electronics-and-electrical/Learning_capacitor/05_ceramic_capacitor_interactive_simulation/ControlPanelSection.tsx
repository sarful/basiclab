import { AppliedVoltageSlider } from "./AppliedVoltageSlider";
import { CodeSelector } from "./CodeSelector";
import { DielectricSelector } from "./DielectricSelector";
import { FrequencySlider } from "./FrequencySlider";
import { ReactanceFormulaCard } from "./ReactanceFormulaCard";
import { VoltageRatingSlider } from "./VoltageRatingSlider";

type ControlPanelSectionProps = {
  code: string;
  setCode: (value: string) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
  voltageRating: number;
  setVoltageRating: (value: number) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  reactanceOhm: number;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  code,
  setCode,
  dielectricIndex,
  setDielectricIndex,
  appliedVoltage,
  setAppliedVoltage,
  voltageRating,
  setVoltageRating,
  frequency,
  setFrequency,
  reactanceOhm,
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

      <CodeSelector code={code} setCode={setCode} />
      <DielectricSelector
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
      />
      <AppliedVoltageSlider
        appliedVoltage={appliedVoltage}
        setAppliedVoltage={setAppliedVoltage}
      />
      <VoltageRatingSlider
        voltageRating={voltageRating}
        setVoltageRating={setVoltageRating}
      />
      <FrequencySlider frequency={frequency} setFrequency={setFrequency} />
      <ReactanceFormulaCard reactanceOhm={reactanceOhm} />
    </div>
  );
}
