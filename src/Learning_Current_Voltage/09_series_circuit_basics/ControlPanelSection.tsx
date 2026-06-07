type ControlPanelSectionProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  totalResistance: number;
  current: number;
  dropOne: number;
  dropTwo: number;
  onVoltageChange: (value: number) => void;
  onResistanceOneChange: (value: number) => void;
  onResistanceTwoChange: (value: number) => void;
};

export function ControlPanelSection({
  voltage,
  resistanceOne,
  resistanceTwo,
  totalResistance,
  current,
  dropOne,
  dropTwo,
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
          Try the series values
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Change the source voltage and both resistor values to see how one shared
          path changes the current and voltage drops.
        </p>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
          <p className="text-sm font-semibold text-blue-700">Live total resistance</p>
          <p className="mt-2 text-[1.9rem] font-bold text-blue-800">
            {totalResistance.toFixed(1)} Ohm
          </p>
          <p className="mt-2 text-sm leading-6 text-blue-700/80">
            In series, the resistor values add together to make one total resistance.
          </p>
        </div>

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
              max="12"
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
              max="12"
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
          Watch the shared current
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          One series path means one current value moves through each component.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-semibold text-blue-700">Current</p>
            <p className="mt-2 text-[1.9rem] font-bold text-blue-800">
              {current.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Voltage drop on R1</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {dropOne.toFixed(1)} V
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Voltage drop on R2</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {dropTwo.toFixed(1)} V
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
