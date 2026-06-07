"use client";

import React from "react";

import { Activity, Gauge, SlidersHorizontal } from "./icons";
import type { Tone } from "./types";

export function IndustrialLabel({ code, label }: { code: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>{code}</span>
      <span className="hidden text-slate-400 sm:inline">|</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export function StatusBox({ label, value, tone }: { label: string; value: string; tone: "cyan" | Tone }) {
  const color = tone === "green" ? "border-green-300 bg-green-50 text-green-700" : tone === "blue" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-cyan-300 bg-cyan-50 text-cyan-700";

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${color}`}>
      <Gauge className="h-5 w-5" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function VoltageTypeCard({
  tone,
  number,
  title,
  subtitle,
  description,
  preTitle,
  circuit,
  graph,
  controls,
  measurements,
}: {
  tone: Tone;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  preTitle?: React.ReactNode;
  circuit: React.ReactNode;
  graph: React.ReactNode;
  controls: React.ReactNode;
  measurements: React.ReactNode;
}) {
  const toneClasses = tone === "green" ? "border-green-300 bg-green-50/40 text-green-800" : "border-blue-300 bg-blue-50/40 text-blue-800";
  const borderClass = tone === "green" ? "border-green-300" : "border-blue-300";
  const eyebrowClass =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-blue-200 bg-blue-50 text-blue-700";
  const moduleLabel = tone === "green" ? "DC View" : "AC View";

  return (
    <section className={`rounded-[32px] border bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${borderClass}`}>
      {preTitle ? <div className="mb-4">{preTitle}</div> : null}
      <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}>
        <span className={`h-2 w-2 rounded-full ${tone === "green" ? "bg-green-500" : "bg-blue-500"}`} />
        {moduleLabel}
      </div>
      <div className={`mt-4 rounded-2xl border px-4 py-3 text-base font-semibold ${toneClasses}`}>
        {number}. {title} <span className="text-sm font-medium">({subtitle})</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">{description}</p>
      <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-inner">{circuit}</div>
      <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-inner">{graph}</div>
      {controls ? <div className="mt-4">{controls}</div> : null}
      <div className="mt-4">{measurements}</div>
    </section>
  );
}

export function ControlCard({
  title,
  tone,
  description,
  children,
}: {
  title: string;
  tone: Tone;
  description?: string;
  children: React.ReactNode;
}) {
  const color = tone === "green" ? "text-green-800 border-green-200 bg-green-50/70" : "text-blue-800 border-blue-200 bg-blue-50/70";
  return (
    <div className={`rounded-[24px] border p-4 ${color}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]">
        <SlidersHorizontal className="h-4 w-4" />
        {title}
      </div>
      {description ? <p className="mb-4 text-sm leading-6 text-slate-700">{description}</p> : null}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function RangeControl({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  tone,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tone: Tone;
}) {
  const accent = tone === "green" ? "accent-green-600" : "accent-blue-600";

  return (
    <div className="grid gap-2 sm:grid-cols-[130px_1fr_86px] sm:items-center">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full ${accent}`}
      />
      <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800">
        {value} {unit}
      </div>
    </div>
  );
}

export function Measurements({
  voltageLabel,
  voltageValue,
  currentLabel,
  currentValue,
  observation,
  tone,
}: {
  voltageLabel: string;
  voltageValue: string;
  currentLabel: string;
  currentValue: string;
  observation: string;
  tone: Tone;
}) {
  const color = tone === "green" ? "border-green-200 bg-green-50/70 text-green-800" : "border-blue-200 bg-blue-50/70 text-blue-800";

  return (
    <div className={`rounded-[24px] border p-4 ${color}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]">
        <Activity className="h-4 w-4" />
        What to notice
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MeasurementBox label={voltageLabel} value={voltageValue} tone="red" />
        <MeasurementBox label={currentLabel} value={currentValue} tone="blue" />
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Observation</p>
          <p className="mt-1 leading-5">{observation}</p>
        </div>
      </div>
    </div>
  );
}

export function MeasurementBox({ label, value, tone }: { label: string; value: string; tone: "red" | "blue" }) {
  const color = tone === "red" ? "text-red-700" : "text-blue-700";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <p className={`text-sm font-semibold ${color}`}>{label}</p>
      <p className="mt-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-2xl text-slate-950">{value}</p>
    </div>
  );
}

export function GraphBase({ title }: { title: string }) {
  return (
    <>
      <text x="70" y="28" fontSize="14" fontWeight="700" fill="#334155">{title}</text>
      <line x1="70" y1="100" x2="470" y2="100" stroke="#111827" strokeWidth="2" />
      <line x1="70" y1="30" x2="70" y2="180" stroke="#111827" strokeWidth="2" />
      <line x1="470" y1="30" x2="470" y2="180" stroke="#111827" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((tick) => (
        <g key={tick}>
          <line x1={70 + tick * 80} y1="96" x2={70 + tick * 80} y2="104" stroke="#111827" strokeWidth="2" />
          <text x={70 + tick * 80} y="202" textAnchor="middle" fontSize="12" fill="#334155">{tick}</text>
        </g>
      ))}
      <text x="270" y="216" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">Time (s)</text>
    </>
  );
}

export function GraphLabels() {
  return (
    <>
      <text x="74" y="48" fontSize="12" fontWeight="700" fill="#dc2626">Voltage (V)</text>
      <text x="382" y="48" fontSize="12" fontWeight="700" fill="#2563eb">Current (I)</text>
    </>
  );
}
