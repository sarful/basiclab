import { formatNumber } from "./logic";

type ReactanceFormulaCardProps = {
  reactanceOhm: number;
};

export function ReactanceFormulaCard({
  reactanceOhm,
}: ReactanceFormulaCardProps) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
        Reactance Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">Xc = 1 / 2pi f C</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        Xc = {formatNumber(reactanceOhm, 2)} Ohm
      </p>
    </div>
  );
}
