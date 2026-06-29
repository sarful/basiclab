import { ratingOptions } from "./logic";

type VoltageRatingSelectorProps = {
  voltageRating: number;
  setVoltageRating: (value: number) => void;
};

export function VoltageRatingSelector({
  voltageRating,
  setVoltageRating,
}: VoltageRatingSelectorProps) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Voltage Rating: {voltageRating}V
      </label>
      <select
        value={voltageRating}
        onChange={(event) => setVoltageRating(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {ratingOptions.map((value) => (
          <option key={value} value={value}>
            {value}V
          </option>
        ))}
      </select>
    </div>
  );
}
