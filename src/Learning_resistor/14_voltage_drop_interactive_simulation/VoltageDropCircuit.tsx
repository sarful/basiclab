"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatNumber, formatResistance } from "./logic";

export function VoltageDropCircuit({
  supplyVoltage,
  r1,
  r2,
  r3,
  showR3,
}: {
  supplyVoltage: number;
  r1: number;
  r2: number;
  r3: number;
  showR3: boolean;
}) {
  const resistors = showR3 ? [r1, r2, r3] : [r1, r2];
  const totalResistance = resistors.reduce((sum, value) => sum + value, 0);
  const current = supplyVoltage / totalResistance;
  const drops = resistors.map((resistance) => current * resistance);
  const flowLevel = clamp(current / 0.03, 0.08, 1);
  const electronCount = Math.min(Math.max(Math.round(flowLevel * 20), 4), 24);
  const electronSpeed = Math.max(0.55, 2.3 - flowLevel * 1.5);
  const sumDrop = drops.reduce((sum, value) => sum + value, 0);
  const resistorXs = showR3 ? [210, 360, 510] : [250, 450];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Voltage Drop Circuit Visualizer</h2>
          <p className="text-xs text-slate-600">
            In a series circuit, each resistor creates a voltage drop based on its
            resistance value.
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          SERIES CIRCUIT
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 370" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="dropGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={4 + flowLevel * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Total voltage = sum of all voltage drops
          </text>

          <rect x="42" y="118" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="154" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="180" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{supplyVoltage}V</text>
          <text x="87" y="230" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Supply</text>

          <path d="M132 164 H180" stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d="M620 164 H660 V258 H87 V210" stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          {resistors.map((resistance, index) => {
            const x = resistorXs[index];
            const drop = drops[index];
            const heat = clamp(drop / Math.max(supplyVoltage, 1), 0.08, 1);
            return (
              <g key={`${resistance}-${index}`}>
                <path
                  d={`M${index === 0 ? 180 : resistorXs[index - 1] + 80} 164 H${x}`}
                  stroke="#64748b"
                  strokeWidth={5 + flowLevel * 5}
                  strokeLinecap="round"
                />
                <motion.rect
                  x={x}
                  y="126"
                  width="80"
                  height="76"
                  rx="34"
                  fill={heat > 0.45 ? "#fb923c" : "#f2c879"}
                  stroke="#111827"
                  strokeWidth="3"
                  filter="url(#dropGlow)"
                  animate={{ opacity: [0.94, 1, 0.94] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <rect x={x + 16} y="126" width="8" height="76" fill="#ef4444" />
                <rect x={x + 36} y="126" width="8" height="76" fill="#111827" />
                <rect x={x + 56} y="126" width="8" height="76" fill="#f59e0b" />
                <text x={x + 40} y="116" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">R{index + 1}</text>
                <text x={x + 40} y="222" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">{formatResistance(resistance)}</text>
                <text x={x + 40} y="244" textAnchor="middle" fill="#2563eb" fontSize="13" fontWeight="900">
                  Vdrop = {formatNumber(drop, 2)}V
                </text>
              </g>
            );
          })}

          <path d={`M${resistorXs[resistorXs.length - 1] + 80} 164 H620`} stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`drop-electron-${electronCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / electronCount) }}
              style={{ offsetPath: "path('M87 210 V258 H660 V164 H620 H180 H132')" }}
            />
          ))}

          <text x="185" y="142" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Current same everywhere</text>
          <text x="590" y="142" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Voltage used by loads</text>

          <g transform="translate(130 305)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Voltage Drop Sum</text>
            <rect x="0" y="12" width="500" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#2563eb" animate={{ width: 500 * clamp(sumDrop / Math.max(supplyVoltage, 1), 0, 1) }} />
            <text x="500" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              {formatNumber(sumDrop, 2)}V / {supplyVoltage}V
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
