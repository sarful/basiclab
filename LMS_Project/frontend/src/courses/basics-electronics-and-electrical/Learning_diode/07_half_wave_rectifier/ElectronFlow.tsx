"use client";

import { motion } from "framer-motion";

export function ElectronFlow({
  active,
  path,
  color = "#38bdf8",
  count = 4,
  reverse = false,
}: {
  active: boolean;
  path: { x: number; y: number }[];
  color?: string;
  count?: number;
  reverse?: boolean;
}) {
  if (!active || path.length < 2) return null;

  const points = reverse ? [...path].reverse() : path;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <motion.circle
          key={`electron-${index}`}
          r="5"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
          animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 0] }}
          transition={{
            duration: 2.2,
            delay: index * 0.35,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}
