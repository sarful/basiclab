"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { formatNumber } from "./logic";

type NonPolarizedCapacitorCardProps = {
  frequency: number;
};

const VIEW_BOX = "0 0 720 360";
const VIEW_BOX_WIDTH = 720;
const VIEW_BOX_HEIGHT = 360;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  capacitor: 1,
  dielectric: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  sourceBody: "#0f172a",
  leftPlate: "#2563eb",
  rightPlate: "#ef4444",
  field: "#8b5cf6",
  inputSignal: "#0ea5e9",
  outputSignal: "#22c55e",
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

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  source: {
    x: 40,
    y: 165,
    width: 80,
    height: 85,
    rotate: 0,
  },

  capacitor: {
    x: 260,
    y: 115,
    width: 200,
    height: 180,
    rotate: 0,
  },

  dielectric: {
    x: 280,
    y: 125,
    width: 160,
    height: 160,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  capacitor: scaleComponent(
    BASE_COMPONENT.capacitor,
    CIRCUIT_COMPONENT_SCALE.capacitor,
  ),
  dielectric: scaleComponent(
    BASE_COMPONENT.dielectric,
    CIRCUIT_COMPONENT_SCALE.dielectric,
  ),
} as const;

const NODE = {
  sourceOutput: { x: 120, y: 205 },
  leftWireEnd: { x: 260, y: 205 },

  rightWireStart: { x: 460, y: 205 },
  outputEnd: { x: 650, y: 205 },

  leftPlateTop: pointOnComponent(COMPONENT.capacitor, 0, 0),
  leftPlateBottom: pointOnComponent(COMPONENT.capacitor, 0, 1),
  rightPlateTop: pointOnComponent(COMPONENT.capacitor, 0.91, 0),
  rightPlateBottom: pointOnComponent(COMPONENT.capacitor, 0.91, 1),

  capacitorCenter: pointOnComponent(COMPONENT.capacitor, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  leftAcWire: [NODE.sourceOutput, NODE.leftWireEnd],
  rightAcWire: [NODE.rightWireStart, NODE.outputEnd],
} as const;

const PATH = {
  leftAc: pathD(WIRE.leftAcWire),
  rightAc: pathD(WIRE.rightAcWire),
} as const;

const LABEL = {
  sourceAc: { x: 80, y: 198 },
  sourceSignal: { x: 80, y: 225 },

  code: { x: 360, y: 175 },
  capacitance: { x: 360, y: 208 },
  type: { x: 360, y: 236 },

  input: { x: 180, y: 165 },
  output: { x: 550, y: 165 },
  summary: { x: 360, y: 322 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function SourceBlock() {
  return (
    <g>
      <rect
        x={COMPONENT.source.x}
        y={COMPONENT.source.y}
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        rx="15"
        fill={STYLE.sourceBody}
      />

      <text
        x={LABEL.sourceAc.x}
        y={LABEL.sourceAc.y}
        textAnchor="middle"
        fill="white"
        fontSize="15"
        fontWeight="800"
      >
        AC
      </text>

      <text
        x={LABEL.sourceSignal.x}
        y={LABEL.sourceSignal.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="13"
        fontWeight="800"
      >
        Signal
      </text>
    </g>
  );
}

function CapacitorBody() {
  return (
    <g>
      <motion.rect
        x={NODE.leftPlateTop.x}
        y={NODE.leftPlateTop.y}
        width="18"
        height={COMPONENT.capacitor.height}
        rx="6"
        fill={STYLE.leftPlate}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />

      <motion.rect
        x={NODE.rightPlateTop.x}
        y={NODE.rightPlateTop.y}
        width="18"
        height={COMPONENT.capacitor.height}
        rx="6"
        fill={STYLE.rightPlate}
        animate={{ opacity: [1, 0.65, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />

      <rect
        x={COMPONENT.dielectric.x}
        y={COMPONENT.dielectric.y}
        width={COMPONENT.dielectric.width}
        height={COMPONENT.dielectric.height}
        rx="18"
        fill="#f8fafc"
        stroke={STYLE.muted}
        strokeDasharray="5 4"
      />
    </g>
  );
}

function FieldLines() {
  return (
    <g>
      {Array.from({ length: 10 }).map((_, index) => {
        const y = 140 + index * 14;
        const directionRight = index % 2 === 0;

        return (
          <motion.g
            key={`field-${index}`}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{
              repeat: Infinity,
              duration: 1.1,
              delay: index * 0.04,
            }}
          >
            <line
              x1={directionRight ? 290 : 430}
              y1={y}
              x2={directionRight ? 430 : 290}
              y2={y}
              stroke={STYLE.field}
              strokeWidth="2"
            />

            <polygon
              points={
                directionRight
                  ? `430,${y} 422,${y - 4} 422,${y + 4}`
                  : `290,${y} 298,${y - 4} 298,${y + 4}`
              }
              fill={STYLE.field}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function SignalParticles({
  particles,
  particleSpeed,
  particleCount,
  frequencyLevel,
}: {
  particles: number[];
  particleSpeed: number;
  particleCount: number;
  frequencyLevel: number;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`left-ac-${index}`}
          r="3.4"
          fill={STYLE.inputSignal}
          stroke="#e0f2fe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${particleSpeed}s`}
            repeatCount="indefinite"
            path={PATH.leftAc}
            begin={`${index * (particleSpeed / particleCount)}s`}
          />
        </circle>
      ))}

      {particles
        .slice(0, Math.max(3, Math.round(particles.length * frequencyLevel)))
        .map((index) => (
          <circle
            key={`right-ac-${index}`}
            r="3.2"
            fill={STYLE.outputSignal}
            stroke="#dcfce7"
            strokeWidth="1.1"
          >
            <animateMotion
              dur={`${particleSpeed * 1.15}s`}
              repeatCount="indefinite"
              path={PATH.rightAc}
              begin={`${index * (particleSpeed / particleCount)}s`}
            />
          </circle>
        ))}
    </g>
  );
}

export function NonPolarizedCapacitorCard({
  frequency,
}: NonPolarizedCapacitorCardProps) {
  const safeFrequency = Math.max(Number.isFinite(frequency) ? frequency : 0, 1);

  const capacitanceFarad = 100e-9;
  const reactance = 1 / (2 * Math.PI * safeFrequency * capacitanceFarad);

  const frequencyLevel = clampValue(Math.log10(safeFrequency + 1) / 5, 0.05, 1);
  const particleCount = clampValue(Math.round(frequencyLevel * 18), 5, 20);
  const particleSpeed = clampValue(2.4 - frequencyLevel * 1.4, 0.65, 2.4);

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Non-Polarized Capacitor
          </h2>
          <p className="text-xs text-slate-600">
            Ceramic / film capacitor — can connect in any direction.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          NO POLARITY
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="w-full"
          role="img"
          aria-label="Non-polarized capacitor AC coupling and filtering visualizer"
        >
          <g transform={canvasTransform}>
            <SourceBlock />

            <WirePath points={WIRE.leftAcWire} />
            <WirePath points={WIRE.rightAcWire} />

            <CapacitorBody />

            <FieldLines />

            <text
              x={LABEL.code.x}
              y={LABEL.code.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="28"
              fontWeight="900"
            >
              104
            </text>

            <text
              x={LABEL.capacitance.x}
              y={LABEL.capacitance.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="15"
              fontWeight="800"
            >
              100 nF
            </text>

            <text
              x={LABEL.type.x}
              y={LABEL.type.y}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="12"
              fontWeight="800"
            >
              Ceramic / Film Capacitor
            </text>

            <SignalParticles
              particles={particles}
              particleSpeed={particleSpeed}
              particleCount={particleCount}
              frequencyLevel={frequencyLevel}
            />

            <text
              x={LABEL.input.x}
              y={LABEL.input.y}
              textAnchor="middle"
              fill={STYLE.leftPlate}
              fontSize="12"
              fontWeight="900"
            >
              AC signal reaches plate
            </text>

            <text
              x={LABEL.output.x}
              y={LABEL.output.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="12"
              fontWeight="900"
            >
              Coupled output signal
            </text>

            <text
              x={LABEL.summary.x}
              y={LABEL.summary.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="800"
            >
              Frequency = {formatNumber(safeFrequency, 0)} Hz | Xc ={" "}
              {formatNumber(reactance, 0)} Ω
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Main Rule</p>
        <p className="mt-1">
          A non-polarized capacitor can be connected in either direction. In AC,
          charge does not cross the dielectric; the changing electric field
          couples the signal to the other side.
        </p>
      </div>
    </div>
  );
}
