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
        AC Frequency: {frequency} Hz
      </label>
      <input
        type="range"
        min="50"
        max="100000"
        step="50"
        value={frequency}
        onChange={(e) => setFrequency(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Shows how a non-polarized capacitor behaves with AC signals.
      </p>
    </div>
  );
}
