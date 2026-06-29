"use client";

import { formatNumber } from "../01_transformer_interactive_simulation/logic";

import type {
  TransformerWorkingPrincipleSnapshot,
  TransformerWorkingPrincipleState,
} from "./transformerWorkingPrincipleTypes";

export default function TransformerWorkingPrincipleTheoryPanel({
  state,
  snapshot,
}: {
  state: TransformerWorkingPrincipleState;
  snapshot: TransformerWorkingPrincipleSnapshot;
}) {
  return (
    <section className="rounded-[28px] border border-slate-700/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-5 text-white shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-400">
        Theory Panel
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">
        Working Sequence
      </h2>

      <div className="mt-5 grid gap-3">
        {snapshot.stepStates.map((step) => (
          <div
            key={step.id}
            className={`rounded-2xl border p-4 ${
              step.active
                ? "border-cyan-500/40 bg-cyan-500/10"
                : "border-slate-700 bg-slate-950/70"
            }`}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              Step {step.id}
            </p>
            <h3 className="mt-2 text-base font-black text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-300">
          Formula and Calculation
        </p>

        <div className="mt-3 grid gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Ideal Transformer Formula
            </p>
            <p className="mt-2 text-lg font-black text-white">
              V2 / V1 = N2 / N1
            </p>
            <p className="mt-1 text-sm text-slate-300">
              So, V2 = V1 x (N2 / N1)
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Live Worked Example
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              V2 = {formatNumber(snapshot.inputVoltage, 0)} x (
              {formatNumber(state.secondaryTurns, 0)} / {formatNumber(state.primaryTurns, 0)})
              = {formatNumber(snapshot.outputVoltage, 1)}V
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Turns ratio = {formatNumber(snapshot.turnsRatio, 2)} and the
              transformer is operating in {snapshot.transformerMode.toLowerCase()} mode.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Engineering Meaning
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              If N2 is greater than N1, output voltage rises. If N2 is lower
              than N1, output voltage falls. If N1 equals N2, the transformer
              works in isolation mode.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
