"use client";

import React from "react";

import { Gauge } from "./icons";

export function IndustrialHeader({ code, title, subtitle, icon }: { code: string; title: string; subtitle: string; icon: React.ReactNode }) {
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
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>{code}</span>
      <span className="hidden text-slate-400 sm:inline">|</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export function StatusCard({ label, value, tone }: { label: string; value: string; tone: "red" | "blue" | "cyan" }) {
  const style =
    tone === "red"
      ? "border-red-300 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : "border-cyan-300 bg-cyan-50 text-cyan-700";

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${style}`}>
      <Gauge className="h-5 w-5" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function MetricCard({ title, value, detail, tone }: { title: string; value: string; detail: string; tone: "blue" | "cyan" | "slate" }) {
  const color =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : tone === "cyan"
        ? "border-cyan-200 bg-cyan-50 text-cyan-800"
        : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm leading-5 opacity-80">{detail}</p>
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

