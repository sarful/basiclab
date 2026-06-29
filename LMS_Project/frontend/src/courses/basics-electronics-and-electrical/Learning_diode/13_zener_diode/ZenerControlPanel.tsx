"use client";

import { ControlButton } from "./ControlButton";
import { getZenerState } from "./logic";
import type { BiasMode } from "./types";

export function ZenerControlPanel({
  isPlaying,
  setIsPlaying,
  resetKey,
  setResetKey,
  voltage,
  setVoltage,
  zenerVoltage,
  setZenerVoltage,
  biasMode,
  setBiasMode,
  state,
}: {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  resetKey: number;
  setResetKey: (value: number) => void;
  voltage: number;
  setVoltage: (value: number) => void;
  zenerVoltage: number;
  setZenerVoltage: (value: number) => void;
  biasMode: BiasMode;
  setBiasMode: (value: BiasMode) => void;
  state: ReturnType<typeof getZenerState>;
}) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Control Panel</h2>
          <p className="text-sm font-semibold text-slate-500">
            Voltage, bias mode, and animation control
          </p>
        </div>
        <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-black text-purple-800">
          Status: {state.status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ControlButton active={isPlaying} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "â¸ Pause" : "â–¶ Play"}
        </ControlButton>
        <ControlButton onClick={() => setResetKey(resetKey + 1)}>
          ðŸ” Restart
        </ControlButton>
        <ControlButton
          active={state.active}
          onClick={() => setVoltage(biasMode === "reverse" ? zenerVoltage + 1 : 1)}
        >
          âš¡ Trigger ON
        </ControlButton>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ControlButton
          active={biasMode === "reverse"}
          onClick={() => setBiasMode("reverse")}
        >
          Reverse Bias
        </ControlButton>
        <ControlButton
          active={biasMode === "forward"}
          onClick={() => setBiasMode("forward")}
        >
          Forward Bias
        </ControlButton>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="voltage" className="font-black">
              Applied Voltage
            </label>
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
            className="w-full accent-purple-700"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>0V</span>
            <span>{biasMode === "reverse" ? `Vz ${zenerVoltage.toFixed(1)}V` : "0.7V"}</span>
            <span>12V</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="zenerVoltage" className="font-black">
              Zener Voltage (Vz)
            </label>
            <span className="rounded-xl bg-white px-3 py-1 font-mono font-black shadow-sm">
              {zenerVoltage.toFixed(1)}V
            </span>
          </div>
          <input
            id="zenerVoltage"
            type="range"
            min="2"
            max="9"
            step="0.1"
            value={zenerVoltage}
            onChange={(event) => setZenerVoltage(Number(event.target.value))}
            className="w-full accent-purple-700"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>2V</span>
            <span>breakdown point</span>
            <span>9V</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Mode</p>
          <p className="mt-1 text-lg font-black">
            {biasMode === "reverse" ? "Reverse Bias" : "Forward Bias"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Current</p>
          <p className="mt-1 text-lg font-black">{state.currentMA.toFixed(1)} mA</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Output Voltage</p>
          <p className="mt-1 text-lg font-black">{state.outputVoltage.toFixed(1)}V</p>
        </div>
      </div>
    </section>
  );
}
