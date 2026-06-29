"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function TransformerV1Symbol({
  className = "",
  label = "Transformer V1",
  width = 220,
  height = 220,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 220"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61 57H86V86"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M86 131V155H61"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M86 84
           C98 84 98 95 86 95
           C98 95 98 106 86 106
           C98 106 98 117 86 117
           C98 117 98 128 86 128"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="81" cy="88" r="4" fill="#374151" />

      <line
        x1="107"
        y1="81"
        x2="107"
        y2="132"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="114"
        y1="81"
        x2="114"
        y2="132"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M160 57H135V86"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M135 131V155H160"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M135 84
           C123 84 123 95 135 95
           C123 95 123 106 135 106
           C123 106 123 117 135 117
           C123 117 123 128 135 128"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="140" cy="88" r="4" fill="#374151" />
    </svg>
  );
}
