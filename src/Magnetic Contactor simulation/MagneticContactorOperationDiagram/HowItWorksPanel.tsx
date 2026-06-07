"use client";

import React from "react";

export default function HowItWorksPanel() {
  const steps = [
    "Voltage applied to A1 and A2 coil terminals.",
    "Coil becomes an electromagnet.",
    "Magnetic field pulls the armature.",
    "Main contacts close and power passes to load.",
    "NO auxiliary contact closes, NC auxiliary contact opens.",
  ];

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-slate-800">
        How It Works
      </h3>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3 rounded-xl bg-slate-100 p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {index + 1}
            </div>
            <p className="text-sm font-medium text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}