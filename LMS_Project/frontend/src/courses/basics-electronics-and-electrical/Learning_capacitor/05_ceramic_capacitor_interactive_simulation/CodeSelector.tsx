import { codeOptions } from "./logic";

type CodeSelectorProps = {
  code: string;
  setCode: (value: string) => void;
};

export function CodeSelector({ code, setCode }: CodeSelectorProps) {
  return (
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
  );
}
