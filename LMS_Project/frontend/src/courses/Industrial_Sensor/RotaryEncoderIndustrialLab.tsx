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
type EncoderType = "Incremental" | "Absolute";
type OutputType =
  | "A/B Quadrature"
  | "A/B/Z Index"
  | "Gray Code"
  | "SSI Absolute";
type Direction = "CW" | "CCW";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  encoderBody: 1,
  disk: 1,
  shaft: 1,
  terminalBox: 1,
  wiringEncoder: 1,
} as const;

const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  body: "#64748b",
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

function buildCanvasScaleTransform(
  scale: number,
  width = VIEW_BOX_WIDTH,
  height = VIEW_BOX_HEIGHT,
) {
  if (scale === 1) return undefined;
  const centerX = width / 2;
  const centerY = height / 2;
  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

const BASE_COMPONENT = {
  base: { x: 80, y: 420, width: 960, height: 42, rotate: 0 },
  encoderBody: { x: 210, y: 170, width: 460, height: 220, rotate: 0 },
  disk: { x: 340, y: 165, width: 210, height: 210, rotate: 0 },
  shaft: { x: 425, y: 250, width: 40, height: 40, rotate: 0 },
  terminalBox: { x: 650, y: 230, width: 80, height: 82, rotate: 0 },
  wiringEncoder: { x: 25, y: 55, width: 115, height: 85, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  encoderBody: scaleComponent(
    BASE_COMPONENT.encoderBody,
    CIRCUIT_COMPONENT_SCALE.encoderBody,
  ),
  disk: scaleComponent(BASE_COMPONENT.disk, CIRCUIT_COMPONENT_SCALE.disk),
  shaft: scaleComponent(BASE_COMPONENT.shaft, CIRCUIT_COMPONENT_SCALE.shaft),
  terminalBox: scaleComponent(
    BASE_COMPONENT.terminalBox,
    CIRCUIT_COMPONENT_SCALE.terminalBox,
  ),
  wiringEncoder: scaleComponent(
    BASE_COMPONENT.wiringEncoder,
    CIRCUIT_COMPONENT_SCALE.wiringEncoder,
  ),
} as const;

const NODE = {
  diskCenter: { x: 445, y: 270 },
  shaftCableStart: { x: 650, y: 270 },
  shaftCableEnd: { x: 875, y: 300 },

  ledPower: { x: 260, y: 205 },
  ledA: { x: 284, y: 205 },
  ledB: { x: 308, y: 205 },

  waveformX: 720,
  waveformA: 145,
  waveformB: 210,
  waveformZ: 275,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  encoderCable: "M650 270 C790 250 815 320 875 300",

  wiringPower: "M140 30 H410",
  wiringA: "M140 65 H410",
  wiringB: "M140 100 H410",
  wiringZ: "M140 135 H410",
  wiringGnd: "M140 165 H410",
} as const;

const PATH = {
  encoderCableMotion: WIRE.encoderCable,
  wiringPowerMotion: "M140 30 L410 30",
  wiringAMotion: "M140 65 L410 65",
  wiringBMotion: "M140 100 L410 100",
  wiringZMotion: "M140 135 L410 135",
  wiringGndMotion: "M140 165 L410 165",
} as const;

const LABEL = {
  encoderTitle: { x: 235, y: 150 },
  monitorTitle: { x: 720, y: 125 },
  angle: { x: 720, y: 365 },
  output: { x: 720, y: 390 },
  footerOne: { x: 360, y: 515 },
  footerTwo: { x: 360, y: 540 },
  wiringFooter: { x: 35, y: 184 },
} as const;

function getChannelA(power: boolean, angle: number) {
  return power && Math.floor(angle / 45) % 2 === 0;
}

function getChannelB(power: boolean, angle: number, direction: Direction) {
  return (
    power &&
    Math.floor((angle + (direction === "CW" ? 22.5 : -22.5)) / 45) % 2 === 0
  );
}

function getIndexZ(power: boolean, angle: number) {
  return power && angle >= 350;
}

function LabBase() {
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

function EncoderBody({
  power,
  channelA,
  channelB,
}: {
  power: boolean;
  channelA: boolean;
  channelB: boolean;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.encoderBody.x}
        y={COMPONENT.encoderBody.y}
        width={COMPONENT.encoderBody.width}
        height={COMPONENT.encoderBody.height}
        rx="28"
        fill="url(#body)"
        stroke={STYLE.wire}
        filter="url(#shadow)"
      />
      <rect
        x="365"
        y="390"
        width="160"
        height="35"
        rx="6"
        fill="#d1d5db"
        stroke="#94a3b8"
      />

      <circle
        cx={NODE.ledPower.x}
        cy={NODE.ledPower.y}
        r="7"
        fill={power ? STYLE.run : STYLE.muted}
      />
      <circle
        cx={NODE.ledA.x}
        cy={NODE.ledA.y}
        r="7"
        fill={channelA ? STYLE.run : STYLE.muted}
      />
      <circle
        cx={NODE.ledB.x}
        cy={NODE.ledB.y}
        r="7"
        fill={channelB ? STYLE.run : STYLE.muted}
      />
    </g>
  );
}

function EncoderDisk({ angle }: { angle: number }) {
  const cx = NODE.diskCenter.x;
  const cy = NODE.diskCenter.y;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="105"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="8"
      />
      <circle
        cx={cx}
        cy={cy}
        r="72"
        fill="#111827"
        stroke="#64748b"
        strokeWidth="6"
      />

      {Array.from({ length: 36 }).map((_, index) => {
        const a = (index * 10 * Math.PI) / 180;
        return (
          <line
            key={index}
            x1={cx + Math.cos(a) * 84}
            y1={cy + Math.sin(a) * 84}
            x2={cx + Math.cos(a) * 104}
            y2={cy + Math.sin(a) * 104}
            stroke={index % 2 ? "#94a3b8" : "#111827"}
            strokeWidth="4"
          />
        );
      })}

      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + 70}
          y2={cy}
          stroke={STYLE.active}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx={cx + 76} cy={cy} r="8" fill={STYLE.active} />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r="18"
        fill="#e5e7eb"
        stroke="#334155"
        strokeWidth="5"
      />
    </g>
  );
}

