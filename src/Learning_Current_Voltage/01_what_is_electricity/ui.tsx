"use client";

import React from "react";

import { GaugeIcon } from "./icons";

export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  accent: "red" | "slate";
}) {
  const accentClass = accent === "red" ? "accent-red-600" : "accent-slate-600";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[0.98rem] font-semibold text-slate-700">{label}</label>
        <span className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-[0.98rem] font-semibold text-slate-800">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className={`w-full ${accentClass}`} />
    </div>
  );
}

export function IndustrialHeader({
  code,
  title,
  subtitle,
  icon,
}: {
  code: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 shadow-sm">{icon}</div>
        <div>
          <IndustrialLabel code={code} label="" />
          <h2 className="mt-2 text-[1.12rem] font-semibold leading-7 text-slate-900 md:text-[1.18rem]">{title}</h2>
          <p className="mt-1 text-[0.98rem] leading-7 text-slate-600">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live
      </div>
    </div>
  );
}

export function IndustrialLabel({ code, label }: { code: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>{code}</span>
      {label ? (
        <>
          <span className="hidden text-slate-400 sm:inline">|</span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : null}
    </div>
  );
}

export function StatusCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "cyan";
}) {
  const style =
    tone === "red"
      ? "border-red-300 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : "border-cyan-300 bg-cyan-50 text-cyan-700";

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm ${style}`}>
      <GaugeIcon className="h-5 w-5" />
      <div>
        <p className="text-[0.82rem] font-medium text-slate-500">{label}</p>
        <p className="text-[1.35rem] font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
}

export function MetricCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "red" | "blue" | "slate";
}) {
  const color =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${color}`}>
      <p className="text-[1rem] font-semibold">{title}</p>
      <p className="mt-2 text-[1.75rem] font-semibold leading-none">{value}</p>
      <p className="mt-2 text-[0.95rem] leading-6 opacity-80">{detail}</p>
    </div>
  );
}

export function ConceptCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[1rem] font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">{detail}</p>
    </div>
  );
}
