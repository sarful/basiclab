"use client";

import { motion } from "framer-motion";

import { calculateLdrResistance, clamp, formatResistance } from "./logic";

export function LdrGraph({ darkResistance, lightPercent }: { darkResistance: number; lightPercent: number }) {
  const width = 430;
  const height = 245;
  const padding = 38;
  const values = Array.from({ length: 11 }, (_, index) => {
    const light = index * 10;
    return {
      light,
      resistance: calculateLdrResistance(light, darkResistance),
    };
  });
  const maxR = Math.max(...values.map((item) => item.resistance));
  const minR = Math.min(...values.map((item) => item.resistance));
  const range = Math.max(maxR - minR, 1);
  const points = values
    .map((item) => {
      const x = padding + (item.light / 100) * (width - padding * 1.5);
      const y = height - padding - ((item.resistance - minR) / range) * (height - padding * 1.8);
      return `${x},${y}`;
    })
    .join(" ");

  const liveLight = clamp(lightPercent, 0, 100);
  const liveResistance = calculateLdrResistance(liveLight, darkResistance);
  const liveX = padding + (liveLight / 100) * (width - padding * 1.5);
  const liveY = height - padding - ((liveResistance - minR) / range) * (height - padding * 1.8);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <h2 className="font-semibold text-slate-900">Light vs Resistance Graph</h2>
      <p className="text-xs text-slate-600">As light increases, LDR resistance falls sharply.</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 36;
            return <line key={line} x1={padding} y1={y} x2={width - 20} y2={y} stroke="#e2e8f0" />;
          })}
          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <motion.polyline points={points} fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          <motion.circle cx={liveX} cy={liveY} r="7" fill="#facc15" stroke="#111827" strokeWidth="2" animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} />
          <text x={Math.min(liveX + 10, width - 130)} y={Math.max(liveY - 14, 28)} fill="#334155" fontSize="11" fontWeight="700">
            {liveLight}% light, {formatResistance(liveResistance)}
          </text>
          <text x={width - 76} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">
            Light
          </text>
          <text x="4" y="18" fill="#334155" fontSize="12" fontWeight="600">
            R
          </text>
          <text x={padding + 4} y={height - 18} fill="#64748b" fontSize="10">
            Dark
          </text>
          <text x={width - 64} y={height - 18} fill="#64748b" fontSize="10">
            Bright
          </text>
        </svg>
      </div>
    </div>
  );
}
