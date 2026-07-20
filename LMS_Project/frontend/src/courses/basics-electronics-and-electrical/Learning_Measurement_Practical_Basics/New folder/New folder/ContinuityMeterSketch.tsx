"use client";

import React, { useMemo, useState } from "react";

type ContinuityMeterSketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type DialMode = "off" | "continuity" | "ohm" | "vdc" | "vac" | "diode" | "capacitance";
type ProbeState = "connected" | "open" | "shorted";
type LearningMode = "normal" | "beginner" | "quiz";
type StatusTone = "good" | "warn" | "bad" | "neutral";

type SafetyStatus = {
  label: string;
  detail: string;
  tone: StatusTone;
};

type QuizFeedback = {
  allCorrect: boolean;
  messages: string[];
};

const VIEW_BOX = "0 0 1448 1086";

const C = {
  black: "#101010",
  dark: "#222222",
  dark2: "#333333",
  grey: "#dfe3dc",
  white: "#ffffff",
  red: "#ff3333",
  redDark: "#ba1717",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  purple: "#9333ea",
  slate: "#64748b",
};

const PORT = {
  com: { x: 227, y: 743 },
  voltOhm: { x: 478, y: 743 },
};

const NODE = {
  display: { x: 352, y: 182 },
  dialCenter: { x: 353, y: 498 },
  blackProbeTip: { x: 879, y: 402 },
  redProbeTip: { x: 1207, y: 403 },
  testWireCenter: { x: 1045, y: 403 },
} as const;

const BLACK_WIRE_PATH =
  "M227 846 C230 914 269 981 343 1015 C426 1053 536 1047 606 1002 C670 961 690 883 727 798";

const RED_WIRE_PATH =
  "M478 846 C482 914 530 977 620 1010 C747 1056 1102 1050 1260 1022 C1353 1005 1410 943 1409 881 C1408 840 1382 811 1357 781";

