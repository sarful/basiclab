import { formatNumber } from "./logic";
import type { SimulationResult, SwitchType } from "./types";

type ControlPanelSectionProps = {
  switchType: SwitchType;
  setSwitchType: (value: SwitchType) => void;
  pressed: boolean;
  setPressed: (value: boolean) => void;
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  resistorOhm: number;
  setResistorOhm: (value: number) => void;
  electronFlowRate: number;
  setElectronFlowRate: (value: number) => void;
  result: SimulationResult;
  testsPassed: boolean;
};

export default function ControlPanelSection({
  switchType,
  setSwitchType,
  pressed,
  setPressed,
  supplyVoltage,
  setSupplyVoltage,
  resistorOhm,
  setResistorOhm,
  electronFlowRate,
  setElectronFlowRate,
  result,
  testsPassed,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black text-slate-900">Controls</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setSwitchType("NO")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            switchType === "NO"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          NO
        </button>
        <button
          onClick={() => setSwitchType("NC")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            switchType === "NC"
              ? "bg-red-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          NC
        </button>
      </div>

      <button
        type="button"
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className={`mt-6 w-full rounded-3xl px-5 py-6 text-xl font-black shadow-lg transition ${
          pressed
            ? "translate-y-1 bg-purple-700 text-white"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {pressed ? "PRESSED" : "PRESS BUTTON"}
      </button>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Supply Voltage: {supplyVoltage} V
        </label>
        <input
          type="range"
          min="3"
          max="24"
          step="0.5"
          value={supplyVoltage}
          onChange={(event) => setSupplyVoltage(Number(event.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Series Resistor: {resistorOhm} Ohm
        </label>
        <input
          type="range"
          min="100"
          max="2200"
          step="10"
          value={resistorOhm}
          onChange={(event) => setResistorOhm(Number(event.target.value))}
          className="w-full accent-orange-600"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Electron Flow Rate: {electronFlowRate}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={electronFlowRate}
          onChange={(event) => setElectronFlowRate(Number(event.target.value))}
          className="w-full accent-cyan-600"
        />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm text-slate-700">{result.logicText}</p>
        <p className="mt-3 text-sm font-black text-slate-900">
          LED State: {result.ledOn ? "ON" : "OFF"}
        </p>
        <p className="mt-1 text-sm font-black text-slate-900">
          Circuit: {result.circuitClosed ? "closed path" : "open path"}
        </p>
        <p className="mt-1 text-sm font-black text-slate-900">
          Electron Flow Rate: {electronFlowRate}%
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">
          Current: {formatNumber(result.currentMa, 1)}mA
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">
          Self tests: {testsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}
