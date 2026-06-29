// RelayInteractiveSimulation.tsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "motion/react";

type CircuitType = "AC" | "DC";
type CircuitMode = "AC" | "DC" | "Both";
type CoilStatus = "OFF" | "Weak" | "Energized";
type WirePolarity = "top" | "bottom";

type Point = {
  x: number;
  y: number;
};

type SimulationSettings = {
  powerOn: boolean;
  circuitMode: CircuitMode;
  acVoltage: number;
  dcVoltage: number;
  resistance: number;
  acFrequency: number;
  animationSpeed: number;
  showElectronFlow: boolean;
  showMagneticField: boolean;
  showLabels: boolean;
  showDirectionArrows: boolean;
};

type CircuitValues = {
  type: CircuitType;
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  magneticStrength: number;
  displayMagneticStrength: number;
  status: CoilStatus;
  isVisible: boolean;
  isPowered: boolean;
  highCurrentWarning: boolean;
  instantVoltage: number;
  instantDirection: 1 | -1;
};

const COLORS = {
  black: "#000000",
  white: "#ffffff",

  inactiveWire: "#b8b8b8",

  acLive: "#8B4513",
  acNeutral: "#1f5fbf",

  dcPositive: "#cc0000",
  dcNegative: "#222222",

  coilBody: "#eeeeee",
  coilBodyOn: "#dddddd",
  coilCopper: "#b87333",

  dcField: "#1f5fbf",
  acField: "#6a4fbf",

  electronDC: "#003366",
  electronAC: "#4b0082",

  warning: "#cc6600",
};

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1000,
  height: 610,
};

const TEXT_STYLE = {
  fill: COLORS.black,
  fontFamily: "Arial, Helvetica, sans-serif",
  textAnchor: "middle" as const,
};

const TERMINAL_DOT_RADIUS = 4;
const CURRENT_THRESHOLD = 0.05;
const HIGH_CURRENT_WARNING = 1.5;

const defaultSettings: SimulationSettings = {
  powerOn: true,
  circuitMode: "Both",
  acVoltage: 120,
  dcVoltage: 12,
  resistance: 120,
  acFrequency: 50,
  animationSpeed: 1,
  showElectronFlow: true,
  showMagneticField: true,
  showLabels: true,
  showDirectionArrows: true,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, decimals = 2) {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(decimals);
}

function getInstantACVoltage(vrms: number, frequency: number, time: number) {
  return vrms * 1.414 * Math.sin(2 * Math.PI * frequency * time);
}

function getCircuitValues({
  type,
  settings,
  time,
}: {
  type: CircuitType;
  settings: SimulationSettings;
  time: number;
}): CircuitValues {
  const isVisible =
    settings.circuitMode === "Both" || settings.circuitMode === type;

  const voltage = type === "AC" ? settings.acVoltage : settings.dcVoltage;
  const resistance = Math.max(settings.resistance, 1);
  const isPowered = settings.powerOn && isVisible && voltage > 0;

  const current = isPowered ? voltage / resistance : 0;
  const power = isPowered ? voltage * current : 0;
  const magneticStrength = isPowered ? clamp(current / 0.2, 0, 1) : 0;

  const instantVoltage =
    type === "AC"
      ? getInstantACVoltage(
          settings.acVoltage,
          settings.acFrequency,
          time * settings.animationSpeed
        )
      : settings.dcVoltage;

  const instantDirection: 1 | -1 = instantVoltage >= 0 ? 1 : -1;

  const acPulse =
    type === "AC" && isPowered
      ? clamp(Math.abs(instantVoltage) / Math.max(settings.acVoltage * 1.414, 1), 0, 1)
      : 1;

  const displayMagneticStrength = magneticStrength * acPulse;

  let status: CoilStatus = "OFF";

  if (isPowered && current >= CURRENT_THRESHOLD) {
    status = "Energized";
  } else if (isPowered && current > 0) {
    status = "Weak";
  }

  return {
    type,
    voltage,
    resistance,
    current,
    power,
    magneticStrength,
    displayMagneticStrength,
    status,
    isVisible,
    isPowered,
    highCurrentWarning: isPowered && current >= HIGH_CURRENT_WARNING,
    instantVoltage,
    instantDirection,
  };
}

function getPathLength(points: Point[]) {
  let length = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }

  return length;
}

function getPointOnPath(points: Point[], progress: number) {
  const safeProgress = ((progress % 1) + 1) % 1;
  const totalLength = getPathLength(points);
  let distance = safeProgress * totalLength;

  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (distance <= segmentLength) {
      const ratio = segmentLength === 0 ? 0 : distance / segmentLength;

      return {
        x: start.x + dx * ratio,
        y: start.y + dy * ratio,
      };
    }

    distance -= segmentLength;
  }

  return points[points.length - 1];
}

function getWireColor({
  type,
  polarity,
  active,
}: {
  type: CircuitType;
  polarity: WirePolarity;
  active: boolean;
}) {
  if (!active) return COLORS.inactiveWire;

  if (type === "AC") {
    return polarity === "top" ? COLORS.acLive : COLORS.acNeutral;
  }

  return polarity === "top" ? COLORS.dcPositive : COLORS.dcNegative;
}

