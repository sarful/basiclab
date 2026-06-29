"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber } from "./logic";

type ConstructionBarProps = {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  note: string;
};

export function ConstructionBar({
  label,
  value,
  maxValue,
  color,
  note,
}: ConstructionBarProps) {
  const width = clamp((value / Math.max(maxValue, 0.000001)) * 100, 0, 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="font-bold text-slate-700">{formatNumber(width, 1)}%</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}
