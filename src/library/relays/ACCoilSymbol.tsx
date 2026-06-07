"use client";

type ACCoilSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ACCoilSymbol({
  className = "",
  label = "AC Coil",
  width = 220,
  height = 300,
}: ACCoilSymbolProps) {
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
        <path d="M10 20h20v10H10z" strokeWidth="0.5" />
        <path d="M20 0v20" fill="none" strokeWidth="0.5" />
        <path d="M20 30v20" fill="none" strokeWidth="0.5" />
        <path d="M0 20h10v10H0z" strokeWidth="0.5" />
        <path
          d="M1.14 25.042l1.433-1.91c.172-.203.382-.323.593-.323s.409.115.58.318l2.648 3.745c.172.203.346.318.557.318s.409-.115.58-.318l1.33-1.831"
          strokeWidth="0.5"
        />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="18.001" y="9">
            A1
          </tspan>
          <tspan x="18.001" y="46.81">
            A2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
