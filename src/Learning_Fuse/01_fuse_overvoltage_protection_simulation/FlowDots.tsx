"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  duration?: number;
};

export function FlowDots({
  path,
  active,
  color,
  count = 12,
  duration = 2.2,
}: FlowDotsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}`}
          r="5"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: active ? ["0%", "100%"] : "0%",
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay: index * (duration / count),
          }}
          style={{ offsetPath: `path('${path}')` } as React.CSSProperties}
        />
      ))}
    </>
  );
}
