"use client";

import { motion } from "framer-motion";

import type { BiasMode } from "./types";

export function JunctionDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="5" fill="#374151" />;
}

export function BatterySymbol({ bias, voltage }: { bias: BiasMode; voltage: number }) {
  const isForward = bias === "forward";

  return (
    <g>
      <circle cx="90" cy="155" r="36" fill="white" stroke="#374151" strokeWidth="3" />
      <text x="90" y="143" textAnchor="middle" fontSize="30" fill={isForward ? "#dc2626" : "#111827"}>
        {isForward ? "+" : "−"}
      </text>
      <line x1="70" y1="155" x2="110" y2="155" stroke="#374151" strokeWidth="2.5" />
      <text x="90" y="180" textAnchor="middle" fontSize="30" fill={isForward ? "#111827" : "#dc2626"}>
        {isForward ? "−" : "+"}
      </text>
      <text x="132" y="160" fontSize="15" fontWeight="800" fill="#334155">
        {voltage.toFixed(1)}V
      </text>
    </g>
  );
}

export function DiodeSymbol() {
  return (
    <g>
      <polygon points="300,38 350,70 300,102" fill="#374151" />
      <line x1="350" y1="38" x2="350" y2="102" stroke="#374151" strokeWidth="4" />
      <text x="280" y="72" fontSize="18" fontWeight="700" fill="#dc2626">+</text>
      <text x="360" y="72" fontSize="18" fontWeight="700" fill="#111827">−</text>
      <text x="286" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">Anode</text>
      <text x="365" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">Cathode</text>
      <rect x="304" y="124" width="72" height="22" rx="6" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
      <text x="340" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c2410c">≈0.7V drop</text>
    </g>
  );
}

export function LedSymbol({
  active,
  brightness,
}: {
  active: boolean;
  brightness: number;
}) {
  const ledColor = active ? "#facc15" : "#374151";
  const glowOpacity = 0.12 + brightness * 0.38;
  const glowRadius = 42 + brightness * 28;

  return (
    <g>
      <line x1="640" y1="70" x2="640" y2="118" stroke="#dc2626" strokeWidth="4" />
      {active && (
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
      <polygon points="615,118 665,118 640,168" fill={ledColor} stroke={active ? "#ca8a04" : "none"} strokeWidth="2" />
      <line x1="607" y1="168" x2="673" y2="168" stroke={active ? "#ca8a04" : ledColor} strokeWidth="4" />
      <line x1="640" y1="168" x2="640" y2="255" stroke="#111827" strokeWidth="4" />

      <motion.g
        animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.2 }}
        transition={{ repeat: active ? Infinity : 0, duration: 0.9 }}
      >
        <line x1="680" y1="125" x2="712" y2="157" stroke={active ? "#f59e0b" : "#374151"} strokeWidth="4" />
        <polygon points="712,157 696,152 707,141" fill={active ? "#f59e0b" : "#374151"} />
        <line x1="665" y1="142" x2="697" y2="174" stroke={active ? "#f59e0b" : "#374151"} strokeWidth="4" />
        <polygon points="697,174 681,169 692,158" fill={active ? "#f59e0b" : "#374151"} />
      </motion.g>

      <text x="590" y="278" fontSize="15" fontWeight="700" fill={active ? "#16a34a" : "#64748b"}>
        {active ? `LED ON ${(brightness * 100).toFixed(0)}%` : "LED OFF"}
      </text>
    </g>
  );
}
