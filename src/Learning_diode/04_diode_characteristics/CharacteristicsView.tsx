"use client";

import { motion } from "framer-motion";

import { getCharacteristicPoint } from "./logic";

export function CharacteristicsView({ voltage }: { voltage: number }) {
  const point = getCharacteristicPoint(voltage);
  const thresholdX = 70 + (point.threshold / 12) * 380;

  const curvePath = [
    "M70 250",
    "C130 250 180 250 210 249",
    "C245 247 265 238 285 220",
    "C315 190 340 135 380 95",
    "C405 72 430 68 450 70",
  ].join(" ");

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-bold">Diode Characteristics (V-I)</h2>
      <svg viewBox="0 0 520 320" className="h-[320px] w-full" role="img" aria-label="Diode voltage current characteristics graph">
        <rect x="50" y="40" width="420" height="235" fill="#ffffff" stroke="#e5e7eb" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`grid-${i}`}>
            <line x1={70 + i * 95} y1="70" x2={70 + i * 95} y2="250" stroke="#f1f5f9" />
            <line x1="70" y1={70 + i * 45} x2="450" y2={70 + i * 45} stroke="#f1f5f9" />
          </g>
        ))}
        <line x1="70" y1="250" x2="450" y2="250" stroke="#111827" strokeWidth="2" />
        <line x1="70" y1="250" x2="70" y2="70" stroke="#111827" strokeWidth="2" />
        <text x="445" y="272" fontSize="14" fontWeight="700">Voltage (V)</text>
        <text x="18" y="78" fontSize="14" fontWeight="700">Current (mA)</text>
        <text x="64" y="268" fontSize="12">0</text>
        <text x={thresholdX - 10} y="268" fontSize="12" fill="#f97316">0.7V</text>
        <line x1={thresholdX} y1="70" x2={thresholdX} y2="250" stroke="#f97316" strokeDasharray="5 5" />
        <text x={thresholdX + 8} y="88" fontSize="12" fill="#c2410c" fontWeight="700">threshold</text>

        <motion.path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
        <motion.circle
          cx={point.x}
          cy={point.y}
          r="7"
          fill="#dc2626"
          stroke="white"
          strokeWidth="2"
          animate={{ cx: point.x, cy: point.y }}
          transition={{ duration: 0.25 }}
        />
      </svg>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <p className="rounded bg-slate-50 p-2">Voltage: <b>{voltage.toFixed(1)}V</b></p>
        <p className="rounded bg-slate-50 p-2">Current: <b>{point.currentMA.toFixed(1)} mA</b></p>
        <p className="rounded bg-orange-50 p-2">Threshold: <b>≈0.7V</b></p>
      </div>
    </div>
  );
}
