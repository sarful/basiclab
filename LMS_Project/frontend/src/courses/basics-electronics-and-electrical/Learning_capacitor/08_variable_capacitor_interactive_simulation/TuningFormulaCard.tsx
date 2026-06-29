type TuningFormulaCardProps = {
  frequencyLabel: string;
};

export function TuningFormulaCard({
  frequencyLabel,
}: TuningFormulaCardProps) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        Tuning Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">f = 1 / 2pi sqrt(LC)</p>
      <p className="mt-1 text-lg font-bold text-slate-900">f = {frequencyLabel}</p>
    </div>
  );
}
