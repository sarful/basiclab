type MaxCapacitanceSliderProps = {
  maxCapacitance: number;
  setMaxCapacitance: (value: number) => void;
};

export function MaxCapacitanceSlider({
  maxCapacitance,
  setMaxCapacitance,
}: MaxCapacitanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Maximum Capacitance: {maxCapacitance} pF
      </label>
      <input
        type="range"
        min="100"
        max="500"
        step="5"
        value={maxCapacitance}
        onChange={(event) => setMaxCapacitance(Number(event.target.value))}
        className="w-full accent-green-500"
      />
    </div>
  );
}
