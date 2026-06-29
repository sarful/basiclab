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
type LaserMode = "Diffuse" | "Retro-reflective" | "Through-beam";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC";
type TargetType =
  | "White Box"
  | "Metal Plate"
  | "Black Object"
  | "Transparent Film";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  conveyor: 1,
  emitter: 1,
  receiver: 1,
  reflector: 1,
  target: 1,
  wiringSensor: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  laser: "#ef4444",
  laserDark: "#991b1b",
  metal: "#94a3b8",
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
  base: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  conveyor: { x: 90, y: 435, width: 940, height: 10, rotate: 0 },
  emitter: { x: 105, y: 205, width: 145, height: 110, rotate: 0 },
  receiver: { x: 925, y: 210, width: 115, height: 105, rotate: 0 },
  reflector: { x: 925, y: 230, width: 105, height: 75, rotate: 0 },
  target: { x: 120, y: 220, width: 100, height: 120, rotate: 0 },
  wiringSensor: { x: 25, y: 62, width: 95, height: 70, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  conveyor: scaleComponent(
    BASE_COMPONENT.conveyor,
    CIRCUIT_COMPONENT_SCALE.conveyor,
  ),
  emitter: scaleComponent(
    BASE_COMPONENT.emitter,
    CIRCUIT_COMPONENT_SCALE.emitter,
  ),
  receiver: scaleComponent(
    BASE_COMPONENT.receiver,
    CIRCUIT_COMPONENT_SCALE.receiver,
  ),
  reflector: scaleComponent(
    BASE_COMPONENT.reflector,
    CIRCUIT_COMPONENT_SCALE.reflector,
  ),
  target: scaleComponent(BASE_COMPONENT.target, CIRCUIT_COMPONENT_SCALE.target),
  wiringSensor: scaleComponent(
    BASE_COMPONENT.wiringSensor,
    CIRCUIT_COMPONENT_SCALE.wiringSensor,
  ),
} as const;

const NODE = {
  emitterLens: { x: 248, y: 263 },
  beamStart: { x: 265, y: 263 },
  receiverX: 930,
  reflectorReturnY: 282,
  rangeStart: { x: 265, y: 355 },

  wiringBrownStart: { x: 120, y: 72 },
  wiringBrownMid: { x: 175, y: 35 },
  wiringBrownEnd: { x: 205, y: 35 },
  wiringSignalStart: { x: 120, y: 95 },
  wiringSignalEnd: { x: 410, y: 95 },
  wiringBlueStart: { x: 120, y: 118 },
  wiringBlueMid: { x: 175, y: 155 },
  wiringBlueEnd: { x: 205, y: 155 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  wiringBrown: "M120 72 L175 35 L205 35 H410",
  wiringSignal: "M120 95 H410",
  wiringBlue: "M120 118 L175 155 L205 155 H410",
} as const;

const PATH = {
  wiringSignalMotion: "M120 95 L410 95",
} as const;

const LABEL = {
  detected: { x: 490, y: 145 },
  emitter: { x: 105, y: 190 },
  receiver: { x: 925, y: 195 },
  reflector: { x: 925, y: 215 },
  range: { y: 347 },
  footerOne: { x: 80, y: 505 },
  footerTwo: { x: 80, y: 530 },

  wiringBrown: { x: 215, y: 30 },
  wiringSignal: { x: 215, y: 88 },
  wiringBlue: { x: 215, y: 148 },
  wiringBrownEnd: { x: 450, y: 40 },
  wiringSignalEnd: { x: 450, y: 100 },
  wiringBlueEnd: { x: 450, y: 160 },
  wiringFooter: { x: 35, y: 175 },
} as const;

function getTargetX(targetPosition: number) {
  return 120 + targetPosition * 8.7;
}

function getTargetFill(targetType: TargetType) {
  if (targetType === "White Box") return "#f8fafc";
  if (targetType === "Metal Plate") return "#a3a3a3";
  if (targetType === "Transparent Film") return "#bfdbfe";
  return "#111827";
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
      <rect
        x={COMPONENT.conveyor.x}
        y={COMPONENT.conveyor.y}
        width={COMPONENT.conveyor.width}
        height={COMPONENT.conveyor.height}
        rx="5"
        fill="#cbd5e1"
      />
      {Array.from({ length: 20 }).map((_, index) => (
        <circle
          key={index}
          cx={110 + index * 48}
          cy="442"
          r="14"
          fill="#9ca3af"
          stroke="#64748b"
        />
      ))}
    </g>
  );
}

