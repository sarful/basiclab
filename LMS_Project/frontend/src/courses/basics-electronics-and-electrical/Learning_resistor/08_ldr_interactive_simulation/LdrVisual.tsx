"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { clamp, formatNumber, formatResistance } from "./logic";

type LdrVisualProps = {
  lightPercent: number;
  resistance: number;
  voltage: number;
  fixedResistor: number;
};

const VIEW_BOX = "0 0 780 390";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 390;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  sun: 1,
  battery: 1,
  ldr: 1,
  lamp: 1,
  sunlightBar: 1,
  resistanceBar: 1,
  outputBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  muted: "#64748b",
  wire: "#64748b",
  activeWire: "#22c55e",
  battery: "#0f172a",
  sunlight: "#eab308",
  photon: "#fde047",
  ldrBody: "#fde68a",
  current: "#22c55e",
  output: "#8b5cf6",
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
  sun: { x: 138, y: 78, width: 80, height: 80, rotate: 0 },
  battery: { x: 55, y: 209, width: 92, height: 92, rotate: 0 },
  ldr: { x: 316, y: 126, width: 98, height: 98, rotate: 0 },
  lamp: { x: 665, y: 100, width: 90, height: 130, rotate: 0 },
  sunlightBar: { x: 110, y: 367, width: 160, height: 9, rotate: 0 },
  resistanceBar: { x: 310, y: 367, width: 160, height: 9, rotate: 0 },
  outputBar: { x: 510, y: 367, width: 160, height: 9, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  sun: scaleComponent(BASE_COMPONENT.sun, CIRCUIT_COMPONENT_SCALE.sun),
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  ldr: scaleComponent(BASE_COMPONENT.ldr, CIRCUIT_COMPONENT_SCALE.ldr),
  lamp: scaleComponent(BASE_COMPONENT.lamp, CIRCUIT_COMPONENT_SCALE.lamp),
  sunlightBar: scaleComponent(
    BASE_COMPONENT.sunlightBar,
    CIRCUIT_COMPONENT_SCALE.sunlightBar,
  ),
  resistanceBar: scaleComponent(
    BASE_COMPONENT.resistanceBar,
    CIRCUIT_COMPONENT_SCALE.resistanceBar,
  ),
  outputBar: scaleComponent(
    BASE_COMPONENT.outputBar,
    CIRCUIT_COMPONENT_SCALE.outputBar,
  ),
} as const;

