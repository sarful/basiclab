"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";

export function CircuitSimulation({
  voltage,
  current,
  resistance,
  voltagePercent,
  currentPercent,
  isPlaying,
}: {
  voltage: number;
  current: number;
  resistance: number;
  voltagePercent: number;
  currentPercent: number;
  isPlaying: boolean;
}) {
  const particleDuration = Math.max(0.6, 3 - currentPercent / 45);
  const glowOpacity = current < 0.5 ? 0.25 : current < 2 ? 0.55 : 0.9;

  const batteryX = 86;
  const batteryY = 124;
  const batteryWidth = 118;
  const batteryHeight = 126;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const resistorX = 384;
  const resistorY = 90;
  const resistorWidth = 126;
  const resistorHeight = 68;
  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;
  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;

  const ledX = 598;
  const ledY = 136;
  const ledWidth = 100;
  const ledHeight = 82;
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

  const leftWireX = 148;
  const topRailY = resistorTerminalY;
  const bottomRailY = 276;
  const wireStroke = Number(
    Math.max(
      2.4,
      Math.min(3.1, Math.min(resistorHeight / 26, ledHeight / 24)),
    ).toFixed(2),
  );

  const flowPoints = [
    { x: batteryTerminalX, y: batteryTopTerminalY },
    { x: leftWireX, y: batteryTopTerminalY },
    { x: leftWireX, y: topRailY },
    { x: resistorTerminal1X, y: topRailY },
    { x: resistorTerminal2X, y: topRailY },
    { x: ledBranchX, y: topRailY },
    { x: ledBranchX, y: ledTopTerminalY },
    { x: ledBranchX, y: ledBottomTerminalY },
    { x: ledBranchX, y: bottomRailY },
    { x: batteryTerminalX, y: bottomRailY },
    { x: batteryTerminalX, y: batteryBottomTerminalY },
  ];

  const flowPath = flowPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 760 360"
      className="h-[420px] w-full"
      role="img"
      aria-label="Voltage versus current circuit"
    >
      <defs>
        <filter
          id="voltageCurrentLedGlow"
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
        >
          <feGaussianBlur stdDeviation="9" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="40"
        y="36"
        width="680"
        height="288"
        rx="28"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />

      <text x="70" y="76" fontSize="18" fontWeight="700" fill="#0f172a">
        Voltage Push vs Current Flow
      </text>
      <text x="70" y="102" fontSize="13" fill="#475569">
        Voltage = {voltage.toFixed(1)} V | Current = {current.toFixed(2)} A |
        Resistance = {resistance.toFixed(1)} Ohm
      </text>

      <svg
        x={batteryX}
        y={batteryY}
        width={batteryWidth}
        height={batteryHeight}
        viewBox={`0 0 ${batteryWidth} ${batteryHeight}`}
        overflow="visible"
      >
        <BatterySymbol
          width={batteryWidth}
          height={batteryHeight}
          label="Battery source"
        />
      </svg>
      <text
        x={batteryTerminalX + 16}
        y={batteryY + 68}
        fontSize="14"
        fontWeight="700"
        fill="#dc2626"
      >
        {voltage.toFixed(1)} V
      </text>

      <path
        d={`M ${batteryTerminalX} ${batteryTopTerminalY} L ${leftWireX} ${batteryTopTerminalY} L ${leftWireX} ${topRailY} L ${resistorTerminal1X} ${topRailY}`}
        fill="none"
        stroke="#dc2626"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${resistorTerminal2X} ${topRailY} L ${ledBranchX} ${topRailY} L ${ledBranchX} ${ledTopTerminalY}`}
        fill="none"
        stroke="#dc2626"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${ledBranchX} ${ledBottomTerminalY} L ${ledBranchX} ${bottomRailY} L ${batteryTerminalX} ${bottomRailY} L ${batteryTerminalX} ${batteryBottomTerminalY}`}
        fill="none"
        stroke="#334155"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

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
        y={resistorY - 14}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#334155"
      >
        RESISTOR {resistance.toFixed(1)} Ohm
      </text>
      <text
        x={resistorTerminal1X + 10}
        y={topRailY - 8}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#334155"
      >
        1
      </text>
      <text
        x={resistorTerminal2X - 10}
        y={topRailY - 8}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#334155"
      >
        2
      </text>

      <svg
        x={ledX}
        y={ledY}
        width={ledWidth}
        height={ledHeight}
        viewBox={`0 0 ${ledWidth} ${ledHeight}`}
        overflow="visible"
      >
        <g
          transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}
        >
          <LEDSymbol width={ledWidth} height={ledHeight} label="Indicator LED" />
        </g>
      </svg>

      {[0, 1, 2, 3, 4].map((particle) => (
        <motion.circle
          key={particle}
          r="7"
          fill="#2563eb"
          animate={isPlaying ? { opacity: [0, 1, 1, 1, 0] } : { opacity: 0.3 }}
          transition={{
            duration: particleDuration,
            repeat: Infinity,
            delay: particle * 0.24,
            ease: "linear",
          }}
        >
          {isPlaying ? (
            <animateMotion
              dur={`${particleDuration}s`}
              repeatCount="indefinite"
              begin={`${particle * 0.24}s`}
              path={flowPath}
            />
          ) : null}
        </motion.circle>
      ))}

      <motion.circle
        cx={ledBranchX}
        cy={(ledTopTerminalY + ledBottomTerminalY) / 2}
        r="40"
        fill="#fde68a"
        filter="url(#voltageCurrentLedGlow)"
        animate={{
          opacity: isPlaying
            ? [glowOpacity * 0.4, glowOpacity, glowOpacity * 0.4]
            : glowOpacity * 0.55,
        }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />

      <text x="230" y="146" fontSize="14" fontWeight="700" fill="#dc2626">
        Voltage Push -&gt;
      </text>
      <text x="252" y="302" fontSize="14" fontWeight="700" fill="#2563eb">
        Current Flow -&gt;
      </text>
      <text
        x={ledBranchX + 8}
        y={ledY - 18}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#92400e"
      >
        LED
      </text>

      <rect x="82" y="318" width={voltagePercent * 2.15} height="10" rx="5" fill="#ef4444" />
      <rect x="82" y="348" width={currentPercent * 2.15} height="10" rx="5" fill="#2563eb" />

      <text x="82" y="308" fontSize="12" fontWeight="700" fill="#ef4444">
        Voltage Strength: {voltagePercent}%
      </text>
      <text x="82" y="340" fontSize="12" fontWeight="700" fill="#2563eb">
        Current Strength: {currentPercent}%
      </text>
    </svg>
  );
}
