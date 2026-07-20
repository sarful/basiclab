"use client";

import React, { useMemo, useState } from "react";

type DialMode = "off" | "ohm" | "vdc" | "adc" | "continuity" | "diode";
type LeadConnection = "connected" | "redOpen" | "blackOpen" | "shorted";
type StatusTone = "good" | "warn" | "bad" | "neutral";

type MeasuringResistanceSketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type SafetyStatus = {
  label: string;
  detail: string;
  tone: StatusTone;
};

const VIEW_BOX = "0 0 1448 1086";

const COLORS = {
  black: "#111111",
  dark: "#222222",
  gray: "#6b7280",
  red: "#ff3a3a",
  redDark: "#cc2020",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  purple: "#9333ea",
  white: "#ffffff",
};

const BASE_WIRE_WIDTH = 10;
const DEBUG_TERMINAL_OFFSET = { x: 12, y: -14 };

const PORT = {
  com: { x: 266, y: 701 },
  voltOhm: { x: 453, y: 701 },
};

const NODE = {
  blackProbeTip: { x: 879, y: 401 },
  redProbeTip: { x: 1263, y: 400 },
  resistorLeft: { x: 883, y: 398 },
  resistorRight: { x: 1277, y: 398 },
  resistorBodyCenter: { x: 1080, y: 398 },
  dialCenter: { x: 354, y: 493 },
} as const;

const BLACK_CABLE_PATH =
  "M266 790 C266 875 295 925 360 956 C449 999 576 998 661 943 C727 900 759 803 794 719";

const RED_CABLE_PATH =
  "M453 790 C459 875 518 939 642 976 C805 1024 1082 1024 1236 988 C1312 970 1331 902 1336 826 C1339 752 1323 695 1308 641";

const BLACK_PROBE_NEEDLE_PATH = "M836 541 L879 401";
const RED_PROBE_NEEDLE_PATH = "M1293 540 L1263 400";

const DIAL_HITS: Array<{
  mode: DialMode;
  label: string;
  x: number;
  y: number;
  r: number;
}> = [
  { mode: "ohm", label: "Ω", x: 354, y: 323, r: 58 },
  { mode: "vdc", label: "V DC", x: 191, y: 387, r: 58 },
  { mode: "adc", label: "A DC", x: 495, y: 389, r: 58 },
  { mode: "diode", label: "Diode", x: 206, y: 592, r: 58 },
  { mode: "continuity", label: "Continuity", x: 491, y: 589, r: 58 },
  { mode: "off", label: "OFF", x: 354, y: 637, r: 50 },
];

function calculateMeasuredResistance({
  resistorValue,
  leadConnection,
  externalPower,
}: {
  resistorValue: number;
  leadConnection: LeadConnection;
  externalPower: boolean;
}) {
  if (externalPower) return null;
  if (leadConnection === "redOpen" || leadConnection === "blackOpen")
    return Infinity;
  if (leadConnection === "shorted") return 0;
  return resistorValue;
}

