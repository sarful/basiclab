"use client";

import {
  getRelayWorkingTimelineStep,
  RELAY_WORKING_TIMELINE_STEPS,
  type RelayLessonFourControls,
} from "./relayLessonFourShared";

type RelayLessonFourControlPanelProps = {
  controls: RelayLessonFourControls;
  onChange: (patch: Partial<RelayLessonFourControls>) => void;
  onReset: () => void;
};

const panelClass =
  "rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]";

const chipClass =
  "rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]";

export default function RelayLessonFourControlPanel({
  controls,
  onChange,
  onReset,
}: RelayLessonFourControlPanelProps) {
  const timelineStep = getRelayWorkingTimelineStep(controls.timelineStep);
  const canGoPrevious = controls.timelineStep > 0;
  const canGoNext = controls.timelineStep < RELAY_WORKING_TIMELINE_STEPS.length - 1;

  function applyTimelineStep(stepIndex: number) {
    const nextStepIndex = Math.max(
      0,
      Math.min(RELAY_WORKING_TIMELINE_STEPS.length - 1, stepIndex),
    );
    const nextStep = getRelayWorkingTimelineStep(nextStepIndex);

    onChange({
      controlMode: "timeline",
      timelineStep: nextStepIndex,
      isTimelinePlaying: false,
      isCoilEnergized: nextStep.isCoilEnergized,
      contactMode: nextStep.contactMode,
      armatureProgress: nextStep.armatureProgress,
    });
  }

  function startOnOffMode() {
    onChange({
      controlMode: "onOff",
      isTimelinePlaying: false,
      timelineStep: 4,
      isCoilEnergized: true,
      contactMode: "auto",
      armatureProgress: 1,
    });
  }

  function stopOnOffMode() {
    onChange({
      controlMode: "onOff",
      isTimelinePlaying: false,
      timelineStep: 0,
      isCoilEnergized: false,
      contactMode: "auto",
      armatureProgress: 0,
    });
  }

  function startTimelineMode() {
    const firstActiveStep = getRelayWorkingTimelineStep(1);

    onChange({
      controlMode: "timeline",
      isTimelinePlaying: true,
      timelineStep: 1,
      isCoilEnergized: firstActiveStep.isCoilEnergized,
      contactMode: firstActiveStep.contactMode,
      armatureProgress: firstActiveStep.armatureProgress,
    });
  }

  function stopTimelineMode() {
    onChange({
      controlMode: "timeline",
      isTimelinePlaying: false,
    });
  }

  return (
    <aside className={`${panelClass} h-fit`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">
            Control Panel
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Relay Trainer
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            One panel now drives both the switching diagram and the internal
            anatomy view.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            Mode Select
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={stopOnOffMode}
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
              onClick={() => applyTimelineStep(0)}
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

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            ON/OFF Mode
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={startOnOffMode}
              className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                controls.controlMode === "onOff" && controls.isCoilEnergized
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Start
            </button>
            <button
              type="button"
              onClick={stopOnOffMode}
              className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                controls.controlMode === "onOff" && !controls.isCoilEnergized
                  ? "bg-red-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Stop
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Start energizes the relay coil. Stop releases the coil and returns
            the contact to NC.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                Timeline Mode
              </p>
              <h3 className="mt-1 text-sm font-black text-slate-900">
                Step {controls.timelineStep + 1} / {RELAY_WORKING_TIMELINE_STEPS.length}: {timelineStep.title}
              </h3>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
              {controls.isTimelinePlaying ? "Playing" : "Stopped"}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {timelineStep.description}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={startTimelineMode}
              className="rounded-xl bg-emerald-600 px-3 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              Start
            </button>
            <button
              type="button"
              onClick={stopTimelineMode}
              className="rounded-xl bg-red-600 px-3 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Stop
            </button>
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => applyTimelineStep(controls.timelineStep - 1)}
              className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous Step
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => applyTimelineStep(controls.timelineStep + 1)}
              className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next Step
            </button>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            Display
          </p>
          <div className="mt-3 space-y-3">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-bold text-slate-800">Show Labels</p>
                <p className="text-xs text-slate-500">
                  Keep part names visible in both diagrams.
                </p>
              </div>
              <input
                type="checkbox"
                checked={controls.showLabels}
                onChange={(event) =>
                  onChange({ showLabels: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-bold text-slate-800">Show Debug Dots</p>
                <p className="text-xs text-slate-500">
                  Reveal terminal reference points for alignment study.
                </p>
              </div>
              <input
                type="checkbox"
                checked={controls.showDebugDots}
                onChange={(event) =>
                  onChange({ showDebugDots: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-bold text-slate-800">Lamp/Output Glow</p>
                <p className="text-xs text-slate-500">
                  Highlight the energized NO path in active state.
                </p>
              </div>
              <input
                type="checkbox"
                checked={controls.showBulbGlow}
                onChange={(event) =>
                  onChange({ showBulbGlow: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-950 p-3 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-300">
            Study Focus
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`${chipClass} border-emerald-500/30 bg-emerald-500/15 text-emerald-200`}>
              Coil {controls.isCoilEnergized ? "Energized" : "Released"}
            </span>
            <span className={`${chipClass} border-blue-500/30 bg-blue-500/15 text-blue-200`}>
              Contact {controls.contactMode.toUpperCase()}
            </span>
          </div>
        </section>
      </div>
    </aside>
  );
}
