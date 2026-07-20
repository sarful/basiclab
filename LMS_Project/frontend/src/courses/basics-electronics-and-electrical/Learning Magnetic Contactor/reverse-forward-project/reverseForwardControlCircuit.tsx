"use client";

import NormallyCloseContactSymbol from "../../../../library/contacts/NormallyCloseContactSymbol";
import NormallyOpenContactSymbol from "../../../../library/contacts/NormallyOpenContactSymbol";
import ThermalOverloadNC from "../../../../library/protection/ThermalOverloadNC";
import BackgroundPixelGred from "../../Project/library/background_pixel_gred";
import PushButtonNC from "../../Project/library/buttons/PushButtonNC";
import PushButtonNO from "../../Project/library/buttons/PushButtonNO";
import ContactorCoil from "../../Project/library/contactors/ContactorCoil";
import PilotLight from "../../Project/library/indicators/PilotLight";
import MCBControl2P from "../../Project/library/protection/MCBControl2P";

type ReverseForwardControlCircuitProps = {
  className?: string;
  mcbOn?: boolean;
  overloadTripped?: boolean;
  motorRunning?: boolean;
  direction?: "idle" | "forward" | "reverse";
  stopPressed?: boolean;
  forwardStartPressed?: boolean;
  reverseStartPressed?: boolean;
  componentStateBadges?: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }>;
  viewMode?: "fit" | "actual";
  showLabels?: boolean;
  showFlow?: boolean;
};

type WireState = "active" | "inactive" | "fault";

const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 956;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  mcb: 2,
  overload: 2,
  offButton: 2,
  forwardButton: 2,
  reverseButton: 2,
  k1Hold: 2,
  k2Hold: 2,
  k1Nc: 2,
  k2Nc: 2,
  k1Coil: 2,
  k2Coil: 2,
  k1Lamp: 2,
  k2Lamp: 2,
} as const;

const BASE_WIRE_WIDTH = 2;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  live: "#8b4513",
  neutral: "#111827",
  active: "#16a34a",
  fault: "#ef4444",
  electron: "#fde047",
  symbol: "#111827",
  contactBlue: "#2563eb",
  boardBg: "#ffffff",
} as const;

const BOARD = {
  x: 28,
  y: 28,
  width: 704,
  height: 900,
} as const;

const NODE = {
  neutralLineY: 58,
  liveLineY: 98,
  supplyLabelX: 18,
  supplyStartX: 44,
  supplyEndX: 132,

  mcbX: 102,
  mcbY: 38,
  overloadX: 179,
  overloadY: 160,

  offButtonX: 179,
  offButtonY: 280,
  forwardButtonX: 179,
  forwardButtonY: 434,
  reverseButtonX: 419,
  reverseButtonY: 434,

  k1HoldX: 299,
  k2HoldX: 539,

  k2NcX: 179,
  k2NcY: 584,
  k1NcX: 419,
  k1NcY: 584,

  k1CoilX: 209,
  k1CoilY: 704,
  k2CoilX: 449,
  k2CoilY: 704,

  k1LampX: 304,
  k1LampY: 705,
  k2LampX: 544,
  k2LampY: 705,

  neutralDropX: 662,
  returnBusY: 842,
} as const;

const DERIVED = {
  mcbLowerOutputX: NODE.mcbX + 100,
  mcbLowerOutputY: NODE.mcbY + 60,

  overloadTopTerminalX: NODE.overloadX + 50,
  overloadBottomY: 234,

  offBottomY: 384,
  forwardBottomY: 534,

  k1HoldTerminalX: NODE.k1HoldX + 50,
  k2HoldTerminalX: NODE.k2HoldX + 50,

  reverseButtonTerminalX: NODE.reverseButtonX + 50,
  reverseBranchFeedY: 404,

  k1NcBottomY: 684,
  k2NcBottomY: 684,

  k1CoilA1X: NODE.k1CoilX + 20,
  k1CoilA2Y: NODE.k1CoilY + 93.62,

  k2CoilA1X: NODE.k2CoilX + 20,
  k2CoilA2Y: NODE.k2CoilY + 93.62,

  k1LampFeedX: NODE.k1LampX + 10,
  k1LampReturnX: NODE.k1LampX + 20,
  k1LampReturnY: NODE.k1LampY + 50,

  k2LampFeedX: NODE.k2LampX + 10,
  k2LampReturnX: NODE.k2LampX + 20,
  k2LampReturnY: NODE.k2LampY + 50,
} as const;

