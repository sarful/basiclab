type MCBControl2PProps = {
  x?: number;
  y?: number;
  scale?: number;
  on?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  wireStroke?: number;
  textSize?: number;
  showTerminals?: boolean;
};

export default function MCBControl2P({
  x = 0,
  y = 0,
  scale = 1,
  on = true,
  label = "MCB",
  className = "",
  standalone = true,
  strokeColor = "#111111",
  wireStroke = 0.5,
  textSize = 0.5,
  showTerminals = true,
}: MCBControl2PProps) {
  const contactLift = on ? 0 : -6;
  const cableStroke = wireStroke;

  const symbol = (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto, system-ui, sans-serif"
    >
      <path d="M0 10h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 10H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="10" r="2.5" strokeWidth={cableStroke} />
      <circle cx="35" cy="10" r="2.5" strokeWidth={cableStroke} />
      <path d="M0 30h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 30H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="30" r="2.5" strokeWidth={cableStroke} />
      <circle cx="35" cy="30" r="2.5" strokeWidth={cableStroke} />
      <path d={`M35 ${5 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`} strokeWidth={cableStroke} fill="none" />
      <path d="M25 2.5v20" strokeDasharray="1.5 2" strokeWidth={cableStroke} fill="none" />
      <path d={`M35 ${25 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`} strokeWidth={cableStroke} fill="none" />

      {showTerminals ? (
        <g fill="#111111" stroke="none" fontSize={textSize}>
          <text x="2" y="6.81" textAnchor="start">1</text>
          <text x="48" y="6.81" textAnchor="end">2</text>
          <text x="2" y="26.81" textAnchor="start">3</text>
          <text x="48" y="26.81" textAnchor="end">4</text>
        </g>
      ) : null}

      {label ? (
        <text
          x="25"
          y="48"
          textAnchor="middle"
          fontSize={textSize}
          fontWeight="700"
          fill="#111111"
          stroke="none"
        >
          {label}
        </text>
      ) : null}
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox="-10 -10 71 61"
      className={`h-32 w-24 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
