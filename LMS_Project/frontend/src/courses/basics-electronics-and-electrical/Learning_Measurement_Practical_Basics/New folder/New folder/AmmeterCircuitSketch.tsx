"use client";

import React, { useMemo, useState } from "react";

type DialMode = "off" | "adc" | "vdc" | "ohm";
type RedProbePort = "10A" | "mA";
type LearningMode = "normal" | "beginner" | "quiz";
type StatusTone = "good" | "warn" | "bad" | "neutral";

type AmmeterCircuitSketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type FuseStatus = {
  mAFuseBlown: boolean;
  tenAOverload: boolean;
  safe: boolean;
  message: string;
  tone: StatusTone;
};

type SafetyStatus = {
  label: string;
  detail: string;
  tone: StatusTone;
};

type LearningFeedback = {
  checked: boolean;
  allCorrect: boolean;
  dialCorrect: boolean;
  portCorrect: boolean;
  circuitCorrect: boolean;
  overloadSafe: boolean;
  messages: string[];
};

const VIEW_BOX = "0 0 1500 1120";

const C = {
  white: "#ffffff",
  black: "#111111",
  dark: "#222222",
  gray: "#6b7280",
  lightGray: "#e5e7eb",
  red: "#ef2a2a",
  redDark: "#b4141b",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  purple: "#9333ea",
  lampOn: "#fff2a8",
};

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 7;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const COMPONENT_OFFSET = { x: 28, y: 10 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 12, y: -14 };

const PORT = {
  red10A: { x: 150, y: 790 },
  com: { x: 293, y: 790 },
  redMA: { x: 428, y: 790 },
};

const NODE = {
  meterCOM: PORT.com,
  batteryPositive: { x: 990, y: 134 },
  batteryNegative: { x: 1150, y: 134 },
  redTopConnector: { x: 776, y: 140 },
  lampTop: { x: 1387, y: 552 },
  lampBottom: { x: 1387, y: 1004 },
  bottomConnector: { x: 680, y: 1035 },
} as const;

const BATTERY_NEGATIVE_WIRE_PATH = `M${NODE.batteryNegative.x} ${NODE.batteryNegative.y}
  H1339
  C1372 134 1387 156 1387 190
  V${NODE.lampTop.y}`;

const LAMP_RETURN_WIRE_PATH = `M${NODE.lampTop.x} ${NODE.lampTop.y}
  V${NODE.lampBottom.y}
  C1387 1023 1370 1035 1348 1035
  H${NODE.bottomConnector.x + 40}`;

const BLACK_WIRE_PATH = `M${NODE.meterCOM.x} 866
  C${NODE.meterCOM.x} 953 337 1036 385 1036
  H${NODE.bottomConnector.x - 40}`;

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEGMENTS: Record<string, SegmentName[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

function calculateCurrent({
  batteryVoltage,
  lampResistance,
  circuitClosed,
}: {
  batteryVoltage: number;
  lampResistance: number;
  circuitClosed: boolean;
}) {
  if (!circuitClosed) return 0;
  if (lampResistance <= 0) return 0;
  return batteryVoltage / lampResistance;
}

function getFuseStatus({
  current,
  redProbePort,
  circuitClosed,
}: {
  current: number;
  redProbePort: RedProbePort;
  circuitClosed: boolean;
}): FuseStatus {
  if (!circuitClosed) {
    return {
      mAFuseBlown: false,
      tenAOverload: false,
      safe: true,
      message: "Open circuit: no current flows.",
      tone: "neutral",
    };
  }

  const mAFuseBlown = redProbePort === "mA" && current > 0.2;
  const tenAOverload = current > 10;

  if (tenAOverload) {
    return {
      mAFuseBlown,
      tenAOverload,
      safe: false,
      message: "10A OVERLOAD: current is above the meter limit.",
      tone: "bad",
    };
  }

  if (mAFuseBlown) {
    return {
      mAFuseBlown,
      tenAOverload,
      safe: false,
      message: "mA fuse overload: use the 10A port.",
      tone: "bad",
    };
  }

  return {
    mAFuseBlown: false,
    tenAOverload: false,
    safe: true,
    message: current > 0.2 ? "Safe on 10A port." : "Current is within low-current range.",
    tone: "good",
  };
}

function getDisplayText({
  dialMode,
  circuitClosed,
  fuseStatus,
  current,
  voltage,
  resistance,
}: {
  dialMode: DialMode;
  circuitClosed: boolean;
  fuseStatus: FuseStatus;
  current: number;
  voltage: number;
  resistance: number;
}) {
  if (dialMode === "off") return "OFF";
  if (!circuitClosed) return "OPEN";
  if (fuseStatus.mAFuseBlown) return "FUSE";
  if (fuseStatus.tenAOverload) return "OVER";

  if (dialMode === "adc") return `${current.toFixed(2)}A`;
  if (dialMode === "vdc") return `${voltage.toFixed(1)}V`;
  return `${resistance.toFixed(resistance % 1 === 0 ? 0 : 1)}Ω`;
}

function getSafetyStatus({
  dialMode,
  circuitClosed,
  fuseStatus,
  current,
}: {
  dialMode: DialMode;
  circuitClosed: boolean;
  fuseStatus: FuseStatus;
  current: number;
}): SafetyStatus {
  if (dialMode === "off") {
    return {
      label: "Meter is OFF",
      detail: "Turn the dial to A DC to measure current.",
      tone: "neutral",
    };
  }

  if (!circuitClosed) {
    return {
      label: "Open circuit",
      detail: "The circuit path is broken, so current is zero.",
      tone: "warn",
    };
  }

  if (fuseStatus.tenAOverload) {
    return {
      label: "10A OVERLOAD",
      detail: "Reduce voltage or increase resistance before measuring.",
      tone: "bad",
    };
  }

  if (fuseStatus.mAFuseBlown) {
    return {
      label: "Fuse warning",
      detail: "The mA port is only safe up to 0.2A.",
      tone: "bad",
    };
  }

  if (dialMode !== "adc") {
    return {
      label: "Wrong dial mode",
      detail: "Wrong dial mode for current measurement.",
      tone: "warn",
    };
  }

  return {
    label: "Correct setup",
    detail: `The ammeter is measuring ${current.toFixed(3)}A in series.`,
    tone: "good",
  };
}

function getLearningFeedback({
  dialMode,
  redProbePort,
  circuitClosed,
  current,
}: {
  dialMode: DialMode;
  redProbePort: RedProbePort;
  circuitClosed: boolean;
  current: number;
}): LearningFeedback {
  const expectedPort: RedProbePort = current > 0.2 ? "10A" : "mA";
  const dialCorrect = dialMode === "adc";
  const portCorrect = redProbePort === expectedPort;
  const circuitCorrect = circuitClosed;
  const overloadSafe = current <= 10;
  const allCorrect = dialCorrect && portCorrect && circuitCorrect && overloadSafe;

  const messages: string[] = [];

  messages.push(
    dialCorrect
      ? "Dial mode is correct: A DC is selected."
      : "Dial mode is wrong: select A DC for current measurement."
  );

  messages.push(
    portCorrect
      ? `Red probe port is correct: ${expectedPort} is suitable for this current.`
      : `Red probe port is wrong: use ${expectedPort} for this current.`
  );

  messages.push(
    circuitCorrect
      ? "Circuit switch is correct: the circuit is closed."
      : "Circuit switch is wrong: close the circuit so current can flow."
  );

  if (!overloadSafe) {
    messages.push("Safety problem: current is above 10A, so reduce voltage or increase resistance.");
  }

  return {
    checked: true,
    allCorrect,
    dialCorrect,
    portCorrect,
    circuitCorrect,
    overloadSafe,
    messages,
  };
}

function getRedProbeNode(redProbePort: RedProbePort) {
  return redProbePort === "10A" ? PORT.red10A : PORT.redMA;
}

function getRedWireExit(redProbePort: RedProbePort) {
  const port = getRedProbeNode(redProbePort);
  return {
    x: port.x + 40,
    y: port.y + 52,
  };
}

function getRedWirePath(redProbePort: RedProbePort) {
  const exit = getRedWireExit(redProbePort);

  if (redProbePort === "10A") {
    return `M${exit.x} ${exit.y}
      C252 917 355 957 470 940
      C589 918 654 820 654 682
      V213
      C654 162 691 140 731 140
      H${NODE.redTopConnector.x}`;
  }

  return `M${exit.x} ${exit.y}
    C534 884 624 812 624 682
    V213
    C624 162 685 140 731 140
    H${NODE.redTopConnector.x}`;
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "off":
      return 0;
    case "vdc":
      return -58;
    case "ohm":
      return -96;
    case "adc":
      return 63;
    default:
      return 63;
  }
}

