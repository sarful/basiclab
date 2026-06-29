import { CeramicCapacitorVisual } from "./CeramicCapacitorVisual";
import { ControlPanelSection } from "./ControlPanelSection";

type CeramicCapacitorVisualSectionProps = {
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

export function CeramicCapacitorVisualSection({
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
}: CeramicCapacitorVisualSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        code={code}
        setCode={setCode}
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
        appliedVoltage={appliedVoltage}
        setAppliedVoltage={setAppliedVoltage}
        voltageRating={voltageRating}
        setVoltageRating={setVoltageRating}
        frequency={frequency}
        setFrequency={setFrequency}
        reactanceOhm={reactanceOhm}
        resetSimulation={resetSimulation}
      />

      <div className="lg:col-span-2">
        <CeramicCapacitorVisual
          code={code}
          dielectricIndex={dielectricIndex}
          appliedVoltage={appliedVoltage}
          voltageRating={voltageRating}
          frequency={frequency}
        />
      </div>
    </div>
  );
}
