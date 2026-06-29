"use client";

import {
  ACVoltageSourceSymbol,
  BackgroundPixelGred,
  DiodeSymbol,
  LEDSymbol,
  PolarizedCapacitorSymbol,
  ResistorSymbol,
  TransformerCenterTapV1Symbol,
  VoltageRegulatorSymbol,
} from "../library";

type LinearPowerSupplyCircuitProps = {
  supplyOn?: boolean;
  outputRunning?: boolean;
  faultActive?: boolean;
  regulatorModel?: "7805" | "7809" | "7812";
  resistorOhms?: number;
  capacitorUf?: number;
  ledColor?: "green" | "yellow";
  componentStateBadges?: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }>;
  scaleMode?: "fit" | "actual";
  showLabels?: boolean;
  showFlow?: boolean;
};

function ActivePath({
  d,
  active,
  color = "#16a34a",
}: {
  d: string;
  active: boolean;
  color?: string;
}) {
  if (!active) {
    return null;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
  );
}

function FlowDots({
  d,
  active,
  color = "#fde047",
  count = 3,
  duration = 2.4,
  radius = 3.5,
  begin = 0,
  visibilityPhase,
}: {
  d: string;
  active: boolean;
  color?: string;
  count?: number;
  duration?: number;
  radius?: number;
  begin?: number;
  visibilityPhase?: "upper" | "lower";
}) {
  if (!active) {
    return null;
  }

  return (
    <g aria-hidden="true">
      {visibilityPhase === "upper" ? (
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.46;0.5;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      ) : null}
      {visibilityPhase === "lower" ? (
        <animate
          attributeName="opacity"
          values="0;0;1;1"
          keyTimes="0;0.46;0.5;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      ) : null}
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={`${d}-${index}`}
          r={radius}
          fill={color}
          opacity="0.95"
          filter="url(#electron-dot-glow)"
        >
          <animateMotion
            dur={`${duration}s`}
            begin={`${begin + (duration / count) * index}s`}
            repeatCount="indefinite"
            path={d}
            rotate="auto"
          />
        </circle>
      ))}
    </g>
  );
}

