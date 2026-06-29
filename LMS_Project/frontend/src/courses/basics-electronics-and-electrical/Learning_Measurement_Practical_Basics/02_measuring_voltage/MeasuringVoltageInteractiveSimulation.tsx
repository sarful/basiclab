"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import MeasuringVoltageIntro from "./components/MeasuringVoltageIntro";
import VoltageScenarioMissionCard from "./components/VoltageScenarioMissionCard";
import VoltageScenarioTerminalDiagram from "./components/VoltageScenarioTerminalDiagram";
import { measuringVoltageScenarios } from "./measuringVoltageScenarios";
import { useMeasuringVoltageScenario } from "./useMeasuringVoltageScenario";

const OMEGA = "\u03a9";

function formatExpectedJack(label: string) {
  if (label === "jack_com") return "COM";
  if (label === "jack_voma") return `V${OMEGA}mA`;
  if (label === "jack_10a") return "10A";

  return label;
}

function formatDialFamilyLabel(family: "ac_voltage" | "dc_voltage") {
  return family === "ac_voltage" ? "ACV" : "DCV";
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

export default function MeasuringVoltageInteractiveSimulation() {
  const [viewMode, setViewMode] =
    useState<DigitalMultimeterCanvasSizeMode>("fit");
  const celebratedScenarioIdRef = useRef<string | null>(null);
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

  const voltageScenario = useMeasuringVoltageScenario({
    blackLeadJack,
    redLeadJack,
    selectedDialStopId,
  });

  const scenarioStyles = getScenarioStatusStyles(voltageScenario.status);
  const expectedJacksLabel = `${formatExpectedJack(
    voltageScenario.scenario.expectedBlackLeadJack,
  )} + ${formatExpectedJack(voltageScenario.scenario.expectedRedLeadJack)}`;
  const expectedDialFamilyLabel = formatDialFamilyLabel(
    voltageScenario.scenario.expectedDialFamily,
  );

  const lessonValidation = useMemo<MultimeterModeValidation>(() => {
    if (!validation.isSetupCorrect) return validation;

    if (!voltageScenario.isDialFamilyCorrect) {
      return {
        ...validation,
        isSetupCorrect: false,
        message: voltageScenario.guidance.message,
        severity: "danger",
      };
    }

    if (!voltageScenario.areProbesPlaced) {
      return {
        ...validation,
        isSetupCorrect: false,
        message: voltageScenario.guidance.message,
        severity: "warning",
      };
    }

    if (
      voltageScenario.isAcrossCorrectTerminals ||
      voltageScenario.isPolarityReversed
    ) {
      return {
        ...validation,
        isSetupCorrect: true,
        message: voltageScenario.guidance.message,
        severity: "ok",
      };
    }

    return {
      ...validation,
      isSetupCorrect: false,
      message: voltageScenario.guidance.message,
      severity: "warning",
    };
  }, [validation, voltageScenario]);

  function applyRecommendedSetup() {
    const preferredDialStopId =
      voltageScenario.scenario.preferredDialStopIds[0] ?? selectedDialStopId;

    setLeadJack("black", voltageScenario.scenario.expectedBlackLeadJack);
    setLeadJack("red", voltageScenario.scenario.expectedRedLeadJack);
    setDialStop(preferredDialStopId);
  }

  function resetLessonVoltageTrainer() {
    resetToSafeDefault();
    voltageScenario.resetProgress();
    celebratedScenarioIdRef.current = null;
  }

  useEffect(() => {
    if (!voltageScenario.isCelebrationReady) return;
    if (celebratedScenarioIdRef.current === voltageScenario.scenario.id) return;

    celebratedScenarioIdRef.current = voltageScenario.scenario.id;

    if (typeof window === "undefined" || !("AudioContext" in window)) return;

    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      980,
      audioContext.currentTime + 0.12,
    );
    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.03,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.22,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.24);

    oscillator.onended = () => {
      void audioContext.close();
    };
  }, [voltageScenario.isCelebrationReady, voltageScenario.scenario.id]);

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <MeasuringVoltageIntro />

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <VoltageScenarioMissionCard
            completedScenarioCount={voltageScenario.completedScenarioCount}
            completedScenarioIds={voltageScenario.completedScenarioIds}
            expectedDialFamilyLabel={expectedDialFamilyLabel}
            expectedJacksLabel={expectedJacksLabel}
            nextBestAction={voltageScenario.guidance.title}
            onApplyRecommendedSetup={applyRecommendedSetup}
            onSelectScenario={voltageScenario.selectScenario}
            scenarios={measuringVoltageScenarios}
            scenario={voltageScenario.scenario}
            scenarioCount={voltageScenario.scenarioCount}
            scenarioIndex={voltageScenario.scenarioIndex}
            scenarioStyles={scenarioStyles}
            scorePercent={voltageScenario.scorePercent}
            successVisible={
              voltageScenario.isCelebrationReady ||
              voltageScenario.isScenarioCompleted
            }
          />

          <div className="space-y-4">
            <VoltageScenarioTerminalDiagram
              blackProbeTarget={voltageScenario.blackProbeTarget}
              redProbeTarget={voltageScenario.redProbeTarget}
              scenario={voltageScenario.scenario}
              setBlackProbeTarget={voltageScenario.setBlackProbeTarget}
              setRedProbeTarget={voltageScenario.setRedProbeTarget}
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Probe Status
                  </p>
                  <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
                    Voltage Reading Board
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={voltageScenario.resetScenario}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300"
                >
                  Clear Probes
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Live LCD
                  </p>
                  <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
                    {voltageScenario.measuredDisplayValue}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Scenario Guide
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-700">
                    {voltageScenario.areProbesPlaced
                      ? voltageScenario.guidance.message
                      : "Set the correct dial family and place the probes across two source terminals to begin the reading."}
                  </p>
                </div>
              </div>

              {voltageScenario.mistakeBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {voltageScenario.mistakeBadges.map((badge) => (
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
                Complete each scenario with the correct mode, jack setup, and
                probe placement.
              </p>
            </div>
            <button
              type="button"
              onClick={voltageScenario.resetProgress}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300"
            >
              Reset Progress
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {voltageScenario.guidance.checklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <details className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer list-none text-[14px] font-black tracking-tight text-slate-900">
            Open Full Multimeter Trainer
          </summary>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            Use the full trainer only when you want manual dial and jack control
            beyond the compact voltage mission area above.
          </p>
          <div className="mt-4">
            <DigitalMultimeterTrainerControls
              blackLeadJack={blackLeadJack}
              canvas={
                <DigitalMultimeterCanvas
                  blackLeadJack={blackLeadJack}
                  displayValue={voltageScenario.measuredDisplayValue}
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
              resetToSafeDefault={resetLessonVoltageTrainer}
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
