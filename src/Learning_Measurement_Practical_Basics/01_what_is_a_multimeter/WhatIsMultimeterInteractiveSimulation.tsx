"use client";

import { DigitalMultimeterSimulator } from "./image_to_component_workspace";

export default function WhatIsMultimeterInteractiveSimulation() {
  return (
    <div className="space-y-4">
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
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">Black Lead</p>
              <p className="mt-1 text-2xl font-semibold text-blue-900">COM</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-700">Beginner Rule</p>
              <p className="mt-1 text-lg font-semibold text-amber-900">Match the dial to the task</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <div>
          <DigitalMultimeterSimulator />
        </div>
      </section>
    </div>
  );
}
