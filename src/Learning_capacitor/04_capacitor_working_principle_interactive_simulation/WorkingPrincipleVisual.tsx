"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatNumber } from "./logic";
import type { WorkingMode } from "./types";

type WorkingPrincipleVisualProps = {
  supplyVoltage: number;
  resistance: number;
  capacitance: number;
  timeConstant: number;
  chargeRatio: number;
  capacitorVoltage: number;
  current: number;
  mode: WorkingMode;
};

export function WorkingPrincipleVisual({
  supplyVoltage,
  resistance,
  capacitance,
  timeConstant,
  chargeRatio,
  capacitorVoltage,
  current,
  mode,
}: WorkingPrincipleVisualProps) {
  const currentLevel = clamp(
    Math.abs(current) / Math.max(supplyVoltage / resistance, 0.000001),
    0.08,
    1,
  );
  const electronCount = Math.min(Math.max(Math.round(currentLevel * 20), 4), 22);
  const fieldCount = Math.min(Math.max(Math.round(chargeRatio * 14), 3), 14);
  const electronDuration = Math.max(0.55, 2.8 - currentLevel * 1.8);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Capacitor Working Principle Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            During charging, a capacitor stores energy by building an electric field.
            During discharge, that stored energy returns to the circuit.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            mode === "charging"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {mode === "charging" ? "CHARGING PROCESS" : "DISCHARGING PROCESS"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="workingGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={4 + currentLevel * 7} result="blur" />
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
            Electron flow creates charge separation - Electric field stores energy
          </text>

          <rect
            x="40"
            y="160"
            width="90"
            height="90"
            rx="14"
            fill="#0f172a"
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <text x="85" y="194" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="85" y="220" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {supplyVoltage}V
          </text>

          <text x="135" y="180" fill="#38bdf8" fontSize="16" fontWeight="900">
            -
          </text>
          <text x="82" y="255" fill="#f97316" fontSize="16" fontWeight="900">
            +
          </text>

          <path d="M130 185 H240" stroke="#64748b" strokeWidth={5 + currentLevel * 6} fill="none" strokeLinecap="round" />

          <motion.rect
            x="240"
            y="160"
            width="150"
            height="50"
            rx="28"
            fill={currentLevel > 0.45 ? "#fb923c" : "#f2c879"}
            stroke="#111827"
            strokeWidth="3"
            animate={{ opacity: [0.94, 1, 0.94] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          <text
            x="315"
            y="145"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="800"
          >
            R = {resistance} Ohm
          </text>

          <path d="M390 185 H450" stroke="#64748b" strokeWidth={5 + currentLevel * 6} fill="none" strokeLinecap="round" />

          <motion.rect
            x="460"
            y="100"
            width="14"
            height="170"
            rx="5"
            fill="#2563eb"
            filter="url(#workingGlow)"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />

          <motion.rect
            x="520"
            y="100"
            width="14"
            height="170"
            rx="5"
            fill="#ef4444"
            filter="url(#workingGlow)"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />

          <path d="M534 185 H680 V340 H85 V250" stroke="#64748b" strokeWidth={5 + currentLevel * 6} fill="none" strokeLinecap="square" strokeLinejoin="round" />

          <text x="497" y="84" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="900">
            C = {capacitance} uF
          </text>

          {Array.from({ length: fieldCount }).map((_, index) => {
            const y = 118 + index * 10;

            return (
              <motion.g key={`field-${index}`}>
                <line x1="480" y1={y} x2="515" y2={y} stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                <polygon points={`515,${y} 508,${y - 4} 508,${y + 4}`} fill="#8b5cf6" />
              </motion.g>
            );
          })}

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`electron-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: electronDuration,
                repeat: Infinity,
                ease: "linear",
                delay: index * (electronDuration / electronCount),
              }}
              style={{
                offsetPath:
                  mode === "charging"
                    ? "path('M130 185 H240 H390 H460')"
                    : "path('M460 185 H390 H240 H130 V250 H85')",
              }}
            />
          ))}

          <text x="270" y="82" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            {mode === "charging"
              ? "Electron flows to negative plate ->"
              : "Stored electrons return to circuit ->"}
          </text>

          <text x="610" y="82" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Current = {formatCurrent(current)}
          </text>

          <text x="430" y="290" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">
            Negative Plate
          </text>
          <text x="565" y="290" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900">
            Positive Plate
          </text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Stored Energy Level
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * chargeRatio }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              Electric field strength increases with stored charge
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Charge Separation
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Electrons gather on one plate while the other plate loses electrons.
            That creates a potential difference.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Vc = {formatNumber(capacitorVoltage, 2)}V
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Electric Field
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The electric field between the plates stores the energy.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            tau = {formatNumber(timeConstant, 3)} s
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Current Behavior
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Current starts high during charging, then gradually drops.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            I = {formatCurrent(current)}
          </p>
        </div>
      </div>
    </div>
  );
}
