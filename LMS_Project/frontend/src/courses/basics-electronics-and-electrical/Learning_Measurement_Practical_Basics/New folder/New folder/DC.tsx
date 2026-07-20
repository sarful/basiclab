"use client";

import React, { useMemo, useState } from "react";

type SketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type DialMode = "off" | "vdc" | "vac" | "ohm" | "adc" | "aac" | "continuity" | "diode";
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

const BLACK = "#111111";
const DARK = "#222222";
const RED = "#e5252a";
const RED_DARK = "#9f151b";
const WHITE = "#ffffff";
const GRAY = "#6b7280";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#f59e0b";
const PURPLE = "#9333ea";

const stroke = {
  thin: 2.5,
  base: 4,
  bold: 6,
  wire: 10,
};

const PORT = {
  com: { x: 244, y: 704 },
  tenA: { x: 351, y: 704 },
  voltOhm: { x: 455, y: 704 },
};

const NODE = {
  batteryNegative: { x: 949, y: 681 },
  batteryPositive: { x: 1155, y: 705 },
  redProbeTip: { x: 1155, y: 705 },
  blackProbeTip: { x: 949, y: 681 },
  meterDisplay: { x: 347, y: 179 },
  dialCenter: { x: 346, y: 456 },
} as const;

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const DIGIT_SEGMENTS: Record<string, SegmentName[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "c", "d", "e"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

const BLACK_WIRE =
  "M244 729 C242 800 244 850 274 890 C333 966 514 994 626 894 C690 837 678 740 728 655";

const BLACK_LEAD_TO_BATTERY =
  "M825 477 C874 438 931 460 936 523 C939 563 941 604 947 646";

const RED_WIRE_VOLT =
  "M455 729 C455 820 511 905 640 954 C780 1008 1067 1013 1234 960 C1320 932 1327 817 1296 678 C1277 589 1240 512 1186 505 C1154 501 1139 532 1144 583 C1148 626 1150 647 1153 673";

const RED_WIRE_10A =
  "M351 729 C360 810 432 900 580 952 C735 1007 1060 1015 1234 960 C1320 932 1327 817 1296 678 C1277 589 1240 512 1186 505 C1154 501 1139 532 1144 583 C1148 626 1150 647 1153 673";

function calculateMeasuredVoltage({
  batteryVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
}: {
  batteryVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
}) {
  if (dialMode !== "vdc") return 0;
  if (redLeadPort !== "VΩ") return 0;
  if (leadConnection !== "connected") return 0;
  return batteryVoltage;
}

function getDisplayText({
  batteryVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
}: {
  batteryVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
}) {
  if (dialMode === "off") return "OFF";
  if (redLeadPort === "10A") return "LEAD";
  if (leadConnection !== "connected") return "OPEN";

  if (dialMode === "vdc") return `${batteryVoltage.toFixed(2)}V`;
  if (dialMode === "vac") return "0.00V";
  if (dialMode === "ohm") return "OL";
  if (dialMode === "adc") return "0.00A";
  if (dialMode === "aac") return "0.00A";
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
      detail: "Turn the dial to V DC to measure battery voltage.",
      tone: "neutral",
    };
  }

  if (redLeadPort === "10A") {
    return {
      label: "Wrong red port",
      detail: "Do not measure voltage from the 10A port. Move the red lead to V/Ω.",
      tone: "bad",
    };
  }

  if (leadConnection === "redOpen") {
    return {
      label: "Red probe open",
      detail: "The red probe is not touching the positive battery terminal.",
      tone: "warn",
    };
  }

  if (leadConnection === "blackOpen") {
    return {
      label: "Black probe open",
      detail: "The black probe is not touching the negative battery terminal.",
      tone: "warn",
    };
  }

  if (dialMode !== "vdc") {
    return {
      label: "Wrong dial mode",
      detail: "Select V DC for measuring DC battery voltage.",
      tone: "warn",
    };
  }

  return {
    label: "Correct setup",
    detail: `The meter is measuring ${measuredVoltage.toFixed(2)}V across the battery.`,
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
  const dialCorrect = dialMode === "vdc";
  const portCorrect = redLeadPort === "VΩ";
  const leadsCorrect = leadConnection === "connected";
  const allCorrect = dialCorrect && portCorrect && leadsCorrect;

  return {
    allCorrect,
    messages: [
      dialCorrect
        ? "Dial mode is correct: V DC is selected."
        : "Dial mode is wrong: select V DC for a battery.",
      portCorrect
        ? "Red lead port is correct: V/Ω is used."
        : "Red lead port is wrong: voltage must use V/Ω, not 10A.",
      leadsCorrect
        ? "Probe contact is correct: red touches + and black touches −."
        : "Probe contact is incomplete: both probes must touch the battery terminals.",
    ],
  };
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "vdc":
      return -68;
    case "ohm":
      return 0;
    case "vac":
      return 42;
    case "adc":
      return -120;
    case "aac":
      return -165;
    case "diode":
      return 100;
    case "continuity":
      return 72;
    case "off":
      return 132;
    default:
      return -68;
  }
}

