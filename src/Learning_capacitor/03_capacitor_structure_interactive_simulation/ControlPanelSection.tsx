import { dielectricOptions, formatCapacitance } from "./logic";

type ControlPanelSectionProps = {
  plateArea: number;
  setPlateArea: (value: number) => void;
  plateDistance: number;
  setPlateDistance: (value: number) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  showField: boolean;
  setShowField: (value: boolean) => void;
  capacitance: number;
  resetStructure: () => void;
};

export function ControlPanelSection({
  plateArea,
  setPlateArea,
  plateDistance,
  setPlateDistance,
  dielectricIndex,
  setDielectricIndex,
  showField,
  setShowField,
  capacitance,
  resetStructure,
}: ControlPanelSectionProps) {
  const dielectric = dielectricOptions[dielectricIndex];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetStructure}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Plate Area: {plateArea} cm2
        </label>
        <input
          type="range"
          min="10"
          max="90"
          step="5"
          value={plateArea}
          onChange={(event) => setPlateArea(Number(event.target.value))}
          className="w-full accent-purple-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Larger plate area allows more stored charge.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Plate Distance: {plateDistance} mm
        </label>
        <input
          type="range"
          min="2"
          max="20"
          step="1"
          value={plateDistance}
          onChange={(event) => setPlateDistance(Number(event.target.value))}
          className="w-full accent-green-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          More spacing reduces capacitance.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Dielectric Material
        </label>
        <select
          value={dielectricIndex}
          onChange={(event) => setDielectricIndex(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {dielectricOptions.map((item, index) => (
            <option key={item.name} value={index}>
              {item.label} - k={item.k}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">{dielectric.note}</p>
      </div>

      <button
        onClick={() => setShowField(!showField)}
        className={`mb-5 w-full rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition ${
          showField ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-500 hover:bg-slate-600"
        }`}
      >
        {showField ? "Hide Electric Field" : "Show Electric Field"}
      </button>

      <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Structure Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">C = er x e0 x A / d</p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          C = {formatCapacitance(capacitance)}
        </p>
      </div>
    </div>
  );
}
