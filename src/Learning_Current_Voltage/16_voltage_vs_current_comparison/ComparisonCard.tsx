"use client";

import { motion } from "framer-motion";

import type { FlowLevel } from "./types";

export function ComparisonCard({
  title,
  level,
  value,
  percent,
  color,
  description,
}: {
  title: string;
  level: FlowLevel;
  value: string;
  percent: number;
  color: "red" | "blue";
  description: string;
}) {
  const cardStyle =
    color === "red" ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50";
  const barStyle = color === "red" ? "bg-red-500" : "bg-blue-500";
  const textStyle = color === "red" ? "text-red-700" : "text-blue-700";

  return (
    <div className={`rounded-[28px] border p-5 ${cardStyle}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-lg font-semibold ${textStyle}`}>{title}</p>
          <p className="mt-1 text-sm text-slate-600">Level: {level}</p>
        </div>
        <div className={`text-3xl font-bold leading-none ${textStyle}`}>{value}</div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80">
        <motion.div
          className={`h-full rounded-full ${barStyle}`}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
    </div>
  );
}