function getRedWirePath(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? RED_WIRE_VOLT : RED_WIRE_10A;
}

function getRedPortPosition(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? PORT.voltOhm : PORT.tenA;
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
  const active = DIGIT_SEGMENTS[digit] ?? [];

  const segmentPath: Record<SegmentName, string> = {
    a: "M14 0 H76 L86 10 L76 20 H14 L4 10 Z",
    b: "M88 15 L104 28 V73 L94 84 L78 73 V28 Z",
    c: "M88 91 L104 102 V148 L94 160 L78 148 V102 Z",
    d: "M14 155 H76 L86 165 L76 175 H14 L4 165 Z",
    e: "M0 91 L16 102 V148 L6 160 L-10 148 V102 Z",
    f: "M0 15 L16 28 V73 L6 84 L-10 73 V28 Z",
    g: "M14 78 H76 L86 88 L76 98 H14 L4 88 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={BLACK}>
      {active.map((name) => (
        <path key={name} d={segmentPath[name]} />
      ))}
    </g>
  );
}

function DynamicDisplay({ value }: { value: string }) {
  const fontSize = value.length > 6 ? 54 : value.length > 4 ? 66 : 84;

  return (
    <g>
      <rect x={185} y={116} width={324} height={126} rx={7} fill={WHITE} />
      <text
        x={347}
        y={179}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Courier New', monospace"
        fontSize={fontSize}
        fontWeight={800}
        fill={BLACK}
      >
        {value}
      </text>
    </g>
  );
}

function Label({
  x,
  y,
  children,
  size = 30,
  anchor = "middle",
  fill = BLACK,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily="Arial, Helvetica, sans-serif"
      fill={fill}
      dominantBaseline="middle"
      fontWeight={600}
    >
      {children}
    </text>
  );
}

function DcSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={BLACK} strokeWidth={3} strokeLinecap="round">
      <line x1={x - 15} y1={y} x2={x + 15} y2={y} />
      <line x1={x - 15} y1={y + 11} x2={x + 15} y2={y + 11} strokeDasharray="7 6" />
    </g>
  );
}

function Port({
  cx,
  cy,
  color = BLACK,
  active = false,
}: {
  cx: number;
  cy: number;
  color?: string;
  active?: boolean;
}) {
  return (
    <g>
      {active ? <circle cx={cx} cy={cy} r={36} fill="none" stroke={color} strokeWidth={4} opacity={0.45} /> : null}
      <circle cx={cx} cy={cy} r={29} fill={WHITE} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={18} fill={WHITE} stroke={BLACK} strokeWidth={4} />
    </g>
  );
}