function TerminalCable({ power }: { power: boolean }) {
  return (
    <g>
      <rect
        x={COMPONENT.terminalBox.x}
        y={COMPONENT.terminalBox.y}
        width={COMPONENT.terminalBox.width}
        height={COMPONENT.terminalBox.height}
        rx="12"
        fill={STYLE.wire}
      />
      <path
        d={WIRE.encoderCable}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {power && (
        <circle r="5" fill={STYLE.run}>
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            path={PATH.encoderCableMotion}
          />
        </circle>
      )}
    </g>
  );
}

function Waveform({
  x,
  y,
  label,
  active,
  phase,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  phase: 0 | 1 | 2;
}) {
  const path =
    phase === 0
      ? `M${x} ${y + 28} L${x + 30} ${y + 28} L${x + 30} ${y} L${x + 80} ${y} L${x + 80} ${y + 28} L${x + 130} ${y + 28} L${x + 130} ${y} L${x + 180} ${y}`
      : phase === 1
        ? `M${x} ${y + 28} L${x + 55} ${y + 28} L${x + 55} ${y} L${x + 105} ${y} L${x + 105} ${y + 28} L${x + 155} ${y + 28} L${x + 155} ${y} L${x + 205} ${y}`
        : `M${x} ${y + 28} L${x + 90} ${y + 28} L${x + 90} ${y} L${x + 120} ${y} L${x + 120} ${y + 28} L${x + 210} ${y + 28}`;

  return (
    <g>
      <text x={x - 28} y={y + 20} fontSize="15" fontWeight="700">
        {label}
      </text>
      <path
        d={path}
        fill="none"
        stroke={active ? STYLE.run : STYLE.muted}
        strokeWidth="4"
      />
    </g>
  );
}

