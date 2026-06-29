import { ControlPanelSection } from "./ControlPanelSection";
import { VariableCapacitorVisual } from "./VariableCapacitorVisual";

type VariableCapacitorVisualSectionProps = {
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

export function VariableCapacitorVisualSection({
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
}: VariableCapacitorVisualSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        rotation={rotation}
        setRotation={setRotation}
        minCapacitance={minCapacitance}
        setMinCapacitance={setMinCapacitance}
        maxCapacitance={maxCapacitance}
        setMaxCapacitance={setMaxCapacitance}
        inductanceUh={inductanceUh}
        setInductanceUh={setInductanceUh}
        plateCount={plateCount}
        setPlateCount={setPlateCount}
        frequencyLabel={frequencyLabel}
        resetSimulation={resetSimulation}
      />

      <div className="lg:col-span-2">
        <VariableCapacitorVisual
          rotation={rotation}
          minCapacitance={minCapacitance}
          maxCapacitance={maxCapacitance}
          inductanceUh={inductanceUh}
          plateCount={plateCount}
        />
      </div>
    </div>
  );
}
