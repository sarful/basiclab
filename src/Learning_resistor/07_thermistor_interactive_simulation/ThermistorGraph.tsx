"use client";

import { motion } from "framer-motion";

import { calculateThermistorResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function ThermistorGraph({ mode, nominalResistance }: { mode: ThermistorMode; nominalResistance: number }) {
  const width = 430;
  const height = 245;
  const padding = 38;
  const values = Array.from({ length: 13 }, (_, index) => {
    const temperature = index * 10;
    return {
      temperature,
      resistance: calculateThermistorResistance(mode, nominalResistance, temperature),
    };
  });
  const maxR = Math.max(...values.map((item) => item.resistance));
  const minR = Math.min(...values.map((item) => item.resistance));
  const range = Math.max(maxR - minR, 1);
  const points = values
    .map((item) => {
      const x = padding + (item.temperature / 120) * (width - padding * 1.5);
      const y = height - padding - ((item.resistance - minR) / range) * (height - padding * 1.8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <h2 className="font-semibold text-slate-900">Temperature vs Resistance Graph</h2>
      <p className="text-xs text-slate-600">NTC and PTC thermistors create opposite resistance curves.</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 36;
            return <line key={line} x1={padding} y1={y} x2={width - 20} y2={y} stroke="#e2e8f0" />;
          })}
          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <motion.polyline points={points} fill="none" stroke={mode === "ntc" ? "#2563eb" : "#f97316"} strokeWidth="4" strokeLinecap="round" />
          <text x={width - 92} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">
            Temperature
          </text>
          <text x="4" y="18" fill="#334155" fontSize="12" fontWeight="600">
            R
          </text>
          <text x={padding + 4} y={height - 18} fill="#64748b" fontSize="10">
            0°C
          </text>
          <text x={width - 58} y={height - 18} fill="#64748b" fontSize="10">
            120°C
          </text>
        </svg>
      </div>
    </div>
  );
}
