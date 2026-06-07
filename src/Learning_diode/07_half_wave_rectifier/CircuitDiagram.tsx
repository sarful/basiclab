"use client";

import { motion } from "framer-motion";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

export function CircuitDiagram({
  point,
  diodeDrop,
}: {
  point: WavePoint;
  diodeDrop: number;
}) {
  const isConducting = point.conducting;
  const isRecovery = point.reverseRecovery;
  const electronActive = point.ledOn || isRecovery || point.leakage;
  const electronColor = point.ledBlown
    ? "#ef4444"
    : isRecovery
      ? "#f97316"
      : point.ledOn
        ? "#0ea5e9"
        : "#38bdf8";
  const diodeColor = isRecovery ? "#f97316" : isConducting ? "#22c55e" : "#0f172a";
  const label = point.ledBlown
    ? "LED overcurrent: blowing risk"
    : point.ledOn
      ? "LED glowing: electron flow active"
      : isRecovery
        ? "Reverse recovery: electrons still moving"
        : point.leakage
          ? "Reverse biased: tiny leakage electrons"
          : "Reverse biased: diode OFF";

  const mainPath = [
    { x: 90, y: 70 },
    { x: 170, y: 70 },
    { x: 230, y: 70 },
    { x: 320, y: 70 },
    { x: 400, y: 70 },
    { x: 400, y: 110 },
    { x: 400, y: 160 },
    { x: 400, y: 220 },
    { x: 400, y: 290 },
    { x: 260, y: 290 },
    { x: 90, y: 290 },
    { x: 90, y: 210 },
  ];

  return (
    <svg
      viewBox="0 0 520 390"
      className="h-full min-h-[300px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Half wave rectifier circuit diagram with electron flow"
    >
      <defs>
        <filter id="switchGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="520" height="390" fill="white" />
      <text x="28" y="112" fill="#0f172a" fontSize="18" fontWeight="900">
        AC supply
      </text>
      <circle cx="90" cy="180" r="32" fill="white" stroke="#0f172a" strokeWidth="2" />
      <path
        d="M70 180 C78 160 90 160 102 180 C110 200 122 200 130 180"
        fill="none"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x="134" y="205" fill="#22c55e" fontSize="18" fontWeight="900">
        Vin
      </text>

      <line x1="90" y1="150" x2="90" y2="70" stroke="#0f172a" strokeWidth="3" />
      <line x1="90" y1="70" x2="230" y2="70" stroke="#0f172a" strokeWidth="3" />

      <text x="237" y="32" fill="#0f172a" fontSize="16" fontWeight="900">
        Diode
      </text>
      {(isConducting || isRecovery) && (
        <motion.circle
          cx="282"
          cy="70"
          r="42"
          fill={electronColor}
          opacity="0.14"
          filter="url(#switchGlow)"
          animate={{ r: [34, 48, 34], opacity: [0.08, 0.24, 0.08] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
      <polygon points="232,28 232,112 315,70" fill={diodeColor} />
      <line x1="324" y1="28" x2="324" y2="112" stroke={diodeColor} strokeWidth="8" />

      <rect x="300" y="120" width="48" height="8" rx="4" fill="#e2e8f0" />
      <motion.rect
        x="300"
        y="120"
        height="8"
        rx="4"
        fill="#22c55e"
        animate={{ width: isConducting ? 48 : isRecovery ? 20 : 6 }}
        transition={{ duration: 0.3 }}
      />
      <text x="320" y="95" fontSize="11" fontWeight="900" fill="#0f172a">
        Vf {diodeDrop.toFixed(2)}V
      </text>

      <line x1="333" y1="70" x2="398" y2="70" stroke="#0f172a" strokeWidth="3" />
      <circle cx="398" cy="70" r="6" fill="#0ea5e9" />
      <circle cx="398" cy="290" r="6" fill="#0f172a" />

      <line x1="398" y1="70" x2="398" y2="100" stroke="#0f172a" strokeWidth="3" />
      <rect x="392" y="100" width="12" height="28" rx="2" fill="#0f172a" />
      <line x1="398" y1="140" x2="398" y2="160" stroke="#0f172a" strokeWidth="3" />

      {point.ledOn && (
        <motion.circle
          cx="398"
          cy="202"
          r={point.ledBlown ? 46 : 28 + point.ledIntensity * 10}
          fill={point.ledBlown ? "#ef4444" : "#facc15"}
          opacity={point.ledBlown ? 0.28 : 0.12 + Math.min(point.ledIntensity, 1) * 0.28}
          animate={{
            r: point.ledBlown ? [40, 54, 40] : [28, 40, 28],
            opacity: point.ledBlown ? [0.18, 0.36, 0.18] : [0.14, 0.34, 0.14],
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}

      <polygon
        points="380,170 416,170 398,210"
        fill={point.ledBlown ? "#7f1d1d" : point.ledOn ? "#f59e0b" : "#0f172a"}
      />
      <line x1="398" y1="218" x2="398" y2="290" stroke="#0f172a" strokeWidth="3" />

      {point.ledOn && !point.ledBlown && (
        <g>
          <motion.line
            x1="356"
            y1="172"
            x2="330"
            y2="146"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.line
            x1="438"
            y1="172"
            x2="466"
            y2="146"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </g>
      )}

      {point.ledBlown && (
        <g>
          <motion.path
            d="M398 154 C374 132 420 116 394 94"
            fill="none"
            stroke="#64748b"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{ opacity: [0, 0.9, 0], y: [18, 0, -18] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <text x="331" y="260" fill="#ef4444" fontSize="12" fontWeight="900">
            LED BLOWN
          </text>
        </g>
      )}

      <line x1="400" y1="290" x2="90" y2="290" stroke="#0f172a" strokeWidth="3" />
      <line x1="90" y1="290" x2="90" y2="210" stroke="#0f172a" strokeWidth="3" />

      <ElectronFlow
        active={electronActive}
        path={mainPath}
        color={electronColor}
        count={point.leakage ? 1 : point.ledBlown ? 5 : 4}
      />

      <text x="140" y="150" fill={electronColor} fontSize="14" fontWeight="900">
        {label}
      </text>
      <text x="140" y="175" fill="#64748b" fontSize="12" fontWeight="800">
        Vin: {point.vin.toFixed(2)}V | I_LED: {(point.current * 1000).toFixed(2)}mA
      </text>
      <text x="160" y="352" fill="#64748b" fontSize="12" fontWeight="800">
        Electron flow dots: small/slow for leakage, bright when LED conducts
      </text>
    </svg>
  );
}
