"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DPDTSymbol({
  className = "",
  label = "DPDT Relay",
  width = 260,
  height = 150,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 150"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="45"
        y="25"
        width="155"
        height="88"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line x1="63" y1="18" x2="63" y2="121" stroke="#374151" strokeWidth="2" />
      <line x1="113" y1="18" x2="113" y2="113" stroke="#374151" strokeWidth="2" />
      <line x1="163" y1="18" x2="163" y2="113" stroke="#374151" strokeWidth="2" />

      <path
        d="M63 36
           C78 36 78 51 63 51
           C48 51 48 44 63 44
           C78 44 78 59 63 59
           C48 59 48 67 63 67
           C78 67 78 82 63 82
           C48 82 48 75 63 75"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="113" cy="38" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
      <circle cx="113" cy="100" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
      <circle cx="137" cy="100" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />

      <circle cx="163" cy="38" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
      <circle cx="163" cy="100" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
      <circle cx="188" cy="100" r="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />

      <line x1="113" y1="38" x2="137" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="163" y1="38" x2="188" y2="100" stroke="#374151" strokeWidth="2" />

      <path
        d="M103 70C116 70 124 66 130 59"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M154 70C168 70 176 66 183 59"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M118 82L101 78M118 82L105 93"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M169 82L152 78M169 82L156 93"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <line x1="137" y1="100" x2="137" y2="121" stroke="#374151" strokeWidth="2" />
      <line x1="188" y1="100" x2="188" y2="121" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}
