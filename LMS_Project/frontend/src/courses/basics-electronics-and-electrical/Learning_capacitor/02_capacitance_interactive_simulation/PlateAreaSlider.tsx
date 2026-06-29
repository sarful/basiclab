"use client";

export function PlateAreaSlider({
  plateArea,
  setPlateArea,
}: {
  plateArea: number;
  setPlateArea: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Plate Area: {plateArea} cm2</label>
      <input
        type="range"
        min="10"
        max="90"
        step="5"
        value={plateArea}
        onChange={(event) => setPlateArea(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
      <p className="mt-1 text-xs text-slate-500">More plate area increases capacitance.</p>
    </div>
  );
}
