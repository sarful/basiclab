"use client";

import { ControlButton } from "./ControlButton";
import { SliderField } from "./SliderField";
import type { PhotodiodeState } from "./types";

export function ControlPanelSection({
  isPlaying,
  setIsPlaying,
  resetKey,
  setResetKey,
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
  state,
}: {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  resetKey: number;
  setResetKey: (value: number) => void;
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
  state: PhotodiodeState;
}) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Control Panel</h2>
          <p className="text-sm font-semibold text-slate-500">
            Real sensor model: lux to optical power to photocurrent to output voltage
          </p>
        </div>
        <div className={`rounded-2xl px-4 py-3 text-sm font-black ${state.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
          Status: {state.status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        <ControlButton active={isPlaying} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </ControlButton>
        <ControlButton onClick={() => setResetKey(resetKey + 1)}>Restart</ControlButton>
        <ControlButton active={isReverseBias} onClick={() => setIsReverseBias(true)}>Reverse Bias</ControlButton>
        <ControlButton active={!isReverseBias} onClick={() => setIsReverseBias(false)}>Forward Mode</ControlButton>
        <ControlButton active={state.hasLight} onClick={() => setLux(state.hasLight ? 0 : 1000)}>Toggle Light</ControlButton>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <SliderField id="lux" label="Light Level" value={lux} suffix="lux" min={0} max={100000} step={50} onChange={setLux} left="Dark" middle="Room/Daylight" right="Sunlight" />
        <SliderField id="reverseVoltage" label="Reverse Bias Voltage" value={reverseVoltage} suffix="V" min={0} max={30} step={0.1} onChange={setReverseVoltage} left="0V" middle="Sensor bias" right="30V" />
        <SliderField id="load" label="Load Resistor" value={loadKOhm} suffix="kOHM" min={1} max={1000} step={1} onChange={setLoadKOhm} left="1kOHM" middle="100kOHM" right="1MOHM" />
        <SliderField id="responsivity" label="Responsivity" value={responsivityAW} suffix="A/W" min={0.05} max={0.8} step={0.01} onChange={setResponsivityAW} left="Low" middle="Silicon typical" right="High" />
        <SliderField id="area" label="Active Area" value={activeAreaMM2} suffix="mm2" min={0.1} max={20} step={0.1} onChange={setActiveAreaMM2} left="Small" middle="Medium" right="Large" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold text-slate-300">Photocurrent</p><p className="mt-1 text-lg font-black">{state.photocurrentUA.toFixed(2)} uA</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold text-slate-300">Total Current</p><p className="mt-1 text-lg font-black">{state.totalCurrentUA.toFixed(2)} uA</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold text-slate-300">Output Voltage</p><p className="mt-1 text-lg font-black">{state.outputVoltage.toFixed(2)}V</p></div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold text-slate-300">Light Scene</p><p className="mt-1 text-lg font-black">{state.lightLabel}</p></div>
      </div>
    </section>
  );
}
