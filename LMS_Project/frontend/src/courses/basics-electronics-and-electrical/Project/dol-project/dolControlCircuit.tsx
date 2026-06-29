"use client";

import {
  DOL_CONTROL_COLORS,
  DOL_CONTROL_GEOMETRY,
  DOL_CONTROL_STAGE,
  DOL_CONTROL_STROKES,
} from "../../packages/core/src/dol";
import BackgroundPixelGred from "../library/background_pixel_gred";
import PushButtonNC from "../library/buttons/PushButtonNC";
import PushButtonNO from "../library/buttons/PushButtonNO";
import AuxiliaryContactNC from "../library/contactors/AuxiliaryContactNC";
import AuxiliaryContactNO from "../library/contactors/AuxiliaryContactNO";
import ContactorCoil from "../library/contactors/ContactorCoil";
import PilotLight from "../library/indicators/PilotLight";
import MCBControl2P from "../library/protection/MCBControl2P";

type DOLStarterControlDiagramProps = {
  className?: string;
  mcbOn?: boolean;
  showPanel?: boolean;
  motorRunning?: boolean;
  overloadTripped?: boolean;
  startPressed?: boolean;
  stopPressed?: boolean;
  startButtonFailed?: boolean;
  holdingContactFailed?: boolean;
  flowStateLabel?: string;
  highlightComponentKey?: string;
  componentStateBadges?: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }>;
  pathAnimationStage?: number;
  showStepAnimation?: boolean;
  viewMode?: "fit" | "actual";
  showLabels?: boolean;
  showFlow?: boolean;
  onMcbToggle?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFault?: () => void;
};

type WireState = "active" | "inactive" | "fault";
type Point = { x: number; y: number };

const VIEW_BOX_WIDTH = DOL_CONTROL_STAGE.width;
const VIEW_BOX_HEIGHT = DOL_CONTROL_STAGE.height;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  mcb: 2,
  overload: 2,
  offButton: 2,
  onButton: 2,
  holdContact: 2,
  coil: 2,
  indicator: 2,
} as const;

const BASE_WIRE_WIDTH = DOL_CONTROL_STROKES.wireStroke;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  wire: DOL_CONTROL_COLORS.wireColor,
  symbol: DOL_CONTROL_COLORS.symbolColor,
  label: DOL_CONTROL_COLORS.labelColor,
  active: DOL_CONTROL_COLORS.activeLineColor,
  inactive: DOL_CONTROL_COLORS.inactiveLineColor,
  fault: DOL_CONTROL_COLORS.faultLineColor,
  electron: DOL_CONTROL_COLORS.electronColor,
} as const;

const STROKE = {
  wire: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  symbol: DOL_CONTROL_STROKES.symbolStroke,
  text: DOL_CONTROL_STROKES.symbolTextSize,
  electronBlur: DOL_CONTROL_STROKES.electronBlur,
  electronRadius: DOL_CONTROL_STROKES.electronRadius,
  electronStagger: DOL_CONTROL_STROKES.electronStagger,
} as const;

const BOARD = {
  x: DOL_CONTROL_STAGE.boardX,
  y: DOL_CONTROL_STAGE.boardY,
  width: DOL_CONTROL_STAGE.boardWidth,
  height: DOL_CONTROL_STAGE.boardHeight,
} as const;

const BASE_COMPONENT = {
  mcb: { x: DOL_CONTROL_GEOMETRY.mcbX, y: DOL_CONTROL_GEOMETRY.mcbY },

  overload: { x: 150, y: 140 },

  offButton: { x: 150, y: 290 },

  onButton: { x: 150, y: 440 },

  holdContact: { x: 260, y: 440 },

  coil: { x: 180, y: 560 },

  indicator: { x: 320, y: 560 },
} as const;

const COMPONENT = {
  mcb: {
    ...BASE_COMPONENT.mcb,
    scale: CIRCUIT_COMPONENT_SCALE.mcb,
  },

  overload: {
    ...BASE_COMPONENT.overload,
    scale: CIRCUIT_COMPONENT_SCALE.overload,
  },

  offButton: {
    ...BASE_COMPONENT.offButton,
    scale: CIRCUIT_COMPONENT_SCALE.offButton,
  },

  onButton: {
    ...BASE_COMPONENT.onButton,
    scale: CIRCUIT_COMPONENT_SCALE.onButton,
  },

  holdContact: {
    ...BASE_COMPONENT.holdContact,
    scale: CIRCUIT_COMPONENT_SCALE.holdContact,
  },

  coil: {
    ...BASE_COMPONENT.coil,
    scale: CIRCUIT_COMPONENT_SCALE.coil,
  },

  indicator: {
    ...BASE_COMPONENT.indicator,
    scale: CIRCUIT_COMPONENT_SCALE.indicator,
  },
} as const;

