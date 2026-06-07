import { capacitanceOptions, formatCapacitance, formatCharge, formatNumber, formatResistance, resistanceOptions } from "./logic";
import type { CircuitMode } from "./types";

type ControlPanelSectionProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: CircuitMode;
  setMode: (value: CircuitMode) => void;
  storedCharge: number;
  resetCircuit: () => void;
};

export function ControlPanelSection({
  supplyVoltage,
  setSupplyVoltage,
  capacitance,
  setCapacitance,
  resistance,
  setResistance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  storedCharge,
  resetCircuit,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetCircuit}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
        <button
          onClick={() => setMode("charge")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "charge" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700"
          }`}
        >
          Charge
        </button>
        <button
          onClick={() => setMode("discharge")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "discharge"
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white text-slate-700"
          }`}
        >
          Discharge
        </button>
      </div>

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
          onChange={(event) => setSupplyVoltage(Number(event.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Capacitance: {formatCapacitance(capacitance)}
        </label>
        <select
          value={capacitance}
          onChange={(event) => setCapacitance(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {capacitanceOptions.map((value) => (
            <option key={value} value={value}>
              {formatCapacitance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Resistance: {formatResistance(resistance)}
        </label>
        <select
          value={resistance}
          onChange={(event) => setResistance(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {resistanceOptions.map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

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

      <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Main Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">Q = C x V</p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          Q = {formatCharge(storedCharge)}
        </p>
      </div>
    </div>
  );
}
