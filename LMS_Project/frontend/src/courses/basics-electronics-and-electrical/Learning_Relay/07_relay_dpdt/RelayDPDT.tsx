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
  | "ContactsSwitching"
  | "NOLampsOn"
  | "Resetting";

type FaultKey =
  | "openCoil"
  | "shortedCoil"
  | "burnedTopLamp"
  | "burnedSecondLamp"
  | "burnedThirdLamp"
  | "burnedFourthLamp"
  | "stuckContact"
  | "noAcSupply"
  | "noDcSupply"
  | "brokenButton";

type ComponentKey =
  | "button"
  | "coil"
  | "field"
  | "contact"
  | "topLamp"
  | "secondLamp"
  | "thirdLamp"
  | "fourthLamp"
  | "ac"
  | "dc";

const VIEW_BOX = { x: 0, y: 0, width: 1500, height: 1050 };

const STEPS: SimulationState[] = [
  "Idle",
  "ButtonPressed",
  "CoilEnergized",
  "MagneticFieldGenerated",
  "ContactsSwitching",
  "NOLampsOn",
  "Resetting",
];
const LAST_STEP_INDEX = STEPS.length - 1;

const PATH = {
  topLampCircuit: [
    { from: { x: 160, y: 530 }, to: { x: 160, y: 90 } },
    { from: { x: 160, y: 90 }, to: { x: 395, y: 90 } },
    { from: { x: 475, y: 90 }, to: { x: 805, y: 90 } },
    { from: { x: 805, y: 90 }, to: { x: 805, y: 545 } },
  ] satisfies LineSegment[],

  secondLampCircuit: [
    { from: { x: 160, y: 530 }, to: { x: 160, y: 220 } },
    { from: { x: 160, y: 220 }, to: { x: 395, y: 220 } },
    { from: { x: 475, y: 220 }, to: { x: 745, y: 220 } },
    { from: { x: 745, y: 220 }, to: { x: 745, y: 545 } },
  ] satisfies LineSegment[],

  thirdLampCircuit: [
    { from: { x: 160, y: 530 }, to: { x: 160, y: 350 } },
    { from: { x: 160, y: 350 }, to: { x: 395, y: 350 } },
    { from: { x: 475, y: 350 }, to: { x: 685, y: 350 } },
    { from: { x: 685, y: 350 }, to: { x: 685, y: 545 } },
  ] satisfies LineSegment[],

  fourthLampCircuit: [
    { from: { x: 160, y: 530 }, to: { x: 160, y: 480 } },
    { from: { x: 160, y: 480 }, to: { x: 395, y: 480 } },
    { from: { x: 475, y: 480 }, to: { x: 625, y: 480 } },
    { from: { x: 625, y: 480 }, to: { x: 625, y: 545 } },
  ] satisfies LineSegment[],

  commonReturn: [
    { from: { x: 730, y: 780 }, to: { x: 730, y: 930 } },
    { from: { x: 730, y: 930 }, to: { x: 160, y: 930 } },
    { from: { x: 160, y: 930 }, to: { x: 160, y: 630 } },
  ] satisfies LineSegment[],

  dcCircuit: [
    { from: { x: 980, y: 340 }, to: { x: 1090, y: 340 } },
    { from: { x: 1165, y: 340 }, to: { x: 1280, y: 340 } },
    { from: { x: 1280, y: 340 }, to: { x: 1280, y: 565 } },
    { from: { x: 1280, y: 655 }, to: { x: 1280, y: 835 } },
    { from: { x: 1280, y: 835 }, to: { x: 980, y: 835 } },
    { from: { x: 980, y: 835 }, to: { x: 980, y: 640 } },
    { from: { x: 980, y: 520 }, to: { x: 980, y: 340 } },
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
    purpose: "Moves both DPDT poles together.",
  },
  contact: {
    name: "DPDT Contact",
    purpose: "Two COM terminals switch together.",
  },
  topLamp: { name: "Top Lamp", purpose: "ON when coil is ON." },
  secondLamp: { name: "Second Lamp", purpose: "ON when coil is OFF." },
  thirdLamp: { name: "Third Lamp", purpose: "ON when coil is ON." },
  fourthLamp: { name: "Fourth Lamp", purpose: "ON when coil is OFF." },
  ac: { name: "AC Source", purpose: "Supplies the lamp circuits." },
  dc: { name: "DC Source", purpose: "Supplies the relay coil circuit." },
};

