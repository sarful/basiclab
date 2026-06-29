"use client";

import { motion } from "framer-motion";

import { getZenerState } from "./logic";
import type { BiasMode } from "./types";

export function ZenerAnimationSection({
  isPlaying,
  resetKey,
  voltage,
  zenerVoltage,
  biasMode,
  state,
}: {
  isPlaying: boolean;
  resetKey: number;
  voltage: number;
  zenerVoltage: number;
  biasMode: BiasMode;
  state: ReturnType<typeof getZenerState>;
}) {
  const isReverse = biasMode === "reverse";
  const leftSign = isReverse ? "âˆ’" : "+";
  const rightSign = isReverse ? "+" : "âˆ’";
  const leftLabel = "Anode";
  const rightLabel = "Cathode";
  const currentPath = isReverse
    ? [635, 545, 445, 425, 345, 250, 125]
    : [125, 250, 345, 425, 545, 635];
  const particleColor = isReverse ? "#a855f7" : "#22c55e";

  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Live Zener Animation</h2>
          <p className="text-sm font-semibold text-slate-600">
            {isReverse
              ? "Reverse bias-à¦ Vz à¦ªà¦¾à¦° à¦¹à¦²à§‡ breakdown current Cathode à¦¥à§‡à¦•à§‡ Anode à¦¦à¦¿à¦•à§‡ à¦¯à¦¾à§Ÿà¥¤"
              : "Forward bias-à¦ 0.7V à¦ªà¦¾à¦° à¦¹à¦²à§‡ à¦¸à¦¾à¦§à¦¾à¦°à¦£ diode-à¦à¦° à¦®à¦¤à§‹ current Anode à¦¥à§‡à¦•à§‡ Cathode à¦¦à¦¿à¦•à§‡ à¦¯à¦¾à§Ÿà¥¤"}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-black ${
            state.active
              ? "bg-purple-100 text-purple-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {state.status}
        </span>
      </div>

      <svg
        key={resetKey}
        viewBox="0 0 760 290"
        className="h-[240px] min-w-[680px] sm:h-[290px] sm:min-w-0 sm:w-full"
        role="img"
        aria-label="Zener diode controlled animation"
      >
        <defs>
          <filter id="breakdownGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="35"
          y="42"
          width="690"
          height="185"
          rx="24"
          fill={state.active ? "#faf5ff" : "#f8fafc"}
          stroke={state.active ? "#d8b4fe" : "#e2e8f0"}
          strokeWidth="2"
        />
        <line
          x1="90"
          y1="135"
          x2="670"
          y2="135"
          stroke="#0f172a"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle
          cx="90"
          cy="135"
          r="30"
          fill={leftSign === "+" ? "#fee2e2" : "#e0f2fe"}
          stroke={leftSign === "+" ? "#dc2626" : "#0284c7"}
          strokeWidth="3"
        />
        <text
          x="90"
          y="143"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill={leftSign === "+" ? "#dc2626" : "#0284c7"}
        >
          {leftSign}
        </text>
        <text
          x="90"
          y="179"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          {leftLabel}
        </text>

        <circle
          cx="670"
          cy="135"
          r="30"
          fill={rightSign === "+" ? "#fee2e2" : "#e0f2fe"}
          stroke={rightSign === "+" ? "#dc2626" : "#0284c7"}
          strokeWidth="3"
        />
        <text
          x="670"
          y="143"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill={rightSign === "+" ? "#dc2626" : "#0284c7"}
        >
          {rightSign}
        </text>
        <text
          x="670"
          y="179"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          {rightLabel}
        </text>

        {state.active && (
          <motion.circle
            cx="405"
            cy="135"
            r="55"
            fill={isReverse ? "#a855f7" : "#22c55e"}
            opacity="0.18"
            filter="url(#breakdownGlow)"
            animate={
              isPlaying
                ? { r: [45, 65, 45], opacity: [0.12, 0.35, 0.12] }
                : { r: 52, opacity: 0.16 }
            }
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        <polygon
          points="345,92 345,178 420,135"
          fill={state.active ? "#7c3aed" : "#94a3b8"}
        />
        <path
          d="M425 92 L425 113 L447 124 L425 136 L425 178"
          stroke="#1e293b"
          strokeWidth="8"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <text
          x="395"
          y="211"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fill="#1e293b"
        >
          Zener Diode
        </text>

        <line
          x1="315"
          y1="68"
          x2="475"
          y2="68"
          stroke={state.isBreakdown ? "#7c3aed" : "#cbd5e1"}
          strokeWidth="4"
          strokeDasharray="8 7"
        />
        <text
          x="395"
          y="56"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fill={state.isBreakdown ? "#6d28d9" : "#64748b"}
        >
          {state.isBreakdown
            ? `Vz Clamp Active: ${zenerVoltage.toFixed(1)}V`
            : `Vz = ${zenerVoltage.toFixed(1)}V`}
        </text>

        {state.active &&
          isPlaying &&
          [0, 0.75, 1.5].map((delay) => (
            <motion.circle
              key={`${biasMode}-${delay}`}
              r="8"
              fill={particleColor}
              stroke="white"
              strokeWidth="3"
              initial={{ cx: currentPath[0], cy: 135, opacity: 0 }}
              animate={{ cx: currentPath, opacity: [0, 1, 1, 1, 1, 1, 0] }}
              transition={{ duration: 2.6, delay, repeat: Infinity, ease: "linear" }}
            />
          ))}

        {!state.active && (
          <g>
            <line
              x1="348"
              y1="96"
              x2="440"
              y2="174"
              stroke="#dc2626"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1="440"
              y1="96"
              x2="348"
              y2="174"
              stroke="#dc2626"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <text
              x="395"
              y="245"
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill="#dc2626"
            >
              BLOCKED / NO BREAKDOWN
            </text>
          </g>
        )}

        <text
          x="380"
          y="265"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          Applied: {voltage.toFixed(1)}V | Current: {state.currentMA.toFixed(1)}mA |{" "}
          {isReverse
            ? "Reverse current: Cathode â†’ Anode"
            : "Forward current: Anode â†’ Cathode"}
        </text>
      </svg>
    </section>
  );
}
