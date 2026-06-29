"use client";

import type { MeasuringResistanceMistakeBadge } from "../useMeasuringResistanceScenario";

export default function ResistanceSetupCoach({
  guidanceMessage,
  measuredDisplayValue,
  mistakeBadges,
}: {
  guidanceMessage: string;
  measuredDisplayValue: string;
  mistakeBadges: MeasuringResistanceMistakeBadge[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Setup Coach
      </p>
      <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
        Resistance Reading Board
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Live LCD
          </p>
          <p className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
            {measuredDisplayValue}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Scenario Guide
          </p>
          <p className="mt-2 text-[14px] leading-6 text-slate-700">
            {guidanceMessage}
          </p>
        </div>
      </div>

      {mistakeBadges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {mistakeBadges.map((badge) => (
            <div
              key={badge.text}
              className={`rounded-full border px-3 py-2 text-[12px] font-bold ${
                badge.tone === "danger"
                  ? "border-rose-300 bg-rose-50 text-rose-800"
                  : badge.tone === "warning"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-sky-300 bg-sky-50 text-sky-800"
              }`}
            >
              {badge.text}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
