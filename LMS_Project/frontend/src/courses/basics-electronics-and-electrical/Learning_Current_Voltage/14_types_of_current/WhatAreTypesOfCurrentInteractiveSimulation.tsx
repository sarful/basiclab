"use client";

import React, { useMemo, useState } from "react";

import {
  calculateRmsCurrent,
  DEFAULT_AC_PEAK_CURRENT,
  DEFAULT_DC_CURRENT,
  DEFAULT_FREQUENCY,
  getCurrentStrengthPercent,
} from "./logic";
import { AcCurrentSection } from "./AcCurrentSection";
import { CoreIdeaBanner } from "./ui";
import { DcCurrentSection } from "./DcCurrentSection";
import { QuickComparisonSection } from "./QuickComparisonSection";
import { IndustrialLabel, StatusBox } from "./ui";
import type { SimulationMode } from "./types";

export default function WhatAreTypesOfCurrentInteractiveSimulation() {
  const [mode, setMode] = useState<SimulationMode>("playing");
  const [dcCurrent, setDcCurrent] = useState<number>(DEFAULT_DC_CURRENT);
  const [acPeakCurrent, setAcPeakCurrent] = useState<number>(DEFAULT_AC_PEAK_CURRENT);
  const [frequency, setFrequency] = useState<number>(DEFAULT_FREQUENCY);

  const acRmsCurrent = useMemo(() => calculateRmsCurrent(acPeakCurrent), [acPeakCurrent]);
  const dcStrength = useMemo(() => getCurrentStrengthPercent(dcCurrent), [dcCurrent]);
  const acStrength = useMemo(() => getCurrentStrengthPercent(acPeakCurrent), [acPeakCurrent]);
  const isPlaying = mode === "playing";

  return (
    <div className="min-h-screen w-full bg-slate-100 p-3 text-slate-900 sm:p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <IndustrialLabel code="SIMULATION" label="Current Comparison" />
              <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-slate-950 md:text-[2.55rem]">
                Types of Current
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Compare DC current and AC current side by side. DC current moves
                in one steady direction, while AC current changes direction in
                a repeating pattern.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <StatusBox label="Mode" value={isPlaying ? "Running" : "Paused"} tone="slate" />
              <StatusBox label="DC Current" value={`${dcCurrent.toFixed(2)} A`} tone="green" />
              <StatusBox label="AC RMS" value={`${acRmsCurrent.toFixed(2)} A`} tone="blue" />
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <CoreIdeaBanner />
          <section className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold text-slate-900">Simple idea</p>
            <p className="mt-2 text-base leading-7 text-slate-700">
              DC stays steady in one direction. AC keeps changing direction, so
              its size and pattern need a little more attention.
            </p>
          </section>
        </section>

        <main className="grid gap-5 xl:grid-cols-2">
          <DcCurrentSection
            dcCurrent={dcCurrent}
            dcStrength={dcStrength}
            onDcCurrentChange={setDcCurrent}
          />

          <AcCurrentSection
            acPeakCurrent={acPeakCurrent}
            acRmsCurrent={acRmsCurrent}
            acStrength={acStrength}
            frequency={frequency}
            onAcPeakCurrentChange={setAcPeakCurrent}
            onFrequencyChange={setFrequency}
          />
        </main>

        <QuickComparisonSection />
      </div>
    </div>
  );
}