function LaserEmitter({
  power,
  outputOn,
}: {
  power: boolean;
  outputOn: boolean;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.emitter.x}
        y={COMPONENT.emitter.y}
        width={COMPONENT.emitter.width}
        height={COMPONENT.emitter.height}
        rx="18"
        fill="url(#laserBody)"
        stroke={STYLE.wire}
        filter="url(#shadow)"
      />
      <rect x="230" y="238" width="35" height="50" rx="9" fill={STYLE.wire} />
      <circle
        cx={NODE.emitterLens.x}
        cy={NODE.emitterLens.y}
        r="16"
        fill={power ? STYLE.laser : STYLE.laserDark}
      />
      <circle
        cx={NODE.emitterLens.x}
        cy={NODE.emitterLens.y}
        r="6"
        fill={outputOn ? STYLE.run : STYLE.muted}
      />
      <rect
        x="135"
        y="315"
        width="30"
        height="95"
        fill="#9ca3af"
        stroke="#64748b"
      />
      <rect
        x="98"
        y="405"
        width="105"
        height="28"
        rx="6"
        fill="#d1d5db"
        stroke="#94a3b8"
      />
      <text
        x={LABEL.emitter.x}
        y={LABEL.emitter.y}
        fontSize="13"
        fill="#475569"
      >
        Laser Sensor Emitter
      </text>
    </g>
  );
}

function ReceiverOrReflector({ laserMode }: { laserMode: LaserMode }) {
  if (laserMode === "Through-beam") {
    return (
      <g>
        <rect
          x={COMPONENT.receiver.x}
          y={COMPONENT.receiver.y}
          width={COMPONENT.receiver.width}
          height={COMPONENT.receiver.height}
          rx="18"
          fill="url(#laserBody)"
          stroke={STYLE.wire}
          filter="url(#shadow)"
        />
        <rect x="908" y="240" width="30" height="48" rx="8" fill={STYLE.wire} />
        <circle cx="922" cy="264" r="14" fill={STYLE.laser} />
        <rect
          x="970"
          y="315"
          width="30"
          height="95"
          fill="#9ca3af"
          stroke="#64748b"
        />
        <rect
          x="930"
          y="405"
          width="110"
          height="28"
          rx="6"
          fill="#d1d5db"
          stroke="#94a3b8"
        />
        <text
          x={LABEL.receiver.x}
          y={LABEL.receiver.y}
          fontSize="13"
          fill="#475569"
        >
          Laser Receiver
        </text>
      </g>
    );
  }

  if (laserMode === "Retro-reflective") {
    return (
      <g>
        <rect
          x={COMPONENT.reflector.x}
          y={COMPONENT.reflector.y}
          width={COMPONENT.reflector.width}
          height={COMPONENT.reflector.height}
          rx="10"
          fill="#fee2e2"
          stroke="#dc2626"
          filter="url(#shadow)"
        />
        {Array.from({ length: 6 }).map((_, index) => (
          <line
            key={index}
            x1={940 + index * 14}
            y1="235"
            x2={940 + index * 14}
            y2="300"
            stroke={STYLE.laser}
          />
        ))}
        <text
          x={LABEL.reflector.x}
          y={LABEL.reflector.y}
          fontSize="13"
          fill="#475569"
        >
          Laser Reflector
        </text>
      </g>
    );
  }

  return null;
}

function LaserBeam({
  power,
  detected,
  laserMode,
  targetX,
}: {
  power: boolean;
  detected: boolean;
  laserMode: LaserMode;
  targetX: number;
}) {
  const laserEndX = laserMode === "Diffuse" ? targetX : NODE.receiverX;

  return (
    <g>
      <line
        x1={NODE.beamStart.x}
        y1={NODE.beamStart.y}
        x2={laserEndX}
        y2={NODE.beamStart.y}
        stroke={STYLE.laser}
        strokeWidth="5"
        strokeDasharray="16 8"
        opacity={power ? (detected ? 0.35 : 0.95) : 0.12}
        filter="url(#laserGlow)"
      />

      {laserMode === "Retro-reflective" && (
        <line
          x1={NODE.receiverX}
          y1={NODE.reflectorReturnY}
          x2={NODE.beamStart.x}
          y2={NODE.reflectorReturnY}
          stroke={STYLE.laser}
          strokeWidth="3"
          strokeDasharray="12 8"
          opacity={power ? (detected ? 0.25 : 0.75) : 0.12}
          filter="url(#laserGlow)"
        />
      )}

      {power && !detected && (
        <circle r="5" fill={STYLE.laser}>
          <animateMotion
            dur="1.1s"
            repeatCount="indefinite"
            path={`M265 263 L${laserEndX} 263`}
          />
        </circle>
      )}
    </g>
  );
}

