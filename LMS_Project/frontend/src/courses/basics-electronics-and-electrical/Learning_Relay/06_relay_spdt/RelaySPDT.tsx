"use client";

import React, { useEffect, useMemo, useState } from "react";

type Point = { x: number; y: number };
type LineSegment = { from: Point; to: Point };
type ControlMode = "onOff" | "timeline";

type SimulationState =
  | "Idle"
  | "ButtonPressed"
  | "CoilEnergized"
  | "MagneticFieldGenerated"
  | "ContactSwitching"
  | "NOLampOn"
  | "Resetting";

type FaultKey =
  | "openCoil"
  | "shortedCoil"
  | "burnedNCLamp"
  | "burnedNOLamp"
  | "stuckContact"
  | "noAcSupply"
  | "noDcSupply"
  | "brokenButton";

type ComponentKey =
  | "button"
  | "coil"
  | "field"
  | "contact"
  | "ncLamp"
  | "noLamp"
  | "ac"
  | "dc";

const VIEW_BOX = { x: 0, y: 0, width: 1456, height: 928 };

const STEPS: SimulationState[] = [
  "Idle",
  "ButtonPressed",
  "CoilEnergized",
  "MagneticFieldGenerated",
  "ContactSwitching",
  "NOLampOn",
  "Resetting",
];
const LAST_STEP_INDEX = STEPS.length - 1;

const PATH = {
  ncCircuit: [
    { from: { x: 160, y: 460 }, to: { x: 160, y: 220 } },
    { from: { x: 160, y: 220 }, to: { x: 400, y: 220 } },
    { from: { x: 480, y: 220 }, to: { x: 768, y: 220 } },
    { from: { x: 768, y: 220 }, to: { x: 768, y: 468 } },
    { from: { x: 770, y: 618 }, to: { x: 770, y: 778 } },
    { from: { x: 770, y: 778 }, to: { x: 160, y: 778 } },
    { from: { x: 160, y: 778 }, to: { x: 160, y: 560 } },
  ] satisfies LineSegment[],

  noCircuit: [
    { from: { x: 160, y: 460 }, to: { x: 160, y: 405 } },
    { from: { x: 160, y: 405 }, to: { x: 400, y: 405 } },
    { from: { x: 480, y: 405 }, to: { x: 720, y: 405 } },
    { from: { x: 720, y: 405 }, to: { x: 720, y: 468 } },
    { from: { x: 770, y: 618 }, to: { x: 770, y: 778 } },
    { from: { x: 770, y: 778 }, to: { x: 160, y: 778 } },
    { from: { x: 160, y: 778 }, to: { x: 160, y: 560 } },
  ] satisfies LineSegment[],

  dcCircuit: [
    { from: { x: 920, y: 220 }, to: { x: 988, y: 220 } },
    { from: { x: 1086, y: 220 }, to: { x: 1207, y: 220 } },
    { from: { x: 1207, y: 220 }, to: { x: 1207, y: 458 } },
    { from: { x: 1208, y: 562 }, to: { x: 1208, y: 780 } },
    { from: { x: 1208, y: 780 }, to: { x: 920, y: 780 } },
    { from: { x: 920, y: 780 }, to: { x: 920, y: 613 } },
    { from: { x: 920, y: 438 }, to: { x: 920, y: 220 } },
  ] satisfies LineSegment[],
};

const INFO: Record<ComponentKey, { name: string; purpose: string }> = {
  button: { name: "Button", purpose: "Completes the DC relay coil circuit." },
  coil: {
    name: "Relay Coil",
    purpose: "Creates magnetic force when energized.",
  },
  field: {
    name: "Electromagnetic Field",
    purpose: "Moves the SPDT contact from NC to NO.",
  },
  contact: {
    name: "SPDT Contact",
    purpose: "Common terminal switches between NC and NO.",
  },
  ncLamp: { name: "NC Lamp", purpose: "ON when relay coil is OFF." },
  noLamp: { name: "NO Lamp", purpose: "ON when relay coil is energized." },
  ac: { name: "AC Source", purpose: "Supplies the lamp circuit." },
  dc: { name: "DC Source", purpose: "Supplies the relay coil circuit." },
};

