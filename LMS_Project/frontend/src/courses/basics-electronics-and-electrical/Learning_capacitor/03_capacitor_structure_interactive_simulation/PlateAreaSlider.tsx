type PlateAreaSliderProps = {
  plateArea: number;
  setPlateArea: (value: number) => void;
};

export function PlateAreaSlider({
  plateArea,
  setPlateArea,
}: PlateAreaSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Plate Area: {plateArea} cm2
      </label>
      <input
        type="range"
        min="10"
        max="90"
        step="5"
        value={plateArea}
        onChange={(event) => setPlateArea(Number(event.target.value))}
        className="w-full accent-purple-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Larger plate area allows more stored charge.
      </p>
    </div>
  );
}
