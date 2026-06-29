"use client";

import { motion } from "framer-motion";

import { resistorTypeVisuals } from "./resistorTypeVisuals";
import type { ResistorType } from "./types";

export function ResistorVisual({
  selected,
  controlValue,
  environmentValue,
}: {
  selected: ResistorType;
  controlValue: number;
  environmentValue: number;
}) {
  const sensorEffect =
    selected.key === "thermistor" ? environmentValue : selected.key === "ldr" ? 100 - environmentValue : 50;
  const adjustedFlow =
    selected.category === "Variable" ? 100 - controlValue : selected.category === "Sensor" ? sensorEffect : 55;
  const flowLevel = Math.max(10, Math.min(adjustedFlow, 100));
  const particleCount = Math.round(4 + (flowLevel / 100) * 14);
  const speed = 2.2 - (flowLevel / 100) * 1.3;
  const heat = selected.power > 70 ? 0.65 : selected.key === "thermistor" ? environmentValue / 120 : 0.25;
  const SelectedVisual = resistorTypeVisuals[selected.key];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Interactive Resistor Type Visualizer</h2>
          <p className="text-xs text-slate-600">See how each resistor family behaves and where it is best used.</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">{selected.category}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 760 330" className="h-auto w-[760px] sm:w-full">
          <text x="380" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {selected.name} — {selected.valueLabel}
          </text>

          <line x1="55" y1="160" x2="170" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1="590" y1="160" x2="705" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

          <SelectedVisual
            selected={selected}
            controlValue={controlValue}
            environmentValue={environmentValue}
            heat={heat}
          />

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`${selected.key}-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M60 160 H700')" }}
            />
          ))}

          <text x="120" y="132" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Electron flow</text>
          <text x="640" y="132" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Output</text>
        </svg>
      </div>
    </div>
  );
}
