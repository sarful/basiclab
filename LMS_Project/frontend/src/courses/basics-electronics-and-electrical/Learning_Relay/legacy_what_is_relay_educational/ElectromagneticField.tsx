"use client";

import { motion } from "framer-motion";

type ElectromagneticFieldProps = {
  cx: number;
  cy: number;
  active: boolean;
  scale?: number;
};

export default function ElectromagneticField({
  cx,
  cy,
  active,
  scale = 1,
}: ElectromagneticFieldProps) {
  if (!active) return null;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.15, 0.75, 0.15] }}
      transition={{ duration: 1.1, repeat: Infinity }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={48 * scale}
        ry={18 * scale}
        fill="none"
        stroke="#2563eb"
        strokeWidth={3 * scale}
        strokeDasharray="8 8"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={68 * scale}
        ry={28 * scale}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2.5 * scale}
        strokeDasharray="10 10"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={88 * scale}
        ry={38 * scale}
        fill="none"
        stroke="#60a5fa"
        strokeWidth={2 * scale}
        strokeDasharray="12 12"
      />
      <motion.path
        d={`M ${cx - 90 * scale} ${cy} C ${cx - 45 * scale} ${
          cy - 55 * scale
        }, ${cx + 45 * scale} ${cy + 55 * scale}, ${cx + 90 * scale} ${cy}`}
        fill="none"
        stroke="#2563eb"
        strokeWidth={2.5 * scale}
        strokeLinecap="round"
        animate={{ pathLength: [0.15, 1, 0.15] }}
        transition={{ duration: 1.25, repeat: Infinity }}
      />
      <motion.path
        d={`M ${cx - 90 * scale} ${cy} C ${cx - 45 * scale} ${
          cy + 55 * scale
        }, ${cx + 45 * scale} ${cy - 55 * scale}, ${cx + 90 * scale} ${cy}`}
        fill="none"
        stroke="#2563eb"
        strokeWidth={2.5 * scale}
        strokeLinecap="round"
        animate={{ pathLength: [1, 0.15, 1] }}
        transition={{ duration: 1.25, repeat: Infinity }}
      />
    </motion.g>
  );
}
