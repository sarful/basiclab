"use client";

import { useMemo, useState } from "react";

import { Fuse1PSymbol } from "../../library";
import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  continuityFunctionLabel,
  continuityRequiredJacksLabel,
  continuityTestScenarios,
  type ContinuityPathState,
  type ContinuityProbeTargetId,
  type ContinuityTestScenario,
} from "./continuityTestScenarios";
import { useContinuityTestScenario } from "./useContinuityTestScenario";

function getScenarioStatusStyles(status: string) {
  switch (status) {
    case "solved":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "border-emerald-200 bg-emerald-50",
        label: "Continuity Checked",
      };
    case "wrong_jack":
    case "wrong_dial_family":
    case "same_node":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        card: "border-rose-200 bg-rose-50",
        label: "Fix Setup",
      };
    default:
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        card: "border-sky-200 bg-sky-50",
        label: "Place Probes",
      };
  }
}

function getToneClasses(tone: ContinuityTestScenario["tone"]) {
  switch (tone) {
    case "rose":
      return {
        accent: "bg-rose-500",
        board: "border-rose-200 bg-[linear-gradient(180deg,#fff3f5_0%,#ffffff_100%)]",
        chip: "border-rose-300 bg-rose-50 text-rose-800",
        path: "bg-rose-400",
        helper: "border-rose-100 bg-rose-50/60",
      };
    case "sky":
      return {
        accent: "bg-sky-500",
        board: "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
        chip: "border-sky-300 bg-sky-50 text-sky-800",
        path: "bg-sky-400",
        helper: "border-sky-100 bg-sky-50/60",
      };
    default:
      return {
        accent: "bg-emerald-500",
        board: "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
        chip: "border-emerald-300 bg-emerald-50 text-emerald-800",
        path: "bg-emerald-400",
        helper: "border-emerald-100 bg-emerald-50/60",
      };
  }
}

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
    <div className={`flex min-w-[132px] flex-col ${align === "left" ? "items-start" : "items-end"}`}>
      <div className={`flex items-center gap-2 ${align === "left" ? "" : "flex-row-reverse"}`}>
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
  tone: ReturnType<typeof getToneClasses>;
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
  tone: ReturnType<typeof getToneClasses>;
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