const STEP_TEXT: Record<SimulationState, string> = {
  Idle: "Relay is idle. COM touches NC. Upper lamp is ON.",
  ButtonPressed: "Button is pressed. DC path is ready.",
  CoilEnergized: "Current flows through relay coil.",
  MagneticFieldGenerated: "Coil creates electromagnetic field.",
  ContactSwitching: "COM moves from NC to NO.",
  NOLampOn: "Lower NO lamp turns ON. Upper NC lamp turns OFF.",
  Resetting: "Relay returns back to NC position.",
};

function stepIndex(state: SimulationState) {
  return STEPS.indexOf(state);
}

function hasReached(state: SimulationState, target: SimulationState) {
  return stepIndex(state) >= stepIndex(target) && state !== "Resetting";
}

function TextLabel({
  x,
  y,
  children,
  size = 30,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily="Arial, sans-serif"
      fontSize={size}
      fill="#111"
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

function Wire({
  segment,
  active,
  color,
}: {
  segment: LineSegment;
  active: boolean;
  color: string;
}) {
  return (
    <>
      <line
        x1={segment.from.x}
        y1={segment.from.y}
        x2={segment.to.x}
        y2={segment.to.y}
        stroke="#111"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {active && (
        <line
          x1={segment.from.x}
          y1={segment.from.y}
          x2={segment.to.x}
          y2={segment.to.y}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.55}
          strokeDasharray="20 18"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-80"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </line>
      )}
    </>
  );
}

function Node({ x, y, r = 8 }: Point & { r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="#111" />;
}

function OpenTerminal({ x, y, r = 11 }: Point & { r?: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill="white" stroke="#111" strokeWidth={4} />
  );
}

function ACSource({ onClick }: { onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <circle
        cx={160}
        cy={510}
        r={50}
        fill="white"
        stroke="#111"
        strokeWidth={4}
      />
      <path
        d="M 130 510 C 145 485, 165 485, 180 510 C 193 535, 207 535, 220 510"
        fill="none"
        stroke="#111"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <TextLabel x={90} y={500} anchor="end">
        AC
      </TextLabel>
      <TextLabel x={90} y={540} anchor="end">
        Source
      </TextLabel>
    </g>
  );
}

function DCSupply({ onClick }: { onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <circle
        cx={1208}
        cy={510}
        r={52}
        fill="white"
        stroke="#111"
        strokeWidth={4}
      />
      <TextLabel x={1208} y={490} anchor="middle" size={42}>
        +
      </TextLabel>
      <TextLabel x={1208} y={538} anchor="middle" size={42}>
        −
      </TextLabel>
      <Node x={1208} y={458} r={7} />
      <Node x={1208} y={562} r={7} />
      <TextLabel x={1275} y={495}>
        DC
      </TextLabel>
      <TextLabel x={1275} y={535}>
        Source
      </TextLabel>
    </g>
  );
}

function Lamp({
  x,
  y,
  label,
  on,
  burned,
  onClick,
}: {
  x: number;
  y: number;
  label: string;
  on: boolean;
  burned: boolean;
  onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <TextLabel x={x} y={y - 70} anchor="middle">
        {label}
      </TextLabel>

      {on && !burned && (
        <circle cx={x} cy={y} r={64} fill="#fde68a" opacity={0.55}>
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      <circle
        cx={x}
        cy={y}
        r={40}
        fill={on && !burned ? "#fde047" : burned ? "#e5e7eb" : "white"}
        stroke="#111"
        strokeWidth={4}
      />
      <path
        d={`M ${x - 27} ${y - 27} L ${x + 27} ${y + 27}`}
        stroke="#111"
        strokeWidth={4}
      />
      <path
        d={`M ${x + 27} ${y - 27} L ${x - 27} ${y + 27}`}
        stroke="#111"
        strokeWidth={4}
      />

      {burned && (
        <path
          d={`M ${x - 40} ${y} L ${x + 40} ${y}`}
          stroke="#ef4444"
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function PushButton({
  pressed,
  broken,
  onClick,
}: {
  pressed: boolean;
  broken: boolean;
  onClick: () => void;
}) {
  const plateY = pressed && !broken ? 220 : 188;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <OpenTerminal x={985} y={220} r={10} />
      <OpenTerminal x={1088} y={220} r={10} />

      <line
        x1={993}
        y1={plateY}
        x2={1080}
        y2={pressed && !broken ? 220 : plateY}
        stroke={pressed && !broken ? "#2563eb" : "#111"}
        strokeWidth={5}
        strokeLinecap="round"
      />

      <line
        x1={1036}
        y1={plateY}
        x2={1036}
        y2={plateY - 26}
        stroke="#111"
        strokeWidth={5}
        strokeLinecap="round"
      />

      <TextLabel x={1036} y={145} anchor="middle">
        Button
      </TextLabel>
      {broken && (
        <TextLabel x={1036} y={285} size={24} anchor="middle">
          Broken
        </TextLabel>
      )}
    </g>
  );
}

function MagneticField({
  visible,
  strength,
  onClick,
}: {
  visible: boolean;
  strength: number;
  onClick: () => void;
}) {
  if (!visible) return null;

  const opacity = Math.min(0.75, 0.15 + strength * 0.7);
  const scale = 0.75 + strength * 0.65;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <g transform={`translate(920 525) scale(${scale}) translate(-920 -525)`}>
        {[80, 120, 160].map((rx, i) => (
          <ellipse
            key={rx}
            cx={920}
            cy={525}
            rx={rx}
            ry={rx + 95}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={4 - i}
            strokeDasharray="16 18"
            opacity={opacity - i * 0.12}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={i % 2 === 0 ? "-90" : "90"}
              dur={`${1.1 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
      </g>
    </g>
  );
}

function RelayCoil({
  energized,
  strength,
  onClick,
}: {
  energized: boolean;
  strength: number;
  onClick: () => void;
}) {
  const coil = { x: 920, y: 438, width: 46, height: 175, turns: 5 };
  const turnHeight = coil.height / coil.turns;

  const d = Array.from({ length: coil.turns })
    .map((_, index) => {
      const y = coil.y + index * turnHeight;
      return `C ${coil.x - coil.width} ${y + turnHeight * 0.2}, ${
        coil.x - coil.width
      } ${y + turnHeight * 0.8}, ${coil.x} ${y + turnHeight}`;
    })
    .join(" ");

  return (
    <g onClick={onClick} className="cursor-pointer">
      {energized && (
        <rect
          x={866}
          y={420}
          width={80}
          height={215}
          rx={30}
          fill="#dbeafe"
          opacity={0.25 + strength * 0.35}
        >
          <animate
            attributeName="opacity"
            values="0.2;0.6;0.2"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      <path
        d={`M ${coil.x} ${coil.y} ${d}`}
        fill="none"
        stroke={energized ? "#2563eb" : "#111"}
        strokeWidth={energized ? 6 + strength * 3 : 5}
        strokeLinecap="round"
      />

      <TextLabel x={980} y={540}>
        Relay coil
      </TextLabel>
    </g>
  );
}

function RelayContactSPDT({
  noSelected,
  bouncing,
  stuck,
  onClick,
}: {
  noSelected: boolean;
  bouncing: boolean;
  stuck: boolean;
  onClick: () => void;
}) {
  const finalNO = stuck ? false : noSelected;

  const nc = { x: 768, y: 468 };
  const no = { x: 720, y: 468 };
  const common = { x: 770, y: 618 };
  const end = finalNO ? no : nc;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <OpenTerminal x={nc.x} y={nc.y} />
      <OpenTerminal x={no.x} y={no.y} />
      <OpenTerminal x={common.x} y={common.y} />

      <Node x={common.x} y={common.y} r={9} />

      <line
        x1={common.x}
        y1={common.y}
        x2={end.x}
        y2={end.y}
        stroke="#111"
        strokeWidth={5}
        strokeLinecap="round"
      >
        {bouncing && (
          <>
            <animate
              attributeName="x2"
              values="768;720;748;720;735;720"
              dur="0.45s"
              repeatCount="1"
            />
            <animate
              attributeName="y2"
              values="468;468;468;468;468;468"
              dur="0.45s"
              repeatCount="1"
            />
          </>
        )}
      </line>

      <TextLabel x={805} y={468} size={22}>
        NC
      </TextLabel>
      <TextLabel x={640} y={468} size={22}>
        NO
      </TextLabel>
      <TextLabel x={800} y={620} size={22}>
        COM
      </TextLabel>

      {stuck && (
        <TextLabel x={640} y={575} size={24}>
          Stuck at NC
        </TextLabel>
      )}
    </g>
  );
}

function TimelinePanel({
  state,
  onStep,
  disabled,
}: {
  state: SimulationState;
  onStep: (state: SimulationState) => void;
  disabled: boolean;
}) {
  const items: { state: SimulationState; title: string }[] = [
    { state: "ButtonPressed", title: "Button" },
    { state: "CoilEnergized", title: "Current" },
    { state: "MagneticFieldGenerated", title: "Field" },
    { state: "ContactSwitching", title: "NC → NO" },
    { state: "NOLampOn", title: "NO Lamp ON" },
  ];

  return (
    <div
      className={`rounded-xl border bg-white p-4 ${disabled ? "opacity-50" : ""}`}
    >
      <h3 className="mb-3 font-bold text-slate-800">Interactive Timeline</h3>

      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const active = hasReached(state, item.state);

          return (
            <React.Fragment key={item.state}>
              <button
                disabled={disabled}
                onClick={() => onStep(item.state)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed ${
                  active
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.title}
              </button>
              {index < items.length - 1 && (
                <span className="text-slate-400">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ControlPanel({
  state,
  setState,
  playing,
  setPlaying,
  controlMode,
  setControlMode,
  manualOn,
  setManualOn,
  voltage,
  setVoltage,
  resistance,
  setResistance,
  pickupDelay,
  setPickupDelay,
  releaseDelay,
  setReleaseDelay,
  bounceTime,
  setBounceTime,
  faults,
  setFaults,
  pickupVoltage,
  setPickupVoltage,
  dropoutVoltage,
  setDropoutVoltage,
}: {
  state: SimulationState;
  setState: (s: SimulationState) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  controlMode: ControlMode;
  setControlMode: (v: ControlMode) => void;
  manualOn: boolean;
  setManualOn: (v: boolean) => void;
  voltage: number;
  setVoltage: (v: number) => void;
  resistance: number;
  setResistance: (v: number) => void;
  pickupDelay: number;
  setPickupDelay: (v: number) => void;
  releaseDelay: number;
  setReleaseDelay: (v: number) => void;
  bounceTime: number;
  setBounceTime: (v: number) => void;
  faults: Record<FaultKey, boolean>;
  setFaults: React.Dispatch<React.SetStateAction<Record<FaultKey, boolean>>>;
  pickupVoltage: number;
  setPickupVoltage: (v: number) => void;
  dropoutVoltage: number;
  setDropoutVoltage: (v: number) => void;
}) {
  const next = () =>
    setState(STEPS[Math.min(stepIndex(state) + 1, STEPS.length - 1)]);
  const prev = () => setState(STEPS[Math.max(stepIndex(state) - 1, 0)]);

  const faultLabels: Record<FaultKey, string> = {
    openCoil: "Open Coil",
    shortedCoil: "Shorted Coil",
    burnedNCLamp: "Burned NC Lamp",
    burnedNOLamp: "Burned NO Lamp",
    stuckContact: "Stuck at NC",
    noAcSupply: "No AC Supply",
    noDcSupply: "No DC Supply",
    brokenButton: "Broken Button",
  };

  const selectMode = (mode: ControlMode) => {
    setControlMode(mode);
    setPlaying(false);
    setManualOn(false);
    setState("Idle");
  };

  const startOnOff = () => {
    setControlMode("onOff");
    setManualOn(true);
    setPlaying(false);
    setState("NOLampOn");
  };

  const stopOnOff = () => {
    setControlMode("onOff");
    setPlaying(false);
    setManualOn(false);
    setState("Idle");
  };

  const startTimeline = () => {
    setControlMode("timeline");
    setManualOn(false);
    setState("ButtonPressed");
    setPlaying(true);
  };

  const stopTimeline = () => {
    setControlMode("timeline");
    setPlaying(false);
    setManualOn(false);
    setState("Resetting");
  };

  const resetAll = () => {
    setPlaying(false);
    setManualOn(false);
    setState("Idle");
  };

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
          Control Panel
        </p>
        <h3 className="mt-1 text-xl font-black">SPDT Relay</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-white/10 px-3 py-1">
            {controlMode === "onOff" ? "ON/OFF Mode" : "Timeline Mode"}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {playing ? "Playing" : "Stopped"}
          </span>
          <span className="rounded-full bg-emerald-400 px-3 py-1 text-slate-950">
            {state}
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
          Mode Select
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectMode("onOff")}
            className={`rounded-xl px-3 py-3 text-sm font-black transition ${
              controlMode === "onOff"
                ? "bg-purple-700 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-white"
            }`}
          >
            ON/OFF Mode
          </button>

          <button
            type="button"
            onClick={() => selectMode("timeline")}
            className={`rounded-xl px-3 py-3 text-sm font-black transition ${
              controlMode === "timeline"
                ? "bg-blue-700 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-white"
            }`}
          >
            Timeline Mode
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-purple-100 bg-purple-50 p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="text-sm font-black text-purple-950">ON/OFF Mode</h4>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-black uppercase text-purple-700">
            Manual
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={startOnOff}
            className="rounded-xl bg-green-600 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stopOnOff}
            className="rounded-xl bg-red-600 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
          >
            Stop
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="text-sm font-black text-blue-950">Timeline Mode</h4>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-black uppercase text-blue-700">
            Step
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={startTimeline}
            className="rounded-xl bg-green-600 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stopTimeline}
            className="rounded-xl bg-red-600 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={prev}
            className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            Previous Step
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            Next Step
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="col-span-2 rounded-xl bg-slate-500 px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-600"
          >
            Reset
          </button>
        </div>
      </section>

      <div className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
        {controlMode === "onOff"
          ? `ON/OFF Mode: Start energizes the coil and switches COM from NC to NO. Status: ${
              manualOn ? "COM → NO" : "COM → NC"
            }.`
          : "Timeline Mode: Start shows step-by-step how COM moves from NC to NO."}
      </div>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <h4 className="text-sm font-black text-slate-800">Relay Settings</h4>
        <label className="block text-sm font-semibold text-slate-700">
        DC Voltage: {voltage}V
        <input
          className="w-full"
          type="range"
          min={0}
          max={24}
          value={voltage}
          onChange={(e) => setVoltage(Number(e.target.value))}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Coil Resistance: {resistance}Ω
        <input
          className="w-full"
          type="range"
          min={10}
          max={500}
          value={resistance}
          onChange={(e) => setResistance(Number(e.target.value))}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Pickup Voltage: {pickupVoltage}V
        <input
          className="w-full"
          type="range"
          min={1}
          max={24}
          value={pickupVoltage}
          onChange={(e) => setPickupVoltage(Number(e.target.value))}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Dropout Voltage: {dropoutVoltage}V
        <input
          className="w-full"
          type="range"
          min={0}
          max={24}
          value={dropoutVoltage}
          onChange={(e) => setDropoutVoltage(Number(e.target.value))}
        />
      </label>

      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <h4 className="text-sm font-black text-slate-800">Timing</h4>
        <label className="block text-sm font-semibold text-slate-700">
        Pickup Delay: {pickupDelay}ms
        <input
          className="w-full"
          type="range"
          min={0}
          max={1000}
          value={pickupDelay}
          onChange={(e) => setPickupDelay(Number(e.target.value))}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Release Delay: {releaseDelay}ms
        <input
          className="w-full"
          type="range"
          min={0}
          max={1000}
          value={releaseDelay}
          onChange={(e) => setReleaseDelay(Number(e.target.value))}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Contact Bounce Time: {bounceTime}ms
        <input
          className="w-full"
          type="range"
          min={0}
          max={700}
          value={bounceTime}
          onChange={(e) => setBounceTime(Number(e.target.value))}
        />
      </label>

      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
        <h4 className="mb-2 text-sm font-black text-amber-950">
          Fault Simulation
        </h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {(Object.keys(faultLabels) as FaultKey[]).map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-amber-100"
            >
              <input
                type="checkbox"
                checked={faults[key]}
                onChange={() =>
                  setFaults((old) => ({ ...old, [key]: !old[key] }))
                }
              />
              {faultLabels[key]}
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}

function MeasurementPanel({
  voltage,
  current,
  power,
  contactPosition,
  temperature,
}: {
  voltage: number;
  current: number;
  power: number;
  contactPosition: "NC" | "NO";
  temperature: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-800">Measurement Panel</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-100 p-3">
          Voltmeter: <b>{voltage.toFixed(1)} V</b>
        </div>
        <div className="rounded-lg bg-slate-100 p-3">
          Ammeter: <b>{current.toFixed(3)} A</b>
        </div>
        <div className="rounded-lg bg-slate-100 p-3">
          Power: <b>{power.toFixed(2)} W</b>
        </div>
        <div className="rounded-lg bg-slate-100 p-3">
          COM Contact: <b>{contactPosition}</b>
        </div>
        <div className="col-span-2 rounded-lg bg-slate-100 p-3">
          Coil Temp: <b>{temperature.toFixed(1)} °C</b>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  selected,
  state,
  voltage,
  current,
  controlMode,
}: {
  selected: ComponentKey;
  state: SimulationState;
  voltage: number;
  current: number;
  controlMode: ControlMode;
}) {
  const info = INFO[selected];

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-bold text-slate-800">{info.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{info.purpose}</p>
      <div className="mt-3 space-y-1 text-sm text-slate-700">
        <p>
          <b>Mode:</b>{" "}
          {controlMode === "onOff" ? "ON/OFF Mode" : "Timeline Mode"}
        </p>
        <p>
          <b>Current State:</b> {state}
        </p>
        <p>
          <b>Voltage:</b> {voltage.toFixed(1)} V
        </p>
        <p>
          <b>Current:</b> {current.toFixed(3)} A
        </p>
        <p>
          <b>Description:</b> {STEP_TEXT[state]}
        </p>
      </div>
    </div>
  );
}

function TruthTable({
  dc,
  button,
  coil,
  ncLamp,
  noLamp,
}: {
  dc: boolean;
  button: boolean;
  coil: boolean;
  ncLamp: boolean;
  noLamp: boolean;
}) {
  const rows = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 1],
  ];

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-800">SPDT Truth Table</h3>
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">DC</th>
            <th>Button</th>
            <th>Coil</th>
            <th>NC Lamp</th>
            <th>NO Lamp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const active =
              r[0] === Number(dc) &&
              r[1] === Number(button) &&
              r[2] === Number(coil) &&
              r[3] === Number(ncLamp) &&
              r[4] === Number(noLamp);

            return (
              <tr
                key={i}
                className={active ? "bg-amber-200 font-bold" : "border-t"}
              >
                {r.map((v, j) => (
                  <td key={j} className="p-2">
                    {v}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CircuitSvg({
  dcCurrentActive,
  ncCurrentActive,
  noCurrentActive,
  fieldVisible,
  fieldStrength,
  buttonPressed,
  noSelected,
  bouncing,
  ncLampOn,
  noLampOn,
  faults,
  onSelect,
}: {
  dcCurrentActive: boolean;
  ncCurrentActive: boolean;
  noCurrentActive: boolean;
  fieldVisible: boolean;
  fieldStrength: number;
  buttonPressed: boolean;
  noSelected: boolean;
  bouncing: boolean;
  ncLampOn: boolean;
  noLampOn: boolean;
  faults: Record<FaultKey, boolean>;
  onSelect: (key: ComponentKey) => void;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Interactive SPDT relay simulator"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PATH.ncCircuit.map((segment, index) => (
          <Wire
            key={`nc-${index}`}
            segment={segment}
            active={ncCurrentActive}
            color="#f59e0b"
          />
        ))}

        {PATH.noCircuit.map((segment, index) => (
          <Wire
            key={`no-${index}`}
            segment={segment}
            active={noCurrentActive}
            color="#22c55e"
          />
        ))}

        {PATH.dcCircuit.map((segment, index) => (
          <Wire
            key={`dc-${index}`}
            segment={segment}
            active={dcCurrentActive}
            color="#2563eb"
          />
        ))}

        <ACSource onClick={() => onSelect("ac")} />

        <Lamp
          x={440}
          y={220}
          label="Lamp"
          on={ncLampOn}
          burned={faults.burnedNCLamp}
          onClick={() => onSelect("ncLamp")}
        />

        <Lamp
          x={440}
          y={405}
          label="Lamp"
          on={noLampOn}
          burned={faults.burnedNOLamp}
          onClick={() => onSelect("noLamp")}
        />

        <MagneticField
          visible={fieldVisible}
          strength={fieldStrength}
          onClick={() => onSelect("field")}
        />

        <RelayContactSPDT
          noSelected={noSelected}
          bouncing={bouncing}
          stuck={faults.stuckContact}
          onClick={() => onSelect("contact")}
        />

        <RelayCoil
          energized={dcCurrentActive}
          strength={fieldStrength}
          onClick={() => onSelect("coil")}
        />

        <PushButton
          pressed={buttonPressed}
          broken={faults.brokenButton}
          onClick={() => onSelect("button")}
        />

        <DCSupply onClick={() => onSelect("dc")} />

        {faults.openCoil && (
          <TextLabel x={760} y={370} size={26}>
            Fault: Open Coil
          </TextLabel>
        )}
        {faults.shortedCoil && (
          <TextLabel x={760} y={400} size={26}>
            Fault: Shorted Coil
          </TextLabel>
        )}
      </svg>
    </div>
  );
}

export default function RelaySPDT() {
  const [controlMode, setControlMode] = useState<ControlMode>("timeline");
  const [manualOn, setManualOn] = useState(false);
  const [state, setState] = useState<SimulationState>("Idle");
  const [playing, setPlaying] = useState(false);

  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(120);
  const [pickupVoltage, setPickupVoltage] = useState(5);
  const [dropoutVoltage, setDropoutVoltage] = useState(3);
  const [pickupDelay, setPickupDelay] = useState(150);
  const [releaseDelay, setReleaseDelay] = useState(80);
  const [bounceTime, setBounceTime] = useState(250);

  const [selected, setSelected] = useState<ComponentKey>("contact");
  const [bouncing, setBouncing] = useState(false);

  const [faults, setFaults] = useState<Record<FaultKey, boolean>>({
    openCoil: false,
    shortedCoil: false,
    burnedNCLamp: false,
    burnedNOLamp: false,
    stuckContact: false,
    noAcSupply: false,
    noDcSupply: false,
    brokenButton: false,
  });

  const effectiveResistance = faults.shortedCoil ? 5 : resistance;
  const coilCurrent =
    faults.openCoil || faults.noDcSupply ? 0 : voltage / effectiveResistance;
  const coilPower = voltage * coilCurrent;

  const buttonPressed =
    controlMode === "onOff"
      ? manualOn
      : hasReached(state, "ButtonPressed") && state !== "Resetting";

  const dcAvailable = !faults.noDcSupply;
  const acAvailable = !faults.noAcSupply;
  const voltageCanPickup = voltage >= pickupVoltage;

  const dcCurrentActive =
    dcAvailable &&
    buttonPressed &&
    !faults.brokenButton &&
    !faults.openCoil &&
    voltageCanPickup;

  const coilEnergized =
    controlMode === "onOff"
      ? dcCurrentActive
      : dcCurrentActive && hasReached(state, "CoilEnergized");

  const fieldVisible =
    controlMode === "onOff"
      ? coilEnergized
      : coilEnergized && hasReached(state, "MagneticFieldGenerated");

  const contactSwitchedToNO =
    controlMode === "onOff"
      ? fieldVisible
      : fieldVisible && hasReached(state, "ContactSwitching");

  const noSelected = faults.stuckContact ? false : contactSwitchedToNO;
  const ncSelected = !noSelected;

  const ncLampOn = acAvailable && ncSelected && !faults.burnedNCLamp;
  const noLampOn = acAvailable && noSelected && !faults.burnedNOLamp;

  const fieldStrength = useMemo(
    () => Math.min(1, coilCurrent / 0.15),
    [coilCurrent],
  );
  const temperature = useMemo(() => 25 + coilPower * 4, [coilPower]);

  const failureReason = useMemo(() => {
    if (faults.noAcSupply)
      return "No AC supply: neither lamp can receive power.";
    if (faults.stuckContact && coilEnergized)
      return "Stuck contact: COM stays at NC, so NO lamp cannot turn ON.";
    if (faults.noDcSupply)
      return "No DC supply: coil cannot energize, so COM stays at NC.";
    if (faults.brokenButton)
      return "Broken button: coil cannot energize, so COM stays at NC.";
    if (faults.openCoil)
      return "Open coil: no coil current, so COM stays at NC.";
    if (faults.shortedCoil)
      return "Shorted coil: excessive current may overheat relay.";
    if (buttonPressed && voltage < pickupVoltage)
      return "Voltage is below pickup voltage, so COM does not switch to NO.";
    if (faults.burnedNCLamp && ncSelected) return "NC lamp is burned.";
    if (faults.burnedNOLamp && noSelected) return "NO lamp is burned.";
    return "No active failure.";
  }, [
    faults,
    coilEnergized,
    buttonPressed,
    voltage,
    pickupVoltage,
    ncSelected,
    noSelected,
  ]);

  useEffect(() => {
    if (!playing || controlMode !== "timeline") return;

    const timer = window.setInterval(() => {
      setState((old) => {
        const nextIndex = stepIndex(old) + 1;

        if (nextIndex >= STEPS.length) {
          setPlaying(false);
          return "NOLampOn";
        }

        return STEPS[nextIndex];
      });
    }, 900 + pickupDelay);

    return () => window.clearInterval(timer);
  }, [playing, pickupDelay, controlMode]);

  useEffect(() => {
    if (state === "ContactSwitching" && bounceTime > 0) {
      setBouncing(true);
      const timer = window.setTimeout(() => setBouncing(false), bounceTime);
      return () => window.clearTimeout(timer);
    }
  }, [state, bounceTime]);

  useEffect(() => {
    if (state === "Resetting") {
      const timer = window.setTimeout(() => setState("Idle"), releaseDelay);
      return () => window.clearTimeout(timer);
    }
  }, [state, releaseDelay]);

  const timeCursor = LAST_STEP_INDEX > 0 ? stepIndex(state) / LAST_STEP_INDEX : 0;
  const previewTimelineAt = (nextCursor: number) => {
    const nextIndex = Math.min(
      LAST_STEP_INDEX,
      Math.max(0, Math.round(nextCursor * LAST_STEP_INDEX)),
    );

    setControlMode("timeline");
    setPlaying(false);
    setManualOn(false);
    setState(STEPS[nextIndex]);
  };

  return (
    <div className="w-full space-y-4 bg-white p-4">
      <div className="rounded-xl border bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white">
        <h1 className="text-2xl font-bold">Relay SPDT Simulator</h1>
        <p className="text-sm text-slate-200">
          Coil OFF: COM → NC, upper lamp ON. Coil ON: COM → NO, lower lamp ON.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <ControlPanel
            state={state}
            setState={setState}
            playing={playing}
            setPlaying={setPlaying}
            controlMode={controlMode}
            setControlMode={setControlMode}
            manualOn={manualOn}
            setManualOn={setManualOn}
            voltage={voltage}
            setVoltage={setVoltage}
            resistance={resistance}
            setResistance={setResistance}
            pickupDelay={pickupDelay}
            setPickupDelay={setPickupDelay}
            releaseDelay={releaseDelay}
            setReleaseDelay={setReleaseDelay}
            bounceTime={bounceTime}
            setBounceTime={setBounceTime}
            faults={faults}
            setFaults={setFaults}
            pickupVoltage={pickupVoltage}
            setPickupVoltage={setPickupVoltage}
            dropoutVoltage={dropoutVoltage}
            setDropoutVoltage={setDropoutVoltage}
          />

          <MeasurementPanel
            voltage={dcAvailable ? voltage : 0}
            current={coilCurrent}
            power={coilPower}
            contactPosition={noSelected ? "NO" : "NC"}
            temperature={temperature}
          />

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            Diagnosis: {failureReason}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <TimelinePanel
            state={state}
            onStep={setState}
            disabled={controlMode === "onOff"}
          />

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              Timeline Preview
            </p>
            <h2 className="text-xl font-black text-slate-900">
              Time Cursor / Switching Preview
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
            {Math.round(timeCursor * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={timeCursor}
          onChange={(event) => previewTimelineAt(Number(event.target.value))}
          className="w-full accent-emerald-700"
          aria-label="Time Cursor / Switching Preview"
        />
      </section>

          <CircuitSvg
            dcCurrentActive={dcCurrentActive}
            ncCurrentActive={ncLampOn}
            noCurrentActive={noLampOn}
            fieldVisible={fieldVisible}
            fieldStrength={fieldStrength}
            buttonPressed={buttonPressed}
            noSelected={noSelected}
            bouncing={bouncing}
            ncLampOn={ncLampOn}
            noLampOn={noLampOn}
            faults={faults}
            onSelect={setSelected}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <InfoPanel
              selected={selected}
              state={state}
              voltage={voltage}
              current={coilCurrent}
              controlMode={controlMode}
            />

            <TruthTable
              dc={dcAvailable && voltage >= pickupVoltage}
              button={buttonPressed && !faults.brokenButton}
              coil={coilEnergized}
              ncLamp={ncLampOn}
              noLamp={noLampOn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
