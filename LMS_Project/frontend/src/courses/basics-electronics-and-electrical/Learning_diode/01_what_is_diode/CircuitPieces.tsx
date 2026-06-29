"use client";

import {
  BatterySymbol as LibraryBatterySymbol,
  DiodeSymbol as LibraryDiodeSymbol,
  LEDSymbol as LibraryLedSymbol,
} from "@/src/library";
import { motion } from "framer-motion";

import type { BiasMode } from "./types";

const LED_VISUAL_OFFSET_X = 10;
const BATTERY_CENTER = { x: 90, y: 149 };
const DIODE_CENTER = { x: 325.5, y: 70.5 };
const LED_CENTER = { x: 654.5, y: 143.5 };

export const batteryLayout = {
  x: 50,
  y: 109,
  width: 80,
  height: 80,
  topTerminal: { x: 90.5, y: 119.5 },
  bottomTerminal: { x: 90.5, y: 169.5 },
} as const;

export const diodeLayout = {
  x: 290,
  y: 50,
  width: 71,
  height: 41,
  leftTerminal: { x: 300, y: 70 },
  rightTerminal: { x: 350, y: 70 },
} as const;

export const ledLayout = {
  x: 609,
  y: 118,
  width: 71,
  height: 51,
  // Shared LEDSymbol is rotated 90 degrees in the lesson, so these terminal
  // points match the rotated lead ends instead of the unrotated source viewBox.
  topTerminal: { x: 649.5, y: 118.5 },
  bottomTerminal: { x: 649.5, y: 168.5 },
} as const;

const LED_VISUAL_CENTER_X = LED_CENTER.x;
const LED_VISUAL_CENTER_Y = LED_CENTER.y;

function scalePoint(
  point: { x: number; y: number },
  center: { x: number; y: number },
  scale: number,
) {
  return {
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  };
}

export function getScaledBatteryLayout(scale = 1) {
  return {
    ...batteryLayout,
    x: BATTERY_CENTER.x + (batteryLayout.x - BATTERY_CENTER.x) * scale,
    y: BATTERY_CENTER.y + (batteryLayout.y - BATTERY_CENTER.y) * scale,
    width: batteryLayout.width * scale,
    height: batteryLayout.height * scale,
    topTerminal: scalePoint(batteryLayout.topTerminal, BATTERY_CENTER, scale),
    bottomTerminal: scalePoint(
      batteryLayout.bottomTerminal,
      BATTERY_CENTER,
      scale,
    ),
  };
}

export function getScaledDiodeLayout(scale = 1) {
  return {
    ...diodeLayout,
    x: DIODE_CENTER.x + (diodeLayout.x - DIODE_CENTER.x) * scale,
    y: DIODE_CENTER.y + (diodeLayout.y - DIODE_CENTER.y) * scale,
    width: diodeLayout.width * scale,
    height: diodeLayout.height * scale,
    leftTerminal: scalePoint(diodeLayout.leftTerminal, DIODE_CENTER, scale),
    rightTerminal: scalePoint(diodeLayout.rightTerminal, DIODE_CENTER, scale),
  };
}

export function getScaledLedLayout(scale = 1) {
  return {
    ...ledLayout,
    x: LED_CENTER.x + (ledLayout.x - LED_CENTER.x) * scale,
    y: LED_CENTER.y + (ledLayout.y - LED_CENTER.y) * scale,
    width: ledLayout.width * scale,
    height: ledLayout.height * scale,
    topTerminal: scalePoint(ledLayout.topTerminal, LED_CENTER, scale),
    bottomTerminal: scalePoint(ledLayout.bottomTerminal, LED_CENTER, scale),
  };
}

export function JunctionDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="5" fill="#374151" />;
}

