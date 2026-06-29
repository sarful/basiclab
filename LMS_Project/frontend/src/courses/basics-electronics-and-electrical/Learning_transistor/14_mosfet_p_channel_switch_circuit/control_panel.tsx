"use client";

import type { PmosHighSideControls } from "./simulationTypes";

type ControlPanelProps = {
  controls: PmosHighSideControls;
  onChange: (patch: Partial<PmosHighSideControls>) => void;
  onReset: () => void;
};

function NumericSliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-right text-sm font-black text-slate-900 outline-none transition focus:border-red-400"
          />
          <span className="min-w-10 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {suffix}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-red-600"
      />
    </div>
  );
}

export default function MosfetPChannelSwitchCircuitControlPanel({
  controls,
  onChange,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">
              Simulator Controls
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-900">
              PMOS High-Side Driver
            </h2>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 transition hover:border-red-300 hover:text-red-700"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Switch
          </p>
          <button
            type="button"
            onClick={() => onChange({ switchClosed: !controls.switchClosed })}
            className={`mt-3 w-full rounded-2xl px-4 py-3 text-sm font-black text-white ${
              controls.switchClosed
                ? "bg-red-600 shadow-lg shadow-red-200"
                : "bg-slate-900"
            }`}
          >
            {controls.switchClosed ? "SW CLOSED" : "SW OPEN"}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Flow Mode
          </span>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => onChange({ flowMode: "conventional" })}
              className={`rounded-xl px-3 py-3 text-xs font-black uppercase tracking-[0.16em] transition ${
                controls.flowMode === "conventional"
                  ? "bg-amber-500 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              Conventional
            </button>
            <button
              type="button"
              onClick={() => onChange({ flowMode: "electron" })}
              className={`rounded-xl px-3 py-3 text-xs font-black uppercase tracking-[0.16em] transition ${
                controls.flowMode === "electron"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              Electron
            </button>
          </div>
        </div>
      </section>

      <NumericSliderRow
        label="Battery Voltage"
        value={controls.batteryVoltage}
        min={0}
        max={12}
        step={0.1}
        suffix="V"
        onChange={(value) => onChange({ batteryVoltage: value })}
      />
      <NumericSliderRow
        label="RPU"
        value={controls.rpuOhms}
        min={1000}
        max={100000}
        step={500}
        suffix="Ohm"
        onChange={(value) => onChange({ rpuOhms: value })}
      />
      <NumericSliderRow
        label="R_LED"
        value={controls.rLedOhms}
        min={100}
        max={2200}
        step={50}
        suffix="Ohm"
        onChange={(value) => onChange({ rLedOhms: value })}
      />
      <NumericSliderRow
        label="Flow Speed"
        value={controls.flowSpeed}
        min={0.5}
        max={3}
        step={0.1}
        suffix="x"
        onChange={(value) => onChange({ flowSpeed: value })}
      />
    </div>
  );
}
