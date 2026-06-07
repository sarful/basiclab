"use client";

import { useMemo, useState } from "react";

import { Battery9V, DCPowerSupply12V } from "../../library";
import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  polarityAndGroundScenarios,
  type PolarityAndGroundScenario,
  type PolarityProbeTargetId,
  type PolarityTerminalRole,
} from "./polarityAndGroundScenarios";
import { usePolarityAndGroundScenario } from "./usePolarityAndGroundScenario";

const OMEGA = "\u03A9";

function formatExpectedJack(label: string) {
  if (label === "jack_com") return "COM";
  if (label === "jack_voma") return `V${OMEGA}mA`;

  return label;
}

function getScenarioStatusStyles(status: string) {
  switch (status) {
    case "solved":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "border-emerald-200 bg-emerald-50",
        label: "Solved",
      };
    case "wrong_dial_family":
    case "wrong_lead_setup":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        card: "border-rose-200 bg-rose-50",
        label: "Fix Setup",
      };
    case "waiting_for_probes":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        card: "border-amber-200 bg-amber-50",
        label: "Place Probes",
      };
    default:
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        card: "border-sky-200 bg-sky-50",
        label: "Ready",
      };
  }
}

function getToneClasses(tone: PolarityAndGroundScenario["tone"]) {
  switch (tone) {
    case "amber":
      return {
        accent: "bg-amber-500",
        board: "border-amber-200 bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]",
        chip: "border-amber-300 bg-amber-50 text-amber-800",
        helper: "border-amber-100 bg-amber-50/60",
        line: "bg-amber-400",
      };
    case "sky":
      return {
        accent: "bg-sky-500",
        board: "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
        chip: "border-sky-300 bg-sky-50 text-sky-800",
        helper: "border-sky-100 bg-sky-50/60",
        line: "bg-sky-400",
      };
    default:
      return {
        accent: "bg-emerald-500",
        board: "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
        chip: "border-emerald-300 bg-emerald-50 text-emerald-800",
        helper: "border-emerald-100 bg-emerald-50/60",
        line: "bg-emerald-400",
      };
  }
}

function getRoleStyles(role: PolarityTerminalRole) {
  switch (role) {
    case "positive":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        role: "text-emerald-600",
      };
    case "ground":
      return {
        dot: "bg-sky-500",
        text: "text-sky-700",
        role: "text-sky-600",
      };
    default:
      return {
        dot: "bg-rose-500",
        text: "text-rose-700",
        role: "text-rose-600",
      };
  }
}

