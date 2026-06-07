"use client";

import { motion } from "framer-motion";

export function ElectronDot({
  delay,
  active,
  speed,
}: {
  delay: number;
  active: boolean;
  speed: number;
}) {
  return (
    <motion.circle
      r="5"
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
        duration: Math.max(2.2, 7 - speed * 4),
        delay,
        repeat: active ? Infinity : 0,
        ease: "linear",
      }}
    />
  );
}
