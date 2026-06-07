"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function SPSTSwitchSymbol({
  className = "",
  label = "SPST Switch",
  width = 240,
  height = 110,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 240 110"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="71"
        y1="56"
        x2="90"
        y2="56"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="90"
        cy="56"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="95"
        y1="55"
        x2="153"
        y2="38"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="151"
        cy="57"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

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
