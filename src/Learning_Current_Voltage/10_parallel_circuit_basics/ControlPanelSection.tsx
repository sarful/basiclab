type ControlPanelSectionProps = {
  voltage: number;
  branchOneResistance: number;
  branchTwoResistance: number;
  branchThreeResistance: number;
  equivalentResistance: number;
  currentOne: number;
  currentTwo: number;
  currentThree: number;
  totalCurrent: number;
  onVoltageChange: (value: number) => void;
  onBranchOneChange: (value: number) => void;
  onBranchTwoChange: (value: number) => void;
  onBranchThreeChange: (value: number) => void;
};

export function ControlPanelSection({
  voltage,
  branchOneResistance,
  branchTwoResistance,
  branchThreeResistance,
  equivalentResistance,
  currentOne,
  currentTwo,
  currentThree,
  totalCurrent,
  onVoltageChange,
  onBranchOneChange,
  onBranchTwoChange,
  onBranchThreeChange,
}: ControlPanelSectionProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Controls
        </div>
        <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-slate-950">
          Try the branch values
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          Change the source voltage and each branch resistance to see how the
          current divides across the parallel paths.
        </p>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
          <p className="text-sm font-semibold text-blue-700">Live equivalent resistance</p>
          <p className="mt-2 text-[1.9rem] font-bold text-blue-800">
            {equivalentResistance.toFixed(2)} Ohm
          </p>
          <p className="mt-2 text-sm leading-6 text-blue-700/80">
            More parallel branches reduce the total resistance seen by the source.
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
              Branch 1 resistance: {branchOneResistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={branchOneResistance}
              onChange={(e) => onBranchOneChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Branch 2 resistance: {branchTwoResistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={branchTwoResistance}
              onChange={(e) => onBranchTwoChange(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Branch 3 resistance: {branchThreeResistance.toFixed(1)} Ohm
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={branchThreeResistance}
              onChange={(e) => onBranchThreeChange(Number(e.target.value))}
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
          Watch the branch currents
        </h3>
        <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
          The branch currents can be different, but together they make the total
          source current.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-semibold text-blue-700">Total current</p>
            <p className="mt-2 text-[1.9rem] font-bold text-blue-800">
              {totalCurrent.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Branch 1 current</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {currentOne.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Branch 2 current</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {currentTwo.toFixed(2)} A
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-700">Branch 3 current</p>
            <p className="mt-2 text-[1.5rem] font-bold text-slate-900">
              {currentThree.toFixed(2)} A
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
