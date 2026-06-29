"use client";

import { useState } from "react";

import TransformerWorkingPrincipleCanvas from "./TransformerWorkingPrincipleCanvas";
import TransformerWorkingPrincipleControlPanel from "./TransformerWorkingPrincipleControlPanel";
import TransformerWorkingPrincipleDashboard from "./TransformerWorkingPrincipleDashboard";
import {
  applyTransformerWorkingPrinciplePreset,
  DEFAULT_TRANSFORMER_WORKING_PRINCIPLE_STATE,
  deriveTransformerWorkingPrincipleSnapshot,
} from "./transformerWorkingPrincipleLogic";
import type {
  TransformerWorkingPrinciplePreset,
  TransformerWorkingPrincipleState,
} from "./transformerWorkingPrincipleTypes";

export default function TransformerWorkingPrincipleSketch() {
  const [state, setState] = useState<TransformerWorkingPrincipleState>(
    DEFAULT_TRANSFORMER_WORKING_PRINCIPLE_STATE,
  );

  const snapshot = deriveTransformerWorkingPrincipleSnapshot(state);

  function updateState(patch: Partial<TransformerWorkingPrincipleState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function resetState() {
    setState(DEFAULT_TRANSFORMER_WORKING_PRINCIPLE_STATE);
  }

  function applyPreset(preset: TransformerWorkingPrinciplePreset) {
    setState(applyTransformerWorkingPrinciplePreset(preset));
  }

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          "radial-gradient(circle at top, rgba(34,211,238,0.08), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eef4f8 52%, #f7fafc 100%)",
      }}
    >
      <div
        className="mx-auto max-w-[1680px] p-3 sm:p-5 xl:p-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-cyan-700">
                Transformer Training Simulator
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Transformer Working Principle
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Industrial-style simulation dashboard for magnetic coupling,
                isolated energy transfer, and live turns-ratio behavior.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {snapshot.statusBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-700"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <TransformerWorkingPrincipleControlPanel
            state={state}
            onStateChange={updateState}
            onReset={resetState}
            onPreset={applyPreset}
          />

          <div className="grid gap-5">
            <TransformerWorkingPrincipleCanvas
              state={state}
              snapshot={snapshot}
            />
            <TransformerWorkingPrincipleDashboard snapshot={snapshot} />
          </div>
        </div>
      </div>
    </div>
  );
}
