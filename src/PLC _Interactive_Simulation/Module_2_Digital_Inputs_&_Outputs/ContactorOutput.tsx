"use client";

import React from "react";

export interface ContactorOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
}

export default function ContactorOutput({
  active = false,
  label = "Contactor",
  address = "Q0.5",
  onClick,
  showAddress = true,
  width = 180,
  height = 170,
}: ContactorOutputProps) {
  return (
    <div onClick={onClick} className="inline-flex cursor-pointer select-none flex-col items-center gap-2" style={{ width }}>
      <svg width={width} height={height} viewBox="0 0 180 170" className="drop-shadow-lg">
        <defs>
          <linearGradient id="contactorBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>

          <radialGradient id="contactorLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        <rect x="35" y="20" width="110" height="115" rx="8" fill="url(#contactorBody)" stroke="#111827" strokeWidth="2" />

        <rect x="50" y="35" width="80" height="26" rx="4" fill="#111827" stroke="#94a3b8" />
        <text x="90" y="53" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
          CONTACTOR
        </text>

        <circle cx="58" cy="82" r="6" fill={active ? "url(#contactorLed)" : "#374151"} stroke="#94a3b8" />
        <text x="72" y="86" fill="#ffffff" fontSize="11">
          COIL
        </text>

        <rect x="52" y="98" width="76" height="22" rx="4" fill={active ? "#22c55e" : "#475569"} stroke="#111827" />
        <text x="90" y="113" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
          {active ? "PULLED IN" : "RELEASED"}
        </text>

        {/* Power terminals */}
        {[55, 90, 125].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="18" r="6" fill="#e5e7eb" stroke="#475569" />
            <path d={`M${x} 0 V12`} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy="137" r="6" fill="#e5e7eb" stroke="#475569" />
            <path d={`M${x} 143 V162`} stroke={active ? "#22c55e" : "#94a3b8"} strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}

        {/* Contact lines */}
        {[55, 90, 125].map((x, i) => (
          <line
            key={`line-${i}`}
            x1={x}
            y1="68"
            x2={x}
            y2={active ? 98 : 90}
            stroke={active ? "#22c55e" : "#cbd5e1"}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}

        <text x="90" y="160" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">
          {active ? "MOTOR POWER ON" : "MOTOR POWER OFF"}
        </text>
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {showAddress && <div className="text-xs text-slate-500">{address}</div>}
      </div>
    </div>
  );
}