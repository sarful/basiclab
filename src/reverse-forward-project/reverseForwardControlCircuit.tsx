"use client";

import BackgroundPixelGred from "../library/background_pixel_gred";
import PushButtonNC from "../library/buttons/PushButtonNC";
import PushButtonNO from "../library/buttons/PushButtonNO";
import AuxiliaryContactNC from "../library/contactors/AuxiliaryContactNC";
import AuxiliaryContactNO from "../library/contactors/AuxiliaryContactNO";
import ContactorCoil from "../library/contactors/ContactorCoil";
import PilotLight from "../library/indicators/PilotLight";
import MCBControl2P from "../library/protection/MCBControl2P";

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

function ElectronFlow({
  d,
  active,
  color = "#fde047",
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
  const width = 760;
  const height = 956;
  const boardX = 28;
  const boardY = 28;
  const boardWidth = 704;
  const boardHeight = 900;
  const neutralLineY = 58;
  const liveLineY = 98;
  const supplyLabelX = 18;
  const supplyStartX = 44;
  const supplyEndX = 132;
  const mcbX = 102;
  const mcbY = 38;
  const overloadX = 179;
  const overloadY = 160;
  const mcbLowerOutputX = mcbX + 100;
  const mcbLowerOutputY = mcbY + 60;
  const overloadTopTerminalX = overloadX + 50;
  const rungX = overloadTopTerminalX;
  const overloadBottomY = 234;
  const offButtonX = 179;
  const offButtonY = 280;
  const offBottomY = 384;
  const onButtonX = 179;
  const onButtonY = 434;
  const onBottomY = 534;
  const k1HoldX = 299;
  const k1HoldTopY = onButtonY;
  const k1HoldBottomY = onBottomY - 30;
  const k1HoldTerminalX = k1HoldX + 50;
  const revButtonX = 419;
  const revButtonY = onButtonY;
  const revButtonTerminalX = revButtonX + 50;
  const revBranchStartX = k1HoldTerminalX;
  const revFeedY = k1HoldBottomY - 100;
  const k2HoldX = 539;
  const k2HoldTopY = revButtonY;
  const k2HoldBottomY = onBottomY - 30;
  const k2HoldTerminalX = k2HoldX + 50;
  const revRungX = revButtonTerminalX;
  const k1NcX = 419;
  const k1NcY = 584;
  const k1NcBottomY = 684;
  const k2CoilX = 449;
  const k2CoilY = 704;
  const k2CoilA1X = k2CoilX + 20;
  const k2CoilA2Y = k2CoilY + 93.62;
  const k2LampX = 544;
  const k2LampY = 705;
  const k2LampFeedX = k2LampX + 10;
  const k2LampReturnX = k2LampX + 20;
  const k2LampReturnY = k2LampY + 50;
  const k2NcX = 179;
  const k2NcY = 584;
  const k2BottomY = 684;
  const k1CoilX = 209;
  const k1CoilY = 704;
  const k1CoilA1X = k1CoilX + 20;
  const k1CoilA2Y = k1CoilY + 93.62;
  const k1LampX = 304;
  const k1LampY = 705;
  const k1LampFeedX = k1LampX + 10;
  const k1LampReturnX = k1LampX + 20;
  const k1LampReturnY = k1LampY + 50;
  const neutralDropX = 662;
  const returnBusY = 842;
  const mcbNeutralOutputX = mcbX + 100;

  const liveBaseColor = "#8b4513";
  const neutralBaseColor = "#111827";
  const activeLineColor = "#16a34a";
  const faultLineColor = "#ef4444";
  const forwardActive =
    mcbOn && !overloadTripped && motorRunning && direction === "forward";
  const reverseActive =
    mcbOn && !overloadTripped && motorRunning && direction === "reverse";
  const forwardHoldClosed = forwardActive;
  const reverseHoldClosed = reverseActive;
  const k2InterlockClosed = !reverseActive;
  const k1InterlockClosed = !forwardActive;
  const controlSupplyAvailable = mcbOn && !overloadTripped;
  const forwardBranchDemand = forwardStartPressed || forwardActive;
  const reverseBranchDemand = reverseStartPressed || reverseActive;
  const branchDemandActive = forwardBranchDemand || reverseBranchDemand;
  const commonFeedActive = controlSupplyAvailable && !stopPressed && branchDemandActive;
  const forwardPathActive =
    controlSupplyAvailable && !stopPressed && k2InterlockClosed && forwardBranchDemand;
  const reversePathActive =
    controlSupplyAvailable && !stopPressed && k1InterlockClosed && reverseBranchDemand;
  const supplyColor = overloadTripped
    ? faultLineColor
    : mcbOn
      ? activeLineColor
      : liveBaseColor;
  const neutralColor =
    forwardActive || reverseActive ? activeLineColor : neutralBaseColor;
  const toneStyles = {
    neutral: { fill: "#f8fafc", stroke: "#cbd5e1", text: "#475569" },
    active: { fill: "#ecfdf5", stroke: "#86efac", text: "#166534" },
    fault: { fill: "#fef2f2", stroke: "#fca5a5", text: "#b91c1c" },
  } as const;
  const badgeAnchors: Record<string, { x: number; y: number; width?: number; height?: number }> = {
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

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div className={`control-diagram-shell ${viewMode === "actual" ? "is-actual-scale" : ""}`}>
        <div className={`control-diagram-scroll ${viewMode === "actual" ? "is-scrollable" : ""}`}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="control-diagram-svg"
            style={viewMode === "actual" ? { width: `${width}px`, maxWidth: "none" } : undefined}
            role="img"
            aria-label="Reverse-forward control circuit"
          >
            <rect width={width} height={height} fill="#ffffff" />

            <g transform={`translate(${boardX} ${boardY})`}>
              <BackgroundPixelGred
                width={boardWidth}
                height={boardHeight}
                minor={20}
                major={100}
              />
            </g>

            <text
              x={supplyLabelX}
              y={neutralLineY + 7}
              fontSize="18"
              fontWeight="700"
              fill="#111827"
            >
              N
            </text>
            <text
              x={supplyLabelX}
              y={liveLineY + 7}
              fontSize="18"
              fontWeight="700"
              fill="#111827"
            >
              L
            </text>

            <line
              x1={supplyStartX}
              y1={neutralLineY}
              x2={supplyEndX}
              y2={neutralLineY}
              stroke={neutralBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={supplyStartX}
              y1={liveLineY}
              x2={supplyEndX}
              y2={liveLineY}
              stroke={liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <line
              x1={mcbNeutralOutputX}
              y1={neutralLineY}
              x2={neutralDropX}
              y2={neutralLineY}
              stroke={neutralColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={neutralDropX}
              y1={neutralLineY}
              x2={neutralDropX}
              y2={returnBusY}
              stroke={neutralColor}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <MCBControl2P
              x={mcbX}
              y={mcbY}
              scale={2}
              on={mcbOn}
              label=""
              standalone={false}
              wireStroke={1}
              textSize={7}
            />
            {showLabels ? (
              <text
                x={mcbX + 24}
                y={mcbY + 82}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                MCB
              </text>
            ) : null}

            <line
              x1={mcbLowerOutputX}
              y1={mcbLowerOutputY}
              x2={overloadTopTerminalX}
              y2={mcbLowerOutputY}
              stroke={supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={overloadTopTerminalX}
              y1={mcbLowerOutputY}
              x2={overloadTopTerminalX}
              y2={overloadY}
              stroke={supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${mcbLowerOutputX} ${mcbLowerOutputY} L ${overloadTopTerminalX} ${mcbLowerOutputY} L ${overloadTopTerminalX} ${overloadY}`}
              active={commonFeedActive && showFlow}
            />

            <AuxiliaryContactNC
              x={overloadX}
              y={overloadY}
              scale={2}
              closed={!overloadTripped}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#2563eb"
              terminalA="95"
              terminalB="96"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={66}
                y={overloadY + 86}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                O/L
              </text>
            ) : null}

            {componentStateBadges.map((badge) => {
              const anchor = badgeAnchors[badge.key];
              if (!anchor) return null;
              const tone = toneStyles[badge.tone];
              const width = anchor.width ?? 96;
              const height = anchor.height ?? 30;
              return (
                <g key={`badge-${badge.key}`} transform={`translate(${anchor.x}, ${anchor.y})`}>
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

            <line
              x1={rungX}
              y1={overloadBottomY - 30}
              x2={rungX}
              y2={offButtonY}
              stroke={supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${overloadBottomY - 30} L ${rungX} ${offButtonY}`}
              active={commonFeedActive && showFlow}
            />

            <PushButtonNC
              x={offButtonX}
              y={offButtonY}
              scale={2}
              pressed={stopPressed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#111827"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={62}
                y={offButtonY + 82}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                OFF
              </text>
            ) : null}

            <line
              x1={rungX}
              y1={offBottomY - 32}
              x2={rungX}
              y2={onButtonY}
              stroke={supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${offBottomY - 32} L ${rungX} ${onButtonY}`}
              active={forwardPathActive && showFlow}
            />

            <PushButtonNO
              x={onButtonX}
              y={onButtonY}
              scale={2}
              pressed={forwardStartPressed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#111827"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <>
                <text
                  x={58}
                  y={onButtonY + 80}
                  fontSize="12"
                  fontWeight="700"
                  fill="#ef4444"
                >
                  ON1
                </text>
                <text
                  x={58}
                  y={onButtonY + 98}
                  fontSize="12"
                  fontWeight="700"
                  fill="#111827"
                >
                  FWD
                </text>
              </>
            ) : null}

            <line
              x1={rungX}
              y1={k1HoldTopY - 30}
              x2={k1HoldTerminalX}
              y2={k1HoldTopY - 30}
              stroke={forwardActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <line
              x1={rungX}
              y1={k1HoldBottomY}
              x2={k1HoldTerminalX}
              y2={k1HoldBottomY}
              stroke={forwardActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${k1HoldTopY - 30} L ${k1HoldTerminalX} ${k1HoldTopY - 30} L ${k1HoldTerminalX} ${k1HoldBottomY} L ${rungX} ${k1HoldBottomY}`}
              active={forwardHoldClosed && showFlow}
            />

            <AuxiliaryContactNO
              x={k1HoldX}
              y={onButtonY}
              scale={2}
              closed={forwardHoldClosed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#2563eb"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={262}
                y={onButtonY + 80}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                K1
              </text>
            ) : null}

            <line
              x1={revBranchStartX}
              y1={revFeedY}
              x2={revButtonTerminalX}
              y2={revFeedY}
              stroke={supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${revBranchStartX} ${revFeedY} L ${revButtonTerminalX} ${revFeedY}`}
              active={reversePathActive && showFlow}
            />

            <PushButtonNO
              x={revButtonX}
              y={revButtonY}
              scale={2}
              pressed={reverseStartPressed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#111827"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <>
                <text
                  x={382}
                  y={revButtonY + 80}
                  fontSize="12"
                  fontWeight="700"
                  fill="#ef4444"
                >
                  ON2
                </text>
                <text
                  x={382}
                  y={revButtonY + 98}
                  fontSize="12"
                  fontWeight="700"
                  fill="#111827"
                >
                  REV
                </text>
              </>
            ) : null}

            <line
              x1={revRungX}
              y1={k2HoldTopY - 30}
              x2={k2HoldTerminalX}
              y2={k2HoldTopY - 30}
              stroke={reverseActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <line
              x1={revRungX}
              y1={k2HoldBottomY}
              x2={k2HoldTerminalX}
              y2={k2HoldBottomY}
              stroke={reverseActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${revRungX} ${k2HoldTopY - 30} L ${k2HoldTerminalX} ${k2HoldTopY - 30} L ${k2HoldTerminalX} ${k2HoldBottomY} L ${revRungX} ${k2HoldBottomY}`}
              active={reverseHoldClosed && showFlow}
            />

            <AuxiliaryContactNO
              x={k2HoldX}
              y={revButtonY}
              scale={2}
              closed={reverseHoldClosed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#2563eb"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={502}
                y={revButtonY + 80}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                K2
              </text>
            ) : null}

            <line
              x1={revRungX}
              y1={onBottomY - 30}
              x2={revRungX}
              y2={k1NcY}
              stroke={reverseActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${revRungX} ${onBottomY - 30} L ${revRungX} ${k1NcY}`}
              active={reversePathActive && showFlow}
            />

            <AuxiliaryContactNC
              x={k1NcX}
              y={k1NcY}
              scale={2}
              closed={k1InterlockClosed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#2563eb"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={344}
                y={k1NcY + 86}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                K1
              </text>
            ) : null}

            <line
              x1={revRungX}
              y1={k1NcBottomY - 30}
              x2={revRungX}
              y2={k2CoilY}
              stroke={reverseActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={revRungX}
              y1={k2CoilY}
              x2={k2CoilA1X}
              y2={k2CoilY}
              stroke={reverseActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${revRungX} ${k1NcBottomY - 30} L ${revRungX} ${k2CoilY} L ${k2CoilA1X} ${k2CoilY}`}
              active={reversePathActive && showFlow}
            />

            <ContactorCoil
              x={k2CoilX}
              y={k2CoilY}
              scale={2}
              energized={reverseActive}
              label="K2"
              standalone={false}
              strokeColor="#16a34a"
              wireStroke={1}
              textSize={7}
            />

            <line
              x1={revRungX}
              y1={k2CoilY}
              x2={k2LampFeedX + 10}
              y2={k2CoilY}
              stroke={reverseActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${revRungX} ${k2CoilY} L ${k2LampFeedX + 10} ${k2CoilY}`}
              active={reverseActive && showFlow}
            />
            <PilotLight
              x={k2LampX}
              y={k2LampY}
              scale={2}
              on={reverseActive}
              label=""
              standalone={false}
              strokeColor="#111827"
              wireStroke={1}
              textSize={7}
            />

            <line
              x1={rungX}
              y1={onBottomY - 30}
              x2={rungX}
              y2={k2NcY}
              stroke={forwardActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${onBottomY - 30} L ${rungX} ${k2NcY}`}
              active={forwardPathActive && showFlow}
            />

            <AuxiliaryContactNC
              x={k2NcX}
              y={k2NcY}
              scale={2}
              closed={k2InterlockClosed}
              label=""
              standalone={false}
              orientation="vertical"
              strokeColor="#2563eb"
              wireStroke={1}
              textSize={7}
              showTerminals
            />
            {showLabels ? (
              <text
                x={104}
                y={k2NcY + 86}
                fontSize="12"
                fontWeight="700"
                fill="#ef4444"
              >
                K2
              </text>
            ) : null}

            <line
              x1={rungX}
              y1={k2BottomY - 30}
              x2={rungX}
              y2={k1CoilY}
              stroke={forwardActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={rungX}
              y1={k1CoilY}
              x2={k1CoilA1X}
              y2={k1CoilY}
              stroke={forwardActive ? activeLineColor : supplyColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${k2BottomY - 30} L ${rungX} ${k1CoilY} L ${k1CoilA1X} ${k1CoilY}`}
              active={forwardPathActive && showFlow}
            />

            <ContactorCoil
              x={k1CoilX}
              y={k1CoilY}
              scale={2}
              energized={forwardActive}
              label="K1"
              standalone={false}
              strokeColor="#16a34a"
              wireStroke={1}
              textSize={7}
            />

            <line
              x1={rungX}
              y1={k1CoilY}
              x2={k1LampFeedX + 10}
              y2={k1CoilY}
              stroke={forwardActive ? activeLineColor : liveBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ElectronFlow
              d={`M ${rungX} ${k1CoilY} L ${k1LampFeedX} ${k1CoilY}`}
              active={forwardActive && showFlow}
            />
            <PilotLight
              x={k1LampX}
              y={k1LampY}
              scale={2}
              on={forwardActive}
              label=""
              standalone={false}
              strokeColor="#111827"
              wireStroke={1}
              textSize={7}
            />

            <line
              x1={k1CoilA1X}
              y1={k1CoilA2Y}
              x2={k1CoilA1X}
              y2={returnBusY}
              stroke={forwardActive ? neutralColor : neutralBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={k1LampReturnX}
              y1={k1LampReturnY}
              x2={k1LampReturnX}
              y2={returnBusY}
              stroke={forwardActive ? neutralColor : neutralBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={k2CoilA1X}
              y1={k2CoilA2Y}
              x2={k2CoilA1X}
              y2={returnBusY}
              stroke={reverseActive ? neutralColor : neutralBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={k2LampReturnX}
              y1={k2LampReturnY}
              x2={k2LampReturnX}
              y2={returnBusY}
              stroke={reverseActive ? neutralColor : neutralBaseColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={k1CoilA1X}
              y1={returnBusY}
              x2={neutralDropX}
              y2={returnBusY}
              stroke={neutralColor}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <ElectronFlow
              d={`M ${k1CoilA1X} ${k1CoilA2Y} L ${k1CoilA1X} ${returnBusY} L ${neutralDropX} ${returnBusY} L ${neutralDropX} ${neutralLineY}`}
              active={forwardActive && showFlow}
            />
            <ElectronFlow
              d={`M ${k2LampReturnX} ${k2LampReturnY} L ${k2LampReturnX} ${returnBusY} L ${neutralDropX} ${returnBusY} L ${neutralDropX} ${neutralLineY}`}
              active={reverseActive && showFlow}
            />
            <ElectronFlow
              d={`M ${k2CoilA1X} ${k2CoilA2Y} L ${k2CoilA1X} ${returnBusY} L ${neutralDropX} ${returnBusY} L ${neutralDropX} ${neutralLineY}`}
              active={reverseActive && showFlow}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
