"use client";

import { useEffect, useState } from "react";

import ContactorPowerContacts3P from "../library/contactors/ContactorPowerContacts3P";
import ACMotor3P6Terminal from "../library/motors/ACMotor3P6Terminal";
import CircuitBreaker3P from "../library/protection/CircuitBreaker3P";
import ThermalOverloadRelay3P from "../library/protection/ThermalOverloadRelay3P";

type StarDeltaPowerDiagramWithTimerProps = {
  className?: string;
  mcbOn?: boolean;
  overloadTripped?: boolean;
  mainOn?: boolean;
  starOn?: boolean;
  deltaOn?: boolean;
  transferOpen?: boolean;
  loadPercent?: number;
};

// Overall canvas and inner board sizing.
const width = 760;
const height = 1176;
const boardX = 28;
const boardY = 28;
const boardWidth = 704;
const boardHeight = 1120;

// Top three-phase supply rail anchors.
const lineStartX = 70;
const lineEndX = 660;
const labelX = 18;
const l1Y = 72;
const l2Y = 112;
const l3Y = 152;

// MCCB placement and the three incoming feeder drop points.
const mccbX = 108;
const mccbY = 198;
const mccbScale = 2.4;
const mccbColumn1X = 120;
const mccbColumn2X = 168;
const mccbColumn3X = 216;
const mccbTopY = 210;
const mccbBottomY = 330;

// K1 main contactor placement and feeder continuation.
const k1X = 96;
const k1Y = 430;
const k1Scale = 2.4;
const k1Column1X = 120;
const k1Column2X = 168;
const k1Column3X = 216;
const k1TopY = 430;
const k1BottomY = 550;

// K2 delta contactor placement scaffold.
const k2X = 366;
const k2Y = 430;
const k2Scale = 2.4;
const k2Column1X = 390;
const k2Column2X = 438;
const k2Column3X = 486;
const k2TopY = 430;
const k2BottomY = 550;

// K3 star contactor placement scaffold.
const k3X = 566;
const k3Y = 430;
const k3Scale = 2.4;
const k3Column1X = 590;
const k3Column2X = 638;
const k3Column3X = 686;
const k3TopY = 430;
const k3BottomY = 550;
const k3StarBusY = 338;

// K3 down-feed rows into O/L2.
const k3ToOl2Row1Y = 604;
const k3ToOl2Row2Y = 628;
const k3ToOl2Row3Y = 652;

// O/L relay placement after K1 and K2.
const ol1X = 96;
const ol1Y = 640;
const ol1Scale = 2.4;
const ol1TopY = 640;
const ol1BottomY = 760;

const ol2X = 366;
const ol2Y = 640;
const ol2Scale = 2.4;
const ol2TopY = 640;
const ol2BottomY = 760;

// Motor placement for the star-delta 6-terminal output stage.
const motorX = 230;
const motorY = 810;
const motorScale = 2.3;
const motorLeftTerminalX = 242;
const motorU1Y = 830;
const motorV1Y = 876;
const motorW1Y = 922;
const motorRightTerminalX = 338;
const motorU2Y = 830;
const motorV2Y = 875;
const motorW2Y = 922;

// K1 to K2 incoming power connection rows.
const k1ToK2UpperRowY = 360;
const k1ToK2MiddleRowY = 392;
const k1ToK2LowerRowY = 424;

// Shared phase colors and main power wire thickness.
const l1Color = "#c56b1f";
const l2Color = "#111111";
const l3Color = "#7c7c7c";
const wireStroke = 3;
const activePhaseColor = "#16a34a";
const inactivePhaseColor = "#cbd5e1";
const faultPhaseColor = "#dc2626";
const electronColor = "#fde047";
const electronRadius = 3.2;
const electronBlur = 2.2;
const electronStagger = [0, 0.35, 0.7];

type WireState = "active" | "inactive" | "fault";

