"use client";

import React from "react";

export interface InputChannelProps {
  active?: boolean;
  address?: string;
  label?: string;
  deviceType?: string;
  onClick?: () => void;
}

export default function InputChannel({
  active = false,
  address = "I0.0",
  label = "Input Channel",
  deviceType = "Sensor",
  onClick,
}: InputChannelProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left shadow-sm transition ${
        active
          ? "border-green-300 bg-green-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-4 w-4 rounded-full border ${
            active
              ? "border-green-600 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
              : "border-slate-400 bg-slate-200"
          }`}
        />

        <div>
          <div className="text-sm font-bold text-slate-800">{address}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs font-semibold text-slate-600">
          {deviceType}
        </div>
        <div
          className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "ON" : "OFF"}
        </div>
      </div>
    </button>
  );
}