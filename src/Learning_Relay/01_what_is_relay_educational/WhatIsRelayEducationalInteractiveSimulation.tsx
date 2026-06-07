"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import InfoCard from "./InfoCard";
import { getRelayDescription, getRelayResult, runRelayTests } from "./logic";
import RelayVisualizer from "./RelayVisualizers";
import StatCard from "./StatCard";
import type { RelayType } from "./types";

export default function WhatIsRelayEducationalInteractiveSimulation() {
  const [energized, setEnergized] = useState(false);
  const [relayType, setRelayType] = useState<RelayType>("SPDT");

  const relayResult = useMemo(
    () => getRelayResult(relayType, energized),
    [relayType, energized],
  );
  const testsPassed = useMemo(() => runRelayTests(), []);
  const description = useMemo(
    () => getRelayDescription(relayType, energized),
    [energized, relayType],
  );

  return (
    <div className="min-h-screen bg-white p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Electronics Education
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-4xl">
            What is Relay (Relay Educational Visualizer)
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            A relay is an electrically operated switch that lets a low-power
            control signal switch a higher-power load while also providing
            electrical isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Relay Type" value={relayType} tone="text-blue-600" />
          <StatCard
            label="Coil State"
            value={relayResult.coilEnergized ? "ENERGIZED" : "OFF"}
            tone={
              relayResult.coilEnergized ? "text-green-600" : "text-slate-500"
            }
          />
          <StatCard
            label="Contact"
            value={relayResult.contactLabel}
            tone="text-orange-600"
          />
          <StatCard
            label="Load"
            value={relayResult.loadOn ? "ON" : "OFF"}
            tone={relayResult.loadOn ? "text-yellow-600" : "text-slate-500"}
          />
          <StatCard
            label="Tests"
            value={testsPassed ? "PASS" : "FAIL"}
            tone={testsPassed ? "text-emerald-600" : "text-red-600"}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            energized={energized}
            setEnergized={setEnergized}
            relayType={relayType}
            setRelayType={setRelayType}
            description={description}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2">
            <h2 className="mb-4 text-xl font-black">
              Interactive Relay Visualizer
            </h2>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <RelayVisualizer energized={energized} relayType={relayType} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard title="Relay Parts" active>
            Coil, armature, COM, NO, NC, flyback diode, and load connection are
            the main parts used in a relay circuit.
          </InfoCard>
          <InfoCard title="Why Flyback Diode?">
            When the coil turns off, it can create an inductive voltage spike.
            A flyback diode protects the transistor or driver from that spike.
          </InfoCard>
          <InfoCard title="Applications">
            AC lamp control, fan or motor switching, pump control, automation
            panels, and PLC outputs are all common relay applications.
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
