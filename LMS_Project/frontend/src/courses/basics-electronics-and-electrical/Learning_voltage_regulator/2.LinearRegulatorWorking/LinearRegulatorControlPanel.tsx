"use client";

export type LinearRegulatorModel = {
  dropoutVoltage: number;
  outputVoltage: number;
  packageLabel: string;
};
export type LinearRegulatorTimelineStep = 0 | 1 | 2 | 3;

export const LINEAR_REGULATOR_MODELS = [
  { packageLabel: "7805", outputVoltage: 5, dropoutVoltage: 2 },
  { packageLabel: "7806", outputVoltage: 6, dropoutVoltage: 2 },
  { packageLabel: "7809", outputVoltage: 9, dropoutVoltage: 2 },
  { packageLabel: "7812", outputVoltage: 12, dropoutVoltage: 2 },
  { packageLabel: "7815", outputVoltage: 15, dropoutVoltage: 2 },
] as const satisfies readonly LinearRegulatorModel[];

export const LINEAR_TIMELINE_STEPS = [
  {
    id: 0,
    label: "OFF",
    title: "Regulator inactive",
    description: "No DC input is applied, so no current dots are shown.",
  },
  {
    id: 1,
    label: "VIN Applied",
    title: "Input reaches regulator",
    description: "The DC source feeds the IN pin and input capacitor.",
  },
  {
    id: 2,
    label: "Regulating",
    title: "Internal pass element controls output",
    description:
      "The regulator compares its reference and drops extra voltage as heat.",
  },
  {
    id: 3,
    label: "Load Powered",
    title: "Stable output drives load",
    description: "The OUT pin supplies the load and current returns to ground.",
  },
] as const satisfies readonly {
  id: LinearRegulatorTimelineStep;
  label: string;
  title: string;
  description: string;
}[];

export function toLinearTimelineStep(progress: number): LinearRegulatorTimelineStep {
  return Math.min(
    3,
    Math.max(0, Math.floor(progress * LINEAR_TIMELINE_STEPS.length)),
  ) as LinearRegulatorTimelineStep;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LinearRegulatorControlPanel({
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
  regulatorModel: LinearRegulatorModel;
  onInputVoltageChange: (value: number) => void;
  onLoadCurrentChange: (value: number) => void;
  onRegulatorModelChange: (model: LinearRegulatorModel) => void;
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
        <h2 className="mt-2 text-xl font-black">Linear Regulator</h2>
        <p className="mt-2 text-xs font-bold text-slate-300">
          {isPowered ? "DC input applied" : "Circuit stopped"}
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
        <p className="text-sm font-black text-teal-800">Selected Device</p>
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
              LINEAR_REGULATOR_MODELS.find(
                (model) => model.packageLabel === event.target.value,
              ) ?? LINEAR_REGULATOR_MODELS[0];

            onRegulatorModelChange(nextModel);
          }}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 outline-none ring-teal-200 focus:ring-4"
        >
          {LINEAR_REGULATOR_MODELS.map((model) => (
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

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Current Flow
        </p>
        <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
          <p>
            <span className="text-rose-500">Red:</span> VIN to input pin.
          </p>
          <p>
            <span className="text-orange-500">Orange:</span> input capacitor charge.
          </p>
          <p>
            <span className="text-yellow-500">Yellow:</span> internal regulation path.
          </p>
          <p>
            <span className="text-emerald-500">Green:</span> ground reference.
          </p>
          <p>
            <span className="text-sky-500">Blue:</span> output/load and return.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LinearRegulatorRegulationPreview({
  timelineProgress,
  timelineStep,
  onTimelineChange,
}: {
  timelineProgress: number;
  timelineStep: LinearRegulatorTimelineStep;
  onTimelineChange: (value: number) => void;
}) {
  const activeStep = LINEAR_TIMELINE_STEPS[timelineStep];

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
        {LINEAR_TIMELINE_STEPS.map((step) => (
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
