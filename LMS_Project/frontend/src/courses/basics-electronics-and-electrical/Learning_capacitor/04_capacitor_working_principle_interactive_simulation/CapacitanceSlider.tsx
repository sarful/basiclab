type CapacitanceSliderProps = {
  capacitance: number;
  setCapacitance: (value: number) => void;
};

export function CapacitanceSlider({
  capacitance,
  setCapacitance,
}: CapacitanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Capacitance: {capacitance} uF
      </label>
      <input
        type="range"
        min="10"
        max="2200"
        step="10"
        value={capacitance}
        onChange={(event) => setCapacitance(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
