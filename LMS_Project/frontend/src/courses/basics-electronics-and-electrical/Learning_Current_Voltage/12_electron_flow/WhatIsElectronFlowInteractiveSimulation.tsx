"use client";

import React, { useMemo, useState } from "react";

import {
  DEFAULT_DIRECTION,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  calculateCurrent,
  getDriftDescription,
  getFlowLevel,
  getFlowPercent,
} from "./logic";
import { BeginnerSummarySection } from "./BeginnerSummarySection";
import { ControlPanelSection } from "./ControlPanelSection";
import { ElectronCircuit } from "./ElectronCircuit";
import { FlowMeterSection } from "./FlowMeterSection";
import { Atom, Info, Pause, Play, RotateCcw } from "./icons";
import { MetricCard, StatusCard } from "./ui";
import type { DirectionMode, SimulationMode } from "./types";

export default function WhatIsElectronFlowInteractiveSimulation() {
  const [mode, setMode] = useState<SimulationMode>("playing");
  const [directionMode, setDirectionMode] =
    useState<DirectionMode>(DEFAULT_DIRECTION);
  const [voltage, setVoltage] = useState<number>(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState<number>(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(voltage, resistance),
    [voltage, resistance],
  );
  const flowLevel = useMemo(() => getFlowLevel(current), [current]);
  const flowPercent = useMemo(() => getFlowPercent(current), [current]);
  const isPlaying = mode === "playing";
  const directionDescription = useMemo(
    () => getDriftDescription(directionMode),
    [directionMode],
  );

  function resetSimulation() {
    setMode("playing");
    setDirectionMode(DEFAULT_DIRECTION);
    setVoltage(DEFAULT_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,#f8fafc_1px,transparent_1px),linear-gradient(180deg,#f8fafc_1px,transparent_1px)] bg-[size:24px_24px] bg-slate-100 p-3 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Simulation
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Electron Flow
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                See how real negative charges move in a closed circuit. Adjust
                voltage and resistance to watch the electron drift change.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
              <StatusCard
                label="Voltage"
                value={`${voltage.toFixed(1)} V`}
                tone="red"
              />
              <StatusCard
                label="Current"
                value={`${current.toFixed(2)} A`}
                tone="blue"
              />
              <StatusCard label="Flow" value={flowLevel} tone="cyan" />
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-300 bg-white p-2">
                <Info className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">Core idea</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Electrons are negatively charged particles. In metal wires,
                  current happens when those electrons drift through the
                  conductor.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              Simple idea:{" "}
              <span className="text-blue-700">negative terminal</span> {"->"}{" "}
              <span className="text-red-700">positive terminal</span>
            </div>
          </div>
        </section>

        <main className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ControlPanelSection
              voltage={voltage}
              resistance={resistance}
              directionMode={directionMode}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
              onDirectionChange={setDirectionMode}
            />

            <FlowMeterSection
              current={current}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
            />
          </aside>

          <section className="space-y-4">
            <div className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Electron View
                  </div>
                  <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-tight text-slate-950">
                    Watch the charge direction
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                    The moving particles show real electron motion. You can also
                    switch to conventional current to compare the two direction
                    conventions.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">State</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        mode === "playing"
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {mode === "playing" ? "Playing" : "Paused"}
                    </span>
                  </div>

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

              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
                <ElectronCircuit
                  voltage={voltage}
                  resistance={resistance}
                  current={current}
                  flowPercent={flowPercent}
                  directionMode={directionMode}
                  isPlaying={isPlaying}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="Electron Flow"
                  value={flowLevel}
                  detail={`${flowPercent}% relative flow strength`}
                  tone="blue"
                />
                <MetricCard
                  title="Current"
                  value={`${current.toFixed(2)} A`}
                  detail="Current is the charge flow rate."
                  tone="cyan"
                />
                <MetricCard
                  title="Direction Mode"
                  value={directionMode === "electron" ? "Electron" : "Conventional"}
                  detail={directionDescription}
                  tone="slate"
                />
              </div>
            </div>

            <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
              <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <Atom className="h-5 w-5 text-cyan-700" />
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                    What to Notice
                  </div>
                  <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
                    Watch electron flow change the picture
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Notice how stronger voltage makes the drift more active,
                    while higher resistance slows it down. The direction mode
                    changes the teaching convention, not the circuit parts.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Negative charges move</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    In electron mode, particles travel from the negative
                    terminal toward the positive terminal.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">More push, faster drift</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Increasing voltage gives the charges more push, so the flow
                    becomes stronger.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">More resistance, slower flow</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Increasing resistance makes it harder for charges to move
                    through the same circuit.
                  </p>
                </div>
              </div>
            </section>
          </section>
        </main>

        <BeginnerSummarySection />
      </div>
    </div>
  );
}
