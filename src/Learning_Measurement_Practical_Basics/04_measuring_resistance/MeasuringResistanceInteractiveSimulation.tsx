"use client";

import { useMemo, useState } from "react";

import { ResistorSymbol } from "../../library";
import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  measuringResistanceScenarios,
  type MeasuringResistanceScenario,
  type ResistanceProbeTargetId,
} from "./measuringResistanceScenarios";
import { useMeasuringResistanceScenario } from "./useMeasuringResistanceScenario";

const OMEGA = "\u03a9";

function formatExpectedJack(label: string) {
  if (label === "jack_com") return "COM";
  if (label === "jack_voma") return `V${OMEGA}mA`;
  if (label === "jack_10a") return "10A";
  return label;
}

function getScenarioStatusStyles(status: string) {
  switch (status) {
    case "solved":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "border-emerald-200 bg-emerald-50",
        label: "Resistance Ready",
      };
    case "wrong_jack":
    case "wrong_dial_family":
    case "same_node":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        card: "border-rose-200 bg-rose-50",
        label: "Fix Setup",
      };
    case "wrong_range":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        card: "border-amber-200 bg-amber-50",
        label: "Tune Range",
      };
    default:
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        card: "border-sky-200 bg-sky-50",
        label: "Place Probes",
      };
  }
}

function getResistanceTone(color: string) {
  if (color === "#0ea5e9") {
    return {
      accent: "bg-sky-500",
      board: "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
      chip: "border-sky-300 bg-sky-50 text-sky-800",
      helper: "border-sky-100 bg-sky-50/60",
      line: "bg-sky-400",
      role: "text-sky-700",
      symbolWrap: "border-sky-100 bg-white shadow-[0_12px_24px_rgba(14,165,233,0.10)]",
    };
  }

  if (color === "#22c55e") {
    return {
      accent: "bg-emerald-500",
      board: "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
      chip: "border-emerald-300 bg-emerald-50 text-emerald-800",
      helper: "border-emerald-100 bg-emerald-50/60",
      line: "bg-emerald-400",
      role: "text-emerald-700",
      symbolWrap: "border-emerald-100 bg-white shadow-[0_12px_24px_rgba(34,197,94,0.10)]",
    };
  }

  return {
    accent: "bg-amber-500",
    board: "border-amber-200 bg-[linear-gradient(180deg,#fff9ef_0%,#ffffff_100%)]",
    chip: "border-amber-300 bg-amber-50 text-amber-800",
    helper: "border-amber-100 bg-amber-50/60",
    line: "bg-amber-400",
    role: "text-amber-700",
    symbolWrap: "border-amber-100 bg-white shadow-[0_12px_24px_rgba(245,158,11,0.10)]",
  };
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
    <div className={`flex min-w-[132px] flex-col ${align === "left" ? "items-start" : "items-end"}`}>
      <div className={`flex items-center gap-2 ${align === "left" ? "" : "flex-row-reverse"}`}>
        <ProbeChip active={activeRed} label="RED" onClick={onSelectRed} tone="red" />
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${activeRed || activeBlack ? "ring-4 ring-amber-100" : ""}`}
        >
          {align === "left" ? "L" : "R"}
        </div>
        <ProbeChip active={activeBlack} label="BLACK" onClick={onSelectBlack} tone="black" />
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-slate-500">
        {align === "left" ? "Left resistor lead" : "Right resistor lead"}
      </p>
    </div>
  );
}

function ResistanceBoard({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
}: {
  blackProbeTarget: ResistanceProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: ResistanceProbeTargetId | null;
  scenario: MeasuringResistanceScenario;
  setProbeTarget: (
    probe: "red" | "black",
    target: ResistanceProbeTargetId,
  ) => void;
}) {
  const tone = getResistanceTone(scenario.targetColor);

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
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${tone.chip}`}>
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
        <div className={`flex min-h-[196px] items-center justify-center rounded-[20px] border px-4 py-4 ${tone.symbolWrap}`}>
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
              <div className={`rounded-full border border-dashed bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${tone.chip}`}>
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
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${tone.role}`}>
              Left Terminal
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Touch one resistor lead only. Do not place both probes on the same side.
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${tone.role}`}>
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

