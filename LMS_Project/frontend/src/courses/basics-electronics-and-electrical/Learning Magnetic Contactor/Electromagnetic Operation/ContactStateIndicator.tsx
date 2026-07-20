"use client";

import React from "react";

export type ContactStateIndicatorProps = {
  energized?: boolean;
  mainContactsClosed?: boolean;
  auxNOClosed?: boolean;
  auxNCClosed?: boolean;
  loadRunning?: boolean;
  compact?: boolean;
  title?: string;
};

function StatusPill({
  label,
  active,
  activeText = "ON",
  inactiveText = "OFF",
}: {
  label: string;
  active: boolean;
  activeText?: string;
  inactiveText?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${
            active ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.9)]" : "bg-slate-300"
          }`}
        />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {active ? activeText : inactiveText}
      </span>
    </div>
  );
}

export default function ContactStateIndicator({
  energized = false,
  mainContactsClosed = false,
  auxNOClosed = false,
  auxNCClosed = true,
  loadRunning = false,
  compact = false,
  title = "Contact State Indicator",
}: ContactStateIndicatorProps) {
  const noOpen = !auxNOClosed;
  const ncOpen = !auxNCClosed;

  if (compact) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-bold text-slate-800">{title}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <StatusPill label="Coil" active={energized} activeText="ON" inactiveText="OFF" />
          <StatusPill label="Main" active={mainContactsClosed} activeText="CLOSED" inactiveText="OPEN" />
          <StatusPill label="NO 13-14" active={auxNOClosed} activeText="CLOSED" inactiveText="OPEN" />
          <StatusPill label="NC 21-22" active={auxNCClosed} activeText="CLOSED" inactiveText="OPEN" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">
            Shows how main and auxiliary contacts change when the coil is energized.
          </p>
        </div>

        <div
          className={`rounded-2xl px-4 py-2 text-center text-sm font-bold ${
            loadRunning ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600"
          }`}
        >
          {loadRunning ? "LOAD RUNNING" : "LOAD STOPPED"}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <StatusPill label="Coil A1-A2" active={energized} activeText="ENERGIZED" inactiveText="DE-ENERGIZED" />
        <StatusPill label="Main Contacts L1/L2/L3" active={mainContactsClosed} activeText="CLOSED" inactiveText="OPEN" />
        <StatusPill label="Auxiliary NO 13-14" active={auxNOClosed} activeText="CLOSED" inactiveText="OPEN" />
        <StatusPill label="Auxiliary NC 21-22" active={auxNCClosed} activeText="CLOSED" inactiveText="OPEN" />
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4">
        <svg viewBox="0 0 720 230" className="h-auto w-full" role="img" aria-label="Contact state diagram">
          <defs>
            <filter id="contactGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="30" y="28" fontSize="16" fontWeight="700" fill="#334155">
            Main NO Contact
          </text>
          <line x1="45" y1="95" x2="145" y2="95" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="230" y1="95" x2="330" y2="95" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <circle cx="145" cy="95" r="11" fill="#f59e0b" />
          <circle cx="230" cy="95" r="11" fill="#f59e0b" />
          <line
            x1="155"
            y1="95"
            x2="220"
            y2={mainContactsClosed ? 95 : 60}
            stroke={mainContactsClosed ? "#22c55e" : "#ef4444"}
            strokeWidth="7"
            strokeLinecap="round"
            filter={mainContactsClosed ? "url(#contactGlow)" : undefined}
            style={{ transition: "all 300ms ease" }}
          />
          <text x="142" y="135" fontSize="13" fontWeight="700" fill="#64748b">
            {mainContactsClosed ? "Closed" : "Open"}
          </text>

          <text x="395" y="28" fontSize="16" fontWeight="700" fill="#334155">
            Auxiliary Contacts
          </text>

          <text x="395" y="65" fontSize="13" fontWeight="700" fill="#64748b">
            NO 13-14
          </text>
          <line x1="395" y1="95" x2="465" y2="95" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <line x1="550" y1="95" x2="620" y2="95" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <circle cx="465" cy="95" r="9" fill="#f59e0b" />
          <circle cx="550" cy="95" r="9" fill="#f59e0b" />
          <line
            x1="475"
            y1="95"
            x2="540"
            y2={auxNOClosed ? 95 : 65}
            stroke={auxNOClosed ? "#22c55e" : "#ef4444"}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transition: "all 300ms ease" }}
          />
          <text x="635" y="100" fontSize="13" fontWeight="700" fill={noOpen ? "#ef4444" : "#22c55e"}>
            {auxNOClosed ? "Closed" : "Open"}
          </text>

          <text x="395" y="150" fontSize="13" fontWeight="700" fill="#64748b">
            NC 21-22
          </text>
          <line x1="395" y1="180" x2="465" y2="180" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <line x1="550" y1="180" x2="620" y2="180" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <circle cx="465" cy="180" r="9" fill="#f59e0b" />
          <circle cx="550" cy="180" r="9" fill="#f59e0b" />
          <line
            x1="475"
            y1={auxNCClosed ? 180 : 150}
            x2="540"
            y2="180"
            stroke={auxNCClosed ? "#22c55e" : "#ef4444"}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transition: "all 300ms ease" }}
          />
          <text x="635" y="185" fontSize="13" fontWeight="700" fill={ncOpen ? "#ef4444" : "#22c55e"}>
            {auxNCClosed ? "Closed" : "Open"}
          </text>
        </svg>
      </div>
    </div>
  );
}
