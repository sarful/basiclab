"use client";

export function MetricCard({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600 sm:text-xs sm:tracking-[0.22em]">{label}</p>
      <div className="mt-2 flex items-end gap-1 sm:gap-2">
        <p className={`text-2xl font-bold sm:text-3xl ${tone}`}>{value}</p>
        <p className="pb-1 text-xs text-slate-600 sm:text-sm">{unit}</p>
      </div>
    </div>
  );
}
