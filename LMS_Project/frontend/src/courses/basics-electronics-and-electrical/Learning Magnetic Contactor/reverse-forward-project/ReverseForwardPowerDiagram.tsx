"use client";

import ContactorPowerContacts3P from "../../Project/library/contactors/ContactorPowerContacts3P";
import ACMotor3P from "../../Project/library/motors/ACMotor3P";
import CircuitBreaker3P from "../../Project/library/protection/CircuitBreaker3P";
import ThermalOverloadRelay3P from "../../Project/library/protection/ThermalOverloadRelay3P";

type DirectionState = "idle" | "forward" | "reverse";

type ReverseForwardPowerDiagramProps = {
  className?: string;
  mccbOn?: boolean;
  overloadTripped?: boolean;
  motorRunning?: boolean;
  direction?: DirectionState;
  loadPercent?: number;
  viewMode?: "fit" | "actual";
  showLabels?: boolean;
  showFlow?: boolean;
};

type ComponentPlacement = {
  x: number;
  y: number;
  scale: number;
};

const VIEW_BOX_WIDTH = 1520;
const VIEW_BOX_HEIGHT = 1912;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_OFFSET = {
  x: 40,
  y: -48,
} as const;

const CIRCUIT_COMPONENT_SCALE = {
  breaker: 2,
  forwardContactor: 2,
  reverseContactor: 2,
  overload: 2,
  motor: 2,
} as const;

const BASE_WIRE_WIDTH = 2.6;
const ACTIVE_WIRE_WIDTH = 3.6;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  phaseActive: ["#dc2626", "#111827", "#64748b"],
  phaseMuted: ["#fca5a5", "#cbd5e1", "#d8e1eb"],
  activeFlow: "#16a34a",
  faultFlow: "#ef4444",
  electron: "#fde047",
  electronFault: "#f87171",
  text: "#111827",
  forward: "#16a34a",
  reverse: "#2563eb",
  muted: "#64748b",
  background: "#ffffff",
} as const;

const FLOW = {
  stagger: [0, 0.3, 0.6],
  electronRadius: 3.2,
} as const;

const NODE = {
  sourceLabelsX: 26,
  sourceStartX: 54,
  sourceEndX: 198,
  railYs: [128, 162, 196],

  breakerX: 188,
  breakerY: 232,

  k1X: 188,
  k1Y: 406,

  k2X: 428,
  k2Y: 406,

  overloadX: 244,
  overloadY: 576,

  motorX: 214,
  motorY: 798,
} as const;

const DERIVED = {
  phaseXs: [NODE.breakerX + 10, NODE.breakerX + 50, NODE.breakerX + 90],

  breakerTopY: NODE.breakerY + 40,
  breakerBottomY: NODE.breakerY + 80,

  feedY: NODE.breakerY + 80 + 44,

  k1PhaseXs: [NODE.k1X + 20, NODE.k1X + 60, NODE.k1X + 100],
  k2PhaseXs: [NODE.k2X + 20, NODE.k2X + 60, NODE.k2X + 100],

  k1TopY: NODE.k1Y,
  k1BottomY: NODE.k1Y + 100,
  k2TopY: NODE.k2Y,
  k2BottomY: NODE.k2Y + 100,

  overloadTopWireY: NODE.overloadY,
  overloadBottomY: NODE.overloadY + 100,

  overloadBottomXs: [
    NODE.overloadX - 46,
    NODE.overloadX - 6,
    NODE.overloadX + 34,
  ],

  motorTopXs: [NODE.motorX - 12, NODE.motorX + 28, NODE.motorX + 68],
  motorFeedEndY: NODE.motorY,
  motorSymbolX: NODE.motorX - 32,
  motorCenterX: NODE.motorX - 32 + 30 * 2,
  motorCenterY: NODE.motorY + 35 * 2,
} as const;

