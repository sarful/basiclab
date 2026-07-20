"use client";

import { useMemo, useState } from "react";

import { AcVoltageSection } from "./AcVoltageSection";
import { DcVoltageSection } from "./DcVoltageSection";
import {
  DEFAULT_AC_FREQUENCY,
  DEFAULT_AC_PEAK_VOLTAGE,
  DEFAULT_AC_RESISTANCE,
  DEFAULT_DC_RESISTANCE,
  DEFAULT_DC_VOLTAGE,
  calculateCurrent,
  calculateRms,
} from "./logic";
import type { SimulationMode } from "./types";

export default function WhatAreTypesOfVoltageInteractiveSimulation() {
  const [mode, setMode] = useState<SimulationMode>("playing");
  const [dcVoltage, setDcVoltage] = useState<number>(DEFAULT_DC_VOLTAGE);
  const [dcResistance, setDcResistance] = useState<number>(
    DEFAULT_DC_RESISTANCE,
  );
  const [acPeakVoltage, setAcPeakVoltage] = useState<number>(
    DEFAULT_AC_PEAK_VOLTAGE,
  );
  const [acFrequency, setAcFrequency] = useState<number>(DEFAULT_AC_FREQUENCY);
  const [acResistance, setAcResistance] = useState<number>(
    DEFAULT_AC_RESISTANCE,
  );

  const dcCurrent = useMemo(
    () => calculateCurrent(dcVoltage, dcResistance),
    [dcVoltage, dcResistance],
  );
  const acRmsVoltage = useMemo(
    () => calculateRms(acPeakVoltage),
    [acPeakVoltage],
  );
  const acRmsCurrent = useMemo(
    () => calculateCurrent(acRmsVoltage, acResistance),
    [acRmsVoltage, acResistance],
  );

  const isPlaying = mode === "playing";

  return (
    <div className="min-h-screen w-full bg-slate-100 p-3 text-slate-900 sm:p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* <header className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <IndustrialLabel code="SIMULATION" label="Voltage Comparison" />
              <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-slate-950 md:text-[2.55rem]">
                Types of Voltage
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Compare DC voltage and AC voltage side by side. DC voltage stays
                steady, while AC voltage changes in a repeating pattern over
                time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <StatusBox label="Mode" value={isPlaying ? "Running" : "Paused"} tone="cyan" />
              <StatusBox label="DC Current" value={`${dcCurrent.toFixed(2)} A`} tone="green" />
              <StatusBox label="AC RMS" value={`${acRmsVoltage.toFixed(2)} V`} tone="blue" />
            </div>
          </div>
        </header> */}

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <section className="rounded-[28px] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Core idea
                </p>
                <p className="mt-2 text-sm leading-7 text-amber-800">
                  DC voltage gives a steady push. AC voltage gives a push that
                  rises, falls, and reverses direction over time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm">
                <span className="font-semibold text-slate-700">Legend</span>
                <span className="flex items-center gap-2 text-red-700">
                  <span className="h-1 w-10 rounded-full bg-red-500" /> Voltage
                  (V)
                </span>
                <span className="flex items-center gap-2 text-blue-700">
                  <span className="h-1 w-10 rounded-full bg-blue-500" /> Current
                  (I)
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold text-slate-900">Simple idea</p>
            <p className="mt-2 text-base leading-7 text-slate-700">
              One voltage type stays steady. The other voltage type keeps
              changing, so it needs extra ideas like RMS and frequency.
            </p>
          </section>
        </section>

        <main className="grid gap-5 xl:grid-cols-2">
          <DcVoltageSection
            dcVoltage={dcVoltage}
            dcResistance={dcResistance}
            dcCurrent={dcCurrent}
            isPlaying={isPlaying}
            onVoltageChange={setDcVoltage}
            onResistanceChange={setDcResistance}
          />

          <AcVoltageSection
            acPeakVoltage={acPeakVoltage}
            acFrequency={acFrequency}
            acResistance={acResistance}
            acRmsVoltage={acRmsVoltage}
            acRmsCurrent={acRmsCurrent}
            isPlaying={isPlaying}
            onPeakVoltageChange={setAcPeakVoltage}
            onFrequencyChange={setAcFrequency}
            onResistanceChange={setAcResistance}
          />
        </main>
      </div>
    </div>
  );
}
