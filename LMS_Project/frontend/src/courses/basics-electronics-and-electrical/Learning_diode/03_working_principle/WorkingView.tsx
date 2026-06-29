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
      initial={{ cx: 90, cy: 141, opacity: 0 }}
      animate={
        active
          ? {
              cx: [90, 90, 300, 350, 640, 640, 640, 90, 90],
              cy: [141, 92, 92, 92, 92, 140, 277, 277, 213],
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
    <div className="rounded-[24px] border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 430" className="h-[430px] w-full" role="img" aria-label="Diode working principle">
        <rect x="22" y="20" width="716" height="390" rx="28" fill="white" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="46" y="36" width="668" height="34" rx="17" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="66" y="58" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="3">
          LIVE BIAS CIRCUIT
        </text>
        <text x="648" y="58" textAnchor="end" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          STAGE 3
        </text>

        <path d="M90 141 V92 H300 M350 92 H640 V140" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="square" />
        <path d="M640 190 V277 H90 V213" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="square" />

        <circle cx="90" cy="177" r="36" fill="white" stroke="#374151" strokeWidth="3" />
        <text x="90" y="165" textAnchor="middle" fontSize="30" fill={isForward ? "#dc2626" : "#111827"}>
          {isForward ? "+" : "-"}
        </text>
        <line x1="70" y1="177" x2="110" y2="177" stroke="#374151" strokeWidth="2.5" />
        <text x="90" y="202" textAnchor="middle" fontSize="30" fill={isForward ? "#111827" : "#dc2626"}>
          {isForward ? "-" : "+"}
        </text>

        <polygon points="300,60 350,92 300,124" fill="#374151" />
        <line x1="350" y1="60" x2="350" y2="124" stroke="#374151" strokeWidth="4" />
        <text x="286" y="138" textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">Anode</text>
        <text x="365" y="138" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">Cathode</text>
        <rect x="292" y="145" width="96" height="24" rx="6" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
        <text x="340" y="161" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#c2410c">
          Threshold about 0.7V
        </text>

        <line x1="640" y1="92" x2="640" y2="140" stroke="#dc2626" strokeWidth="4" />
        {ledOn && (
          <motion.circle
            cx="640"
            cy="167"
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
        <polygon points="615,140 665,140 640,190" fill={ledOn ? "#facc15" : "#374151"} stroke={ledOn ? "#ca8a04" : "none"} strokeWidth="2" />
        <line x1="607" y1="190" x2="673" y2="190" stroke={ledOn ? "#ca8a04" : "#374151"} strokeWidth="4" />
        <line x1="640" y1="190" x2="640" y2="277" stroke="#111827" strokeWidth="4" />

        {[90, 300, 350, 640].map((x, i) => (
          <circle key={i} cx={x} cy={i < 3 ? 92 : 140} r="5" fill="#374151" />
        ))}
        <circle cx="90" cy="277" r="5" fill="#374151" />

        {ledOn && [0, 1.2, 2.4, 3.6].map((delay) => (
          <ElectronFlow key={delay} delay={delay} active={ledOn} intensity={state.intensity} />
        ))}

        {!ledOn && (
          <g>
            <line x1="308" y1="61" x2="350" y2="123" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <line x1="350" y1="61" x2="308" y2="123" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <text x="392" y="116" fill="#dc2626" fontSize="18" fontWeight="800">BLOCKED</text>
          </g>
        )}

        <rect x="92" y="326" width="576" height="56" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="380" y="345" textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          WORKING READOUT
        </text>
        <text x="380" y="362" textAnchor="middle" fontSize="14" fontWeight="900" fill="#334155">
          {isForward ? "Forward bias reduces the barrier and allows conduction." : "Reverse bias widens the barrier and blocks conduction."}
        </text>
        <text x="380" y="376" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#475569">
          Voltage {voltage.toFixed(1)}V | LED {ledOn ? `ON ${Math.round(state.intensity * 100)}%` : "OFF"} | Mode {isForward ? "forward" : "reverse"}
        </text>
      </svg>
    </div>
  );
}
