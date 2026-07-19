"use client";

import {
  Activity,
  AlertTriangle,
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
type SensorType = "Inductive" | "Capacitive";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC";
type Material = "Steel" | "Aluminium" | "Plastic" | "Wood" | "Liquid";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  cable: 1,
  sensorBody: 1,
  sensorFace: 1,
  sensorStand: 1,
  target: 1,
  targetStand: 1,
  wiringSensor: 1,
} as const;

const BASE_WIRE_WIDTH = 34;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  warning: "#f97316",
  sensorMetal: "#94a3b8",
  steel: "#9ca3af",
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
  base: { x: 70, y: 430, width: 960, height: 32, rotate: 0 },
  cable: { x: 30, y: 205, width: 185, height: 125, rotate: 0 },
  sensorBody: { x: 215, y: 168, width: 235, height: 74, rotate: 0 },
  sensorFace: { x: 430, y: 177, width: 52, height: 58, rotate: 0 },
  sensorStand: { x: 292, y: 242, width: 140, height: 192, rotate: 0 },
  target: { x: 657, y: 155, width: 150, height: 185, rotate: 0 },
  targetStand: { x: 662, y: 340, width: 140, height: 115, rotate: 0 },
  wiringSensor: { x: 25, y: 72, width: 98, height: 56, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  cable: scaleComponent(BASE_COMPONENT.cable, CIRCUIT_COMPONENT_SCALE.cable),
  sensorBody: scaleComponent(
    BASE_COMPONENT.sensorBody,
    CIRCUIT_COMPONENT_SCALE.sensorBody,
  ),
  sensorFace: scaleComponent(
    BASE_COMPONENT.sensorFace,
    CIRCUIT_COMPONENT_SCALE.sensorFace,
  ),
  sensorStand: scaleComponent(
    BASE_COMPONENT.sensorStand,
    CIRCUIT_COMPONENT_SCALE.sensorStand,
  ),
  target: scaleComponent(BASE_COMPONENT.target, CIRCUIT_COMPONENT_SCALE.target),
  targetStand: scaleComponent(
    BASE_COMPONENT.targetStand,
    CIRCUIT_COMPONENT_SCALE.targetStand,
  ),
  wiringSensor: scaleComponent(
    BASE_COMPONENT.wiringSensor,
    CIRCUIT_COMPONENT_SCALE.wiringSensor,
  ),
} as const;

const NODE = {
  sensorFaceCenter: { x: 482, y: 205 },
  detectionLimit: { x: 570, y: 205 },
  rangeGuideStart: { x: 570, y: 350 },

  wiringBrownStart: { x: 123, y: 72 },
  wiringBrownMid: { x: 175, y: 35 },
  wiringBrownEnd: { x: 205, y: 35 },
  wiringSignalStart: { x: 123, y: 95 },
  wiringSignalEnd: { x: 410, y: 95 },
  wiringBlueStart: { x: 123, y: 116 },
  wiringBlueMid: { x: 175, y: 155 },
  wiringBlueEnd: { x: 205, y: 155 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  cablePath: "M30 330 C90 290 55 200 160 205",
  sensorLead: "M160 205 L215 205",

  wiringBrown: "M123 72 L175 35 L205 35 H410",
  wiringSignal: "M123 95 H410",
  wiringBlue: "M123 116 L175 155 L205 155 H410",
} as const;

const PATH = {
  wiringSignalMotion: "M123 95 L410 95",
} as const;

const LABEL = {
  detected: { x: 570, y: 120 },
  distance: { y: 344 },
  range: { y: 378 },
  target: { y: 145 },
  sensor: { x: 220, y: 135 },
  footerOne: { x: 80, y: 505 },

  wiringBrown: { x: 215, y: 30 },
  wiringSignal: { x: 215, y: 88 },
  wiringBlue: { x: 215, y: 148 },
  wiringBrownEnd: { x: 450, y: 40 },
  wiringSignalEnd: { x: 450, y: 100 },
  wiringBlueEnd: { x: 450, y: 160 },
  wiringFooter: { x: 35, y: 170 },
} as const;

function getTargetX(distance: number) {
  return 495 + distance * 27;
}

function getMaterialFill(material: Material) {
  if (material === "Steel") return "url(#block)";
  if (material === "Aluminium") return "#cbd5e1";
  if (material === "Plastic") return "#f97316";
  if (material === "Wood") return "#b45309";
  return "#38bdf8";
}

function isMaterialDetectable(sensorType: SensorType, material: Material) {
  return sensorType === "Inductive"
    ? material === "Steel" || material === "Aluminium"
    : true;
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
        stroke="#b8c0cc"
      />
      <rect x="90" y="445" width="920" height="8" rx="4" fill="#cbd5e1" />

      {Array.from({ length: 21 }).map((_, index) => (
        <line
          key={`base-line-${index}`}
          x1={120 + index * 42}
          y1="427"
          x2={120 + index * 42}
          y2="462"
          stroke="#9ca3af"
        />
      ))}
    </g>
  );
}

