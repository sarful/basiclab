"use client";

type SymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LimitSwitchNCSymbol({
  className = "",
  label = "Limit Switch NC",
  width = 220,
  height = 130,
}: SymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 41"
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
        <path d="M0 10h12.5" fill="none" strokeWidth="0.5" />
        <path d="M50 10H37.5" fill="none" strokeWidth="0.5" />
        <circle cx="15" cy="10" r="2.5" strokeWidth="0.5" />
        <circle cx="35" cy="10" r="2.5" strokeWidth="0.5" />
        <path d="M31.5 8L30 12.5 17.5 10 35 7.5" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="6.81">
            11
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="48" y="6.81">
            12
          </tspan>
        </text>
      </g>
    </svg>
  );
}
