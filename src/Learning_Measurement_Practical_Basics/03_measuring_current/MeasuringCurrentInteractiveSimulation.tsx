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
  measuringCurrentScenarios,
  type MeasuringCurrentProbeTargetId,
  type MeasuringCurrentScenario,
} from "./measuringCurrentScenarios";
import { useMeasuringCurrentScenario } from "./useMeasuringCurrentScenario";

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
        label: "Series Current Ready",
      };
    case "wrong_jack":
    case "wrong_dial_family":
    case "same_node":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        card: "border-rose-200 bg-rose-50",
        label: "Fix Setup",
      };
    case "reversed_polarity":
    case "wrong_range":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        card: "border-amber-200 bg-amber-50",
        label: "Tune Placement",
      };
    default:
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        card: "border-sky-200 bg-sky-50",
        label: "Place Probes",
      };
  }
}

function ScenarioSourcePreview({ sourceType }: { sourceType: "dc_battery" | "dc_supply" }) {
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
    <div className={`flex min-w-[118px] flex-col ${align === "left" ? "items-start" : "items-end"} ${align === "right" ? "pr-2" : ""}`}>
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

export default function MeasuringCurrentInteractiveSimulation() {
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

  const currentScenario = useMeasuringCurrentScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(currentScenario.status);

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (currentScenario.status === "solved") {
      return {
        ...validation,
        isSetupCorrect: true,
        message: currentScenario.guidance.message,
        severity: "ok",
      };
    }

    const severity =
      currentScenario.status === "wrong_jack" ||
      currentScenario.status === "wrong_dial_family" ||
      currentScenario.status === "same_node"
        ? "danger"
        : "warning";

    return {
      ...validation,
      isSetupCorrect: false,
      message: currentScenario.guidance.message,
      severity,
    };
  }, [currentScenario.guidance.message, currentScenario.status, validation]);

  function applyRecommendedSetup() {
    setLeadJack("black", currentScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", currentScenario.scenario.expectedRedLeadJack);
    setDialStop(currentScenario.scenario.preferredDialStopIds[0]);
  }

  function resetLessonCurrentTrainer() {
    resetToSafeDefault();
    currentScenario.selectScenario(measuringCurrentScenarios[0].id);
    currentScenario.clearProbeTargets();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-orange-700">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Measuring Current Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Safe Current Measurement
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Learn how to choose DCA, move the red lead to the correct current jack,
          and place the meter across an open circuit so current flows through the meter.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-700">
              Current Rule
            </p>
            <p className="mt-2 text-[15px] leading-6 text-orange-950">
              Current must flow through the meter, so the meter goes in series.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Small Current
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              Use COM + VΩmA for small DCA ranges like 20mA and 200mA.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
              High Current
            </p>
            <p className="mt-2 text-[15px] leading-6 text-rose-950">
              Move the red lead to 10A only for high-current tests, then return it to VΩmA.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className={`rounded-[24px] border p-5 ${scenarioStyles.card}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${scenarioStyles.badge}`}
                >
                  {scenarioStyles.label}
                </div>
                <h3 className="mt-3 text-[1.35rem] font-black tracking-tight text-slate-950">
                  {currentScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {currentScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Step
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {currentScenario.scenarioIndex + 1}/{currentScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Jack
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {formatExpectedJack(currentScenario.scenario.expectedRedLeadJack)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Reading
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {currentScenario.scenario.expectedDisplayValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {measuringCurrentScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => currentScenario.selectScenario(scenario.id)}
                  className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                    currentScenario.scenario.id === scenario.id
                      ? "border-orange-300 bg-orange-50 text-orange-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Source Type
                </p>
                <p className="mt-2 text-[14px] font-bold capitalize text-slate-900">
                  {currentScenario.scenario.sourceType.replaceAll("_", " ")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Expected Family
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  DCA
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Preferred Range
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {currentScenario.scenario.preferredDialStopIds.join(", ")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Required Jacks
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  COM + {formatExpectedJack(currentScenario.scenario.expectedRedLeadJack)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Safety Hint
                </p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {currentScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Current Path Hint
                </p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {currentScenario.scenario.currentPathHint}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyRecommendedSetup}
                className="rounded-xl border border-orange-300 bg-orange-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-orange-600"
              >
                Apply Recommended Setup
              </button>
            </div>
          </div>

          <div className="space-y-4">
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
                <ScenarioSourcePreview sourceType={currentScenario.scenario.sourceType} />
              </div>
              <div className="mt-4">
                <CurrentSeriesPathBoard
                  blackProbeTarget={currentScenario.blackProbeTarget}
                  clearProbeTargets={currentScenario.clearProbeTargets}
                  redProbeTarget={currentScenario.redProbeTarget}
                  scenario={currentScenario.scenario}
                  setProbeTarget={currentScenario.setProbeTarget}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Setup Coach
              </p>
              <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                Current Reading Board
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {currentScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Scenario Guide
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {currentScenario.guidance.message}
                  </p>
                </div>
              </div>

              {currentScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentScenario.mistakeBadges.map((badge) => (
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
                Set the DCA family and correct jack first, then bridge the open series gap with red on the source side and black on the load side.
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {currentScenario.guidance.checklist.map((item) => (
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
            Open Current Trainer
          </summary>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            Use the full multimeter trainer below to practice DCA dial positions and current jack placement.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={currentScenario.measuredDisplayValue}
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
              resetToSafeDefault={resetLessonCurrentTrainer}
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
