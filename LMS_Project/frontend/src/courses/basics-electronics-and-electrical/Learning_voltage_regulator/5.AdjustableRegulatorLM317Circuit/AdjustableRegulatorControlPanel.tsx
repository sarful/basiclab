"use client";

export type AdjustableRegulatorModel = {
  currentLabel: string;
  outputRange: string;
  packageLabel: string;
};
export type AdjustableTimelineStep = 0 | 1 | 2 | 3;

export const FIXED_R1_OHMS = 240;
export const REGULATOR_DROPOUT_VOLTS = 3;

export const ADJUSTABLE_REGULATOR_MODELS = [
  { packageLabel: "LM317", outputRange: "1.25V to 37V", currentLabel: "1.5A" },
  { packageLabel: "LM350", outputRange: "1.25V to 33V", currentLabel: "3A" },
  { packageLabel: "LM338", outputRange: "1.25V to 32V", currentLabel: "5A" },
] as const satisfies readonly AdjustableRegulatorModel[];

export const ADJUSTABLE_TIMELINE_STEPS = [
  {
    id: 0,
    label: "OFF",
    title: "Regulator inactive",
    description:
      "No input supply is applied, so the adjustable regulator and resistor divider are idle.",
  },
  {
    id: 1,
    label: "IN Powered",
    title: "Unregulated DC reaches IN",
    description:
      "The source feeds the regulator input pin and the input capacitor smooths the supply.",
  },
  {
    id: 2,
    label: "ADJ Reference",
    title: "Adjust network sets reference",
    description:
      "R1 and R2 form the feedback divider that tells the regulator what output voltage to hold.",
  },
  {
    id: 3,
    label: "VOUT Stable",
    title: "Regulated output drives load",
    description:
      "The selected adjustable regulator holds the output steady while current flows through the load.",
  },
] as const satisfies readonly {
  id: AdjustableTimelineStep;
  label: string;
  title: string;
  description: string;
}[];

export function toAdjustableTimelineStep(progress: number): AdjustableTimelineStep {
  return Math.min(
    3,
    Math.max(0, Math.floor(progress * ADJUSTABLE_TIMELINE_STEPS.length)),
  ) as AdjustableTimelineStep;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdjustableRegulatorControlPanel({
  formulaOutputVoltage,
  inputVoltage,
  isPowered,
  outputVoltage,
  regulatorModel,
  r2Ohms,
  onInputVoltageChange,
  onReset,
  onRegulatorModelChange,
  onR2Change,
  onStart,
  onStop,
}: {
  formulaOutputVoltage: number;
  inputVoltage: number;
  isPowered: boolean;
  outputVoltage: number;
  regulatorModel: AdjustableRegulatorModel;
  r2Ohms: number;
  onInputVoltageChange: (value: number) => void;
  onReset: () => void;
  onRegulatorModelChange: (model: AdjustableRegulatorModel) => void;
  onR2Change: (value: number) => void;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
          Control Panel
        </p>
        <h2 className="mt-2 text-xl font-black">Adjustable Regulator</h2>
        <p className="mt-2 text-xs font-bold text-slate-300">
          {isPowered ? "Input DC applied" : "Circuit stopped"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onStart}
          className="rounded-2xl bg-emerald-500 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onStop}
          className="rounded-2xl bg-rose-500 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-rose-600"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-slate-900 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
        <p className="text-sm font-black text-teal-800">Selected Device</p>
        <p className="mt-1 text-3xl font-black text-teal-700">
          {regulatorModel.packageLabel}
        </p>
        <p className="mt-1 text-sm font-black text-teal-800">
          Range: {regulatorModel.outputRange}
        </p>
        <p className="mt-1 text-sm font-black text-teal-800">
          Max current: {regulatorModel.currentLabel}
        </p>
        <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-teal-100">
          VIN: {inputVoltage.toFixed(1)}V
        </p>
        <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-lg font-black text-teal-700 ring-1 ring-teal-100">
          VOUT: {outputVoltage.toFixed(2)}V
        </p>
        <p className="mt-2 text-xs font-bold text-teal-800">
          Formula target: {formulaOutputVoltage.toFixed(2)}V
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
              ADJUSTABLE_REGULATOR_MODELS.find(
                (model) => model.packageLabel === event.target.value,
              ) ?? ADJUSTABLE_REGULATOR_MODELS[0];

            onRegulatorModelChange(nextModel);
          }}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 outline-none ring-teal-200 focus:ring-4"
        >
          {ADJUSTABLE_REGULATOR_MODELS.map((model) => (
            <option key={model.packageLabel} value={model.packageLabel}>
              {model.packageLabel} ({model.outputRange})
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
          max={40}
          step={0.5}
          value={inputVoltage}
          onChange={(event) => onInputVoltageChange(Number(event.target.value))}
          className="mt-4 w-full accent-sky-600"
          aria-label="Adjust input voltage"
        />
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>4V</span>
          <span>Dropout: {REGULATOR_DROPOUT_VOLTS}V</span>
          <span>40V</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            ADJ / R2 Slider
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-800 ring-1 ring-slate-200">
            {r2Ohms} ohm
          </span>
        </div>
        <input
          type="range"
          min={120}
          max={2200}
          step={10}
          value={r2Ohms}
          onChange={(event) => onR2Change(Number(event.target.value))}
          className="mt-4 w-full accent-teal-700"
          aria-label="Adjust R2 resistance"
        />
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>120 ohm</span>
          <span>R1 fixed: {FIXED_R1_OHMS} ohm</span>
          <span>2200 ohm</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Current Flow
        </p>
        <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
          <p>
            <span className="text-rose-500">Red:</span> source to IN pin.
          </p>
          <p>
            <span className="text-sky-500">Blue:</span> OUT pin to load.
          </p>
          <p>
            <span className="text-emerald-500">Green:</span> adjust divider to
            ground.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Adjustment Formula
        </p>
        <p className="mt-2 text-sm font-black text-slate-800">
          VOUT = 1.25V x (1 + R2 / R1)
        </p>
      </div>
    </div>
  );
}

export function AdjustableRegulatorRegulationPreview({
  timelineProgress,
  timelineStep,
  onTimelineChange,
}: {
  timelineProgress: number;
  timelineStep: AdjustableTimelineStep;
  onTimelineChange: (value: number) => void;
}) {
  const activeStep = ADJUSTABLE_TIMELINE_STEPS[timelineStep];

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
        {ADJUSTABLE_TIMELINE_STEPS.map((step) => {
          const isActive = timelineStep === step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm font-black transition",
                isActive
                  ? "border-teal-400 bg-teal-50 text-teal-700"
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
