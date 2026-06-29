"use client";

import { TRAINING_STEPS } from "./mosfetSimulatorConstants";
import MosfetDualChannelOscilloscope from "./MosfetDualChannelOscilloscope";
import type { FlowMode, LoadType } from "./mosfetSimulatorTypes";

type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
};

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: RangeControlProps) {
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

type SelectControlProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectControlProps<T>) {
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

export type MosfetControlPanelProps = {
  autoScale: boolean;
  drainCurrent: number;
  gateVoltage: number;
  drainVoltage: number;
  temperature: number;
  loadResistance: number;
  flowMode: FlowMode;
  loadType: LoadType;
  speed: number;
  trainingStep: number;
  scopeRunning: boolean;
  setGateVoltage: (value: number) => void;
  setDrainVoltage: (value: number) => void;
  setTemperature: (value: number) => void;
  setLoadResistance: (value: number) => void;
  setFlowMode: (value: FlowMode) => void;
  setLoadType: (value: LoadType) => void;
  setSpeed: (value: number) => void;
  setTrainingStep: (value: number) => void;
  setAutoScale: (value: boolean) => void;
  setScopeRunning: (value: boolean) => void;
};

export default function MosfetControlPanel({
  autoScale,
  drainCurrent,
  gateVoltage,
  drainVoltage,
  temperature,
  loadResistance,
  flowMode,
  loadType,
  speed,
  scopeRunning,
  trainingStep,
  setGateVoltage,
  setDrainVoltage,
  setTemperature,
  setLoadResistance,
  setFlowMode,
  setLoadType,
  setSpeed,
  setTrainingStep,
  setAutoScale,
  setScopeRunning,
}: MosfetControlPanelProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
            Control Panel
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Simulation Inputs</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tune the gate, drain, load, and training flow while the MOSFET canvas updates live.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <RangeControl
          label="Gate Voltage"
          value={gateVoltage}
          min={0}
          max={10}
          step={0.1}
          unit="V"
          onChange={setGateVoltage}
        />
        <RangeControl
          label="Drain Voltage"
          value={drainVoltage}
          min={0}
          max={15}
          step={0.1}
          unit="V"
          onChange={setDrainVoltage}
        />
        <RangeControl
          label="Temperature"
          value={temperature}
          min={25}
          max={125}
          step={1}
          unit="C"
          onChange={setTemperature}
        />
        <RangeControl
          label="Load Resistance"
          value={loadResistance}
          min={10}
          max={1000}
          step={10}
          unit="Ohm"
          onChange={setLoadResistance}
        />
        <RangeControl
          label="Simulation Speed"
          value={speed}
          min={0.5}
          max={3}
          step={0.1}
          unit="x"
          onChange={setSpeed}
        />

        <div className="grid gap-4 pt-2">
          <SelectControl
            label="Flow Mode"
            value={flowMode}
            options={["Electron", "Conventional", "Both"]}
            onChange={setFlowMode}
          />
          <SelectControl
            label="Load Type"
            value={loadType}
            options={["Resistor", "LED", "Motor", "Lamp"]}
            onChange={setLoadType}
          />
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
          <p className="mt-3 text-sm font-semibold text-emerald-900">
            {TRAINING_STEPS[trainingStep]}
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-700">
            Step through the learning sequence from gate OFF to saturation region.
          </p>
        </div>

        <MosfetDualChannelOscilloscope
          autoScale={autoScale}
          drainCurrent={drainCurrent}
          gateVoltage={gateVoltage}
          running={scopeRunning}
          setAutoScale={setAutoScale}
          setRunning={setScopeRunning}
        />
      </div>
    </aside>
  );
}
