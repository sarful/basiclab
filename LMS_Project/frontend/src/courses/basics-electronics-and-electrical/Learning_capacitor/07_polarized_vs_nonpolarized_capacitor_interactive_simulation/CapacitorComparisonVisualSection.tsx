import { ControlPanelSection } from "./ControlPanelSection";
import { NonPolarizedCapacitorCard } from "./NonPolarizedCapacitorCard";
import { PolarizedCapacitorCard } from "./PolarizedCapacitorCard";

type CapacitorComparisonVisualSectionProps = {
  voltage: number;
  setVoltage: (value: number) => void;
  reverse: boolean;
  setReverse: (value: boolean) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  resetSimulation: () => void;
};

export function CapacitorComparisonVisualSection({
  voltage,
  setVoltage,
  reverse,
  setReverse,
  frequency,
  setFrequency,
  resetSimulation,
}: CapacitorComparisonVisualSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        voltage={voltage}
        setVoltage={setVoltage}
        reverse={reverse}
        setReverse={setReverse}
        frequency={frequency}
        setFrequency={setFrequency}
        resetSimulation={resetSimulation}
      />

      <div className="grid gap-6 lg:col-span-2">
        <PolarizedCapacitorCard voltage={voltage} reverse={reverse} />
        <NonPolarizedCapacitorCard frequency={frequency} />
      </div>
    </div>
  );
}
