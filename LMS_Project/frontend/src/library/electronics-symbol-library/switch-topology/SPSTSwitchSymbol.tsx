"use client";

import type {
  ElectronicsSymbolProps,
  ElectronicsSymbolTerminalMap,
  ElectronicsSymbolViewBox,
} from "../shared";

export const SPST_SWITCH_SYMBOL_VIEW_BOX: ElectronicsSymbolViewBox = {
  minX: 0,
  minY: 0,
  width: 240,
  height: 110,
};

export const SPST_SWITCH_TERMINAL_OFFSET: ElectronicsSymbolTerminalMap = {
  left: { x: 71, y: 56 },
  right: { x: 170, y: 57 },
  leftContact: { x: 90, y: 56 },
  rightContact: { x: 151, y: 57 },
};

type SPSTSwitchSymbolProps = ElectronicsSymbolProps & {
  switchClosed?: boolean;
  isClosed?: boolean;
  closed?: boolean;
  active?: boolean;
};

export default function SPSTSwitchSymbol({
  className = "",
  label = "SPST Switch",
  width = 240,
  height = 110,
  switchClosed = false,
  isClosed,
  closed,
  active,
}: SPSTSwitchSymbolProps) {
  const isSwitchClosed = switchClosed || isClosed || closed || active;

  const bladeEndY = isSwitchClosed ? 57 : 38;
  const ariaLabel = `${label} ${isSwitchClosed ? "closed" : "open"}`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 240 110"
      role="img"
      aria-label={ariaLabel}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left terminal wire */}
      <line
        x1="71"
        y1="56"
        x2="90"
        y2="56"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      {/* Left contact */}
      <circle
        cx="90"
        cy="56"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      {/* Moving blade */}
      <line
        x1="95"
        y1="55"
        x2="153"
        y2={bladeEndY}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Right contact */}
      <circle
        cx="151"
        cy="57"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      {/* Right terminal wire */}
      <line
        x1="156"
        y1="57"
        x2="170"
        y2="57"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
