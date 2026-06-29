"use client";

import { motion } from "framer-motion";

import { clamp } from "./logic";
import type { SelectedTerminal, TransistorType } from "./types";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 420,
  height: 620,
};

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* =========================================================
   BASE STYLES
========================================================= */

const BASE_COMPONENT = {
  stroke: "#0f172a",
  strokeWidth: BASE_WIRE_WIDTH * SCALE.wire,
  fill: "#ffffff",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  panelBg: "bg-white",
  panelBorder: "border-slate-200",
  softBg: "bg-slate-50",
  title: "text-slate-900",
  body: "text-slate-700",
  muted: "text-slate-500",
  activeType: "bg-slate-900 text-white",
  inactiveType: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  signal: "#7A0000",
};

const NODE: Record<SelectedTerminal, string> = {
  Emitter: "#dc2626",
  Base: "#2563eb",
  Collector: "#16a34a",
};

const WIRE = {
  width: BASE_COMPONENT.strokeWidth,
  signal: COMPONENT.signal,
};

const PATH = {
  signalTrack: "M0 0 H100",
};

const LABEL = {
  section: "text-xs font-black uppercase tracking-[0.2em]",
  heading: "text-lg font-black",
  cardTitle: "text-lg font-black",
  body: "text-sm leading-relaxed",
};

/* =========================================================
   TYPES
========================================================= */

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

type TerminalMeta = {
  key: "E" | "B" | "C";
  title: SelectedTerminal;
  color: string;
  bg: string;
  border: string;
  text: string;
  role: string;
};

/* =========================================================
   DATA
========================================================= */

const TERMINALS: TerminalMeta[] = [
  {
    key: "E",
    title: "Emitter",
    color: NODE.Emitter,
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-600",
    role: "Charge carrier source",
  },
  {
    key: "B",
    title: "Base",
    color: NODE.Base,
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    role: "Small control input",
  },
  {
    key: "C",
    title: "Collector",
    color: NODE.Collector,
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-600",
    role: "Output/load terminal",
  },
];

const TYPE_OPTIONS: TransistorType[] = ["NPN", "PNP"];

/* =========================================================
   HELPERS
========================================================= */

function getTerminalMeta(terminal: SelectedTerminal) {
  return TERMINALS.find((item) => item.title === terminal) ?? TERMINALS[0];
}

function getCurrentDirection(type: TransistorType) {
  return type === "NPN" ? "C → E, B → E" : "E → C, E → B";
}

/* =========================================================
   REUSABLE BLOCKS
========================================================= */

function TypeButton({
  value,
  active,
  onClick,
}: {
  value: TransistorType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
        active ? COMPONENT.activeType : COMPONENT.inactiveType
      }`}
    >
      {value}
    </button>
  );
}

function SignalBar({ signal, color }: { signal: number; color: string }) {
  const signalLevel = clamp(signal / 100, 0, 1);

  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
      <motion.div
        className="h-3 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ width: `${signalLevel * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

function SelectedTerminalInfo({
  terminalTitle,
  terminalRole,
  terminalKey,
  color,
}: {
  terminalTitle: string;
  terminalRole: string;
  terminalKey: string;
  color: string;
}) {
  return (
    <div className="mt-6 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className={`${LABEL.section} text-slate-500`}>Selected Terminal</p>

      <h3 className="mt-2 text-2xl font-black" style={{ color }}>
        {terminalTitle}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {terminalRole}
      </p>

      <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-slate-800 shadow-sm">
        {terminalKey}
      </p>
    </div>
  );
}

function TerminalButton({
  item,
  active,
  onClick,
}: {
  item: TerminalMeta;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left shadow-sm transition ${
        active
          ? `${item.border} ${item.bg} ring-2 ring-offset-1`
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
      style={{
        borderColor: active ? item.color : undefined,
        ["--tw-ring-color" as string]: active ? item.color : undefined,
      }}
    >
      <p className={`${LABEL.section} ${item.text}`}>{item.key}</p>
      <p className="mt-2 text-base font-black text-slate-900">{item.title}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{item.role}</p>
    </button>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

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
  const selectedMeta = getTerminalMeta(selected);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`${LABEL.section} text-slate-500`}>Control Panel</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            Terminal Trainer
          </h2>
        </div>

        <div
          className="rounded-full px-3 py-1 text-xs font-black text-white shadow-sm"
          style={{ backgroundColor: selectedMeta.color }}
        >
          {type}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {TYPE_OPTIONS.map((item) => (
          <TypeButton
            key={item}
            value={item}
            active={type === item}
            onClick={() => setType(item)}
          />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-black text-slate-800">
            Conventional Current Flow
          </label>
          <span
            className="rounded-full px-3 py-1 text-xs font-black text-white"
            style={{ backgroundColor: selectedMeta.color }}
          >
            {signal}%
          </span>
        </div>

        <p className="mt-2 text-xs font-bold text-slate-500">
          Direction: {getCurrentDirection(type)}
        </p>

        <input
          type="range"
          min="0"
          max="100"
          value={signal}
          onChange={(event) => setSignal(Number(event.target.value))}
          className="mt-4 w-full"
          style={{ accentColor: selectedMeta.color }}
        />

        <SignalBar signal={signal} color={selectedMeta.color} />
      </div>

      <SelectedTerminalInfo
        terminalTitle={terminalTitle}
        terminalRole={terminalRole}
        terminalKey={terminalKey}
        color={selectedMeta.color}
      />

      <div className="mt-6 grid grid-cols-3 gap-3">
        {TERMINALS.map((item) => (
          <TerminalButton
            key={item.title}
            item={item}
            active={selected === item.title}
            onClick={() => setSelected(item.title)}
          />
        ))}
      </div>
    </div>
  );
}
