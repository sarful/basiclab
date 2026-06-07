"use client";

import React from "react";

import { ZapIcon } from "./icons";

export function IndustrialLabel({
  code,
  label,
}: {
  code: string;
  label: string;
}) {
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

export function IndustrialHeader({
  icon,
  code,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  code: string;
  title: string;
  subtitle: string;
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
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Live
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  tone,
}: {
  title: string;
  tone: "blue" | "red";
}) {
  const classes =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-base font-semibold ${classes}`}>
      {title}
    </div>
  );
}

export function StatusBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3.5 shadow-sm">
      <ZapIcon className="h-5 w-5 text-cyan-600" />
      <div>
        <p className="text-[0.82rem] font-medium text-slate-500">{label}</p>
        <p className="text-[1.35rem] font-semibold text-cyan-700">{value}</p>
      </div>
    </div>
  );
}
