"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function Timer555Symbol({
  className = "",
  label = "555 Timer",
  width = 260,
  height = 260,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 260"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="86"
        y="59"
        width="128"
        height="133"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line x1="76" y1="96" x2="86" y2="96" stroke="#374151" strokeWidth="2" />
      <line x1="76" y1="196" x2="86" y2="196" stroke="#374151" strokeWidth="2" />

      <line x1="214" y1="96" x2="226" y2="96" stroke="#374151" strokeWidth="2" />
      <line x1="214" y1="146" x2="226" y2="146" stroke="#374151" strokeWidth="2" />
      <line x1="214" y1="196" x2="226" y2="196" stroke="#374151" strokeWidth="2" />

      <line x1="127" y1="47" x2="127" y2="59" stroke="#374151" strokeWidth="2" />
      <line x1="177" y1="47" x2="177" y2="59" stroke="#374151" strokeWidth="2" />
      <line x1="151" y1="192" x2="151" y2="221" stroke="#374151" strokeWidth="2" />

      <text x="122" y="72" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        RESET
      </text>

      <text x="177" y="72" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        VCC
      </text>

      <text x="112" y="102" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        TRIGGER
      </text>

      <text x="178" y="102" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        DISCHARGE
      </text>

      <text x="151" y="128" textAnchor="middle" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        555
      </text>

      <text x="183" y="153" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        THRESHOLD
      </text>

      <text x="154" y="181" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        U4
      </text>

      <text x="112" y="201" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        OUTPUT
      </text>

      <text x="152" y="201" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        GND
      </text>

      <text x="184" y="201" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif" fill="#111827">
        CONTROL
      </text>
    </svg>
  );
}
