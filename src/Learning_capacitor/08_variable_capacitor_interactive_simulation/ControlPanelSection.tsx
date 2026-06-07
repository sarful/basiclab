type ControlPanelSectionProps = {
  rotation: number;
  setRotation: (value: number) => void;
  minCapacitance: number;
  setMinCapacitance: (value: number) => void;
  maxCapacitance: number;
  setMaxCapacitance: (value: number) => void;
  inductanceUh: number;
  setInductanceUh: (value: number) => void;
  plateCount: number;
  setPlateCount: (value: number) => void;
  frequencyLabel: string;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  rotation,
  setRotation,
  minCapacitance,
  setMinCapacitance,
  maxCapacitance,
  setMaxCapacitance,
  inductanceUh,
  setInductanceUh,
  plateCount,
  setPlateCount,
  frequencyLabel,
  resetSimulation,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Knob Rotation: {rotation} deg</label>
        <input
          type="range"
          min="0"
          max="180"
          step="1"
          value={rotation}
          onChange={(event) => setRotation(Number(event.target.value))}
          className="w-full accent-purple-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          More rotation increases plate overlap and therefore capacitance.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Minimum Capacitance: {minCapacitance} pF
        </label>
        <input
          type="range"
          min="2"
          max="50"
          step="1"
          value={minCapacitance}
          onChange={(event) => setMinCapacitance(Number(event.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Maximum Capacitance: {maxCapacitance} pF
        </label>
        <input
          type="range"
          min="100"
          max="500"
          step="5"
          value={maxCapacitance}
          onChange={(event) => setMaxCapacitance(Number(event.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Inductance: {inductanceUh} uH
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="10"
          value={inductanceUh}
          onChange={(event) => setInductanceUh(Number(event.target.value))}
          className="w-full accent-orange-500"
        />
        <p className="mt-1 text-xs text-slate-500">LC tuning follows f = 1 / 2pi sqrt(LC).</p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Plate Count: {plateCount}
        </label>
        <select
          value={plateCount}
          onChange={(event) => setPlateCount(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {[3, 5, 7, 9, 11].map((value) => (
            <option key={value} value={value}>
              {value} plates
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">
          More plates usually allow a higher maximum capacitance.
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Tuning Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">f = 1 / 2pi sqrt(LC)</p>
        <p className="mt-1 text-lg font-bold text-slate-900">f = {frequencyLabel}</p>
      </div>
    </div>
  );
}
