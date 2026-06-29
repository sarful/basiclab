"use client";

type LEDSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LEDSymbol({
  className = "",
  label = "Counter Switch NC",
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
        <path d="M27.5 15L20 35v15" fill="none" strokeWidth="0.5" />
        <path d="M20 0v18h10" fill="none" strokeWidth="0.5" />
        <path
          d="M23.5 25H15"
          fill="none"
          strokeDasharray="1.5 2"
          strokeWidth="0.5"
        />
        <path d="M5 20h10v10H5z" strokeWidth="0.5" />
        <circle cx="10" cy="25" r="2.5" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="18.001" y="9">
            11
          </tspan>
          <tspan x="18.001" y="46.81">
            12
          </tspan>
        </text>
      </g>
    </svg>
  );
}
