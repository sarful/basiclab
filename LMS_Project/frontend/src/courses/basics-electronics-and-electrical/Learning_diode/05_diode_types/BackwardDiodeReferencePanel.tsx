"use client";

import type { ReactNode } from "react";

import type { DiodeType } from "./types";
import BackwardDiodeSymbol from "./BackwardDiodeSymbol";

const panelClass =
  "rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5";

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">{children}</p>;
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-2 text-xl font-black text-slate-950">{children}</h3>;
}

function SymbolSketch() {
  return (
    <div className={panelClass}>
      <SectionLabel>Symbol Sketch</SectionLabel>
      <CardTitle>Backward Diode Symbol</CardTitle>
      <div className="mt-5 flex items-center justify-center">
        <BackwardDiodeSymbol className="h-auto w-full max-w-[560px] text-slate-950" />
      </div>
    </div>
  );
}

function PhysicalSketch({ diode }: { diode: DiodeType }) {
  return (
    <div className={panelClass}>
      <SectionLabel>Physical Component</SectionLabel>
      <CardTitle>{diode.partNumber ?? "Tunnel detector family"}</CardTitle>

      <svg viewBox="0 0 760 220" className="mt-5 h-auto w-full" role="img" aria-label="Backward diode package sketch">
        <defs>
          <linearGradient id="backward-shell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="35%" stopColor="#111827" />
            <stop offset="70%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>

        <line x1="32" y1="112" x2="222" y2="112" stroke="#8f8f8f" strokeWidth="8" strokeLinecap="round" />
        <line x1="538" y1="112" x2="728" y2="112" stroke="#8f8f8f" strokeWidth="8" strokeLinecap="round" />
        <rect x="222" y="54" width="316" height="116" rx="24" fill="url(#backward-shell)" />
        <rect x="478" y="54" width="22" height="116" fill="#d1d5db" opacity="0.95" />
        <rect x="494" y="54" width="10" height="116" fill="#f8fafc" opacity="0.85" />

        <text x="380" y="92" textAnchor="middle" fontSize="34" fontWeight="500" fill="#f8fafc">
          Backward
        </text>
        <text x="380" y="120" textAnchor="middle" fontSize="19" fontWeight="500" fill="#e5e7eb">
          Tunnel Detector Device
        </text>
        <text x="380" y="146" textAnchor="middle" fontSize="16" fontWeight="500" fill="#cbd5e1">
          Low-voltage reverse conduction
        </text>
        <text x="34" y="48" fontSize="26" fontWeight="800" fill="#111827">
          ANODE (+)
        </text>
        <text x="560" y="48" fontSize="26" fontWeight="800" fill="#111827">
          CATHODE (-)
        </text>
      </svg>
    </div>
  );
}

function BehaviorSketch({
  title,
  badge,
  lineColor,
  description,
  symbolCaption,
  symbolToneClass,
}: {
  title: string;
  badge: string;
  lineColor: string;
  description: string;
  symbolCaption: string;
  symbolToneClass: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel>{title}</SectionLabel>
          <CardTitle>{title}</CardTitle>
        </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700">
          {badge}
        </span>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/90 bg-white/90 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-500">Symbol focus</p>
          <span className={`rounded-full border border-current/20 bg-current/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${symbolToneClass}`}>
            {symbolCaption}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
          <div className={`flex items-center justify-center rounded-[20px] border border-slate-200 bg-slate-50 px-3 py-4 ${symbolToneClass}`}>
            <BackwardDiodeSymbol className="h-auto w-full max-w-[420px]" />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Direction</p>
              <p className="mt-1 text-sm font-black text-slate-950">
                Anode <span className="text-slate-500">→</span> cathode reference stays visible, but the operating region is reversed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Teaching cue</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
        <p className="text-base font-bold text-slate-900">{description}</p>
      </div>
    </div>
  );
}

function SpecificationPanel({ diode }: { diode: DiodeType }) {
  return (
    <div className={panelClass}>
      <SectionLabel>Specifications</SectionLabel>
      <CardTitle>Reverse Tunneling Numbers</CardTitle>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(diode.specifications ?? []).map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-black text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BackwardDiodeReferencePanel({ diode }: { diode: DiodeType }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="border-b border-slate-200 pb-5">
        <SectionLabel>Backward Diode Training</SectionLabel>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{diode.name}</h2>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <SymbolSketch />
        <PhysicalSketch diode={diode} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <BehaviorSketch
          title="Reverse Behavior"
          badge="Reverse Conduction"
          lineColor="#dc2626"
          description="Very small reverse voltage can trigger low-voltage conduction before the stronger blocking region takes over."
          symbolCaption="Reverse Region"
          symbolToneClass="text-red-600"
        />
        <BehaviorSketch
          title="Blocking Behavior"
          badge="Reverse Blocking"
          lineColor="#2563eb"
          description="Outside the tunneling window, the diode acts like a reverse blocker and keeps current suppressed."
          symbolCaption="Blocking Region"
          symbolToneClass="text-blue-600"
        />
      </div>

      <div className="mt-5">
        <SpecificationPanel diode={diode} />
      </div>
    </section>
  );
}
