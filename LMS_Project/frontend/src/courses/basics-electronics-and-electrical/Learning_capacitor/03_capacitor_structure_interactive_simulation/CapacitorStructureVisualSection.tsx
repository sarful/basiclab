import { CapacitorStructureVisual } from "./CapacitorStructureVisual";
import { ControlPanelSection } from "./ControlPanelSection";

type CapacitorStructureVisualSectionProps = {
  plateArea: number;
  setPlateArea: (value: number) => void;
  plateDistance: number;
  setPlateDistance: (value: number) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  showField: boolean;
  setShowField: (value: boolean) => void;
  capacitance: number;
  resetSimulation: () => void;
};

export function CapacitorStructureVisualSection({
  plateArea,
  setPlateArea,
  plateDistance,
  setPlateDistance,
  dielectricIndex,
  setDielectricIndex,
  showField,
  setShowField,
  capacitance,
  resetSimulation,
}: CapacitorStructureVisualSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        plateArea={plateArea}
        setPlateArea={setPlateArea}
        plateDistance={plateDistance}
        setPlateDistance={setPlateDistance}
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
        showField={showField}
        setShowField={setShowField}
        capacitance={capacitance}
        resetStructure={resetSimulation}
      />

      <div className="lg:col-span-2">
        <CapacitorStructureVisual
          plateArea={plateArea}
          plateDistance={plateDistance}
          dielectricIndex={dielectricIndex}
          showField={showField}
        />
      </div>
    </div>
  );
}
