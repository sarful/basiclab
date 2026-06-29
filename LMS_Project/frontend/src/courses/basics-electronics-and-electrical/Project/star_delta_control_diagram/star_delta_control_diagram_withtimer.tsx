"use client";

import {
  STAR_DELTA_CONTROL_COLORS,
  STAR_DELTA_CONTROL_GEOMETRY,
  STAR_DELTA_CONTROL_STAGE,
  STAR_DELTA_CONTROL_STROKES,
  buildStarDeltaControlPaths,
} from "../../packages/core/src/star-delta";
import PushButtonNC from "../library/buttons/PushButtonNC";
import PushButtonNO from "../library/buttons/PushButtonNO";
import AuxiliaryContactNC from "../library/contactors/AuxiliaryContactNC";
import AuxiliaryContactNO from "../library/contactors/AuxiliaryContactNO";
import ContactorCoil from "../library/contactors/ContactorCoil";
import MCBControl2P from "../library/protection/MCBControl2P";

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

type WireState = "active" | "inactive" | "fault";

const VIEW_BOX_WIDTH = STAR_DELTA_CONTROL_STAGE.width;
const VIEW_BOX_HEIGHT = STAR_DELTA_CONTROL_STAGE.height;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  mcb: 2,
  pushButton: 2,
  auxContact: 2,
  coil: 2,
} as const;

const BASE_WIRE_WIDTH = STAR_DELTA_CONTROL_STROKES.wireStroke;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  wire: STAR_DELTA_CONTROL_COLORS.wireColor,
  symbol: STAR_DELTA_CONTROL_COLORS.symbolColor,
  label: STAR_DELTA_CONTROL_COLORS.labelColor,
  active: STAR_DELTA_CONTROL_COLORS.activeLineColor,
  inactive: STAR_DELTA_CONTROL_COLORS.inactiveLineColor,
  fault: STAR_DELTA_CONTROL_COLORS.faultLineColor,
  electron: STAR_DELTA_CONTROL_COLORS.electronColor,
} as const;

const STROKE = {
  wire: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  symbol: STAR_DELTA_CONTROL_STROKES.symbolStroke,
  text: STAR_DELTA_CONTROL_STROKES.symbolTextSize,
  electronBlur: STAR_DELTA_CONTROL_STROKES.electronBlur,
  electronRadius: STAR_DELTA_CONTROL_STROKES.electronRadius,
  electronStagger: STAR_DELTA_CONTROL_STROKES.electronStagger,
} as const;

const BOARD = {
  x: STAR_DELTA_CONTROL_STAGE.boardX,
  y: STAR_DELTA_CONTROL_STAGE.boardY,
  width: STAR_DELTA_CONTROL_STAGE.boardWidth,
  height: STAR_DELTA_CONTROL_STAGE.boardHeight,
} as const;

const G = STAR_DELTA_CONTROL_GEOMETRY;

const COMPONENT = {
  mcb: { x: G.mcbX, y: G.mcbY, scale: CIRCUIT_COMPONENT_SCALE.mcb },
  on: {
    x: G.onSwitchX,
    y: G.onSwitchY,
    scale: CIRCUIT_COMPONENT_SCALE.pushButton,
  },
  off: {
    x: G.offSwitchX,
    y: G.offSwitchY,
    scale: CIRCUIT_COMPONENT_SCALE.pushButton,
  },
  overload: {
    x: G.overloadX,
    y: G.overloadY,
    scale: CIRCUIT_COMPONENT_SCALE.auxContact,
  },
  k1Aux: {
    x: G.k1AuxX,
    y: G.k1AuxY,
    scale: CIRCUIT_COMPONENT_SCALE.auxContact,
  },
  t1Nc: { x: G.t1NcX, y: G.t1NcY, scale: CIRCUIT_COMPONENT_SCALE.auxContact },
  k2Nc: { x: G.k2NcX, y: G.k2NcY, scale: CIRCUIT_COMPONENT_SCALE.auxContact },
  t1No: { x: G.t1NoX, y: G.t1NoY, scale: CIRCUIT_COMPONENT_SCALE.auxContact },
  k2No: { x: G.k2NoX, y: G.k2NoY, scale: CIRCUIT_COMPONENT_SCALE.auxContact },
  k3Nc: { x: G.k3NcX, y: G.k3NcY, scale: CIRCUIT_COMPONENT_SCALE.auxContact },
  k1Coil: { x: G.k1CoilX, y: G.k1CoilY, scale: CIRCUIT_COMPONENT_SCALE.coil },
  t1Coil: { x: G.t1CoilX, y: G.t1CoilY, scale: CIRCUIT_COMPONENT_SCALE.coil },
  k3Coil: { x: G.k3CoilX, y: G.k3CoilY, scale: CIRCUIT_COMPONENT_SCALE.coil },
  k2Coil: { x: G.k2CoilX, y: G.k2CoilY, scale: CIRCUIT_COMPONENT_SCALE.coil },
} as const;

