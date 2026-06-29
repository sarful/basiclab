"use client";

import { BiasModeControls } from "./BiasModeControls";
import { CircuitDiagram } from "./CircuitDiagram";
import { DiodeLibraryReferenceSection } from "./DiodeLibraryReferenceSection";
import { VoltageSliderCard } from "./VoltageSliderCard";
import { formatCurrent, formatPower } from "./logic";
import { useWhatIsDiodeSimulation } from "./useWhatIsDiodeSimulation";

export default function WhatIsDiodeInteractiveSimulation() {
  const simulation = useWhatIsDiodeSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Step 1
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Select Bias Mode
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Forward bias connects positive voltage to the anode. Reverse
                  bias flips the polarity.
                </p>

                <div className="mt-4">
                  <BiasModeControls
                    bias={simulation.bias}
                    onBiasChange={simulation.setBias}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Step 2
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Change Voltage
                </h2>
                <div className="mt-4">
                  <VoltageSliderCard
                    voltage={simulation.voltage}
                    onVoltageChange={simulation.setVoltage}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-bold uppercase text-green-700">
                    Current
                  </p>
                  <p className="mt-1 text-2xl font-black text-green-800">
                    {formatCurrent(simulation.led.estimatedCurrent)}
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-xs font-bold uppercase text-orange-700">
                    Power
                  </p>
                  <p className="mt-1 text-2xl font-black text-orange-800">
                    {formatPower(simulation.led.powerDissipation)}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 shadow-sm ${
                  simulation.led.isConducting
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p
                  className={`text-xs font-black uppercase tracking-[0.22em] ${
                    simulation.led.isConducting
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  Live Result
                </p>
                <h3 className="mt-1 text-2xl font-black">
                  {simulation.led.isConducting
                    ? "Diode Conducting"
                    : "Current Blocked"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {simulation.led.explanation}
                </p>
              </div>
            </aside>

            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Interactive Circuit
                    </p>
                    <h2 className="text-xl font-black text-slate-900">
                      Watch how the diode controls current flow
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      simulation.led.isConducting
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {simulation.led.isConducting ? "LED ON" : "LED OFF"}
                  </span>
                </div>

                <CircuitDiagram
                  bias={simulation.bias}
                  voltage={simulation.voltage}
                />
              </div>
            </section>
          </div>
        </section>

        <DiodeLibraryReferenceSection />
      </div>
    </main>
  );
}
