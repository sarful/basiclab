"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import { calculateSimulation, formatNumber, runSimulationSelfTests } from "./logic";
import OptocouplerSvg from "./OptocouplerSvg";
import StatCard from "./StatCard";
import TypeInfo from "./TypeInfo";
import type { CouplerType, IsolationMode } from "./types";

export default function WhatIsOptocouplerInteractiveSimulation() {
  const [couplerType, setCouplerType] =
    useState<CouplerType>("Phototransistor");
  const [inputVoltage, setInputVoltage] = useState(5);
  const [isolation, setIsolation] = useState<IsolationMode>("Medium");
  const [enabled, setEnabled] = useState(true);

  const selfTestsPassed = useMemo(() => runSimulationSelfTests(), []);
  const results = useMemo(
    () =>
      calculateSimulation({
        enabled,
        inputVoltage,
        couplerType,
        isolation,
      }),
    [enabled, inputVoltage, couplerType, isolation],
  );
  const active = results.ledCurrent > 1;

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Optocoupler - Interactive Simulation
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            An optocoupler, or opto-isolator, converts the input-side electrical
            signal into light and transfers that light to an isolated output
            side. The input and output circuits stay electrically separated.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Selected Type"
            value={couplerType}
            tone="text-blue-600"
          />
          <StatCard
            label="LED Current"
            value={`${formatNumber(results.ledCurrent, 1)}mA`}
            tone="text-red-600"
          />
          <StatCard
            label="Output Current"
            value={`${formatNumber(results.outputCurrent, 1)}mA`}
            tone="text-green-600"
          />
          <StatCard
            label="Status"
            value={results.status}
            tone={active ? "text-emerald-600" : "text-slate-500"}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            couplerType={couplerType}
            setCouplerType={setCouplerType}
            inputVoltage={inputVoltage}
            setInputVoltage={setInputVoltage}
            isolation={isolation}
            setIsolation={setIsolation}
            enabled={enabled}
            setEnabled={setEnabled}
            results={results}
            selfTestsPassed={selfTestsPassed}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {couplerType} Visualizer
                </h2>
                <p className="text-sm text-slate-600">
                  Input LED to light beam to isolated {couplerType} output
                  circuit.
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {active ? "ACTIVE" : "OFF"}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <OptocouplerSvg active={active} couplerType={couplerType} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <TypeInfo title="What is Optocoupler?" active>
            An optocoupler combines an LED and a light-sensitive output device in
            one isolation component. It transfers a signal without directly
            electrically connecting the input and output circuits.
          </TypeInfo>
          <TypeInfo
            title="Phototransistor Type"
            active={couplerType === "Phototransistor"}
          >
            This type is widely used for digital isolation, microcontroller I/O
            isolation, and relay driver feedback because it offers simple,
            reliable DC switching behavior.
          </TypeInfo>
          <TypeInfo title="Photodiode Type" active={couplerType === "Photodiode"}>
            Photodiode optocouplers are useful when faster response is needed.
            They are a better fit for high-speed signal transfer than standard
            phototransistor designs.
          </TypeInfo>
          <TypeInfo title="PhotoTRIAC Type" active={couplerType === "PhotoTRIAC"}>
            PhotoTRIAC optocouplers are used for AC load control, solid-state
            relay behavior, and mains TRIAC triggering applications.
          </TypeInfo>
        </div>
      </div>
    </div>
  );
}
