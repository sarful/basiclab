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

const { width, height, boardX, boardY, boardWidth, boardHeight } =
  DOL_CONTROL_STAGE;
const {
  wireColor,
  symbolColor,
  labelColor,
  activeLineColor,
  inactiveLineColor,
  faultLineColor,
  electronColor,
} = DOL_CONTROL_COLORS;
const {
  wireStroke,
  symbolStroke,
  symbolTextSize,
  electronBlur,
  electronRadius,
  electronStagger,
} = DOL_CONTROL_STROKES;
const {
  neutralTextY,
  neutralLineY,
  liveTextY,
  liveLineY,
  supplyLineStartX,
  supplyLineEndX,
  mcbX,
  mcbY,
} = DOL_CONTROL_GEOMETRY;

const mcbLowerOutputX = mcbX + 50 * 2;
const mcbLowerOutputY = mcbY + 30 * 2;
const overloadTopTerminalX = 200;
const overloadTopTerminalY = 136;
const overloadBottomTerminalX = 170;
const overloadBottomTerminalY = 240;
const offButtonX = 150;
const offButtonY = 290;
const offBottomTerminalX = 200;
const offBottomTerminalY = 390;
const onButtonX = 150;
const onButtonY = 440;
const holdBranchTopY = 470;
const holdBranchBottomY = 510;
const holdContactX = 260;
const holdContactY = 440;
const k1CoilX = 170;
const k1CoilY = 560;
const coilFeedX = 200;
const coilFeedStartY = 490;
const coilFeedEndY = 560;
const coilReturnY = 660;
const indicatorX = 320;
const indicatorY = 560;
const indicatorBranchStartX = 200;
const indicatorBranchEndX = 340;
const neutralRailStartX = 165;
const neutralDropX = 480;
const neutralDropStartY = 40;
const neutralDropEndY = coilReturnY;
const coilA2Y = k1CoilY + 46.81 * 2;

type WireState = "active" | "inactive" | "fault";

function resolveWireColor(state: WireState) {
  if (state === "fault") return faultLineColor;
  if (state === "active") return activeLineColor;
  return inactiveLineColor;
}

