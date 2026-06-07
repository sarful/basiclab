import { formatNumber } from "./logic";
import type { WorkingMode } from "./types";

type ControlPanelSectionProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: WorkingMode;
  setMode: (value: WorkingMode) => void;
  timeConstant: number;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  supplyVoltage,
  setSupplyVoltage,
  resistance,
  setResistance,
  capacitance,
  setCapacitance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  timeConstant,
  resetSimulation,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
        <button
          onClick={() => setMode("charging")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "charging" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700"
          }`}
        >
          Charging
        </button>

        <button
          onClick={() => setMode("discharging")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "discharging"
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white text-slate-700"
          }`}
        >
          Discharging
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

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Resistance: {resistance} Ohm
        </label>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={resistance}
          onChange={(event) => setResistance(Number(event.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Capacitance: {capacitance} uF
        </label>
        <input
          type="range"
          min="10"
          max="2200"
          step="10"
          value={capacitance}
          onChange={(event) => setCapacitance(Number(event.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

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

      <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Working Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">Vc = Vs x (1 - e^(-t/RC))</p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          tau = {formatNumber(timeConstant, 3)} s
        </p>
      </div>
    </div>
  );
}
