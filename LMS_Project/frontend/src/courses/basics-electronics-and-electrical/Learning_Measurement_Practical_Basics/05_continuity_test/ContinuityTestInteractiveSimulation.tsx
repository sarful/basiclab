"use client";

import { useMemo, useState } from "react";

import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import { continuityTestScenarios, type ContinuityTestScenario } from "./continuityTestScenarios";
import { useContinuityTestScenario } from "./useContinuityTestScenario";
import ContinuityScenarioMissionCard from "./components/ContinuityScenarioMissionCard";
import ContinuitySetupCoach from "./components/ContinuitySetupCoach";
import ContinuityTestIntro from "./components/ContinuityTestIntro";
import ContinuityWorkbench from "./components/ContinuityWorkbench";

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
        board:
          "border-rose-200 bg-[linear-gradient(180deg,#fff3f5_0%,#ffffff_100%)]",
        chip: "border-rose-300 bg-rose-50 text-rose-800",
        path: "bg-rose-400",
        helper: "border-rose-100 bg-rose-50/60",
      };
    case "sky":
      return {
        accent: "bg-sky-500",
        board:
          "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
        chip: "border-sky-300 bg-sky-50 text-sky-800",
        path: "bg-sky-400",
        helper: "border-sky-100 bg-sky-50/60",
      };
    default:
      return {
        accent: "bg-emerald-500",
        board:
          "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
        chip: "border-emerald-300 bg-emerald-50 text-emerald-800",
        path: "bg-emerald-400",
        helper: "border-emerald-100 bg-emerald-50/60",
      };
  }
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
  const toneClasses = getToneClasses(continuityScenario.scenario.tone);

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
        <ContinuityTestIntro />

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
          <ContinuityScenarioMissionCard
            onApplyRecommendedSetup={applyRecommendedSetup}
            onScenarioToneClass={(tone) => getToneClasses(tone).chip}
            onSelectScenario={continuityScenario.selectScenario}
            scenario={continuityScenario.scenario}
            scenarioCount={continuityScenario.scenarioCount}
            scenarioIndex={continuityScenario.scenarioIndex}
            scenarioStyles={scenarioStyles}
            scenarios={continuityTestScenarios}
          />

          <div className="space-y-4">
            <ContinuityWorkbench
              blackProbeTarget={continuityScenario.blackProbeTarget}
              clearProbeTargets={continuityScenario.clearProbeTargets}
              continuityDetected={continuityScenario.continuityDetected}
              redProbeTarget={continuityScenario.redProbeTarget}
              scenario={continuityScenario.scenario}
              setProbeTarget={continuityScenario.setProbeTarget}
              tone={toneClasses}
            />

            <ContinuitySetupCoach
              continuityDetected={continuityScenario.continuityDetected}
              guidanceMessage={continuityScenario.guidance.message}
              measuredDisplayValue={continuityScenario.measuredDisplayValue}
              mistakeBadges={continuityScenario.mistakeBadges}
              solved={continuityScenario.status === "solved"}
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