const LABEL = {
  n: { x: 0, y: G.neutralTextY },
  l: { x: 0, y: G.liveTextY },
  mcb: { x: 116, y: 92 },
  on: { x: 86, y: 182 },
  k1Aux: { x: 246, y: 182 },
  overload: { x: 110, y: 340 },
  off: { x: 78, y: 462 },
  k1: { x: 166, y: 744 },
  t1: { x: 288, y: 744 },
  tNc: { x: 372, y: 592 },
  k3: { x: 426, y: 744 },
  k2Nc: { x: 392, y: 882 },
  tNo: { x: 512, y: 592 },
  k2No: { x: 636, y: 592 },
  k2Coil: { x: 548, y: 744 },
  k3Nc: { x: 512, y: 882 },
  flow: { x: 540, y: 850 },
} as const;

const PATH = buildStarDeltaControlPaths();

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
      opacity={0.9}
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

function Joint({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={STROKE.wire + 1} fill={STYLE.wire} />;
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
      {STROKE.electronStagger.map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r={STROKE.electronRadius}
          fill={fault ? "#f87171" : STYLE.electron}
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

function ActivePathLayer({
  upstreamState,
  holdState,
  overloadState,
  offState,
  timerState,
  starState,
  deltaState,
  neutralState,
  tripState,
}: {
  upstreamState: WireState;
  holdState: WireState;
  overloadState: WireState;
  offState: WireState;
  timerState: WireState;
  starState: WireState;
  deltaState: WireState;
  neutralState: WireState;
  tripState: WireState;
}) {
  return (
    <>
      <ActivePath d={PATH.sourceToOnPath} state={upstreamState} />
      <ActivePath d={PATH.onPushPath} state={upstreamState} />
      <ActivePath d={PATH.holdSealPath} state={holdState} />
      <ActivePath d={PATH.overloadFeedPath} state={overloadState} />
      <ActivePath d={PATH.overloadContactPath} state={overloadState} />
      <ActivePath d={PATH.offPath} state={offState} />
      <ActivePath d={PATH.mainCoilPath} state={holdState} />
      <ActivePath d={PATH.timerRungPath} state={timerState} />
      <ActivePath d={PATH.starRungPath} state={starState} />
      <ActivePath d={PATH.deltaRungPath} state={deltaState} />
      <ActivePath d={PATH.deltaSealPath} state={deltaState} />
      <ActivePath d={PATH.returnPath} state={neutralState} />
      <ActivePath d={PATH.tripPath} state={tripState} />
    </>
  );
}

function FlowLayer({
  mcbOn,
  overloadTripped,
  upstreamState,
  holdState,
  overloadState,
  offState,
  timerState,
  neutralState,
  tripState,
  starOn,
  deltaOn,
}: {
  mcbOn: boolean;
  overloadTripped: boolean;
  upstreamState: WireState;
  holdState: WireState;
  overloadState: WireState;
  offState: WireState;
  timerState: WireState;
  neutralState: WireState;
  tripState: WireState;
  starOn: boolean;
  deltaOn: boolean;
}) {
  return (
    <>
      <ElectronFlow
        path={PATH.sourceToOnPath}
        active={upstreamState === "active"}
        duration={2.5}
      />
      <ElectronFlow
        path={PATH.onPushPath}
        active={upstreamState === "active"}
        duration={2.1}
      />
      <ElectronFlow
        path={PATH.holdSealPath}
        active={holdState === "active"}
        duration={2.1}
      />
      <ElectronFlow
        path={PATH.overloadFeedPath}
        active={overloadState === "active"}
        duration={2.2}
      />
      <ElectronFlow
        path={PATH.overloadContactPath}
        active={overloadState === "active"}
        duration={2.15}
      />
      <ElectronFlow
        path={PATH.offPath}
        active={offState === "active"}
        duration={2.1}
      />
      <ElectronFlow
        path={PATH.mainCoilPath}
        active={holdState === "active"}
        duration={2.4}
      />
      <ElectronFlow
        path={PATH.timerRungPath}
        active={timerState === "active"}
        duration={2.2}
      />
      <ElectronFlow
        path={PATH.starRungPath}
        active={starOn && !overloadTripped && mcbOn}
        duration={2.5}
      />
      <ElectronFlow
        path={PATH.deltaRungPath}
        active={deltaOn && !overloadTripped && mcbOn}
        duration={2.5}
      />
      <ElectronFlow
        path={PATH.deltaSealPath}
        active={deltaOn && !overloadTripped && mcbOn}
        duration={2}
      />
      <ElectronFlow
        path={PATH.returnPath}
        active={neutralState === "active"}
        duration={3.2}
      />
      <ElectronFlow
        path={PATH.tripPath}
        active={tripState === "fault"}
        fault
        duration={2.2}
      />
    </>
  );
}

function SupplySection() {
  return (
    <>
      <text
        x={LABEL.n.x}
        y={LABEL.n.y}
        fontSize="18"
        fontWeight="700"
        fill="#111111"
      >
        N
      </text>
      <StaticLine
        x1={G.supplyLineStartX}
        y1={G.neutralLineY}
        x2={G.supplyLineEndX}
        y2={G.neutralLineY}
      />
      <StaticLine
        x1={G.neutralRailStartX}
        y1={G.neutralRailY}
        x2={G.neutralRailEndX}
        y2={G.neutralRailY}
      />

      <text
        x={LABEL.l.x}
        y={LABEL.l.y}
        fontSize="18"
        fontWeight="700"
        fill="#111111"
      >
        L
      </text>
      <StaticLine
        x1={G.supplyLineStartX}
        y1={G.liveLineY}
        x2={G.supplyLineEndX}
        y2={G.liveLineY}
      />
    </>
  );
}

function ProtectionAndStartSection({
  mcbOn,
  startPressed,
  mainOn,
}: {
  mcbOn: boolean;
  startPressed: boolean;
  mainOn: boolean;
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
      <text
        x={LABEL.mcb.x}
        y={LABEL.mcb.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        MCB
      </text>

      <StaticLine
        x1={G.controlRiserX}
        y1={G.controlRiserStartY}
        x2={G.controlRiserX}
        y2={G.controlRiserEndY}
      />

      <PushButtonNO
        x={COMPONENT.on.x}
        y={COMPONENT.on.y}
        scale={COMPONENT.on.scale}
        pressed={startPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
      />
      <text
        x={LABEL.on.x}
        y={LABEL.on.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        ON
      </text>

      <StaticLine
        x1={G.holdBranchStartX}
        y1={G.holdBranchY}
        x2={G.holdBranchEndX}
        y2={G.holdBranchY}
      />

      <AuxiliaryContactNO
        x={COMPONENT.k1Aux.x}
        y={COMPONENT.k1Aux.y}
        scale={COMPONENT.k1Aux.scale}
        closed={mainOn}
        label=""
        standalone={false}
        strokeColor={STYLE.symbol}
        terminalA="13"
        terminalB="14"
        orientation="vertical"
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
      />
      <text
        x={LABEL.k1Aux.x}
        y={LABEL.k1Aux.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K1
      </text>

      <StaticLine
        x1={G.holdReturnStartX}
        y1={G.holdReturnY}
        x2={G.holdReturnEndX}
        y2={G.holdReturnY}
      />
    </>
  );
}

function StopOverloadSection({
  overloadTripped,
  stopPressed,
}: {
  overloadTripped: boolean;
  stopPressed: boolean;
}) {
  return (
    <>
      <StaticLine
        x1={G.controlRiserX}
        y1={G.overloadRiserStartY}
        x2={G.controlRiserX}
        y2={G.overloadRiserEndY}
      />

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
      <text
        x={LABEL.overload.x}
        y={LABEL.overload.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        O/L NC
      </text>

      <StaticLine
        x1={G.controlRiserX}
        y1={G.offRiserStartY}
        x2={G.controlRiserX}
        y2={G.offRiserEndY}
      />

      <PushButtonNC
        x={COMPONENT.off.x}
        y={COMPONENT.off.y}
        scale={COMPONENT.off.scale}
        pressed={stopPressed}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
      />
      <text
        x={LABEL.off.x}
        y={LABEL.off.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        OFF
      </text>

      <StaticLine
        x1={G.controlRiserX}
        y1={G.k1CoilRiserStartY}
        x2={G.controlRiserX}
        y2={G.k1CoilRiserEndY}
      />
      <StaticLine
        x1={G.k1BranchBusStartX}
        y1={G.k1BranchBusY}
        x2={G.k1BranchBusEndX}
        y2={G.k1BranchBusY}
      />
    </>
  );
}

function MainTimerStarSection({
  mainOn,
  timerOn,
  timerDone,
  starOn,
  deltaOn,
}: {
  mainOn: boolean;
  timerOn: boolean;
  timerDone: boolean;
  starOn: boolean;
  deltaOn: boolean;
}) {
  return (
    <>
      <ContactorCoil
        x={COMPONENT.k1Coil.x}
        y={COMPONENT.k1Coil.y}
        scale={COMPONENT.k1Coil.scale}
        energized={mainOn}
        label="K1"
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />
      <text
        x={LABEL.k1.x}
        y={LABEL.k1.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K1
      </text>

      <ContactorCoil
        x={COMPONENT.t1Coil.x}
        y={COMPONENT.t1Coil.y}
        scale={COMPONENT.t1Coil.scale}
        energized={timerOn}
        label="T1"
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />
      <text
        x={LABEL.t1.x}
        y={LABEL.t1.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        T1
      </text>

      <StaticLine
        x1={G.t1A1WireX}
        y1={G.t1A1WireStartY}
        x2={G.t1A1WireX}
        y2={G.t1A1WireEndY}
      />
      <Joint cx={G.t1A1WireX} cy={G.t1A1WireStartY} />

      <AuxiliaryContactNC
        x={COMPONENT.t1Nc.x}
        y={COMPONENT.t1Nc.y}
        scale={COMPONENT.t1Nc.scale}
        closed={!timerDone}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="55"
        terminalB="56"
      />
      <text
        x={LABEL.tNc.x}
        y={LABEL.tNc.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        T
      </text>
      <StaticLine
        x1={G.t1NcFeedX}
        y1={G.t1NcTopWireStartY}
        x2={G.t1NcFeedX}
        y2={G.t1NcTopWireEndY}
      />

      <ContactorCoil
        x={COMPONENT.k3Coil.x}
        y={COMPONENT.k3Coil.y}
        scale={COMPONENT.k3Coil.scale}
        energized={starOn}
        label="K3"
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />
      <text
        x={LABEL.k3.x}
        y={LABEL.k3.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K3
      </text>

      <StaticLine
        x1={G.k3A1WireX}
        y1={G.k3A1WireStartY}
        x2={G.k3A1WireX}
        y2={G.k3A1WireEndY}
      />
      <Joint cx={G.k3A1WireX} cy={G.k3A1WireStartY} />
      <StaticLine
        x1={G.t1NcFeedX}
        y1={G.t1NcBottomWireStartY}
        x2={G.t1NcFeedX}
        y2={G.t1NcBottomWireEndY}
      />

      <StaticLine
        x1={G.t1A2TerminalX}
        y1={G.coilA2LinkY}
        x2={G.k3A2TerminalX}
        y2={G.coilA2LinkY}
      />

      <AuxiliaryContactNC
        x={COMPONENT.k2Nc.x}
        y={COMPONENT.k2Nc.y}
        scale={COMPONENT.k2Nc.scale}
        closed={!deltaOn}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="11"
        terminalB="12"
      />
      <text
        x={LABEL.k2Nc.x}
        y={LABEL.k2Nc.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K2
      </text>
      <StaticLine
        x1={G.k2NcFeedX}
        y1={G.k2NcTopWireStartY}
        x2={G.k2NcFeedX}
        y2={G.k2NcTopWireEndY}
      />
    </>
  );
}

function DeltaSection({
  timerDone,
  deltaOn,
  starOn,
}: {
  timerDone: boolean;
  deltaOn: boolean;
  starOn: boolean;
}) {
  return (
    <>
      <AuxiliaryContactNO
        x={COMPONENT.t1No.x}
        y={COMPONENT.t1No.y}
        scale={COMPONENT.t1No.scale}
        closed={timerDone}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="67"
        terminalB="68"
      />
      <text
        x={LABEL.tNo.x}
        y={LABEL.tNo.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        T
      </text>

      <StaticLine
        x1={G.t1NoFeedX}
        y1={G.t1NoTopWireStartY}
        x2={G.t1NoFeedX}
        y2={G.t1NoTopWireEndY}
      />
      <StaticLine
        x1={G.t1NoFeedX}
        y1={G.t1NoBottomWireStartY}
        x2={G.t1NoFeedX}
        y2={G.t1NoBottomWireEndY}
      />

      <AuxiliaryContactNO
        x={COMPONENT.k2No.x}
        y={COMPONENT.k2No.y}
        scale={COMPONENT.k2No.scale}
        closed={deltaOn}
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
      <text
        x={LABEL.k2No.x}
        y={LABEL.k2No.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K2
      </text>

      <StaticLine
        x1={G.k2NoTopLinkStartX}
        y1={G.k2NoTopLinkY}
        x2={G.k2NoTopLinkEndX}
        y2={G.k2NoTopLinkY}
      />
      <StaticLine
        x1={G.k2NoBottomLinkStartX}
        y1={G.k2NoBottomLinkY}
        x2={G.k2NoBottomLinkEndX}
        y2={G.k2NoBottomLinkY}
      />

      <ContactorCoil
        x={COMPONENT.k2Coil.x}
        y={COMPONENT.k2Coil.y}
        scale={COMPONENT.k2Coil.scale}
        energized={deltaOn}
        label="K2"
        standalone={false}
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
      />
      <text
        x={LABEL.k2Coil.x}
        y={LABEL.k2Coil.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K2
      </text>

      <StaticLine
        x1={G.k2A1WireX}
        y1={G.k2A1WireStartY}
        x2={G.k2A1WireX}
        y2={G.k2A1WireEndY}
      />
      <Joint cx={G.k2A1WireX} cy={G.k2A1WireStartY} />

      <AuxiliaryContactNC
        x={COMPONENT.k3Nc.x}
        y={COMPONENT.k3Nc.y}
        scale={COMPONENT.k3Nc.scale}
        closed={!starOn}
        label=""
        standalone={false}
        orientation="vertical"
        strokeColor={STYLE.symbol}
        wireStroke={STROKE.symbol}
        textSize={STROKE.text}
        showTerminals
        terminalA="11"
        terminalB="12"
      />
      <text
        x={LABEL.k3Nc.x}
        y={LABEL.k3Nc.y}
        fontSize="12"
        fontWeight="700"
        fill={STYLE.label}
      >
        K3
      </text>

      <StaticLine
        x1={G.k3NcFeedX}
        y1={G.k3NcTopWireStartY}
        x2={G.k3NcFeedX}
        y2={G.k3NcTopWireEndY}
      />
      <StaticLine
        x1={G.k2NcFeedX}
        y1={G.k2NcBottomWireStartY}
        x2={G.k2NcFeedX}
        y2={G.k2NcBottomWireEndY}
      />
      <StaticLine
        x1={G.k3NcFeedX}
        y1={G.k3NcBottomWireStartY}
        x2={G.k3NcFeedX}
        y2={G.k3NcBottomWireEndY}
      />
    </>
  );
}

function NeutralReturnSection() {
  return (
    <>
      <StaticLine
        x1={G.neutralVerticalX}
        y1={G.neutralVerticalStartY}
        x2={G.neutralVerticalX}
        y2={G.neutralVerticalEndY}
      />
      <StaticLine
        x1={G.controlRiserX}
        y1={G.neutralReturnBusY}
        x2={G.neutralVerticalX}
        y2={G.neutralReturnBusY}
      />
      <StaticLine
        x1={G.controlRiserX}
        y1={G.k1CoilBottomWireStartY}
        x2={G.controlRiserX}
        y2={G.k1CoilBottomWireEndY}
      />
      <StaticLine
        x1={G.controlRiserX}
        y1={G.k1CoilBottomWireEndY}
        x2={G.controlRiserX}
        y2={G.neutralReturnBusY}
      />
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

  const circuitDemand = mainOn || timerOn || starOn || deltaOn || transferOpen;

  const upstreamState: WireState =
    mcbOn && !overloadTripped && circuitDemand ? "active" : "inactive";

  const starState: WireState =
    mcbOn && !overloadTripped && starOn ? "active" : "inactive";
  const deltaState: WireState =
    mcbOn && !overloadTripped && deltaOn ? "active" : "inactive";
  const holdState: WireState =
    mcbOn && !overloadTripped && mainOn ? "active" : "inactive";
  const timerState: WireState =
    mcbOn && !overloadTripped && timerOn ? "active" : "inactive";
  const overloadState: WireState =
    mcbOn && !overloadTripped && circuitDemand ? "active" : "inactive";
  const offState: WireState =
    mcbOn && !overloadTripped && circuitDemand ? "active" : "inactive";
  const neutralState: WireState =
    mcbOn && !overloadTripped && (mainOn || timerOn || starOn || deltaOn)
      ? "active"
      : "inactive";

  const tripState: WireState = mcbOn && overloadTripped ? "fault" : "inactive";
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div className="control-diagram-shell">
        <div className="control-diagram-scroll">
          <svg
            viewBox={VIEW_BOX}
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
              <rect
                x={0}
                y={0}
                width={BOARD.width}
                height={BOARD.height}
                rx={14}
                fill="#ffffff"
                stroke="#d1dae5"
                strokeWidth={1}
              />

              <g transform={canvasTransform}>
                <ActivePathLayer
                  upstreamState={upstreamState}
                  holdState={holdState}
                  overloadState={overloadState}
                  offState={offState}
                  timerState={timerState}
                  starState={starState}
                  deltaState={deltaState}
                  neutralState={neutralState}
                  tripState={tripState}
                />

                <FlowLayer
                  mcbOn={mcbOn}
                  overloadTripped={overloadTripped}
                  upstreamState={upstreamState}
                  holdState={holdState}
                  overloadState={overloadState}
                  offState={offState}
                  timerState={timerState}
                  neutralState={neutralState}
                  tripState={tripState}
                  starOn={starOn}
                  deltaOn={deltaOn}
                />

                <SupplySection />

                <ProtectionAndStartSection
                  mcbOn={mcbOn}
                  startPressed={startPressed}
                  mainOn={mainOn}
                />

                <StopOverloadSection
                  overloadTripped={overloadTripped}
                  stopPressed={stopPressed}
                />

                <MainTimerStarSection
                  mainOn={mainOn}
                  timerOn={timerOn}
                  timerDone={timerDone}
                  starOn={starOn}
                  deltaOn={deltaOn}
                />

                <DeltaSection
                  timerDone={timerDone}
                  deltaOn={deltaOn}
                  starOn={starOn}
                />

                <NeutralReturnSection />

                <text
                  x={LABEL.flow.x}
                  y={LABEL.flow.y}
                  fontSize="12"
                  fontWeight="700"
                  fill={STYLE.label}
                >
                  {flowStateLabel ?? "Idle"}
                </text>

                <text x="0" y={BOARD.height - 10} fontSize="11" fill="#94a3b8">
                  Star-Delta Control Diagram Template
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
