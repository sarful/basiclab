"use client";

import { useMemo, useState } from "react";

import { ComparisonVisual } from "./ComparisonVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_AC_PEAK,
  DEFAULT_DC_LEVEL,
  DEFAULT_FREQUENCY,
  getAcStrength,
  getDcStrength,
  getRmsFromPeak,
} from "./logic";

export default function WhatIsAcVsDcBasicsInteractiveSimulation() {
  const [dcLevel, setDcLevel] = useState(DEFAULT_DC_LEVEL);
  const [acPeak, setAcPeak] = useState(DEFAULT_AC_PEAK);
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);

  const acRms = useMemo(() => getRmsFromPeak(acPeak), [acPeak]);
  const dcStrength = useMemo(() => getDcStrength(dcLevel), [dcLevel]);
  const acStrength = useMemo(() => getAcStrength(acPeak), [acPeak]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Simulation
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                AC vs DC Basics
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Learn the basic difference between direct current and alternating
                current using a simple side-by-side view.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:min-w-[620px]">
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                  DC
                </p>
                <p className="mt-1 text-lg font-black text-green-700">
                  {dcLevel.toFixed(1)} A
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  AC Peak
                </p>
                <p className="mt-1 text-lg font-black text-blue-700">
                  {acPeak.toFixed(1)} A
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  AC RMS
                </p>
                <p className="mt-1 text-lg font-black text-blue-700">
                  {acRms.toFixed(2)} A
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                  Frequency
                </p>
                <p className="mt-1 text-lg font-black text-slate-800">
                  {frequency.toFixed(1)} Hz
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                DC stays in one direction, while AC changes direction over time
                in a repeating pattern.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              Simple idea: DC = one-way flow | AC = back-and-forth flow
            </div>
          </div>
        </section>

        <main className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ControlPanelSection
              dcLevel={dcLevel}
              acPeak={acPeak}
              frequency={frequency}
              onDcLevelChange={setDcLevel}
              onAcPeakChange={setAcPeak}
              onFrequencyChange={setFrequency}
            />
          </aside>

          <section className="space-y-4">
            <ComparisonVisual
              dcLevel={dcLevel}
              acPeak={acPeak}
              acRms={acRms}
              frequency={frequency}
              dcStrength={dcStrength}
              acStrength={acStrength}
            />

            <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
              <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                    What to Notice
                  </div>
                  <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
                    Watch how the two signals behave
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Focus on direction first. DC stays steady. AC rises, falls,
                    and reverses direction as the waveform repeats.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                    DC Behavior
                  </h3>
                  <p className="mt-3 text-3xl font-black text-green-700">Steady</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Direct current keeps the same direction and level unless the
                    source changes.
                  </p>
                </div>

                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                    AC Behavior
                  </h3>
                  <p className="mt-3 text-3xl font-black text-blue-700">
                    Alternating
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Alternating current rises, falls, and reverses direction
                    every cycle.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
                    Where Used
                  </h3>
                  <p className="mt-3 text-3xl font-black text-slate-900">
                    Battery vs Mains
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Batteries are DC. Home wall outlets are AC.
                  </p>
                </div>
              </div>
            </section>
          </section>
        </main>

        <ExplanationSection />
      </div>
    </div>
  );
}