function formatResistance(value: number) {
  if (!Number.isFinite(value)) return "OL";
  if (value === 0) return "0.0Ω";
  if (value >= 1000)
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}kΩ`;
  return `${Math.round(value)}Ω`;
}

function getDisplayText({
  dialMode,
  measuredResistance,
  externalPower,
  leadConnection,
}: {
  dialMode: DialMode;
  measuredResistance: number | null;
  externalPower: boolean;
  leadConnection: LeadConnection;
}) {
  if (dialMode === "off") return "OFF";
  if (externalPower) return "ERR";

  if (dialMode === "ohm") {
    if (measuredResistance === null) return "ERR";
    return formatResistance(measuredResistance);
  }

  if (dialMode === "continuity") {
    if (leadConnection === "shorted") return "BEEP";
    if (
      measuredResistance !== null &&
      Number.isFinite(measuredResistance) &&
      measuredResistance < 30
    ) {
      return "BEEP";
    }
    return "OPEN";
  }

  if (dialMode === "diode") return "----";
  if (dialMode === "vdc") return "0.0V";
  if (dialMode === "adc") return "0.00A";

  return "----";
}

function getSafetyStatus({
  dialMode,
  leadConnection,
  externalPower,
  measuredResistance,
}: {
  dialMode: DialMode;
  leadConnection: LeadConnection;
  externalPower: boolean;
  measuredResistance: number | null;
}): SafetyStatus {
  if (externalPower) {
    return {
      label: "Powered circuit warning",
      detail:
        "Never measure resistance on a powered circuit. Turn power off first.",
      tone: "bad",
    };
  }

  if (dialMode === "off") {
    return {
      label: "Meter OFF",
      detail: "Turn the dial to Ω to measure resistance.",
      tone: "neutral",
    };
  }

  if (leadConnection === "redOpen") {
    return {
      label: "Red probe open",
      detail:
        "The red probe is not touching the resistor, so the meter reads open loop.",
      tone: "warn",
    };
  }

  if (leadConnection === "blackOpen") {
    return {
      label: "Black probe open",
      detail:
        "The black probe is not touching the resistor, so the meter reads open loop.",
      tone: "warn",
    };
  }

  if (leadConnection === "shorted") {
    return {
      label: "Shorted probes",
      detail: "The probes are shorted together, so the meter reads near 0Ω.",
      tone: "neutral",
    };
  }

  if (dialMode !== "ohm") {
    return {
      label: "Wrong dial mode",
      detail: "Select Ω mode for resistance measurement.",
      tone: "warn",
    };
  }

  return {
    label: "Correct setup",
    detail: `The meter is measuring ${formatResistance(measuredResistance ?? Infinity)} across the resistor.`,
    tone: "good",
  };
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "ohm":
      return 0;
    case "vdc":
      return -58;
    case "adc":
      return 58;
    case "diode":
      return -122;
    case "continuity":
      return 122;
    case "off":
      return 180;
    default:
      return 0;
  }
}

function Label({
  x,
  y,
  children,
  size = 26,
  anchor = "middle",
  weight = 500,
  fill = COLORS.black,
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

function DynamicDisplay({ value }: { value: string }) {
  const fontSize = value.length > 6 ? 64 : value.length > 4 ? 74 : 88;

  return (
    <g>
      <rect
        x={166}
        y={102}
        width={383}
        height={146}
        rx={8}
        fill={COLORS.white}
      />
      <text
        x={356}
        y={176}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Courier New', monospace"
        fontSize={fontSize}
        fontWeight={800}
        fill={COLORS.black}
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
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={COLORS.black}
      strokeWidth={3}
      strokeLinecap="round"
    >
      <line x1={0} y1={0} x2={28} y2={0} />
      <line x1={0} y1={10} x2={28} y2={10} strokeDasharray="7 5" />
    </g>
  );
}

function ACSymbol({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <path
      d={`M ${x} ${y} C ${x + 8 * scale} ${y - 8 * scale}, ${x + 16 * scale} ${
        y + 8 * scale
      }, ${x + 24 * scale} ${y}
          S ${x + 40 * scale} ${y - 8 * scale}, ${x + 48 * scale} ${y}`}
      fill="none"
      stroke={COLORS.black}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function DiodeSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={COLORS.black}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={-20} y1={0} x2={-2} y2={0} />
      <path d="M-2 -14 L14 0 L-2 14 Z" fill={COLORS.black} />
      <line x1={16} y1={-16} x2={16} y2={16} />
    </g>
  );
}

function ContinuitySymbol({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={COLORS.black}
      strokeWidth={4}
      strokeLinecap="round"
    >
      <circle cx={-22} cy={10} r={4} fill={COLORS.black} stroke="none" />
      <path d="M-6 4 C 6 -6, 6 -6, 14 10" />
      <path d="M6 -4 C 22 -18, 22 -18, 30 10" />
      <path d="M18 -12 C 38 -28, 38 -28, 46 10" />
    </g>
  );
}

function Port({
  cx,
  cy,
  strokeColor = COLORS.black,
  active = false,
}: {
  cx: number;
  cy: number;
  strokeColor?: string;
  active?: boolean;
}) {
  return (
    <g>
      {active ? (
        <circle
          cx={cx}
          cy={cy}
          r={38}
          fill="none"
          stroke={strokeColor}
          strokeWidth={4}
          opacity={0.45}
        />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={31}
        fill={COLORS.white}
        stroke={strokeColor}
        strokeWidth={5}
      />
      <circle
        cx={cx}
        cy={cy}
        r={21}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />
    </g>
  );
}

function Wire({
  d,
  color,
  dark,
  width = BASE_WIRE_WIDTH,
  active = true,
}: {
  d: string;
  color: string;
  dark: string;
  width?: number;
  active?: boolean;
}) {
  const mainColor = active ? color : COLORS.gray;
  const darkColor = active ? dark : "#4b5563";

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        stroke={darkColor}
        strokeWidth={width + 3}
        opacity={active ? 0.55 : 0.25}
      />
      <path
        d={d}
        stroke={mainColor}
        strokeWidth={width}
        opacity={active ? 1 : 0.48}
      />
      <path
        d={d}
        stroke={COLORS.white}
        strokeWidth={1.6}
        opacity={active ? 0.25 : 0.12}
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
        {helper ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
        ) : null}
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

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm font-semibold ${styles[tone]}`}
    >
      {label}
    </div>
  );
}

