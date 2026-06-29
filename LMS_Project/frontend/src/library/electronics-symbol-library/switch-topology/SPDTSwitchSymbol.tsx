"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function SPDTSwitchSymbol({
  className = "",
  label = "SPDT Switch",
  width = 260,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 160"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="104"
        y1="102"
        x2="121"
        y2="102"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="121"
        cy="102"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="126"
        y1="101"
        x2="181"
        y2="82"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="182"
        cy="78"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="187"
        y1="78"
        x2="202"
        y2="78"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="182"
        cy="102"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="187"
        y1="102"
        x2="202"
        y2="102"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
