"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import LedSwitchSvg from "./LedSwitchSvg";
import { calculateLedSwitch, formatNumber, runSimulationTests } from "./logic";
import StatCard from "./StatCard";
import TypeInfo from "./TypeInfo";
import type { SwitchType } from "./types";

export default function WhatIsLedPushbuttonSwitchCircuitInteractiveSimulation() {
  const [switchType, setSwitchType] = useState<SwitchType>("NO");
  const [pressed, setPressed] = useState(false);
  const [supplyVoltage, setSupplyVoltage] = useState(5);
  const [resistorOhm, setResistorOhm] = useState(330);
  const [electronFlowRate, setElectronFlowRate] = useState(55);

  const result = useMemo(
    () => calculateLedSwitch({ switchType, pressed, supplyVoltage, resistorOhm }),
    [switchType, pressed, supplyVoltage, resistorOhm],
  );
  const testsPassed = useMemo(() => runSimulationTests(), []);

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            LED Switch Circuit - NO and NC Pushbutton
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Learn how a pushbutton controls an LED in a simple circuit. A
            normally open switch closes only when pressed, while a normally
            closed switch opens when pressed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Switch Type" value={switchType} tone="text-blue-600" />
          <StatCard
            label="Button State"
            value={pressed ? "PRESSED" : "RELEASED"}
            tone={pressed ? "text-purple-600" : "text-slate-600"}
          />
          <StatCard
            label="Circuit"
            value={result.circuitClosed ? "CLOSED" : "OPEN"}
            tone={result.circuitClosed ? "text-green-600" : "text-red-600"}
          />
          <StatCard
            label="LED Current"
            value={`${formatNumber(result.currentMa, 1)}mA`}
            tone="text-orange-600"
          />
          <StatCard
            label="Flow Rate"
            value={`${electronFlowRate}%`}
            tone="text-cyan-600"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            switchType={switchType}
            setSwitchType={setSwitchType}
            pressed={pressed}
            setPressed={setPressed}
            supplyVoltage={supplyVoltage}
            setSupplyVoltage={setSupplyVoltage}
            resistorOhm={resistorOhm}
            setResistorOhm={setResistorOhm}
            electronFlowRate={electronFlowRate}
            setElectronFlowRate={setElectronFlowRate}
            result={result}
            testsPassed={testsPassed}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  LED Switch Circuit Visualizer
                </h2>
                <p className="text-sm text-slate-600">
                  Battery to pushbutton to resistor to LED to return path.
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  result.ledOn
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {result.ledOn ? "LED ON" : "LED OFF"}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <LedSwitchSvg
                switchType={switchType}
                pressed={pressed}
                supplyVoltage={supplyVoltage}
                resistorOhm={resistorOhm}
                electronFlowRate={electronFlowRate}
                result={result}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <TypeInfo title="NO Pushbutton" active={switchType === "NO"}>
            A normally open switch stays open in its resting state. When you
            press it, the contact closes and current can flow.
          </TypeInfo>
          <TypeInfo title="NC Pushbutton" active={switchType === "NC"}>
            A normally closed switch stays closed in its resting state. When you
            press it, the contact opens and current stops.
          </TypeInfo>
          <TypeInfo title="Series Resistor" active>
            The resistor limits current through the LED. Without it, the LED can
            draw too much current and get damaged.
          </TypeInfo>
        </div>
      </div>
    </div>
  );
}
