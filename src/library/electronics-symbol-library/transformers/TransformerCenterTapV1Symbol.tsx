"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function TransformerCenterTapV1Symbol({
  className = "",
  label = "Transformer Center Tap V1",
  width = 220,
  height = 210,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 210"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47 60H72V89"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M72 126V159H47"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M72 88
           C84 88 84 99 72 99
           C84 99 84 110 72 110
           C84 110 84 121 72 121"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="67" cy="90" r="4" fill="#374151" />

      <line
        x1="93"
        y1="85"
        x2="93"
        y2="135"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="101"
        y1="85"
        x2="101"
        y2="135"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M147 60H122V89"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M122 126V159H147"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M122 88
           C110 88 110 99 122 99
           C110 99 110 110 122 110
           C110 110 110 121 122 121"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="127" cy="90" r="4" fill="#374151" />

      <line
        x1="124"
        y1="109"
        x2="147"
        y2="109"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
