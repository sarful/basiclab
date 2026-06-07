"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
};

export default function FlowDots({
  path,
  active,
  color,
  count = 10,
}: FlowDotsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: active ? ["0%", "100%"] : "0%",
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.12,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}
