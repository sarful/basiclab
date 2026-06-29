import { esrOptions } from "./logic";

type EsrSelectorProps = {
  esr: number;
  setEsr: (value: number) => void;
};

export function EsrSelector({ esr, setEsr }: EsrSelectorProps) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        ESR: {esr} Ohm
      </label>
      <select
        value={esr}
        onChange={(event) => setEsr(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {esrOptions.map((value) => (
          <option key={value} value={value}>
            {value} Ohm
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-500">
        Lower ESR reduces heating and improves ripple smoothing.
      </p>
    </div>
  );
}