const COMPONENT: Record<string, ComponentPlacement> = {
  breaker: {
    x: NODE.breakerX,
    y: NODE.breakerY,
    scale: CIRCUIT_COMPONENT_SCALE.breaker,
  },
  forwardContactor: {
    x: NODE.k1X - 10,
    y: NODE.k1Y,
    scale: CIRCUIT_COMPONENT_SCALE.forwardContactor,
  },
  reverseContactor: {
    x: NODE.k2X - 10,
    y: NODE.k2Y,
    scale: CIRCUIT_COMPONENT_SCALE.reverseContactor,
  },
  overload: {
    x: NODE.overloadX - 66,
    y: NODE.overloadY,
    scale: CIRCUIT_COMPONENT_SCALE.overload,
  },
  motor: {
    x: DERIVED.motorSymbolX,
    y: NODE.motorY,
    scale: CIRCUIT_COMPONENT_SCALE.motor,
  },
};

const ARRAY = {
  k1LowerXs: DERIVED.k1PhaseXs.map((x) => x - 10),
  k2LowerXs: DERIVED.k2PhaseXs.map((x) => x - 10),
  reverseFeedYs: [DERIVED.feedY, DERIVED.feedY + 30, DERIVED.feedY + 60],
  outputLinkYs: [
    DERIVED.k1BottomY + 18,
    DERIVED.k1BottomY + 40,
    DERIVED.k1BottomY + 62,
  ],
} as const;

const PATH = {
  source: DERIVED.phaseXs.map(
    (x, index) =>
      `M ${NODE.sourceStartX} ${NODE.railYs[index]} L ${x} ${NODE.railYs[index]} L ${x} ${DERIVED.breakerTopY}`,
  ),

  breakerOutput: DERIVED.phaseXs.map(
    (x) => `M ${x} ${DERIVED.breakerBottomY} L ${x} ${DERIVED.feedY}`,
  ),

  k1Feed: DERIVED.k1PhaseXs.map(
    (x) => `M ${x - 10} ${DERIVED.feedY} L ${x - 10} ${DERIVED.k1TopY}`,
  ),

  k2Feed: [
    `M ${DERIVED.phaseXs[0]} ${DERIVED.feedY} L ${DERIVED.phaseXs[0]} ${
      DERIVED.feedY - 20
    } L ${DERIVED.k2PhaseXs[2] - 10} ${DERIVED.feedY - 20} L ${
      DERIVED.k2PhaseXs[2] - 10
    } ${NODE.k2Y}`,

    `M ${DERIVED.phaseXs[1]} ${DERIVED.feedY} L ${DERIVED.phaseXs[1]} ${
      ARRAY.reverseFeedYs[1] - 20
    } L ${DERIVED.k2PhaseXs[1] - 10} ${ARRAY.reverseFeedYs[1] - 20} L ${
      DERIVED.k2PhaseXs[1] - 10
    } ${NODE.k2Y}`,

    `M ${DERIVED.phaseXs[2]} ${DERIVED.feedY} L ${DERIVED.phaseXs[2]} ${
      ARRAY.reverseFeedYs[2] - 20
    } L ${DERIVED.k2PhaseXs[0] - 10} ${ARRAY.reverseFeedYs[2] - 20} L ${
      DERIVED.k2PhaseXs[0] - 10
    } ${NODE.k2Y}`,
  ],

  forwardDrop: [
    `M ${ARRAY.k1LowerXs[2]} ${DERIVED.k1BottomY} L ${ARRAY.k1LowerXs[2]} ${DERIVED.overloadTopWireY}`,
    `M ${ARRAY.k1LowerXs[1]} ${DERIVED.k1BottomY} L ${ARRAY.k1LowerXs[1]} ${DERIVED.overloadTopWireY}`,
    `M ${ARRAY.k1LowerXs[0]} ${DERIVED.k1BottomY} L ${ARRAY.k1LowerXs[0]} ${DERIVED.overloadTopWireY}`,
  ],

  reverseOutput: [
    `M ${ARRAY.k2LowerXs[0]} ${DERIVED.k2BottomY} L ${ARRAY.k2LowerXs[0]} ${ARRAY.outputLinkYs[0]} L ${ARRAY.k1LowerXs[2]} ${ARRAY.outputLinkYs[0]} L ${ARRAY.k1LowerXs[2]} ${DERIVED.overloadTopWireY}`,
    `M ${ARRAY.k2LowerXs[1]} ${DERIVED.k2BottomY} L ${ARRAY.k2LowerXs[1]} ${ARRAY.outputLinkYs[1]} L ${ARRAY.k1LowerXs[0]} ${ARRAY.outputLinkYs[1]} L ${ARRAY.k1LowerXs[0]} ${DERIVED.overloadTopWireY}`,
    `M ${ARRAY.k2LowerXs[2]} ${DERIVED.k2BottomY} L ${ARRAY.k2LowerXs[2]} ${ARRAY.outputLinkYs[2]} L ${ARRAY.k1LowerXs[1]} ${ARRAY.outputLinkYs[2]} L ${ARRAY.k1LowerXs[1]} ${DERIVED.overloadTopWireY}`,
  ],

  motorFeed: DERIVED.overloadBottomXs.map(
    (x, index) =>
      `M ${x} ${DERIVED.overloadBottomY} L ${DERIVED.motorTopXs[index]} ${DERIVED.motorFeedEndY}`,
  ),
} as const;

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function phaseColor(index: number, active: boolean) {
  return active ? STYLE.phaseActive[index] : STYLE.phaseMuted[index];
}