function ActivePath({ d, state }: { d: string; state: WireState }) {
  if (state === "inactive") return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={resolveWireColor(state)}
      strokeWidth={wireStroke + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.95}
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
      {electronStagger.map((begin) => (
        <circle
          key={`${path}-${begin}-${staggerOffset}`}
          r={electronRadius}
          fill={fault ? "#f87171" : electronColor}
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
  x,
  y,
  width,
  height,
  active,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}) {
  if (!active) return null;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={12}
      fill="#dbeafe"
      fillOpacity={0.28}
      stroke="#60a5fa"
      strokeWidth={1.2}
      strokeDasharray="6 4"
    />
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

  const neutralTopPath = `M ${supplyLineStartX} ${neutralLineY + 8} H ${supplyLineEndX} M ${neutralRailStartX} ${neutralLineY + 8} H ${neutralDropX}`;
  const neutralDropPath = `M ${neutralDropX} ${neutralDropStartY} V ${neutralDropEndY}`;
  const neutralTopReturnFlowPath = `M ${neutralDropX} ${neutralLineY + 8} H ${neutralRailStartX} M ${supplyLineEndX} ${neutralLineY + 8} H ${supplyLineStartX}`;
  const neutralDropReturnFlowPath = `M ${neutralDropX} ${neutralDropEndY} V ${neutralDropStartY}`;
  const lFeedPath = `M ${supplyLineStartX} ${liveLineY} H ${supplyLineEndX} M ${mcbLowerOutputX} ${mcbLowerOutputY} V ${overloadTopTerminalY} H ${overloadTopTerminalX}`;
  const overloadDownPath = `M ${overloadBottomTerminalX + 30} ${overloadBottomTerminalY - 30} V ${offButtonY}`;
  const offToOnPath = `M ${offBottomTerminalX} ${offBottomTerminalY - 30} V ${onButtonY}`;
  const onToCoilPath = `M ${coilFeedX} ${coilFeedStartY} V ${coilFeedEndY}`;
  const holdTopPath = `M ${offBottomTerminalX} ${holdBranchTopY - 60} H ${holdContactX + 50}`;
  const holdBottomPath = `M ${offBottomTerminalX} ${holdBranchBottomY} H ${holdContactX + 50}`;
  const holdBottomFlowPath = `M ${holdContactX + 50} ${holdBranchBottomY} H ${offBottomTerminalX}`;
  const coilBodyPath = `M ${coilFeedX} ${coilFeedEndY} V ${coilA2Y}`;
  const coilA2ReturnPath = `M ${coilFeedX} ${coilA2Y} V ${coilReturnY}`;
  const indicatorLampPath = `M ${indicatorBranchStartX} ${coilFeedEndY} H ${indicatorX + 20} V ${coilReturnY}`;
  const coilReturnFlowPath = `M ${coilFeedX} ${coilReturnY} H ${neutralDropX}`;
  const indicatorReturnFlowPath = `M ${indicatorX + 20} ${coilReturnY} H ${neutralDropX}`;
  const returnBusPath = `M ${coilFeedX} ${coilReturnY} H ${neutralDropX}`;
  const badgeAnchors: Record<
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

  const toneStyles: Record<
    "neutral" | "active" | "fault",
    { fill: string; stroke: string; text: string }
  > = {
    neutral: { fill: "#f8fbff", stroke: "#dbe3ee", text: "#335075" },
    active: { fill: "#f0fdf4", stroke: "#bbf7d0", text: "#166534" },
    fault: { fill: "#fef2f2", stroke: "#fecaca", text: "#b91c1c" },
  };

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div
        className={`control-diagram-shell ${viewMode === "actual" ? "is-actual-scale" : ""}`}
      >
        <div
          className={`control-diagram-scroll ${viewMode === "actual" ? "is-scrollable" : ""}`}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="control-diagram-svg"
            style={
              viewMode === "actual"
                ? { width: `${width}px`, maxWidth: "none" }
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
                <feGaussianBlur stdDeviation={electronBlur} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main grid board used as the drawing template area. */}
            <g transform={`translate(${boardX}, ${boardY})`}>
              <BackgroundPixelGred width={boardWidth} height={boardHeight} />

              <HighlightBox
                x={96}
                y={22}
                width={140}
                height={88}
                active={highlightComponentKey === "mcb"}
              />
              <HighlightBox
                x={138}
                y={130}
                width={70}
                height={122}
                active={highlightComponentKey === "ol"}
              />
              <HighlightBox
                x={138}
                y={280}
                width={70}
                height={122}
                active={highlightComponentKey === "off"}
              />
              <HighlightBox
                x={138}
                y={430}
                width={70}
                height={112}
                active={highlightComponentKey === "on"}
              />
              <HighlightBox
                x={250}
                y={410}
                width={78}
                height={112}
                active={highlightComponentKey === "hold"}
              />
              <HighlightBox
                x={160}
                y={548}
                width={88}
                height={84}
                active={highlightComponentKey === "k1"}
              />
              <HighlightBox
                x={306}
                y={548}
                width={64}
                height={86}
                active={highlightComponentKey === "indicator"}
              />

              {componentStateBadges.map((badge) => {
                const anchor = badgeAnchors[badge.key];
                if (!anchor) return null;
                const tone = toneStyles[badge.tone];
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
                    <text
                      x={10}
                      y={22}
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#0f172a"
                    >
                      {badge.state}
                    </text>
                  </g>
                );
              })}

              <ActivePath d={neutralTopPath} state={neutralState} />
              <ActivePath d={neutralDropPath} state={neutralState} />
              <ActivePath d={lFeedPath} state={controlSupplyState} />
              <ActivePath d={overloadDownPath} state={overloadFeedState} />
              <ActivePath
                d={offToOnPath}
                state={controlPathClosed ? "active" : "inactive"}
              />
              <ActivePath d={onToCoilPath} state={coilState} />
              <ActivePath d={coilBodyPath} state={coilState} />
              <ActivePath d={coilA2ReturnPath} state={neutralState} />
              <ActivePath
                d={holdTopPath}
                state={holdingClosed ? "active" : "inactive"}
              />
              <ActivePath
                d={holdBottomPath}
                state={holdingClosed ? "active" : "inactive"}
              />
              <ActivePath d={onToCoilPath} state={startFaultState} />
              <ActivePath d={holdTopPath} state={holdingFaultState} />
              <ActivePath d={holdBottomPath} state={holdingFaultState} />
              <ActivePath d={indicatorLampPath} state={coilState} />
              <ActivePath d={returnBusPath} state={neutralState} />
              <ActivePath
                d={`M ${mcbLowerOutputX} ${mcbLowerOutputY} V ${overloadTopTerminalY} H ${overloadTopTerminalX}`}
                state={overloadTripState}
              />

              {showFlow ? (
                <>
                  <ElectronFlow
                    path={neutralTopReturnFlowPath}
                    active={neutralState === "active" && stageActive(4)}
                    duration={2.8}
                    staggerOffset={0.22}
                  />
                  <ElectronFlow
                    path={lFeedPath}
                    active={controlSupplyState === "active" && stageActive(1)}
                    duration={2.2}
                  />
                  <ElectronFlow
                    path={overloadDownPath}
                    active={overloadFeedState === "active" && stageActive(1)}
                    duration={2.1}
                  />
                  <ElectronFlow
                    path={offToOnPath}
                    active={controlPathClosed && stageActive(1)}
                    duration={2.05}
                  />
                  <ElectronFlow
                    path={onToCoilPath}
                    active={coilState === "active" && stageActive(2)}
                    duration={2.0}
                  />
                  <ElectronFlow
                    path={coilBodyPath}
                    active={coilState === "active" && stageActive(3)}
                    duration={1.85}
                  />
                  <ElectronFlow
                    path={coilA2ReturnPath}
                    active={neutralState === "active" && stageActive(3)}
                    duration={2.05}
                    staggerOffset={0.02}
                  />
                  <ElectronFlow
                    path={holdTopPath}
                    active={holdingClosed && stageActive(4)}
                    duration={2.0}
                  />
                  <ElectronFlow
                    path={holdBottomFlowPath}
                    active={holdingClosed && stageActive(4)}
                    duration={2.0}
                  />
                  <ElectronFlow
                    path={onToCoilPath}
                    active={startFaultState === "fault"}
                    fault
                    duration={1.8}
                  />
                  <ElectronFlow
                    path={holdTopPath}
                    active={holdingFaultState === "fault"}
                    fault
                    duration={1.8}
                  />
                  <ElectronFlow
                    path={holdBottomFlowPath}
                    active={holdingFaultState === "fault"}
                    fault
                    duration={1.8}
                  />
                  <ElectronFlow
                    path={indicatorLampPath}
                    active={coilState === "active" && stageActive(4)}
                    duration={1.95}
                  />
                  <ElectronFlow
                    path={coilReturnFlowPath}
                    active={neutralState === "active" && stageActive(4)}
                    duration={2.35}
                    staggerOffset={0.08}
                  />
                  <ElectronFlow
                    path={neutralDropReturnFlowPath}
                    active={neutralState === "active" && stageActive(4)}
                    duration={2.4}
                    staggerOffset={0.14}
                  />
                  <ElectronFlow
                    path={indicatorReturnFlowPath}
                    active={neutralState === "active" && stageActive(4)}
                    duration={2.75}
                    staggerOffset={0.42}
                  />
                  <ElectronFlow
                    path={`M ${mcbLowerOutputX} ${mcbLowerOutputY} V ${overloadTopTerminalY} H ${overloadTopTerminalX}`}
                    active={overloadTripState === "fault"}
                    fault
                    duration={1.9}
                  />
                </>
              ) : null}

              {/* Neutral line label and top supply wire. */}
              {showLabels ? (
                <text
                  x="0"
                  y={neutralTextY}
                  fontSize="18"
                  fontWeight="700"
                  fill="#111111"
                >
                  N
                </text>
              ) : null}
              <line
                x1={supplyLineStartX}
                y1={neutralLineY + 8}
                x2={supplyLineEndX}
                y2={neutralLineY + 8}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={neutralRailStartX}
                y1={neutralLineY + 8}
                x2={neutralDropX}
                y2={neutralLineY + 8}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Live line label and lower supply wire. */}
              {showLabels ? (
                <text
                  x="0"
                  y={liveTextY}
                  fontSize="18"
                  fontWeight="700"
                  fill="#111111"
                >
                  L
                </text>
              ) : null}
              <line
                x1={supplyLineStartX}
                y1={liveLineY}
                x2={supplyLineEndX}
                y2={liveLineY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* MCB control symbol connected to the incoming supply lines. */}
              <MCBControl2P
                x={mcbX}
                y={mcbY}
                scale={2}
                on={mcbOn}
                label=""
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />
              {showLabels ? (
                <text
                  x={132}
                  y={102}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                  textAnchor="middle"
                >
                  MCB
                </text>
              ) : null}

              {/* Live wire dropping from MCB output to the 96 terminal of the overload NC contact. */}
              <line
                x1={mcbLowerOutputX}
                y1={mcbLowerOutputY}
                x2={mcbLowerOutputX}
                y2={overloadTopTerminalY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={mcbLowerOutputX}
                y1={overloadTopTerminalY}
                x2={overloadTopTerminalX}
                y2={overloadTopTerminalY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* O/L NC contact placed below the MCB as the next control component. */}
              <AuxiliaryContactNC
                x={150}
                y={140}
                scale={2}
                closed={!overloadTripped}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="95"
                terminalB="96"
              />
              {showLabels ? (
                <text
                  x={92}
                  y={222}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                >
                  O/L NC
                </text>
              ) : null}

              {/* Live wire continuing from overload NC down to the OFF push button. */}
              <line
                x1={overloadBottomTerminalX + 30}
                y1={overloadBottomTerminalY - 30}
                x2={overloadBottomTerminalX + 30}
                y2={offButtonY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* OFF push button placed below the overload contact. */}
              <PushButtonNC
                x={offButtonX}
                y={offButtonY}
                scale={2}
                pressed={stopPressed}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
              />
              {showLabels ? (
                <text
                  x={98}
                  y={372}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                >
                  OFF
                </text>
              ) : null}

              {/* Live wire continuing from OFF down to the ON push button. */}
              <line
                x1={offBottomTerminalX}
                y1={offBottomTerminalY - 30}
                x2={offBottomTerminalX}
                y2={onButtonY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* ON push button placed below the OFF contact. */}
              <PushButtonNO
                x={onButtonX}
                y={onButtonY}
                scale={2}
                pressed={startPressed}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
              />
              {showLabels ? (
                <text
                  x={102}
                  y={522}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                >
                  ON
                </text>
              ) : null}

              {/* Holding NO contact placed parallel to the ON push button. */}
              <line
                x1={offBottomTerminalX}
                y1={holdBranchTopY - 60}
                x2={holdContactX + 50}
                y2={holdBranchTopY - 60}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={offBottomTerminalX}
                y1={holdBranchBottomY}
                x2={holdContactX + 50}
                y2={holdBranchBottomY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <AuxiliaryContactNO
                x={holdContactX}
                y={holdContactY}
                scale={2}
                closed={holdingClosed}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="13"
                terminalB="14"
              />
              {showLabels ? (
                <text
                  x={286}
                  y={482}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                >
                  K1
                </text>
              ) : null}

              {/* Main rung continues downward from ON to the K1 contactor coil. */}
              <line
                x1={coilFeedX}
                y1={coilFeedStartY}
                x2={coilFeedX}
                y2={coilFeedEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K1 coil placed after the ON button on the main rung. */}
              <ContactorCoil
                x={k1CoilX + 10}
                y={k1CoilY}
                scale={2}
                energized={coilState === "active"}
                label="K1"
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />

              {/* Indicator lamp placed parallel with the K1 coil. */}
              <line
                x1={indicatorBranchStartX}
                y1={coilFeedEndY}
                x2={indicatorBranchEndX}
                y2={coilFeedEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <PilotLight
                x={indicatorX}
                y={indicatorY}
                scale={2}
                on={coilState === "active"}
                label=""
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />

              {/* Common lower return rung for the coil and indicator branch. */}
              <line
                x1={coilFeedX}
                y1={coilReturnY}
                x2={neutralDropX}
                y2={coilReturnY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Right-side neutral drop connecting the top N rail to the lower return path. */}
              <line
                x1={neutralDropX}
                y1={neutralDropStartY}
                x2={neutralDropX}
                y2={neutralDropEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {showLabels ? (
                <text
                  x={coilFeedX + 18}
                  y={coilReturnY + 28}
                  fontSize="12"
                  fontWeight="700"
                  fill={labelColor}
                >
                  {flowStateLabel}
                </text>
              ) : null}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
