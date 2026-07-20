"use client";

import React from "react";

export interface OperationStatusPanelProps {
  energized?: boolean;
  mainContactsClosed?: boolean;
  noClosed?: boolean;
  ncClosed?: boolean;
  loadRunning?: boolean;
}

export default function OperationStatusPanel({
  energized = false,
  mainContactsClosed = false,
  noClosed = false,
  ncClosed = true,
  loadRunning = false,
}: OperationStatusPanelProps) {
  const items = [
    ["Coil", energized ? "ENERGIZED" : "OFF", energized],
    ["Main Contacts", mainContactsClosed ? "CLOSED" : "OPEN", mainContactsClosed],
    ["NO Contact", noClosed ? "CLOSED" : "OPEN", noClosed],
    ["NC Contact", ncClosed ? "CLOSED" : "OPEN", ncClosed],
    ["Motor Load", loadRunning ? "RUNNING" : "OFF", loadRunning],
  ];

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-slate-800">
        Operation Status
      </h3>

      <div className="space-y-2">
        {items.map(([name, status, active]) => (
          <div
            key={String(name)}
            className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"
          >
            <span className="text-sm font-semibold text-slate-700">
              {name}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}