function PulseMonitor({
  angle,
  outputType,
  channelA,
  channelB,
  indexZ,
}: {
  angle: number;
  outputType: OutputType;
  channelA: boolean;
  channelB: boolean;
  indexZ: boolean;
}) {
  return (
    <g>
      <text
        x={LABEL.monitorTitle.x}
        y={LABEL.monitorTitle.y}
        fontSize="15"
        fontWeight="700"
        fill={STYLE.active}
      >
        Quadrature Pulse Monitor
      </text>

      <Waveform
        x={NODE.waveformX}
        y={NODE.waveformA}
        label="A"
        active={channelA}
        phase={0}
      />
      <Waveform
        x={NODE.waveformX}
        y={NODE.waveformB}
        label="B"
        active={channelB}
        phase={1}
      />
      <Waveform
        x={NODE.waveformX}
        y={NODE.waveformZ}
        label="Z"
        active={indexZ}
        phase={2}
      />

      <text x={LABEL.angle.x} y={LABEL.angle.y} fontSize="14" fill="#475569">
        Angle: {angle.toFixed(0)}°
      </text>
      <text x={LABEL.output.x} y={LABEL.output.y} fontSize="14" fill="#475569">
        Output: {outputType}
      </text>
    </g>
  );
}

function SceneLabels({
  encoderType,
  direction,
  ppr,
  rpm,
}: {
  encoderType: EncoderType;
  direction: Direction;
  ppr: number;
  rpm: number;
}) {
  return (
    <g>
      <text
        x={LABEL.encoderTitle.x}
        y={LABEL.encoderTitle.y}
        fontSize="13"
        fill="#475569"
      >
        {encoderType} Rotary Encoder
      </text>
      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial motor shaft position and speed feedback station
      </text>
      <text
        x={LABEL.footerTwo.x}
        y={LABEL.footerTwo.y}
        fontSize="13"
        fill="#64748b"
      >
        Direction: {direction} | Resolution: {ppr} PPR | Speed: {rpm} RPM
      </text>
    </g>
  );
}

function EncoderScene({
  power,
  encoderType,
  outputType,
  direction,
  angle,
  rpm,
  ppr,
  channelA,
  channelB,
  indexZ,
  moveAngle,
}: {
  power: boolean;
  encoderType: EncoderType;
  outputType: OutputType;
  direction: Direction;
  angle: number;
  rpm: number;
  ppr: number;
  channelA: boolean;
  channelB: boolean;
  indexZ: boolean;
  moveAngle: (value: number) => void;
}) {
  const cx = NODE.diskCenter.x;
  const cy = NODE.diskCenter.y;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  function drag(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_BOX_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * VIEW_BOX_HEIGHT;
    const deg = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 180;
    moveAngle(deg);
  }

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-full w-full cursor-pointer touch-none"
      onPointerDown={drag}
      onPointerMove={(event) => event.buttons === 1 && drag(event)}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <EncoderBody power={power} channelA={channelA} channelB={channelB} />
        <EncoderDisk angle={angle} />
        <TerminalCable power={power} />
        <PulseMonitor
          angle={angle}
          outputType={outputType}
          channelA={channelA}
          channelB={channelB}
          indexZ={indexZ}
        />
        <SceneLabels
          encoderType={encoderType}
          direction={direction}
          ppr={ppr}
          rpm={rpm}
        />
      </g>
    </svg>
  );
}

function WiringEncoderBlock() {
  return (
    <g>
      <rect
        x={COMPONENT.wiringEncoder.x}
        y={COMPONENT.wiringEncoder.y}
        width={COMPONENT.wiringEncoder.width}
        height={COMPONENT.wiringEncoder.height}
        rx="18"
        fill="#94a3b8"
        stroke="#334155"
      />
      <circle cx="82" cy="98" r="28" fill={STYLE.wire} />
      <circle cx="82" cy="98" r="9" fill="#e5e7eb" />
    </g>
  );
}

