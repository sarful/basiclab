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
  | "Gauge Pressure"
  | "Absolute Pressure"
  | "Differential Pressure";
type OutputMode = "4-20mA" | "0-10V" | "PNP Switch" | "NPN Switch";
type Process = "Hydraulic Line" | "Air Compressor" | "Water Pipe" | "Filter DP";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  pipe: 1,
  sensorBody: 1,
  diaphragm: 1,
  gauge: 1,
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
  pipe: "#94a3b8",
  pipeStroke: "#475569",
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
  pipe: { x: 120, y: 290, width: 415, height: 78, rotate: 0 },
  sensorBody: { x: 520, y: 245, width: 95, height: 165, rotate: 0 },
  diaphragm: { x: 500, y: 305, width: 55, height: 48, rotate: 0 },
  gauge: { x: 615, y: 165, width: 210, height: 210, rotate: 0 },
  plc: { x: 860, y: 235, width: 150, height: 105, rotate: 0 },
  wiringSensor: { x: 25, y: 62, width: 105, height: 72, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  pipe: scaleComponent(BASE_COMPONENT.pipe, CIRCUIT_COMPONENT_SCALE.pipe),
  sensorBody: scaleComponent(
    BASE_COMPONENT.sensorBody,
    CIRCUIT_COMPONENT_SCALE.sensorBody,
  ),
  diaphragm: scaleComponent(
    BASE_COMPONENT.diaphragm,
    CIRCUIT_COMPONENT_SCALE.diaphragm,
  ),
  gauge: scaleComponent(BASE_COMPONENT.gauge, CIRCUIT_COMPONENT_SCALE.gauge),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
  wiringSensor: scaleComponent(
    BASE_COMPONENT.wiringSensor,
    CIRCUIT_COMPONENT_SCALE.wiringSensor,
  ),
} as const;

