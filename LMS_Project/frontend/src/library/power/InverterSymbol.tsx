"use client";

type InverterSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function InverterSymbol({
  className = "",
  label = "VFD / Inverter",
  width = 220,
  height = 680,
}: InverterSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 111 341"
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
        <rect width="90" height="320" rx="5" strokeWidth="0.5" />

        <text fill="#000" stroke="none" fontSize="7" textAnchor="start">
          <tspan x="2" y="22.31">
            L1/R
          </tspan>
          <tspan x="2" y="42.31">
            L2/S
          </tspan>
          <tspan x="2" y="62.31">
            L3/T
          </tspan>
        </text>

        <text fill="#000" stroke="none" fontSize="7" textAnchor="end">
          <tspan x="88" y="22.31">
            T1/U
          </tspan>
          <tspan x="88" y="42.31">
            T2/V
          </tspan>
          <tspan x="88" y="62.31">
            T3/W
          </tspan>
          <tspan x="88" y="82.31">
            +10v
          </tspan>
          <tspan x="88" y="102.31">
            0v
          </tspan>
          <tspan x="88" y="122.31">
            Al+
          </tspan>
          <tspan x="88" y="142.31">
            Al-
          </tspan>
          <tspan x="88" y="162.31">
            AO+
          </tspan>
          <tspan x="88" y="182.31">
            AO-
          </tspan>
          <tspan x="88" y="202.31">
            COM
          </tspan>
          <tspan x="88" y="222.31">
            FWD
          </tspan>
          <tspan x="88" y="242.31">
            REV
          </tspan>
          <tspan x="88" y="262.31">
            COM
          </tspan>
          <tspan x="88" y="282.31">
            NO
          </tspan>
          <tspan x="88" y="302.31">
            NC
          </tspan>
        </text>

        <path d="M35 114h25v36H35z" strokeWidth="0.5" />
        <text fill="#000" stroke="none" fontSize="8">
          <tspan x="41.5" y="123.14">
            A
          </tspan>
          <tspan x="53.5" y="146.14">
            D
          </tspan>
        </text>
        <path d="M60 114l-25 36" fill="none" strokeWidth="0.5" />
        <path d="M65 124v-4l-5 2z" strokeWidth="0.5" />
        <path d="M70 122h-5" fill="none" strokeWidth="0.5" />
        <path d="M65 144v-4l-5 2z" strokeWidth="0.5" />
        <path d="M70 142h-5" fill="none" strokeWidth="0.5" />

        <path d="M35 154h25v36H35z" strokeWidth="0.5" />
        <text fill="#000" stroke="none" fontSize="8">
          <tspan x="41.5" y="163.14">
            A
          </tspan>
          <tspan x="53.5" y="186.14">
            D
          </tspan>
        </text>
        <path d="M60 154l-25 36" fill="none" strokeWidth="0.5" />
        <path d="M65 164v-4l5 2z" strokeWidth="0.5" />
        <path d="M60 162h5" fill="none" strokeWidth="0.5" />
        <path d="M65 184v-4l5 2z" strokeWidth="0.5" />
        <path d="M60 182h5" fill="none" strokeWidth="0.5" />

        <path d="M35 255h25v50H35z" strokeWidth="0.5" />
        <path d="M70 260H40.5v30.5l17.5 6" fill="none" strokeWidth="0.5" />
        <path d="M70 299.5H55V293" fill="none" strokeWidth="0.5" />
        <path d="M55 286.5V280h15" fill="none" strokeWidth="0.5" />

        <text
          transform="matrix(0 -1 1 0 35 245)"
          fill="#000"
          stroke="none"
          fontSize="8"
        >
          <tspan x="25" y="7.64">
            Inverter
          </tspan>
        </text>
      </g>
    </svg>
  );
}
