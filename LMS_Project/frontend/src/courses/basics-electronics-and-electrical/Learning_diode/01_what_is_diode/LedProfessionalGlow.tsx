"use client";

import { motion } from "framer-motion";

type LedProfessionalGlowProps = {
  active: boolean;
  intensity: number;
  topTerminal: {
    x: number;
    y: number;
  };
  bottomTerminal: {
    x: number;
    y: number;
  };
  gradientId?: string;
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function LedProfessionalGlow({
  active,
  intensity,
  topTerminal,
  bottomTerminal,
  gradientId = "shared-led-glow",
}: LedProfessionalGlowProps) {
  if (!active) return null;

  const level = clamp01(intensity);
  const centerX = topTerminal.x;
  const centerY = (topTerminal.y + bottomTerminal.y) / 2;

  const outerRadius = 30 + level * 34;
  const middleRadius = 18 + level * 22;
  const coreRadius = 7 + level * 8;

  const outerOpacity = 0.08 + level * 0.18;
  const middleOpacity = 0.14 + level * 0.28;
  const coreOpacity = 0.35 + level * 0.45;

  return (
    <g aria-label="LED brightness glow">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
          <stop offset="35%" stopColor="#facc15" stopOpacity="0.72" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx={centerX}
        cy={centerY}
        r={outerRadius}
        fill={`url(#${gradientId})`}
        opacity={outerOpacity}
        animate={{
          r: [outerRadius - 4, outerRadius + 4, outerRadius - 4],
          opacity: [outerOpacity * 0.75, outerOpacity, outerOpacity * 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx={centerX}
        cy={centerY}
        r={middleRadius}
        fill="#facc15"
        opacity={middleOpacity}
        animate={{
          opacity: [middleOpacity * 0.7, middleOpacity, middleOpacity * 0.7],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
        }}
      />

      <circle
        cx={centerX}
        cy={centerY}
        r={coreRadius}
        fill="#fde68a"
        opacity={coreOpacity}
      />
    </g>
  );
}
