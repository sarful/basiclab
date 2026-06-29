"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PotSymbol({
  className = "",
  label = "Potentiometer 100 Ohm",
  width = 220,
  height = 190,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 190"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M152 40V62"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M152 62L139 67L165 77L139 87L165 97L139 107L152 112"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M152 112V140"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M202 90H174"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M174 90L187 83V97L174 90Z"
        fill="#374151"
      />

      <text
        x="126"
        y="89"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#111827"
      >
        R1
      </text>

      <text
        x="112"
        y="107"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#111827"
      >
        100 Ω
      </text>
    </svg>
  );
}
