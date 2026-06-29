type InductanceSliderProps = {
  inductanceUh: number;
  setInductanceUh: (value: number) => void;
};

export function InductanceSlider({
  inductanceUh,
  setInductanceUh,
}: InductanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Inductance: {inductanceUh} uH
      </label>
      <input
        type="range"
        min="50"
        max="1000"
        step="10"
        value={inductanceUh}
        onChange={(event) => setInductanceUh(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
      <p className="mt-1 text-xs text-slate-500">LC tuning follows f = 1 / 2pi sqrt(LC).</p>
    </div>
  );
}
