"use client";

import { motion } from "framer-motion";

import ACFlowDots from "./ACFlowDots";
import Coil from "./Coil";
import { clamp, computeTransformerSnapshot, formatNumber } from "./logic";

type TransformerVisualProps = {
  primaryTurns: number;
  secondaryTurns: number;
  inputVoltage: number;
  frequency: number;
};

const VIEW_BOX = "0 0 900 430";
const VIEW_BOX_WIDTH = 900;
const VIEW_BOX_HEIGHT = 430;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  inputSource: 1,
  outputLoad: 1,
  ironCore: 1,
  primaryCoil: 1,
  secondaryCoil: 1,
  fluxBar: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  muted: "#64748b",
  wire: "#64748b",
  primary: "#2563eb",
  secondary: "#ef4444",
  flux: "#8b5cf6",
  sourceBody: "#0f172a",
  coreStroke: "#334155",
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
  inputSource: {
    x: 30,
    y: 195,
    width: 60,
    height: 120,
    rotate: 0,
  },

  outputLoad: {
    x: 840,
    y: 195,
    width: 60,
    height: 120,
    rotate: 0,
  },

  ironCore: {
    x: 350,
    y: 90,
    width: 200,
    height: 240,
    rotate: 0,
  },

  primaryCoil: {
    x: 285,
    y: 210,
    width: 1,
    height: 1,
    rotate: 0,
  },

  secondaryCoil: {
    x: 615,
    y: 210,
    width: 1,
    height: 1,
    rotate: 0,
  },

  fluxBar: {
    x: 160,
    y: 398,
    width: 560,
    height: 12,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  inputSource: scaleComponent(
    BASE_COMPONENT.inputSource,
    CIRCUIT_COMPONENT_SCALE.inputSource,
  ),
  outputLoad: scaleComponent(
    BASE_COMPONENT.outputLoad,
    CIRCUIT_COMPONENT_SCALE.outputLoad,
  ),
  ironCore: scaleComponent(
    BASE_COMPONENT.ironCore,
    CIRCUIT_COMPONENT_SCALE.ironCore,
  ),
  primaryCoil: scaleComponent(
    BASE_COMPONENT.primaryCoil,
    CIRCUIT_COMPONENT_SCALE.primaryCoil,
  ),
  secondaryCoil: scaleComponent(
    BASE_COMPONENT.secondaryCoil,
    CIRCUIT_COMPONENT_SCALE.secondaryCoil,
  ),
  fluxBar: scaleComponent(
    BASE_COMPONENT.fluxBar,
    CIRCUIT_COMPONENT_SCALE.fluxBar,
  ),
} as const;

const NODE = {
  inputTopStart: { x: 90, y: 225 },
  inputTopEnd: { x: 285, y: 225 },
  inputBottomStart: { x: 90, y: 285 },
  inputBottomEnd: { x: 285, y: 285 },

  outputTopStart: { x: 633, y: 225 },
  outputTopEnd: { x: 860, y: 225 },
  outputBottomStart: { x: 633, y: 285 },
  outputBottomEnd: { x: 860, y: 285 },

  coreCenter: pointOnComponent(COMPONENT.ironCore, 0.5, 0.5),
  coreWindow: {
    x: 400,
    y: 140,
    width: 100,
    height: 140,
  },

  primaryCoilCenter: pointOnComponent(COMPONENT.primaryCoil, 0, 0),
  secondaryCoilCenter: pointOnComponent(COMPONENT.secondaryCoil, 0, 0),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  inputTop: [NODE.inputTopStart, NODE.inputTopEnd],
  inputBottom: [NODE.inputBottomStart, NODE.inputBottomEnd],
  outputTop: [NODE.outputTopStart, NODE.outputTopEnd],
  outputBottom: [NODE.outputBottomStart, NODE.outputBottomEnd],
} as const;

const PATH = {
  inputTop: pathD(WIRE.inputTop),
  inputBottom: pathD(WIRE.inputBottom),
  outputTop: pathD(WIRE.outputTop),
  outputBottom: pathD(WIRE.outputBottom),
} as const;

