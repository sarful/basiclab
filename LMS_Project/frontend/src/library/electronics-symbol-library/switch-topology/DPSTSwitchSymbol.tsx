"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DPSTSwitchSymbol({
  className = "",
  label = "DPST Switch",
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
        x1="78"
        y1="62"
        x2="96"
        y2="62"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="97"
        cy="62"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="102"
        y1="61"
        x2="160"
        y2="43"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="159"
        cy="62"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="164"
        y1="62"
        x2="178"
        y2="62"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="78"
        y1="111"
        x2="96"
        y2="111"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="97"
        cy="111"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="102"
        y1="110"
        x2="160"
        y2="92"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="159"
        cy="111"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="164"
        y1="111"
        x2="178"
        y2="111"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="128"
        y1="66"
        x2="128"
        y2="104"
        stroke="#374151"
        strokeWidth="2"
        strokeDasharray="7 6"
        strokeLinecap="square"
      />

      <text
        x="129"
        y="134"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#111827"
      >
        SW2
      </text>
    </svg>
  );
}
