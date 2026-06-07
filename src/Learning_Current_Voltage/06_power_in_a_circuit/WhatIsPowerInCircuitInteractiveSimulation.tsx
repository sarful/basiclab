"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_CURRENT,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getPowerLevel,
  getPowerPercent,
  solvePowerLesson,
} from "./logic";
import { PowerCircuit } from "./PowerCircuit";
import type { FlowLevel, SolveMode } from "./types";

export default function WhatIsPowerInCircuitInteractiveSimulation() {
  const [mode, setMode] = useState<SolveMode>("power");
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [current, setCurrent] = useState(DEFAULT_CURRENT);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);

  const solved = useMemo(
    () => solvePowerLesson(mode, voltage, current, resistance),
    [mode, voltage, current, resistance],
  );

  const powerPercent = useMemo(() => getPowerPercent(solved.power), [solved.power]);
  const powerLevel = useMemo(() => getPowerLevel(solved.power), [solved.power]);
  const flowLevel = useMemo<FlowLevel>(() => powerLevel, [powerLevel]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Simulation
              </div>
              <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950 md:text-[3rem]">
                Power in a Circuit
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                Power tells us how fast electrical energy is being used. It depends on
                both voltage and current.
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Resistance</p>
                <p className="mt-1 text-lg font-black text-slate-800">{solved.resistance.toFixed(2)} Ohm</p>
              </div>
              <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Power</p>
                <p className="mt-1 text-lg font-black text-orange-700">{solved.power.toFixed(2)} W</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Power increases when voltage increases, current increases, or both increase together.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">Simple idea</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                More push or more flow usually means more power, because the circuit is doing more work each second.
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
            <PowerCircuit
              voltage={solved.voltage}
              current={solved.current}
              resistance={solved.resistance}
              flowPercent={powerPercent}
              flowLevel={flowLevel}
              isPlaying={true}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Power View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch power rise and fall
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows how one result depends on voltage and current together. As those values change, the power level changes too.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-orange-700">Power level</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-orange-800">{powerLevel}</p>
                  <p className="mt-2 text-sm leading-6 text-orange-700/80">
                    Higher power means the circuit is using electrical energy faster.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Formula</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {mode === "power" ? "P = V x I" : mode === "current" ? "P = I²R" : "P = V² / R"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{solved.formula}</p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">Circuit effect</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-green-800">
                    {solved.power >= 18 ? "Strong Output" : solved.power >= 8 ? "Moderate Output" : "Low Output"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    The LED glow becomes stronger when power rises.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">What to notice</p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  Power is not a separate mystery value. It is simply the result of voltage and current working together inside the circuit.
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
