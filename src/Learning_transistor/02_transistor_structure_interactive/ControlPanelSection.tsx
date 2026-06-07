import {
  BASE_EMITTER_THRESHOLD,
  calculateBaseCurrent,
  clamp,
  formatNumber,
  MIN_VISIBLE_BASE_CURRENT,
} from "./logic";
import type { TransistorType } from "./types";

type ControlPanelSectionProps = {
  transistorType: TransistorType;
  setTransistorType: (value: TransistorType) => void;
  active: boolean;
  setActive: (value: boolean) => void;
  dopingLevel: number;
  setDopingLevel: (value: number) => void;
  collectorVoltage: number;
  setCollectorVoltage: (value: number) => void;
  baseVoltage: number;
  setBaseVoltage: (value: number) => void;
  baseResistance: number;
  setBaseResistance: (value: number) => void;
  loadResistance: number;
  setLoadResistance: (value: number) => void;
};

export default function ControlPanelSection({
  transistorType,
  setTransistorType,
  active,
  setActive,
  dopingLevel,
  setDopingLevel,
  collectorVoltage,
  setCollectorVoltage,
  baseVoltage,
  setBaseVoltage,
  baseResistance,
  setBaseResistance,
  loadResistance,
  setLoadResistance,
}: ControlPanelSectionProps) {
  const transistorGain = clamp(dopingLevel * 2, 20, 200);
  const baseCurrent = calculateBaseCurrent(active, baseVoltage, baseResistance);
  const isBiased = baseCurrent >= MIN_VISIBLE_BASE_CURRENT;
  const collectorCurrent = isBiased
    ? clamp(baseCurrent * transistorGain, 0, collectorVoltage / loadResistance)
    : 0;
  const lampGlow = clamp(
    collectorCurrent / Math.max(collectorVoltage / loadResistance, 0.00001),
    0,
    1,
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Controls</h2>
        <button
          onClick={() => setActive(!active)}
          className={`rounded-2xl px-4 py-2 text-xs font-black ${
            active ? "bg-green-600 text-white" : "bg-slate-800 text-white"
          }`}
        >
          {active ? "FLOW ON" : "FLOW OFF"}
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Transistor Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTransistorType("NPN")}
            className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
              transistorType === "NPN"
                ? "bg-green-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            NPN
          </button>

          <button
            onClick={() => setTransistorType("PNP")}
            className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
              transistorType === "PNP"
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            PNP
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Collector Voltage UCE: {collectorVoltage}V
          </label>
          <input
            type="range"
            min="3"
            max="24"
            step="1"
            value={collectorVoltage}
            onChange={(e) => setCollectorVoltage(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            Raising UCE increases the maximum available load current.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Base Bias Voltage UBE: {baseVoltage.toFixed(1)}V
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={baseVoltage}
            onChange={(e) => setBaseVoltage(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            If UBE stays below {BASE_EMITTER_THRESHOLD}V, the transistor remains
            near cutoff; higher voltage starts IB flow.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Base Resistor RB: {Math.round(baseResistance / 1000)}kOhm
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={baseResistance}
            onChange={(e) => setBaseResistance(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            Higher RB reduces base current.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Load Resistor RL: {loadResistance}Ohm
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
            Lower RL can allow more collector current.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Doping Level: {dopingLevel}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={dopingLevel}
            onChange={(e) => setDopingLevel(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            Higher doping increases the transistor gain.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-blue-50 p-4 ring-1 ring-blue-100">
        <p className="text-sm font-black text-blue-700">Realtime Logic</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
          <p>IB: {formatNumber(baseCurrent * 1000, 3)}mA</p>
          <p>IC: {formatNumber(collectorCurrent * 1000, 1)}mA</p>
          <p>Gain Beta: {formatNumber(transistorGain, 0)}</p>
          <p>Lamp: {Math.round(lampGlow * 100)}%</p>
        </div>
        <p
          className={`mt-3 text-xs font-black ${
            isBiased ? "text-green-700" : "text-red-700"
          }`}
        >
          {isBiased
            ? "Bias OK: carrier flow active."
            : `Bias low: UBE must exceed ${BASE_EMITTER_THRESHOLD}V and IB must be visible.`}
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-green-50 p-4 ring-1 ring-green-100">
        <p className="text-sm font-black text-green-700">Structure Logic</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          The emitter is heavily doped, the base is thin and lightly doped, and
          the collector is moderately doped. That structure makes transistor
          amplification possible.
        </p>
      </div>
    </div>
  );
}
