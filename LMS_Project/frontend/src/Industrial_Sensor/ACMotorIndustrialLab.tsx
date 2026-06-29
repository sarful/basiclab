"use client";

import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  Info,
  Maximize,
  Monitor,
  Play,
  RotateCcw,
  Settings,
  Square,
  Sun,
  Volume2,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type MotorType =
  | "Single Phase Induction"
  | "Three Phase Induction"
  | "Synchronous Motor"
  | "VFD Driven Motor";
type StartMode = "DOL Starter" | "Star-Delta" | "Soft Starter" | "VFD Control";
type Direction = "Forward" | "Reverse";
type LoadType =
  | "No Load"
  | "Fan Load"
  | "Pump Load"
  | "Conveyor Load"
  | "Jam Condition";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  motorBody: 1,
  stator: 1,
  rotor: 1,
  terminalBox: 1,
  starter: 1,
  readout: 1,
  wiring: 1,
} as const;

const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  motorStroke: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  fault: "#ef4444",
  torque: "#f59e0b",
  panel: "#f8fafc",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  base: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  motorBody: { x: 180, y: 170, width: 455, height: 235, rotate: 0 },
  stator: { x: 293, y: 173, width: 224, height: 224, rotate: 0 },
  rotor: { x: 327, y: 207, width: 156, height: 156, rotate: 0 },
  terminalBox: { x: 625, y: 245, width: 86, height: 82, rotate: 0 },
  starter: { x: 900, y: 210, width: 160, height: 130, rotate: 0 },
  waveMonitor: { x: 685, y: 365, width: 170, height: 90, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  motorBody: scaleComponent(
    BASE_COMPONENT.motorBody,
    CIRCUIT_COMPONENT_SCALE.motorBody,
  ),
  stator: scaleComponent(BASE_COMPONENT.stator, CIRCUIT_COMPONENT_SCALE.stator),
  rotor: scaleComponent(BASE_COMPONENT.rotor, CIRCUIT_COMPONENT_SCALE.rotor),
  terminalBox: scaleComponent(
    BASE_COMPONENT.terminalBox,
    CIRCUIT_COMPONENT_SCALE.terminalBox,
  ),
  starter: scaleComponent(
    BASE_COMPONENT.starter,
    CIRCUIT_COMPONENT_SCALE.starter,
  ),
  waveMonitor: scaleComponent(
    BASE_COMPONENT.waveMonitor,
    CIRCUIT_COMPONENT_SCALE.readout,
  ),
} as const;