function Label({
  x,
  y,
  children,
  size = 30,
  anchor = "middle",
  weight = 600,
  fill = C.black,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  fill?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      fill={fill}
    >
      {children}
    </text>
  );
}

function DebugDot({
  x,
  y,
  label,
  color,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
}) {
  const rightSide = x > 1320;
  const labelX = rightSide ? x - DEBUG_TERMINAL_OFFSET.x : x + DEBUG_TERMINAL_OFFSET.x;
  const labelY = y + DEBUG_TERMINAL_OFFSET.y;
  const anchor = rightSide ? "end" : "start";

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <circle cx={x} cy={y} r={7} fill={color} stroke={C.white} strokeWidth={3} />
      <circle cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth={2} opacity={0.75} />
      <text
        x={labelX}
        y={labelY}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={700}
        fill={color}
        paintOrder="stroke"
        stroke={C.white}
        strokeWidth={4}
      >
        {label}
      </text>
    </g>
  );
}

function SevenSegmentDigit({
  digit,
  x,
  y,
  scale = 1,
}: {
  digit: string;
  x: number;
  y: number;
  scale?: number;
}) {
  const active = SEGMENTS[digit] ?? [];

  const paths: Record<SegmentName, string> = {
    a: "M15 0 H76 L88 11 L76 22 H15 L3 11 Z",
    b: "M90 15 L108 29 V78 L96 91 L78 78 V29 Z",
    c: "M90 100 L108 113 V161 L96 174 L78 161 V113 Z",
    d: "M15 167 H76 L88 178 L76 189 H15 L3 178 Z",
    e: "M0 100 L18 113 V161 L6 174 L-12 161 V113 Z",
    f: "M0 15 L18 29 V78 L6 91 L-12 78 V29 Z",
    g: "M15 83 H76 L88 94 L76 105 H15 L3 94 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={C.black}>
      {active.map((seg) => (
        <path key={seg} d={paths[seg]} />
      ))}
    </g>
  );
}

function StaticSevenSegmentDisplay() {
  return (
    <>
      <SevenSegmentDigit digit="0" x={190} y={127} scale={0.72} />
      <circle cx={252} cy={223} r={7} fill={C.black} />
      <SevenSegmentDigit digit="5" x={281} y={127} scale={0.72} />
      <SevenSegmentDigit digit="0" x={355} y={127} scale={0.72} />
      <Label x={443} y={206} size={48} weight={500}>
        A
      </Label>
    </>
  );
}

function DynamicDisplay({ value }: { value: string }) {
  const fontSize = value.length > 6 ? 48 : value.length > 4 ? 60 : 72;

  return (
    <g>
      <rect x={124} y={117} width={337} height={128} rx={4} fill={C.white} />
      <text
        x={292}
        y={188}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Courier New', monospace"
        fontSize={fontSize}
        fontWeight={800}
        fill={C.black}
      >
        {value}
      </text>
    </g>
  );
}

function DCSymbol({
  x,
  y,
  scale = 1,
  stroke = C.black,
}: {
  x: number;
  y: number;
  scale?: number;
  stroke?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={stroke}
      strokeWidth={4}
      strokeLinecap="round"
    >
      <line x1={0} y1={0} x2={48} y2={0} />
      <line x1={0} y1={14} x2={48} y2={14} strokeDasharray="11 8" />
    </g>
  );
}

function ACSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 10 * scale} ${y - 12 * scale}, ${
        x + 22 * scale
      } ${y + 12 * scale}, ${x + 34 * scale} ${y} S${x + 56 * scale} ${
        y - 12 * scale
      }, ${x + 68 * scale} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function DiodeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <line x1={-28} y1={0} x2={-5} y2={0} />
      <path d="M-5 -17 L18 0 L-5 17 Z" fill={C.black} />
      <line x1={23} y1={-21} x2={23} y2={21} />
      <line x1={23} y1={0} x2={45} y2={0} />
    </g>
  );
}

function ContinuityIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
    >
      <circle cx={-22} cy={9} r={5} fill={C.black} stroke="none" />
      <path d="M-4 2 C10 -10 10 -10 20 9" />
      <path d="M10 -8 C32 -25 32 -25 44 9" />
    </g>
  );
}

function GroundIcon({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={x} y1={y - 20} x2={x} y2={y} />
      <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
      <line x1={x - 12} y1={y + 9} x2={x + 12} y2={y + 9} />
      <line x1={x - 6} y1={y + 18} x2={x + 6} y2={y + 18} />
    </g>
  );
}

function Wire({
  d,
  color,
  shadow,
  width = BASE_WIRE_WIDTH,
  active = true,
}: {
  d: string;
  color: string;
  shadow: string;
  width?: number;
  active?: boolean;
}) {
  const scaledWidth = width * CIRCUIT_WIRE_SCALE;
  const mainColor = active ? color : C.gray;
  const shadowColor = active ? shadow : "#4b5563";

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadowColor} strokeWidth={scaledWidth + 4} opacity={active ? 0.55 : 0.25} />
      <path d={d} stroke={mainColor} strokeWidth={scaledWidth} opacity={active ? 1 : 0.5} />
      <path d={d} stroke={C.white} strokeWidth={1.5} opacity={active ? 0.25 : 0.1} />
    </g>
  );
}

function Port({
  cx,
  cy,
  color = C.black,
  active = false,
}: {
  cx: number;
  cy: number;
  color?: string;
  active?: boolean;
}) {
  return (
    <g>
      {active ? <circle cx={cx} cy={cy} r={37} fill="none" stroke={color} strokeWidth={4} opacity={0.45} /> : null}
      <circle cx={cx} cy={cy} r={31} fill={C.white} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={19} fill={C.white} stroke={C.black} strokeWidth={5} />
    </g>
  );
}

function PanelSection({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      </div>
      {children}
    </section>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-slate-900"
      />
    </label>
  );
}

function ToggleButton({
  active,
  children,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: StatusTone;
}) {
  const styles: Record<StatusTone, string> = {
    good: "border-green-200 bg-green-50 text-green-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    bad: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className={`rounded-xl border px-3 py-2 text-sm font-semibold ${styles[tone]}`}>
      {label}
    </div>
  );
}

function ExplanationCard({
  title,
  text,
  tone = "neutral",
}: {
  title: string;
  text: string;
  tone?: StatusTone;
}) {
  const styles: Record<StatusTone, string> = {
    good: "border-green-200 bg-green-50",
    warn: "border-amber-200 bg-amber-50",
    bad: "border-red-200 bg-red-50",
    neutral: "border-slate-200 bg-slate-50",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-700">{title}</div>
      <p className="mt-1 text-xs leading-5 text-slate-700">{text}</p>
    </div>
  );
}

function ExplanationCards({
  batteryVoltage,
  lampResistance,
  current,
  redProbePort,
  circuitClosed,
  dialMode,
  fuseStatus,
}: {
  batteryVoltage: number;
  lampResistance: number;
  current: number;
  redProbePort: RedProbePort;
  circuitClosed: boolean;
  dialMode: DialMode;
  fuseStatus: FuseStatus;
}) {
  const ohmText = circuitClosed
    ? `I = V / R = ${batteryVoltage}V / ${lampResistance}Ω = ${current.toFixed(3)}A.`
    : `The formula is still I = V / R, but the open switch breaks the path, so actual current is 0A.`;

  const seriesTone: StatusTone = dialMode === "adc" && circuitClosed ? "good" : "warn";
  const safetyTone: StatusTone = fuseStatus.safe ? "good" : "bad";
  const fuseTone: StatusTone = redProbePort === "mA" && current > 0.2 ? "bad" : "good";

  return (
    <div className="grid gap-2">
      <ExplanationCard title="Ohm’s law" text={ohmText} tone="neutral" />
      <ExplanationCard
        title="Series connection"
        text="An ammeter must be connected in series so all circuit current flows through the meter."
        tone={seriesTone}
      />
      <ExplanationCard
        title="Safety"
        text={current > 0.2 ? "Current is above 200mA, so the 10A port is the safe choice." : "Current is 200mA or lower, so the mA port is within range."}
        tone={safetyTone}
      />
      <ExplanationCard
        title="Fuse rule"
        text={`The mA port is only safe up to 0.2A. Current now is ${current.toFixed(3)}A.`}
        tone={fuseTone}
      />
    </div>
  );
}

