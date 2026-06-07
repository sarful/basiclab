"use client";

import { motion } from "framer-motion";

import { clamp } from "./logic";
import type { SelectedTerminal, TransistorType } from "./types";

type ControlPanelSectionProps = {
  type: TransistorType;
  setType: (value: TransistorType) => void;
  selected: SelectedTerminal;
  setSelected: (value: SelectedTerminal) => void;
  signal: number;
  setSignal: (value: number) => void;
  terminalTitle: string;
  terminalRole: string;
  terminalKey: string;
};

export default function ControlPanelSection({
  type,
  setType,
  selected,
  setSelected,
  signal,
  setSignal,
  terminalTitle,
  terminalRole,
  terminalKey,
}: ControlPanelSectionProps) {
  const signalLevel = clamp(signal / 100, 0, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-900">Controls</h2>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
          {type}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => setType("NPN")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            type === "NPN"
              ? "bg-red-700 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          NPN
        </button>
        <button
          onClick={() => setType("PNP")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            type === "PNP"
              ? "bg-red-700 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          PNP
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Signal / Current Flow: {signal}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={signal}
          onChange={(e) => setSignal(Number(e.target.value))}
          className="w-full accent-red-700"
        />
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-3 rounded-full bg-red-700"
            animate={{ width: `${signalLevel * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Selected Terminal
        </p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">
          {terminalTitle}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {terminalRole}
        </p>
        <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-slate-800 shadow-sm">
          {terminalKey}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelected("Emitter")}
          className={`rounded-2xl border p-3 text-left shadow-sm transition ${
            selected === "Emitter"
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            E
          </p>
          <p className="mt-2 text-lg font-black text-slate-900">Emitter</p>
        </button>
        <button
          onClick={() => setSelected("Base")}
          className={`rounded-2xl border p-3 text-left shadow-sm transition ${
            selected === "Base"
              ? "border-blue-300 bg-blue-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            B
          </p>
          <p className="mt-2 text-lg font-black text-slate-900">Base</p>
        </button>
        <button
          onClick={() => setSelected("Collector")}
          className={`rounded-2xl border p-3 text-left shadow-sm transition ${
            selected === "Collector"
              ? "border-green-300 bg-green-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
            C
          </p>
          <p className="mt-2 text-lg font-black text-slate-900">Collector</p>
        </button>
      </div>
    </div>
  );
}