const NODE = {
  motorCenter: pointOnComponent(COMPONENT.stator, 0.5, 0.5),
  shaftStart: pointOnComponent(COMPONENT.motorBody, 1, 0.49),
  starterInput: { x: 900, y: 260 },
  terminalOutput: { x: 711, y: 285 },
  cableControl1: { x: 765, y: 195 },
  cableControl2: { x: 835, y: 195 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  supplyCable:
    `M${NODE.terminalOutput.x} ${NODE.terminalOutput.y} ` +
    `C${NODE.cableControl1.x} ${NODE.cableControl1.y} ` +
    `${NODE.cableControl2.x} ${NODE.cableControl2.y} ` +
    `${NODE.starterInput.x} ${NODE.starterInput.y}`,
} as const;

const PATH = {
  supplyMotion: WIRE.supplyCable,
} as const;

const LABEL = {
  rpm: { x: 305, y: 115 },
  detail: { x: 305, y: 150 },
  fault: { x: 500, y: 135 },
  motorType: { x: 190, y: 155 },
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

function getLoadFactor(loadType: LoadType) {
  if (loadType === "No Load") return 0.2;
  if (loadType === "Fan Load") return 0.45;
  if (loadType === "Pump Load") return 0.6;
  if (loadType === "Conveyor Load") return 0.75;
  return 1;
}

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = [
    "Simulator",
    "Theory",
    "Wiring Diagram",
    "Quiz",
    "Report",
  ];

  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
          <Cpu size={30} />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">
            AC Motor Simulation
          </p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${
              tab === item
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="hidden justify-end gap-8 text-slate-800 lg:col-span-3 lg:flex">
        <Sun size={24} />
        <Volume2 size={24} />
        <Maximize size={24} />
      </div>
    </header>
  );
}

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">
        {icon}
        {title}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Control({ label, children }: any) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-[120px_1fr] sm:items-center">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select
      className="input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function Status({ label, value, dot, badge, distance, danger }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${
          badge
            ? `${danger ? "bg-red-600" : "bg-green-600"} font-semibold text-white`
            : ""
        } ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function Lamp({ label, on, danger }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-8 w-8 rounded-full ${
            on
              ? danger
                ? "bg-red-500 shadow-[0_0_20px_#ef4444]"
                : "bg-green-500 shadow-[0_0_20px_#22c55e]"
              : "bg-slate-300"
          }`}
        />
      </div>
    </div>
  );
}

function Read({ label, value, green, danger }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={danger ? "text-red-600" : green ? "text-green-600" : ""}>
        {value}
      </b>
    </div>
  );
}

function MotorBase() {
  return (
    <g>
      <rect
        x={COMPONENT.base.x}
        y={COMPONENT.base.y}
        width={COMPONENT.base.width}
        height={COMPONENT.base.height}
        rx="8"
        fill="#e5e7eb"
        stroke="#94a3b8"
      />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />
    </g>
  );
}

function MotorBody() {
  return (
    <g>
      <rect
        x={COMPONENT.motorBody.x}
        y={COMPONENT.motorBody.y}
        width={COMPONENT.motorBody.width}
        height={COMPONENT.motorBody.height}
        rx="36"
        fill="url(#motorBody)"
        stroke={STYLE.motorStroke}
        filter="url(#shadow)"
      />
      <rect
        x="220"
        y="405"
        width="130"
        height="35"
        rx="8"
        fill="#94a3b8"
        stroke="#475569"
      />
      <rect
        x="470"
        y="405"
        width="130"
        height="35"
        rx="8"
        fill="#94a3b8"
        stroke="#475569"
      />
    </g>
  );
}

function RotorAssembly({
  running,
  fault,
  direction,
  speed,
}: {
  running: boolean;
  fault: boolean;
  direction: Direction;
  speed: number;
}) {
  const cx = NODE.motorCenter.x;
  const cy = NODE.motorCenter.y;
  const spinDur = Math.max(0.45, 3.2 - speed / 650);

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="112"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="8"
      />
      <circle
        cx={cx}
        cy={cy}
        r="78"
        fill="#111827"
        stroke="#64748b"
        strokeWidth="6"
      />

      {Array.from({ length: 18 }).map((_, index) => {
        const angle = (index * 20 * Math.PI) / 180;

        return (
          <line
            key={`stator-slot-${index}`}
            x1={cx + Math.cos(angle) * 84}
            y1={cy + Math.sin(angle) * 84}
            x2={cx + Math.cos(angle) * 110}
            y2={cy + Math.sin(angle) * 110}
            stroke={index % 2 ? "#94a3b8" : "#111827"}
            strokeWidth="5"
          />
        );
      })}

      {running &&
        Array.from({ length: 5 }).map((_, index) => (
          <circle
            key={`field-ring-${index}`}
            cx={cx}
            cy={cy}
            r={92 + index * 14}
            fill="none"
            stroke={STYLE.active}
            strokeDasharray="8 8"
            opacity={0.24 - index * 0.035}
          />
        ))}

      <g transform={`rotate(${running ? 0 : 25} ${cx} ${cy})`}>
        <g
          transform={`rotate(${direction === "Forward" ? 0 : 180} ${cx} ${cy})`}
        >
          <path
            d={`M${cx} ${cy} L${cx + 86} ${cy} L${cx + 38} ${cy - 22} L${
              cx + 38
            } ${cy + 22} Z`}
            fill={fault ? STYLE.fault : STYLE.run}
          />
          {running && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`${direction === "Forward" ? 360 : -360} ${cx} ${cy}`}
              dur={`${spinDur}s`}
              repeatCount="indefinite"
              additive="sum"
            />
          )}
        </g>
      </g>

      <circle
        cx={cx}
        cy={cy}
        r="22"
        fill="#e5e7eb"
        stroke="#334155"
        strokeWidth="5"
      />
    </g>
  );
}

function StarterAndCable({
  power,
  running,
  fault,
  frequency,
  current,
  torque,
}: {
  power: boolean;
  running: boolean;
  fault: boolean;
  frequency: number;
  current: number;
  torque: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.terminalBox.x}
        y={COMPONENT.terminalBox.y}
        width={COMPONENT.terminalBox.width}
        height={COMPONENT.terminalBox.height}
        rx="12"
        fill="#111827"
      />

      <path
        d={WIRE.supplyCable}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="18"
        strokeLinecap="round"
      />

      <rect
        x={COMPONENT.starter.x}
        y={COMPONENT.starter.y}
        width={COMPONENT.starter.width}
        height={COMPONENT.starter.height}
        rx="16"
        fill="#f8fafc"
        stroke="#94a3b8"
        filter="url(#shadow)"
      />

      <text x="938" y="240" fontSize="15" fontWeight="700" fill={STYLE.active}>
        STARTER
      </text>
      <text x="925" y="267" fontSize="13" fill="#475569">
        {frequency} Hz
      </text>
      <text x="925" y="290" fontSize="13" fill="#475569">
        {current.toFixed(1)} A
      </text>
      <text x="925" y="313" fontSize="13" fill="#475569">
        {torque.toFixed(0)}% Torque
      </text>

      {power && (
        <circle r="5" fill={fault ? STYLE.fault : STYLE.run}>
          <animateMotion
            dur="1.25s"
            repeatCount="indefinite"
            path={PATH.supplyMotion}
          />
        </circle>
      )}

      <WaveMonitor x={685} y={365} running={running} fault={fault} />
    </g>
  );
}

function SceneLabels({
  speed,
  frequency,
  slip,
  direction,
  fault,
  motorType,
}: {
  speed: number;
  frequency: number;
  slip: number;
  direction: Direction;
  fault: boolean;
  motorType: MotorType;
}) {
  return (
    <g>
      <line x1="155" y1="125" x2="455" y2="125" stroke="#9ca3af" />
      <text
        x={LABEL.rpm.x}
        y={LABEL.rpm.y}
        textAnchor="middle"
        fill={fault ? "#dc2626" : "#2563eb"}
        fontSize="22"
        fontWeight="700"
      >
        {speed.toFixed(0)} RPM
      </text>

      <text
        x={LABEL.detail.x}
        y={LABEL.detail.y}
        textAnchor="middle"
        fill="#111827"
        fontSize="13"
      >
        {frequency} Hz | Slip {slip.toFixed(1)}% | {direction}
      </text>

      {fault && (
        <text
          x={LABEL.fault.x}
          y={LABEL.fault.y}
          fill="#dc2626"
          fontSize="24"
          fontWeight="700"
        >
          OVERLOAD TRIP / JAM
        </text>
      )}

      <text
        x={LABEL.motorType.x}
        y={LABEL.motorType.y}
        fontSize="13"
        fill="#475569"
      >
        {motorType}
      </text>

      <text
        x={LABEL.footer1.x}
        y={LABEL.footer1.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial AC motor starting and speed control station
      </text>
      <text
        x={LABEL.footer2.x}
        y={LABEL.footer2.y}
        fontSize="13"
        fill="#64748b"
      >
        Supply → Contactor / VFD / Starter → AC Motor → Mechanical Load
      </text>
    </g>
  );
}

function WaveMonitor({ x, y, running, fault }: any) {
  return (
    <g>
      <text x={x} y={y - 15} fontSize="14" fontWeight="700" fill="#2563eb">
        3-Phase Supply Monitor
      </text>
      {["L1", "L2", "L3"].map((phase, index) => (
        <g key={phase} transform={`translate(0 ${index * 28})`}>
          <text x={x - 35} y={y + 8} fontSize="13" fontWeight="700">
            {phase}
          </text>
          <path
            d={`M${x} ${y} C${x + 25} ${y - 20}, ${x + 45} ${y + 20}, ${
              x + 70
            } ${y} S${x + 115} ${y - 20}, ${x + 145} ${y}`}
            fill="none"
            stroke={fault ? STYLE.fault : running ? STYLE.run : STYLE.muted}
            strokeWidth="3"
          />
        </g>
      ))}
    </g>
  );
}

function ACMotorScene({
  power,
  running,
  fault,
  motorType,
  direction,
  frequency,
  speed,
  current,
  torque,
  slip,
}: any) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-full w-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="motorBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".24" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <g transform={canvasTransform}>
        <MotorBase />
        <MotorBody />
        <RotorAssembly
          running={running}
          fault={fault}
          direction={direction}
          speed={speed}
        />
        <StarterAndCable
          power={power}
          running={running}
          fault={fault}
          frequency={frequency}
          current={current}
          torque={torque}
        />
        <SceneLabels
          speed={speed}
          frequency={frequency}
          slip={slip}
          direction={direction}
          fault={fault}
          motorType={motorType}
        />
      </g>
    </svg>
  );
}

function LiveReadout({
  frequency,
  speed,
  current,
  torque,
  slip,
  motorType,
  startMode,
  direction,
  loadType,
  fault,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Frequency" value={`${frequency} Hz`} />
        <Read
          label="Speed"
          value={`${speed.toFixed(0)} RPM`}
          green={!fault}
          danger={fault}
        />
        <Read
          label="Current"
          value={`${current.toFixed(1)} A`}
          danger={fault}
        />
        <Read label="Torque" value={`${torque.toFixed(0)}%`} />
        <Read label="Slip" value={`${slip.toFixed(1)}%`} />
        <Read label="Motor Type" value={motorType} />
        <Read label="Start Mode" value={startMode} />
        <Read label="Direction" value={direction} />
        <Read label="Load" value={loadType} />
      </div>
    </div>
  );
}

const WIRING_VIEW_BOX = "0 0 620 190";

function WiringSvg({ running, fault, direction, frequency, current }: any) {
  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <rect
        x="25"
        y="55"
        width="105"
        height="92"
        rx="14"
        fill="#94a3b8"
        stroke="#334155"
      />
      <text x="48" y="88" fontSize="13" fontWeight="700" fill="white">
        STARTER
      </text>
      <text x="48" y="112" fontSize="12" fill="white">
        MOTOR
      </text>
      <circle
        cx="110"
        cy="77"
        r="5"
        fill={fault ? STYLE.fault : running ? STYLE.run : STYLE.muted}
      />

      <Wire y={28} color="#dc2626" label="L1" end="Phase 1" active={running} />
      <Wire y={60} color="#f59e0b" label="L2" end="Phase 2" active={running} />
      <Wire y={95} color="#2563eb" label="L3" end="Phase 3" active={running} />
      <Wire
        y={130}
        color={fault ? STYLE.fault : "#7c3aed"}
        label="OL/TRIP"
        end={fault ? "Trip ON" : "Normal"}
        active={fault}
      />
      <Wire
        y={162}
        color="#64748b"
        label="CTRL"
        end={`${frequency} Hz / ${current.toFixed(1)} A / ${direction}`}
        active={running}
      />

      <text x="35" y="184" fontSize="12" fill="#475569">
        3-phase AC motor starter / VFD wiring
      </text>
    </svg>
  );
}

function Wire({ y, color, label, end, active }: any) {
  return (
    <g>
      <line x1="130" y1="100" x2="205" y2={y} stroke={color} strokeWidth="2" />
      <line
        x1="205"
        y1={y}
        x2="410"
        y2={y}
        stroke={color}
        strokeWidth={active ? 4 : 2.5}
      />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="215" y={y - 6} fontSize="13" fill={color}>
        {label}
      </text>
      <text x="450" y={y + 5} fontSize="13">
        {end}
      </text>

      {active && (
        <circle r="5" fill={color === STYLE.fault ? STYLE.fault : STYLE.run}>
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={`M205 ${y} L410 ${y}`}
          />
        </circle>
      )}
    </g>
  );
}

function LearningTab({ tab, motorType, startMode }: any) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "AC Motor Theory",
      points: [
        "AC motors convert alternating current electrical energy into mechanical rotation.",
        "Three-phase induction motors are widely used in pumps, fans, conveyors and compressors.",
        "Motor speed depends mainly on supply frequency and number of poles.",
        "Overload protection trips the motor circuit during jam or excessive current condition.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${startMode} Wiring Explanation`,
      points: [
        "L1, L2 and L3 provide three-phase supply to the starter or VFD.",
        "Contactor or VFD controls motor power switching.",
        "Overload relay protects the motor from excessive current.",
        "Reverse direction is achieved by swapping two phases in three-phase motors.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What determines AC motor speed?",
        "Q2: Why is overload protection used?",
        "Q3: How do you reverse a three-phase motor?",
        "Q4: What is the purpose of VFD control?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected motor type: ${motorType}`,
        `Selected starting method: ${startMode}`,
        "Recommended activity: change frequency and observe motor speed.",
        "Test jam condition to understand overload trip behavior.",
      ],
    },
  };

  const item = data[tab];

  return (
    <Panel title={tab.toUpperCase()} icon={item.icon}>
      <div className="min-h-[520px] rounded-xl bg-slate-50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-blue-600">{item.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {item.points.map((point, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-3 font-bold text-slate-800">
                Learning Point {index + 1}
              </div>
              <p className="leading-7 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default function ACMotorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [motorType, setMotorType] = useState<MotorType>(
    "Three Phase Induction",
  );
  const [startMode, setStartMode] = useState<StartMode>("DOL Starter");
  const [direction, setDirection] = useState<Direction>("Forward");
  const [loadType, setLoadType] = useState<LoadType>("Fan Load");
  const [frequency, setFrequency] = useState(50);
  const [speed, setSpeed] = useState(1440);
  const [faultCount, setFaultCount] = useState(0);

  const loadFactor = getLoadFactor(loadType);
  const ratedSpeed =
    motorType === "Synchronous Motor" ? frequency * 30 : frequency * 28.8;
  const actualSpeed = power ? speed : 0;
  const slip = motorType.includes("Induction")
    ? Math.max(0, ((ratedSpeed - actualSpeed) / ratedSpeed) * 100)
    : 0;
  const current = power
    ? 1.2 + loadFactor * 8.5 + (loadType === "Jam Condition" ? 18 : 0)
    : 0;
  const torque = power ? Math.min(100, 20 + loadFactor * 75) : 0;
  const fault = power && (loadType === "Jam Condition" || current > 12);
  const running = power && !fault && actualSpeed > 50;

  function updateFrequency(value: number) {
    const next = Number(Math.max(0, Math.min(60, value)).toFixed(0));
    setFrequency(next);

    if (power && !fault) {
      setSpeed(Math.round(next * 28.8 * (1 - loadFactor * 0.04)));
    }
  }

  function reset() {
    setPower(false);
    setMotorType("Three Phase Induction");
    setStartMode("DOL Starter");
    setDirection("Forward");
    setLoadType("Fan Load");
    setFrequency(50);
    setSpeed(1440);
    setFaultCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Motor Starter Energized", "text-slate-700"],
      fault
        ? ["10:24:18", "Motor Fault / Overload Trip", "text-red-600"]
        : ["10:24:23", "Motor Running Normal", "text-green-600"],
      [
        "10:24:18",
        `${actualSpeed.toFixed(0)} RPM / ${current.toFixed(1)} A`,
        "text-slate-900",
      ],
      ["LIVE", `${motorType} / ${startMode}`, "text-blue-600"],
    ];
  }, [power, fault, actualSpeed, current, motorType, startMode]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} motorType={motorType} startMode={startMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="AC MOTOR CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Motor Type">
                  <Select
                    value={motorType}
                    onChange={(value: MotorType) => setMotorType(value)}
                  >
                    <option>Single Phase Induction</option>
                    <option>Three Phase Induction</option>
                    <option>Synchronous Motor</option>
                    <option>VFD Driven Motor</option>
                  </Select>
                </Control>

                <Control label="Start Mode">
                  <Select
                    value={startMode}
                    onChange={(value: StartMode) => setStartMode(value)}
                  >
                    <option>DOL Starter</option>
                    <option>Star-Delta</option>
                    <option>Soft Starter</option>
                    <option>VFD Control</option>
                  </Select>
                </Control>

                <Control label="Direction">
                  <Select
                    value={direction}
                    onChange={(value: Direction) => setDirection(value)}
                  >
                    <option>Forward</option>
                    <option>Reverse</option>
                  </Select>
                </Control>

                <Control label="Load Type">
                  <Select
                    value={loadType}
                    onChange={(value: LoadType) => {
                      setLoadType(value);
                      if (value === "Jam Condition")
                        setFaultCount((count) => count + 1);
                    }}
                  >
                    <option>No Load</option>
                    <option>Fan Load</option>
                    <option>Pump Load</option>
                    <option>Conveyor Load</option>
                    <option>Jam Condition</option>
                  </Select>
                </Control>

                <Control label="Frequency">
                  <div className="input flex items-center justify-between">
                    <b>{frequency}</b>
                    <span>Hz</span>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>415 V AC / 3 Phase</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="AC MOTOR STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "ON" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Run State"
                  value={running ? "RUNNING" : fault ? "TRIPPED" : "STOP"}
                  badge={running || fault}
                  danger={fault}
                />
                <Status
                  label="Speed"
                  value={`${actualSpeed.toFixed(0)} RPM`}
                  distance
                />
                <Status label="Current" value={`${current.toFixed(1)} A`} />
                <Status label="Slip" value={`${slip.toFixed(1)}%`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select AC motor and starting method.</li>
                  <li>2. Adjust frequency to simulate VFD speed control.</li>
                  <li>
                    3. Observe stator field, rotor rotation and load current.
                  </li>
                  <li>4. Test jam condition to see overload trip.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn">
                    <Play size={17} /> Start
                  </button>
                  <button
                    onClick={() => setPower(false)}
                    className="secondaryBtn"
                  >
                    <Square size={15} /> Stop
                  </button>
                  <button
                    onClick={() =>
                      setDirection(
                        direction === "Forward" ? "Reverse" : "Forward",
                      )
                    }
                    className="secondaryBtn col-span-2"
                  >
                    Reverse Direction
                  </button>
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel
                title="AC MOTOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ACMotorScene
                    power={power}
                    running={running}
                    fault={fault}
                    motorType={motorType}
                    direction={direction}
                    frequency={frequency}
                    speed={actualSpeed}
                    current={current}
                    torque={torque}
                    slip={slip}
                  />

                  <LiveReadout
                    frequency={frequency}
                    speed={actualSpeed}
                    current={current}
                    torque={torque}
                    slip={slip}
                    motorType={motorType}
                    startMode={startMode}
                    direction={direction}
                    loadType={loadType}
                    fault={fault}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={frequency}
                      onChange={(event) =>
                        updateFrequency(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0 Hz</span>
                      <span>Adjust frequency / VFD speed</span>
                      <span>60 Hz</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel
                  title="I/O INDICATOR"
                  icon={<Cpu size={19} />}
                  className="xl:col-span-3"
                >
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="RUN" on={running} />
                    <Lamp label="TRIP" on={fault} danger />
                  </div>
                </Panel>

                <Panel
                  title="AC MOTOR CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    running={running}
                    fault={fault}
                    direction={direction}
                    frequency={frequency}
                    current={current}
                  />
                </Panel>

                <Panel
                  title="EVENT LOG"
                  icon={<ClipboardList size={19} />}
                  className="md:col-span-2 xl:col-span-4"
                >
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, message, color], index) => (
                      <div key={index} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{message}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    Trip Count: <b>{faultCount}</b>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input {
          height: 42px;
          width: 100%;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          padding: 0 12px;
          outline: none;
          font-size: 14px;
        }
        .primaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        .secondaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #dbe3ef;
          background: white;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