function SensorCable() {
  return (
    <g>
      <path
        d={WIRE.cablePath}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />
      <path
        d={WIRE.sensorLead}
        fill="none"
        stroke="#1f2937"
        strokeWidth="38"
        strokeLinecap="round"
      />
    </g>
  );
}

function SensorBody({ outputOn }: { outputOn: boolean }) {
  return (
    <g>
      <rect
        x={COMPONENT.sensorBody.x}
        y={COMPONENT.sensorBody.y}
        width={COMPONENT.sensorBody.width}
        height={COMPONENT.sensorBody.height}
        rx="35"
        fill="url(#body)"
        stroke="#111827"
        filter="url(#softShadow)"
      />

      {Array.from({ length: 46 }).map((_, index) => (
        <line
          key={`sensor-groove-${index}`}
          x1={235 + index * 4.3}
          y1="171"
          x2={231 + index * 4.3}
          y2="239"
          stroke="#f8fafc"
          strokeWidth="1.2"
          opacity=".9"
        />
      ))}

      <polygon
        points="205,145 246,145 263,265 222,265"
        fill="#9ca3af"
        stroke="#475569"
      />
      <polygon
        points="370,145 414,145 431,265 387,265"
        fill="#9ca3af"
        stroke="#475569"
      />

      <rect
        x={COMPONENT.sensorFace.x}
        y={COMPONENT.sensorFace.y}
        width={COMPONENT.sensorFace.width}
        height={COMPONENT.sensorFace.height}
        rx="9"
        fill="#111827"
      />

      <circle cx="350" cy="205" r="9" fill={outputOn ? "#39d353" : "#9ca3af"} />

      {outputOn && (
        <circle
          cx="350"
          cy="205"
          r="17"
          fill="none"
          stroke="#39d353"
          opacity=".55"
        />
      )}
    </g>
  );
}

function SensorMount() {
  return (
    <g>
      <rect
        x="348"
        y="242"
        width="22"
        height="165"
        fill="#a3a3a3"
        stroke="#737373"
      />
      <rect
        x="292"
        y="398"
        width="140"
        height="36"
        fill="#c0c0c0"
        stroke="#737373"
      />
      {[315, 350, 385, 420].map((x) => (
        <circle
          key={`mount-bolt-${x}`}
          cx={x}
          cy="416"
          r="8"
          fill="#777"
          stroke="#333"
        />
      ))}
    </g>
  );
}

