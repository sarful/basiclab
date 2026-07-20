"use client";

import { useMemo, useState } from "react";

import { ComparisonCircuit } from "./ComparisonCircuit";
import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_RESISTANCE_ONE,
  DEFAULT_RESISTANCE_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getParallelFlowPercent,
  getSeriesFlowPercent,
  solveSeriesVsParallelLesson,
} from "./logic";

export default function WhatIsSeriesVsParallelComparisonInteractiveSimulation() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [resistanceOne, setResistanceOne] = useState(DEFAULT_RESISTANCE_ONE);
  const [resistanceTwo, setResistanceTwo] = useState(DEFAULT_RESISTANCE_TWO);

  const solved = useMemo(
    () => solveSeriesVsParallelLesson(voltage, resistanceOne, resistanceTwo),
    [voltage, resistanceOne, resistanceTwo],
  );

  const seriesFlowPercent = useMemo(
    () => getSeriesFlowPercent(solved.seriesCurrent),
    [solved.seriesCurrent],
  );
  const parallelFlowPercent = useMemo(
    () => getParallelFlowPercent(solved.parallelTotalCurrent),
    [solved.parallelTotalCurrent],
  );
  const seriesFlowLevel = useMemo(
    () => getFlowLevel(solved.seriesCurrent),
    [solved.seriesCurrent],
  );
  const parallelFlowLevel = useMemo(
    () => getFlowLevel(solved.parallelTotalCurrent),
    [solved.parallelTotalCurrent],
  );

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Simulation
              </div>
              <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950 md:text-[3rem]">
                Series vs Parallel Comparison
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                Compare the same two resistors in two different circuit layouts to
                see how current, resistance, and voltage behavior changes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:min-w-[620px]">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Voltage</p>
                <p className="mt-1 text-lg font-black text-red-700">{solved.voltage.toFixed(1)} V</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Series I</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.seriesCurrent.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Parallel I</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.parallelTotalCurrent.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">Comparison</p>
                <p className="mt-1 text-sm font-black text-green-700">
                  {solved.parallelEquivalentResistance < solved.seriesTotalResistance
                    ? "Parallel draws more current"
                    : "Series draws more current"}
                </p>
              </div>
            </div>
          </div>
        </header> */}

        <section className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                Series adds resistance and keeps one current path. Parallel
                lowers equivalent resistance and lets current divide into
                branches.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:max-w-[440px]">
              <p className="text-sm font-semibold text-slate-900">
                Simple idea
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Same parts do not always behave the same way. The circuit layout
                changes the result.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              voltage={voltage}
              resistanceOne={resistanceOne}
              resistanceTwo={resistanceTwo}
              seriesCurrent={solved.seriesCurrent}
              parallelTotalCurrent={solved.parallelTotalCurrent}
              seriesTotalResistance={solved.seriesTotalResistance}
              parallelEquivalentResistance={solved.parallelEquivalentResistance}
              onVoltageChange={setVoltage}
              onResistanceOneChange={setResistanceOne}
              onResistanceTwoChange={setResistanceTwo}
            />
          </aside>

          <section className="space-y-4">
            <ComparisonCircuit
              voltage={solved.voltage}
              resistanceOne={solved.resistanceOne}
              resistanceTwo={solved.resistanceTwo}
              seriesCurrent={solved.seriesCurrent}
              seriesDropOne={solved.seriesDropOne}
              seriesDropTwo={solved.seriesDropTwo}
              parallelCurrentOne={solved.parallelCurrentOne}
              parallelCurrentTwo={solved.parallelCurrentTwo}
              parallelTotalCurrent={solved.parallelTotalCurrent}
              seriesFlowPercent={seriesFlowPercent}
              parallelFlowPercent={parallelFlowPercent}
              seriesFlowLevel={seriesFlowLevel}
              parallelFlowLevel={parallelFlowLevel}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Comparison View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch the behavior change with layout
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation compares the same source and the same two
                resistors in both layouts, so you can see how series and
                parallel rules produce different results.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Series total resistance
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {solved.seriesTotalResistance.toFixed(1)} Ohm
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    In series, resistor values add directly because the current
                    follows one path.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Parallel equivalent resistance
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">
                    {solved.parallelEquivalentResistance.toFixed(2)} Ohm
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    Parallel branches lower the overall resistance seen by the
                    source.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    Key result
                  </p>
                  <p className="mt-2 text-[1.4rem] font-semibold text-green-800">
                    {solved.parallelTotalCurrent > solved.seriesCurrent
                      ? "Parallel draws more current"
                      : "Series draws more current"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    With the same voltage and resistor values, parallel usually
                    allows more total current.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">
                  What to notice
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  Series and parallel can use the same parts, but their path
                  structure changes the rules. Series keeps one current path.
                  Parallel keeps the same voltage across multiple branches.
                </p>
              </div>
            </section>
          </section>
        </main>

        <ExplanationSection />
      </div>
    </div>
  );
}