const NODE = {
  mainY: 175,
  bottomY: 305,

  batteryCenter: pointOnComponent(COMPONENT.battery, 0.445, 0.5),
  batteryPositive: { x: 96, y: 225 },
  batteryNegative: { x: 96, y: 298 },
  batteryPositivePost: { x: 97, y: 207 },

  ldrCenter: { x: 365, y: 175 },
  ldrLeft: { x: 310, y: 175 },
  ldrRight: { x: 420, y: 175 },

  lampCenter: { x: 710, y: 145 },
  lampInput: { x: 630, y: 175 },
  lampReturn: { x: 630, y: 305 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  topWire: [
    NODE.batteryPositivePost,
    { x: NODE.batteryPositivePost.x, y: NODE.mainY },
    NODE.ldrLeft,
  ],

  returnWire: [
    NODE.ldrRight,
    NODE.lampInput,
    NODE.lampReturn,
    { x: NODE.batteryCenter.x, y: NODE.bottomY },
    NODE.batteryNegative,
  ],
} as const;

const PATH = {
  current: pathD([
    NODE.batteryPositivePost,
    { x: NODE.batteryPositivePost.x, y: NODE.mainY },
    NODE.ldrLeft,
    { x: 328, y: NODE.mainY },
    { x: 402, y: NODE.mainY },
    NODE.ldrRight,
    NODE.lampInput,
    NODE.lampReturn,
    { x: NODE.batteryCenter.x, y: NODE.bottomY },
    NODE.batteryNegative,
  ]),

  ldrTrack: `M331 ${NODE.mainY - 22}
    C345 ${NODE.mainY - 38} 385 ${NODE.mainY - 38} 399 ${NODE.mainY - 22}
    C385 ${NODE.mainY - 6} 345 ${NODE.mainY - 6} 331 ${NODE.mainY - 22}
    M331 ${NODE.mainY}
    C347 ${NODE.mainY - 18} 383 ${NODE.mainY + 18} 399 ${NODE.mainY}
    M337 ${NODE.mainY + 20}
    C349 ${NODE.mainY + 32} 381 ${NODE.mainY + 32} 393 ${NODE.mainY + 20}`,
} as const;

const LABEL = {
  title: { x: 390, y: 28 },
  subtitle: { x: 390, y: 48 },
  current: { x: 205, y: NODE.mainY - 25 },
  output: { x: 565, y: NODE.mainY - 25 },
  summary: { x: 390, y: 330 },
} as const;

const PHOTON_RAYS = [
  { x1: 245, y1: 58, x2: 330, y2: 145, delay: 0 },
  { x1: 300, y1: 42, x2: 355, y2: 135, delay: 0.18 },
  { x1: 365, y1: 42, x2: 370, y2: 135, delay: 0.36 },
  { x1: 430, y1: 58, x2: 400, y2: 145, delay: 0.54 },
] as const;

function WirePath({
  points,
  wireWidth,
}: {
  points: readonly Point[];
  wireWidth: number;
}) {
  return (
    <>
      <path
        d={pathD(points)}
        stroke={STYLE.wire}
        strokeWidth={wireWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={pathD(points)}
        stroke={STYLE.activeWire}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </>
  );
}

function SunBlock({ lightLevel }: { lightLevel: number }) {
  return (
    <motion.g
      transform={`translate(${COMPONENT.sun.x} ${COMPONENT.sun.y})`}
      opacity={0.35 + lightLevel * 0.65}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * 30 * Math.PI) / 180;

        return (
          <line
            key={`sun-ray-${index}`}
            x1={Math.cos(angle) * 30}
            y1={Math.sin(angle) * 30}
            x2={Math.cos(angle) * (45 + lightLevel * 10)}
            y2={Math.sin(angle) * (45 + lightLevel * 10)}
            stroke="#f59e0b"
            strokeWidth={2 + lightLevel * 2}
            strokeLinecap="round"
          />
        );
      })}

      <circle
        cx="0"
        cy="0"
        r={24 + lightLevel * 6}
        fill="url(#ldrSunGradient)"
        stroke="#ea580c"
        strokeWidth="3"
      />
    </motion.g>
  );
}

