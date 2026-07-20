"use client";

import { useMemo, useState } from "react";

import { BeginnerSummarySection } from "./BeginnerSummarySection";
import { ControlPanelSection } from "./ControlPanelSection";
import { ElectricityCircuit } from "./ElectricityCircuit";
import { ElectricityMeterSection } from "./ElectricityMeterSection";
import { InfoIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "./icons";
import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getElectricityDefinition,
  getFlowLevel,
  getFlowPercent,
} from "./logic";
import type { SimulationMode } from "./types";
import { MetricCard } from "./ui";

export default function WhatIsElectricityInteractiveSimulation() {
  const [mode, setMode] = useState<SimulationMode>("playing");
  const [voltage, setVoltage] = useState<number>(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState<number>(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(voltage, resistance),
    [voltage, resistance],
  );
  const flowLevel = useMemo(() => getFlowLevel(current), [current]);
  const flowPercent = useMemo(() => getFlowPercent(current), [current]);
  const definition = useMemo(
    () => getElectricityDefinition(voltage, resistance),
    [voltage, resistance],
  );
  const isPlaying = mode === "playing";

  function resetSimulation() {
    setVoltage(DEFAULT_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
    setMode("playing");
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-3 md:space-y-4">
        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-300 bg-white p-2">
                <InfoIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Core idea
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Electricity happens when electric charge moves through a
                  complete path. More voltage pushes harder, while more
                  resistance slows the flow.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              Simple Idea: <span className="text-red-600">Voltage pushes</span>{" "}
              -&gt; <span className="text-blue-600">Charge moves</span> -&gt;{" "}
              <span className="text-amber-700">Electricity works</span>
            </div>
          </div>
        </section>

        <main className="grid gap-3 md:gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:gap-4">
            <ControlPanelSection
              voltage={voltage}
              resistance={resistance}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
            />

            <ElectricityMeterSection
              current={current}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
            />
          </aside>

          <section>
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 md:px-6 md:py-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-700">
                      Simulation
                    </span>
                    <span>Interactive View</span>
                  </div>
                  <h3 className="mt-3 text-[1.72rem] font-bold tracking-tight text-slate-950">
                    Watch the circuit respond
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Play, pause, or reset the moving charge to see how voltage
                    and resistance affect the circuit.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setMode("playing")}
                    className={`rounded-2xl border px-5 py-3 text-sm font-bold shadow-sm transition ${
                      isPlaying
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <PlayIcon className="h-4 w-4" />
                      Play
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("paused")}
                    className={`rounded-2xl border px-5 py-3 text-sm font-bold shadow-sm transition ${
                      !isPlaying
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <PauseIcon className="h-4 w-4" />
                      Pause
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2">
                      <RotateCcwIcon className="h-4 w-4" />
                      Reset
                    </span>
                  </button>
                </div>
              </div>

              <div className="px-2 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                <ElectricityCircuit
                  voltage={voltage}
                  resistance={resistance}
                  current={current}
                  flowPercent={flowPercent}
                  flowLevel={flowLevel}
                  isPlaying={isPlaying}
                />
              </div>
            </section>

            <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-3 md:gap-4">
              <MetricCard
                title="Voltage"
                value={`${voltage.toFixed(1)} V`}
                detail="The push that tries to move charge through the circuit."
                tone="red"
              />
              <MetricCard
                title="Current"
                value={`${current.toFixed(2)} A`}
                detail="The amount of charge that is actually moving."
                tone="blue"
              />
              <MetricCard
                title="Resistance"
                value={`${resistance.toFixed(1)} Ohm`}
                detail="The part that makes charge flow harder."
                tone="slate"
              />
            </div>
          </section>
        </main>

        <BeginnerSummarySection definition={definition} />
      </div>
    </div>
  );
}
