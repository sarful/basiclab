"use client";

import {
  Activity,
  ClipboardList,
  Cpu,
  Info,
  Monitor,
  Play,
  RotateCcw,
  Settings,
  Square,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC" | "Analog 4-20mA";
type TargetType = "Flat Plate" | "Box" | "Bottle" | "Foam" | "Liquid Level";
type Mode = "Distance Measurement" | "Object Detection" | "Tank Level";

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
  sensorBody: 1,
  sensorStand: 1,
  sensorBase: 1,
  target: 1,
  tank: 1,
} as const;

const WIRING_COMPONENT_SCALE = {
  sensorBody: 1,
} as const;

const BASE_WIRE_WIDTH = 4;
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
  sensor: "#94a3b8",
  metal: "#e5e7eb",
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
  baseRail: { x: 80, y: 420, width: 960, height: 42, rotate: 0 },
  sensorBody: { x: 120, y: 205, width: 155, height: 120, rotate: 0 },
  sensorStand: { x: 155, y: 325, width: 32, height: 85, rotate: 0 },
  sensorBase: { x: 115, y: 405, width: 115, height: 28, rotate: 0 },
  target: { x: 540, y: 220, width: 120, height: 120, rotate: 0 },
  tank: { x: 540, y: 190, width: 145, height: 185, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  baseRail: scaleComponent(
    BASE_COMPONENT.baseRail,
    CIRCUIT_COMPONENT_SCALE.baseRail,
  ),
  sensorBody: scaleComponent(
    BASE_COMPONENT.sensorBody,
    CIRCUIT_COMPONENT_SCALE.sensorBody,
  ),
  sensorStand: scaleComponent(
    BASE_COMPONENT.sensorStand,
    CIRCUIT_COMPONENT_SCALE.sensorStand,
  ),
  sensorBase: scaleComponent(
    BASE_COMPONENT.sensorBase,
    CIRCUIT_COMPONENT_SCALE.sensorBase,
  ),
  target: scaleComponent(BASE_COMPONENT.target, CIRCUIT_COMPONENT_SCALE.target),
  tank: scaleComponent(BASE_COMPONENT.tank, CIRCUIT_COMPONENT_SCALE.tank),
} as const;

const NODE = {
  railInnerStart: { x: 105, y: 435 },
  railInnerEnd: { x: 1015, y: 435 },

  sensorEmitter: { x: 245, y: 245 },
  sensorReceiver: { x: 245, y: 285 },
  sensorEchoCenter: { x: 250, y: 265 },

  powerLed: { x: 150, y: 230 },
  outputLed: { x: 172, y: 230 },

  rangeLineStart: { x: 250, y: 360 },
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  railInner: [NODE.railInnerStart, NODE.railInnerEnd],
} as const;

const PATH = {
  echoWave: (n: number) =>
    `M250 ${265 - n * 18} Q ${250 + n * 70} 265 250 ${265 + n * 18}`,
  validEchoLine: (targetX: number) => `M${targetX} 200 L250 265`,
} as const;

