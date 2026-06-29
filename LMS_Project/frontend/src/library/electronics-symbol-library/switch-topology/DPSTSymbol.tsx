"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DPSTSymbol({
  className = "",
  label = "DPST Relay",
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
      <rect
        x="58"
        y="52"
        width="156"
        height="86"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="78"
        y1="45"
        x2="78"
        y2="145"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M78 63
           C93 63 93 77 78 77
           C63 77 63 70 78 70
           C93 70 93 84 78 84
           C63 84 63 92 78 92
           C93 92 93 106 78 106
           C63 106 63 99 78 99
           C93 99 93 113 78 113"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="128"
        y1="45"
        x2="128"
        y2="64"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="128"
        y1="128"
        x2="128"
        y2="145"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="128"
        cy="64"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <circle
        cx="128"
        cy="126"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="128"
        y1="64"
        x2="153"
        y2="126"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M103 94H122"
        stroke="#374151"
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <path
        d="M137 107L120 103M137 107L124 118"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M119 83C132 83 141 78 148 71"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <line
        x1="177"
        y1="45"
        x2="177"
        y2="64"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="177"
        y1="128"
        x2="177"
        y2="145"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="177"
        cy="64"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <circle
        cx="177"
        cy="126"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="177"
        y1="64"
        x2="201"
        y2="126"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M154 94H171"
        stroke="#374151"
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <path
        d="M186 107L169 103M186 107L173 118"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M169 83C181 83 190 78 197 71"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
