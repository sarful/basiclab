"use client";

import { motion } from "framer-motion";

import { getWorkingState } from "./logic";
import type { BiasMode } from "./types";

function ElectronFlow({
  delay,
  active,
  intensity,
}: {
  delay: number;
  active: boolean;
  intensity: number;
}) {
  return (
    <motion.circle
      r={4 + intensity * 3}
      fill="#2563eb"
      stroke="white"
      strokeWidth="2"
      initial={{ cx: 90, cy: 119, opacity: 0 }}
      animate={
        active
          ? {
              cx: [90, 90, 300, 350, 640, 640, 640, 90, 90],
              cy: [119, 70, 70, 70, 70, 118, 255, 255, 191],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
            }
          : { opacity: 0 }
      }
      transition={{
        duration: Math.max(2.3, 6.2 - intensity * 3),
        delay,
        repeat: active ? Infinity : 0,
        ease: "linear",
      }}
    />
  );
}

export function WorkingView({ bias, voltage }: { bias: BiasMode; voltage: number }) {
  const isForward = bias === "forward";
  const state = getWorkingState(bias, voltage);
  const ledOn = state.isConducting;
  const glowRadius = 42 + state.intensity * 24;
  const glowOpacity = 0.14 + state.intensity * 0.28;

  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 330" className="h-[330px] w-full" role="img" aria-label="Diode working principle">
        <path d="M90 119 V70 H300 M350 70 H640 V118" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="square" />
        <path d="M640 168 V255 H90 V191" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="square" />
        <circle cx="90" cy="155" r="36" fill="white" stroke="#374151" strokeWidth="3" />
        <text x="90" y="143" textAnchor="middle" fontSize="30" fill={isForward ? "#dc2626" : "#111827"}>{isForward ? "+" : "−"}</text>
        <line x1="70" y1="155" x2="110" y2="155" stroke="#374151" strokeWidth="2.5" />
        <text x="90" y="180" textAnchor="middle" fontSize="30" fill={isForward ? "#111827" : "#dc2626"}>{isForward ? "−" : "+"}</text>
        <polygon points="300,38 350,70 300,102" fill="#374151" />
        <line x1="350" y1="38" x2="350" y2="102" stroke="#374151" strokeWidth="4" />
        <text x="280" y="72" fontSize="18" fontWeight="700" fill="#dc2626">+</text>
        <text x="360" y="72" fontSize="18" fontWeight="700" fill="#111827">−</text>
        <text x="286" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">Anode</text>
        <text x="365" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">Cathode</text>
        <rect x="304" y="124" width="72" height="22" rx="6" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
        <text x="340" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c2410c">≈0.7V drop</text>
        <line x1="640" y1="70" x2="640" y2="118" stroke="#dc2626" strokeWidth="4" />
        {ledOn && (
          <motion.circle
            cx="640"
            cy="145"
            r={glowRadius}
            fill="#facc15"
            opacity={glowOpacity}
            animate={{
              r: [glowRadius - 8, glowRadius + 8, glowRadius - 8],
              opacity: [glowOpacity * 0.65, glowOpacity, glowOpacity * 0.65],
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
        <polygon points="615,118 665,118 640,168" fill={ledOn ? "#facc15" : "#374151"} stroke={ledOn ? "#ca8a04" : "none"} strokeWidth="2" />
        <line x1="607" y1="168" x2="673" y2="168" stroke={ledOn ? "#ca8a04" : "#374151"} strokeWidth="4" />
        <line x1="640" y1="168" x2="640" y2="255" stroke="#111827" strokeWidth="4" />
        {[90, 300, 350, 640, 255].map((x, i) => (
          <circle key={i} cx={i === 4 ? 90 : x} cy={i === 4 ? 255 : i < 3 ? 70 : x === 640 ? 118 : 119} r="5" fill="#374151" />
        ))}
        {ledOn && [0, 1.2, 2.4, 3.6].map((delay) => (
          <ElectronFlow key={delay} delay={delay} active={ledOn} intensity={state.intensity} />
        ))}
        {!ledOn && (
          <g>
            <line x1="308" y1="39" x2="350" y2="101" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <line x1="350" y1="39" x2="308" y2="101" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <text x="375" y="132" fill="#dc2626" fontSize="18" fontWeight="800">BLOCKED</text>
          </g>
        )}
        <text x="590" y="278" fontSize="15" fontWeight="700" fill={ledOn ? "#16a34a" : "#64748b"}>
          {ledOn ? `LED ON ${(state.intensity * 100).toFixed(0)}%` : "LED OFF"}
        </text>
        <text x="126" y="160" fontSize="15" fontWeight="800" fill="#334155">{voltage.toFixed(1)}V</text>
      </svg>
    </div>
  );
}
