"use client";

import type { ReactNode } from "react";

import type { DiodeType } from "./types";
import TunnelDiodePackage from "./TunnelDiodePackage";
import TunnelDiodeSymbol from "./TunnelDiodeSymbol";

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
      <CardTitle>Tunnel Diode Symbol</CardTitle>
      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-5">
        <TunnelDiodeSymbol className="mx-auto h-auto w-full max-w-[620px] text-slate-950" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Anode</p>
            <p className="mt-1 text-sm font-bold text-slate-800">Left terminal is the reference entry side.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Cathode</p>
            <p className="mt-1 text-sm font-bold text-slate-800">The bar-and-hook side marks the blocking end.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhysicalSketch({ diode }: { diode: DiodeType }) {
  return (
    <div className={panelClass}>
      <SectionLabel>Physical Component</SectionLabel>
      <CardTitle>{diode.partNumber ?? "1N3716"}</CardTitle>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-5">
        <TunnelDiodePackage className="mx-auto h-auto w-full max-w-[720px]" partNumber={diode.partNumber ?? "1N3716"} />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Lead orientation</p>
            <p className="mt-1 text-sm font-bold text-slate-800">The metal leads enter from both sides like a small axial diode.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Package cue</p>
            <p className="mt-1 text-sm font-bold text-slate-800">The gold body and dark banding help identify the tunnel diode package style.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BehaviorSketch({
  title,
  badge,
  accent,
  description,
  curveTone,
}: {
  title: string;
  badge: string;
  accent: string;
  description: string;
  curveTone: "peak" | "reverse";
}) {
  return (
    <div
      className={`rounded-[28px] border p-4 sm:p-5 ${
        curveTone === "peak" ? "border-indigo-200 bg-indigo-50/60" : "border-slate-200 bg-slate-50/60"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel>{title}</SectionLabel>
          <CardTitle>{curveTone === "peak" ? "Negative Resistance" : "Reverse Blocking"}</CardTitle>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em]"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          {badge}
        </span>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">
            {curveTone === "peak" ? "Negative resistance focus" : "Reverse blocking focus"}
          </p>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
            Tunnel symbol reference
          </span>
        </div>

        <div className="mt-4 rounded-[22px] border border-white/90 bg-white/90 px-4 py-4">
          <TunnelDiodeSymbol className={`mx-auto h-auto w-full max-w-[420px] ${curveTone === "peak" ? "text-indigo-600" : "text-rose-600"}`} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Symbol cue</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {curveTone === "peak"
                  ? "The updated symbol helps teach the peak-to-valley behavior more clearly."
                  : "The cathode-side bar still marks the reverse blocking side in the updated symbol."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Teaching cue</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {curveTone === "peak"
                  ? "Current drops even as voltage rises through the negative-resistance zone."
                  : "Only a small leakage path remains while the device stays in reverse block."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
          <p className="text-base font-bold text-slate-900">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SpecificationPanel({ diode }: { diode: DiodeType }) {
  return (
    <div className={panelClass}>
      <SectionLabel>Specifications</SectionLabel>
      <CardTitle>Basic Engineering Specification</CardTitle>

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

export default function TunnelDiodeReferencePanel({ diode }: { diode: DiodeType }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="border-b border-slate-200 pb-5">
        <SectionLabel>Tunnel Diode Training</SectionLabel>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{diode.name}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
          The tunnel diode is shown as a compact negative-resistance device where the current rises, then falls, and
          then stabilizes again as voltage increases.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <SymbolSketch />
        <PhysicalSketch diode={diode} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <BehaviorSketch
          title="Negative Resistance"
          badge="Peak to Valley"
          accent="#4f46e5"
          curveTone="peak"
          description="In the peak-to-valley region, tunneling makes current fall while voltage continues to rise."
        />
        <BehaviorSketch
          title="Reverse Blocking"
          badge="Reverse Bias"
          accent="#dc2626"
          curveTone="reverse"
          description="Reverse bias still behaves like a blocking diode for most study cases, with only a small leakage path."
        />
      </div>

      <div className="mt-5">
        <SpecificationPanel diode={diode} />
      </div>
    </section>
  );
}
