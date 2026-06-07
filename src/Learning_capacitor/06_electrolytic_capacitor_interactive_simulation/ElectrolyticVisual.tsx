"use client";

import { motion } from "framer-motion";

import { clamp, formatCapacitance, formatNumber } from "./logic";
import type { PolarityMode } from "./types";

type ElectrolyticVisualProps = {
  capacitance: number;
  voltageRating: number;
  appliedVoltage: number;
  esr: number;
  rippleCurrent: number;
  polarity: PolarityMode;
};

export function ElectrolyticVisual({
  capacitance,
  voltageRating,
  appliedVoltage,
  esr,
  rippleCurrent,
  polarity,
}: ElectrolyticVisualProps) {
  const voltageStress = appliedVoltage / voltageRating;
  const overVoltage = appliedVoltage > voltageRating;
  const recommendedStress = voltageStress <= 0.8;
  const isSafe = polarity === "correct" && !overVoltage;
  const dangerLevel =
    polarity === "reverse" ? 1 : overVoltage ? 0.9 : clamp((voltageStress - 0.8) / 0.2, 0, 1);
  const smoothingLevel = clamp((capacitance / 1000) * (1 / Math.max(esr, 0.05)) * 0.12, 0.08, 1);
  const heatLevel = clamp((rippleCurrent * rippleCurrent * esr) / 2, 0, 1);
  const electronCount = Math.min(Math.max(Math.round(smoothingLevel * 16), 4), 16);
  const electronDuration = Math.max(0.65, 2.5 - smoothingLevel * 1.4);
  const canFill =
    polarity === "reverse" ? "#fee2e2" : overVoltage ? "#ffedd5" : "#e2e8f0";
  const statusText =
    polarity === "reverse"
      ? "REVERSE POLARITY DANGER"
      : overVoltage
        ? "OVER-VOLTAGE WARNING"
        : recommendedStress
          ? "SAFE OPERATING REGION"
          : "LOW VOLTAGE MARGIN";
  const statusClass =
    polarity === "reverse" || overVoltage
      ? "bg-red-100 text-red-700"
      : recommendedStress
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Electrolytic Capacitor Visualizer</h2>
          <p className="text-xs text-slate-600">
            A real electrolytic capacitor is polarized: the long lead is usually
            positive and the body stripe marks the negative terminal.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>
          {statusText}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <linearGradient id="canGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="18%" stopColor="#f8fafc" />
              <stop offset="42%" stopColor={canFill} />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <filter id="electrolyticGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + (dangerLevel + heatLevel) * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Real body view: cylindrical aluminum can | Negative stripe | Long lead = positive
          </text>

          <rect x="55" y="158" width="100" height="94" rx="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="105" y="194" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="800">DC</text>
          <text x="105" y="220" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{appliedVoltage}V</text>
          <text x="158" y="178" fill="#f97316" fontSize="18" fontWeight="900">+</text>
          <text x="103" y="258" fill="#38bdf8" fontSize="18" fontWeight="900">-</text>

          <path d="M155 185 H292" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
          <path d="M548 185 H706 V335 H105 V252" stroke="#64748b" strokeWidth="9" strokeLinecap="square" strokeLinejoin="round" fill="none" />

          <motion.g
            filter="url(#electrolyticGlow)"
            animate={{ opacity: [0.94, 1, 0.94] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            <rect x="292" y="104" width="256" height="174" rx="30" fill="url(#canGradient)" stroke={polarity === "reverse" || overVoltage ? "#ef4444" : "#111827"} strokeWidth="4" />
            <ellipse cx="292" cy="191" rx="28" ry="87" fill="#e5e7eb" stroke="#334155" strokeWidth="4" />
            <ellipse cx="548" cy="191" rx="28" ry="87" fill="#94a3b8" stroke="#334155" strokeWidth="4" />
            <rect x="486" y="112" width="36" height="158" rx="10" fill="#1e293b" opacity="0.92" />
            {Array.from({ length: 7 }).map((_, i) => (
              <text key={`minus-${i}`} x="504" y={132 + i * 20} textAnchor="middle" fill="white" fontSize="15" fontWeight="900">-</text>
            ))}
          </motion.g>

          <path d="M292 185 H242" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
          <path d="M548 185 H596" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
          <text x="242" y="174" textAnchor="middle" fill="#f97316" fontSize="14" fontWeight="900">long + lead</text>
          <text x="602" y="174" textAnchor="middle" fill="#0284c7" fontSize="14" fontWeight="900">short - lead</text>

          <text x="420" y="160" textAnchor="middle" fill="#111827" fontSize="32" fontWeight="900">{formatCapacitance(capacitance)}</text>
          <text x="420" y="192" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="900">{voltageRating}V</text>
          <text x="420" y="222" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">Aluminum electrolytic</text>
          <text x="420" y="244" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="800">ESR = {esr} Ohm</text>

          <text x="220" y="145" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="800">Positive supply -> + lead</text>
          <text x="645" y="145" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="800">Negative stripe marks - side</text>

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`electron-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronDuration, repeat: Infinity, ease: "linear", delay: index * (electronDuration / electronCount) }}
              style={{
                offsetPath:
                  polarity === "correct"
                    ? "path('M105 252 V335 H706 V185 H548')"
                    : "path('M105 252 V335 H706 V185 H548 H292')",
              }}
            />
          ))}

          {(polarity === "reverse" || overVoltage) && (
            <motion.g animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <polygon points="420,52 454,106 386,106" fill="#ef4444" />
              <text x="420" y="94" textAnchor="middle" fill="white" fontSize="28" fontWeight="900">!</text>
              <text x="420" y="124" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="900">
                {polarity === "reverse"
                  ? "Reverse polarity can heat, leak, vent, or explode"
                  : "Applied voltage exceeds capacitor rating"}
              </text>
            </motion.g>
          )}

          <text x="420" y="318" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
            Applied: {appliedVoltage}V | Rating: {voltageRating}V | Margin: {formatNumber(voltageRating - appliedVoltage, 1)}V
          </text>

          <g transform="translate(150 382)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Power Supply Ripple Smoothing</text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#22c55e" animate={{ width: 540 * smoothingLevel }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">Large C + low ESR = better bulk smoothing</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Polarity Rule</p>
          <p className="mt-1 text-sm text-slate-700">
            The long lead is usually positive and the body stripe usually marks the negative terminal.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{isSafe ? "Safe connection" : "Check connection"}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">High Capacitance</p>
          <p className="mt-1 text-sm text-slate-700">
            Thin oxide dielectric and electrolyte allow high capacitance in a compact size.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCapacitance(capacitance)}</p>
        </div>
        <div className={`rounded-2xl p-4 ring-1 ${overVoltage ? "bg-red-50 ring-red-100" : "bg-green-50 ring-green-100"}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${overVoltage ? "text-red-700" : "text-green-700"}`}>Voltage Rating</p>
          <p className="mt-1 text-sm text-slate-700">
            Applied voltage must stay below the rated voltage. A 20% margin is a good practice.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{overVoltage ? "Over rating!" : `${voltageRating}V rated`}</p>
        </div>
      </div>
    </div>
  );
}
