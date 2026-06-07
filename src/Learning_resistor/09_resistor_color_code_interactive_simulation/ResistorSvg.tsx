"use client";

import { motion } from "framer-motion";

import type { BandMode } from "./types";

export function ResistorSvg({
  mode,
  bands,
}: {
  mode: BandMode;
  bands: Array<{ label: string; color: string; name: string; value: string }>;
}) {
  const positions = mode === 4 ? [235, 285, 335, 455] : mode === 5 ? [220, 265, 310, 360, 470] : [205, 245, 285, 330, 430, 485];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Interactive Resistor Color Code</h2>
          <p className="text-xs text-slate-600">Changing the color bands updates the resistor value in real time.</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{mode}-BAND</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 760 300" className="h-auto w-[760px] sm:w-full">
          <defs>
            <linearGradient id="resBody" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="55%" stopColor="#e9c27d" />
              <stop offset="100%" stopColor="#c99755" />
            </linearGradient>
          </defs>

          <text x="380" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Read left to right: digits → multiplier → tolerance → temperature coefficient
          </text>

          <line x1="55" y1="150" x2="185" y2="150" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
          <line x1="575" y1="150" x2="705" y2="150" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

          <path d="M185 150 C185 88 230 76 265 90 L495 90 C530 76 575 88 575 150 C575 212 530 224 495 210 L265 210 C230 224 185 212 185 150 Z" fill="url(#resBody)" stroke="#111827" strokeWidth="4" />

          {bands.map((band, index) => (
            <g key={`${band.label}-${index}`} className="group cursor-help">
              <motion.rect
                x={positions[index]}
                y="91"
                width="22"
                height="118"
                rx="4"
                fill={band.color}
                stroke="#111827"
                strokeWidth="1.5"
                initial={{ scaleY: 0.9, opacity: 0.8 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
              <text x={positions[index] + 11} y="235" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="700">
                {band.label}
              </text>
            </g>
          ))}

          <text x="380" y="270" textAnchor="middle" fill="#64748b" fontSize="12">
            Hover is optional; the band meaning is shown in the cards below.
          </text>
        </svg>
      </div>
    </div>
  );
}
