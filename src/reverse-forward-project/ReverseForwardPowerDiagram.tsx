"use client";

import ContactorPowerContacts3P from "../library/contactors/ContactorPowerContacts3P";
import ACMotor3P from "../library/motors/ACMotor3P";
import CircuitBreaker3P from "../library/protection/CircuitBreaker3P";
import ThermalOverloadRelay3P from "../library/protection/ThermalOverloadRelay3P";

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

// Keep reverse-forward power colors consistent with the DOL 3-phase palette:
// L1 = red, L2 = black, L3 = gray.
const PHASE_ACTIVE = ["#dc2626", "#111827", "#64748b"];
const PHASE_MUTED = ["#fca5a5", "#cbd5e1", "#d8e1eb"];
const FLOW_ACTIVE = "#16a34a";
const FLOW_FAULT = "#ef4444";
const ELECTRON_COLOR = "#fde047";
const ELECTRON_STAGGER = [0, 0.3, 0.6];

function phaseColor(index: number, active: boolean) {
  return active ? PHASE_ACTIVE[index] : PHASE_MUTED[index];
}

function PhaseLine({
  x1,
  y1,
  x2,
  y2,
  index,
  active,
  width = 2.6,
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
  width = 4.2,
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
      stroke={fault ? FLOW_FAULT : FLOW_ACTIVE}
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
      {ELECTRON_STAGGER.map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r="3.2"
          fill={fault ? "#f87171" : ELECTRON_COLOR}
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
  // Shared stage sizing keeps the reverse-forward power canvas in the same
  // visual family as the other starter workspaces.
  const width = 1520;
  const height = 1912;

  // Incoming 3-phase source and MCCB anchors.
  const sourceLabelsX = 26;
  const sourceStartX = 54;
  const sourceEndX = 198;
  const railYs = [128, 162, 196];
  const breakerX = 188;
  const breakerY = 232;
  const breakerScale = 2;
  const phaseXs = [breakerX + 10, breakerX + 50, breakerX + 90];
  const breakerTopY = breakerY + 40;
  const breakerBottomY = breakerY + 80;

  // Forward contactor section anchors.
  const k1X = 188;
  const k1Y = 406;
  const k1Scale = 2;
  const k1PhaseXs = [k1X + 20, k1X + 60, k1X + 100];
  const k1TopY = k1Y;
  const k1BottomY = k1Y + 100;
  const k1LowerXs = k1PhaseXs.map((x) => x - 10);

  // Reverse contactor section anchors.
  const k2X = 428;
  const k2Y = 406;
  const k2Scale = 2;
  const k2PhaseXs = [k2X + 20, k2X + 60, k2X + 100];
  const k2BottomY = k2Y + 100;
  const k2LowerXs = k2PhaseXs.map((x) => x - 10);

  // Feed routing levels used to cross phases neatly from the MCCB to K1/K2.
  const feedY = breakerBottomY + 44;
  const reverseFeedYs = [feedY, feedY + 30, feedY + 60];
  const outputLinkYs = [k1BottomY + 18, k1BottomY + 40, k1BottomY + 62];
  const overloadX = 244;
  const overloadY = 576;
  const overloadScale = 2;
  const overloadTopWireY = overloadY;
  const overloadBottomY = overloadY + 100;
  const overloadBottomXs = [overloadX - 46, overloadX - 6, overloadX + 34];
  const motorX = 214;
  const motorY = 798;
  const motorScale = 2;
  const motorTopXs = [motorX - 12, motorX + 28, motorX + 68];
  const motorFeedEndY = motorY;
  const motorSymbolX = motorX - 32;
  const motorCenterX = motorSymbolX + 30 * motorScale;
  const motorCenterY = motorY + 35 * motorScale;

  const forwardPowerActive =
    mccbOn && !overloadTripped && motorRunning && direction === "forward";
  const reversePowerActive =
    mccbOn && !overloadTripped && motorRunning && direction === "reverse";
  const faultOpenActive = mccbOn && overloadTripped;
  const powerAvailable = mccbOn && !overloadTripped;

  const sourcePaths = phaseXs.map(
    (x, index) =>
      `M ${sourceStartX} ${railYs[index]} L ${x} ${railYs[index]} L ${x} ${breakerTopY}`,
  );
  const breakerOutputPaths = phaseXs.map(
    (x) => `M ${x} ${breakerBottomY} L ${x} ${feedY}`,
  );
  const k1FeedPaths = k1PhaseXs.map(
    (x, index) => `M ${x - 10} ${feedY} L ${x - 10} ${k1TopY}`,
  );
  const k2FeedPaths = [
    `M ${phaseXs[0]} ${feedY} L ${phaseXs[0]} ${feedY - 20} L ${k2PhaseXs[2] - 10} ${feedY - 20} L ${k2PhaseXs[2] - 10} ${k2Y}`,
    `M ${phaseXs[1]} ${feedY} L ${phaseXs[1]} ${reverseFeedYs[1] - 20} L ${k2PhaseXs[1] - 10} ${reverseFeedYs[1] - 20} L ${k2PhaseXs[1] - 10} ${k2Y}`,
    `M ${phaseXs[2]} ${feedY} L ${phaseXs[2]} ${reverseFeedYs[2] - 20} L ${k2PhaseXs[0] - 10} ${reverseFeedYs[2] - 20} L ${k2PhaseXs[0] - 10} ${k2Y}`,
  ];
  const forwardDropPaths = [
    `M ${k1LowerXs[2]} ${k1BottomY} L ${k1LowerXs[2]} ${overloadTopWireY}`,
    `M ${k1LowerXs[1]} ${k1BottomY} L ${k1LowerXs[1]} ${overloadTopWireY}`,
    `M ${k1LowerXs[0]} ${k1BottomY} L ${k1LowerXs[0]} ${overloadTopWireY}`,
  ];
  const reverseOutputPaths = [
    `M ${k2LowerXs[0]} ${k2BottomY} L ${k2LowerXs[0]} ${outputLinkYs[0]} L ${k1LowerXs[2]} ${outputLinkYs[0]} L ${k1LowerXs[2]} ${overloadTopWireY}`,
    `M ${k2LowerXs[1]} ${k2BottomY} L ${k2LowerXs[1]} ${outputLinkYs[1]} L ${k1LowerXs[0]} ${outputLinkYs[1]} L ${k1LowerXs[0]} ${overloadTopWireY}`,
    `M ${k2LowerXs[2]} ${k2BottomY} L ${k2LowerXs[2]} ${outputLinkYs[2]} L ${k1LowerXs[1]} ${outputLinkYs[2]} L ${k1LowerXs[1]} ${overloadTopWireY}`,
  ];
  const motorFeedPaths = overloadBottomXs.map(
    (x, index) =>
      `M ${x} ${overloadBottomY} L ${motorTopXs[index]} ${motorFeedEndY}`,
  );
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
    ? "#dc2626"
    : reversePowerActive
      ? "#2563eb"
      : forwardPowerActive
        ? "#16a34a"
        : "#64748b";
  const spinDuration =
    reversePowerActive || forwardPowerActive
      ? `${Math.max(0.8, 1.5 - Math.min(0.5, loadPercent / 220))}s`
      : "2.8s";
  const circuitScale = 1;
  const circuitOffsetX = 40;
  const circuitOffsetY = -48;

  return (
    <div className={`power-diagram-layout ${className}`}>
      <div
        className={`power-diagram-shell ${viewMode === "actual" ? "is-actual-scale" : ""}`}
      >
        <div
          className={`power-diagram-scroll ${viewMode === "actual" ? "is-scrollable" : ""}`}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="power-diagram-svg power-diagram-svg--rev-fwd"
            style={
              viewMode === "actual"
                ? { width: `${width}px`, maxWidth: "none" }
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
            <rect width={width} height={height} fill="#ffffff" />
            <g
              transform={`translate(${circuitOffsetX} ${circuitOffsetY}) scale(${circuitScale})`}
            >
              {["L1", "L2", "L3"].map((label, index) => (
                <text
                  key={label}
                  x={sourceLabelsX}
                  y={railYs[index] + 6}
                  fontSize="17"
                  fontWeight="700"
                  fill="#111827"
                >
                  {label}
                </text>
              ))}

              {/* Incoming horizontal 3-phase supply rails. */}
              {railYs.map((y, index) => (
                <g key={`rail-${y}`}>
                  <PhaseLine
                    x1={sourceStartX}
                    y1={y}
                    x2={phaseXs[index]}
                    y2={y}
                    index={index}
                    active={mccbOn}
                  />
                  <ActivePath
                    d={sourcePaths[index]}
                    active={showFlow && mccbOn}
                    width={3.6}
                  />
                  <ElectronFlow
                    path={sourcePaths[index]}
                    active={showFlow && mccbOn}
                    duration={2.4 + index * 0.18}
                  />
                </g>
              ))}

              {/* Vertical drops from the source rails into the MCCB terminals. */}
              {phaseXs.map((x, index) => (
                <g key={`drop-${x}`}>
                  <PhaseDot
                    cx={x}
                    cy={railYs[index]}
                    index={index}
                    active={mccbOn}
                  />
                  <PhaseLine
                    x1={x}
                    y1={railYs[index]}
                    x2={x}
                    y2={breakerTopY}
                    index={index}
                    active={mccbOn}
                  />
                </g>
              ))}

              {/* Main incoming breaker section. */}
              <CircuitBreaker3P
                x={breakerX}
                y={breakerY}
                scale={breakerScale}
                on={mccbOn}
                label=""
                standalone={false}
                orientation="vertical"
              />

              {/* Section title for the incoming breaker. */}
              {showLabels ? (
                <>
                  <text
                    x={74}
                    y={breakerY + 98}
                    fontSize="13"
                    fontWeight="700"
                    fill="#111827"
                  >
                    3P MCCB
                  </text>
                  <text
                    x={74}
                    y={breakerY + 116}
                    fontSize="13"
                    fontWeight="700"
                    fill="#111827"
                  >
                    / MCCB
                  </text>
                </>
              ) : null}

              {/* Breaker outputs feeding the downstream starter section. */}
              {phaseXs.map((x, index) => (
                <g key={`out-${x}`}>
                  <PhaseLine
                    x1={x}
                    y1={breakerBottomY}
                    x2={x}
                    y2={feedY}
                    index={index}
                    active={mccbOn}
                  />
                  <ActivePath
                    d={breakerOutputPaths[index]}
                    active={showFlow && mccbOn}
                    width={3.6}
                  />
                  <ElectronFlow
                    path={breakerOutputPaths[index]}
                    active={showFlow && mccbOn}
                    duration={2.2 + index * 0.16}
                  />
                  <PhaseDot
                    cx={x}
                    cy={breakerBottomY}
                    index={index}
                    active={mccbOn}
                  />
                </g>
              ))}

              {/* Straight phase feeds from the MCCB down into the forward contactor. */}
              {k1PhaseXs.map((x, index) => (
                <g key={`k1-feed-${x}`}>
                  <PhaseLine
                    x1={x - 10}
                    y1={feedY}
                    x2={x - 10}
                    y2={k1TopY}
                    index={index}
                    active={mccbOn}
                  />
                  <ActivePath
                    d={k1FeedPaths[index]}
                    active={showFlow && forwardPowerActive}
                    width={3.6}
                  />
                  <ElectronFlow
                    path={k1FeedPaths[index]}
                    active={showFlow && forwardPowerActive}
                    duration={2 + index * 0.14}
                  />
                </g>
              ))}

              {/* Reverse branch crossover feed keeps phase order swapped for K2. */}
              <PhaseLine
                x1={phaseXs[0]}
                y1={feedY - 20}
                x2={k2PhaseXs[2] - 10}
                y2={feedY - 20}
                index={0}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2PhaseXs[2] - 10}
                y1={feedY - 20}
                x2={k2PhaseXs[2] - 10}
                y2={k2Y}
                index={0}
                active={mccbOn}
              />
              <ActivePath
                d={k2FeedPaths[0]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={k2FeedPaths[0]}
                active={showFlow && reversePowerActive}
                duration={2.1}
              />

              <PhaseLine
                x1={phaseXs[1]}
                y1={feedY}
                x2={phaseXs[1]}
                y2={reverseFeedYs[1]}
                index={1}
                active={mccbOn}
              />
              <PhaseLine
                x1={phaseXs[1]}
                y1={reverseFeedYs[1] - 20}
                x2={k2PhaseXs[1] - 10}
                y2={reverseFeedYs[1] - 20}
                index={1}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2PhaseXs[1] - 10}
                y1={reverseFeedYs[1] - 20}
                x2={k2PhaseXs[1] - 10}
                y2={k2Y}
                index={1}
                active={mccbOn}
              />
              <ActivePath
                d={k2FeedPaths[1]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={k2FeedPaths[1]}
                active={showFlow && reversePowerActive}
                duration={2.28}
              />

              <PhaseLine
                x1={phaseXs[2]}
                y1={feedY}
                x2={phaseXs[2]}
                y2={reverseFeedYs[2]}
                index={2}
                active={mccbOn}
              />
              <PhaseLine
                x1={phaseXs[2]}
                y1={reverseFeedYs[2] - 20}
                x2={k2PhaseXs[0] - 10}
                y2={reverseFeedYs[2] - 20}
                index={2}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2PhaseXs[0] - 10}
                y1={reverseFeedYs[2] - 20}
                x2={k2PhaseXs[0] - 10}
                y2={k2Y}
                index={2}
                active={mccbOn}
              />
              <ActivePath
                d={k2FeedPaths[2]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={k2FeedPaths[2]}
                active={showFlow && reversePowerActive}
                duration={2.46}
              />

              {/* Forward and reverse power contactor symbols. */}
              <ContactorPowerContacts3P
                x={k1X - 10}
                y={k1Y}
                scale={k1Scale}
                closed={forwardPowerActive}
                label=""
                showCoilSymbol={false}
                standalone={false}
              />
              <ContactorPowerContacts3P
                x={k2X - 10}
                y={k2Y}
                scale={k2Scale}
                closed={reversePowerActive}
                label=""
                showCoilSymbol={false}
                standalone={false}
              />

              {showLabels ? (
                <>
                  {[
                    { x: k1PhaseXs[0] - 18, top: "1", bottom: "2" },
                    { x: k1PhaseXs[1] - 18, top: "3", bottom: "4" },
                    { x: k1PhaseXs[2] - 18, top: "5", bottom: "6" },
                    { x: k2PhaseXs[0] - 18, top: "1", bottom: "2" },
                    { x: k2PhaseXs[1] - 18, top: "3", bottom: "4" },
                    { x: k2PhaseXs[2] - 18, top: "5", bottom: "6" },
                  ].map((terminal, index) => {
                    const isK1 = index < 3;
                    const topY = isK1 ? k1Y - 8 : k2Y - 8;
                    const bottomY = isK1 ? k1BottomY + 18 : k2BottomY + 18;
                    return (
                      <g key={`terminal-${index}`}>
                        <text
                          x={terminal.x}
                          y={topY}
                          fontSize="11"
                          fontWeight="700"
                          fill="#111827"
                        >
                          {terminal.top}
                        </text>
                        <text
                          x={terminal.x}
                          y={bottomY}
                          fontSize="11"
                          fontWeight="700"
                          fill="#111827"
                        >
                          {terminal.bottom}
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : null}

              {/* Text labels for the K1/K2 contactor sections. */}
              {showLabels ? (
                <>
                  <text
                    x={124}
                    y={k1Y + 56}
                    fontSize="14"
                    fontWeight="700"
                    fill="#2563eb"
                  >
                    FORWARD
                  </text>
                  <text
                    x={206}
                    y={k1Y + 56}
                    fontSize="14"
                    fontWeight="700"
                    fill="#111827"
                  >
                    K1
                  </text>
                  <text
                    x={446}
                    y={k2Y + 56}
                    fontSize="14"
                    fontWeight="700"
                    fill="#111827"
                  >
                    K2
                  </text>
                  <text
                    x={512}
                    y={k2Y + 56}
                    fontSize="14"
                    fontWeight="700"
                    fill="#2563eb"
                  >
                    REVERSE
                  </text>
                </>
              ) : null}

              {/* Lower reverse-forward output links keep the K2 branch phase-swapped. */}
              <PhaseLine
                x1={k1LowerXs[2]}
                y1={k1BottomY}
                x2={k1LowerXs[2]}
                y2={outputLinkYs[0]}
                index={2}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2LowerXs[0]}
                y1={k2BottomY}
                x2={k2LowerXs[0]}
                y2={outputLinkYs[0]}
                index={2}
                active={mccbOn}
              />
              <PhaseLine
                x1={k1LowerXs[2]}
                y1={outputLinkYs[0]}
                x2={k2LowerXs[0]}
                y2={outputLinkYs[0]}
                index={2}
                active={mccbOn}
              />
              <ActivePath
                d={reverseOutputPaths[0]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={reverseOutputPaths[0]}
                active={showFlow && reversePowerActive}
                duration={2.2}
              />

              <PhaseLine
                x1={k1LowerXs[1]}
                y1={k1BottomY}
                x2={k1LowerXs[1]}
                y2={outputLinkYs[1]}
                index={1}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2LowerXs[1]}
                y1={k2BottomY}
                x2={k2LowerXs[1]}
                y2={outputLinkYs[1]}
                index={1}
                active={mccbOn}
              />
              <PhaseLine
                x1={k1LowerXs[0]}
                y1={outputLinkYs[1]}
                x2={k2LowerXs[1]}
                y2={outputLinkYs[1]}
                index={1}
                active={mccbOn}
              />
              <ActivePath
                d={reverseOutputPaths[1]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={reverseOutputPaths[1]}
                active={showFlow && reversePowerActive}
                duration={2.38}
              />

              <PhaseLine
                x1={k1LowerXs[0]}
                y1={k1BottomY}
                x2={k1LowerXs[0]}
                y2={outputLinkYs[2]}
                index={0}
                active={mccbOn}
              />
              <PhaseLine
                x1={k2LowerXs[2]}
                y1={k2BottomY}
                x2={k2LowerXs[2]}
                y2={outputLinkYs[2]}
                index={0}
                active={mccbOn}
              />
              <PhaseLine
                x1={k1LowerXs[1]}
                y1={outputLinkYs[2]}
                x2={k2LowerXs[2]}
                y2={outputLinkYs[2]}
                index={0}
                active={mccbOn}
              />
              <ActivePath
                d={reverseOutputPaths[2]}
                active={showFlow && reversePowerActive}
                width={3.6}
              />
              <ElectronFlow
                path={reverseOutputPaths[2]}
                active={showFlow && reversePowerActive}
                duration={2.56}
              />

              {/* Vertical drops from the lower interconnection bus into the overload top terminals. */}
              {forwardDropPaths.map((path, index) => (
                <g key={`forward-drop-${index}`}>
                  <PhaseLine
                    x1={[k1LowerXs[2], k1LowerXs[1], k1LowerXs[0]][index]}
                    y1={[k1BottomY, k1BottomY, k1BottomY][index]}
                    x2={[k1LowerXs[2], k1LowerXs[1], k1LowerXs[0]][index]}
                    y2={overloadTopWireY}
                    index={[2, 1, 0][index]}
                    active={mccbOn}
                  />
                  <ActivePath
                    d={path}
                    active={showFlow && forwardPowerActive}
                    width={3.6}
                  />
                  <ElectronFlow
                    path={path}
                    active={showFlow && forwardPowerActive}
                    duration={2.05 + index * 0.12}
                  />
                </g>
              ))}

              {/* Thermal overload relay section below the forward/reverse output links. */}
              <ThermalOverloadRelay3P
                x={overloadX - 66}
                y={overloadY}
                scale={overloadScale}
                label=""
                standalone={false}
              />

              {showLabels ? (
                <text
                  x={94}
                  y={overloadY + 54}
                  fontSize="14"
                  fontWeight="700"
                  fill="#111827"
                >
                  O/L
                </text>
              ) : null}

              {/* Overload outputs feeding the 3-phase motor terminals. */}
              {overloadBottomXs.map((x, index) => (
                <g key={`motor-feed-${x}`}>
                  <PhaseLine
                    x1={x}
                    y1={overloadBottomY}
                    x2={motorTopXs[index]}
                    y2={motorY}
                    index={index}
                    active={mccbOn}
                  />
                <ActivePath
                  d={motorFeedPaths[index]}
                  active={
                    showFlow &&
                    (forwardPowerActive || reversePowerActive || faultOpenActive)
                  }
                  fault={faultOpenActive}
                  width={3.6}
                />
                <ElectronFlow
                  path={motorFeedPaths[index]}
                  active={showFlow && (forwardPowerActive || reversePowerActive)}
                  fault={faultOpenActive}
                  duration={2.2 + index * 0.1}
                />
                </g>
              ))}

              {/* Motor section placed directly below the overload relay. */}
              <ACMotor3P
                x={motorSymbolX}
                y={motorY}
                scale={motorScale}
                label=""
                standalone={false}
              />
              <g transform={`translate(${motorCenterX - 6}, ${motorY + 66})`}>
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
              {(forwardPowerActive || reversePowerActive) && showFlow ? (
                <g transform={`translate(${motorCenterX}, ${motorCenterY})`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="none"
                    stroke={direction === "reverse" ? "#2563eb" : "#16a34a"}
                    strokeWidth="2"
                    opacity="0.34"
                  />
                  <path
                    d="M0 -14 L6 0 L0 -2 L-6 0 Z"
                    fill={direction === "reverse" ? "#2563eb" : "#16a34a"}
                    opacity="0.7"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 0 0`}
                      to={`${direction === "reverse" ? -360 : 360} 0 0`}
                      dur={spinDuration}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              ) : null}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