const NODE = {
  neutralLineY: DOL_CONTROL_GEOMETRY.neutralLineY + 8,
  liveLineY: DOL_CONTROL_GEOMETRY.liveLineY,

  supplyStartX: DOL_CONTROL_GEOMETRY.supplyLineStartX,
  supplyEndX: DOL_CONTROL_GEOMETRY.supplyLineEndX,

  neutralRailStartX: 165,
  neutralDropX: 480,
  neutralDropStartY: 40,
  neutralDropEndY: 660,

  mcbLowerOutput: {
    x: DOL_CONTROL_GEOMETRY.mcbX + 50 * 2,
    y: DOL_CONTROL_GEOMETRY.mcbY + 30 * 2,
  },

  overloadTopTerminal: { x: 200, y: 136 },
  overloadBottomTerminal: { x: 170 + 30, y: 240 - 30 },

  offBottomTerminal: { x: 200, y: 390 - 30 },

  holdBranchTop: { x: 200, y: 470 - 60 },
  holdBranchBottom: { x: 200, y: 510 },
  holdContactRightTop: { x: 260 + 50, y: 470 - 60 },
  holdContactRightBottom: { x: 260 + 50, y: 510 },

  coilFeed: { x: 200, y: 490 },
  coilTop: { x: 200, y: 560 },
  coilA2: { x: 200, y: 560 + 46.81 * 2 },
  coilReturn: { x: 200, y: 660 },

  indicatorBranchStart: { x: 200, y: 560 },
  indicatorBranchEnd: { x: 340, y: 560 },
  indicatorReturn: { x: 340, y: 660 },
} as const;

const PATH = {
  neutralTop: `M ${NODE.supplyStartX} ${NODE.neutralLineY} H ${NODE.supplyEndX} M ${NODE.neutralRailStartX} ${NODE.neutralLineY} H ${NODE.neutralDropX}`,
  neutralDrop: `M ${NODE.neutralDropX} ${NODE.neutralDropStartY} V ${NODE.neutralDropEndY}`,
  neutralTopReturn: `M ${NODE.neutralDropX} ${NODE.neutralLineY} H ${NODE.neutralRailStartX} M ${NODE.supplyEndX} ${NODE.neutralLineY} H ${NODE.supplyStartX}`,
  neutralDropReturn: `M ${NODE.neutralDropX} ${NODE.neutralDropEndY} V ${NODE.neutralDropStartY}`,

  liveFeed: `M ${NODE.supplyStartX} ${NODE.liveLineY} H ${NODE.supplyEndX} M ${NODE.mcbLowerOutput.x} ${NODE.mcbLowerOutput.y} V ${NODE.overloadTopTerminal.y} H ${NODE.overloadTopTerminal.x}`,

  overloadDown: `M ${NODE.overloadBottomTerminal.x} ${NODE.overloadBottomTerminal.y} V ${COMPONENT.offButton.y}`,

  offToOn: `M ${NODE.offBottomTerminal.x} ${NODE.offBottomTerminal.y} V ${COMPONENT.onButton.y}`,

  onToCoil: `M ${NODE.coilFeed.x} ${NODE.coilFeed.y} V ${NODE.coilTop.y}`,

  holdTop: `M ${NODE.holdBranchTop.x} ${NODE.holdBranchTop.y} H ${NODE.holdContactRightTop.x}`,

  holdBottom: `M ${NODE.holdBranchBottom.x} ${NODE.holdBranchBottom.y} H ${NODE.holdContactRightBottom.x}`,

  holdBottomFlow: `M ${NODE.holdContactRightBottom.x} ${NODE.holdContactRightBottom.y} H ${NODE.holdBranchBottom.x}`,

  coilBody: `M ${NODE.coilTop.x} ${NODE.coilTop.y} V ${NODE.coilA2.y}`,

  coilA2Return: `M ${NODE.coilA2.x} ${NODE.coilA2.y} V ${NODE.coilReturn.y}`,

  indicatorLamp: `M ${NODE.indicatorBranchStart.x} ${NODE.indicatorBranchStart.y} H ${NODE.indicatorBranchEnd.x} V ${NODE.indicatorReturn.y}`,

  returnBus: `M ${NODE.coilReturn.x} ${NODE.coilReturn.y} H ${NODE.neutralDropX}`,

  coilReturnFlow: `M ${NODE.coilReturn.x} ${NODE.coilReturn.y} H ${NODE.neutralDropX}`,

  indicatorReturnFlow: `M ${NODE.indicatorReturn.x} ${NODE.indicatorReturn.y} H ${NODE.neutralDropX}`,

  overloadTrip: `M ${NODE.mcbLowerOutput.x} ${NODE.mcbLowerOutput.y} V ${NODE.overloadTopTerminal.y} H ${NODE.overloadTopTerminal.x}`,
} as const;

