import { formatCapacitance } from "./logic";

type StructureFormulaCardProps = {
  capacitance: number;
};

export function StructureFormulaCard({
  capacitance,
}: StructureFormulaCardProps) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        Structure Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">C = er x e0 x A / d</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        C = {formatCapacitance(capacitance)}
      </p>
    </div>
  );
}
