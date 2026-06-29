"use client";

type OnDelayNOContactSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function OnDelayNOContactSymbol({
  className = "",
  label = "On Delay NO Contact",
  width = 220,
  height = 280,
}: OnDelayNOContactSymbolProps) {
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
        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="18.001" y="9">
            17
          </tspan>
          <tspan x="18.001" y="46.81">
            18
          </tspan>
        </text>

        <path d="M20 0v15" fill="none" strokeWidth="0.5" />
        <path d="M15 15l5 20v15" fill="none" strokeWidth="0.5" />
        <path d="M5.75 27H18" fill="none" strokeWidth="0.5" />
        <path d="M16.75 23h-11" fill="none" strokeWidth="0.5" />
        <path
          d="M10 30c-2.815-.249-5-2.374-5-4.976s2.185-4.726 5-4.975"
          fill="none"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