const LABEL = {
  neutral: { x: 0, y: DOL_CONTROL_GEOMETRY.neutralTextY },
  live: { x: 0, y: DOL_CONTROL_GEOMETRY.liveTextY },
  mcb: { x: 132, y: 102 },
  overload: { x: 92, y: 222 },
  off: { x: 98, y: 372 },
  on: { x: 102, y: 522 },
  hold: { x: 286, y: 482 },
  flowState: { x: NODE.coilFeed.x + 18, y: NODE.coilReturn.y + 28 },
} as const;

const HIGHLIGHT_BOX = {
  mcb: { x: 96, y: 22, width: 140, height: 88 },
  ol: { x: 138, y: 130, width: 70, height: 122 },
  off: { x: 138, y: 280, width: 70, height: 122 },
  on: { x: 138, y: 430, width: 70, height: 112 },
  hold: { x: 250, y: 410, width: 78, height: 112 },
  k1: { x: 160, y: 548, width: 88, height: 84 },
  indicator: { x: 306, y: 548, width: 64, height: 86 },
} as const;

const BADGE_ANCHOR: Record<
  string,
  { x: number; y: number; width?: number; height?: number }
> = {
  mcb: { x: 232, y: 48, width: 82, height: 28 },
  ol: { x: 232, y: 166, width: 92, height: 28 },
  off: { x: 232, y: 318, width: 94, height: 28 },
  on: { x: 232, y: 468, width: 90, height: 28 },
  hold: { x: 350, y: 430, width: 92, height: 28 },
  k1: { x: 254, y: 566, width: 108, height: 28 },
  indicator: { x: 376, y: 566, width: 92, height: 28 },
};

const TONE_STYLE = {
  neutral: { fill: "#f8fbff", stroke: "#dbe3ee", text: "#335075" },
  active: { fill: "#f0fdf4", stroke: "#bbf7d0", text: "#166534" },
  fault: { fill: "#fef2f2", stroke: "#fecaca", text: "#b91c1c" },
} as const;

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function resolveWireColor(state: WireState) {
  if (state === "fault") return STYLE.fault;
  if (state === "active") return STYLE.active;
  return STYLE.inactive;
}

function ActivePath({ d, state }: { d: string; state: WireState }) {
  if (state === "inactive") return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={resolveWireColor(state)}
      strokeWidth={STROKE.wire + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.95}
    />
  );
}

function StaticPath({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={STYLE.wire}
      strokeWidth={STROKE.wire}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function StaticLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={STYLE.wire}
      strokeWidth={STROKE.wire}
      strokeLinecap="round"
    />
  );
}

