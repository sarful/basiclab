"use client";

import React, { useMemo, useState } from "react";

type DialMode = "off" | "adc" | "vdc" | "ohm";
type RedProbePort = "10A" | "mA";
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

const VIEW_BOX = "0 0 1500 1120";

const C = {
  white: "#ffffff",
  black: "#111111",
  dark: "#222222",
  gray: "#6b7280",
  red: "#ef2a2a",
  redDark: "#b4141b",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  purple: "#9333ea",
  lampOn: "#fff2a8",
};

const BASE_WIRE_WIDTH = 7;
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

const DIAL_HITS: Array<{
  mode: DialMode;
  label: string;
  x: number;
  y: number;
  r: number;
}> = [
  { mode: "off", label: "OFF", x: 294, y: 320, r: 48 },
  { mode: "vdc", label: "V DC", x: 132, y: 345, r: 58 },
  { mode: "ohm", label: "Ω", x: 116, y: 450, r: 58 },
  { mode: "adc", label: "A DC", x: 450, y: 438, r: 70 },
];

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
    message:
      current > 0.2
        ? "Safe on 10A port."
        : "Current is within low-current range.",
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
      label: "Meter OFF",
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
      label: "10A overload",
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
      label: "Wrong dial",
      detail: "Select A DC for current measurement.",
      tone: "warn",
    };
  }

  return {
    label: "Correct setup",
    detail: `The ammeter is measuring ${current.toFixed(3)}A in series.`,
    tone: "good",
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
  const mainColor = active ? color : C.gray;
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
        stroke={mainColor}
        strokeWidth={width}
        opacity={active ? 1 : 0.5}
      />
      <path
        d={d}
        stroke={C.white}
        strokeWidth={1.5}
        opacity={active ? 0.25 : 0.1}
      />
    </g>
  );
}

