import type { SolveMode } from "./types";

type ControlPanelSectionProps = {
  mode: SolveMode;
  voltage: number;
  current: number;
  resistance: number;
  formula: string;
  onModeChange: (value: SolveMode) => void;
  onVoltageChange: (value: number) => void;
  onCurrentChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
};

export function ControlPanelSection({
  mode,
  voltage,
  current,
  resistance,
  formula,
  onModeChange,
  onVoltageChange,
  onCurrentChange,
  onResistanceChange,
}: ControlPanelSectionProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Controls
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Try the values
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Change the known values and watch how the power result updates in real time.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {([
            ["power", "Solve P"],
            ["current", "Use I"],
            ["resistance", "Use R"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onModeChange(value)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mode === value
                  ? "bg-orange-600 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
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
              Current flow: {current.toFixed(2)} A
            </label>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={current}
              onChange={(e) => onCurrentChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Resistance: {resistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={resistance}
              onChange={(e) => onResistanceChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Live Formula
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Watch the power result
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          As voltage or current changes, the power result updates automatically.
        </p>

        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
          <p className="text-sm font-semibold text-orange-900">{formula}</p>
        </div>
      </section>
    </div>
  );
}
