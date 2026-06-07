"use client";

import { useMemo, useState } from "react";

import CircuitVisual from "./CircuitVisual";
import ControlPanelSection from "./ControlPanelSection";
import LearningSections from "./LearningSections";
import {
  clamp,
  formatNumber,
  getTransistorLevel,
  MIN_BASE_BIAS_CURRENT,
  CALCULATION_TEST_CASES,
} from "./logic";
import MetricCard from "./MetricCard";

export default function WhatIsTransistorInteractiveSimulation() {
  const [baseVoltage, setBaseVoltage] = useState(9);
  const [baseResistance, setBaseResistance] = useState(10000);
  const [loadResistance, setLoadResistance] = useState(300);
  const [switchOn, setSwitchOn] = useState(false);
  const [gain, setGain] = useState(100);

  const rawBaseCurrent = useMemo(
    () => (switchOn ? baseVoltage / baseResistance : 0),
    [baseVoltage, baseResistance, switchOn],
  );
  const transistorBiased = rawBaseCurrent >= MIN_BASE_BIAS_CURRENT;
  const baseCurrent = useMemo(
    () => (transistorBiased ? rawBaseCurrent : 0),
    [rawBaseCurrent, transistorBiased],
  );
  const collectorCurrent = useMemo(
    () =>
      transistorBiased
        ? clamp(baseCurrent * gain, 0, baseVoltage / loadResistance)
        : 0,
    [baseCurrent, gain, loadResistance, baseVoltage, transistorBiased],
  );
  const lampPower = useMemo(
    () => collectorCurrent * collectorCurrent * loadResistance,
    [collectorCurrent, loadResistance],
  );
  const maxCollectorCurrent = useMemo(
    () => baseVoltage / loadResistance,
    [baseVoltage, loadResistance],
  );
  const lampGlow = useMemo(
    () => clamp(collectorCurrent / Math.max(maxCollectorCurrent, 0.00001), 0, 1),
    [collectorCurrent, maxCollectorCurrent],
  );
  const transistorLevel = useMemo(
    () => getTransistorLevel({ switchOn, transistorBiased, lampGlow }),
    [switchOn, transistorBiased, lampGlow],
  );
  const amplification = clamp((baseCurrent * gain) / 0.04, 0, 1);

  function resetSimulation() {
    setBaseVoltage(9);
    setLoadResistance(300);
    setGain(100);
    setBaseResistance(10000);
    setSwitchOn(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white p-2 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-3 sm:space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-green-50 via-white to-yellow-50 p-4 shadow-xl sm:rounded-3xl sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-green-700 sm:text-xs sm:tracking-[0.35em]">
            Interactive Electronics Trainer
          </p>
          <h3 className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-3xl">
            What is Transistor - Interactive Simulation
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            A transistor is a semiconductor device that uses a small base
            current to control a larger collector current. It can work as a
            switch or as an amplifier.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:gap-4 md:grid-cols-4">
          <MetricCard
            label="Base Voltage"
            value={formatNumber(baseVoltage, 0)}
            unit="V"
            tone="text-blue-600"
          />
          <MetricCard
            label="Base Current"
            value={formatNumber(rawBaseCurrent * 1000, 2)}
            unit="mA"
            tone={transistorBiased ? "text-cyan-600" : "text-red-600"}
          />
          <MetricCard
            label="Collector Current"
            value={formatNumber(collectorCurrent * 1000, 1)}
            unit="mA"
            tone="text-green-600"
          />
          <MetricCard
            label="Lamp Power"
            value={formatNumber(lampPower * 1000, 0)}
            unit="mW"
            tone="text-yellow-600"
          />
        </div>

        <div className="grid gap-3 sm:gap-6 xl:grid-cols-3">
          <ControlPanelSection
            baseVoltage={baseVoltage}
            setBaseVoltage={setBaseVoltage}
            baseResistance={baseResistance}
            setBaseResistance={setBaseResistance}
            loadResistance={loadResistance}
            setLoadResistance={setLoadResistance}
            switchOn={switchOn}
            setSwitchOn={setSwitchOn}
            gain={gain}
            setGain={setGain}
            collectorCurrent={collectorCurrent}
            baseCurrent={baseCurrent}
            transistorBiased={transistorBiased}
            resetSimulation={resetSimulation}
          />

          <div className="xl:col-span-2">
            <CircuitVisual
              baseVoltage={baseVoltage}
              baseResistance={baseResistance}
              loadResistance={loadResistance}
              switchOn={switchOn}
              gain={gain}
            />
          </div>
        </div>

        <LearningSections
          transistorBiased={transistorBiased}
          rawBaseCurrent={rawBaseCurrent}
          amplification={amplification}
          lampPower={lampPower}
          transistorLevel={transistorLevel}
        />

        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <summary className="cursor-pointer font-bold text-slate-800">
            Calculation test cases
          </summary>
          <pre className="mt-3 overflow-x-auto">
            {JSON.stringify(CALCULATION_TEST_CASES, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
