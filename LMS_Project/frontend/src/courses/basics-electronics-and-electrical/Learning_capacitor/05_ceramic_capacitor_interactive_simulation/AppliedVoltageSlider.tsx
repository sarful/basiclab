type AppliedVoltageSliderProps = {
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
};

export function AppliedVoltageSlider({
  appliedVoltage,
  setAppliedVoltage,
}: AppliedVoltageSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Applied Voltage: {appliedVoltage}V
      </label>
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        value={appliedVoltage}
        onChange={(event) => setAppliedVoltage(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Exceeding the rated voltage can damage the capacitor.
      </p>
    </div>
  );
}
