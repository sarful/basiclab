type MetricCardProps = {
  label: string;
  value: string;
  unit: string;
  tone: string;
};

export default function MetricCard({
  label,
  value,
  unit,
  tone,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-2">
        <p className={`text-xl font-bold sm:text-3xl ${tone}`}>{value}</p>
        <p className="pb-1 text-sm text-slate-500">{unit}</p>
      </div>
    </div>
  );
}
