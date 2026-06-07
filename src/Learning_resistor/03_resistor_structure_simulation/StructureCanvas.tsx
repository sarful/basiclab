"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatResistance } from "./logic";
import type { MaterialSpec, StructureMode } from "./types";

export function StructureCanvas({
  mode,
  material,
  voltage,
  baseResistance,
  temperature,
  rotation,
}: {
  mode: StructureMode;
  material: MaterialSpec;
  voltage: number;
  baseResistance: number;
  temperature: number;
  rotation: number;
}) {
  const thermalFactor = 1 + (temperature - 25) * 0.004;
  const resistance = baseResistance * material.resistanceFactor * thermalFactor;
  const current = voltage / Math.max(resistance, 1);
  const power = current * voltage;
  const heatLevel = clamp(power * material.heatFactor * 0.14 + temperature / 180, 0.08, 1);
  const currentLevel = clamp(current / 0.08, 0.08, 1);
  const cutaway = mode !== "assembled";
  const exploded = mode === "exploded";
  const bodyY = exploded ? 96 : 136;
  const coreY = exploded ? 206 : 154;
  const filmY = exploded ? 272 : 154;
  const risk = heatLevel > 0.78;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Resistor Internal Structure Visualizer</h2>
          <p className="text-xs text-slate-600">
            Observe the shell, ceramic core, and resistive layer while heat and current change together.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${risk ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
          {risk ? "THERMAL STRESS" : mode.toUpperCase()}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 820 430" className="h-auto w-[820px] sm:w-full">
          <defs>
            <linearGradient id="shellGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6dba4" />
              <stop offset="55%" stopColor={heatLevel > 0.64 ? "#fb923c" : "#e7c27d"} />
              <stop offset="100%" stopColor={heatLevel > 0.82 ? "#ef4444" : "#c98e47"} />
            </linearGradient>
          </defs>

          <text x="410" y="34" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            R = ρL / A | Current increases when resistance drops | Heat rises with power
          </text>

          <line x1="86" y1="190" x2="220" y2="190" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1="600" y1="190" x2="734" y2="190" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

          <motion.g
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{ transformOrigin: "410px 190px" }}
          >
            <rect x="220" y={bodyY} width="380" height="108" rx="54" fill="url(#shellGradient)" stroke="#0f172a" strokeWidth="4" opacity={cutaway ? 0.38 : 1} />
            <rect x="250" y={coreY} width="320" height="72" rx="36" fill="#f8fafc" stroke="#475569" strokeWidth="3" opacity={cutaway ? 1 : 0.18} />
            <rect x="280" y={filmY} width="260" height="36" rx="18" fill={material.shellColor} stroke={material.shellColor} strokeDasharray="8 7" strokeWidth="2" opacity={cutaway ? 0.78 : 0.24} />

            {material.key === "metal-film" && (
              <path
                d={`M295 ${filmY + 18} H325 L345 ${filmY + 4} L365 ${filmY + 32} L385 ${filmY + 4} L405 ${filmY + 32} L425 ${filmY + 4} L445 ${filmY + 32} L465 ${filmY + 4} L485 ${filmY + 32} L510 ${filmY + 18}`}
                fill="none"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}

            {material.key === "wire-wound" && (
              <path
                d={`M292 ${filmY + 18} C308 ${filmY - 10} 326 ${filmY + 46} 344 ${filmY + 18} C362 ${filmY - 10} 380 ${filmY + 46} 398 ${filmY + 18} C416 ${filmY - 10} 434 ${filmY + 46} 452 ${filmY + 18} C470 ${filmY - 10} 488 ${filmY + 46} 508 ${filmY + 18}`}
                fill="none"
                stroke={material.shellColor}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}

            <rect x="268" y={bodyY} width="16" height="108" fill="#ef4444" />
            <rect x="336" y={bodyY} width="16" height="108" fill="#111827" />
            <rect x="452" y={bodyY} width="16" height="108" fill="#f59e0b" />
            <rect x="536" y={bodyY} width="16" height="108" fill="#d4af37" />

            <text x="410" y={filmY + 8} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="800">
              Resistive path / current-limiting layer
            </text>
          </motion.g>

          {Array.from({ length: Math.round(currentLevel * 20) }).map((_, index) => {
            const startX = 94 + index * 32;
            return (
              <motion.circle
                key={`electron-${index}`}
                cx={startX}
                cy={190}
                r={4}
                fill="#0ea5e9"
                animate={{ x: [0, 560], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.1, delay: index * 0.09, repeat: Infinity, ease: "linear" }}
              />
            );
          })}

          {Array.from({ length: 10 }).map((_, index) => {
            const x = 300 + index * 24;
            const y = index % 2 === 0 ? 164 : 214;
            return (
              <motion.g key={`collision-${index}`} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ repeat: Infinity, duration: 1 + index * 0.07 }}>
                <circle cx={x} cy={y} r={4 + heatLevel * 4} fill="#fb923c" opacity="0.45" />
                <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.5" />
                <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.5" />
              </motion.g>
            );
          })}

          <motion.g animate={{ opacity: [0.15, 1, 0.15] }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M320 112 C306 90 330 78 318 56" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M412 112 C398 90 422 78 410 56" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M504 112 C490 90 514 78 502 56" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          <text x="148" y="160" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Input lead</text>
          <text x="670" y="160" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Output lead</text>
          <text x="410" y="328" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="800">
            R = {formatResistance(resistance)} | I = {formatCurrent(current)} | T = {temperature}°C
          </text>

          <g transform="translate(110 354)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Current Density</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <rect x="0" y="12" width={150 * currentLevel} height="10" rx="5" fill="#0ea5e9" />
          </g>
          <g transform="translate(318 354)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Collision / Resistance</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <rect x="0" y="12" width={150 * clamp(resistance / 5000, 0, 1)} height="10" rx="5" fill="#f59e0b" />
          </g>
          <g transform="translate(540 354)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Thermal Stress</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <rect x="0" y="12" width={150 * heatLevel} height="10" rx="5" fill={risk ? "#dc2626" : "#ef4444"} />
          </g>
        </svg>
      </div>
    </div>
  );
}