function Port({
  cx,
  cy,
  color = C.black,
  active = false,
  onClick,
  label,
}: {
  cx: number;
  cy: number;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  label?: string;
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
          r={37}
          fill="none"
          stroke={color}
          strokeWidth={4}
          opacity={0.45}
        />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={31}
        fill={C.white}
        stroke={color}
        strokeWidth={5}
      />
      <circle
        cx={cx}
        cy={cy}
        r={19}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />
      <circle cx={cx} cy={cy} r={46} fill="transparent" />
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

function StatusBadge({
  safetyStatus,
  displayText,
  current,
}: {
  safetyStatus: SafetyStatus;
  displayText: string;
  current: number;
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
        x={610}
        y={40}
        width={320}
        height={118}
        rx={16}
        fill={C.white}
        stroke={color}
        strokeWidth={4}
      />
      <circle cx={640} cy={78} r={10} fill={color} />
      <text
        x={662}
        y={80}
        dominantBaseline="middle"
        fontSize={23}
        fontWeight={800}
        fill={C.black}
      >
        {safetyStatus.label}
      </text>
      <text
        x={635}
        y={115}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={C.gray}
      >
        Display: {displayText}
      </text>
      <text
        x={635}
        y={142}
        dominantBaseline="middle"
        fontSize={17}
        fontWeight={600}
        fill={C.gray}
      >
        Current: {current.toFixed(3)} A
      </text>
    </g>
  );
}

function CircuitSwitchSelector({
  circuitClosed,
  setCircuitClosed,
}: {
  circuitClosed: boolean;
  setCircuitClosed: (value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        aria-pressed={circuitClosed}
        onClick={() => setCircuitClosed(true)}
        className={[
          "rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2",
          circuitClosed
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
        ].join(" ")}
      >
        <div className="text-sm font-bold">Closed</div>
        <div
          className={[
            "mt-1 text-xs",
            circuitClosed ? "text-slate-200" : "text-slate-500",
          ].join(" ")}
        >
          Current can flow
        </div>
      </button>

      <button
        type="button"
        aria-pressed={!circuitClosed}
        onClick={() => setCircuitClosed(false)}
        className={[
          "rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2",
          !circuitClosed
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
        ].join(" ")}
      >
        <div className="text-sm font-bold">Open</div>
        <div
          className={[
            "mt-1 text-xs",
            !circuitClosed ? "text-slate-200" : "text-slate-500",
          ].join(" ")}
        >
          Path is broken
        </div>
      </button>
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
  showCurrentFlow,
  setShowCurrentFlow,
  debug,
  setDebug,
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
  showCurrentFlow: boolean;
  setShowCurrentFlow: (value: boolean) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  reset: () => void;
}) {
  return (
    <aside
      role="complementary"
      aria-label="Ammeter simulation controls"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Ammeter Simulation</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Change circuit values, click the meter dial, and test current
          measurement safely.
        </p>
      </div>

      <div className="space-y-3">
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

        <PanelSection
          title="Circuit switch"
          helper="Current only flows through a complete path."
        >
          <CircuitSwitchSelector
            circuitClosed={circuitClosed}
            setCircuitClosed={setCircuitClosed}
          />
        </PanelSection>

        <PanelSection
          title="Dial mode"
          helper="You can also click the meter symbols."
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
              active={dialMode === "adc"}
              onClick={() => setDialMode("adc")}
              ariaLabel="Set dial to DC amps"
            >
              A DC
            </ToggleButton>
            <ToggleButton
              active={dialMode === "vdc"}
              onClick={() => setDialMode("vdc")}
              ariaLabel="Set dial to DC volts"
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
          </div>
        </PanelSection>

        <PanelSection
          title="Red probe port"
          helper="Use 10A for currents above 200mA."
        >
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={redProbePort === "10A"}
              onClick={() => setRedProbePort("10A")}
              ariaLabel="Move red probe to 10A port"
            >
              10A
            </ToggleButton>
            <ToggleButton
              active={redProbePort === "mA"}
              onClick={() => setRedProbePort("mA")}
              ariaLabel="Move red probe to mA port"
            >
              mA
            </ToggleButton>
          </div>
        </PanelSection>

        <PanelSection title="Display options">
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={showCurrentFlow}
              onClick={() => setShowCurrentFlow(!showCurrentFlow)}
              ariaLabel="Toggle current flow animation"
            >
              Current flow
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

function Multimeter({
  displayText,
  dialMode,
  redProbePort,
  fuseStatus,
  onDialModeChange,
  onRedProbePortChange,
}: {
  displayText: string;
  dialMode: DialMode;
  redProbePort: RedProbePort;
  fuseStatus: FuseStatus;
  onDialModeChange: (mode: DialMode) => void;
  onRedProbePortChange: (port: RedProbePort) => void;
}) {
  const dialAngle = getDialAngle(dialMode);

  return (
    <g>
      <rect
        x={62}
        y={45}
        width={467}
        height={898}
        rx={46}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />
      <rect
        x={83}
        y={67}
        width={425}
        height={854}
        rx={31}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3.8}
      />

      <rect
        x={105}
        y={99}
        width={375}
        height={166}
        rx={14}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4.5}
      />
      <rect
        x={115}
        y={109}
        width={355}
        height={145}
        rx={7}
        fill={C.white}
        stroke={C.black}
        strokeWidth={2.5}
      />

      <DynamicDisplay value={displayText} />

      <line
        x1={83}
        y1={286}
        x2={508}
        y2={286}
        stroke={C.black}
        strokeWidth={3}
      />

      <Label x={294} y={320} size={31}>
        OFF
      </Label>
      <line
        x1={294}
        y1={337}
        x2={294}
        y2={359}
        stroke={C.black}
        strokeWidth={4}
      />

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

      <circle
        cx={293}
        cy={499}
        r={143}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />
      <circle
        cx={293}
        cy={499}
        r={130}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3}
      />

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
        <rect
          x={270}
          y={356}
          width={45}
          height={286}
          rx={24}
          fill={C.white}
          stroke={C.black}
          strokeWidth={5}
        />
        <path
          d="M293 356 L273 398 L313 398 Z"
          fill={fuseStatus.safe ? C.black : C.red}
        />
      </g>

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
              r={hit.r - 8}
              fill="none"
              stroke={C.blue}
              strokeWidth={3}
              opacity={0.35}
            />
          ) : null}
        </g>
      ))}

      <Label x={150} y={735} size={28}>
        10A
      </Label>
      <Port
        cx={PORT.red10A.x}
        cy={PORT.red10A.y}
        color={C.redDark}
        active={redProbePort === "10A"}
        label="Move red probe to 10A port"
        onClick={() => onRedProbePortChange("10A")}
      />

      <Label x={293} y={735} size={31}>
        COM
      </Label>
      <Port cx={PORT.com.x} cy={PORT.com.y} active label="COM port" />

      <Label x={428} y={735} size={28}>
        mA
      </Label>
      <Port
        cx={PORT.redMA.x}
        cy={PORT.redMA.y}
        color={C.redDark}
        active={redProbePort === "mA"}
        label="Move red probe to mA port"
        onClick={() => onRedProbePortChange("mA")}
      />

      <GroundIcon x={242} y={865} />

      <Label x={150} y={840} size={20}>
        FUSED
      </Label>
      <Label x={150} y={866} size={18}>
        10A MAX
      </Label>

      <Label
        x={428}
        y={840}
        size={20}
        fill={fuseStatus.mAFuseBlown ? C.red : C.black}
      >
        FUSED
      </Label>
      <Label
        x={428}
        y={866}
        size={18}
        fill={fuseStatus.mAFuseBlown ? C.red : C.black}
      >
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
        <rect
          x={274}
          y={780}
          width={38}
          height={78}
          rx={10}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <rect
          x={266}
          y={832}
          width={54}
          height={34}
          rx={6}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
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
          <line
            x1={redNode.x - 15}
            y1={redNode.y + 44}
            x2={redNode.x + 19}
            y2={redNode.y + 44}
          />
          <line
            x1={redNode.x - 12}
            y1={redNode.y + 55}
            x2={redNode.x + 16}
            y2={redNode.y + 55}
          />
          <line
            x1={redNode.x - 9}
            y1={redNode.y + 66}
            x2={redNode.x + 13}
            y2={redNode.y + 66}
          />
          <line
            x1={redNode.x - 6}
            y1={redNode.y + 77}
            x2={redNode.x + 10}
            y2={redNode.y + 77}
          />
        </g>
      </g>
    </g>
  );
}

