"use client";

import { useMemo, useState } from "react";

import { AmmeterSection } from "./AmmeterSection";
import { BeginnerExplanationSection } from "./BeginnerExplanationSection";
import { ControlPanelSection } from "./ControlPanelSection";
import { CurrentCircuit } from "./CurrentCircuit";
import { InfoIcon } from "./icons";
import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCurrentLevel,
  getCurrentPercent,
} from "./logic";
import type { SimulationMode } from "./types";
import { MetricCard } from "./ui";

export default function WhatIsCurrentInteractiveSimulation() {
  const [mode] = useState<SimulationMode>("playing");
  const [voltage, setVoltage] = useState<number>(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState<number>(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(voltage, resistance),
    [voltage, resistance],
  );
  const currentLevel = useMemo(() => getCurrentLevel(current), [current]);
  const currentPercent = useMemo(() => getCurrentPercent(current), [current]);
  const isPlaying = mode === "playing";

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <IndustrialLabel code="SIM-03" label="Interactive Electrical Lab" />
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                What is Current?
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Current is the rate of electric charge flow through a closed
                circuit. Increase voltage to raise current, or increase
                resistance to reduce it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <StatusBox
                label="Voltage"
                value={`${voltage.toFixed(1)} V`}
                tone="red"
              />
              <StatusBox
                label="Resistance"
                value={`${resistance.toFixed(1)} Ohm`}
                tone="slate"
              />
              <StatusBox
                label="Current"
                value={`${current.toFixed(2)} A`}
                tone="blue"
              />
            </div>
          </div>
        </header> */}

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-300 bg-white p-2">
                <InfoIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Core Idea
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Voltage pushes charge. Resistance slows charge flow. Current
                  tells us how much charge passes through the circuit each
                  second.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              Ohm&apos;s Law: <span className="text-blue-700">I</span> ={" "}
              <span className="text-red-700">V</span> /{" "}
              <span className="text-slate-700">R</span>
            </div>
          </div>
        </section>

        <main className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <section>
            <CurrentCircuit
              voltage={voltage}
              resistance={resistance}
              current={current}
              currentPercent={currentPercent}
              currentLevel={currentLevel}
              isPlaying={isPlaying}
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <MetricCard
                title="Current Level"
                value={currentLevel}
                detail={`${currentPercent}% current strength`}
                tone="blue"
              />
              <MetricCard
                title="Formula"
                value="I = V / R"
                detail={`${voltage.toFixed(1)} / ${resistance.toFixed(1)} = ${current.toFixed(2)} A`}
                tone="slate"
              />
              <MetricCard
                title="Current Effect"
                value={
                  current >= 3
                    ? "Fast Flow"
                    : current >= 1
                      ? "Steady Flow"
                      : "Slow Flow"
                }
                detail="Higher voltage raises current. Higher resistance lowers it."
                tone="green"
              />
            </div>
          </section>

          <aside className="space-y-4">
            <ControlPanelSection
              voltage={voltage}
              resistance={resistance}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
            />
            <AmmeterSection
              current={current}
              currentPercent={currentPercent}
              currentLevel={currentLevel}
            />
          </aside>
        </main>

        <BeginnerExplanationSection />
      </div>
    </div>
  );
}
