"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { ExplanationSection } from "./ExplanationSection";
import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCircuitExplanation,
} from "./logic";
import { OpenClosedCircuit } from "./OpenClosedCircuit";
import type { CircuitState } from "./types";

export default function WhatIsOpenVsClosedCircuitInteractiveSimulation() {
  const [circuitState, setCircuitState] = useState<CircuitState>("closed");
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(circuitState, voltage, resistance),
    [circuitState, voltage, resistance],
  );

  const explanation = useMemo(
    () => getCircuitExplanation(circuitState),
    [circuitState],
  );

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
                Open Circuit vs Closed Circuit
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1.04rem]">
                A circuit works only when the electrical path is complete. If the
                path breaks, current stops right away.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Circuit State
                </p>
                <p className="mt-1 text-lg font-black text-amber-700">
                  {circuitState === "closed" ? "Closed" : "Open"}
                </p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                  Voltage
                </p>
                <p className="mt-1 text-lg font-black text-red-700">
                  {voltage.toFixed(1)} V
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Current
                </p>
                <p className="mt-1 text-lg font-black text-blue-700">
                  {current.toFixed(2)} A
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">{explanation}</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 lg:max-w-[420px]">
              <p className="text-sm font-semibold text-slate-900">Simple idea</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Closed path means current can move. Open path means current stops.
              </p>
            </div>
          </div>
        </section>

        <main className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <ControlPanelSection
              circuitState={circuitState}
              voltage={voltage}
              resistance={resistance}
              current={current}
              explanation={explanation}
              onStateChange={setCircuitState}
              onVoltageChange={setVoltage}
              onResistanceChange={setResistance}
            />
          </aside>

          <section className="space-y-4">
            <OpenClosedCircuit
              circuitState={circuitState}
              voltage={voltage}
              resistance={resistance}
              current={current}
            />

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Path View
              </div>
              <h2 className="mt-4 text-[1.55rem] font-bold tracking-tight text-slate-900 md:text-[1.8rem]">
                Watch the path open and close
              </h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-slate-600 md:text-[1rem]">
                This simulation shows one important rule very clearly: current only
                moves when the loop is complete from the battery, through the load,
                and back again.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-700">Path status</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-amber-800">
                    {circuitState === "closed" ? "Complete" : "Broken"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-700/80">
                    A complete path lets current travel through the circuit.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Current result</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-slate-900">
                    {current.toFixed(2)} A
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Open circuit gives zero current. Closed circuit allows flow.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">Circuit effect</p>
                  <p className="mt-2 text-[1.8rem] font-semibold text-green-800">
                    {circuitState === "closed" ? "LED On" : "LED Off"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    The load works only when the path is closed.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-sm font-semibold text-slate-900">What to notice</p>
                <p className="mt-2 text-[0.98rem] leading-7 text-slate-600">
                  Voltage and resistance still matter, but first the circuit needs a
                  complete path. Without that path, current stays at zero no matter
                  what values you set.
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
