"use client";

import { useEffect, useMemo, useState } from "react";
import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import RelayLessonFourControlPanel from "./RelayLessonFourControlPanel";
import RelayAnatomy from "./RelayAnatomy";
import {
  DEFAULT_RELAY_LESSON_FOUR_CONTROLS,
  RELAY_WORKING_TIMELINE_STEPS,
  getRelayWorkingTimelineStep,
  getRelayLessonFourDerivedState,
  type RelayLessonFourControls,
} from "./relayLessonFourShared";

export default function RelayLessonTwoEmbeddedPage() {
  const [controls, setControls] = useState<RelayLessonFourControls>(
    DEFAULT_RELAY_LESSON_FOUR_CONTROLS,
  );
  const [timeCursor, setTimeCursor] = useState(0);

  const derived = useMemo(
    () => getRelayLessonFourDerivedState(controls),
    [controls],
  );
  const finalTimelineStepIndex = RELAY_WORKING_TIMELINE_STEPS.length - 1;

  function updateControls(patch: Partial<RelayLessonFourControls>) {
    if (typeof patch.timelineStep === "number") {
      setTimeCursor(patch.timelineStep / finalTimelineStepIndex);
    }

    setControls((current) => ({ ...current, ...patch }));
  }

  function resetControls() {
    setTimeCursor(0);
    setControls(DEFAULT_RELAY_LESSON_FOUR_CONTROLS);
  }

  function selectControlMode(mode: RelayLessonFourControls["controlMode"]) {
    const timelineState = getRelayWorkingTimelineStep(0);

    setTimeCursor(0);
    setControls((current) => ({
      ...current,
      controlMode: mode,
      isTimelinePlaying: false,
      timelineStep: 0,
      isCoilEnergized: timelineState.isCoilEnergized,
      contactMode: timelineState.contactMode,
      armatureProgress: timelineState.armatureProgress,
    }));
  }

  function updateTimeCursor(value: number) {
    const safeValue = Math.max(0, Math.min(0.999, value));
    const timelineStep = Math.min(
      finalTimelineStepIndex,
      Math.floor(safeValue * RELAY_WORKING_TIMELINE_STEPS.length),
    );
    const timelineState = getRelayWorkingTimelineStep(timelineStep);

    setTimeCursor(safeValue);
    setControls((current) => ({
      ...current,
      controlMode: "timeline",
      isTimelinePlaying: false,
      timelineStep,
      isCoilEnergized: timelineState.isCoilEnergized,
      contactMode: timelineState.contactMode,
      armatureProgress: timelineState.armatureProgress,
    }));
  }

  useEffect(() => {
    if (controls.controlMode !== "timeline" || !controls.isTimelinePlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setControls((current) => {
        const nextStep = Math.min(
          current.timelineStep + 1,
          finalTimelineStepIndex,
        );
        const timelineState = getRelayWorkingTimelineStep(nextStep);
        setTimeCursor(nextStep / finalTimelineStepIndex);

        return {
          ...current,
          timelineStep: nextStep,
          isTimelinePlaying: nextStep < finalTimelineStepIndex,
          isCoilEnergized: timelineState.isCoilEnergized,
          contactMode: timelineState.contactMode,
          armatureProgress: timelineState.armatureProgress,
        };
      });
    }, 1200);

    return () => window.clearInterval(timer);
  }, [
    controls.controlMode,
    controls.isTimelinePlaying,
    finalTimelineStepIndex,
  ]);

  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 02">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Relay Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Relay Working Principle
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Study the relay mechanical structure from one shared control panel
            and observe how coil state, contact logic, and armature travel
            affect the internal relay anatomy.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <RelayLessonFourControlPanel
            controls={controls}
            onChange={updateControls}
            onReset={resetControls}
          />

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                Coil {controls.isCoilEnergized ? "ON" : "OFF"}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${derived.activeContact === "NO" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                Active Contact {derived.activeContact}
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Armature {Math.round(derived.effectiveArmatureProgress * 100)}%
              </span>
            </div>

            <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                Mode Select
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => selectControlMode("onOff")}
                  className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                    controls.controlMode === "onOff"
                      ? "bg-purple-700 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  ON/OFF Mode
                </button>
                <button
                  type="button"
                  onClick={() => selectControlMode("timeline")}
                  className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                    controls.controlMode === "timeline"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Timeline Mode
                </button>
              </div>
            </section>

            <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Time Cursor / Switching Preview
                  </h2>
                </div>
                <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
                  {Math.round(timeCursor * 100)}%
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={0.999}
                step={0.001}
                value={timeCursor}
                onChange={(event) => updateTimeCursor(Number(event.target.value))}
                className="w-full accent-green-700"
              />
            </section>

            <article className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-3">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
                  Internal Anatomy
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Relay Mechanical Structure
                </h2>
              </div>
              <div className="overflow-x-auto">
                <RelayAnatomy controls={controls} />
              </div>
            </article>
          </div>
        </div>
      </section>
    </UniversalSimulationLessonShell>
  );
}
