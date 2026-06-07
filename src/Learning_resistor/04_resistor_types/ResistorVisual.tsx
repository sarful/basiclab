"use client";

import { motion } from "framer-motion";

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

          {selected.key === "potentiometer" ? (
            <g>
              <rect x="220" y="118" width="320" height="70" rx="35" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
              <line x1="250" y1="153" x2="510" y2="153" stroke={selected.color} strokeWidth="14" strokeLinecap="round" />
              <motion.line
                x1={250 + (controlValue / 100) * 260}
                y1="92"
                x2={250 + (controlValue / 100) * 260}
                y2="153"
                stroke="#111827"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <motion.circle cx={250 + (controlValue / 100) * 260} cy="86" r="16" fill={selected.color} />
              <text x="380" y="220" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
                Wiper position: {controlValue}%
              </text>
            </g>
          ) : (
            <motion.g animate={{ scale: selected.key === "wireWound" && heat > 0.5 ? [1, 1.02, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <rect x="190" y="115" width="380" height="90" rx="45" fill="#f2c879" stroke="#111827" strokeWidth="3" />
              <rect x="222" y="134" width="316" height="52" rx="26" fill={selected.color} opacity="0.22" stroke={selected.color} strokeDasharray="6 6" />

              {selected.key === "wireWound" && (
                <path d="M235 160 C250 125 270 195 290 160 C310 125 330 195 350 160 C370 125 390 195 410 160 C430 125 450 195 470 160 C490 125 510 195 530 160" fill="none" stroke={selected.color} strokeWidth="6" strokeLinecap="round" />
              )}

              {selected.key === "thermistor" && (
                <motion.g animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <path d="M300 104 C286 82 314 74 300 52" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M380 104 C366 82 394 74 380 52" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M460 104 C446 82 474 74 460 52" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                </motion.g>
              )}

              {selected.key === "ldr" && (
                <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  <line x1="280" y1="70" x2="330" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <line x1="380" y1="60" x2="410" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <line x1="500" y1="70" x2="465" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
              )}

              <rect x="245" y="115" width="13" height="90" fill="#ef4444" />
              <rect x="300" y="115" width="13" height="90" fill="#111827" />
              <rect x="355" y="115" width="13" height="90" fill="#f59e0b" />
              <rect x="500" y="115" width="13" height="90" fill="#d4af37" />
            </motion.g>
          )}

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
