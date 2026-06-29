"use client";

import { ControlButton } from "./ControlButton";
import type { LedState } from "./types";

export function ControlPanelSection({
  isPlaying,
  setIsPlaying,
  resetKey,
  setResetKey,
  voltage,
  setVoltage,
  forwardVoltage,
  setForwardVoltage,
  hasResistor,
  setHasResistor,
  state,
}: {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  resetKey: number;
  setResetKey: (value: number) => void;
  voltage: number;
  setVoltage: (value: number) => void;
  forwardVoltage: number;
  setForwardVoltage: (value: number) => void;
  hasResistor: boolean;
  setHasResistor: (value: boolean) => void;
  state: LedState;
}) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Control Panel</h2>
          <p className="text-sm font-semibold text-slate-500">
            Voltage, forward voltage, resistor, and overvoltage logic
          </p>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            state.isDamaged
              ? "bg-red-100 text-red-800"
              : state.isOverVoltage
                ? "bg-orange-100 text-orange-800"
                : state.isOn
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-slate-100 text-slate-600"
          }`}
        >
          Status: {state.status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        <ControlButton active={isPlaying} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </ControlButton>
        <ControlButton onClick={() => setResetKey(resetKey + 1)}>Restart</ControlButton>
        <ControlButton
          active={state.isOn && !state.isOverVoltage}
          onClick={() => setVoltage(forwardVoltage + 1.2)}
        >
          Turn ON
        </ControlButton>
        <ControlButton
          active={state.isOverVoltage && !state.isDamaged}
          onClick={() => setVoltage(forwardVoltage + 3.2)}
        >
          Overvoltage
        </ControlButton>
        <ControlButton active={state.isDamaged} onClick={() => setVoltage(forwardVoltage + 5.8)}>
          Danger
        </ControlButton>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="voltage" className="font-black">Applied Voltage</label>
            <span className="rounded-xl bg-white px-3 py-1 font-mono font-black shadow-sm">
              {voltage.toFixed(1)}V
            </span>
          </div>
          <input
            id="voltage"
            type="range"
            min="0"
            max="12"
            step="0.1"
            value={voltage}
            onChange={(event) => setVoltage(Number(event.target.value))}
            className="w-full accent-yellow-500"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>0V</span>
            <span>Safe {state.safeVoltageLimit.toFixed(1)}V</span>
            <span>12V</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="forwardVoltage" className="font-black">Forward Voltage (Vf)</label>
            <span className="rounded-xl bg-white px-3 py-1 font-mono font-black shadow-sm">
              {forwardVoltage.toFixed(1)}V
            </span>
          </div>
          <input
            id="forwardVoltage"
            type="range"
            min="1.6"
            max="3.3"
            step="0.1"
            value={forwardVoltage}
            onChange={(event) => setForwardVoltage(Number(event.target.value))}
            className="w-full accent-yellow-500"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>Red LED</span>
            <span>Typical Vf</span>
            <span>Blue/White LED</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black">Current Limiting Resistor</h3>
            <p className="text-sm font-semibold text-slate-500">
              With the resistor ON, overvoltage current is limited. Turn the resistor OFF
              to demonstrate damage risk.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHasResistor(!hasResistor)}
            className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
              hasResistor ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {hasResistor ? "Resistor ON" : "Resistor OFF"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Current</p>
          <p className="mt-1 text-lg font-black">{state.currentMA.toFixed(1)} mA</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Light Level</p>
          <p className="mt-1 text-lg font-black">{state.lightLevel}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Safety</p>
          <p className="mt-1 text-lg font-black">
            {state.isDamaged ? "Damage Risk" : state.isOverVoltage ? "Overvoltage" : "Safe"}
          </p>
        </div>
      </div>
    </section>
  );
}
