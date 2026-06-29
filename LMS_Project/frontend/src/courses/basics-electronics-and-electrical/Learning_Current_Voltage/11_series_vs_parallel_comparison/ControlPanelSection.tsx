type ControlPanelSectionProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  seriesCurrent: number;
  parallelTotalCurrent: number;
  seriesTotalResistance: number;
  parallelEquivalentResistance: number;
  onVoltageChange: (value: number) => void;
  onResistanceOneChange: (value: number) => void;
  onResistanceTwoChange: (value: number) => void;
};

export function ControlPanelSection({
  voltage,
  resistanceOne,
  resistanceTwo,
  seriesCurrent,
  parallelTotalCurrent,
  seriesTotalResistance,
  parallelEquivalentResistance,
  onVoltageChange,
  onResistanceOneChange,
  onResistanceTwoChange,
}: ControlPanelSectionProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Controls
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Try the same two resistor values
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Use the same source and the same two resistors to compare how series
          and parallel layouts change the result.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Voltage push: {voltage.toFixed(1)} V
            </label>
            <input
              type="range"
              min="6"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => onVoltageChange(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Resistor 1: {resistanceOne.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={resistanceOne}
              onChange={(e) => onResistanceOneChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Resistor 2: {resistanceTwo.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={resistanceTwo}
              onChange={(e) => onResistanceTwoChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Live Reading
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Watch both results together
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          The same parts can create different resistance and current behavior
          depending on the layout.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Series total resistance</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {seriesTotalResistance.toFixed(1)} Ohm
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-semibold text-blue-700">Parallel equivalent resistance</p>
            <p className="mt-2 text-[1.5rem] font-bold text-blue-800">
              {parallelEquivalentResistance.toFixed(2)} Ohm
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Series current</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {seriesCurrent.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-semibold text-blue-700">Parallel total current</p>
            <p className="mt-2 text-[1.5rem] font-bold text-blue-800">
              {parallelTotalCurrent.toFixed(2)} A
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
