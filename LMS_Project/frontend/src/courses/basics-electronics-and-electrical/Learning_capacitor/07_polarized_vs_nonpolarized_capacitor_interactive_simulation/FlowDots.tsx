"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  reverse?: boolean;
};

export function FlowDots({ reverse = false }: FlowDotsProps) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.circle
          key={index}
          r="4"
          fill="#0ea5e9"
          stroke="#e0f2fe"
          strokeWidth="1.4"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: reverse ? "0%" : "100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "linear", delay: index * 0.15 }}
          style={{ offsetPath: "path('M90 210 H300')" }}
        />
      ))}
    </>
  );
}