function ControlPanel({
  batteryVoltage,
  setBatteryVoltage,
  lampResistance,
  setLampResistance,
  circuitClosed,
  setCircuitClosed,
  dialMode,
  setDialMode,
  redProbePort,
  setRedProbePort,
  learningMode,
  setLearningMode,
  showCurrentFlow,
  setShowCurrentFlow,
  debug,
  setDebug,
  current,
  displayText,
  fuseStatus,
  safetyStatus,
  quizChecked,
  quizFeedback,
  onCheckQuiz,
  reset,
}: {
  batteryVoltage: number;
  setBatteryVoltage: (value: number) => void;
  lampResistance: number;
  setLampResistance: (value: number) => void;
  circuitClosed: boolean;
  setCircuitClosed: (value: boolean) => void;
  dialMode: DialMode;
  setDialMode: (value: DialMode) => void;
  redProbePort: RedProbePort;
  setRedProbePort: (value: RedProbePort) => void;
  learningMode: LearningMode;
  setLearningMode: (value: LearningMode) => void;
  showCurrentFlow: boolean;
  setShowCurrentFlow: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  current: number;
  displayText: string;
  fuseStatus: FuseStatus;
  safetyStatus: SafetyStatus;
  quizChecked: boolean;
  quizFeedback: LearningFeedback | null;
  onCheckQuiz: () => void;
  reset: () => void;
}) {
  const showStatus = learningMode !== "quiz" || quizChecked;

  return (
    <aside
      role="complementary"
      aria-label="Ammeter simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Ammeter Simulation</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Change the circuit, choose the meter settings, and see how the current reading changes.
        </p>
      </div>

      <div className="space-y-3">
        <PanelSection title="Learning Mode" helper="Choose how much guidance the learner sees.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={learningMode === "normal"} onClick={() => setLearningMode("normal")} ariaLabel="Set learning mode to Normal">
              Normal
            </ToggleButton>
            <ToggleButton active={learningMode === "beginner"} onClick={() => setLearningMode("beginner")} ariaLabel="Set learning mode to Beginner">
              Beginner
            </ToggleButton>
            <ToggleButton active={learningMode === "quiz"} onClick={() => setLearningMode("quiz")} ariaLabel="Set learning mode to Quiz">
              Quiz
            </ToggleButton>
          </div>

          {learningMode === "beginner" ? (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              An ammeter must be connected in series so all circuit current flows through the meter.
            </div>
          ) : null}

          {learningMode === "quiz" ? (
            <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs leading-5 text-purple-800">
              Choose the correct dial mode, red probe port, and circuit switch. Then press Check Answer.
            </div>
          ) : null}
        </PanelSection>

        <RangeControl
          label="Battery voltage"
          value={batteryVoltage}
          min={1}
          max={12}
          step={0.5}
          unit="V"
          onChange={setBatteryVoltage}
        />

        <RangeControl
          label="Lamp resistance"
          value={lampResistance}
          min={0.5}
          max={100}
          step={0.5}
          unit="Ω"
          onChange={setLampResistance}
        />

        <PanelSection title="Circuit switch" helper="Current only flows through a complete path.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={circuitClosed} onClick={() => setCircuitClosed(true)} ariaLabel="Close circuit">
              Closed
            </ToggleButton>
            <ToggleButton active={!circuitClosed} onClick={() => setCircuitClosed(false)} ariaLabel="Open circuit">
              Open
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Dial mode" helper="For current measurement, the dial must be on A DC.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={dialMode === "off"} onClick={() => setDialMode("off")} ariaLabel="Set dial to off">
              OFF
            </ToggleButton>
            <ToggleButton active={dialMode === "adc"} onClick={() => setDialMode("adc")} ariaLabel="Set dial to DC amps">
              A DC
            </ToggleButton>
            <ToggleButton active={dialMode === "vdc"} onClick={() => setDialMode("vdc")} ariaLabel="Set dial to DC volts">
              V DC
            </ToggleButton>
            <ToggleButton active={dialMode === "ohm"} onClick={() => setDialMode("ohm")} ariaLabel="Set dial to resistance">
              Ω
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Red probe port" helper="Use 10A for currents above 200mA.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={redProbePort === "10A"} onClick={() => setRedProbePort("10A")} ariaLabel="Move red probe to 10A port">
              10A
            </ToggleButton>
            <ToggleButton active={redProbePort === "mA"} onClick={() => setRedProbePort("mA")} ariaLabel="Move red probe to mA port">
              mA
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Display options" helper="Show flow animation and terminal debug points.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={showCurrentFlow}
              onClick={() => setShowCurrentFlow(!showCurrentFlow)}
              ariaLabel="Toggle current flow animation"
            >
              Current flow
            </ToggleButton>
            <ToggleButton active={debug} onClick={() => setDebug(!debug)} ariaLabel="Toggle debug dots">
              Debug dots
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Live result" helper="The display follows the meter settings and circuit safety.">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Meter display</div>
              <div className="font-bold text-slate-900">{displayText}</div>
            </div>
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Circuit current</div>
              <div className="font-bold text-slate-900">{current.toFixed(3)} A</div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {showStatus ? (
              <>
                <StatusPill label={safetyStatus.label} tone={safetyStatus.tone} />
                <p className="text-xs leading-5 text-slate-600">{safetyStatus.detail}</p>
                {!fuseStatus.safe ? <StatusPill label={fuseStatus.message} tone={fuseStatus.tone} /> : null}
              </>
            ) : (
              <StatusPill label="Quiz mode: answer hidden until you check." tone="neutral" />
            )}
          </div>

          {learningMode === "quiz" ? (
            <div className="mt-3">
              <button
                type="button"
                aria-label="Check quiz answer"
                onClick={onCheckQuiz}
                className="w-full rounded-xl border border-purple-300 bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
              >
                Check Answer
              </button>

              {quizChecked && quizFeedback ? (
                <div
                  role="status"
                  aria-live="polite"
                  className={[
                    "mt-3 rounded-xl border p-3 text-xs leading-5",
                    quizFeedback.allCorrect
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-amber-200 bg-amber-50 text-amber-800",
                  ].join(" ")}
                >
                  <div className="mb-1 font-bold">
                    {quizFeedback.allCorrect ? "Correct answer." : "Review your setup."}
                  </div>
                  <ul className="list-inside list-disc space-y-1">
                    {quizFeedback.messages.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </PanelSection>

        <ExplanationCards
          batteryVoltage={batteryVoltage}
          lampResistance={lampResistance}
          current={current}
          redProbePort={redProbePort}
          circuitClosed={circuitClosed}
          dialMode={dialMode}
          fuseStatus={fuseStatus}
        />

        <button
          type="button"
          aria-label="Reset simulation"
          onClick={reset}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2"
        >
          Reset simulation
        </button>
      </div>
    </aside>
  );
}

function Multimeter({
  displayText,
  dialMode,
  redProbePort,
  fuseStatus,
}: {
  displayText: string;
  dialMode: DialMode;
  redProbePort: RedProbePort;
  fuseStatus: FuseStatus;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect x={62} y={45} width={467} height={898} rx={46} fill={C.white} stroke={C.black} strokeWidth={5} />
      <rect x={83} y={67} width={425} height={854} rx={31} fill={C.white} stroke={C.black} strokeWidth={3.8} />

      <rect x={105} y={99} width={375} height={166} rx={14} fill={C.white} stroke={C.black} strokeWidth={4.5} />
      <rect x={115} y={109} width={355} height={145} rx={7} fill={C.white} stroke={C.black} strokeWidth={2.5} />

      {displayText === "0.50A" ? <StaticSevenSegmentDisplay /> : <DynamicDisplay value={displayText} />}

      <line x1={83} y1={286} x2={508} y2={286} stroke={C.black} strokeWidth={3} />

      <Label x={294} y={320} size={31}>
        OFF
      </Label>
      <line x1={294} y1={337} x2={294} y2={359} stroke={C.black} strokeWidth={4} />

      <Label x={132} y={345} size={34}>
        V
      </Label>
      <DCSymbol x={153} y={333} scale={0.72} />

      <Label x={443} y={345} size={34}>
        V
      </Label>
      <ACSymbol x={464} y={333} scale={0.72} />

      <Label x={116} y={450} size={37}>
        Ω
      </Label>
      <ContinuityIcon x={112} y={527} />
      <DiodeIcon x={132} y={608} />

      <Label x={450} y={438} size={28} fill={C.red}>
        A
      </Label>
      <DCSymbol x={467} y={427} scale={0.7} stroke={C.red} />

      <Label x={442} y={535} size={27}>
        mA
      </Label>
      <DCSymbol x={475} y={524} scale={0.65} />

      <Label x={441} y={610} size={27}>
        10A
      </Label>
      <DCSymbol x={480} y={599} scale={0.65} />

      <circle cx={293} cy={499} r={143} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={293} cy={499} r={130} fill={C.white} stroke={C.black} strokeWidth={3} />

      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={190} y1={371} x2={207} y2={391} />
        <line x1={153} y1={459} x2={177} y2={465} />
        <line x1={142} y1={534} x2={166} y2={528} />
        <line x1={168} y1={598} x2={189} y2={585} />
        <line x1={398} y1={371} x2={381} y2={391} />
        <line x1={432} y1={445} x2={410} y2={456} />
        <line x1={428} y1={539} x2={404} y2={532} />
        <line x1={399} y1={601} x2={381} y2={582} />
      </g>

      <g transform={`rotate(${dialAngle} 293 499)`}>
        <rect x={270} y={356} width={45} height={286} rx={24} fill={C.white} stroke={C.black} strokeWidth={5} />
      </g>

      <path
        d={
          dialMode === "adc"
            ? "M378 455 L423 441 L397 481 Z"
            : dialMode === "vdc"
              ? "M200 390 L155 360 L185 414 Z"
              : dialMode === "ohm"
                ? "M160 520 L117 486 L144 544 Z"
                : "M293 355 L274 315 L314 315 Z"
        }
        fill={fuseStatus.safe ? C.black : C.red}
      />

      <Label x={150} y={735} size={28}>
        10A
      </Label>
      <Port cx={PORT.red10A.x} cy={PORT.red10A.y} color={C.redDark} active={redProbePort === "10A"} />

      <Label x={293} y={735} size={31}>
        COM
      </Label>
      <Port cx={PORT.com.x} cy={PORT.com.y} active />

      <Label x={428} y={735} size={28}>
        mA
      </Label>
      <Port cx={PORT.redMA.x} cy={PORT.redMA.y} color={C.redDark} active={redProbePort === "mA"} />

      <GroundIcon x={242} y={865} />

      <Label x={150} y={840} size={20}>
        FUSED
      </Label>
      <Label x={150} y={866} size={18}>
        10A MAX
      </Label>

      <Label x={428} y={840} size={20} fill={fuseStatus.mAFuseBlown ? C.red : C.black}>
        FUSED
      </Label>
      <Label x={428} y={866} size={18} fill={fuseStatus.mAFuseBlown ? C.red : C.black}>
        200mA MAX
      </Label>
    </g>
  );
}

function Plugs({ redProbePort }: { redProbePort: RedProbePort }) {
  const redNode = getRedProbeNode(redProbePort);

  return (
    <g>
      <g>
        <rect x={274} y={780} width={38} height={78} rx={10} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={266} y={832} width={54} height={34} rx={6} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={279} y1={843} x2={310} y2={843} />
          <line x1={281} y1={854} x2={308} y2={854} />
          <line x1={283} y1={865} x2={306} y2={865} />
          <line x1={285} y1={876} x2={304} y2={876} />
        </g>
      </g>

      <g transform={`rotate(-39 ${redNode.x} ${redNode.y})`}>
        <rect
          x={redNode.x - 19}
          y={redNode.y - 21}
          width={41}
          height={77}
          rx={10}
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
        <rect
          x={redNode.x - 27}
          y={redNode.y + 32}
          width={57}
          height={33}
          rx={6}
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />

        <g stroke={C.redDark} strokeWidth={4} strokeLinecap="round">
          <line x1={redNode.x - 15} y1={redNode.y + 44} x2={redNode.x + 19} y2={redNode.y + 44} />
          <line x1={redNode.x - 12} y1={redNode.y + 55} x2={redNode.x + 16} y2={redNode.y + 55} />
          <line x1={redNode.x - 9} y1={redNode.y + 66} x2={redNode.x + 13} y2={redNode.y + 66} />
          <line x1={redNode.x - 6} y1={redNode.y + 77} x2={redNode.x + 10} y2={redNode.y + 77} />
        </g>
      </g>
    </g>
  );
}

function Battery9V({ voltage, active }: { voltage: number; active: boolean }) {
  return (
    <g>
      <rect x={969} y={109} width={40} height={25} rx={4} fill={C.white} stroke={C.black} strokeWidth={4} />
      <rect x={1110} y={109} width={40} height={25} rx={4} fill={C.white} stroke={C.black} strokeWidth={4} />

      <Label x={990} y={68} size={42}>
        +
      </Label>
      <Label x={1130} y={68} size={42}>
        −
      </Label>

      <rect x={950} y={132} width={218} height={310} rx={7} fill={C.white} stroke={C.black} strokeWidth={4} />

      <Label x={1059} y={245} size={54} weight={500}>
        {voltage}V
      </Label>

      <line x1={1013} y1={304} x2={1106} y2={304} stroke={C.black} strokeWidth={4} />
      <line x1={1014} y1={330} x2={1037} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />
      <line x1={1052} y1={330} x2={1074} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />
      <line x1={1089} y1={330} x2={1112} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />

      <path
        d={BATTERY_NEGATIVE_WIRE_PATH}
        fill="none"
        stroke={active ? C.black : C.gray}
        strokeWidth={BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.45}
      />
    </g>
  );
}

function Lamp({ active, resistance }: { active: boolean; resistance: number }) {
  return (
    <g>
      <path
        d={LAMP_RETURN_WIRE_PATH}
        fill="none"
        stroke={active ? C.black : C.gray}
        strokeWidth={BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.45}
      />

      <circle cx={1385} cy={610} r={53} fill={active ? C.lampOn : C.white} stroke={C.black} strokeWidth={4} />
      <line x1={1349} y1={573} x2={1421} y2={646} stroke={C.black} strokeWidth={4} />
      <line x1={1420} y1={574} x2={1349} y2={646} stroke={C.black} strokeWidth={4} />

      <g stroke={active ? C.amber : C.black} strokeWidth={active ? 5 : 4} strokeLinecap="round">
        <line x1={1320} y1={596} x2={1291} y2={589} />
        <line x1={1437} y1={596} x2={1446} y2={593} />
        <line x1={1317} y1={666} x2={1297} y2={689} />
        <line x1={1435} y1={666} x2={1446} y2={682} />
        <line x1={1326} y1={540} x2={1309} y2={518} />
        <line x1={1431} y1={540} x2={1444} y2={522} />
      </g>

      <Label x={1385} y={710} size={24} fill={C.gray}>
        {resistance}Ω lamp
      </Label>
    </g>
  );
}

function AnimatedDot({
  path,
  color,
  begin = "0s",
}: {
  path: string;
  color: string;
  begin?: string;
}) {
  return (
    <circle r={8} fill={color} opacity={0.9}>
      <animateMotion dur="2.8s" repeatCount="indefinite" path={path} begin={begin} />
    </circle>
  );
}

function CurrentFlowAnimation({
  redPath,
  active,
  show,
}: {
  redPath: string;
  active: boolean;
  show: boolean;
}) {
  if (!show || !active) return null;

  return (
    <g>
      <AnimatedDot path={redPath} color={C.redDark} begin="0s" />
      <AnimatedDot path={redPath} color={C.redDark} begin="-1.4s" />
      <AnimatedDot path={BATTERY_NEGATIVE_WIRE_PATH} color={C.black} begin="-0.4s" />
      <AnimatedDot path={LAMP_RETURN_WIRE_PATH} color={C.black} begin="-0.9s" />
      <AnimatedDot path={BLACK_WIRE_PATH} color={C.black} begin="-1.2s" />

      <path d={redPath} stroke={C.redDark} strokeWidth={3} strokeDasharray="18 22" opacity={0.45} fill="none" />
      <path d={BLACK_WIRE_PATH} stroke={C.black} strokeWidth={3} strokeDasharray="18 22" opacity={0.35} fill="none" />
    </g>
  );
}

function CircuitWires({
  redProbePort,
  active,
  showCurrentFlow,
}: {
  redProbePort: RedProbePort;
  active: boolean;
  showCurrentFlow: boolean;
}) {
  const redWirePath = getRedWirePath(redProbePort);

  return (
    <g transform={`translate(${WIRE_OFFSET.x} ${WIRE_OFFSET.y})`}>
      <Wire d={redWirePath} color={C.red} shadow={C.redDark} width={BASE_WIRE_WIDTH + 1} active={active} />
      <Wire d={BLACK_WIRE_PATH} color={C.black} shadow="#000000" width={BASE_WIRE_WIDTH} active={active} />

      <CurrentFlowAnimation redPath={redWirePath} active={active} show={showCurrentFlow} />

      <g opacity={active ? 1 : 0.55}>
        <path
          d={`M${NODE.redTopConnector.x} ${NODE.redTopConnector.y} H${NODE.batteryPositive.x - 18}`}
          stroke={active ? C.redDark : C.gray}
          strokeWidth={8 * CIRCUIT_WIRE_SCALE}
          strokeLinecap="round"
        />

        <rect
          x={NODE.redTopConnector.x - 1}
          y={124}
          width={112}
          height={34}
          rx={7}
          fill={active ? C.red : C.gray}
          stroke={active ? C.redDark : C.gray}
          strokeWidth={4}
        />
        <rect
          x={NODE.redTopConnector.x + 68}
          y={116}
          width={43}
          height={50}
          rx={7}
          fill={active ? C.red : C.gray}
          stroke={active ? C.redDark : C.gray}
          strokeWidth={4}
        />
        <rect
          x={NODE.redTopConnector.x + 112}
          y={122}
          width={17}
          height={38}
          rx={5}
          fill={C.white}
          stroke={active ? C.redDark : C.gray}
          strokeWidth={4}
        />

        <g stroke={active ? C.redDark : C.gray} strokeWidth={4} strokeLinecap="round">
          <line x1={785} y1={130} x2={785} y2={151} />
          <line x1={797} y1={126} x2={797} y2={154} />
          <line x1={810} y1={126} x2={810} y2={154} />
          <line x1={823} y1={124} x2={823} y2={156} />
          <line x1={836} y1={120} x2={836} y2={160} />
          <line x1={855} y1={120} x2={855} y2={163} />
          <line x1={867} y1={120} x2={867} y2={163} />
        </g>
      </g>

      <g opacity={active ? 1 : 0.55}>
        <rect x={630} y={1018} width={94} height={35} rx={5} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={628} y={1020} width={16} height={31} rx={4} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={645} y={1018} width={14} height={35} rx={3} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={662} y={1018} width={14} height={35} rx={3} fill={C.dark} stroke={C.black} strokeWidth={4} />
      </g>
    </g>
  );
}

function DebugLayer({ redProbePort }: { redProbePort: RedProbePort }) {
  const redNode = getRedProbeNode(redProbePort);

  return (
    <g>
      <DebugDot x={NODE.meterCOM.x} y={NODE.meterCOM.y} label="COM" color={C.blue} />
      <DebugDot x={redNode.x} y={redNode.y} label={redProbePort} color={C.red} />
      <DebugDot x={NODE.batteryPositive.x} y={NODE.batteryPositive.y} label="BAT+" color={C.red} />
      <DebugDot x={NODE.batteryNegative.x} y={NODE.batteryNegative.y} label="BAT−" color={C.black} />
      <DebugDot x={NODE.lampTop.x} y={NODE.lampTop.y} label="LAMP TOP" color={C.green} />
      <DebugDot x={NODE.lampBottom.x} y={NODE.lampBottom.y} label="LAMP BOT" color={C.green} />
      <DebugDot x={NODE.bottomConnector.x} y={NODE.bottomConnector.y} label="BLACK JOIN" color={C.purple} />
      <DebugDot x={NODE.redTopConnector.x} y={NODE.redTopConnector.y} label="RED JOIN" color={C.amber} />
    </g>
  );
}

function Callout({
  x,
  y,
  boxX,
  boxY,
  text,
  width = 190,
  color = C.blue,
}: {
  x: number;
  y: number;
  boxX: number;
  boxY: number;
  text: string;
  width?: number;
  color?: string;
}) {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <line x1={x} y1={y} x2={boxX} y2={boxY + 18} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <rect x={boxX} y={boxY} width={width} height={36} rx={10} fill={C.white} stroke={color} strokeWidth={2.5} />
      <text x={boxX + width / 2} y={boxY + 19} textAnchor="middle" dominantBaseline="middle" fontSize={17} fontWeight={700} fill={C.black}>
        {text}
      </text>
    </g>
  );
}

function BeginnerAnnotations({
  redProbePort,
}: {
  redProbePort: RedProbePort;
}) {
  const redNode = getRedProbeNode(redProbePort);

  return (
    <g>
      <Callout x={NODE.batteryPositive.x} y={NODE.batteryPositive.y} boxX={820} boxY={40} text="Battery positive" color={C.red} />
      <Callout x={NODE.batteryNegative.x} y={NODE.batteryNegative.y} boxX={1185} boxY={40} text="Battery negative" color={C.black} />
      <Callout x={1045} y={250} boxX={790} boxY={310} text="Battery supplies voltage" width={230} color={C.purple} />

      <Callout x={redNode.x} y={redNode.y} boxX={40} boxY={940} text={redProbePort === "10A" ? "Red probe to 10A port" : "Red probe moved to mA"} width={240} color={C.red} />
      <Callout x={PORT.com.x} y={PORT.com.y} boxX={250} boxY={950} text="Black probe to COM" width={210} color={C.black} />

      <Callout x={190} y={842} boxX={480} boxY={820} text="Current enters red probe" width={250} color={C.red} />
      <Callout x={293} y={866} boxX={465} boxY={910} text="Current exits COM" width={210} color={C.black} />

      <Callout x={285} y={505} boxX={520} boxY={520} text="Ammeter in series" width={210} color={C.blue} />
      <Callout x={505} y={965} boxX={720} boxY={925} text="COM return path" width={210} color={C.black} />

      <Callout x={1385} y={610} boxX={1195} boxY={710} text="Lamp load" width={150} color={C.amber} />
      <Callout x={1385} y={650} boxX={1125} boxY={770} text="Lamp receives current" width={230} color={C.green} />

      <g stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M720 180 C840 120 930 125 988 134" markerEnd="url(#greenArrow)" />
      </g>
      <Label x={780} y={205} size={22} fill={C.green}>
        Current direction
      </Label>
    </g>
  );
}

function SimulationCanvas({
  batteryVoltage,
  lampResistance,
  circuitClosed,
  dialMode,
  redProbePort,
  learningMode,
  showCurrentFlow,
  debug,
  displayText,
  fuseStatus,
  safetyStatus,
  currentFlowActive,
}: {
  batteryVoltage: number;
  lampResistance: number;
  circuitClosed: boolean;
  dialMode: DialMode;
  redProbePort: RedProbePort;
  learningMode: LearningMode;
  showCurrentFlow: boolean;
  debug: boolean;
  displayText: string;
  fuseStatus: FuseStatus;
  safetyStatus: SafetyStatus;
  currentFlowActive: boolean;
}) {
  return (
    <div
      role="region"
      aria-label="Interactive ammeter circuit canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive digital multimeter measuring current in a battery and lamp circuit"
      >
        <defs>
          <marker id="greenArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={C.green} />
          </marker>
        </defs>

        <rect width="1500" height="1120" fill={C.white} />

        <g transform={`scale(${CIRCUIT_CANVAS_SCALE})`}>
          <g transform={`translate(${COMPONENT_OFFSET.x} ${COMPONENT_OFFSET.y}) scale(${CIRCUIT_COMPONENT_SCALE})`}>
            <Multimeter
              displayText={displayText}
              dialMode={dialMode}
              redProbePort={redProbePort}
              fuseStatus={fuseStatus}
            />

            <CircuitWires
              redProbePort={redProbePort}
              active={currentFlowActive}
              showCurrentFlow={showCurrentFlow}
            />

            <Plugs redProbePort={redProbePort} />
            <Battery9V voltage={batteryVoltage} active={currentFlowActive} />
            <Lamp active={currentFlowActive} resistance={lampResistance} />

            {!circuitClosed ? (
              <g>
                <line x1={1338} y1={840} x2={1435} y2={930} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
                <line x1={1435} y1={840} x2={1338} y2={930} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
                <Label x={1387} y={970} size={28} fill={C.red}>
                  OPEN CIRCUIT
                </Label>
              </g>
            ) : null}

            {safetyStatus.tone === "bad" ? (
              <g>
                <rect x={330} y={900} width={310} height={78} rx={14} fill="#fee2e2" stroke={C.red} strokeWidth={4} />
                <Label x={485} y={925} size={24} fill={C.red}>
                  {safetyStatus.label}
                </Label>
                <Label x={485} y={955} size={18} fill={C.red}>
                  {fuseStatus.message}
                </Label>
              </g>
            ) : null}

            {dialMode !== "adc" && dialMode !== "off" && circuitClosed && !fuseStatus.mAFuseBlown ? (
              <g>
                <rect x={600} y={430} width={365} height={66} rx={14} fill="#fef3c7" stroke={C.amber} strokeWidth={4} />
                <Label x={782} y={455} size={22} fill="#92400e">
                  Wrong dial mode for current measurement
                </Label>
                <Label x={782} y={480} size={17} fill="#92400e">
                  Select A DC to measure current
                </Label>
              </g>
            ) : null}

            {learningMode === "beginner" ? <BeginnerAnnotations redProbePort={redProbePort} /> : null}
            {debug ? <DebugLayer redProbePort={redProbePort} /> : null}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function AmmeterCircuitSketch({
  className = "",
  initialDebug = false,
}: AmmeterCircuitSketchProps) {
  const [batteryVoltage, setBatteryVoltageState] = useState(9);
  const [lampResistance, setLampResistanceState] = useState(18);
  const [circuitClosed, setCircuitClosedState] = useState(true);
  const [dialMode, setDialModeState] = useState<DialMode>("adc");
  const [redProbePort, setRedProbePortState] = useState<RedProbePort>("10A");
  const [learningMode, setLearningModeState] = useState<LearningMode>("normal");
  const [showCurrentFlow, setShowCurrentFlowState] = useState(true);
  const [debug, setDebugState] = useState(initialDebug);
  const [quizChecked, setQuizChecked] = useState(false);

  function markQuizDirty() {
    setQuizChecked(false);
  }

  function setBatteryVoltage(value: number) {
    setBatteryVoltageState(value);
    markQuizDirty();
  }

  function setLampResistance(value: number) {
    setLampResistanceState(value);
    markQuizDirty();
  }

  function setCircuitClosed(value: boolean) {
    setCircuitClosedState(value);
    markQuizDirty();
  }

  function setDialMode(value: DialMode) {
    setDialModeState(value);
    markQuizDirty();
  }

  function setRedProbePort(value: RedProbePort) {
    setRedProbePortState(value);
    markQuizDirty();
  }

  function setLearningMode(value: LearningMode) {
    setLearningModeState(value);
    setQuizChecked(false);
  }

  function setShowCurrentFlow(value: boolean) {
    setShowCurrentFlowState(value);
  }

  function setDebug(value: boolean) {
    setDebugState(value);
  }

  const simulation = useMemo(() => {
    const current = calculateCurrent({
      batteryVoltage,
      lampResistance,
      circuitClosed,
    });

    const fuseStatus = getFuseStatus({
      current,
      redProbePort,
      circuitClosed,
    });

    const displayText = getDisplayText({
      dialMode,
      circuitClosed,
      fuseStatus,
      current,
      voltage: batteryVoltage,
      resistance: lampResistance,
    });

    const safetyStatus = getSafetyStatus({
      dialMode,
      circuitClosed,
      fuseStatus,
      current,
    });

    const currentFlowActive =
      circuitClosed &&
      dialMode === "adc" &&
      !fuseStatus.mAFuseBlown &&
      !fuseStatus.tenAOverload;

    const quizFeedback = getLearningFeedback({
      dialMode,
      redProbePort,
      circuitClosed,
      current,
    });

    return {
      current,
      fuseStatus,
      displayText,
      safetyStatus,
      currentFlowActive,
      quizFeedback,
    };
  }, [batteryVoltage, circuitClosed, dialMode, lampResistance, redProbePort]);

  function onCheckQuiz() {
    setQuizChecked(true);
  }

  function reset() {
    setBatteryVoltageState(9);
    setLampResistanceState(18);
    setCircuitClosedState(true);
    setDialModeState("adc");
    setRedProbePortState("10A");
    setLearningModeState("normal");
    setShowCurrentFlowState(true);
    setDebugState(initialDebug);
    setQuizChecked(false);
  }

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ControlPanel
          batteryVoltage={batteryVoltage}
          setBatteryVoltage={setBatteryVoltage}
          lampResistance={lampResistance}
          setLampResistance={setLampResistance}
          circuitClosed={circuitClosed}
          setCircuitClosed={setCircuitClosed}
          dialMode={dialMode}
          setDialMode={setDialMode}
          redProbePort={redProbePort}
          setRedProbePort={setRedProbePort}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          showCurrentFlow={showCurrentFlow}
          setShowCurrentFlow={setShowCurrentFlow}
          debug={debug}
          setDebug={setDebug}
          current={simulation.current}
          displayText={simulation.displayText}
          fuseStatus={simulation.fuseStatus}
          safetyStatus={simulation.safetyStatus}
          quizChecked={quizChecked}
          quizFeedback={quizChecked ? simulation.quizFeedback : null}
          onCheckQuiz={onCheckQuiz}
          reset={reset}
        />

        <SimulationCanvas
          batteryVoltage={batteryVoltage}
          lampResistance={lampResistance}
          circuitClosed={circuitClosed}
          dialMode={dialMode}
          redProbePort={redProbePort}
          learningMode={learningMode}
          showCurrentFlow={showCurrentFlow}
          debug={debug}
          displayText={simulation.displayText}
          fuseStatus={simulation.fuseStatus}
          safetyStatus={simulation.safetyStatus}
          currentFlowActive={simulation.currentFlowActive}
        />
      </div>
    </div>
  );
}
