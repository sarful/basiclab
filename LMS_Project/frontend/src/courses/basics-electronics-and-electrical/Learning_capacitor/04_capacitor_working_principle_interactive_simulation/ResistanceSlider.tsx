type ResistanceSliderProps = {
  resistance: number;
  setResistance: (value: number) => void;
};

export function ResistanceSlider({
  resistance,
  setResistance,
}: ResistanceSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Resistance: {resistance} Ohm
      </label>
      <input
        type="range"
        min="100"
        max="10000"
        step="100"
        value={resistance}
        onChange={(event) => setResistance(Number(event.target.value))}
        className="w-full accent-green-500"
      />
    </div>
  );
}
