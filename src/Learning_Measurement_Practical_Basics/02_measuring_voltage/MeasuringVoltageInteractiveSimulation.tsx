"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ACSocket220V,
  Battery9V,
  DCPowerSupply12V,
} from "../../library";
import {
  DigitalMultimeterCanvas,
  DigitalMultimeterTrainerControls,
  useMultimeterDial,
  type DigitalMultimeterCanvasSizeMode,
} from "../01_what_is_a_multimeter/image_to_component_workspace";
import type { MultimeterModeValidation } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  measuringVoltageScenarios,
  type MeasuringVoltageScenario,
  type VoltageProbeTargetId,
} from "./measuringVoltageScenarios";
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

function getDiagramTone(sourceType: string) {
  switch (sourceType) {
    case "dc_battery":
      return {
        accent: "bg-emerald-500",
        board:
          "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
        line: "bg-emerald-400",
        title: "Battery Circuit",
      };
    case "dc_supply":
      return {
        accent: "bg-sky-500",
        board:
          "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
        line: "bg-sky-400",
        title: "DC Supply Rails",
      };
    case "ac_source":
      return {
        accent: "bg-violet-500",
        board:
          "border-violet-200 bg-[linear-gradient(180deg,#f6f2ff_0%,#ffffff_100%)]",
        line: "bg-violet-400",
        title: "AC Terminals",
      };
    default:
      return {
        accent: "bg-amber-500",
        board:
          "border-amber-200 bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]",
        line: "bg-amber-400",
        title: "Voltage Practice Board",
      };
  }
}

function getTerminalPosition(index: number, count: number) {
  if (count === 2) {
    return index === 0
      ? { left: "24%", top: "48%" }
      : { left: "76%", top: "48%" };
  }

  if (count === 3) {
    return [
      { left: "18%", top: "56%" },
      { left: "50%", top: "28%" },
      { left: "82%", top: "56%" },
    ][index];
  }

  const step = 60 / Math.max(1, count - 1);

  return {
    left: `${20 + index * step}%`,
    top: "48%",
  };
}

function getTerminalRoleStyles(role: MeasuringVoltageScenario["terminals"][number]["role"]) {
  switch (role) {
    case "positive":
      return {
        accent: "text-emerald-700",
        role: "text-emerald-600",
      };
    case "negative":
      return {
        accent: "text-rose-700",
        role: "text-rose-600",
      };
    default:
      return {
        accent: "text-sky-700",
        role: "text-sky-600",
      };
  }
}

function ScenarioSourcePreview({
  scenario,
}: {
  scenario: MeasuringVoltageScenario;
}) {
  switch (scenario.id) {
    case "battery_9v_dc":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <Battery9V width={145} height={238} />
        </div>
      );
    case "dc_supply_12v":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <DCPowerSupply12V width={290} />
        </div>
      );
    case "ac_outlet_220v":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <ACSocket220V width={285} />
        </div>
      );
    default:
      return null;
  }
}

