"use client";

const focusAreas = [
  {
    description: "Later we can add wrong-mode demos that show why measuring resistance on a live source is unsafe.",
    title: "Unsafe Mode Scenarios",
  },
  {
    description: "This section can host a source diagram with highlighted danger zones, exposed terminals, and safe probe order.",
    title: "Circuit Hazard Map",
  },
  {
    description: "A final pass can score whether the learner powered down first, selected the correct family, and used the right jack.",
    title: "Safety Coaching Logic",
  },
] as const;

export default function BasicCircuitSafetyFocusGrid() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Next Build Sections
      </p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {focusAreas.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <h4 className="text-[15px] font-black tracking-tight text-slate-950">
              {item.title}
            </h4>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