const COMPONENT = {
  mcb: { x: NODE.mcbX, y: NODE.mcbY, scale: CIRCUIT_COMPONENT_SCALE.mcb },
  overload: {
    x: NODE.overloadX,
    y: NODE.overloadY,
    scale: CIRCUIT_COMPONENT_SCALE.overload,
  },
  offButton: {
    x: NODE.offButtonX,
    y: NODE.offButtonY,
    scale: CIRCUIT_COMPONENT_SCALE.offButton,
  },
  forwardButton: {
    x: NODE.forwardButtonX,
    y: NODE.forwardButtonY,
    scale: CIRCUIT_COMPONENT_SCALE.forwardButton,
  },
  reverseButton: {
    x: NODE.reverseButtonX,
    y: NODE.reverseButtonY,
    scale: CIRCUIT_COMPONENT_SCALE.reverseButton,
  },
  k1Hold: {
    x: NODE.k1HoldX,
    y: NODE.forwardButtonY,
    scale: CIRCUIT_COMPONENT_SCALE.k1Hold,
  },
  k2Hold: {
    x: NODE.k2HoldX,
    y: NODE.reverseButtonY,
    scale: CIRCUIT_COMPONENT_SCALE.k2Hold,
  },
  k1Nc: { x: NODE.k1NcX, y: NODE.k1NcY, scale: CIRCUIT_COMPONENT_SCALE.k1Nc },
  k2Nc: { x: NODE.k2NcX, y: NODE.k2NcY, scale: CIRCUIT_COMPONENT_SCALE.k2Nc },
  k1Coil: {
    x: NODE.k1CoilX,
    y: NODE.k1CoilY,
    scale: CIRCUIT_COMPONENT_SCALE.k1Coil,
  },
  k2Coil: {
    x: NODE.k2CoilX,
    y: NODE.k2CoilY,
    scale: CIRCUIT_COMPONENT_SCALE.k2Coil,
  },
  k1Lamp: {
    x: NODE.k1LampX,
    y: NODE.k1LampY,
    scale: CIRCUIT_COMPONENT_SCALE.k1Lamp,
  },
  k2Lamp: {
    x: NODE.k2LampX,
    y: NODE.k2LampY,
    scale: CIRCUIT_COMPONENT_SCALE.k2Lamp,
  },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const CONTACT_NATIVE_HEIGHT = 50;
const AUX_CONTACT_TOP_X = 10;

const PATH = {
  neutralTop: `M ${DERIVED.mcbLowerOutputX} ${NODE.neutralLineY} H ${NODE.neutralDropX}`,
  neutralDrop: `M ${NODE.neutralDropX} ${NODE.neutralLineY} V ${NODE.returnBusY}`,

  liveSupply: `M ${DERIVED.mcbLowerOutputX} ${DERIVED.mcbLowerOutputY} H ${DERIVED.overloadTopTerminalX} V ${NODE.overloadY}`,
  overloadToStop: `M ${DERIVED.overloadTopTerminalX} ${DERIVED.overloadBottomY - 30} V ${NODE.offButtonY}`,
  stopToForward: `M ${DERIVED.overloadTopTerminalX} ${DERIVED.offBottomY - 32} V ${NODE.forwardButtonY}`,

  forwardHold: `M ${DERIVED.overloadTopTerminalX} ${NODE.forwardButtonY - 30} H ${DERIVED.k1HoldTerminalX} V ${DERIVED.forwardBottomY - 30} H ${DERIVED.overloadTopTerminalX}`,
  reverseFeed: `M ${DERIVED.k1HoldTerminalX} ${DERIVED.reverseBranchFeedY} H ${DERIVED.reverseButtonTerminalX}`,
  reverseHold: `M ${DERIVED.reverseButtonTerminalX} ${NODE.reverseButtonY - 30} H ${DERIVED.k2HoldTerminalX} V ${DERIVED.forwardBottomY - 30} H ${DERIVED.reverseButtonTerminalX}`,

  forwardToK2Nc: `M ${DERIVED.overloadTopTerminalX} ${DERIVED.forwardBottomY - 30} V ${NODE.k2NcY}`,
  forwardToK1Coil: `M ${DERIVED.overloadTopTerminalX} ${DERIVED.k2NcBottomY - 30} V ${NODE.k1CoilY} H ${DERIVED.k1CoilA1X}`,

  reverseToK1Nc: `M ${DERIVED.reverseButtonTerminalX} ${DERIVED.forwardBottomY - 30} V ${NODE.k1NcY}`,
  reverseToK2Coil: `M ${DERIVED.reverseButtonTerminalX} ${DERIVED.k1NcBottomY - 30} V ${NODE.k2CoilY} H ${DERIVED.k2CoilA1X}`,

  k1LampFeed: `M ${DERIVED.overloadTopTerminalX} ${NODE.k1CoilY} H ${DERIVED.k1LampFeedX + 10}`,
  k2LampFeed: `M ${DERIVED.reverseButtonTerminalX} ${NODE.k2CoilY} H ${DERIVED.k2LampFeedX + 10}`,

  k1Return: `M ${DERIVED.k1CoilA1X} ${DERIVED.k1CoilA2Y} V ${NODE.returnBusY} H ${NODE.neutralDropX} V ${NODE.neutralLineY}`,
  k1LampReturn: `M ${DERIVED.k1LampReturnX} ${DERIVED.k1LampReturnY} V ${NODE.returnBusY}`,
  k2Return: `M ${DERIVED.k2CoilA1X} ${DERIVED.k2CoilA2Y} V ${NODE.returnBusY} H ${NODE.neutralDropX} V ${NODE.neutralLineY}`,
  k2LampReturn: `M ${DERIVED.k2LampReturnX} ${DERIVED.k2LampReturnY} V ${NODE.returnBusY}`,
} as const;

const LABEL = {
  neutral: { x: NODE.supplyLabelX, y: NODE.neutralLineY + 7 },
  live: { x: NODE.supplyLabelX, y: NODE.liveLineY + 7 },
  mcb: { x: NODE.mcbX + 24, y: NODE.mcbY + 82 },
  overload: { x: 66, y: NODE.overloadY + 86 },
  off: { x: 62, y: NODE.offButtonY + 82 },
  forwardOn: { x: 58, y: NODE.forwardButtonY + 80 },
  forward: { x: 58, y: NODE.forwardButtonY + 98 },
  reverseOn: { x: 382, y: NODE.reverseButtonY + 80 },
  reverse: { x: 382, y: NODE.reverseButtonY + 98 },
  k1Hold: { x: 262, y: NODE.forwardButtonY + 80 },
  k2Hold: { x: 502, y: NODE.reverseButtonY + 80 },
  k2Nc: { x: 104, y: NODE.k2NcY + 86 },
  k1Nc: { x: 344, y: NODE.k1NcY + 86 },
} as const;

const BADGE_ANCHOR: Record<
  string,
  { x: number; y: number; width: number; height: number }
> = {
  mcb: { x: 260, y: 68, width: 84, height: 30 },
  ol: { x: 246, y: 174, width: 118, height: 30 },
  off: { x: 246, y: 292, width: 100, height: 30 },
  fwd: { x: 60, y: 446, width: 92, height: 30 },
  rev: { x: 448, y: 446, width: 92, height: 30 },
  "k2-nc": { x: 78, y: 592, width: 96, height: 30 },
  "k1-nc": { x: 454, y: 592, width: 96, height: 30 },
  k1: { x: 166, y: 710, width: 108, height: 30 },
  k2: { x: 406, y: 710, width: 108, height: 30 },
  "k1-hold": { x: 252, y: 438, width: 100, height: 30 },
  "k2-hold": { x: 492, y: 438, width: 100, height: 30 },
};

const TONE_STYLE = {
  neutral: { fill: "#f8fafc", stroke: "#cbd5e1", text: "#475569" },
  active: { fill: "#ecfdf5", stroke: "#86efac", text: "#166534" },
  fault: { fill: "#fef2f2", stroke: "#fca5a5", text: "#b91c1c" },
} as const;

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function getVerticalContactScale(topY: number, bottomY: number) {
  return (bottomY - topY) / CONTACT_NATIVE_HEIGHT;
}

function getAnchoredSymbolPosition(
  anchorX: number,
  topY: number,
  scale: number,
  topWireLocalX: number,
) {
  return {
    x: anchorX - topWireLocalX * scale,
    y: topY,
  };
}

function resolveWireColor(state: WireState) {
  if (state === "active") return STYLE.active;
  if (state === "fault") return STYLE.fault;
  return STYLE.live;
}

function StaticLine({
  x1,
  y1,
  x2,
  y2,
  stroke = STYLE.neutral,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
    />
  );
}

function ActiveLine({
  x1,
  y1,
  x2,
  y2,
  state,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  state: WireState;
}) {
  if (state === "inactive") return null;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={resolveWireColor(state)}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
    />
  );
}

