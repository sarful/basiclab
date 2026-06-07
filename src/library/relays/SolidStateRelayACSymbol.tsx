"use client";

type SolidStateRelayACSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function SolidStateRelayACSymbol({
  className = "",
  label = "Solid State Relay, AC",
  width = 260,
  height = 200,
}: SolidStateRelayACSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 81 61"
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
        <path d="M0 0h60v40H0z" strokeWidth="0.5" />
        <path d="M0 10h10v6.875" fill="none" strokeWidth="0.5" />
        <path d="M40 23l-3.75-6h7.5z" fill="none" strokeWidth="0.5" />
        <path d="M42.5 23h-5" fill="none" strokeWidth="0.5" />
        <path d="M0 30h10v-7" fill="none" strokeWidth="0.5" />
        <path d="M6.25 23h7.5L10 17z" fill="none" strokeWidth="0.5" />
        <path d="M7.5 17h5" fill="none" strokeWidth="0.5" />
        <path d="M60 10H30v7" fill="none" strokeWidth="0.5" />
        <path d="M60 30H30v-7" fill="none" strokeWidth="0.5" />
        <path d="M26.25 23h7.5L30 17z" fill="none" strokeWidth="0.5" />
        <path d="M27.5 17h5" fill="none" strokeWidth="0.5" />
        <path d="M40 10v7" fill="none" strokeWidth="0.5" />
        <path d="M40 30v-7" fill="none" strokeWidth="0.5" />
        <path
          d="M50 10v2l-3 .667L53 14l-6 1.333 6 1.333L47 18l6 1.333L50 20v4"
          fill="none"
          strokeWidth="0.5"
        />
        <path d="M50 30v-4" fill="none" strokeWidth="0.5" />
        <path d="M47 26h6" fill="none" strokeWidth="0.5" />
        <path d="M47 24h6" fill="none" strokeWidth="0.5" />
        <path d="M30 17l3-3h3" fill="none" strokeWidth="0.5" />
        <path d="M40 23l-3 3h-3" fill="none" strokeWidth="0.5" />

        <g transform="matrix(.642788 .766044 -.766044 .642788 19.356852 11.233956)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.258819 .965926 -.965926 -.258819 17.7017 13.928531)">
          <path d="M0 0l2.697 1.918" fill="none" strokeWidth="0.5" />
        </g>
        <g transform="matrix(.642788 .766044 -.766044 .642788 19.356852 15.233956)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.258819 .965926 -.965926 -.258819 17.7017 17.928531)">
          <path d="M0 0l2.697 1.918" fill="none" strokeWidth="0.5" />
        </g>

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="62" y="6.81">
            1
          </tspan>
          <tspan x="62" y="26.81">
            2
          </tspan>
        </text>
        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="-2" y="26.81">
            +3
          </tspan>
          <tspan x="-2" y="6.81">
            -4
          </tspan>
        </text>
      </g>
    </svg>
  );
}