const NODE = {
  signalStart: { x: 615, y: 330 },
  signalEnd: { x: 860, y: 290 },
  gaugeCenter: { x: 720, y: 270 },

  wiringBrownStart: { x: 130, y: 72 },
  wiringBrownMid: { x: 175, y: 35 },
  wiringBrownEnd: { x: 205, y: 35 },
  wiringSignalStart: { x: 130, y: 95 },
  wiringSignalEnd: { x: 410, y: 95 },
  wiringBlueStart: { x: 130, y: 118 },
  wiringBlueMid: { x: 175, y: 155 },
  wiringBlueEnd: { x: 205, y: 155 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  signalPath: "M615 330 C690 405 780 370 860 290",

  wiringBrown: "M130 72 L175 35 L205 35 H410",
  wiringSignal: "M130 95 H410",
  wiringBlue: "M130 118 L175 155 L205 155 H410",
} as const;

const PATH = {
  signalMotion: WIRE.signalPath,
  wiringSignalMotion: "M130 95 L410 95",
} as const;

const LABEL = {
  pressure: { x: 290, y: 135 },
  setPoint: { x: 290, y: 170 },
  alarm: { x: 470, y: 150 },
  process: { x: 155, y: 285 },
  transmitter: { x: 520, y: 230 },
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

function getMaxPressure(sensorType: SensorType) {
  return sensorType === "Differential Pressure" ? 10 : 16;
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

function ProcessPipe({
  power,
  process,
  percent,
}: {
  power: boolean;
  process: Process;
  percent: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.pipe.x}
        y={COMPONENT.pipe.y}
        width={COMPONENT.pipe.width}
        height={COMPONENT.pipe.height}
        rx="30"
        fill={STYLE.pipe}
        stroke={STYLE.pipeStroke}
        filter="url(#shadow)"
      />

      <rect
        x="135"
        y="312"
        width="385"
        height="34"
        rx="16"
        fill={STYLE.active}
        opacity=".3"
      />

      <text
        x={LABEL.process.x}
        y={LABEL.process.y}
        fontSize="13"
        fill="#475569"
      >
        {process}
      </text>

      {Array.from({ length: 8 }).map((_, index) => (
        <circle
          key={`pressure-dot-${index}`}
          cx={160 + index * 45 + percent * 1.5}
          cy="329"
          r="5"
          fill={STYLE.active}
          opacity={power ? 0.35 + percent / 180 : 0.08}
        >
          {power && (
            <animate
              attributeName="cx"
              from={160 + index * 45}
              to={190 + index * 45}
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </g>
  );
}

function PressureTransmitter({
  power,
  highAlarm,
  percent,
}: {
  power: boolean;
  highAlarm: boolean;
  percent: number;
}) {
  const diaphragmMove = Math.min(18, percent / 6);

  return (
    <g>
      <rect
        x={COMPONENT.sensorBody.x}
        y={COMPONENT.sensorBody.y}
        width={COMPONENT.sensorBody.width}
        height={COMPONENT.sensorBody.height}
        rx="16"
        fill="url(#metal)"
        stroke={STYLE.wire}
        filter="url(#shadow)"
      />

      <rect
        x={COMPONENT.diaphragm.x}
        y={COMPONENT.diaphragm.y}
        width={COMPONENT.diaphragm.width}
        height={COMPONENT.diaphragm.height}
        rx="10"
        fill={STYLE.wire}
      />

      <path
        d={`M555 330 C585 ${310 + diaphragmMove}, 600 ${
          310 + diaphragmMove
        }, 615 330`}
        fill="none"
        stroke={highAlarm ? STYLE.danger : STYLE.run}
        strokeWidth="6"
      />

      <circle cx="570" cy="275" r="7" fill={power ? STYLE.run : STYLE.muted} />
      <circle
        cx="590"
        cy="275"
        r="7"
        fill={highAlarm ? STYLE.danger : STYLE.run}
      />
    </g>
  );
}

function PressureGauge({
  pressure,
  percent,
  highAlarm,
}: {
  pressure: number;
  percent: number;
  highAlarm: boolean;
}) {
  const needleAngle = -130 + percent * 2.6;

  return (
    <g>
      <circle
        cx={NODE.gaugeCenter.x}
        cy={NODE.gaugeCenter.y}
        r="105"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="8"
        filter="url(#shadow)"
      />
      <circle
        cx={NODE.gaugeCenter.x}
        cy={NODE.gaugeCenter.y}
        r="76"
        fill="#ffffff"
        stroke="#cbd5e1"
      />

      {Array.from({ length: 11 }).map((_, index) => {
        const angle = ((-130 + index * 26) * Math.PI) / 180;
        const x1 = NODE.gaugeCenter.x + Math.cos(angle) * 70;
        const y1 = NODE.gaugeCenter.y + Math.sin(angle) * 70;
        const x2 = NODE.gaugeCenter.x + Math.cos(angle) * 88;
        const y2 = NODE.gaugeCenter.y + Math.sin(angle) * 88;

        return (
          <line
            key={`gauge-mark-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#475569"
            strokeWidth="3"
          />
        );
      })}

      <g transform={`rotate(${needleAngle} 720 270)`}>
        <line
          x1="720"
          y1="270"
          x2="792"
          y2="270"
          stroke={highAlarm ? STYLE.danger : STYLE.active}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      <circle cx="720" cy="270" r="8" fill={STYLE.wire} />

      <text
        x="694"
        y="315"
        fontSize="18"
        fontWeight="700"
        fill={highAlarm ? "#dc2626" : STYLE.active}
      >
        {pressure.toFixed(1)} bar
      </text>
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

      <text x="890" y="265" fontSize="15" fontWeight="700" fill={STYLE.active}>
        PLC AI
      </text>
      <text x="882" y="292" fontSize="13" fill="#475569">
        {current.toFixed(1)} mA
      </text>
      <text x="882" y="315" fontSize="13" fill="#475569">
        {voltage.toFixed(2)} V
      </text>
    </g>
  );
}

function SignalCable({
  power,
  highAlarm,
}: {
  power: boolean;
  highAlarm: boolean;
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
        <circle r="5" fill={highAlarm ? STYLE.danger : STYLE.run}>
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
  pressure,
  setPoint,
  highAlarm,
  sensorType,
}: {
  pressure: number;
  setPoint: number;
  highAlarm: boolean;
  sensorType: SensorType;
}) {
  return (
    <g>
      <line x1="140" y1="145" x2="440" y2="145" stroke="#9ca3af" />

      <text
        x={LABEL.pressure.x}
        y={LABEL.pressure.y}
        textAnchor="middle"
        fill={highAlarm ? "#dc2626" : STYLE.active}
        fontSize="20"
        fontWeight="700"
      >
        {pressure.toFixed(1)} bar
      </text>

      <text
        x={LABEL.setPoint.x}
        y={LABEL.setPoint.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="13"
      >
        Alarm Setpoint: {setPoint.toFixed(1)} bar
      </text>

      {highAlarm && (
        <text
          x={LABEL.alarm.x}
          y={LABEL.alarm.y}
          fill="#dc2626"
          fontSize="24"
          fontWeight="700"
        >
          HIGH PRESSURE ALARM
        </text>
      )}

      <text
        x={LABEL.transmitter.x}
        y={LABEL.transmitter.y}
        fontSize="13"
        fill="#475569"
      >
        {sensorType} Transmitter
      </text>

      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial process pressure measurement loop
      </text>

      <text
        x={LABEL.footerTwo.x}
        y={LABEL.footerTwo.y}
        fontSize="13"
        fill="#64748b"
      >
        Process Line → Diaphragm Sensor → Transmitter → PLC
      </text>
    </g>
  );
}

function PressureScene({
  power,
  sensorType,
  process,
  pressure,
  setPoint,
  highAlarm,
  current,
  voltage,
  percent,
}: {
  power: boolean;
  sensorType: SensorType;
  process: Process;
  pressure: number;
  setPoint: number;
  highAlarm: boolean;
  current: number;
  voltage: number;
  percent: number;
}) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-full w-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>

        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <ProcessPipe power={power} process={process} percent={percent} />
        <PressureTransmitter
          power={power}
          highAlarm={highAlarm}
          percent={percent}
        />
        <PressureGauge
          pressure={pressure}
          percent={percent}
          highAlarm={highAlarm}
        />
        <SignalCable power={power} highAlarm={highAlarm} />
        <PlcBlock current={current} voltage={voltage} />
        <SceneLabels
          pressure={pressure}
          setPoint={setPoint}
          highAlarm={highAlarm}
          sensorType={sensorType}
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

      <circle cx="78" cy="98" r="28" fill="#f8fafc" stroke="#334155" />
      <text x="62" y="104" fontSize="13" fontWeight="700">
        bar
      </text>

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
          color={outputOn ? STYLE.run : STYLE.wire}
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
          3-wire pressure sensor connection
        </text>
      </g>
    </svg>
  );
}

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
            Pressure Sensor Simulation
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
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-10 w-10 rounded-full ${
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

function LiveReadout({
  pressure,
  setPoint,
  highAlarm,
  current,
  voltage,
  percent,
  sensorType,
  outputMode,
  process,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>

      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read
          label="Pressure"
          value={`${pressure.toFixed(1)} bar`}
          green={!highAlarm}
          danger={highAlarm}
        />
        <Read label="Setpoint" value={`${setPoint.toFixed(1)} bar`} />
        <Read
          label="Alarm"
          value={highAlarm ? "HIGH" : "NORMAL"}
          danger={highAlarm}
          green={!highAlarm}
        />
        <Read label="Range %" value={`${percent.toFixed(0)}%`} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="Voltage" value={`${voltage.toFixed(2)} V`} />
        <Read label="Sensor Type" value={sensorType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Process" value={process} />
      </div>
    </div>
  );
}

function LearningTab({
  tab,
  sensorType,
  outputMode,
}: {
  tab: Tab;
  sensorType: SensorType;
  outputMode: OutputMode;
}) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Pressure Sensor Theory",
      points: [
        "Pressure sensors convert force from fluid or gas pressure into an electrical signal.",
        "Gauge pressure measures pressure relative to atmospheric pressure.",
        "Absolute pressure measures pressure relative to vacuum.",
        "Differential pressure measures the difference between two pressure points.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire carries analog or switching output.",
        "4–20mA and 0–10V outputs connect to PLC analog input.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is gauge pressure?",
        "Q2: Which output is common for industrial pressure transmitters?",
        "Q3: What does differential pressure measure?",
        "Q4: Why is 4–20mA preferred in long cable runs?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase pressure and observe 4–20mA / 0–10V scaling.",
        "Observe high pressure alarm when pressure crosses setpoint.",
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

export default function PressureSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Gauge Pressure");
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [process, setProcess] = useState<Process>("Hydraulic Line");
  const [setPoint, setSetPoint] = useState(6);
  const [pressure, setPressure] = useState(4.2);
  const [alarmCount, setAlarmCount] = useState(1);

  const maxPressure = getMaxPressure(sensorType);
  const percent = Math.min(100, Math.max(0, (pressure / maxPressure) * 100));
  const current = power ? 4 + (percent / 100) * 16 : 0;
  const voltage = power ? (percent / 100) * 10 : 0;
  const highAlarm = power && pressure >= setPoint;
  const outputOn =
    power &&
    (outputMode === "4-20mA" || outputMode === "0-10V"
      ? pressure > 0
      : highAlarm);

  function movePressure(value: number) {
    const next = Number(Math.max(0, Math.min(maxPressure, value)).toFixed(1));

    if (!highAlarm && power && next >= setPoint) {
      setAlarmCount((count) => count + 1);
    }

    setPressure(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Gauge Pressure");
    setOutputMode("4-20mA");
    setProcess("Hydraulic Line");
    setSetPoint(6);
    setPressure(4.2);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Pressure Sensor Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Pressure Alarm", "text-red-600"]
        : ["10:24:23", "Pressure Normal", "text-green-600"],
      [
        "10:24:18",
        `${current.toFixed(1)} mA / ${voltage.toFixed(2)} V`,
        "text-slate-900",
      ],
      ["LIVE", `${sensorType} / ${process}`, "text-blue-600"],
    ];
  }, [power, highAlarm, current, voltage, sensorType, process]);

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
                title="PRESSURE SENSOR CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Sensor Type">
                  <Select
                    value={sensorType}
                    onChange={(value: SensorType) => setSensorType(value)}
                  >
                    <option>Gauge Pressure</option>
                    <option>Absolute Pressure</option>
                    <option>Differential Pressure</option>
                  </Select>
                </Control>

                <Control label="Process">
                  <Select
                    value={process}
                    onChange={(value: Process) => setProcess(value)}
                  >
                    <option>Hydraulic Line</option>
                    <option>Air Compressor</option>
                    <option>Water Pipe</option>
                    <option>Filter DP</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select
                    value={outputMode}
                    onChange={(value: OutputMode) => setOutputMode(value)}
                  >
                    <option>4-20mA</option>
                    <option>0-10V</option>
                    <option>PNP Switch</option>
                    <option>NPN Switch</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint.toFixed(1)}</b>
                      <span>bar</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setSetPoint(Math.max(0.5, setPoint - 0.5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() =>
                        setSetPoint(Math.min(maxPressure, setPoint + 0.5))
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

              <Panel
                title="PRESSURE SENSOR STATUS"
                icon={<Activity size={20} />}
              >
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Alarm"
                  value={highAlarm ? "HIGH" : "NORMAL"}
                  badge={highAlarm}
                  danger={highAlarm}
                />
                <Status
                  label="Output"
                  value={outputOn ? "ACTIVE" : "OFF"}
                  badge={outputOn}
                />
                <Status
                  label="Pressure"
                  value={`${pressure.toFixed(1)} bar`}
                  distance
                />
                <Status label="Range" value={`0-${maxPressure} bar`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select gauge, absolute, or differential pressure.</li>
                  <li>2. Adjust pressure using the slider.</li>
                  <li>3. Observe diaphragm movement and signal output.</li>
                  <li>4. Compare analog and switch output behavior.</li>
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
                title="PRESSURE SENSOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <PressureScene
                    power={power}
                    sensorType={sensorType}
                    process={process}
                    pressure={pressure}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    current={current}
                    voltage={voltage}
                    percent={percent}
                  />

                  <LiveReadout
                    pressure={pressure}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    current={current}
                    voltage={voltage}
                    percent={percent}
                    sensorType={sensorType}
                    outputMode={outputMode}
                    process={process}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={maxPressure}
                      step={0.1}
                      value={pressure}
                      onChange={(event) =>
                        movePressure(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Low</span>
                      <span>Adjust process pressure</span>
                      <span>High</span>
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
                    <Lamp label="ALARM" on={highAlarm} danger />
                  </div>
                </Panel>

                <Panel
                  title="PRESSURE SENSOR CONNECTION"
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
                    High Pressure Count: <b>{alarmCount}</b>
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
