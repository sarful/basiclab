"use client";

import { ledOptions } from "./logic";

export function LedSelector({
  ledId,
  onLedChange,
}: {
  ledId: string;
  onLedChange: (value: string) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Series LED Type</label>
      <select
        value={ledId}
        onChange={(event) => onLedChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {ledOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label} ({item.forwardVoltage}V drop)
          </option>
        ))}
      </select>
    </div>
  );
}
