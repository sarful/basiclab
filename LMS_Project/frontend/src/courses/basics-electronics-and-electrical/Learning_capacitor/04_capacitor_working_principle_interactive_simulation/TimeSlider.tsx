import { formatNumber } from "./logic";

type TimeSliderProps = {
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
};

export function TimeSlider({
  time,
  setTime,
  maxTime,
}: TimeSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Time: {formatNumber(time, 2)} s
      </label>
      <input
        type="range"
        min="0"
        max={maxTime}
        step="0.05"
        value={time}
        onChange={(event) => setTime(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Increase time to watch the charging or discharging progress.
      </p>
    </div>
  );
}
