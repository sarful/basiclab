"use client";

import type { ReactNode } from "react";

import { ZenerDiodePhysicalComponent, ZenerDiodeSymbol } from "./ZenerDiode/ZenerDiode";
import type { DiodeType } from "./types";

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
      <CardTitle>Zener Diode Symbol</CardTitle>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
          <div className="rounded-[16px] border border-slate-100 bg-slate-50/70 px-3 py-4">
            <ZenerDiodeSymbol />
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Physical Component</p>
          <p className="mt-1 text-base font-black text-slate-950">Zener Diode Physical</p>
          <div className="mt-3 rounded-[16px] border border-slate-100 bg-slate-50/70 px-3 py-4">
            <ZenerDiodePhysicalComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

function BehaviorSketch({
  title,
  tone,
  stateBadge,
  body,
  footer,
  active,
  showFlow,
}: {
  title: string;
  tone: "forward" | "reverse";
  stateBadge: string;
  body: string;
  footer: string;
  active: string;
  showFlow: boolean;
}) {
  const palette =
    tone === "forward"
      ? {
          frame: "border-emerald-200 bg-emerald-50/60",
          badge: "bg-emerald-100 text-emerald-800",
          card: "border-emerald-100 bg-white",
          strip: "border-emerald-200 bg-emerald-50 text-emerald-800",
          title: "Forward conduction",
        }
      : {
          frame: "border-amber-200 bg-amber-50/60",
          badge: "bg-amber-100 text-amber-800",
          card: "border-amber-100 bg-white",
          strip: "border-amber-200 bg-amber-50 text-amber-800",
          title: "Reverse breakdown regulation",
        };

  return (
    <div className={`rounded-[28px] border p-4 sm:p-5 ${palette.frame}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel>{title}</SectionLabel>
          <CardTitle>{tone === "forward" ? "Forward" : "Reverse"}</CardTitle>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] ${palette.badge}`}>
          {stateBadge}
        </span>
      </div>

      <div className={`mt-5 rounded-[20px] border px-4 py-4 ${palette.card}`}>
        <div className="rounded-[16px] border border-slate-100 bg-slate-50/70 px-3 py-4">
          <ZenerDiodeSymbol />
        </div>

        <div className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold ${palette.strip}`}>
          <span>{palette.title}</span>
          <span>{showFlow ? "Current path active" : "Regulation threshold monitored"}</span>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-base font-bold text-slate-900">{body}</p>
          <p className="mt-2 text-sm font-semibold" style={{ color: active }}>
            {footer}
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecificationPanel({ diode }: { diode: DiodeType }) {
  return (
    <div className={panelClass}>
      <SectionLabel>Specifications</SectionLabel>
      <CardTitle>Zener Engineering Specification</CardTitle>

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

export default function ZenerDiodeReferencePanel({ diode }: { diode: DiodeType }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="border-b border-slate-200 pb-5">
        <SectionLabel>Zener Diode Training</SectionLabel>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{diode.name}</h2>
      </div>

      <div className="mt-5">
        <SymbolSketch />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <BehaviorSketch
          title="Forward Behavior"
          tone="forward"
          stateBadge="Forward Bias"
          body="In forward bias, the zener diode behaves like a normal silicon diode and conducts from anode to cathode."
          footer="Forward conduction is not the special zener operating mode."
          active="#059669"
          showFlow
        />
        <BehaviorSketch
          title="Reverse Behavior"
          tone="reverse"
          stateBadge="Zener Region"
          body="In reverse bias, the zener blocks first and then enters controlled breakdown near its zener voltage to hold a stable reference."
          footer="Reverse breakdown is the intended regulation region for a zener diode."
          active="#d97706"
          showFlow={false}
        />
      </div>

      <div className="mt-5">
        <SpecificationPanel diode={diode} />
      </div>
    </section>
  );
}
