"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function SPDTSymbol({
  className = "",
  label = "SPDT Relay",
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
        x="98"
        y="28"
        width="105"
        height="88"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="117"
        y1="22"
        x2="117"
        y2="123"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M117 39
           C132 39 132 53 117 53
           C102 53 102 46 117 46
           C132 46 132 60 117 60
           C102 60 102 68 117 68
           C132 68 132 82 117 82
           C102 82 102 75 117 75
           C132 75 132 89 117 89
           C102 89 102 97 117 97"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="166"
        y1="22"
        x2="166"
        y2="40"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="166"
        cy="40"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="166"
        y1="104"
        x2="166"
        y2="123"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="166"
        cy="103"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="191"
        y1="104"
        x2="191"
        y2="123"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="191"
        cy="103"
        r="5"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="166"
        y1="40"
        x2="191"
        y2="103"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M134 71H158"
        stroke="#374151"
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <path
        d="M174 84L157 80M174 84L161 95"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M156 60C169 60 180 55 190 47"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
