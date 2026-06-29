// ACCircuit.tsx
// AC source + AC relay coil circuit SVG components.
// This file depends on RelayLogic.ts and Motion.
//
// Required install:
// npm install motion

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  clamp,
  COLORS,
  CURRENT_THRESHOLD,
  formatNumber,
  getPointOnPath,
  getWireColor,
  getWireWidth,
  TERMINAL_DOT_RADIUS,
  type CircuitValues,
  type Point,
  type SimulationSettings,
} from "./RelayLogic";

type WireLineProps = {
  from: Point;
  to: Point;
  color: string;
  width: number;
  opacity?: number;
  dashed?: boolean;
};

type ACCircuitProps = {
  values: CircuitValues;
  settings: SimulationSettings;
  time: number;
  x?: number;
  y?: number;
};

function WireLine({
  from,
  to,
  color,
  width,
  opacity = 1,
  dashed = false,
}: WireLineProps) {
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
        r: active
          ? [
              TERMINAL_DOT_RADIUS,
              TERMINAL_DOT_RADIUS + 1.8,
              TERMINAL_DOT_RADIUS,
            ]
          : TERMINAL_DOT_RADIUS,
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
      fontFamily="Arial, Helvetica, sans-serif"
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
  id,
  path,
  time,
  speed,
  frequency,
  enabled,
  strength,
  instantDirection,
}: {
  id: string;
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
          key={`ac-electron-flow-${id}`}
          aria-label="AC electron flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {Array.from({ length: 14 }).map((_, index) => {
            const baseProgress = index / 14;
            const visibleFrequency = 0.75 + frequency / 40;
            const progress =
              baseProgress +
              Math.sin(time * speed * visibleFrequency * Math.PI * 2) * 0.12;
            const finalProgress =
              instantDirection > 0 ? progress : 1 - progress;
            const point = getPointOnPath(path, finalProgress);
            const opacity = clamp(0.25 + strength * 0.75, 0.2, 1);

            return (
              <ElectronDot
                key={`ac-electron-${id}-${index}`}
                point={point}
                color={COLORS.electronAC}
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
  id,
  path,
  enabled,
  strength,
  instantDirection,
  speed,
}: {
  id: string;
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
          key={`ac-direction-arrows-${id}`}
          aria-label="AC direction arrows"
          initial={{ opacity: 0 }}
          animate={{ opacity: clamp(0.35 + strength * 0.55, 0.35, 0.9) }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {[0.16, 0.39, 0.62, 0.85].map((progress, index) => {
            const arrowProgress =
              instantDirection < 0 ? 1 - progress : progress;
            const point = getPointOnPath(path, arrowProgress);
            const nextPoint = getPointOnPath(
              path,
              instantDirection > 0
                ? arrowProgress + 0.015
                : arrowProgress - 0.015,
            );

            const angle =
              Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
              (180 / Math.PI);

            return (
              <motion.g
                key={`ac-arrow-${id}-${index}`}
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
                  stroke={COLORS.electronAC}
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

function createEllipseLoopPath(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
) {
  return [
    `M ${centerX - radiusX} ${centerY}`,
    `a ${radiusX} ${radiusY} 0 1 0 ${radiusX * 2} 0`,
    `a ${radiusX} ${radiusY} 0 1 0 ${-radiusX * 2} 0`,
  ].join(" ");
}

function FieldFlowDots({
  path,
  color,
  count,
  duration,
  radius,
  opacity,
}: {
  path: string;
  color: string;
  count: number;
  duration: number;
  radius: number;
  opacity: number;
}) {
  return (
    <g aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={`${path}-${index}`}
          r={radius}
          fill={color}
          opacity={opacity}
        >
          <animateMotion
            dur={`${duration}s`}
            begin={`${(duration / count) * index}s`}
            repeatCount="indefinite"
            rotate="auto"
            path={path}
          />
        </circle>
      ))}
    </g>
  );
}

function MagneticFieldLines({
  x,
  y,
  strength,
  show,
  speed,
}: {
  x: number;
  y: number;
  strength: number;
  show: boolean;
  speed: number;
}) {
  const safeStrength = clamp(strength, 0, 1);
  const ringOpacity = clamp(0.12 + safeStrength * 0.24, 0.1, 0.34);
  const strokeWidth = 1.4 + safeStrength * 1.3;
  const radiusX = 92 + safeStrength * 18;
  const radiusY = 72 + safeStrength * 16;
  const bandCount = 6;
  const ringGap = 11;
  const outerFlowPath = createEllipseLoopPath(x, y, radiusX - 12, radiusY - 8);
  const innerFlowPath = createEllipseLoopPath(x, y, radiusX - 38, radiusY - 28);

  return (
    <AnimatePresence>
      {show && safeStrength > 0.03 && (
        <motion.g
          key="ac-magnetic-field"
          aria-label="AC magnetic field lines"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {Array.from({ length: bandCount }).map((_, index) => (
            <motion.ellipse
              key={`ac-field-line-${index}`}
              cx={x}
              cy={y}
              rx={radiusX - index * ringGap}
              ry={radiusY - index * (ringGap - 2)}
              fill="none"
              stroke={COLORS.acField}
              strokeLinecap="round"
              strokeDasharray="10 10"
              initial={false}
              animate={{
                opacity: [ringOpacity, ringOpacity + 0.08, ringOpacity],
                strokeWidth: [
                  strokeWidth * 0.8,
                  strokeWidth,
                  strokeWidth * 0.8,
                ],
              }}
              transition={{
                duration: 1.15 / Math.max(speed, 0.2),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.06,
              }}
            />
          ))}

          <motion.ellipse
            cx={x}
            cy={y}
            rx={radiusX - 42}
            ry={radiusY - 30}
            fill="#93c5fd"
            initial={false}
            animate={{
              opacity: [
                0.08 + safeStrength * 0.06,
                0.16 + safeStrength * 0.08,
                0.08 + safeStrength * 0.06,
              ],
            }}
            transition={{
              duration: 1.2 / Math.max(speed, 0.2),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <FieldFlowDots
            path={outerFlowPath}
            color="#60a5fa"
            count={3}
            duration={Math.max(1.4, 4.4 / Math.max(speed, 0.2))}
            radius={3}
            opacity={0.72}
          />

          <FieldFlowDots
            path={innerFlowPath}
            color="#38bdf8"
            count={2}
            duration={Math.max(1.2, 3.4 / Math.max(speed, 0.2))}
            radius={2.6}
            opacity={0.64}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function MagneticPoleLabels({
  x,
  y,
  values,
  showLabels,
}: {
  x: number;
  y: number;
  values: CircuitValues;
  showLabels: boolean;
}) {
  if (!showLabels || values.status === "OFF") return null;

  const leftPole = values.instantDirection < 0 ? "S" : "N";
  const rightPole = values.instantDirection < 0 ? "N" : "S";
  const opacity = clamp(0.35 + values.displayMagneticStrength * 0.65, 0.35, 1);

  return (
    <motion.g
      aria-label="AC magnetic pole labels"
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.2 }}
    >
      <SvgLabel x={x - 68} y={y - 58} size={16} color={COLORS.acField}>
        {leftPole}
      </SvgLabel>

      <SvgLabel x={x + 68} y={y - 58} size={16} color={COLORS.acField}>
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
      <TerminalDot
        x={bottom.x}
        y={bottom.y}
        color={neutralColor}
        active={active}
      />

      {showLabels && (
        <SvgLabel x={x} y={bottom.y + 31}>
          AC Source
        </SvgLabel>
      )}
    </g>
  );
}

function CoilWinding({
  x,
  y,
  height,
  active,
  strength,
  speed,
}: {
  x: number;
  y: number;
  height: number;
  active: boolean;
  strength: number;
  speed: number;
}) {
  const startY = y - height / 2;
  const loopHeight = height / 4;
  const left = x - 17;
  const right = x + 17;

  return (
    <g aria-label="AC coil winding">
      {[0, 1, 2, 3].map((index) => {
        const y1 = startY + index * loopHeight;
        const yMid = y1 + loopHeight / 2;
        const y2 = y1 + loopHeight;

        return (
          <motion.path
            key={`ac-coil-winding-${index}`}
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
              opacity: active ? [0.62, 1, 0.62] : 0.55,
            }}
            transition={{
              duration: 0.9 / Math.max(speed, 0.2),
              repeat: active ? Infinity : 0,
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
  status: CircuitValues["status"];
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
    <g aria-label="AC relay contact and armature indicator">
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
    <g aria-label="AC relay coil">
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
            key="ac-coil-heating-glow"
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
            values.status !== "OFF"
              ? [
                  highlightOpacity * 0.35,
                  highlightOpacity,
                  highlightOpacity * 0.35,
                ]
              : 0,
        }}
        transition={{
          duration: 1 / Math.max(animationSpeed, 0.2),
          repeat: values.status !== "OFF" ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <CoilWinding
        x={x}
        y={y - 5}
        height={62}
        active={values.isPowered}
        strength={values.displayMagneticStrength}
        speed={animationSpeed}
      />

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

      {showLabels && (
        <SvgLabel x={x} y={bottom.y + 31}>
          AC Coil
        </SvgLabel>
      )}
    </g>
  );
}

export function ACCircuit({
  values,
  settings,
  time,
  x = 65,
  y = 35,
}: ACCircuitProps) {
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
  const topWireColor = getWireColor({ type: "AC", polarity: "top", active });
  const bottomWireColor = getWireColor({
    type: "AC",
    polarity: "bottom",
    active,
  });
  const wireWidth = getWireWidth(values);
  const topWirePath: Point[] = [sourceTop, coilTop];
  const bottomWirePath: Point[] = [coilBottom, sourceBottom];
  const showAcWireFlow =
    settings.powerOn &&
    values.isVisible &&
    settings.showElectronFlow &&
    values.voltage > 0 &&
    values.current > 0;
  const showAcArrowFlow =
    settings.powerOn &&
    values.isVisible &&
    settings.showDirectionArrows &&
    values.voltage > 0 &&
    values.current > 0;

  return (
    <motion.g
      aria-label="AC relay coil circuit"
      initial={false}
      animate={{ opacity: values.isVisible ? 1 : 0.22 }}
      transition={{ duration: 0.25 }}
    >
      {settings.showLabels && (
        <SvgLabel x={(sourceX + coilX) / 2} y={y + 22} size={18}>
          AC Relay Coil Circuit
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
        id="top"
        path={topWirePath}
        enabled={showAcArrowFlow}
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
        speed={settings.animationSpeed}
      />

      <DirectionArrows
        id="bottom"
        path={bottomWirePath}
        enabled={showAcArrowFlow}
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
        speed={settings.animationSpeed}
      />

      <ElectronFlow
        id="top"
        path={topWirePath}
        time={time}
        speed={settings.animationSpeed}
        frequency={settings.acFrequency}
        enabled={showAcWireFlow}
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
      />

      <ElectronFlow
        id="bottom"
        path={bottomWirePath}
        time={time}
        speed={settings.animationSpeed}
        frequency={settings.acFrequency}
        enabled={showAcWireFlow}
        strength={values.magneticStrength}
        instantDirection={values.instantDirection}
      />

      <MagneticFieldLines
        x={coilX}
        y={centerY}
        strength={values.displayMagneticStrength}
        show={
          settings.showMagneticField && values.isPowered && values.current > 0
        }
        speed={settings.animationSpeed}
      />

      <MagneticPoleLabels
        x={coilX}
        y={centerY}
        values={values}
        showLabels={settings.showLabels}
      />

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

      <RelayCoil
        x={coilX}
        y={centerY}
        top={coilTop}
        bottom={coilBottom}
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
          {formatNumber(values.power, 2)} W | Threshold ={" "}
          {formatNumber(CURRENT_THRESHOLD, 2)} A
        </SvgLabel>
      )}
    </motion.g>
  );
}

export default ACCircuit;
