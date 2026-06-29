"use client";

import React from "react";

import type { WaterFlowTone } from "./types";

export function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-[0.95rem] font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Control({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-bold">{label}</label>
        <div className="min-w-20 rounded-xl border border-slate-300 bg-white px-4 py-2 text-center font-black">
          {value}
          <div className="text-xs font-medium text-slate-500">{unit}</div>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />

      <div className="flex justify-between text-xs font-semibold text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function Reading({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0">
      <span className="text-sm font-bold">{label}</span>
      <span className={`text-2xl font-black ${color}`}>
        {value}
        <span className="ml-2 text-xs text-slate-500">{unit}</span>
      </span>
    </div>
  );
}

export function GaugeNeedle({
  cx,
  cy,
  angle,
  length = 32,
}: {
  cx: number;
  cy: number;
  angle: number;
  length?: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + Math.cos(rad) * length;
  const y2 = cy + Math.sin(rad) * length;

  return (
    <>
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="#111827" />
    </>
  );
}

export function toneTextClass(tone: WaterFlowTone): string {
  switch (tone) {
    case "red":
      return "text-red-600";
    case "green":
      return "text-green-600";
    case "purple":
      return "text-purple-600";
    case "blue":
    default:
      return "text-blue-700";
  }
}
