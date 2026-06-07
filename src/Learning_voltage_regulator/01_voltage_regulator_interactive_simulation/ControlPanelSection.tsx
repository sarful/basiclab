import { formatNumber } from "./logic";
import type { LoadMode } from "./types";

type ControlPanelSectionProps = {
  inputVoltage: number;
  setInputVoltage: (value: number) => void;
  ripple: number;
  setRipple: (value: number) => void;
  loadMode: LoadMode;
  setLoadMode: (value: LoadMode) => void;
  results: {
    effective: number;
    efficiency: number;
    heat: number;
    filteredRipple: number;
  };
};

export default function ControlPanelSection({
  inputVoltage,
  setInputVoltage,
  ripple,
  setRipple,
  loadMode,
  setLoadMode,
  results,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border p-5 shadow">
      <label>Input Voltage: {inputVoltage}V</label>
      <input
        type="range"
        min="6"
        max="35"
        value={inputVoltage}
        onChange={(e) => setInputVoltage(Number(e.target.value))}
        className="w-full"
      />

      <label className="mt-4 block">Ripple Voltage: {ripple}V</label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.1"
        value={ripple}
        onChange={(e) => setRipple(Number(e.target.value))}
        className="w-full"
      />

      <div className="mt-5 grid grid-cols-3 gap-2">
        {(["Light", "Medium", "Heavy"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setLoadMode(mode)}
            className={`rounded-xl p-3 ${
              loadMode === mode
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2 font-bold">
        <p>Output Voltage: {formatNumber(results.effective)}V</p>
        <p>Efficiency: {results.efficiency}%</p>
        <p>Heat Loss: {results.heat}%</p>
        <p>Ripple After Filtering: {formatNumber(results.filteredRipple)}V</p>
      </div>
    </div>
  );
}
