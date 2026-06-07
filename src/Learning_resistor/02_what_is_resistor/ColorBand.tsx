"use client";

import { motion } from "framer-motion";

export function ColorBand({
  x,
  color,
  label,
  title,
  colorName,
  valueText,
}: {
  x: number;
  color: string;
  label: string;
  title: string;
  colorName: string;
  valueText: string;
}) {
  return (
    <g className="group cursor-help">
      <motion.rect
        x={x}
        y="35"
        width="22"
        height="90"
        rx="2"
        fill={color}
        stroke="#111827"
        strokeWidth="1"
        initial={{ opacity: 0.7, scaleY: 0.92 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.25 }}
      />
      <text x={x + 11} y="148" textAnchor="middle" className="fill-slate-700 text-[11px]">
        {label}
      </text>
      <foreignObject
        x={x - 72}
        y="-18"
        width="170"
        height="68"
        className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="rounded-xl bg-slate-950 px-3 py-2 text-left text-[11px] leading-tight text-white shadow-xl">
          <p className="font-semibold">{title}</p>
          <p>Color: {colorName}</p>
          <p>Value: {valueText}</p>
        </div>
      </foreignObject>
    </g>
  );
}
