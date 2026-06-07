type StatCardProps = {
  label: string;
  value: string;
  tone: string;
};

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
