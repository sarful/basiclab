"use client";

import type { NpnWorkingState } from "./simulationTypes";

type CurrentFlowStatusCardProps = {
  state: NpnWorkingState;
};

function FlowBadge({
  label,
  active,
  colorClass,
}: {
  label: string;
  active: boolean;
  colorClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-900">{label}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
            active ? colorClass : "bg-slate-100 text-slate-500"
          }`}
        >
          {active ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}

export default function CurrentFlowStatusCard({
  state,
}: CurrentFlowStatusCardProps) {
  const basePathLabel =
    state.flowMode === "electron"
      ? "Electron path: Emitter -> Base -> RB -> SW -> +Vcc"
      : "Base path: Vcc -> SW -> RB -> Base -> Emitter";

  const loadPathLabel =
    state.flowMode === "electron"
      ? "Electron path: Emitter -> Collector -> LED -> R_LED -> +Vcc"
      : "Load path: Vcc -> R_LED -> LED -> Collector -> Emitter";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Current Flow
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-900">
            Path-to-Path Logic
          </h3>
        </div>
        <div className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700">
          {state.flowMode === "electron" ? "Electron Flow" : "Conventional Current"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <FlowBadge
          label={basePathLabel}
          active={state.basePathActive}
          colorClass="bg-blue-100 text-blue-700"
        />
        <FlowBadge
          label={loadPathLabel}
          active={state.loadPathActive}
          colorClass="bg-orange-100 text-orange-700"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Base Node
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">
            {state.baseVoltage.toFixed(2)}V
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Collector
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">
            {state.collectorVoltage.toFixed(2)}V
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Emitter
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">
            {state.emitterVoltage.toFixed(2)}V
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            LED Brightness
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">
            {state.ledBrightness.toFixed(0)}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Mode
          </p>
          <p className="mt-2 text-xl font-black uppercase text-slate-900">
            {state.mode}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Fault mode: {state.faultMode.replaceAll("_", " ")}
          </p>
        </div>
      </div>
    </section>
  );
}
