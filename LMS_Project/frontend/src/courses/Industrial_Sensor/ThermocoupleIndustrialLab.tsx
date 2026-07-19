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
import { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type TCType = "K Type" | "J Type" | "T Type" | "N Type";
type Process = "Furnace" | "Hot Water Tank" | "Steam Pipe" | "Ambient Air";
type OutputMode = "mV Signal" | "Transmitter 4-20mA" | "PLC Analog Input";

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
  furnace: 1,
  furnaceChamber: 1,
  probe: 1,
  transmitter: 1,
  plc: 1,
} as const;

const WIRING_COMPONENT_SCALE = {
  hotJunction: 1,
  transmitter: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  inactive: "#94a3b8",
  active: "#22c55e",
  danger: "#ef4444",
  hot: "#ef4444",
  orange: "#f97316",
  cold: "#2563eb",
  panel: "#f8fafc",
  metal: "#e5e7eb",
  dark: "#111827",
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

function clampValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  baseRail: {
    x: 70,
    y: 420,
    width: 980,
    height: 42,
    rotate: 0,
  },

  furnace: {
    x: 120,
    y: 205,
    width: 320,
    height: 185,
    rotate: 0,
  },

  furnaceChamber: {
    x: 145,
    y: 230,
    width: 270,
    height: 130,
    rotate: 0,
  },

  probe: {
    x: 385,
    y: 270,
    width: 295,
    height: 30,
    rotate: 0,
  },

  transmitter: {
    x: 685,
    y: 235,
    width: 145,
    height: 105,
    rotate: 0,
  },

  plc: {
    x: 890,
    y: 375,
    width: 150,
    height: 85,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  baseRail: scaleComponent(
    BASE_COMPONENT.baseRail,
    CIRCUIT_COMPONENT_SCALE.baseRail,
  ),
  furnace: scaleComponent(
    BASE_COMPONENT.furnace,
    CIRCUIT_COMPONENT_SCALE.furnace,
  ),
  furnaceChamber: scaleComponent(
    BASE_COMPONENT.furnaceChamber,
    CIRCUIT_COMPONENT_SCALE.furnaceChamber,
  ),
  probe: scaleComponent(BASE_COMPONENT.probe, CIRCUIT_COMPONENT_SCALE.probe),
  transmitter: scaleComponent(
    BASE_COMPONENT.transmitter,
    CIRCUIT_COMPONENT_SCALE.transmitter,
  ),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
} as const;

const NODE = {
  furnaceRailInner: { x: 105, y: 435 },
  furnaceFlameCenter: { x: 275, y: 300 },

  hotJunction: { x: 390, y: 285 },
  probeLeft: pointOnComponent(COMPONENT.probe, 0, 0.5),
  probeRight: pointOnComponent(COMPONENT.probe, 1, 0.5),

  transmitterInput: pointOnComponent(COMPONENT.transmitter, 0, 0.5),
  transmitterCenter: pointOnComponent(COMPONENT.transmitter, 0.5, 0.5),
  transmitterPowerLed: { x: 805, y: 260 },
  transmitterAlarmLed: { x: 805, y: 285 },

  plcCableStart: { x: 680, y: 285 },
  plcCableEnd: { x: 895, y: 410 },

  temperatureBarLeft: { x: 160, y: 145 },
  temperatureBarRight: { x: 440, y: 145 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  temperatureBar: [NODE.temperatureBarLeft, NODE.temperatureBarRight],
} as const;

const PATH = {
  primaryFlame:
    "M190 340 C170 300 220 285 205 245 C250 285 235 310 270 340 C260 290 310 265 300 230 C365 290 350 330 330 340 Z",

  secondaryFlame:
    "M220 340 C220 305 255 300 250 270 C295 305 295 325 285 340 Z",

  plcCable: "M680 285 C720 395 820 360 895 410",
} as const;

const LABEL = {
  process: { x: 150, y: 195 },
  probeTitle: { x: 470, y: 260 },
  hotJunction: { x: 355, y: 335 },

  transmitterTitle: { x: 710, y: 265 },
  mvSignal: { x: 715, y: 292 },
  current: { x: 715, y: 315 },

  plcTitle: { x: 925, y: 410 },
  plcSubTitle: { x: 915, y: 435 },

  temperature: { x: 300, y: 135 },
  setPoint: { x: 300, y: 170 },
  alarm: { x: 480, y: 150 },

  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

const BASE_WIRING_COMPONENT = {
  hotJunction: {
    x: 25,
    y: 65,
    width: 60,
    height: 60,
    rotate: 0,
  },

  transmitter: {
    x: 170,
    y: 58,
    width: 120,
    height: 82,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const WIRING_COMPONENT = {
  hotJunction: scaleComponent(
    BASE_WIRING_COMPONENT.hotJunction,
    WIRING_COMPONENT_SCALE.hotJunction,
  ),
  transmitter: scaleComponent(
    BASE_WIRING_COMPONENT.transmitter,
    WIRING_COMPONENT_SCALE.transmitter,
  ),
} as const;

const WIRING_NODE = {
  hotJunctionCenter: { x: 55, y: 95 },
  positiveLeadStart: { x: 55, y: 95 },
  positiveLeadEnd: { x: 155, y: 95 },
  negativeLeadStart: { x: 55, y: 112 },
  negativeLeadEnd: { x: 155, y: 112 },

  transmitterInput: { x: 170, y: 95 },
  transmitterOutput: { x: 290, y: 95 },

  signalStart: { x: 290, y: 95 },
  signalEnd: { x: 410, y: 95 },
  signalArrow: { x: 426, y: 95 },

  positivePowerStart: { x: 170, y: 35 },
  positivePowerEnd: { x: 426, y: 35 },
  zeroPowerStart: { x: 170, y: 155 },
  zeroPowerEnd: { x: 426, y: 155 },
} as const;

const WIRING_WIRE = {
  width: 5,
  signalWidth: 4,
  powerWidth: 2,

  positiveLead: [WIRING_NODE.positiveLeadStart, WIRING_NODE.positiveLeadEnd],
  negativeLead: [WIRING_NODE.negativeLeadStart, WIRING_NODE.negativeLeadEnd],
  signalOut: [WIRING_NODE.signalStart, WIRING_NODE.signalEnd],
  positivePower: [WIRING_NODE.positivePowerStart, WIRING_NODE.positivePowerEnd],
  zeroPower: [WIRING_NODE.zeroPowerStart, WIRING_NODE.zeroPowerEnd],
} as const;

const WIRING_PATH = {
  signalParticle: "M290 95 L410 95",
} as const;

const WIRING_LABEL = {
  hotJunction: { x: 25, y: 150 },
  tx: { x: 195, y: 90 },
  mvSignal: { x: 190, y: 116 },
  outputMode: { x: 315, y: 82 },
  outputValue: { x: 450, y: 100 },
  supply: { x: 450, y: 40 },
  zero: { x: 450, y: 160 },
  footer: { x: 35, y: 180 },
} as const;

function PanelBox({
  component,
  fill,
  stroke = "#94a3b8",
  rx = 16,
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
  width = WIRE.width,
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

function ThermocoupleScene({
  power,
  tcType,
  process,
  temperature,
  setPoint,
  highAlarm,
  mvSignal,
  current,
}: any) {
  const heat = clampValue(temperature / 600, 0, 1);
  const flameOpacity = power ? Math.max(0.15, heat) : 0.05;

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

        <linearGradient id="probe" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>

        <radialGradient id="hotGlow">
          <stop offset="0" stopColor={STYLE.hot} stopOpacity=".9" />
          <stop offset="1" stopColor={STYLE.hot} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={canvasTransform}>
        <PanelBox component={COMPONENT.baseRail} fill={STYLE.metal} rx={8} />
        <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

        <PanelBox
          component={COMPONENT.furnace}
          fill="#334155"
          stroke="#111827"
          rx={18}
          filter="url(#shadow)"
        />

        <PanelBox
          component={COMPONENT.furnaceChamber}
          fill={STYLE.dark}
          rx={12}
        />

        <path d={PATH.primaryFlame} fill={STYLE.hot} opacity={flameOpacity} />

        <path
          d={PATH.secondaryFlame}
          fill={STYLE.orange}
          opacity={flameOpacity}
        />

        <text
          x={LABEL.process.x}
          y={LABEL.process.y}
          fontSize="13"
          fill="#475569"
        >
          {process}
        </text>

        <rect
          x={COMPONENT.probe.x}
          y={COMPONENT.probe.y}
          width={COMPONENT.probe.width}
          height={COMPONENT.probe.height}
          rx="15"
          fill="url(#probe)"
          stroke="#334155"
          filter="url(#shadow)"
        />

        <circle
          cx={NODE.hotJunction.x}
          cy={NODE.hotJunction.y}
          r="32"
          fill="url(#hotGlow)"
          opacity={flameOpacity}
        />

        <circle
          cx={NODE.hotJunction.x}
          cy={NODE.hotJunction.y}
          r="8"
          fill={highAlarm ? STYLE.danger : STYLE.orange}
        />

        <text
          x={LABEL.probeTitle.x}
          y={LABEL.probeTitle.y}
          fontSize="13"
          fill="#475569"
        >
          {tcType} Metal Probe
        </text>

        <text
          x={LABEL.hotJunction.x}
          y={LABEL.hotJunction.y}
          fontSize="13"
          fill={STYLE.hot}
        >
          Hot Junction
        </text>

        <PanelBox
          component={COMPONENT.transmitter}
          fill={STYLE.panel}
          rx={16}
          filter="url(#shadow)"
        />

        <text
          x={LABEL.transmitterTitle.x}
          y={LABEL.transmitterTitle.y}
          fontSize="15"
          fontWeight="700"
          fill={STYLE.cold}
        >
          TRANSMITTER
        </text>

        <text
          x={LABEL.mvSignal.x}
          y={LABEL.mvSignal.y}
          fontSize="13"
          fill="#475569"
        >
          {mvSignal.toFixed(2)} mV
        </text>

        <text
          x={LABEL.current.x}
          y={LABEL.current.y}
          fontSize="13"
          fill="#475569"
        >
          {current.toFixed(1)} mA
        </text>

        <circle
          cx={NODE.transmitterPowerLed.x}
          cy={NODE.transmitterPowerLed.y}
          r="6"
          fill={power ? STYLE.active : STYLE.muted}
        />

        <circle
          cx={NODE.transmitterAlarmLed.x}
          cy={NODE.transmitterAlarmLed.y}
          r="6"
          fill={highAlarm ? STYLE.danger : STYLE.active}
        />

        <path
          d={PATH.plcCable}
          fill="none"
          stroke={STYLE.wire}
          strokeWidth="18"
          strokeLinecap="round"
        />

        <PanelBox
          component={COMPONENT.plc}
          fill={STYLE.metal}
          rx={16}
          filter="url(#shadow)"
        />

        <text
          x={LABEL.plcTitle.x}
          y={LABEL.plcTitle.y}
          fontSize="15"
          fontWeight="700"
          fill={STYLE.cold}
        >
          PLC AI
        </text>

        <text
          x={LABEL.plcSubTitle.x}
          y={LABEL.plcSubTitle.y}
          fontSize="13"
          fill="#475569"
        >
          Analog Input
        </text>

        {power && (
          <circle r="5" fill={highAlarm ? STYLE.danger : STYLE.active}>
            <animateMotion
              dur="1.3s"
              repeatCount="indefinite"
              path={PATH.plcCable}
            />
          </circle>
        )}

        <WirePath points={WIRE.temperatureBar} stroke="#9ca3af" width={1} />

        <text
          x={LABEL.temperature.x}
          y={LABEL.temperature.y}
          textAnchor="middle"
          fill={highAlarm ? "#dc2626" : STYLE.cold}
          fontSize="20"
          fontWeight="700"
        >
          {temperature.toFixed(0)}°C
        </text>

        <text
          x={LABEL.setPoint.x}
          y={LABEL.setPoint.y}
          textAnchor="middle"
          fill="#111"
          fontSize="13"
        >
          Alarm Setpoint: {setPoint}°C
        </text>

        {highAlarm && (
          <text
            x={LABEL.alarm.x}
            y={LABEL.alarm.y}
            fill="#dc2626"
            fontSize="24"
            fontWeight="700"
          >
            HIGH TEMPERATURE ALARM
          </text>
        )}

        <text
          x={LABEL.footer1.x}
          y={LABEL.footer1.y}
          fontSize="13"
          fill="#475569"
        >
          Industrial temperature measurement loop
        </text>

        <text
          x={LABEL.footer2.x}
          y={LABEL.footer2.y}
          fontSize="13"
          fill={STYLE.muted}
        >
          Thermocouple → Transmitter → PLC Analog Input
        </text>
      </g>
    </svg>
  );
}

function WiringSvg({ outputMode, mvSignal, current, highAlarm }: any) {
  const canvasTransform = buildCanvasScaleTransform(
    WIRING_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  const signalColor = highAlarm ? STYLE.danger : STYLE.active;
  const outputValue =
    outputMode === "mV Signal"
      ? `${mvSignal.toFixed(2)} mV`
      : `${current.toFixed(1)} mA`;

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <circle
          cx={WIRING_NODE.hotJunctionCenter.x}
          cy={WIRING_NODE.hotJunctionCenter.y}
          r="30"
          fill={STYLE.hot}
          opacity=".25"
        />

        <WirePath
          points={WIRING_WIRE.positiveLead}
          stroke={STYLE.hot}
          width={WIRING_WIRE.width}
        />

        <WirePath
          points={WIRING_WIRE.negativeLead}
          stroke={STYLE.cold}
          width={WIRING_WIRE.width}
        />

        <text
          x={WIRING_LABEL.hotJunction.x}
          y={WIRING_LABEL.hotJunction.y}
          fontSize="12"
          fill="#475569"
        >
          Hot Junction
        </text>

        <PanelBox
          component={WIRING_COMPONENT.transmitter}
          fill={STYLE.panel}
          rx={14}
        />

        <text
          x={WIRING_LABEL.tx.x}
          y={WIRING_LABEL.tx.y}
          fontSize="14"
          fontWeight="700"
        >
          TX
        </text>

        <text
          x={WIRING_LABEL.mvSignal.x}
          y={WIRING_LABEL.mvSignal.y}
          fontSize="12"
        >
          {mvSignal.toFixed(2)} mV
        </text>

        <WirePath
          points={WIRING_WIRE.signalOut}
          stroke={signalColor}
          width={WIRING_WIRE.signalWidth}
        />

        <polygon points="410,89 426,95 410,101" fill={signalColor} />

        <text
          x={WIRING_LABEL.outputMode.x}
          y={WIRING_LABEL.outputMode.y}
          fontSize="13"
        >
          {outputMode}
        </text>

        <text
          x={WIRING_LABEL.outputValue.x}
          y={WIRING_LABEL.outputValue.y}
          fontSize="14"
        >
          {outputValue}
        </text>

        <text x={WIRING_LABEL.supply.x} y={WIRING_LABEL.supply.y} fontSize="14">
          +24 V DC
        </text>

        <text x={WIRING_LABEL.zero.x} y={WIRING_LABEL.zero.y} fontSize="14">
          0 V DC
        </text>

        <WirePath
          points={WIRING_WIRE.positivePower}
          stroke="#dc2626"
          width={WIRING_WIRE.powerWidth}
        />

        <WirePath
          points={WIRING_WIRE.zeroPower}
          stroke={STYLE.cold}
          width={WIRING_WIRE.powerWidth}
        />

        <circle r="5" fill={signalColor}>
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={WIRING_PATH.signalParticle}
          />
        </circle>

        <text
          x={WIRING_LABEL.footer.x}
          y={WIRING_LABEL.footer.y}
          fontSize="12"
          fill="#475569"
        >
          Thermocouple temperature loop wiring
        </text>
      </g>
    </svg>
  );
}

export default function ThermocoupleIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [tcType, setTcType] = useState<TCType>("K Type");
  const [process, setProcess] = useState<Process>("Furnace");
  const [outputMode, setOutputMode] =
    useState<OutputMode>("Transmitter 4-20mA");
  const [setPoint, setSetPoint] = useState(250);
  const [temperature, setTemperature] = useState(185);
  const [alarmCount, setAlarmCount] = useState(2);

  const mvSignal = power ? temperature * 0.041 : 0;
  const current = power
    ? 4 + Math.min(16, Math.max(0, (temperature / 600) * 16))
    : 0;
  const highAlarm = power && temperature >= setPoint;
  const outputActive =
    power && (outputMode === "mV Signal" ? mvSignal > 0 : current > 4);

  function moveTemp(v: number) {
    const next = Number(Math.max(-50, Math.min(600, v)).toFixed(0));
    if (!highAlarm && power && next >= setPoint) setAlarmCount((n) => n + 1);
    setTemperature(next);
  }

  function reset() {
    setPower(false);
    setTcType("K Type");
    setProcess("Furnace");
    setOutputMode("Transmitter 4-20mA");
    setSetPoint(250);
    setTemperature(185);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Thermocouple Measurement Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Temperature Alarm", "text-red-600"]
        : ["10:24:23", "Temperature Normal", "text-green-600"],
      [
        "10:24:18",
        `${mvSignal.toFixed(2)} mV / ${current.toFixed(1)} mA`,
        "text-slate-900",
      ],
      ["LIVE", `${tcType} / ${process}`, "text-blue-600"],
    ];
  }, [power, highAlarm, mvSignal, current, tcType, process]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} tcType={tcType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="THERMOCOUPLE CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="TC Type">
                  <Select
                    value={tcType}
                    onChange={(v: string) => setTcType(v as TCType)}
                  >
                    <option>K Type</option>
                    <option>J Type</option>
                    <option>T Type</option>
                    <option>N Type</option>
                  </Select>
                </Control>

                <Control label="Process">
                  <Select
                    value={process}
                    onChange={(v: string) => setProcess(v as Process)}
                  >
                    <option>Furnace</option>
                    <option>Hot Water Tank</option>
                    <option>Steam Pipe</option>
                    <option>Ambient Air</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select
                    value={outputMode}
                    onChange={(v: string) => setOutputMode(v as OutputMode)}
                  >
                    <option>mV Signal</option>
                    <option>Transmitter 4-20mA</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint}</b>
                      <span>°C</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setSetPoint(Math.max(0, setPoint - 10))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setSetPoint(Math.min(600, setPoint + 10))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC Transmitter</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="THERMOCOUPLE STATUS" icon={<Activity size={20} />}>
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
                  value={outputActive ? "ACTIVE" : "OFF"}
                  badge={outputActive}
                />
                <Status
                  label="Temp"
                  value={`${temperature.toFixed(0)}°C`}
                  distance
                />
                <Status label="mV Signal" value={`${mvSignal.toFixed(2)} mV`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select thermocouple type and process area.</li>
                  <li>2. Adjust process temperature with slider.</li>
                  <li>
                    3. Observe hot junction, cold junction and signal output.
                  </li>
                  <li>4. Compare mV signal and 4–20mA transmitter output.</li>
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
                title="THERMOCOUPLE SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ThermocoupleScene
                    power={power}
                    tcType={tcType}
                    process={process}
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    mvSignal={mvSignal}
                    current={current}
                  />

                  <LiveReadout
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    mvSignal={mvSignal}
                    current={current}
                    tcType={tcType}
                    outputMode={outputMode}
                    process={process}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={-50}
                      max={600}
                      step={1}
                      value={temperature}
                      onChange={(e) => moveTemp(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Cold</span>
                      <span>Adjust process temperature</span>
                      <span>Hot</span>
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
                  title="THERMOCOUPLE CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    outputMode={outputMode}
                    mvSignal={mvSignal}
                    current={current}
                    highAlarm={highAlarm}
                  />
                </Panel>

                <Panel
                  title="EVENT LOG"
                  icon={<ClipboardList size={19} />}
                  className="md:col-span-2 xl:col-span-4"
                >
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, msg, color], i) => (
                      <div key={i} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{msg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    High Alarm Count: <b>{alarmCount}</b>
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
            Thermocouple Simulation
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

function LiveReadout({
  temperature,
  setPoint,
  highAlarm,
  mvSignal,
  current,
  tcType,
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
          label="Temperature"
          value={`${temperature.toFixed(0)}°C`}
          green={!highAlarm}
          danger={highAlarm}
        />
        <Read label="Setpoint" value={`${setPoint}°C`} />
        <Read
          label="Alarm"
          value={highAlarm ? "HIGH" : "NORMAL"}
          danger={highAlarm}
          green={!highAlarm}
        />
        <Read label="mV Signal" value={`${mvSignal.toFixed(2)} mV`} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="TC Type" value={tcType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Process" value={process} />
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

function LearningTab({ tab, tcType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Thermocouple Theory",
      points: [
        "A thermocouple generates a small voltage when two different metals form hot and cold junctions.",
        "The generated mV signal changes according to temperature difference.",
        "A transmitter converts weak mV signal into industrial 4–20mA signal.",
        "Thermocouples are commonly used in furnace, boiler, pipe and process temperature measurement.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Thermocouple positive and negative wires connect to transmitter input.",
        "The transmitter requires 24 V DC loop power.",
        "4–20mA output connects to PLC analog input.",
        "Correct polarity and compensation cable are important for accurate measurement.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is the hot junction?",
        "Q2: Why is a transmitter used with a thermocouple?",
        "Q3: What does 4–20mA represent?",
        "Q4: Why must thermocouple polarity be correct?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected thermocouple type: ${tcType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase temperature and observe mV and mA output.",
        "Observe alarm behavior when temperature crosses the setpoint.",
      ],
    },
  };

  const item = data[tab];

  return (
    <Panel title={tab.toUpperCase()} icon={item.icon}>
      <div className="min-h-[520px] rounded-xl bg-slate-50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-blue-600">{item.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {item.points.map((p, i) => (
            <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 font-bold text-slate-800">
                Learning Point {i + 1}
              </div>
              <p className="leading-7 text-slate-700">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
