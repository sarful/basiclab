"use client";

import { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type SensorType =
  | "AC Voltage Sensor"
  | "DC Voltage Sensor"
  | "Voltage Transducer"
  | "Isolated Voltage Sensor";
type OutputMode = "0-10V" | "4-20mA" | "Relay Alarm" | "PLC Analog Input";
type SourceType =
  | "Single Phase AC"
  | "Three Phase AC"
  | "DC Bus"
  | "Battery Bank";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;
const WIRING_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  baseRail: 1,
  source: 1,
  transducer: 1,
  meter: 1,
  plc: 1,
} as const;

const WIRING_COMPONENT_SCALE = {
  sensor: 1,
} as const;

const BASE_WIRE_WIDTH = 18;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  inactive: "#94a3b8",
  active: "#22c55e",
  danger: "#ef4444",
  blue: "#2563eb",
  brown: "#dc2626",
  metal: "#e5e7eb",
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

function buildCanvasScaleTransform(
  scale: number,
  width: number,
  height: number,
) {
  if (scale === 1) return undefined;

  const centerX = width / 2;
  const centerY = height / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  baseRail: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  source: { x: 110, y: 210, width: 210, height: 150, rotate: 0 },
  transducer: { x: 500, y: 215, width: 165, height: 145, rotate: 0 },
  meter: { x: 695, y: 180, width: 210, height: 210, rotate: 0 },
  plc: { x: 900, y: 230, width: 150, height: 105, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  baseRail: scaleComponent(
    BASE_COMPONENT.baseRail,
    CIRCUIT_COMPONENT_SCALE.baseRail,
  ),
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  transducer: scaleComponent(
    BASE_COMPONENT.transducer,
    CIRCUIT_COMPONENT_SCALE.transducer,
  ),
  meter: scaleComponent(BASE_COMPONENT.meter, CIRCUIT_COMPONENT_SCALE.meter),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
} as const;

const NODE = {
  railInnerStart: { x: 105, y: 435 },
  railInnerEnd: { x: 1015, y: 435 },

  sourceOut: pointOnComponent(COMPONENT.source, 1, 0.5),
  transducerIn: pointOnComponent(COMPONENT.transducer, 0, 0.48),
  transducerOut: pointOnComponent(COMPONENT.transducer, 1, 0.48),

  meterCenter: { x: 800, y: 285 },
  meterNeedleEnd: { x: 872, y: 285 },

  plcIn: pointOnComponent(COMPONENT.plc, 0, 0.5),

  sourceLed: { x: 535, y: 320 },
  alarmLed: { x: 560, y: 320 },

  voltageBarStart: { x: 140, y: 145 },
  voltageBarEnd: { x: 440, y: 145 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  railInner: [NODE.railInnerStart, NODE.railInnerEnd],
  voltageBar: [NODE.voltageBarStart, NODE.voltageBarEnd],
} as const;

const PATH = {
  sourceToTransducer: "M320 285 C390 240 430 330 500 285",
  transducerToMeter: "M665 285 C735 185 805 185 860 260",
} as const;

const LABEL = {
  sourceTitle: { x: 145, y: 245 },
  sourceType: { x: 135, y: 280 },
  sourceVoltage: { x: 135, y: 315 },

  transducer1: { x: 530, y: 250 },
  transducer2: { x: 525, y: 272 },

  meterValue: { x: 770, y: 330 },

  plcTitle: { x: 930, y: 260 },
  plcVoltage: { x: 925, y: 287 },
  plcCurrent: { x: 925, y: 310 },

  topVoltage: { x: 290, y: 135 },
  alarmSet: { x: 290, y: 170 },
  alarmText: { x: 500, y: 150 },

  sensorType: { x: 500, y: 198 },
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

const BASE_WIRING_COMPONENT = {
  sensor: { x: 25, y: 62, width: 105, height: 72, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const WIRING_COMPONENT = {
  sensor: scaleComponent(
    BASE_WIRING_COMPONENT.sensor,
    WIRING_COMPONENT_SCALE.sensor,
  ),
} as const;

const WIRING_NODE = {
  brownStart: { x: 130, y: 72 },
  brownElbow: { x: 175, y: 35 },
  brownMid: { x: 205, y: 35 },
  brownEnd: { x: 410, y: 35 },

  signalStart: { x: 130, y: 95 },
  signalEnd: { x: 410, y: 95 },

  blueStart: { x: 130, y: 118 },
  blueElbow: { x: 175, y: 155 },
  blueMid: { x: 205, y: 155 },
  blueEnd: { x: 410, y: 155 },
} as const;

const WIRING_WIRE = {
  width: 4,
  inactiveWidth: 2,
  powerWidth: 2,
  brownWire: [
    WIRING_NODE.brownStart,
    WIRING_NODE.brownElbow,
    WIRING_NODE.brownMid,
    WIRING_NODE.brownEnd,
  ],
  signalWire: [WIRING_NODE.signalStart, WIRING_NODE.signalEnd],
  blueWire: [
    WIRING_NODE.blueStart,
    WIRING_NODE.blueElbow,
    WIRING_NODE.blueMid,
    WIRING_NODE.blueEnd,
  ],
} as const;

const WIRING_PATH = {
  signalParticle: "M130 95 L410 95",
} as const;

const WIRING_LABEL = {
  sensorV: { x: 52, y: 105 },
  brown: { x: 215, y: 30 },
  signal: { x: 215, y: 88 },
  blue: { x: 215, y: 148 },
  plus24: { x: 450, y: 40 },
  output: { x: 450, y: 100 },
  zero: { x: 450, y: 160 },
  footer: { x: 35, y: 175 },
} as const;

function PanelBox({
  component,
  fill,
  stroke = "#94a3b8",
  rx = 14,
  filter,
}: {
  component: ComponentBox;
  fill: string;
  stroke?: string;
  rx?: number;
  filter?: string;
}) {
  return (
    <rect
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rx={rx}
      fill={fill}
      stroke={stroke}
      filter={filter}
    />
  );
}

function WirePath({
  points,
  stroke = STYLE.wire,
  width = 3,
  opacity = 1,
}: {
  points: readonly Point[];
  stroke?: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

function SignalParticle({
  active,
  path,
  danger,
  duration = "1.2s",
}: {
  active: boolean;
  path: string;
  danger?: boolean;
  duration?: string;
}) {
  if (!active) return null;

  return (
    <circle r="5" fill={danger ? STYLE.danger : STYLE.active}>
      <animateMotion dur={duration} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function VoltageScene({
  power,
  sensorType,
  sourceType,
  voltage,
  alarmSet,
  highAlarm,
  outputV,
  current,
  percent,
}: any) {
  const needleAngle = -130 + percent * 2.6;
  const canvasTransform = buildCanvasScaleTransform(
    CIRCUIT_CANVAS_SCALE,
    VIEW_BOX_WIDTH,
    VIEW_BOX_HEIGHT,
  );

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
        <PanelBox component={COMPONENT.baseRail} fill={STYLE.metal} rx={8} />
        <WirePath points={WIRE.railInner} stroke="#cbd5e1" width={10} />

        <PanelBox
          component={COMPONENT.source}
          fill={STYLE.panel}
          stroke="#334155"
          rx={18}
          filter="url(#shadow)"
        />

        <text
          x={LABEL.sourceTitle.x}
          y={LABEL.sourceTitle.y}
          fontSize="18"
          fontWeight="700"
          fill={STYLE.blue}
        >
          SOURCE
        </text>
        <text
          x={LABEL.sourceType.x}
          y={LABEL.sourceType.y}
          fontSize="14"
          fill="#475569"
        >
          {sourceType}
        </text>
        <text
          x={LABEL.sourceVoltage.x}
          y={LABEL.sourceVoltage.y}
          fontSize="24"
          fontWeight="700"
          fill={highAlarm ? "#dc2626" : STYLE.text}
        >
          {voltage} V
        </text>

        <path
          d={PATH.sourceToTransducer}
          fill="none"
          stroke={STYLE.wire}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
        />
        <SignalParticle
          active={power}
          path={PATH.sourceToTransducer}
          danger={highAlarm}
          duration="1.1s"
        />

        <PanelBox
          component={COMPONENT.transducer}
          fill="url(#metal)"
          stroke="#111827"
          rx={18}
          filter="url(#shadow)"
        />

        <text
          x={LABEL.transducer1.x}
          y={LABEL.transducer1.y}
          fontSize="16"
          fontWeight="700"
          fill={STYLE.text}
        >
          VOLTAGE
        </text>
        <text
          x={LABEL.transducer2.x}
          y={LABEL.transducer2.y}
          fontSize="16"
          fontWeight="700"
          fill={STYLE.text}
        >
          TRANSDUCER
        </text>

        <circle
          cx={NODE.sourceLed.x}
          cy={NODE.sourceLed.y}
          r="7"
          fill={power ? STYLE.active : STYLE.muted}
        />
        <circle
          cx={NODE.alarmLed.x}
          cy={NODE.alarmLed.y}
          r="7"
          fill={highAlarm ? STYLE.danger : STYLE.active}
        />

        <path
          d={PATH.transducerToMeter}
          fill="none"
          stroke={STYLE.wire}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
        />
        <SignalParticle
          active={power}
          path={PATH.transducerToMeter}
          danger={highAlarm}
          duration="1.25s"
        />

        <circle
          cx={NODE.meterCenter.x}
          cy={NODE.meterCenter.y}
          r="105"
          fill={STYLE.panel}
          stroke="#334155"
          strokeWidth="8"
          filter="url(#shadow)"
        />
        <circle
          cx={NODE.meterCenter.x}
          cy={NODE.meterCenter.y}
          r="76"
          fill="#ffffff"
          stroke="#cbd5e1"
        />

        {Array.from({ length: 11 }).map((_, i) => {
          const a = ((-130 + i * 26) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={NODE.meterCenter.x + Math.cos(a) * 70}
              y1={NODE.meterCenter.y + Math.sin(a) * 70}
              x2={NODE.meterCenter.x + Math.cos(a) * 88}
              y2={NODE.meterCenter.y + Math.sin(a) * 88}
              stroke="#475569"
              strokeWidth="3"
            />
          );
        })}

        <g
          transform={`rotate(${needleAngle} ${NODE.meterCenter.x} ${NODE.meterCenter.y})`}
        >
          <line
            x1={NODE.meterCenter.x}
            y1={NODE.meterCenter.y}
            x2={NODE.meterNeedleEnd.x}
            y2={NODE.meterNeedleEnd.y}
            stroke={highAlarm ? STYLE.danger : STYLE.blue}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        <circle
          cx={NODE.meterCenter.x}
          cy={NODE.meterCenter.y}
          r="8"
          fill={STYLE.text}
        />

        <text
          x={LABEL.meterValue.x}
          y={LABEL.meterValue.y}
          fontSize="18"
          fontWeight="700"
          fill={highAlarm ? "#dc2626" : STYLE.blue}
        >
          {voltage} V
        </text>

        <PanelBox
          component={COMPONENT.plc}
          fill={STYLE.panel}
          rx={16}
          filter="url(#shadow)"
        />

        <text
          x={LABEL.plcTitle.x}
          y={LABEL.plcTitle.y}
          fontSize="15"
          fontWeight="700"
          fill={STYLE.blue}
        >
          PLC AI
        </text>
        <text
          x={LABEL.plcVoltage.x}
          y={LABEL.plcVoltage.y}
          fontSize="13"
          fill="#475569"
        >
          {outputV.toFixed(2)} V
        </text>
        <text
          x={LABEL.plcCurrent.x}
          y={LABEL.plcCurrent.y}
          fontSize="13"
          fill="#475569"
        >
          {current.toFixed(1)} mA
        </text>

        <WirePath points={WIRE.voltageBar} stroke="#9ca3af" width={1} />

        <text
          x={LABEL.topVoltage.x}
          y={LABEL.topVoltage.y}
          textAnchor="middle"
          fill={highAlarm ? "#dc2626" : STYLE.blue}
          fontSize="22"
          fontWeight="700"
        >
          {voltage} V
        </text>

        <text
          x={LABEL.alarmSet.x}
          y={LABEL.alarmSet.y}
          textAnchor="middle"
          fill="#111"
          fontSize="13"
        >
          Alarm Setpoint: {alarmSet} V
        </text>

        {highAlarm && (
          <text
            x={LABEL.alarmText.x}
            y={LABEL.alarmText.y}
            fill="#dc2626"
            fontSize="24"
            fontWeight="700"
          >
            OVER VOLTAGE ALARM
          </text>
        )}

        <text
          x={LABEL.sensorType.x}
          y={LABEL.sensorType.y}
          fontSize="13"
          fill="#475569"
        >
          {sensorType}
        </text>
        <text
          x={LABEL.footer1.x}
          y={LABEL.footer1.y}
          fontSize="13"
          fill="#475569"
        >
          Industrial voltage monitoring and isolation station
        </text>
        <text
          x={LABEL.footer2.x}
          y={LABEL.footer2.y}
          fontSize="13"
          fill={STYLE.muted}
        >
          Voltage Source → Isolated Transducer → PLC Analog / Alarm Output
        </text>
      </g>
    </svg>
  );
}

function WiringSvg({ outputMode, outputOn, current, outputV }: any) {
  const canvasTransform = buildCanvasScaleTransform(
    WIRING_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  const signalColor = outputOn ? STYLE.active : STYLE.wire;
  const signalWidth = outputOn ? WIRING_WIRE.width : WIRING_WIRE.inactiveWidth;

  const outputText =
    outputMode === "4-20mA"
      ? `${current.toFixed(1)} mA`
      : outputMode === "0-10V"
        ? `${outputV.toFixed(2)} V`
        : outputMode === "Relay Alarm"
          ? "Relay Output"
          : "PLC Analog";

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <PanelBox
          component={WIRING_COMPONENT.sensor}
          fill="#94a3b8"
          stroke="#334155"
          rx={14}
        />

        <text
          x={WIRING_LABEL.sensorV.x}
          y={WIRING_LABEL.sensorV.y}
          fontSize="18"
          fontWeight="700"
          fill="white"
        >
          V
        </text>

        <circle
          cx="110"
          cy="80"
          r="5"
          fill={outputOn ? STYLE.active : STYLE.muted}
        />

        <WirePath
          points={WIRING_WIRE.brownWire}
          stroke={STYLE.brown}
          width={WIRING_WIRE.powerWidth}
        />
        <polygon points="410,29 426,35 410,41" fill={STYLE.brown} />

        <WirePath
          points={WIRING_WIRE.signalWire}
          stroke={signalColor}
          width={signalWidth}
        />
        <polygon points="410,88 426,95 410,102" fill={signalColor} />

        <WirePath
          points={WIRING_WIRE.blueWire}
          stroke={STYLE.blue}
          width={WIRING_WIRE.powerWidth}
        />
        <polygon points="410,149 426,155 410,161" fill={STYLE.blue} />

        <SignalParticle active={outputOn} path={WIRING_PATH.signalParticle} />

        <text
          x={WIRING_LABEL.brown.x}
          y={WIRING_LABEL.brown.y}
          fontSize="14"
          fill="#7f1d1d"
        >
          Brown
        </text>
        <text x={WIRING_LABEL.signal.x} y={WIRING_LABEL.signal.y} fontSize="14">
          Black / Signal
        </text>
        <text
          x={WIRING_LABEL.blue.x}
          y={WIRING_LABEL.blue.y}
          fontSize="14"
          fill={STYLE.blue}
        >
          Blue
        </text>

        <text x={WIRING_LABEL.plus24.x} y={WIRING_LABEL.plus24.y} fontSize="14">
          +24 V DC
        </text>
        <text x={WIRING_LABEL.output.x} y={WIRING_LABEL.output.y} fontSize="14">
          {outputText}
        </text>
        <text x={WIRING_LABEL.zero.x} y={WIRING_LABEL.zero.y} fontSize="14">
          0 V DC
        </text>

        <text
          x={WIRING_LABEL.footer.x}
          y={WIRING_LABEL.footer.y}
          fontSize="12"
          fill="#475569"
        >
          3-wire isolated voltage sensor connection
        </text>
      </g>
    </svg>
  );
}

/* Main component + shared UI blocks remain same as your uploaded file */
export default function VoltageSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] =
    useState<SensorType>("Voltage Transducer");
  const [sourceType, setSourceType] = useState<SourceType>("Single Phase AC");
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [voltage, setVoltage] = useState(220);
  const [alarmSet, setAlarmSet] = useState(240);
  const [alarmCount, setAlarmCount] = useState(1);

  const maxVoltage =
    sourceType === "DC Bus" ? 600 : sourceType === "Battery Bank" ? 120 : 440;

  const percent = Math.min(100, Math.max(0, (voltage / maxVoltage) * 100));
  const outputV = power ? (percent / 100) * 10 : 0;
  const current = power ? 4 + (percent / 100) * 16 : 0;
  const highAlarm = power && voltage >= alarmSet;
  const outputOn =
    power && (outputMode === "Relay Alarm" ? highAlarm : voltage > 0);

  function updateVoltage(v: number) {
    const next = Number(Math.max(0, Math.min(maxVoltage, v)).toFixed(0));
    if (!highAlarm && power && next >= alarmSet) setAlarmCount((n) => n + 1);
    setVoltage(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Voltage Transducer");
    setSourceType("Single Phase AC");
    setOutputMode("4-20mA");
    setVoltage(220);
    setAlarmSet(240);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Voltage Sensor Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "Over Voltage Alarm", "text-red-600"]
        : ["10:24:23", "Voltage Normal", "text-green-600"],
      [
        "10:24:18",
        `${outputV.toFixed(2)} V / ${current.toFixed(1)} mA`,
        "text-slate-900",
      ],
      ["LIVE", `${sensorType} / ${sourceType}`, "text-blue-600"],
    ];
  }, [power, highAlarm, outputV, current, sensorType, sourceType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      {/* Keep your original JSX layout here; VoltageScene and WiringSvg are rebuilt above */}
    </main>
  );
}
