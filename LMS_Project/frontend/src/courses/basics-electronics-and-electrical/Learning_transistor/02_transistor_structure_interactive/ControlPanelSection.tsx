"use client";

import type { TransistorType } from "./types";

type ControlPanelSectionProps = {
  transistorType: TransistorType;
  setTransistorType: (value: TransistorType) => void;
  active: boolean;
  setActive: (value: boolean) => void;
  baseVoltage: number;
  setBaseVoltage: (value: number) => void;
  collectorVoltage: number;
  setCollectorVoltage: (value: number) => void;
  baseResistance: number;
  setBaseResistance: (value: number) => void;
  loadResistance: number;
  setLoadResistance: (value: number) => void;
  dopingLevel: number;
  setDopingLevel: (value: number) => void;
  showPhysics: boolean;
  setShowPhysics: (value: boolean) => void;
  showCurrent: boolean;
  setShowCurrent: (value: boolean) => void;
  showCarrierFlow: boolean;
  setShowCarrierFlow: (value: boolean) => void;
};

function format(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}

export default function ControlPanelSection({
  transistorType,
  setTransistorType,
  active,
  setActive,
  baseVoltage,
  setBaseVoltage,
  collectorVoltage,
  setCollectorVoltage,
  baseResistance,
  setBaseResistance,
  loadResistance,
  setLoadResistance,
  dopingLevel,
  setDopingLevel,
  showPhysics,
  setShowPhysics,
  showCurrent,
  setShowCurrent,
  showCarrierFlow,
  setShowCarrierFlow,
}: ControlPanelSectionProps) {
  const isPnp = transistorType === "PNP";

  const resetDefault = () => {
    setBaseVoltage(isPnp ? -0.9 : 0.9);
    setCollectorVoltage(11);
    setBaseResistance(8000);
    setLoadResistance(300);
    setDopingLevel(70);
    setActive(true);
    setShowPhysics(true);
    setShowCurrent(true);
    setShowCarrierFlow(true);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-900">Simulator Controls</h2>
        <button
          type="button"
          onClick={() => setActive(!active)}
          className={`rounded-2xl px-4 py-2 text-xs font-black ${
            active ? "bg-green-600 text-white" : "bg-slate-800 text-white"
          }`}
        >
          {active ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setTransistorType("NPN");
            setBaseVoltage(0.9);
          }}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            transistorType === "NPN"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          NPN
        </button>

        <button
          type="button"
          onClick={() => {
            setTransistorType("PNP");
            setBaseVoltage(-0.9);
          }}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            transistorType === "PNP"
              ? "bg-red-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          PNP
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <SliderControl
          label="Base Bias VBE"
          value={baseVoltage}
          min={isPnp ? -1.2 : 0}
          max={isPnp ? 0 : 1.2}
          step={0.01}
          suffix="V"
          onChange={setBaseVoltage}
        />

        <SliderControl
          label={isPnp ? "Collector Supply VEC" : "Collector Supply VCE"}
          value={collectorVoltage}
          min={0}
          max={15}
          step={0.1}
          suffix="V"
          onChange={setCollectorVoltage}
        />

        <SliderControl
          label="Base Resistor RB"
          value={baseResistance}
          min={1000}
          max={100000}
          step={1000}
          suffix="Ohm"
          displayValue={`${Math.round(baseResistance / 1000)}kOhm`}
          onChange={setBaseResistance}
        />

        <SliderControl
          label="Load Resistor RL"
          value={loadResistance}
          min={100}
          max={5000}
          step={50}
          suffix="Ohm"
          displayValue={`${loadResistance}Ohm`}
          onChange={setLoadResistance}
        />

        <SliderControl
          label="Doping Level"
          value={dopingLevel}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={setDopingLevel}
        />
      </div>

      <div className="mt-6 grid gap-3">
        <ToggleButton label="Show Physics" value={showPhysics} onChange={setShowPhysics} />
        <ToggleButton label="Show Current" value={showCurrent} onChange={setShowCurrent} />
        <ToggleButton label="Show Electron Flow" value={showCarrierFlow} onChange={setShowCarrierFlow} />
      </div>

      <button
        type="button"
        onClick={resetDefault}
        className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
      >
        Reset Default
      </button>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  displayValue?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
          {displayValue ?? `${format(value, suffix === "V" ? 2 : 0)}${suffix}`}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-green-600"
      />
    </label>
  );
}

function ToggleButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
        value
          ? "bg-green-600 text-white shadow"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      {label}: {value ? "ON" : "OFF"}
    </button>
  );
}
