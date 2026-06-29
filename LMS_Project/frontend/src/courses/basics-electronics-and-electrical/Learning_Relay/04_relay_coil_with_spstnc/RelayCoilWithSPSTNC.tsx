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
  | "ContactOpening"
  | "LampOff"
  | "Resetting";

type FaultKey =
  | "openCoil"
  | "shortedCoil"
  | "burnedLamp"
  | "stuckContact"
  | "noAcSupply"
  | "noDcSupply"
  | "brokenButton";

type ComponentKey =
  | "button"
  | "coil"
  | "field"
  | "contact"
  | "lamp"
  | "ac"
  | "dc";

const VIEW_BOX = { x: 0, y: 0, width: 1456, height: 928 };

const STEPS: SimulationState[] = [
  "Idle",
  "ButtonPressed",
  "CoilEnergized",
  "MagneticFieldGenerated",
  "ContactOpening",
  "LampOff",
  "Resetting",
];
const LAST_STEP_INDEX = STEPS.length - 1;

const PATH = {
  leftCircuit: [
    { from: { x: 160, y: 460 }, to: { x: 160, y: 250 } },
    { from: { x: 160, y: 250 }, to: { x: 380, y: 250 } },
    { from: { x: 544, y: 250 }, to: { x: 768, y: 250 } },
    { from: { x: 768, y: 250 }, to: { x: 768, y: 470 } },
    { from: { x: 770, y: 550 }, to: { x: 770, y: 778 } },
    { from: { x: 770, y: 778 }, to: { x: 160, y: 778 } },
    { from: { x: 160, y: 778 }, to: { x: 160, y: 560 } },
  ] satisfies LineSegment[],
  rightCircuit: [
    { from: { x: 886, y: 250 }, to: { x: 1038, y: 250 } },
    { from: { x: 1136, y: 250 }, to: { x: 1257, y: 250 } },
    { from: { x: 1257, y: 250 }, to: { x: 1257, y: 458 } },
    { from: { x: 1258, y: 562 }, to: { x: 1258, y: 780 } },
    { from: { x: 1258, y: 780 }, to: { x: 886, y: 780 } },
    { from: { x: 886, y: 780 }, to: { x: 886, y: 613 } },
    { from: { x: 886, y: 438 }, to: { x: 886, y: 250 } },
  ] satisfies LineSegment[],
};

const INFO: Record<ComponentKey, { name: string; purpose: string }> = {
  button: {
    name: "Push Button",
    purpose: "Completes the DC control circuit when pressed.",
  },
  coil: {
    name: "Relay Coil",
    purpose: "Creates magnetism when DC current flows through it.",
  },
  field: {
    name: "Electromagnetic Field",
    purpose: "Pulls the NC contact open.",
  },
  contact: {
    name: "SPST Normally Closed Contact",
    purpose: "Closed by default. Opens when the relay coil is energized.",
  },
  lamp: {
    name: "Lamp",
    purpose: "Turns ON when the NC contact is closed.",
  },
  ac: {
    name: "AC Source",
    purpose: "Supplies power to the lamp circuit.",
  },
  dc: {
    name: "DC Supply",
    purpose: "Supplies control voltage to the relay coil.",
  },
};

