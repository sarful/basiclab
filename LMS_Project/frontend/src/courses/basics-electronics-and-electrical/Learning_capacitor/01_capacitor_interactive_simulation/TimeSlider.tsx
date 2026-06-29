"use client";

import { formatNumber } from "./logic";

export function TimeSlider({
  time,
  setTime,
  maxTime,
}: {
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Time: {formatNumber(time, 2)}s
      </label>
      <input
        type="range"
        min="0"
        max={maxTime}
        step="0.05"
        value={time}
        onChange={(event) => setTime(Number(event.target.value))}
        className="w-full accent-green-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Higher resistance or capacitance makes charging and discharging slower.
      </p>
    </div>
  );
}
