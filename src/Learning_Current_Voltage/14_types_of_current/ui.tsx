"use client";

import React from "react";

import { Activity, Gauge, SlidersHorizontal } from "./icons";
import type { Tone } from "./types";

export function CurrentTypeCard({
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
  const borderClass = tone === "green" ? "border-green-300" : "border-blue-300";
  const titleClass =
    tone === "green"
      ? "border-green-300 bg-green-50 text-green-800"
      : "border-blue-300 bg-blue-50 text-blue-800";
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
      <div className={`mt-4 rounded-2xl border px-4 py-3 text-base font-semibold ${titleClass}`}>
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

export function GraphBase({ title }: { title: string }) {
  return (
    <>
      <text x="70" y="28" fontSize="14" fontWeight="700" fill="#334155">{title}</text>
      <line x1="70" y1="110" x2="470" y2="110" stroke="#111827" strokeWidth="2" />
      <line x1="70" y1="30" x2="70" y2="180" stroke="#111827" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((tick) => (
        <g key={tick}>
          <line x1={70 + tick * 80} y1="106" x2={70 + tick * 80} y2="114" stroke="#111827" strokeWidth="2" />
          <text x={70 + tick * 80} y="202" textAnchor="middle" fontSize="12" fill="#334155">{tick}</text>
        </g>
      ))}
      <text x="270" y="216" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">Time (s)</text>
    </>
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
        <SlidersHorizontal className="h-4 w-4" /> {title}
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
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className={`w-full ${accent}`} />
      <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800">
        {value.toFixed(1)} {unit}
      </div>
    </div>
  );
}

export function Measurements({
  currentLabel,
  currentValue,
  direction,
  observation,
  strength,
  tone,
}: {
  currentLabel: string;
  currentValue: string;
  direction: string;
  observation: string;
  strength: number;
  tone: Tone;
}) {
  const color = tone === "green" ? "border-green-200 bg-green-50/70 text-green-800" : "border-blue-200 bg-blue-50/70 text-blue-800";

  return (
    <div className={`rounded-[24px] border p-4 ${color}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]"><Gauge className="h-4 w-4" /> What to notice</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MeasurementBox label={currentLabel} value={currentValue} />
        <MeasurementBox label="Direction" value={direction} />
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Observation</p>
          <p className="mt-1 leading-5">{observation}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-current transition-all duration-300" style={{ width: `${strength}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeasurementBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xl text-slate-950">{value}</p>
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
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">{icon}</div>
        <div>
          <IndustrialLabel code={code} label="Active Module" />
          <h2 className="mt-2 text-lg font-semibold text-slate-800">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> SYSTEM ACTIVE
      </div>
    </div>
  );
}

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

export function StatusBox({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "slate" }) {
  const color = tone === "green" ? "border-green-300 bg-green-50 text-green-700" : tone === "blue" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-300 bg-slate-50 text-slate-700";
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

export function ConceptCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export function CoreIdeaBanner() {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-amber-300 bg-white p-2">
            <Activity className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">Core Idea</p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Current means charge flow. DC current is steady in one direction. AC current reverses direction again and again.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm">
          <span className="font-semibold text-slate-700">Legend</span>
          <span className="flex items-center gap-2 text-green-700"><span className="h-1 w-10 rounded-full bg-green-500" /> DC Current</span>
          <span className="flex items-center gap-2 text-blue-700"><span className="h-1 w-10 rounded-full bg-blue-500" /> AC Current</span>
        </div>
      </div>
    </section>
  );
}