export function BatterySymbol({
  bias,
  voltage,
  scale = 1,
}: {
  bias: BiasMode;
  voltage: number;
  scale?: number;
}) {
  const isForward = bias === "forward";
  const scaledLayout = getScaledBatteryLayout(scale);

  return (
    <g>
      <g
        transform={
          isForward
            ? `translate(${scaledLayout.x} ${scaledLayout.y})`
            : `translate(${scaledLayout.x + scaledLayout.width} ${scaledLayout.y + scaledLayout.height}) rotate(180)`
        }
      >
        <LibraryBatterySymbol
          width={scaledLayout.width}
          height={scaledLayout.height}
          label="Shared battery symbol"
        />
      </g>

      <text
        x="90"
        y="103"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill={isForward ? "#dc2626" : "#111827"}
      >
        {isForward ? "+" : "-"}
      </text>
      <text
        x="90"
        y="199"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill={isForward ? "#111827" : "#dc2626"}
      >
        {isForward ? "-" : "+"}
      </text>
      <text x="133" y="150" fontSize="15" fontWeight="800" fill="#334155">
        {voltage.toFixed(1)}V
      </text>
    </g>
  );
}

export function DiodeSymbol() {
  return <ScaledDiodeSymbol scale={1} />;
}

export function ScaledDiodeSymbol({ scale = 1 }: { scale?: number }) {
  const scaledLayout = getScaledDiodeLayout(scale);

  return (
    <g>
      <g transform={`translate(${scaledLayout.x} ${scaledLayout.y})`}>
        <LibraryDiodeSymbol
          width={scaledLayout.width}
          height={scaledLayout.height}
          label="Shared diode symbol"
        />
      </g>
      <text x="280" y="72" fontSize="18" fontWeight="700" fill="#dc2626">
        +
      </text>
      <text x="360" y="72" fontSize="18" fontWeight="700" fill="#111827">
        -
      </text>

      <rect
        x="304"
        y="100"
        width="72"
        height="22"
        rx="6"
        fill="#fff7ed"
        stroke="#f97316"
        strokeWidth="1.5"
      />
      <text
        x="340"
        y="115"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#c2410c"
      >
        ~0.7V drop
      </text>
    </g>
  );
}

export function LedSymbol({
  active,
  brightness,
  scale = 1,
}: {
  active: boolean;
  brightness: number;
  scale?: number;
}) {
  const scaledLayout = getScaledLedLayout(scale);
  const scaledCenter = scalePoint(
    { x: LED_VISUAL_CENTER_X, y: LED_VISUAL_CENTER_Y },
    LED_CENTER,
    scale,
  );
  const glowOpacity = 0.12 + brightness * 0.2;
  const outerGlowRadius = 34 + brightness * 16;
  const innerGlowRadius = 18 + brightness * 10;

  return (
    <g>
      <defs>
        <radialGradient id="diode-lesson-led-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#facc15" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
      </defs>

      {active && (
        <g>
          <motion.circle
            cx={scaledCenter.x}
            cy={scaledCenter.y}
            r={outerGlowRadius * scale}
            fill="url(#diode-lesson-led-glow)"
            opacity={glowOpacity}
            animate={{
              r: [
                (outerGlowRadius - 5) * scale,
                (outerGlowRadius + 5) * scale,
                (outerGlowRadius - 5) * scale,
              ],
              opacity: [glowOpacity * 0.72, glowOpacity, glowOpacity * 0.72],
            }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
          <motion.circle
            cx={scaledCenter.x}
            cy={scaledCenter.y}
            r={innerGlowRadius * scale}
            fill="#fde68a"
            opacity={0.16 + brightness * 0.14}
            animate={{
              r: [
                (innerGlowRadius - 2) * scale,
                (innerGlowRadius + 2) * scale,
                (innerGlowRadius - 2) * scale,
              ],
              opacity: [
                0.14 + brightness * 0.12,
                0.2 + brightness * 0.14,
                0.14 + brightness * 0.12,
              ],
            }}
            transition={{ repeat: Infinity, duration: 0.95 }}
          />
        </g>
      )}

      <g
        transform={`translate(${scaledLayout.x + LED_VISUAL_OFFSET_X * scale} ${scaledLayout.y}) rotate(90 ${scaledLayout.width / 2} ${scaledLayout.height / 2})`}
      >
        <LibraryLedSymbol
          width={scaledLayout.width}
          height={scaledLayout.height}
          label="Shared LED symbol"
        />
      </g>

      <text
        x={590 + LED_VISUAL_OFFSET_X}
        y="278"
        fontSize="15"
        fontWeight="700"
        fill={active ? "#16a34a" : "#64748b"}
      >
        {active ? `LED ON ${(brightness * 100).toFixed(0)}%` : "LED OFF"}
      </text>
    </g>
  );
}
