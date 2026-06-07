"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber, formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function ThermistorVisual({
  mode,
  temperature,
  resistance,
  voltage,
}: {
  mode: ThermistorMode;
  temperature: number;
  resistance: number;
  voltage: number;
}) {
  const current = voltage / Math.max(resistance, 1);
  const tempLevel = clamp(temperature / 120, 0, 1);
  const flowLevel = clamp(current / 0.02, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 18), 4), 22);
  const speed = Math.max(0.55, 2.4 - flowLevel * 1.5);
  const glow = mode === "ntc" ? tempLevel : clamp(1 - flowLevel + tempLevel * 0.2, 0.1, 1);
  const fanSpeed = tempLevel;
  const fanStatus = temperature > 85 ? "High Speed Cooling" : temperature > 55 ? "Medium Speed Cooling" : "Low / Standby Cooling";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Thermistor Behavior Visualizer</h2>
          <p className="text-xs text-slate-600">Change the temperature and watch the resistance and current respond in real time.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${mode === "ntc" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
          {mode.toUpperCase()} MODE
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="thermalGlow" x="-55%" y="-65%" width="220%" height="230%">
              <feGaussianBlur stdDeviation={4 + glow * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {mode === "ntc" ? "NTC: Temperature ↑ → Resistance ↓ → Current ↑" : "PTC: Temperature ↑ → Resistance ↑ → Current ↓"}
          </text>
          <text x="390" y="48" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
            Fan response follows temperature for cooling control
          </text>

          <rect x="42" y="114" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="150" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="87" y="176" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {voltage}V
          </text>

          <path d="M132 160 H218" stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d="M510 160 H655 V240 H87 V206" stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ scale: temperature > 85 ? [1, 1.03, 1] : 1 }} transition={{ repeat: Infinity, duration: 1 }}>
            <line x1="250" y1="160" x2="300" y2="160" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <line x1="430" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

            <rect x="300" y="128" width="130" height="64" fill="#ffffff" stroke="#111827" strokeWidth="4" filter="url(#thermalGlow)" />
            <path d="M288 205 L438 105" stroke={mode === "ntc" ? "#2563eb" : "#f97316"} strokeWidth="5" strokeLinecap="round" />
            <path d="M418 108 L438 108 L438 128" stroke={mode === "ntc" ? "#2563eb" : "#f97316"} strokeWidth="5" fill="none" strokeLinecap="round" />
            <text x="392" y="108" fill={mode === "ntc" ? "#2563eb" : "#f97316"} fontSize="14" fontWeight="800">
              {mode.toUpperCase()}
            </text>
            <text x="365" y="255" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="800">
              Real Thermistor Symbol
            </text>
            <text x="365" y="285" textAnchor="middle" fill="#64748b" fontSize="12">
              R = {formatResistance(resistance)}
            </text>
          </motion.g>

          <motion.g animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M315 92 C300 70 330 62 315 40" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M365 86 C350 64 380 56 365 34" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M415 92 C400 70 430 62 415 40" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`thermistor-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M87 206 V240 H655 V160 H510 H425 H305 H218 H132')" }}
            />
          ))}

          <g transform="translate(620 72)">
            <circle cx="45" cy="45" r="38" fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
            <motion.path
              d="M45 45 L45 15 M45 45 L75 45 M45 45 L25 72"
              stroke="#0891b2"
              strokeWidth="5"
              strokeLinecap="round"
              animate={{ rotate: fanSpeed * 720 }}
              transition={{ repeat: Infinity, duration: Math.max(0.35, 1.8 - fanSpeed), ease: "linear" }}
              style={{ transformOrigin: "45px 45px" }}
            />
            <text x="45" y="-20" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
              Fan response
            </text>
            <text x="45" y="-2" textAnchor="middle" fill="#64748b" fontSize="10">
              {fanStatus}
            </text>
          </g>

          <text x="180" y="135" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            Electron flow
          </text>
          <text x="580" y="135" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Current output
          </text>

          <g transform="translate(145 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Temperature
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#ef4444" animate={{ width: 150 * tempLevel }} />
          </g>
          <g transform="translate(315 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Current Flow
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#0ea5e9" animate={{ width: 150 * flowLevel }} />
          </g>
          <g transform="translate(485 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Heat Stress
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#f97316" animate={{ width: 150 * glow }} />
          </g>
        </svg>
      </div>
    </div>
  );
}
