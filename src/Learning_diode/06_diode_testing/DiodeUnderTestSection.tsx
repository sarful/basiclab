"use client";

import { motion } from "framer-motion";

import type { Terminal } from "./types";

export function DiodeUnderTestSection({
  redTerminal,
  blackTerminal,
  isConnected,
  isForward,
  onSetRedTerminal,
  onSetBlackTerminal,
}: {
  redTerminal: Terminal;
  blackTerminal: Terminal;
  isConnected: boolean;
  isForward: boolean;
  onSetRedTerminal: (value: Terminal) => void;
  onSetBlackTerminal: (value: Terminal) => void;
}) {
  const buttonBase =
    "rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-md transition active:scale-95 hover:brightness-110 sm:px-4 sm:text-base";

  const redPosition =
    redTerminal === "anode"
      ? "left-10 top-20"
      : redTerminal === "cathode"
        ? "right-10 top-20"
        : "left-10 top-8";
  const blackPosition =
    blackTerminal === "anode"
      ? "left-10 top-20"
      : blackTerminal === "cathode"
        ? "right-10 top-20"
        : "right-10 top-8";

  return (
    <section className="rounded-2xl border border-gray-500 bg-gradient-to-b from-gray-100 to-gray-300 p-4 text-center shadow-inner sm:p-5">
      <h2 className="mb-4 text-lg font-bold">Diode Under Test</h2>

      <div className="relative mx-auto h-56 max-w-xl rounded-2xl border border-gray-500 bg-gray-200 p-4 shadow-inner sm:h-64">
        <div className="absolute left-8 top-24 z-10 flex flex-col items-center sm:left-12">
          <button
            onClick={() => onSetRedTerminal("anode")}
            className={`h-12 w-12 rounded-full border-4 shadow-lg transition ${
              redTerminal === "anode" || blackTerminal === "anode"
                ? "border-green-500 bg-green-100"
                : "border-red-500 bg-white"
            }`}
            aria-label="Anode snap terminal"
          />
          <span className="mt-2 text-xs font-bold text-red-700">ANODE A</span>
        </div>

        <div className="absolute right-8 top-24 z-10 flex flex-col items-center sm:right-12">
          <button
            onClick={() => onSetRedTerminal("cathode")}
            className={`h-12 w-12 rounded-full border-4 shadow-lg transition ${
              redTerminal === "cathode" || blackTerminal === "cathode"
                ? "border-green-500 bg-green-100"
                : "border-blue-500 bg-white"
            }`}
            aria-label="Cathode snap terminal"
          />
          <span className="mt-2 text-xs font-bold text-blue-700">CATHODE K</span>
        </div>

        <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-xl border border-gray-500 bg-white px-5 py-4 text-5xl shadow-lg sm:px-8 sm:text-6xl">
          &gt;|-
        </div>

        <motion.div
          drag
          dragConstraints={{ left: -110, right: 110, top: -35, bottom: 95 }}
          onDragEnd={(_, info) => {
            onSetRedTerminal(info.point.x < window.innerWidth / 2 ? "anode" : "cathode");
          }}
          animate={{ scale: redTerminal === "free" ? 1 : 0.9 }}
          className={`absolute ${redPosition} z-20 flex cursor-grab flex-col items-center active:cursor-grabbing`}
        >
          <div className="h-16 w-3 rounded-full bg-red-600 shadow-lg" />
          <div className="mt-1 h-8 w-6 rounded-b-full bg-gray-900" />
          <span className="mt-1 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">RED</span>
        </motion.div>

        <motion.div
          drag
          dragConstraints={{ left: -110, right: 110, top: -35, bottom: 95 }}
          onDragEnd={(_, info) => {
            onSetBlackTerminal(info.point.x < window.innerWidth / 2 ? "anode" : "cathode");
          }}
          animate={{ scale: blackTerminal === "free" ? 1 : 0.9 }}
          className={`absolute ${blackPosition} z-20 flex cursor-grab flex-col items-center active:cursor-grabbing`}
        >
          <div className="h-16 w-3 rounded-full bg-gray-700 shadow-lg" />
          <div className="mt-1 h-8 w-6 rounded-b-full bg-gray-900" />
          <span className="mt-1 rounded bg-gray-800 px-2 py-1 text-xs font-bold text-white">BLACK</span>
        </motion.div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {redTerminal !== "free" && (
            <line
              x1="25%"
              y1="20%"
              x2={redTerminal === "anode" ? "18%" : "82%"}
              y2="44%"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {blackTerminal !== "free" && (
            <line
              x1="75%"
              y1="20%"
              x2={blackTerminal === "anode" ? "18%" : "82%"}
              y2="44%"
              stroke="#374151"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-gray-400 bg-white p-3 shadow-sm">
          <p className="font-black text-red-600">Red Probe</p>
          <p className="text-gray-700">
            {redTerminal === "free"
              ? "Free"
              : redTerminal === "anode"
                ? "Snapped to Anode"
                : "Snapped to Cathode"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-400 bg-white p-3 shadow-sm">
          <p className="font-black text-yellow-700">D1 Rectifier</p>
          <p className="text-gray-700">
            {isConnected ? (isForward ? "Forward Bias" : "Reverse Bias") : "Not connected"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-400 bg-white p-3 shadow-sm">
          <p className="font-black text-blue-700">Black Probe</p>
          <p className="text-gray-700">
            {blackTerminal === "free"
              ? "Free"
              : blackTerminal === "anode"
                ? "Snapped to Anode"
                : "Snapped to Cathode"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => {
            onSetRedTerminal("anode");
            onSetBlackTerminal("cathode");
          }}
          className={`${buttonBase} bg-red-600`}
        >
          Snap Forward
        </button>
        <button
          onClick={() => {
            onSetRedTerminal("cathode");
            onSetBlackTerminal("anode");
          }}
          className={`${buttonBase} bg-purple-600`}
        >
          Snap Reverse
        </button>
        <button
          onClick={() => {
            onSetRedTerminal("free");
            onSetBlackTerminal("free");
          }}
          className={`${buttonBase} bg-gray-700`}
        >
          Release Probes
        </button>
      </div>
    </section>
  );
}
