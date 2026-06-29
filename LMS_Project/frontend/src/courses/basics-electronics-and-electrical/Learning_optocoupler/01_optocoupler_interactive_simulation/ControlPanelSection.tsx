import { formatNumber } from "./logic";
import type {
  CouplerType,
  IsolationMode,
  SimulationResult,
} from "./types";

type ControlPanelSectionProps = {
  couplerType: CouplerType;
  setCouplerType: (value: CouplerType) => void;
  inputVoltage: number;
  setInputVoltage: (value: number) => void;
  isolation: IsolationMode;
  setIsolation: (value: IsolationMode) => void;
  enabled: boolean;
  setEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
  results: SimulationResult;
  selfTestsPassed: boolean;
};

export default function ControlPanelSection({
  couplerType,
  setCouplerType,
  inputVoltage,
  setInputVoltage,
  isolation,
  setIsolation,
  enabled,
  setEnabled,
  results,
  selfTestsPassed,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black text-slate-900">Controls</h2>

      <div className="mt-5 grid grid-cols-1 gap-3">
        <button
          onClick={() => setCouplerType("Phototransistor")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            couplerType === "Phototransistor"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Phototransistor
        </button>
        <button
          onClick={() => setCouplerType("Photodiode")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            couplerType === "Photodiode"
              ? "bg-green-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Photodiode
        </button>
        <button
          onClick={() => setCouplerType("PhotoTRIAC")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            couplerType === "PhotoTRIAC"
              ? "bg-purple-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          PhotoTRIAC
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <span className="font-black text-slate-700">Input Signal</span>
        <button
          onClick={() => setEnabled((current) => !current)}
          className={`rounded-full px-5 py-2 text-sm font-black ${
            enabled
              ? "bg-emerald-600 text-white"
              : "bg-slate-300 text-slate-700"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Input Voltage: {inputVoltage} V
        </label>
        <input
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={inputVoltage}
          onChange={(e) => setInputVoltage(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <button
          onClick={() => setIsolation("Low")}
          className={`rounded-2xl px-3 py-3 text-sm font-black ${
            isolation === "Low"
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Low
        </button>
        <button
          onClick={() => setIsolation("Medium")}
          className={`rounded-2xl px-3 py-3 text-sm font-black ${
            isolation === "Medium"
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setIsolation("High")}
          className={`rounded-2xl px-3 py-3 text-sm font-black ${
            isolation === "High"
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          High
        </button>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Conventional current on the input side flows through the LED from
          positive to negative. The light crosses the isolation barrier and
          triggers the output device. Phototransistor and photodiode types drive
          a DC loop, while PhotoTRIAC is suited to AC load control.
        </p>
        <p className="mt-3 text-sm font-black text-slate-900">
          Isolation Rating: {results.isolationVoltage} V
        </p>
        <p className="mt-1 text-sm font-black text-slate-900">
          Effective Transfer: {formatNumber(results.transferPercent, 0)}%
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">
          Self tests: {selfTestsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}
