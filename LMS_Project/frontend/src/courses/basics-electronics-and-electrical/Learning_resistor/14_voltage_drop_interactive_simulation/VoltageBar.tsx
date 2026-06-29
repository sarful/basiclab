"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber } from "./logic";

export function VoltageBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="font-bold text-slate-700">{formatNumber(value, 2)}V</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${clamp((value / total) * 100, 0, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {formatNumber((value / total) * 100, 1)}% of supply
      </p>
    </div>
  );
}
