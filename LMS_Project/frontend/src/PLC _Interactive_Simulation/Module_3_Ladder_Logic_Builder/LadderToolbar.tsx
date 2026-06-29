"use client";

import React from "react";

export type LadderToolType =
  | "NO_CONTACT"
  | "NC_CONTACT"
  | "OUTPUT_COIL"
  | "TIMER_TON"
  | "TIMER_TOF"
  | "COUNTER_CTU"
  | "COUNTER_CTD"
  | "BRANCH"
  | "WIRE"
  | "DELETE";

export interface LadderToolbarProps {
  selectedTool?: LadderToolType;
  onSelectTool?: (tool: LadderToolType) => void;
}

const tools: {
  type: LadderToolType;
  label: string;
  symbol: string;
  description: string;
}[] = [
  { type: "NO_CONTACT", label: "NO Contact", symbol: "--| |--", description: "Normally Open" },
  { type: "NC_CONTACT", label: "NC Contact", symbol: "--|/|--", description: "Normally Closed" },
  { type: "OUTPUT_COIL", label: "Output Coil", symbol: "--( )--", description: "Output Device" },
  { type: "TIMER_TON", label: "TON Timer", symbol: "TON", description: "Delay ON Timer" },
  { type: "TIMER_TOF", label: "TOF Timer", symbol: "TOF", description: "Delay OFF Timer" },
  { type: "COUNTER_CTU", label: "CTU Counter", symbol: "CTU", description: "Count Up" },
  { type: "COUNTER_CTD", label: "CTD Counter", symbol: "CTD", description: "Count Down" },
  { type: "BRANCH", label: "Branch", symbol: "┬", description: "Parallel Path" },
  { type: "WIRE", label: "Wire", symbol: "━", description: "Connection Wire" },
  { type: "DELETE", label: "Delete", symbol: "✕", description: "Remove Item" },
];

export default function LadderToolbar({
  selectedTool = "NO_CONTACT",
  onSelectTool,
}: LadderToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          Ladder Toolbar
        </h2>
        <p className="text-sm text-slate-500">
          Select ladder elements to place on the workspace
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {tools.map((tool) => {
          const active = selectedTool === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => onSelectTool?.(tool.type)}
              className={`rounded-xl border p-3 text-center transition ${
                active
                  ? "border-blue-400 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div
                className={`mb-2 rounded-lg px-2 py-2 font-mono text-lg font-bold ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-slate-700"
                }`}
              >
                {tool.symbol}
              </div>

              <div className="text-sm font-bold text-slate-800">
                {tool.label}
              </div>

              <div className="mt-1 text-[11px] text-slate-500">
                {tool.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}