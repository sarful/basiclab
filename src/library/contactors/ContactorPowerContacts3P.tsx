type ContactorPowerContacts3PProps = {
  x?: number;
  y?: number;
  scale?: number;
  closed?: boolean;
  label?: string;
  showCoilSymbol?: boolean;
  className?: string;
  standalone?: boolean;
};

export default function ContactorPowerContacts3P({
  x = 0,
  y = 0,
  scale = 1,
  closed = true,
  label = "K1",
  showCoilSymbol = true,
  className = "",
  standalone = true,
}: ContactorPowerContacts3PProps) {
  const strokeColor = "#111111";
  const labelColor = "#111111";
  const bladeOffset = closed ? 0 : -6;
  const cableStroke = 0.5;

  const symbol = (
    <g
      transform={`translate(${x + 0.5}, ${y + 0.5}) scale(${scale})`}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto, system-ui, sans-serif"
    >
      <g strokeWidth={cableStroke}>
        <g>
          <path d="M10 0v20c-3.333 0-3.333-5 0-5" />
          <path d={`M10 50V35L${5 + bladeOffset} 15`} fill="none" />
        </g>
        <g>
          <path d="M30 0v20c-3.333 0-3.333-5 0-5" />
          <path d={`M30 50V35l${-5 + bladeOffset}-20`} fill="none" />
        </g>
        <g>
          <path d="M50 0v20c-3.333 0-3.333-5 0-5" />
          <path d={`M50 50V35l${-5 + bladeOffset}-20`} fill="none" />
        </g>
        <path d="M47.5 25h-40" fill="none" strokeDasharray="1.5 2" />
      </g>

      <g fill="#000000" stroke="none" fontSize="0.5">
        <text x="8" y="9" textAnchor="end">1</text>
        <text x="8" y="46.81" textAnchor="end">2</text>
        <text x="28" y="9" textAnchor="end">3</text>
        <text x="28" y="46.81" textAnchor="end">4</text>
        <text x="48" y="9" textAnchor="end">5</text>
        <text x="48" y="46.81" textAnchor="end">6</text>
      </g>

      {showCoilSymbol ? (
        <text
          x="-8"
          y="28"
          textAnchor="end"
          fontSize="0.5"
          fontWeight="700"
          fill={labelColor}
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
      viewBox="-20 -10 81 71"
      className={`h-40 w-64 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
