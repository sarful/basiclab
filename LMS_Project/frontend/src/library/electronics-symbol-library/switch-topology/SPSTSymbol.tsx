"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function SPSTSymbol({
  className = "",
  label = "SPST Relay",
  width = 260,
  height = 220,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 220"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="78"
        y="64"
        width="105"
        height="88"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="96"
        y1="57"
        x2="96"
        y2="159"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M96 76
           C111 76 111 90 96 90
           C81 90 81 83 96 83
           C111 83 111 97 96 97
           C81 97 81 105 96 105
           C111 105 111 119 96 119
           C81 119 81 112 96 112
           C111 112 111 126 96 126
           C81 126 81 134 96 134"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="146"
        y1="57"
        x2="146"
        y2="76"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="146"
        cy="76"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="146"
        y1="140"
        x2="146"
        y2="159"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="146"
        cy="139"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="146"
        y1="76"
        x2="171"
        y2="139"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M113 107H137"
        stroke="#374151"
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <path
        d="M153 120L136 116M153 120L140 131"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
