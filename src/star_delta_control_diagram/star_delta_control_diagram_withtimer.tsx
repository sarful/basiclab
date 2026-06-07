"use client";

import PushButtonNC from "../library/buttons/PushButtonNC";
import PushButtonNO from "../library/buttons/PushButtonNO";
import AuxiliaryContactNC from "../library/contactors/AuxiliaryContactNC";
import AuxiliaryContactNO from "../library/contactors/AuxiliaryContactNO";
import ContactorCoil from "../library/contactors/ContactorCoil";
import MCBControl2P from "../library/protection/MCBControl2P";
import {
  STAR_DELTA_CONTROL_COLORS,
  STAR_DELTA_CONTROL_GEOMETRY,
  STAR_DELTA_CONTROL_STAGE,
  STAR_DELTA_CONTROL_STROKES,
  buildStarDeltaControlPaths,
} from "../../packages/core/src/star-delta";

type StarDeltaControlDiagramWithTimerProps = {
  className?: string;
  mcbOn?: boolean;
  overloadTripped?: boolean;
  mainOn?: boolean;
  timerOn?: boolean;
  starOn?: boolean;
  deltaOn?: boolean;
  transferOpen?: boolean;
  flowStateLabel?: string;
  startPressed?: boolean;
  stopPressed?: boolean;
};

const { width, height, boardX, boardY, boardWidth, boardHeight } = STAR_DELTA_CONTROL_STAGE;
const {
  wireColor,
  symbolColor,
  labelColor,
  activeLineColor,
  inactiveLineColor,
  faultLineColor,
  electronColor,
} = STAR_DELTA_CONTROL_COLORS;
const { wireStroke, symbolStroke, symbolTextSize, electronBlur, electronRadius, electronStagger } =
  STAR_DELTA_CONTROL_STROKES;
const {
  neutralTextY,
  neutralLineY,
  liveTextY,
  liveLineY,
  supplyLineStartX,
  supplyLineEndX,
  mcbX,
  mcbY,
  controlRiserX,
  controlRiserStartY,
  controlRiserEndY,
  onSwitchX,
  onSwitchY,
  holdBranchStartX,
  holdBranchEndX,
  holdBranchY,
  k1AuxX,
  k1AuxY,
  holdReturnStartX,
  holdReturnEndX,
  holdReturnY,
  overloadRiserStartY,
  overloadRiserEndY,
  overloadX,
  overloadY,
  offRiserStartY,
  offRiserEndY,
  offSwitchX,
  offSwitchY,
  k1CoilRiserStartY,
  k1CoilRiserEndY,
  k1CoilX,
  k1CoilY,
  k1BranchBusStartX,
  k1BranchBusEndX,
  k1BranchBusY,
  k1CoilBottomWireStartY,
  k1CoilBottomWireEndY,
  t1CoilX,
  t1CoilY,
  t1A1WireStartY,
  t1A1WireEndY,
  t1A1WireX,
  k3CoilX,
  k3CoilY,
  k3A1WireStartY,
  k3A1WireEndY,
  k3A1WireX,
  coilA2LinkY,
  t1A2TerminalX,
  k3A2TerminalX,
  t1NcX,
  t1NcY,
  t1NcFeedX,
  t1NcTopWireStartY,
  t1NcTopWireEndY,
  t1NcBottomWireStartY,
  t1NcBottomWireEndY,
  k2NcX,
  k2NcY,
  k2NcFeedX,
  k2NcTopWireStartY,
  k2NcTopWireEndY,
  k2CoilX,
  k2CoilY,
  k2A1WireStartY,
  k2A1WireEndY,
  k2A1WireX,
  t1NoX,
  t1NoY,
  t1NoFeedX,
  t1NoTopWireStartY,
  t1NoTopWireEndY,
  t1NoBottomWireStartY,
  t1NoBottomWireEndY,
  k2NoX,
  k2NoY,
  k2NoTopLinkStartX,
  k2NoTopLinkEndX,
  k2NoTopLinkY,
  k2NoBottomLinkStartX,
  k2NoBottomLinkEndX,
  k2NoBottomLinkY,
  k3NcX,
  k3NcY,
  k3NcFeedX,
  k3NcTopWireStartY,
  k3NcTopWireEndY,
  neutralRailStartX,
  neutralRailEndX,
  neutralRailY,
  neutralVerticalX,
  neutralVerticalStartY,
  neutralVerticalEndY,
  neutralReturnBusY,
  k2NcBottomWireStartY,
  k2NcBottomWireEndY,
  k3NcBottomWireStartY,
  k3NcBottomWireEndY,
} = STAR_DELTA_CONTROL_GEOMETRY;

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
      opacity={0.9}
    />
  );
}

