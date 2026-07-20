"use client";

export type ControlMode = "onOff" | "timeline";
export type TimelineStep = 0 | 1 | 2 | 3;

export const TIMELINE_STEPS = [
  {
    id: 0,
    label: "Input OFF",
    title: "Switch open",
    description:
      "SW1 is open, so the PC817 input LED is off and the isolated output is inactive.",
  },
  {
    id: 1,
    label: "Input LED ON",
    title: "5V input current flows",
    description:
      "The 5V input side drives current through R1 and the internal PC817 LED.",
  },
  {
    id: 2,
    label: "Optical Link",
    title: "Light crosses isolation",
    description:
      "Light transfers the signal across the isolation gap with no direct electrical connection.",
  },
  {
    id: 3,
    label: "Output ON",
    title: "Phototransistor switches load",
    description:
      "The phototransistor conducts and the separate 12V output indicator LED turns on.",
  },
] as const satisfies readonly {
  id: TimelineStep;
  label: string;
  title: string;
  description: string;
}[];

export function toTimelineStep(progress: number): TimelineStep {
  return Math.min(
    3,
    Math.max(0, Math.floor(progress * TIMELINE_STEPS.length)),
  ) as TimelineStep;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function OptotransistorDCSwitchControlPanel({
  controlMode,
  inputEnabled,
  timelineStep,
  onControlModeChange,
  onToggleInput,
  onReset,
}: {
  controlMode: ControlMode;
  inputEnabled: boolean;
  timelineStep: TimelineStep;
  onControlModeChange: (mode: ControlMode) => void;
  onToggleInput: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
          Control Panel
        </p>
        <h2 className="mt-2 text-xl font-black">Optotransistor DC Switch</h2>
      </div>

      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-sm font-black text-emerald-800">Selected Type</p>
        <p className="mt-1 text-2xl font-black text-emerald-700">
          PC817 DC Switch
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Mode Select
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onControlModeChange("onOff")}
            className={cn(
              "rounded-2xl px-3 py-3 text-sm font-black transition",
              controlMode === "onOff"
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100",
            )}
          >
            ON/OFF Mode
          </button>

          <button
            type="button"
            onClick={() => onControlModeChange("timeline")}
            className={cn(
              "rounded-2xl px-3 py-3 text-sm font-black transition",
              controlMode === "timeline"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100",
            )}
          >
            Timeline Mode
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <span className="font-black text-slate-700">Input Signal</span>
        <button
          type="button"
          onClick={onToggleInput}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-black transition",
            inputEnabled ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700",
          )}
        >
          {inputEnabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Active Stage
        </p>
        <p className="mt-2 text-lg font-black text-slate-900">
          {inputEnabled ? TIMELINE_STEPS[timelineStep].label : "Input OFF"}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 active:scale-[0.98]"
      >
        Reset
      </button>
    </div>
  );
}

export function OptotransistorSwitchingPreview({
  timelineProgress,
  timelineStep,
  onTimelineChange,
}: {
  timelineProgress: number;
  timelineStep: TimelineStep;
  onTimelineChange: (value: number) => void;
}) {
  const activeStep = TIMELINE_STEPS[timelineStep];

  return (
    <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Time Cursor / Switching Preview
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {activeStep.title}
          </p>
        </div>

        <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
          {Math.round(timelineProgress * 100)}%
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={0.999}
        step={0.001}
        value={timelineProgress}
        onChange={(event) => onTimelineChange(Number(event.target.value))}
        className="w-full accent-green-700"
        aria-label="Time Cursor / Switching Preview"
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {TIMELINE_STEPS.map((step) => {
          const isActive = timelineStep === step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm font-black transition",
                isActive
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-500",
              )}
            >
              {step.label}
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-600 ring-1 ring-slate-200">
        {activeStep.description}
      </p>
    </section>
  );
}
