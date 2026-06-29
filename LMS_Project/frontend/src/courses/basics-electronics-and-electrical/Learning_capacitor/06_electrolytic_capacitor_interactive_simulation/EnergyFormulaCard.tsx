import { formatEnergy } from "./logic";

type EnergyFormulaCardProps = {
  storedEnergy: number;
};

export function EnergyFormulaCard({
  storedEnergy,
}: EnergyFormulaCardProps) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
        Energy Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">E = 1/2 C V^2</p>
      <p className="mt-1 text-lg font-bold text-slate-900">E = {formatEnergy(storedEnergy)}</p>
    </div>
  );
}