function ElectronFlow({
  path,
  active,
  fault = false,
  duration = 2.8,
}: {
  path: string;
  active: boolean;
  fault?: boolean;
  duration?: number;
}) {
  if (!active) return null;

  return (
    <>
      {electronStagger.map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r={electronRadius}
          fill={fault ? "#f87171" : electronColor}
          filter="url(#electron-glow-star-delta)"
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

export default function StarDeltaControlDiagramWithTimer({
  className = "",
  mcbOn = true,
  overloadTripped = false,
  mainOn = false,
  timerOn = false,
  starOn = false,
  deltaOn = false,
  transferOpen = false,
  flowStateLabel,
  startPressed = false,
  stopPressed = false,
}: StarDeltaControlDiagramWithTimerProps) {
  const timerDone = timerOn && !starOn;

  const upstreamState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn || timerOn || starOn || deltaOn || transferOpen
        ? "active"
        : "inactive";

  const starState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : starOn
        ? "active"
        : "inactive";

  const deltaState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : deltaOn
        ? "active"
        : "inactive";

  const holdState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn
        ? "active"
        : "inactive";

  const timerState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : timerOn
        ? "active"
        : "inactive";

  const overloadState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn || timerOn || starOn || deltaOn || transferOpen
        ? "active"
        : "inactive";

  const offState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn || timerOn || starOn || deltaOn || transferOpen
        ? "active"
        : "inactive";

  const neutralState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn || timerOn || starOn || deltaOn
        ? "active"
        : "inactive";

  const tripState: WireState = mcbOn && overloadTripped ? "fault" : "inactive";

  const {
    sourceToOnPath,
    onPushPath,
    holdSealPath,
    overloadFeedPath,
    overloadContactPath,
    offPath,
    mainCoilPath,
    timerRungPath,
    starRungPath,
    deltaRungPath,
    deltaSealPath,
    returnPath,
    tripPath,
  } = buildStarDeltaControlPaths();

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div className="control-diagram-shell">
        <div className="control-diagram-scroll">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="control-diagram-svg"
            role="img"
            aria-label="Star delta control diagram template board"
          >
            <defs>
              <filter
                id="electron-glow-star-delta"
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
              <rect
                x={0}
                y={0}
                width={boardWidth}
                height={boardHeight}
                rx={14}
                fill="#ffffff"
                stroke="#d1dae5"
                strokeWidth={1}
              />

              <ActivePath d={sourceToOnPath} state={upstreamState} />
              <ActivePath d={onPushPath} state={upstreamState} />
              <ActivePath d={holdSealPath} state={holdState} />
              <ActivePath d={overloadFeedPath} state={overloadState} />
              <ActivePath d={overloadContactPath} state={overloadState} />
              <ActivePath d={offPath} state={offState} />
              <ActivePath d={mainCoilPath} state={holdState} />
              <ActivePath d={timerRungPath} state={timerState} />
              <ActivePath d={starRungPath} state={starState} />
              <ActivePath d={deltaRungPath} state={deltaState} />
              <ActivePath d={deltaSealPath} state={deltaState} />
              <ActivePath d={returnPath} state={neutralState} />
              <ActivePath d={tripPath} state={tripState} />

              <ElectronFlow
                path={sourceToOnPath}
                active={upstreamState === "active"}
                duration={2.5}
              />
              <ElectronFlow
                path={onPushPath}
                active={upstreamState === "active"}
                duration={2.1}
              />
              <ElectronFlow
                path={holdSealPath}
                active={holdState === "active"}
                duration={2.1}
              />
              <ElectronFlow
                path={overloadFeedPath}
                active={overloadState === "active"}
                duration={2.2}
              />
              <ElectronFlow
                path={overloadContactPath}
                active={overloadState === "active"}
                duration={2.15}
              />
              <ElectronFlow
                path={offPath}
                active={offState === "active"}
                duration={2.1}
              />
              <ElectronFlow
                path={mainCoilPath}
                active={holdState === "active"}
                duration={2.4}
              />
              <ElectronFlow
                path={timerRungPath}
                active={timerState === "active"}
                duration={2.2}
              />
              <ElectronFlow
                path={starRungPath}
                active={starOn && !overloadTripped && mcbOn}
                duration={2.5}
              />
              <ElectronFlow
                path={deltaRungPath}
                active={deltaOn && !overloadTripped && mcbOn}
                duration={2.5}
              />
              <ElectronFlow
                path={deltaSealPath}
                active={deltaOn && !overloadTripped && mcbOn}
                duration={2}
              />
              <ElectronFlow
                path={returnPath}
                active={neutralState === "active"}
                duration={3.2}
              />
              <ElectronFlow
                path={tripPath}
                active={tripState === "fault"}
                fault
                duration={2.2}
              />

              {/* Neutral line label and top supply wire. */}
              <text
                x="0"
                y={neutralTextY}
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                N
              </text>
              <line
                x1={supplyLineStartX}
                y1={neutralLineY}
                x2={supplyLineEndX}
                y2={neutralLineY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={neutralRailStartX}
                y1={neutralRailY}
                x2={neutralRailEndX}
                y2={neutralRailY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Live line label and lower supply wire. */}
              <text
                x="0"
                y={liveTextY}
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                L
              </text>
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
              <text
                x={116}
                y={92}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                MCB
              </text>

              {/* Vertical control riser down from the MCB live output. */}
              <line
                x1={controlRiserX}
                y1={controlRiserStartY}
                x2={controlRiserX}
                y2={controlRiserEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* ON push button on the main control rung. */}
              <PushButtonNO
                x={onSwitchX}
                y={onSwitchY}
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
              <text
                x={86}
                y={182}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                ON
              </text>

              {/* Upper holding-branch wire from the ON switch to K1 auxiliary contact. */}
              <line
                x1={holdBranchStartX}
                y1={holdBranchY}
                x2={holdBranchEndX}
                y2={holdBranchY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K1 auxiliary NO contact used for seal-in / holding path. */}
              <AuxiliaryContactNO
                x={k1AuxX}
                y={k1AuxY}
                scale={2}
                closed={mainOn}
                label=""
                standalone={false}
                strokeColor={symbolColor}
                terminalA="13"
                terminalB="14"
                orientation="vertical"
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
              />
              <text
                x={246}
                y={182}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K1
              </text>

              {/* Lower holding-return wire back to the main control riser. */}
              <line
                x1={holdReturnStartX}
                y1={holdReturnY}
                x2={holdReturnEndX}
                y2={holdReturnY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Vertical continuation from the seal-in loop down to the overload contact. */}
              <line
                x1={controlRiserX}
                y1={overloadRiserStartY}
                x2={controlRiserX}
                y2={overloadRiserEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* O/L overload contact on the main control rung. */}
              <AuxiliaryContactNC
                x={overloadX}
                y={overloadY}
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
              <text
                x={110}
                y={340}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                O/L NC
              </text>

              <text
                x={540}
                y={850}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                {flowStateLabel ?? "Idle"}
              </text>

              {/* Vertical continuation from O/L down to the OFF push button. */}
              <line
                x1={controlRiserX}
                y1={offRiserStartY}
                x2={controlRiserX}
                y2={offRiserEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* OFF push button on the main control rung. */}
              <PushButtonNC
                x={offSwitchX}
                y={offSwitchY}
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
              <text
                x={78}
                y={462}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                OFF
              </text>

              {/* Vertical continuation from OFF down to the K1 main coil. */}
              <line
                x1={controlRiserX}
                y1={k1CoilRiserStartY}
                x2={controlRiserX}
                y2={k1CoilRiserEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Horizontal branch bus from the K1 feed point, matching the reference ladder style. */}
              <line
                x1={k1BranchBusStartX}
                y1={k1BranchBusY}
                x2={k1BranchBusEndX}
                y2={k1BranchBusY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K1 main contactor coil at the bottom of the main rung. */}
              <ContactorCoil
                x={k1CoilX}
                y={k1CoilY}
                scale={2}
                energized={mainOn}
                label="K1"
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />
              <text
                x={166}
                y={744}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K1
              </text>

              {/* T1 timer coil placed on the same lower branch bus as K1. */}
              <ContactorCoil
                x={t1CoilX}
                y={t1CoilY}
                scale={2}
                energized={timerOn}
                label="T1"
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />
              <text
                x={288}
                y={744}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                T1
              </text>

              {/* Wire only for the T1 A1 terminal from the shared branch bus. */}
              <line
                x1={t1A1WireX}
                y1={t1A1WireStartY}
                x2={t1A1WireX}
                y2={t1A1WireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <circle
                cx={t1A1WireX}
                cy={t1A1WireStartY}
                r={wireStroke + 1}
                fill={wireColor}
              />

              {/* T1 NC contact 55-56 in series with the K3 A1 feed. */}
              <AuxiliaryContactNC
                x={t1NcX}
                y={t1NcY}
                scale={2}
                closed={!timerDone}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="55"
                terminalB="56"
              />
              <text
                x={372}
                y={592}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                T
              </text>
              <line
                x1={t1NcFeedX}
                y1={t1NcTopWireStartY}
                x2={t1NcFeedX}
                y2={t1NcTopWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K3 coil placed on the same lower branch bus after T1. */}
              <ContactorCoil
                x={k3CoilX}
                y={k3CoilY}
                scale={2}
                energized={starOn}
                label="K3"
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />
              <text
                x={426}
                y={744}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K3
              </text>

              {/* Wire only for the K3 A1 terminal from the shared branch bus. */}
              <line
                x1={k3A1WireX}
                y1={k3A1WireStartY}
                x2={k3A1WireX}
                y2={k3A1WireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <circle
                cx={k3A1WireX}
                cy={k3A1WireStartY}
                r={wireStroke + 1}
                fill={wireColor}
              />
              <line
                x1={t1NcFeedX}
                y1={t1NcBottomWireStartY}
                x2={t1NcFeedX}
                y2={t1NcBottomWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Bottom link wire from T1 A2 to K3 A2. */}
              <line
                x1={t1A2TerminalX}
                y1={coilA2LinkY}
                x2={k3A2TerminalX}
                y2={coilA2LinkY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K2 NC contact below the K3 A2 terminal. */}
              <AuxiliaryContactNC
                x={k2NcX}
                y={k2NcY}
                scale={2}
                closed={!deltaOn}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="11"
                terminalB="12"
              />
              <text
                x={392}
                y={882}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K2
              </text>
              <line
                x1={k2NcFeedX}
                y1={k2NcTopWireStartY}
                x2={k2NcFeedX}
                y2={k2NcTopWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* T1 NO contact 67-68 in series with the K2 A1 feed. */}
              <AuxiliaryContactNO
                x={t1NoX}
                y={t1NoY}
                scale={2}
                closed={timerDone}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="67"
                terminalB="68"
              />
              <text
                x={512}
                y={592}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                T
              </text>
              <line
                x1={t1NoFeedX}
                y1={t1NoTopWireStartY}
                x2={t1NoFeedX}
                y2={t1NoTopWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={t1NoFeedX}
                y1={t1NoBottomWireStartY}
                x2={t1NoFeedX}
                y2={t1NoBottomWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K2 NO contact placed parallel to the T1 NO branch. */}
              <AuxiliaryContactNO
                x={k2NoX}
                y={k2NoY}
                scale={2}
                closed={deltaOn}
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
              <text
                x={636}
                y={592}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K2
              </text>
              <line
                x1={k2NoTopLinkStartX}
                y1={k2NoTopLinkY}
                x2={k2NoTopLinkEndX}
                y2={k2NoTopLinkY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k2NoBottomLinkStartX}
                y1={k2NoBottomLinkY}
                x2={k2NoBottomLinkEndX}
                y2={k2NoBottomLinkY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K2 coil placed to the right of K3 on the same lower branch row. */}
              <ContactorCoil
                x={k2CoilX}
                y={k2CoilY}
                scale={2}
                energized={deltaOn}
                label="K2"
                standalone={false}
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
              />
              <text
                x={548}
                y={744}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K2
              </text>

              {/* Wire only for the K2 A1 terminal from the T1 NO branch. */}
              <line
                x1={k2A1WireX}
                y1={k2A1WireStartY}
                x2={k2A1WireX}
                y2={k2A1WireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <circle
                cx={k2A1WireX}
                cy={k2A1WireStartY}
                r={wireStroke + 1}
                fill={wireColor}
              />

              {/* Bottom link wire from K3 A2 to K2 A2.
              <line
                x1={k3A2TerminalX}
                y1={coilA2LinkY}
                x2={k2A2TerminalX}
                y2={coilA2LinkY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              /> */}

              {/* K3 NC contact below the K2 A2 terminal. */}

              <AuxiliaryContactNC
                x={k3NcX}
                y={k3NcY}
                scale={2}
                closed={!starOn}
                label=""
                standalone={false}
                orientation="vertical"
                strokeColor={symbolColor}
                wireStroke={symbolStroke}
                textSize={symbolTextSize}
                showTerminals
                terminalA="11"
                terminalB="12"
              />
              <text
                x={512}
                y={882}
                fontSize="12"
                fontWeight="700"
                fill={labelColor}
              >
                K3
              </text>
              <line
                x1={k3NcFeedX}
                y1={k3NcTopWireStartY}
                x2={k3NcFeedX}
                y2={k3NcTopWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k2NcFeedX}
                y1={k2NcBottomWireStartY}
                x2={k2NcFeedX}
                y2={k2NcBottomWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k3NcFeedX}
                y1={k3NcBottomWireStartY}
                x2={k3NcFeedX}
                y2={k3NcBottomWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Right-side neutral rail and lower return bus. */}
              <line
                x1={neutralVerticalX}
                y1={neutralVerticalStartY}
                x2={neutralVerticalX}
                y2={neutralVerticalEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={controlRiserX}
                y1={neutralReturnBusY}
                x2={neutralVerticalX}
                y2={neutralReturnBusY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Continue the main black wire below the K1 coil like the reference. */}
              <line
                x1={controlRiserX}
                y1={k1CoilBottomWireStartY}
                x2={controlRiserX}
                y2={k1CoilBottomWireEndY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={controlRiserX}
                y1={k1CoilBottomWireEndY}
                x2={controlRiserX}
                y2={neutralReturnBusY}
                stroke={wireColor}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Template caption at the bottom of the drawing board. */}
              <text x="0" y={boardHeight - 10} fontSize="11" fill="#94a3b8">
                Star-Delta Control Diagram Template
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
