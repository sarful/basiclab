"use client";

export function ToleranceSelector({
  tolerance,
  toleranceOptions,
  onToleranceChange,
}: {
  tolerance: number;
  toleranceOptions: number[];
  onToleranceChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Tolerance: +/-{tolerance}%</label>
      <select
        value={tolerance}
        onChange={(event) => onToleranceChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {toleranceOptions.map((value) => (
          <option key={value} value={value}>
            +/-{value}%
          </option>
        ))}
      </select>
    </div>
  );
}
