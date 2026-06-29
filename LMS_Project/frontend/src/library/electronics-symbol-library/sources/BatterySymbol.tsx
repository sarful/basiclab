"use client";

import type {
  ElectronicsSymbolProps,
  ElectronicsSymbolTerminalMap,
  ElectronicsSymbolViewBox,
} from "../shared";

export const BATTERY_SYMBOL_VIEW_BOX: ElectronicsSymbolViewBox = {
  minX: 0,
  minY: 0,
  width: 160,
  height: 160,
};

export const BATTERY_TERMINAL_OFFSET: ElectronicsSymbolTerminalMap = {
  positive: { x: 81, y: 21 },
  negative: { x: 81, y: 121 },
};

export default function BatterySymbol({
  className = "",
  label = "Battery",
  width = 160,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 160 160"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="81"
        y1="21"
        x2="81"
        y2="66"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="56"
        y1="66"
        x2="107"
        y2="66"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="68"
        y1="76"
        x2="94"
        y2="76"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="81"
        y1="76"
        x2="81"
        y2="121"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <text
        x="67"
        y="62"
        textAnchor="middle"
        fontSize="18"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#374151"
      >
        +
      </text>
    </svg>
  );
}
