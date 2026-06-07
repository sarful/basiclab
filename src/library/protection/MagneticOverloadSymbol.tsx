"use client";

type MagneticOverloadSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function MagneticOverloadSymbol({
  className = "",
  label = "Magnetic Overload",
  width = 220,
  height = 280,
}: MagneticOverloadSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 81"
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
        <g fill="none" strokeWidth="0.5">
          <path d="M50 10H30l-2.5 5-5-10-2.5 5H0" />
          <path d="M50 30H30l-2.5 5-5-10-2.5 5H0" />
          <path d="M50 50H30l-2.5 5-5-10-2.5 5H0" />
        </g>

        <text fontSize="7" fill="#000" textAnchor="start" stroke="none">
          <tspan x="2" y="6.808">
            1
          </tspan>
        </text>
        <text fontSize="7" fill="#000" textAnchor="end" stroke="none">
          <tspan x="48" y="6.808">
            2
          </tspan>
        </text>
        <text fontSize="7" fill="#000" textAnchor="start" stroke="none">
          <tspan x="2" y="26.812">
            3
          </tspan>
        </text>
        <text fontSize="7" fill="#000" textAnchor="end" stroke="none">
          <tspan x="48" y="26.812">
            4
          </tspan>
        </text>
        <text fontSize="7" fill="#000" textAnchor="start" stroke="none">
          <tspan x="2" y="46.81">
            5
          </tspan>
        </text>
        <text fontSize="7" fill="#000" textAnchor="end" stroke="none">
          <tspan x="48" y="46.81">
            6
          </tspan>
        </text>
      </g>
    </svg>
  );
}
