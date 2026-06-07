"use client";

import React, { useMemo, useState } from "react";

import {
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  calculateCurrent,
  getCurrentLevel,
  getCurrentPercent,
  getVoltageLevel,
  getVoltagePercent,
} from "./logic";
import { BeginnerSummarySection } from "./BeginnerSummarySection";
import { CircuitSimulation } from "./CircuitSimulation";
import { ComparisonCard } from "./ComparisonCard";
import { ControlPanelSection } from "./ControlPanelSection";
import { LiveRelationSection } from "./LiveRelationSection";
import { ArrowRightLeft, Info, Pause, Play, RotateCcw } from "./icons";
import { StatusCard } from "./ui";
import type { SimulationMode } from "./types";

export default function WhatIsVoltageVsCurrentComparisonInteractiveSimulation() {
  const [mode, setMode] = useState<SimulationMode>("playing");
  const [voltage, setVoltage] = useState<number>(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState<number>(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(voltage, resistance),
    [voltage, resistance],
  );
  const voltageLevel = useMemo(() => getVoltageLevel(voltage), [voltage]);
  const currentLevel = useMemo(() => getCurrentLevel(current), [current]);
  const voltagePercent = useMemo(() => getVoltagePercent(voltage), [voltage]);
  const currentPercent = useMemo(() => getCurrentPercent(current), [current]);
  const isPlaying = mode === "playing";

  function resetSimulation() {
    setVoltage(DEFAULT_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
    setMode("playing");
  }

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Simulation
              </div>
              <h1 className="mt-6 text-[1.9rem] font-semibold tracking-tight text-slate-950 md:text-[2.7rem]">
                Watch voltage and current side by side
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Use the live circuit to see the difference between the electrical
                push and the actual flow. Then compare how both values respond when
                the lesson numbers change.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
              <StatusCard label="Voltage" value={`${voltage.toFixed(1)} V`} tone="red" />
              <StatusCard label="Current" value={`${current.toFixed(2)} A`} tone="blue" />
              <StatusCard
                label="Resistance"
                value={`${resistance.toFixed(1)} Ohm`}
                tone="slate"
              />
            </div>
          </div>
        </header>

        <section className="rounded-[32px] border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-300 bg-white p-2">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Core idea</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Voltage is the electrical pressure that pushes charge. Current is
                  the actual flow of charge through the wire.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              Simple idea: <span className="text-red-600">Voltage pushes</span>{" "}
              -&gt; <span className="text-blue-600">Current moves</span>
            </div>
          </div>
        </section>

        <main className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ControlPanelSection
              voltage={voltage}
              resistance={resistance}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
            />
            <LiveRelationSection
              voltagePercent={voltagePercent}
              currentPercent={currentPercent}
            />
          </aside>

          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <ArrowRightLeft className="h-5 w-5 text-cyan-700" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Comparison View
                  </div>
                  <h2 className="mt-4 text-[1.95rem] font-semibold leading-tight text-slate-950">
                    Watch the push and the flow together
                  </h2>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                    Voltage tells us how hard the source is pushing. Current shows
                    how much charge is actually moving through the same circuit.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("playing")}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Play className="h-4 w-4" /> Play
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("paused")}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Pause className="h-4 w-4" /> Pause
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <RotateCcw className="h-4 w-4" /> Reset
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ComparisonCard
                title="Voltage"
                level={voltageLevel}
                value={`${voltage.toFixed(1)} V`}
                percent={voltagePercent}
                color="red"
                description="Voltage is the pushing force behind charge movement."
              />
              <ComparisonCard
                title="Current"
                level={currentLevel}
                value={`${current.toFixed(2)} A`}
                percent={currentPercent}
                color="blue"
                description="Current is the actual amount of charge flowing in the wire."
              />
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <CircuitSimulation
                voltage={voltage}
                current={current}
                resistance={resistance}
                voltagePercent={voltagePercent}
                currentPercent={currentPercent}
                isPlaying={isPlaying}
              />
            </div>
          </section>
        </main>

        <BeginnerSummarySection />
      </div>
    </div>
  );
}
