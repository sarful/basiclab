"use client";

import React, { useMemo, useState } from "react";

type AcVoltageSocketSketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type DialMode = "off" | "vac" | "vdc" | "ohm" | "adc" | "continuity" | "diode";
type RedLeadPort = "VΩ" | "10A";
type LeadConnection = "connected" | "redOpen" | "blackOpen";
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
  white: "#ffffff",
  black: "#101010",
  dark: "#202020",
  dark2: "#333333",
  red: "#e31622",
  redDark: "#a70e17",
  soft: "#f8f8f8",
  gray: "#6b7280",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  purple: "#9333ea",
};

const PORT = {
  tenA: { x: 212, y: 650 },
  com: { x: 287, y: 650 },
  extra: { x: 363, y: 650 },
  voltOhm: { x: 443, y: 650 },
};

const NODE = {
  meterDisplay: { x: 326, y: 208 },
  dialCenter: { x: 326, y: 462 },
  leftSocketHole: { x: 981, y: 457 },
  rightSocketHole: { x: 1110, y: 457 },
  blackProbeBody: { x: 884, y: 704 },
  redProbeBody: { x: 1200, y: 704 },
};

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

const BLACK_WIRE_PATH =
  "M287 733 C288 834 344 918 445 949 C557 984 718 958 784 848 C827 777 850 707 883 638";

const RED_WIRE_VOLT_PATH =
  "M444 733 C448 823 510 908 654 958 C823 1017 1099 1020 1194 966 C1261 928 1247 845 1218 738";

const RED_WIRE_10A_PATH =
  "M212 733 C226 831 319 915 480 958 C676 1010 1092 1022 1194 966 C1261 928 1247 845 1218 738";

function calculateMeasuredVoltage({
  socketVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
}: {
  socketVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
}) {
  if (dialMode !== "vac") return 0;
  if (redLeadPort !== "VΩ") return 0;
  if (leadConnection !== "connected") return 0;
  return socketVoltage;
}

function getDisplayText({
  socketVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
}: {
  socketVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
}) {
  if (dialMode === "off") return "OFF";
  if (redLeadPort === "10A") return "LEAD";
  if (leadConnection !== "connected") return "OPEN";

  if (dialMode === "vac") return `${Math.round(socketVoltage)}`;
  if (dialMode === "vdc") return "0";
  if (dialMode === "ohm") return "OL";
  if (dialMode === "adc") return "0.00A";
  if (dialMode === "continuity") return "OPEN";
  if (dialMode === "diode") return "----";

  return "----";
}

function getSafetyStatus({
  dialMode,
  redLeadPort,
  leadConnection,
  measuredVoltage,
}: {
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  measuredVoltage: number;
}): SafetyStatus {
  if (dialMode === "off") {
    return {
      label: "Meter is OFF",
      detail: "Turn the dial to V AC to measure AC socket voltage.",
      tone: "neutral",
    };
  }

  if (redLeadPort === "10A") {
    return {
      label: "Wrong red port",
      detail: "Voltage measurement must use the V/Ω port, not the 10A current port.",
      tone: "bad",
    };
  }

  if (leadConnection === "redOpen") {
    return {
      label: "Red probe open",
      detail: "The red probe is not touching the socket contact.",
      tone: "warn",
    };
  }

  if (leadConnection === "blackOpen") {
    return {
      label: "Black probe open",
      detail: "The black probe is not touching the socket contact.",
      tone: "warn",
    };
  }

  if (dialMode !== "vac") {
    return {
      label: "Wrong dial mode",
      detail: "Select V AC, usually written as V~.",
      tone: "warn",
    };
  }

  return {
    label: "Correct AC voltage setup",
    detail: `The meter is reading about ${measuredVoltage.toFixed(0)} V AC.`,
    tone: "good",
  };
}

function getLearningFeedback({
  dialMode,
  redLeadPort,
  leadConnection,
}: {
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
}): QuizFeedback {
  const dialCorrect = dialMode === "vac";
  const portCorrect = redLeadPort === "VΩ";
  const probesCorrect = leadConnection === "connected";
  const allCorrect = dialCorrect && portCorrect && probesCorrect;

  return {
    allCorrect,
    messages: [
      dialCorrect ? "Dial mode is correct: V AC is selected." : "Dial mode is wrong: select V AC / V~.",
      portCorrect ? "Red lead port is correct: V/Ω is selected." : "Red lead port is wrong: use V/Ω, not 10A.",
      probesCorrect ? "Probe contact is correct: both probes touch the socket contacts." : "Probe contact is incomplete: both probes must touch the socket contacts.",
    ],
  };
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "vac":
      return 32;
    case "vdc":
      return -65;
    case "ohm":
      return -18;
    case "adc":
      return 95;
    case "continuity":
      return 70;
    case "diode":
      return 118;
    case "off":
      return 170;
    default:
      return 32;
  }
}

