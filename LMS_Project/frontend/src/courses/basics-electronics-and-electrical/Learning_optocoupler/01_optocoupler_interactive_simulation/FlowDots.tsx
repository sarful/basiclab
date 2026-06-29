"use client";

import { motion } from "framer-motion";

type FlowDotsProps = {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  reverse?: boolean;
  duration?: number;
  radius?: number;
};

export function FlowDots({
  path,
  active,
  color,
  count = 10,
  reverse = false,
  duration = 2.1,
  radius = 4,
}: FlowDotsProps) {
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={`${path}-${i}-${reverse ? "reverse" : "forward"}`}
          r={radius}
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
            delay: i * (duration / count),
          }}
          style={{ offsetPath: `path('${path}')` }}
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
};

export function AcFlowDots({
  path,
  active,
  color,
  count = 8,
}: AcFlowDotsProps) {
  return (
    <>
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={1.35}
      />
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={1.35}
        reverse
      />
    </>
  );
}
