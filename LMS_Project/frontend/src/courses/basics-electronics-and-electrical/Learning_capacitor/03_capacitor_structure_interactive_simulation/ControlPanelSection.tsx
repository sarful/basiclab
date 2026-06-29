import { DielectricSelector } from "./DielectricSelector";
import { FieldToggleButton } from "./FieldToggleButton";
import { PlateAreaSlider } from "./PlateAreaSlider";
import { PlateDistanceSlider } from "./PlateDistanceSlider";
import { StructureFormulaCard } from "./StructureFormulaCard";

type ControlPanelSectionProps = {
  plateArea: number;
  setPlateArea: (value: number) => void;
  plateDistance: number;
  setPlateDistance: (value: number) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  showField: boolean;
  setShowField: (value: boolean) => void;
  capacitance: number;
  resetStructure: () => void;
};

export function ControlPanelSection({
  plateArea,
  setPlateArea,
  plateDistance,
  setPlateDistance,
  dielectricIndex,
  setDielectricIndex,
  showField,
  setShowField,
  capacitance,
  resetStructure,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetStructure}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <PlateAreaSlider plateArea={plateArea} setPlateArea={setPlateArea} />

      <PlateDistanceSlider
        plateDistance={plateDistance}
        setPlateDistance={setPlateDistance}
      />

      <DielectricSelector
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
      />

      <FieldToggleButton showField={showField} setShowField={setShowField} />

      <StructureFormulaCard capacitance={capacitance} />
    </div>
  );
}
