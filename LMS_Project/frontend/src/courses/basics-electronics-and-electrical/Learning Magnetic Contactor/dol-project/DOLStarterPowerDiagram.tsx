"use client";

import { DOL_POWER_DIAGRAM_GEOMETRY } from "../../packages/core/src/dol";
import ContactorPowerContacts3P from "../../Project/library/contactors/ContactorPowerContacts3P";
import ACMotor3P from "../../Project/library/motors/ACMotor3P";
import CircuitBreaker3P from "../../Project/library/protection/CircuitBreaker3P";
import ThermalOverloadRelay3P from "../../Project/library/protection/ThermalOverloadRelay3P";
import ControlPanel from "./control_panel";

type DOLStarterPowerDiagramProps = {
  className?: string;
  showPanel?: boolean;
  mcbOn?: boolean;
  motorRunning?: boolean;
  startupInProgress?: boolean;
  overloadTripped?: boolean;
  highlightComponentKey?: string;
  motorCurrent?: number;
  motorRpm?: number;
  loadPercent?: number;
  flowStateLabel?: string;
  tripReason?: string;
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

const phaseActive = ["#dc2626", "#111827", "#64748b"] as const;
const phaseMuted = ["#fca5a5", "#cbd5e1", "#d8e1eb"] as const;
const faultColor = "#b91c1c";
const electronColor = "#fde047";

function phaseColor(index: number, state: WireState) {
  const safeIndex = Math.min(2, Math.max(0, index));
  if (state === "fault") return faultColor;
  if (state === "inactive") return phaseMuted[safeIndex];
  return phaseActive[safeIndex];
}

function PhaseLine({
  x1,
  y1,
  x2,
  y2,
  index,
  state,
  width = 2.6,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  index: number;
  state: WireState;
  width?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={phaseColor(index, state)}
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
  state,
  r = 5,
}: {
  cx: number;
  cy: number;
  index: number;
  state: WireState;
  r?: number;
}) {
  return <circle cx={cx} cy={cy} r={r} fill={phaseColor(index, state)} />;
}

function PhaseFlow({
  path,
  active,
  duration,
}: {
  path: string;
  active: boolean;
  duration: number;
}) {
  if (!active) return null;

  return (
    <>
      {[0, 0.42, 0.84].map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r="3.4"
          fill={electronColor}
          filter="url(#power-electron-glow)"
          opacity="0.95"
        >
          <animateMotion
            path={path}
            dur={`${duration}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values="0.35;1;0.35"
            dur={`${duration}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  );
}

function SectionHighlight({
  x,
  y,
  width,
  height,
  active,
  tone = "active",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  tone?: "active" | "fault";
}) {
  if (!active) return null;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx="18"
      fill={tone === "fault" ? "#fee2e2" : "#dbeafe"}
      fillOpacity={tone === "fault" ? 0.16 : 0.12}
      stroke={tone === "fault" ? "#f87171" : "#60a5fa"}
      strokeWidth="1.1"
      strokeDasharray="6 5"
    />
  );
}

function panelDescription({
  mcbOn,
  motorRunning,
  startupInProgress,
  overloadTripped,
}: {
  mcbOn: boolean;
  motorRunning: boolean;
  startupInProgress: boolean;
  overloadTripped: boolean;
}) {
  if (!mcbOn) {
    return "Breaker is OFF. The 3-phase feeder is isolated from the starter.";
  }
  if (overloadTripped) {
    return "Overload relay has tripped and opened the motor power path.";
  }
  if (startupInProgress) {
    return "Contactor is closing and 3-phase power is feeding the motor during startup.";
  }
  if (motorRunning) {
    return "Contactor is sealed in and 3-phase power is feeding the motor.";
  }
  return "Supply is available, but the contactor is open and the motor is stopped.";
}

export default function DOLStarterPowerDiagram({
  className = "",
  showPanel = false,
  mcbOn = true,
  motorRunning = false,
  startupInProgress = false,
  overloadTripped = false,
  highlightComponentKey = "",
  motorCurrent = 0,
  motorRpm = 1440,
  loadPercent = 0,
  flowStateLabel = "Idle",
  tripReason = "No active trip.",
  viewMode = "fit",
  showLabels = true,
  showFlow = true,
  onMcbToggle,
  onStart,
  onStop,
  onReset,
  onFault,
}: DOLStarterPowerDiagramProps) {
  const {
    stage: { width, height },
    source: { startX: sourceStartX, railYs, labelsX: sourceLabelsX },
    mccb: {
      phaseXs,
      x: breakerX,
      y: breakerY,
      scale: breakerScale,
      topY: breakerTopY,
      bottomY: breakerBottomY,
      leftLabelX: breakerLeftLabelX,
      rightLabelX: breakerRightLabelX,
      labelY: breakerLabelY,
    },
    contactor: {
      topY: contactorTopY,
      bottomY: contactorBottomY,
      rightLabelX: contactorRightLabelX,
      labelY: contactorLabelY,
    },
    overload: {
      y: overloadY,
      rightLabelX: overloadRightLabelX,
      labelY: overloadLabelY,
    },
    motor: { centerX: motorCenterX, centerY: motorCenterY },
  } = DOL_POWER_DIAGRAM_GEOMETRY;

  const contactorX = 335;
  const contactorY = contactorTopY;
  const contactorScale = 2.5;
  const overloadX = 335;
  const overloadSymbolY = overloadY;
  const overloadScale = 2.5;
  const breakerRenderX = breakerX + 12;
  const breakerRenderY = breakerY - 20;
  const breakerTerminalTopY = breakerRenderY + 20 * breakerScale + 0.5;
  const breakerTerminalBottomY = breakerRenderY + 40 * breakerScale + 0.5;
  const motorSymbolX = 359;
  const motorSymbolY = 738;
  const motorScale = 1.7;
  const overloadBottomY = overloadSymbolY + 50 * overloadScale;
  const motorTerminalY = motorSymbolY;
  const motorTerminalXs = [
    motorSymbolX + 10 * motorScale,
    motorSymbolX + 30 * motorScale,
    motorSymbolX + 50 * motorScale,
  ] as const;

  const breakerState: WireState = !mcbOn ? "inactive" : "active";

  const powerCurrentFlowActive =
    mcbOn && !overloadTripped && (motorRunning || startupInProgress);

  const loadState: WireState = overloadTripped
    ? "fault"
    : powerCurrentFlowActive
      ? "active"
      : "inactive";

  const speedValue = Math.round(
    startupInProgress
      ? motorRpm * 0.42
      : motorRunning
        ? motorRpm * Math.max(0.45, 1 - loadPercent / 220)
        : 0,
  );

  const visualMotorActive = startupInProgress || motorRunning;

  const motorVisualState = overloadTripped
    ? "trip"
    : startupInProgress
      ? "starting"
      : motorRunning
        ? "running"
        : "stopped";

  const motorVisualCenterY = motorCenterY + 11.5;

  const motorVisualSpeed = visualMotorActive
    ? startupInProgress
      ? Math.max(180, motorRpm * 0.42)
      : Math.max(260, speedValue)
    : 0;

  const motorRotationDuration = startupInProgress
    ? 1.8
    : Math.max(0.95, Math.min(3.1, 3200 / Math.max(260, motorVisualSpeed)));

  const motorRingStroke =
    motorVisualState === "trip"
      ? "#dc2626"
      : motorVisualState === "starting"
        ? "#f59e0b"
        : motorVisualState === "running"
          ? "#16a34a"
          : "#94a3b8";

  const motorHaloFill =
    motorVisualState === "trip"
      ? "rgba(220, 38, 38, 0.08)"
      : motorVisualState === "starting"
        ? "rgba(245, 158, 11, 0.1)"
        : motorVisualState === "running"
          ? "rgba(22, 163, 74, 0.08)"
          : "rgba(148, 163, 184, 0.05)";

  const motorStateLabel = overloadTripped
    ? "Trip Open"
    : startupInProgress
      ? "Starting"
      : motorRunning
        ? "Running"
        : "Stopped";

  const motorStatusFill =
    motorVisualState === "trip"
      ? "#fee2e2"
      : motorVisualState === "starting"
        ? "#fef3c7"
        : motorVisualState === "running"
          ? "#dcfce7"
          : "#eef2f7";

  const motorStatusStroke =
    motorVisualState === "trip"
      ? "#fca5a5"
      : motorVisualState === "starting"
        ? "#fcd34d"
        : motorVisualState === "running"
          ? "#86efac"
          : "#cbd5e1";

  const motorStatusText =
    motorVisualState === "trip"
      ? "#b91c1c"
      : motorVisualState === "starting"
        ? "#b45309"
        : motorVisualState === "running"
          ? "#15803d"
          : "#475569";

  const telemetryCardX = 500;
  const telemetryCardY = 744;

  const telemetryStatusText = overloadTripped
    ? "Motor Tripped"
    : startupInProgress
      ? "Motor Starting"
      : motorRunning
        ? "Motor Running"
        : "Motor Stopped";

  const focusedPowerZone =
    highlightComponentKey === "mcb"
      ? "breaker"
      : highlightComponentKey === "ol"
        ? "overload"
        : highlightComponentKey === "indicator"
          ? "motor"
          : ["on", "off", "hold", "k1"].includes(highlightComponentKey)
            ? "contactor"
            : "";

  const summaryText = panelDescription({
    mcbOn,
    motorRunning,
    startupInProgress,
    overloadTripped,
  });

  const sharedPanel = showPanel ? (
    <ControlPanel
      className="power-diagram-panel"
      onMcbToggle={onMcbToggle}
      onStart={onStart}
      onStop={onStop}
      onReset={onReset}
      onFault={onFault}
      mcbOn={mcbOn}
      motorRunning={motorRunning || startupInProgress}
      overloadTripped={overloadTripped}
      flowStateLabel={flowStateLabel}
      flowDescription={summaryText}
      motorCurrent={motorCurrent}
      motorRpm={motorRpm}
      loadPercent={loadPercent}
      motorSpeed={speedValue}
      tripReason={tripReason}
    />
  ) : null;

  return (
    <div
      className={`power-diagram-layout ${showPanel ? "with-panel" : ""} ${className}`}
    >
      {sharedPanel}

      <div
        className={`power-diagram-shell ${viewMode === "actual" ? "is-actual-scale" : ""}`}
      >
        <div
          className={`power-diagram-scroll ${viewMode === "actual" ? "is-scrollable" : ""}`}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="power-diagram-svg"
            style={
              viewMode === "actual"
                ? { width: `${width}px`, maxWidth: "none" }
                : undefined
            }
            role="img"
            aria-label="DOL starter power circuit following control-circuit visual style"
          >
            <defs>
              <filter
                id="power-electron-glow"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient
                id="motor-body-gradient"
                cx="34%"
                cy="28%"
                r="78%"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="58%" stopColor="#f2f6fb" />
                <stop offset="100%" stopColor="#d9e1ec" />
              </radialGradient>

              <linearGradient
                id="motor-rim-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="35%" stopColor="#cbd5e1" />
                <stop offset="72%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              <radialGradient
                id="motor-core-gradient"
                cx="30%"
                cy="26%"
                r="74%"
              >
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>

              <filter
                id="motor-shadow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="5"
                  floodColor="#0f172a"
                  floodOpacity="0.14"
                />
              </filter>

              <filter
                id="motor-running-glow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="4.2" result="motorGlow" />
                <feMerge>
                  <feMergeNode in="motorGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={width} height={height} fill="#ffffff" />

            <SectionHighlight
              x={326}
              y={218}
              width={156}
              height={136}
              active={focusedPowerZone === "breaker"}
            />

            <SectionHighlight
              x={326}
              y={392}
              width={154}
              height={142}
              active={focusedPowerZone === "contactor"}
            />

            <SectionHighlight
              x={328}
              y={570}
              width={150}
              height={70}
              active={focusedPowerZone === "overload"}
              tone={overloadTripped ? "fault" : "active"}
            />

            <SectionHighlight
              x={346}
              y={730}
              width={128}
              height={112}
              active={focusedPowerZone === "motor"}
            />

            {[0, 1, 2].map((index) => (
              <g key={`source-${index}`}>
                {showLabels ? (
                  <text
                    x={sourceLabelsX}
                    y={railYs[index] + 5}
                    fontSize="18"
                    fontWeight="700"
                    fill="#111827"
                  >
                    {`L${index + 1}`}
                  </text>
                ) : null}

                <PhaseLine
                  x1={sourceStartX}
                  y1={railYs[index]}
                  x2={phaseXs[index]}
                  y2={railYs[index]}
                  index={index}
                  state={breakerState}
                />

                <PhaseDot
                  cx={phaseXs[index]}
                  cy={railYs[index]}
                  index={index}
                  state={breakerState}
                />

                <PhaseLine
                  x1={phaseXs[index]}
                  y1={railYs[index]}
                  x2={phaseXs[index]}
                  y2={breakerTerminalTopY}
                  index={index}
                  state={breakerState}
                />
              </g>
            ))}

            {showLabels ? (
              <>
                <text
                  x={breakerLeftLabelX}
                  y={breakerLabelY}
                  fontSize="12"
                  fontWeight="700"
                  fill="#dc2626"
                >
                  3P MCB / MCCB
                </text>

                <text
                  x={breakerRightLabelX}
                  y={breakerLabelY}
                  fontSize="12"
                  fontWeight="700"
                  fill="#111827"
                >
                  Circuit Breaker
                </text>
              </>
            ) : null}

            <CircuitBreaker3P
              x={breakerRenderX}
              y={breakerRenderY}
              scale={breakerScale}
              on={mcbOn}
              label=""
              standalone={false}
              strokeColor="#111827"
              orientation="vertical"
            />

            {showLabels ? (
              <>
                {phaseXs.map((x, index) => (
                  <g key={`breaker-terminal-labels-${index}`}>
                    <text
                      x={x}
                      y={breakerTerminalTopY - 12}
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="700"
                      fill="#111827"
                    >
                      {[1, 3, 5][index]}
                    </text>

                    <text
                      x={x}
                      y={breakerTerminalBottomY + 19}
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="700"
                      fill="#111827"
                    >
                      {[2, 4, 6][index]}
                    </text>
                  </g>
                ))}
              </>
            ) : null}

            {phaseXs.map((x, index) => (
              <PhaseLine
                key={`breaker-output-${index}`}
                x1={x}
                y1={breakerTerminalBottomY}
                x2={x}
                y2={contactorTopY}
                index={index}
                state={breakerState}
              />
            ))}

            {showLabels ? (
              <text
                x={contactorRightLabelX}
                y={contactorLabelY}
                fontSize="12"
                fontWeight="700"
                fill="#111827"
              >
                Contactor Power Contacts
              </text>
            ) : null}

            <ContactorPowerContacts3P
              x={contactorX}
              y={contactorY}
              scale={contactorScale}
              closed={powerCurrentFlowActive}
              label="K1"
              showCoilSymbol
              standalone={false}
            />

            {phaseXs.map((x, index) => (
              <PhaseLine
                key={`contactor-output-${index}`}
                x1={x}
                y1={contactorBottomY}
                x2={x}
                y2={overloadY}
                index={index}
                state={loadState}
              />
            ))}

            {showLabels ? (
              <text
                x={overloadRightLabelX}
                y={overloadLabelY}
                fontSize="12"
                fontWeight="700"
                fill="#111827"
              >
                Thermal Overload Relay
              </text>
            ) : null}

            <ThermalOverloadRelay3P
              x={overloadX}
              y={overloadSymbolY}
              scale={overloadScale}
              tripped={overloadTripped}
              label="O/L"
              standalone={false}
            />

            {phaseXs.map((x, index) => (
              <PhaseLine
                key={`overload-output-${index}`}
                x1={x}
                y1={overloadBottomY}
                x2={motorTerminalXs[index]}
                y2={motorTerminalY}
                index={index}
                state={loadState}
                width={2.4}
              />
            ))}

            <g>
              <circle
                cx={motorCenterX}
                cy={motorVisualCenterY}
                r="50"
                fill={motorHaloFill}
              />

              <circle
                cx={motorCenterX}
                cy={motorVisualCenterY}
                r="44"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1.8"
              />

              <circle
                cx={motorCenterX}
                cy={motorVisualCenterY}
                r="48"
                fill="none"
                stroke={motorRingStroke}
                strokeWidth={motorVisualState === "running" ? "2.6" : "2.4"}
                strokeDasharray={
                  motorVisualState === "stopped" ? "7 9" : "none"
                }
                opacity={motorVisualState === "stopped" ? "0.82" : "0.92"}
                filter={
                  visualMotorActive ? "url(#motor-running-glow)" : undefined
                }
              />

              <g opacity="0.34">
                <ACMotor3P
                  x={motorSymbolX}
                  y={motorSymbolY}
                  scale={motorScale}
                  label=""
                  standalone={false}
                />
              </g>

              <ellipse
                cx={motorCenterX}
                cy={motorVisualCenterY + 34}
                rx="34"
                ry="10"
                fill="#0f172a"
                opacity="0.08"
              />

              <g filter="url(#motor-shadow)">
                <circle
                  cx={motorCenterX}
                  cy={motorVisualCenterY}
                  r="36"
                  fill="url(#motor-body-gradient)"
                  stroke="url(#motor-rim-gradient)"
                  strokeWidth="2.4"
                />

                <circle
                  cx={motorCenterX}
                  cy={motorVisualCenterY}
                  r="26"
                  fill="url(#motor-core-gradient)"
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                />

                <circle
                  cx={motorCenterX}
                  cy={motorVisualCenterY}
                  r="7.5"
                  fill="#e2e8f0"
                  stroke="#64748b"
                  strokeWidth="1.3"
                />

                <circle
                  cx={motorCenterX - 8}
                  cy={motorVisualCenterY - 10}
                  r="10"
                  fill="#ffffff"
                  opacity="0.18"
                />
              </g>

              <g opacity={visualMotorActive ? 1 : 0.45}>
                {visualMotorActive ? (
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from={`0 ${motorCenterX} ${motorVisualCenterY}`}
                    to={`360 ${motorCenterX} ${motorVisualCenterY}`}
                    dur={`${motorRotationDuration}s`}
                    repeatCount="indefinite"
                  />
                ) : null}

                <path
                  d={`M ${motorCenterX - 16} ${motorVisualCenterY - 2} Q ${
                    motorCenterX - 2
                  } ${motorVisualCenterY - 18} ${motorCenterX + 16} ${
                    motorVisualCenterY - 4
                  }`}
                  fill="none"
                  stroke={motorRingStroke}
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  opacity="0.92"
                />

                <line
                  x1={motorCenterX + 4}
                  y1={motorVisualCenterY - 3}
                  x2={motorCenterX + 22}
                  y2={motorVisualCenterY - 18}
                  stroke={motorRingStroke}
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.88"
                />

                <line
                  x1={motorCenterX + 1}
                  y1={motorVisualCenterY + 6}
                  x2={motorCenterX + 20}
                  y2={motorVisualCenterY + 20}
                  stroke={motorRingStroke}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  opacity="0.76"
                />

                <line
                  x1={motorCenterX - 10}
                  y1={motorVisualCenterY + 3}
                  x2={motorCenterX - 22}
                  y2={motorVisualCenterY + 18}
                  stroke={motorRingStroke}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>

              <rect
                x={motorCenterX - 18}
                y={motorVisualCenterY + 29}
                width="36"
                height="7"
                rx="3.5"
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth="0.8"
                opacity="0.95"
              />
            </g>

            {showLabels ? (
              <>
                <text
                  x={motorCenterX}
                  y={motorCenterY + 78}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#111827"
                >
                  3-Phase Motor
                </text>

                <g>
                  <rect
                    x={motorCenterX - 40}
                    y={motorCenterY + 84}
                    width="80"
                    height="20"
                    rx="10"
                    fill={motorStatusFill}
                    stroke={motorStatusStroke}
                    strokeWidth="1.2"
                  />

                  <text
                    x={motorCenterX}
                    y={motorCenterY + 98}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill={motorStatusText}
                  >
                    {motorStateLabel}
                  </text>
                </g>
              </>
            ) : null}

            {showLabels ? (
              <g>
                <rect
                  x={telemetryCardX}
                  y={telemetryCardY}
                  width="182"
                  height="82"
                  rx="16"
                  fill="#ffffff"
                  stroke="#d9e0e8"
                  strokeWidth="1.2"
                />

                <text
                  x={telemetryCardX + 16}
                  y={telemetryCardY + 22}
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#64748b"
                >
                  MOTOR OUTPUT
                </text>

                <text
                  x={telemetryCardX + 16}
                  y={telemetryCardY + 42}
                  fontSize="12"
                  fontWeight="700"
                  fill="#dc2626"
                >
                  Current Draw: {motorCurrent.toFixed(1)} A
                </text>

                <text
                  x={telemetryCardX + 16}
                  y={telemetryCardY + 60}
                  fontSize="12"
                  fontWeight="700"
                  fill="#dc2626"
                >
                  Speed: {speedValue} RPM
                </text>

                <rect
                  x={telemetryCardX + 16}
                  y={telemetryCardY + 66}
                  width="104"
                  height="22"
                  rx="11"
                  fill={motorStatusFill}
                  stroke={motorStatusStroke}
                  strokeWidth="1.1"
                />

                <text
                  x={telemetryCardX + 68}
                  y={telemetryCardY + 81}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={motorStatusText}
                >
                  {telemetryStatusText}
                </text>
              </g>
            ) : null}

            {showFlow
              ? phaseXs.map((x, index) => {
                  const feederPath = `M ${sourceStartX} ${railYs[index]} H ${x} V ${breakerTopY} M ${x} ${breakerBottomY} V ${contactorTopY}`;
                  const loadPath = `M ${x} ${contactorBottomY} V ${overloadY} M ${x} ${overloadBottomY} L ${motorTerminalXs[index]} ${motorTerminalY}`;

                  return (
                    <g key={`flow-${index}`}>
                      <PhaseFlow
                        path={feederPath}
                        active={powerCurrentFlowActive}
                        duration={2.7 + index * 0.18}
                      />

                      <PhaseFlow
                        path={loadPath}
                        active={powerCurrentFlowActive}
                        duration={3 + index * 0.18}
                      />
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
      </div>
    </div>
  );
}
