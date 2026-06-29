type PlateDistanceSliderProps = {
  plateDistance: number;
  setPlateDistance: (value: number) => void;
};

export function PlateDistanceSlider({
  plateDistance,
  setPlateDistance,
}: PlateDistanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Plate Distance: {plateDistance} mm
      </label>
      <input
        type="range"
        min="2"
        max="20"
        step="1"
        value={plateDistance}
        onChange={(event) => setPlateDistance(Number(event.target.value))}
        className="w-full accent-green-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        More spacing reduces capacitance.
      </p>
    </div>
  );
}
