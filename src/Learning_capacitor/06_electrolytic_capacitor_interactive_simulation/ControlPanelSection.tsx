import { capacitanceOptions, esrOptions, formatCapacitance, formatCurrent, formatEnergy, ratingOptions } from "./logic";
import type { PolarityMode } from "./types";

type ControlPanelSectionProps = {
  capacitance: number;
  setCapacitance: (value: number) => void;
  voltageRating: number;
  setVoltageRating: (value: number) => void;
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
  esr: number;
  setEsr: (value: number) => void;
  rippleCurrent: number;
  setRippleCurrent: (value: number) => void;
  polarity: PolarityMode;
  setPolarity: (value: PolarityMode) => void;
  storedEnergy: number;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  capacitance,
  setCapacitance,
  voltageRating,
  setVoltageRating,
  appliedVoltage,
  setAppliedVoltage,
  esr,
  setEsr,
  rippleCurrent,
  setRippleCurrent,
  polarity,
  setPolarity,
  storedEnergy,
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
          onClick={() => setPolarity("correct")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            polarity === "correct" ? "bg-green-600 text-white shadow-sm" : "bg-white text-slate-700"
          }`}
        >
          Correct Polarity
        </button>
        <button
          onClick={() => setPolarity("reverse")}
          className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
            polarity === "reverse" ? "bg-red-600 text-white shadow-sm" : "bg-white text-slate-700"
          }`}
        >
          Reverse Polarity
        </button>
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

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Applied Voltage: {appliedVoltage}V
        </label>
        <input
          type="range"
          min="1"
          max="70"
          step="1"
          value={appliedVoltage}
          onChange={(event) => setAppliedVoltage(Number(event.target.value))}
          className="w-full accent-orange-500"
        />
        <p className={`mt-1 text-xs ${appliedVoltage > voltageRating ? "text-red-600 font-bold" : "text-slate-500"}`}>
          Applied voltage must stay below the rated voltage.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          ESR: {esr} Ohm
        </label>
        <select
          value={esr}
          onChange={(event) => setEsr(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {esrOptions.map((value) => (
            <option key={value} value={value}>
              {value} Ohm
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">
          Lower ESR reduces heating and improves ripple smoothing.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Ripple Current: {formatCurrent(rippleCurrent)}
        </label>
        <input
          type="range"
          min="0.05"
          max="2"
          step="0.05"
          value={rippleCurrent}
          onChange={(event) => setRippleCurrent(Number(event.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          Energy Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">E = 1/2 C V^2</p>
        <p className="mt-1 text-lg font-bold text-slate-900">E = {formatEnergy(storedEnergy)}</p>
      </div>
    </div>
  );
}
