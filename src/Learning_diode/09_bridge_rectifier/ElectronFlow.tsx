"use client";

import { motion } from "framer-motion";

import { clamp } from "./logic";

export function ElectronFlow({
  active,
  path,
  color = "#0ea5e9",
  count = 4,
  speed = 1,
}: {
  active: boolean;
  path: { x: number; y: number }[];
  color?: string;
  count?: number;
  speed?: number;
}) {
  if (!active || path.length < 2) return null;

  const safeSpeed = clamp(speed, 0.2, 5);
  const dynamicCount = Math.max(1, Math.round(count * safeSpeed));
  const duration = 4 / safeSpeed;
  const delayStep = duration / dynamicCount;
  const xs = path.map((point) => point.x);
  const ys = path.map((point) => point.y);

  return (
    <g key={`electron-flow-${safeSpeed.toFixed(1)}-${dynamicCount}-${path[0].x}-${path[0].y}`}>
      {Array.from({ length: dynamicCount }, (_, index) => (
        <motion.circle
          key={`electron-${index}-${safeSpeed.toFixed(1)}`}
          r="5"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
          animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 0] }}
          transition={{
            duration,
            delay: index * delayStep,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </g>
  );
}