function ScenarioTerminalDiagram({
  blackProbeTarget,
  redProbeTarget,
  scenario,
  setBlackProbeTarget,
  setRedProbeTarget,
}: {
  blackProbeTarget: VoltageProbeTargetId | null;
  redProbeTarget: VoltageProbeTargetId | null;
  scenario: MeasuringVoltageScenario;
  setBlackProbeTarget: (target: VoltageProbeTargetId) => void;
  setRedProbeTarget: (target: VoltageProbeTargetId) => void;
}) {
  const tone = getDiagramTone(scenario.sourceType);
  const redIndex = scenario.terminals.findIndex(
    (terminal) => terminal.id === redProbeTarget,
  );
  const blackIndex = scenario.terminals.findIndex(
    (terminal) => terminal.id === blackProbeTarget,
  );

  return (
    <div className={`rounded-[24px] border p-4 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Visual Source
          </p>
          <h4 className="mt-2 text-[1.05rem] font-black tracking-tight text-slate-950">
            {tone.title}
          </h4>
        </div>
        <div className={`h-3 w-3 rounded-full ${tone.accent}`} />
      </div>

      <div className="mt-4 rounded-[22px] border border-white/80 bg-white/70 p-4">
        <ScenarioSourcePreview scenario={scenario} />

        <div className="relative mt-5 h-[208px] rounded-[18px] border border-slate-100 bg-white/75 px-6 py-6">
        <div
          className={`absolute left-[20%] right-[20%] top-[55%] h-[4px] -translate-y-1/2 rounded-full ${tone.line}`}
        />

        {redIndex >= 0 ? (
          <div
            className="absolute top-[18px] h-[4px] w-[76px] rounded-full bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.45)] transition-all duration-300"
            style={{
              left: `calc(${getTerminalPosition(
                redIndex,
                scenario.terminals.length,
              ).left} - 38px)`,
            }}
          />
        ) : null}

        {blackIndex >= 0 ? (
          <div
            className="absolute bottom-[18px] h-[4px] w-[76px] rounded-full bg-slate-500 shadow-[0_0_14px_rgba(100,116,139,0.35)] transition-all duration-300"
            style={{
              left: `calc(${getTerminalPosition(
                blackIndex,
                scenario.terminals.length,
              ).left} - 38px)`,
            }}
          />
        ) : null}

        {scenario.terminals.map((terminal, index) => {
          const position = getTerminalPosition(index, scenario.terminals.length);
          const redActive = redProbeTarget === terminal.id;
          const blackActive = blackProbeTarget === terminal.id;
          const roleStyles = getTerminalRoleStyles(terminal.role);

          return (
            <div
              key={terminal.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ ...position, top: "46%" }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRedProbeTarget(terminal.id)}
                    className={`absolute -left-14 top-[12px] rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition ${
                      redActive
                        ? "border-rose-300 bg-rose-50 text-rose-800 shadow-[0_0_14px_rgba(251,113,133,0.2)]"
                        : "border-rose-200 bg-rose-50/80 text-rose-700 hover:border-rose-300"
                    }`}
                  >
                    Red
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlackProbeTarget(terminal.id)}
                    className={`absolute -right-15 top-[12px] rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition ${
                      blackActive
                        ? "border-slate-400 bg-slate-100 text-slate-900 shadow-[0_0_12px_rgba(100,116,139,0.16)]"
                        : "border-slate-300 bg-slate-100/85 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    Black
                  </button>
                  {redActive ? (
                    <div className="absolute left-1/2 top-[-16px] h-[16px] w-[4px] -translate-x-1/2 rounded-full bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.45)]" />
                  ) : null}
                  {blackActive ? (
                    <div className="absolute left-1/2 bottom-[-16px] h-[16px] w-[4px] -translate-x-1/2 rounded-full bg-slate-500 shadow-[0_0_12px_rgba(100,116,139,0.35)]" />
                  ) : null}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition ${
                      redActive || blackActive ? "scale-105" : ""
                    }`}
                  >
                    <span className="text-[14px] font-black">{terminal.label}</span>
                  </div>
                </div>
                <div className="mt-1 text-center">
                  <p
                    className={`text-[11px] font-bold tracking-tight ${roleStyles.accent}`}
                  >
                    {terminal.label}
                  </p>
                  <p
                    className={`mt-1.5 text-[9px] uppercase tracking-[0.18em] ${roleStyles.role}`}
                  >
                    {terminal.role}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
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
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Measuring Voltage Simulation
        </div>
        <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
          Practice Safe Voltage Measurement
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
          Use the digital multimeter trainer to practice selecting voltage
          ranges, keeping the black lead in COM, and using the red lead in the
          correct voltage jack before measuring across two test points.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
              Voltage Rule
            </p>
            <p className="mt-2 text-[15px] leading-6 text-sky-950">
              Measure voltage across two points, not in series.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
              Black Lead
            </p>
            <p className="mt-2 text-[15px] leading-6 text-emerald-950">
              Keep the black lead in COM for voltage practice.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-700">
              Red Lead
            </p>
            <p className="mt-2 text-[15px] leading-6 text-orange-950">
              Use VΩmA for DCV and ACV ranges. Do not use the 10A jack.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className={`rounded-[24px] border p-5 ${scenarioStyles.card}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${scenarioStyles.badge}`}
                >
                  {scenarioStyles.label}
                </div>
                <h3 className="mt-3 text-[1.35rem] font-black tracking-tight text-slate-950">
                  {voltageScenario.scenario.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                  {voltageScenario.scenario.teachingGoal}
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Step
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {voltageScenario.scenarioIndex + 1}/{voltageScenario.scenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Done
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {voltageScenario.completedScenarioCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Score
                  </p>
                  <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
                    {voltageScenario.scorePercent}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {measuringVoltageScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => voltageScenario.selectScenario(scenario.id)}
                  className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                    voltageScenario.scenario.id === scenario.id
                      ? "border-sky-300 bg-sky-50 text-sky-900"
                      : voltageScenario.completedScenarioIds.includes(
                            scenario.id,
                          )
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
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
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {voltageScenario.scenario.sourceType.replaceAll("_", " ")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Expected Family
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {formatDialFamilyLabel(
                    voltageScenario.scenario.expectedDialFamily,
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Expected Reading
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {voltageScenario.scenario.expectedDisplayValue}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Required Jacks
                </p>
                <p className="mt-2 text-[14px] font-bold text-slate-900">
                  {formatExpectedJack(
                    voltageScenario.scenario.expectedBlackLeadJack,
                  )}{" "}
                  +{" "}
                  {formatExpectedJack(
                    voltageScenario.scenario.expectedRedLeadJack,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Safety Hint
                </p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {voltageScenario.scenario.safetyHint}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Next Best Action
                </p>
                <p className="mt-2 text-[14px] leading-6 text-slate-700">
                  {voltageScenario.guidance.title}
                </p>
              </div>
            </div>

            {voltageScenario.isCelebrationReady ||
            voltageScenario.isScenarioCompleted ? (
              <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-[0_10px_24px_rgba(16,185,129,0.12)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                      Success
                    </p>
                    <p className="mt-1 text-[15px] font-bold text-emerald-950">
                      Scenario completed and score updated.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-[12px] font-black text-emerald-700">
                    <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                    +1 Complete
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <ScenarioTerminalDiagram
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
