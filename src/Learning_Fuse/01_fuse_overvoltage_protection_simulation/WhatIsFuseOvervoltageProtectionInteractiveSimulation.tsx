"use client";

import { useMemo, useState } from "react";

import { calculateFuseSimulation, formatNumber, runSimulationTests } from "./logic";
import { ControlPanelSection } from "./ControlPanelSection";
import { FuseCircuitSvg } from "./FuseCircuitSvg";
import { StatCard } from "./StatCard";
import { TypeInfo } from "./TypeInfo";
import type { FuseRating, FuseState } from "./types";

export default function WhatIsFuseOvervoltageProtectionInteractiveSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [loadResistance, setLoadResistance] = useState(20);
  const [fuseRating, setFuseRating] = useState<FuseRating>("1A");
  const [fuseState, setFuseState] = useState<FuseState>("GOOD");

  const result = useMemo(
    () => calculateFuseSimulation({ supplyVoltage, loadResistance, fuseRating, fuseState }),
    [supplyVoltage, loadResistance, fuseRating, fuseState],
  );
  const testsPassed = useMemo(() => runSimulationTests(), []);

  function triggerFuseIfUnsafe() {
    if (result.shouldBlow && fuseState === "GOOD") {
      setFuseState("BLOWN");
    }
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Fuse Protection - Interactive Simulation
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A fuse is a safety component. If circuit current exceeds the fuse rating,
            the fuse element melts and opens the circuit, protecting the load and wiring.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Supply Voltage" value={`${formatNumber(supplyVoltage, 1)}V`} tone="text-blue-600" />
          <StatCard label="Fuse Rating" value={fuseRating} tone="text-purple-600" />
          <StatCard label="Current" value={`${formatNumber(result.currentA, 2)}A`} tone={result.shouldBlow ? "text-red-600" : "text-green-600"} />
          <StatCard label="Fuse State" value={fuseState} tone={fuseState === "BLOWN" ? "text-red-600" : "text-emerald-600"} />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            supplyVoltage={supplyVoltage}
            setSupplyVoltage={setSupplyVoltage}
            loadResistance={loadResistance}
            setLoadResistance={setLoadResistance}
            fuseRating={fuseRating}
            setFuseRating={setFuseRating}
            fuseState={fuseState}
            setFuseState={setFuseState}
            result={result}
            testsPassed={testsPassed}
            triggerFuseIfUnsafe={triggerFuseIfUnsafe}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Fuse Circuit Visualizer</h2>
                <p className="text-sm text-slate-600">
                  Supply to fuse to load to return path. Unsafe current makes the fuse open the circuit.
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  fuseState === "BLOWN"
                    ? "bg-red-100 text-red-700"
                    : result.shouldBlow
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {fuseState === "BLOWN" ? "FUSE BLOWN" : result.shouldBlow ? "OVERLOAD" : "SAFE"}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <FuseCircuitSvg
                supplyVoltage={supplyVoltage}
                loadResistance={loadResistance}
                fuseRating={fuseRating}
                fuseState={fuseState}
                result={result}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <TypeInfo title="What does a Fuse do?" active={true}>
            A fuse is placed in series. If current becomes too high, the fuse wire heats,
            melts, and opens the circuit.
          </TypeInfo>
          <TypeInfo title="Overvoltage vs Overcurrent" active={result.shouldBlow}>
            A fuse does not directly sense voltage. If higher voltage causes the load current
            to rise too much, the fuse blows. So a fuse is mainly an overcurrent protector.
          </TypeInfo>
          <TypeInfo title="Replace after blown" active={fuseState === "BLOWN"}>
            A normal fuse must be replaced after it blows. The reset button here simulates
            installing a new fuse.
          </TypeInfo>
        </div>
      </div>
    </div>
  );
}
