"use client";

import { motion } from "framer-motion";

export function ElectronFlow({
  active,
  path,
  color = "#0ea5e9",
  count = 4,
  flowRate = 1,
}: {
  active: boolean;
  path: { x: number; y: number }[];
  color?: string;
  count?: number;
  flowRate?: number;
}) {
  if (!active || path.length < 2) return null;
  const xs = path.map((point) => point.x);
  const ys = path.map((point) => point.y);
  const duration = 2.4 / flowRate;
  const delayStep = 0.35 / flowRate;

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <motion.circle
          key={`electron-${index}-${flowRate}`}
          r="5"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
          animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration, delay: index * delayStep, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </>
  );
}
