"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_CURRENT,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowPercent,
  solveOhmsLaw,
} from "./logic";
import { OhmsLawCircuit } from "./OhmsLawCircuit";
import type { FlowLevel, SolveMode } from "./types";

export default function WhatIsOhmsLawBasicsInteractiveSimulation() {
  const [mode, setMode] = useState<SolveMode>("current");
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [current, setCurrent] = useState(DEFAULT_CURRENT);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);

  const solved = useMemo(
    () => solveOhmsLaw(mode, voltage, current, resistance),
    [mode, voltage, current, resistance],
  );

  const flowPercent = useMemo(
    () => getFlowPercent(solved.current),
    [solved.current],
  );
  const flowLevel = useMemo<FlowLevel>(() => {
    if (solved.current >= 2) return "HIGH";
    if (solved.current >= 1) return "MEDIUM";
    return "LOW";
  }, [solved.current]);

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
                Ohm&apos;s Law Basics
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                Ohm&apos;s Law connects voltage, current, and resistance. If you know
                any two values, you can calculate the third.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                  Voltage
                </p>
                <p className="mt-1 text-lg font-black text-red-700">
                  {solved.voltage.toFixed(1)} V
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Current
                </p>
                <p className="mt-1 text-lg font-black text-blue-700">
                  {solved.current.toFixed(2)} A
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                  Resistance
                </p>
                <p className="mt-1 text-lg font-black text-slate-800">
                  {solved.resistance.toFixed(2)} Ohm
                </p>
              </div>
            </div>
          </div>
        </header> */}

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Voltage is the push, current is the flow, and resistance is the
                opposition. Ohm&apos;s Law shows exactly how they affect one
                another.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">
                Simple idea
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                More voltage gives more push. More resistance gives more
                opposition. Ohm&apos;s Law helps you see the result.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              mode={mode}
              voltage={voltage}
              current={current}
              resistance={resistance}
              formula={solved.formula}
              onModeChange={setMode}
              onVoltageChange={setVoltage}
              onCurrentChange={setCurrent}
              onResistanceChange={setResistance}
            />
          </aside>

          <section className="space-y-4">
            <OhmsLawCircuit
              voltage={solved.voltage}
              current={solved.current}
              resistance={solved.resistance}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
              isPlaying={true}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Formula View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch Ohm&apos;s Law solve the missing value
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows how one law connects all three circuit
                values. When two known values change, the third one updates
                automatically.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Solve mode
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">
                    {mode === "current"
                      ? "Solve I"
                      : mode === "voltage"
                        ? "Solve V"
                        : "Solve R"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    Choose the unknown value and let the other two values
                    determine the answer.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Formula
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {mode === "current"
                      ? "I = V / R"
                      : mode === "voltage"
                        ? "V = I x R"
                        : "R = V / I"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {solved.formula}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    Circuit effect
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-green-800">
                    {solved.current >= 2
                      ? "Fast Flow"
                      : solved.current >= 1
                        ? "Steady Flow"
                        : "Slow Flow"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    Higher current makes the LED brighter. Higher resistance
                    pushes the current down.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">
                  What to notice
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  The formula is not separate from the circuit. It is simply a
                  short way to describe what the circuit is already doing.
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