const LABEL = {
  title: { x: 450, y: 28 },

  inputAc: { x: 60, y: 240 },
  inputVoltage: { x: 60, y: 273 },

  output: { x: 870, y: 240 },
  outputVoltage: { x: 870, y: 273 },

  ironCore: { x: 450, y: 210 },

  primaryTitle: { x: 285, y: 62 },
  primarySubtitle: { x: 285, y: 82 },

  secondaryTitle: { x: 615, y: 62 },
  secondarySubtitle: { x: 615, y: 82 },

  ratio: { x: 450, y: 382 },
  fluxText: { x: 560, y: 28 },
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

function IronCore() {
  return (
    <g>
      <rect
        x={COMPONENT.ironCore.x}
        y={COMPONENT.ironCore.y}
        width={COMPONENT.ironCore.width}
        height={COMPONENT.ironCore.height}
        rx="14"
        fill="url(#coreGradient)"
        stroke={STYLE.coreStroke}
        strokeWidth="5"
      />

      <rect
        x={NODE.coreWindow.x}
        y={NODE.coreWindow.y}
        width={NODE.coreWindow.width}
        height={NODE.coreWindow.height}
        rx="8"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="3"
      />

      <text
        x={LABEL.ironCore.x}
        y={LABEL.ironCore.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="15"
        fontWeight="900"
      >
        Iron Core
      </text>
    </g>
  );
}

function SourceBlock({ inputVoltage }: { inputVoltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.inputSource.x}
        y={COMPONENT.inputSource.y}
        width={COMPONENT.inputSource.width}
        height={COMPONENT.inputSource.height}
        rx="12"
        fill={STYLE.sourceBody}
      />

      <text
        x={LABEL.inputAc.x}
        y={LABEL.inputAc.y}
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="900"
      >
        AC
      </text>

      <text
        x={LABEL.inputVoltage.x}
        y={LABEL.inputVoltage.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="14"
      >
        {inputVoltage}V
      </text>
    </g>
  );
}

function OutputBlock({ outputVoltage }: { outputVoltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.outputLoad.x}
        y={COMPONENT.outputLoad.y}
        width={COMPONENT.outputLoad.width}
        height={COMPONENT.outputLoad.height}
        rx="12"
        fill={STYLE.sourceBody}
      />

      <text
        x={LABEL.output.x}
        y={LABEL.output.y}
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="900"
      >
        OUT
      </text>

      <text
        x={LABEL.outputVoltage.x}
        y={LABEL.outputVoltage.y}
        textAnchor="middle"
        fill="#fca5a5"
        fontSize="14"
      >
        {formatNumber(outputVoltage, 1)}V
      </text>
    </g>
  );
}

function CoilPair({
  primaryTurns,
  secondaryTurns,
}: {
  primaryTurns: number;
  secondaryTurns: number;
}) {
  return (
    <g>
      <Coil
        x={NODE.primaryCoilCenter.x}
        turns={primaryTurns}
        color={STYLE.primary}
      />
      <Coil
        x={NODE.secondaryCoilCenter.x}
        turns={secondaryTurns}
        color={STYLE.secondary}
      />
    </g>
  );
}

function MagneticFluxLines() {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.path
          key={`flux-line-${index}`}
          d={`M ${385 + index * 8} 145 Q 450 210 ${385 + index * 8} 255`}
          stroke={STYLE.flux}
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 6"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1 + index * 0.1 }}
        />
      ))}
    </g>
  );
}

function FlowDots() {
  return (
    <g>
      <ACFlowDots path={PATH.inputTop} color="#0ea5e9" />
      <ACFlowDots path={PATH.inputBottom} color="#0ea5e9" delayOffset={0.35} />
      <ACFlowDots
        path={PATH.outputTop}
        color={STYLE.secondary}
        delayOffset={0.15}
      />
      <ACFlowDots
        path={PATH.outputBottom}
        color={STYLE.secondary}
        delayOffset={0.5}
      />
    </g>
  );
}

