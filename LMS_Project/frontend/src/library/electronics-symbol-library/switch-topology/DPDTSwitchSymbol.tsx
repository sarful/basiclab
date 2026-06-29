"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DPDTSwitchSymbol({
  className = "",
  label = "DPDT Switch",
  width = 260,
  height = 180,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 180"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="88"
        y1="67"
        x2="107"
        y2="67"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="108"
        cy="67"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="113"
        y1="66"
        x2="170"
        y2="49"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="170"
        cy="43"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="175"
        y1="43"
        x2="188"
        y2="43"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="170"
        cy="67"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="175"
        y1="67"
        x2="188"
        y2="67"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="88"
        y1="117"
        x2="107"
        y2="117"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="108"
        cy="117"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="113"
        y1="116"
        x2="170"
        y2="96"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="170"
        cy="92"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="175"
        y1="92"
        x2="188"
        y2="92"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="170"
        cy="117"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="175"
        y1="117"
        x2="188"
        y2="117"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="139"
        y1="72"
        x2="139"
        y2="110"
        stroke="#374151"
        strokeWidth="2"
        strokeDasharray="7 6"
        strokeLinecap="square"
      />
    </svg>
  );
}
