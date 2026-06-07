"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function VoltageRegulatorSymbol({
  className = "",
  label = "Voltage Regulator",
  width = 277,
  height = 199,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 277 199"
      role="img"
      aria-label={label}
      fill="none"
      stroke="#374151"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <g>
        <rect
          x="113.5"
          y="69.5"
          width="75"
          height="62"
          fill="#ffffff"
          strokeWidth="2"
        />

        <line
          x1="100"
          y1="94"
          x2="113.5"
          y2="94"
          strokeWidth="2"
        />
        <line
          x1="188.5"
          y1="94"
          x2="202"
          y2="94"
          strokeWidth="2"
        />
        <line
          x1="151"
          y1="131.5"
          x2="151"
          y2="145"
          strokeWidth="2"
        />

        <text
          x="151"
          y="61"
          fill="#111827"
          stroke="none"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="15"
          fontWeight="700"
          textAnchor="middle"
        >
          
        </text>

        <text
          x="124"
          y="99"
          fill="#374151"
          stroke="none"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="14"
          fontStyle="italic"
          fontWeight="600"
          textAnchor="middle"
        >
          IN
        </text>

        <text
          x="176"
          y="99"
          fill="#374151"
          stroke="none"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="14"
          fontStyle="italic"
          fontWeight="600"
          textAnchor="middle"
        >
          OUT
        </text>

        <text
          x="151"
          y="127"
          fill="#374151"
          stroke="none"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="14"
          fontStyle="italic"
          fontWeight="600"
          textAnchor="middle"
        >
          GND
        </text>
      </g>
    </svg>
  );
}
