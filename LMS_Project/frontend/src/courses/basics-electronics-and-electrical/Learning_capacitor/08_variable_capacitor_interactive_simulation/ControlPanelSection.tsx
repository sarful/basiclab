import { InductanceSlider } from "./InductanceSlider";
import { MaxCapacitanceSlider } from "./MaxCapacitanceSlider";
import { MinCapacitanceSlider } from "./MinCapacitanceSlider";
import { PlateCountSelector } from "./PlateCountSelector";
import { RotationSlider } from "./RotationSlider";
import { TuningFormulaCard } from "./TuningFormulaCard";

type ControlPanelSectionProps = {
  rotation: number;
  setRotation: (value: number) => void;
  minCapacitance: number;
  setMinCapacitance: (value: number) => void;
  maxCapacitance: number;
  setMaxCapacitance: (value: number) => void;
  inductanceUh: number;
  setInductanceUh: (value: number) => void;
  plateCount: number;
  setPlateCount: (value: number) => void;
  frequencyLabel: string;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  rotation,
  setRotation,
  minCapacitance,
  setMinCapacitance,
  maxCapacitance,
  setMaxCapacitance,
  inductanceUh,
  setInductanceUh,
  plateCount,
  setPlateCount,
  frequencyLabel,
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

      <RotationSlider rotation={rotation} setRotation={setRotation} />
      <MinCapacitanceSlider
        minCapacitance={minCapacitance}
        setMinCapacitance={setMinCapacitance}
      />
      <MaxCapacitanceSlider
        maxCapacitance={maxCapacitance}
        setMaxCapacitance={setMaxCapacitance}
      />
      <InductanceSlider inductanceUh={inductanceUh} setInductanceUh={setInductanceUh} />
      <PlateCountSelector plateCount={plateCount} setPlateCount={setPlateCount} />
      <TuningFormulaCard frequencyLabel={frequencyLabel} />
    </div>
  );
}
