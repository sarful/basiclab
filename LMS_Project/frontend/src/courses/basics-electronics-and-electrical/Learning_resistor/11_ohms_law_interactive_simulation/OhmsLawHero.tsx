"use client";

export function OhmsLawHero({
  statusLabel,
  statusTone,
}: {
  statusLabel: string;
  statusTone: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 shadow-xl sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">
            Industrial Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ohm&apos;s Law Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Solve V, I, and R with a live graph, LED load, and animated circuit flow.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-50 px-4 py-3 text-left sm:px-5 sm:text-right">
          <p className="text-xs text-blue-500">System Status</p>
          <p className={`text-lg font-bold ${statusTone}`}>{statusLabel}</p>
        </div>
      </div>
    </div>
  );
}
