type MinCapacitanceSliderProps = {
  minCapacitance: number;
  setMinCapacitance: (value: number) => void;
};

export function MinCapacitanceSlider({
  minCapacitance,
  setMinCapacitance,
}: MinCapacitanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Minimum Capacitance: {minCapacitance} pF
      </label>
      <input
        type="range"
        min="2"
        max="50"
        step="1"
        value={minCapacitance}
        onChange={(event) => setMinCapacitance(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
