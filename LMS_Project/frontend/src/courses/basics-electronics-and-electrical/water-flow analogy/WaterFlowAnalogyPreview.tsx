"use client";

import React, { useMemo, useState } from "react";

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
import { Control, Panel, Reading } from "./ui";
import { WaterSystem } from "./WaterSystem";

function NoticeCard({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export function WaterFlowAnalogyPreview() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);

  const current = useMemo(() => calculateCurrent(voltage, resistance), [voltage, resistance]);
  const power = useMemo(() => calculatePower(voltage, current), [voltage, current]);
  const currentPercent = useMemo(() => calculateCurrentPercent(current), [current]);
  const pipeOpening = useMemo(() => calculatePipeOpening(resistance), [resistance]);
  const flowRate = useMemo(() => calculateFlowRate(current), [current]);
  const flowSpeed = useMemo(() => calculateFlowSpeed(current), [current]);
  const needleAngle = useMemo(() => calculateNeedleAngle(currentPercent), [currentPercent]);

  const reset = () => {
    setVoltage(DEFAULT_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[250px_1fr]">
        <aside className="space-y-4">
          <Panel title="Simple Mapping">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <strong className="text-slate-950">Pump</strong> matches the battery source.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <strong className="text-slate-950">Pipe flow</strong> matches current in the wire.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <strong className="text-slate-950">Narrow pipe</strong> matches resistance that restricts movement.
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-slate-700">
                Preview: <strong>{voltage.toFixed(1)} V</strong>, <strong>{resistance.toFixed(1)} Ohm</strong>,{" "}
                <strong>{current.toFixed(2)} A</strong>, <strong>{power.toFixed(2)} W</strong>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <Reading label="Current (I)" value={current.toFixed(3)} unit="A" color="text-green-600" />
                <Reading label="Flow Rate" value={flowRate.toFixed(1)} unit="L/min" color="text-cyan-600" />
                <Reading label="Pipe Opening" value={pipeOpening.toFixed(0)} unit="%" color="text-purple-600" />
              </div>
            </div>
          </Panel>

          <Panel title="Try the Controls">
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
              unit="Ohm"
              onChange={setResistance}
            />

            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center justify-center rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              Reset Preview
            </button>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="font-black">Ohm&apos;s Law</p>
              <div className="mt-2 flex justify-around text-sm font-bold">
                <span>V = I x R</span>
                <span>I = V / R</span>
              </div>
            </div>
          </Panel>
        </aside>

        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <NoticeCard
                title="Voltage acts like pressure"
                detail="Pump pressure behaves like battery voltage."
              />
              <NoticeCard
                title="Current acts like flow"
                detail="Water flow behaves like electric current."
              />
              <NoticeCard
                title="Resistance acts like restriction"
                detail="A narrow pipe behaves like resistance."
              />
            </div>
          </div>

          <ElectricalCircuit
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

          <MappingSection />
        </div>
      </div>
    </div>
  );
}
