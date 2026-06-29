"use client";

import React from "react";
import InputChannel from "./InputChannel";

export interface DigitalInput {
  address: string;
  label: string;
  deviceType: string;
  active: boolean;
}

export interface DigitalInputPanelProps {
  inputs?: DigitalInput[];
  title?: string;
  onChannelClick?: (input: DigitalInput) => void;
}

export default function DigitalInputPanel({
  title = "Digital Inputs",
  onChannelClick,
  inputs = [
    {
      address: "I0.0",
      label: "Start Push Button",
      deviceType: "NO Push Button",
      active: true,
    },
    {
      address: "I0.1",
      label: "Stop Push Button",
      deviceType: "NC Push Button",
      active: false,
    },
    {
      address: "I0.2",
      label: "Limit Switch",
      deviceType: "Mechanical Switch",
      active: true,
    },
    {
      address: "I0.3",
      label: "Proximity Sensor",
      deviceType: "Inductive Sensor",
      active: false,
    },
    {
      address: "I0.4",
      label: "Photoelectric Sensor",
      deviceType: "Optical Sensor",
      active: true,
    },
    {
      address: "I0.5",
      label: "Float Switch",
      deviceType: "Level Sensor",
      active: false,
    },
    {
      address: "I0.6",
      label: "Door Switch",
      deviceType: "Safety Interlock",
      active: false,
    },
    {
      address: "I0.7",
      label: "Emergency Stop",
      deviceType: "Safety Device",
      active: false,
    },
  ],
}: DigitalInputPanelProps) {
  const activeCount = inputs.filter((i) => i.active).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              PLC Digital Input Monitoring
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2">
            <div className="text-xs text-slate-500">
              Active Inputs
            </div>

            <div className="text-xl font-bold text-blue-600">
              {activeCount}/{inputs.length}
            </div>
          </div>
        </div>
      </div>

      {/* Input Channels */}
      <div className="space-y-2 p-4">
        {inputs.map((input) => (
          <InputChannel
            key={input.address}
            active={input.active}
            address={input.address}
            label={input.label}
            deviceType={input.deviceType}
            onClick={() => onChannelClick?.(input)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">
            PLC Scan Status
          </span>

          <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700">
            SCANNING
          </span>
        </div>
      </div>
    </div>
  );
}