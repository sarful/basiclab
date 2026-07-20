"use client";

import { useMemo, useState } from "react";

import { BeginnerExplanationSection } from "./BeginnerExplanationSection";
import { ControlPanelSection } from "./ControlPanelSection";
import { InfoIcon } from "./icons";
import {
  DEFAULT_VOLTAGE,
  getBulbState,
  getPressureLevel,
  getPressurePercent,
  getRelationText,
} from "./logic";
import type { PressureLevel } from "./types";
import { VoltageCircuit } from "./voltageCircuit";

export default function WhatIsVoltageInteractiveSimulation() {
  const [voltage, setVoltage] = useState<number>(DEFAULT_VOLTAGE);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  const voltageText = voltage.toFixed(1);
  const pressureLevel = useMemo<PressureLevel>(
    () => getPressureLevel(voltage),
    [voltage],
  );
  const pressurePercent = useMemo(() => getPressurePercent(voltage), [voltage]);
  const relationText = useMemo(() => getRelationText(voltage), [voltage]);
  const bulbState = useMemo(() => getBulbState(voltage), [voltage]);

  const pressureLabel = `${pressureLevel} Pressure`;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* <header className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <IndustrialLabel code="Simulation" label="" />
              <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950 md:text-[3rem]">
                What is Voltage?
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                Voltage means electrical pressure. Use the controls to see how a stronger or weaker push changes charge flow and lamp brightness in the circuit.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[450px]">
              <StatusBox label="Voltage" value={`${voltageText} V`} />
              <StatusBox label="Pressure" value={pressureLevel} />
              <StatusBox label="Flow Strength" value={`${pressurePercent}%`} />
            </div>
          </div>
        </header> */}

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
                  Voltage is the electrical pressure that pushes charge through
                  a circuit. More voltage means stronger push.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-300 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">
                Simple idea
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                More voltage means more push. If resistance stays the same, that
                stronger push usually creates more current.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              voltage={voltage}
              pressurePercent={pressurePercent}
              pressureLabel={pressureLabel}
              relationText={relationText}
              onVoltageChange={setVoltage}
              onReset={() => setVoltage(DEFAULT_VOLTAGE)}
            />
          </aside>

          <section className="space-y-4">
            <VoltageCircuit
              voltage={voltage}
              resistance={6}
              current={Number((voltage / 6).toFixed(2))}
              flowPercent={pressurePercent}
              flowLevel={pressureLevel}
              isPlaying={bulbState !== "off"}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Voltage View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch voltage change the push
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                In this lesson, voltage is the electrical push. As you raise the
                battery voltage, the push becomes stronger. As you lower it, the
                push becomes weaker.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">Voltage</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-red-800">
                    {voltageText} V
                  </p>
                  <p className="mt-2 text-sm leading-6 text-red-700/80">
                    This is the push coming from the battery.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-sm font-semibold text-cyan-700">
                    Pressure Level
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-cyan-800">
                    {pressureLevel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cyan-700/80">
                    More voltage creates stronger electrical pressure.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Flow Strength
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">
                    {pressurePercent}%
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    This shows how strong the overall push feels in the lesson.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">
                  What to notice
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  {relationText}
                </p>
              </div>
            </section>

            <BeginnerExplanationSection
              showExplanation={showExplanation}
              onToggle={() => setShowExplanation((current) => !current)}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
