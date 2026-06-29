type ControlPanelSectionProps = {
  voltage: number;
  resistance: number;
  resistanceLevel: string;
  current: number;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
};

export function ControlPanelSection({
  voltage,
  resistance,
  resistanceLevel,
  current,
  onVoltageChange,
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
          Try the controls
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Adjust voltage and resistance to see how charge flow becomes easier or harder.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Voltage Push: {voltage.toFixed(1)} V
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

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Quick presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[2, 6, 12].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onResistanceChange(preset)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {preset} Ohm
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Live Reading
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Watch the current change
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Higher resistance usually reduces current. Lower resistance usually lets more current move.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-sm font-semibold text-blue-700">Current</p>
            <p className="mt-2 text-[1.85rem] font-semibold text-blue-800">
              {current.toFixed(2)} A
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700">Resistance level</p>
            <p className="mt-2 text-[1.4rem] font-semibold text-slate-900">
              {resistanceLevel}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