const TOP_TEST_WIRE_PATH = "M884 403 C968 378 1125 377 1207 403";

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEGMENTS: Record<string, Segment[]> = {
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

function calculateMeasuredResistance({
  resistance,
  probeState,
  externalPower,
}: {
  resistance: number;
  probeState: ProbeState;
  externalPower: boolean;
}) {
  if (externalPower) return null;
  if (probeState === "open") return Infinity;
  if (probeState === "shorted") return 0;
  return resistance;
}

function isContinuity({
  measuredResistance,
  threshold,
  externalPower,
}: {
  measuredResistance: number | null;
  threshold: number;
  externalPower: boolean;
}) {
  if (externalPower || measuredResistance === null) return false;
  if (!Number.isFinite(measuredResistance)) return false;
  return measuredResistance <= threshold;
}

function formatResistance(value: number | null) {
  if (value === null) return "ERR";
  if (!Number.isFinite(value)) return "OL";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}kΩ`;
  return `${value.toFixed(value < 10 ? 1 : 0)}Ω`;
}

function getDisplayText({
  dialMode,
  measuredResistance,
  continuity,
  externalPower,
}: {
  dialMode: DialMode;
  measuredResistance: number | null;
  continuity: boolean;
  externalPower: boolean;
}) {
  if (dialMode === "off") return "OFF";
  if (externalPower) return "ERR";

  if (dialMode === "continuity") {
    if (continuity) return "BEEP";
    if (!Number.isFinite(measuredResistance ?? Infinity)) return "OL";
    return formatResistance(measuredResistance);
  }

  if (dialMode === "ohm") return formatResistance(measuredResistance);
  if (dialMode === "vdc") return "0.0V";
  if (dialMode === "vac") return "0V";
  if (dialMode === "diode") return "----";
  if (dialMode === "capacitance") return "0.0";

  return "----";
}

function getSafetyStatus({
  dialMode,
  probeState,
  externalPower,
  continuity,
  measuredResistance,
  threshold,
}: {
  dialMode: DialMode;
  probeState: ProbeState;
  externalPower: boolean;
  continuity: boolean;
  measuredResistance: number | null;
  threshold: number;
}): SafetyStatus {
  if (externalPower) {
    return {
      label: "Powered circuit warning",
      detail: "Do not use continuity mode on a powered circuit. Turn power off first.",
      tone: "bad",
    };
  }

  if (dialMode === "off") {
    return {
      label: "Meter is OFF",
      detail: "Turn the dial to continuity mode to test for a closed path.",
      tone: "neutral",
    };
  }

  if (dialMode !== "continuity") {
    return {
      label: "Wrong dial mode",
      detail: "Select continuity mode, usually shown by the sound-wave icon.",
      tone: "warn",
    };
  }

  if (probeState === "open") {
    return {
      label: "Open circuit",
      detail: "The probes are not connected through a complete path, so the meter will not beep.",
      tone: "warn",
    };
  }

  if (continuity) {
    return {
      label: "Continuity detected",
      detail: `Measured resistance is ${formatResistance(measuredResistance)}, below the ${threshold}Ω beep threshold.`,
      tone: "good",
    };
  }

  return {
    label: "No continuity",
    detail: `Measured resistance is above the ${threshold}Ω beep threshold, so there is no beep.`,
    tone: "warn",
  };
}

function getLearningFeedback({
  dialMode,
  probeState,
  externalPower,
  continuity,
}: {
  dialMode: DialMode;
  probeState: ProbeState;
  externalPower: boolean;
  continuity: boolean;
}): QuizFeedback {
  const dialCorrect = dialMode === "continuity";
  const probeCorrect = probeState === "connected" || probeState === "shorted";
  const powerCorrect = !externalPower;
  const allCorrect = dialCorrect && probeCorrect && powerCorrect && continuity;

  return {
    allCorrect,
    messages: [
      dialCorrect
        ? "Dial mode is correct: continuity mode is selected."
        : "Dial mode is wrong: select continuity mode.",
      probeCorrect
        ? "Probe state is correct: the probes form a test path."
        : "Probe state is wrong: the probes must complete the path.",
      powerCorrect
        ? "Safety is correct: external power is OFF."
        : "Safety problem: continuity testing must be done with power OFF.",
      continuity
        ? "Continuity result is correct: the meter should beep."
        : "No beep yet: lower the resistance, short the probes, or complete the path.",
    ],
  };
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "off":
      return 0;
    case "continuity":
      return -74;
    case "ohm":
      return 44;
    case "vdc":
      return -118;
    case "vac":
      return -146;
    case "diode":
      return 76;
    case "capacitance":
      return 112;
    default:
      return -74;
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

  const path: Record<Segment, string> = {
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
        <path key={seg} d={path[seg]} />
      ))}
    </g>
  );
}

function DynamicDisplay({ value, continuity }: { value: string; continuity: boolean }) {
  const fontSize = value.length > 5 ? 50 : value.length > 3 ? 68 : 82;

  return (
    <g>
      <rect x={145} y={111} width={414} height={139} rx={6} fill={C.grey} />
      {continuity ? <ContinuityIcon x={185} y={160} scale={0.82} active /> : null}
      <text
        x={continuity ? 432 : 352}
        y={184}
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

function ContinuityIcon({
  x,
  y,
  scale = 1,
  active = false,
}: {
  x: number;
  y: number;
  scale?: number;
  active?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke={active ? C.green : C.black}
      strokeWidth={5}
      strokeLinecap="round"
    >
      <circle cx={0} cy={22} r={7} fill={active ? C.green : C.black} stroke="none" />
      <path d="M24 6 C42 24 42 24 24 42" />
      <path d="M45 -6 C72 22 72 22 45 50" />
      <path d="M68 -18 C104 22 104 22 68 62" />
    </g>
  );
}

function ACSymbol({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 11} ${y - 12}, ${x + 23} ${y + 12}, ${
        x + 35
      } ${y} S${x + 57} ${y - 12}, ${x + 68} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function DCSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + 48} y2={y} />
      <line x1={x} y1={y + 13} x2={x + 48} y2={y + 13} strokeDasharray="11 8" />
    </g>
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
      <line x1={-26} y1={0} x2={-4} y2={0} />
      <path d="M-4 -17 L17 0 L-4 17 Z" fill={C.black} />
      <line x1={22} y1={-20} x2={22} y2={20} />
      <line x1={22} y1={0} x2={45} y2={0} />
    </g>
  );
}

function CapacitorIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={C.black} strokeWidth={5} strokeLinecap="round" fill="none">
      <line x1={-45} y1={0} x2={-13} y2={0} />
      <line x1={13} y1={0} x2={45} y2={0} />
      <line x1={-13} y1={-20} x2={-13} y2={20} />
      <line x1={13} y1={-20} x2={13} y2={20} />
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
      {active ? <circle cx={cx} cy={cy} r={43} fill="none" stroke={color} strokeWidth={4} opacity={0.45} /> : null}
      <circle cx={cx} cy={cy} r={35} fill={C.white} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={27} fill={C.white} stroke={C.black} strokeWidth={4} />
    </g>
  );
}

function Wire({
  d,
  color,
  shadow,
  width = 12,
  active = true,
}: {
  d: string;
  color: string;
  shadow: string;
  width?: number;
  active?: boolean;
}) {
  const mainColor = active ? color : C.slate;
  const shadowColor = active ? shadow : "#475569";

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadowColor} strokeWidth={width + 5} opacity={active ? 0.6 : 0.25} />
      <path d={d} stroke={mainColor} strokeWidth={width} opacity={active ? 1 : 0.45} />
      <path d={d} stroke={C.white} strokeWidth={2} opacity={active ? 0.24 : 0.1} />
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

function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  const styles: Record<StatusTone, string> = {
    good: "border-green-200 bg-green-50 text-green-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    bad: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return <div className={`rounded-xl border px-3 py-2 text-sm font-semibold ${styles[tone]}`}>{label}</div>;
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

function ControlPanel({
  testResistance,
  setTestResistance,
  threshold,
  setThreshold,
  dialMode,
  setDialMode,
  probeState,
  setProbeState,
  externalPower,
  setExternalPower,
  learningMode,
  setLearningMode,
  showTestSignal,
  setShowTestSignal,
  debug,
  setDebug,
  displayText,
  measuredResistance,
  continuity,
  safetyStatus,
  quizChecked,
  quizFeedback,
  onCheckQuiz,
  reset,
}: {
  testResistance: number;
  setTestResistance: (value: number) => void;
  threshold: number;
  setThreshold: (value: number) => void;
  dialMode: DialMode;
  setDialMode: (value: DialMode) => void;
  probeState: ProbeState;
  setProbeState: (value: ProbeState) => void;
  externalPower: boolean;
  setExternalPower: (value: boolean) => void;
  learningMode: LearningMode;
  setLearningMode: (value: LearningMode) => void;
  showTestSignal: boolean;
  setShowTestSignal: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  displayText: string;
  measuredResistance: number | null;
  continuity: boolean;
  safetyStatus: SafetyStatus;
  quizChecked: boolean;
  quizFeedback: QuizFeedback | null;
  onCheckQuiz: () => void;
  reset: () => void;
}) {
  const showStatus = learningMode !== "quiz" || quizChecked;

  return (
    <aside
      role="complementary"
      aria-label="Continuity test simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Continuity Test</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Check whether a complete low-resistance path exists between the two probes.
        </p>
      </div>

      <div className="space-y-3">
        <PanelSection title="Learning Mode" helper="Choose guidance level.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={learningMode === "normal"} onClick={() => setLearningMode("normal")} ariaLabel="Normal mode">
              Normal
            </ToggleButton>
            <ToggleButton active={learningMode === "beginner"} onClick={() => setLearningMode("beginner")} ariaLabel="Beginner mode">
              Beginner
            </ToggleButton>
            <ToggleButton active={learningMode === "quiz"} onClick={() => setLearningMode("quiz")} ariaLabel="Quiz mode">
              Quiz
            </ToggleButton>
          </div>

          {learningMode === "beginner" ? (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              In continuity mode, the meter sends a tiny test signal. If resistance is low enough, it beeps.
            </div>
          ) : null}

          {learningMode === "quiz" ? (
            <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs leading-5 text-purple-800">
              Select continuity mode, complete the path, and keep external power OFF. Then check your answer.
            </div>
          ) : null}
        </PanelSection>

        <RangeControl
          label="Test path resistance"
          value={testResistance}
          min={0}
          max={200}
          step={1}
          unit="Ω"
          onChange={setTestResistance}
        />

        <RangeControl
          label="Beep threshold"
          value={threshold}
          min={1}
          max={100}
          step={1}
          unit="Ω"
          onChange={setThreshold}
        />

        <PanelSection title="Dial mode" helper="Use the sound-wave continuity symbol.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={dialMode === "off"} onClick={() => setDialMode("off")} ariaLabel="Set dial off">
              OFF
            </ToggleButton>
            <ToggleButton active={dialMode === "continuity"} onClick={() => setDialMode("continuity")} ariaLabel="Set continuity mode">
              Continuity
            </ToggleButton>
            <ToggleButton active={dialMode === "ohm"} onClick={() => setDialMode("ohm")} ariaLabel="Set ohm mode">
              Ω
            </ToggleButton>
            <ToggleButton active={dialMode === "vdc"} onClick={() => setDialMode("vdc")} ariaLabel="Set DC voltage mode">
              V DC
            </ToggleButton>
            <ToggleButton active={dialMode === "vac"} onClick={() => setDialMode("vac")} ariaLabel="Set AC voltage mode">
              V AC
            </ToggleButton>
            <ToggleButton active={dialMode === "diode"} onClick={() => setDialMode("diode")} ariaLabel="Set diode mode">
              Diode
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Probe state" helper="The probes must complete the test path.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={probeState === "connected"} onClick={() => setProbeState("connected")} ariaLabel="Connect probes through test path">
              Connected
            </ToggleButton>
            <ToggleButton active={probeState === "open"} onClick={() => setProbeState("open")} ariaLabel="Open probe path">
              Open
            </ToggleButton>
            <ToggleButton active={probeState === "shorted"} onClick={() => setProbeState("shorted")} ariaLabel="Short probes">
              Shorted
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Safety" helper="Continuity testing must be done with power off.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={!externalPower} onClick={() => setExternalPower(false)} ariaLabel="External power off">
              Power OFF
            </ToggleButton>
            <ToggleButton active={externalPower} onClick={() => setExternalPower(true)} ariaLabel="External power on">
              Power ON
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Display options" helper="Show simulated test signal and debug points.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={showTestSignal} onClick={() => setShowTestSignal(!showTestSignal)} ariaLabel="Toggle test signal">
              Test signal
            </ToggleButton>
            <ToggleButton active={debug} onClick={() => setDebug(!debug)} ariaLabel="Toggle debug dots">
              Debug dots
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Live result" helper="The meter display follows the circuit state.">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Meter display</div>
              <div className="font-bold text-slate-900">{displayText}</div>
            </div>

            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Measured path</div>
              <div className="font-bold text-slate-900">{formatResistance(measuredResistance)}</div>
            </div>
          </div>

          <div className="mt-3">
            <StatusPill label={continuity ? "BEEP: continuity exists" : "NO BEEP"} tone={continuity ? "good" : "warn"} />
          </div>

          <div className="mt-3 space-y-2">
            {showStatus ? (
              <>
                <StatusPill label={safetyStatus.label} tone={safetyStatus.tone} />
                <p className="text-xs leading-5 text-slate-600">{safetyStatus.detail}</p>
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

        <div className="grid gap-2">
          <ExplanationCard
            title="Continuity rule"
            text={`The meter beeps when the measured path is at or below ${threshold}Ω.`}
            tone={continuity ? "good" : "warn"}
          />
          <ExplanationCard
            title="Correct mode"
            text="Use the continuity/speaker symbol for beep testing. Ω mode measures resistance but may not beep."
            tone={dialMode === "continuity" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Probe path"
            text="The red and black probes must touch two points of the same electrical path."
            tone={probeState !== "open" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Safety"
            text="Continuity testing is for unpowered circuits only."
            tone={externalPower ? "bad" : "good"}
          />
        </div>

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

function MeterBody({
  displayText,
  dialMode,
  continuity,
  safetyStatus,
}: {
  displayText: string;
  dialMode: DialMode;
  continuity: boolean;
  safetyStatus: SafetyStatus;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <path
        d="
          M122 34
          H570
          C610 34 633 63 633 106
          V267
          C633 288 624 308 624 328
          V805
          C624 850 595 873 552 873
          H125
          C86 873 62 845 62 806
          V699
          C62 681 67 663 67 646
          V355
          C67 332 62 311 62 288
          V105
          C62 64 84 34 122 34
          Z
        "
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />

      <g fill={C.white} stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <path d="M64 346 H81 V385 H65" />
        <path d="M64 389 H82 V461 H65" />
        <path d="M64 462 H82 V509 H65" />
        <path d="M64 510 H82 V624 H65" />
        <path d="M629 340 H616 V383 H629" />
        <path d="M629 386 H616 V456 H629" />
        <path d="M629 458 H616 V504 H629" />
        <path d="M629 506 H616 V626 H629" />
      </g>

      <path
        d="
          M132 56
          H549
          C580 56 603 81 603 118
          V802
          C603 829 584 847 555 847
          H130
          C102 847 84 828 84 801
          V118
          C84 82 104 56 132 56
          Z
        "
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <rect x={132} y={99} width={440} height={167} rx={12} fill={C.white} stroke={C.black} strokeWidth={5} />
      <rect x={145} y={111} width={414} height={139} rx={6} fill={C.grey} stroke={C.black} strokeWidth={3} />

      <DynamicDisplay value={displayText} continuity={continuity} />

      <Label x={354} y={320} size={31}>
        OFF
      </Label>
      <line x1={354} y1={337} x2={354} y2={358} stroke={C.black} strokeWidth={4} />

      <Label x={176} y={345} size={34}>
        V
      </Label>
      <ACSymbol x={161} y={371} />

      <Label x={166} y={444} size={34}>
        V
      </Label>
      <DCSymbol x={136} y={466} />

      <ContinuityIcon x={162} y={570} scale={0.82} active={dialMode === "continuity"} />

      <Label x={502} y={362} size={42}>
        Ω
      </Label>
      <DiodeIcon x={543} y={461} />
      <CapacitorIcon x={542} y={572} />

      <circle cx={353} cy={498} r={137} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={353} cy={498} r={126} fill={C.white} stroke={C.black} strokeWidth={3} />

      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={260} y1={365} x2={271} y2={386} />
        <line x1={205} y1={430} x2={225} y2={441} />
        <line x1={190} y1={512} x2={211} y2={510} />
        <line x1={441} y1={365} x2={429} y2={386} />
        <line x1={502} y1={426} x2={481} y2={438} />
        <line x1={514} y1={510} x2={493} y2={508} />
      </g>

      <g transform={`rotate(${dialAngle} 353 498)`}>
        <rect x={331} y={371} width={44} height={253} rx={23} fill={C.white} stroke={C.black} strokeWidth={5} />
      </g>

      <circle cx={414} cy={421} r={13} fill={safetyStatus.tone === "bad" ? C.red : C.black} />

      <Label x={228} y={692} size={30}>
        COM
      </Label>
      <Label x={479} y={692} size={30}>
        V/Ω
      </Label>
    </g>
  );
}

function MeterPortsAndPlugs() {
  return (
    <g>
      <Port cx={PORT.com.x} cy={PORT.com.y} color={C.black} active />
      <Port cx={PORT.voltOhm.x} cy={PORT.voltOhm.y} color={C.red} active />

      <g>
        <rect x={203} y={722} width={48} height={121} rx={14} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <path d="M203 782 H251 V850 H210 C206 830 203 807 203 782 Z" fill={C.dark} stroke={C.black} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={216} y1={792} x2={235} y2={792} />
          <line x1={216} y1={809} x2={237} y2={809} />
          <line x1={217} y1={826} x2={238} y2={826} />
        </g>
        <line x1={220} y1={779} x2={236} y2={779} stroke="#555" strokeWidth={2} />
      </g>

      <g>
        <rect x={454} y={722} width={48} height={121} rx={14} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <path d="M454 782 H502 V850 H462 C458 830 454 807 454 782 Z" fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={467} y1={792} x2={486} y2={792} />
          <line x1={467} y1={809} x2={488} y2={809} />
          <line x1={468} y1={826} x2={489} y2={826} />
        </g>
        <line x1={471} y1={779} x2={486} y2={779} stroke={C.redDark} strokeWidth={2} />
      </g>
    </g>
  );
}

function WiresAndProbes({
  probeState,
  continuity,
  showTestSignal,
}: {
  probeState: ProbeState;
  continuity: boolean;
  showTestSignal: boolean;
}) {
  const probesActive = probeState !== "open";

  return (
    <g>
      <Wire d={BLACK_WIRE_PATH} color={C.black} shadow="#000000" width={12} active={probesActive} />
      <Wire d={RED_WIRE_PATH} color={C.red} shadow={C.redDark} width={12} active={probesActive} />

      <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={probesActive ? 1 : 0.35}>
        <path d={TOP_TEST_WIRE_PATH} stroke="#000000" strokeWidth={14} opacity={0.65} />
        <path d={TOP_TEST_WIRE_PATH} stroke={continuity ? C.green : C.dark} strokeWidth={9} />
        <path d="M885 413 C970 390 1123 389 1205 413" stroke="#666" strokeWidth={2} opacity={0.45} />
      </g>

      {showTestSignal && probesActive ? (
        <g>
          <circle r={8} fill={continuity ? C.green : C.amber} opacity={0.95}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={RED_WIRE_PATH} />
          </circle>
          <circle r={8} fill={continuity ? C.green : C.black} opacity={0.95}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={BLACK_WIRE_PATH} begin="-1.3s" />
          </circle>
          <path d={TOP_TEST_WIRE_PATH} stroke={continuity ? C.green : C.amber} strokeWidth={4} strokeDasharray="14 12" opacity={0.6} fill="none" />
        </g>
      ) : null}

      {probeState === "open" ? (
        <g stroke={C.red} strokeWidth={8} strokeLinecap="round">
          <line x1={1010} y1={360} x2={1080} y2={430} />
          <line x1={1080} y1={360} x2={1010} y2={430} />
        </g>
      ) : null}

      {probeState === "shorted" ? (
        <g>
          <path d="M884 403 C968 378 1125 377 1207 403" stroke={C.green} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.55} />
          <Label x={1045} y={360} size={25} fill={C.green}>
            Probes shorted: beep
          </Label>
        </g>
      ) : null}

      <ProbeBodies />
    </g>
  );
}

function ProbeBodies() {
  return (
    <g>
      <g>
        <path
          d="M727 798 L835 478 C842 458 859 455 874 469 L886 481 C895 491 897 505 891 520 L786 824 C781 838 768 846 754 839 L734 830 C724 825 722 811 727 798 Z"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M840 473 L879 402" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" />
        <path d="M879 402 L890 414" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" />
        <rect
          x={754}
          y={817}
          width={38}
          height={64}
          rx={6}
          transform="rotate(17 773 849)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <ellipse
          cx={830}
          cy={560}
          rx={22}
          ry={10}
          transform="rotate(17 830 560)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={777} y1={591} x2={817} y2={602} />
          <line x1={772} y1={604} x2={814} y2={616} />
          <line x1={768} y1={618} x2={810} y2={630} />
          <line x1={764} y1={632} x2={806} y2={644} />
          <line x1={760} y1={646} x2={802} y2={658} />
          <line x1={756} y1={660} x2={798} y2={672} />
        </g>
        <path d="M759 576 L698 779" stroke="#666" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
      </g>

      <g>
        <path
          d="M1358 780 L1215 510 C1207 493 1212 477 1227 470 L1247 461 C1262 454 1276 461 1284 477 L1400 740 C1406 755 1402 768 1387 775 L1370 783 C1365 786 1361 785 1358 780 Z"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M1213 505 L1207 403" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" />
        <path d="M1207 403 L1196 416" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" />
        <ellipse
          cx={1272}
          cy={561}
          rx={35}
          ry={16}
          transform="rotate(25 1272 561)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />
        <rect
          x={1340}
          y={793}
          width={39}
          height={63}
          rx={6}
          transform="rotate(-12 1359 824)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={1264} y1={600} x2={1305} y2={614} />
          <line x1={1268} y1={614} x2={1311} y2={628} />
          <line x1={1273} y1={628} x2={1317} y2={642} />
          <line x1={1278} y1={642} x2={1323} y2={656} />
          <line x1={1284} y1={656} x2={1329} y2={670} />
          <line x1={1290} y1={670} x2={1335} y2={684} />
          <line x1={1296} y1={684} x2={1341} y2={698} />
        </g>
        <path d="M1236 498 L1369 757" stroke="#ff7777" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
      </g>
    </g>
  );
}

function DebugDot({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const rightSide = x > 1100;
  const labelX = rightSide ? x - 14 : x + 14;
  const anchor = rightSide ? "end" : "start";

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <circle cx={x} cy={y} r={7} fill={color} stroke={C.white} strokeWidth={3} />
      <text
        x={labelX}
        y={y - 16}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={16}
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

function DebugLayer() {
  return (
    <g>
      <DebugDot x={PORT.com.x} y={PORT.com.y} label="COM" color={C.blue} />
      <DebugDot x={PORT.voltOhm.x} y={PORT.voltOhm.y} label="V/Ω" color={C.red} />
      <DebugDot x={NODE.blackProbeTip.x} y={NODE.blackProbeTip.y} label="BLACK TIP" color={C.black} />
      <DebugDot x={NODE.redProbeTip.x} y={NODE.redProbeTip.y} label="RED TIP" color={C.red} />
      <DebugDot x={NODE.testWireCenter.x} y={NODE.testWireCenter.y} label="TEST PATH" color={C.green} />
      <DebugDot x={NODE.display.x} y={NODE.display.y} label="DISPLAY" color={C.purple} />
    </g>
  );
}

function Callout({
  x,
  y,
  boxX,
  boxY,
  text,
  width = 220,
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
      <text
        x={boxX + width / 2}
        y={boxY + 19}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={700}
        fill={C.black}
      >
        {text}
      </text>
    </g>
  );
}

function BeginnerAnnotations() {
  return (
    <g>
      <Callout x={162} y={570} boxX={115} boxY={620} text="Continuity mode" width={200} color={C.blue} />
      <Callout x={PORT.com.x} y={PORT.com.y} boxX={115} boxY={900} text="Black lead to COM" width={220} color={C.black} />
      <Callout x={PORT.voltOhm.x} y={PORT.voltOhm.y} boxX={425} boxY={900} text="Red lead to V/Ω" width={220} color={C.red} />
      <Callout x={NODE.blackProbeTip.x} y={NODE.blackProbeTip.y} boxX={720} boxY={305} text="Black probe touches path" width={260} color={C.black} />
      <Callout x={NODE.redProbeTip.x} y={NODE.redProbeTip.y} boxX={1120} boxY={305} text="Red probe touches path" width={250} color={C.red} />
      <Callout x={NODE.testWireCenter.x} y={NODE.testWireCenter.y} boxX={900} boxY={455} text="Low resistance path" width={230} color={C.green} />
      <Callout x={NODE.display.x} y={NODE.display.y} boxX={610} boxY={130} text="Beep / resistance display" width={260} color={C.purple} />
    </g>
  );
}

function SimulationCanvas({
  displayText,
  dialMode,
  probeState,
  learningMode,
  showTestSignal,
  debug,
  continuity,
  safetyStatus,
}: {
  displayText: string;
  dialMode: DialMode;
  probeState: ProbeState;
  learningMode: LearningMode;
  showTestSignal: boolean;
  debug: boolean;
  continuity: boolean;
  safetyStatus: SafetyStatus;
}) {
  return (
    <div
      role="region"
      aria-label="Interactive continuity test canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Digital multimeter continuity test sketch"
      >
        <rect width="1448" height="1086" fill={C.white} />

        <MeterBody
          displayText={displayText}
          dialMode={dialMode}
          continuity={continuity}
          safetyStatus={safetyStatus}
        />

        <MeterPortsAndPlugs />

        <WiresAndProbes
          probeState={probeState}
          continuity={continuity}
          showTestSignal={showTestSignal}
        />

        {safetyStatus.tone === "bad" ? (
          <g>
            <rect x={690} y={705} width={520} height={78} rx={14} fill="#fee2e2" stroke={C.red} strokeWidth={4} />
            <Label x={950} y={733} size={23} fill={C.red}>
              Do not continuity-test powered circuits
            </Label>
            <Label x={950} y={760} size={17} fill={C.red}>
              Turn power OFF first
            </Label>
          </g>
        ) : null}

        {safetyStatus.tone === "warn" && safetyStatus.label !== "No continuity" && safetyStatus.label !== "Meter is OFF" ? (
          <g>
            <rect x={690} y={705} width={430} height={72} rx={14} fill="#fef3c7" stroke={C.amber} strokeWidth={4} />
            <Label x={905} y={731} size={23} fill="#92400e">
              Check continuity setup
            </Label>
            <Label x={905} y={758} size={17} fill="#92400e">
              Select continuity and complete the path
            </Label>
          </g>
        ) : null}

        {learningMode === "beginner" ? <BeginnerAnnotations /> : null}
        {debug ? <DebugLayer /> : null}
      </svg>
    </div>
  );
}

export default function ContinuityMeterSketch({
  className = "",
  initialDebug = false,
}: ContinuityMeterSketchProps) {
  const [testResistance, setTestResistanceState] = useState(0);
  const [threshold, setThresholdState] = useState(30);
  const [dialMode, setDialModeState] = useState<DialMode>("continuity");
  const [probeState, setProbeStateState] = useState<ProbeState>("shorted");
  const [externalPower, setExternalPowerState] = useState(false);
  const [learningMode, setLearningModeState] = useState<LearningMode>("normal");
  const [showTestSignal, setShowTestSignalState] = useState(true);
  const [debug, setDebugState] = useState(initialDebug);
  const [quizChecked, setQuizChecked] = useState(false);

  function markQuizDirty() {
    setQuizChecked(false);
  }

  function setTestResistance(value: number) {
    setTestResistanceState(value);
    markQuizDirty();
  }

  function setThreshold(value: number) {
    setThresholdState(value);
    markQuizDirty();
  }

  function setDialMode(value: DialMode) {
    setDialModeState(value);
    markQuizDirty();
  }

  function setProbeState(value: ProbeState) {
    setProbeStateState(value);
    markQuizDirty();
  }

  function setExternalPower(value: boolean) {
    setExternalPowerState(value);
    markQuizDirty();
  }

  function setLearningMode(value: LearningMode) {
    setLearningModeState(value);
    setQuizChecked(false);
  }

  const simulation = useMemo(() => {
    const measuredResistance = calculateMeasuredResistance({
      resistance: testResistance,
      probeState,
      externalPower,
    });

    const continuity = isContinuity({
      measuredResistance,
      threshold,
      externalPower,
    });

    const displayText = getDisplayText({
      dialMode,
      measuredResistance,
      continuity,
      externalPower,
    });

    const safetyStatus = getSafetyStatus({
      dialMode,
      probeState,
      externalPower,
      continuity,
      measuredResistance,
      threshold,
    });

    const quizFeedback = getLearningFeedback({
      dialMode,
      probeState,
      externalPower,
      continuity,
    });

    return {
      measuredResistance,
      continuity,
      displayText,
      safetyStatus,
      quizFeedback,
    };
  }, [dialMode, externalPower, probeState, testResistance, threshold]);

  function onCheckQuiz() {
    setQuizChecked(true);
  }

  function reset() {
    setTestResistanceState(0);
    setThresholdState(30);
    setDialModeState("continuity");
    setProbeStateState("shorted");
    setExternalPowerState(false);
    setLearningModeState("normal");
    setShowTestSignalState(true);
    setDebugState(initialDebug);
    setQuizChecked(false);
  }

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ControlPanel
          testResistance={testResistance}
          setTestResistance={setTestResistance}
          threshold={threshold}
          setThreshold={setThreshold}
          dialMode={dialMode}
          setDialMode={setDialMode}
          probeState={probeState}
          setProbeState={setProbeState}
          externalPower={externalPower}
          setExternalPower={setExternalPower}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          showTestSignal={showTestSignal}
          setShowTestSignal={setShowTestSignalState}
          debug={debug}
          setDebug={setDebugState}
          displayText={simulation.displayText}
          measuredResistance={simulation.measuredResistance}
          continuity={simulation.continuity}
          safetyStatus={simulation.safetyStatus}
          quizChecked={quizChecked}
          quizFeedback={quizChecked ? simulation.quizFeedback : null}
          onCheckQuiz={onCheckQuiz}
          reset={reset}
        />

        <SimulationCanvas
          displayText={simulation.displayText}
          dialMode={dialMode}
          probeState={probeState}
          learningMode={learningMode}
          showTestSignal={showTestSignal}
          debug={debug}
          continuity={simulation.continuity}
          safetyStatus={simulation.safetyStatus}
        />
      </div>
    </div>
  );
}