"use client";

import { useMemo, useState } from "react";

import { CircuitDiagram } from "./CircuitDiagram";
import { ControlPanelSection } from "./ControlPanelSection";
import { LedResistorProblems } from "./LedResistorProblems";
import { LedSelectorSection } from "./LedSelectorSection";
import { ledOptions, clamp, formatCurrent, formatNumber, formatResistance, getSafeLedStatus, nearestStandardResistor } from "./logic";
import { MetricCard } from "./MetricCard";
import { OhmsGraph } from "./OhmsGraph";
import type { LedOption, SolveMode } from "./types";

function LessonContent() {
  const [mode, setMode] = useState<SolveMode>("current");
  const [voltage, setVoltage] = useState(12);
  const [currentInput, setCurrentInput] = useState(0.12);
  const [resistance, setResistance] = useState(100);
  const [selectedLed, setSelectedLed] = useState<LedOption>(ledOptions[0]);

  const solved = useMemo(() => {
    if (mode === "current") {
      const current = voltage / resistance;
      return {
        voltage,
        current,
        resistance,
        formula: `I = V / R = ${voltage} / ${resistance} = ${formatCurrent(current)}`,
      };
    }

    if (mode === "voltage") {
      const calculatedVoltage = currentInput * resistance;
      return {
        voltage: calculatedVoltage,
        current: currentInput,
        resistance,
        formula: `V = I × R = ${currentInput} × ${resistance} = ${formatNumber(calculatedVoltage, 2)} V`,
      };
    }

    const calculatedResistance = voltage / currentInput;
    return {
      voltage,
      current: currentInput,
      resistance: calculatedResistance,
      formula: `R = V / I = ${voltage} / ${currentInput} = ${formatResistance(calculatedResistance)}`,
    };
  }, [mode, voltage, currentInput, resistance]);

  const ledBrightness = clamp(solved.current / (selectedLed.safeCurrentMa / 1000), 0, 1);
  const power = solved.current * solved.current * solved.resistance;
  const ledStatus = getSafeLedStatus(solved.current, selectedLed.safeCurrentMa);
  const ledSupplyVoltage = solved.voltage;
  const requiredLedResistor = Math.max(0, (ledSupplyVoltage - selectedLed.ledDrop) / (selectedLed.safeCurrentMa / 1000));
  const roundedLedResistor = nearestStandardResistor(requiredLedResistor);

  function resetSimulation() {
    setMode("current");
    setVoltage(12);
    setCurrentInput(0.12);
    setResistance(100);
    setSelectedLed(ledOptions[0]);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Industrial Electronics Trainer</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Ohm&apos;s Law Simulation</h1>
            <p className="mt-2 text-sm text-slate-600">Solve V, I, and R with a live graph, LED load, and animated circuit flow.</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-50 px-4 py-3 text-left sm:px-5 sm:text-right">
            <p className="text-xs text-blue-500">System Status</p>
            <p className={`text-lg font-bold ${ledStatus.tone}`}>{ledStatus.label}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        {[
          { id: "current", label: "Solve Current (I)" },
          { id: "voltage", label: "Solve Voltage (V)" },
          { id: "resistance", label: "Solve Resistance (R)" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as SolveMode)}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 sm:w-auto sm:py-2 ${
              mode === item.id ? "bg-cyan-500 text-slate-950" : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={resetSimulation}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto sm:py-2"
        >
          Reset Default
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Voltage" value={formatNumber(solved.voltage, 2)} unit="V" tone="text-blue-600" />
        <MetricCard label="Current" value={formatCurrent(solved.current).replace(" A", "").replace(" mA", "")} unit={solved.current >= 1 ? "A" : "mA"} tone="text-green-600" />
        <MetricCard label="Resistance" value={formatResistance(solved.resistance).replace(" Ω", "").replace(" kΩ", "")} unit={solved.resistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
        <MetricCard label="Power" value={formatNumber(power, 3)} unit="W" tone="text-orange-600" />
      </div>

      <LedSelectorSection
        selectedLed={selectedLed}
        ledOptions={ledOptions}
        ledStatusLabel={ledStatus.label}
        ledStatusTone={ledStatus.tone}
        ledStatusBg={ledStatus.bg}
        ledStatusMessage={ledStatus.message}
        ledSupplyVoltage={ledSupplyVoltage}
        requiredLedResistor={requiredLedResistor}
        roundedLedResistor={roundedLedResistor}
        onLedChange={setSelectedLed}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ControlPanelSection
          mode={mode}
          voltage={voltage}
          currentInput={currentInput}
          resistance={resistance}
          formula={solved.formula}
          ledBrightness={ledBrightness}
          onVoltageChange={setVoltage}
          onCurrentInputChange={setCurrentInput}
          onResistanceChange={setResistance}
        />

        <div className="lg:col-span-2">
          <CircuitDiagram voltage={solved.voltage} resistance={solved.resistance} current={solved.current} ledBrightness={ledBrightness} led={selectedLed} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OhmsGraph resistance={solved.resistance} voltage={solved.voltage} />

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-blue-600">Voltage increases current</p>
              <p className="mt-1 text-slate-600">If resistance stays constant, increasing voltage increases current.</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-yellow-600">Resistance reduces current</p>
              <p className="mt-1 text-slate-600">If voltage stays constant, increasing resistance reduces current.</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-green-600">LED brightness follows current</p>
              <p className="mt-1 text-slate-600">More current makes the LED brighter, less current makes it dimmer.</p>
            </div>
          </div>
        </div>
      </div>

      <LedResistorProblems supplyVoltage={ledSupplyVoltage} />
    </div>
  );
}

export default function WhatIsOhmsLawInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
