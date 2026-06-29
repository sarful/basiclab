"use client";

import type { FlowMode } from "./mosfetSimulatorTypes";
import {
  COMPONENT,
  LABEL,
  VIEW_BOX,
  WIRE,
} from "./pChannelMosfetSymbolConstants";
import {
  SymbolFrame,
  SymbolLeads,
  SymbolTerminalLabels,
} from "./pChannelMosfetSymbolBlocks";

type PChannelMosfetSymbolProps = {
  active?: boolean;
  className?: string;
  flowMode?: FlowMode;
  height?: number;
  highlightColor?: string;
  label?: string;
  showTerminalLabels?: boolean;
  width?: number;
};

export default function PChannelMosfetSymbol({
  active = false,
  className = "",
  flowMode = "Both",
  highlightColor = "#16a34a",
  label = "P-Channel MOSFET",
  showTerminalLabels = true,
  width = 220,
  height = 260,
}: PChannelMosfetSymbolProps) {
  const channelStroke = active ? highlightColor : COMPONENT.inactiveStroke;
  const channelOpacity =
    flowMode === "Both" ? 1 : flowMode === "Electron" ? 0.95 : 0.75;
  const gateStroke = active ? "#2563eb" : COMPONENT.defaultStroke;
  const drainStroke = active ? highlightColor : COMPONENT.defaultStroke;
  const sourceStroke =
    active && (flowMode === "Electron" || flowMode === "Both")
      ? "#16a34a"
      : COMPONENT.defaultStroke;
  const gateLabelColor = active ? "#1d4ed8" : COMPONENT.labelColor;
  const drainLabelColor = active ? highlightColor : COMPONENT.labelColor;
  const sourceLabelColor =
    active && (flowMode === "Electron" || flowMode === "Both")
      ? "#15803d"
      : COMPONENT.labelColor;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      role="img"
      aria-label={label}
      fill={COMPONENT.defaultFill}
      fillRule="evenodd"
      stroke={COMPONENT.defaultStroke}
      strokeLinecap={WIRE.lineCap}
      strokeLinejoin={WIRE.lineJoin}
      fontFamily={COMPONENT.fontFamily}
      fontSize={LABEL.baseFontSize}
      textAnchor={LABEL.textAnchor}
    >
      <g transform="translate(0.5 0.5)">
        <SymbolFrame channelStroke={channelStroke} />
        <SymbolLeads
          channelStroke={channelStroke}
          channelOpacity={channelOpacity}
          drainStroke={drainStroke}
          gateStroke={gateStroke}
          sourceStroke={sourceStroke}
        />

        {showTerminalLabels ? (
          <SymbolTerminalLabels
            drainLabelColor={drainLabelColor}
            gateLabelColor={gateLabelColor}
            sourceLabelColor={sourceLabelColor}
          />
        ) : null}
      </g>
    </svg>
  );
}
