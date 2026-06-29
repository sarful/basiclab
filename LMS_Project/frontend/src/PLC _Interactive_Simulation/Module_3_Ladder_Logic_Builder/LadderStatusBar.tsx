"use client";

import React from "react";

export interface LadderStatusBarProps {
  plcMode?: "RUN" | "STOP" | "PROGRAM";
  scanTimeMs?: number;
  rungCount?: number;
  errorCount?: number;
  selectedTool?: string;
}

export default function LadderStatusBar({
  plcMode = "RUN",
  scanTimeMs = 4,
  rungCount = 1,
  errorCount = 0,
  selectedTool = "NO_CONTACT",
}: LadderStatusBarProps) {
  const running = plcMode === "RUN";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            running
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          PLC {plcMode}
        </span>

        <span className="text-sm text-slate-600">
          Scan Time: <b>{scanTimeMs} ms</b>
        </span>

        <span className="text-sm text-slate-600">
          Rungs: <b>{rungCount}</b>
        </span>

        <span
          className={`text-sm ${
            errorCount > 0 ? "text-red-600" : "text-slate-600"
          }`}
        >
          Errors: <b>{errorCount}</b>
        </span>
      </div>

      <div className="text-sm text-slate-600">
        Selected Tool: <b>{selectedTool}</b>
      </div>
    </div>
  );
}