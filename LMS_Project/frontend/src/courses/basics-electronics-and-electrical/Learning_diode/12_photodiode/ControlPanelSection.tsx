"use client";

import { ControlButton } from "./ControlButton";
import { SliderField } from "./SliderField";
import type { FlowMode, PhotodiodeState } from "./types";

export function ControlPanelSection({
  isPlaying,
  setIsPlaying,
  resetSimulation,
  lux,
  setLux,
  reverseVoltage,
  setReverseVoltage,
  loadKOhm,
  setLoadKOhm,
  responsivityAW,
  setResponsivityAW,
  activeAreaMM2,
  setActiveAreaMM2,
  isReverseBias,
  setIsReverseBias,
  flowMode,
  setFlowMode,
  state,
}: {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  resetSimulation: () => void;
  lux: number;
  setLux: (value: number) => void;
  reverseVoltage: number;
  setReverseVoltage: (value: number) => void;
  loadKOhm: number;
  setLoadKOhm: (value: number) => void;
  responsivityAW: number;
  setResponsivityAW: (value: number) => void;
  activeAreaMM2: number;
  setActiveAreaMM2: (value: number) => void;
  isReverseBias: boolean;
  setIsReverseBias: (value: boolean) => void;
  flowMode: FlowMode;
  setFlowMode: (value: FlowMode) => void;
  state: PhotodiodeState;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_132px] lg:items-start">
        <div className="min-w-0">
          <h2 className="text-lg font-black text-slate-950">Control Panel</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 sm:text-sm">
            Real sensor model: lux to optical power to photocurrent to output voltage
          </p>
        </div>
        <div className={`rounded-2xl border px-3 py-3 text-xs font-black leading-5 ${
          state.isActive
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}>
          <p className="text-[11px] uppercase tracking-[0.16em] opacity-75">Status</p>
          <p className="mt-1 break-words">{state.status}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-3 shadow-sm">
        <p className="px-1 text-sm font-black uppercase tracking-[0.22em] text-slate-500">
          Simulator Actions
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
        <ControlButton
          active={isPlaying}
          tone="green"
          caption="Simulation"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </ControlButton>
        <ControlButton
          tone="slate"
          caption="Reset"
          onClick={resetSimulation}
        >
          Restart
        </ControlButton>
        <ControlButton
          active={isReverseBias}
          tone="blue"
          caption="Sensor Bias"
          onClick={() => setIsReverseBias(true)}
        >
          Reverse
        </ControlButton>
        <ControlButton
          active={!isReverseBias}
          tone="amber"
          caption="Comparison Mode"
          onClick={() => setIsReverseBias(false)}
        >
          Forward Bias
        </ControlButton>
        <ControlButton
          active={state.hasLight}
          tone="green"
          caption="Light Source"
          onClick={() => setLux(state.hasLight ? 0 : 1000)}
        >
          Toggle Light
        </ControlButton>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SliderField id="lux" label="Light Level" value={lux} suffix="lux" min={0} max={100000} step={50} onChange={setLux} left="Dark" middle="Room/Daylight" right="Sunlight" />
        <SliderField id="reverseVoltage" label="Reverse Bias Voltage" value={reverseVoltage} suffix="V" min={0} max={30} step={0.1} onChange={setReverseVoltage} left="0V" middle="Sensor bias" right="30V" />
        <SliderField id="load" label="Load Resistor" value={loadKOhm} suffix="kOHM" min={1} max={1000} step={1} onChange={setLoadKOhm} left="1kOHM" middle="100kOHM" right="1MOHM" />
        <SliderField id="responsivity" label="Responsivity" value={responsivityAW} suffix="A/W" min={0.05} max={0.8} step={0.01} onChange={setResponsivityAW} left="Low" middle="Silicon typical" right="High" />
        <SliderField id="area" label="Active Area" value={activeAreaMM2} suffix="mm2" min={0.1} max={20} step={0.1} onChange={setActiveAreaMM2} left="Small" middle="Medium" right="Large" />
      </div>

      <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
          Flow Mode
        </p>
        <div className="mt-3 rounded-[24px] border border-slate-200 bg-white p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFlowMode("conventional")}
              className={`rounded-2xl px-4 py-3 text-sm font-black tracking-[0.12em] transition ${
                flowMode === "conventional"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:bg-amber-50"
              }`}
            >
              CONVENTIONAL
            </button>
            <button
              type="button"
              onClick={() => setFlowMode("electron")}
              className={`rounded-2xl px-4 py-3 text-sm font-black tracking-[0.12em] transition ${
                flowMode === "electron"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:bg-blue-50"
              }`}
            >
              ELECTRON
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">Photocurrent</p><p className="mt-1 text-base font-black xl:text-lg">{state.photocurrentUA.toFixed(2)} uA</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">Total Current</p><p className="mt-1 text-base font-black xl:text-lg">{state.totalCurrentUA.toFixed(2)} uA</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">Output Voltage</p><p className="mt-1 text-base font-black xl:text-lg">{state.outputVoltage.toFixed(2)}V</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">Junction State</p><p className="mt-1 text-base font-black xl:text-lg">{state.conductionLabel}</p></div>
      </div>
    </section>
  );
}
