"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import ACVoltageSourceSymbol from "../../library/electronics-symbol-library/sources/ACVoltageSourceSymbol";
import { SVG_HEIGHT, SVG_WIDTH, calculateCurrent, createSinePath } from "./logic";
import { GraphBase, GraphLabels } from "./ui";

export function AcCircuit({ peakVoltage, frequency, current, isPlaying }: { peakVoltage: number; frequency: number; current: number; isPlaying: boolean }) {
  const duration = Math.max(0.7, 2.6 - frequency / 2);
  const glowOpacity = current < 0.5 ? 0.2 : current < 2 ? 0.55 : 0.9;

  const sourceX = 84;
  const sourceY = 76;
  const sourceWidth = 52;
  const sourceHeight = 92;
  const sourceTerminalX = sourceX + sourceWidth / 2;
  const sourceTopTerminalY = sourceY + (11 / 560) * sourceHeight;
  const sourceBottomTerminalY = sourceY + (549 / 560) * sourceHeight;

  const resistorX = 238;
  const resistorY = 56;
  const resistorWidth = 132;
  const resistorHeight = 72;
  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;
  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;

  const ledX = 398;
  const ledY = 88;
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

  const bottomRailY = 176;
  const wireStroke = 2.4;

  const flowPath = [
    { x: sourceTerminalX, y: sourceTopTerminalY },
    { x: sourceTerminalX, y: resistorTerminalY },
    { x: resistorTerminal1X, y: resistorTerminalY },
    { x: resistorTerminal2X, y: resistorTerminalY },
    { x: ledBranchX, y: resistorTerminalY },
    { x: ledBranchX, y: ledTopTerminalY },
    { x: ledBranchX, y: ledBottomTerminalY },
    { x: ledBranchX, y: bottomRailY },
    { x: sourceTerminalX, y: bottomRailY },
    { x: sourceTerminalX, y: sourceBottomTerminalY },
  ]
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg viewBox="0 0 520 220" className="h-56 w-full" role="img" aria-label="AC voltage circuit">
      <defs>
        <filter id="acVoltageLedGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text x="42" y="112" fontSize="16" fontWeight="700" fill="#1d4ed8">AC</text>
      <text x="42" y="132" fontSize="16" fontWeight="700" fill="#1d4ed8">Source</text>

      <svg x={sourceX} y={sourceY} width={sourceWidth} height={sourceHeight} viewBox={`0 0 ${sourceWidth} ${sourceHeight}`} overflow="visible">
        <ACVoltageSourceSymbol width={sourceWidth} height={sourceHeight} label="AC source" />
      </svg>
      <text x={sourceTerminalX} y={sourceY - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">AC Source</text>

      <path
        d={`M ${sourceTerminalX} ${sourceTopTerminalY} L ${sourceTerminalX} ${resistorTerminalY} L ${resistorTerminal1X} ${resistorTerminalY}`}
        fill="none"
        stroke="#dc2626"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${resistorTerminal2X} ${resistorTerminalY} L ${ledBranchX} ${resistorTerminalY} L ${ledBranchX} ${ledTopTerminalY}`}
        fill="none"
        stroke="#dc2626"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${ledBranchX} ${ledBottomTerminalY} L ${ledBranchX} ${bottomRailY} L ${sourceTerminalX} ${bottomRailY} L ${sourceTerminalX} ${sourceBottomTerminalY}`}
        fill="none"
        stroke="#111827"
        strokeWidth={wireStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {[
        { x: sourceTerminalX, y: sourceTopTerminalY },
        { x: sourceTerminalX, y: resistorTerminalY },
        { x: resistorTerminal1X, y: resistorTerminalY },
        { x: resistorTerminal2X, y: resistorTerminalY },
        { x: ledBranchX, y: resistorTerminalY },
        { x: ledBranchX, y: ledTopTerminalY },
        { x: ledBranchX, y: ledBottomTerminalY },
        { x: ledBranchX, y: bottomRailY },
        { x: sourceTerminalX, y: bottomRailY },
        { x: sourceTerminalX, y: sourceBottomTerminalY },
      ].map((point, index) => (
        <circle key={`acv-node-${index}`} cx={point.x} cy={point.y} r="2.4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.1" />
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
        style={{ filter: current > 0.25 ? "url(#acVoltageLedGlow)" : "none" }}
      >
        <g transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}>
          <LEDSymbol width={ledWidth} height={ledHeight} label="AC indicator LED" />
        </g>
      </svg>
      <motion.circle
        cx={ledBranchX}
        cy={(ledTopTerminalY + ledBottomTerminalY) / 2}
        r="13"
        fill="#fde68a"
        animate={{ opacity: isPlaying ? [glowOpacity * 0.25, glowOpacity, glowOpacity * 0.25] : glowOpacity * 0.45 }}
        transition={{ duration: Math.max(0.4, 1 / frequency), repeat: Infinity }}
      />
      <text x={ledBranchX} y={ledY - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">LED</text>

      {[0, 1, 2].map((dot) => (
        <motion.circle
          key={dot}
          r="5"
          fill="#dc2626"
          animate={isPlaying ? { opacity: [0, 1, 1, 0] } : { opacity: 0.4 }}
          transition={{ duration, repeat: Infinity, delay: dot * 0.35, ease: "linear" }}
        >
          {isPlaying && <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${dot * 0.35}s`} path={flowPath} />}
        </motion.circle>
      ))}

      <text x="210" y="62" fontSize="12" fontWeight="700" fill="#dc2626">Peak: {peakVoltage.toFixed(1)}V</text>
      <text x="332" y="194" fontSize="12" fontWeight="700" fill="#2563eb">RMS Current: {current.toFixed(2)}A</text>
    </svg>
  );
}

export function AcWaveform({ peakVoltage, frequency, resistance }: { peakVoltage: number; frequency: number; resistance: number }) {
  const voltagePath = createSinePath(peakVoltage, frequency, 8);
  const currentPath = createSinePath(calculateCurrent(peakVoltage, resistance), frequency, 38);

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-56 w-full" role="img" aria-label="AC waveform graph">
      <GraphBase title="AC Waveform" />
      <path d={voltagePath} stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={currentPath} stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" />
      <GraphLabels />
    </svg>
  );
}
