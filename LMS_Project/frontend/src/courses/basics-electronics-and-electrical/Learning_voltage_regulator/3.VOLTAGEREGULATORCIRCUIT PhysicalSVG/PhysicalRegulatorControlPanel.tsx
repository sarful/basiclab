"use client";

export type PhysicalRegulatorModel = {
  dropoutVoltage: number;
  outputVoltage: number;
  packageLabel: string;
};
export type PhysicalTimelineStep = 0 | 1 | 2 | 3;

export const PHYSICAL_REGULATOR_MODELS = [
  { packageLabel: "7805", outputVoltage: 5, dropoutVoltage: 2 },
  { packageLabel: "7806", outputVoltage: 6, dropoutVoltage: 2 },
  { packageLabel: "7809", outputVoltage: 9, dropoutVoltage: 2 },
  { packageLabel: "7812", outputVoltage: 12, dropoutVoltage: 2 },
  { packageLabel: "7815", outputVoltage: 15, dropoutVoltage: 2 },
] as const satisfies readonly PhysicalRegulatorModel[];

export const PHYSICAL_TIMELINE_STEPS = [
  {
    id: 0,
    label: "OFF",
    title: "Package idle",
    description: "No voltage is applied to the physical regulator pins.",
  },
  {
    id: 1,
    label: "IN Pin",
    title: "VIN reaches the input pin",
    description: "Input current reaches the IN leg and the input capacitor.",
  },
  {
    id: 2,
    label: "GND Ref",
    title: "Ground reference is established",
    description: "The center pin provides the reference path for regulation.",
  },
  {
    id: 3,
    label: "OUT Pin",
    title: "Regulated voltage appears at OUT",
    description: "The regulator supplies the output capacitor and load side.",
  },
] as const satisfies readonly {
  id: PhysicalTimelineStep;
  label: string;
  title: string;
  description: string;
}[];

export function toPhysicalTimelineStep(progress: number): PhysicalTimelineStep {
  return Math.min(
    3,
    Math.max(0, Math.floor(progress * PHYSICAL_TIMELINE_STEPS.length)),
  ) as PhysicalTimelineStep;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PhysicalRegulatorControlPanel({
  inputVoltage,
  isPowered,
  loadCurrent,
  outputVoltage,
  regulatorModel,
  onInputVoltageChange,
  onLoadCurrentChange,
  onRegulatorModelChange,
  onReset,
  onStart,
  onStop,
}: {
  inputVoltage: number;
  isPowered: boolean;
  loadCurrent: number;
  outputVoltage: number;
  regulatorModel: PhysicalRegulatorModel;
  onInputVoltageChange: (value: number) => void;
  onLoadCurrentChange: (value: number) => void;
  onRegulatorModelChange: (model: PhysicalRegulatorModel) => void;
  onReset: () => void;
  onStart: () => void;
  onStop: () => void;
}) {
  const headroom = inputVoltage - regulatorModel.outputVoltage;
  const isRegulating = headroom >= regulatorModel.dropoutVoltage;
  const heatLoss = Math.max(0, inputVoltage - outputVoltage) * loadCurrent;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
          Control Panel
        </p>
        <h2 className="mt-2 text-xl font-black">Physical Regulator</h2>
        <p className="mt-2 text-xs font-bold text-slate-300">
          {isPowered ? "Package energized" : "Package stopped"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button type="button" onClick={onStart} className="rounded-2xl bg-emerald-500 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600">
          Start
        </button>
        <button type="button" onClick={onStop} className="rounded-2xl bg-rose-500 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-rose-600">
          Stop
        </button>
        <button type="button" onClick={onReset} className="rounded-2xl bg-slate-900 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700">
          Reset
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
        <p className="text-sm font-black text-teal-800">Selected Package</p>
        <p className="mt-1 text-3xl font-black text-teal-700">
          {regulatorModel.packageLabel}
        </p>
        <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-teal-100">
          VIN: {inputVoltage.toFixed(1)}V
        </p>
        <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-lg font-black text-teal-700 ring-1 ring-teal-100">
          VOUT: {outputVoltage.toFixed(2)}V
        </p>
        <p className={cn("mt-2 text-xs font-black", isRegulating ? "text-teal-700" : "text-rose-600")}>
          {isRegulating ? "Regulation OK" : "VIN too low for full regulation"}
        </p>
      </div>

      <label className="mt-5 block rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Regulator Number
        </span>
        <select
          value={regulatorModel.packageLabel}
          onChange={(event) => {
            const nextModel =
              PHYSICAL_REGULATOR_MODELS.find(
                (model) => model.packageLabel === event.target.value,
              ) ?? PHYSICAL_REGULATOR_MODELS[0];

            onRegulatorModelChange(nextModel);
          }}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 outline-none ring-teal-200 focus:ring-4"
        >
          {PHYSICAL_REGULATOR_MODELS.map((model) => (
            <option key={model.packageLabel} value={model.packageLabel}>
              {model.packageLabel} ({model.outputVoltage}V)
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Input Voltage
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-800 ring-1 ring-slate-200">
            {inputVoltage.toFixed(1)}V
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={35}
          step={0.5}
          value={inputVoltage}
          onChange={(event) => onInputVoltageChange(Number(event.target.value))}
          className="mt-4 w-full accent-sky-600"
          aria-label="Adjust input voltage"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Load Current
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-800 ring-1 ring-slate-200">
            {loadCurrent.toFixed(2)}A
          </span>
        </div>
        <input
          type="range"
          min={0.05}
          max={1}
          step={0.05}
          value={loadCurrent}
          onChange={(event) => onLoadCurrentChange(Number(event.target.value))}
          className="mt-4 w-full accent-teal-700"
          aria-label="Adjust load current"
        />
        <p className="mt-3 text-xs font-bold text-slate-500">
          Heat loss: {heatLoss.toFixed(2)}W
        </p>
      </div>
    </div>
  );
}

export function PhysicalRegulatorPreview({
  timelineProgress,
  timelineStep,
  onTimelineChange,
}: {
  timelineProgress: number;
  timelineStep: PhysicalTimelineStep;
  onTimelineChange: (value: number) => void;
}) {
  const activeStep = PHYSICAL_TIMELINE_STEPS[timelineStep];

  return (
    <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Time Cursor / Regulation Preview
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
        className="w-full accent-teal-700"
        aria-label="Time Cursor / Regulation Preview"
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {PHYSICAL_TIMELINE_STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              "rounded-2xl border px-3 py-3 text-sm font-black transition",
              timelineStep === step.id
                ? "border-teal-400 bg-teal-50 text-teal-700"
                : "border-slate-200 bg-slate-50 text-slate-500",
            )}
          >
            {step.label}
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-600 ring-1 ring-slate-200">
        {activeStep.description}
      </p>
    </section>
  );
}
