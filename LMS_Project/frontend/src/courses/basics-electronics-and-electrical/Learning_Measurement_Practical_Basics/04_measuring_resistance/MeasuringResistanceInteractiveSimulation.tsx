"use client";

import { useMemo, useState } from "react";

import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import { measuringResistanceScenarios } from "./measuringResistanceScenarios";
import { useMeasuringResistanceScenario } from "./useMeasuringResistanceScenario";
import MeasuringResistanceIntro from "./components/MeasuringResistanceIntro";
import ResistanceScenarioMissionCard from "./components/ResistanceScenarioMissionCard";
import ResistanceSetupCoach from "./components/ResistanceSetupCoach";
import ResistanceWorkbench from "./components/ResistanceWorkbench";

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
      board:
        "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
      chip: "border-sky-300 bg-sky-50 text-sky-800",
      helper: "border-sky-100 bg-sky-50/60",
      line: "bg-sky-400",
      role: "text-sky-700",
      symbolWrap:
        "border-sky-100 bg-white shadow-[0_12px_24px_rgba(14,165,233,0.10)]",
    };
  }

  if (color === "#22c55e") {
    return {
      accent: "bg-emerald-500",
      board:
        "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
      chip: "border-emerald-300 bg-emerald-50 text-emerald-800",
      helper: "border-emerald-100 bg-emerald-50/60",
      line: "bg-emerald-400",
      role: "text-emerald-700",
      symbolWrap:
        "border-emerald-100 bg-white shadow-[0_12px_24px_rgba(34,197,94,0.10)]",
    };
  }

  return {
    accent: "bg-amber-500",
    board:
      "border-amber-200 bg-[linear-gradient(180deg,#fff9ef_0%,#ffffff_100%)]",
    chip: "border-amber-300 bg-amber-50 text-amber-800",
    helper: "border-amber-100 bg-amber-50/60",
    line: "bg-amber-400",
    role: "text-amber-700",
    symbolWrap:
      "border-amber-100 bg-white shadow-[0_12px_24px_rgba(245,158,11,0.10)]",
  };
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
  const resistanceTone = getResistanceTone(
    resistanceScenario.scenario.targetColor,
  );

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
  }, [
    resistanceScenario.guidance.message,
    resistanceScenario.status,
    validation,
  ]);

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
        <MeasuringResistanceIntro />

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
          <ResistanceScenarioMissionCard
            expectedJackLabel={formatExpectedJack(
              resistanceScenario.scenario.expectedRedLeadJack,
            )}
            onApplyRecommendedSetup={applyRecommendedSetup}
            onSelectScenario={resistanceScenario.selectScenario}
            onScenarioToneClass={(color) => getResistanceTone(color).chip}
            scenario={resistanceScenario.scenario}
            scenarioCount={resistanceScenario.scenarioCount}
            scenarioIndex={resistanceScenario.scenarioIndex}
            scenarioStyles={scenarioStyles}
            scenarios={measuringResistanceScenarios}
          />

          <div className="space-y-4">
            <ResistanceWorkbench
              blackProbeTarget={resistanceScenario.blackProbeTarget}
              clearProbeTargets={resistanceScenario.clearProbeTargets}
              redProbeTarget={resistanceScenario.redProbeTarget}
              scenario={resistanceScenario.scenario}
              setProbeTarget={resistanceScenario.setProbeTarget}
              tone={resistanceTone}
            />

            <ResistanceSetupCoach
              guidanceMessage={resistanceScenario.guidance.message}
              measuredDisplayValue={resistanceScenario.measuredDisplayValue}
              mistakeBadges={resistanceScenario.mistakeBadges}
            />
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Mission Checklist
              </p>
              <p className="mt-2 text-[14px] leading-6 text-slate-700">
                Set the meter to {"\u03a9"}, keep the circuit unpowered, and place one probe on each resistor terminal.
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
            Use the full multimeter trainer below to practice {"\u03a9"} dial positions and jack placement.
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
