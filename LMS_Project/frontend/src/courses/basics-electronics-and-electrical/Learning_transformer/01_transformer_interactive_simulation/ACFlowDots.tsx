"use client";

import { motion } from "framer-motion";

type ACFlowDotsProps = {
  path: string;
  color: string;
  delayOffset?: number;
};

export default function ACFlowDots({
  path,
  color,
  delayOffset = 0,
}: ACFlowDotsProps) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}`}
          r="4"
          fill={color}
          stroke="#e0f2fe"
          strokeWidth="1.4"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%", "0%"],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delayOffset + index * 0.12,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}
