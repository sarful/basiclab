"use client";

type SolidStateRelayDCSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function SolidStateRelayDCSymbol({
  className = "",
  label = "Solid State Relay, DC",
  width = 260,
  height = 200,
}: SolidStateRelayDCSymbolProps) {
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
        <path d="M0 10h14v6.875" fill="none" strokeWidth="0.5" />
        <path d="M50 23l-3.75-6h7.5z" fill="none" strokeWidth="0.5" />
        <path d="M52.5 23h-5" fill="none" strokeWidth="0.5" />
        <path d="M0 30h14v-7" fill="none" strokeWidth="0.5" />
        <path d="M10.25 23h7.5L14 17z" fill="none" strokeWidth="0.5" />
        <path d="M11.5 17h5" fill="none" strokeWidth="0.5" />
        <path d="M60 10H40v10h-4" fill="none" strokeWidth="0.5" />
        <path d="M60 30H40v-7h-4" fill="none" strokeWidth="0.5" />
        <path d="M50 10v7" fill="none" strokeWidth="0.5" />
        <path d="M50 30v-7" fill="none" strokeWidth="0.5" />

        <g transform="matrix(.642788 .766044 -.766044 .642788 23.356852 11.233956)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.258819 .965926 -.965926 -.258819 21.7017 13.928531)">
          <path d="M0 0l2.697 1.918" fill="none" strokeWidth="0.5" />
        </g>
        <g transform="matrix(.642788 .766044 -.766044 .642788 23.356852 15.233956)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.258819 .965926 -.965926 -.258819 21.7017 17.928531)">
          <path d="M0 0l2.697 1.918" fill="none" strokeWidth="0.5" />
        </g>

        <path d="M36 20l2-1v2z" fill="#000" strokeWidth="0.5" />
        <path d="M36 19v2" fill="none" strokeWidth="0.5" />
        <path d="M36 22v2" fill="none" strokeWidth="0.5" />
        <path d="M40 17h-4" fill="none" strokeWidth="0.5" />
        <path d="M36 16v2" fill="none" strokeWidth="0.5" />
        <path d="M34 16v8h-2" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="62" y="6.81">
            -1
          </tspan>
          <tspan x="62" y="26.81">
            +2
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