function DetectionHighlight({
  detected,
  targetX,
}: {
  detected: boolean;
  targetX: number;
}) {
  if (!detected) return null;

  return (
    <g>
      <text
        x={LABEL.detected.x}
        y={LABEL.detected.y}
        fill="#16a34a"
        fontSize="24"
        fontWeight="700"
      >
        LASER TARGET DETECTED
      </text>
      <rect
        x={targetX - 12}
        y="175"
        width="120"
        height="200"
        rx="12"
        fill="none"
        stroke={STYLE.run}
        strokeWidth="4"
      >
        <animate
          attributeName="opacity"
          from="1"
          to=".25"
          dur=".8s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  );
}

function TargetObject({
  targetX,
  targetType,
}: {
  targetX: number;
  targetType: TargetType;
}) {
  const isFilm = targetType === "Transparent Film";

  return (
    <g>
      <rect
        x={targetX}
        y={isFilm ? 190 : 220}
        width={isFilm ? 38 : 100}
        height={isFilm ? 170 : 120}
        rx={targetType === "Metal Plate" ? 2 : 8}
        fill={getTargetFill(targetType)}
        opacity={isFilm ? 0.42 : 1}
        stroke="#475569"
        strokeWidth="2"
        filter="url(#shadow)"
      />

      {targetType === "White Box" && (
        <>
          <line
            x1={targetX}
            y1="250"
            x2={targetX + 100}
            y2="250"
            stroke="#cbd5e1"
          />
          <line
            x1={targetX + 50}
            y1="220"
            x2={targetX + 50}
            y2="340"
            stroke="#cbd5e1"
          />
        </>
      )}

      <text x={targetX - 5} y="205" fontSize="13" fill="#475569">
        {targetType}
      </text>
    </g>
  );
}

function RangeGuide({ range }: { range: number }) {
  const endX = NODE.rangeStart.x + range * 6;

  return (
    <g>
      <line
        x1={NODE.rangeStart.x}
        y1={NODE.rangeStart.y}
        x2={endX}
        y2={NODE.rangeStart.y}
        stroke="#9ca3af"
      />
      <polygon points="265,355 277,348 277,362" fill="#9ca3af" />
      <polygon
        points={`${endX},355 ${endX - 12},348 ${endX - 12},362`}
        fill="#9ca3af"
      />
      <text
        x={NODE.rangeStart.x + range * 3}
        y={LABEL.range.y}
        textAnchor="middle"
        fill="#dc2626"
        fontSize="18"
        fontWeight="700"
      >
        Laser Range {range} cm
      </text>
    </g>
  );
}

function SceneLabels({ laserMode }: { laserMode: LaserMode }) {
  return (
    <g>
      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial conveyor laser inspection station
      </text>
      <text
        x={LABEL.footerTwo.x}
        y={LABEL.footerTwo.y}
        fontSize="13"
        fill="#64748b"
      >
        Mode: {laserMode}
      </text>
    </g>
  );
}

function LaserScene({
  power,
  laserMode,
  targetType,
  targetPosition,
  range,
  detected,
  outputOn,
  moveTarget,
}: {
  power: boolean;
  laserMode: LaserMode;
  targetType: TargetType;
  targetPosition: number;
  range: number;
  detected: boolean;
  outputOn: boolean;
  moveTarget: (value: number) => void;
}) {
  const targetX = getTargetX(targetPosition);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  function drag(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_BOX_WIDTH;
    moveTarget((x - 120) / 8.7);
  }

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(event) => event.buttons === 1 && drag(event)}
    >
      <defs>
        <linearGradient id="laserBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".22" stopColor="#d1d5db" />
          <stop offset=".5" stopColor="#64748b" />
          <stop offset=".78" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <filter id="laserGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <LaserEmitter power={power} outputOn={outputOn} />
        <ReceiverOrReflector laserMode={laserMode} />
        <LaserBeam
          power={power}
          detected={detected}
          laserMode={laserMode}
          targetX={targetX}
        />
        <DetectionHighlight detected={detected} targetX={targetX} />
        <TargetObject targetX={targetX} targetType={targetType} />
        <RangeGuide range={range} />
        <SceneLabels laserMode={laserMode} />
      </g>
    </svg>
  );
}

function WiringSensorBlock({ outputOn }: { outputOn: boolean }) {
  return (
    <g>
      <rect
        x={COMPONENT.wiringSensor.x}
        y={COMPONENT.wiringSensor.y}
        width={COMPONENT.wiringSensor.width}
        height={COMPONENT.wiringSensor.height}
        rx="14"
        fill="#94a3b8"
        stroke="#334155"
      />
      <circle cx="108" cy="97" r="15" fill={STYLE.laser} />
      <circle cx="55" cy="80" r="5" fill={outputOn ? STYLE.run : STYLE.muted} />
    </g>
  );
}