function WirePath({ d, state = "inactive" }: { d: string; state?: WireState }) {
  return (
    <path
      d={d}
      stroke={resolveWireColor(state)}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function ElectronFlow({
  d,
  active,
  color = STYLE.electron,
}: {
  d: string;
  active: boolean;
  color?: string;
}) {
  if (!active) return null;

  return (
    <>
      {[0, 0.8, 1.6].map((begin) => (
        <circle key={`${d}-${begin}`} r="4" fill={color}>
          <animateMotion
            path={d}
            dur="2.4s"
            begin={`${begin}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </circle>
      ))}
    </>
  );
}

function StateBadges({
  badges,
}: {
  badges: NonNullable<
    ReverseForwardControlCircuitProps["componentStateBadges"]
  >;
}) {
  return (
    <>
      {badges.map((badge) => {
        const anchor = BADGE_ANCHOR[badge.key];
        if (!anchor) return null;

        const tone = TONE_STYLE[badge.tone];

        return (
          <g
            key={`badge-${badge.key}`}
            transform={`translate(${anchor.x}, ${anchor.y})`}
          >
            <rect
              width={anchor.width}
              height={anchor.height}
              rx={15}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth="1"
            />
            <text x={10} y={13} fontSize="8" fontWeight="800" fill={tone.text}>
              {badge.label}
            </text>
            <text
              x={10}
              y={23}
              fontSize="8.5"
              fontWeight="800"
              fill={tone.text}
            >
              {badge.state}
            </text>
          </g>
        );
      })}
    </>
  );
}

function SupplyRails({
  showLabels,
  neutralActive,
}: {
  showLabels: boolean;
  neutralActive: boolean;
}) {
  const neutralColor = neutralActive ? STYLE.active : STYLE.neutral;

  return (
    <>
      {showLabels && (
        <>
          <text
            x={LABEL.neutral.x}
            y={LABEL.neutral.y}
            fontSize="18"
            fontWeight="700"
            fill={STYLE.neutral}
          >
            N
          </text>
          <text
            x={LABEL.live.x}
            y={LABEL.live.y}
            fontSize="18"
            fontWeight="700"
            fill={STYLE.neutral}
          >
            L
          </text>
        </>
      )}

      <StaticLine
        x1={NODE.supplyStartX}
        y1={NODE.neutralLineY}
        x2={NODE.supplyEndX}
        y2={NODE.neutralLineY}
      />
      <StaticLine
        x1={NODE.supplyStartX}
        y1={NODE.liveLineY}
        x2={NODE.supplyEndX}
        y2={NODE.liveLineY}
        stroke={STYLE.live}
      />

      <StaticLine
        x1={DERIVED.mcbLowerOutputX}
        y1={NODE.neutralLineY}
        x2={NODE.neutralDropX}
        y2={NODE.neutralLineY}
        stroke={neutralColor}
      />
      <StaticLine
        x1={NODE.neutralDropX}
        y1={NODE.neutralLineY}
        x2={NODE.neutralDropX}
        y2={NODE.returnBusY}
        stroke={neutralColor}
      />
    </>
  );
}

function ProtectionSection({
  mcbOn,
  overloadTripped,
  supplyState,
  showLabels,
}: {
  mcbOn: boolean;
  overloadTripped: boolean;
  supplyState: WireState;
  showLabels: boolean;
}) {
  return (
    <>
      <MCBControl2P
        x={COMPONENT.mcb.x}
        y={COMPONENT.mcb.y}
        scale={COMPONENT.mcb.scale}
        on={mcbOn}
        label=""
        standalone={false}
        wireStroke={1}
        textSize={7}
      />

      {showLabels && (
        <text
          x={LABEL.mcb.x}
          y={LABEL.mcb.y}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={STYLE.fault}
        >
          MCB
        </text>
      )}

      <WirePath d={PATH.liveSupply} state={supplyState} />

      <ThermalOverloadNC
        x={COMPONENT.overload.x}
        y={COMPONENT.overload.y}
        scale={COMPONENT.overload.scale}
        tripped={overloadTripped}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.contactBlue}
        terminalA="95"
        terminalB="96"
        wireStroke={1}
        textSize={7}
        showTerminals
      />

      {showLabels && (
        <text
          x={LABEL.overload.x}
          y={LABEL.overload.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.fault}
        >
          O/L
        </text>
      )}
    </>
  );
}

function CommonControlPath({
  supplyState,
  showLabels,
  stopPressed,
}: {
  supplyState: WireState;
  showLabels: boolean;
  stopPressed: boolean;
}) {
  return (
    <>
      <WirePath d={PATH.overloadToStop} state={supplyState} />

      <PushButtonNC
        x={COMPONENT.offButton.x}
        y={COMPONENT.offButton.y}
        scale={COMPONENT.offButton.scale}
        pressed={stopPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={1}
        textSize={7}
        showTerminals
      />

      {showLabels && (
        <text
          x={LABEL.off.x}
          y={LABEL.off.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.fault}
        >
          OFF
        </text>
      )}
    </>
  );
}

function ForwardBranch({
  showLabels,
  forwardStartPressed,
  forwardHoldClosed,
  forwardHoldPathActive,
  k2InterlockClosed,
  forwardState,
  forwardActive,
}: {
  showLabels: boolean;
  forwardStartPressed: boolean;
  forwardHoldClosed: boolean;
  forwardHoldPathActive: boolean;
  k2InterlockClosed: boolean;
  forwardState: WireState;
  forwardActive: boolean;
}) {
  const holdTopY = NODE.forwardButtonY - 30;
  const holdBottomY = DERIVED.forwardBottomY - 30;
  const holdScale = getVerticalContactScale(holdTopY, holdBottomY);
  const k1HoldPosition = getAnchoredSymbolPosition(
    DERIVED.k1HoldTerminalX,
    holdTopY,
    holdScale,
    AUX_CONTACT_TOP_X,
  );
  const k2NcTopY = NODE.k2NcY;
  const k2NcBottomY = DERIVED.k2NcBottomY - 30;
  const k2NcScale = getVerticalContactScale(k2NcTopY, k2NcBottomY);
  const k2NcPosition = getAnchoredSymbolPosition(
    DERIVED.overloadTopTerminalX,
    k2NcTopY,
    k2NcScale,
    AUX_CONTACT_TOP_X,
  );
  const holdTerminalX = DERIVED.k1HoldTerminalX;

  return (
    <>
      <WirePath d={PATH.stopToForward} state={forwardState} />

      <PushButtonNO
        x={COMPONENT.forwardButton.x}
        y={COMPONENT.forwardButton.y}
        scale={COMPONENT.forwardButton.scale}
        pressed={forwardStartPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={1}
        textSize={7}
        showTerminals
      />

      <NormallyOpenContactSymbol
        x={k1HoldPosition.x}
        y={k1HoldPosition.y}
        scale={holdScale}
        closed={forwardHoldClosed}
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.contactBlue}
        strokeWidth={1.5}
        leftLabel="13"
        rightLabel="14"
      />

      <StaticLine
        x1={DERIVED.overloadTopTerminalX}
        y1={holdTopY}
        x2={holdTerminalX}
        y2={holdTopY}
        stroke={STYLE.live}
      />
      <StaticLine
        x1={DERIVED.overloadTopTerminalX}
        y1={holdBottomY}
        x2={holdTerminalX}
        y2={holdBottomY}
        stroke={STYLE.live}
      />
      <ActiveLine
        x1={DERIVED.overloadTopTerminalX}
        y1={holdTopY}
        x2={holdTerminalX}
        y2={holdTopY}
        state={forwardHoldPathActive ? "active" : "inactive"}
      />
      <ActiveLine
        x1={DERIVED.overloadTopTerminalX}
        y1={holdBottomY}
        x2={holdTerminalX}
        y2={holdBottomY}
        state={forwardHoldPathActive ? "active" : "inactive"}
      />
      <WirePath d={PATH.forwardToK2Nc} state={forwardState} />

      <NormallyCloseContactSymbol
        x={k2NcPosition.x}
        y={k2NcPosition.y}
        scale={k2NcScale}
        closed={k2InterlockClosed}
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.contactBlue}
        strokeWidth={1.5}
        leftLabel="12"
        rightLabel="11"
      />

      <WirePath d={PATH.forwardToK1Coil} state={forwardState} />
      <WirePath
        d={PATH.k1LampFeed}
        state={forwardActive ? "active" : "inactive"}
      />

      <ContactorCoil
        x={COMPONENT.k1Coil.x}
        y={COMPONENT.k1Coil.y}
        scale={COMPONENT.k1Coil.scale}
        energized={forwardActive}
        label="K1"
        standalone={false}
        strokeColor={STYLE.active}
        wireStroke={1}
        textSize={7}
      />

      <PilotLight
        x={COMPONENT.k1Lamp.x}
        y={COMPONENT.k1Lamp.y}
        scale={COMPONENT.k1Lamp.scale}
        on={forwardActive}
        label=""
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={1}
        textSize={7}
      />

      {showLabels && (
        <>
          <text
            x={LABEL.forwardOn.x}
            y={LABEL.forwardOn.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            ON1
          </text>
          <text
            x={LABEL.forward.x}
            y={LABEL.forward.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.neutral}
          >
            FWD
          </text>
          <text
            x={LABEL.k1Hold.x}
            y={LABEL.k1Hold.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            K1
          </text>
          <text
            x={LABEL.k2Nc.x}
            y={LABEL.k2Nc.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            K2
          </text>
        </>
      )}
    </>
  );
}

function ReverseBranch({
  showLabels,
  reverseStartPressed,
  reverseHoldClosed,
  reverseHoldPathActive,
  k1InterlockClosed,
  reverseState,
  reverseActive,
}: {
  showLabels: boolean;
  reverseStartPressed: boolean;
  reverseHoldClosed: boolean;
  reverseHoldPathActive: boolean;
  k1InterlockClosed: boolean;
  reverseState: WireState;
  reverseActive: boolean;
}) {
  const holdTopY = NODE.reverseButtonY - 30;
  const holdBottomY = DERIVED.forwardBottomY - 30;
  const holdScale = getVerticalContactScale(holdTopY, holdBottomY);
  const k2HoldPosition = getAnchoredSymbolPosition(
    DERIVED.k2HoldTerminalX,
    holdTopY,
    holdScale,
    AUX_CONTACT_TOP_X,
  );
  const k1NcTopY = NODE.k1NcY;
  const k1NcBottomY = DERIVED.k1NcBottomY - 30;
  const k1NcScale = getVerticalContactScale(k1NcTopY, k1NcBottomY);
  const k1NcPosition = getAnchoredSymbolPosition(
    DERIVED.reverseButtonTerminalX,
    k1NcTopY,
    k1NcScale,
    AUX_CONTACT_TOP_X,
  );
  const holdTerminalX = DERIVED.k2HoldTerminalX;

  return (
    <>
      <WirePath d={PATH.reverseFeed} state={reverseState} />

      <PushButtonNO
        x={COMPONENT.reverseButton.x}
        y={COMPONENT.reverseButton.y}
        scale={COMPONENT.reverseButton.scale}
        pressed={reverseStartPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={1}
        textSize={7}
        showTerminals
      />

      <NormallyOpenContactSymbol
        x={k2HoldPosition.x}
        y={holdTopY}
        scale={holdScale}
        closed={reverseHoldClosed}
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.contactBlue}
        strokeWidth={1.5}
        leftLabel="13"
        rightLabel="14"
      />

      <StaticLine
        x1={DERIVED.reverseButtonTerminalX}
        y1={holdTopY}
        x2={holdTerminalX}
        y2={holdTopY}
        stroke={STYLE.live}
      />
      <StaticLine
        x1={DERIVED.reverseButtonTerminalX}
        y1={holdBottomY}
        x2={holdTerminalX}
        y2={holdBottomY}
        stroke={STYLE.live}
      />
      <ActiveLine
        x1={DERIVED.reverseButtonTerminalX}
        y1={holdTopY}
        x2={holdTerminalX}
        y2={holdTopY}
        state={reverseHoldPathActive ? "active" : "inactive"}
      />
      <ActiveLine
        x1={DERIVED.reverseButtonTerminalX}
        y1={holdBottomY}
        x2={holdTerminalX}
        y2={holdBottomY}
        state={reverseHoldPathActive ? "active" : "inactive"}
      />
      <WirePath d={PATH.reverseToK1Nc} state={reverseState} />

      <NormallyCloseContactSymbol
        x={k1NcPosition.x}
        y={k1NcTopY}
        scale={k1NcScale}
        closed={k1InterlockClosed}
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.contactBlue}
        strokeWidth={1.5}
        leftLabel="12"
        rightLabel="11"
      />

      <WirePath d={PATH.reverseToK2Coil} state={reverseState} />
      <WirePath
        d={PATH.k2LampFeed}
        state={reverseActive ? "active" : "inactive"}
      />

      <ContactorCoil
        x={COMPONENT.k2Coil.x}
        y={COMPONENT.k2Coil.y}
        scale={COMPONENT.k2Coil.scale}
        energized={reverseActive}
        label="K2"
        standalone={false}
        strokeColor={STYLE.active}
        wireStroke={1}
        textSize={7}
      />

      <PilotLight
        x={COMPONENT.k2Lamp.x}
        y={COMPONENT.k2Lamp.y}
        scale={COMPONENT.k2Lamp.scale}
        on={reverseActive}
        label=""
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={1}
        textSize={7}
      />

      {showLabels && (
        <>
          <text
            x={LABEL.reverseOn.x}
            y={LABEL.reverseOn.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            ON2
          </text>
          <text
            x={LABEL.reverse.x}
            y={LABEL.reverse.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.neutral}
          >
            REV
          </text>
          <text
            x={LABEL.k2Hold.x}
            y={LABEL.k2Hold.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            K2
          </text>
          <text
            x={LABEL.k1Nc.x}
            y={LABEL.k1Nc.y}
            fontSize="12"
            fontWeight="700"
            fill={STYLE.fault}
          >
            K1
          </text>
        </>
      )}
    </>
  );
}

function ReturnPath({
  forwardActive,
  reverseActive,
}: {
  forwardActive: boolean;
  reverseActive: boolean;
}) {
  const neutralState = forwardActive || reverseActive ? "active" : "inactive";

  return (
    <>
      <WirePath
        d={PATH.k1Return}
        state={forwardActive ? "active" : neutralState}
      />
      <WirePath
        d={PATH.k1LampReturn}
        state={forwardActive ? "active" : "inactive"}
      />
      <WirePath
        d={PATH.k2Return}
        state={reverseActive ? "active" : neutralState}
      />
      <WirePath
        d={PATH.k2LampReturn}
        state={reverseActive ? "active" : "inactive"}
      />
    </>
  );
}

function FlowLayer({
  showFlow,
  faultFeedActive,
  commonFeedActive,
  commonPathActive,
  forwardPathActive,
  reversePathActive,
  forwardHoldPathActive,
  reverseHoldPathActive,
  forwardActive,
  reverseActive,
}: {
  showFlow: boolean;
  faultFeedActive: boolean;
  commonFeedActive: boolean;
  commonPathActive: boolean;
  forwardPathActive: boolean;
  reversePathActive: boolean;
  forwardHoldPathActive: boolean;
  reverseHoldPathActive: boolean;
  forwardActive: boolean;
  reverseActive: boolean;
}) {
  if (!showFlow) return null;

  return (
    <>
      <ElectronFlow d={PATH.liveSupply} active={commonFeedActive} />
      <ElectronFlow
        d={PATH.liveSupply}
        active={faultFeedActive}
        color={STYLE.fault}
      />

      <ElectronFlow d={PATH.overloadToStop} active={commonPathActive} />
      <ElectronFlow d={PATH.stopToForward} active={commonPathActive} />

      <ElectronFlow d={PATH.forwardHold} active={forwardHoldPathActive} />
      <ElectronFlow d={PATH.forwardToK2Nc} active={forwardPathActive} />
      <ElectronFlow d={PATH.forwardToK1Coil} active={forwardPathActive} />
      <ElectronFlow d={PATH.k1LampFeed} active={forwardActive} />
      <ElectronFlow d={PATH.k1LampReturn} active={forwardActive} />
      <ElectronFlow d={PATH.k1Return} active={forwardActive} />

      <ElectronFlow d={PATH.reverseFeed} active={reversePathActive} />
      <ElectronFlow d={PATH.reverseHold} active={reverseHoldPathActive} />
      <ElectronFlow d={PATH.reverseToK1Nc} active={reversePathActive} />
      <ElectronFlow d={PATH.reverseToK2Coil} active={reversePathActive} />
      <ElectronFlow d={PATH.k2LampFeed} active={reverseActive} />
      <ElectronFlow d={PATH.k2LampReturn} active={reverseActive} />
      <ElectronFlow d={PATH.k2Return} active={reverseActive} />
    </>
  );
}

export default function ReverseForwardControlCircuit({
  className = "",
  mcbOn = false,
  overloadTripped = false,
  motorRunning = false,
  direction = "idle",
  stopPressed = false,
  forwardStartPressed = false,
  reverseStartPressed = false,
  componentStateBadges = [],
  viewMode = "fit",
  showLabels = true,
  showFlow = true,
}: ReverseForwardControlCircuitProps) {
  const forwardActive =
    mcbOn && !overloadTripped && motorRunning && direction === "forward";

  const reverseActive =
    mcbOn && !overloadTripped && motorRunning && direction === "reverse";

  const controlSupplyAvailable = mcbOn && !overloadTripped;
  const forwardHoldClosed = forwardActive;
  const reverseHoldClosed = reverseActive;
  const k2InterlockClosed = !reverseActive;
  const k1InterlockClosed = !forwardActive;

  const forwardStartPathActive =
    controlSupplyAvailable &&
    !stopPressed &&
    forwardStartPressed &&
    k2InterlockClosed;

  const forwardHoldPathActive =
    controlSupplyAvailable &&
    !stopPressed &&
    forwardHoldClosed &&
    k2InterlockClosed;

  const reverseStartPathActive =
    controlSupplyAvailable &&
    !stopPressed &&
    reverseStartPressed &&
    k1InterlockClosed;

  const reverseHoldPathActive =
    controlSupplyAvailable &&
    !stopPressed &&
    reverseHoldClosed &&
    k1InterlockClosed;

  const forwardPathActive = forwardStartPathActive || forwardHoldPathActive;
  const reversePathActive = reverseStartPathActive || reverseHoldPathActive;

  const commonFeedActive = forwardPathActive || reversePathActive;
  const commonPathActive = commonFeedActive;
  const faultFeedActive = mcbOn && overloadTripped;

  const supplyState: WireState = faultFeedActive
    ? "fault"
    : commonFeedActive
      ? "active"
      : "inactive";

  const commonPathState: WireState = commonPathActive ? "active" : "inactive";
  const forwardState: WireState = forwardPathActive ? "active" : "inactive";
  const reverseState: WireState = reversePathActive ? "active" : "inactive";

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div
        className={`control-diagram-shell ${
          viewMode === "actual" ? "is-actual-scale" : ""
        }`}
      >
        <div
          className={`control-diagram-scroll ${
            viewMode === "actual" ? "is-scrollable" : ""
          }`}
        >
          <svg
            viewBox={VIEW_BOX}
            className="control-diagram-svg"
            style={
              viewMode === "actual"
                ? { width: `${VIEW_BOX_WIDTH}px`, maxWidth: "none" }
                : undefined
            }
            role="img"
            aria-label="Reverse-forward control circuit"
          >
            <rect
              width={VIEW_BOX_WIDTH}
              height={VIEW_BOX_HEIGHT}
              fill={STYLE.boardBg}
            />

            <g transform={`translate(${BOARD.x} ${BOARD.y})`}>
              <BackgroundPixelGred
                width={BOARD.width}
                height={BOARD.height}
                minor={20}
                major={100}
              />
            </g>

            <g transform={canvasTransform}>
              <SupplyRails
                showLabels={showLabels}
                neutralActive={forwardActive || reverseActive}
              />

              <ProtectionSection
                mcbOn={mcbOn}
                overloadTripped={overloadTripped}
                supplyState={supplyState}
                showLabels={showLabels}
              />

              <StateBadges badges={componentStateBadges} />

              <CommonControlPath
                supplyState={commonPathState}
                showLabels={showLabels}
                stopPressed={stopPressed}
              />

              <ForwardBranch
                showLabels={showLabels}
                forwardStartPressed={forwardStartPressed}
                forwardHoldClosed={forwardHoldClosed}
                forwardHoldPathActive={forwardHoldPathActive}
                k2InterlockClosed={k2InterlockClosed}
                forwardState={forwardState}
                forwardActive={forwardActive}
              />

              <ReverseBranch
                showLabels={showLabels}
                reverseStartPressed={reverseStartPressed}
                reverseHoldClosed={reverseHoldClosed}
                reverseHoldPathActive={reverseHoldPathActive}
                k1InterlockClosed={k1InterlockClosed}
                reverseState={reverseState}
                reverseActive={reverseActive}
              />

              <ReturnPath
                forwardActive={forwardActive}
                reverseActive={reverseActive}
              />

              <FlowLayer
                showFlow={showFlow}
                faultFeedActive={faultFeedActive}
                commonFeedActive={commonFeedActive}
                commonPathActive={commonPathActive}
                forwardPathActive={forwardPathActive}
                reversePathActive={reversePathActive}
                forwardHoldPathActive={forwardHoldPathActive}
                reverseHoldPathActive={reverseHoldPathActive}
                forwardActive={forwardActive}
                reverseActive={reverseActive}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
