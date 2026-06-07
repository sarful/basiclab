"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatNumber, formatResistance, getSafeLedStatus } from "./logic";
import type { LedOption } from "./types";

export function CircuitDiagram({
  voltage,
  resistance,
  current,
  ledBrightness,
  led,
}: {
  voltage: number;
  resistance: number;
  current: number;
  ledBrightness: number;
  led: LedOption;
}) {
  const currentLevel = clamp(current / 0.08, 0, 1);
  const heatLevel = clamp((current * current * resistance) / 2, 0, 1);
  const wireWidth = 4 + currentLevel * 5;
  const particleCount = Math.min(Math.max(Math.round(currentLevel * 18), 4), 22);
  const electronSpeed = Math.max(0.5, 2.3 - currentLevel * 1.65);
  const collisionCount = Math.min(Math.max(Math.round(resistance / 85), 3), 11);
  const resistorShake = heatLevel > 0.7 ? 1.6 : heatLevel > 0.4 ? 0.7 : 0;
  const ledStatus = getSafeLedStatus(current, led.safeCurrentMa);
  const showBurnWarning = ledStatus.label === "UNSAFE" || ledStatus.label === "CAUTION";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Industrial Circuit View</h2>
          <p className="text-xs text-slate-600">Electron flow is shown from the negative terminal through the load path.</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-green-600">LIVE FLOW + STRUCTURE</span>
      </div>

      <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe horizontally to view full circuit.</p>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <svg viewBox="0 0 760 330" className="h-auto w-[760px] overflow-visible rounded-2xl bg-white sm:w-full">
          <defs>
            <linearGradient id="resistorBodyCircuit" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="48%" stopColor={heatLevel > 0.55 ? "#fb923c" : "#f2c879"} />
              <stop offset="100%" stopColor={heatLevel > 0.82 ? "#ef4444" : "#d6a35f"} />
            </linearGradient>
            <filter id="ledGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={8 + ledBrightness * 14} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="resistorHeatGlowCircuit" x="-45%" y="-60%" width="190%" height="220%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="380" y="24" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            Electron flow is shown from negative terminal to positive terminal
          </text>

          <rect x="35" y="88" width="90" height="92" rx="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="80" y="124" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="700">
            DC
          </text>
          <text x="80" y="150" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="700">
            {formatNumber(voltage, 2)}V
          </text>
          <text x="80" y="198" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            POWER SOURCE
          </text>
          <line x1="62" y1="77" x2="62" y2="57" stroke="#22c55e" strokeWidth="4" />
          <line x1="98" y1="77" x2="98" y2="57" stroke="#ef4444" strokeWidth="4" />
          <text x="62" y="47" textAnchor="middle" fill="#22c55e" fontSize="12">
            -
          </text>
          <text x="98" y="47" textAnchor="middle" fill="#ef4444" fontSize="12">
            +
          </text>

          <path d="M125 134 H202" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />

          <motion.g animate={{ x: [0, resistorShake, -resistorShake, 0] }} transition={{ repeat: Infinity, duration: 0.22 }}>
            <rect x="202" y="92" width="230" height="84" rx="42" fill="url(#resistorBodyCircuit)" stroke="#111827" strokeWidth="3" filter="url(#resistorHeatGlowCircuit)" />
            <rect x="230" y="112" width="170" height="44" rx="22" fill="rgba(120,53,15,0.26)" stroke="#92400e" strokeDasharray="6 6" />
            <text x="316" y="129" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="700">
              RESISTIVE LAYER
            </text>
            <text x="316" y="146" textAnchor="middle" fill="#78350f" fontSize="9">
              collisions create resistance and heat
            </text>

            <rect x="235" y="92" width="13" height="84" fill="#ef4444" />
            <rect x="278" y="92" width="13" height="84" fill="#111827" />
            <rect x="326" y="92" width="13" height="84" fill="#f59e0b" />
            <rect x="390" y="92" width="13" height="84" fill="#d4af37" />

            {Array.from({ length: collisionCount }).map((_, index) => {
              const x = 238 + index * (155 / Math.max(collisionCount - 1, 1));
              const y = index % 2 === 0 ? 121 : 151;
              return (
                <motion.g key={`circuit-collision-${index}`}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={4 + heatLevel * 4}
                    fill="#f97316"
                    opacity={0.2 + heatLevel * 0.6}
                    animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.2, 0.85, 0.2] }}
                    transition={{ repeat: Infinity, duration: 0.9 + index * 0.04 }}
                  />
                  <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.4" opacity="0.65" />
                  <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.4" opacity="0.65" />
                </motion.g>
              );
            })}

            <motion.g animate={{ opacity: heatLevel > 0.18 ? [0.15, 1, 0.15] : 0.08 }} transition={{ repeat: Infinity, duration: 1.1 }}>
              <path d="M260 82 C246 62 274 55 260 36" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M315 82 C301 62 329 55 315 36" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M370 82 C356 62 384 55 370 36" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            </motion.g>
          </motion.g>

          <text x="317" y="76" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
            Resistor Internal Structure
          </text>
          <text x="317" y="194" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            R = {formatResistance(resistance)}
          </text>
          <text x="317" y="212" textAnchor="middle" fill="#64748b" fontSize="10">
            I = {formatCurrent(current)}
          </text>

          <path d="M432 134 H500" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />
          <circle cx="552" cy="134" r="38" fill={`rgba(${led.glow},${0.15 + ledBrightness * 0.8})`} stroke={led.stroke} strokeWidth={4 + ledBrightness * 3} filter="url(#ledGlow)" />
          <polygon points="537,112 537,156 576,134" fill={led.fill} stroke={led.stroke} strokeWidth="3" />
          <line x1="586" y1="112" x2="586" y2="156" stroke={led.fill} strokeWidth="4" />
          <text x="552" y="82" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700">
            {led.label.toUpperCase()}
          </text>
          <text x="552" y="198" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">
            LED Brightness {Math.round(ledBrightness * 100)}%
          </text>
          {showBurnWarning && (
            <motion.g animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 0.9 }}>
              <rect x="490" y="34" width="124" height="30" rx="12" fill={ledStatus.label === "UNSAFE" ? "#fee2e2" : "#ffedd5"} stroke={ledStatus.label === "UNSAFE" ? "#dc2626" : "#ea580c"} />
              <text x="552" y="54" textAnchor="middle" fill={ledStatus.label === "UNSAFE" ? "#dc2626" : "#c2410c"} fontSize="11" fontWeight="800">
                Warning: LED may burn
              </text>
            </motion.g>
          )}

          <path d="M590 134 H675 V238 H80 V180" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`circuit-electron-${particleCount}-${index}`}
              r={4 + currentLevel * 1.5}
              fill="#38bdf8"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: "path('M80 180 V238 H675 V134 H590 H500 H432 C396 134 368 104 336 134 C302 164 260 104 230 134 H125')" }}
            />
          ))}

          <text x="142" y="116" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="700">
            Voltage pressure
          </text>
          <text x="470" y="116" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700">
            ← Electron flow
          </text>

          <g transform="translate(180 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">
              Electron Density
            </text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#0ea5e9" animate={{ width: 130 * currentLevel }} />
          </g>
          <g transform="translate(338 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">
              Collision
            </text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#f59e0b" animate={{ width: 130 * clamp(resistance / 1000, 0, 1) }} />
          </g>
          <g transform="translate(496 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">
              Heat
            </text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#ef4444" animate={{ width: 130 * heatLevel }} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Voltage effect</p>
          <p className="mt-1 text-xs text-slate-700">With resistance fixed, increasing voltage increases current.</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Resistance effect</p>
          <p className="mt-1 text-xs text-slate-700">Higher resistance creates more collisions and reduces current.</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Heat effect</p>
          <p className="mt-1 text-xs text-slate-700">Higher power makes the resistor hotter and more stressed.</p>
        </div>
      </div>
    </div>
  );
}
