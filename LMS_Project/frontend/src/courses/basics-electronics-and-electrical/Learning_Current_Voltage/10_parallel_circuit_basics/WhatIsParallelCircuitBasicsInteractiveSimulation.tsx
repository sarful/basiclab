"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  DEFAULT_BRANCH_ONE,
  DEFAULT_BRANCH_THREE,
  DEFAULT_BRANCH_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
  solveParallelCircuitLesson,
} from "./logic";
import { ParallelCircuitBasicsCircuit } from "./ParallelCircuitBasicsCircuit";

export default function WhatIsParallelCircuitBasicsInteractiveSimulation() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [branchOneResistance, setBranchOneResistance] =
    useState(DEFAULT_BRANCH_ONE);
  const [branchTwoResistance, setBranchTwoResistance] =
    useState(DEFAULT_BRANCH_TWO);
  const [branchThreeResistance, setBranchThreeResistance] =
    useState(DEFAULT_BRANCH_THREE);

  const solved = useMemo(
    () =>
      solveParallelCircuitLesson(
        voltage,
        branchOneResistance,
        branchTwoResistance,
        branchThreeResistance,
      ),
    [voltage, branchOneResistance, branchTwoResistance, branchThreeResistance],
  );

  const flowPercent = useMemo(
    () => getFlowPercent(solved.totalCurrent),
    [solved.totalCurrent],
  );
  const flowLevel = useMemo(
    () => getFlowLevel(solved.totalCurrent),
    [solved.totalCurrent],
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
                Parallel Circuit Basics
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                A parallel circuit has multiple paths, so current can split while
                each branch still sees the same source voltage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 lg:min-w-[700px]">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Voltage</p>
                <p className="mt-1 text-lg font-black text-red-700">{solved.voltage.toFixed(1)} V</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">I1</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.currentOne.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">I2</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.currentTwo.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">I3</p>
                <p className="mt-1 text-lg font-black text-blue-700">{solved.currentThree.toFixed(2)} A</p>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">Branch Rule</p>
                <p className="mt-1 text-sm font-black text-green-700">{solved.branchRuleText}</p>
              </div>
            </div>
          </div>
        </header> */}

        <section className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                In parallel, each branch gets the full source voltage, and the
                total current is the sum of the branch currents.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:max-w-[440px]">
              <p className="text-sm font-semibold text-slate-900">
                Simple idea
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Same source voltage appears across every branch, while the
                current divides between the available paths.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              voltage={voltage}
              branchOneResistance={branchOneResistance}
              branchTwoResistance={branchTwoResistance}
              branchThreeResistance={branchThreeResistance}
              equivalentResistance={solved.equivalentResistance}
              currentOne={solved.currentOne}
              currentTwo={solved.currentTwo}
              currentThree={solved.currentThree}
              totalCurrent={solved.totalCurrent}
              onVoltageChange={setVoltage}
              onBranchOneChange={setBranchOneResistance}
              onBranchTwoChange={setBranchTwoResistance}
              onBranchThreeChange={setBranchThreeResistance}
            />
          </aside>

          <section className="space-y-4">
            <ParallelCircuitBasicsCircuit
              voltage={solved.voltage}
              branchOneResistance={solved.branchOneResistance}
              branchTwoResistance={solved.branchTwoResistance}
              branchThreeResistance={solved.branchThreeResistance}
              currentOne={solved.currentOne}
              currentTwo={solved.currentTwo}
              currentThree={solved.currentThree}
              totalCurrent={solved.totalCurrent}
              flowPercent={flowPercent}
              flowLevel={flowLevel}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Circuit View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch the branch currents split
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows how the same source voltage appears across
                every branch while the total current divides between the
                available paths.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Same voltage
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-blue-800">
                    {solved.voltage.toFixed(1)} V
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    Every branch is connected across the same source, so each
                    branch receives the full supply voltage.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Total current
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {solved.totalCurrent.toFixed(2)} A
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Branch currents add together, so the source current becomes
                    the total of all branch currents.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    Equivalent resistance
                  </p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-green-800">
                    {solved.equivalentResistance.toFixed(2)} Ohm
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    More parallel paths lower the overall resistance seen by the
                    source.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">
                  What to notice
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  In a parallel circuit, the voltage stays the same across each
                  branch. What changes is the branch current, and those branch
                  currents combine to make the total source current.
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