function WiringLine({
  y,
  color,
  label,
  end,
  active,
}: {
  y: number;
  color: string;
  label: string;
  end: string;
  active?: boolean;
}) {
  const path = `M140 ${y} L410 ${y}`;

  return (
    <g>
      <line
        x1="140"
        y1={y}
        x2="410"
        y2={y}
        stroke={color}
        strokeWidth={active ? 4 : 2.5}
      />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="170" y={y - 6} fontSize="13" fill={color}>
        {label}
      </text>
      <text x="450" y={y + 5} fontSize="13">
        {end}
      </text>

      {active && (
        <circle r="4" fill={STYLE.run}>
          <animateMotion dur="1.2s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </g>
  );
}

function WiringSvg({
  channelA,
  channelB,
  indexZ,
  outputType,
}: {
  channelA: boolean;
  channelB: boolean;
  indexZ: boolean;
  outputType: OutputType;
}) {
  const canvasTransform = buildCanvasScaleTransform(
    CIRCUIT_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <WiringEncoderBlock />

        <WiringLine y={30} color="#dc2626" label="Brown" end="+24 V DC" />
        <WiringLine
          y={65}
          color={channelA ? STYLE.run : STYLE.wire}
          label="Black / A"
          end="Channel A"
          active={channelA}
        />
        <WiringLine
          y={100}
          color={channelB ? STYLE.run : STYLE.wire}
          label="White / B"
          end="Channel B"
          active={channelB}
        />
        <WiringLine
          y={135}
          color={indexZ ? STYLE.run : STYLE.wire}
          label="Orange / Z"
          end="Index Z"
          active={indexZ}
        />
        <WiringLine y={165} color={STYLE.active} label="Blue" end="0 V DC" />

        <text
          x={LABEL.wiringFooter.x}
          y={LABEL.wiringFooter.y}
          fontSize="12"
          fill="#475569"
        >
          {outputType} encoder wiring
        </text>
      </g>
    </svg>
  );
}

/* UI blocks stay separated */

function Header({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
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
            Rotary Encoder Simulation
          </p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"}`}
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

function Status({ label, value, dot, badge, distance }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${badge ? "bg-green-600 font-semibold text-white" : ""} ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function Read({ label, value, green }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={green ? "text-green-600" : ""}>{value}</b>
    </div>
  );
}

function Lamp({ label, on }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-8 w-8 rounded-full ${on ? "bg-green-500 shadow-[0_0_20px_#22c55e]" : "bg-slate-300"}`}
        />
      </div>
    </div>
  );
}

function LiveReadout({
  angle,
  count,
  pulseFreq,
  encoderType,
  outputType,
  direction,
  ppr,
  rpm,
  absoluteValue,
  channelA,
  channelB,
  indexZ,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Angle" value={`${angle.toFixed(0)}°`} green />
        <Read label="Pulse Count" value={`${count}`} green />
        <Read label="Frequency" value={`${pulseFreq.toFixed(0)} Hz`} />
        <Read label="Encoder Type" value={encoderType} />
        <Read label="Output Type" value={outputType} />
        <Read label="Direction" value={direction} />
        <Read label="Resolution" value={`${ppr} PPR`} />
        <Read label="Speed" value={`${rpm} RPM`} />
        <Read label="Absolute Value" value={`${absoluteValue}`} />
        <Read
          label="A/B/Z"
          value={`${channelA ? 1 : 0}/${channelB ? 1 : 0}/${indexZ ? 1 : 0}`}
        />
      </div>
    </div>
  );
}

function LearningTab({
  tab,
  encoderType,
  outputType,
}: {
  tab: Tab;
  encoderType: EncoderType;
  outputType: OutputType;
}) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Rotary Encoder Theory",
      points: [
        "A rotary encoder converts shaft rotation into electrical pulses or digital position data.",
        "Incremental encoders provide A/B pulse signals for speed and direction measurement.",
        "The Z channel gives one index pulse per revolution for reference position.",
        "Absolute encoders provide exact shaft position even after power loss.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to supply voltage.",
        "Blue wire connects to 0 V DC.",
        "A and B channels connect to high-speed PLC counter inputs.",
        "Z index channel is used for home or reference position.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is PPR in an encoder?",
        "Q2: Why are A and B signals phase shifted?",
        "Q3: What is the purpose of Z index pulse?",
        "Q4: Difference between incremental and absolute encoder?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected encoder type: ${encoderType}`,
        `Selected output type: ${outputType}`,
        "Recommended activity: change RPM and PPR to observe pulse frequency.",
        "Observe how A/B phase relationship determines direction.",
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

export default function RotaryEncoderIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [encoderType, setEncoderType] = useState<EncoderType>("Incremental");
  const [outputType, setOutputType] = useState<OutputType>("A/B Quadrature");
  const [direction, setDirection] = useState<Direction>("CW");
  const [ppr, setPpr] = useState(600);
  const [rpm, setRpm] = useState(120);
  const [angle, setAngle] = useState(72);
  const [count, setCount] = useState(240);

  const pulseFreq = power ? (rpm * ppr) / 60 : 0;
  const channelA = getChannelA(power, angle);
  const channelB = getChannelB(power, angle, direction);
  const indexZ = getIndexZ(power, angle);
  const absoluteValue = Math.floor((angle / 360) * 4096);

  function moveAngle(value: number) {
    const next = Number(Math.max(0, Math.min(359, value)).toFixed(0));
    const delta = direction === "CW" ? next - angle : angle - next;

    if (power && Math.abs(delta) > 2) {
      setCount((current) =>
        Math.max(0, current + Math.round(delta * (ppr / 360))),
      );
    }

    setAngle(next);
  }

  function reset() {
    setPower(false);
    setEncoderType("Incremental");
    setOutputType("A/B Quadrature");
    setDirection("CW");
    setPpr(600);
    setRpm(120);
    setAngle(72);
    setCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Rotary Encoder Started", "text-slate-700"],
      ["10:24:18", `${direction} rotation detected`, "text-green-600"],
      [
        "10:24:18",
        `Pulse Frequency ${pulseFreq.toFixed(0)} Hz`,
        "text-slate-900",
      ],
      ["LIVE", `${encoderType} / ${outputType}`, "text-blue-600"],
    ];
  }, [power, direction, pulseFreq, encoderType, outputType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            encoderType={encoderType}
            outputType={outputType}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="ENCODER CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Encoder Type">
                  <Select
                    value={encoderType}
                    onChange={(value: EncoderType) => setEncoderType(value)}
                  >
                    <option>Incremental</option>
                    <option>Absolute</option>
                  </Select>
                </Control>

                <Control label="Output Type">
                  <Select
                    value={outputType}
                    onChange={(value: OutputType) => setOutputType(value)}
                  >
                    <option>A/B Quadrature</option>
                    <option>A/B/Z Index</option>
                    <option>Gray Code</option>
                    <option>SSI Absolute</option>
                  </Select>
                </Control>

                <Control label="Direction">
                  <Select
                    value={direction}
                    onChange={(value: Direction) => setDirection(value)}
                  >
                    <option>CW</option>
                    <option>CCW</option>
                  </Select>
                </Control>

                <Control label="Resolution">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{ppr}</b>
                      <span>PPR</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setPpr(Math.max(100, ppr - 100))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setPpr(Math.min(2500, ppr + 100))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Speed">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{rpm}</b>
                      <span>RPM</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setRpm(Math.max(0, rpm - 10))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setRpm(Math.min(3000, rpm + 10))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>5–24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="ENCODER STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Channel A"
                  value={channelA ? "HIGH" : "LOW"}
                  badge={channelA}
                />
                <Status
                  label="Channel B"
                  value={channelB ? "HIGH" : "LOW"}
                  badge={channelB}
                />
                <Status label="Angle" value={`${angle.toFixed(0)}°`} distance />
                <Status label="Count" value={`${count}`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select incremental or absolute encoder.</li>
                  <li>2. Rotate the shaft using the slider.</li>
                  <li>3. Observe A/B phase shift and direction.</li>
                  <li>4. Compare PPR, RPM, count and frequency.</li>
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
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel
                title="ROTARY ENCODER SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <EncoderScene
                    power={power}
                    encoderType={encoderType}
                    outputType={outputType}
                    direction={direction}
                    angle={angle}
                    rpm={rpm}
                    ppr={ppr}
                    channelA={channelA}
                    channelB={channelB}
                    indexZ={indexZ}
                    moveAngle={moveAngle}
                  />

                  <LiveReadout
                    angle={angle}
                    count={count}
                    pulseFreq={pulseFreq}
                    encoderType={encoderType}
                    outputType={outputType}
                    direction={direction}
                    ppr={ppr}
                    rpm={rpm}
                    absoluteValue={absoluteValue}
                    channelA={channelA}
                    channelB={channelB}
                    indexZ={indexZ}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={359}
                      step={1}
                      value={angle}
                      onChange={(event) =>
                        moveAngle(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0°</span>
                      <span>Rotate encoder shaft</span>
                      <span>359°</span>
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
                    <Lamp label="A" on={channelA} />
                    <Lamp label="B" on={channelB} />
                    <Lamp label="Z" on={indexZ} />
                  </div>
                </Panel>

                <Panel
                  title="ENCODER CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    channelA={channelA}
                    channelB={channelB}
                    indexZ={indexZ}
                    outputType={outputType}
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
                    Pulse Count: <b>{count}</b>
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
        .miniBtn {
          height: 42px;
          width: 42px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          font-size: 23px;
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
