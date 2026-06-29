"use client";

import { useMemo, useState } from "react";

import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import { measuringCurrentScenarios } from "./measuringCurrentScenarios";
import { useMeasuringCurrentScenario } from "./useMeasuringCurrentScenario";
import CurrentScenarioMissionCard from "./components/CurrentScenarioMissionCard";
import CurrentSeriesWorkbench from "./components/CurrentSeriesWorkbench";
import CurrentSetupCoach from "./components/CurrentSetupCoach";
import MeasuringCurrentIntro from "./components/MeasuringCurrentIntro";

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
        <MeasuringCurrentIntro />

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <CurrentScenarioMissionCard
            expectedJackLabel={formatExpectedJack(
              currentScenario.scenario.expectedRedLeadJack,
            )}
            onApplyRecommendedSetup={applyRecommendedSetup}
            onSelectScenario={currentScenario.selectScenario}
            scenario={currentScenario.scenario}
            scenarioCount={currentScenario.scenarioCount}
            scenarioIndex={currentScenario.scenarioIndex}
            scenarioStyles={scenarioStyles}
            scenarios={measuringCurrentScenarios}
          />

          <div className="space-y-4">
            <CurrentSeriesWorkbench
              blackProbeTarget={currentScenario.blackProbeTarget}
              clearProbeTargets={currentScenario.clearProbeTargets}
              redProbeTarget={currentScenario.redProbeTarget}
              scenario={currentScenario.scenario}
              setProbeTarget={currentScenario.setProbeTarget}
            />

            <CurrentSetupCoach
              guidanceMessage={currentScenario.guidance.message}
              measuredDisplayValue={currentScenario.measuredDisplayValue}
              mistakeBadges={currentScenario.mistakeBadges}
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
