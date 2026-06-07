"use client";

import { motion } from "framer-motion";

import type { PhotodiodeState } from "./types";

export function PhotodiodeAnimationSection({
  isPlaying,
  resetKey,
  lux,
  state,
}: {
  isPlaying: boolean;
  resetKey: number;
  lux: number;
  state: PhotodiodeState;
}) {
  const lightOpacity = 0.2 + state.normalizedLight * 0.7;

  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Live Photodiode Animation</h2>
          <p className="text-sm font-semibold text-slate-600">
            Incoming lux creates photocurrent in reverse bias mode.
          </p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-black ${state.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
          {state.status}
        </span>
      </div>

      <svg
        key={resetKey}
        viewBox="0 0 760 300"
        className="h-[250px] min-w-[680px] sm:h-[300px] sm:min-w-0 sm:w-full"
        role="img"
        aria-label="Photodiode incoming light and photocurrent animation"
      >
        <defs>
          <marker id="photoCurrentArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#16a34a" /></marker>
          <marker id="lightArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#0b74b8" /></marker>
        </defs>
        <rect x="35" y="48" width="690" height="170" rx="24" fill={state.isActive ? "#f0fdf4" : "#f8fafc"} stroke={state.isActive ? "#86efac" : "#e2e8f0"} strokeWidth="2" />
        <line x1="90" y1="140" x2="670" y2="140" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="90" cy="140" r="30" fill={state.isReverseBias ? "#e0f2fe" : "#fee2e2"} stroke={state.isReverseBias ? "#0284c7" : "#dc2626"} strokeWidth="3" />
        <text x="90" y="148" textAnchor="middle" fontSize="26" fontWeight="900" fill={state.isReverseBias ? "#0284c7" : "#dc2626"}>{state.isReverseBias ? "-" : "+"}</text>
        <text x="90" y="184" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>
        <circle cx="670" cy="140" r="30" fill={state.isReverseBias ? "#fee2e2" : "#e0f2fe"} stroke={state.isReverseBias ? "#dc2626" : "#0284c7"} strokeWidth="3" />
        <text x="670" y="148" textAnchor="middle" fontSize="26" fontWeight="900" fill={state.isReverseBias ? "#dc2626" : "#0284c7"}>{state.isReverseBias ? "+" : "-"}</text>
        <text x="670" y="184" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>
        <polygon points="345,100 345,180 420,140" fill={state.isActive ? "#22c55e" : "#94a3b8"} stroke="#0b74b8" strokeWidth="2" />
        <line x1="425" y1="100" x2="425" y2="180" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <text x="385" y="212" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b">Photodiode</text>

        {lux > 0 && [0, 0.45, 0.9, 1.35].map((delay) => (
          <motion.path key={`light-${delay}`} d="M455 55 L405 100" fill="none" stroke="#0b74b8" strokeWidth="5" strokeLinecap="round" markerEnd="url(#lightArrow)" initial={{ opacity: 0, pathLength: 0 }} animate={isPlaying ? { opacity: [0, lightOpacity, 0], pathLength: [0, 1, 1] } : { opacity: lightOpacity, pathLength: 1 }} transition={{ duration: 1.4, delay, repeat: Infinity }} />
        ))}
        {lux > 500 && [0.2, 0.65, 1.1].map((delay) => (
          <motion.path key={`light2-${delay}`} d="M500 70 L430 112" fill="none" stroke="#0b74b8" strokeWidth="5" strokeLinecap="round" markerEnd="url(#lightArrow)" initial={{ opacity: 0, pathLength: 0 }} animate={isPlaying ? { opacity: [0, lightOpacity, 0], pathLength: [0, 1, 1] } : { opacity: lightOpacity, pathLength: 1 }} transition={{ duration: 1.4, delay, repeat: Infinity }} />
        ))}

        <path d="M620 108 H455" fill="none" stroke={state.isActive ? "#16a34a" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round" markerEnd="url(#photoCurrentArrow)" />
        <path d="M335 108 H150" fill="none" stroke={state.isActive ? "#16a34a" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round" markerEnd="url(#photoCurrentArrow)" />
        <text x="380" y="88" textAnchor="middle" fontSize="13" fontWeight="900" fill={state.isActive ? "#15803d" : "#64748b"}>Reverse photocurrent: Cathode to Anode</text>

        {state.isActive && isPlaying && [0, 0.7, 1.4, 2.1].map((delay) => (
          <motion.circle key={`photo-current-${delay}`} r="7" fill="#22c55e" stroke="white" strokeWidth="3" initial={{ cx: 635, cy: 140, opacity: 0 }} animate={{ cx: [635, 540, 425, 345, 240, 125], opacity: [0, 1, 1, 1, 1, 0] }} transition={{ duration: Math.max(1.2, 3 - state.normalizedLight), delay, repeat: Infinity, ease: "linear" }} />
        ))}
        {!state.isActive && (
          <g>
            <line x1="348" y1="101" x2="440" y2="179" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <line x1="440" y1="101" x2="348" y2="179" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <text x="395" y="245" textAnchor="middle" fontSize="14" fontWeight="900" fill="#dc2626">
              {state.isReverseBias ? "NO LIGHT / ONLY DARK CURRENT" : "USE REVERSE BIAS FOR SENSOR MODE"}
            </text>
          </g>
        )}
        <text x="380" y="276" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">
          Lux: {state.lux.toFixed(0)} | Optical Power: {state.opticalPowerUW.toFixed(3)}uW | Photocurrent: {state.photocurrentUA.toFixed(2)}uA
        </text>
      </svg>
    </section>
  );
}
