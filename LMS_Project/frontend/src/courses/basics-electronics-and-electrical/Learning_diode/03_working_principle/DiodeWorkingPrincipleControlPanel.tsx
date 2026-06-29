"use client";

import { WorkingControlsSection } from "./WorkingControlsSection";
import type { BiasMode, Section } from "./types";

const SECTION_OPTIONS: {
  value: Section;
  label: string;
  note: string;
  tone: string;
}[] = [
  {
    value: "construction",
    label: "Construction",
    note: "Start with the two semiconductor regions and terminal identity.",
    tone: "border-slate-300 bg-slate-50 text-slate-800",
  },
  {
    value: "formation",
    label: "Formation",
    note: "Watch diffusion, recombination, fixed ions, and barrier creation.",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    value: "working",
    label: "Working Principle",
    note: "Use forward and reverse bias to study conduction and blocking.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
];

const SECTION_BADGE: Record<Section, string> = {
  construction: "Material Setup",
  formation: "Barrier Build",
  working: "Bias Analysis",
};

export function DiodeWorkingPrincipleControlPanel({
  bias,
  onBiasChange,
  onReset,
  onSectionChange,
  onVoltageChange,
  section,
  voltage,
}: {
  bias: BiasMode;
  onBiasChange: (bias: BiasMode) => void;
  onReset: () => void;
  onSectionChange: (section: Section) => void;
  onVoltageChange: (voltage: number) => void;
  section: Section;
  voltage: number;
}) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-700">
            Control Panel
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">
            Diode Working
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Move through structure, junction formation, and live bias behavior from one guided lesson panel.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">
          Active Stage
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-sm font-black text-slate-900">{SECTION_BADGE[section]}</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            {section}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {SECTION_OPTIONS.map((option) => {
          const active = option.value === section;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSectionChange(option.value)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active
                  ? `${option.tone} ring-2 ring-offset-0 ring-slate-300`
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-extrabold uppercase tracking-[0.18em]">
                {option.label}
              </p>
              <p className="mt-2 text-sm leading-6 opacity-90">{option.note}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
          Learning Objective
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Understand how a PN junction is built, how the depletion barrier forms, and why forward bias conducts while reverse bias blocks.
        </p>
      </div>

      {section === "working" ? (
        <div className="mt-5">
          <WorkingControlsSection
            bias={bias}
            voltage={voltage}
            onBiasChange={onBiasChange}
            onVoltageChange={onVoltageChange}
          />
        </div>
      ) : null}
    </aside>
  );
}
