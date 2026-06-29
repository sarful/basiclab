"use client";

import {
  BASE_COMPONENT,
  COMPONENT,
  LABEL,
  NODE,
  PATH,
  WIRE,
} from "./pChannelMosfetSymbolConstants";

type SymbolStrokeProps = {
  channelOpacity?: number;
  channelStroke: string;
  drainStroke?: string;
  gateStroke?: string;
  sourceStroke?: string;
};

export function SymbolFrame({ channelStroke }: SymbolStrokeProps) {
  return (
    <circle
      cx={BASE_COMPONENT.symbolCenter.x}
      cy={BASE_COMPONENT.symbolCenter.y}
      r={BASE_COMPONENT.symbolRadius}
      stroke={channelStroke}
      strokeWidth={WIRE.width}
      fill={COMPONENT.transparent}
    />
  );
}

export function SymbolLeads({
  channelOpacity = 1,
  channelStroke,
  drainStroke = COMPONENT.defaultStroke,
  gateStroke = COMPONENT.defaultStroke,
  sourceStroke = COMPONENT.defaultStroke,
}: SymbolStrokeProps) {
  return (
    <>
      <path
        d={PATH.gateLead}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={gateStroke}
      />
      <path
        d={PATH.channelTop}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={channelStroke}
        opacity={channelOpacity}
      />
      <path
        d={PATH.channelMiddle}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={channelStroke}
        opacity={channelOpacity}
      />
      <path
        d={PATH.channelBottom}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={channelStroke}
        opacity={channelOpacity}
      />
      <path
        d={PATH.sourceLead}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={sourceStroke}
      />
      <path
        d={PATH.drainLead}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={drainStroke}
      />
      <path
        d={PATH.arrowBridge}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={channelStroke}
        opacity={channelOpacity}
      />
      <path
        d={PATH.arrowHead}
        fill={COMPONENT.transparent}
        strokeWidth={WIRE.width}
        stroke={channelStroke}
        opacity={channelOpacity}
      />
    </>
  );
}

type SymbolTerminalLabelsProps = {
  drainLabelColor?: string;
  gateLabelColor?: string;
  sourceLabelColor?: string;
};

export function SymbolTerminalLabels({
  drainLabelColor = COMPONENT.labelColor,
  gateLabelColor = COMPONENT.labelColor,
  sourceLabelColor = COMPONENT.labelColor,
}: SymbolTerminalLabelsProps) {
  return (
    <>
      <text
        fontSize={LABEL.terminalFontSize}
        textAnchor={LABEL.sourceAnchor}
        fill={sourceLabelColor}
        stroke="none"
      >
        <tspan x={NODE.sourceLabel.x} y={NODE.sourceLabel.y}>
          S
        </tspan>
      </text>

      <text
        fontSize={LABEL.terminalFontSize}
        textAnchor={LABEL.gateAnchor}
        fill={gateLabelColor}
        stroke="none"
      >
        <tspan x={NODE.gateLabel.x} y={NODE.gateLabel.y}>
          G
        </tspan>
      </text>

      <text
        fontSize={LABEL.terminalFontSize}
        textAnchor={LABEL.drainAnchor}
        fill={drainLabelColor}
        stroke="none"
      >
        <tspan x={NODE.drainLabel.x} y={NODE.drainLabel.y}>
          D
        </tspan>
      </text>
    </>
  );
}
