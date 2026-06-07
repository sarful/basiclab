"use client";

import { formatResistance, resistorOptions } from "./logic";

export function ControlPanelSection({
  supplyVoltage,
  r1,
  r2,
  r3,
  showR3,
  onSetSupplyVoltage,
  onSetR1,
  onSetR2,
  onSetR3,
  onToggleR3,
}: {
  supplyVoltage: number;
  r1: number;
  r2: number;
  r3: number;
  showR3: boolean;
  onSetSupplyVoltage: (value: number) => void;
  onSetR1: (value: number) => void;
  onSetR2: (value: number) => void;
  onSetR3: (value: number) => void;
  onToggleR3: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Supply Voltage: {supplyVoltage}V
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={supplyVoltage}
          onChange={(event) => onSetSupplyVoltage(Number(event.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">R1: {formatResistance(r1)}</label>
        <select
          value={r1}
          onChange={(event) => onSetR1(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {resistorOptions.map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">R2: {formatResistance(r2)}</label>
        <select
          value={r2}
          onChange={(event) => onSetR2(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {resistorOptions.map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <div>
          <p className="font-semibold text-slate-900">Add R3</p>
          <p className="text-xs text-slate-500">See voltage sharing with 3 resistors</p>
        </div>
        <button
          onClick={onToggleR3}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${showR3 ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
        >
          {showR3 ? "ON" : "OFF"}
        </button>
      </div>

      {showR3 && (
        <div>
          <label className="mb-2 block text-sm text-slate-700">R3: {formatResistance(r3)}</label>
          <select
            value={r3}
            onChange={(event) => onSetR3(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white p-3"
          >
            {resistorOptions.map((value) => (
              <option key={value} value={value}>
                {formatResistance(value)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
