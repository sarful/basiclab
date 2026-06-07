import { codeOptions, dielectricOptions, formatNumber } from "./logic";

type ControlPanelSectionProps = {
  code: string;
  setCode: (value: string) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  appliedVoltage: number;
  setAppliedVoltage: (value: number) => void;
  voltageRating: number;
  setVoltageRating: (value: number) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  reactanceOhm: number;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  code,
  setCode,
  dielectricIndex,
  setDielectricIndex,
  appliedVoltage,
  setAppliedVoltage,
  voltageRating,
  setVoltageRating,
  frequency,
  setFrequency,
  reactanceOhm,
  resetSimulation,
}: ControlPanelSectionProps) {
  const dielectric = dielectricOptions[dielectricIndex];

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

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Capacitor Code
        </label>
        <select
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {codeOptions.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">
          Example: 104 = 10 x 10^4 pF = 100,000 pF = 100 nF.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Dielectric Class
        </label>
        <select
          value={dielectricIndex}
          onChange={(event) => setDielectricIndex(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white p-3"
        >
          {dielectricOptions.map((item, index) => (
            <option key={item.name} value={index}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">{dielectric.note}</p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Applied Voltage: {appliedVoltage}V
        </label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={appliedVoltage}
          onChange={(event) => setAppliedVoltage(Number(event.target.value))}
          className="w-full accent-orange-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Exceeding the rated voltage can damage the capacitor.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Voltage Rating: {voltageRating}V
        </label>
        <input
          type="range"
          min="6"
          max="100"
          step="1"
          value={voltageRating}
          onChange={(event) => setVoltageRating(Number(event.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          Signal Frequency: {frequency} Hz
        </label>
        <input
          type="range"
          min="10"
          max="100000"
          step="10"
          value={frequency}
          onChange={(event) => setFrequency(Number(event.target.value))}
          className="w-full accent-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Higher frequency reduces capacitive reactance.
        </p>
      </div>

      <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          Reactance Formula
        </p>
        <p className="mt-1 text-sm text-slate-700">Xc = 1 / 2pi f C</p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          Xc = {formatNumber(reactanceOhm, 2)} Ohm
        </p>
      </div>
    </div>
  );
}
