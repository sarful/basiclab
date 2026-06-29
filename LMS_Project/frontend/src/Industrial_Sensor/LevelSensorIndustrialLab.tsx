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
type SensorType =
  | "Float Switch"
  | "Ultrasonic Level"
  | "Capacitive Level"
  | "Radar Level";
type OutputMode = "PNP Switch" | "NPN Switch" | "4-20mA" | "0-10V";
type LiquidType = "Water" | "Oil" | "Chemical" | "Foam Surface";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  tank: 1,
  topSensor: 1,
  plc: 1,
  wiringSensor: 1,
} as const;

const BASE_WIRE_WIDTH = 18;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  danger: "#ef4444",
  warning: "#f97316",
  water: "#38bdf8",
  oil: "#f59e0b",
  chemical: "#22c55e",
  foam: "#93c5fd",
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
  tank: { x: 270, y: 145, width: 330, height: 290, rotate: 0 },
  topSensor: { x: 390, y: 65, width: 95, height: 75, rotate: 0 },
  plc: { x: 720, y: 235, width: 150, height: 105, rotate: 0 },
  wiringSensor: { x: 25, y: 62, width: 105, height: 72, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  tank: scaleComponent(BASE_COMPONENT.tank, CIRCUIT_COMPONENT_SCALE.tank),
  topSensor: scaleComponent(
    BASE_COMPONENT.topSensor,
    CIRCUIT_COMPONENT_SCALE.topSensor,
  ),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
  wiringSensor: scaleComponent(
    BASE_COMPONENT.wiringSensor,
    CIRCUIT_COMPONENT_SCALE.wiringSensor,
  ),
} as const;

