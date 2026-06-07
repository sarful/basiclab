"use client";

import { motion } from "framer-motion";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

export function FullWaveCircuit({
  point,
  diodeDrop,
}: {
  point: WavePoint;
  diodeDrop: number;
}) {
  const d1On = point.activeDiode === "D1";
  const d2On = point.activeDiode === "D2";
  const ledOn = point.ledOn;
  const electronColor = point.ledBlown ? "#ef4444" : ledOn ? "#0ea5e9" : "#94a3b8";
  const label = point.ledBlown
    ? "LED overcurrent: blowing risk"
    : d1On
      ? "D1 conducts: positive half-cycle"
      : d2On
        ? "D2 conducts: negative half-cycle"
        : "Both diodes OFF";

  const d1Path = [
    { x: 72, y: 84 },
    { x: 220, y: 84 },
    { x: 335, y: 84 },
    { x: 452, y: 84 },
    { x: 452, y: 132 },
    { x: 452, y: 228 },
    { x: 300, y: 228 },
    { x: 220, y: 228 },
    { x: 112, y: 218 },
  ];

  const d2Path = [
    { x: 72, y: 344 },
    { x: 220, y: 344 },
    { x: 335, y: 344 },
    { x: 452, y: 344 },
    { x: 452, y: 228 },
    { x: 300, y: 228 },
    { x: 220, y: 228 },
    { x: 112, y: 218 },
  ];

  return (
    <svg
      viewBox="0 0 520 390"
      className="h-full min-h-[320px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Two diode center tap full wave rectifier with LED load connected to center tap return"
    >
      <defs>
        <filter id="ledGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="520" height="390" fill="white" />

      <text x="2" y="132" fill="#0f172a" fontSize="18" fontWeight="900">
        AC supply
      </text>
      <circle cx="72" cy="220" r="34" fill="white" stroke="#0f172a" strokeWidth="3" />
      <path
        d="M46 220 C58 194 72 194 86 220 C100 246 114 246 126 220"
        fill="none"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line x1="72" y1="186" x2="72" y2="84" stroke="#0f172a" strokeWidth="3" />
      <line x1="72" y1="254" x2="72" y2="344" stroke="#0f172a" strokeWidth="3" />
      <text x="145" y="232" fill="#2563eb" fontSize="18" fontWeight="900">
        CT
      </text>

      <line x1="72" y1="84" x2="218" y2="84" stroke="#0f172a" strokeWidth="3" />
      <line x1="72" y1="344" x2="218" y2="344" stroke="#0f172a" strokeWidth="3" />

      <text x="230" y="38" fill="#0f172a" fontSize="18" fontWeight="900">
        D1
      </text>
      <polygon points="218,34 218,134 318,84" fill={d1On ? "#22c55e" : "#0f172a"} />
      <line x1="330" y1="34" x2="330" y2="134" stroke={d1On ? "#22c55e" : "#0f172a"} strokeWidth="8" />
      <line x1="338" y1="84" x2="452" y2="84" stroke="#0f172a" strokeWidth="3" />
      <text x="332" y="115" fontSize="13" fontWeight="900" fill="#0f172a">
        Vf {diodeDrop.toFixed(2)}V
      </text>

      <text x="230" y="298" fill="#0f172a" fontSize="18" fontWeight="900">
        D2
      </text>
      <polygon points="218,294 218,394 318,344" fill={d2On ? "#22c55e" : "#0f172a"} />
      <line x1="330" y1="294" x2="330" y2="394" stroke={d2On ? "#22c55e" : "#0f172a"} strokeWidth="8" />
      <line x1="338" y1="344" x2="452" y2="344" stroke="#0f172a" strokeWidth="3" />

      <circle cx="452" cy="84" r="7" fill="#0ea5e9" />
      <text x="360" y="66" fill="#0f172a" fontSize="14" fontWeight="900">
        Common cathode output
      </text>

      <line x1="452" y1="84" x2="452" y2="128" stroke="#0f172a" strokeWidth="3" />
      <rect x="446" y="128" width="12" height="32" rx="2" fill="#0f172a" />
      <text x="404" y="172" fill="#0f172a" fontSize="14" fontWeight="900">
        R limit
      </text>
      <line x1="452" y1="160" x2="452" y2="344" stroke="#0f172a" strokeWidth="3" />
      <circle cx="452" cy="344" r="7" fill="#0f172a" />

      <line x1="112" y1="220" x2="218" y2="220" stroke="#0f172a" strokeWidth="3" />
      {ledOn && (
        <motion.circle
          cx="238"
          cy="220"
          r={point.ledBlown ? 54 : 34 + point.ledIntensity * 9}
          fill={point.ledBlown ? "#ef4444" : "#facc15"}
          opacity={point.ledBlown ? 0.25 : 0.18 + Math.min(point.ledIntensity, 1) * 0.3}
          filter="url(#ledGlow)"
          animate={{ r: point.ledBlown ? [44, 58, 44] : [34, 46, 34] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
      <polygon
        points="296,192 296,248 224,220"
        fill={point.ledBlown ? "#7f1d1d" : ledOn ? "#f59e0b" : "#0f172a"}
      />
      <line x1="306" y1="190" x2="306" y2="250" stroke="#0f172a" strokeWidth="5" />
      <line x1="306" y1="220" x2="452" y2="220" stroke="#0f172a" strokeWidth="3" />
      <line x1="452" y1="220" x2="452" y2="344" stroke="#0f172a" strokeWidth="3" />
      <circle cx="306" cy="220" r="5" fill="#0ea5e9" />

      {ledOn && !point.ledBlown && (
        <g>
          <motion.line
            x1="294"
            y1="174"
            x2="320"
            y2="148"
            stroke="#bae6fd"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.line
            x1="338"
            y1="174"
            x2="364"
            y2="200"
            stroke="#bae6fd"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </g>
      )}

      {point.ledBlown && (
        <text x="196" y="278" fill="#ef4444" fontSize="12" fontWeight="900">
          LED BLOWN
        </text>
      )}

      <ElectronFlow active={d1On} path={d1Path} color={electronColor} count={point.ledBlown ? 5 : 4} />
      <ElectronFlow active={d2On} path={d2Path} color={electronColor} count={point.ledBlown ? 5 : 4} />

      <text x="150" y="196" fill={electronColor} fontSize="14" fontWeight="900">
        {label}
      </text>
      <text x="150" y="260" fill="#64748b" fontSize="12" fontWeight="800">
        Vout: {point.vout.toFixed(2)}V | I_LED: {(point.current * 1000).toFixed(2)}mA
      </text>
      <text x="185" y="376" fill="#64748b" fontSize="12" fontWeight="800">
        2-diode center-tap full-wave rectifier: D1 and D2 alternate conduction
      </text>
    </svg>
  );
}
