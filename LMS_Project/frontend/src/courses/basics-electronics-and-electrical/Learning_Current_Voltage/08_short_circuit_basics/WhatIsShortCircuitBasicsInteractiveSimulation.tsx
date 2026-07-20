"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_LOAD_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
  solveShortCircuitLesson,
} from "./logic";
import { ShortCircuitBasicsCircuit } from "./ShortCircuitBasicsCircuit";
import type { CircuitMode } from "./types";

export default function WhatIsShortCircuitBasicsInteractiveSimulation() {
  const [mode, setMode] = useState<CircuitMode>("normal");
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [loadResistance, setLoadResistance] = useState(DEFAULT_LOAD_RESISTANCE);

  const solved = useMemo(
    () => solveShortCircuitLesson(mode, voltage, loadResistance),
    [mode, voltage, loadResistance],
  );

  const flowPercent = useMemo(
    () => getFlowPercent(solved.current),
    [solved.current],
  );
  const flowLevel = useMemo(
    () => getFlowLevel(solved.current),
    [solved.current],
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
                Short Circuit Basics
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                A short circuit happens when current finds a very low-resistance path
                and bypasses the normal load.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:min-w-[560px]">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Voltage</p>
                <p className="mt-1 text-lg font-black text-red-700">{solved.voltage.toFixed(1)} V</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Current</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.current.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Path R</p>
                <p className="mt-1 text-lg font-black text-slate-800">{solved.effectiveResistance.toFixed(2)} Ohm</p>
              </div>
              <div className={`rounded-2xl border px-4 py-3 ${mode === "short" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${mode === "short" ? "text-red-700" : "text-green-700"}`}>Risk</p>
                <p className={`mt-1 text-lg font-black ${mode === "short" ? "text-red-700" : "text-green-700"}`}>{solved.riskLabel}</p>
              </div>
            </div>
          </div>
        </header> */}

        <section
          className={`rounded-3xl border p-4 shadow-sm md:p-5 ${mode === "short" ? "border-red-200 bg-red-50/80" : "border-green-200 bg-green-50/80"}`}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className={`text-sm font-semibold ${mode === "short" ? "text-red-900" : "text-green-900"}`}
              >
                Core idea
              </p>
              <p
                className={`mt-1 text-sm leading-6 ${mode === "short" ? "text-red-800" : "text-green-800"}`}
              >
                {solved.explanation}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">
                Simple idea
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                When resistance becomes very small, current rises very fast and
                the circuit becomes risky.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              mode={mode}
              voltage={voltage}
              loadResistance={loadResistance}
              effectiveResistance={solved.effectiveResistance}
              current={solved.current}
              power={solved.power}
              riskLabel={solved.riskLabel}
              onModeChange={setMode}
              onVoltageChange={setVoltage}
              onLoadResistanceChange={setLoadResistance}
            />
          </aside>

          <section className="space-y-4">
            <ShortCircuitBasicsCircuit
              mode={mode}
              voltage={solved.voltage}
              loadResistance={solved.loadResistance}
              current={solved.current}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span
                  className={`h-2 w-2 rounded-full ${mode === "short" ? "bg-red-500" : "bg-green-500"}`}
                />
                Risk View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch the safe path and the short path
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows what changes when current leaves the
                normal load path and takes a much easier shortcut back to the
                source.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Current level
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">
                    {flowLevel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    Lower resistance makes current rise much faster.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Power result
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {solved.power.toFixed(1)} W
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    High current means electrical energy is being released very
                    quickly.
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${mode === "short" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                >
                  <p
                    className={`text-sm font-semibold ${mode === "short" ? "text-red-700" : "text-green-700"}`}
                  >
                    Load status
                  </p>
                  <p
                    className={`mt-2 text-[1.8rem] font-semibold ${mode === "short" ? "text-red-800" : "text-green-800"}`}
                  >
                    {solved.loadActive ? "In Circuit" : "Bypassed"}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${mode === "short" ? "text-red-700/80" : "text-green-700/80"}`}
                  >
                    {solved.loadActive
                      ? "The intended load is part of the current path."
                      : "The short path is taking over the main current route."}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">
                  What to notice
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  The dangerous part of a short circuit is not only that the
                  load stops behaving normally. The real danger is that the path
                  resistance becomes so small that current and power jump upward
                  very fast.
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