function PhotonBeams({ lightLevel }: { lightLevel: number }) {
  return (
    <motion.g
      opacity={0.35 + lightLevel * 0.65}
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
    >
      {PHOTON_RAYS.map((ray, index) => (
        <g key={`photon-ray-${index}`}>
          <line
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            stroke={STYLE.sunlight}
            strokeWidth={3 + lightLevel * 4}
            strokeLinecap="round"
          />
          <motion.circle
            r="4"
            fill={STYLE.photon}
            stroke="#facc15"
            strokeWidth="1"
            initial={{ cx: ray.x1, cy: ray.y1, opacity: 0 }}
            animate={{
              cx: [ray.x1, ray.x2],
              cy: [ray.y1, ray.y2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: ray.delay,
              ease: "linear",
            }}
          />
        </g>
      ))}
    </motion.g>
  );
}

function BatteryBlock({ voltage }: { voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.battery.x}
        y={COMPONENT.battery.y}
        width={COMPONENT.battery.width}
        height={COMPONENT.battery.height}
        rx="14"
        fill={STYLE.battery}
        stroke="#94a3b8"
        strokeWidth="3"
      />
      <text
        x="96"
        y="225"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="900"
      >
        +
      </text>
      <text
        x="96"
        y="256"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="16"
        fontWeight="900"
      >
        DC
      </text>
      <text
        x="96"
        y="279"
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="14"
        fontWeight="900"
      >
        {formatNumber(voltage, 1)}V
      </text>
      <text
        x="96"
        y="298"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

function LdrSymbol({
  lightLevel,
  resistance,
}: {
  lightLevel: number;
  resistance: number;
}) {
  return (
    <motion.g
      animate={{ scale: lightLevel > 0.8 ? [1, 1.025, 1] : 1 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle
        cx={NODE.ldrCenter.x}
        cy={NODE.ldrCenter.y}
        r="49"
        fill={STYLE.ldrBody}
        stroke="#111827"
        strokeWidth="5"
      />

      <circle
        cx={NODE.ldrCenter.x}
        cy={NODE.ldrCenter.y}
        r="39"
        fill="url(#ldrFaceGradientExact)"
        stroke="#a16207"
        strokeWidth="4"
      />

      <path
        d={PATH.ldrTrack}
        stroke="#111827"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <motion.circle
        cx={NODE.ldrCenter.x}
        cy={NODE.ldrCenter.y}
        r={24 + lightLevel * 8}
        fill="#fde047"
        opacity={0.08 + lightLevel * 0.22}
        animate={{ opacity: [0.1, 0.32, 0.1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {Array.from({ length: 8 }).map((_, index) => (
        <motion.circle
          key={`ldr-carrier-${index}`}
          cx={338 + index * 8}
          cy={index % 2 === 0 ? NODE.mainY - 9 : NODE.mainY + 11}
          r={2 + lightLevel}
          fill="#e0f2fe"
          stroke="#0ea5e9"
          strokeWidth="1"
          opacity={0.2 + lightLevel * 0.65}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}

      <text
        x={NODE.ldrCenter.x}
        y={NODE.mainY + 66}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        LDR R = {formatResistance(resistance)}
      </text>
    </motion.g>
  );
}

function CurrentParticles({
  particles,
  particleCount,
  currentSpeed,
}: {
  particles: number[];
  particleCount: number;
  currentSpeed: number;
}) {
  return (
    <g>
      {particles.map((index) => (
        <motion.circle
          key={`ldr-current-${particleCount}-${index}`}
          r="4"
          fill={STYLE.current}
          stroke="#dcfce7"
          strokeWidth="1.5"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: currentSpeed,
            repeat: Infinity,
            ease: "linear",
            delay: index * (currentSpeed / particleCount),
          }}
          style={{ offsetPath: `path('${PATH.current}')` }}
        />
      ))}
    </g>
  );
}

function DirectionArrows({ flowLevel }: { flowLevel: number }) {
  return (
    <motion.g
      opacity={0.45 + flowLevel * 0.45}
      animate={{ x: [0, 12, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    >
      <path
        d={`M184 ${NODE.mainY - 9} L198 ${NODE.mainY} L184 ${NODE.mainY + 9}`}
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M500 ${NODE.mainY - 9} L514 ${NODE.mainY} L500 ${NODE.mainY + 9}`}
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M615 ${NODE.mainY + 76} L630 ${NODE.mainY + 90} L615 ${NODE.mainY + 104}`}
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.g>
  );
}

function OutputLamp({
  lampBrightness,
  lampStatus,
}: {
  lampBrightness: number;
  lampStatus: string;
}) {
  return (
    <g transform={`translate(${COMPONENT.lamp.x} ${COMPONENT.lamp.y})`}>
      <circle
        cx="45"
        cy="45"
        r="38"
        fill={`rgba(250,204,21,${0.1 + lampBrightness * 0.85})`}
        stroke="#ca8a04"
        strokeWidth={3 + lampBrightness * 4}
      />
      <path
        d="M30 45 H60 M36 30 L54 60 M54 30 L36 60"
        stroke="#a16207"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="45"
        y="95"
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="12"
        fontWeight="900"
      >
        Output Lamp
      </text>
      <text
        x="45"
        y="113"
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="10"
        fontWeight="800"
      >
        {lampStatus}
      </text>
    </g>
  );
}

function LevelBar({
  component,
  title,
  value,
  color,
}: {
  component: ComponentBox;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <g transform={`translate(${component.x} ${component.y - 12})`}>
      <text x="0" y="0" fill={STYLE.text} fontSize="12" fontWeight="900">
        {title}
      </text>
      <rect
        x="0"
        y="12"
        width={component.width}
        height={component.height}
        rx="5"
        fill="#e2e8f0"
      />
      <motion.rect
        x="0"
        y="12"
        height={component.height}
        rx="5"
        fill={color}
        animate={{ width: component.width * value }}
        transition={{ duration: 0.3 }}
      />
    </g>
  );
}

export function LdrVisual({
  lightPercent,
  resistance,
  voltage,
  fixedResistor,
}: LdrVisualProps) {
  const safeLight = clamp(lightPercent, 0, 100);
  const lightLevel = safeLight / 100;

  const safeResistance = Math.max(resistance, 1);
  const safeFixedResistor = Math.max(fixedResistor, 1);
  const safeVoltage = Math.max(voltage, 0);

  const totalResistance = safeResistance + safeFixedResistor;
  const current = safeVoltage / totalResistance;
  const outputVoltage = safeVoltage * (safeResistance / totalResistance);

  const flowLevel = clamp(current / 0.01, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 20), 5), 24);
  const currentSpeed = Math.max(0.55, 2.4 - flowLevel * 1.5);

  const resistanceDropLevel = clamp(1 - safeResistance / 100000, 0, 1);
  const outputLevel = clamp(outputVoltage / Math.max(safeVoltage, 1), 0, 1);

  const lampBrightness = safeLight < 25 ? 0.08 : safeLight < 70 ? 0.35 : 0.9;
  const lampStatus = safeLight < 25 ? "OFF" : safeLight < 70 ? "DIM" : "BRIGHT";

  const lightStatus =
    safeLight >= 70
      ? "BRIGHT SUNLIGHT"
      : safeLight >= 30
        ? "MEDIUM LIGHT"
        : "DARK / LOW LIGHT";

  const wireWidth = WIRE.width + flowLevel * 4;

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            LDR Behavior Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Increase light intensity and watch LDR resistance decrease in real
            time.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            safeLight >= 70
              ? "bg-yellow-100 text-yellow-700"
              : safeLight >= 30
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {lightStatus}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-sky-50 via-white to-slate-50 p-3">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="LDR circuit showing sunlight, conventional current, resistance change, and output lamp"
        >
          <defs>
            <radialGradient id="ldrSunGradient" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>

            <radialGradient id="ldrFaceGradientExact" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="55%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
          </defs>

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="14"
              fontWeight="900"
            >
              LDR: Light ↑ → Resistance ↓ → Current ↑
            </text>

            <text
              x={LABEL.subtitle.x}
              y={LABEL.subtitle.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="11"
              fontWeight="600"
            >
              Photons hit the LDR surface and create more charge carriers.
            </text>

            <SunBlock lightLevel={lightLevel} />
            <PhotonBeams lightLevel={lightLevel} />

            <BatteryBlock voltage={safeVoltage} />

            <WirePath points={WIRE.topWire} wireWidth={wireWidth} />
            <WirePath points={WIRE.returnWire} wireWidth={wireWidth} />

            <LdrSymbol lightLevel={lightLevel} resistance={safeResistance} />

            <CurrentParticles
              particles={particles}
              particleCount={particleCount}
              currentSpeed={currentSpeed}
            />

            <DirectionArrows flowLevel={flowLevel} />

            <OutputLamp
              lampBrightness={lampBrightness}
              lampStatus={lampStatus}
            />

            <text
              x={LABEL.current.x}
              y={LABEL.current.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="12"
              fontWeight="900"
            >
              Conventional Current
            </text>

            <text
              x={LABEL.output.x}
              y={LABEL.output.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="12"
              fontWeight="900"
            >
              Vout across LDR
            </text>

            <text
              x={LABEL.summary.x}
              y={LABEL.summary.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="12"
              fontWeight="900"
            >
              Light: {formatNumber(safeLight, 0)}% • Current:{" "}
              {formatNumber(current * 1000, 2)} mA • Vout:{" "}
              {formatNumber(outputVoltage, 2)}V
            </text>

            <LevelBar
              component={COMPONENT.sunlightBar}
              title="Sunlight Intensity"
              value={lightLevel}
              color={STYLE.sunlight}
            />

            <LevelBar
              component={COMPONENT.resistanceBar}
              title="Resistance Drop"
              value={resistanceDropLevel}
              color={STYLE.current}
            />

            <LevelBar
              component={COMPONENT.outputBar}
              title="Output Voltage"
              value={outputLevel}
              color={STYLE.output}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