function resolveActiveColor(state: WireState) {
  if (state === "fault") return faultPhaseColor;
  if (state === "active") return activePhaseColor;
  return inactivePhaseColor;
}

function ActivePath({ d, state }: { d: string; state: WireState }) {
  if (state === "inactive") return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={resolveActiveColor(state)}
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
          filter="url(#electron-glow-star-delta-power)"
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

function MotorRotationOverlay({
  x,
  y,
  scale,
  spinLevel,
  mode,
  loadPercent,
}: {
  x: number;
  y: number;
  scale: number;
  spinLevel: number;
  mode: "star" | "transfer" | "delta" | "idle";
  loadPercent: number;
}) {
  const loadFactor = Math.min(1.5, Math.max(0, loadPercent) / 100);
  const baseDuration =
    mode === "delta" ? 0.9 : mode === "star" ? 1.8 : mode === "transfer" ? 3.2 : 4.5;
  const duration = spinLevel > 0.02
    ? baseDuration * (1 + loadFactor * (mode === "delta" ? 0.55 : 0.8))
    : baseDuration;
  const accent =
    mode === "delta" ? "#16a34a" : mode === "star" ? "#2563eb" : mode === "transfer" ? "#d97706" : "#94a3b8";

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(-90 29 30)`}>
      <circle
        cx="29"
        cy="30"
        r="8"
        fill="none"
        stroke={accent}
        strokeWidth="0.9"
        opacity={0.3 + spinLevel * 0.65}
      />
      <path d="M29 22 L33 30 L29 29 L25 30 Z" fill={accent} opacity={0.3 + spinLevel * 0.65}>
        {spinLevel > 0.02 ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 29 30`}
            to={`360 29 30`}
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        ) : null}
      </path>
    </g>
  );
}

