import { formatNumber } from "./logic";

type WorkingFormulaCardProps = {
  timeConstant: number;
};

export function WorkingFormulaCard({
  timeConstant,
}: WorkingFormulaCardProps) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        Working Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">Vc = Vs x (1 - e^(-t/RC))</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        tau = {formatNumber(timeConstant, 3)} s
      </p>
    </div>
  );
}
