import type { CircuitState } from "./types";

type ControlPanelSectionProps = {
  circuitState: CircuitState;
  voltage: number;
  resistance: number;
  current: number;
  explanation: string;
  onStateChange: (value: CircuitState) => void;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
};

export function ControlPanelSection({
  circuitState,
  voltage,
  resistance,
  current,
  explanation,
  onStateChange,
  onVoltageChange,
  onResistanceChange,
}: ControlPanelSectionProps) {
  const isClosed = circuitState === "closed";

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Controls
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Try the switch
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Open the path to stop current, or close the path to let current move
          through the circuit.
        </p>

        <div
          className={`mt-5 rounded-2xl border px-4 py-4 ${
            isClosed
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isClosed ? "text-green-700" : "text-amber-700"
            }`}
          >
            Live state
          </p>
          <p
            className={`mt-2 text-[1.55rem] font-bold ${
              isClosed ? "text-green-800" : "text-amber-800"
            }`}
          >
            {isClosed ? "Closed Circuit" : "Open Circuit"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{explanation}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onStateChange("open")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              circuitState === "open"
                ? "bg-amber-500 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Open switch
          </button>
          <button
            type="button"
            onClick={() => onStateChange("closed")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              circuitState === "closed"
                ? "bg-green-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Close switch
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
              Resistance: {resistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="1"
              max="15"
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
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Live Current
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Watch the flow result
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          A broken path gives zero current. A complete path lets current move.
        </p>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
          <p className="text-sm font-semibold text-blue-700">Current reading</p>
          <p className="mt-2 text-[2.1rem] font-bold text-blue-800">
            {current.toFixed(2)} A
          </p>
        </div>
      </section>
    </div>
  );
}