const NODE = {
  tankInner: {
    x: BASE_COMPONENT.tank.x + 8,
    y: BASE_COMPONENT.tank.y + 8,
    width: BASE_COMPONENT.tank.width - 16,
    height: BASE_COMPONENT.tank.height - 16,
  },
  topSensorCenter: pointOnComponent(BASE_COMPONENT.topSensor, 0.5, 0.7),
  signalStart: { x: 600, y: 280 },
  signalEnd: { x: 720, y: 288 },

  wiringBrown: { x: 130, y: 72 },
  wiringSignal: { x: 130, y: 95 },
  wiringBlue: { x: 130, y: 118 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  signalPath: "M600 280 C650 390 690 350 720 288",

  wiringBrown: "M130 72 L175 35 L205 35 H410",
  wiringSignal: "M130 95 H410",
  wiringBlue: "M130 118 L175 155 L205 155 H410",
} as const;

const PATH = {
  signalMotion: WIRE.signalPath,
  wiringSignalMotion: "M130 95 L410 95",
} as const;

const LABEL = {
  level: { x: 390, y: 120 },
  alarm: { x: 690, y: 150 },
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

function getLiquidColor(liquidType: LiquidType) {
  if (liquidType === "Oil") return STYLE.oil;
  if (liquidType === "Chemical") return STYLE.chemical;
  if (liquidType === "Foam Surface") return STYLE.foam;
  return STYLE.water;
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

function TankBody({
  liquidType,
  level,
}: {
  liquidType: LiquidType;
  level: number;
}) {
  const tank = COMPONENT.tank;
  const liquidH = (tank.height * level) / 100;
  const liquidY = tank.y + tank.height - liquidH;

  return (
    <g>
      <rect
        x={tank.x}
        y={tank.y}
        width={tank.width}
        height={tank.height}
        rx="24"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="6"
        filter="url(#shadow)"
      />
      <clipPath id="tankClip">
        <rect
          x={tank.x + 8}
          y={tank.y + 8}
          width={tank.width - 16}
          height={tank.height - 16}
          rx="18"
        />
      </clipPath>

      <g clipPath="url(#tankClip)">
        <rect
          x={tank.x + 8}
          y={liquidY}
          width={tank.width - 16}
          height={liquidH}
          fill={getLiquidColor(liquidType)}
          opacity=".75"
        />
        <path
          d={`M${tank.x + 8} ${liquidY + 8} C ${tank.x + 80} ${liquidY - 10}, ${tank.x + 155} ${liquidY + 25}, ${tank.x + 235} ${liquidY + 6} C ${tank.x + 280} ${liquidY - 5}, ${tank.x + 310} ${liquidY + 6}, ${tank.x + tank.width - 8} ${liquidY}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          opacity=".65"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-40"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {liquidType === "Foam Surface" &&
          Array.from({ length: 20 }).map((_, index) => (
            <circle
              key={index}
              cx={tank.x + 30 + ((index * 37) % 270)}
              cy={liquidY + 12 + (index % 4) * 8}
              r={4 + (index % 3)}
              fill="white"
              opacity=".8"
            />
          ))}
      </g>
    </g>
  );
}

function SetpointLines({
  highSet,
  lowSet,
}: {
  highSet: number;
  lowSet: number;
}) {
  const tank = COMPONENT.tank;
  const highY = tank.y + tank.height - (tank.height * highSet) / 100;
  const lowY = tank.y + tank.height - (tank.height * lowSet) / 100;

  return (
    <g>
      <line
        x1={tank.x + tank.width + 15}
        y1={highY}
        x2={tank.x + tank.width + 95}
        y2={highY}
        stroke={STYLE.danger}
        strokeDasharray="7 6"
        strokeWidth="2"
      />
      <text
        x={tank.x + tank.width + 100}
        y={highY + 5}
        fontSize="13"
        fill="#dc2626"
      >
        High {highSet}%
      </text>

      <line
        x1={tank.x + tank.width + 15}
        y1={lowY}
        x2={tank.x + tank.width + 95}
        y2={lowY}
        stroke={STYLE.warning}
        strokeDasharray="7 6"
        strokeWidth="2"
      />
      <text
        x={tank.x + tank.width + 100}
        y={lowY + 5}
        fontSize="13"
        fill="#ea580c"
      >
        Low {lowSet}%
      </text>
    </g>
  );
}

function SensorBlock({
  power,
  sensorType,
  level,
}: {
  power: boolean;
  sensorType: SensorType;
  level: number;
}) {
  const tank = COMPONENT.tank;
  const liquidY = tank.y + tank.height - (tank.height * level) / 100;

  if (sensorType === "Float Switch") {
    return (
      <g filter="url(#shadow)">
        <line
          x1={tank.x + 95}
          y1={tank.y + 30}
          x2={tank.x + 95}
          y2={liquidY + 22}
          stroke={STYLE.wire}
          strokeWidth="8"
        />
        <ellipse
          cx={tank.x + 95}
          cy={liquidY + 30}
          rx="42"
          ry="24"
          fill="#f8fafc"
          stroke="#334155"
          strokeWidth="4"
        />
        <text x={tank.x + 35} y={tank.y - 12} fontSize="13" fill="#475569">
          Float Switch
        </text>
      </g>
    );
  }

  return (
    <g filter="url(#shadow)">
      <rect
        x={COMPONENT.topSensor.x}
        y={COMPONENT.topSensor.y}
        width={COMPONENT.topSensor.width}
        height={COMPONENT.topSensor.height}
        rx="14"
        fill="url(#steel)"
        stroke="#334155"
      />
      <circle
        cx={NODE.topSensorCenter.x}
        cy={NODE.topSensorCenter.y}
        r="15"
        fill={sensorType === "Radar Level" ? STYLE.danger : STYLE.active}
        opacity=".9"
      />
      <text x={tank.x + 98} y={tank.y - 92} fontSize="13" fill="#475569">
        {sensorType}
      </text>

      {Array.from({ length: 4 }).map((_, index) => (
        <path
          key={index}
          d={`M${NODE.topSensorCenter.x} ${tank.y - 5} Q ${tank.x + 100 - index * 18} ${tank.y + 110 + index * 20}, ${NODE.topSensorCenter.x} ${liquidY}`}
          fill="none"
          stroke={sensorType === "Radar Level" ? STYLE.danger : STYLE.active}
          strokeWidth="2"
          strokeDasharray="8 8"
          opacity={power ? 0.35 + index * 0.12 : 0.08}
        />
      ))}
    </g>
  );
}

function PlcBlock({ current, voltage }: { current: number; voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.plc.x}
        y={COMPONENT.plc.y}
        width={COMPONENT.plc.width}
        height={COMPONENT.plc.height}
        rx="16"
        fill="#f8fafc"
        stroke="#94a3b8"
        filter="url(#shadow)"
      />
      <text x="750" y="265" fontSize="15" fontWeight="700" fill={STYLE.active}>
        PLC AI
      </text>
      <text x="743" y="292" fontSize="13" fill="#475569">
        {current.toFixed(1)} mA
      </text>
      <text x="743" y="315" fontSize="13" fill="#475569">
        {voltage.toFixed(2)} V
      </text>
    </g>
  );
}

function SignalCable({
  power,
  highAlarm,
  lowAlarm,
}: {
  power: boolean;
  highAlarm: boolean;
  lowAlarm: boolean;
}) {
  return (
    <g>
      <path
        d={WIRE.signalPath}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />
      {power && (
        <circle r="5" fill={highAlarm || lowAlarm ? STYLE.danger : STYLE.run}>
          <animateMotion
            dur="1.3s"
            repeatCount="indefinite"
            path={PATH.signalMotion}
          />
        </circle>
      )}
    </g>
  );
}

function SceneLabels({
  measuredLevel,
  highAlarm,
  lowAlarm,
}: {
  measuredLevel: number;
  highAlarm: boolean;
  lowAlarm: boolean;
}) {
  return (
    <g>
      <text
        x={LABEL.level.x}
        y={LABEL.level.y}
        textAnchor="middle"
        fill={highAlarm ? "#dc2626" : lowAlarm ? "#ea580c" : STYLE.active}
        fontSize="24"
        fontWeight="700"
      >
        LEVEL {measuredLevel.toFixed(0)}%
      </text>

      {(highAlarm || lowAlarm) && (
        <text
          x={LABEL.alarm.x}
          y={LABEL.alarm.y}
          fill="#dc2626"
          fontSize="24"
          fontWeight="700"
        >
          {highAlarm ? "HIGH LEVEL ALARM" : "LOW LEVEL ALARM"}
        </text>
      )}

      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial tank level measurement and alarm station
      </text>
      <text
        x={LABEL.footerTwo.x}
        y={LABEL.footerTwo.y}
        fontSize="13"
        fill="#64748b"
      >
        Tank Level → Sensor → PLC / Alarm Output
      </text>
    </g>
  );
}

function LevelScene({
  power,
  sensorType,
  liquidType,
  level,
  measuredLevel,
  highSet,
  lowSet,
  highAlarm,
  lowAlarm,
  current,
  voltage,
}: {
  power: boolean;
  sensorType: SensorType;
  liquidType: LiquidType;
  level: number;
  measuredLevel: number;
  highSet: number;
  lowSet: number;
  highAlarm: boolean;
  lowAlarm: boolean;
  current: number;
  voltage: number;
}) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-full w-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset=".35" stopColor="#f8fafc" />
          <stop offset=".65" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <TankBody liquidType={liquidType} level={level} />
        <SetpointLines highSet={highSet} lowSet={lowSet} />
        <SensorBlock power={power} sensorType={sensorType} level={level} />
        <SignalCable power={power} highAlarm={highAlarm} lowAlarm={lowAlarm} />
        <PlcBlock current={current} voltage={voltage} />
        <SceneLabels
          measuredLevel={measuredLevel}
          highAlarm={highAlarm}
          lowAlarm={lowAlarm}
        />
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
      <path d="M50 115 V80 H105 V115" fill={STYLE.water} opacity=".55" />
      <circle
        cx="110"
        cy="80"
        r="5"
        fill={outputOn ? STYLE.run : STYLE.muted}
      />
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
  outputMode,
  outputOn,
  current,
  voltage,
}: {
  outputMode: OutputMode;
  outputOn: boolean;
  current: number;
  voltage: number;
}) {
  const signalText =
    outputMode === "4-20mA"
      ? `${current.toFixed(1)} mA`
      : outputMode === "0-10V"
        ? `${voltage.toFixed(2)} V`
        : "PLC Input";

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
          label="Black / Signal"
          labelPosition={LABEL.wiringSignal}
          end={signalText}
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
          3-wire level sensor connection
        </text>
      </g>
    </svg>
  );
}

/* UI */

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
            Level Sensor Simulation
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

function Status({ label, value, dot, badge, distance, danger }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${badge ? `${danger ? "bg-red-600" : "bg-green-600"} font-semibold text-white` : ""} ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
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

function Lamp({ label, on, danger }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-8 w-8 rounded-full ${on ? `${danger ? "bg-red-500 shadow-[0_0_20px_#ef4444]" : "bg-green-500 shadow-[0_0_20px_#22c55e]"}` : "bg-slate-300"}`}
        />
      </div>
    </div>
  );
}

function LiveReadout({
  level,
  measuredLevel,
  highSet,
  lowSet,
  highAlarm,
  lowAlarm,
  current,
  voltage,
  sensorType,
  outputMode,
  liquidType,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Actual Level" value={`${level.toFixed(0)}%`} green />
        <Read
          label="Measured Level"
          value={`${measuredLevel.toFixed(0)}%`}
          green
        />
        <Read label="High Set" value={`${highSet}%`} />
        <Read label="Low Set" value={`${lowSet}%`} />
        <Read
          label="Alarm"
          value={highAlarm ? "HIGH" : lowAlarm ? "LOW" : "NORMAL"}
          danger={highAlarm || lowAlarm}
          green={!highAlarm && !lowAlarm}
        />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="Voltage" value={`${voltage.toFixed(2)} V`} />
        <Read label="Sensor Type" value={sensorType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Liquid" value={liquidType} />
      </div>
    </div>
  );
}

function LearningTab({ tab, sensorType, outputMode }: any) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Level Sensor Theory",
      points: [
        "Level sensors measure liquid or solid material height inside a tank.",
        "Float switches provide simple high/low point level detection.",
        "Ultrasonic and radar sensors measure continuous level from the top of the tank.",
        "Capacitive level sensors detect material by dielectric change around the probe.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire carries switching or analog level signal.",
        "4–20mA and 0–10V outputs are used for continuous level measurement.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which sensor is simple for high/low level detection?",
        "Q2: Which level sensor works without touching liquid?",
        "Q3: What does 4–20mA represent in level measurement?",
        "Q4: Why can foam affect ultrasonic level measurement?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: change level and observe high/low alarm.",
        "Compare float switch point detection with analog continuous measurement.",
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

export default function LevelSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Ultrasonic Level");
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [liquidType, setLiquidType] = useState<LiquidType>("Water");
  const [highSet, setHighSet] = useState(80);
  const [lowSet, setLowSet] = useState(20);
  const [level, setLevel] = useState(55);
  const [alarmCount, setAlarmCount] = useState(1);

  const weakEcho =
    liquidType === "Foam Surface" && sensorType === "Ultrasonic Level";
  const measuredLevel = Math.max(0, Math.min(100, level - (weakEcho ? 8 : 0)));
  const highAlarm = power && measuredLevel >= highSet;
  const lowAlarm = power && measuredLevel <= lowSet;
  const analog = outputMode === "4-20mA" || outputMode === "0-10V";
  const current = power ? 4 + (measuredLevel / 100) * 16 : 0;
  const voltage = power ? (measuredLevel / 100) * 10 : 0;
  const outputOn =
    power && (analog ? measuredLevel > 0 : highAlarm || lowAlarm);

  function moveLevel(value: number) {
    const next = Number(Math.max(0, Math.min(100, value)).toFixed(0));
    if (!highAlarm && power && next >= highSet)
      setAlarmCount((count) => count + 1);
    if (!lowAlarm && power && next <= lowSet)
      setAlarmCount((count) => count + 1);
    setLevel(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Ultrasonic Level");
    setOutputMode("4-20mA");
    setLiquidType("Water");
    setHighSet(80);
    setLowSet(20);
    setLevel(55);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Level Sensor Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Level Alarm", "text-red-600"]
        : lowAlarm
          ? ["10:24:18", "Low Level Alarm", "text-orange-600"]
          : ["10:24:23", "Level Normal", "text-green-600"],
      [
        "10:24:18",
        `${current.toFixed(1)} mA / ${voltage.toFixed(2)} V`,
        "text-slate-900",
      ],
      ["LIVE", `${sensorType} / ${liquidType}`, "text-blue-600"],
    ];
  }, [power, highAlarm, lowAlarm, current, voltage, sensorType, liquidType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            sensorType={sensorType}
            outputMode={outputMode}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="LEVEL SENSOR CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Sensor Type">
                  <Select
                    value={sensorType}
                    onChange={(value: SensorType) => setSensorType(value)}
                  >
                    <option>Float Switch</option>
                    <option>Ultrasonic Level</option>
                    <option>Capacitive Level</option>
                    <option>Radar Level</option>
                  </Select>
                </Control>

                <Control label="Liquid Type">
                  <Select
                    value={liquidType}
                    onChange={(value: LiquidType) => setLiquidType(value)}
                  >
                    <option>Water</option>
                    <option>Oil</option>
                    <option>Chemical</option>
                    <option>Foam Surface</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select
                    value={outputMode}
                    onChange={(value: OutputMode) => setOutputMode(value)}
                  >
                    <option>PNP Switch</option>
                    <option>NPN Switch</option>
                    <option>4-20mA</option>
                    <option>0-10V</option>
                  </Select>
                </Control>

                <Control label="High Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{highSet}</b>
                      <span>%</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() =>
                        setHighSet(Math.max(lowSet + 5, highSet - 5))
                      }
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setHighSet(Math.min(100, highSet + 5))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Low Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{lowSet}</b>
                      <span>%</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setLowSet(Math.max(0, lowSet - 5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() =>
                        setLowSet(Math.min(highSet - 5, lowSet + 5))
                      }
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="LEVEL SENSOR STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="High Alarm"
                  value={highAlarm ? "HIGH" : "NORMAL"}
                  badge={highAlarm}
                  danger={highAlarm}
                />
                <Status
                  label="Low Alarm"
                  value={lowAlarm ? "LOW" : "NORMAL"}
                  badge={lowAlarm}
                  danger={lowAlarm}
                />
                <Status
                  label="Level"
                  value={`${measuredLevel.toFixed(0)}%`}
                  distance
                />
                <Status
                  label="Output"
                  value={outputOn ? "ACTIVE" : "OFF"}
                  badge={outputOn}
                />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select level sensor type and output mode.</li>
                  <li>2. Adjust tank level using slider.</li>
                  <li>3. Observe high/low alarm and analog output.</li>
                  <li>
                    4. Compare float, ultrasonic, capacitive and radar sensing.
                  </li>
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
                title="LEVEL SENSOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <LevelScene
                    power={power}
                    sensorType={sensorType}
                    liquidType={liquidType}
                    level={level}
                    measuredLevel={measuredLevel}
                    highSet={highSet}
                    lowSet={lowSet}
                    highAlarm={highAlarm}
                    lowAlarm={lowAlarm}
                    current={current}
                    voltage={voltage}
                  />
                  <LiveReadout
                    level={level}
                    measuredLevel={measuredLevel}
                    highSet={highSet}
                    lowSet={lowSet}
                    highAlarm={highAlarm}
                    lowAlarm={lowAlarm}
                    current={current}
                    voltage={voltage}
                    sensorType={sensorType}
                    outputMode={outputMode}
                    liquidType={liquidType}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={level}
                      onChange={(event) =>
                        moveLevel(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Empty</span>
                      <span>Adjust tank level</span>
                      <span>Full</span>
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
                    <Lamp label="HIGH" on={highAlarm} danger />
                    <Lamp label="LOW" on={lowAlarm} danger />
                  </div>
                </Panel>

                <Panel
                  title="LEVEL SENSOR CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    outputMode={outputMode}
                    outputOn={outputOn}
                    current={current}
                    voltage={voltage}
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
                    Alarm Count: <b>{alarmCount}</b>
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
