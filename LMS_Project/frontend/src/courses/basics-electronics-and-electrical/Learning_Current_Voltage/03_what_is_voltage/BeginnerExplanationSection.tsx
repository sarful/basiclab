"use client";

import { InfoIcon } from "./icons";

export function BeginnerExplanationSection({
  showExplanation,
  onToggle,
}: {
  showExplanation: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            Summary
          </span>
          <span className="mt-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
            <InfoIcon className="h-5 w-5 text-cyan-600" />
            Beginner summary
          </span>
        </div>
        <span className="text-sm font-medium text-cyan-700">
          {showExplanation ? "Hide" : "Show"}
        </span>
      </button>

      {showExplanation ? (
        <div className="mt-4 space-y-4 text-[0.98rem] leading-7 text-slate-600">
          <p>
            Voltage is not the number of electrons. Voltage is the electrical
            push that can move charge.
          </p>
          <p>
            A battery creates a difference between its positive terminal and
            negative terminal. That difference is called potential difference.
          </p>
          <div className="rounded-xl border border-cyan-300 bg-cyan-50 p-3 font-medium text-cyan-800">
            Simple idea: higher voltage means stronger electrical pressure.
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Voltage</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The electrical push that tries to move charge.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Pressure idea</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                More voltage is like stronger water pressure.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">What to notice</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                As voltage rises, flow gets stronger and the lamp becomes brighter.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Quick reminder</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If voltage rises and resistance does not change, current usually rises too because the push becomes stronger.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
