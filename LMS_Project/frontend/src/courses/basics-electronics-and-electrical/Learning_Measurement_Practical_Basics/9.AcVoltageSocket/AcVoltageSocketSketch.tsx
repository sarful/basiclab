"use client";

import React, { useMemo, useState } from "react";

type AcVoltageSocketSketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type DialMode = "off" | "vac" | "vdc" | "ohm" | "adc" | "continuity" | "diode";
type RedLeadPort = "VΩ" | "10A";
type LeadConnection = "connected" | "redOpen" | "blackOpen";
type StatusTone = "good" | "warn" | "bad" | "neutral";

type SafetyStatus = {
  label: string;
  detail: string;
  tone: StatusTone;
};

const VIEW_BOX = "0 0 1448 1086";

const C = {
  white: "#ffffff",
  black: "#101010",
  dark: "#202020",
  red: "#e31622",
  redDark: "#a70e17",
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

const DIAL_HITS: Array<{
  mode: DialMode;
  label: string;
  x: number;
  y: number;
  r: number;
}> = [
  { mode: "vac", label: "V AC", x: 383, y: 318, r: 50 },
  { mode: "vdc", label: "V DC", x: 230, y: 404, r: 52 },
  { mode: "ohm", label: "Ω", x: 317, y: 351, r: 48 },
  { mode: "adc", label: "A DC", x: 436, y: 461, r: 52 },
  { mode: "continuity", label: "Continuity", x: 423, y: 404, r: 52 },
  { mode: "diode", label: "Diode", x: 228, y: 518, r: 52 },
  { mode: "off", label: "OFF", x: 326, y: 575, r: 55 },
];

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
      label: "Meter OFF",
      detail:
        "Turn the dial to V AC to measure AC socket voltage in this simulation.",
      tone: "neutral",
    };
  }

  if (redLeadPort === "10A") {
    return {
      label: "Wrong red port",
      detail:
        "Voltage measurement must use the V/Ω port, not the 10A current port.",
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
    label: "Correct AC setup",
    detail: `The meter is reading about ${measuredVoltage.toFixed(0)} V AC.`,
    tone: "good",
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
          ),
        )}

        <Label x={430} y={238} size={18} fill={C.gray}>
          VAC
        </Label>
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
      <path
        d={d}
        stroke={shadowColor}
        strokeWidth={width + 4}
        opacity={active ? 0.55 : 0.25}
      />
      <path
        d={d}
        stroke={wireColor}
        strokeWidth={width}
        opacity={active ? 1 : 0.5}
      />
      <path
        d={d}
        stroke={C.white}
        strokeWidth={1.6}
        opacity={active ? 0.22 : 0.1}
      />
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

function DCSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + 48} y2={y} />
      <line x1={x} y1={y + 13} x2={x + 48} y2={y + 13} strokeDasharray="11 8" />
    </g>
  );
}

function ContinuityIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    >
      <circle cx={-18} cy={8} r={4} fill={C.black} stroke="none" />
      <path d="M-2 0 C10 -10 10 -10 22 8" />
      <path d="M12 -8 C32 -25 32 -25 46 8" />
    </g>
  );
}

function DiodeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={C.black}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    >
      <line x1={-22} y1={0} x2={-4} y2={0} />
      <path d="M-4 -14 L14 0 L-4 14 Z" fill={C.black} />
      <line x1={18} y1={-17} x2={18} y2={17} />
      <line x1={18} y1={0} x2={38} y2={0} />
    </g>
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
  onClick,
  label,
}: {
  cx: number;
  cy: number;
  filled?: boolean;
  fill?: string;
  active?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <g
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
      className={onClick ? "cursor-pointer" : ""}
    >
      {active ? (
        <circle
          cx={cx}
          cy={cy}
          r={31}
          fill="none"
          stroke={fill}
          strokeWidth={4}
          opacity={0.45}
        />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={24}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <circle
        cx={cx}
        cy={cy}
        r={15}
        fill={filled ? fill : C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <circle cx={cx} cy={cy} r={38} fill="transparent" />
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

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm font-semibold ${styles[tone]}`}
    >
      {label}
    </div>
  );
}

function ProbeContactSelector({
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
      subtitle: "Both probes touch contacts",
    },
    {
      value: "redOpen",
      title: "Red open",
      subtitle: "Red probe lifted",
    },
    {
      value: "blackOpen",
      title: "Black open",
      subtitle: "Black probe lifted",
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

function ControlPanel({
  socketVoltage,
  setSocketVoltage,
  dialMode,
  setDialMode,
  redLeadPort,
  setRedLeadPort,
  leadConnection,
  setLeadConnection,
  showVoltagePath,
  setShowVoltagePath,
  debug,
  setDebug,
  displayText,
  measuredVoltage,
  safetyStatus,
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
  showVoltagePath: boolean;
  setShowVoltagePath: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  displayText: string;
  measuredVoltage: number;
  safetyStatus: SafetyStatus;
  reset: () => void;
}) {
  return (
    <aside
      role="complementary"
      aria-label="AC voltage socket simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          AC Voltage Measurement
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Simulate measuring wall-socket voltage with the meter on V~ mode.
        </p>
      </div>

      <div className="space-y-3">
        <RangeControl
          label="Socket voltage"
          value={socketVoltage}
          min={90}
          max={250}
          step={1}
          unit="V"
          onChange={setSocketVoltage}
        />

        <PanelSection
          title="Dial mode"
          helper="For a wall socket, use V AC / V~."
        >
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={dialMode === "off"}
              onClick={() => setDialMode("off")}
              ariaLabel="Set dial off"
            >
              OFF
            </ToggleButton>
            <ToggleButton
              active={dialMode === "vac"}
              onClick={() => setDialMode("vac")}
              ariaLabel="Set dial to AC voltage"
            >
              V AC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "vdc"}
              onClick={() => setDialMode("vdc")}
              ariaLabel="Set dial to DC voltage"
            >
              V DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "ohm"}
              onClick={() => setDialMode("ohm")}
              ariaLabel="Set dial to resistance"
            >
              Ω
            </ToggleButton>
            <ToggleButton
              active={dialMode === "adc"}
              onClick={() => setDialMode("adc")}
              ariaLabel="Set dial to DC current"
            >
              A DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "continuity"}
              onClick={() => setDialMode("continuity")}
              ariaLabel="Set dial to continuity"
            >
              Continuity
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection
          title="Red lead port"
          helper="Voltage uses V/Ω. The 10A port is for current, not voltage."
        >
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={redLeadPort === "VΩ"}
              onClick={() => setRedLeadPort("VΩ")}
              ariaLabel="Move red lead to V ohm port"
            >
              V/Ω
            </ToggleButton>
            <ToggleButton
              active={redLeadPort === "10A"}
              onClick={() => setRedLeadPort("10A")}
              ariaLabel="Move red lead to 10 amp port"
            >
              10A
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection
          title="Probe contact"
          helper="Click a card or click the probes/socket in the canvas."
        >
          <ProbeContactSelector
            leadConnection={leadConnection}
            setLeadConnection={setLeadConnection}
          />
        </PanelSection>

        <PanelSection title="Display options">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={showVoltagePath}
              onClick={() => setShowVoltagePath(!showVoltagePath)}
              ariaLabel="Toggle voltage path"
            >
              Voltage path
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
              <div className="text-xs text-slate-500">Measured AC voltage</div>
              <div className="font-bold text-slate-900">
                {measuredVoltage.toFixed(0)} V
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

        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">
          Real mains voltage is dangerous. This is only a simulator, not a guide
          for testing a live socket.
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
  onDialModeChange,
  onRedLeadPortChange,
}: {
  displayText: string;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  safetyStatus: SafetyStatus;
  onDialModeChange: (value: DialMode) => void;
  onRedLeadPortChange: (value: RedLeadPort) => void;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect
        x={136}
        y={88}
        width={378}
        height={657}
        rx={37}
        fill={C.white}
        stroke={C.black}
        strokeWidth={6}
      />
      <rect
        x={166}
        y={124}
        width={317}
        height={586}
        rx={28}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <rect
        x={190}
        y={148}
        width={271}
        height={120}
        rx={8}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <rect
        x={197}
        y={157}
        width={256}
        height={101}
        rx={4}
        fill={C.white}
        stroke={C.black}
        strokeWidth={2.5}
      />

      <DynamicDisplay value={displayText} />

      <rect
        x={188}
        y={292}
        width={48}
        height={27}
        rx={12}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <Label x={383} y={318} size={35}>
        V~
      </Label>

      <Label x={230} y={404} size={24}>
        V⎓
      </Label>

      <Label x={317} y={351} size={25}>
        Ω
      </Label>

      <ContinuityIcon x={410} y={405} />

      <Label x={436} y={461} size={24}>
        A
      </Label>

      <DiodeIcon x={228} y={518} />

      <Label x={326} y={575} size={24}>
        OFF
      </Label>

      <circle
        cx={326}
        cy={462}
        r={98}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />
      <circle
        cx={326}
        cy={462}
        r={87}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3}
      />

      <SmallTickGroup />

      <g transform={`rotate(${dialAngle} 326 462)`}>
        <rect
          x={307}
          y={368}
          width={38}
          height={193}
          rx={20}
          fill={C.white}
          stroke={C.black}
          strokeWidth={5}
        />
        <path
          d="M326 368 L307 408 L345 408 Z"
          fill={safetyStatus.tone === "bad" ? C.red : C.black}
        />
      </g>

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
              stroke={C.blue}
              strokeWidth={3}
              opacity={0.35}
            />
          ) : null}
        </g>
      ))}

      <MeterPort
        cx={PORT.tenA.x}
        cy={PORT.tenA.y}
        active={redLeadPort === "10A"}
        onClick={() => onRedLeadPortChange("10A")}
        label="Move red lead to 10A port"
      />

      <MeterPort
        cx={PORT.com.x}
        cy={PORT.com.y}
        filled
        fill={C.dark}
        active
        label="COM port"
      />

      <MeterPort cx={PORT.extra.x} cy={PORT.extra.y} />

      <MeterPort
        cx={PORT.voltOhm.x}
        cy={PORT.voltOhm.y}
        filled
        fill={C.red}
        active={redLeadPort === "VΩ"}
        onClick={() => onRedLeadPortChange("VΩ")}
        label="Move red lead to V ohm port"
      />

      <Label
        x={PORT.tenA.x}
        y={612}
        size={18}
        fill={redLeadPort === "10A" ? C.red : C.black}
      >
        10A
      </Label>
      <Label x={PORT.com.x} y={612} size={18}>
        COM
      </Label>
      <Label x={PORT.voltOhm.x} y={612} size={18}>
        V/Ω
      </Label>

      <g>
        <rect
          x={265}
          y={626}
          width={43}
          height={67}
          rx={9}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <rect
          x={273}
          y={684}
          width={26}
          height={48}
          rx={5}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
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

function WallSocket({ onConnect }: { onConnect: () => void }) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Connect both probes to socket contacts"
      onClick={onConnect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onConnect();
      }}
      className="cursor-pointer"
    >
      <rect
        x={852}
        y={268}
        width={386}
        height={365}
        rx={23}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <rect
        x={900}
        y={318}
        width={292}
        height={271}
        rx={13}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <circle
        cx={1045}
        cy={459}
        r={114}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <path
        d="M1032 341 H1058 V368 H1032 Z"
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M1040 341 V361 H1050 V341"
        fill="none"
        stroke={C.black}
        strokeWidth={3}
      />

      <path
        d="M1032 543 H1058 V571 H1032 Z"
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M1040 571 V551 H1050 V571"
        fill="none"
        stroke={C.black}
        strokeWidth={3}
      />

      <circle
        cx={981}
        cy={457}
        r={16}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <circle
        cx={1110}
        cy={457}
        r={16}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <path
        d="M981 457 L960 528"
        fill="none"
        stroke={C.black}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M1110 457 L1136 527"
        fill="none"
        stroke={C.black}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M981 457 L964 513"
        fill="none"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path
        d="M1110 457 L1130 514"
        fill="none"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />

      <rect
        x={920}
        y={330}
        width={250}
        height={250}
        rx={20}
        fill="transparent"
      />
    </g>
  );
}

function ProbesAndWires({
  redLeadPort,
  leadConnection,
  showVoltagePath,
  onLeadConnectionChange,
}: {
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  showVoltagePath: boolean;
  onLeadConnectionChange: (value: LeadConnection) => void;
}) {
  const redWire = getRedWirePath(redLeadPort);
  const redActive = redLeadPort === "VΩ" && leadConnection !== "redOpen";
  const blackActive = leadConnection !== "blackOpen";

  function toggleRedProbe() {
    onLeadConnectionChange(
      leadConnection === "redOpen" ? "connected" : "redOpen",
    );
  }

  function toggleBlackProbe() {
    onLeadConnectionChange(
      leadConnection === "blackOpen" ? "connected" : "blackOpen",
    );
  }

  return (
    <g>
      <Wire
        d={BLACK_WIRE_PATH}
        color={C.black}
        shadow="#000000"
        width={8}
        active={blackActive}
      />
      <Wire
        d={redWire}
        color={C.red}
        shadow={C.redDark}
        width={8}
        active={redActive}
      />

      {showVoltagePath && redActive && blackActive ? (
        <g>
          <path
            d={BLACK_WIRE_PATH}
            stroke={C.black}
            strokeWidth={3}
            strokeDasharray="16 18"
            fill="none"
            opacity={0.32}
          />
          <path
            d={redWire}
            stroke={C.redDark}
            strokeWidth={3}
            strokeDasharray="16 18"
            fill="none"
            opacity={0.42}
          />
          <path
            d="M981 457 H1110"
            stroke={C.green}
            strokeWidth={5}
            strokeDasharray="12 10"
            opacity={0.7}
          />

          <circle r={7} fill={C.green} opacity={0.9}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path={redWire} />
          </circle>

          <circle r={7} fill={C.black} opacity={0.75}>
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path={BLACK_WIRE_PATH}
              begin="-1.2s"
            />
          </circle>

          <Label x={1045} y={420} size={22} fill={C.green}>
            AC voltage across socket contacts
          </Label>
        </g>
      ) : null}

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle black probe contact"
        onClick={toggleBlackProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleBlackProbe();
        }}
        className="cursor-pointer"
        opacity={blackActive ? 1 : 0.35}
      >
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
        <circle cx={884} cy={640} r={110} fill="transparent" />
      </g>

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle red probe contact"
        onClick={toggleRedProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleRedProbe();
        }}
        className="cursor-pointer"
        opacity={redActive ? 1 : 0.35}
      >
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
        <circle cx={1200} cy={640} r={115} fill="transparent" />
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

function StatusBadge({
  safetyStatus,
  displayText,
  measuredVoltage,
}: {
  safetyStatus: SafetyStatus;
  displayText: string;
  measuredVoltage: number;
}) {
  const colorMap: Record<StatusTone, string> = {
    good: C.green,
    warn: C.amber,
    bad: C.red,
    neutral: C.gray,
  };

  const color = colorMap[safetyStatus.tone];

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <rect
        x={620}
        y={74}
        width={430}
        height={122}
        rx={16}
        fill={C.white}
        stroke={color}
        strokeWidth={4}
      />
      <circle cx={652} cy={112} r={10} fill={color} />

      <text
        x={674}
        y={114}
        dominantBaseline="middle"
        fontSize={23}
        fontWeight={800}
        fill={C.black}
      >
        {safetyStatus.label}
      </text>

      <text
        x={648}
        y={149}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={C.gray}
      >
        Display: {displayText}
      </text>

      <text
        x={648}
        y={176}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={C.gray}
      >
        Measured: {measuredVoltage.toFixed(0)} V AC
      </text>
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
      <circle
        cx={x}
        cy={y}
        r={7}
        fill={color}
        stroke={C.white}
        strokeWidth={3}
      />
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
      <DebugDot
        x={NODE.leftSocketHole.x}
        y={NODE.leftSocketHole.y}
        label="SOCKET L"
        color={C.black}
      />
      <DebugDot
        x={NODE.rightSocketHole.x}
        y={NODE.rightSocketHole.y}
        label="SOCKET R"
        color={C.red}
      />
      <DebugDot
        x={NODE.meterDisplay.x}
        y={NODE.meterDisplay.y}
        label="DISPLAY"
        color={C.green}
      />
    </g>
  );
}

function SimulationCanvas({
  socketVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
  showVoltagePath,
  debug,
  displayText,
  safetyStatus,
  measuredVoltage,
  onDialModeChange,
  onRedLeadPortChange,
  onLeadConnectionChange,
}: {
  socketVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  showVoltagePath: boolean;
  debug: boolean;
  displayText: string;
  safetyStatus: SafetyStatus;
  measuredVoltage: number;
  onDialModeChange: (value: DialMode) => void;
  onRedLeadPortChange: (value: RedLeadPort) => void;
  onLeadConnectionChange: (value: LeadConnection) => void;
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
          onDialModeChange={onDialModeChange}
          onRedLeadPortChange={onRedLeadPortChange}
        />

        <WallSocket onConnect={() => onLeadConnectionChange("connected")} />

        <ProbesAndWires
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
          onLeadConnectionChange={onLeadConnectionChange}
        />

        <Label x={1045} y={250} size={26} fill={C.gray}>
          {socketVoltage.toFixed(0)}V AC socket
        </Label>

        <StatusBadge
          safetyStatus={safetyStatus}
          displayText={displayText}
          measuredVoltage={measuredVoltage}
        />

        {safetyStatus.tone === "bad" ? (
          <g>
            <rect
              x={620}
              y={720}
              width={475}
              height={74}
              rx={14}
              fill="#fee2e2"
              stroke={C.red}
              strokeWidth={4}
            />
            <Label x={858} y={746} size={23} fill={C.red}>
              Wrong port for voltage measurement
            </Label>
            <Label x={858} y={773} size={17} fill={C.red}>
              Use V/Ω, not the 10A current port
            </Label>
          </g>
        ) : null}

        {safetyStatus.tone === "warn" &&
        safetyStatus.label !== "Meter OFF" &&
        redLeadPort === "VΩ" ? (
          <g>
            <rect
              x={620}
              y={720}
              width={420}
              height={70}
              rx={14}
              fill="#fef3c7"
              stroke={C.amber}
              strokeWidth={4}
            />
            <Label x={830} y={746} size={23} fill="#92400e">
              Check AC meter setup
            </Label>
            <Label x={830} y={772} size={17} fill="#92400e">
              Use V~ and connect both probes
            </Label>
          </g>
        ) : null}

        {debug ? <DebugLayer redLeadPort={redLeadPort} /> : null}
      </svg>
    </div>
  );
}

export default function AcVoltageSocketSketch({
  className = "",
  initialDebug = false,
}: AcVoltageSocketSketchProps) {
  const [socketVoltage, setSocketVoltage] = useState(230);
  const [dialMode, setDialMode] = useState<DialMode>("vac");
  const [redLeadPort, setRedLeadPort] = useState<RedLeadPort>("VΩ");
  const [leadConnection, setLeadConnection] =
    useState<LeadConnection>("connected");
  const [showVoltagePath, setShowVoltagePath] = useState(true);
  const [debug, setDebug] = useState(initialDebug);

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

    return {
      measuredVoltage,
      displayText,
      safetyStatus,
    };
  }, [socketVoltage, dialMode, redLeadPort, leadConnection]);

  function reset() {
    setSocketVoltage(230);
    setDialMode("vac");
    setRedLeadPort("VΩ");
    setLeadConnection("connected");
    setShowVoltagePath(true);
    setDebug(initialDebug);
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
          showVoltagePath={showVoltagePath}
          setShowVoltagePath={setShowVoltagePath}
          debug={debug}
          setDebug={setDebug}
          displayText={simulation.displayText}
          measuredVoltage={simulation.measuredVoltage}
          safetyStatus={simulation.safetyStatus}
          reset={reset}
        />

        <SimulationCanvas
          socketVoltage={socketVoltage}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
          debug={debug}
          displayText={simulation.displayText}
          safetyStatus={simulation.safetyStatus}
          measuredVoltage={simulation.measuredVoltage}
          onDialModeChange={setDialMode}
          onRedLeadPortChange={setRedLeadPort}
          onLeadConnectionChange={setLeadConnection}
        />
      </div>
    </div>
  );
}
