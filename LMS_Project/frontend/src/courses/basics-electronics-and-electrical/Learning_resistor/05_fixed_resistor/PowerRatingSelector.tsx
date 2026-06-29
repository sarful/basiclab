"use client";

export function PowerRatingSelector({
  powerRating,
  powerOptions,
  onPowerRatingChange,
}: {
  powerRating: number;
  powerOptions: number[];
  onPowerRatingChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-700">
        Power Rating: {powerRating}W
      </label>
      <select
        value={powerRating}
        onChange={(event) => onPowerRatingChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {powerOptions.map((value) => (
          <option key={value} value={value}>
            {value}W
          </option>
        ))}
      </select>
    </div>
  );
}
