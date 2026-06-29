import type { CircuitMode } from "./types";

type ControlPanelSectionProps = {
  mode: CircuitMode;
  voltage: number;
  loadResistance: number;
  effectiveResistance: number;
  current: number;
  power: number;
  riskLabel: string;
  onModeChange: (value: CircuitMode) => void;
  onVoltageChange: (value: number) => void;
  onLoadResistanceChange: (value: number) => void;
};

export function ControlPanelSection({
  mode,
  voltage,
  loadResistance,
  effectiveResistance,
  current,
  power,
  riskLabel,
  onModeChange,
  onVoltageChange,
  onLoadResistanceChange,
}: ControlPanelSectionProps) {
  const isShort = mode === "short";

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Controls
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Compare the two paths
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Switch between the normal load path and the short path to see how fast
          current changes when resistance becomes very small.
        </p>

        <div
          className={`mt-5 rounded-2xl border px-4 py-4 ${
            isShort
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isShort ? "text-red-700" : "text-green-700"
            }`}
          >
            Live mode
          </p>
          <p
            className={`mt-2 text-[1.55rem] font-bold ${
              isShort ? "text-red-800" : "text-green-800"
            }`}
          >
            {isShort ? "Short Circuit" : "Normal Circuit"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {isShort
              ? "The load is bypassed and current takes the easier path."
              : "Current moves through the load in a controlled path."}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("normal")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === "normal"
                ? "bg-green-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Normal path
          </button>
          <button
            type="button"
            onClick={() => onModeChange("short")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === "short"
                ? "bg-red-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Short path
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Voltage push: {voltage.toFixed(1)} V
            </label>
            <input
              type="range"
              min="3"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => onVoltageChange(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Load resistance: {loadResistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={loadResistance}
              onChange={(e) => onLoadResistanceChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className={`h-2 w-2 rounded-full ${isShort ? "bg-red-500" : "bg-blue-500"}`} />
          Live Reading
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Watch the risk rise
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Very low resistance pushes current and power upward very quickly.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-semibold text-blue-700">Current</p>
            <p className="mt-2 text-[1.9rem] font-bold text-blue-800">
              {current.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
            <p className="text-sm font-semibold text-orange-700">Power</p>
            <p className="mt-2 text-[1.9rem] font-bold text-orange-800">
              {power.toFixed(2)} W
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Effective path resistance</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {effectiveResistance.toFixed(2)} Ohm
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Risk level: <span className="font-semibold text-slate-900">{riskLabel}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
