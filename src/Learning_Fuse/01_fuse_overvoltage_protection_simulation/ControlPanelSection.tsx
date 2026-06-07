import type { FuseRating, FuseState, SimulationResult } from "./types";
import { formatNumber } from "./logic";

type ControlPanelSectionProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  loadResistance: number;
  setLoadResistance: (value: number) => void;
  fuseRating: FuseRating;
  setFuseRating: (value: FuseRating) => void;
  fuseState: FuseState;
  setFuseState: (value: FuseState) => void;
  result: SimulationResult;
  testsPassed: boolean;
  triggerFuseIfUnsafe: () => void;
};

export function ControlPanelSection({
  supplyVoltage,
  setSupplyVoltage,
  loadResistance,
  setLoadResistance,
  fuseRating,
  setFuseRating,
  fuseState,
  setFuseState,
  result,
  testsPassed,
  triggerFuseIfUnsafe,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black text-slate-900">Controls</h2>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Supply Voltage: {supplyVoltage} V
        </label>
        <input
          type="range"
          min="1"
          max="60"
          step="0.5"
          value={supplyVoltage}
          onChange={(event) => setSupplyVoltage(Number(event.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Load Resistance: {loadResistance} Ohm
        </label>
        <input
          type="range"
          min="2"
          max="100"
          step="1"
          value={loadResistance}
          onChange={(event) => setLoadResistance(Number(event.target.value))}
          className="w-full accent-orange-600"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {(["0.5A", "1A", "2A", "5A"] as FuseRating[]).map((rating) => (
          <button
            key={rating}
            onClick={() => setFuseRating(rating)}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              fuseRating === rating ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {rating}
          </button>
        ))}
      </div>

      <button
        onClick={triggerFuseIfUnsafe}
        className={`mt-6 w-full rounded-3xl px-5 py-4 text-lg font-black shadow-lg ${
          result.shouldBlow && fuseState === "GOOD"
            ? "bg-red-600 text-white"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        Blow Fuse If Unsafe
      </button>

      <button
        onClick={() => setFuseState("GOOD")}
        className="mt-3 w-full rounded-3xl bg-emerald-600 px-5 py-4 text-lg font-black text-white shadow-lg"
      >
        Replace Fuse / Reset
      </button>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm text-slate-700">{result.statusText}</p>
        <p className="mt-3 text-sm font-black text-slate-900">
          Overload: {formatNumber(result.overloadPercent, 0)}%
        </p>
        <p className="mt-1 text-sm font-black text-slate-900">
          Load Power: {formatNumber(result.loadPowerW, 2)} W
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">
          Self tests: {testsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}