function getRedWirePath(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? RED_WIRE_VOLT_PATH : RED_WIRE_10A_PATH;
}

function getRedPort(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? PORT.voltOhm : PORT.tenA;
}

function Label({
  x,
  y,
  children,
  size = 28,
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

  const paths: Record<Segment, string> = {
    a: "M14 0 H75 L86 10 L75 20 H14 L3 10 Z",
    b: "M87 14 L104 27 V73 L93 84 L77 73 V27 Z",
    c: "M87 93 L104 106 V151 L93 162 L77 151 V106 Z",
    d: "M14 157 H75 L86 167 L75 177 H14 L3 167 Z",
    e: "M0 93 L17 106 V151 L6 162 L-10 151 V106 Z",
    f: "M0 14 L17 27 V73 L6 84 L-10 73 V27 Z",
    g: "M14 78 H75 L86 88 L75 98 H14 L3 88 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={C.black}>
      {active.map((seg) => (
        <path key={seg} d={paths[seg]} />
      ))}
    </g>
  );
}

function DynamicDisplay({ value }: { value: string }) {
  const onlyDigits = /^\d{1,3}$/.test(value);

  if (onlyDigits) {
    const padded = value.padStart(3, " ");
    const chars = padded.split("");

    return (
      <g>
        <rect x={197} y={157} width={256} height={101} rx={4} fill={C.white} />
        {chars.map((char, index) =>
          char === " " ? null : (
            <SevenSegmentDigit
              key={`${char}-${index}`}
              digit={char}
              x={258 + index * 67}
              y={161}
              scale={0.5}
            />
          )
        )}
      </g>
    );
  }

  const fontSize = value.length > 5 ? 44 : 56;

  return (
    <g>
      <rect x={197} y={157} width={256} height={101} rx={4} fill={C.white} />
      <text
        x={326}
        y={208}
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

function Wire({
  d,
  color,
  shadow,
  width = 9,
  active = true,
}: {
  d: string;
  color: string;
  shadow: string;
  width?: number;
  active?: boolean;
}) {
  const wireColor = active ? color : C.gray;
  const shadowColor = active ? shadow : "#4b5563";

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadowColor} strokeWidth={width + 4} opacity={active ? 0.55 : 0.25} />
      <path d={d} stroke={wireColor} strokeWidth={width} opacity={active ? 1 : 0.5} />
      <path d={d} stroke={C.white} strokeWidth={1.6} opacity={active ? 0.22 : 0.1} />
    </g>
  );
}

function ACSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 7 * scale} ${y - 9 * scale}, ${
        x + 17 * scale
      } ${y + 9 * scale}, ${x + 27 * scale} ${y} S${x + 46 * scale} ${
        y - 9 * scale
      }, ${x + 55 * scale} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function SmallTickGroup() {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={317} y1={351} x2={317} y2={366} />
      <line x1={265} y1={367} x2={277} y2={380} />
      <line x1={230} y1={404} x2={248} y2={404} />
      <line x1={215} y1={461} x2={231} y2={461} />
      <line x1={228} y1={518} x2={246} y2={518} />
      <line x1={384} y1={367} x2={372} y2={380} />
      <line x1={423} y1={404} x2={405} y2={404} />
      <line x1={436} y1={461} x2={419} y2={461} />
    </g>
  );
}

