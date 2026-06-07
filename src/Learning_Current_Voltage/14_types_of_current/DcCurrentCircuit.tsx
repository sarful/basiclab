"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import { SVG_HEIGHT, SVG_WIDTH, getFlowDuration } from "./logic";
import { GraphBase } from "./ui";

export function DcCurrentCircuit({ current, isPlaying }: { current: number; isPlaying: boolean }) {
  const duration = getFlowDuration(current);
  const glowOpacity = current < 0.8 ? 0.25 : current < 2.5 ? 0.6 : 0.92;

  const batteryX = 70;
  const batteryY = 78;
  const batteryWidth = 108;
  const batteryHeight = 118;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const resistorX = 238;
  const resistorY = 52;
  const resistorWidth = 132;
  const resistorHeight = 72;
  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;
  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;

  const ledX = 398;
  const ledY = 84;
  const ledWidth = 92;
  const ledHeight = 74;
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
  const ledTopTerminalY = ledY + (ledRotationCenterY + (ledLeftTerminalX - ledRotationCenterX));
  const ledBottomTerminalY = ledY + (ledRotationCenterY + (ledRightTerminalX - ledRotationCenterX));

  const leftWireX = 126;
  const bottomRailY = 176;
  const wireStroke = 2.4;
  const topWireColor = "#16a34a";
  const returnWireColor = "#111827";

  const points = [
    { x: batteryTerminalX, y: batteryTopTerminalY },
    { x: leftWireX, y: batteryTopTerminalY },
    { x: leftWireX, y: resistorTerminalY },
    { x: resistorTerminal1X, y: resistorTerminalY },
    { x: resistorTerminal2X, y: resistorTerminalY },
    { x: ledBranchX, y: resistorTerminalY },
    { x: ledBranchX, y: ledTopTerminalY },
    { x: ledBranchX, y: ledBottomTerminalY },
    { x: ledBranchX, y: bottomRailY },
    { x: batteryTerminalX, y: bottomRailY },
    { x: batteryTerminalX, y: batteryBottomTerminalY },
  ];

  const flowPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg viewBox="0 0 520 220" className="h-56 w-full" role="img" aria-label="DC current circuit">
      <defs>
        <filter id="dcLedGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text x="38" y="112" fontSize="16" fontWeight="700" fill="#15803d">DC</text>
      <text x="38" y="132" fontSize="16" fontWeight="700" fill="#15803d">Current</text>

      <svg x={batteryX} y={batteryY} width={batteryWidth} height={batteryHeight} viewBox={`0 0 ${batteryWidth} ${batteryHeight}`} overflow="visible">
        <BatterySymbol width={batteryWidth} height={batteryHeight} label="DC battery source" />
      </svg>
      <text x={batteryTerminalX + 18} y={batteryY + 67} fontSize="13" fontWeight="700" fill="#dc2626">
        DC Supply
      </text>

      <path
        d={`M ${batteryTerminalX} ${batteryTopTerminalY} L ${leftWireX} ${batteryTopTerminalY} L ${leftWireX} ${resistorTerminalY} L ${resistorTerminal1X} ${resistorTerminalY}`}
        fill="none"
        stroke={topWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${resistorTerminal2X} ${resistorTerminalY} L ${ledBranchX} ${resistorTerminalY} L ${ledBranchX} ${ledTopTerminalY}`}
        fill="none"
        stroke={topWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${ledBranchX} ${ledBottomTerminalY} L ${ledBranchX} ${bottomRailY} L ${batteryTerminalX} ${bottomRailY} L ${batteryTerminalX} ${batteryBottomTerminalY}`}
        fill="none"
        stroke={returnWireColor}
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point, index) => (
        <circle key={`dc-node-${index}`} cx={point.x} cy={point.y} r="2.4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.1" />
      ))}

      <svg x={resistorX} y={resistorY} width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
        <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Series resistor" />
      </svg>
      <text x={resistorX + resistorWidth / 2} y={resistorY - 10} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">
        RESISTOR
      </text>

      <svg
        x={ledX}
        y={ledY}
        width={ledWidth}
        height={ledHeight}
        viewBox={`0 0 ${ledWidth} ${ledHeight}`}
        overflow="visible"
        style={{ filter: current > 0.25 ? "url(#dcLedGlow)" : "none" }}
      >
        <g transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}>
          <LEDSymbol width={ledWidth} height={ledHeight} label="DC indicator LED" />
        </g>
      </svg>
      <motion.circle
        cx={ledBranchX}
        cy={(ledTopTerminalY + ledBottomTerminalY) / 2}
        r="13"
        fill="#bbf7d0"
        animate={{ opacity: isPlaying ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35] : glowOpacity * 0.55 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />
      <text x={ledBranchX} y={ledY - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d">LED</text>

      {[0, 1, 2, 3].map((dot) => (
        <motion.circle
          key={dot}
          r="6"
          fill="#16a34a"
          animate={isPlaying ? { opacity: [0, 1, 1, 0] } : { opacity: 0.4 }}
          transition={{ duration, repeat: Infinity, delay: dot * 0.3, ease: "linear" }}
        >
          {isPlaying && <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${dot * 0.3}s`} path={flowPath} />}
        </motion.circle>
      ))}

      <text x="202" y="62" fontSize="12" fontWeight="700" fill="#15803d">One Direction {"->"}</text>
      <text x="310" y="196" fontSize="12" fontWeight="700" fill="#15803d">Current: {current.toFixed(2)}A</text>
    </svg>
  );
}

export function DcCurrentWaveform({ current }: { current: number }) {
  const currentY = 110 - current * 14;

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-56 w-full" role="img" aria-label="DC current waveform">
      <GraphBase title="DC Current Waveform" />
      <path d={`M70 ${currentY} H470`} stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <text x="74" y="48" fontSize="12" fontWeight="700" fill="#15803d">Current (I)</text>
    </svg>
  );
}

