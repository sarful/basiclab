"use client";

import React, { useMemo, useState } from "react";

type SketchProps = {
  className?: string;
  initialDebug?: boolean;
};

type DialMode =
  | "off"
  | "vdc"
  | "vac"
  | "ohm"
  | "adc"
  | "aac"
  | "continuity"
  | "diode";

type RedLeadPort = "VΩ" | "10A";
type LeadConnection = "connected" | "redOpen" | "blackOpen";
type StatusTone = "good" | "warn" | "bad" | "neutral";

type SafetyStatus = {
  label: string;
  detail: string;
  tone: StatusTone;
};

const VIEW_BOX = "0 -80 1540 1240";

const BLACK = "#111111";
const DARK = "#222222";
const RED = "#e5252a";
const RED_DARK = "#9f151b";
const WHITE = "#ffffff";
const GRAY = "#6b7280";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#f59e0b";

const PORT = {
  com: { x: 244, y: 704 },
  tenA: { x: 351, y: 704 },
  voltOhm: { x: 455, y: 704 },
};

const NODE = {
  batteryNegative: { x: 949, y: 681 },
  batteryPositive: { x: 1155, y: 705 },
  meterDisplay: { x: 347, y: 179 },
  dialCenter: { x: 346, y: 456 },
} as const;

const BLACK_WIRE =
  "M244 729 C242 800 244 850 274 890 C333 966 514 994 626 894 C690 837 678 740 728 655";

const BLACK_LEAD_TO_BATTERY =
  "M825 477 C874 438 931 460 936 523 C939 563 941 604 947 646";

const RED_WIRE_VOLT =
  "M455 729 C455 820 511 905 640 954 C780 1008 1067 1013 1234 960 C1320 932 1327 817 1296 678 C1277 589 1240 512 1186 505 C1154 501 1139 532 1144 583 C1148 626 1150 647 1153 673";

const RED_WIRE_10A =
  "M351 729 C360 810 432 900 580 952 C735 1007 1060 1015 1234 960 C1320 932 1327 817 1296 678 C1277 589 1240 512 1186 505 C1154 501 1139 532 1144 583 C1148 626 1150 647 1153 673";

const DIAL_HITS: Array<{
  mode: DialMode;
  label: string;
  x: number;
  y: number;
  r: number;
}> = [
  { mode: "vdc", label: "V DC", x: 213, y: 340, r: 42 },
  { mode: "ohm", label: "Ω", x: 345, y: 305, r: 42 },
  { mode: "vac", label: "V AC", x: 463, y: 335, r: 42 },
  { mode: "adc", label: "A DC", x: 184, y: 431, r: 42 },
  { mode: "aac", label: "A AC", x: 184, y: 529, r: 42 },
  { mode: "diode", label: "Diode", x: 491, y: 411, r: 42 },
  { mode: "continuity", label: "Continuity", x: 508, y: 503, r: 42 },
  { mode: "off", label: "OFF", x: 477, y: 568, r: 44 },
];

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
      label: "Meter OFF",
      detail: "Click V DC on the dial to measure the battery.",
      tone: "neutral",
    };
  }

  if (redLeadPort === "10A") {
    return {
      label: "Wrong port",
      detail: "Red lead is in 10A. Click V/Ω for voltage measurement.",
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
      label: "Wrong dial",
      detail: "Click V DC on the multimeter dial.",
      tone: "warn",
    };
  }

  return {
    label: "Correct setup",
    detail: `The meter is measuring ${measuredVoltage.toFixed(2)}V across the battery.`,
    tone: "good",
  };
}

function getDialAngle(dialMode: DialMode) {
  switch (dialMode) {
    case "ohm":
      return 0;
    case "vdc":
      return -48;
    case "vac":
      return 48;
    case "adc":
      return -96;
    case "aac":
      return -132;
    case "diode":
      return 78;
    case "continuity":
      return 108;
    case "off":
      return 138;
    default:
      return -48;
  }
}

function getRedWirePath(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? RED_WIRE_VOLT : RED_WIRE_10A;
}

function getRedPortPosition(redLeadPort: RedLeadPort) {
  return redLeadPort === "VΩ" ? PORT.voltOhm : PORT.tenA;
}

function Label({
  x,
  y,
  children,
  size = 30,
  anchor = "middle",
  fill = BLACK,
  weight = 600,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  weight?: number;
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
      fontWeight={weight}
    >
      {children}
    </text>
  );
}

function DcSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={BLACK} strokeWidth={3} strokeLinecap="round">
      <line x1={x - 15} y1={y} x2={x + 15} y2={y} />
      <line
        x1={x - 15}
        y1={y + 11}
        x2={x + 15}
        y2={y + 11}
        strokeDasharray="7 6"
      />
    </g>
  );
}

function DynamicDisplay({ value }: { value: string }) {
  const fontSize = value.length > 7 ? 50 : value.length > 5 ? 58 : 78;

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
        letterSpacing={value.includes(".") ? 0 : 2}
        fill={BLACK}
      >
        {value}
      </text>
    </g>
  );
}

function WirePath({
  d,
  color,
  dark,
  width = 10,
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
      <path
        d={d}
        stroke={shadowColor}
        strokeWidth={width + 4}
        opacity={active ? 0.55 : 0.25}
      />
      <path
        d={d}
        stroke={mainColor}
        strokeWidth={width}
        opacity={active ? 1 : 0.5}
      />
      <path
        d={d}
        stroke={WHITE}
        strokeWidth={2}
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
    redActive: boolean;
    blackActive: boolean;
  }> = [
    {
      value: "connected",
      title: "Connected",
      subtitle: "Both probes touch battery",
      redActive: true,
      blackActive: true,
    },
    {
      value: "redOpen",
      title: "Red open",
      subtitle: "Red probe lifted",
      redActive: false,
      blackActive: true,
    },
    {
      value: "blackOpen",
      title: "Black open",
      subtitle: "Black probe lifted",
      redActive: true,
      blackActive: false,
    },
  ];

  return (
    <div className="grid gap-2">
      {options.map((option) => {
        const active = leadConnection === option.value;
        const strokeColor = active ? WHITE : BLACK;
        const textColor = active ? WHITE : BLACK;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setLeadConnection(option.value)}
            className={[
              "group rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2",
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 150 54"
                className="h-12 w-32 shrink-0"
                aria-hidden="true"
              >
                <rect
                  x="54"
                  y="15"
                  width="42"
                  height="24"
                  rx="4"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                />

                <text
                  x="65"
                  y="32"
                  fontSize="14"
                  fontWeight="800"
                  fill={textColor}
                >
                  −
                </text>

                <text
                  x="83"
                  y="32"
                  fontSize="14"
                  fontWeight="800"
                  fill={textColor}
                >
                  +
                </text>

                <line
                  x1="20"
                  y1={option.blackActive ? "27" : "10"}
                  x2="62"
                  y2="27"
                  stroke={option.blackActive ? strokeColor : "#ef4444"}
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <line
                  x1="130"
                  y1={option.redActive ? "27" : "10"}
                  x2="88"
                  y2="27"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {!option.blackActive ? (
                  <g stroke="#ef4444" strokeWidth="4" strokeLinecap="round">
                    <line x1="14" y1="4" x2="30" y2="20" />
                    <line x1="30" y1="4" x2="14" y2="20" />
                  </g>
                ) : null}

                {!option.redActive ? (
                  <g stroke="#ef4444" strokeWidth="4" strokeLinecap="round">
                    <line x1="122" y1="4" x2="138" y2="20" />
                    <line x1="138" y1="4" x2="122" y2="20" />
                  </g>
                ) : null}
              </svg>

              <div>
                <div className="text-sm font-bold">{option.title}</div>
                <div
                  className={[
                    "mt-1 text-xs",
                    active ? "text-slate-200" : "text-slate-500",
                  ].join(" ")}
                >
                  {option.subtitle}
                </div>
              </div>
            </div>
          </button>
        );
      })}
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
  showVoltagePath,
  setShowVoltagePath,
  debug,
  setDebug,
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
  showVoltagePath: boolean;
  setShowVoltagePath: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  reset: () => void;
}) {
  return (
    <aside
      role="complementary"
      aria-label="DC voltage measurement controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          DC Voltage Measurement
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Click the meter dial, change the red port, and test probe contact
          states.
        </p>
      </div>

      <div className="space-y-3">
        <RangeControl
          label="Battery voltage"
          value={batteryVoltage}
          min={1}
          max={24}
          step={0.05}
          unit="V"
          onChange={setBatteryVoltage}
        />

        <PanelSection
          title="Dial mode"
          helper="You can also click the symbols around the dial."
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
              active={dialMode === "vdc"}
              onClick={() => setDialMode("vdc")}
              ariaLabel="Set dial to DC voltage"
            >
              V DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "vac"}
              onClick={() => setDialMode("vac")}
              ariaLabel="Set dial to AC voltage"
            >
              V AC
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
              ariaLabel="Set dial to DC amps"
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
          helper="You can also click V/Ω or 10A on the meter."
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
          helper="Click a scenario card or click the actual probes in the SVG."
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

function Port({
  cx,
  cy,
  color = BLACK,
  active = false,
  onClick,
  label,
}: {
  cx: number;
  cy: number;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <g
      role={onClick ? "button" : undefined}
      aria-label={label}
      tabIndex={onClick ? 0 : undefined}
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
          r={39}
          fill="none"
          stroke={color}
          strokeWidth={5}
          opacity={0.45}
        />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={29}
        fill={WHITE}
        stroke={color}
        strokeWidth={5}
      />
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <circle cx={cx} cy={cy} r={46} fill="transparent" />
    </g>
  );
}

function TerminalGlow({
  x,
  y,
  color,
  active,
}: {
  x: number;
  y: number;
  color: string;
  active: boolean;
}) {
  if (!active) return null;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={36}
        fill="none"
        stroke={color}
        strokeWidth={7}
        opacity={0.18}
      />
      <circle
        cx={x}
        cy={y}
        r={25}
        fill="none"
        stroke={color}
        strokeWidth={4}
        opacity={0.45}
      />
    </g>
  );
}

