"use client";

type ACVoltageSourceSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ACVoltageSourceSymbol({
  className = "",
  label = "AC Voltage Source",
  width = 320,
  height = 560,
}: ACVoltageSourceSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 320 560"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="160"
        y1="11"
        x2="160"
        y2="145"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <circle
        cx="160"
        cy="280"
        r="135"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="9"
      />

      <path
        d="M93 314 C105 271 116 220 134 220 C156 220 167 303 184 330 C197 350 212 345 228 280"
        stroke="#000000"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="160"
        y1="415"
        x2="160"
        y2="549"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}
