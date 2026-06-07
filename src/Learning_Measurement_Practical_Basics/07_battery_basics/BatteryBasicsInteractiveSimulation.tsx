"use client";

import { useMemo, useState } from "react";

import { Battery9V } from "../../library";
import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  batteryBasicsScenarios,
  batteryRequiredJacksLabel,
  type BatteryBasicsScenario,
  type BatteryHealth,
  type BatteryProbeTargetId,
} from "./batteryBasicsScenarios";
import { useBatteryBasicsScenario } from "./useBatteryBasicsScenario";

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

function getToneClasses(tone: BatteryBasicsScenario["tone"]) {
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

function getHealthBadge(health: BatteryHealth) {
  switch (health) {
    case "fresh":
      return "Healthy";
    case "low":
      return "Weak";
    default:
      return "Reversed";
  }
}

function getHealthStyles(health: BatteryHealth) {
  switch (health) {
    case "fresh":
      return {
        glow: "shadow-[0_18px_38px_rgba(16,185,129,0.18)]",
        pill: "border-emerald-300 bg-emerald-50 text-emerald-800",
        ring: "ring-emerald-100",
        status: "Battery looks healthy for this training example.",
      };
    case "low":
      return {
        glow: "shadow-[0_18px_38px_rgba(245,158,11,0.22)]",
        pill: "animate-pulse border-amber-300 bg-amber-50 text-amber-800 shadow-[0_0_0_8px_rgba(245,158,11,0.10)]",
        ring: "ring-amber-100",
        status: "Low-battery warning: reading is lower than a healthy 9V battery.",
      };
    default:
      return {
        glow: "shadow-[0_18px_38px_rgba(59,130,246,0.18)]",
        pill: "border-sky-300 bg-sky-50 text-sky-800",
        ring: "ring-sky-100",
        status: "Polarity demo: the sign changes because probe direction is reversed.",
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

function BatteryTerminalNode({
  activeBlack,
  activeRed,
  isPositive,
  label,
  onSelectBlack,
  onSelectRed,
}: {
  activeBlack: boolean;
  activeRed: boolean;
  isPositive: boolean;
  label: string;
  onSelectBlack: () => void;
  onSelectRed: () => void;
}) {
  return (
    <div className="flex min-w-[148px] flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <ProbeChip active={activeRed} label="RED" onClick={onSelectRed} tone="red" />
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${activeRed || activeBlack ? "ring-4 ring-emerald-100" : ""}`}
        >
          {isPositive ? "+" : "-"}
        </div>
        <ProbeChip active={activeBlack} label="BLACK" onClick={onSelectBlack} tone="black" />
      </div>
      <p className={`text-[11px] font-bold ${isPositive ? "text-emerald-700" : "text-rose-700"}`}>
        {label}
      </p>
      <div className="inline-flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {isPositive ? "Positive" : "Negative"}
        </span>
      </div>
    </div>
  );
}

function BatteryBoard({
  blackProbeTarget,
  clearProbeTargets,
  redProbeTarget,
  scenario,
  setProbeTarget,
}: {
  blackProbeTarget: BatteryProbeTargetId | null;
  clearProbeTargets: () => void;
  redProbeTarget: BatteryProbeTargetId | null;
  scenario: BatteryBasicsScenario;
  setProbeTarget: (probe: "red" | "black", target: BatteryProbeTargetId) => void;
}) {
  const tone = getToneClasses(scenario.tone);
  const healthStyles = getHealthStyles(scenario.health);

  return (
    <div className={`rounded-[24px] border p-4 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Battery Practice Board
          </p>
          <h4 className="mt-2 text-[1.05rem] font-black tracking-tight text-slate-950">
            Battery Terminals and Health
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
        <div className={`rounded-[20px] border border-white/90 bg-white/90 px-4 py-5 ${healthStyles.glow}`}>
          <div className="flex min-h-[228px] items-center justify-center">
            <Battery9V width={148} height={244} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${healthStyles.pill}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${tone.accent}`} />
            Battery State: {getHealthBadge(scenario.health)}
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold ${tone.chip}`}>
            {scenario.health === "low"
              ? "Lower than a healthy 9V target"
              : scenario.health === "fresh"
                ? "Full-strength training example"
                : "Negative sign learning example"}
          </div>
        </div>

        <div className={`mt-4 rounded-2xl border px-4 py-3 ${tone.helper}`}>
          <p className="text-[11px] font-semibold text-slate-700">
            {healthStyles.status}
          </p>
        </div>

        <div className="relative mt-5 rounded-[18px] border border-slate-100 bg-white/80 px-6 py-7">
          <div className={`absolute left-[22%] right-[22%] top-[48%] h-[4px] -translate-y-1/2 rounded-full ${tone.line}`} />

          <div className="relative flex items-start justify-between gap-8">
            <BatteryTerminalNode
              activeBlack={blackProbeTarget === "battery_positive"}
              activeRed={redProbeTarget === "battery_positive"}
              isPositive
              label="Battery +"
              onSelectBlack={() => setProbeTarget("black", "battery_positive")}
              onSelectRed={() => setProbeTarget("red", "battery_positive")}
            />
            <BatteryTerminalNode
              activeBlack={blackProbeTarget === "battery_negative"}
              activeRed={redProbeTarget === "battery_negative"}
              isPositive={false}
              label="Battery -"
              onSelectBlack={() => setProbeTarget("black", "battery_negative")}
              onSelectRed={() => setProbeTarget("red", "battery_negative")}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              Positive Terminal
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put the red probe here for a normal positive battery reading.
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${tone.helper}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              Negative Terminal
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put the black probe here to complete the battery voltage check.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BatteryBasicsInteractiveSimulation() {
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

  const batteryScenario = useBatteryBasicsScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(batteryScenario.status);

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (batteryScenario.status === "solved") {
      return {
        ...validation,
        isSetupCorrect: true,
        message: batteryScenario.guidance.message,
        severity: "ok",
      };
    }

    const severity =
      batteryScenario.status === "wrong_lead_setup" ||
      batteryScenario.status === "wrong_dial_family"
        ? "danger"
        : "warning";

    return {
      ...validation,
      isSetupCorrect: false,
      message: batteryScenario.guidance.message,
      severity,
    };
  }, [batteryScenario.guidance.message, batteryScenario.status, validation]);

  function applyRecommendedSetup() {
    setLeadJack("black", batteryScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", batteryScenario.scenario.expectedRedLeadJack);
    setDialStop(batteryScenario.scenario.preferredDialStopIds[0]);
  }

  function resetLessonBatteryTrainer() {
    resetToSafeDefault();
    batteryScenario.selectScenario(batteryBasicsScenarios[0].id);
    batteryScenario.clearProbeTargets();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Battery Basics Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Battery Basics
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Learn battery polarity, healthy vs weak readings, and how probe direction changes the sign of a DC measurement.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Positive Terminal
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              The battery positive terminal is where the red probe normally goes for a positive reading.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
              Negative Terminal
            </p>
            <p className="mt-2 text-[15px] leading-6 text-rose-950">
              The black probe usually goes to the battery negative terminal to complete the DC measurement.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
              Battery Health
            </p>
            <p className="mt-2 text-[15px] leading-6 text-sky-950">
              A lower-than-expected voltage suggests the battery is weak, even if polarity is correct.
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
                  {batteryScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {batteryScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Step</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {batteryScenario.scenarioIndex + 1}/{batteryScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">DCV</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Target</p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {batteryScenario.scenario.expectedDisplayValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {batteryBasicsScenarios.map((scenario) => {
                const tone = getToneClasses(scenario.tone);

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => batteryScenario.selectScenario(scenario.id)}
                    className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                      batteryScenario.scenario.id === scenario.id
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
                <p className="mt-2 text-[14px] font-bold text-slate-900">{batteryRequiredJacksLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Expected Reading</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{batteryScenario.scenario.expectedDisplayValue}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Battery State</p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">{getHealthBadge(batteryScenario.scenario.health)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Safety Hint</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {batteryScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {batteryScenario.guidance.title}
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
            <BatteryBoard
              blackProbeTarget={batteryScenario.blackProbeTarget}
              clearProbeTargets={batteryScenario.clearProbeTargets}
              redProbeTarget={batteryScenario.redProbeTarget}
              scenario={batteryScenario.scenario}
              setProbeTarget={batteryScenario.setProbeTarget}
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Battery Coach
              </p>
              <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                Battery Reading Board
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {batteryScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Scenario Guide
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {batteryScenario.guidance.message}
                  </p>
                </div>
              </div>

              {batteryScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {batteryScenario.mistakeBadges.map((badge) => (
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
            {batteryScenario.guidance.checklist.map((item) => (
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
            Use the full multimeter trainer below to practice battery readings with the shared multimeter library component.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={batteryScenario.measuredDisplayValue}
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
              resetToSafeDefault={resetLessonBatteryTrainer}
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