function ContinuityBoard({
  blackProbeTarget,
  clearProbeTargets,
  continuityDetected,
  redProbeTarget,
  scenario,
  setProbeTarget,
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
}) {
  const tone = getToneClasses(scenario.tone);

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
            {continuityDetected ? "♪" : "×"}
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

export default function ContinuityTestInteractiveSimulation() {
  const [viewMode, setViewMode] =
    useState<DigitalMultimeterCanvasSizeMode>("fit");
  const {
    blackLeadJack,
    moveDial,
    redLeadJack,
    resetToSafeDefault,
    selectedDialStopId,
    selectedMode,
    setDialStop,
    setLeadJack,
    validation,
  } = useMultimeterDial();

  const continuityScenario = useContinuityTestScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(continuityScenario.status);

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (continuityScenario.status === "solved") {
      return {
        ...validation,
        isSetupCorrect: true,
        message: continuityScenario.guidance.message,
        severity: "ok",
      };
    }

    const severity =
      continuityScenario.status === "wrong_jack" ||
      continuityScenario.status === "wrong_dial_family" ||
      continuityScenario.status === "same_node"
        ? "danger"
        : "warning";

    return {
      ...validation,
      isSetupCorrect: false,
      message: continuityScenario.guidance.message,
      severity,
    };
  }, [continuityScenario.guidance.message, continuityScenario.status, validation]);

  function applyRecommendedSetup() {
    setLeadJack("black", continuityScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", continuityScenario.scenario.expectedRedLeadJack);
    setDialStop(continuityScenario.scenario.preferredDialStopIds[0]);
  }

  function resetLessonContinuityTrainer() {
    resetToSafeDefault();
    continuityScenario.selectScenario(continuityTestScenarios[0].id);
    continuityScenario.clearProbeTargets();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Continuity Test Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Continuity Testing
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Learn how to switch to the diode / continuity-style function, keep the
          circuit unpowered, and check whether a path is electrically continuous.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Continuity Rule
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              Touch one probe to each test point to see whether the path is closed.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
              Meter Setup
            </p>
            <p className="mt-2 text-[15px] leading-6 text-slate-950">
              Use COM + VÎ©mA with the diode / continuity-style function.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
              Power Safety
            </p>
            <p className="mt-2 text-[15px] leading-6 text-rose-950">
              Power must be off before testing continuity on wires, fuses, or contacts.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
          <div className={`rounded-[24px] border p-5 ${scenarioStyles.card}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${scenarioStyles.badge}`}>
                  {scenarioStyles.label}
                </div>
                <h3 className="mt-3 text-[1.35rem] font-black tracking-tight text-slate-950">
                  {continuityScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {continuityScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Step</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {continuityScenario.scenarioIndex + 1}/{continuityScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">CONT</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Expected</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {continuityScenario.scenario.pathState === "closed" ? "Beep" : "Open"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {continuityTestScenarios.map((scenario) => {
                const tone = getToneClasses(scenario.tone);

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => continuityScenario.selectScenario(scenario.id)}
                    className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                      continuityScenario.scenario.id === scenario.id
                        ? tone.chip
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {scenario.title}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Function</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{continuityFunctionLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Path State</p>
                <p className="mt-2 text-[14px] font-bold capitalize text-slate-900">{continuityScenario.scenario.pathState}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Preview</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{continuityScenario.scenario.previewLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Required Jacks</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{continuityRequiredJacksLabel}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Safety Hint</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {continuityScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {continuityScenario.guidance.title}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyRecommendedSetup}
                className="rounded-xl border border-emerald-300 bg-emerald-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-emerald-600"
              >
                Apply Recommended Setup
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <ContinuityBoard
              blackProbeTarget={continuityScenario.blackProbeTarget}
              clearProbeTargets={continuityScenario.clearProbeTargets}
              continuityDetected={continuityScenario.continuityDetected}
              redProbeTarget={continuityScenario.redProbeTarget}
              scenario={continuityScenario.scenario}
              setProbeTarget={continuityScenario.setProbeTarget}
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Setup Coach
              </p>
              <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                Continuity Reading Board
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {continuityScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Continuity Status
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {continuityScenario.continuityDetected
                      ? "Closed path: continuity should beep."
                      : continuityScenario.status === "solved"
                        ? "Open path: no continuity should be detected."
                        : continuityScenario.guidance.message}
                  </p>
                </div>
              </div>

              {continuityScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {continuityScenario.mistakeBadges.map((badge) => (
                    <div
                      key={badge.text}
                      className={`rounded-full border px-3 py-2 text-[12px] font-bold ${
                        badge.tone === "danger"
                          ? "border-rose-300 bg-rose-50 text-rose-800"
                          : badge.tone === "warning"
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-sky-300 bg-sky-50 text-sky-800"
                      }`}
                    >
                      {badge.text}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Mission Checklist
              </p>
              <p className="mt-2 text-[14px] leading-6 text-slate-700">
                Set the meter to continuity mode, keep the path unpowered, and place one probe on each test point.
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {continuityScenario.guidance.checklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <details className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4" open>
          <summary className="cursor-pointer list-none text-[14px] font-black tracking-tight text-slate-900">
            Open Continuity Trainer
          </summary>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            Use the full multimeter trainer below to practice the continuity function and jack placement.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={continuityScenario.measuredDisplayValue}
                  redLeadJack={redLeadJack}
                  selectedStopId={selectedDialStopId}
                  sizeMode={viewMode}
                />
              }
              moveDial={moveDial}
              onSetDialStop={setDialStop}
              onSetLeadJack={setLeadJack}
              onSetViewMode={setViewMode}
              redLeadJack={redLeadJack}
              resetToSafeDefault={resetLessonContinuityTrainer}
              selectedDialStopId={selectedDialStopId}
              selectedMode={selectedMode}
              validation={lessonValidation}
              viewMode={viewMode}
            />
          </div>
        </details>
      </section>
    </div>
  );
}