const LABEL = {
  validEcho: { x: 470, y: 150 },
  sensorTitle: { x: 120, y: 190 },
  rangeTextY: 352,
  targetTextY: 200,
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

const BASE_WIRING_COMPONENT = {
  sensorBody: { x: 25, y: 62, width: 105, height: 72, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const WIRING_COMPONENT = {
  sensorBody: scaleComponent(
    BASE_WIRING_COMPONENT.sensorBody,
    WIRING_COMPONENT_SCALE.sensorBody,
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

function UltrasonicScene({
  power,
  mode,
  targetType,
  distance,
  setRange,
  detected,
  outputOn,
  echoStrength,
  moveTarget,
}: any) {
  const targetX = 280 + distance * 5.8;
  const setRangeX = 250 + setRange * 5.8;
  const canvasTransform = buildCanvasScaleTransform(
    CIRCUIT_CANVAS_SCALE,
    VIEW_BOX_WIDTH,
    VIEW_BOX_HEIGHT,
  );

  function drag(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_BOX_WIDTH;
    moveTarget((x - 280) / 5.8);
  }

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(e) => e.buttons === 1 && drag(e)}
    >
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

        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={i}
            cx={125 + i * 46}
            cy="442"
            r="13"
            fill="#9ca3af"
            stroke="#64748b"
          />
        ))}

        <PanelBox
          component={COMPONENT.sensorBody}
          fill="url(#metal)"
          stroke="#111827"
          rx={18}
          filter="url(#shadow)"
        />

        <circle
          cx={NODE.sensorEmitter.x}
          cy={NODE.sensorEmitter.y}
          r="24"
          fill="#111827"
        />
        <circle
          cx={NODE.sensorEmitter.x}
          cy={NODE.sensorEmitter.y}
          r="14"
          fill="#64748b"
        />
        <circle
          cx={NODE.sensorReceiver.x}
          cy={NODE.sensorReceiver.y}
          r="24"
          fill="#111827"
        />
        <circle
          cx={NODE.sensorReceiver.x}
          cy={NODE.sensorReceiver.y}
          r="14"
          fill="#64748b"
        />

        <circle
          cx={NODE.powerLed.x}
          cy={NODE.powerLed.y}
          r="7"
          fill={power ? STYLE.active : STYLE.muted}
        />
        <circle
          cx={NODE.outputLed.x}
          cy={NODE.outputLed.y}
          r="7"
          fill={outputOn ? STYLE.active : STYLE.muted}
        />

        <PanelBox
          component={COMPONENT.sensorStand}
          fill="#9ca3af"
          stroke="#64748b"
          rx={0}
        />
        <PanelBox
          component={COMPONENT.sensorBase}
          fill="#d1d5db"
          stroke="#94a3b8"
          rx={6}
        />

        {[1, 2, 3, 4, 5].map((n) => (
          <path
            key={n}
            d={PATH.echoWave(n)}
            fill="none"
            stroke={STYLE.blue}
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity={power ? Math.max(0.15, echoStrength / 120) : 0.08}
          >
            {power && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-32"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}

        {detected && (
          <>
            <text
              x={LABEL.validEcho.x}
              y={LABEL.validEcho.y}
              fill={STYLE.active}
              fontSize="24"
              fontWeight="700"
            >
              VALID ECHO DETECTED
            </text>
            <path
              d={PATH.validEchoLine(targetX)}
              fill="none"
              stroke={STYLE.active}
              strokeWidth="3"
              strokeDasharray="10 8"
            />
          </>
        )}

        {mode === "Tank Level" ? (
          <g filter="url(#shadow)">
            <rect
              x={targetX}
              y="190"
              width="145"
              height="185"
              rx="12"
              fill="#e0f2fe"
              stroke="#0284c7"
            />
            <rect
              x={targetX + 10}
              y={235 + distance * 0.35}
              width="125"
              height={130 - distance * 0.35}
              fill="#38bdf8"
              opacity=".65"
            />
            <text x={targetX + 18} y="180" fontSize="13" fill="#475569">
              Liquid Level
            </text>
          </g>
        ) : (
          <g filter="url(#shadow)">
            <rect
              x={targetX}
              y={targetType === "Bottle" ? 200 : 220}
              width={targetType === "Bottle" ? 70 : 120}
              height={targetType === "Bottle" ? 155 : 120}
              rx={targetType === "Bottle" ? 26 : 10}
              fill={
                targetType === "Foam"
                  ? "#fef3c7"
                  : targetType === "Flat Plate"
                    ? "#cbd5e1"
                    : "#a3a3a3"
              }
              stroke={detected ? STYLE.active : "#475569"}
              strokeWidth={detected ? 4 : 2}
              opacity={targetType === "Bottle" ? 0.75 : 1}
            />
            <text
              x={targetX}
              y={LABEL.targetTextY}
              fontSize="13"
              fill="#475569"
            >
              {targetType}
            </text>
          </g>
        )}

        <line x1="250" y1="360" x2={setRangeX} y2="360" stroke="#9ca3af" />
        <polygon points="250,360 262,353 262,367" fill="#9ca3af" />
        <polygon
          points={`${setRangeX},360 ${setRangeX - 12},353 ${setRangeX - 12},367`}
          fill="#9ca3af"
        />
        <text
          x={250 + setRange * 2.9}
          y={LABEL.rangeTextY}
          textAnchor="middle"
          fill={STYLE.blue}
          fontSize="18"
          fontWeight="700"
        >
          Set Range {setRange} cm
        </text>

        <text
          x={LABEL.sensorTitle.x}
          y={LABEL.sensorTitle.y}
          fontSize="13"
          fill="#475569"
        >
          Ultrasonic Sensor Head
        </text>
        <text
          x={LABEL.footer1.x}
          y={LABEL.footer1.y}
          fontSize="13"
          fill="#475569"
        >
          Industrial ultrasonic distance / level sensing station
        </text>
        <text
          x={LABEL.footer2.x}
          y={LABEL.footer2.y}
          fontSize="13"
          fill={STYLE.muted}
        >
          Mode: {mode}
        </text>
      </g>
    </svg>
  );
}

function WiringSvg({ outputType, outputOn, analogCurrent }: any) {
  const analog = outputType === "Analog 4-20mA";
  const signalColor = outputOn ? STYLE.active : STYLE.wire;
  const canvasTransform = buildCanvasScaleTransform(
    WIRING_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <PanelBox
          component={WIRING_COMPONENT.sensorBody}
          fill={STYLE.sensor}
          stroke="#334155"
          rx={14}
        />

        <circle cx="112" cy="84" r="13" fill="#111827" />
        <circle cx="112" cy="112" r="13" fill="#111827" />
        <circle
          cx="55"
          cy="82"
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
          width={outputOn ? WIRING_WIRE.width : WIRING_WIRE.powerWidth}
        />
        <polygon points="410,88 426,95 410,102" fill={signalColor} />

        <WirePath
          points={WIRING_WIRE.blueWire}
          stroke={STYLE.blue}
          width={WIRING_WIRE.powerWidth}
        />
        <polygon points="410,149 426,155 410,161" fill={STYLE.blue} />

        {outputOn && (
          <circle r="5" fill={STYLE.active}>
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={WIRING_PATH.signalParticle}
            />
          </circle>
        )}

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
          {analog ? `${analogCurrent.toFixed(1)} mA` : "PLC Input"}
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
          3-wire ultrasonic sensor connection
        </text>
      </g>
    </svg>
  );
}

export default function UltrasonicSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [mode, setMode] = useState<Mode>("Distance Measurement");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [targetType, setTargetType] = useState<TargetType>("Flat Plate");
  const [setRange, setSetRange] = useState(80);
  const [distance, setDistance] = useState(45);
  const [detectCount, setDetectCount] = useState(8);

  const weakEcho = targetType === "Foam" || targetType === "Bottle";
  const echoStrength = clampValue(
    110 - distance * 1.15 - (weakEcho ? 25 : 0),
    0,
    100,
  );

  const detected = power && distance <= setRange && echoStrength > 18;
  const noMode = outputType.includes("NO");
  const analogMode = outputType === "Analog 4-20mA";
  const outputOn = power && (analogMode || (noMode ? detected : !detected));
  const analogCurrent = power
    ? 4 + Math.min(16, Math.max(0, (distance / 120) * 16))
    : 0;

  function moveTarget(v: number) {
    const next = Number(Math.max(10, Math.min(120, v)).toFixed(1));
    if (!detected && power && next <= setRange) setDetectCount((n) => n + 1);
    setDistance(next);
  }

  function reset() {
    setPower(false);
    setMode("Distance Measurement");
    setOutputType("PNP NO");
    setTargetType("Flat Plate");
    setSetRange(80);
    setDistance(45);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Ultrasonic Sensor Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Echo Received / Target Detected", "text-green-600"]
        : ["10:24:23", "No Valid Echo", "text-orange-500"],
      ["10:24:18", outputOn ? "Output Active" : "Output OFF", "text-slate-900"],
      ["LIVE", `${mode} / ${targetType}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, mode, targetType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} mode={mode} outputType={outputType} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel
                title="ULTRASONIC CONFIGURATION"
                icon={<Settings size={20} />}
              >
                <Control label="Mode">
                  <Select
                    value={mode}
                    onChange={(v: string) => setMode(v as Mode)}
                  >
                    <option>Distance Measurement</option>
                    <option>Object Detection</option>
                    <option>Tank Level</option>
                  </Select>
                </Control>

                <Control label="Set Range">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setRange}</b>
                      <span>cm</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setSetRange(Math.max(20, setRange - 5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setSetRange(Math.min(120, setRange + 5))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Output Type">
                  <Select
                    value={outputType}
                    onChange={(v: string) => setOutputType(v as OutputType)}
                  >
                    <option>PNP NO</option>
                    <option>PNP NC</option>
                    <option>NPN NO</option>
                    <option>NPN NC</option>
                    <option>Analog 4-20mA</option>
                  </Select>
                </Control>

                <Control label="Target Type">
                  <Select
                    value={targetType}
                    onChange={(v: string) => setTargetType(v as TargetType)}
                  >
                    <option>Flat Plate</option>
                    <option>Box</option>
                    <option>Bottle</option>
                    <option>Foam</option>
                    <option>Liquid Level</option>
                  </Select>
                </Control>

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="ULTRASONIC STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Echo Status"
                  value={detected ? "VALID" : "NO ECHO"}
                  badge={detected}
                />
                <Status
                  label="Output State"
                  value={outputOn ? "ON" : "OFF"}
                  badge={outputOn}
                />
                <Status
                  label="Distance"
                  value={`${distance.toFixed(1)} cm`}
                  distance
                />
                <Status
                  label="Echo Strength"
                  value={`${echoStrength.toFixed(0)}%`}
                />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select distance, object, or tank level mode.</li>
                  <li>2. Move the target and watch ultrasonic echo waves.</li>
                  <li>3. Compare flat, bottle, foam and liquid targets.</li>
                  <li>4. Observe digital output or 4–20mA analog signal.</li>
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
                title="ULTRASONIC SENSOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <UltrasonicScene
                    power={power}
                    mode={mode}
                    targetType={targetType}
                    distance={distance}
                    setRange={setRange}
                    detected={detected}
                    outputOn={outputOn}
                    echoStrength={echoStrength}
                    moveTarget={moveTarget}
                  />

                  <LiveReadout
                    distance={distance}
                    detected={detected}
                    outputOn={outputOn}
                    outputType={outputType}
                    mode={mode}
                    setRange={setRange}
                    echoStrength={echoStrength}
                    analogCurrent={analogCurrent}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={0.1}
                      value={distance}
                      onChange={(e) => moveTarget(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Near</span>
                      <span>Move target / simulate echo distance</span>
                      <span>Far</span>
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
                  title="ULTRASONIC CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    outputType={outputType}
                    outputOn={outputOn}
                    analogCurrent={analogCurrent}
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

/* Keep your existing Header, Panel, Control, Select, Status,
   LiveReadout, Read, Lamp, and LearningTab blocks from the uploaded file. */