function ElectronFlow({
  path,
  active,
  fault = false,
  duration = 2.4,
  staggerOffset = 0,
}: {
  path: string;
  active: boolean;
  fault?: boolean;
  duration?: number;
  staggerOffset?: number;
}) {
  if (!active) return null;

  return (
    <>
      {STROKE.electronStagger.map((begin) => (
        <circle
          key={`${path}-${begin}-${staggerOffset}`}
          r={STROKE.electronRadius}
          fill={fault ? "#f87171" : STYLE.electron}
          filter="url(#electron-glow-dol)"
        >
          <animateMotion
            path={path}
            dur={`${duration}s`}
            begin={`${begin + staggerOffset}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </circle>
      ))}
    </>
  );
}

function HighlightBox({
  box,
  active,
}: {
  box: { x: number; y: number; width: number; height: number };
  active: boolean;
}) {
  if (!active) return null;

  return (
    <rect
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      rx={12}
      fill="#dbeafe"
      fillOpacity={0.28}
      stroke="#60a5fa"
      strokeWidth={1.2}
      strokeDasharray="6 4"
    />
  );
}

function StateBadges({
  componentStateBadges,
}: {
  componentStateBadges: NonNullable<
    DOLStarterControlDiagramProps["componentStateBadges"]
  >;
}) {
  return (
    <>
      {componentStateBadges.map((badge) => {
        const anchor = BADGE_ANCHOR[badge.key];
        if (!anchor) return null;

        const tone = TONE_STYLE[badge.tone];
        const width = anchor.width ?? 88;
        const height = anchor.height ?? 28;

        return (
          <g
            key={`badge-${badge.key}`}
            transform={`translate(${anchor.x}, ${anchor.y})`}
          >
            <rect
              width={width}
              height={height}
              rx={14}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth={1}
            />

            <text
              x={10}
              y={12}
              fontSize="8.5"
              fontWeight="800"
              fill={tone.text}
              letterSpacing="0.06em"
            >
              {badge.label}
            </text>

            <text x={10} y={22} fontSize="8.5" fontWeight="800" fill="#0f172a">
              {badge.state}
            </text>
          </g>
        );
      })}
    </>
  );
}

function HighlightLayer({
  highlightComponentKey,
}: {
  highlightComponentKey: string;
}) {
  return (
    <>
      <HighlightBox
        box={HIGHLIGHT_BOX.mcb}
        active={highlightComponentKey === "mcb"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.ol}
        active={highlightComponentKey === "ol"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.off}
        active={highlightComponentKey === "off"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.on}
        active={highlightComponentKey === "on"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.hold}
        active={highlightComponentKey === "hold"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.k1}
        active={highlightComponentKey === "k1"}
      />
      <HighlightBox
        box={HIGHLIGHT_BOX.indicator}
        active={highlightComponentKey === "indicator"}
      />
    </>
  );
}

function ActivePathLayer({
  controlSupplyState,
  overloadFeedState,
  overloadTripState,
  controlPathClosed,
  coilState,
  neutralState,
  holdingClosed,
  startFaultState,
  holdingFaultState,
}: {
  controlSupplyState: WireState;
  overloadFeedState: WireState;
  overloadTripState: WireState;
  controlPathClosed: boolean;
  coilState: WireState;
  neutralState: WireState;
  holdingClosed: boolean;
  startFaultState: WireState;
  holdingFaultState: WireState;
}) {
  return (
    <>
      <ActivePath d={PATH.neutralTop} state={neutralState} />
      <ActivePath d={PATH.neutralDrop} state={neutralState} />
      <ActivePath d={PATH.liveFeed} state={controlSupplyState} />
      <ActivePath d={PATH.overloadDown} state={overloadFeedState} />
      <ActivePath
        d={PATH.offToOn}
        state={controlPathClosed ? "active" : "inactive"}
      />
      <ActivePath d={PATH.onToCoil} state={coilState} />
      <ActivePath d={PATH.coilBody} state={coilState} />
      <ActivePath d={PATH.coilA2Return} state={neutralState} />
      <ActivePath
        d={PATH.holdTop}
        state={holdingClosed ? "active" : "inactive"}
      />
      <ActivePath
        d={PATH.holdBottom}
        state={holdingClosed ? "active" : "inactive"}
      />
      <ActivePath d={PATH.onToCoil} state={startFaultState} />
      <ActivePath d={PATH.holdTop} state={holdingFaultState} />
      <ActivePath d={PATH.holdBottom} state={holdingFaultState} />
      <ActivePath d={PATH.indicatorLamp} state={coilState} />
      <ActivePath d={PATH.returnBus} state={neutralState} />
      <ActivePath d={PATH.overloadTrip} state={overloadTripState} />
    </>
  );
}

function FlowLayer({
  showFlow,
  stageActive,
  controlSupplyState,
  overloadFeedState,
  controlPathClosed,
  coilState,
  neutralState,
  holdingClosed,
  startFaultState,
  holdingFaultState,
  overloadTripState,
}: {
  showFlow: boolean;
  stageActive: (requiredStage: number) => boolean;
  controlSupplyState: WireState;
  overloadFeedState: WireState;
  controlPathClosed: boolean;
  coilState: WireState;
  neutralState: WireState;
  holdingClosed: boolean;
  startFaultState: WireState;
  holdingFaultState: WireState;
  overloadTripState: WireState;
}) {
  if (!showFlow) return null;

  return (
    <>
      <ElectronFlow
        path={PATH.neutralTopReturn}
        active={neutralState === "active" && stageActive(4)}
        duration={2.8}
        staggerOffset={0.22}
      />
      <ElectronFlow
        path={PATH.liveFeed}
        active={controlSupplyState === "active" && stageActive(1)}
        duration={2.2}
      />
      <ElectronFlow
        path={PATH.overloadDown}
        active={overloadFeedState === "active" && stageActive(1)}
        duration={2.1}
      />
      <ElectronFlow
        path={PATH.offToOn}
        active={controlPathClosed && stageActive(1)}
        duration={2.05}
      />
      <ElectronFlow
        path={PATH.onToCoil}
        active={coilState === "active" && stageActive(2)}
        duration={2.0}
      />
      <ElectronFlow
        path={PATH.coilBody}
        active={coilState === "active" && stageActive(3)}
        duration={1.85}
      />
      <ElectronFlow
        path={PATH.coilA2Return}
        active={neutralState === "active" && stageActive(3)}
        duration={2.05}
        staggerOffset={0.02}
      />
      <ElectronFlow
        path={PATH.holdTop}
        active={holdingClosed && stageActive(4)}
        duration={2.0}
      />
      <ElectronFlow
        path={PATH.holdBottomFlow}
        active={holdingClosed && stageActive(4)}
        duration={2.0}
      />
      <ElectronFlow
        path={PATH.onToCoil}
        active={startFaultState === "fault"}
        fault
        duration={1.8}
      />
      <ElectronFlow
        path={PATH.holdTop}
        active={holdingFaultState === "fault"}
        fault
        duration={1.8}
      />
      <ElectronFlow
        path={PATH.holdBottomFlow}
        active={holdingFaultState === "fault"}
        fault
        duration={1.8}
      />
      <ElectronFlow
        path={PATH.indicatorLamp}
        active={coilState === "active" && stageActive(4)}
        duration={1.95}
      />
      <ElectronFlow
        path={PATH.coilReturnFlow}
        active={neutralState === "active" && stageActive(4)}
        duration={2.35}
        staggerOffset={0.08}
      />
      <ElectronFlow
        path={PATH.neutralDropReturn}
        active={neutralState === "active" && stageActive(4)}
        duration={2.4}
        staggerOffset={0.14}
      />
      <ElectronFlow
        path={PATH.indicatorReturnFlow}
        active={neutralState === "active" && stageActive(4)}
        duration={2.75}
        staggerOffset={0.42}
      />
      <ElectronFlow
        path={PATH.overloadTrip}
        active={overloadTripState === "fault"}
        fault
        duration={1.9}
      />
    </>
  );
}

function SupplyRails({ showLabels }: { showLabels: boolean }) {
  return (
    <>
      {showLabels && (
        <text
          x={LABEL.neutral.x}
          y={LABEL.neutral.y}
          fontSize="18"
          fontWeight="700"
          fill="#111111"
        >
          N
        </text>
      )}

      <StaticLine
        x1={NODE.supplyStartX}
        y1={NODE.neutralLineY}
        x2={NODE.supplyEndX}
        y2={NODE.neutralLineY}
      />

      <StaticLine
        x1={NODE.neutralRailStartX}
        y1={NODE.neutralLineY}
        x2={NODE.neutralDropX}
        y2={NODE.neutralLineY}
      />

      {showLabels && (
        <text
          x={LABEL.live.x}
          y={LABEL.live.y}
          fontSize="18"
          fontWeight="700"
          fill="#111111"
        >
          L
        </text>
      )}

      <StaticLine
        x1={NODE.supplyStartX}
        y1={NODE.liveLineY}
        x2={NODE.supplyEndX}
        y2={NODE.liveLineY}
      />
    </>
  );
}

function MCBSection({
  mcbOn,
  showLabels,
}: {
  mcbOn: boolean;
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
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />

      {showLabels && (
        <text
          x={LABEL.mcb.x}
          y={LABEL.mcb.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.label}
          textAnchor="middle"
        >
          MCB
        </text>
      )}

      <StaticLine
        x1={NODE.mcbLowerOutput.x}
        y1={NODE.mcbLowerOutput.y}
        x2={NODE.mcbLowerOutput.x}
        y2={NODE.overloadTopTerminal.y}
      />

      <StaticLine
        x1={NODE.mcbLowerOutput.x}
        y1={NODE.overloadTopTerminal.y}
        x2={NODE.overloadTopTerminal.x}
        y2={NODE.overloadTopTerminal.y}
      />
    </>
  );
}

function OverloadSection({
  overloadTripped,
  showLabels,
}: {
  overloadTripped: boolean;
  showLabels: boolean;
}) {
  return (
    <>
      <AuxiliaryContactNC
        x={COMPONENT.overload.x}
        y={COMPONENT.overload.y}
        scale={COMPONENT.overload.scale}
        closed={!overloadTripped}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="95"
        terminalB="96"
      />

      {showLabels && (
        <text
          x={LABEL.overload.x}
          y={LABEL.overload.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.label}
        >
          O/L NC
        </text>
      )}

      <StaticLine
        x1={NODE.overloadBottomTerminal.x}
        y1={NODE.overloadBottomTerminal.y}
        x2={NODE.overloadBottomTerminal.x}
        y2={COMPONENT.offButton.y}
      />
    </>
  );
}

function StopButtonSection({
  stopPressed,
  showLabels,
}: {
  stopPressed: boolean;
  showLabels: boolean;
}) {
  return (
    <>
      <PushButtonNC
        x={COMPONENT.offButton.x}
        y={COMPONENT.offButton.y}
        scale={COMPONENT.offButton.scale}
        pressed={stopPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
      />

      {showLabels && (
        <text
          x={LABEL.off.x}
          y={LABEL.off.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.label}
        >
          OFF
        </text>
      )}

      <StaticLine
        x1={NODE.offBottomTerminal.x}
        y1={NODE.offBottomTerminal.y}
        x2={NODE.offBottomTerminal.x}
        y2={COMPONENT.onButton.y}
      />
    </>
  );
}

function StartAndHoldSection({
  startPressed,
  holdingClosed,
  showLabels,
}: {
  startPressed: boolean;
  holdingClosed: boolean;
  showLabels: boolean;
}) {
  return (
    <>
      <PushButtonNO
        x={COMPONENT.onButton.x}
        y={COMPONENT.onButton.y}
        scale={COMPONENT.onButton.scale}
        pressed={startPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
      />

      {showLabels && (
        <text
          x={LABEL.on.x}
          y={LABEL.on.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.label}
        >
          ON
        </text>
      )}

      <StaticPath d={PATH.holdTop} />
      <StaticPath d={PATH.holdBottom} />

      <AuxiliaryContactNO
        x={COMPONENT.holdContact.x}
        y={COMPONENT.holdContact.y}
        scale={COMPONENT.holdContact.scale}
        closed={holdingClosed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="13"
        terminalB="14"
      />

      {showLabels && (
        <text
          x={LABEL.hold.x}
          y={LABEL.hold.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.label}
        >
          K1
        </text>
      )}

      <StaticLine
        x1={NODE.coilFeed.x}
        y1={NODE.coilFeed.y}
        x2={NODE.coilTop.x}
        y2={NODE.coilTop.y}
      />
    </>
  );
}

function CoilAndIndicatorSection({ coilActive }: { coilActive: boolean }) {
  return (
    <>
      <ContactorCoil
        x={COMPONENT.coil.x}
        y={COMPONENT.coil.y}
        scale={COMPONENT.coil.scale}
        energized={coilActive}
        label="K1"
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />

      <StaticLine
        x1={NODE.indicatorBranchStart.x}
        y1={NODE.indicatorBranchStart.y}
        x2={NODE.indicatorBranchEnd.x}
        y2={NODE.indicatorBranchEnd.y}
      />

      <PilotLight
        x={COMPONENT.indicator.x}
        y={COMPONENT.indicator.y}
        scale={COMPONENT.indicator.scale}
        on={coilActive}
        label=""
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />

      <StaticLine
        x1={NODE.coilReturn.x}
        y1={NODE.coilReturn.y}
        x2={NODE.neutralDropX}
        y2={NODE.coilReturn.y}
      />

      <StaticLine
        x1={NODE.neutralDropX}
        y1={NODE.neutralDropStartY}
        x2={NODE.neutralDropX}
        y2={NODE.neutralDropEndY}
      />
    </>
  );
}

export default function DOLStarterControlDiagram({
  className = "",
  mcbOn = true,
  motorRunning = false,
  overloadTripped = false,
  startPressed = false,
  stopPressed = false,
  startButtonFailed = false,
  holdingContactFailed = false,
  flowStateLabel = "Idle",
  highlightComponentKey = "mcb",
  componentStateBadges = [],
  pathAnimationStage = 4,
  showStepAnimation = false,
  viewMode = "fit",
  showLabels = true,
  showFlow = true,
}: DOLStarterControlDiagramProps) {
  const controlSupplyState: WireState = mcbOn ? "active" : "inactive";

  const overloadFeedState: WireState =
    mcbOn && !overloadTripped ? "active" : "inactive";

  const overloadTripState: WireState =
    mcbOn && overloadTripped ? "fault" : "inactive";

  const controlPathClosed = mcbOn && !overloadTripped && !stopPressed;

  const startPathClosed =
    controlPathClosed && startPressed && !startButtonFailed;

  const startFaultState: WireState =
    controlPathClosed && startPressed && startButtonFailed
      ? "fault"
      : "inactive";

  const holdingClosed =
    controlPathClosed && motorRunning && !holdingContactFailed;

  const holdingFaultState: WireState =
    controlPathClosed && motorRunning && holdingContactFailed
      ? "fault"
      : "inactive";

  const coilState: WireState =
    holdingClosed || startPathClosed ? "active" : "inactive";

  const neutralState: WireState = coilState;

  const stageActive = (requiredStage: number) =>
    !showStepAnimation || pathAnimationStage >= requiredStage;

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
            aria-label="DOL control circuit template"
          >
            <defs>
              <filter
                id="electron-glow-dol"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur
                  stdDeviation={STROKE.electronBlur}
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${BOARD.x}, ${BOARD.y})`}>
              <BackgroundPixelGred width={BOARD.width} height={BOARD.height} />

              <g transform={canvasTransform}>
                <HighlightLayer highlightComponentKey={highlightComponentKey} />

                <StateBadges componentStateBadges={componentStateBadges} />

                <ActivePathLayer
                  controlSupplyState={controlSupplyState}
                  overloadFeedState={overloadFeedState}
                  overloadTripState={overloadTripState}
                  controlPathClosed={controlPathClosed}
                  coilState={coilState}
                  neutralState={neutralState}
                  holdingClosed={holdingClosed}
                  startFaultState={startFaultState}
                  holdingFaultState={holdingFaultState}
                />

                <FlowLayer
                  showFlow={showFlow}
                  stageActive={stageActive}
                  controlSupplyState={controlSupplyState}
                  overloadFeedState={overloadFeedState}
                  controlPathClosed={controlPathClosed}
                  coilState={coilState}
                  neutralState={neutralState}
                  holdingClosed={holdingClosed}
                  startFaultState={startFaultState}
                  holdingFaultState={holdingFaultState}
                  overloadTripState={overloadTripState}
                />

                <SupplyRails showLabels={showLabels} />

                <MCBSection mcbOn={mcbOn} showLabels={showLabels} />

                <OverloadSection
                  overloadTripped={overloadTripped}
                  showLabels={showLabels}
                />

                <StopButtonSection
                  stopPressed={stopPressed}
                  showLabels={showLabels}
                />

                <StartAndHoldSection
                  startPressed={startPressed}
                  holdingClosed={holdingClosed}
                  showLabels={showLabels}
                />

                <CoilAndIndicatorSection coilActive={coilState === "active"} />

                {showLabels && (
                  <text
                    x={LABEL.flowState.x}
                    y={LABEL.flowState.y}
                    fontSize="12"
                    fontWeight="700"
                    fill={STYLE.label}
                  >
                    {flowStateLabel}
                  </text>
                )}
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