function DetectionField({
  power,
  detected,
  targetX,
}: {
  power: boolean;
  detected: boolean;
  targetX: number;
}) {
  return (
    <g>
      <line
        x1={NODE.sensorFaceCenter.x}
        y1={NODE.sensorFaceCenter.y}
        x2={targetX}
        y2="176"
        stroke={STYLE.run}
        strokeWidth="2"
        strokeDasharray="8 8"
        opacity={power ? 1 : 0.2}
      />
      <line
        x1={NODE.sensorFaceCenter.x}
        y1={NODE.sensorFaceCenter.y}
        x2={targetX}
        y2="245"
        stroke={STYLE.run}
        strokeWidth="2"
        strokeDasharray="8 8"
        opacity={power ? 1 : 0.2}
      />

      <line
        x1={NODE.detectionLimit.x}
        y1="160"
        x2={NODE.detectionLimit.x}
        y2="345"
        stroke="#86efac"
        strokeDasharray="6 6"
      />

      {detected && (
        <>
          <circle
            cx={NODE.sensorFaceCenter.x}
            cy={NODE.sensorFaceCenter.y}
            r="18"
            fill="none"
            stroke={STYLE.run}
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              from="14"
              to="42"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from=".8"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>

          <text
            x={LABEL.detected.x}
            y={LABEL.detected.y}
            fill="#16a34a"
            fontSize="22"
            fontWeight="700"
          >
            TARGET DETECTED
          </text>
        </>
      )}
    </g>
  );
}

function DistanceGuide({
  targetX,
  distance,
  range,
}: {
  targetX: number;
  distance: number;
  range: number;
}) {
  const endX = targetX + 75;

  return (
    <g>
      <line
        x1={NODE.rangeGuideStart.x}
        y1="350"
        x2={endX}
        y2="350"
        stroke="#9ca3af"
      />
      <polygon points="570,350 582,343 582,357" fill="#9ca3af" />
      <polygon
        points={`${endX},350 ${endX - 12},343 ${endX - 12},357`}
        fill="#9ca3af"
      />
      <line x1={endX} y1="315" x2={endX} y2="370" stroke="#9ca3af" />

      <text
        x={(570 + endX) / 2}
        y={LABEL.distance.y}
        textAnchor="middle"
        fill="#16a34a"
        fontSize="20"
        fontWeight="700"
      >
        {distance.toFixed(1)} mm
      </text>

      <text
        x={(570 + endX) / 2}
        y={LABEL.range.y}
        textAnchor="middle"
        fill="#111827"
        fontSize="13"
      >
        Sensing Distance: {range} mm
      </text>
    </g>
  );
}

function TargetBlock({
  targetX,
  material,
  detected,
}: {
  targetX: number;
  material: Material;
  detected: boolean;
}) {
  return (
    <g>
      <rect
        x={targetX}
        y="155"
        width="150"
        height="185"
        rx="12"
        fill={getMaterialFill(material)}
        stroke={detected ? "#16a34a" : "#555"}
        strokeWidth={detected ? 5 : 2}
        filter="url(#softShadow)"
      />

      <rect
        x={targetX + 12}
        y="168"
        width="126"
        height="158"
        rx="8"
        fill={material === "Liquid" ? "#7dd3fc" : "#b8b8b8"}
        opacity={material === "Liquid" ? 0.5 : 0.9}
      />

      <rect
        x={targetX + 40}
        y="340"
        width="70"
        height="88"
        fill="#a3a3a3"
        stroke="#737373"
      />
      <rect
        x={targetX + 5}
        y="425"
        width="140"
        height="30"
        rx="6"
        fill="#d1d5db"
        stroke="#94a3b8"
      />

      <text x={targetX + 10} y={LABEL.target.y} fontSize="13" fill="#475569">
        {material} Target
      </text>
    </g>
  );
}

function SceneLabels({ sensorType }: { sensorType: SensorType }) {
  return (
    <g>
      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial linear guide rail
      </text>

      <text x={LABEL.sensor.x} y={LABEL.sensor.y} fontSize="13" fill="#475569">
        {sensorType} Proximity Sensor
      </text>
    </g>
  );
}

