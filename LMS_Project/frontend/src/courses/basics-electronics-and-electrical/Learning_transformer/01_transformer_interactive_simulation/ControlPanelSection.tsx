import { formatNumber } from "./logic";

type ControlPanelSectionProps = {
  inputVoltage: number;
  setInputVoltage: (value: number) => void;
  primaryTurns: number;
  setPrimaryTurns: (value: number) => void;
  secondaryTurns: number;
  setSecondaryTurns: (value: number) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  outputVoltage: number;
  resetSimulation: () => void;
};

export default function ControlPanelSection({
  inputVoltage,
  setInputVoltage,
  primaryTurns,
  setPrimaryTurns,
  secondaryTurns,
  setSecondaryTurns,
  frequency,
  setFrequency,
  outputVoltage,
  resetSimulation,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Input Voltage: {inputVoltage}V
        </label>
        <input
          type="range"
          min="12"
          max="240"
          step="1"
          value={inputVoltage}
          onChange={(e) => setInputVoltage(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Primary Turns: {primaryTurns}
        </label>
        <input
          type="range"
          min="2"
          max="20"
          step="1"
          value={primaryTurns}
          onChange={(e) => setPrimaryTurns(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Secondary Turns: {secondaryTurns}
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={secondaryTurns}
          onChange={(e) => setSecondaryTurns(Number(e.target.value))}
          className="w-full accent-red-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          More secondary turns raise the output voltage.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          AC Frequency: {frequency}Hz
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100 text-sm text-slate-700">
        <p className="font-semibold text-blue-700">Transformer Formula</p>
        <p className="mt-1">Vs / Vp = Ns / Np</p>
        <p className="mt-2 font-bold text-slate-900">
          {formatNumber(outputVoltage, 1)}V / {inputVoltage}V = {secondaryTurns} /{" "}
          {primaryTurns}
        </p>
      </div>
    </div>
  );
}
