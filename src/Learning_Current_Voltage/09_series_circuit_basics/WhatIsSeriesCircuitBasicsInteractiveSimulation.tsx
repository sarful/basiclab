"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_RESISTANCE_ONE,
  DEFAULT_RESISTANCE_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
  solveSeriesCircuitLesson,
} from "./logic";
import { SeriesCircuitBasicsCircuit } from "./SeriesCircuitBasicsCircuit";

export default function WhatIsSeriesCircuitBasicsInteractiveSimulation() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [resistanceOne, setResistanceOne] = useState(DEFAULT_RESISTANCE_ONE);
  const [resistanceTwo, setResistanceTwo] = useState(DEFAULT_RESISTANCE_TWO);

  const solved = useMemo(
    () => solveSeriesCircuitLesson(voltage, resistanceOne, resistanceTwo),
    [voltage, resistanceOne, resistanceTwo],
  );

  const flowPercent = useMemo(() => getFlowPercent(solved.current), [solved.current]);
  const flowLevel = useMemo(() => getFlowLevel(solved.current), [solved.current]);

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
                Series Circuit Basics
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                A series circuit has one path for current, so every component shares
                the same loop current.
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Total R</p>
                <p className="mt-1 text-lg font-black text-slate-800">{solved.totalResistance.toFixed(1)} Ohm</p>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">Loop Rule</p>
                <p className="mt-1 text-sm font-black text-green-700">{solved.loopRuleText}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                The same current flows through every component, while the voltage is shared across the parts in the loop.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">Simple idea</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                One path means the same current in every part, while the voltage is shared across the loop.
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
              totalResistance={solved.totalResistance}
              current={solved.current}
              dropOne={solved.dropOne}
              dropTwo={solved.dropTwo}
              onVoltageChange={setVoltage}
              onResistanceOneChange={setResistanceOne}
              onResistanceTwoChange={setResistanceTwo}
            />
          </aside>

          <section className="space-y-4">
            <SeriesCircuitBasicsCircuit
              voltage={solved.voltage}
              resistanceOne={solved.resistanceOne}
              resistanceTwo={solved.resistanceTwo}
              current={solved.current}
              dropOne={solved.dropOne}
              dropTwo={solved.dropTwo}
              ledDrop={solved.ledDrop}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Circuit View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch the one-path behavior
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows how one complete series loop shares the same current through every part while the voltage drop is divided across the components.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">Same current</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">{solved.current.toFixed(2)} A</p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    The same current moves through resistor one, resistor two, and the LED.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Total resistance</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {solved.totalResistance.toFixed(1)} Ohm
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Adding more series resistance makes the total loop resistance larger.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">Voltage sharing</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-green-800">
                    {(solved.dropOne + solved.dropTwo).toFixed(1)} V
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    The voltage drops across the resistors add up around the loop.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">What to notice</p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  In a series circuit, the path is one line. Because of that, current stays the same everywhere, while resistance adds up and the voltage drop gets shared across the parts.
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