function Battery9V({ voltage, active }: { voltage: number; active: boolean }) {
  return (
    <g>
      <rect
        x={969}
        y={109}
        width={40}
        height={25}
        rx={4}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <rect
        x={1110}
        y={109}
        width={40}
        height={25}
        rx={4}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <Label x={990} y={68} size={42}>
        +
      </Label>
      <Label x={1130} y={68} size={42}>
        −
      </Label>

      <rect
        x={950}
        y={132}
        width={218}
        height={310}
        rx={7}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <Label x={1059} y={245} size={54} weight={500}>
        {voltage}V
      </Label>

      <line
        x1={1013}
        y1={304}
        x2={1106}
        y2={304}
        stroke={C.black}
        strokeWidth={4}
      />
      <line
        x1={1014}
        y1={330}
        x2={1037}
        y2={330}
        stroke={C.black}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={1052}
        y1={330}
        x2={1074}
        y2={330}
        stroke={C.black}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={1089}
        y1={330}
        x2={1112}
        y2={330}
        stroke={C.black}
        strokeWidth={4}
        strokeLinecap="round"
      />

      <path
        d={BATTERY_NEGATIVE_WIRE_PATH}
        fill="none"
        stroke={active ? C.black : C.gray}
        strokeWidth={BASE_WIRE_WIDTH}
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
        strokeWidth={BASE_WIRE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.45}
      />

      <circle
        cx={1385}
        cy={610}
        r={53}
        fill={active ? C.lampOn : C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <line
        x1={1349}
        y1={573}
        x2={1421}
        y2={646}
        stroke={C.black}
        strokeWidth={4}
      />
      <line
        x1={1420}
        y1={574}
        x2={1349}
        y2={646}
        stroke={C.black}
        strokeWidth={4}
      />

      <g
        stroke={active ? C.amber : C.black}
        strokeWidth={active ? 5 : 4}
        strokeLinecap="round"
      >
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
      <animateMotion
        dur="2.8s"
        repeatCount="indefinite"
        path={path}
        begin={begin}
      />
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
      <AnimatedDot
        path={BATTERY_NEGATIVE_WIRE_PATH}
        color={C.black}
        begin="-0.4s"
      />
      <AnimatedDot path={LAMP_RETURN_WIRE_PATH} color={C.black} begin="-0.9s" />
      <AnimatedDot path={BLACK_WIRE_PATH} color={C.black} begin="-1.2s" />

      <path
        d={redPath}
        stroke={C.redDark}
        strokeWidth={3}
        strokeDasharray="18 22"
        opacity={0.45}
        fill="none"
      />
      <path
        d={BLACK_WIRE_PATH}
        stroke={C.black}
        strokeWidth={3}
        strokeDasharray="18 22"
        opacity={0.35}
        fill="none"
      />
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
    <g>
      <Wire
        d={redWirePath}
        color={C.red}
        shadow={C.redDark}
        width={BASE_WIRE_WIDTH + 1}
        active={active}
      />
      <Wire
        d={BLACK_WIRE_PATH}
        color={C.black}
        shadow="#000000"
        width={BASE_WIRE_WIDTH}
        active={active}
      />

      <CurrentFlowAnimation
        redPath={redWirePath}
        active={active}
        show={showCurrentFlow}
      />

      <g opacity={active ? 1 : 0.55}>
        <path
          d={`M${NODE.redTopConnector.x} ${NODE.redTopConnector.y} H${NODE.batteryPositive.x - 18}`}
          stroke={active ? C.redDark : C.gray}
          strokeWidth={8}
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

        <g
          stroke={active ? C.redDark : C.gray}
          strokeWidth={4}
          strokeLinecap="round"
        >
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
        <rect
          x={630}
          y={1018}
          width={94}
          height={35}
          rx={5}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <rect
          x={628}
          y={1020}
          width={16}
          height={31}
          rx={4}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <rect
          x={645}
          y={1018}
          width={14}
          height={35}
          rx={3}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <rect
          x={662}
          y={1018}
          width={14}
          height={35}
          rx={3}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
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
  const rightSide = x > 1320;
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
        stroke={C.white}
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
        stroke={C.white}
        strokeWidth={4}
      >
        {label}
      </text>
    </g>
  );
}

function DebugLayer({ redProbePort }: { redProbePort: RedProbePort }) {
  const redNode = getRedProbeNode(redProbePort);

  return (
    <g>
      <DebugDot
        x={NODE.meterCOM.x}
        y={NODE.meterCOM.y}
        label="COM"
        color={C.blue}
      />
      <DebugDot
        x={redNode.x}
        y={redNode.y}
        label={redProbePort}
        color={C.red}
      />
      <DebugDot
        x={NODE.batteryPositive.x}
        y={NODE.batteryPositive.y}
        label="BAT+"
        color={C.red}
      />
      <DebugDot
        x={NODE.batteryNegative.x}
        y={NODE.batteryNegative.y}
        label="BAT−"
        color={C.black}
      />
      <DebugDot
        x={NODE.lampTop.x}
        y={NODE.lampTop.y}
        label="LAMP TOP"
        color={C.green}
      />
      <DebugDot
        x={NODE.lampBottom.x}
        y={NODE.lampBottom.y}
        label="LAMP BOT"
        color={C.green}
      />
      <DebugDot
        x={NODE.bottomConnector.x}
        y={NODE.bottomConnector.y}
        label="BLACK JOIN"
        color={C.purple}
      />
      <DebugDot
        x={NODE.redTopConnector.x}
        y={NODE.redTopConnector.y}
        label="RED JOIN"
        color={C.amber}
      />
    </g>
  );
}

function SimulationCanvas({
  batteryVoltage,
  lampResistance,
  circuitClosed,
  dialMode,
  redProbePort,
  showCurrentFlow,
  debug,
  displayText,
  fuseStatus,
  safetyStatus,
  current,
  currentFlowActive,
  onDialModeChange,
  onRedProbePortChange,
  onCircuitClosedChange,
}: {
  batteryVoltage: number;
  lampResistance: number;
  circuitClosed: boolean;
  dialMode: DialMode;
  redProbePort: RedProbePort;
  showCurrentFlow: boolean;
  debug: boolean;
  displayText: string;
  fuseStatus: FuseStatus;
  safetyStatus: SafetyStatus;
  current: number;
  currentFlowActive: boolean;
  onDialModeChange: (mode: DialMode) => void;
  onRedProbePortChange: (port: RedProbePort) => void;
  onCircuitClosedChange: (value: boolean) => void;
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
        <rect width="1500" height="1120" fill={C.white} />

        <Multimeter
          displayText={displayText}
          dialMode={dialMode}
          redProbePort={redProbePort}
          fuseStatus={fuseStatus}
          onDialModeChange={onDialModeChange}
          onRedProbePortChange={onRedProbePortChange}
        />

        <CircuitWires
          redProbePort={redProbePort}
          active={currentFlowActive}
          showCurrentFlow={showCurrentFlow}
        />

        <Plugs redProbePort={redProbePort} />

        <Battery9V voltage={batteryVoltage} active={currentFlowActive} />

        <Lamp active={currentFlowActive} resistance={lampResistance} />

        <g
          role="button"
          tabIndex={0}
          aria-label={
            circuitClosed ? "Open circuit switch" : "Close circuit switch"
          }
          onClick={() => onCircuitClosedChange(!circuitClosed)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              onCircuitClosedChange(!circuitClosed);
          }}
          className="cursor-pointer"
        >
          <circle cx={1387} cy={850} r={70} fill="transparent" />
          {!circuitClosed ? (
            <g>
              <line
                x1={1338}
                y1={840}
                x2={1435}
                y2={930}
                stroke={C.red}
                strokeWidth={8}
                strokeLinecap="round"
              />
              <line
                x1={1435}
                y1={840}
                x2={1338}
                y2={930}
                stroke={C.red}
                strokeWidth={8}
                strokeLinecap="round"
              />
              <Label x={1387} y={970} size={28} fill={C.red}>
                OPEN CIRCUIT
              </Label>
            </g>
          ) : (
            <g>
              <rect
                x={1328}
                y={820}
                width={118}
                height={58}
                rx={14}
                fill="#dcfce7"
                stroke={C.green}
                strokeWidth={4}
              />
              <Label x={1387} y={849} size={22} fill={C.green}>
                CLOSED
              </Label>
            </g>
          )}
        </g>

        {safetyStatus.tone === "bad" ? (
          <g>
            <rect
              x={330}
              y={900}
              width={310}
              height={78}
              rx={14}
              fill="#fee2e2"
              stroke={C.red}
              strokeWidth={4}
            />
            <Label x={485} y={925} size={24} fill={C.red}>
              {safetyStatus.label}
            </Label>
            <Label x={485} y={955} size={18} fill={C.red}>
              {fuseStatus.message}
            </Label>
          </g>
        ) : null}

        {dialMode !== "adc" &&
        dialMode !== "off" &&
        circuitClosed &&
        !fuseStatus.mAFuseBlown ? (
          <g>
            <rect
              x={600}
              y={430}
              width={365}
              height={66}
              rx={14}
              fill="#fef3c7"
              stroke={C.amber}
              strokeWidth={4}
            />
            <Label x={782} y={455} size={22} fill="#92400e">
              Wrong dial mode for current measurement
            </Label>
            <Label x={782} y={480} size={17} fill="#92400e">
              Select A DC to measure current
            </Label>
          </g>
        ) : null}

        <StatusBadge
          safetyStatus={safetyStatus}
          displayText={displayText}
          current={current}
        />

        {debug ? <DebugLayer redProbePort={redProbePort} /> : null}
      </svg>
    </div>
  );
}

