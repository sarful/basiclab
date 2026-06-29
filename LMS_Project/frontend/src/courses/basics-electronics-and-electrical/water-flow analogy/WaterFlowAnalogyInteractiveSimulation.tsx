"use client";

import { useCallback, useMemo, useState } from "react";

import { ElectricalCircuit } from "./ElectricalCircuit";
import {
  calculateCurrent,
  calculateCurrentPercent,
  calculateFlowRate,
  calculateFlowSpeed,
  calculateNeedleAngle,
  calculatePipeOpening,
  calculatePower,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  MAX_RESISTANCE,
  MAX_VOLTAGE,
  MIN_RESISTANCE,
  MIN_VOLTAGE,
} from "./logic";
import { MappingSection } from "./MappingSection";
import { SimpleAnalogySection } from "./SimpleAnalogySection";
import { Control, Panel, Reading } from "./ui";
import { WaterSystem } from "./WaterSystem";

export default function WaterFlowAnalogyInteractiveSimulation() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);

  const current = useMemo(
    () => calculateCurrent(voltage, resistance),
    [voltage, resistance],
  );

  const power = useMemo(
    () => calculatePower(voltage, current),
    [voltage, current],
  );

  const currentPercent = useMemo(
    () => calculateCurrentPercent(current),
    [current],
  );

  const pipeOpening = useMemo(
    () => calculatePipeOpening(resistance),
    [resistance],
  );

  const flowRate = useMemo(() => calculateFlowRate(current), [current]);

  const flowSpeed = useMemo(() => calculateFlowSpeed(current), [current]);

  const needleAngle = useMemo(
    () => calculateNeedleAngle(currentPercent),
    [currentPercent],
  );

  const reset = useCallback(() => {
    setVoltage(DEFAULT_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-300 bg-white p-4 shadow-2xl">
        <header className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-wide text-slate-900">
              LEARNING: CURRENT AND VOLTAGE
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Interactive simulation using a water-flow analogy
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="w-fit rounded-xl border border-blue-300 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            Reset
          </button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <Panel title="Circuit Controls">
              <Control
                label="Voltage (V)"
                value={voltage}
                min={MIN_VOLTAGE}
                max={MAX_VOLTAGE}
                unit="V"
                onChange={setVoltage}
              />

              <Control
                label="Resistance (R)"
                value={resistance}
                min={MIN_RESISTANCE}
                max={MAX_RESISTANCE}
                unit="Ω"
                onChange={setResistance}
              />
            </Panel>

            <Panel title="Real-Time Readings">
              <Reading
                label="Current (I)"
                value={current.toFixed(3)}
                unit="A"
                color="text-green-600"
              />

              <Reading
                label="Power (P)"
                value={power.toFixed(2)}
                unit="W"
                color="text-blue-600"
              />

              <Reading
                label="Flow Rate"
                value={flowRate.toFixed(1)}
                unit="L/min"
                color="text-cyan-600"
              />

              <Reading
                label="Pipe Opening"
                value={pipeOpening.toFixed(0)}
                unit="%"
                color="text-purple-600"
              />
            </Panel>

            <Panel title="Formula">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="font-black">Ohm&apos;s Law</p>

                <div className="mt-2 flex justify-around gap-3 text-sm font-bold">
                  <span>V = I × R</span>
                  <span>I = V / R</span>
                </div>

                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Higher voltage pushes more current, while higher resistance
                  reduces current.
                </p>
              </div>
            </Panel>
          </aside>

          <main className="space-y-4">
            <ElectricalCircuit
              voltage={voltage}
              resistance={resistance}
              current={current}
              angle={needleAngle}
              flowSpeed={flowSpeed}
            />

            <WaterSystem
              resistance={resistance}
              pipeOpening={pipeOpening}
              flowRate={flowRate}
              angle={needleAngle}
              flowSpeed={flowSpeed}
            />
          </main>
        </div>

        <SimpleAnalogySection />
        <MappingSection />

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
          Electrical logic: Resistance increases → pipe becomes narrower → flow
          decreases → current decreases.
        </div>
      </div>
    </div>
  );
}
