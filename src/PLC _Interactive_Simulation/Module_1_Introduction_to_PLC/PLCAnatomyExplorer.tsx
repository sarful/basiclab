"use client";

import React, { useMemo, useState } from "react";

import PowerSupplyModule from "./PowerSupplyModule";
import CpuModule from "./CpuModule";
import InputModule from "./InputModule";
import OutputModule from "./OutputModule";
import CommunicationModule from "./CommunicationModule";

type PLCPart = "power" | "cpu" | "input" | "output" | "communication";

const partInfo: Record<
  PLCPart,
  {
    title: string;
    role: string;
    details: string[];
  }
> = {
  power: {
    title: "Power Supply Module",
    role: "Converts incoming AC power into stable DC power for the PLC.",
    details: ["Input: AC 100–240V", "Output: DC 24V", "Feeds CPU and modules"],
  },
  cpu: {
    title: "CPU Module",
    role: "The brain of the PLC. It scans inputs, executes logic, and controls outputs.",
    details: ["Runs ladder logic", "Controls scan cycle", "Stores PLC program"],
  },
  input: {
    title: "Input Module",
    role: "Receives signals from switches, sensors, and field devices.",
    details: ["Push buttons", "Limit switches", "Proximity sensors"],
  },
  output: {
    title: "Output Module",
    role: "Sends control signals to actuators, lamps, relays, and motors.",
    details: ["Lamps", "Contactors", "Solenoids", "Relays"],
  },
  communication: {
    title: "Communication Module",
    role: "Connects PLC with HMI, SCADA, VFD, and other PLCs.",
    details: ["Ethernet", "Modbus", "Profinet", "RS485"],
  },
};

export default function PLCAnatomyExplorer() {
  const [selectedPart, setSelectedPart] = useState<PLCPart>("cpu");
  const [running, setRunning] = useState(true);

  const selectedInfo = useMemo(() => partInfo[selectedPart], [selectedPart]);

  return (
    <section className="min-h-screen bg-white p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            PLC Anatomy Explorer
          </h1>
          <p className="mt-2 text-slate-600">
            Click each PLC module to learn its function in an industrial control
            system.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* PLC Visual Area */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">PLC Hardware Rack</h2>

              <button
                onClick={() => setRunning(!running)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  running ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {running ? "PLC RUNNING" : "PLC STOPPED"}
              </button>
            </div>

            {/* DIN Rail */}
            <div className="mb-4 h-8 rounded-lg bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 shadow-inner" />

            {/* Modules */}
            <div className="flex items-end gap-3 overflow-x-auto pb-4">
              <PowerSupplyModule
                selected={selectedPart === "power"}
                onClick={() => setSelectedPart("power")}
                powerLed={running}
              />

              <CpuModule
                selected={selectedPart === "cpu"}
                onClick={() => setSelectedPart("cpu")}
                mode={running ? "RUN" : "STOP"}
                runLed={running}
                stopLed={!running}
                errorLed={false}
                batteryLed
              />

              <InputModule
                selected={selectedPart === "input"}
                onClick={() => setSelectedPart("input")}
                activeInputs={[true, false, true, true, false, true, false, true]}
              />

              <OutputModule
                selected={selectedPart === "output"}
                onClick={() => setSelectedPart("output")}
                activeOutputs={running ? [true, false, true, false, true, false, true, false] : []}
              />

              <CommunicationModule
                selected={selectedPart === "communication"}
                onClick={() => setSelectedPart("communication")}
                linkLed={running}
                txLed={running}
                rxLed={running}
              />
            </div>

            {/* Flow */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 font-semibold">PLC Signal Flow</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                <span className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700">
                  Sensors / Inputs
                </span>
                <span>→</span>
                <span className="rounded-lg bg-green-100 px-3 py-2 text-green-700">
                  CPU Logic
                </span>
                <span>→</span>
                <span className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700">
                  Outputs / Actuators
                </span>
                <span>→</span>
                <span className="rounded-lg bg-purple-100 px-3 py-2 text-purple-700">
                  HMI / SCADA
                </span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Selected Component
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {selectedInfo.title}
            </h2>

            <p className="mt-4 text-slate-700">{selectedInfo.role}</p>

            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Key Points</h3>
              <ul className="space-y-2">
                {selectedInfo.details.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl bg-white p-4">
              <h3 className="font-semibold">Learning Tip</h3>
              <p className="mt-2 text-sm text-slate-600">
                A PLC continuously reads input signals, processes the program in
                the CPU, then updates output devices.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}