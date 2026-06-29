"use client";
import DiodeSymbol from "../../../../library/electronics-symbol-library/diodes/DiodeSymbol";
import ResistorSymbol from "../../../../library/electronics-symbol-library/passive/ResistorSymbol";
import ACVoltageSourceSymbol from "../../../../library/electronics-symbol-library/sources/ACVoltageSourceSymbol";

import type { ClipperMode, ClipperState, FlowMode } from "./clipperTypes";
import {
  COMPONENT as NEGATIVE_COMPONENT,
  LABEL as NEGATIVE_LABEL,
  NODE as NEGATIVE_NODE,
  PATH as NEGATIVE_PATH,
  SCALE as NEGATIVE_SCALE,
  VIEW_BOX as NEGATIVE_VIEW_BOX,
  renderDebugDots as renderNegativeDebugDots,
} from "./NegativeDiodeClippingCircuit";
import {
  COMPONENT as POSITIVE_COMPONENT,
  LABEL as POSITIVE_LABEL,
  NODE as POSITIVE_NODE,
  PATH as POSITIVE_PATH,
  SCALE as POSITIVE_SCALE,
  VIEW_BOX as POSITIVE_VIEW_BOX,
  renderDebugDots as renderPositiveDebugDots,
} from "./PositiveDiodeClippingCircuit";

type Point = { x: number; y: number };
type CircuitScale = {
  CIRCUIT_COMPONENT_SCALE: number;
  BASE_WIRE_WIDTH: number;
  CIRCUIT_WIRE_SCALE: number;
  CIRCUIT_CANVAS_SCALE: number;
};

const FLOW_STYLE = {
  conventional: {
    color: "#f59e0b",
    radius: 4.2,
  },
  electron: {
    color: "#2563eb",
    radius: 4.2,
  },
  particleCount: 8,
  stagger: 0.24,
} as const;

const VIEW_BOX = {
  width: 1160,
  height: 620,
} as const;

const SCALE = {
  CIRCUIT_COMPONENT_SCALE: POSITIVE_SCALE.CIRCUIT_COMPONENT_SCALE,
  BASE_WIRE_WIDTH: POSITIVE_SCALE.BASE_WIRE_WIDTH,
  CIRCUIT_WIRE_SCALE: POSITIVE_SCALE.CIRCUIT_WIRE_SCALE,
  CIRCUIT_CANVAS_SCALE: POSITIVE_SCALE.CIRCUIT_CANVAS_SCALE,
} as const;

const WIRE = {
  marker: "#2563eb",
  guide: "#cbd5e1",
  width: SCALE.BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  positive: POSITIVE_PATH,
  negative: NEGATIVE_PATH,
} as const;

const LABEL = {
  positive: POSITIVE_LABEL,
  negative: NEGATIVE_LABEL,
  infoPanel: {
    x: 796,
    y: 34,
  },
} as const;

const BASE_COMPONENT = {
  source: { width: 96, height: 116 },
  resistor: { width: 224, height: 112 },
  diode: { width: 136, height: 176 },
  output: { radius: 7 },
} as const;

const COMPONENT = {
  positive: POSITIVE_COMPONENT,
  negative: NEGATIVE_COMPONENT,
} as const;

const NODE = {
  positive: POSITIVE_NODE,
  negative: NEGATIVE_NODE,
} as const;

function buildResistorToDiodePath(
  node: typeof POSITIVE_NODE,
) {
  return `M ${node.resistorRight.x} ${node.resistorRight.y} L ${node.diodeTop.x} ${node.resistorRight.y} L ${node.diodeTop.x} ${node.diodeTop.y}`;
}

function buildDiodeReturnPath(
  node: typeof POSITIVE_NODE,
) {
  return `M ${node.diodeBottom.x} ${node.diodeBottom.y} L ${node.diodeBottom.x} ${node.sourceBottom.y} L ${node.sourceBottom.x} ${node.sourceBottom.y}`;
}

