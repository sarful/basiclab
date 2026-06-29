"use client";

type OnDelayNCContactSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function OnDelayNCContactSymbol({
  className = "",
  label = "On Delay NC Contact",
  width = 160,
  height = 260,
}: OnDelayNCContactSymbolProps) {
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
        <path d="M.5 27H13" fill="none" strokeWidth="0.5" />
        <path d="M14.5 23H.5" fill="none" strokeWidth="0.5" />
        <path
          d="M4.5 30A4.99 4.99 0 0 1 0 25.025a4.99 4.99 0 0 1 4.5-4.975"
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