function IndustrialScene({
  power,
  distance,
  range,
  detected,
  outputOn,
  sensorType,
  material,
  setDistance,
}: {
  power: boolean;
  distance: number;
  range: number;
  detected: boolean;
  outputOn: boolean;
  sensorType: SensorType;
  material: Material;
  setDistance: (value: number) => void;
}) {
  const targetX = getTargetX(distance);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  function drag(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_BOX_WIDTH;
    setDistance((x - 495) / 27);
  }

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(event) => event.buttons === 1 && drag(event)}
    >
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset=".18" stopColor="#f8fafc" />
          <stop offset=".32" stopColor="#6b7280" />
          <stop offset=".55" stopColor="#f1f5f9" />
          <stop offset=".78" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>

        <linearGradient id="block" x1="0" x2="1">
          <stop offset="0" stopColor="#707070" />
          <stop offset=".5" stopColor="#c7c7c7" />
          <stop offset="1" stopColor="#777777" />
        </linearGradient>

        <filter id="softShadow">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodOpacity=".22" />
        </filter>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <SensorCable />
        <SensorBody outputOn={outputOn} />
        <SensorMount />
        <DetectionField power={power} detected={detected} targetX={targetX} />
        <DistanceGuide targetX={targetX} distance={distance} range={range} />
        <TargetBlock
          targetX={targetX}
          material={material}
          detected={detected}
        />
        <SceneLabels sensorType={sensorType} />
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
        rx="20"
        fill="#aaaaaa"
        stroke="#555555"
      />

      {Array.from({ length: 13 }).map((_, index) => (
        <line
          key={`wiring-groove-${index}`}
          x1={45 + index * 4.5}
          y1="74"
          x2={45 + index * 4.5}
          y2="112"
          stroke="#eeeeee"
        />
      ))}

      <rect
        x="105"
        y="58"
        width="18"
        height="70"
        fill="#bbbbbb"
        stroke="#555555"
      />
      <rect x="12" y="84" width="22" height="18" fill="#222222" />

      <circle
        cx="105"
        cy="95"
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
          labelPosition={{ x: LABEL.wiringBrown.x, y: LABEL.wiringBrown.y }}
          end="+24 V DC"
          endPosition={{ x: LABEL.wiringBrownEnd.x, y: LABEL.wiringBrownEnd.y }}
          arrowPoints="410,29 426,35 410,41"
        />

        <WiringLine
          d={WIRE.wiringSignal}
          color={outputOn ? STYLE.run : STYLE.wire}
          label="Black"
          labelPosition={{ x: LABEL.wiringSignal.x, y: LABEL.wiringSignal.y }}
          end="PLC Input / Load"
          endPosition={{
            x: LABEL.wiringSignalEnd.x,
            y: LABEL.wiringSignalEnd.y,
          }}
          active={outputOn}
          arrowPoints="410,88 426,95 410,102"
        />

        <WiringLine
          d={WIRE.wiringBlue}
          color={STYLE.active}
          label="Blue"
          labelPosition={{ x: LABEL.wiringBlue.x, y: LABEL.wiringBlue.y }}
          end="0 V DC"
          endPosition={{ x: LABEL.wiringBlueEnd.x, y: LABEL.wiringBlueEnd.y }}
          arrowPoints="410,149 426,155 410,161"
        />

        <text
          x={LABEL.wiringFooter.x}
          y={LABEL.wiringFooter.y}
          fontSize="12"
          fill="#475569"
        >
          3-wire {pnp ? "PNP sourcing" : "NPN sinking"} sensor wiring
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
            Proximity Sensor Simulation
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

function Status({ label, value, dot, badge, distance }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_110px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${
          badge ? "bg-green-600 font-semibold text-white" : ""
        } ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
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
          className={`h-10 w-10 rounded-full ${
            on ? "bg-green-500 shadow-[0_0_20px_#22c55e]" : "bg-slate-300"
          }`}
        />
      </div>
    </div>
  );
}

