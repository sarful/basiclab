"use client";

type OffDelayNCContactSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function OffDelayNCContactSymbol({
  className = "",
  label = "Off Delay NC Contact",
  width = 180,
  height = 260,
}: OffDelayNCContactSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 41 71"
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
        <path d="M17.5 15L10 35v15" fill="none" strokeWidth="0.5" />
        <path d="M10 0v18h10" fill="none" strokeWidth="0.5" />
        <path d="M4.25 27h8.5" fill="none" strokeWidth="0.5" />
        <path d="M14.5 23H4.25" fill="none" strokeWidth="0.5" />
        <path
          d="M0 20.049a4.99 4.99 0 0 1 4.5 4.975A4.99 4.99 0 0 1 0 30"
          fill="none"
          strokeWidth="0.5"
        />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="8" y="9">
            15
          </tspan>
          <tspan x="8" y="46.81">
            16
          </tspan>
        </text>
      </g>
    </svg>
  );
}