export default function StarDeltaPowerDiagramWithTimer({
  className = "",
  mcbOn = true,
  overloadTripped = false,
  mainOn = false,
  starOn = false,
  deltaOn = false,
  transferOpen = false,
  loadPercent = 45,
}: StarDeltaPowerDiagramWithTimerProps) {
  const mainState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn
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

  const tripState: WireState = mcbOn && overloadTripped ? "fault" : "inactive";
  const motorMode = !mcbOn || overloadTripped || !mainOn
    ? "idle"
    : deltaOn
      ? "delta"
      : starOn
        ? "star"
        : transferOpen
          ? "transfer"
          : "idle";
  const [spinLevel, setSpinLevel] = useState(0);

  useEffect(() => {
    const target =
      motorMode === "delta" ? 1 : motorMode === "star" ? 0.68 : motorMode === "transfer" ? 0.38 : 0;

    const timer = window.setInterval(() => {
      setSpinLevel((prev) => {
        const next = prev + (target - prev) * 0.08;
        if (Math.abs(next - target) < 0.01) {
          window.clearInterval(timer);
          return target;
        }
        return next;
      });
    }, 24);
    return () => window.clearInterval(timer);
  }, [motorMode]);

  const mainL1Path = `M ${mccbColumn1X} ${l1Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY} V ${ol1BottomY} V ${motorU1Y} H ${motorLeftTerminalX}`;
  const mainL2Path = `M ${mccbColumn2X} ${l2Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY} V ${ol1BottomY} V ${motorV1Y} H ${motorLeftTerminalX}`;
  const mainL3Path = `M ${mccbColumn3X} ${l3Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY} V ${ol1BottomY} V ${motorW1Y} H ${motorLeftTerminalX}`;

  const deltaL1Path = `M ${k1Column3X} ${mccbBottomY} V ${k1ToK2LowerRowY} H ${k2Column1X} V ${k2BottomY} V ${ol2TopY} V ${ol2BottomY} V ${motorU2Y} H ${motorRightTerminalX}`;
  const deltaL2Path = `M ${k1Column2X} ${mccbBottomY} V ${k1ToK2MiddleRowY} H ${k2Column2X} V ${k2BottomY} V ${ol2TopY} V ${ol2BottomY} V ${motorV2Y} H ${motorRightTerminalX}`;
  const deltaL3Path = `M ${k1Column1X} ${mccbBottomY} V ${k1ToK2UpperRowY} H ${k2Column3X} V ${k2BottomY} V ${ol2TopY} V ${ol2BottomY} V ${motorW2Y} H ${motorRightTerminalX}`;

  const starL1Path = `M ${k3Column1X} ${k3StarBusY} V ${k3BottomY} V ${k3ToOl2Row1Y} H ${k2Column1X} V ${ol2TopY} V ${ol2BottomY} V ${motorU2Y} H ${motorRightTerminalX}`;
  const starL2Path = `M ${k3Column2X} ${k3StarBusY} V ${k3BottomY} V ${k3ToOl2Row2Y} H ${k2Column2X} V ${ol2TopY} V ${ol2BottomY} V ${motorV2Y} H ${motorRightTerminalX}`;
  const starL3Path = `M ${k3Column3X} ${k3StarBusY} V ${k3BottomY} V ${k3ToOl2Row3Y} H ${k2Column3X} V ${ol2TopY} V ${ol2BottomY} V ${motorW2Y} H ${motorRightTerminalX}`;
  const tripL1Path = `M ${mccbColumn1X} ${l1Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY}`;
  const tripL2Path = `M ${mccbColumn2X} ${l2Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY}`;
  const tripL3Path = `M ${mccbColumn3X} ${l3Y} V ${mccbBottomY} V ${k1TopY} V ${k1BottomY} V ${ol1TopY}`;

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div className="control-diagram-shell">
        <div className="control-diagram-scroll">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="control-diagram-svg"
            role="img"
            aria-label="Star delta power diagram starter template"
          >
            <defs>
              <filter
                id="electron-glow-star-delta-power"
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

              <ActivePath d={mainL1Path} state={mainState} />
              <ActivePath d={mainL2Path} state={mainState} />
              <ActivePath d={mainL3Path} state={mainState} />
              <ActivePath d={deltaL1Path} state={deltaState} />
              <ActivePath d={deltaL2Path} state={deltaState} />
              <ActivePath d={deltaL3Path} state={deltaState} />
              <ActivePath d={starL1Path} state={starState} />
              <ActivePath d={starL2Path} state={starState} />
              <ActivePath d={starL3Path} state={starState} />
              <ActivePath d={tripL1Path} state={tripState} />
              <ActivePath d={tripL2Path} state={tripState} />
              <ActivePath d={tripL3Path} state={tripState} />

              <ElectronFlow
                path={mainL1Path}
                active={mainOn && !overloadTripped && mcbOn}
                duration={3.1}
              />
              <ElectronFlow
                path={mainL2Path}
                active={mainOn && !overloadTripped && mcbOn}
                duration={3.25}
              />
              <ElectronFlow
                path={mainL3Path}
                active={mainOn && !overloadTripped && mcbOn}
                duration={3.4}
              />
              <ElectronFlow
                path={deltaL1Path}
                active={deltaOn && !overloadTripped && mcbOn}
                duration={2.7}
              />
              <ElectronFlow
                path={deltaL2Path}
                active={deltaOn && !overloadTripped && mcbOn}
                duration={2.85}
              />
              <ElectronFlow
                path={deltaL3Path}
                active={deltaOn && !overloadTripped && mcbOn}
                duration={3}
              />
              <ElectronFlow
                path={starL1Path}
                active={starOn && !overloadTripped && mcbOn}
                duration={2.7}
              />
              <ElectronFlow
                path={starL2Path}
                active={starOn && !overloadTripped && mcbOn}
                duration={2.85}
              />
              <ElectronFlow
                path={starL3Path}
                active={starOn && !overloadTripped && mcbOn}
                duration={3}
              />
              <ElectronFlow
                path={tripL1Path}
                active={tripState === "fault"}
                fault
                duration={2.2}
              />
              <ElectronFlow
                path={tripL2Path}
                active={tripState === "fault"}
                fault
                duration={2.35}
              />
              <ElectronFlow
                path={tripL3Path}
                active={tripState === "fault"}
                fault
                duration={2.5}
              />

              {/* L1 supply label and phase rail. */}
              <text
                x={labelX}
                y={l1Y + 8}
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                L1
              </text>
              <line
                x1={lineStartX}
                y1={l1Y}
                x2={lineEndX}
                y2={l1Y}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* L2 supply label and phase rail. */}
              <text
                x={labelX}
                y={l2Y + 8}
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                L2
              </text>
              <line
                x1={lineStartX}
                y1={l2Y}
                x2={lineEndX}
                y2={l2Y}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* L3 supply label and phase rail. */}
              <text
                x={labelX}
                y={l3Y + 8}
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                L3
              </text>
              <line
                x1={lineStartX}
                y1={l3Y}
                x2={lineEndX}
                y2={l3Y}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Vertical drops from the phase rails down into the MCCB. */}
              <line
                x1={mccbColumn1X}
                y1={l1Y}
                x2={mccbColumn1X}
                y2={mccbTopY}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={mccbColumn2X}
                y1={l2Y}
                x2={mccbColumn2X}
                y2={mccbTopY}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={mccbColumn3X}
                y1={l3Y}
                x2={mccbColumn3X}
                y2={mccbTopY}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* Main incoming breaker for the star-delta power branch. */}
              <CircuitBreaker3P
                x={mccbX}
                y={mccbY}
                scale={mccbScale}
                on={mcbOn}
                label=""
                standalone={false}
                strokeColor="#f97316"
                orientation="vertical"
              />

              {/* Breaker title for the current scaffold stage. */}
              <text x="8" y="236" fontSize="16" fontWeight="700" fill="#111111">
                3P MCCB
              </text>
              <text
                x="124"
                y="246"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                1
              </text>
              <text
                x="172"
                y="246"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                3
              </text>
              <text
                x="220"
                y="246"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                5
              </text>
              <text
                x="124"
                y="330"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                2
              </text>
              <text
                x="172"
                y="330"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                4
              </text>
              <text
                x="220"
                y="330"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                6
              </text>

              {/* Vertical phase continuation from MCCB down into K1 main contactor. */}
              <line
                x1={k1Column1X}
                y1={mccbBottomY}
                x2={k1Column1X}
                y2={k1TopY}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k1Column2X}
                y1={mccbBottomY}
                x2={k1Column2X}
                y2={k1TopY}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k1Column3X}
                y1={mccbBottomY}
                x2={k1Column3X}
                y2={k1TopY}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* K1 main contactor power contacts. */}
              <ContactorPowerContacts3P
                x={k1X}
                y={k1Y}
                scale={k1Scale}
                closed={mainOn}
                label=""
                showCoilSymbol={false}
                standalone={false}
              />
              <text
                x="36"
                y="434"
                fontSize="16"
                fontWeight="700"
                fill="#111111"
              >
                K1
              </text>
              <text
                x="36"
                y="462"
                fontSize="14"
                fontWeight="700"
                fill="#1d4ed8"
              >
                MAIN
              </text>
              <text
                x="124"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                1
              </text>
              <text
                x="172"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                3
              </text>
              <text
                x="220"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                5
              </text>
              <text
                x="124"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                2
              </text>
              <text
                x="172"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                4
              </text>
              <text
                x="220"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                6
              </text>

              {/* K2 delta contactor power contacts. */}
              <ContactorPowerContacts3P
                x={k2X}
                y={k2Y}
                scale={k2Scale}
                closed={deltaOn}
                label=""
                showCoilSymbol={false}
                standalone={false}
              />
              <text
                x="350"
                y="434"
                fontSize="16"
                fontWeight="700"
                fill="#111111"
              >
                K2
              </text>
              <text
                x="350"
                y="462"
                fontSize="14"
                fontWeight="700"
                fill="#1d4ed8"
              >
                DELTA
              </text>
              <text
                x="390"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                1
              </text>
              <text
                x="442"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                3
              </text>
              <text
                x="490"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                5
              </text>
              <text
                x="390"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                2
              </text>
              <text
                x="440"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                4
              </text>
              <text
                x="490"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                6
              </text>

              {/* Visible K1 to K2 incoming wire connections. */}
              <path
                d={`M ${k1Column3X} ${mccbBottomY} V ${k1ToK2LowerRowY} H ${k2Column1X} V ${k2TopY}`}
                fill="none"
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k1Column2X} ${mccbBottomY} V ${k1ToK2MiddleRowY} H ${k2Column2X} V ${k2TopY}`}
                fill="none"
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k1Column1X} ${mccbBottomY} V ${k1ToK2UpperRowY} H ${k2Column3X} V ${k2TopY}`}
                fill="none"
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* K1 outgoing lines down into O/L1. */}
              <line
                x1={k1Column1X}
                y1={k1BottomY}
                x2={k1Column1X}
                y2={ol1TopY}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k1Column2X}
                y1={k1BottomY}
                x2={k1Column2X}
                y2={ol1TopY}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k1Column3X}
                y1={k1BottomY}
                x2={k1Column3X}
                y2={ol1TopY}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* O/L1 overload relay after K1 main branch. */}
              <ThermalOverloadRelay3P
                x={ol1X}
                y={ol1Y}
                scale={ol1Scale}
                tripped={overloadTripped}
                label=""
                standalone={false}
              />
              <text
                x="28"
                y="690"
                fontSize="16"
                fontWeight="700"
                fill="#111111"
              >
                O/L1
              </text>

              {/* O/L1 main outputs feeding motor U1, V1, W1. */}
              <path
                d={`M ${k1Column1X} ${ol1BottomY} V ${motorU1Y} H ${motorLeftTerminalX}`}
                fill="none"
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k1Column2X} ${ol1BottomY} V ${motorV1Y} H ${motorLeftTerminalX}`}
                fill="none"
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k1Column3X} ${ol1BottomY} V ${motorW1Y} H ${motorLeftTerminalX}`}
                fill="none"
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* K2 outgoing lines down into O/L2. */}
              <line
                x1={k2Column1X}
                y1={k2BottomY}
                x2={k2Column1X}
                y2={ol2TopY}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k2Column2X}
                y1={k2BottomY}
                x2={k2Column2X}
                y2={ol2TopY}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k2Column3X}
                y1={k2BottomY}
                x2={k2Column3X}
                y2={ol2TopY}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />

              {/* O/L2 overload relay after K2 delta branch. */}
              <ThermalOverloadRelay3P
                x={ol2X}
                y={ol2Y}
                scale={ol2Scale}
                tripped={overloadTripped}
                label=""
                standalone={false}
              />
              <text
                x="328"
                y="690"
                fontSize="16"
                fontWeight="700"
                fill="#111111"
              >
                O/L2
              </text>

              {/* O/L2 branch outputs feeding motor U2, V2, W2. */}
              <path
                d={`M ${k2Column1X} ${ol2BottomY} V ${motorU2Y} H ${motorRightTerminalX}`}
                fill="none"
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k2Column2X} ${ol2BottomY} V ${motorV2Y} H ${motorRightTerminalX}`}
                fill="none"
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k2Column3X} ${ol2BottomY} V ${motorW2Y} H ${motorRightTerminalX}`}
                fill="none"
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* K3 star contactor power contacts scaffold. */}
              <line
                x1={k3Column1X}
                y1={k3StarBusY}
                x2={k3Column1X}
                y2={k3TopY}
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k3Column2X}
                y1={k3StarBusY}
                x2={k3Column2X}
                y2={k3TopY}
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k3Column3X}
                y1={k3StarBusY}
                x2={k3Column3X}
                y2={k3TopY}
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <line
                x1={k3Column1X}
                y1={k3StarBusY}
                x2={k3Column3X}
                y2={k3StarBusY}
                stroke="#111111"
                strokeWidth={wireStroke}
                strokeLinecap="round"
              />
              <ContactorPowerContacts3P
                x={k3X}
                y={k3Y}
                scale={k3Scale}
                closed={starOn}
                label=""
                showCoilSymbol={false}
                standalone={false}
              />
              <text
                x="550"
                y="434"
                fontSize="16"
                fontWeight="700"
                fill="#111111"
              >
                K3
              </text>
              <text
                x="550"
                y="462"
                fontSize="14"
                fontWeight="700"
                fill="#1d4ed8"
              >
                STAR
              </text>
              <text
                x="590"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                1
              </text>
              <text
                x="640"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                3
              </text>
              <text
                x="690"
                y="478"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                5
              </text>
              <text
                x="590"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                2
              </text>
              <text
                x="640"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                4
              </text>
              <text
                x="690"
                y="558"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                6
              </text>

              {/* K3 down-feed connections into O/L2 top terminals. */}
              <path
                d={`M ${k3Column1X} ${k3BottomY} V ${k3ToOl2Row1Y} H ${k2Column1X} V ${ol2TopY}`}
                fill="none"
                stroke={l1Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k3Column2X} ${k3BottomY} V ${k3ToOl2Row2Y} H ${k2Column2X} V ${ol2TopY}`}
                fill="none"
                stroke={l2Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${k3Column3X} ${k3BottomY} V ${k3ToOl2Row3Y} H ${k2Column3X} V ${ol2TopY}`}
                fill="none"
                stroke={l3Color}
                strokeWidth={wireStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 3-phase 6-terminal motor for the star-delta output stage. */}
              <ACMotor3P6Terminal
                x={motorX}
                y={motorY}
                scale={motorScale}
                label=""
                standalone={false}
                orientation="vertical"
                showTerminalLabels={false}
              />
              <MotorRotationOverlay
                x={motorX}
                y={motorY}
                scale={motorScale}
                spinLevel={spinLevel}
                mode={motorMode}
                loadPercent={loadPercent}
              />
              <text
                x="242"
                y="844"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                U1
              </text>
              <text
                x="240"
                y="890"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                V1
              </text>
              <text
                x="255"
                y="930"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                W1
              </text>
              <text
                x="340"
                y="840"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                U2
              </text>
              <text
                x="335"
                y="885"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                V2
              </text>
              <text
                x="320"
                y="930"
                fontSize="12"
                fontWeight="700"
                fill="#111111"
              >
                W2
              </text>
              <text
                x="250"
                y="945"
                fontSize="18"
                fontWeight="700"
                fill="#111111"
              >
                3-Phase Motor
              </text>
              <text
                x="510"
                y="910"
                fontSize="13"
                fontWeight="700"
                fill={
                  overloadTripped
                    ? faultPhaseColor
                    : transferOpen
                      ? "#d97706"
                      : deltaOn
                        ? "#16a34a"
                        : starOn
                          ? "#2563eb"
                          : "#64748b"
                }
              >
                {overloadTripped
                  ? "Trip Active"
                  : transferOpen
                    ? "Open Transition"
                    : deltaOn
                      ? "Delta Running"
                      : starOn
                        ? "Star Starting"
                        : mainOn
                          ? "Main Picked"
                          : "Idle"}
              </text>
              {/* Footer caption so the scaffold is identifiable in combined workspace views. */}
              <text x="0" y={boardHeight - 14} fontSize="11" fill="#94a3b8">
                Star-Delta Power Diagram Template
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
