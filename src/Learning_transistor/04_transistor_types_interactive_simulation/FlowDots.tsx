"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  reverse?: boolean;
};

export default function FlowDots({
  path,
  active,
  color,
  count = 10,
  reverse = false,
}: FlowDotsProps) {
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={`${path}-${i}`}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: route[0], opacity: 0 }}
          animate={{
            offsetDistance: active ? route : route[0],
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.13,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}