function renderActualWire(path: string, key: string) {
  return (
    <path
      key={key}
      d={path}
      fill="none"
      stroke="#111827"
      strokeWidth={SCALE.BASE_WIRE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function buildPath(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function buildClosedFlowPath(node: typeof POSITIVE_NODE, reverse = false) {
  const points = [
    node.sourceTop,
    { x: node.resistorLeft.x - 28, y: node.sourceTop.y },
    node.resistorLeft,
    node.resistorRight,
    { x: node.diodeTop.x, y: node.resistorRight.y },
    node.diodeTop,
    node.diodeBottom,
    { x: node.diodeBottom.x, y: node.sourceBottom.y },
    node.sourceBottom,
  ] as const;

  return buildPath(reverse ? [...points].reverse() : points);
}

function FlowParticles({
  active,
  flowMode,
  path,
  speedSeconds,
}: {
  active: boolean;
  flowMode: FlowMode;
  path: string;
  speedSeconds: number;
}) {
  if (!active) return null;

  const style = FLOW_STYLE[flowMode];

  return (
    <g>
      {Array.from({ length: FLOW_STYLE.particleCount }, (_, particle) => {
        const delay = particle * FLOW_STYLE.stagger;

        return (
          <circle
            key={`flow-particle-${flowMode}-${particle}`}
            r={style.radius}
            fill={style.color}
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.95;0.95;0"
              keyTimes="0;0.08;0.9;1"
              dur={`${speedSeconds}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animateMotion
              dur={`${speedSeconds}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        );
      })}
    </g>
  );
}

function sinePath({
  amplitude,
  centerY,
  clipAt,
  mode,
  width,
  x,
}: {
  amplitude: number;
  centerY: number;
  clipAt: number;
  mode: "positive" | "negative" | "input";
  width: number;
  x: number;
}) {
  const steps = 72;
  const points: string[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = (index / steps) * Math.PI * 2;
    let sample = Math.sin(t) * amplitude;
    if (mode === "positive") sample = Math.min(sample, clipAt);
    if (mode === "negative") sample = Math.max(sample, -clipAt);
    const px = x + (index / steps) * width;
    const py = centerY - sample;
    points.push(`${index === 0 ? "M" : "L"} ${px} ${py}`);
  }
  return points.join(" ");
}

function renderCircuitBlocks({
  component,
  diodeRotation,
  label,
  resistorValue,
  scale,
  stateText,
  showOutputNode = true,
  waveformLabel,
}: {
  component: typeof POSITIVE_COMPONENT;
  diodeRotation: number;
  label: typeof POSITIVE_LABEL;
  resistorValue: number;
  scale: CircuitScale;
  stateText: string;
  showOutputNode?: boolean;
  waveformLabel: string;
}) {
  const componentScale = scale.CIRCUIT_COMPONENT_SCALE;
  const sourceWidth = BASE_COMPONENT.source.width * componentScale;
  const sourceHeight = BASE_COMPONENT.source.height * componentScale;
  const resistorWidth = BASE_COMPONENT.resistor.width * componentScale;
  const resistorHeight = BASE_COMPONENT.resistor.height * componentScale;
  const diodeWidth = BASE_COMPONENT.diode.width * componentScale;
  const diodeHeight = BASE_COMPONENT.diode.height * componentScale;

  return (
    <>
      <foreignObject
        x={component.source.x - sourceWidth / 2}
        y={component.source.y - sourceHeight / 2}
        width={sourceWidth}
        height={sourceHeight}
      >
        <div className="flex h-full w-full items-center justify-center">
          <ACVoltageSourceSymbol
            width={sourceWidth}
            height={sourceHeight}
          />
        </div>
      </foreignObject>
      <foreignObject
        x={component.resistor.x - resistorWidth / 2}
        y={component.resistor.y - resistorHeight / 2}
        width={resistorWidth}
        height={resistorHeight}
      >
        <div className="flex h-full w-full items-center justify-center">
          <ResistorSymbol
            width={Math.max(resistorWidth - 12 * componentScale, 24)}
            height={Math.max(resistorHeight - 4 * componentScale, 16)}
            showTerminalLabels={false}
          />
        </div>
      </foreignObject>
      <foreignObject
        x={component.diode.x - diodeWidth / 2}
        y={component.diode.y - diodeHeight / 2}
        width={diodeWidth}
        height={diodeHeight}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: `rotate(${diodeRotation}deg)`,
          }}
        >
          <DiodeSymbol
            width={Math.max(68 * componentScale, 24)}
            height={Math.max(104 * componentScale, 36)}
          />
        </div>
      </foreignObject>

      {showOutputNode ? (
        <circle
          cx={component.output.x}
          cy={component.output.y}
          r={BASE_COMPONENT.output.radius}
          fill="#ffffff"
          stroke="#64748b"
          strokeWidth="2"
        />
      ) : null}
      <text
        x={label.resistorTag.x}
        y={label.resistorTag.y}
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fill="#7c2d12"
      >
        R1
      </text>
      <text
        x={label.resistorTag.x}
        y={label.resistorTag.y + 28}
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill="#1d4ed8"
      >
        {resistorValue} Ohm
      </text>
      <text
        x={label.waveformTag.x}
        y={label.waveformTag.y}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="#1d4ed8"
      >
        {waveformLabel.replace(/[âˆ’−]/g, "-")}
      </text>
      <text
        x={label.waveformTag.x}
        y={label.waveformTag.y + 22}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#0f766e"
      >
        {stateText}
      </text>
    </>
  );
}

export default function ClipperCircuitCanvas({
  flowMode,
  mode,
  showDebugDots,
  state,
}: {
  flowMode: FlowMode;
  mode: ClipperMode;
  showDebugDots: boolean;
  state: ClipperState;
}) {
  const showPositive = mode === "positive" || mode === "both";
  const showNegative = mode === "negative" || mode === "both";
  const positiveFlowPath = buildClosedFlowPath(
    NODE.positive,
    flowMode === "electron",
  );
  const negativeFlowPath = buildClosedFlowPath(
    NODE.negative,
    flowMode === "electron",
  );
  const positiveFlowActive = state.positiveConductionState === "Conducting";
  const negativeFlowActive = state.negativeConductionState === "Conducting";
  const flowSpeedSeconds = Math.max(
    2.2,
    5.4 - Math.min(state.inputAmplitude, 12) * 0.22,
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Simulation Canvas
          </p>
          <h3 className="text-2xl font-black text-slate-950">
            Positive and Negative Diode Clipping
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            One canvas compares the positive peak clipper and the negative peak
            clipper using the same AC input and resistor network.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          {state.focusLabel}
        </span>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
        <div
          className="relative mx-auto w-full"
          style={{
            aspectRatio: `${VIEW_BOX.width} / ${VIEW_BOX.height}`,
            maxWidth: `${VIEW_BOX.width}px`,
            transform: `scale(${SCALE.CIRCUIT_CANVAS_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Positive and negative clipping circuit comparison"
          >
            <path
              d={sinePath({
                amplitude: 52,
                centerY: POSITIVE_VIEW_BOX.y + 66,
                clipAt: state.clipLevel * 10,
                mode: "input",
                width: 150,
                x: 42,
              })}
              fill="none"
              stroke={WIRE.marker}
              strokeWidth="4"
            />
            <path
              d={sinePath({
                amplitude: 52,
                centerY: POSITIVE_VIEW_BOX.y + 66,
                clipAt: state.clippedPeak * 10,
                mode: "positive",
                width: 150,
                x: 958,
              })}
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />
            <path
              d={sinePath({
                amplitude: 52,
                centerY: NEGATIVE_VIEW_BOX.y + 96,
                clipAt: state.clippedPeak * 10,
                mode: "negative",
                width: 150,
                x: 958,
              })}
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />

            <text x={LABEL.positive.title.x} y={LABEL.positive.title.y} fontSize="26" fontWeight="900" fill="#0f172a">
              Positive Diode Clipping Circuit
            </text>
            <text x={LABEL.negative.title.x} y={LABEL.negative.title.y} fontSize="26" fontWeight="900" fill="#0f172a">
              Negative Diode Clipping Circuit
            </text>

            <g transform={`translate(${LABEL.infoPanel.x} ${LABEL.infoPanel.y})`}>
              <rect
                width="300"
                height="86"
                rx="20"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <text
                x="20"
                y="24"
                fontSize="12"
                fontWeight="900"
                letterSpacing="2.6"
                fill="#64748b"
              >
                FLOW AND CLIP LOGIC
              </text>
              <text x="20" y="50" fontSize="16" fontWeight="900" fill="#0f172a">
                {flowMode === "conventional" ? "Conventional" : "Electron"} flow | {state.conductionState}
              </text>
              <text x="20" y="70" fontSize="12" fontWeight="700" fill="#475569">
                {state.activeHalfCycleLabel}
              </text>
            </g>

            <text x={LABEL.positive.sourceTag.x} y={LABEL.positive.sourceTag.y} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
              Vin
            </text>
            <text x={LABEL.negative.sourceTag.x} y={LABEL.negative.sourceTag.y} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
              Vin
            </text>

            <line x1="42" y1="120" x2="192" y2="120" stroke="#64748b" strokeWidth="2" />
            <line x1="958" y1="120" x2="1108" y2="120" stroke="#64748b" strokeWidth="2" />
            <line x1="958" y1="420" x2="1108" y2="420" stroke="#64748b" strokeWidth="2" />

            {showPositive
              ? renderActualWire(
                  PATH.positive.sourceToResistor,
                  "positive-source-to-resistor",
                )
              : null}
            {showNegative
              ? renderActualWire(
                  PATH.negative.sourceToResistor,
                  "negative-source-to-resistor",
                )
              : null}
            {showPositive
              ? renderActualWire(
                  buildResistorToDiodePath(NODE.positive),
                  "positive-resistor-to-diode",
                )
              : null}
            {showNegative
              ? renderActualWire(
                  buildResistorToDiodePath(NODE.negative),
                  "negative-resistor-to-diode",
                )
              : null}
            {showPositive
              ? renderActualWire(
                  buildDiodeReturnPath(NODE.positive),
                  "positive-diode-return",
                )
              : null}
            {showNegative
              ? renderActualWire(
                  buildDiodeReturnPath(NODE.negative),
                  "negative-diode-return",
                )
              : null}

            {showPositive ? (
              <FlowParticles
                active={positiveFlowActive}
                flowMode={flowMode}
                path={positiveFlowPath}
                speedSeconds={flowSpeedSeconds}
              />
            ) : null}
            {showNegative ? (
              <FlowParticles
                active={negativeFlowActive}
                flowMode={flowMode}
                path={negativeFlowPath}
                speedSeconds={flowSpeedSeconds}
              />
            ) : null}

            {showPositive ? (
              renderCircuitBlocks({
                component: COMPONENT.positive,
                diodeRotation: 90,
                label: LABEL.positive,
                resistorValue: state.resistorValue,
                scale: POSITIVE_SCALE,
                stateText: `${state.positiveConductionState} | limit +${state.positiveOutputMaximum.toFixed(1)}V | Iclip ${state.positiveConductionCurrentMilliAmps.toFixed(2)}mA`,
                showOutputNode: false,
                waveformLabel: `Positive clipped output (+peak ${state.positiveOutputMaximum.toFixed(1)}V)`,
              })
            ) : null}

            {showNegative ? (
              renderCircuitBlocks({
                component: COMPONENT.negative,
                diodeRotation: -90,
                label: LABEL.negative,
                resistorValue: state.resistorValue,
                scale: NEGATIVE_SCALE,
                stateText: `${state.negativeConductionState} | limit ${state.negativeOutputMinimum.toFixed(1)}V | Iclip ${state.negativeConductionCurrentMilliAmps.toFixed(2)}mA`,
                waveformLabel: `Negative clipped output (−peak ${Math.abs(state.negativeOutputMinimum).toFixed(1)}V)`,
              })
            ) : null}

            {showPositive ? renderPositiveDebugDots(showDebugDots) : null}
            {showNegative ? renderNegativeDebugDots(showDebugDots) : null}
          </svg>

        </div>
      </div>
    </section>
  );
}
