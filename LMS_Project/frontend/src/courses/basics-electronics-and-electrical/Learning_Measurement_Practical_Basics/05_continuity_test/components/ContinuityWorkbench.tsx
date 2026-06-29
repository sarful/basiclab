"use client";

import { Fuse1PSymbol } from "@/src/library";

import type {
  ContinuityPathState,
  ContinuityProbeTargetId,
  ContinuityTestScenario,
} from "../continuityTestScenarios";

type ToneClasses = {
  accent: string;
  board: string;
  chip: string;
  path: string;
  helper: string;
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

function ContinuityTerminal({
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
        <ProbeChip active={activeRed} label="RED" onClick={onSelectRed} tone="red" />
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${activeRed || activeBlack ? "ring-4 ring-emerald-100" : ""}`}
        >
          {align === "left" ? "A" : "B"}
        </div>
        <ProbeChip active={activeBlack} label="BLACK" onClick={onSelectBlack} tone="black" />
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-slate-500">
        {align === "left" ? "Left test point" : "Right test point"}
      </p>
    </div>
  );
}

function ContinuityPathPreview({
  continuityDetected,
  pathState,
  tone,
}: {
  continuityDetected: boolean;
  pathState: ContinuityPathState;
  tone: ToneClasses;
}) {
  if (pathState === "closed") {
    return (
      <div className="pointer-events-none absolute left-[14%] right-[14%] top-5">
        <div className="relative flex items-center">
          <span
            className={`h-3 w-3 rounded-full border-2 border-white shadow-sm ${tone.path}`}
          />
          <div
            className={`h-[5px] flex-1 rounded-full ${tone.path} ${continuityDetected ? "animate-pulse shadow-[0_0_0_6px_rgba(16,185,129,0.08)]" : ""}`}
          />
          <span
            className={`h-3 w-3 rounded-full border-2 border-white shadow-sm ${tone.path}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute left-[14%] right-[14%] top-5">
      <div className="flex items-center">
        <span
          className={`h-3 w-3 rounded-full border-2 border-white shadow-sm ${tone.path}`}
        />
        <div className={`h-[5px] flex-1 rounded-full ${tone.path}`} />
        <div className="mx-3 flex w-12 items-center justify-center">
          <span className="h-[2px] w-5 rotate-45 rounded-full bg-rose-400" />
          <span className="ml-[-6px] h-[2px] w-5 -rotate-45 rounded-full bg-rose-400" />
        </div>
        <div className={`h-[5px] flex-1 rounded-full ${tone.path}`} />
        <span
          className={`h-3 w-3 rounded-full border-2 border-white shadow-sm ${tone.path}`}
        />
      </div>
    </div>
  );
}

function ContinuityScenarioVisual({
  scenario,
  tone,
}: {
  scenario: ContinuityTestScenario;
  tone: ToneClasses;
}) {
  if (scenario.id === "blown_fuse_open") {
    return (
      <div className="mb-5 rounded-[18px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-center gap-5">
          <div className={`h-[4px] w-16 rounded-full ${tone.path}`} />
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2">
            <Fuse1PSymbol height={84} label="Fuse continuity check" width={56} />
          </div>
          <div className={`h-[4px] w-16 rounded-full ${tone.path}`} />
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold text-slate-600">
          Library fuse component preview for the open continuity path.
        </p>
      </div>
    );
  }

  if (scenario.id === "closed_switch_path") {
    return (
      <div className="mb-5 rounded-[18px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-center gap-3">
          <span className={`h-3 w-3 rounded-full ${tone.path}`} />
          <div className={`h-[4px] w-16 rounded-full ${tone.path}`} />
          <div className="relative h-8 w-12">
            <span className="absolute left-1 top-5 h-[3px] w-10 rotate-[-22deg] rounded-full bg-slate-900" />
            <span className="absolute left-0 top-4 h-3 w-3 rounded-full border-2 border-slate-900 bg-white" />
            <span className="absolute right-0 top-4 h-3 w-3 rounded-full border-2 border-slate-900 bg-white" />
          </div>
          <div className={`h-[4px] w-16 rounded-full ${tone.path}`} />
          <span className={`h-3 w-3 rounded-full ${tone.path}`} />
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold text-slate-600">
          Closed contact path preview for continuity across the switch.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-[18px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-center gap-3">
        <span className={`h-3 w-3 rounded-full ${tone.path}`} />
        <div className={`h-[5px] w-32 rounded-full ${tone.path}`} />
        <span className={`h-3 w-3 rounded-full ${tone.path}`} />
      </div>
      <p className="mt-3 text-center text-[11px] font-semibold text-slate-600">
        Closed wire link preview for direct continuity across both points.
      </p>
    </div>
  );
}

export default function ContinuityWorkbench({
  blackProbeTarget,
  clearProbeTargets,
  continuityDetected,
  redProbeTarget,
  scenario,
  setProbeTarget,
  tone,
}: {
  blackProbeTarget: ContinuityProbeTargetId | null;
  clearProbeTargets: () => void;
  continuityDetected: boolean;
  redProbeTarget: ContinuityProbeTargetId | null;
  scenario: ContinuityTestScenario;
  setProbeTarget: (
    probe: "red" | "black",
    target: ContinuityProbeTargetId,
  ) => void;
  tone: ToneClasses;
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Continuity Board
          </p>
          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
            Check the Path Between Two Points
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${tone.chip}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${tone.accent}`} />
          Path: {scenario.previewLabel}
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${
            continuityDetected
              ? "animate-pulse border-emerald-300 bg-emerald-50 text-emerald-800 shadow-[0_0_0_8px_rgba(16,185,129,0.08)]"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[12px] leading-none ${
              continuityDetected
                ? "border-emerald-300 bg-white"
                : "border-slate-300 bg-slate-50"
            }`}
          >
            {continuityDetected ? "?" : "×"}
          </span>
          {continuityDetected ? "Beep expected" : "No continuity beep"}
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/80 bg-white p-5 md:p-6">
        <ContinuityScenarioVisual scenario={scenario} tone={tone} />

        <div className={`rounded-[20px] border px-5 py-6 md:px-6 ${tone.helper}`}>
          <div className="relative flex items-start justify-between gap-6 md:gap-8">
            <ContinuityPathPreview
              continuityDetected={continuityDetected}
              pathState={scenario.pathState}
              tone={tone}
            />
            <ContinuityTerminal
              activeBlack={blackProbeTarget === "point_a"}
              activeRed={redProbeTarget === "point_a"}
              align="left"
              label={scenario.terminalLabels.left}
              onSelectBlack={() => setProbeTarget("black", "point_a")}
              onSelectRed={() => setProbeTarget("red", "point_a")}
            />
            <div className="shrink-0 px-1 pt-2 text-center">
              <div className={`rounded-full border border-dashed bg-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${tone.chip}`}>
                Test path here
              </div>
              <p className="mt-3 text-[12px] font-bold text-slate-900">
                {scenario.pathState === "closed" ? "Closed path" : "Open path"}
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500">
                {scenario.pathState === "closed"
                  ? "Continuity should complete across both points."
                  : "The break should stop continuity across the path."}
              </p>
            </div>
            <ContinuityTerminal
              activeBlack={blackProbeTarget === "point_b"}
              activeRed={redProbeTarget === "point_b"}
              align="right"
              label={scenario.terminalLabels.right}
              onSelectBlack={() => setProbeTarget("black", "point_b")}
              onSelectRed={() => setProbeTarget("red", "point_b")}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              Point A
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put one probe on the first test point only.
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              Point B
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put the other probe on the second test point to check continuity across the path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