function MultimeterBody({
  displayText,
  dialMode,
  redLeadPort,
  safetyStatus,
  onDialModeChange,
}: {
  displayText: string;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  safetyStatus: SafetyStatus;
  onDialModeChange: (mode: DialMode) => void;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect
        x={121}
        y={49}
        width={452}
        height={754}
        rx={38}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={5}
      />
      <rect
        x={144}
        y={72}
        width={406}
        height={707}
        rx={26}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />

      <rect
        x={176}
        y={106}
        width={342}
        height={147}
        rx={11}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <rect
        x={185}
        y={116}
        width={324}
        height={126}
        rx={7}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={3}
      />

      <DynamicDisplay value={displayText} />

      <Label x={213} y={316} size={33}>
        V
      </Label>
      <DcSymbol x={213} y={340} />

      <Label x={345} y={305} size={34}>
        Ω
      </Label>
      <line
        x1={345}
        y1={327}
        x2={345}
        y2={339}
        stroke={BLACK}
        strokeWidth={3}
      />

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

      <g
        transform="translate(491 411)"
        stroke={BLACK}
        strokeWidth={4}
        fill="none"
      >
        <path d="M-16 0 H20" />
        <path d="M-6 -15 L10 0 L-6 15 Z" fill={BLACK} />
        <path d="M22 -18 V18" />
      </g>

      <g
        transform="translate(508 503)"
        fill="none"
        stroke={BLACK}
        strokeWidth={4}
        strokeLinecap="round"
      >
        <path d="M-15 -12 C-4 -5, -4 5, -15 12" />
        <path d="M-4 -20 C13 -8, 13 8, -4 20" />
        <circle cx={-25} cy={0} r={3} fill={BLACK} />
      </g>

      <circle
        cx={346}
        cy={456}
        r={119}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <circle
        cx={346}
        cy={456}
        r={109}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={3}
      />

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
        <rect
          x={326}
          y={338}
          width={41}
          height={236}
          rx={22}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={4}
        />

        <path
          d="M346 338 L331 368 L361 368 Z"
          fill={safetyStatus.tone === "bad" ? RED : BLACK}
        />
      </g>

      <Label x={241} y={652} size={28}>
        COM
      </Label>
      <Label
        x={351}
        y={652}
        size={25}
        fill={redLeadPort === "10A" ? RED : BLACK}
      >
        10A
      </Label>
      <Label x={457} y={652} size={28}>
        V/Ω
      </Label>

      {DIAL_HITS.map((hit) => (
        <g
          key={hit.mode}
          role="button"
          aria-label={`Set dial to ${hit.label}`}
          tabIndex={0}
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
              r={hit.r - 7}
              fill="none"
              stroke={BLUE}
              strokeWidth={3}
              opacity={0.35}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function Battery({
  voltage,
  leadConnection,
}: {
  voltage: number;
  leadConnection: LeadConnection;
}) {
  const positiveActive = leadConnection !== "redOpen";
  const negativeActive = leadConnection !== "blackOpen";

  return (
    <g>
      <TerminalGlow
        x={NODE.batteryNegative.x}
        y={NODE.batteryNegative.y}
        color={BLACK}
        active={negativeActive}
      />
      <TerminalGlow
        x={NODE.batteryPositive.x}
        y={NODE.batteryPositive.y}
        color={RED}
        active={positiveActive}
      />

      <rect
        x={896}
        y={694}
        width={322}
        height={246}
        rx={8}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <path d="M896 773 H1218" stroke={BLACK} strokeWidth={4} />

      <path
        d="M910 693 L926 665 H1188 L1210 693 Z"
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      <g>
        <rect
          x={941}
          y={671}
          width={43}
          height={38}
          rx={8}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={4}
        />
        <ellipse
          cx={962.5}
          cy={672}
          rx={22}
          ry={7}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={3}
        />
      </g>

      <g>
        <rect
          x={1133}
          y={671}
          width={43}
          height={38}
          rx={8}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={4}
        />
        <ellipse
          cx={1154.5}
          cy={672}
          rx={22}
          ry={7}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={3}
        />
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
      <WirePath
        d={BLACK_WIRE}
        color={BLACK}
        dark="#000000"
        width={10}
        active={blackActive}
      />
      <WirePath
        d={BLACK_LEAD_TO_BATTERY}
        color={BLACK}
        dark="#000000"
        width={9}
        active={blackActive}
      />
      <WirePath
        d={redWire}
        color={RED}
        dark={RED_DARK}
        width={10}
        active={redActive}
      />

      {showVoltagePath && redActive && blackActive ? (
        <g>
          <path
            d={redWire}
            stroke={RED_DARK}
            strokeWidth={3}
            strokeDasharray="18 20"
            fill="none"
            opacity={0.45}
            className="voltage-dash"
          />
          <path
            d={BLACK_WIRE}
            stroke={BLACK}
            strokeWidth={3}
            strokeDasharray="18 20"
            fill="none"
            opacity={0.35}
            className="voltage-dash"
          />
          <Label x={760} y={1025} size={24} fill={GREEN}>
            Voltage path active
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
  leadConnection,
  onRedPortChange,
  onLeadConnectionChange,
}: {
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  onRedPortChange: (port: RedLeadPort) => void;
  onLeadConnectionChange: (value: LeadConnection) => void;
}) {
  const redPort = getRedPortPosition(redLeadPort);

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
      <Port
        cx={PORT.com.x}
        cy={PORT.com.y}
        color={BLACK}
        active
        label="COM port"
      />

      <Port
        cx={PORT.tenA.x}
        cy={PORT.tenA.y}
        color={redLeadPort === "10A" ? RED : BLACK}
        active={redLeadPort === "10A"}
        label="Move red lead to 10A port"
        onClick={() => onRedPortChange("10A")}
      />

      <Port
        cx={PORT.voltOhm.x}
        cy={PORT.voltOhm.y}
        color={RED}
        active={redLeadPort === "VΩ"}
        label="Move red lead to V ohm port"
        onClick={() => onRedPortChange("VΩ")}
      />

      <g>
        <rect
          x={229}
          y={704}
          width={31}
          height={60}
          rx={8}
          fill={DARK}
          stroke={BLACK}
          strokeWidth={3}
        />
        <rect
          x={225}
          y={741}
          width={39}
          height={28}
          rx={4}
          fill={DARK}
          stroke={BLACK}
          strokeWidth={3}
        />
        <line
          x1={230}
          y1={755}
          x2={260}
          y2={755}
          stroke={BLACK}
          strokeWidth={3}
        />
        <line
          x1={230}
          y1={763}
          x2={260}
          y2={763}
          stroke={BLACK}
          strokeWidth={3}
        />
      </g>

      <g>
        <rect
          x={redPort.x - 15}
          y={704}
          width={31}
          height={60}
          rx={8}
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={3}
        />
        <rect
          x={redPort.x - 19}
          y={741}
          width={39}
          height={28}
          rx={4}
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={3}
        />
        <line
          x1={redPort.x - 14}
          y1={755}
          x2={redPort.x + 16}
          y2={755}
          stroke={RED_DARK}
          strokeWidth={3}
        />
        <line
          x1={redPort.x - 14}
          y1={763}
          x2={redPort.x + 16}
          y2={763}
          stroke={RED_DARK}
          strokeWidth={3}
        />
      </g>

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle black probe contact"
        onClick={toggleBlackProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleBlackProbe();
        }}
        className="cursor-pointer"
      >
        <path
          d="M719 653 L817 475 C824 462 839 463 845 474 L748 660 C741 674 724 670 719 653 Z"
          fill={DARK}
          stroke={BLACK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M810 485 L835 500"
          stroke={BLACK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <g stroke="#444" strokeWidth={3} strokeLinecap="round">
          <line x1={776} y1={548} x2={807} y2={567} />
          <line x1={768} y1={562} x2={799} y2={581} />
          <line x1={760} y1={576} x2={791} y2={595} />
          <line x1={752} y1={590} x2={783} y2={609} />
        </g>
        <circle cx={785} cy={570} r={82} fill="transparent" />
      </g>

      <g
        role="button"
        tabIndex={0}
        aria-label="Toggle black terminal probe contact"
        onClick={toggleBlackProbe}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggleBlackProbe();
        }}
        className="cursor-pointer"
      >
        <rect
          x={935}
          y={522}
          width={27}
          height={126}
          rx={8}
          fill={DARK}
          stroke={BLACK}
          strokeWidth={4}
        />
        <rect
          x={930}
          y={627}
          width={38}
          height={9}
          rx={4}
          fill={DARK}
          stroke={BLACK}
          strokeWidth={4}
        />
        <path
          d="M949 648 V681"
          stroke={BLACK}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M949 648 V681"
          stroke={WHITE}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.35}
        />
        <circle cx={949} cy={590} r={70} fill="transparent" />
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
      >
        <rect
          x={1140}
          y={515}
          width={29}
          height={129}
          rx={8}
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={4}
        />
        <path
          d="M1136 646 L1173 646 L1163 674 L1146 674 Z"
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect
          x={1126}
          y={611}
          width={58}
          height={10}
          rx={5}
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={4}
        />
        <path
          d="M1155 674 V705"
          stroke={BLACK}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M1155 674 V705"
          stroke={WHITE}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.35}
        />
        <g stroke={RED_DARK} strokeWidth={3} strokeLinecap="round">
          <line x1={1144} y1={535} x2={1165} y2={535} />
          <line x1={1142} y1={548} x2={1166} y2={548} />
          <line x1={1142} y1={561} x2={1167} y2={561} />
          <line x1={1142} y1={574} x2={1167} y2={574} />
        </g>
        <circle cx={1155} cy={590} r={76} fill="transparent" />
      </g>
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
  const statusColor: Record<StatusTone, string> = {
    good: GREEN,
    warn: AMBER,
    bad: RED,
    neutral: GRAY,
  };

  const color = statusColor[safetyStatus.tone];

  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <rect
        x={1015}
        y={70}
        width={430}
        height={125}
        rx={18}
        fill={WHITE}
        stroke={color}
        strokeWidth={4}
      />
      <circle cx={1048} cy={108} r={10} fill={color} />
      <text
        x={1070}
        y={110}
        dominantBaseline="middle"
        fontSize={24}
        fontWeight={800}
        fill={BLACK}
      >
        {safetyStatus.label}
      </text>
      <text
        x={1040}
        y={146}
        dominantBaseline="middle"
        fontSize={18}
        fontWeight={600}
        fill={GRAY}
      >
        Display: {displayText}
      </text>
      <text
        x={1040}
        y={174}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={GRAY}
      >
        Measured: {measuredVoltage.toFixed(2)} V
      </text>
    </g>
  );
}

function MessageBanner({
  safetyStatus,
  dialMode,
  redLeadPort,
}: {
  safetyStatus: SafetyStatus;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
}) {
  if (safetyStatus.tone === "bad") {
    return (
      <g>
        <rect
          x={620}
          y={305}
          width={455}
          height={76}
          rx={14}
          fill="#fee2e2"
          stroke={RED}
          strokeWidth={4}
        />
        <Label x={848} y={331} size={22} fill={RED}>
          Wrong port for voltage
        </Label>
        <Label x={848} y={359} size={17} fill={RED}>
          Click V/Ω or move red lead there
        </Label>
      </g>
    );
  }

  if (
    safetyStatus.tone === "warn" &&
    dialMode !== "off" &&
    redLeadPort === "VΩ"
  ) {
    return (
      <g>
        <rect
          x={620}
          y={305}
          width={455}
          height={76}
          rx={14}
          fill="#fef3c7"
          stroke={AMBER}
          strokeWidth={4}
        />
        <Label x={848} y={331} size={22} fill="#92400e">
          {safetyStatus.label}
        </Label>
        <Label x={848} y={359} size={17} fill="#92400e">
          {safetyStatus.detail}
        </Label>
      </g>
    );
  }

  return null;
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
        y={y - 18}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={16}
        fontWeight={700}
        fill={color}
        paintOrder="stroke"
        stroke={WHITE}
        strokeWidth={4}
      >
        {label} ({Math.round(x)},{Math.round(y)})
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
      <DebugDot
        x={NODE.batteryNegative.x}
        y={NODE.batteryNegative.y}
        label="BAT−"
        color={BLACK}
      />
      <DebugDot
        x={NODE.batteryPositive.x}
        y={NODE.batteryPositive.y}
        label="BAT+"
        color={RED}
      />
      <DebugDot
        x={NODE.meterDisplay.x}
        y={NODE.meterDisplay.y}
        label="DISPLAY"
        color={GREEN}
      />
    </g>
  );
}

function SimulationCanvas({
  batteryVoltage,
  dialMode,
  redLeadPort,
  leadConnection,
  showVoltagePath,
  debug,
  displayText,
  measuredVoltage,
  safetyStatus,
  onDialModeChange,
  onRedPortChange,
  onLeadConnectionChange,
}: {
  batteryVoltage: number;
  dialMode: DialMode;
  redLeadPort: RedLeadPort;
  leadConnection: LeadConnection;
  showVoltagePath: boolean;
  debug: boolean;
  displayText: string;
  measuredVoltage: number;
  safetyStatus: SafetyStatus;
  onDialModeChange: (mode: DialMode) => void;
  onRedPortChange: (port: RedLeadPort) => void;
  onLeadConnectionChange: (value: LeadConnection) => void;
}) {
  return (
    <div
      role="region"
      aria-label="Interactive DC voltage measurement canvas"
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <style>
        {`
          @keyframes dashMove {
            to {
              stroke-dashoffset: -80;
            }
          }

          .voltage-dash {
            animation: dashMove 1.2s linear infinite;
          }
        `}
      </style>

      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Digital multimeter measuring DC voltage from a battery"
      >
        <rect x={0} y={-80} width={1540} height={1240} fill={WHITE} />

        <MultimeterBody
          displayText={displayText}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          safetyStatus={safetyStatus}
          onDialModeChange={onDialModeChange}
        />

        <Wires
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
        />

        <Battery voltage={batteryVoltage} leadConnection={leadConnection} />

        <ProbesAndPorts
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          onRedPortChange={onRedPortChange}
          onLeadConnectionChange={onLeadConnectionChange}
        />

        <MessageBanner
          safetyStatus={safetyStatus}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
        />

        <StatusBadge
          safetyStatus={safetyStatus}
          displayText={displayText}
          measuredVoltage={measuredVoltage}
        />

        {debug ? <DebugLayer redLeadPort={redLeadPort} /> : null}
      </svg>
    </div>
  );
}

export default function MeasuringVoltageSketch({
  className = "",
  initialDebug = false,
}: SketchProps) {
  const [batteryVoltage, setBatteryVoltage] = useState(12.45);
  const [dialMode, setDialMode] = useState<DialMode>("vdc");
  const [redLeadPort, setRedLeadPort] = useState<RedLeadPort>("VΩ");
  const [leadConnection, setLeadConnection] =
    useState<LeadConnection>("connected");
  const [showVoltagePath, setShowVoltagePath] = useState(true);
  const [debug, setDebug] = useState(initialDebug);

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

    return {
      measuredVoltage,
      displayText,
      safetyStatus,
    };
  }, [batteryVoltage, dialMode, leadConnection, redLeadPort]);

  function reset() {
    setBatteryVoltage(12.45);
    setDialMode("vdc");
    setRedLeadPort("VΩ");
    setLeadConnection("connected");
    setShowVoltagePath(true);
    setDebug(initialDebug);
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
          showVoltagePath={showVoltagePath}
          setShowVoltagePath={setShowVoltagePath}
          debug={debug}
          setDebug={setDebug}
          reset={reset}
        />

        <SimulationCanvas
          batteryVoltage={batteryVoltage}
          dialMode={dialMode}
          redLeadPort={redLeadPort}
          leadConnection={leadConnection}
          showVoltagePath={showVoltagePath}
          debug={debug}
          displayText={simulation.displayText}
          measuredVoltage={simulation.measuredVoltage}
          safetyStatus={simulation.safetyStatus}
          onDialModeChange={setDialMode}
          onRedPortChange={setRedLeadPort}
          onLeadConnectionChange={setLeadConnection}
        />
      </div>
    </div>
  );
}