function getWireWidth(values: CircuitValues) {
  if (!values.isPowered) return 2.6;
  if (values.status === "Energized") return 4.2;
  if (values.status === "Weak") return 3.3;
  return 3;
}

function useMotionClock() {
  const clock = useMotionValue(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const controls = animate(clock, 100000, {
      duration: 100000,
      ease: "linear",
      repeat: Infinity,
      onUpdate: (latest) => {
        setTime(latest);
      },
    });

    return () => controls.stop();
  }, [clock]);

  return time;
}

function WireLine({
  from,
  to,
  color,
  width,
  opacity = 1,
  dashed = false,
}: {
  from: Point;
  to: Point;
  color: string;
  width: number;
  opacity?: number;
  dashed?: boolean;
}) {
  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={dashed ? "8 6" : undefined}
      initial={false}
      animate={{
        stroke: color,
        strokeWidth: width,
        opacity,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    />
  );
}

function TerminalDot({
  x,
  y,
  color,
  active,
}: Point & {
  color: string;
  active: boolean;
}) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      fill={COLORS.white}
      initial={false}
      animate={{
        r: active ? [TERMINAL_DOT_RADIUS, TERMINAL_DOT_RADIUS + 1.8, TERMINAL_DOT_RADIUS] : TERMINAL_DOT_RADIUS,
        stroke: color,
        strokeWidth: active ? 3 : 2.5,
      }}
      transition={{
        r: {
          duration: 1,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        },
        stroke: {
          duration: 0.25,
        },
      }}
    />
  );
}

function SvgLabel({
  x,
  y,
  children,
  size = 15,
  anchor = "middle",
  color = COLORS.black,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={TEXT_STYLE.fontFamily}
      fontSize={size}
      textAnchor={anchor}
      fill={color}
    >
      {children}
    </text>
  );
}

function ElectronDot({
  point,
  color,
  opacity,
  speed,
}: {
  point: Point;
  color: string;
  opacity: number;
  speed: number;
}) {
  return (
    <motion.circle
      fill={color}
      initial={false}
      animate={{
        cx: point.x,
        cy: point.y,
        r: [3.1, 4.3, 3.1],
        opacity,
      }}
      transition={{
        cx: {
          duration: 0.08,
          ease: "linear",
        },
        cy: {
          duration: 0.08,
          ease: "linear",
        },
        r: {
          duration: 0.75 / Math.max(speed, 0.2),
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.2,
        },
      }}
    />
  );
}

