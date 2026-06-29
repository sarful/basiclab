type AppliedVoltageSliderProps = {
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
  voltageRating: number;
};

export function AppliedVoltageSlider({
  appliedVoltage,
  setAppliedVoltage,
  voltageRating,
}: AppliedVoltageSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Applied Voltage: {appliedVoltage}V
      </label>
      <input
        type="range"
        min="1"
        max="70"
        step="1"
        value={appliedVoltage}
        onChange={(event) => setAppliedVoltage(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
      <p className={`mt-1 text-xs ${appliedVoltage > voltageRating ? "text-red-600 font-bold" : "text-slate-500"}`}>
        Applied voltage must stay below the rated voltage.
      </p>
    </div>
  );
}
