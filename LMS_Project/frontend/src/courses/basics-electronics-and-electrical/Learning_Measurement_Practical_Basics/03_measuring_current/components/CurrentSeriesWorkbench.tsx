"use client";

import { Battery9V, DCPowerSupply12V } from "@/src/library";

import type {
  MeasuringCurrentProbeTargetId,
  MeasuringCurrentScenario,
  MeasuringCurrentSourceType,
} from "../measuringCurrentScenarios";

function ScenarioSourcePreview({
  sourceType,
}: {
  sourceType: MeasuringCurrentSourceType;
}) {
  if (sourceType === "dc_battery") {
    return (
      <div className="flex min-h-[210px] items-center justify-center">
        <Battery9V width={150} height={245} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[210px] items-center justify-center">
      <DCPowerSupply12V width={300} />
    </div>
  );
}

function ProbeChoiceChip({
  active,
  label,
  tone,
  onClick,
}: {
  active: boolean;
  label: "RED" | "BLACK";
  onClick: () => void;
  tone: "black" | "red";
}) {
  const inactiveClass =
    tone === "red"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  const activeClass =
    tone === "red"
      ? "border-rose-500 bg-rose-500 text-white shadow-[0_10px_20px_rgba(244,63,94,0.28)]"
      : "border-slate-900 bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.28)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] transition sm:px-3 sm:text-[10px] ${active ? activeClass : inactiveClass}`}
    >
      {label}
    </button>
  );
}

function SeriesGapTerminal({
  activeBlack,
  activeRed,
  align,
  label,
  onSelectBlack,
  onSelectRed,
}: {
  activeBlack: boolean;
  activeRed: boolean;
  align: "left" | "right";
  label: string;
  onSelectBlack: () => void;
  onSelectRed: () => void;
}) {
  return (
    <div
      className={`flex min-w-[118px] flex-col ${align === "left" ? "items-start" : "items-end"} ${align === "right" ? "pr-2" : ""}`}
    >
      <div
        className={`flex items-center gap-2 ${align === "left" ? "" : "flex-row-reverse"}`}
      >
        <ProbeChoiceChip
          active={activeRed}
          label="RED"
          onClick={onSelectRed}
          tone="red"
        />
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.2)] ${activeRed || activeBlack ? "ring-4 ring-emerald-100" : ""}`}
        >
          {align === "left" ? "IN" : "OUT"}
        </div>
        <ProbeChoiceChip
          active={activeBlack}
          label="BLACK"
          onClick={onSelectBlack}
          tone="black"
        />
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">
        {align === "left" ? "Current enters meter" : "Current returns to load"}
      </p>
    </div>
  );
}

function CurrentSeriesPathBoard({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
}: {
  blackProbeTarget: MeasuringCurrentProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: MeasuringCurrentProbeTargetId | null;
  scenario: MeasuringCurrentScenario;
  setProbeTarget: (
    probe: "red" | "black",
    target: MeasuringCurrentProbeTargetId,
  ) => void;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Series Path Board
          </p>
          <h4 className="mt-1 text-[1.05rem] font-black tracking-tight text-slate-950">
            {scenario.seriesPathTitle}
          </h4>
        </div>
        <button
          type="button"
          onClick={clearProbeTargets}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white"
        >
          Clear Probes
        </button>
      </div>

      <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-6 sm:px-5">
        <div className="flex flex-col gap-5">
          <div className="grid items-center gap-4 lg:grid-cols-[96px_minmax(0,1fr)_96px]">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Source
              </p>
              <p className="mt-2 text-[12px] font-bold text-emerald-950">
                {scenario.sourceLabel}
              </p>
            </div>

            <div className="relative min-w-0 px-1">
              <div className="pointer-events-none absolute left-4 right-4 top-6">
                <div className="flex items-center">
                  <div className="h-[4px] flex-1 rounded-full bg-emerald-400" />
                  <div className="mx-3 h-[4px] w-12 rounded-full bg-transparent" />
                  <div className="h-[4px] flex-1 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-4 pr-3">
                <SeriesGapTerminal
                  activeBlack={blackProbeTarget === "gap_left"}
                  activeRed={redProbeTarget === "gap_left"}
                  align="left"
                  label={scenario.seriesGapLabels.left}
                  onSelectBlack={() => setProbeTarget("black", "gap_left")}
                  onSelectRed={() => setProbeTarget("red", "gap_left")}
                />

                <div className="shrink-0 pt-1 text-center">
                  <div className="rounded-full border border-dashed border-emerald-300 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                    Insert meter here
                  </div>
                </div>

                <SeriesGapTerminal
                  activeBlack={blackProbeTarget === "gap_right"}
                  activeRed={redProbeTarget === "gap_right"}
                  align="right"
                  label={scenario.seriesGapLabels.right}
                  onSelectBlack={() => setProbeTarget("black", "gap_right")}
                  onSelectRed={() => setProbeTarget("red", "gap_right")}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
                Load
              </p>
              <p className="mt-2 text-[12px] font-bold text-sky-950">
                {scenario.loadLabel}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-[180px]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  Left Gap Node
                </p>
                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  Put the red probe on the source side of the open circuit.
                </p>
              </div>
              <div className="min-w-[180px] text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
                  Right Gap Node
                </p>
                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  Put the black probe on the load side to complete the series path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CurrentSeriesWorkbench({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
}: {
  blackProbeTarget: MeasuringCurrentProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: MeasuringCurrentProbeTargetId | null;
  scenario: MeasuringCurrentScenario;
  setProbeTarget: (
    probe: "red" | "black",
    target: MeasuringCurrentProbeTargetId,
  ) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Visual Source
          </p>
          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
            Current Practice Source
          </h3>
        </div>
        <div className="h-3 w-3 rounded-full bg-orange-500" />
      </div>
      <div className="mt-4 rounded-[22px] border border-white/80 bg-white p-4">
        <ScenarioSourcePreview sourceType={scenario.sourceType} />
      </div>
      <div className="mt-4">
        <CurrentSeriesPathBoard
          blackProbeTarget={blackProbeTarget}
          clearProbeTargets={clearProbeTargets}
          redProbeTarget={redProbeTarget}
          scenario={scenario}
          setProbeTarget={setProbeTarget}
        />
      </div>
    </div>
  );
}