function PhaseLine({
  x1,
  y1,
  x2,
  y2,
  index,
  active,
  width = BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  index: number;
  active: boolean;
  width?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={phaseColor(index, active)}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function PhaseDot({
  cx,
  cy,
  index,
  active,
  r = 4.6,
}: {
  cx: number;
  cy: number;
  index: number;
  active: boolean;
  r?: number;
}) {
  return <circle cx={cx} cy={cy} r={r} fill={phaseColor(index, active)} />;
}

function ActivePath({
  d,
  active,
  fault = false,
  width = ACTIVE_WIRE_WIDTH,
}: {
  d: string;
  active: boolean;
  fault?: boolean;
  width?: number;
}) {
  if (!active) return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={fault ? STYLE.faultFlow : STYLE.activeFlow}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.94}
    />
  );
}

function ElectronFlow({
  path,
  active,
  fault = false,
  duration = 2.6,
}: {
  path: string;
  active: boolean;
  fault?: boolean;
  duration?: number;
}) {
  if (!active) return null;

  return (
    <>
      {FLOW.stagger.map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r={FLOW.electronRadius}
          fill={fault ? STYLE.electronFault : STYLE.electron}
          filter="url(#electron-glow-rev-fwd-power)"
        >
          <animateMotion
            path={path}
            dur={`${duration}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </circle>
      ))}
    </>
  );
}

function SourceRails({ mccbOn }: { mccbOn: boolean }) {
  return (
    <>
      {["L1", "L2", "L3"].map((label, index) => (
        <text
          key={label}
          x={NODE.sourceLabelsX}
          y={NODE.railYs[index] + 6}
          fontSize="17"
          fontWeight="700"
          fill={STYLE.text}
        >
          {label}
        </text>
      ))}

      {NODE.railYs.map((y, index) => (
        <g key={`rail-${y}`}>
          <PhaseLine
            x1={NODE.sourceStartX}
            y1={y}
            x2={DERIVED.phaseXs[index]}
            y2={y}
            index={index}
            active={mccbOn}
          />

          <PhaseLine
            x1={DERIVED.phaseXs[index]}
            y1={y}
            x2={DERIVED.phaseXs[index]}
            y2={DERIVED.breakerTopY}
            index={index}
            active={mccbOn}
          />

          <PhaseDot
            cx={DERIVED.phaseXs[index]}
            cy={y}
            index={index}
            active={mccbOn}
          />
        </g>
      ))}
    </>
  );
}

function BreakerSection({
  mccbOn,
  showLabels,
}: {
  mccbOn: boolean;
  showLabels: boolean;
}) {
  return (
    <>
      <CircuitBreaker3P
        x={COMPONENT.breaker.x}
        y={COMPONENT.breaker.y}
        scale={COMPONENT.breaker.scale}
        on={mccbOn}
        label=""
        standalone={false}
        orientation="vertical"
      />

      {showLabels && (
        <>
          <text
            x="74"
            y={NODE.breakerY + 98}
            fontSize="13"
            fontWeight="700"
            fill={STYLE.text}
          >
            3P MCCB
          </text>
          <text
            x="74"
            y={NODE.breakerY + 116}
            fontSize="13"
            fontWeight="700"
            fill={STYLE.text}
          >
            / MCCB
          </text>
        </>
      )}

      {DERIVED.phaseXs.map((x, index) => (
        <g key={`breaker-out-${x}`}>
          <PhaseLine
            x1={x}
            y1={DERIVED.breakerBottomY}
            x2={x}
            y2={DERIVED.feedY}
            index={index}
            active={mccbOn}
          />

          <PhaseDot
            cx={x}
            cy={DERIVED.breakerBottomY}
            index={index}
            active={mccbOn}
          />
        </g>
      ))}
    </>
  );
}

function ForwardFeedLayer({
  mccbOn,
  forwardPowerActive,
  showFlow,
}: {
  mccbOn: boolean;
  forwardPowerActive: boolean;
  showFlow: boolean;
}) {
  return (
    <>
      {DERIVED.k1PhaseXs.map((x, index) => (
        <g key={`k1-feed-${x}`}>
          <PhaseLine
            x1={x - 10}
            y1={DERIVED.feedY}
            x2={x - 10}
            y2={DERIVED.k1TopY}
            index={index}
            active={mccbOn}
          />

          <ActivePath
            d={PATH.k1Feed[index]}
            active={showFlow && forwardPowerActive}
          />
          <ElectronFlow
            path={PATH.k1Feed[index]}
            active={showFlow && forwardPowerActive}
            duration={2 + index * 0.14}
          />
        </g>
      ))}
    </>
  );
}

function ReverseFeedLayer({
  mccbOn,
  reversePowerActive,
  showFlow,
}: {
  mccbOn: boolean;
  reversePowerActive: boolean;
  showFlow: boolean;
}) {
  return (
    <>
      <PhaseLine
        x1={DERIVED.phaseXs[0]}
        y1={DERIVED.feedY - 20}
        x2={DERIVED.k2PhaseXs[2] - 10}
        y2={DERIVED.feedY - 20}
        index={0}
        active={mccbOn}
      />
      <PhaseLine
        x1={DERIVED.k2PhaseXs[2] - 10}
        y1={DERIVED.feedY - 20}
        x2={DERIVED.k2PhaseXs[2] - 10}
        y2={NODE.k2Y}
        index={0}
        active={mccbOn}
      />
      <ActivePath d={PATH.k2Feed[0]} active={showFlow && reversePowerActive} />
      <ElectronFlow
        path={PATH.k2Feed[0]}
        active={showFlow && reversePowerActive}
        duration={2.1}
      />

      <PhaseLine
        x1={DERIVED.phaseXs[1]}
        y1={DERIVED.feedY}
        x2={DERIVED.phaseXs[1]}
        y2={ARRAY.reverseFeedYs[1]}
        index={1}
        active={mccbOn}
      />
      <PhaseLine
        x1={DERIVED.phaseXs[1]}
        y1={ARRAY.reverseFeedYs[1] - 20}
        x2={DERIVED.k2PhaseXs[1] - 10}
        y2={ARRAY.reverseFeedYs[1] - 20}
        index={1}
        active={mccbOn}
      />
      <PhaseLine
        x1={DERIVED.k2PhaseXs[1] - 10}
        y1={ARRAY.reverseFeedYs[1] - 20}
        x2={DERIVED.k2PhaseXs[1] - 10}
        y2={NODE.k2Y}
        index={1}
        active={mccbOn}
      />
      <ActivePath d={PATH.k2Feed[1]} active={showFlow && reversePowerActive} />
      <ElectronFlow
        path={PATH.k2Feed[1]}
        active={showFlow && reversePowerActive}
        duration={2.28}
      />

      <PhaseLine
        x1={DERIVED.phaseXs[2]}
        y1={DERIVED.feedY}
        x2={DERIVED.phaseXs[2]}
        y2={ARRAY.reverseFeedYs[2]}
        index={2}
        active={mccbOn}
      />
      <PhaseLine
        x1={DERIVED.phaseXs[2]}
        y1={ARRAY.reverseFeedYs[2] - 20}
        x2={DERIVED.k2PhaseXs[0] - 10}
        y2={ARRAY.reverseFeedYs[2] - 20}
        index={2}
        active={mccbOn}
      />
      <PhaseLine
        x1={DERIVED.k2PhaseXs[0] - 10}
        y1={ARRAY.reverseFeedYs[2] - 20}
        x2={DERIVED.k2PhaseXs[0] - 10}
        y2={NODE.k2Y}
        index={2}
        active={mccbOn}
      />
      <ActivePath d={PATH.k2Feed[2]} active={showFlow && reversePowerActive} />
      <ElectronFlow
        path={PATH.k2Feed[2]}
        active={showFlow && reversePowerActive}
        duration={2.46}
      />
    </>
  );
}

function ContactorsSection({
  forwardPowerActive,
  reversePowerActive,
  showLabels,
}: {
  forwardPowerActive: boolean;
  reversePowerActive: boolean;
  showLabels: boolean;
}) {
  return (
    <>
      <ContactorPowerContacts3P
        x={COMPONENT.forwardContactor.x}
        y={COMPONENT.forwardContactor.y}
        scale={COMPONENT.forwardContactor.scale}
        closed={forwardPowerActive}
        label=""
        showCoilSymbol={false}
        standalone={false}
      />

      <ContactorPowerContacts3P
        x={COMPONENT.reverseContactor.x}
        y={COMPONENT.reverseContactor.y}
        scale={COMPONENT.reverseContactor.scale}
        closed={reversePowerActive}
        label=""
        showCoilSymbol={false}
        standalone={false}
      />

      {showLabels && (
        <>
          <text
            x="124"
            y={NODE.k1Y + 56}
            fontSize="14"
            fontWeight="700"
            fill={STYLE.reverse}
          >
            FORWARD
          </text>
          <text
            x="206"
            y={NODE.k1Y + 56}
            fontSize="14"
            fontWeight="700"
            fill={STYLE.text}
          >
            K1
          </text>
          <text
            x="446"
            y={NODE.k2Y + 56}
            fontSize="14"
            fontWeight="700"
            fill={STYLE.text}
          >
            K2
          </text>
          <text
            x="512"
            y={NODE.k2Y + 56}
            fontSize="14"
            fontWeight="700"
            fill={STYLE.reverse}
          >
            REVERSE
          </text>
        </>
      )}
    </>
  );
}

function ReverseOutputLinkLayer({
  mccbOn,
  reversePowerActive,
  showFlow,
}: {
  mccbOn: boolean;
  reversePowerActive: boolean;
  showFlow: boolean;
}) {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <g key={`reverse-output-${index}`}>
          <PhaseLine
            x1={
              [ARRAY.k1LowerXs[2], ARRAY.k1LowerXs[1], ARRAY.k1LowerXs[0]][
                index
              ]
            }
            y1={DERIVED.k1BottomY}
            x2={
              [ARRAY.k1LowerXs[2], ARRAY.k1LowerXs[1], ARRAY.k1LowerXs[0]][
                index
              ]
            }
            y2={ARRAY.outputLinkYs[index]}
            index={[2, 1, 0][index]}
            active={mccbOn}
          />

          <PhaseLine
            x1={ARRAY.k2LowerXs[index]}
            y1={DERIVED.k2BottomY}
            x2={ARRAY.k2LowerXs[index]}
            y2={ARRAY.outputLinkYs[index]}
            index={[2, 1, 0][index]}
            active={mccbOn}
          />

          <PhaseLine
            x1={
              [ARRAY.k1LowerXs[2], ARRAY.k1LowerXs[0], ARRAY.k1LowerXs[1]][
                index
              ]
            }
            y1={ARRAY.outputLinkYs[index]}
            x2={ARRAY.k2LowerXs[index]}
            y2={ARRAY.outputLinkYs[index]}
            index={[2, 1, 0][index]}
            active={mccbOn}
          />

          <ActivePath
            d={PATH.reverseOutput[index]}
            active={showFlow && reversePowerActive}
          />
          <ElectronFlow
            path={PATH.reverseOutput[index]}
            active={showFlow && reversePowerActive}
            duration={2.2 + index * 0.18}
          />
        </g>
      ))}
    </>
  );
}

function ForwardDropLayer({
  mccbOn,
  forwardPowerActive,
  showFlow,
}: {
  mccbOn: boolean;
  forwardPowerActive: boolean;
  showFlow: boolean;
}) {
  const xs = [ARRAY.k1LowerXs[2], ARRAY.k1LowerXs[1], ARRAY.k1LowerXs[0]];
  const phaseIndex = [2, 1, 0];

  return (
    <>
      {PATH.forwardDrop.map((path, index) => (
        <g key={`forward-drop-${index}`}>
          <PhaseLine
            x1={xs[index]}
            y1={DERIVED.k1BottomY}
            x2={xs[index]}
            y2={DERIVED.overloadTopWireY}
            index={phaseIndex[index]}
            active={mccbOn}
          />
          <ActivePath d={path} active={showFlow && forwardPowerActive} />
          <ElectronFlow
            path={path}
            active={showFlow && forwardPowerActive}
            duration={2.05 + index * 0.12}
          />
        </g>
      ))}
    </>
  );
}

function OverloadAndMotorSection({
  mccbOn,
  overloadTripped,
  forwardPowerActive,
  reversePowerActive,
  showLabels,
  showFlow,
  motorStateLabel,
  motorStateTone,
  spinDuration,
  direction,
}: {
  mccbOn: boolean;
  overloadTripped: boolean;
  forwardPowerActive: boolean;
  reversePowerActive: boolean;
  showLabels: boolean;
  showFlow: boolean;
  motorStateLabel: string;
  motorStateTone: string;
  spinDuration: string;
  direction: DirectionState;
}) {
  const motorPowerActive = forwardPowerActive || reversePowerActive;

  return (
    <>
      <ThermalOverloadRelay3P
        x={COMPONENT.overload.x}
        y={COMPONENT.overload.y}
        scale={COMPONENT.overload.scale}
        tripped={overloadTripped}
        label=""
        standalone={false}
      />

      {showLabels && (
        <text
          x="94"
          y={NODE.overloadY + 54}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.text}
        >
          O/L
        </text>
      )}

      {DERIVED.overloadBottomXs.map((x, index) => (
        <g key={`motor-feed-${x}`}>
          <PhaseLine
            x1={x}
            y1={DERIVED.overloadBottomY}
            x2={DERIVED.motorTopXs[index]}
            y2={NODE.motorY}
            index={index}
            active={mccbOn && !overloadTripped && motorPowerActive}
          />

          <ActivePath
            d={PATH.motorFeed[index]}
            active={showFlow && motorPowerActive}
          />

          <ElectronFlow
            path={PATH.motorFeed[index]}
            active={showFlow && motorPowerActive}
            duration={2.2 + index * 0.1}
          />
        </g>
      ))}

      <ACMotor3P
        x={COMPONENT.motor.x}
        y={COMPONENT.motor.y}
        scale={COMPONENT.motor.scale}
        label=""
        standalone={false}
      />

      <g
        transform={`translate(${DERIVED.motorCenterX - 6}, ${NODE.motorY + 66})`}
      >
        <rect
          x="-120"
          y="0"
          rx="11"
          ry="11"
          width="84"
          height="22"
          fill="#ffffff"
          stroke={motorStateTone}
          strokeWidth="1"
        />
        <text
          x="-80"
          y="14.5"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={motorStateTone}
        >
          {motorStateLabel}
        </text>
      </g>

      {motorPowerActive && showFlow && (
        <g
          transform={`translate(${DERIVED.motorCenterX}, ${DERIVED.motorCenterY})`}
        >
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="none"
            stroke={direction === "reverse" ? STYLE.reverse : STYLE.forward}
            strokeWidth="2"
            opacity="0.34"
          />
          <path
            d="M0 -14 L6 0 L0 -2 L-6 0 Z"
            fill={direction === "reverse" ? STYLE.reverse : STYLE.forward}
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to={`${direction === "reverse" ? -360 : 360} 0 0`}
              dur={spinDuration}
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}
    </>
  );
}

function FlowLayer({
  showFlow,
  powerCurrentActive,
  faultOpenActive,
}: {
  showFlow: boolean;
  powerCurrentActive: boolean;
  faultOpenActive: boolean;
}) {
  if (!showFlow) return null;

  const sourceFlowActive = powerCurrentActive || faultOpenActive;

  return (
    <>
      {PATH.source.map((path, index) => (
        <g key={`source-flow-${index}`}>
          <ActivePath
            d={path}
            active={sourceFlowActive}
            fault={faultOpenActive}
          />
          <ElectronFlow
            path={path}
            active={sourceFlowActive}
            fault={faultOpenActive}
            duration={2.4 + index * 0.18}
          />
        </g>
      ))}

      {PATH.breakerOutput.map((path, index) => (
        <g key={`breaker-flow-${index}`}>
          <ActivePath
            d={path}
            active={sourceFlowActive}
            fault={faultOpenActive}
          />
          <ElectronFlow
            path={path}
            active={sourceFlowActive}
            fault={faultOpenActive}
            duration={2.2 + index * 0.16}
          />
        </g>
      ))}
    </>
  );
}

export default function ReverseForwardPowerDiagram({
  className = "",
  mccbOn = true,
  overloadTripped = false,
  motorRunning = false,
  direction = "idle",
  loadPercent = 45,
  viewMode = "fit",
  showLabels = true,
  showFlow = true,
}: ReverseForwardPowerDiagramProps) {
  const forwardPowerActive =
    mccbOn && !overloadTripped && motorRunning && direction === "forward";

  const reversePowerActive =
    mccbOn && !overloadTripped && motorRunning && direction === "reverse";

  const powerCurrentActive = forwardPowerActive || reversePowerActive;

  const faultOpenActive = mccbOn && overloadTripped;

  const powerAvailable = mccbOn && !overloadTripped;

  const motorStateLabel = faultOpenActive
    ? "Trip Open"
    : reversePowerActive
      ? "Reverse"
      : forwardPowerActive
        ? "Forward"
        : powerAvailable
          ? "Ready"
          : "Stopped";

  const motorStateTone = faultOpenActive
    ? STYLE.faultFlow
    : reversePowerActive
      ? STYLE.reverse
      : forwardPowerActive
        ? STYLE.forward
        : STYLE.muted;

  const safeLoadPercent = Number.isFinite(loadPercent) ? loadPercent : 45;

  const spinDuration =
    reversePowerActive || forwardPowerActive
      ? `${Math.max(0.8, 1.5 - Math.min(0.5, safeLoadPercent / 220))}s`
      : "2.8s";

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className={`power-diagram-layout ${className}`}>
      <div
        className={`power-diagram-shell ${
          viewMode === "actual" ? "is-actual-scale" : ""
        }`}
      >
        <div
          className={`power-diagram-scroll ${
            viewMode === "actual" ? "is-scrollable" : ""
          }`}
        >
          <svg
            viewBox={VIEW_BOX}
            className="power-diagram-svg power-diagram-svg--rev-fwd"
            style={
              viewMode === "actual"
                ? { width: `${VIEW_BOX_WIDTH}px`, maxWidth: "none" }
                : undefined
            }
            role="img"
            aria-label="Reverse-forward power circuit"
          >
            <defs>
              <filter
                id="electron-glow-rev-fwd-power"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              width={VIEW_BOX_WIDTH}
              height={VIEW_BOX_HEIGHT}
              fill={STYLE.background}
            />

            <g
              transform={`translate(${CIRCUIT_OFFSET.x} ${CIRCUIT_OFFSET.y}) ${canvasTransform ?? ""}`}
            >
              <SourceRails mccbOn={mccbOn} />

              <FlowLayer
                showFlow={showFlow}
                powerCurrentActive={powerCurrentActive}
                faultOpenActive={faultOpenActive}
              />

              <BreakerSection mccbOn={mccbOn} showLabels={showLabels} />

              <ForwardFeedLayer
                mccbOn={mccbOn}
                forwardPowerActive={forwardPowerActive}
                showFlow={showFlow}
              />

              <ReverseFeedLayer
                mccbOn={mccbOn}
                reversePowerActive={reversePowerActive}
                showFlow={showFlow}
              />

              <ContactorsSection
                forwardPowerActive={forwardPowerActive}
                reversePowerActive={reversePowerActive}
                showLabels={showLabels}
              />

              <ReverseOutputLinkLayer
                mccbOn={mccbOn}
                reversePowerActive={reversePowerActive}
                showFlow={showFlow}
              />

              <ForwardDropLayer
                mccbOn={mccbOn}
                forwardPowerActive={forwardPowerActive}
                showFlow={showFlow}
              />

              <OverloadAndMotorSection
                mccbOn={mccbOn}
                overloadTripped={overloadTripped}
                forwardPowerActive={forwardPowerActive}
                reversePowerActive={reversePowerActive}
                showLabels={showLabels}
                showFlow={showFlow}
                motorStateLabel={motorStateLabel}
                motorStateTone={motorStateTone}
                spinDuration={spinDuration}
                direction={direction}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
