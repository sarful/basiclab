"use client";

type LEDSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LEDSymbol({
  className = "",
  label = "Counter Switch NO",
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
        <path d="M20 0v15" fill="none" strokeWidth="0.5" />
        <path d="M15 15l5 20v15" fill="none" strokeWidth="0.5" />
        <path
          d="M17.5 25H10"
          fill="none"
          strokeDasharray="1.5 2"
          strokeWidth="0.5"
        />
        <path d="M0 20h10v10H0z" strokeWidth="0.5" />
        <circle cx="5" cy="25" r="2.5" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="18.001" y="9">
            13
          </tspan>
          <tspan x="18.001" y="46.81">
            14
          </tspan>
        </text>
      </g>
    </svg>
  );
}
