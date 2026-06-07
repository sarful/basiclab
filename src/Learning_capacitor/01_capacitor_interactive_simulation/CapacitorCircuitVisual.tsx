"use client";

import { motion } from "framer-motion";

import { clamp, formatCapacitance, formatCurrent, formatNumber, formatResistance } from "./logic";
import type { CircuitMode } from "./types";

type CapacitorCircuitVisualProps = {
  supplyVoltage: number;
  resistance: number;
  capacitance: number;
  chargeLevel: number;
  capacitorVoltage: number;
  current: number;
  mode: CircuitMode;
  timeConstant: number;
};

export function CapacitorCircuitVisual({
  supplyVoltage,
  resistance,
  capacitance,
  chargeLevel,
  capacitorVoltage,
  current,
  mode,
  timeConstant,
}: CapacitorCircuitVisualProps) {
  const flowLevel = clamp(
    Math.abs(current) / Math.max(supplyVoltage / resistance, 0.000001),
    0.08,
    1,
  );
  const wireWidth = 5 + flowLevel * 6;
  const electronSpeed = Math.max(0.7, 2.8 - flowLevel * 1.8);
  const electronCount = Math.min(Math.max(Math.round(flowLevel * 18), 5), 18);
  const plateGlow = clamp(chargeLevel, 0.12, 1);
  const fieldLines = Math.min(Math.max(Math.round(chargeLevel * 12), 3), 12);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Capacitor Charge & Discharge Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            A capacitor stores energy as an electric field between two plates. The
            animated dots show how charge movement changes over time.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            mode === "charge"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {mode === "charge" ? "CHARGING MODE" : "DISCHARGING MODE"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="capacitorGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + plateGlow * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text
            x="420"
            y="28"
            textAnchor="middle"
            fill="#334155"
            fontSize="14"
            fontWeight="800"
          >
            Electron flow: negative terminal to resistor to negative plate |
            Conventional current is opposite
          </text>

          <rect
            x="42"
            y="156"
            width="90"
            height="96"
            rx="14"
            fill="#0f172a"
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <text x="87" y="193" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="87" y="220" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {supplyVoltage}V
          </text>
          <text x="87" y="272" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            Supply
          </text>
          <text x="139" y="177" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="900">
            -
          </text>
          <text x="87" y="259" textAnchor="middle" fill="#f97316" fontSize="16" fontWeight="900">
            +
          </text>

          <path d="M132 186 H230" stroke="#64748b" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />
          <path d="M512 186 H650" stroke="#64748b" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />
          <path
            d="M650 186 V340 H87 V252"
            stroke="#64748b"
            strokeWidth={wireWidth}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
          />

          <motion.rect
            x="240"
            y="160"
            width="150"
            height="52"
            rx="28"
            fill={flowLevel > 0.45 ? "#fb923c" : "#f2c879"}
            stroke="#111827"
            strokeWidth="3"
            animate={{ opacity: [0.92, 1, 0.92] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <rect x="265" y="160" width="9" height="52" fill="#ef4444" />
          <rect x="305" y="160" width="9" height="52" fill="#111827" />
          <rect x="344" y="160" width="9" height="52" fill="#f59e0b" />
          <text x="315" y="146" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
            R
          </text>
          <text x="315" y="230" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            {formatResistance(resistance)}
          </text>

          <path d="M390 186 H440" stroke="#64748b" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />
          <rect x="440" y="105" width="14" height="162" rx="5" fill="#2563eb" filter="url(#capacitorGlow)" />
          <rect x="498" y="105" width="14" height="162" rx="5" fill="#ef4444" filter="url(#capacitorGlow)" />
          <text
            x="476"
            y="88"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="800"
          >
            C = {formatCapacitance(capacitance)}
          </text>
          <text
            x="476"
            y="290"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="700"
          >
            Vc = {formatNumber(capacitorVoltage, 2)}V
          </text>

          {Array.from({ length: fieldLines }).map((_, index) => {
            const y = 120 + index * 12;
            return (
              <motion.g key={`field-${index}`}>
                <line x1="458" y1={y} x2="493" y2={y} stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                <polygon points={`493,${y} 486,${y - 4} 486,${y + 4}`} fill="#8b5cf6" />
              </motion.g>
            );
          })}

          <text x="420" y="126" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">
            -
          </text>
          <text x="535" y="126" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900">
            +
          </text>
          <text x="420" y="252" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">
            Negative plate
          </text>
          <text x="545" y="252" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900">
            Positive plate
          </text>

          {Array.from({ length: electronCount }).map((_, eIndex) => (
            <motion.circle
              key={`electron-${eIndex}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: electronSpeed,
                repeat: Infinity,
                ease: "linear",
                delay: eIndex * (electronSpeed / electronCount),
              }}
              style={{
                offsetPath:
                  mode === "charge"
                    ? "path('M132 186 H230 H390 H440')"
                    : "path('M440 186 H390 H230 H132 V252 H87')",
              }}
            />
          ))}

          <text x="265" y="78" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            {mode === "charge"
              ? "Electron flow to negative plate ->"
              : "Electron flow leaves negative plate ->"}
          </text>
          <text x="610" y="78" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Current magnitude = {formatCurrent(Math.abs(current))}
          </text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Capacitor Charge Level
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * chargeLevel }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              {formatNumber(chargeLevel * 100, 1)}% charged
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Capacitance Meaning
          </p>
          <p className="mt-1 text-sm text-slate-700">
            More capacitance lets the component store more charge at the same voltage.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            C = {formatCapacitance(capacitance)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Time Constant
          </p>
          <p className="mt-1 text-sm text-slate-700">tau = R x C</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            tau = {formatNumber(timeConstant, 3)} s
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Stored Voltage
          </p>
          <p className="mt-1 text-sm text-slate-700">
            During charging, capacitor voltage rises gradually toward the supply.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Vc = {formatNumber(capacitorVoltage, 2)}V
          </p>
        </div>
      </div>
    </div>
  );
}