function MeterPort({
  cx,
  cy,
  filled,
  fill = C.white,
  active = false,
}: {
  cx: number;
  cy: number;
  filled?: boolean;
  fill?: string;
  active?: boolean;
}) {
  return (
    <g>
      {active ? <circle cx={cx} cy={cy} r={31} fill="none" stroke={fill} strokeWidth={4} opacity={0.45} /> : null}
      <circle cx={cx} cy={cy} r={24} fill={C.white} stroke={C.black} strokeWidth={4} />
      <circle
        cx={cx}
        cy={cy}
        r={15}
        fill={filled ? fill : C.white}
        stroke={C.black}
        strokeWidth={4}
      />
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
          {value.toFixed(0)}
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
  socketVoltage,
  setSocketVoltage,
  dialMode,
  setDialMode,
  redLeadPort,
  setRedLeadPort,
  leadConnection,
  setLeadConnection,
  learningMode,
  setLearningMode,
  showVoltagePath,
  setShowVoltagePath,
  debug,
  setDebug,
  displayText,
  measuredVoltage,
  safetyStatus,
  quizChecked,
  quizFeedback,
  onCheckQuiz,
  reset,
}: {
  socketVoltage: number;
  setSocketVoltage: (value: number) => void;
  dialMode: DialMode;
  setDialMode: (value: DialMode) => void;
  redLeadPort: RedLeadPort;
  setRedLeadPort: (value: RedLeadPort) => void;
  leadConnection: LeadConnection;
  setLeadConnection: (value: LeadConnection) => void;
  learningMode: LearningMode;
  setLearningMode: (value: LearningMode) => void;
  showVoltagePath: boolean;
  setShowVoltagePath: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  displayText: string;
  measuredVoltage: number;
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
      aria-label="AC voltage socket simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">AC Voltage Measurement</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Simulate measuring wall-socket voltage with the meter on V~ mode.
        </p>
      </div>

      <div className="space-y-3">
        <PanelSection title="Learning Mode" helper="Choose how much guidance appears.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={learningMode === "normal"} onClick={() => setLearningMode("normal")} ariaLabel="Normal learning mode">
              Normal
            </ToggleButton>
            <ToggleButton active={learningMode === "beginner"} onClick={() => setLearningMode("beginner")} ariaLabel="Beginner learning mode">
              Beginner
            </ToggleButton>
            <ToggleButton active={learningMode === "quiz"} onClick={() => setLearningMode("quiz")} ariaLabel="Quiz learning mode">
              Quiz
            </ToggleButton>
          </div>

          {learningMode === "beginner" ? (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              AC voltage is measured using V~ mode. The meter compares the two socket contacts.
            </div>
          ) : null}

          {learningMode === "quiz" ? (
            <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs leading-5 text-purple-800">
              Choose V AC, V/Ω red port, and connected probes. Then press Check Answer.
            </div>
          ) : null}
        </PanelSection>

        <RangeControl
          label="Socket voltage"
          value={socketVoltage}
          min={90}
          max={250}
          step={1}
          unit="V"
          onChange={setSocketVoltage}
        />

        <PanelSection title="Dial mode" helper="For a wall socket, use V AC / V~.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={dialMode === "off"} onClick={() => setDialMode("off")} ariaLabel="Set dial off">
              OFF
            </ToggleButton>
            <ToggleButton active={dialMode === "vac"} onClick={() => setDialMode("vac")} ariaLabel="Set dial to AC voltage">
              V AC
            </ToggleButton>
            <ToggleButton active={dialMode === "vdc"} onClick={() => setDialMode("vdc")} ariaLabel="Set dial to DC voltage">
              V DC
            </ToggleButton>
            <ToggleButton active={dialMode === "ohm"} onClick={() => setDialMode("ohm")} ariaLabel="Set dial to resistance">
              Ω
            </ToggleButton>
            <ToggleButton active={dialMode === "adc"} onClick={() => setDialMode("adc")} ariaLabel="Set dial to DC current">
              A DC
            </ToggleButton>
            <ToggleButton active={dialMode === "continuity"} onClick={() => setDialMode("continuity")} ariaLabel="Set dial to continuity">
              Continuity
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Red lead port" helper="Voltage uses V/Ω. The 10A port is for current, not voltage.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={redLeadPort === "VΩ"} onClick={() => setRedLeadPort("VΩ")} ariaLabel="Move red lead to V ohm port">
              V/Ω
            </ToggleButton>
            <ToggleButton active={redLeadPort === "10A"} onClick={() => setRedLeadPort("10A")} ariaLabel="Move red lead to 10 amp port">
              10A
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Probe contact" helper="Both probes must touch the two socket contacts in the simulation.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={leadConnection === "connected"} onClick={() => setLeadConnection("connected")} ariaLabel="Connect both probes">
              Connected
            </ToggleButton>
            <ToggleButton active={leadConnection === "redOpen"} onClick={() => setLeadConnection("redOpen")} ariaLabel="Disconnect red probe">
              Red open
            </ToggleButton>
            <ToggleButton active={leadConnection === "blackOpen"} onClick={() => setLeadConnection("blackOpen")} ariaLabel="Disconnect black probe">
              Black open
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Display options" helper="Show learning overlays and terminal debug dots.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={showVoltagePath} onClick={() => setShowVoltagePath(!showVoltagePath)} ariaLabel="Toggle voltage path">
              Voltage path
            </ToggleButton>
            <ToggleButton active={debug} onClick={() => setDebug(!debug)} ariaLabel="Toggle debug dots">
              Debug dots
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Live result" helper="The display follows the selected meter setup.">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Meter display</div>
              <div className="font-bold text-slate-900">{displayText}</div>
            </div>
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Measured AC voltage</div>
              <div className="font-bold text-slate-900">{measuredVoltage.toFixed(0)} V</div>
            </div>
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
            title="AC voltage"
            text="AC voltage changes direction repeatedly, so the meter must be on V AC / V~ mode."
            tone={dialMode === "vac" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Correct ports"
            text="Black lead goes to COM. Red lead goes to V/Ω for voltage measurement."
            tone={redLeadPort === "VΩ" ? "good" : "bad"}
          />
          <ExplanationCard
            title="Probe contact"
            text="The meter reads voltage between two socket contacts when both probes are connected."
            tone={leadConnection === "connected" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Safety"
            text="This is a simulation. Real mains voltage is dangerous and should only be tested by trained people using rated equipment."
            tone="bad"
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

function Multimeter({
  displayText,
  dialMode,
  redLeadPort,
  safetyStatus,
}: {
  displayText: string;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  safetyStatus: SafetyStatus;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect x={136} y={88} width={378} height={657} rx={37} fill={C.white} stroke={C.black} strokeWidth={6} />
      <rect x={166} y={124} width={317} height={586} rx={28} fill={C.white} stroke={C.black} strokeWidth={4} />

      <rect x={190} y={148} width={271} height={120} rx={8} fill={C.white} stroke={C.black} strokeWidth={4} />
      <rect x={197} y={157} width={256} height={101} rx={4} fill={C.white} stroke={C.black} strokeWidth={2.5} />

      <DynamicDisplay value={displayText} />

      <rect x={188} y={292} width={48} height={27} rx={12} fill={C.white} stroke={C.black} strokeWidth={4} />

      <Label x={383} y={318} size={35}>
        V~
      </Label>

      <circle cx={326} cy={462} r={98} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={326} cy={462} r={87} fill={C.white} stroke={C.black} strokeWidth={3} />

      <SmallTickGroup />

      <g transform={`rotate(${dialAngle} 326 462)`}>
        <rect x={307} y={368} width={38} height={193} rx={20} fill={C.white} stroke={C.black} strokeWidth={5} />
        <ellipse
          cx={366}
          cy={412}
          rx={6}
          ry={11}
          transform="rotate(32 366 412)"
          fill={C.white}
          stroke={safetyStatus.tone === "bad" ? C.red : C.black}
          strokeWidth={3}
        />
      </g>

      <MeterPort cx={PORT.tenA.x} cy={PORT.tenA.y} active={redLeadPort === "10A"} />
      <MeterPort cx={PORT.com.x} cy={PORT.com.y} filled fill={C.dark} active />
      <MeterPort cx={PORT.extra.x} cy={PORT.extra.y} />
      <MeterPort cx={PORT.voltOhm.x} cy={PORT.voltOhm.y} filled fill={C.red} active={redLeadPort === "VΩ"} />

      <Label x={PORT.tenA.x} y={612} size={18} fill={redLeadPort === "10A" ? C.red : C.black}>
        10A
      </Label>
      <Label x={PORT.com.x} y={612} size={18}>
        COM
      </Label>
      <Label x={PORT.voltOhm.x} y={612} size={18}>
        V/Ω
      </Label>

      <g>
        <rect x={265} y={626} width={43} height={67} rx={9} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={273} y={684} width={26} height={48} rx={5} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={276} y1={692} x2={297} y2={692} />
          <line x1={278} y1={701} x2={295} y2={701} />
          <line x1={280} y1={711} x2={293} y2={711} />
        </g>
      </g>

      <RedPlugInMeter redLeadPort={redLeadPort} />
    </g>
  );
}

function RedPlugInMeter({ redLeadPort }: { redLeadPort: RedLeadPort }) {
  const port = getRedPort(redLeadPort);

  return (
    <g>
      <rect
        x={port.x - 19}
        y={626}
        width={41}
        height={67}
        rx={10}
        fill={C.red}
        stroke={C.redDark}
        strokeWidth={4}
      />
      <rect
        x={port.x - 11}
        y={684}
        width={24}
        height={49}
        rx={5}
        fill={C.red}
        stroke={C.redDark}
        strokeWidth={4}
      />
      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={port.x - 9} y1={692} x2={port.x + 13} y2={692} />
        <line x1={port.x - 7} y1={701} x2={port.x + 11} y2={701} />
        <line x1={port.x - 5} y1={711} x2={port.x + 9} y2={711} />
      </g>
    </g>
  );
}

function WallSocket() {
  return (
    <g>
      <rect x={852} y={268} width={386} height={365} rx={23} fill={C.white} stroke={C.black} strokeWidth={4} />
      <rect x={900} y={318} width={292} height={271} rx={13} fill={C.white} stroke={C.black} strokeWidth={4} />

      <circle cx={1045} cy={459} r={114} fill={C.white} stroke={C.black} strokeWidth={4} />

      <path d="M1032 341 H1058 V368 H1032 Z" fill={C.white} stroke={C.black} strokeWidth={4} strokeLinejoin="round" />
      <path d="M1040 341 V361 H1050 V341" fill="none" stroke={C.black} strokeWidth={3} />

      <path d="M1032 543 H1058 V571 H1032 Z" fill={C.white} stroke={C.black} strokeWidth={4} strokeLinejoin="round" />
      <path d="M1040 571 V551 H1050 V571" fill="none" stroke={C.black} strokeWidth={3} />

      <circle cx={981} cy={457} r={16} fill={C.white} stroke={C.black} strokeWidth={4} />
      <circle cx={1110} cy={457} r={16} fill={C.white} stroke={C.black} strokeWidth={4} />

      <path d="M981 457 L960 528" fill="none" stroke={C.black} strokeWidth={6} strokeLinecap="round" />
      <path d="M1110 457 L1136 527" fill="none" stroke={C.black} strokeWidth={6} strokeLinecap="round" />
      <path d="M981 457 L964 513" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      <path d="M1110 457 L1130 514" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

function ProbesAndWires({
  redLeadPort,
  leadConnection,
  showVoltagePath,
}: {
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  showVoltagePath: boolean;
}) {
  const redWire = getRedWirePath(redLeadPort);
  const redActive = redLeadPort === "VΩ" && leadConnection !== "redOpen";
  const blackActive = leadConnection !== "blackOpen";

  return (
    <g>
      <Wire d={BLACK_WIRE_PATH} color={C.black} shadow="#000000" width={8} active={blackActive} />
      <Wire d={redWire} color={C.red} shadow={C.redDark} width={8} active={redActive} />

      {showVoltagePath && redActive && blackActive ? (
        <g>
          <path d={BLACK_WIRE_PATH} stroke={C.black} strokeWidth={3} strokeDasharray="16 18" fill="none" opacity={0.32} />
          <path d={redWire} stroke={C.redDark} strokeWidth={3} strokeDasharray="16 18" fill="none" opacity={0.42} />
          <path d="M981 457 H1110" stroke={C.green} strokeWidth={5} strokeDasharray="12 10" opacity={0.7} />
          <Label x={1045} y={420} size={22} fill={C.green}>
            AC voltage across socket contacts
          </Label>
        </g>
      ) : null}

      <g opacity={blackActive ? 1 : 0.35}>
        <path
          d="M875 553 L926 575 L868 734 C862 749 847 754 836 744 L821 732 C815 727 813 719 816 711 Z"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect
          x={847}
          y={540}
          width={55}
          height={41}
          rx={7}
          transform="rotate(19 874 560)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />
        <ellipse
          cx={884}
          cy={704}
          rx={30}
          ry={8}
          transform="rotate(18 884 704)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />
        <rect
          x={851}
          y={714}
          width={28}
          height={36}
          rx={5}
          transform="rotate(18 865 732)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
      </g>

      <g opacity={redActive ? 1 : 0.35}>
        <path
          d="M1136 527 L1178 514 L1235 699 C1240 715 1234 727 1221 731 L1205 736 C1192 740 1183 733 1178 718 Z"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect
          x={1131}
          y={523}
          width={47}
          height={43}
          rx={7}
          transform="rotate(-15 1154 544)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />
        <ellipse
          cx={1200}
          cy={704}
          rx={30}
          ry={8}
          transform="rotate(-15 1200 704)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />
        <rect
          x={1202}
          y={714}
          width={27}
          height={40}
          rx={5}
          transform="rotate(-15 1215 734)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
      </g>

      {leadConnection === "redOpen" ? (
        <g stroke={C.red} strokeWidth={7} strokeLinecap="round">
          <line x1={1090} y1={430} x2={1130} y2={470} />
          <line x1={1130} y1={430} x2={1090} y2={470} />
        </g>
      ) : null}

      {leadConnection === "blackOpen" ? (
        <g stroke={C.red} strokeWidth={7} strokeLinecap="round">
          <line x1={960} y1={430} x2={1000} y2={470} />
          <line x1={1000} y1={430} x2={960} y2={470} />
        </g>
      ) : null}
    </g>
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

function DebugLayer({ redLeadPort }: { redLeadPort: RedLeadPort }) {
  const redPort = getRedPort(redLeadPort);

  return (
    <g>
      <DebugDot x={PORT.com.x} y={PORT.com.y} label="COM" color={C.blue} />
      <DebugDot x={redPort.x} y={redPort.y} label={redLeadPort} color={C.red} />
      <DebugDot x={NODE.leftSocketHole.x} y={NODE.leftSocketHole.y} label="SOCKET L" color={C.black} />
      <DebugDot x={NODE.rightSocketHole.x} y={NODE.rightSocketHole.y} label="SOCKET R" color={C.red} />
      <DebugDot x={NODE.meterDisplay.x} y={NODE.meterDisplay.y} label="DISPLAY" color={C.green} />
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

function BeginnerAnnotations({ redLeadPort }: { redLeadPort: RedLeadPort }) {
  const redPort = getRedPort(redLeadPort);

  return (
    <g>
      <Callout x={383} y={318} boxX={480} boxY={285} text="Set dial to V~" width={190} color={C.blue} />
      <Callout x={PORT.com.x} y={PORT.com.y} boxX={145} boxY={785} text="Black lead to COM" width={210} color={C.black} />
      <Callout
        x={redPort.x}
        y={redPort.y}
        boxX={400}
        boxY={790}
        text={redLeadPort === "VΩ" ? "Red lead to V/Ω" : "Wrong: 10A port"}
        width={220}
        color={C.red}
      />
      <Callout x={NODE.leftSocketHole.x} y={NODE.leftSocketHole.y} boxX={735} boxY={365} text="Probe in socket contact" width={240} color={C.black} />
      <Callout x={NODE.rightSocketHole.x} y={NODE.rightSocketHole.y} boxX={1135} boxY={365} text="Probe in other contact" width={240} color={C.red} />
      <Callout x={1045} y={459} boxX={900} boxY={650} text="Measure across two contacts" width={260} color={C.green} />
      <Callout x={326} y={208} boxX={520} boxY={150} text="AC voltage reading" width={220} color={C.purple} />
    </g>
  );
}

function SimulationCanvas({
  socketVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
  learningMode,
  showVoltagePath,
  debug,
  displayText,
  safetyStatus,
}: {
  socketVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  learningMode: LearningMode;
  showVoltagePath: boolean;
  debug: boolean;
  displayText: string;
  safetyStatus: SafetyStatus;
}) {
  return (
    <div
      role="region"
      aria-label="Interactive AC voltage socket canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Digital multimeter measuring AC voltage from wall socket"
      >
        <rect width="1448" height="1086" fill={C.white} />

        <Multimeter
          displayText={displayText}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          safetyStatus={safetyStatus}
        />

        <WallSocket />

        <ProbesAndWires
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
        />

        <Label x={1045} y={250} size={26} fill={C.gray}>
          {socketVoltage.toFixed(0)}V AC socket
        </Label>

        {safetyStatus.tone === "bad" ? (
          <g>
            <rect x={620} y={720} width={475} height={74} rx={14} fill="#fee2e2" stroke={C.red} strokeWidth={4} />
            <Label x={858} y={746} size={23} fill={C.red}>
              Wrong port for voltage measurement
            </Label>
            <Label x={858} y={773} size={17} fill={C.red}>
              Use V/Ω, not the 10A current port
            </Label>
          </g>
        ) : null}

        {safetyStatus.tone === "warn" && safetyStatus.label !== "Meter is OFF" && redLeadPort === "VΩ" ? (
          <g>
            <rect x={620} y={720} width={420} height={70} rx={14} fill="#fef3c7" stroke={C.amber} strokeWidth={4} />
            <Label x={830} y={746} size={23} fill="#92400e">
              Check AC meter setup
            </Label>
            <Label x={830} y={772} size={17} fill="#92400e">
              Use V~ and connect both probes
            </Label>
          </g>
        ) : null}

        {learningMode === "beginner" ? <BeginnerAnnotations redLeadPort={redLeadPort} /> : null}
        {debug ? <DebugLayer redLeadPort={redLeadPort} /> : null}
      </svg>
    </div>
  );
}

export default function AcVoltageSocketSketch({
  className = "",
  initialDebug = false,
}: AcVoltageSocketSketchProps) {
  const [socketVoltage, setSocketVoltageState] = useState(230);
  const [dialMode, setDialModeState] = useState<DialMode>("vac");
  const [redLeadPort, setRedLeadPortState] = useState<RedLeadPort>("VΩ");
  const [leadConnection, setLeadConnectionState] = useState<LeadConnection>("connected");
  const [learningMode, setLearningModeState] = useState<LearningMode>("normal");
  const [showVoltagePath, setShowVoltagePathState] = useState(true);
  const [debug, setDebugState] = useState(initialDebug);
  const [quizChecked, setQuizChecked] = useState(false);

  function markQuizDirty() {
    setQuizChecked(false);
  }

  function setSocketVoltage(value: number) {
    setSocketVoltageState(value);
    markQuizDirty();
  }

  function setDialMode(value: DialMode) {
    setDialModeState(value);
    markQuizDirty();
  }

  function setRedLeadPort(value: RedLeadPort) {
    setRedLeadPortState(value);
    markQuizDirty();
  }

  function setLeadConnection(value: LeadConnection) {
    setLeadConnectionState(value);
    markQuizDirty();
  }

  function setLearningMode(value: LearningMode) {
    setLearningModeState(value);
    setQuizChecked(false);
  }

  const simulation = useMemo(() => {
    const measuredVoltage = calculateMeasuredVoltage({
      socketVoltage,
      dialMode,
      redLeadPort,
      leadConnection,
    });

    const displayText = getDisplayText({
      socketVoltage,
      dialMode,
      redLeadPort,
      leadConnection,
    });

    const safetyStatus = getSafetyStatus({
      dialMode,
      redLeadPort,
      leadConnection,
      measuredVoltage,
    });

    const quizFeedback = getLearningFeedback({
      dialMode,
      redLeadPort,
      leadConnection,
    });

    return {
      measuredVoltage,
      displayText,
      safetyStatus,
      quizFeedback,
    };
  }, [socketVoltage, dialMode, redLeadPort, leadConnection]);

  function onCheckQuiz() {
    setQuizChecked(true);
  }

  function reset() {
    setSocketVoltageState(230);
    setDialModeState("vac");
    setRedLeadPortState("VΩ");
    setLeadConnectionState("connected");
    setLearningModeState("normal");
    setShowVoltagePathState(true);
    setDebugState(initialDebug);
    setQuizChecked(false);
  }

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ControlPanel
          socketVoltage={socketVoltage}
          setSocketVoltage={setSocketVoltage}
          dialMode={dialMode}
          setDialMode={setDialMode}
          redLeadPort={redLeadPort}
          setRedLeadPort={setRedLeadPort}
          leadConnection={leadConnection}
          setLeadConnection={setLeadConnection}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          showVoltagePath={showVoltagePath}
          setShowVoltagePath={setShowVoltagePathState}
          debug={debug}
          setDebug={setDebugState}
          displayText={simulation.displayText}
          measuredVoltage={simulation.measuredVoltage}
          safetyStatus={simulation.safetyStatus}
          quizChecked={quizChecked}
          quizFeedback={quizChecked ? simulation.quizFeedback : null}
          onCheckQuiz={onCheckQuiz}
          reset={reset}
        />

        <SimulationCanvas
          socketVoltage={socketVoltage}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          learningMode={learningMode}
          showVoltagePath={showVoltagePath}
          debug={debug}
          displayText={simulation.displayText}
          safetyStatus={simulation.safetyStatus}
        />
      </div>
    </div>
  );
}