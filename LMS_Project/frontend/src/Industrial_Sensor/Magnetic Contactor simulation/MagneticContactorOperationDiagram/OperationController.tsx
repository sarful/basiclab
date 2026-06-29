"use client";

import React from "react";

export interface OperationControllerProps {
  energized: boolean;
  autoPlay?: boolean;
  onToggleEnergized: () => void;
  onToggleAutoPlay?: () => void;
  onReset?: () => void;
}

export default function OperationController({
  energized,
  autoPlay = false,
  onToggleEnergized,
  onToggleAutoPlay,
  onReset,
}: OperationControllerProps) {
  return (
    <div className="w-full rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-slate-800">
        Operation Controller
      </h3>

      <div className="grid gap-3">
        <button
          onClick={onToggleEnergized}
          className={`rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
            energized
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {energized ? "Turn Coil OFF" : "Turn Coil ON"}
        </button>

        {onToggleAutoPlay && (
          <button
            onClick={onToggleAutoPlay}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            {autoPlay ? "Pause Animation" : "Start Animation"}
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="rounded-xl border px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
        <p className="font-semibold text-slate-700">Current Status</p>
        <p className={energized ? "text-green-700" : "text-red-700"}>
          {energized
            ? "Coil energized: main contacts closed, NO closed, NC open."
            : "Coil off: main contacts open, NO open, NC closed."}
        </p>
      </div>
    </div>
  );
}