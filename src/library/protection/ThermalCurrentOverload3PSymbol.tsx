"use client";

type SymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ThermalCurrentOverload3PSymbol({
  className = "",
  label = "Thermal / Current Overload 3P",
  width = 240,
  height = 220,
}: SymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 81 71"
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
        <path
          d="M50 0v20M30 0v20M10 0v20m0 30V30m20 20V30m20 20V30"
          fill="none"
          strokeWidth="0.5"
        />
        <path d="M0 15h60v10H0z" strokeWidth="0.5" />
        <path
          d="M10 25v-2.5h5v-5h-5V15m20 10v-2.5h5v-5h-5V15m20 10v-2.5h5v-5h-5V15"
          fill="none"
          strokeWidth="0.5"
        />
        <path d="M0 25h60v10H0z" strokeWidth="0.5" />
        <g fill="none">
          <path d="M7.5 27.5l-1 5" strokeWidth="0.5" />
          <path
            d="M6.5 27.5h2m-3 5h2m3-5l4 2.5-4 2.5m17-5l-1 5"
            strokeWidth="0.5"
          />
          <path
            d="M26.5 27.5h2m-3 5h2m3-5l4 2.5-4 2.5m17-5l-1 5"
            strokeWidth="0.5"
          />
          <path
            d="M46.5 27.5h2m-3 5h2m3-5l4 2.5-4 2.5"
            strokeWidth="0.5"
          />
        </g>
        <text fontSize="7" fill="#000" textAnchor="end" stroke="none">
          <tspan x="8.002" y="9">
            1
          </tspan>
          <tspan x="8.002" y="46.81">
            2
          </tspan>
          <tspan x="28" y="9">
            3
          </tspan>
          <tspan x="28" y="46.81">
            4
          </tspan>
          <tspan x="47.998" y="9">
            5
          </tspan>
          <tspan x="47.998" y="46.81">
            6
          </tspan>
        </text>
      </g>
    </svg>
  );
}