function SourcePreview({
  scenario,
}: {
  scenario: PolarityAndGroundScenario;
}) {
  if (scenario.sourceType === "dc_supply") {
    return (
      <div className="flex min-h-[210px] items-center justify-center">
        <DCPowerSupply12V width={290} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[210px] items-center justify-center">
      <Battery9V width={145} height={238} />
    </div>
  );
}

function ProbeChip({
  active,
  label,
  onClick,
  tone,
}: {
  active: boolean;
  label: "BLACK" | "RED";
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

function TerminalNode({
  activeBlack,
  activeRed,
  label,
  onSelectBlack,
  onSelectRed,
  role,
}: {
  activeBlack: boolean;
  activeRed: boolean;
  label: string;
  onSelectBlack: () => void;
  onSelectRed: () => void;
  role: PolarityTerminalRole;
}) {
  const styles = getRoleStyles(role);

  return (
    <div className="flex min-w-[148px] flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <ProbeChip active={activeRed} label="RED" onClick={onSelectRed} tone="red" />
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${activeRed || activeBlack ? "ring-4 ring-emerald-100" : ""}`}
        >
          {role === "ground" ? "G" : role === "positive" ? "+" : "-"}
        </div>
        <ProbeChip active={activeBlack} label="BLACK" onClick={onSelectBlack} tone="black" />
      </div>
      <p className={`text-[11px] font-bold ${styles.text}`}>{label}</p>
      <div className="inline-flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${styles.role}`}>
          {role}
        </span>
      </div>
    </div>
  );
}

function PolarityBoard({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
}: {
  blackProbeTarget: PolarityProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: PolarityProbeTargetId | null;
  scenario: PolarityAndGroundScenario;
  setProbeTarget: (probe: "red" | "black", target: PolarityProbeTargetId) => void;
}) {
  const tone = getToneClasses(scenario.tone);

  return (
    <div className={`rounded-[24px] border p-4 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Source Board
          </p>
          <h4 className="mt-2 text-[1.05rem] font-black tracking-tight text-slate-950">
            Polarity and Ground View
          </h4>
        </div>
        <button
          type="button"
          onClick={clearProbeTargets}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300"
        >
          Clear Probes
        </button>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/80 bg-white/75 p-4">
        <SourcePreview scenario={scenario} />

        <div className="relative mt-5 rounded-[18px] border border-slate-100 bg-white/80 px-5 py-6">
          <div className={`absolute left-[20%] right-[20%] top-[48%] h-[4px] -translate-y-1/2 rounded-full ${tone.line}`} />

          <div className="relative flex items-start justify-between gap-6">
            {scenario.terminals.map((terminal) => (
              <TerminalNode
                key={terminal.id}
                activeBlack={blackProbeTarget === terminal.id}
                activeRed={redProbeTarget === terminal.id}
                label={terminal.label}
                onSelectBlack={() => setProbeTarget("black", terminal.id)}
                onSelectRed={() => setProbeTarget("red", terminal.id)}
                role={terminal.role}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PolarityAndGroundInteractiveSimulation() {
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

  const polarityScenario = usePolarityAndGroundScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(polarityScenario.status);

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (polarityScenario.status === "solved") {
      return {
        ...validation,
        isSetupCorrect: true,
        message: polarityScenario.guidance.message,
        severity: "ok",
      };
    }

    const severity =
      polarityScenario.status === "wrong_lead_setup" ||
      polarityScenario.status === "wrong_dial_family"
        ? "danger"
        : "warning";

    return {
      ...validation,
      isSetupCorrect: false,
      message: polarityScenario.guidance.message,
      severity,
    };
  }, [polarityScenario.guidance.message, polarityScenario.status, validation]);

  function applyRecommendedSetup() {
    setLeadJack("black", polarityScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", polarityScenario.scenario.expectedRedLeadJack);
    setDialStop(polarityScenario.scenario.preferredDialStopIds[0]);
  }

  function resetLessonPolarityTrainer() {
    resetToSafeDefault();
    polarityScenario.selectScenario(polarityAndGroundScenarios[0].id);
    polarityScenario.clearProbeTargets();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Polarity and Ground Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Polarity and Ground
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Learn how positive, negative, and ground reference points affect the DC reading on the meter.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Positive Lead
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              Red usually goes to the positive point when you want a positive DC reading.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
              Ground Reference
            </p>
            <p className="mt-2 text-[15px] leading-6 text-sky-950">
              Black normally stays on the ground or reference point to measure other DC nodes against it.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
              Negative Sign
            </p>
            <p className="mt-2 text-[15px] leading-6 text-amber-950">
              A negative reading means the polarity is reversed compared with the meter lead direction.
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
                  {polarityScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {polarityScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Step</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {polarityScenario.scenarioIndex + 1}/{polarityScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">DCV</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Target</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {polarityScenario.scenario.expectedDisplayValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {polarityAndGroundScenarios.map((scenario) => {
                const tone = getToneClasses(scenario.tone);

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => polarityScenario.selectScenario(scenario.id)}
                    className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                      polarityScenario.scenario.id === scenario.id
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Expected Family</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">DCV</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Required Jacks</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {formatExpectedJack(polarityScenario.scenario.expectedBlackLeadJack)} + {formatExpectedJack(polarityScenario.scenario.expectedRedLeadJack)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Normal Display</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{polarityScenario.scenario.expectedDisplayValue}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reversed Display</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{polarityScenario.scenario.reverseDisplayValue}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Safety Hint</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {polarityScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {polarityScenario.guidance.title}
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
            <PolarityBoard
              blackProbeTarget={polarityScenario.blackProbeTarget}
              clearProbeTargets={polarityScenario.clearProbeTargets}
              redProbeTarget={polarityScenario.redProbeTarget}
              scenario={polarityScenario.scenario}
              setProbeTarget={polarityScenario.setProbeTarget}
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Polarity Coach
              </p>
              <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                Reading Board
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {polarityScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Scenario Guide
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {polarityScenario.guidance.message}
                  </p>
                </div>
              </div>

              {polarityScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {polarityScenario.mistakeBadges.map((badge) => (
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
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Mission Checklist
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {polarityScenario.guidance.checklist.map((item) => (
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
            Open Full Multimeter Trainer
          </summary>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            Use the full multimeter trainer below to practice DCV setup while learning polarity and ground reference.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={polarityScenario.measuredDisplayValue}
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
              resetToSafeDefault={resetLessonPolarityTrainer}
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
