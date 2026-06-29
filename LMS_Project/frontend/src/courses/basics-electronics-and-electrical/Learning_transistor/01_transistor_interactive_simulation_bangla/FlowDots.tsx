"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  delayOffset?: number;
  reverse?: boolean;
};

export default function FlowDots({
  path,
  active,
  color,
  delayOffset = 0,
  reverse = false,
}: FlowDotsProps) {
  const distance = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <>
      {Array.from({ length: 16 }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}`}
          r="4"
          fill={active ? color : "#94a3b8"}
          stroke="#fef08a"
          strokeWidth="1.2"
          initial={{ offsetDistance: distance[0], opacity: 0 }}
          animate={{
            offsetDistance: active ? distance : distance[0],
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
            delay: delayOffset + index * 0.11,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}
