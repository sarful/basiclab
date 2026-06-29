"use client";

type LEDSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LEDSymbol({
  className = "",
  label = "Counter - Pulse",
  width = 220,
  height = 280,
}: LEDSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 51 71"
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
        <path d="M0 20h30v10H0z" strokeWidth="0.5" />
        <path d="M20 20v10" fill="none" strokeWidth="0.5" />
        <circle cx="25" cy="25" r="2.5" fill="none" strokeWidth="0.5" />
        <path d="M10 20V0" fill="none" strokeWidth="0.5" />
        <path d="M10 30v20" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="7.999" y="9">
            1
          </tspan>
          <tspan x="7.999" y="46.81">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