const STEP_TEXT: Record<SimulationState, string> = {
  Idle: "Relay is idle. NC contact is closed. Lamp is ON.",
  ButtonPressed: "Button is pressed. DC control path is ready.",
  CoilEnergized: "Current flows through the relay coil.",
  MagneticFieldGenerated: "The relay coil creates an electromagnetic field.",
  ContactOpening: "The electromagnetic force opens the NC contact.",
  LampOff: "AC circuit is broken. Lamp turns OFF.",
  Resetting: "Button released. Relay returns to normally closed state.",
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
      fontFamily="Comic Sans MS, Patrick Hand, Bradley Hand, cursive"
      fontSize={size}
      fill="#333"
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
        stroke="#444"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {active && (
        <line
          x1={segment.from.x}
          y1={segment.from.y}
          x2={segment.to.x}
          y2={segment.to.y}
          stroke={color}
          strokeWidth={6}
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
  return <circle cx={x} cy={y} r={r} fill="#202020" />;
}

function OpenTerminal({ x, y, r = 8 }: Point & { r?: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill="white" stroke="#444" strokeWidth={2} />
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
        stroke="#242424"
        strokeWidth={4}
      />
      <path
        d="M 132 510 C 144 486, 164 486, 176 510 C 185 528, 198 528, 206 510"
        fill="none"
        stroke="#242424"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <TextLabel x={78} y={495}>
        AC
      </TextLabel>
      <TextLabel x={24} y={550}>
        Source
      </TextLabel>
    </g>
  );
}

function DCSupply({ onClick }: { onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <circle
        cx={1258}
        cy={510}
        r={52}
        fill="white"
        stroke="#242424"
        strokeWidth={4}
      />
      <TextLabel x={1258} y={490} anchor="middle" size={42}>
        +
      </TextLabel>
      <TextLabel x={1258} y={538} anchor="middle" size={42}>
        −
      </TextLabel>
      <Node x={1258} y={458} r={7} />
      <Node x={1258} y={562} r={7} />
      <TextLabel x={1350} y={495}>
        DC
      </TextLabel>
      <TextLabel x={1330} y={550}>
        Supply
      </TextLabel>
    </g>
  );
}

function Lamp({
  on,
  burned,
  onClick,
}: {
  on: boolean;
  burned: boolean;
  onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      {on && !burned && (
        <ellipse
          cx={462}
          cy={250}
          rx={125}
          ry={78}
          fill="#fde68a"
          opacity={0.6}
        >
          <animate
            attributeName="opacity"
            values="0.35;0.85;0.35"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      <ellipse
        cx={462}
        cy={250}
        rx={82}
        ry={46}
        fill={on && !burned ? "#fef3c7" : burned ? "#e5e7eb" : "white"}
        stroke="#444"
        strokeWidth={4}
      />

      {burned && (
        <path
          d="M 430 230 L 495 270 M 495 230 L 430 270"
          stroke="#ef4444"
          strokeWidth={5}
          strokeLinecap="round"
        />
      )}

      <TextLabel x={462} y={250} anchor="middle">
        Lamp
      </TextLabel>
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
  const plateY = pressed && !broken ? 250 : 231;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <OpenTerminal x={1035} y={250} r={7} />
      <OpenTerminal x={1138} y={250} r={7} />

      <line
        x1={1043}
        y1={plateY}
        x2={1130}
        y2={pressed && !broken ? 250 : plateY}
        stroke={pressed && !broken ? "#2563eb" : "#242424"}
        strokeWidth={4}
        strokeLinecap="round"
      />

      <line
        x1={1086}
        y1={plateY}
        x2={1086}
        y2={plateY - 13}
        stroke="#242424"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {broken && (
        <TextLabel x={1010} y={285} size={24}>
          Broken
        </TextLabel>
      )}
      <TextLabel x={1018} y={200}>
        Button
      </TextLabel>
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
      <g transform={`translate(884 525) scale(${scale}) translate(-884 -525)`}>
        {[95, 135, 175].map((rx, i) => (
          <ellipse
            key={rx}
            cx={884}
            cy={525}
            rx={rx}
            ry={rx + 90}
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

        <TextLabel x={770} y={390} size={28}>
          N
        </TextLabel>
        <TextLabel x={980} y={655} size={28}>
          S
        </TextLabel>
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
  const coil = { x: 882, y: 438, width: 46, height: 175, turns: 5 };
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
          x={828}
          y={420}
          width={76}
          height={215}
          rx={30}
          fill="#dbeafe"
          opacity={0.2 + strength * 0.35}
        >
          <animate
            attributeName="opacity"
            values="0.2;0.55;0.2"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      <rect
        x={868}
        y={430}
        width={22}
        height={190}
        rx={8}
        fill="#9ca3af"
        opacity={0.75}
      />

      <path
        d={`M ${coil.x} ${coil.y} ${d}`}
        fill="none"
        stroke={energized ? "#2563eb" : "#242424"}
        strokeWidth={energized ? 5 + strength * 3 : 4}
        strokeLinecap="round"
      />

      <TextLabel x={923} y={520}>
        Relay coil
      </TextLabel>
    </g>
  );
}

function RelayContactNC({
  closed,
  bouncing,
  stuck,
  onClick,
}: {
  closed: boolean;
  bouncing: boolean;
  stuck: boolean;
  onClick: () => void;
}) {
  const finalClosed = stuck || closed;
  const end = finalClosed ? { x: 768, y: 475 } : { x: 730, y: 490 };

  return (
    <g onClick={onClick} className="cursor-pointer">
      <Node x={768} y={475} r={10} />
      <OpenTerminal x={768} y={475} />
      <OpenTerminal x={770} y={555} />
      <Node x={770} y={555} r={10} />

      <line
        x1={770}
        y1={555}
        x2={end.x}
        y2={end.y}
        stroke={finalClosed ? "#f59e0b" : "#242424"}
        strokeWidth={4}
        strokeLinecap="round"
      >
        {bouncing && (
          <animate
            attributeName="x2"
            values="768;742;768;748;768;730"
            dur="0.4s"
            repeatCount="1"
          />
        )}
      </line>

      <TextLabel x={665} y={535}>
        {finalClosed ? "NC Closed" : "NC Open"}
      </TextLabel>
      {stuck && (
        <TextLabel x={710} y={600} size={24}>
          Stuck Closed
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
    { state: "ContactOpening", title: "NC Opens" },
    { state: "LampOff", title: "Lamp OFF" },
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
    burnedLamp: "Burned Lamp",
    stuckContact: "Stuck Contact Closed",
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
    setState("LampOff");
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
        <h3 className="mt-1 text-xl font-black">SPST NC Relay</h3>
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
          ? `ON/OFF Mode: Start energizes the coil and opens the NC contact. Lamp becomes OFF until Stop is pressed. Status: ${
              manualOn ? "Coil ON / Lamp OFF" : "Coil OFF / Lamp ON"
            }.`
          : "Timeline Mode: Start shows step-by-step how the NC relay opens and turns the lamp OFF."}
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
  continuity,
  temperature,
}: {
  voltage: number;
  current: number;
  power: number;
  continuity: boolean;
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
          NC Contact: <b>{continuity ? "Closed" : "Open"}</b>
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
  contact,
  lamp,
}: {
  dc: boolean;
  button: boolean;
  coil: boolean;
  contact: boolean;
  lamp: boolean;
}) {
  const rows = [
    [0, 0, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 0, 0],
  ];

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-800">SPST NC Truth Table</h3>

      <table className="w-full text-center text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">DC</th>
            <th>Button</th>
            <th>Coil</th>
            <th>NC Contact</th>
            <th>Lamp</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const active =
              r[0] === Number(dc) &&
              r[1] === Number(button) &&
              r[2] === Number(coil) &&
              r[3] === Number(contact) &&
              r[4] === Number(lamp);

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
  acCurrentActive,
  fieldVisible,
  fieldStrength,
  buttonPressed,
  contactClosed,
  bouncing,
  lampOn,
  burnedLamp,
  faults,
  onSelect,
}: {
  dcCurrentActive: boolean;
  acCurrentActive: boolean;
  fieldVisible: boolean;
  fieldStrength: number;
  buttonPressed: boolean;
  contactClosed: boolean;
  bouncing: boolean;
  lampOn: boolean;
  burnedLamp: boolean;
  faults: Record<FaultKey, boolean>;
  onSelect: (key: ComponentKey) => void;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Interactive SPST NC relay simulator"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PATH.leftCircuit.map((segment, index) => (
          <Wire
            key={`left-${index}`}
            segment={segment}
            active={acCurrentActive}
            color="#f59e0b"
          />
        ))}

        {PATH.rightCircuit.map((segment, index) => (
          <Wire
            key={`right-${index}`}
            segment={segment}
            active={dcCurrentActive}
            color="#2563eb"
          />
        ))}

        <ACSource onClick={() => onSelect("ac")} />
        <Lamp
          on={lampOn}
          burned={burnedLamp}
          onClick={() => onSelect("lamp")}
        />
        <MagneticField
          visible={fieldVisible}
          strength={fieldStrength}
          onClick={() => onSelect("field")}
        />

        <RelayContactNC
          closed={contactClosed}
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

        <TextLabel x={60} y={840} size={26}>
          Blue = DC relay coil current
        </TextLabel>
        <TextLabel x={60} y={880} size={26}>
          Orange = AC lamp current
        </TextLabel>

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

export default function InteractiveRelaySimulatorNC() {
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
    burnedLamp: false,
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

  const contactOpenedByRelay =
    controlMode === "onOff"
      ? fieldVisible
      : fieldVisible && hasReached(state, "ContactOpening");

  const contactClosed = faults.stuckContact || !contactOpenedByRelay;

  const lampOn = acAvailable && contactClosed && !faults.burnedLamp;
  const acCurrentActive = lampOn;

  const fieldStrength = useMemo(
    () => Math.min(1, coilCurrent / 0.15),
    [coilCurrent],
  );
  const temperature = useMemo(() => 25 + coilPower * 4, [coilPower]);

  const failureReason = useMemo(() => {
    if (faults.noAcSupply) return "No AC supply: lamp has no power.";
    if (faults.burnedLamp)
      return "Burned lamp: NC contact may be closed, but lamp cannot glow.";
    if (faults.stuckContact && coilEnergized)
      return "Stuck contact: NC contact cannot open, so lamp stays ON.";
    if (faults.noDcSupply)
      return "No DC supply: coil cannot energize, so NC contact stays closed and lamp remains ON.";
    if (faults.brokenButton)
      return "Broken button: coil cannot energize, so NC contact stays closed.";
    if (faults.openCoil)
      return "Open coil: no coil current, so NC contact stays closed.";
    if (faults.shortedCoil)
      return "Shorted coil: excessive current may overheat relay.";
    if (buttonPressed && voltage < pickupVoltage)
      return "Voltage is below pickup voltage, so NC contact does not open.";
    return "No active failure.";
  }, [faults, coilEnergized, buttonPressed, voltage, pickupVoltage]);

  useEffect(() => {
    if (!playing || controlMode !== "timeline") return;

    const timer = window.setInterval(() => {
      setState((old) => {
        const nextIndex = stepIndex(old) + 1;

        if (nextIndex >= STEPS.length) {
          setPlaying(false);
          return "LampOff";
        }

        return STEPS[nextIndex];
      });
    }, 900 + pickupDelay);

    return () => window.clearInterval(timer);
  }, [playing, pickupDelay, controlMode]);

  useEffect(() => {
    if (state === "ContactOpening" && bounceTime > 0) {
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
        <h1 className="text-2xl font-bold">
          Interactive SPST NC Relay Simulator
        </h1>
        <p className="text-sm text-slate-200">
          NC Relay: Coil OFF = Contact Closed = Lamp ON. Coil ON = Contact Opens
          = Lamp OFF.
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
            continuity={contactClosed}
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
            acCurrentActive={acCurrentActive}
            fieldVisible={fieldVisible}
            fieldStrength={fieldStrength}
            buttonPressed={buttonPressed}
            contactClosed={contactClosed}
            bouncing={bouncing}
            lampOn={lampOn}
            burnedLamp={faults.burnedLamp}
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
              contact={contactClosed}
              lamp={lampOn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
