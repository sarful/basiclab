"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber, recommendedPackage, getStatus } from "./logic";
import type { ResistorPackage } from "./types";

export function PowerVisual({
  voltage,
  resistance,
  rating,
  selectedPackage,
}: {
  voltage: number;
  resistance: number;
  rating: number;
  selectedPackage: ResistorPackage;
}) {
  const current = voltage / resistance;
  const power = current * current * resistance;
  const loadRatio = power / rating;
  const heatLevel = clamp(loadRatio, 0, 1);
  const flowLevel = clamp(current / 0.15, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 20), 4), 24);
  const electronSpeed = Math.max(0.5, 2.4 - flowLevel * 1.5);
  const status = getStatus(power, rating);
  const isOverload = loadRatio >= 1;
  const bodyX = 380 - selectedPackage.bodyWidth / 2;
  const bodyY = 158 - selectedPackage.bodyHeight / 2;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Power Rating Heat Visualizer</h2>
          <p className="text-xs text-slate-600">See how excess power turns into heat when the resistor wattage is too small.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.bg} ${status.tone}`}>{status.label}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <defs>
            <linearGradient id="hotBody" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="50%" stopColor={heatLevel > 0.55 ? "#fb923c" : "#e9c27d"} />
              <stop offset="100%" stopColor={heatLevel > 0.9 ? "#ef4444" : "#c99755"} />
            </linearGradient>
            <filter id="powerHeatGlow" x="-50%" y="-65%" width="200%" height="230%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 16} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            P = V × I = I²R = V²/R
          </text>

          <rect x="42" y="116" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="152" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="87" y="178" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {voltage}V
          </text>

          <path d={`M132 162 H${bodyX}`} stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d={`M${bodyX + selectedPackage.bodyWidth} 162 H656 V248 H87 V208`} stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ x: isOverload ? [0, 2, -2, 0] : 0 }} transition={{ repeat: Infinity, duration: 0.18 }}>
            <rect x={bodyX} y={bodyY} width={selectedPackage.bodyWidth} height={selectedPackage.bodyHeight} rx={selectedPackage.bodyHeight / 2} fill="url(#hotBody)" stroke="#111827" strokeWidth="4" filter="url(#powerHeatGlow)" />
            <rect x={bodyX + 45} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#ef4444" />
            <rect x={bodyX + 105} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#111827" />
            <rect x={bodyX + 165} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#f59e0b" />
            <rect x={bodyX + selectedPackage.bodyWidth - 62} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#d4af37" />
            <text x="390" y="166" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="800">
              {selectedPackage.label} Resistor
            </text>
          </motion.g>

          <motion.g animate={{ opacity: heatLevel > 0.18 ? [0.15, 1, 0.15] : 0.06 }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M300 92 C286 70 314 62 300 40" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M390 86 C376 64 404 56 390 34" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M480 92 C466 70 494 62 480 40" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          {isOverload && (
            <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <rect x="250" y="250" width="280" height="62" rx="16" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
              <text x="390" y="274" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="800">
                Power rating exceeded — resistor may burn.
              </text>
              <text x="390" y="296" textAnchor="middle" fill="#7f1d1d" fontSize="12" fontWeight="700">
                Recommended: {recommendedPackage(power).label} or higher
              </text>
            </motion.g>
          )}

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`power-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: `path('M87 208 V248 H656 V162 H${bodyX + selectedPackage.bodyWidth} H${bodyX} H132')` }}
            />
          ))}

          <text x="185" y="136" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            Current flow
          </text>
          <text x="590" y="136" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Heat output
          </text>

          <g transform="translate(140 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Power Load
            </text>
            <rect x="0" y="10" width="500" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="12" rx="6" fill={isOverload ? "#ef4444" : heatLevel > 0.75 ? "#f97316" : "#22c55e"} animate={{ width: 500 * clamp(loadRatio, 0, 1) }} />
            <text x="500" y="38" textAnchor="end" fill="#64748b" fontSize="11">
              {formatNumber(loadRatio * 100, 1)}% of rating
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
