"use client";

import { motion } from "framer-motion";

import type { LedState } from "./types";

export function LedAnimationSection({
  isPlaying,
  resetKey,
  voltage,
  forwardVoltage,
  state,
}: {
  isPlaying: boolean;
  resetKey: number;
  voltage: number;
  forwardVoltage: number;
  state: LedState;
}) {
  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Live LED Animation</h2>
          <p className="text-sm font-semibold text-slate-600">
            More applied voltage makes the LED glow brighter. With the resistor OFF,
            excessive voltage shows damage risk.
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-black ${
            state.isDamaged
              ? "bg-red-100 text-red-800"
              : state.isOverVoltage
                ? "bg-orange-100 text-orange-800"
                : state.isOn
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-slate-100 text-slate-600"
          }`}
        >
          {state.status}
        </span>
      </div>

      <svg
        key={resetKey}
        viewBox="0 0 760 300"
        className="h-[250px] min-w-[680px] sm:h-[300px] sm:min-w-0 sm:w-full"
        role="img"
        aria-label="LED controlled current flow and glowing animation"
      >
        <defs>
          <filter id="ledGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="currentArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#16a34a" />
          </marker>
        </defs>

        <rect
          x="35"
          y="48"
          width="690"
          height="170"
          rx="24"
          fill={state.isDamaged ? "#fef2f2" : state.isOverVoltage ? "#fff7ed" : state.isOn ? "#fffbeb" : "#f8fafc"}
          stroke={state.isDamaged ? "#fca5a5" : state.isOverVoltage ? "#fdba74" : state.isOn ? "#fde68a" : "#e2e8f0"}
          strokeWidth="2"
        />
        <line x1="90" y1="140" x2="670" y2="140" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

        <circle cx="90" cy="140" r="30" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <text x="90" y="148" textAnchor="middle" fontSize="26" fontWeight="900" fill="#dc2626">+</text>
        <text x="90" y="184" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>

        <circle cx="670" cy="140" r="30" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
        <text x="670" y="148" textAnchor="middle" fontSize="26" fontWeight="900" fill="#0284c7">-</text>
        <text x="670" y="184" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>

        {state.isOn && (
          <motion.circle
            cx="390"
            cy="140"
            r="58"
            fill={state.isDamaged ? "#ef4444" : state.isOverVoltage ? "#fb923c" : "#facc15"}
            opacity={0.16 + state.intensity * 0.25}
            filter="url(#ledGlow)"
            animate={isPlaying ? { r: [48, 68, 48], opacity: [0.16, 0.42, 0.16] } : { r: 56, opacity: 0.24 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        <polygon
          points="345,100 345,180 420,140"
          fill={state.isDamaged ? "#ef4444" : state.isOverVoltage ? "#fb923c" : state.isOn ? "#facc15" : "#94a3b8"}
          stroke="#0b74b8"
          strokeWidth="2"
        />
        <line x1="425" y1="100" x2="425" y2="180" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <text x="385" y="212" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b">LED</text>

        <path d="M135 108 H305" fill="none" stroke={state.isOn ? "#16a34a" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round" markerEnd="url(#currentArrow)" />
        <path d="M455 108 H625" fill="none" stroke={state.isOn ? "#16a34a" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round" markerEnd="url(#currentArrow)" />
        <text
          x="380"
          y="88"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fill={state.isDamaged ? "#dc2626" : state.isOverVoltage ? "#ea580c" : state.isOn ? "#15803d" : "#64748b"}
        >
          {state.isDamaged
            ? "Too much current!"
            : state.isOverVoltage
              ? "Overvoltage: resistor needed"
              : "Current flow: Anode to Cathode"}
        </text>

        {state.isOn && !state.isDamaged && isPlaying && [0, 0.55, 1.1, 1.65].map((delay) => (
          <motion.circle
            key={`led-current-${delay}`}
            r="7"
            fill="#22c55e"
            stroke="white"
            strokeWidth="3"
            initial={{ cx: 125, cy: 140, opacity: 0 }}
            animate={{ cx: [125, 250, 345, 420, 535, 635], opacity: [0, 1, 1, 1, 1, 0] }}
            transition={{ duration: Math.max(1.4, 2.8 - state.intensity), delay, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {state.isOn && !state.isDamaged && isPlaying && [0, 0.45, 0.9].map((delay) => (
          <motion.g
            key={`ray-a-${delay}`}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.85 }}
            animate={{ opacity: [0, 1, 0], x: [0, 18, 46], y: [0, -20, -52], scale: [0.85, 1, 1.1] }}
            transition={{ duration: 1.4, delay, repeat: Infinity }}
          >
            <line x1="390" y1="92" x2="425" y2="62" stroke="#0b74b8" strokeWidth="5" strokeLinecap="round" />
            <polygon points="425,62 413,68 419,51" fill="#0b74b8" />
          </motion.g>
        ))}

        {state.isOn && !state.isDamaged && isPlaying && [0.25, 0.7, 1.15].map((delay) => (
          <motion.g
            key={`ray-b-${delay}`}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.85 }}
            animate={{ opacity: [0, 1, 0], x: [0, 22, 52], y: [0, -14, -36], scale: [0.85, 1, 1.1] }}
            transition={{ duration: 1.4, delay, repeat: Infinity }}
          >
            <line x1="425" y1="92" x2="462" y2="64" stroke="#0b74b8" strokeWidth="5" strokeLinecap="round" />
            <polygon points="462,64 450,70 456,53" fill="#0b74b8" />
          </motion.g>
        ))}

        {state.isDamaged && (
          <g>
            <motion.text
              x="395"
              y="75"
              textAnchor="middle"
              fontSize="18"
              fontWeight="900"
              fill="#dc2626"
              animate={isPlaying ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={{ duration: 0.7, repeat: Infinity }}
            >
              OVERVOLTAGE! LED DAMAGE RISK
            </motion.text>
            {[0, 0.5, 1].map((delay) => (
              <motion.path
                key={`smoke-${delay}`}
                d="M390 105 C370 85 405 72 385 52"
                fill="none"
                stroke="#64748b"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ opacity: 0, y: 25 }}
                animate={isPlaying ? { opacity: [0, 0.8, 0], y: [25, 0, -25] } : { opacity: 0.5, y: 0 }}
                transition={{ duration: 1.6, delay, repeat: Infinity }}
              />
            ))}
          </g>
        )}

        {!state.isOn && (
          <g>
            <line x1="348" y1="101" x2="440" y2="179" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <line x1="440" y1="101" x2="348" y2="179" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <text x="395" y="245" textAnchor="middle" fontSize="14" fontWeight="900" fill="#dc2626">
              LED OFF / VOLTAGE BELOW Vf
            </text>
          </g>
        )}

        <text x="380" y="276" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">
          Applied: {voltage.toFixed(1)}V | Vf: {forwardVoltage.toFixed(1)}V | Current: {state.currentMA.toFixed(1)}mA | Safe limit: {state.safeVoltageLimit.toFixed(1)}V
        </text>
      </svg>
    </section>
  );
}
