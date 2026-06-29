"use client";

const checklist = [
  "Confirm the circuit type before selecting the meter mode.",
  "Look for exposed conductors, loose terminals, or damaged insulation.",
  "Verify the meter lead jacks before touching any node.",
  "Remove power before resistance or continuity testing.",
] as const;

export default function BasicCircuitSafetyReadinessChecklist() {
  return (
    <aside className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Readiness Checklist
      </p>
      <h3 className="mt-2 text-[1.35rem] font-black tracking-tight text-slate-950">
        Safe Workflow Order
      </h3>

      <div className="mt-4 space-y-3">
        {checklist.map((item, index) => (
          <div
            key={item}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-black text-white">
              {index + 1}
            </div>
            <p className="text-[14px] leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