function RectifierPhaseGroup({
  phase,
  children,
}: {
  phase: "upper" | "lower";
  children: React.ReactNode;
}) {
  return (
    <g aria-hidden="true">
      {phase === "upper" ? (
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.46;0.5;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      ) : (
        <animate
          attributeName="opacity"
          values="0;0;1;1"
          keyTimes="0;0.46;0.5;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      )}
      {children}
    </g>
  );
}

export default function LinearPowerSupplyCircuit({
  supplyOn = false,
  outputRunning = false,
  faultActive = false,
  regulatorModel = "7805",
  resistorOhms = 100,
  capacitorUf = 450,
  ledColor = "green",
  componentStateBadges = [],
  scaleMode = "fit",
  showLabels = true,
  showFlow = true,
}: LinearPowerSupplyCircuitProps) {
  const stageWidth = 760;
  const stageHeight = 420;
  const boardLeft = 24;
  const boardTop = 20;
  const sourceX = 28;
  const sourceY = 162;
  const sourceWidth = 24;
  const sourceHeight = 150;
  const transformerX = 100;
  const transformerY = 158;
  const transformerWidth = 150;
  const transformerHeight = 150;
  const diodeX = 220;
  const diodeY = 50;
  const diode2X = 220;
  const diode2Y = 258;
  const diodeWidth = 124;
  const diodeHeight = 72;
  const capacitorX = 370;
  const capacitorY = 140;
  const capacitorWidth = 124;
  const capacitorHeight = 72;
  const regulatorX = 470;
  const regulatorY = 52;
  const regulatorWidth = 150;
  const regulatorHeight = 108;
  const resistorX = 600;
  const resistorY = 50;
  const resistorWidth = 124;
  const resistorHeight = 72;
  const ledX = 690;
  const ledY = 110;
  const ledWidth = 124;
  const ledHeight = 88;

  // Keep the AC input source on the transformer primary side using the same SVG board coordinates.
  const sourceLeft = boardLeft + sourceX - sourceWidth / 2;
  const sourceTop = boardTop + sourceY - sourceHeight / 2;
  const sourceScaleX = sourceWidth / 320;
  const sourceScaleY = sourceHeight / 560;
  const sourceTerminalFineTuneX = 5;
  const sourceTopTerminalX =
    sourceLeft + 80 * sourceScaleX + sourceTerminalFineTuneX;
  const sourceTopTerminalY = sourceTop + 200 * sourceScaleY;
  const sourceBottomTerminalX =
    sourceLeft + 100 * sourceScaleX + sourceTerminalFineTuneX;
  const sourceBottomTerminalY = sourceTop + 360 * sourceScaleY;
  const sourceToTransformerJoinX = sourceTopTerminalX + 14;

  // Map real symbol terminal coordinates from the transformer SVG into board space.
  const transformerLeft = boardLeft + transformerX - transformerWidth / 2;
  const transformerTop = boardTop + transformerY - transformerHeight / 2;
  const transformerScaleX = transformerWidth / 220;
  const transformerScaleY = transformerHeight / 210;
  const transformerPrimaryTopTerminalX =
    transformerLeft + 47 * transformerScaleX;
  const transformerPrimaryTopTerminalY =
    transformerTop + 60 * transformerScaleY;
  const transformerPrimaryBottomTerminalX =
    transformerLeft + 47 * transformerScaleX;
  const transformerPrimaryBottomTerminalY =
    transformerTop + 159 * transformerScaleY;
  const transformerTopTerminalX = transformerLeft + 147 * transformerScaleX;
  const transformerTopTerminalY = transformerTop + 60 * transformerScaleY;
  const transformerBottomTerminalX = transformerLeft + 147 * transformerScaleX;
  const transformerBottomTerminalY = transformerTop + 159 * transformerScaleY;
  const transformerCenterTapX = transformerLeft + 147 * transformerScaleX;
  const transformerCenterTapY = transformerTop + 109 * transformerScaleY;

  // Map the diode anode lead-in point from the diode SVG into board space.
  const diodeLeft = boardLeft + diodeX - diodeWidth / 2;
  const diodeTop = boardTop + diodeY - diodeHeight / 2;
  const diode2Left = boardLeft + diode2X - diodeWidth / 2;
  const diode2Top = boardTop + diode2Y - diodeHeight / 2;
  const diodeScaleX = diodeWidth / 71;
  const diodeScaleY = diodeHeight / 41;
  const diodeAnodeX = diodeLeft + (0 - -10) * diodeScaleX;
  const diodeAnodeY = diodeTop + (10 - -10) * diodeScaleY;
  const diode2AnodeX = diode2Left + (0 - -10) * diodeScaleX;
  const diode2AnodeY = diode2Top + (10 - -10) * diodeScaleY;
  const diodeCathodeX = diodeLeft + (50 - -10) * diodeScaleX;
  const diodeCathodeY = diodeTop + (10 - -10) * diodeScaleY;
  const diode2CathodeX = diode2Left + (50 - -10) * diodeScaleX;
  const diode2CathodeY = diode2Top + (10 - -10) * diodeScaleY;
  const rectifierJoinX = diodeCathodeX + 50;
  const diode2FeedJoinX = diode2AnodeX - 18;

  // Map the rotated polarized capacitor leads from its native SVG into board space.
  const capacitorCenterX = boardLeft + capacitorX;
  const capacitorCenterY = boardTop + capacitorY - 80;
  const capacitorScaleX = capacitorWidth / 71;
  const capacitorScaleY = capacitorHeight / 41;
  const capacitorLeadOffsetX = -capacitorHeight / 2 + 20 * capacitorScaleY;
  const capacitorTopLeadOffsetY = -(-capacitorWidth / 2 + 10 * capacitorScaleX);
  const capacitorBottomLeadOffsetY = -(
    -capacitorWidth / 2 +
    60 * capacitorScaleX
  );
  const capacitorTerminalX = capacitorCenterX + capacitorLeadOffsetX;
  const capacitorTopTerminalY = capacitorCenterY + capacitorTopLeadOffsetY;
  const capacitorBottomTerminalY =
    capacitorCenterY + capacitorBottomLeadOffsetY + 165;
  const capacitorBottomBusX = capacitorTerminalX - 99;

  // Map the 7805 input lead from the regulator symbol into board space.
  const regulatorLeft = boardLeft + regulatorX - regulatorWidth / 2;
  const regulatorTop = boardTop + regulatorY - regulatorHeight / 2;
  const regulatorScaleX = regulatorWidth / 277;
  const regulatorScaleY = regulatorHeight / 199;
  const regulatorInX = regulatorLeft + 100 * regulatorScaleX;
  const regulatorInY = regulatorTop + 94 * regulatorScaleY;
  const regulatorOutX = regulatorLeft + 202 * regulatorScaleX;
  const regulatorOutY = regulatorTop + 94 * regulatorScaleY;
  const regulatorGndX = regulatorLeft + 151 * regulatorScaleX;
  const regulatorGndY = regulatorTop + 145 * regulatorScaleY;

  // Map the series output resistor leads from its native SVG into board space.
  const resistorLeft = boardLeft + resistorX - resistorWidth / 2;
  const resistorTop = boardTop + resistorY - resistorHeight / 2;
  const resistorScaleX = resistorWidth / 71;
  const resistorScaleY = resistorHeight / 41;
  const resistorInputX = resistorLeft + (0 - -10) * resistorScaleX;
  const resistorInputY = resistorTop + (10 - -10) * resistorScaleY;
  const resistorOutputX = resistorLeft + (50 - -10) * resistorScaleX;
  const resistorOutputY = resistorTop + (10 - -10) * resistorScaleY;

  // Map the rotated LED leads from its native SVG into board space.
  const ledCenterX = boardLeft + ledX;
  const ledCenterY = boardTop + ledY;
  const ledScaleX = ledWidth / 71;
  const ledScaleY = ledHeight / 51;
  const ledLeadNativeY = (19.992 - -10) * ledScaleY;
  const ledAnodeNativeX = (0 - -10) * ledScaleX;
  const ledCathodeNativeX = (50 - -10) * ledScaleX;
  const ledAnodeRelX = ledAnodeNativeX - ledWidth / 2;
  const ledCathodeRelX = ledCathodeNativeX - ledWidth / 2;
  const ledLeadRelY = ledLeadNativeY - ledHeight / 2;
  const ledTopLeadX = ledCenterX - ledLeadRelY;
  const ledTopLeadY = ledCenterY + ledAnodeRelX;
  const ledBottomLeadX = ledCenterX - ledLeadRelY;
  const ledBottomLeadY = ledCenterY + ledCathodeRelX;
  const primaryTopWire = `M ${sourceTopTerminalX} ${sourceTopTerminalY} H ${sourceToTransformerJoinX} V ${transformerPrimaryTopTerminalY} H ${transformerPrimaryTopTerminalX}`;
  const primaryBottomWire = `M ${sourceBottomTerminalX} ${sourceBottomTerminalY} H ${sourceToTransformerJoinX} V ${transformerPrimaryBottomTerminalY} H ${transformerPrimaryBottomTerminalX}`;
  const upperRectifierWire = `M ${transformerTopTerminalX} ${transformerTopTerminalY} H ${diodeAnodeX} V ${diodeAnodeY}`;
  const lowerRectifierWire = `M ${transformerBottomTerminalX} ${transformerBottomTerminalY} H ${diode2FeedJoinX} V ${diode2AnodeY} H ${diode2AnodeX}`;
  const upperDiodeJoinWire = `M ${diodeCathodeX} ${diodeCathodeY} H ${rectifierJoinX}`;
  const rectifierBusWire = `M ${rectifierJoinX} ${diodeCathodeY} V ${diode2CathodeY}`;
  const rectifierBusUpWire = `M ${rectifierJoinX} ${diode2CathodeY} V ${diodeCathodeY}`;
  const lowerDiodeJoinWire = `M ${diode2CathodeX} ${diode2CathodeY} H ${rectifierJoinX}`;
  const capacitorTopWire = `M ${rectifierJoinX} ${diodeCathodeY} H ${capacitorTerminalX} V ${capacitorTopTerminalY}`;
  const capacitorBottomWire = `M ${transformerCenterTapX} ${transformerCenterTapY} H ${capacitorBottomBusX} V ${capacitorBottomTerminalY} H ${capacitorTerminalX}`;
  const regulatorInputWire = `M ${capacitorTerminalX} ${diodeCathodeY} H ${regulatorInX} V ${regulatorInY}`;
  const regulatorGroundWire = `M ${regulatorGndX} ${regulatorGndY} V ${capacitorBottomTerminalY} H ${capacitorBottomBusX}`;
  const outputRailWire = `M ${regulatorOutX} ${regulatorOutY} H ${resistorInputX}`;
  const resistorStubWire = `M ${resistorOutputX} ${resistorOutputY} H ${resistorOutputX + 40}`;
  const ledFeedWire = `M ${resistorOutputX + 40} ${resistorOutputY} H ${ledTopLeadX} V ${ledTopLeadY}`;
  const ledReturnWire = `M ${ledBottomLeadX} ${ledBottomLeadY} V ${capacitorBottomTerminalY} H ${capacitorBottomBusX}`;
  const acStageActive = supplyOn;
  const rectifierStageActive = supplyOn;
  const filterStageActive = supplyOn;
  const regulatorStageActive = supplyOn && !faultActive;
  const outputStageActive = supplyOn && outputRunning && !faultActive;
  const outputReturnActive = outputStageActive;
  const ledOn = outputStageActive;
  const ledGlowFill =
    ledColor === "yellow"
      ? "rgba(250, 204, 21, 0.32)"
      : "rgba(34, 197, 94, 0.28)";
  const toneStyles = {
    neutral: { fill: "#f8fafc", stroke: "#cbd5e1", text: "#475569" },
    active: { fill: "#ecfdf5", stroke: "#86efac", text: "#166534" },
    fault: { fill: "#fef2f2", stroke: "#fca5a5", text: "#b91c1c" },
  } as const;
  const badgeAnchors: Record<
    string,
    { x: number; y: number; width?: number; height?: number }
  > = {
    transformer: { x: 54, y: 118, width: 108, height: 30 },
    rectifier: { x: 254, y: 14, width: 104, height: 30 },
    capacitor: { x: 386, y: 114, width: 110, height: 30 },
    regulator: { x: 452, y: 10, width: 118, height: 30 },
    led: { x: 642, y: 118, width: 96, height: 30 },
  };

  return (
    <div className="project-workspace-empty-state linear-power-supply-canvas-placeholder">
      <div
        style={{ position: "relative", minHeight: "420px", overflow: "hidden" }}
      >
        <svg
          className={showLabels ? "" : "linear-power-supply-hide-labels"}
          width={stageWidth}
          height={stageHeight}
          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
          preserveAspectRatio="xMidYMin meet"
          style={{
            display: "block",
            width: scaleMode === "actual" ? `${stageWidth}px` : "100%",
            maxWidth: scaleMode === "actual" ? "none" : `${stageWidth}px`,
            height: "auto",
            margin: "0 auto",
          }}
          aria-hidden="true"
        >
          <defs>
            <filter
              id="electron-dot-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="led-on-glow"
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="10" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <BackgroundPixelGred width={stageWidth} height={stageHeight} />
          {/* Feed the transformer primary from the AC input source without disturbing the established secondary-side layout. */}
          <path
            d={primaryTopWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={primaryBottomWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* First rebuild wire: transformer secondary top terminal to D1 anode. */}
          <path
            d={upperRectifierWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Second rebuild wire: transformer secondary lower terminal to D2 anode. */}
          <path
            d={lowerRectifierWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Join both diode cathodes into the first rectified output node. */}
          <path
            d={upperDiodeJoinWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={rectifierBusWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={lowerDiodeJoinWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Connect the rectified output node to the top terminal of C2. */}
          <path
            d={capacitorTopWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Connect the transformer center tap return to the bottom terminal of C2. */}
          <path
            d={capacitorBottomWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Feed the 7805 input from the rectified positive rail. */}
          <path
            d={regulatorInputWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Drop the 7805 ground lead to the existing return rail. */}
          <path
            d={regulatorGroundWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start the regulated output rail from the 7805 OUT lead for the next stage. */}
          <path
            d={outputRailWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Leave a short output stub after R1 for the upcoming LED stage. */}
          <path
            d={resistorStubWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Feed D4 from the resistor output stub. */}
          <path
            d={ledFeedWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Return the LED lower lead back to the common return rail. */}
          <path
            d={ledReturnWire}
            fill="none"
            stroke="#3f4a4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Draw live flow after the base wires so the highlight stays visible in the simulation canvas. */}
          <ActivePath
            d={primaryTopWire}
            active={showFlow && acStageActive}
            color="#2563eb"
          />
          <ActivePath
            d={primaryBottomWire}
            active={showFlow && acStageActive}
            color="#2563eb"
          />
          <RectifierPhaseGroup phase="upper">
            <ActivePath
              d={upperRectifierWire}
              active={showFlow && rectifierStageActive}
            />
            <ActivePath
              d={upperDiodeJoinWire}
              active={showFlow && rectifierStageActive}
            />
          </RectifierPhaseGroup>
          <RectifierPhaseGroup phase="lower">
            <ActivePath
              d={lowerRectifierWire}
              active={showFlow && rectifierStageActive}
            />
            <ActivePath
              d={lowerDiodeJoinWire}
              active={showFlow && rectifierStageActive}
            />
          </RectifierPhaseGroup>
          <ActivePath
            d={rectifierBusWire}
            active={showFlow && rectifierStageActive}
          />
          <ActivePath
            d={capacitorTopWire}
            active={showFlow && filterStageActive}
            color="#16a34a"
          />
          <ActivePath
            d={capacitorBottomWire}
            active={showFlow && filterStageActive}
            color="#16a34a"
          />
          <ActivePath
            d={regulatorInputWire}
            active={showFlow && regulatorStageActive}
            color="#16a34a"
          />
          <ActivePath
            d={regulatorGroundWire}
            active={showFlow && outputReturnActive}
            color="#16a34a"
          />
          <ActivePath
            d={outputRailWire}
            active={showFlow && outputStageActive}
          />
          <ActivePath
            d={resistorStubWire}
            active={showFlow && outputStageActive}
          />
          <ActivePath d={ledFeedWire} active={showFlow && outputStageActive} />
          <ActivePath
            d={ledReturnWire}
            active={showFlow && outputReturnActive}
          />
          {/* Move electron dots along the same live paths so students can see current progression stage by stage. */}
          <FlowDots
            d={primaryTopWire}
            active={showFlow && acStageActive}
            color="#60a5fa"
            count={2}
            duration={2.8}
          />
          <FlowDots
            d={primaryBottomWire}
            active={showFlow && acStageActive}
            color="#60a5fa"
            count={2}
            duration={2.8}
          />
          <RectifierPhaseGroup phase="upper">
            <FlowDots
              d={upperRectifierWire}
              active={showFlow && rectifierStageActive}
              color="#fde047"
              count={1}
              duration={2.4}
              begin={0}
            />
            <FlowDots
              d={upperDiodeJoinWire}
              active={showFlow && rectifierStageActive}
              color="#fde047"
              count={1}
              duration={2.4}
              begin={0.25}
            />
          </RectifierPhaseGroup>
          <RectifierPhaseGroup phase="lower">
            <FlowDots
              d={lowerRectifierWire}
              active={showFlow && rectifierStageActive}
              color="#fde047"
              count={1}
              duration={2.4}
              begin={1.2}
            />
            <FlowDots
              d={lowerDiodeJoinWire}
              active={showFlow && rectifierStageActive}
              color="#fde047"
              count={1}
              duration={2.4}
              begin={1.45}
            />
            <FlowDots
              d={rectifierBusUpWire}
              active={showFlow && rectifierStageActive}
              color="#fde047"
              count={1}
              duration={2.4}
              begin={1.7}
            />
          </RectifierPhaseGroup>
          <FlowDots
            d={capacitorTopWire}
            active={showFlow && filterStageActive}
            color="#86efac"
            count={2}
            duration={2}
          />
          <FlowDots
            d={capacitorBottomWire}
            active={showFlow && filterStageActive}
            color="#86efac"
            count={2}
            duration={2}
          />
          <FlowDots
            d={regulatorInputWire}
            active={showFlow && regulatorStageActive}
            color="#4ade80"
            count={2}
            duration={1.9}
          />
          <FlowDots
            d={outputRailWire}
            active={showFlow && outputStageActive}
            color="#22c55e"
            count={2}
            duration={1.8}
          />
          <FlowDots
            d={resistorStubWire}
            active={showFlow && outputStageActive}
            color="#22c55e"
            count={2}
            duration={1.6}
          />
          <FlowDots
            d={ledFeedWire}
            active={showFlow && outputStageActive}
            color="#22c55e"
            count={2}
            duration={1.6}
          />
          <FlowDots
            d={regulatorGroundWire}
            active={showFlow && outputReturnActive}
            color="#34d399"
            count={2}
            duration={1.8}
          />
          <FlowDots
            d={ledReturnWire}
            active={showFlow && outputReturnActive}
            color="#34d399"
            count={2}
            duration={1.6}
          />
          {componentStateBadges.map((badge) => {
            const anchor = badgeAnchors[badge.key];
            if (!anchor) return null;
            const tone = toneStyles[badge.tone];
            const width = anchor.width ?? 98;
            const height = anchor.height ?? 30;

            return (
              <g
                key={`badge-${badge.key}`}
                transform={`translate(${anchor.x}, ${anchor.y})`}
              >
                <rect
                  width={width}
                  height={height}
                  rx={15}
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth="1"
                />
                <text
                  x={10}
                  y={13}
                  fontSize="8"
                  fontWeight="800"
                  fill={tone.text}
                >
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

          {/* Keep every symbol inside the same SVG board so scaling stays locked to the wires. */}
          <svg
            x={sourceLeft}
            y={sourceTop}
            width={sourceWidth}
            height={sourceHeight}
            viewBox={`0 0 ${sourceWidth} ${sourceHeight}`}
            overflow="visible"
          >
            <ACVoltageSourceSymbol width={sourceWidth} height={sourceHeight} />
          </svg>

          <svg
            x={transformerLeft}
            y={transformerTop}
            width={transformerWidth}
            height={transformerHeight}
            viewBox={`0 0 ${transformerWidth} ${transformerHeight}`}
            overflow="visible"
          >
            <TransformerCenterTapV1Symbol
              width={transformerWidth}
              height={transformerHeight}
            />
          </svg>

          <svg
            x={diodeLeft}
            y={diodeTop}
            width={diodeWidth}
            height={diodeHeight}
            viewBox={`0 0 ${diodeWidth} ${diodeHeight}`}
            overflow="visible"
          >
            <DiodeSymbol label="D1" width={diodeWidth} height={diodeHeight} />
          </svg>
          <rect
            x={diodeLeft + 10}
            y={diodeTop + 6}
            width="16"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />
          <rect
            x={diodeLeft + 84}
            y={diodeTop + 6}
            width="16"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />

          <svg
            x={diode2Left}
            y={diode2Top}
            width={diodeWidth}
            height={diodeHeight}
            viewBox={`0 0 ${diodeWidth} ${diodeHeight}`}
            overflow="visible"
          >
            {/* Second rectifier diode placeholder, added without changing manual layout. */}
            <DiodeSymbol label="D2" width={diodeWidth} height={diodeHeight} />
          </svg>
          <rect
            x={diode2Left + 10}
            y={diode2Top + 6}
            width="16"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />
          <rect
            x={diode2Left + 84}
            y={diode2Top + 6}
            width="16"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />

          {/* Place the first filter capacitor beside the rectifier output, matching the reference layout direction. */}
          <g
            transform={`translate(${boardLeft + capacitorX}, ${boardTop + capacitorY}) rotate(90)`}
          >
            <svg
              x={-capacitorWidth / 2}
              y={-capacitorHeight / 2}
              width={capacitorWidth}
              height={capacitorHeight}
              viewBox={`0 0 ${capacitorWidth} ${capacitorHeight}`}
              overflow="visible"
            >
              <PolarizedCapacitorSymbol
                label="C2"
                width={capacitorWidth}
                height={capacitorHeight}
              />
            </svg>
          </g>

          {showLabels ? (
            <>
              <text
                x={boardLeft + capacitorX + 28}
                y={boardTop + capacitorY - 6}
                fill="#1f2937"
                fontSize="16"
                fontWeight="700"
              >
                C2
              </text>
              <text
                x={boardLeft + capacitorX + 28}
                y={boardTop + capacitorY + 18}
                fill="#1f2937"
                fontSize="14"
                fontWeight="600"
              >
                {capacitorUf} uF
              </text>
            </>
          ) : null}

          {/* Add the 7805 regulator body in the next stage position without changing the existing circuit layout. */}
          <svg
            x={boardLeft + regulatorX - regulatorWidth / 2}
            y={boardTop + regulatorY - regulatorHeight / 2}
            width={regulatorWidth}
            height={regulatorHeight}
            viewBox={`0 0 ${regulatorWidth} ${regulatorHeight}`}
            overflow="visible"
          >
            <VoltageRegulatorSymbol
              label=""
              width={regulatorWidth}
              height={regulatorHeight}
            />
          </svg>
          <rect
            x={boardLeft + regulatorX - 24}
            y={boardTop + regulatorY - 48}
            width="48"
            height="16"
            fill={showLabels ? "#ffffff" : "none"}
          />
          {showLabels ? (
            <>
              <text
                x={boardLeft + regulatorX}
                y={boardTop + regulatorY - 56}
                fill="#1f2937"
                fontSize="16"
                fontWeight="700"
                textAnchor="middle"
              ></text>
              <text
                x={boardLeft + regulatorX}
                y={boardTop + regulatorY - 36}
                fill="#1f2937"
                fontSize="16"
                fontWeight="700"
                textAnchor="middle"
              >
                {regulatorModel}
              </text>
            </>
          ) : null}

          {/* Add the series output resistor stage from the reference without changing the established layout. */}
          <svg
            x={boardLeft + resistorX - resistorWidth / 2}
            y={boardTop + resistorY - resistorHeight / 2}
            width={resistorWidth}
            height={resistorHeight}
            viewBox={`0 0 ${resistorWidth} ${resistorHeight}`}
            overflow="visible"
          >
            <ResistorSymbol
              label="R1"
              width={resistorWidth}
              height={resistorHeight}
            />
          </svg>
          <rect
            x={boardLeft + resistorX - 58}
            y={boardTop + resistorY - 22}
            width="16"
            height="12"
            fill="#ffffff"
          />
          <rect
            x={boardLeft + resistorX + 42}
            y={boardTop + resistorY - 22}
            width="16"
            height="12"
            fill="#ffffff"
          />
          <text
            x={boardLeft + resistorX}
            y={boardTop + resistorY + 34}
            fill="#1f2937"
            fontSize="16"
            fontWeight="700"
            textAnchor="middle"
          >
            R1
          </text>
          <text
            x={boardLeft + resistorX}
            y={boardTop + resistorY + 54}
            fill="#1f2937"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            100 Ω
          </text>
          <rect
            x={boardLeft + resistorX - 34}
            y={boardTop + resistorY + 40}
            width="68"
            height="18"
            fill={showLabels ? "#ffffff" : "none"}
          />
          {showLabels ? (
            <text
              x={boardLeft + resistorX}
              y={boardTop + resistorY + 54}
              fill="#1f2937"
              fontSize="14"
              fontWeight="600"
              textAnchor="middle"
            >
              100 Ω
            </text>
          ) : null}
          {showLabels ? (
            <>
              <rect
                x={boardLeft + resistorX - 38}
                y={boardTop + resistorY + 42}
                width="76"
                height="16"
                fill="#ffffff"
              />
              <text
                x={boardLeft + resistorX}
                y={boardTop + resistorY + 54}
                fill="#1f2937"
                fontSize="14"
                fontWeight="600"
                textAnchor="middle"
              >
                {resistorOhms} Ohm
              </text>
            </>
          ) : null}
          {/* Add the output indicator LED body from the reference layout without changing the established circuit geometry. */}
          <g
            transform={`translate(${boardLeft + ledX}, ${boardTop + ledY}) rotate(90)`}
          >
            {ledOn ? (
              <circle
                cx="0"
                cy="0"
                r="26"
                fill={ledGlowFill}
                filter="url(#led-on-glow)"
              />
            ) : null}
            <svg
              x={-ledWidth / 2}
              y={-ledHeight / 2}
              width={ledWidth}
              height={ledHeight}
              viewBox={`0 0 ${ledWidth} ${ledHeight}`}
              overflow="visible"
            >
              <LEDSymbol label="D4 LED" width={ledWidth} height={ledHeight} />
            </svg>
          </g>
          <rect
            x={boardLeft + ledX + 32}
            y={boardTop + ledY - 12}
            width="14"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />
          <rect
            x={boardLeft + ledX + 32}
            y={boardTop + ledY + 74}
            width="14"
            height="12"
            fill={showLabels ? "#ffffff" : "none"}
          />
          <text
            x={boardLeft + ledX}
            y={boardTop + ledY + 44}
            fill="#1f2937"
            fontSize="16"
            fontWeight="700"
            textAnchor="middle"
          >
            {ledColor === "yellow" ? "D4 YEL" : "D4 GRN"}
          </text>
        </svg>
      </div>
    </div>
  );
}
