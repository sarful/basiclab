type FrequencySliderProps = {
  frequency: number;
  setFrequency: (value: number) => void;
};

export function FrequencySlider({
  frequency,
  setFrequency,
}: FrequencySliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Signal Frequency: {frequency} Hz
      </label>
      <input
        type="range"
        min="10"
        max="100000"
        step="10"
        value={frequency}
        onChange={(event) => setFrequency(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Higher frequency reduces capacitive reactance.
      </p>
    </div>
  );
}