const STEP_TEXT: Record<SimulationState, string> = {
  Idle: "Relay is idle. Coil is OFF. 2nd and 4th lamps are ON.",
  ButtonPressed: "Button is pressed. DC path is ready.",
  CoilEnergized: "Current flows through the relay coil.",
  MagneticFieldGenerated: "The relay coil creates an electromagnetic field.",
  ContactsSwitching: "Both DPDT contacts move together.",
  NOLampsOn: "Top and 3rd lamps turn ON. 2nd and 4th lamps turn OFF.",
  Resetting: "Relay returns back to coil OFF position.",
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
  size = 28,
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
        cy={580}
        r={50}
        fill="white"
        stroke="#111"
        strokeWidth={4}
      />
      <path
        d="M 130 580 C 145 555, 165 555, 180 580 C 193 605, 207 605, 220 580"
        fill="none"
        stroke="#111"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <TextLabel x={90} y={565} anchor="end">
        AC
      </TextLabel>
      <TextLabel x={90} y={605} anchor="end">
        Source
      </TextLabel>
    </g>
  );
}

function DCSupply({ onClick }: { onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <circle
        cx={1280}
        cy={610}
        r={52}
        fill="white"
        stroke="#111"
        strokeWidth={4}
      />
      <TextLabel x={1280} y={590} anchor="middle" size={42}>
        +
      </TextLabel>
      <TextLabel x={1280} y={638} anchor="middle" size={42}>
        −
      </TextLabel>
      <Node x={1280} y={565} r={7} />
      <Node x={1280} y={655} r={7} />
      <TextLabel x={1345} y={595}>
        DC
      </TextLabel>
      <TextLabel x={1345} y={635}>
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
      <TextLabel x={x + 55} y={y - 18} anchor="start">
        {label}
      </TextLabel>
      {on && !burned && (
        <circle cx={x} cy={y} r={56} fill="#fde68a" opacity={0.55}>
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
  const plateY = pressed && !broken ? 340 : 310;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <OpenTerminal x={1090} y={340} r={10} />
      <OpenTerminal x={1165} y={340} r={10} />
      <line
        x1={1098}
        y1={plateY}
        x2={1157}
        y2={pressed && !broken ? 340 : plateY}
        stroke={pressed && !broken ? "#2563eb" : "#111"}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <line
        x1={1128}
        y1={plateY}
        x2={1128}
        y2={plateY - 26}
        stroke="#111"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <TextLabel x={1128} y={285} anchor="middle">
        Button
      </TextLabel>
      {broken && (
        <TextLabel x={1128} y={390} size={22} anchor="middle">
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
      <g transform={`translate(980 580) scale(${scale}) translate(-980 -580)`}>
        {[80, 120, 160].map((rx, i) => (
          <ellipse
            key={rx}
            cx={980}
            cy={580}
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
  const coil = { x: 980, y: 520, width: 46, height: 120, turns: 4 };
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
          x={926}
          y={500}
          width={80}
          height={160}
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
      <TextLabel x={1035} y={600}>
        Relay coil
      </TextLabel>
    </g>
  );
}

function DPDTContacts({
  coilOn,
  bouncing,
  stuck,
  onClick,
}: {
  coilOn: boolean;
  bouncing: boolean;
  stuck: boolean;
  onClick: () => void;
}) {
  const finalCoilOn = stuck ? false : coilOn;

  const leftPole = {
    off: { x: 625, y: 545 },
    on: { x: 685, y: 545 },
    com: { x: 670, y: 675 },
  };

  const rightPole = {
    off: { x: 745, y: 545 },
    on: { x: 805, y: 545 },
    com: { x: 790, y: 675 },
  };

  const drawPole = (pole: typeof leftPole) => {
    const end = finalCoilOn ? pole.on : pole.off;

    return (
      <g>
        <OpenTerminal x={pole.off.x} y={pole.off.y} />
        <OpenTerminal x={pole.on.x} y={pole.on.y} />
        <OpenTerminal x={pole.com.x} y={pole.com.y} />
        <Node x={pole.com.x} y={pole.com.y} r={9} />
        <line
          x1={pole.com.x}
          y1={pole.com.y}
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
                values={`${pole.off.x};${pole.on.x};${pole.off.x + 35};${pole.on.x}`}
                dur="0.45s"
                repeatCount="1"
              />
              <animate
                attributeName="y2"
                values={`${pole.off.y};${pole.on.y};${pole.on.y};${pole.on.y}`}
                dur="0.45s"
                repeatCount="1"
              />
            </>
          )}
        </line>
      </g>
    );
  };

  return (
    <g onClick={onClick} className="cursor-pointer">
      {drawPole(leftPole)}
      {drawPole(rightPole)}

      <line
        x1={665}
        y1={610}
        x2={795}
        y2={610}
        stroke="#111"
        strokeWidth={4}
        strokeDasharray="20 16"
      />
      <line x1={670} y1={675} x2={670} y2={780} stroke="#111" strokeWidth={4} />
      <line x1={790} y1={675} x2={790} y2={780} stroke="#111" strokeWidth={4} />
      <line x1={670} y1={780} x2={790} y2={780} stroke="#111" strokeWidth={4} />
      <line x1={730} y1={780} x2={730} y2={930} stroke="#111" strokeWidth={4} />

      <TextLabel x={825} y={675} size={26}>
        DPDT
      </TextLabel>
      <TextLabel x={580} y={545} size={20}>
        OFF
      </TextLabel>
      <TextLabel x={830} y={545} size={20}>
        ON
      </TextLabel>
      {stuck && (
        <TextLabel x={610} y={830} size={24}>
          Stuck OFF
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
    { state: "ContactsSwitching", title: "Switching" },
    { state: "NOLampsOn", title: "Top + 3rd ON" },
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

function ControlPanel(props: {
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
  const {
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
  } = props;

  const next = () =>
    setState(STEPS[Math.min(stepIndex(state) + 1, STEPS.length - 1)]);
  const prev = () => setState(STEPS[Math.max(stepIndex(state) - 1, 0)]);

  const faultLabels: Record<FaultKey, string> = {
    openCoil: "Open Coil",
    shortedCoil: "Shorted Coil",
    burnedTopLamp: "Burned Top Lamp",
    burnedSecondLamp: "Burned 2nd Lamp",
    burnedThirdLamp: "Burned 3rd Lamp",
    burnedFourthLamp: "Burned 4th Lamp",
    stuckContact: "Stuck OFF",
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
    setState("NOLampsOn");
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
        <h3 className="mt-1 text-xl font-black">DPDT Relay</h3>
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
        Coil OFF: 2nd + 4th lamps ON. Coil ON: Top + 3rd lamps ON.
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
                checked={faults[key]}
                type="checkbox"
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
  contactPosition: "OFF" | "ON";
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
          Contacts: <b>{contactPosition}</b>
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
  onLamps,
  offLamps,
}: {
  dc: boolean;
  button: boolean;
  coil: boolean;
  onLamps: boolean;
  offLamps: boolean;
}) {
  const rows = [
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ];

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-800">DPDT Truth Table</h3>
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">DC</th>
            <th>Button</th>
            <th>Coil</th>
            <th>Top+3rd</th>
            <th>2nd+4th</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const active =
              r[0] === Number(dc) &&
              r[1] === Number(button) &&
              r[2] === Number(coil) &&
              r[3] === Number(onLamps) &&
              r[4] === Number(offLamps);

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

function CircuitSvg(props: {
  dcCurrentActive: boolean;
  topCurrentActive: boolean;
  secondCurrentActive: boolean;
  thirdCurrentActive: boolean;
  fourthCurrentActive: boolean;
  fieldVisible: boolean;
  fieldStrength: number;
  buttonPressed: boolean;
  coilOnPosition: boolean;
  bouncing: boolean;
  topLampOn: boolean;
  secondLampOn: boolean;
  thirdLampOn: boolean;
  fourthLampOn: boolean;
  faults: Record<FaultKey, boolean>;
  onSelect: (key: ComponentKey) => void;
}) {
  const {
    dcCurrentActive,
    topCurrentActive,
    secondCurrentActive,
    thirdCurrentActive,
    fourthCurrentActive,
    fieldVisible,
    fieldStrength,
    buttonPressed,
    coilOnPosition,
    bouncing,
    topLampOn,
    secondLampOn,
    thirdLampOn,
    fourthLampOn,
    faults,
    onSelect,
  } = props;

  const anyLampCurrent =
    topCurrentActive ||
    secondCurrentActive ||
    thirdCurrentActive ||
    fourthCurrentActive;

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Interactive DPDT relay simulator"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PATH.topLampCircuit.map((segment, index) => (
          <Wire
            key={`top-${index}`}
            segment={segment}
            active={topCurrentActive}
            color="#22c55e"
          />
        ))}
        {PATH.secondLampCircuit.map((segment, index) => (
          <Wire
            key={`second-${index}`}
            segment={segment}
            active={secondCurrentActive}
            color="#f59e0b"
          />
        ))}
        {PATH.thirdLampCircuit.map((segment, index) => (
          <Wire
            key={`third-${index}`}
            segment={segment}
            active={thirdCurrentActive}
            color="#22c55e"
          />
        ))}
        {PATH.fourthLampCircuit.map((segment, index) => (
          <Wire
            key={`fourth-${index}`}
            segment={segment}
            active={fourthCurrentActive}
            color="#f59e0b"
          />
        ))}
        {PATH.commonReturn.map((segment, index) => (
          <Wire
            key={`return-${index}`}
            segment={segment}
            active={anyLampCurrent}
            color={coilOnPosition ? "#22c55e" : "#f59e0b"}
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
          x={435}
          y={90}
          label="Lamp"
          on={topLampOn}
          burned={faults.burnedTopLamp}
          onClick={() => onSelect("topLamp")}
        />
        <Lamp
          x={435}
          y={220}
          label="Lamp"
          on={secondLampOn}
          burned={faults.burnedSecondLamp}
          onClick={() => onSelect("secondLamp")}
        />
        <Lamp
          x={435}
          y={350}
          label="Lamp"
          on={thirdLampOn}
          burned={faults.burnedThirdLamp}
          onClick={() => onSelect("thirdLamp")}
        />
        <Lamp
          x={435}
          y={480}
          label="Lamp"
          on={fourthLampOn}
          burned={faults.burnedFourthLamp}
          onClick={() => onSelect("fourthLamp")}
        />

        <MagneticField
          visible={fieldVisible}
          strength={fieldStrength}
          onClick={() => onSelect("field")}
        />
        <DPDTContacts
          coilOn={coilOnPosition}
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
          <TextLabel x={780} y={300} size={26}>
            Fault: Open Coil
          </TextLabel>
        )}
        {faults.shortedCoil && (
          <TextLabel x={780} y={335} size={26}>
            Fault: Shorted Coil
          </TextLabel>
        )}
      </svg>
    </div>
  );
}

export default function RelayDPDT() {
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
    burnedTopLamp: false,
    burnedSecondLamp: false,
    burnedThirdLamp: false,
    burnedFourthLamp: false,
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

  const contactsInCoilOnPosition =
    controlMode === "onOff"
      ? fieldVisible
      : fieldVisible && hasReached(state, "ContactsSwitching");

  const coilOnPosition = faults.stuckContact ? false : contactsInCoilOnPosition;
  const coilOffPosition = !coilOnPosition;

  const topLampOn = acAvailable && coilOnPosition && !faults.burnedTopLamp;
  const secondLampOn =
    acAvailable && coilOffPosition && !faults.burnedSecondLamp;
  const thirdLampOn = acAvailable && coilOnPosition && !faults.burnedThirdLamp;
  const fourthLampOn =
    acAvailable && coilOffPosition && !faults.burnedFourthLamp;

  const fieldStrength = useMemo(
    () => Math.min(1, coilCurrent / 0.15),
    [coilCurrent],
  );
  const temperature = useMemo(() => 25 + coilPower * 4, [coilPower]);

  const failureReason = useMemo(() => {
    if (faults.noAcSupply) return "No AC supply: lamps cannot receive power.";
    if (faults.stuckContact && coilEnergized)
      return "Stuck contact: contacts stay in coil OFF position.";
    if (faults.noDcSupply) return "No DC supply: coil cannot energize.";
    if (faults.brokenButton) return "Broken button: coil cannot energize.";
    if (faults.openCoil) return "Open coil: no coil current.";
    if (faults.shortedCoil)
      return "Shorted coil: excessive current may overheat relay.";
    if (buttonPressed && voltage < pickupVoltage)
      return "Voltage is below pickup voltage, so contacts do not switch.";
    return "No active failure.";
  }, [faults, coilEnergized, buttonPressed, voltage, pickupVoltage]);

  useEffect(() => {
    if (!playing || controlMode !== "timeline") return;

    const timer = window.setInterval(() => {
      setState((old) => {
        const nextIndex = stepIndex(old) + 1;
        if (nextIndex >= STEPS.length) {
          setPlaying(false);
          return "NOLampsOn";
        }
        return STEPS[nextIndex];
      });
    }, 900 + pickupDelay);

    return () => window.clearInterval(timer);
  }, [playing, pickupDelay, controlMode]);

  useEffect(() => {
    if (state === "ContactsSwitching" && bounceTime > 0) {
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
        <h1 className="text-2xl font-bold">Relay DPDT Simulator</h1>
        <p className="text-sm text-slate-200">
          Coil ON: Top and 3rd lamps ON. Coil OFF: 2nd and 4th lamps ON.
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
            contactPosition={coilOnPosition ? "ON" : "OFF"}
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
            topCurrentActive={topLampOn}
            secondCurrentActive={secondLampOn}
            thirdCurrentActive={thirdLampOn}
            fourthCurrentActive={fourthLampOn}
            fieldVisible={fieldVisible}
            fieldStrength={fieldStrength}
            buttonPressed={buttonPressed}
            coilOnPosition={coilOnPosition}
            bouncing={bouncing}
            topLampOn={topLampOn}
            secondLampOn={secondLampOn}
            thirdLampOn={thirdLampOn}
            fourthLampOn={fourthLampOn}
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
              onLamps={topLampOn || thirdLampOn}
              offLamps={secondLampOn || fourthLampOn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