function WirePath({
  d,
  color,
  dark,
  width = stroke.wire,
  active = true,
}: {
  d: string;
  color: string;
  dark: string;
  width?: number;
  active?: boolean;
}) {
  const mainColor = active ? color : GRAY;
  const shadowColor = active ? dark : "#4b5563";

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadowColor} strokeWidth={width + 4} opacity={active ? 0.55 : 0.25} />
      <path d={d} stroke={mainColor} strokeWidth={width} opacity={active ? 1 : 0.5} />
      <path d={d} stroke={WHITE} strokeWidth={2} opacity={active ? 0.25 : 0.12} />
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
          {value.toFixed(2)}
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
  batteryVoltage,
  setBatteryVoltage,
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
  batteryVoltage: number;
  setBatteryVoltage: (value: number) => void;
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
      aria-label="DC voltage measurement controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">DC Voltage Measurement</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Measure battery voltage using COM and V/Ω with the dial on V DC.
        </p>
      </div>

      <div className="space-y-3">
        <PanelSection title="Learning Mode" helper="Choose how much guidance appears.">
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
              A voltmeter measures potential difference between two points, so it connects across the battery terminals.
            </div>
          ) : null}

          {learningMode === "quiz" ? (
            <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs leading-5 text-purple-800">
              Choose V DC, V/Ω red port, and connected probes. Then press Check Answer.
            </div>
          ) : null}
        </PanelSection>

        <RangeControl
          label="Battery voltage"
          value={batteryVoltage}
          min={1}
          max={24}
          step={0.05}
          unit="V"
          onChange={setBatteryVoltage}
        />

        <PanelSection title="Dial mode" helper="For a battery, use DC voltage mode.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={dialMode === "off"} onClick={() => setDialMode("off")} ariaLabel="Set dial off">
              OFF
            </ToggleButton>
            <ToggleButton active={dialMode === "vdc"} onClick={() => setDialMode("vdc")} ariaLabel="Set dial to DC voltage">
              V DC
            </ToggleButton>
            <ToggleButton active={dialMode === "vac"} onClick={() => setDialMode("vac")} ariaLabel="Set dial to AC voltage">
              V AC
            </ToggleButton>
            <ToggleButton active={dialMode === "ohm"} onClick={() => setDialMode("ohm")} ariaLabel="Set dial to resistance">
              Ω
            </ToggleButton>
            <ToggleButton active={dialMode === "adc"} onClick={() => setDialMode("adc")} ariaLabel="Set dial to DC amps">
              A DC
            </ToggleButton>
            <ToggleButton active={dialMode === "continuity"} onClick={() => setDialMode("continuity")} ariaLabel="Set dial to continuity">
              Continuity
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Red lead port" helper="Voltage must use V/Ω. The 10A port is for current.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={redLeadPort === "VΩ"} onClick={() => setRedLeadPort("VΩ")} ariaLabel="Move red lead to V ohm port">
              V/Ω
            </ToggleButton>
            <ToggleButton active={redLeadPort === "10A"} onClick={() => setRedLeadPort("10A")} ariaLabel="Move red lead to 10 amp port">
              10A
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Probe contact" helper="Both probes must touch the battery terminals.">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton active={leadConnection === "connected"} onClick={() => setLeadConnection("connected")} ariaLabel="Connect probes">
              Connected
            </ToggleButton>
            <ToggleButton active={leadConnection === "redOpen"} onClick={() => setLeadConnection("redOpen")} ariaLabel="Open red probe">
              Red open
            </ToggleButton>
            <ToggleButton active={leadConnection === "blackOpen"} onClick={() => setLeadConnection("blackOpen")} ariaLabel="Open black probe">
              Black open
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Display options" helper="Show voltage path labels and terminal debug points.">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton active={showVoltagePath} onClick={() => setShowVoltagePath(!showVoltagePath)} ariaLabel="Toggle voltage path">
              Voltage path
            </ToggleButton>
            <ToggleButton active={debug} onClick={() => setDebug(!debug)} ariaLabel="Toggle debug dots">
              Debug dots
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Live result" helper="The display follows the meter settings.">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Meter display</div>
              <div className="font-bold text-slate-900">{displayText}</div>
            </div>

            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Measured voltage</div>
              <div className="font-bold text-slate-900">{measuredVoltage.toFixed(2)} V</div>
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
            title="Voltage rule"
            text="Voltage is measured across two points. For a battery, touch red to + and black to −."
            tone={safetyStatus.tone === "good" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Correct ports"
            text="Black lead goes to COM. Red lead goes to V/Ω for voltage measurement."
            tone={redLeadPort === "VΩ" ? "good" : "bad"}
          />
          <ExplanationCard
            title="Correct dial"
            text="Use V DC for batteries. AC voltage mode is for alternating voltage."
            tone={dialMode === "vdc" ? "good" : "warn"}
          />
          <ExplanationCard
            title="Safety"
            text="Do not put the red lead in the 10A port when measuring voltage."
            tone={redLeadPort === "10A" ? "bad" : "good"}
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

function MultimeterBody({
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
      <rect x={121} y={49} width={452} height={754} rx={38} fill={WHITE} stroke={BLACK} strokeWidth={5} />
      <rect x={144} y={72} width={406} height={707} rx={26} fill={WHITE} stroke={BLACK} strokeWidth={4} />

      <rect x={176} y={106} width={342} height={147} rx={11} fill={WHITE} stroke={BLACK} strokeWidth={4} />
      <rect x={185} y={116} width={324} height={126} rx={7} fill={WHITE} stroke={BLACK} strokeWidth={3} />

      <DynamicDisplay value={displayText} />

      <Label x={213} y={316} size={33}>
        V
      </Label>
      <DcSymbol x={213} y={340} />

      <Label x={345} y={305} size={34}>
        Ω
      </Label>
      <line x1={345} y1={327} x2={345} y2={339} stroke={BLACK} strokeWidth={3} />

      <Label x={463} y={325} size={34}>
        V
      </Label>
      <path
        d="M443 351 C452 340, 462 363, 472 351 S492 340, 500 351"
        fill="none"
        stroke={BLACK}
        strokeWidth={3}
      />

      <Label x={184} y={408} size={32}>
        A
      </Label>
      <DcSymbol x={184} y={431} />

      <Label x={184} y={506} size={32}>
        A
      </Label>
      <path
        d="M166 529 C176 517, 188 541, 199 529 S218 517, 228 529"
        fill="none"
        stroke={BLACK}
        strokeWidth={3}
      />

      <Label x={477} y={568} size={30}>
        OFF
      </Label>

      <g transform="translate(491 411)" stroke={BLACK} strokeWidth={4} fill="none">
        <path d="M-16 0 H20" />
        <path d="M-6 -15 L10 0 L-6 15 Z" fill={BLACK} />
        <path d="M22 -18 V18" />
      </g>

      <g transform="translate(508 503)" fill="none" stroke={BLACK} strokeWidth={4} strokeLinecap="round">
        <path d="M-15 -12 C-4 -5, -4 5, -15 12" />
        <path d="M-4 -20 C13 -8, 13 8, -4 20" />
        <circle cx={-25} cy={0} r={3} fill={BLACK} />
      </g>

      <circle cx={346} cy={456} r={119} fill={WHITE} stroke={BLACK} strokeWidth={4} />
      <circle cx={346} cy={456} r={109} fill={WHITE} stroke={BLACK} strokeWidth={3} />

      <g stroke={BLACK} strokeWidth={3} strokeLinecap="round">
        <line x1={260} y1={353} x2={268} y2={366} />
        <line x1={193} y1={421} x2={207} y2={425} />
        <line x1={193} y1={520} x2={207} y2={515} />
        <line x1={432} y1={356} x2={424} y2={369} />
        <line x1={489} y1={418} x2={475} y2={422} />
        <line x1={491} y1={497} x2={478} y2={492} />
        <line x1={440} y1={584} x2={430} y2={572} />
      </g>

      <g transform={`rotate(${dialAngle} 346 456)`}>
        <rect x={326} y={338} width={41} height={236} rx={22} fill={WHITE} stroke={BLACK} strokeWidth={4} />
      </g>

      <path
        d="M284 379 L304 389 L288 403 Z"
        fill={safetyStatus.tone === "bad" ? RED : BLACK}
      />

      <Label x={241} y={652} size={28}>
        COM
      </Label>
      <Label x={351} y={652} size={25} fill={redLeadPort === "10A" ? RED : BLACK}>
        10A
      </Label>
      <Label x={457} y={652} size={28}>
        V/Ω
      </Label>
    </g>
  );
}

function Battery({ voltage }: { voltage: number }) {
  return (
    <g>
      <rect x={896} y={694} width={322} height={246} rx={8} fill={WHITE} stroke={BLACK} strokeWidth={4} />
      <path d="M896 773 H1218" stroke={BLACK} strokeWidth={4} />

      <path
        d="M910 693 L926 665 H1188 L1210 693 Z"
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      <g>
        <rect x={941} y={671} width={43} height={38} rx={8} fill={WHITE} stroke={BLACK} strokeWidth={4} />
        <ellipse cx={962.5} cy={672} rx={22} ry={7} fill={WHITE} stroke={BLACK} strokeWidth={3} />
      </g>

      <g>
        <rect x={1133} y={671} width={43} height={38} rx={8} fill={WHITE} stroke={BLACK} strokeWidth={4} />
        <ellipse cx={1154.5} cy={672} rx={22} ry={7} fill={WHITE} stroke={BLACK} strokeWidth={3} />
      </g>

      <Label x={960} y={745} size={42}>
        −
      </Label>
      <Label x={1158} y={747} size={42}>
        +
      </Label>

      <Label x={1058} y={842} size={48}>
        {voltage.toFixed(2)}V
      </Label>
      <DcSymbol x={1058} y={885} />
    </g>
  );
}

function Wires({
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
      <WirePath d={BLACK_WIRE} color={BLACK} dark="#000000" width={10} active={blackActive} />
      <WirePath d={BLACK_LEAD_TO_BATTERY} color={BLACK} dark="#000000" width={9} active={blackActive} />
      <WirePath d={redWire} color={RED} dark={RED_DARK} width={10} active={redActive} />

      {showVoltagePath && redActive && blackActive ? (
        <g>
          <path d={redWire} stroke={RED_DARK} strokeWidth={3} strokeDasharray="18 20" fill="none" opacity={0.45} />
          <path d={BLACK_WIRE} stroke={BLACK} strokeWidth={3} strokeDasharray="18 20" fill="none" opacity={0.35} />
          <Label x={760} y={1005} size={24} fill={GREEN}>
            Voltmeter compares + and − terminals
          </Label>
        </g>
      ) : null}

      {leadConnection === "redOpen" ? (
        <g stroke={RED} strokeWidth={8} strokeLinecap="round">
          <line x1={1120} y1={640} x2={1190} y2={710} />
          <line x1={1190} y1={640} x2={1120} y2={710} />
        </g>
      ) : null}

      {leadConnection === "blackOpen" ? (
        <g stroke={RED} strokeWidth={8} strokeLinecap="round">
          <line x1={910} y1={615} x2={980} y2={685} />
          <line x1={980} y1={615} x2={910} y2={685} />
        </g>
      ) : null}
    </g>
  );
}

function ProbesAndPorts({
  redLeadPort,
}: {
  redLeadPort: RedLeadPort;
}) {
  const redPort = getRedPortPosition(redLeadPort);

  return (
    <g>
      <Port cx={PORT.com.x} cy={PORT.com.y} color={BLACK} active />
      <Port cx={PORT.tenA.x} cy={PORT.tenA.y} color={redLeadPort === "10A" ? RED : BLACK} active={redLeadPort === "10A"} />
      <Port cx={PORT.voltOhm.x} cy={PORT.voltOhm.y} color={RED} active={redLeadPort === "VΩ"} />

      <g>
        <rect x={229} y={704} width={31} height={60} rx={8} fill={DARK} stroke={BLACK} strokeWidth={3} />
        <rect x={225} y={741} width={39} height={28} rx={4} fill={DARK} stroke={BLACK} strokeWidth={3} />
        <line x1={230} y1={755} x2={260} y2={755} stroke={BLACK} strokeWidth={3} />
        <line x1={230} y1={763} x2={260} y2={763} stroke={BLACK} strokeWidth={3} />
      </g>

      <g>
        <rect x={redPort.x - 15} y={704} width={31} height={60} rx={8} fill={RED} stroke={RED_DARK} strokeWidth={3} />
        <rect x={redPort.x - 19} y={741} width={39} height={28} rx={4} fill={RED} stroke={RED_DARK} strokeWidth={3} />
        <line x1={redPort.x - 14} y1={755} x2={redPort.x + 16} y2={755} stroke={RED_DARK} strokeWidth={3} />
        <line x1={redPort.x - 14} y1={763} x2={redPort.x + 16} y2={763} stroke={RED_DARK} strokeWidth={3} />
      </g>

      <g>
        <path
          d="M719 653 L817 475 C824 462 839 463 845 474 L748 660 C741 674 724 670 719 653 Z"
          fill={DARK}
          stroke={BLACK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M810 485 L835 500" stroke={BLACK} strokeWidth={5} strokeLinecap="round" />
        <g stroke="#444" strokeWidth={3} strokeLinecap="round">
          <line x1={776} y1={548} x2={807} y2={567} />
          <line x1={768} y1={562} x2={799} y2={581} />
          <line x1={760} y1={576} x2={791} y2={595} />
          <line x1={752} y1={590} x2={783} y2={609} />
        </g>
      </g>

      <g>
        <rect x={935} y={522} width={27} height={126} rx={8} fill={DARK} stroke={BLACK} strokeWidth={4} />
        <rect x={930} y={627} width={38} height={9} rx={4} fill={DARK} stroke={BLACK} strokeWidth={4} />
        <path d="M949 648 V681" stroke={BLACK} strokeWidth={8} strokeLinecap="round" />
        <path d="M949 648 V681" stroke={WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      </g>

      <g>
        <rect x={1140} y={515} width={29} height={129} rx={8} fill={RED} stroke={RED_DARK} strokeWidth={4} />
        <path
          d="M1136 646 L1173 646 L1163 674 L1146 674 Z"
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect x={1126} y={611} width={58} height={10} rx={5} fill={RED} stroke={RED_DARK} strokeWidth={4} />
        <path d="M1155 674 V705" stroke={BLACK} strokeWidth={8} strokeLinecap="round" />
        <path d="M1155 674 V705" stroke={WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        <g stroke={RED_DARK} strokeWidth={3} strokeLinecap="round">
          <line x1={1144} y1={535} x2={1165} y2={535} />
          <line x1={1142} y1={548} x2={1166} y2={548} />
          <line x1={1142} y1={561} x2={1167} y2={561} />
          <line x1={1142} y1={574} x2={1167} y2={574} />
        </g>
      </g>
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
      <circle cx={x} cy={y} r={7} fill={color} stroke={WHITE} strokeWidth={3} />
      <text
        x={labelX}
        y={y - 16}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={16}
        fontWeight={700}
        fill={color}
        paintOrder="stroke"
        stroke={WHITE}
        strokeWidth={4}
      >
        {label}
      </text>
    </g>
  );
}

function DebugLayer({ redLeadPort }: { redLeadPort: RedLeadPort }) {
  const redPort = getRedPortPosition(redLeadPort);

  return (
    <g>
      <DebugDot x={PORT.com.x} y={PORT.com.y} label="COM" color={BLUE} />
      <DebugDot x={redPort.x} y={redPort.y} label={redLeadPort} color={RED} />
      <DebugDot x={NODE.batteryNegative.x} y={NODE.batteryNegative.y} label="BAT−" color={BLACK} />
      <DebugDot x={NODE.batteryPositive.x} y={NODE.batteryPositive.y} label="BAT+" color={RED} />
      <DebugDot x={NODE.meterDisplay.x} y={NODE.meterDisplay.y} label="DISPLAY" color={GREEN} />
    </g>
  );
}

function Callout({
  x,
  y,
  boxX,
  boxY,
  text,
  width = 210,
  color = BLUE,
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
      <rect x={boxX} y={boxY} width={width} height={36} rx={10} fill={WHITE} stroke={color} strokeWidth={2.5} />
      <text
        x={boxX + width / 2}
        y={boxY + 19}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={700}
        fill={BLACK}
      >
        {text}
      </text>
    </g>
  );
}

function BeginnerAnnotations({ redLeadPort }: { redLeadPort: RedLeadPort }) {
  const redPort = getRedPortPosition(redLeadPort);

  return (
    <g>
      <Callout x={213} y={340} boxX={90} boxY={250} text="Select V DC" width={170} color={BLUE} />
      <Callout x={PORT.com.x} y={PORT.com.y} boxX={100} boxY={830} text="Black lead to COM" width={220} color={BLACK} />
      <Callout x={redPort.x} y={redPort.y} boxX={390} boxY={835} text={redLeadPort === "VΩ" ? "Red lead to V/Ω" : "Wrong: 10A port"} width={230} color={RED} />
      <Callout x={NODE.batteryPositive.x} y={NODE.batteryPositive.y} boxX={1180} boxY={540} text="Red probe on +" width={190} color={RED} />
      <Callout x={NODE.batteryNegative.x} y={NODE.batteryNegative.y} boxX={730} boxY={560} text="Black probe on −" width={210} color={BLACK} />
      <Callout x={1058} y={842} boxX={1225} boxY={850} text="Battery voltage" width={190} color={PURPLE} />
      <Callout x={347} y={179} boxX={560} boxY={150} text="Voltage reading" width={210} color={GREEN} />
    </g>
  );
}

function SimulationCanvas({
  batteryVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
  learningMode,
  showVoltagePath,
  debug,
  displayText,
  safetyStatus,
}: {
  batteryVoltage: number;
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
      aria-label="Interactive DC voltage measurement canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Digital multimeter measuring DC voltage from a battery"
      >
        <rect width="1448" height="1086" fill={WHITE} />

        <MultimeterBody
          displayText={displayText}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          safetyStatus={safetyStatus}
        />

        <Wires
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
        />

        <Battery voltage={batteryVoltage} />
        <ProbesAndPorts redLeadPort={redLeadPort} />

        {safetyStatus.tone === "bad" ? (
          <g>
            <rect x={635} y={305} width={425} height={70} rx={14} fill="#fee2e2" stroke={RED} strokeWidth={4} />
            <Label x={848} y={330} size={22} fill={RED}>
              Wrong port for voltage
            </Label>
            <Label x={848} y={356} size={17} fill={RED}>
              Move red lead to V/Ω
            </Label>
          </g>
        ) : null}

        {safetyStatus.tone === "warn" && dialMode !== "off" && redLeadPort === "VΩ" ? (
          <g>
            <rect x={635} y={305} width={425} height={70} rx={14} fill="#fef3c7" stroke={AMBER} strokeWidth={4} />
            <Label x={848} y={330} size={22} fill="#92400e">
              Check meter setting
            </Label>
            <Label x={848} y={356} size={17} fill="#92400e">
              Use V DC and touch both terminals
            </Label>
          </g>
        ) : null}

        {learningMode === "beginner" ? <BeginnerAnnotations redLeadPort={redLeadPort} /> : null}
        {debug ? <DebugLayer redLeadPort={redLeadPort} /> : null}
      </svg>
    </div>
  );
}

export default function MeasuringVoltageSketch({
  className = "",
  initialDebug = false,
}: SketchProps) {
  const [batteryVoltage, setBatteryVoltageState] = useState(12.45);
  const [dialMode, setDialModeState] = useState<DialMode>("vdc");
  const [redLeadPort, setRedLeadPortState] = useState<RedLeadPort>("VΩ");
  const [leadConnection, setLeadConnectionState] = useState<LeadConnection>("connected");
  const [learningMode, setLearningModeState] = useState<LearningMode>("normal");
  const [showVoltagePath, setShowVoltagePathState] = useState(true);
  const [debug, setDebugState] = useState(initialDebug);
  const [quizChecked, setQuizChecked] = useState(false);

  function markQuizDirty() {
    setQuizChecked(false);
  }

  function setBatteryVoltage(value: number) {
    setBatteryVoltageState(value);
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
      batteryVoltage,
      dialMode,
      redLeadPort,
      leadConnection,
    });

    const displayText = getDisplayText({
      batteryVoltage,
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
  }, [batteryVoltage, dialMode, leadConnection, redLeadPort]);

  function onCheckQuiz() {
    setQuizChecked(true);
  }

  function reset() {
    setBatteryVoltageState(12.45);
    setDialModeState("vdc");
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
          batteryVoltage={batteryVoltage}
          setBatteryVoltage={setBatteryVoltage}
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
          batteryVoltage={batteryVoltage}
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