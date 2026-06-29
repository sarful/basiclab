"use client";

import { ResistorSymbol } from "@/src/library";

import type {
  MeasuringResistanceScenario,
  ResistanceProbeTargetId,
} from "../measuringResistanceScenarios";

type ResistanceTone = {
  accent: string;
  board: string;
  chip: string;
  helper: string;
  line: string;
  role: string;
  symbolWrap: string;
};

function ProbeChip({
  active,
  label,
  onClick,
  tone,
}: {
  active: boolean;
  label: "RED" | "BLACK";
  onClick: () => void;
  tone: "black" | "red";
}) {
  const inactive =
    tone === "red"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  const activeTone =
    tone === "red"
      ? "border-rose-500 bg-rose-500 text-white"
      : "border-slate-900 bg-slate-900 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${active ? activeTone : inactive}`}
    >
      {label}
    </button>
  );
}

function ResistorTerminal({
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
      className={`flex min-w-[132px] flex-col ${align === "left" ? "items-start" : "items-end"}`}
    >
      <div
        className={`flex items-center gap-2 ${align === "left" ? "" : "flex-row-reverse"}`}
      >
        <ProbeChip
          active={activeRed}
          label="RED"
          onClick={onSelectRed}
          tone="red"
        />
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${activeRed || activeBlack ? "ring-4 ring-amber-100" : ""}`}
        >
          {align === "left" ? "L" : "R"}
        </div>
        <ProbeChip
          active={activeBlack}
          label="BLACK"
          onClick={onSelectBlack}
          tone="black"
        />
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-slate-500">
        {align === "left" ? "Left resistor lead" : "Right resistor lead"}
      </p>
    </div>
  );
}

export default function ResistanceWorkbench({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
  tone,
}: {
  blackProbeTarget: ResistanceProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: ResistanceProbeTargetId | null;
  scenario: MeasuringResistanceScenario;
  setProbeTarget: (
    probe: "red" | "black",
    target: ResistanceProbeTargetId,
  ) => void;
  tone: ResistanceTone;
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Resistance Board
          </p>
          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
            Probe Across the Resistor
          </h3>
        </div>
        <button
          type="button"
          onClick={clearProbeTargets}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300"
        >
          Clear Probes
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${tone.chip}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${tone.accent}`} />
          Target: {scenario.resistanceLabel}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-rose-800">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-300 bg-white text-[12px] leading-none">
            !
          </span>
          Power must be off
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/80 bg-white p-5">
        <div
          className={`flex min-h-[196px] items-center justify-center rounded-[20px] border px-4 py-4 ${tone.symbolWrap}`}
        >
          <ResistorSymbol width={280} height={150} />
        </div>

        <div className={`mt-5 rounded-[20px] border px-5 py-5 ${tone.helper}`}>
          <div className="relative flex items-start justify-between gap-5">
            <div className="pointer-events-none absolute left-[18%] right-[18%] top-6">
              <div className={`h-[4px] rounded-full ${tone.line}`} />
            </div>
            <ResistorTerminal
              activeBlack={blackProbeTarget === "terminal_left"}
              activeRed={redProbeTarget === "terminal_left"}
              align="left"
              label={scenario.terminalLabels.left}
              onSelectBlack={() => setProbeTarget("black", "terminal_left")}
              onSelectRed={() => setProbeTarget("red", "terminal_left")}
            />
            <div className="shrink-0 pt-1 text-center">
              <div
                className={`rounded-full border border-dashed bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${tone.chip}`}
              >
                Read ohms here
              </div>
              <p className="mt-2 text-[12px] font-bold text-slate-900">
                {scenario.resistanceLabel}
              </p>
            </div>
            <ResistorTerminal
              activeBlack={blackProbeTarget === "terminal_right"}
              activeRed={redProbeTarget === "terminal_right"}
              align="right"
              label={scenario.terminalLabels.right}
              onSelectBlack={() => setProbeTarget("black", "terminal_right")}
              onSelectRed={() => setProbeTarget("red", "terminal_right")}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.18em] ${tone.role}`}
            >
              Left Terminal
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Touch one resistor lead only. Do not place both probes on the same side.
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.18em] ${tone.role}`}
            >
              Right Terminal
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Use the opposite resistor lead to complete the across-component measurement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
