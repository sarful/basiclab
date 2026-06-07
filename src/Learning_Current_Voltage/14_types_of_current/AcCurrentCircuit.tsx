"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import ACVoltageSourceSymbol from "../../library/electronics-symbol-library/sources/ACVoltageSourceSymbol";
import { SVG_HEIGHT, SVG_WIDTH, createSinePath } from "./logic";
import { GraphBase } from "./ui";

export function AcCurrentCircuit({
  peakCurrent,
  frequency,
  isPlaying,
}: {
  peakCurrent: number;
  frequency: number;
  isPlaying: boolean;
}) {
  const duration = Math.max(0.55, 2.2 - frequency / 2);
  const glowOpacity = peakCurrent < 0.8 ? 0.2 : peakCurrent < 2.5 ? 0.55 : 0.88;

  const sourceX = 82;
  const sourceY = 76;
  const sourceWidth = 52;
  const sourceHeight = 92;
  const sourceTerminalX = sourceX + sourceWidth / 2;
  const sourceTopTerminalY = sourceY + 8;
  const sourceBottomTerminalY = sourceY + sourceHeight - 8;

  const resistorX = 292;
  const resistorY = 58;
  const resistorWidth = 92;
  const resistorHeight = 46;
  const resistorTerminalY = resistorY + resistorHeight / 2;
  const resistorTerminal1X = resistorX + 8;
  const resistorTerminal2X = resistorX + resistorWidth - 8;

  const ledX = 424;
  const ledY = 100;
  const ledWidth = 76;
  const ledHeight = 62;
  const ledViewBoxWidth = 71;
  const ledViewBoxHeight = 51;
  const ledViewBoxMinX = -10;
  const ledViewBoxMinY = -10;
  const ledRotationCenterX = ledWidth / 2;
  const ledRotationCenterY = ledHeight / 2;
  const ledLeftTerminalX = ((0 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledRightTerminalX = ((50 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledTerminalY = ((19.992 - ledViewBoxMinY) / ledViewBoxHeight) * ledHeight;
  const ledBranchX = ledX + (ledRotationCenterX - (ledTerminalY - ledRotationCenterY));
  const ledTopTerminalY =
    ledY + (ledRotationCenterY + (ledLeftTerminalX - ledRotationCenterX));
  const ledBottomTerminalY =
    ledY + (ledRotationCenterY + (ledRightTerminalX - ledRotationCenterX));

  const topWireY = resistorTerminalY;
  const bottomRailY = 188;
  const wireStroke = 2.4;

  const topWireColor = "#2563eb";
  const returnWireColor = "#111827";

  const flowPath = [
    { x: sourceTerminalX, y: sourceTopTerminalY },
    { x: sourceTerminalX, y: topWireY },
    { x: resistorTerminal1X, y: topWireY },
    { x: resistorTerminal2X, y: topWireY },
    { x: ledBranchX, y: topWireY },
    { x: ledBranchX, y: ledBottomTerminalY },
    { x: ledBranchX, y: bottomRailY },
    { x: sourceTerminalX, y: bottomRailY },
    { x: sourceTerminalX, y: sourceBottomTerminalY },
  ]
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 520 220"
      className="h-56 w-full"
      role="img"
      aria-label="AC current circuit"
    >
      <defs>
        <filter id="acLedGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text x="42" y="124" fontSize="16" fontWeight="700" fill="#1d4ed8">
        AC
      </text>
      <text x="42" y="144" fontSize="16" fontWeight="700" fill="#1d4ed8">
        Current
      </text>

      <svg
        x={sourceX}
        y={sourceY}
        width={sourceWidth}
        height={sourceHeight}
        viewBox={`0 0 ${sourceWidth} ${sourceHeight}`}
        overflow="visible"
      >
        <ACVoltageSourceSymbol
          width={sourceWidth}
          height={sourceHeight}
          label="AC source"
        />
      </svg>

      <text
        x={sourceTerminalX}
        y={sourceY - 10}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#1d4ed8"
      >
        AC Source
      </text>

      <path
        d={`M ${sourceTerminalX} ${sourceTopTerminalY} L ${sourceTerminalX} ${topWireY} L ${resistorTerminal1X} ${topWireY}`}
        fill="none"
        stroke={topWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`M ${resistorTerminal2X} ${topWireY} L ${ledBranchX} ${topWireY} L ${ledBranchX} ${ledTopTerminalY}`}
        fill="none"
        stroke={topWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`M ${ledBranchX} ${ledBottomTerminalY} L ${ledBranchX} ${bottomRailY} L ${sourceTerminalX} ${bottomRailY}`}
        fill="none"
        stroke={returnWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`M ${sourceTerminalX} ${bottomRailY} L ${sourceTerminalX} ${sourceBottomTerminalY}`}
        fill="none"
        stroke={returnWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
      />

      {[
        { x: sourceTerminalX, y: sourceTopTerminalY },
        { x: sourceTerminalX, y: topWireY },
        { x: resistorTerminal1X, y: topWireY },
        { x: resistorTerminal2X, y: topWireY },
        { x: ledBranchX, y: topWireY },
        { x: ledBranchX, y: ledBottomTerminalY },
        { x: ledBranchX, y: bottomRailY },
        { x: sourceTerminalX, y: bottomRailY },
        { x: sourceTerminalX, y: sourceBottomTerminalY },
      ].map((point, index) => (
        <circle
          key={`ac-node-${index}`}
          cx={point.x}
          cy={point.y}
          r="2.4"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="1.1"
        />
      ))}

      <svg
        x={resistorX}
        y={resistorY}
        width={resistorWidth}
        height={resistorHeight}
        viewBox={`0 0 ${resistorWidth} ${resistorHeight}`}
        overflow="visible"
      >
        <ResistorSymbol
          width={resistorWidth}
          height={resistorHeight}
          label="Series resistor"
        />
      </svg>

      <text
        x={resistorX + resistorWidth / 2}
        y={resistorY - 30}
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#111827"
      >
        RESISTOR
      </text>

      <svg
        x={ledX}
        y={ledY}
        width={ledWidth}
        height={ledHeight}
        viewBox={`0 0 ${ledWidth} ${ledHeight}`}
        overflow="visible"
        style={{ filter: peakCurrent > 0.25 ? "url(#acLedGlow)" : "none" }}
      >
        <g
          transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}
        >
          <LEDSymbol
            width={ledWidth}
            height={ledHeight}
            label="AC indicator LED"
          />
        </g>
      </svg>

      <motion.circle
        cx={ledBranchX}
        cy={(ledTopTerminalY + ledBottomTerminalY) / 2}
        r="12"
        fill="#bfdbfe"
        animate={{
          opacity: isPlaying
            ? [glowOpacity * 0.25, glowOpacity, glowOpacity * 0.25]
            : glowOpacity * 0.45,
        }}
        transition={{
          duration: Math.max(0.4, 1 / frequency),
          repeat: Infinity,
        }}
      />

      <text
        x={ledBranchX}
        y={ledY - 10}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#1d4ed8"
      >
        LED
      </text>

      {[0, 1, 2, 3].map((dot) => (
        <motion.circle
          key={dot}
          r="6"
          fill="#2563eb"
          animate={
            isPlaying ? { opacity: [0, 1, 1, 0.9, 1, 1, 0] } : { opacity: 0.4 }
          }
          transition={{
            duration,
            repeat: Infinity,
            delay: dot * 0.3,
            ease: "easeInOut",
          }}
        >
          {isPlaying && (
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${dot * 0.3}s`}
              path={flowPath}
            />
          )}
        </motion.circle>
      ))}

      <text x="196" y="68" fontSize="12" fontWeight="700" fill="#1d4ed8">
        Direction changes {"<->"}
      </text>

      <text x="356" y="204" fontSize="12" fontWeight="700" fill="#1d4ed8">
        Peak: {peakCurrent.toFixed(2)}A
      </text>
    </svg>
  );
}

export function AcCurrentWaveform({
  peakCurrent,
  frequency,
}: {
  peakCurrent: number;
  frequency: number;
}) {
  const path = createSinePath(peakCurrent, frequency, 18);

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="h-56 w-full"
      role="img"
      aria-label="AC current waveform"
    >
      <GraphBase title="AC Current Waveform" />
      <path
        d={path}
        stroke="#2563eb"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <text x="74" y="48" fontSize="12" fontWeight="700" fill="#2563eb">
        Current (I)
      </text>
    </svg>
  );
}
