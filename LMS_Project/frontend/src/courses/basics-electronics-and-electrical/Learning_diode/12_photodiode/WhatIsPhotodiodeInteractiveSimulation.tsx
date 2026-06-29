"use client";

import { useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { PhotodiodeCircuitPlacementSection } from "./PhotodiodeCircuitPlacementSection";
import { PhotodiodeWorkingSection } from "./PhotodiodeWorkingSection";
import { SensorGraphSection } from "./SensorGraphSection";
import { usePhotodiodeSimulation } from "./usePhotodiodeSimulation";
import type { FlowMode } from "./types";

function StatusCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "emerald" | "blue" | "amber" | "slate";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : tone === "amber"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export default function WhatIsPhotodiodeInteractiveSimulation() {
  const simulation = usePhotodiodeSimulation();
  const { state } = simulation;
  const [flowMode, setFlowMode] = useState<FlowMode>("electron");

  const biasLabel = state.isReverseBias ? "Reverse Bias" : "Forward Mode";
  const outputLabel = `${state.outputVoltage.toFixed(2)} V`;
  const currentLabel = `${state.totalCurrentUA.toFixed(2)} uA`;
  const lightLabel = state.hasLight ? state.lightLabel : "Light OFF";

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-3 md:space-y-4">
        <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-green-700">
                Diode Sensor Lab
              </p>
              <h1 className="mt-2 text-[1.9rem] font-black tracking-tight text-slate-950 md:text-[2.35rem]">
                Photodiode
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Study how light level, reverse bias, load resistance, and
                responsivity change photocurrent and output voltage in a real
                photodiode sensor circuit, and compare that with normal
                forward-biased diode conduction.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[470px]">
              <StatusCard label="Light Scene" value={lightLabel} tone="blue" />
              <StatusCard label="Sensor State" value={state.status} tone={state.isActive ? "emerald" : "slate"} />
              <StatusCard label="Bias Mode" value={biasLabel} tone={state.isReverseBias ? "emerald" : "amber"} />
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Core idea</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                A photodiode converts incoming light into current. Reverse bias
                strengthens sensor operation, and the load resistor turns that
                current into a measurable output voltage. Forward bias is shown
                only as a real comparison state for the same junction.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              Sensor chain: <span className="text-blue-600">Light</span> -&gt;{" "}
              <span className="text-emerald-700">Photocurrent</span> -&gt;{" "}
              <span className="text-amber-700">Output voltage</span>
            </div>
          </div>
        </section>

        <main className="grid gap-3 md:gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="grid gap-3 xl:gap-4">
            <ControlPanelSection
              isPlaying={simulation.isPlaying}
              setIsPlaying={simulation.setIsPlaying}
              resetSimulation={simulation.resetSimulation}
              lux={simulation.lux}
              setLux={simulation.setLux}
              reverseVoltage={simulation.reverseVoltage}
              setReverseVoltage={simulation.setReverseVoltage}
              loadKOhm={simulation.loadKOhm}
              setLoadKOhm={simulation.setLoadKOhm}
              responsivityAW={simulation.responsivityAW}
              setResponsivityAW={simulation.setResponsivityAW}
              activeAreaMM2={simulation.activeAreaMM2}
              setActiveAreaMM2={simulation.setActiveAreaMM2}
              isReverseBias={simulation.isReverseBias}
              setIsReverseBias={simulation.setIsReverseBias}
              flowMode={flowMode}
              setFlowMode={setFlowMode}
              state={state}
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <MetricCard
                  title="Output Voltage"
                  value={outputLabel}
                  detail="This is the voltage developed across the load resistor from photodiode current."
                />
              <MetricCard
                title="Total Current"
                value={currentLabel}
                detail="The total sensor current includes light-generated photocurrent and dark current."
              />
            </div>
          </aside>

          <section>
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 md:px-6 md:py-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-700">
                      Simulation
                    </span>
                    <span>Photodiode Circuit</span>
                  </div>
                  <h3 className="mt-3 text-[1.72rem] font-bold tracking-tight text-slate-950">
                    Watch the sensor respond
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Change light and bias from the left panel to see the
                    photocurrent path, resistor voltage output, and sensor detection state.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
                  <StatusCard label="Lux" value={`${state.lux.toFixed(0)} lux`} tone="blue" />
                  <StatusCard label="Photocurrent" value={`${state.photocurrentUA.toFixed(2)} uA`} tone="emerald" />
                  <StatusCard label="Output" value={outputLabel} tone="amber" />
                </div>
              </div>

              <div className="px-2 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                <PhotodiodeCircuitPlacementSection
                  state={state}
                  flowMode={flowMode}
                  isPlaying={simulation.isPlaying}
                />
              </div>
            </section>

            <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-3 md:gap-4">
              <MetricCard
                title="Reverse Bias"
                value={`${state.reverseVoltage.toFixed(1)} V`}
                detail="This is the applied bias supply. In reverse mode it widens the depletion region and improves carrier collection."
              />
              <MetricCard
                title="Load Resistor"
                value={`${state.loadKOhm.toFixed(1)} kOhm`}
                detail="The load resistor converts current into voltage. Larger values give larger output voltage."
              />
              <MetricCard
                title="Responsivity"
                value={`${state.responsivityAW.toFixed(2)} A/W`}
                detail="Responsivity describes how strongly the photodiode turns optical power into electrical current."
              />
            </div>

            <div className="mt-3 md:mt-4">
              <PhotodiodeWorkingSection
                state={state}
                flowMode={flowMode}
                isPlaying={simulation.isPlaying}
              />
            </div>

            <div className="mt-3 md:mt-4">
              <SensorGraphSection
                points={simulation.graphPoints}
                currentLux={state.lux}
                currentOutputVoltage={state.outputVoltage}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
