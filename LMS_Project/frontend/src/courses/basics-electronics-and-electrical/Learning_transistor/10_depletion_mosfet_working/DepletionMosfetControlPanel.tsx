"use client";

import DepletionMosfetDualChannelOscilloscope from "./DepletionMosfetDualChannelOscilloscope";

type FlowMode = "Electron" | "Conventional" | "Both";
type LearningMode = "Beginner" | "Advanced";

const TRAINING_STEPS = [
  "Channel exists at VGS = 0",
  "Negative gate voltage applied",
  "Depletion region expands",
  "Channel becomes narrow",
  "Cutoff condition reached",
  "Positive VGS enhances channel",
] as const;

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </label>
  );
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-green-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export type DepletionMosfetControlPanelProps = {
  autoScale: boolean;
  drainCurrent: number;
  gateVoltage: number;
  drainVoltage: number;
  cutoffVoltage: number;
  temperature: number;
  loadResistance: number;
  flowMode: FlowMode;
  learningMode: LearningMode;
  trainingStep: number;
  autoplay: boolean;
  running: boolean;
  setGateVoltage: (value: number) => void;
  setDrainVoltage: (value: number) => void;
  setCutoffVoltage: (value: number) => void;
  setTemperature: (value: number) => void;
  setLoadResistance: (value: number) => void;
  setFlowMode: (value: FlowMode) => void;
  setLearningMode: (value: LearningMode) => void;
  setTrainingStep: (value: number) => void;
  setRunning: (value: boolean) => void;
  setAutoScale: (value: boolean) => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  onAuto: () => void;
};

export default function DepletionMosfetControlPanel({
  autoScale,
  drainCurrent,
  gateVoltage,
  drainVoltage,
  cutoffVoltage,
  temperature,
  loadResistance,
  flowMode,
  learningMode,
  trainingStep,
  autoplay,
  running,
  setGateVoltage,
  setDrainVoltage,
  setCutoffVoltage,
  setTemperature,
  setLoadResistance,
  setFlowMode,
  setLearningMode,
  setTrainingStep,
  setRunning,
  setAutoScale,
  onRun,
  onPause,
  onReset,
  onAuto,
}: DepletionMosfetControlPanelProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
          Control Panel
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Depletion MOSFET Inputs</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Adjust the normally-on channel, depletion cutoff voltage, and live circuit conditions from one lesson 14 style panel.
        </p>
      </div>

      <div className="grid gap-4">
        <RangeControl label="Gate Voltage" value={gateVoltage} min={-6} max={6} step={0.1} unit="V" onChange={setGateVoltage} />
        <RangeControl label="Drain Voltage" value={drainVoltage} min={0} max={15} step={0.1} unit="V" onChange={setDrainVoltage} />
        <RangeControl label="VGS(off)" value={cutoffVoltage} min={-8} max={-1} step={0.1} unit="V" onChange={setCutoffVoltage} />
        <RangeControl label="Load Resistance" value={loadResistance} min={10} max={1000} step={10} unit="Ohm" onChange={setLoadResistance} />
        <RangeControl label="Temperature" value={temperature} min={25} max={125} step={1} unit="C" onChange={setTemperature} />

        <div className="grid gap-4 pt-2">
          <SelectControl label="Flow Mode" value={flowMode} options={["Electron", "Conventional", "Both"]} onChange={setFlowMode} />
          <SelectControl label="Learning Mode" value={learningMode} options={["Beginner", "Advanced"]} onChange={setLearningMode} />
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-emerald-900">Training Step</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700">
              {trainingStep + 1}/6
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={trainingStep}
            onChange={(event) => setTrainingStep(Number(event.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
          />
          <p className="mt-3 text-sm font-semibold text-emerald-900">{TRAINING_STEPS[trainingStep]}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onRun} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
            Run
          </button>
          <button onClick={onPause} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white">
            Pause
          </button>
          <button onClick={onReset} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
            Reset
          </button>
          <button onClick={onAuto} className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
            Auto {autoplay ? "ON" : "OFF"}
          </button>
        </div>

        <DepletionMosfetDualChannelOscilloscope
          autoScale={autoScale}
          drainCurrent={drainCurrent}
          gateVoltage={gateVoltage}
          running={running}
          setAutoScale={setAutoScale}
          setRunning={setRunning}
        />
      </div>
    </aside>
  );
}