function ProbeConnectionSelector({
  leadConnection,
  setLeadConnection,
}: {
  leadConnection: LeadConnection;
  setLeadConnection: (value: LeadConnection) => void;
}) {
  const options: Array<{
    value: LeadConnection;
    title: string;
    subtitle: string;
  }> = [
    {
      value: "connected",
      title: "Connected",
      subtitle: "Both probes touch resistor",
    },
    {
      value: "redOpen",
      title: "Red open",
      subtitle: "Red probe is lifted",
    },
    {
      value: "blackOpen",
      title: "Black open",
      subtitle: "Black probe is lifted",
    },
    {
      value: "shorted",
      title: "Shorted",
      subtitle: "Probe tips touch together",
    },
  ];

  return (
    <div className="grid gap-2">
      {options.map((option) => {
        const active = leadConnection === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setLeadConnection(option.value)}
            className={[
              "rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2",
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            <div className="text-sm font-bold">{option.title}</div>
            <div
              className={[
                "mt-1 text-xs",
                active ? "text-slate-200" : "text-slate-500",
              ].join(" ")}
            >
              {option.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PowerSelector({
  externalPower,
  setExternalPower,
}: {
  externalPower: boolean;
  setExternalPower: (value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <ToggleButton
        active={!externalPower}
        onClick={() => setExternalPower(false)}
        ariaLabel="External power off"
      >
        Power OFF
      </ToggleButton>
      <ToggleButton
        active={externalPower}
        onClick={() => setExternalPower(true)}
        ariaLabel="External power on"
      >
        Power ON
      </ToggleButton>
    </div>
  );
}

function ControlPanel({
  resistorValue,
  setResistorValue,
  dialMode,
  setDialMode,
  leadConnection,
  setLeadConnection,
  externalPower,
  setExternalPower,
  showTestSignal,
  setShowTestSignal,
  debug,
  setDebug,
  displayText,
  measuredResistance,
  safetyStatus,
  reset,
}: {
  resistorValue: number;
  setResistorValue: (value: number) => void;
  dialMode: DialMode;
  setDialMode: (value: DialMode) => void;
  leadConnection: LeadConnection;
  setLeadConnection: (value: LeadConnection) => void;
  externalPower: boolean;
  setExternalPower: (value: boolean) => void;
  showTestSignal: boolean;
  setShowTestSignal: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  displayText: string;
  measuredResistance: number | null;
  safetyStatus: SafetyStatus;
  reset: () => void;
}) {
  return (
    <aside
      role="complementary"
      aria-label="Resistance measurement simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Resistance Measurement
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Measure a resistor using Ω mode. Keep power off, because meters
          dislike being sacrificed.
        </p>
      </div>

      <div className="space-y-3">
        <RangeControl
          label="Resistor value"
          value={resistorValue}
          min={1}
          max={1000}
          step={1}
          unit="Ω"
          onChange={setResistorValue}
        />

        <PanelSection
          title="Dial mode"
          helper="You can also click the symbols around the dial."
        >
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={dialMode === "off"}
              onClick={() => setDialMode("off")}
              ariaLabel="Set dial to off"
            >
              OFF
            </ToggleButton>
            <ToggleButton
              active={dialMode === "ohm"}
              onClick={() => setDialMode("ohm")}
              ariaLabel="Set dial to ohm mode"
            >
              Ω
            </ToggleButton>
            <ToggleButton
              active={dialMode === "vdc"}
              onClick={() => setDialMode("vdc")}
              ariaLabel="Set dial to DC volts"
            >
              V DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "adc"}
              onClick={() => setDialMode("adc")}
              ariaLabel="Set dial to DC amps"
            >
              A DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "continuity"}
              onClick={() => setDialMode("continuity")}
              ariaLabel="Set dial to continuity mode"
            >
              Continuity
            </ToggleButton>
            <ToggleButton
              active={dialMode === "diode"}
              onClick={() => setDialMode("diode")}
              ariaLabel="Set dial to diode mode"
            >
              Diode
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection
          title="Probe connection"
          helper="Click a scenario card or click the probe tips in the canvas."
        >
          <ProbeConnectionSelector
            leadConnection={leadConnection}
            setLeadConnection={setLeadConnection}
          />
        </PanelSection>

        <PanelSection
          title="Safety"
          helper="Resistance must be measured on an unpowered component."
        >
          <PowerSelector
            externalPower={externalPower}
            setExternalPower={setExternalPower}
          />
        </PanelSection>

        <PanelSection title="Display options">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={showTestSignal}
              onClick={() => setShowTestSignal(!showTestSignal)}
              ariaLabel="Toggle meter test signal"
            >
              Test signal
            </ToggleButton>
            <ToggleButton
              active={debug}
              onClick={() => setDebug(!debug)}
              ariaLabel="Toggle debug dots"
            >
              Debug dots
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Live result">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Meter display</div>
              <div className="font-bold text-slate-900">{displayText}</div>
            </div>
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-xs text-slate-500">Measured value</div>
              <div className="font-bold text-slate-900">
                {measuredResistance === null
                  ? "ERR"
                  : formatResistance(measuredResistance)}
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <StatusPill label={safetyStatus.label} tone={safetyStatus.tone} />
            <p className="text-xs leading-5 text-slate-600">
              {safetyStatus.detail}
            </p>
          </div>
        </PanelSection>

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

function StatusBadge({
  safetyStatus,
  displayText,
  measuredResistance,
}: {
  safetyStatus: SafetyStatus;
  displayText: string;
  measuredResistance: number | null;
}) {
  const colorMap: Record<StatusTone, string> = {
    good: COLORS.green,
    warn: COLORS.amber,
    bad: COLORS.red,
    neutral: COLORS.gray,
  };

  const color = colorMap[safetyStatus.tone];

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <rect
        x={690}
        y={78}
        width={405}
        height={118}
        rx={16}
        fill={COLORS.white}
        stroke={color}
        strokeWidth={4}
      />
      <circle cx={722} cy={116} r={10} fill={color} />
      <text
        x={744}
        y={118}
        dominantBaseline="middle"
        fontSize={23}
        fontWeight={800}
        fill={COLORS.black}
      >
        {safetyStatus.label}
      </text>
      <text
        x={715}
        y={153}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={COLORS.gray}
      >
        Display: {displayText}
      </text>
      <text
        x={715}
        y={180}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={COLORS.gray}
      >
        Value:{" "}
        {measuredResistance === null
          ? "ERR"
          : formatResistance(measuredResistance)}
      </text>
    </g>
  );
}

function MeterBody({
  displayText,
  dialMode,
  safetyStatus,
  onDialModeChange,
}: {
  displayText: string;
  dialMode: DialMode;
  safetyStatus: SafetyStatus;
  onDialModeChange: (value: DialMode) => void;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect
        x={112}
        y={43}
        width={500}
        height={773}
        rx={48}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={5}
      />
      <rect
        x={146}
        y={77}
        width={433}
        height={690}
        rx={34}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />

      <rect
        x={159}
        y={95}
        width={397}
        height={160}
        rx={11}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />
      <rect
        x={166}
        y={102}
        width={383}
        height={146}
        rx={8}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={2.8}
      />

      <DynamicDisplay value={displayText} />

      <path
        d="M146 312 C146 289, 161 276, 183 276 H542 C564 276, 579 289, 579 312"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={3}
      />

      <Label x={353} y={323} size={44}>
        Ω
      </Label>
      <circle cx={354} cy={349} r={6} fill={COLORS.black} />

      <circle
        cx={354}
        cy={493}
        r={129}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />
      <circle
        cx={354}
        cy={493}
        r={118}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={3}
      />

      <g transform={`rotate(${dialAngle} 354 493)`}>
        <rect
          x={334}
          y={381}
          width={40}
          height={232}
          rx={22}
          fill={COLORS.white}
          stroke={COLORS.black}
          strokeWidth={4}
        />
        <path
          d="M354 381 L336 421 L372 421 Z"
          fill={safetyStatus.tone === "bad" ? COLORS.red : COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </g>

      <g stroke={COLORS.black} strokeWidth={3} strokeLinecap="round">
        <line x1={245} y1={406} x2={230} y2={394} />
        <line x1={219} y1={487} x2={201} y2={487} />
        <line x1={246} y1={570} x2={231} y2={582} />
        <line x1={463} y1={406} x2={478} y2={394} />
        <line x1={489} y1={487} x2={507} y2={487} />
        <line x1={461} y1={570} x2={476} y2={582} />
        <line x1={354} y1={610} x2={354} y2={625} />
      </g>

      <Label x={191} y={387} size={35}>
        V
      </Label>
      <DCSymbol x={205} y={372} scale={1.15} />

      <Label x={186} y={483} size={35}>
        V
      </Label>
      <ACSymbol x={201} y={468} scale={1.15} />

      <DiodeSymbol x={206} y={592} />

      <Label x={495} y={389} size={35}>
        A
      </Label>
      <DCSymbol x={510} y={374} scale={1.15} />

      <Label x={512} y={485} size={35}>
        A
      </Label>
      <ACSymbol x={526} y={470} scale={1.1} />

      <ContinuitySymbol x={491} y={589} />

      <Label x={354} y={637} size={27}>
        OFF
      </Label>

      <Label x={265} y={637} size={30}>
        COM
      </Label>
      <Label x={454} y={637} size={30}>
        V/Ω
      </Label>

      {DIAL_HITS.map((hit) => (
        <g
          key={hit.mode}
          role="button"
          tabIndex={0}
          aria-label={`Set dial to ${hit.label}`}
          onClick={() => onDialModeChange(hit.mode)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              onDialModeChange(hit.mode);
          }}
          className="cursor-pointer"
        >
          <circle cx={hit.x} cy={hit.y} r={hit.r} fill="transparent" />
          {dialMode === hit.mode ? (
            <circle
              cx={hit.x}
              cy={hit.y}
              r={hit.r - 8}
              fill="none"
              stroke={COLORS.blue}
              strokeWidth={3}
              opacity={0.35}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function MeterPortsAndInsertedPlugs() {
  return (
    <g>
      <Port cx={PORT.com.x} cy={PORT.com.y} active />
      <Port
        cx={PORT.voltOhm.x}
        cy={PORT.voltOhm.y}
        strokeColor={COLORS.redDark}
        active
      />

      <g>
        <rect
          x={249}
          y={678}
          width={34}
          height={112}
          rx={10}
          fill={COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={4}
        />
        <rect
          x={245}
          y={727}
          width={42}
          height={28}
          rx={6}
          fill={COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={4}
        />
        <g stroke="#3b3b3b" strokeWidth={3.2} strokeLinecap="round">
          <line x1={248} y1={744} x2={284} y2={744} />
          <line x1={248} y1={754} x2={284} y2={754} />
          <line x1={248} y1={764} x2={284} y2={764} />
          <line x1={248} y1={774} x2={284} y2={774} />
        </g>
      </g>

      <g>
        <rect
          x={436}
          y={678}
          width={34}
          height={112}
          rx={10}
          fill={COLORS.red}
          stroke={COLORS.redDark}
          strokeWidth={4}
        />
        <rect
          x={432}
          y={727}
          width={42}
          height={28}
          rx={6}
          fill={COLORS.red}
          stroke={COLORS.redDark}
          strokeWidth={4}
        />
        <g stroke={COLORS.redDark} strokeWidth={3.2} strokeLinecap="round">
          <line x1={435} y1={744} x2={471} y2={744} />
          <line x1={435} y1={754} x2={471} y2={754} />
          <line x1={435} y1={764} x2={471} y2={764} />
          <line x1={435} y1={774} x2={471} y2={774} />
        </g>
      </g>
    </g>
  );
}

function LeadsAndProbes({
  leadConnection,
  onLeadConnectionChange,
}: {
  leadConnection: LeadConnection;
  onLeadConnectionChange: (value: LeadConnection) => void;
}) {
  const blackActive = leadConnection !== "blackOpen";
  const redActive = leadConnection !== "redOpen";

  function toggleBlackProbe() {
    onLeadConnectionChange(
      leadConnection === "blackOpen" ? "connected" : "blackOpen",
    );
  }

  function toggleRedProbe() {
    onLeadConnectionChange(
      leadConnection === "redOpen" ? "connected" : "redOpen",
    );
  }

  return (
    <g>
      <Wire
        d={BLACK_CABLE_PATH}
        color={COLORS.black}
        dark="#000000"
        width={10}
        active={blackActive}
      />
      <Wire
        d={RED_CABLE_PATH}
        color={COLORS.red}
        dark={COLORS.redDark}
        width={10}
        active={redActive}
      />

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle black probe connection"
        onClick={toggleBlackProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleBlackProbe();
        }}
        className="cursor-pointer"
        opacity={blackActive ? 1 : 0.35}
      >
        <path
          d="M795 719 L835 540 C838 525 852 519 864 528 L887 544 C896 550 900 559 897 569 L856 721 C852 735 840 741 827 734 L805 723 C798 719 794 711 795 719 Z"
          fill={COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse
          cx={850}
          cy={536}
          rx={18}
          ry={10}
          fill={COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={4}
        />
        <g stroke="#444" strokeWidth={3.2} strokeLinecap="round">
          <line x1={810} y1={637} x2={848} y2={653} />
          <line x1={808} y1={648} x2={846} y2={664} />
          <line x1={806} y1={659} x2={844} y2={675} />
          <line x1={804} y1={670} x2={842} y2={686} />
          <line x1={802} y1={681} x2={840} y2={697} />
        </g>
        <path
          d={BLACK_PROBE_NEEDLE_PATH}
          fill="none"
          stroke={COLORS.black}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={850} cy={545} r={82} fill="transparent" />
      </g>

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle red probe connection"
        onClick={toggleRedProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleRedProbe();
        }}
        className="cursor-pointer"
        opacity={redActive ? 1 : 0.35}
      >
        <path
          d="M1274 721 L1244 544 C1241 527 1250 517 1265 516 L1287 515 C1302 514 1312 522 1314 536 L1345 718 C1347 730 1340 742 1328 745 L1298 749 C1287 750 1277 740 1274 721 Z"
          fill={COLORS.red}
          stroke={COLORS.redDark}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse
          cx={1271}
          cy={534}
          rx={24}
          ry={11}
          fill={COLORS.red}
          stroke={COLORS.redDark}
          strokeWidth={4}
        />
        <g stroke={COLORS.redDark} strokeWidth={3.2} strokeLinecap="round">
          <line x1={1282} y1={636} x2={1321} y2={641} />
          <line x1={1281} y1={646} x2={1322} y2={651} />
          <line x1={1280} y1={656} x2={1323} y2={661} />
          <line x1={1279} y1={666} x2={1324} y2={671} />
          <line x1={1278} y1={676} x2={1325} y2={681} />
          <line x1={1277} y1={686} x2={1326} y2={691} />
        </g>
        <path
          d={RED_PROBE_NEEDLE_PATH}
          fill="none"
          stroke={COLORS.black}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={1271} cy={545} r={82} fill="transparent" />
      </g>

      {leadConnection === "redOpen" ? (
        <g stroke={COLORS.red} strokeWidth={7} strokeLinecap="round">
          <line x1={1235} y1={355} x2={1290} y2={410} />
          <line x1={1290} y1={355} x2={1235} y2={410} />
        </g>
      ) : null}

      {leadConnection === "blackOpen" ? (
        <g stroke={COLORS.red} strokeWidth={7} strokeLinecap="round">
          <line x1={852} y1={356} x2={907} y2={411} />
          <line x1={907} y1={356} x2={852} y2={411} />
        </g>
      ) : null}

      {leadConnection === "shorted" ? (
        <g>
          <path
            d="M879 401 C970 485 1120 485 1263 400"
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="18 12"
          />
          <Label x={1060} y={505} size={26} fill={COLORS.purple}>
            Shorted probes
          </Label>
        </g>
      ) : null}
    </g>
  );
}

function ResistorFigure({
  resistorValue,
  onConnect,
}: {
  resistorValue: number;
  onConnect: () => void;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Connect probes to resistor"
      onClick={onConnect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onConnect();
      }}
      className="cursor-pointer"
    >
      <path
        d="M883 398 H987"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M1172 398 H1277"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={4}
        strokeLinecap="round"
      />

      <path
        d="M879 401 L857 465"
        fill="none"
        stroke="#666666"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M1263 400 L1291 469"
        fill="none"
        stroke="#666666"
        strokeWidth={3}
        strokeLinecap="round"
      />

      <rect
        x={987}
        y={357}
        width={185}
        height={83}
        rx={20}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />

      <path
        d="M1011 357 V440"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={2.5}
      />
      <path
        d="M1149 357 V440"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={2.5}
      />

      <rect x={1035} y={365} width={16} height={67} fill={COLORS.black} />
      <rect x={1076} y={365} width={20} height={67} fill={COLORS.black} />
      <rect x={1120} y={365} width={16} height={67} fill={COLORS.black} />

      <line
        x1={987}
        y1={398}
        x2={958}
        y2={398}
        stroke={COLORS.black}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={1172}
        y1={398}
        x2={1201}
        y2={398}
        stroke={COLORS.black}
        strokeWidth={4}
        strokeLinecap="round"
      />

      <Label x={1080} y={335} size={24} fill={COLORS.gray}>
        {formatResistance(resistorValue)} resistor
      </Label>

      <rect
        x={930}
        y={320}
        width={300}
        height={160}
        rx={18}
        fill="transparent"
      />
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
    <circle r={7} fill={color} opacity={0.9}>
      <animateMotion
        dur="2.6s"
        repeatCount="indefinite"
        path={path}
        begin={begin}
      />
    </circle>
  );
}

function TestSignalAnimation({
  active,
  show,
}: {
  active: boolean;
  show: boolean;
}) {
  if (!show || !active) return null;

  return (
    <g>
      <AnimatedDot path={RED_CABLE_PATH} color={COLORS.redDark} begin="0s" />
      <AnimatedDot path={BLACK_CABLE_PATH} color={COLORS.black} begin="-1.3s" />
      <path
        d={RED_CABLE_PATH}
        stroke={COLORS.redDark}
        strokeWidth={3}
        strokeDasharray="16 20"
        opacity={0.35}
        fill="none"
      />
      <path
        d={BLACK_CABLE_PATH}
        stroke={COLORS.black}
        strokeWidth={3}
        strokeDasharray="16 20"
        opacity={0.35}
        fill="none"
      />
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
  const rightSide = x > 1200;
  const labelX = rightSide
    ? x - DEBUG_TERMINAL_OFFSET.x
    : x + DEBUG_TERMINAL_OFFSET.x;
  const labelY = y + DEBUG_TERMINAL_OFFSET.y;
  const anchor = rightSide ? "end" : "start";

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <circle
        cx={x}
        cy={y}
        r={7}
        fill={color}
        stroke={COLORS.white}
        strokeWidth={3}
      />
      <circle
        cx={x}
        cy={y}
        r={9}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.75}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={700}
        fill={color}
        paintOrder="stroke"
        stroke={COLORS.white}
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
      <DebugDot x={PORT.com.x} y={PORT.com.y} label="COM" color={COLORS.blue} />
      <DebugDot
        x={PORT.voltOhm.x}
        y={PORT.voltOhm.y}
        label="V/Ω"
        color={COLORS.red}
      />
      <DebugDot
        x={NODE.blackProbeTip.x}
        y={NODE.blackProbeTip.y}
        label="BLACK TIP"
        color={COLORS.black}
      />
      <DebugDot
        x={NODE.redProbeTip.x}
        y={NODE.redProbeTip.y}
        label="RED TIP"
        color={COLORS.red}
      />
      <DebugDot
        x={NODE.resistorLeft.x}
        y={NODE.resistorLeft.y}
        label="R LEFT"
        color={COLORS.green}
      />
      <DebugDot
        x={NODE.resistorRight.x}
        y={NODE.resistorRight.y}
        label="R RIGHT"
        color={COLORS.green}
      />
    </g>
  );
}

function SimulationCanvas({
  resistorValue,
  displayText,
  measuredResistance,
  dialMode,
  leadConnection,
  showTestSignal,
  debug,
  safetyStatus,
  externalPower,
  onDialModeChange,
  onLeadConnectionChange,
  onExternalPowerChange,
}: {
  resistorValue: number;
  displayText: string;
  measuredResistance: number | null;
  dialMode: DialMode;
  leadConnection: LeadConnection;
  showTestSignal: boolean;
  debug: boolean;
  safetyStatus: SafetyStatus;
  externalPower: boolean;
  onDialModeChange: (value: DialMode) => void;
  onLeadConnectionChange: (value: LeadConnection) => void;
  onExternalPowerChange: (value: boolean) => void;
}) {
  const testSignalActive =
    dialMode === "ohm" &&
    !externalPower &&
    safetyStatus.tone !== "bad" &&
    (leadConnection === "connected" || leadConnection === "shorted");

  return (
    <div
      role="region"
      aria-label="Interactive resistance measurement canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Digital multimeter measuring resistance of a resistor"
      >
        <rect x="0" y="0" width="1448" height="1086" fill={COLORS.white} />

        <MeterBody
          displayText={displayText}
          dialMode={dialMode}
          safetyStatus={safetyStatus}
          onDialModeChange={onDialModeChange}
        />

        <MeterPortsAndInsertedPlugs />

        <TestSignalAnimation active={testSignalActive} show={showTestSignal} />

        <LeadsAndProbes
          leadConnection={leadConnection}
          onLeadConnectionChange={onLeadConnectionChange}
        />

        <ResistorFigure
          resistorValue={resistorValue}
          onConnect={() => onLeadConnectionChange("connected")}
        />

        <StatusBadge
          safetyStatus={safetyStatus}
          displayText={displayText}
          measuredResistance={measuredResistance}
        />

        <g
          role="button"
          tabIndex={0}
          aria-label={
            externalPower ? "Turn external power off" : "Turn external power on"
          }
          onClick={() => onExternalPowerChange(!externalPower)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              onExternalPowerChange(!externalPower);
          }}
          className="cursor-pointer"
        >
          <rect
            x={690}
            y={720}
            width={465}
            height={72}
            rx={14}
            fill={externalPower ? "#fee2e2" : "#dcfce7"}
            stroke={externalPower ? COLORS.red : COLORS.green}
            strokeWidth={4}
          />
          <Label
            x={922}
            y={745}
            size={23}
            fill={externalPower ? COLORS.red : COLORS.green}
          >
            {externalPower ? "External power ON" : "External power OFF"}
          </Label>
          <Label
            x={922}
            y={772}
            size={17}
            fill={externalPower ? COLORS.red : COLORS.green}
          >
            {externalPower
              ? "Turn power OFF before measuring Ω"
              : "Safe for resistance measurement"}
          </Label>
        </g>

        {dialMode !== "ohm" &&
        dialMode !== "off" &&
        safetyStatus.tone !== "bad" ? (
          <g>
            <rect
              x={665}
              y={815}
              width={360}
              height={66}
              rx={14}
              fill="#fef3c7"
              stroke={COLORS.amber}
              strokeWidth={4}
            />
            <Label x={845} y={840} size={22} fill="#92400e">
              Wrong dial mode
            </Label>
            <Label x={845} y={865} size={17} fill="#92400e">
              Select Ω to measure resistance
            </Label>
          </g>
        ) : null}

        {debug ? <DebugLayer /> : null}
      </svg>
    </div>
  );
}

export default function MeasuringResistanceSketch({
  className = "",
  initialDebug = false,
}: MeasuringResistanceSketchProps) {
  const [resistorValue, setResistorValue] = useState(220);
  const [dialMode, setDialMode] = useState<DialMode>("ohm");
  const [leadConnection, setLeadConnection] =
    useState<LeadConnection>("connected");
  const [externalPower, setExternalPower] = useState(false);
  const [showTestSignal, setShowTestSignal] = useState(true);
  const [debug, setDebug] = useState(initialDebug);

  const simulation = useMemo(() => {
    const measuredResistance = calculateMeasuredResistance({
      resistorValue,
      leadConnection,
      externalPower,
    });

    const displayText = getDisplayText({
      dialMode,
      measuredResistance,
      externalPower,
      leadConnection,
    });

    const safetyStatus = getSafetyStatus({
      dialMode,
      leadConnection,
      externalPower,
      measuredResistance,
    });

    return {
      measuredResistance,
      displayText,
      safetyStatus,
    };
  }, [dialMode, externalPower, leadConnection, resistorValue]);

  function reset() {
    setResistorValue(220);
    setDialMode("ohm");
    setLeadConnection("connected");
    setExternalPower(false);
    setShowTestSignal(true);
    setDebug(initialDebug);
  }

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ControlPanel
          resistorValue={resistorValue}
          setResistorValue={setResistorValue}
          dialMode={dialMode}
          setDialMode={setDialMode}
          leadConnection={leadConnection}
          setLeadConnection={setLeadConnection}
          externalPower={externalPower}
          setExternalPower={setExternalPower}
          showTestSignal={showTestSignal}
          setShowTestSignal={setShowTestSignal}
          debug={debug}
          setDebug={setDebug}
          displayText={simulation.displayText}
          measuredResistance={simulation.measuredResistance}
          safetyStatus={simulation.safetyStatus}
          reset={reset}
        />

        <SimulationCanvas
          resistorValue={resistorValue}
          displayText={simulation.displayText}
          measuredResistance={simulation.measuredResistance}
          dialMode={dialMode}
          leadConnection={leadConnection}
          showTestSignal={showTestSignal}
          debug={debug}
          safetyStatus={simulation.safetyStatus}
          externalPower={externalPower}
          onDialModeChange={setDialMode}
          onLeadConnectionChange={setLeadConnection}
          onExternalPowerChange={setExternalPower}
        />
      </div>
    </div>
  );
}
