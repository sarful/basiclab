"use client";

type ThermalCurrentOverload2PSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ThermalCurrentOverload2PSymbol({
  className = "",
  label = "Thermal / Current Overload 2P",
  width = 220,
  height = 260,
}: ThermalCurrentOverload2PSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 61 71"
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
        <path d="M0 25h40v10H0z" strokeWidth="0.5" />
        <path d="M7.5 27.5l-1 5" fill="none" strokeWidth="0.5" />
        <path d="M6.5 27.5h2" fill="none" strokeWidth="0.5" />
        <path d="M5.5 32.5h2" fill="none" strokeWidth="0.5" />
        <path d="M10.5 27.5l4 2.5-4 2.5" fill="none" strokeWidth="0.5" />
        <path d="M27.5 27.5l-1 5" fill="none" strokeWidth="0.5" />
        <path d="M26.5 27.5h2" fill="none" strokeWidth="0.5" />
        <path d="M25.5 32.5h2" fill="none" strokeWidth="0.5" />
        <path d="M30.5 27.5l4 2.5-4 2.5" fill="none" strokeWidth="0.5" />
        <path d="M0 15h40v10H0z" strokeWidth="0.5" />
        <path d="M10 25v-3h5v-4h-5v-3" fill="none" strokeWidth="0.5" />
        <path d="M30 25v-3h5v-4h-5v-3" fill="none" strokeWidth="0.5" />
        <path d="M10 0v15" fill="none" strokeWidth="0.5" />
        <path d="M30 0v15" fill="none" strokeWidth="0.5" />
        <path d="M10 50V35" fill="none" strokeWidth="0.5" />
        <path d="M30 50V35" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="8" y="9">
            1
          </tspan>
          <tspan x="8" y="46.81">
            2
          </tspan>
          <tspan x="28" y="9">
            3
          </tspan>
          <tspan x="28" y="46.81">
            4
          </tspan>
        </text>
      </g>
    </svg>
  );
}