function CoilLabels({
  primaryTurns,
  secondaryTurns,
}: {
  primaryTurns: number;
  secondaryTurns: number;
}) {
  return (
    <g>
      <text
        x={LABEL.primaryTitle.x}
        y={LABEL.primaryTitle.y}
        textAnchor="middle"
        fill={STYLE.primary}
        fontSize="13"
        fontWeight="900"
      >
        Primary Turns: {primaryTurns}
      </text>

      <text
        x={LABEL.primarySubtitle.x}
        y={LABEL.primarySubtitle.y}
        textAnchor="middle"
        fill={STYLE.primary}
        fontSize="12"
        fontWeight="700"
      >
        AC current oscillates in primary coil
      </text>

      <text
        x={LABEL.secondaryTitle.x}
        y={LABEL.secondaryTitle.y}
        textAnchor="middle"
        fill={STYLE.secondary}
        fontSize="13"
        fontWeight="900"
      >
        Secondary Turns: {secondaryTurns}
      </text>

      <text
        x={LABEL.secondarySubtitle.x}
        y={LABEL.secondarySubtitle.y}
        textAnchor="middle"
        fill={STYLE.secondary}
        fontSize="12"
        fontWeight="700"
      >
        Induced AC current in secondary coil
      </text>
    </g>
  );
}

function FluxStrengthBar({ magneticStrength }: { magneticStrength: number }) {
  return (
    <g transform={`translate(${COMPONENT.fluxBar.x} ${COMPONENT.fluxBar.y})`}>
      <rect
        x="0"
        y="0"
        width={COMPONENT.fluxBar.width}
        height={COMPONENT.fluxBar.height}
        rx="6"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="0"
        height={COMPONENT.fluxBar.height}
        rx="6"
        fill={STYLE.flux}
        animate={{ width: COMPONENT.fluxBar.width * magneticStrength }}
      />

      <text
        x={COMPONENT.fluxBar.width}
        y={LABEL.fluxText.y}
        textAnchor="end"
        fill={STYLE.muted}
        fontSize="11"
      >
        Magnetic Flux Strength
      </text>
    </g>
  );
}

export default function TransformerVisual({
  primaryTurns,
  secondaryTurns,
  inputVoltage,
  frequency,
}: TransformerVisualProps) {
  const { turnsRatio, outputVoltage } = computeTransformerSnapshot({
    inputVoltage,
    primaryTurns,
    secondaryTurns,
    frequency,
  });

  const isStepUp = outputVoltage > inputVoltage;
  const magneticStrength = clamp(
    (inputVoltage / 240) * (frequency / 50),
    0.1,
    1,
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Transformer Magnetic Coupling Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            AC current in the primary coil creates magnetic flux, which induces
            voltage in the secondary coil.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isStepUp
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isStepUp ? "STEP-UP TRANSFORMER" : "STEP-DOWN TRANSFORMER"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox={VIEW_BOX} className="h-auto w-[900px] sm:w-full">
          <defs>
            <linearGradient id="coreGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="14"
              fontWeight="800"
            >
              No electron crosses the core: primary and secondary are isolated;
              energy transfers by changing magnetic flux
            </text>

            <IronCore />

            <CoilPair
              primaryTurns={primaryTurns}
              secondaryTurns={secondaryTurns}
            />

            <WirePath points={WIRE.inputTop} />
            <WirePath points={WIRE.inputBottom} />
            <WirePath points={WIRE.outputTop} />
            <WirePath points={WIRE.outputBottom} />

            <SourceBlock inputVoltage={inputVoltage} />

            <OutputBlock outputVoltage={outputVoltage} />

            <MagneticFluxLines />

            <FlowDots />

            <CoilLabels
              primaryTurns={primaryTurns}
              secondaryTurns={secondaryTurns}
            />

            <text
              x={LABEL.ratio.x}
              y={LABEL.ratio.y}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="13"
              fontWeight="900"
            >
              Turns Ratio = {secondaryTurns}:{primaryTurns} | Output ={" "}
              {formatNumber(outputVoltage, 1)}V
            </text>

            <FluxStrengthBar magneticStrength={magneticStrength} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Primary Coil
          </p>
          <p className="mt-1 text-sm text-slate-700">
            AC current oscillates in the primary winding and creates a changing
            magnetic field.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {primaryTurns} Turns
          </p>
        </div>

        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Magnetic Flux
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The iron core improves magnetic flux transfer efficiency between the
            windings.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            AC Magnetic Field
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
            Secondary Coil
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The secondary is a separate circuit. Magnetic flux induces AC
            voltage and current in it.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(outputVoltage, 1)}V Output
          </p>
        </div>
      </div>
    </div>
  );
}
