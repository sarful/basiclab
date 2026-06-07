"use client";

import React from "react";
import OutputChannel from "./OutputChannel";

export interface DigitalOutput {
  address: string;
  label: string;
  deviceType: string;
  active: boolean;
}

export interface DigitalOutputPanelProps {
  outputs?: DigitalOutput[];
  title?: string;
  onChannelClick?: (output: DigitalOutput) => void;
}

export default function DigitalOutputPanel({
  title = "Digital Outputs",
  onChannelClick,
  outputs = [
    { address: "Q0.0", label: "Green Run Lamp", deviceType: "Pilot Lamp", active: true },
    { address: "Q0.1", label: "Red Fault Lamp", deviceType: "Pilot Lamp", active: false },
    { address: "Q0.2", label: "Conveyor Motor", deviceType: "Motor", active: true },
    { address: "Q0.3", label: "Water Valve", deviceType: "Solenoid Valve", active: false },
    { address: "Q0.4", label: "Alarm Buzzer", deviceType: "Buzzer", active: false },
    { address: "Q0.5", label: "Motor Contactor", deviceType: "Contactor", active: true },
    { address: "Q0.6", label: "Tank Heater", deviceType: "Heater", active: false },
    { address: "Q0.7", label: "System Ready", deviceType: "Indicator", active: true },
  ],
}: DigitalOutputPanelProps) {
  const activeCount = outputs.filter((output) => output.active).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500">
              PLC Digital Output Monitoring
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2">
            <div className="text-xs text-slate-500">Active Outputs</div>
            <div className="text-xl font-bold text-blue-600">
              {activeCount}/{outputs.length}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {outputs.map((output) => (
          <OutputChannel
            key={output.address}
            active={output.active}
            address={output.address}
            label={output.label}
            deviceType={output.deviceType}
            onClick={() => onChannelClick?.(output)}
          />
        ))}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">
            Output Update Status
          </span>

          <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700">
            UPDATED
          </span>
        </div>
      </div>
    </div>
  );
}