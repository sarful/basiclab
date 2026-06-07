import { formatNumber, formatResistance, MIN_BASE_BIAS_CURRENT } from "./logic";

type ControlPanelSectionProps = {
  baseVoltage: number;
  setBaseVoltage: (value: number) => void;
  baseResistance: number;
  setBaseResistance: (value: number) => void;
  loadResistance: number;
  setLoadResistance: (value: number) => void;
  switchOn: boolean;
  setSwitchOn: (value: boolean) => void;
  gain: number;
  setGain: (value: number) => void;
  collectorCurrent: number;
  baseCurrent: number;
  transistorBiased: boolean;
  resetSimulation: () => void;
};

export default function ControlPanelSection({
  baseVoltage,
  setBaseVoltage,
  baseResistance,
  setBaseResistance,
  loadResistance,
  setLoadResistance,
  switchOn,
  setSwitchOn,
  gain,
  setGain,
  collectorCurrent,
  baseCurrent,
  transistorBiased,
  resetSimulation,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:rounded-3xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <button
        onClick={() => setSwitchOn(!switchOn)}
        className={`mb-4 w-full rounded-2xl px-4 py-3 text-xs font-black shadow-sm transition sm:mb-5 sm:py-4 sm:text-sm ${
          switchOn
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {switchOn
          ? "Switch ON - Base current flowing"
          : "Switch OFF - Press to turn transistor ON"}
      </button>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Supply Voltage: {baseVoltage}V
        </label>
        <input
          type="range"
          min="3"
          max="24"
          step="1"
          value={baseVoltage}
          onChange={(e) => setBaseVoltage(Number(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Base Resistor: {formatResistance(baseResistance)}Ohm
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={baseResistance}
          onChange={(e) => setBaseResistance(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Lower base resistance increases base current.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Collector Load Resistor: {formatResistance(loadResistance)}Ohm
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={loadResistance}
          onChange={(e) => setLoadResistance(Number(e.target.value))}
          className="w-full accent-yellow-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Lower resistance allows more collector current.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Current Gain Beta: {gain}
        </label>
        <input
          type="range"
          min="20"
          max="200"
          step="5"
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100 text-sm text-slate-700">
        <p className="font-semibold text-green-700">Transistor Rule</p>
        <p className="mt-1">Ic ~= Beta x Ib</p>
        <p className="mt-2 font-bold text-slate-900">
          {formatNumber(collectorCurrent * 1000, 1)}mA ~= {gain} x{" "}
          {formatNumber(baseCurrent * 1000, 2)}mA
        </p>
        <p
          className={`mt-2 text-xs font-bold ${
            transistorBiased ? "text-green-700" : "text-red-700"
          }`}
        >
          {transistorBiased
            ? "Bias OK: transistor can conduct."
            : `Bias Low: minimum ${formatNumber(
                MIN_BASE_BIAS_CURRENT * 1000,
                2,
              )}mA base current needed.`}
        </p>
      </div>
    </div>
  );
}