function ElectronFlow({
  type,
  path,
  time,
  speed,
  frequency,
  enabled,
  strength,
  instantDirection,
}: {
  type: CircuitType;
  path: Point[];
  time: number;
  speed: number;
  frequency: number;
  enabled: boolean;
  strength: number;
  instantDirection: 1 | -1;
}) {
  return (
    <AnimatePresence>
      {enabled && strength > 0.01 && (
        <motion.g
          key={`${type}-electron-flow`}
          aria-label={`${type} electron flow`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {Array.from({ length: 14 }).map((_, index) => {
            const baseProgress = index / 14;
            let progress = baseProgress;

            if (type === "DC") {
              progress = baseProgress + time * speed * 0.16;
            } else {
              const visibleFrequency = 0.75 + frequency / 40;
              const oscillation =
                Math.sin(time * speed * visibleFrequency * Math.PI * 2) *
                0.09 *
                instantDirection;

              progress = baseProgress + oscillation;
            }

            const point = getPointOnPath(path, progress);
            const color = type === "AC" ? COLORS.electronAC : COLORS.electronDC;
            const opacity = clamp(0.25 + strength * 0.75, 0.2, 1);

            return (
              <ElectronDot
                key={`${type}-electron-${index}`}
                point={point}
                color={color}
                opacity={opacity}
                speed={speed}
              />
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function DirectionArrows({
  type,
  path,
  enabled,
  strength,
  instantDirection,
  speed,
}: {
  type: CircuitType;
  path: Point[];
  enabled: boolean;
  strength: number;
  instantDirection: 1 | -1;
  speed: number;
}) {
  return (
    <AnimatePresence>
      {enabled && strength > 0.01 && (
        <motion.g
          key={`${type}-direction-arrows`}
          aria-label={`${type} direction arrows`}
          initial={{ opacity: 0 }}
          animate={{ opacity: clamp(0.35 + strength * 0.55, 0.35, 0.9) }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {[0.16, 0.39, 0.62, 0.85].map((progress, index) => {
            const arrowProgress =
              type === "AC" && instantDirection < 0 ? 1 - progress : progress;

            const point = getPointOnPath(path, arrowProgress);
            const nextPoint = getPointOnPath(path, arrowProgress + 0.015 * instantDirection);

            const angle =
              Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
              (180 / Math.PI);

            return (
              <motion.g
                key={`${type}-arrow-${index}`}
                animate={{
                  x: point.x,
                  y: point.y,
                  rotate: angle,
                }}
                transition={{
                  duration: 0.25 / Math.max(speed, 0.2),
                  ease: "easeOut",
                }}
              >
                <path
                  d="M -7 -4 L 3 0 L -7 4"
                  stroke={type === "AC" ? COLORS.electronAC : COLORS.electronDC}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </motion.g>
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function MagneticFieldLines({
  type,
  x,
  y,
  strength,
  show,
  speed,
}: {
  type: CircuitType;
  x: number;
  y: number;
  strength: number;
  show: boolean;
  speed: number;
}) {
  const color = type === "AC" ? COLORS.acField : COLORS.dcField;
  const safeStrength = clamp(strength, 0, 1);
  const opacity = clamp(0.15 + safeStrength * 0.8, 0.12, 0.95);
  const strokeWidth = 1.2 + safeStrength * 2.5;
  const spread = 46 + safeStrength * 22;

  const fieldPaths = [
    `M ${x - spread} ${y - 52} C ${x - spread - 38} ${y}, ${
      x - spread - 38
    } ${y}, ${x - spread} ${y + 52}`,

    `M ${x - spread - 22} ${y - 72} C ${x - spread - 72} ${y}, ${
      x - spread - 72
    } ${y}, ${x - spread - 22} ${y + 72}`,

    `M ${x + spread} ${y - 52} C ${x + spread + 38} ${y}, ${
      x + spread + 38
    } ${y}, ${x + spread} ${y + 52}`,

    `M ${x + spread + 22} ${y - 72} C ${x + spread + 72} ${y}, ${
      x + spread + 72
    } ${y}, ${x + spread + 22} ${y + 72}`,
  ];

  return (
    <AnimatePresence>
      {show && safeStrength > 0.03 && (
        <motion.g
          key={`${type}-magnetic-field`}
          aria-label={`${type} magnetic field lines`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {fieldPaths.map((pathData, index) => (
            <motion.path
              key={`${type}-field-line-${index}`}
              d={pathData}
              stroke={color}
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
              initial={false}
              animate={{
                opacity:
                  type === "AC"
                    ? [opacity * 0.45, opacity, opacity * 0.45]
                    : opacity,
                strokeWidth:
                  type === "AC"
                    ? [strokeWidth * 0.7, strokeWidth, strokeWidth * 0.7]
                    : strokeWidth,
                pathLength: type === "AC" ? [0.62, 1, 0.62] : 1,
              }}
              transition={{
                duration: type === "AC" ? 1.15 / Math.max(speed, 0.2) : 0.3,
                repeat: type === "AC" ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function MagneticPoleLabels({
  type,
  x,
  y,
  values,
  showLabels,
}: {
  type: CircuitType;
  x: number;
  y: number;
  values: CircuitValues;
  showLabels: boolean;
}) {
  if (!showLabels || values.status === "OFF") return null;

  const leftPole = type === "AC" && values.instantDirection < 0 ? "S" : "N";
  const rightPole = type === "AC" && values.instantDirection < 0 ? "N" : "S";
  const opacity = clamp(0.35 + values.displayMagneticStrength * 0.65, 0.35, 1);

  return (
    <motion.g
      aria-label={`${type} magnetic pole labels`}
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.2 }}
    >
      <SvgLabel
        x={x - 68}
        y={y - 58}
        size={16}
        color={type === "AC" ? COLORS.acField : COLORS.dcField}
      >
        {leftPole}
      </SvgLabel>

      <SvgLabel
        x={x + 68}
        y={y - 58}
        size={16}
        color={type === "AC" ? COLORS.acField : COLORS.dcField}
      >
        {rightPole}
      </SvgLabel>
    </motion.g>
  );
}

function ACSource({
  x,
  y,
  top,
  bottom,
  liveColor,
  neutralColor,
  wireWidth,
  active,
  showLabels,
  speed,
}: {
  x: number;
  y: number;
  top: Point;
  bottom: Point;
  liveColor: string;
  neutralColor: string;
  wireWidth: number;
  active: boolean;
  showLabels: boolean;
  speed: number;
}) {
  const radius = 31;

  return (
    <g aria-label="AC source">
      <WireLine
        from={top}
        to={{ x, y: y - radius }}
        color={liveColor}
        width={wireWidth}
      />

      <WireLine
        from={{ x, y: y + radius }}
        to={bottom}
        color={neutralColor}
        width={wireWidth}
      />

      <motion.circle
        cx={x}
        cy={y}
        r={radius}
        stroke={COLORS.black}
        strokeWidth={3}
        fill={COLORS.white}
        initial={false}
        animate={{
          scale: active ? [1, 1.025, 1] : 1,
        }}
        transition={{
          duration: 1.2 / Math.max(speed, 0.2),
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: `${x}px ${y}px`,
        }}
      />

      <motion.path
        d={`
          M ${x - 19} ${y}
          C ${x - 13} ${y - 14}, ${x - 6} ${y - 14}, ${x} ${y}
          S ${x + 13} ${y + 14}, ${x + 19} ${y}
        `}
        stroke={COLORS.black}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{
          pathLength: active ? [0.35, 1, 0.35] : 1,
          opacity: active ? [0.55, 1, 0.55] : 1,
        }}
        transition={{
          duration: 1 / Math.max(speed, 0.2),
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <TerminalDot x={top.x} y={top.y} color={liveColor} active={active} />
      <TerminalDot x={bottom.x} y={bottom.y} color={neutralColor} active={active} />

      {showLabels && <SvgLabel x={x} y={bottom.y + 31}>AC Source</SvgLabel>}
    </g>
  );
}

function DCSource({
  x,
  y,
  top,
  bottom,
  positiveColor,
  negativeColor,
  wireWidth,
  active,
  showLabels,
}: {
  x: number;
  y: number;
  top: Point;
  bottom: Point;
  positiveColor: string;
  negativeColor: string;
  wireWidth: number;
  active: boolean;
  showLabels: boolean;
}) {
  const longPlateY = y - 14;
  const shortPlateY = y + 15;

  return (
    <g aria-label="DC source">
      <WireLine
        from={top}
        to={{ x, y: longPlateY }}
        color={positiveColor}
        width={wireWidth}
      />

      <WireLine
        from={{ x, y: shortPlateY }}
        to={bottom}
        color={negativeColor}
        width={wireWidth}
      />

      <motion.line
        x1={x - 30}
        y1={longPlateY}
        x2={x + 30}
        y2={longPlateY}
        stroke={COLORS.black}
        strokeLinecap="round"
        initial={false}
        animate={{
          strokeWidth: active ? 4 : 3.2,
          opacity: active ? 1 : 0.75,
        }}
        transition={{ duration: 0.25 }}
      />

      <motion.line
        x1={x - 17}
        y1={shortPlateY}
        x2={x + 17}
        y2={shortPlateY}
        stroke={COLORS.black}
        strokeLinecap="round"
        initial={false}
        animate={{
          strokeWidth: active ? 4 : 3.2,
          opacity: active ? 1 : 0.75,
        }}
        transition={{ duration: 0.25 }}
      />

      {showLabels && (
        <>
          <SvgLabel x={x - 46} y={longPlateY + 6} size={18} color={positiveColor}>
            +
          </SvgLabel>

          <SvgLabel x={x - 46} y={shortPlateY + 6} size={22} color={negativeColor}>
            -
          </SvgLabel>

          <SvgLabel x={x} y={bottom.y + 31}>
            DC Source
          </SvgLabel>
        </>
      )}

      <TerminalDot x={top.x} y={top.y} color={positiveColor} active={active} />
      <TerminalDot x={bottom.x} y={bottom.y} color={negativeColor} active={active} />
    </g>
  );
}

function CoilWinding({
  x,
  y,
  height,
  active,
  type,
  strength,
  speed,
}: {
  x: number;
  y: number;
  height: number;
  active: boolean;
  type: CircuitType;
  strength: number;
  speed: number;
}) {
  const startY = y - height / 2;
  const loopHeight = height / 4;
  const left = x - 17;
  const right = x + 17;

  return (
    <g aria-label="coil winding">
      {[0, 1, 2, 3].map((index) => {
        const y1 = startY + index * loopHeight;
        const yMid = y1 + loopHeight / 2;
        const y2 = y1 + loopHeight;

        return (
          <motion.path
            key={`coil-winding-${index}`}
            d={`
              M ${x} ${y1}
              C ${left} ${y1}, ${left} ${yMid}, ${x} ${yMid}
              C ${right} ${yMid}, ${right} ${y2}, ${x} ${y2}
            `}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={false}
            animate={{
              stroke: active ? COLORS.coilCopper : COLORS.inactiveWire,
              strokeWidth: active ? 2.8 + strength * 0.8 : 2.4,
              opacity:
                active && type === "AC"
                  ? [0.62, 1, 0.62]
                  : active
                    ? 1
                    : 0.55,
            }}
            transition={{
              duration: type === "AC" ? 0.9 / Math.max(speed, 0.2) : 0.25,
              repeat: active && type === "AC" ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </g>
  );
}

function RelayContactIndicator({
  x,
  y,
  status,
  showLabels,
}: {
  x: number;
  y: number;
  status: CoilStatus;
  showLabels: boolean;
}) {
  const rightContactX = x + 60;

  const movingEnd =
    status === "Energized"
      ? { x: x + 52, y }
      : status === "Weak"
        ? { x: x + 47, y: y - 8 }
        : { x: x + 42, y: y - 21 };

  const armatureEnd =
    status === "Energized"
      ? { x: x - 25, y: y + 42 }
      : status === "Weak"
        ? { x: x - 38, y: y + 31 }
        : { x: x - 48, y: y + 20 };

  const label =
    status === "Energized"
      ? "Contact Closed"
      : status === "Weak"
        ? "Almost Moving"
        : "Contact Open";

  return (
    <g aria-label="relay contact and armature indicator">
      <circle cx={x} cy={y} r={4} fill={COLORS.black} />
      <circle cx={rightContactX} cy={y} r={4} fill={COLORS.black} />

      <motion.line
        x1={x}
        y1={y}
        stroke={COLORS.black}
        strokeWidth={3}
        strokeLinecap="round"
        initial={false}
        animate={{
          x2: movingEnd.x,
          y2: movingEnd.y,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: status === "Energized" ? 14 : 18,
        }}
      />

      <line
        x1={rightContactX - 13}
        y1={y}
        x2={rightContactX}
        y2={y}
        stroke={COLORS.black}
        strokeWidth={3}
        strokeLinecap="round"
      />

      <circle cx={x - 55} cy={y + 18} r={3.5} fill={COLORS.black} />

      <motion.line
        x1={x - 55}
        y1={y + 18}
        stroke={COLORS.black}
        strokeWidth={3}
        strokeLinecap="round"
        initial={false}
        animate={{
          x2: armatureEnd.x,
          y2: armatureEnd.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
      />

      {showLabels && (
        <>
          <SvgLabel x={x + 30} y={y + 31} size={12}>
            {label}
          </SvgLabel>

          <SvgLabel x={x - 52} y={y + 61} size={12}>
            Armature
          </SvgLabel>
        </>
      )}
    </g>
  );
}

function RelayCoil({
  x,
  y,
  top,
  bottom,
  type,
  values,
  wireTopColor,
  wireBottomColor,
  wireWidth,
  animationSpeed,
  showLabels,
}: {
  x: number;
  y: number;
  top: Point;
  bottom: Point;
  type: CircuitType;
  values: CircuitValues;
  wireTopColor: string;
  wireBottomColor: string;
  wireWidth: number;
  animationSpeed: number;
  showLabels: boolean;
}) {
  const bodyWidth = 80;
  const bodyHeight = 98;
  const bodyTop = y - bodyHeight / 2;
  const bodyBottom = y + bodyHeight / 2;

  const highlightOpacity =
    values.status === "Energized"
      ? 0.18 + values.displayMagneticStrength * 0.28
      : values.status === "Weak"
        ? 0.08
        : 0;

  const heatOpacity = values.highCurrentWarning ? 0.35 : 0;

  return (
    <g aria-label={`${type} relay coil`}>
      <WireLine
        from={top}
        to={{ x, y: bodyTop }}
        color={wireTopColor}
        width={wireWidth}
      />

      <WireLine
        from={{ x, y: bodyBottom }}
        to={bottom}
        color={wireBottomColor}
        width={wireWidth}
      />

      <AnimatePresence>
        {values.highCurrentWarning && (
          <motion.ellipse
            key={`${type}-coil-heating-glow`}
            cx={x}
            cy={y}
            rx={64}
            ry={74}
            fill={COLORS.warning}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [heatOpacity * 0.45, heatOpacity, heatOpacity * 0.45],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2 / Math.max(animationSpeed, 0.2),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      <motion.rect
        x={x - bodyWidth / 2}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        rx={9}
        ry={9}
        stroke={COLORS.black}
        strokeWidth={3}
        initial={false}
        animate={{
          fill: values.status === "OFF" ? COLORS.coilBody : COLORS.coilBodyOn,
        }}
        transition={{ duration: 0.25 }}
      />

      <motion.rect
        x={x - bodyWidth / 2 + 5}
        y={bodyTop + 5}
        width={bodyWidth - 10}
        height={bodyHeight - 10}
        rx={7}
        ry={7}
        fill={COLORS.coilCopper}
        initial={false}
        animate={{
          opacity:
            type === "AC" && values.status !== "OFF"
              ? [
                  highlightOpacity * 0.35,
                  highlightOpacity,
                  highlightOpacity * 0.35,
                ]
              : highlightOpacity,
        }}
        transition={{
          duration: 1 / Math.max(animationSpeed, 0.2),
          repeat: type === "AC" && values.status !== "OFF" ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <CoilWinding
        x={x}
        y={y - 5}
        height={62}
        active={values.isPowered}
        type={type}
        strength={values.displayMagneticStrength}
        speed={animationSpeed}
      />

      {type === "AC" ? (
        <motion.path
          d={`
            M ${x - 17} ${y + 35}
            C ${x - 11} ${y + 24}, ${x - 5} ${y + 24}, ${x} ${y + 35}
            S ${x + 11} ${y + 46}, ${x + 17} ${y + 35}
          `}
          stroke={COLORS.acField}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={{
            opacity: values.isPowered ? [0.45, 1, 0.45] : 0.6,
            pathLength: values.isPowered ? [0.4, 1, 0.4] : 1,
          }}
          transition={{
            duration: 1 / Math.max(animationSpeed, 0.2),
            repeat: values.isPowered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ) : (
        showLabels && (
          <g aria-label="DC coil polarity mark">
            <SvgLabel x={x - 23} y={y + 39} size={18} color={COLORS.dcPositive}>
              +
            </SvgLabel>

            <SvgLabel x={x + 23} y={y + 39} size={22} color={COLORS.dcNegative}>
              -
            </SvgLabel>
          </g>
        )
      )}

      <TerminalDot
        x={top.x}
        y={top.y}
        color={wireTopColor}
        active={values.isPowered}
      />

      <TerminalDot
        x={bottom.x}
        y={bottom.y}
        color={wireBottomColor}
        active={values.isPowered}
      />

      {showLabels && type === "DC" && (
        <>
          <SvgLabel
            x={top.x + 18}
            y={top.y + 6}
            size={17}
            anchor="start"
            color={COLORS.dcPositive}
          >
            +
          </SvgLabel>

          <SvgLabel
            x={bottom.x + 18}
            y={bottom.y + 6}
            size={20}
            anchor="start"
            color={COLORS.dcNegative}
          >
            -
          </SvgLabel>
        </>
      )}

      {showLabels && (
        <SvgLabel x={x} y={bottom.y + 31}>
          {type} Coil
        </SvgLabel>
      )}
    </g>
  );
}

function RelayCoilCircuit({
  type,
  x,
  y,
  values,
  settings,
  time,
}: {
  type: CircuitType;
  x: number;
  y: number;
  values: CircuitValues;
  settings: SimulationSettings;
  time: number;
}) {
  const sourceX = x + 95;
  const coilX = x + 620;
  const topY = y + 58;
  const bottomY = y + 210;
  const centerY = (topY + bottomY) / 2;

  const sourceTop: Point = { x: sourceX, y: topY };
  const sourceBottom: Point = { x: sourceX, y: bottomY };
  const coilTop: Point = { x: coilX, y: topY };
  const coilBottom: Point = { x: coilX, y: bottomY };

  const active = values.isPowered && values.current > 0;
  const topWireColor = getWireColor({ type, polarity: "top", active });
  const bottomWireColor = getWireColor({ type, polarity: "bottom", active });
  const wireWidth = getWireWidth(values);

  const electronPath: Point[] =
    type === "DC"
      ? [sourceBottom, coilBottom, coilTop, sourceTop, sourceBottom]
      : [sourceTop, coilTop, coilBottom, sourceBottom, sourceTop];

  const arrowPath: Point[] =
    type === "DC"
      ? [sourceTop, coilTop, coilBottom, sourceBottom, sourceTop]
      : [sourceTop, coilTop, coilBottom, sourceBottom, sourceTop];

  const circuitOpacity = values.isVisible ? 1 : 0.22;

  return (
    <motion.g
      aria-label={`${type} relay coil circuit`}
      initial={false}
      animate={{ opacity: circuitOpacity }}
      transition={{ duration: 0.25 }}
    >
      {settings.showLabels && (
        <SvgLabel x={(sourceX + coilX) / 2} y={y + 22} size={18}>
          {type} Relay Coil Circuit
        </SvgLabel>
      )}

      <WireLine
        from={sourceTop}
        to={coilTop}
        color={topWireColor}
        width={wireWidth}
      />

      <WireLine
        from={coilBottom}
        to={sourceBottom}
        color={bottomWireColor}
        width={wireWidth}
      />

      <DirectionArrows
        type={type}
        path={arrowPath}
        enabled={
          settings.powerOn &&
          settings.showDirectionArrows &&
          values.isVisible &&
          values.current > 0
        }
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
        speed={settings.animationSpeed}
      />

      <ElectronFlow
        type={type}
        path={electronPath}
        time={time}
        speed={settings.animationSpeed}
        frequency={settings.acFrequency}
        enabled={
          settings.powerOn &&
          settings.showElectronFlow &&
          values.isVisible &&
          values.current > 0
        }
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
      />

      <MagneticFieldLines
        type={type}
        x={coilX}
        y={centerY}
        strength={values.displayMagneticStrength}
        show={settings.showMagneticField && values.isPowered && values.current > 0}
        speed={settings.animationSpeed}
      />

      <MagneticPoleLabels
        type={type}
        x={coilX}
        y={centerY}
        values={values}
        showLabels={settings.showLabels}
      />

      {type === "AC" ? (
        <ACSource
          x={sourceX}
          y={centerY}
          top={sourceTop}
          bottom={sourceBottom}
          liveColor={topWireColor}
          neutralColor={bottomWireColor}
          wireWidth={wireWidth}
          active={active}
          showLabels={settings.showLabels}
          speed={settings.animationSpeed}
        />
      ) : (
        <DCSource
          x={sourceX}
          y={centerY}
          top={sourceTop}
          bottom={sourceBottom}
          positiveColor={topWireColor}
          negativeColor={bottomWireColor}
          wireWidth={wireWidth}
          active={active}
          showLabels={settings.showLabels}
        />
      )}

      <RelayCoil
        x={coilX}
        y={centerY}
        top={coilTop}
        bottom={coilBottom}
        type={type}
        values={values}
        wireTopColor={topWireColor}
        wireBottomColor={bottomWireColor}
        wireWidth={wireWidth}
        animationSpeed={settings.animationSpeed}
        showLabels={settings.showLabels}
      />

      <RelayContactIndicator
        x={coilX + 110}
        y={centerY - 8}
        status={values.status}
        showLabels={settings.showLabels}
      />

      {settings.showLabels && (
        <SvgLabel x={(sourceX + coilX) / 2} y={bottomY + 60} size={14}>
          {values.isPowered ? "ON" : "OFF"} | {values.status} | I ={" "}
          {formatNumber(values.current, 3)} A | P ={" "}
          {formatNumber(values.power, 2)} W
        </SvgLabel>
      )}
    </motion.g>
  );
}

function ColorLegend() {
  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    whiteSpace: "nowrap",
  };

  const boxStyle = (color: string, dashed = false): React.CSSProperties => ({
    width: 30,
    height: 0,
    borderTop: `4px ${dashed ? "dashed" : "solid"} ${color}`,
  });

  const legendStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 16px",
    border: "1px solid #000",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    background: COLORS.white,
  };

  return (
    <div style={legendStyle} aria-label="color legend">
      <div style={itemStyle}>
        <span style={boxStyle(COLORS.dcPositive)} /> Red = DC positive / active
        wire
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.dcNegative)} /> Black/gray = DC negative
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acLive)} /> Brown = AC live
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acNeutral)} /> Blue = AC neutral
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.coilCopper)} /> Copper = relay coil winding
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acField, true)} /> Blue/Purple dashed =
        magnetic field
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.warning)} /> Orange glow = coil heating warning
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CoilStatus }) {
  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "3px 8px",
    border: "1px solid #000",
    borderRadius: 999,
    background:
      status === "Energized"
        ? "#e5eefc"
        : status === "Weak"
          ? "#fff4df"
          : "#f2f2f2",
    fontWeight: 700,
    fontSize: 12,
  };

  return <span style={badgeStyle}>{status}</span>;
}

function StatusPanel({
  settings,
  acValues,
  dcValues,
}: {
  settings: SimulationSettings;
  acValues: CircuitValues;
  dcValues: CircuitValues;
}) {
  const panelStyle: React.CSSProperties = {
    border: "1px solid #000",
    borderRadius: 8,
    padding: 12,
    background: COLORS.white,
    boxSizing: "border-box",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  };

  const cellStyle: React.CSSProperties = {
    borderTop: "1px solid #ddd",
    padding: "7px 4px",
    textAlign: "left",
    verticalAlign: "middle",
  };

  const warningMessages = [
    acValues.highCurrentWarning ? "AC High current: coil may overheat" : "",
    dcValues.highCurrentWarning ? "DC High current: coil may overheat" : "",
  ].filter(Boolean);

  const rows: Array<{
    label: string;
    value: React.ReactNode;
  }> = [
    {
      label: "Main power",
      value: settings.powerOn ? "ON" : "OFF",
    },
    {
      label: "Circuit selected",
      value: settings.circuitMode,
    },
    {
      label: "AC voltage",
      value: `${formatNumber(acValues.voltage, 1)} V RMS`,
    },
    {
      label: "DC voltage",
      value: `${formatNumber(dcValues.voltage, 1)} V`,
    },
    {
      label: "Resistance",
      value: `${formatNumber(settings.resistance, 0)} Ω`,
    },
    {
      label: "AC current",
      value: `${formatNumber(acValues.current, 3)} A`,
    },
    {
      label: "DC current",
      value: `${formatNumber(dcValues.current, 3)} A`,
    },
    {
      label: "AC power",
      value: `${formatNumber(acValues.power, 2)} W`,
    },
    {
      label: "DC power",
      value: `${formatNumber(dcValues.power, 2)} W`,
    },
    {
      label: "AC magnetic strength",
      value: `${formatNumber(acValues.displayMagneticStrength * 100, 0)}%`,
    },
    {
      label: "DC magnetic strength",
      value: `${formatNumber(dcValues.displayMagneticStrength * 100, 0)}%`,
    },
    {
      label: "AC coil status",
      value: <StatusBadge status={acValues.status} />,
    },
    {
      label: "DC coil status",
      value: <StatusBadge status={dcValues.status} />,
    },
    {
      label: "Current threshold",
      value: `${formatNumber(CURRENT_THRESHOLD, 2)} A`,
    },
  ];

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>Live Status</h3>

      <table style={tableStyle}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td style={cellStyle}>{row.label}</td>
              <td style={cellStyle}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {warningMessages.length > 0 && (
          <motion.div
            key="high-current-warning"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 10,
              padding: 9,
              border: `1px solid ${COLORS.warning}`,
              borderRadius: 6,
              color: COLORS.warning,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {warningMessages.map((message) => (
              <div key={message}>{message}</div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlPanel({
  settings,
  onChange,
  onReset,
}: {
  settings: SimulationSettings;
  onChange: (nextSettings: SimulationSettings) => void;
  onReset: () => void;
}) {
  const updateSetting = <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const panelStyle: React.CSSProperties = {
    border: "1px solid #000",
    borderRadius: 8,
    padding: 16,
    background: COLORS.white,
    boxSizing: "border-box",
  };

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
  };

  const switchButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #000",
    borderRadius: 6,
    background: settings.powerOn ? COLORS.coilBodyOn : COLORS.white,
    color: COLORS.black,
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: "0 0 14px", fontSize: 18 }}>Control Panel</h3>

      <div style={rowStyle}>
        <button
          type="button"
          style={switchButtonStyle}
          onClick={() => updateSetting("powerOn", !settings.powerOn)}
        >
          Power: {settings.powerOn ? "ON" : "OFF"}
        </button>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="circuitMode">
          Circuit Selector
        </label>

        <select
          id="circuitMode"
          value={settings.circuitMode}
          style={{ ...inputStyle, padding: 7 }}
          onChange={(event) =>
            updateSetting("circuitMode", event.target.value as CircuitMode)
          }
        >
          <option value="AC">AC</option>
          <option value="DC">DC</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="acVoltage">
          AC Voltage: {settings.acVoltage} V
        </label>

        <input
          id="acVoltage"
          type="range"
          min={0}
          max={240}
          step={1}
          value={settings.acVoltage}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("acVoltage", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="dcVoltage">
          DC Voltage: {settings.dcVoltage} V
        </label>

        <input
          id="dcVoltage"
          type="range"
          min={0}
          max={24}
          step={1}
          value={settings.dcVoltage}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("dcVoltage", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="resistance">
          Coil Resistance: {settings.resistance} Ω
        </label>

        <input
          id="resistance"
          type="range"
          min={10}
          max={1000}
          step={10}
          value={settings.resistance}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("resistance", Number(event.target.value))
          }
        />

        <input
          aria-label="Coil resistance input"
          type="number"
          min={1}
          max={5000}
          step={1}
          value={settings.resistance}
          style={{ ...inputStyle, padding: 7 }}
          onChange={(event) => {
            const value = clamp(Number(event.target.value), 1, 5000);
            updateSetting("resistance", value);
          }}
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="acFrequency">
          AC Frequency: {settings.acFrequency} Hz
        </label>

        <input
          id="acFrequency"
          type="range"
          min={1}
          max={60}
          step={1}
          value={settings.acFrequency}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("acFrequency", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="animationSpeed">
          Animation Speed: {settings.animationSpeed.toFixed(1)}x
        </label>

        <input
          id="animationSpeed"
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={settings.animationSpeed}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("animationSpeed", Number(event.target.value))
          }
        />
      </div>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showElectronFlow}
          onChange={(event) =>
            updateSetting("showElectronFlow", event.target.checked)
          }
        />{" "}
        Show electron flow
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showMagneticField}
          onChange={(event) =>
            updateSetting("showMagneticField", event.target.checked)
          }
        />{" "}
        Show magnetic field
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showLabels}
          onChange={(event) => updateSetting("showLabels", event.target.checked)}
        />{" "}
        Show labels
      </label>

      <label style={{ display: "block", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={settings.showDirectionArrows}
          onChange={(event) =>
            updateSetting("showDirectionArrows", event.target.checked)
          }
        />{" "}
        Show direction arrows
      </label>

      <button
        type="button"
        onClick={onReset}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid #000",
          borderRadius: 6,
          background: COLORS.white,
          color: COLORS.black,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}

export function RelaySimulation() {
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const time = useMotionClock();

  const acValues = useMemo(
    () => getCircuitValues({ type: "AC", settings, time }),
    [settings, time]
  );

  const dcValues = useMemo(
    () => getCircuitValues({ type: "DC", settings, time }),
    [settings, time]
  );

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 16,
    background: COLORS.white,
    color: COLORS.black,
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-start",
  };

  const svgAreaStyle: React.CSSProperties = {
    flex: "2 1 630px",
    minWidth: 300,
    boxSizing: "border-box",
  };

  const svgCardStyle: React.CSSProperties = {
    border: "1px solid #000",
    borderRadius: 8,
    padding: 10,
    background: COLORS.white,
    boxSizing: "border-box",
  };

  const svgStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 1000,
    minWidth: 280,
    height: "auto",
    display: "block",
    margin: "0 auto",
  };

  const sidePanelStyle: React.CSSProperties = {
    flex: "1 1 320px",
    minWidth: 280,
    display: "grid",
    gap: 16,
  };

  return (
    <div style={wrapperStyle}>
      <div style={layoutStyle}>
        <div style={svgAreaStyle}>
          <div style={svgCardStyle}>
            <svg
              viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
              style={svgStyle}
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Interactive Motion animated AC and DC relay coil simulation"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                x={VIEW_BOX.x + 8}
                y={VIEW_BOX.y + 8}
                width={VIEW_BOX.width - 16}
                height={VIEW_BOX.height - 16}
                rx={10}
                ry={10}
                fill={COLORS.white}
                stroke={COLORS.black}
                strokeWidth={1.5}
              />

              <RelayCoilCircuit
                type="AC"
                x={65}
                y={35}
                values={acValues}
                settings={settings}
                time={time}
              />

              <line
                x1={55}
                y1={292}
                x2={945}
                y2={292}
                stroke={COLORS.black}
                strokeWidth={1}
                strokeDasharray="6 8"
                opacity={0.35}
              />

              <RelayCoilCircuit
                type="DC"
                x={65}
                y={310}
                values={dcValues}
                settings={settings}
                time={time}
              />
            </svg>
          </div>

          <ColorLegend />
        </div>

        <div style={sidePanelStyle}>
          <ControlPanel
            settings={settings}
            onChange={setSettings}
            onReset={() => setSettings(defaultSettings)}
          />

          <StatusPanel
            settings={settings}
            acValues={acValues}
            dcValues={dcValues}
          />
        </div>
      </div>
    </div>
  );
}

export default function RelayInteractiveSimulation() {
  return <RelaySimulation />;
}