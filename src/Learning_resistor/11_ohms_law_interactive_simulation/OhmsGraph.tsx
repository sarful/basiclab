"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber } from "./logic";

export function OhmsGraph({ resistance, voltage }: { resistance: number; voltage: number }) {
  const width = 420;
  const height = 240;
  const padding = 36;
  const maxVoltage = 50;
  const safeResistance = Math.max(resistance, 0.001);
  const maxCurrent = Math.max(1, maxVoltage / safeResistance);

  const points = Array.from({ length: 11 }, (_, index) => {
    const v = (maxVoltage / 10) * index;
    const i = v / safeResistance;
    const x = padding + (v / maxVoltage) * (width - padding * 1.4);
    const y = height - padding - (i / maxCurrent) * (height - padding * 1.5);
    return `${x},${y}`;
  }).join(" ");

  const liveVoltage = clamp(voltage, 0, maxVoltage);
  const liveX = padding + (liveVoltage / maxVoltage) * (width - padding * 1.4);
  const liveY = height - padding - ((liveVoltage / safeResistance) / maxCurrent) * (height - padding * 1.5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">V vs I Curve</h2>
          <p className="text-xs text-slate-600">Slope depends on resistance: I = V / R</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">LIVE GRAPH</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          <defs>
            <linearGradient id="graphLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 38;
            return <line key={`h-${line}`} x1={padding} y1={y} x2={width - 22} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
          })}

          {[0, 1, 2, 3, 4, 5].map((line) => {
            const x = padding + line * 70;
            return <line key={`v-${line}`} x1={x} y1="20" x2={x} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />;
          })}

          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />

          <motion.polyline points={points} fill="none" stroke="url(#graphLine)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />

          <motion.circle cx={liveX} cy={liveY} r="7" fill="#facc15" stroke="#fefce8" strokeWidth="3" animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />

          <text x={width - 76} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">
            Voltage (V)
          </text>
          <text x="6" y="18" fill="#334155" fontSize="12" fontWeight="600">
            Current (A)
          </text>
          <text x={padding - 4} y={height - 18} textAnchor="end" fill="#64748b" fontSize="10">
            0
          </text>
          <text x={padding + 68} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">
            10V
          </text>
          <text x={padding + 138} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">
            20V
          </text>
          <text x={padding + 278} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">
            40V
          </text>
          <text x={padding - 8} y="28" textAnchor="end" fill="#64748b" fontSize="10">
            {formatNumber(maxCurrent, 2)}A
          </text>
        </svg>
      </div>
    </div>
  );
}
