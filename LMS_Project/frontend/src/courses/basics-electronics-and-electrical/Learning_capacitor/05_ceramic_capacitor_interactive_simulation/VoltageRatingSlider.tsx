type VoltageRatingSliderProps = {
  voltageRating: number;
  setVoltageRating: (value: number) => void;
};

export function VoltageRatingSlider({
  voltageRating,
  setVoltageRating,
}: VoltageRatingSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Voltage Rating: {voltageRating}V
      </label>
      <input
        type="range"
        min="6"
        max="100"
        step="1"
        value={voltageRating}
        onChange={(event) => setVoltageRating(Number(event.target.value))}
        className="w-full accent-green-500"
      />
    </div>
  );
}