export default function MeasuringResistanceInteractiveSimulation() {
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

  const resistanceScenario = useMeasuringResistanceScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(resistanceScenario.status);

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (resistanceScenario.status === "solved") {
      return {
        ...validation,
        isSetupCorrect: true,
        message: resistanceScenario.guidance.message,
        severity: "ok",
      };
    }

    const severity =
      resistanceScenario.status === "wrong_jack" ||
      resistanceScenario.status === "wrong_dial_family" ||
      resistanceScenario.status === "same_node"
        ? "danger"
        : "warning";

    return {
      ...validation,
      isSetupCorrect: false,
      message: resistanceScenario.guidance.message,
      severity,
    };
  }, [resistanceScenario.guidance.message, resistanceScenario.status, validation]);

  function applyRecommendedSetup() {
    setLeadJack("black", resistanceScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", resistanceScenario.scenario.expectedRedLeadJack);
    setDialStop(resistanceScenario.scenario.preferredDialStopIds[0]);
  }

  function resetLessonResistanceTrainer() {
    resetToSafeDefault();
    resistanceScenario.selectScenario(measuringResistanceScenarios[0].id);
    resistanceScenario.clearProbeTargets();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Measuring Resistance Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Safe Resistance Measurement
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Learn how to switch to the ohms family, keep the meter unpowered, and
          place the probes across a resistor to read its value correctly.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
              Ohms Rule
            </p>
            <p className="mt-2 text-[15px] leading-6 text-amber-950">
              Measure resistance across the component, not along the same node.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Black Lead
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              Keep the black lead in COM for resistance practice.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
              Red Lead
            </p>
            <p className="mt-2 text-[15px] leading-6 text-sky-950">
              Use VΩmA for Ω ranges and never measure resistance on a live circuit.
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
                  {resistanceScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {resistanceScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Step</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {resistanceScenario.scenarioIndex + 1}/{resistanceScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">Ω</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Reading</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {resistanceScenario.scenario.expectedDisplayValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {measuringResistanceScenarios.map((scenario) => {
                const tone = getResistanceTone(scenario.targetColor);

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => resistanceScenario.selectScenario(scenario.id)}
                    className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                      resistanceScenario.scenario.id === scenario.id
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Component</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{resistanceScenario.scenario.resistanceLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Expected Family</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">Ω</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Preferred Range</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {resistanceScenario.scenario.preferredDialStopIds.join(", ")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Required Jacks</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  COM + {formatExpectedJack(resistanceScenario.scenario.expectedRedLeadJack)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Safety Hint</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {resistanceScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {resistanceScenario.guidance.title}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyRecommendedSetup}
                className="rounded-xl border border-amber-300 bg-amber-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-amber-600"
              >
                Apply Recommended Setup
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <ResistanceBoard
              blackProbeTarget={resistanceScenario.blackProbeTarget}
              clearProbeTargets={resistanceScenario.clearProbeTargets}
              redProbeTarget={resistanceScenario.redProbeTarget}
              scenario={resistanceScenario.scenario}
              setProbeTarget={resistanceScenario.setProbeTarget}
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Setup Coach
              </p>
              <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                Resistance Reading Board
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {resistanceScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Scenario Guide
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {resistanceScenario.guidance.message}
                  </p>
                </div>
              </div>

              {resistanceScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {resistanceScenario.mistakeBadges.map((badge) => (
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
                Set the meter to Ω, keep the circuit unpowered, and place one probe on each resistor terminal.
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {resistanceScenario.guidance.checklist.map((item) => (
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
            Open Resistance Trainer
          </summary>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            Use the full multimeter trainer below to practice Ω dial positions and jack placement.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={resistanceScenario.measuredDisplayValue}
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
              resetToSafeDefault={resetLessonResistanceTrainer}
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
