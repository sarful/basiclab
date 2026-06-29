type PlateCountSelectorProps = {
  plateCount: number;
  setPlateCount: (value: number) => void;
};

export function PlateCountSelector({
  plateCount,
  setPlateCount,
}: PlateCountSelectorProps) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Plate Count: {plateCount}
      </label>
      <select
        value={plateCount}
        onChange={(event) => setPlateCount(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {[3, 5, 7, 9, 11].map((value) => (
          <option key={value} value={value}>
            {value} plates
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-500">
        More plates usually allow a higher maximum capacitance.
      </p>
    </div>
  );
}
