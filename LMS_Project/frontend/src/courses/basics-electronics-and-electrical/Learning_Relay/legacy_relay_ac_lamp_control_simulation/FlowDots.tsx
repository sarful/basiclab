"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  duration?: number;
  reverse?: boolean;
};

export function FlowDots({
  path,
  active,
  color,
  count = 10,
  duration = 2.2,
  reverse = false,
}: FlowDotsProps) {
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}-${reverse}`}
          r="4.5"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: route[0], opacity: 0 }}
          animate={{
            offsetDistance: active ? route : route[0],
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay: index * (duration / count),
          }}
          style={{ offsetPath: `path('${path}')` } as CSSProperties}
        />
      ))}
    </>
  );
}

type AcFlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  duration?: number;
};

export function AcFlowDots({
  path,
  active,
  color,
  count = 10,
  duration = 1.6,
}: AcFlowDotsProps) {
  return (
    <>
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={duration}
      />
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={duration}
        reverse
      />
    </>
  );
}
