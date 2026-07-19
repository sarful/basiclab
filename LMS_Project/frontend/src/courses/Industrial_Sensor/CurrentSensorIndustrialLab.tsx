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
  | "Current Transformer CT"
  | "Hall Effect Current Sensor"
  | "Shunt Resistor"
  | "Rogowski Coil";
type OutputMode = "4-20mA" | "0-10V" | "Relay Alarm" | "PLC Analog Input";
type LoadType = "Motor Load" | "Heater Load" | "Lighting Load" | "DC Drive";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  loadBlock: 1,
  sensor: 1,
  gauge: 1,
  plc: 1,
  wiring: 1,
} as const;

const BASE_WIRE_WIDTH = 18;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  fault: "#ef4444",
  panel: "#f8fafc",
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

const BASE_COMPONENT = {
  base: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  loadBlock: { x: 110, y: 235, width: 210, height: 115, rotate: 0 },
  sensor: { x: 435, y: 205, width: 170, height: 170, rotate: 0 },
  gauge: { x: 695, y: 187, width: 210, height: 210, rotate: 0 },
  plc: { x: 910, y: 235, width: 150, height: 105, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  loadBlock: scaleComponent(
    BASE_COMPONENT.loadBlock,
    CIRCUIT_COMPONENT_SCALE.loadBlock,
  ),
  sensor: scaleComponent(BASE_COMPONENT.sensor, CIRCUIT_COMPONENT_SCALE.sensor),
  gauge: scaleComponent(BASE_COMPONENT.gauge, CIRCUIT_COMPONENT_SCALE.gauge),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
} as const;

const NODE = {
  loadCableStart: { x: 320, y: 292 },
  sensorCableEnd: { x: 490, y: 292 },
  sensorOutStart: { x: 610, y: 292 },
  plcCableEnd: { x: 850, y: 265 },
  sensorCenter: { x: 520, y: 292 },
  gaugeCenter: pointOnComponent(COMPONENT.gauge, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  loadToSensor:
    `M${NODE.loadCableStart.x} ${NODE.loadCableStart.y} ` +
    `C380 245 430 338 ${NODE.sensorCableEnd.x} ${NODE.sensorCableEnd.y}`,

  sensorToPlc:
    `M${NODE.sensorOutStart.x} ${NODE.sensorOutStart.y} ` +
    `C700 170 790 190 ${NODE.plcCableEnd.x} ${NODE.plcCableEnd.y}`,
} as const;

const PATH = {
  loadCurrent: WIRE.loadToSensor,
  signalCurrent: WIRE.sensorToPlc,
} as const;

const LABEL = {
  mainCurrent: { x: 290, y: 135 },
  setpoint: { x: 290, y: 170 },
  alarm: { x: 500, y: 150 },
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

function getMaxCurrent(loadType: LoadType) {
  return loadType === "DC Drive" ? 200 : 100;
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
            Current Sensor Simulation
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
      onChange={(e) => onChange(e.target.value)}
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

function LoadBlock({
  loadType,
  currentA,
  highAlarm,
}: {
  loadType: LoadType;
  currentA: number;
  highAlarm: boolean;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.loadBlock.x}
        y={COMPONENT.loadBlock.y}
        width={COMPONENT.loadBlock.width}
        height={COMPONENT.loadBlock.height}
        rx="18"
        fill="#f8fafc"
        stroke="#334155"
        filter="url(#shadow)"
      />
      <text x="145" y="270" fontSize="18" fontWeight="700" fill={STYLE.active}>
        LOAD
      </text>
      <text x="135" y="300" fontSize="14" fill="#475569">
        {loadType}
      </text>
      <text
        x="135"
        y="330"
        fontSize="22"
        fontWeight="700"
        fill={highAlarm ? "#dc2626" : "#111827"}
      >
        {currentA.toFixed(1)} A
      </text>
    </g>
  );
}

function LoadCable({
  power,
  currentA,
  highAlarm,
}: {
  power: boolean;
  currentA: number;
  highAlarm: boolean;
}) {
  return (
    <g>
      <path
        d={WIRE.loadToSensor}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />

      {power && currentA > 0 && (
        <circle r="5" fill={highAlarm ? STYLE.fault : STYLE.run}>
          <animateMotion
            dur="1.05s"
            repeatCount="indefinite"
            path={PATH.loadCurrent}
          />
        </circle>
      )}
    </g>
  );
}

function SensorBody({
  sensorType,
  power,
  percent,
}: {
  sensorType: SensorType;
  power: boolean;
  percent: number;
}) {
  const fieldOpacity = power ? Math.max(0.1, percent / 100) : 0.05;

  if (sensorType === "Current Transformer CT") {
    return (
      <g filter="url(#shadow)">
        <circle
          cx="520"
          cy="292"
          r="85"
          fill="url(#metal)"
          stroke="#111827"
          strokeWidth="6"
        />
        <circle
          cx="520"
          cy="292"
          r="48"
          fill="white"
          stroke="#94a3b8"
          strokeWidth="5"
        />
        <path
          d="M490 220 C540 250 545 335 490 365"
          fill="none"
          stroke="#2563eb"
          strokeWidth="5"
          strokeDasharray="8 6"
          opacity={fieldOpacity}
        />
        <path
          d="M550 220 C500 250 495 335 550 365"
          fill="none"
          stroke="#2563eb"
          strokeWidth="5"
          strokeDasharray="8 6"
          opacity={fieldOpacity}
        />
        <text x="462" y="190" fontSize="13" fill="#475569">
          Split-core CT
        </text>
      </g>
    );
  }

  if (sensorType === "Hall Effect Current Sensor") {
    return (
      <g filter="url(#shadow)">
        <rect
          x="455"
          y="215"
          width="145"
          height="150"
          rx="20"
          fill="url(#metal)"
          stroke="#111827"
        />
        <rect
          x="497"
          y="250"
          width="58"
          height="85"
          rx="12"
          fill="#f8fafc"
          stroke="#334155"
        />
        <circle
          cx="526"
          cy="292"
          r="14"
          fill="#2563eb"
          opacity={fieldOpacity}
        />
        <text x="445" y="195" fontSize="13" fill="#475569">
          Hall Current Sensor
        </text>
      </g>
    );
  }

  if (sensorType === "Shunt Resistor") {
    return (
      <g filter="url(#shadow)">
        <rect
          x="455"
          y="260"
          width="150"
          height="62"
          rx="14"
          fill="#f59e0b"
          stroke="#92400e"
        />
        <line
          x1="470"
          y1="291"
          x2="590"
          y2="291"
          stroke="#78350f"
          strokeWidth="8"
        />
        <text x="455" y="245" fontSize="13" fill="#475569">
          Precision Shunt
        </text>
      </g>
    );
  }

  return (
    <g filter="url(#shadow)">
      <ellipse
        cx="520"
        cy="292"
        rx="92"
        ry="72"
        fill="none"
        stroke="#2563eb"
        strokeWidth="16"
        strokeDasharray="14 8"
        opacity=".85"
      />
      <circle
        cx="520"
        cy="292"
        r="34"
        fill="white"
        stroke="#94a3b8"
        strokeWidth="4"
      />
      <text x="455" y="195" fontSize="13" fill="#475569">
        Flexible Rogowski Coil
      </text>
    </g>
  );
}

function SignalCable({
  power,
  currentA,
  highAlarm,
}: {
  power: boolean;
  currentA: number;
  highAlarm: boolean;
}) {
  return (
    <g>
      <path
        d={WIRE.sensorToPlc}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />

      {power && currentA > 0 && (
        <circle r="5" fill={highAlarm ? STYLE.fault : STYLE.run}>
          <animateMotion
            dur="1.25s"
            repeatCount="indefinite"
            path={PATH.signalCurrent}
          />
        </circle>
      )}
    </g>
  );
}

function AnalogGauge({
  currentA,
  percent,
  highAlarm,
}: {
  currentA: number;
  percent: number;
  highAlarm: boolean;
}) {
  const needleAngle = -130 + percent * 2.6;

  return (
    <g>
      <circle
        cx="800"
        cy="292"
        r="105"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="8"
        filter="url(#shadow)"
      />
      <circle cx="800" cy="292" r="76" fill="#ffffff" stroke="#cbd5e1" />

      {Array.from({ length: 11 }).map((_, index) => {
        const angle = ((-130 + index * 26) * Math.PI) / 180;

        return (
          <line
            key={`gauge-mark-${index}`}
            x1={800 + Math.cos(angle) * 70}
            y1={292 + Math.sin(angle) * 70}
            x2={800 + Math.cos(angle) * 88}
            y2={292 + Math.sin(angle) * 88}
            stroke="#475569"
            strokeWidth="3"
          />
        );
      })}

      <g transform={`rotate(${needleAngle} 800 292)`}>
        <line
          x1="800"
          y1="292"
          x2="872"
          y2="292"
          stroke={highAlarm ? STYLE.fault : STYLE.active}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      <circle cx="800" cy="292" r="8" fill="#111827" />

      <text
        x="770"
        y="337"
        fontSize="18"
        fontWeight="700"
        fill={highAlarm ? "#dc2626" : "#2563eb"}
      >
        {currentA.toFixed(1)} A
      </text>
    </g>
  );
}

function PlcBlock({
  outputMA,
  outputV,
}: {
  outputMA: number;
  outputV: number;
}) {
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
      <text x="940" y="265" fontSize="15" fontWeight="700" fill="#2563eb">
        PLC AI
      </text>
      <text x="935" y="292" fontSize="13" fill="#475569">
        {outputMA.toFixed(1)} mA
      </text>
      <text x="935" y="315" fontSize="13" fill="#475569">
        {outputV.toFixed(2)} V
      </text>
    </g>
  );
}

function SceneLabels({
  currentA,
  alarmSet,
  highAlarm,
}: {
  currentA: number;
  alarmSet: number;
  highAlarm: boolean;
}) {
  return (
    <g>
      <line x1="140" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text
        x={LABEL.mainCurrent.x}
        y={LABEL.mainCurrent.y}
        textAnchor="middle"
        fill={highAlarm ? "#dc2626" : "#2563eb"}
        fontSize="22"
        fontWeight="700"
      >
        {currentA.toFixed(1)} A
      </text>
      <text
        x={LABEL.setpoint.x}
        y={LABEL.setpoint.y}
        textAnchor="middle"
        fill="#111827"
        fontSize="13"
      >
        Alarm Setpoint: {alarmSet} A
      </text>

      {highAlarm && (
        <text
          x={LABEL.alarm.x}
          y={LABEL.alarm.y}
          fill="#dc2626"
          fontSize="24"
          fontWeight="700"
        >
          OVER CURRENT ALARM
        </text>
      )}

      <text
        x={LABEL.footer1.x}
        y={LABEL.footer1.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial current monitoring and motor protection station
      </text>
      <text
        x={LABEL.footer2.x}
        y={LABEL.footer2.y}
        fontSize="13"
        fill="#64748b"
      >
        Load Cable → Current Sensor → Transducer Output → PLC / Alarm
      </text>
    </g>
  );
}

function CurrentScene({
  power,
  sensorType,
  loadType,
  currentA,
  alarmSet,
  highAlarm,
  outputV,
  outputMA,
  percent,
}: any) {
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

        <LoadBlock
          loadType={loadType}
          currentA={currentA}
          highAlarm={highAlarm}
        />

        <LoadCable power={power} currentA={currentA} highAlarm={highAlarm} />

        <SensorBody sensorType={sensorType} power={power} percent={percent} />

        <SignalCable power={power} currentA={currentA} highAlarm={highAlarm} />

        <AnalogGauge
          currentA={currentA}
          percent={percent}
          highAlarm={highAlarm}
        />

        <PlcBlock outputMA={outputMA} outputV={outputV} />

        <SceneLabels
          currentA={currentA}
          alarmSet={alarmSet}
          highAlarm={highAlarm}
        />
      </g>
    </svg>
  );
}

function LiveReadout({
  currentA,
  alarmSet,
  highAlarm,
  outputV,
  outputMA,
  percent,
  sensorType,
  outputMode,
  loadType,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>

      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read
          label="Input Current"
          value={`${currentA.toFixed(1)} A`}
          green={!highAlarm}
          danger={highAlarm}
        />
        <Read label="Alarm Set" value={`${alarmSet} A`} />
        <Read
          label="Alarm"
          value={highAlarm ? "OVERCURRENT" : "NORMAL"}
          danger={highAlarm}
          green={!highAlarm}
        />
        <Read label="Range %" value={`${percent.toFixed(0)}%`} />
        <Read label="0-10V Output" value={`${outputV.toFixed(2)} V`} />
        <Read label="4-20mA Output" value={`${outputMA.toFixed(1)} mA`} />
        <Read label="Sensor Type" value={sensorType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Load Type" value={loadType} />
      </div>
    </div>
  );
}

const WIRING_VIEW_BOX = "0 0 620 190";

function WiringSvg({ outputMode, outputOn, outputMA, outputV }: any) {
  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <rect
        x="25"
        y="62"
        width="105"
        height="72"
        rx="14"
        fill="#94a3b8"
        stroke="#334155"
      />
      <circle cx="78" cy="98" r="30" fill="#f8fafc" stroke="#334155" />
      <text x="67" y="105" fontSize="18" fontWeight="700">
        A
      </text>
      <circle
        cx="110"
        cy="80"
        r="5"
        fill={outputOn ? STYLE.run : STYLE.muted}
      />

      <SensorWire
        y={35}
        color="#dc2626"
        label="Brown"
        end="+24 V DC"
        active={false}
      />
      <SensorWire
        y={95}
        color={outputOn ? "#16a34a" : "#111827"}
        label="Black / Signal"
        end={
          outputMode === "4-20mA"
            ? `${outputMA.toFixed(1)} mA`
            : outputMode === "0-10V"
              ? `${outputV.toFixed(2)} V`
              : outputMode === "Relay Alarm"
                ? "Relay Output"
                : "PLC Analog"
        }
        active={outputOn}
      />
      <SensorWire
        y={155}
        color="#2563eb"
        label="Blue"
        end="0 V DC"
        active={false}
      />

      <text x="35" y="175" fontSize="12" fill="#475569">
        3-wire current sensor / transducer connection
      </text>
    </svg>
  );
}

function SensorWire({
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
  active: boolean;
}) {
  const startPath =
    y === 35
      ? "M130 72 L175 35 L205 35"
      : y === 155
        ? "M130 118 L175 155 L205 155"
        : "M130 95 L205 95";

  return (
    <g>
      <path d={startPath} fill="none" stroke={color} strokeWidth="2" />
      <line
        x1="205"
        y1={y}
        x2="410"
        y2={y}
        stroke={color}
        strokeWidth={active ? 4 : 2}
      />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="215" y={y - 7} fontSize="14" fill={color}>
        {label}
      </text>
      <text x="450" y={y + 5} fontSize="14">
        {end}
      </text>

      {active && (
        <circle r="5" fill="#22c55e">
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={`M130 ${y} L410 ${y}`}
          />
        </circle>
      )}
    </g>
  );
}

function LearningTab({ tab, sensorType, outputMode }: any) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Current Sensor Theory",
      points: [
        "Current sensors measure AC or DC load current safely.",
        "CT sensors are common for AC current measurement.",
        "Hall effect sensors can measure AC and DC current.",
        "Shunt sensors measure current by voltage drop across a precision resistor.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Load cable passes through or connects across the current sensing element.",
        "Sensor supply commonly uses 24 V DC.",
        "Output can be 4–20mA, 0–10V, relay alarm, or PLC analog signal.",
        "Isolation improves safety between power circuit and control circuit.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which sensor is commonly used for AC current?",
        "Q2: Which current sensor can measure DC current?",
        "Q3: What is the purpose of overcurrent alarm?",
        "Q4: Why is isolation important in current measurement?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase load current and observe output scaling.",
        "Observe alarm behavior when current crosses setpoint.",
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

export default function CurrentSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>(
    "Current Transformer CT",
  );
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [loadType, setLoadType] = useState<LoadType>("Motor Load");
  const [alarmSet, setAlarmSet] = useState(60);
  const [currentA, setCurrentA] = useState(38);
  const [alarmCount, setAlarmCount] = useState(1);

  const maxCurrent = getMaxCurrent(loadType);
  const percent = Math.min(100, Math.max(0, (currentA / maxCurrent) * 100));
  const outputV = power ? (percent / 100) * 10 : 0;
  const outputMA = power ? 4 + (percent / 100) * 16 : 0;
  const highAlarm = power && currentA >= alarmSet;
  const outputOn =
    power && (outputMode === "Relay Alarm" ? highAlarm : currentA > 0);

  function updateCurrent(value: number) {
    const next = Number(Math.max(0, Math.min(maxCurrent, value)).toFixed(1));

    if (!highAlarm && power && next >= alarmSet) {
      setAlarmCount((count) => count + 1);
    }

    setCurrentA(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Current Transformer CT");
    setOutputMode("4-20mA");
    setLoadType("Motor Load");
    setAlarmSet(60);
    setCurrentA(38);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Current Sensor Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "Over Current Alarm", "text-red-600"]
        : ["10:24:23", "Current Normal", "text-green-600"],
      [
        "10:24:18",
        `${outputMA.toFixed(1)} mA / ${outputV.toFixed(2)} V`,
        "text-slate-900",
      ],
      ["LIVE", `${sensorType} / ${loadType}`, "text-blue-600"],
    ];
  }, [power, highAlarm, outputMA, outputV, sensorType, loadType]);

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
                title="CURRENT SENSOR CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Sensor Type">
                  <Select
                    value={sensorType}
                    onChange={(value: SensorType) => setSensorType(value)}
                  >
                    <option>Current Transformer CT</option>
                    <option>Hall Effect Current Sensor</option>
                    <option>Shunt Resistor</option>
                    <option>Rogowski Coil</option>
                  </Select>
                </Control>

                <Control label="Load Type">
                  <Select
                    value={loadType}
                    onChange={(value: LoadType) => setLoadType(value)}
                  >
                    <option>Motor Load</option>
                    <option>Heater Load</option>
                    <option>Lighting Load</option>
                    <option>DC Drive</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select
                    value={outputMode}
                    onChange={(value: OutputMode) => setOutputMode(value)}
                  >
                    <option>4-20mA</option>
                    <option>0-10V</option>
                    <option>Relay Alarm</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{alarmSet}</b>
                      <span>A</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setAlarmSet(Math.max(5, alarmSet - 5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() =>
                        setAlarmSet(Math.min(maxCurrent, alarmSet + 5))
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
                title="CURRENT SENSOR STATUS"
                icon={<Activity size={20} />}
              >
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Alarm"
                  value={highAlarm ? "OVERCURRENT" : "NORMAL"}
                  badge={highAlarm}
                  danger={highAlarm}
                />
                <Status
                  label="Output"
                  value={outputOn ? "ACTIVE" : "OFF"}
                  badge={outputOn}
                />
                <Status
                  label="Current"
                  value={`${currentA.toFixed(1)} A`}
                  distance
                />
                <Status label="Range" value={`0-${maxCurrent} A`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select CT, Hall, shunt, or Rogowski sensor.</li>
                  <li>2. Adjust load current using the slider.</li>
                  <li>
                    3. Observe magnetic field, burden/output and alarm state.
                  </li>
                  <li>4. Compare analog and relay alarm outputs.</li>
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
                title="CURRENT SENSOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <CurrentScene
                    power={power}
                    sensorType={sensorType}
                    loadType={loadType}
                    currentA={currentA}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    outputV={outputV}
                    outputMA={outputMA}
                    percent={percent}
                  />

                  <LiveReadout
                    currentA={currentA}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    outputV={outputV}
                    outputMA={outputMA}
                    percent={percent}
                    sensorType={sensorType}
                    outputMode={outputMode}
                    loadType={loadType}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={maxCurrent}
                      step={0.1}
                      value={currentA}
                      onChange={(event) =>
                        updateCurrent(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0A</span>
                      <span>Adjust load current</span>
                      <span>{maxCurrent}A</span>
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
                    <Lamp label="SIGNAL" on={power && currentA > 0} />
                    <Lamp label="ALARM" on={highAlarm} danger />
                  </div>
                </Panel>

                <Panel
                  title="CURRENT SENSOR CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    outputMode={outputMode}
                    outputOn={outputOn}
                    outputMA={outputMA}
                    outputV={outputV}
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
                    Overcurrent Count: <b>{alarmCount}</b>
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