export default function AmmeterCircuitSketch({
  className = "",
  initialDebug = false,
}: AmmeterCircuitSketchProps) {
  const [batteryVoltage, setBatteryVoltage] = useState(9);
  const [lampResistance, setLampResistance] = useState(18);
  const [circuitClosed, setCircuitClosed] = useState(true);
  const [dialMode, setDialMode] = useState<DialMode>("adc");
  const [redProbePort, setRedProbePort] = useState<RedProbePort>("10A");
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);
  const [debug, setDebug] = useState(initialDebug);

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

    return {
      current,
      fuseStatus,
      displayText,
      safetyStatus,
      currentFlowActive,
    };
  }, [batteryVoltage, circuitClosed, dialMode, lampResistance, redProbePort]);

  function reset() {
    setBatteryVoltage(9);
    setLampResistance(18);
    setCircuitClosed(true);
    setDialMode("adc");
    setRedProbePort("10A");
    setShowCurrentFlow(true);
    setDebug(initialDebug);
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
          showCurrentFlow={showCurrentFlow}
          setShowCurrentFlow={setShowCurrentFlow}
          debug={debug}
          setDebug={setDebug}
          reset={reset}
        />

        <SimulationCanvas
          batteryVoltage={batteryVoltage}
          lampResistance={lampResistance}
          circuitClosed={circuitClosed}
          dialMode={dialMode}
          redProbePort={redProbePort}
          showCurrentFlow={showCurrentFlow}
          debug={debug}
          displayText={simulation.displayText}
          fuseStatus={simulation.fuseStatus}
          safetyStatus={simulation.safetyStatus}
          current={simulation.current}
          currentFlowActive={simulation.currentFlowActive}
          onDialModeChange={setDialMode}
          onRedProbePortChange={setRedProbePort}
          onCircuitClosedChange={setCircuitClosed}
        />
      </div>
    </div>
  );
}