function WiringLine({
  d,
  color,
  label,
  labelPosition,
  end,
  endPosition,
  active = false,
  arrowPoints,
}: {
  d: string;
  color: string;
  label: string;
  labelPosition: Point;
  end: string;
  endPosition: Point;
  active?: boolean;
  arrowPoints: string;
}) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={active ? 4 : 2} />
      <polygon points={arrowPoints} fill={color} />
      <text x={labelPosition.x} y={labelPosition.y} fontSize="14" fill={color}>
        {label}
      </text>
      <text x={endPosition.x} y={endPosition.y} fontSize="14">
        {end}
      </text>
      {active && (
        <circle r="5" fill={STYLE.run}>
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={PATH.wiringSignalMotion}
          />
        </circle>
      )}
    </g>
  );
}

function WiringSvg({
  outputType,
  outputOn,
}: {
  outputType: OutputType;
  outputOn: boolean;
}) {
  const pnp = outputType.includes("PNP");
  const canvasTransform = buildCanvasScaleTransform(
    CIRCUIT_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <WiringSensorBlock outputOn={outputOn} />

        <WiringLine
          d={WIRE.wiringBrown}
          color="#dc2626"
          label="Brown"
          labelPosition={LABEL.wiringBrown}
          end="+24 V DC"
          endPosition={LABEL.wiringBrownEnd}
          arrowPoints="410,29 426,35 410,41"
        />
        <WiringLine
          d={WIRE.wiringSignal}
          color={outputOn ? "#16a34a" : STYLE.wire}
          label="Black"
          labelPosition={LABEL.wiringSignal}
          end="PLC Input"
          endPosition={LABEL.wiringSignalEnd}
          active={outputOn}
          arrowPoints="410,88 426,95 410,102"
        />
        <WiringLine
          d={WIRE.wiringBlue}
          color={STYLE.active}
          label="Blue"
          labelPosition={LABEL.wiringBlue}
          end="0 V DC"
          endPosition={LABEL.wiringBlueEnd}
          arrowPoints="410,149 426,155 410,161"
        />

        <text
          x={LABEL.wiringFooter.x}
          y={LABEL.wiringFooter.y}
          fontSize="12"
          fill="#475569"
        >
          3-wire {pnp ? "PNP sourcing" : "NPN sinking"} laser sensor
        </text>
      </g>
    </svg>
  );
}

/* UI blocks below */

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
            Laser Sensor Simulation
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
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-10 w-10 rounded-full ${on ? "bg-green-500 shadow-[0_0_20px_#22c55e]" : "bg-slate-300"}`}
        />
      </div>
    </div>
  );
}

function LiveReadout({
  targetPosition,
  detected,
  outputOn,
  laserMode,
  outputType,
  range,
  targetType,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read
          label="Target Position"
          value={`${targetPosition.toFixed(1)} cm`}
          green
        />
        <Read
          label="Output State"
          value={outputOn ? "ON" : "OFF"}
          green={outputOn}
        />
        <Read label="Supply Voltage" value="24 V DC" />
        <Read
          label="Target"
          value={detected ? "Detected" : "Not Detected"}
          green={detected}
        />
        <Read label="Laser Mode" value={laserMode} />
        <Read label="Output" value={outputType} />
        <Read label="Target Type" value={targetType} />
        <Read label="Set Range" value={`${range} cm`} />
      </div>
    </div>
  );
}

function LearningTab({ tab, laserMode, outputType }: any) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Laser Sensor Theory",
      points: [
        "Laser sensors use a narrow, focused light beam for precise object detection.",
        "Diffuse mode depends on light reflected from the target surface.",
        "Retro-reflective mode uses a reflector and detects beam interruption.",
        "Through-beam mode uses separate emitter and receiver for highest reliability.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire is the output signal to PLC input.",
        "PNP output sources positive voltage; NPN output sinks to 0 V.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Why is a laser sensor more precise than a basic photoelectric sensor?",
        "Q2: Which mode uses separate emitter and receiver?",
        "Q3: What is the function of the black wire?",
        "Q4: Why are black or transparent targets difficult in diffuse mode?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected laser mode: ${laserMode}`,
        `Selected output type: ${outputType}`,
        "Recommended activity: compare white, metal, black and transparent targets.",
        "Observe how narrow laser beam alignment affects detection.",
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

