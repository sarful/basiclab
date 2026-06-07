"use client";

type ProximitySensorCapacitive3WireSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ProximitySensorCapacitive3WireSymbol({
  className = "",
  label = "Proximity Sensor - Capacitive (3 Wire)",
  width = 220,
  height = 260,
}: ProximitySensorCapacitive3WireSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 101 121"
      role="img"
      aria-label={label}
      fill="#fff"
      fillRule="evenodd"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto"
      fontSize="14"
      textAnchor="middle"
    >
      <g transform="translate(0.5 0.5)">
        <path d="M60 50h-5" fill="none" strokeWidth="0.5" />
        <path d="M5 25h50v50H5z" strokeWidth="0.5" />
        <path d="M30 20v5" fill="none" strokeWidth="0.5" />
        <circle cx="30" cy="25" r="2.5" strokeWidth="0.5" />
        <path d="M30 80v-5" fill="none" strokeWidth="0.5" />
        <circle cx="30" cy="75" r="2.5" strokeWidth="0.5" />
        <path d="M44 55v5" fill="none" strokeWidth="0.5" />
        <path d="M44 71v-5l-2-6" fill="none" strokeWidth="0.5" />
        <path d="M80 50H57.504" fill="none" strokeWidth="0.5" />
        <circle cx="55" cy="50" r="2.5" strokeWidth="0.5" />
        <path d="M10 63h6" fill="none" strokeWidth="0.5" />
        <path d="M16 59v8" fill="none" strokeWidth="0.5" />
        <path d="M19 59v8" fill="none" strokeWidth="0.5" />
        <path d="M19 63h6" fill="none" strokeWidth="0.5" />
        <path d="M15 33v9" fill="none" strokeWidth="0.5" />
        <path d="M20 42v-9" fill="none" strokeWidth="0.5" />
        <path d="M17.5 30.5l7 7-7 7-7-7z" fill="none" strokeWidth="0.5" />
        <path d="M30 0v22.5" fill="none" strokeWidth="0.5" />
        <path d="M30 100V77.5" fill="none" strokeWidth="0.5" />
        <path d="M47.5 42.5L46 41l-.75 1.75 2.25-.25" fill="#000" strokeWidth="0.5" />
        <path d="M40 32.5v10" fill="none" strokeWidth="0.5" />
        <path d="M37.5 37.5H40" fill="none" strokeWidth="0.5" />
        <path d="M40 35l7.5-2.5" fill="none" strokeWidth="0.5" />
        <path d="M40 40l7.5 2.5" fill="none" strokeWidth="0.5" />

        <text fontSize="7" fill="#000" textAnchor="end" stroke="none">
          <tspan x="28.004" y="6.81">
            BR
          </tspan>
          <tspan x="28.004" y="96.81">
            BL
          </tspan>
          <tspan x="78.004" y="46.81">
            BK
          </tspan>
        </text>
      </g>
    </svg>
  );
}