function LiveReadout({
  distance,
  detected,
  outputOn,
  sensorType,
  outputType,
  range,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[230px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[285px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>

      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Distance" value={`${distance.toFixed(1)} mm`} green />
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
        <Read label="Sensor" value={sensorType} />
        <Read label="Output" value={outputType} />
        <Read label="Detection Zone" value={`${range} mm`} />
      </div>
    </div>
  );
}

function LearningTab({
  tab,
  sensorType,
  outputType,
}: {
  tab: Tab;
  sensorType: SensorType;
  outputType: OutputType;
}) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Proximity Sensor Theory",
      points: [
        "Inductive sensors detect metal objects using an electromagnetic field.",
        "Capacitive sensors detect metal and non-metal objects by capacitance change.",
        "NO output turns ON when the target is detected.",
        "NC output stays ON normally and turns OFF when the target is detected.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire is the output signal wire.",
        "PNP output sources positive voltage; NPN output sinks to 0 V.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which sensor is best for metal target detection?",
        "Q2: What does NO mean in sensor output?",
        "Q3: What is the function of the black wire?",
        "Q4: Which sensor can detect liquid or plastic objects?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output type: ${outputType}`,
        "Recommended training activity: test different materials and compare output state.",
        "Observe how sensing distance affects detection reliability.",
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
              <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                <AlertTriangle size={18} className="text-blue-600" />
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

export default function ProximitySensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Inductive");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [material, setMaterial] = useState<Material>("Steel");
  const [range, setRange] = useState(10);
  const [distance, setDistance] = useState(6.2);
  const [detectCount, setDetectCount] = useState(7);

  const materialOk = isMaterialDetectable(sensorType, material);
  const detected = power && materialOk && distance <= range;
  const noMode = outputType.includes("NO");
  const outputOn = power && (noMode ? detected : !detected);
  const pnpMode = outputType.includes("PNP");

  function setDistanceSafe(value: number) {
    const next = Number(Math.max(1, Math.min(18, value)).toFixed(1));

    if (!detected && power && materialOk && next <= range) {
      setDetectCount((count) => count + 1);
    }

    setDistance(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Inductive");
    setOutputType("PNP NO");
    setMaterial("Steel");
    setRange(10);
    setDistance(6.2);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Simulation Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Target Entered Range", "text-green-600"]
        : ["10:24:23", "Target Exited Range", "text-orange-500"],
      ["10:24:18", outputOn ? "Output ON" : "Output OFF", "text-slate-900"],
      ["LIVE", `${sensorType} / ${material}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, sensorType, material]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            sensorType={sensorType}
            outputType={outputType}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Sensor Type">
                  <Select
                    value={sensorType}
                    onChange={(value: SensorType) => setSensorType(value)}
                  >
                    <option>Inductive</option>
                    <option>Capacitive</option>
                  </Select>
                </Control>

                <Control label="Sensing Distance">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{range}</b>
                      <span>mm</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setRange(Math.max(1, range - 1))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setRange(Math.min(30, range + 1))}
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

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>

                <Control label="Target Material">
                  <Select
                    value={material}
                    onChange={(value: Material) => setMaterial(value)}
                  >
                    <option>Steel</option>
                    <option>Aluminium</option>
                    <option>Plastic</option>
                    <option>Wood</option>
                    <option>Liquid</option>
                  </Select>
                </Control>
              </Panel>

              <Panel title="SENSOR STATUS" icon={<Activity size={20} />}>
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
                  label="Distance"
                  value={`${distance.toFixed(1)} mm`}
                  distance
                />
                <Status label="Mode" value={pnpMode ? "PNP" : "NPN"} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select sensor type and output mode.</li>
                  <li>2. Drag target block or use slider.</li>
                  <li>3. Watch sensor LED, output wire and lamps.</li>
                  <li>4. Compare inductive vs capacitive detection.</li>
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
              <Panel title="SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <IndustrialScene
                    power={power}
                    distance={distance}
                    range={range}
                    detected={detected}
                    outputOn={outputOn}
                    sensorType={sensorType}
                    material={material}
                    setDistance={setDistanceSafe}
                  />

                  <LiveReadout
                    distance={distance}
                    detected={detected}
                    outputOn={outputOn}
                    sensorType={sensorType}
                    outputType={outputType}
                    range={range}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={1}
                      max={18}
                      step={0.1}
                      value={distance}
                      onChange={(event) =>
                        setDistanceSafe(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Near</span>
                      <span>Drag target / adjust distance</span>
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
                  title="SENSOR CONNECTION"
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