export default function LaserSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [laserMode, setLaserMode] = useState<LaserMode>("Diffuse");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [targetType, setTargetType] = useState<TargetType>("White Box");
  const [range, setRange] = useState(60);
  const [targetPosition, setTargetPosition] = useState(48);
  const [detectCount, setDetectCount] = useState(9);

  const targetInBeam = targetPosition >= 35 && targetPosition <= 70;
  const difficultTarget =
    targetType === "Black Object" || targetType === "Transparent Film";

  const detected =
    power &&
    targetInBeam &&
    targetPosition <= range + 20 &&
    (laserMode !== "Diffuse" || !difficultTarget);

  const noMode = outputType.includes("NO");
  const outputOn = power && (noMode ? detected : !detected);

  function moveTarget(value: number) {
    const next = Number(Math.max(5, Math.min(95, value)).toFixed(1));
    if (!detected && next >= 35 && next <= 70 && power)
      setDetectCount((count) => count + 1);
    setTargetPosition(next);
  }

  function reset() {
    setPower(false);
    setLaserMode("Diffuse");
    setOutputType("PNP NO");
    setTargetType("White Box");
    setRange(60);
    setTargetPosition(48);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Laser Sensor Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Laser Target Detected", "text-green-600"]
        : ["10:24:23", "Laser Beam Clear", "text-orange-500"],
      ["10:24:18", outputOn ? "Output ON" : "Output OFF", "text-slate-900"],
      ["LIVE", `${laserMode} / ${targetType}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, laserMode, targetType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            laserMode={laserMode}
            outputType={outputType}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="LASER SENSOR CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Laser Mode">
                  <Select
                    value={laserMode}
                    onChange={(value: LaserMode) => setLaserMode(value)}
                  >
                    <option>Diffuse</option>
                    <option>Retro-reflective</option>
                    <option>Through-beam</option>
                  </Select>
                </Control>

                <Control label="Detection Range">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{range}</b>
                      <span>cm</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setRange(Math.max(10, range - 5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setRange(Math.min(120, range + 5))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Output Type">
                  <Select
                    value={outputType}
                    onChange={(value: OutputType) => setOutputType(value)}
                  >
                    <option>PNP NO</option>
                    <option>PNP NC</option>
                    <option>NPN NO</option>
                    <option>NPN NC</option>
                  </Select>
                </Control>

                <Control label="Laser Class">
                  <div className="input flex items-center justify-between">
                    <span>Class 2 Red Laser</span>
                    <Zap size={15} className="text-red-600" />
                  </div>
                </Control>

                <Control label="Target Type">
                  <Select
                    value={targetType}
                    onChange={(value: TargetType) => setTargetType(value)}
                  >
                    <option>White Box</option>
                    <option>Metal Plate</option>
                    <option>Black Object</option>
                    <option>Transparent Film</option>
                  </Select>
                </Control>
              </Panel>

              <Panel title="LASER SENSOR STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Output State"
                  value={outputOn ? "ON" : "OFF"}
                  badge={outputOn}
                />
                <Status
                  label="Target Detected"
                  value={detected ? "YES" : "NO"}
                  badge={detected}
                />
                <Status
                  label="Position"
                  value={`${targetPosition.toFixed(1)} cm`}
                  distance
                />
                <Status label="Mode" value={laserMode} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select laser sensing mode.</li>
                  <li>2. Drag the target across the conveyor.</li>
                  <li>3. Observe red laser beam and output lamp.</li>
                  <li>4. Compare bright, dark and transparent targets.</li>
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
                title="LASER SENSOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <LaserScene
                    power={power}
                    laserMode={laserMode}
                    targetType={targetType}
                    targetPosition={targetPosition}
                    range={range}
                    detected={detected}
                    outputOn={outputOn}
                    moveTarget={moveTarget}
                  />
                  <LiveReadout
                    targetPosition={targetPosition}
                    detected={detected}
                    outputOn={outputOn}
                    laserMode={laserMode}
                    outputType={outputType}
                    range={range}
                    targetType={targetType}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={5}
                      max={95}
                      step={0.1}
                      value={targetPosition}
                      onChange={(event) =>
                        moveTarget(Number(event.target.value))
                      }
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Left</span>
                      <span>Move target across laser beam</span>
                      <span>Right</span>
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
                  <div className="grid h-[190px] grid-cols-2 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="OUTPUT" on={outputOn} />
                  </div>
                </Panel>

                <Panel
                  title="LASER SENSOR CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg outputType={outputType} outputOn={outputOn} />
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
                    Detection Count: <b>{detectCount}</b>
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
