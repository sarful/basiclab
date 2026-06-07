"use client";

import { motion } from "framer-motion";

type ElectronFlowProps = {
  active: boolean;
  intensity: number;
};

export function ElectronFlow({ active, intensity }: ElectronFlowProps) {
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 150 + (i % 5) * 12;
        return (
          <motion.circle
            key={i}
            r={3.2 + intensity * 1.8}
            fill="#2563eb"
            stroke="#dbeafe"
            strokeWidth="1"
            initial={{ cx: 88, opacity: 0 }}
            animate={{
              cx: active ? [88, 190, 260, 330, 438] : 88,
              opacity: active ? [0, 0.95, 1, 0.95, 0] : 0,
            }}
            cy={y}
            transition={{
              duration: 2.1 - intensity * 0.55,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.07,
            }}
          />
        );
      })}
    </>
  );
}

type HoleFlowProps = {
  active: boolean;
  intensity: number;
};

export function HoleFlow({ active, intensity }: HoleFlowProps) {
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 210 + (i % 4) * 11;
        return (
          <motion.circle
            key={i}
            r={3 + intensity * 1.5}
            fill="#dc2626"
            stroke="#fee2e2"
            strokeWidth="1"
            initial={{ cx: 438, opacity: 0 }}
            animate={{
              cx: active ? [438, 330, 260, 190, 88] : 438,
              opacity: active ? [0, 0.9, 1, 0.9, 0] : 0,
            }}
            cy={y}
            transition={{
              duration: 2.6 - intensity * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.09,
            }}
          />
        );
      })}
    </>
  );
}
