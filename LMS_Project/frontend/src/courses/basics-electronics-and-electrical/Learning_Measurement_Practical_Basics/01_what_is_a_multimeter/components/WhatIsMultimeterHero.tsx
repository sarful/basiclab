"use client";

function QuickFactCard({
  accentClassName,
  label,
  value,
}: {
  accentClassName: string;
  label: string;
  value: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accentClassName}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function WhatIsMultimeterHero() {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Measurement Practical Basics
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            What is a Multimeter
          </h1>
          <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
            A multimeter is a single tool that helps a beginner check electrical values before touching real hardware blindly.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            In this lesson, we focus on the four beginner jobs: measuring voltage, measuring current, measuring resistance, and diode-style checking.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <QuickFactCard
            accentClassName="border-blue-200 bg-blue-50 text-blue-900"
            label="Black Lead"
            value="COM"
          />
          <QuickFactCard
            accentClassName="border-amber-200 bg-amber-50 text-amber-900"
            label="Beginner Rule"
            value="Match the dial to the task"
          />
        </div>
      </div>
    </section>
  );
}
