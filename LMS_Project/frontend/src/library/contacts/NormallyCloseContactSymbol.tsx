export type NormallyCloseContactProps = {
  x?: number;
  y?: number;
  scale?: number;
  closed?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  terminalA?: string;
  terminalB?: string;
  orientation?: "horizontal" | "vertical";
  wireStroke?: number;
  textSize?: number;
  showTerminals?: boolean;
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export default function NormallyCloseContact({
  x = 0,
  y = 0,
  scale = 1,
  closed = true,
  label = "",
  className = "",
  standalone = true,
  strokeColor = "#111111",
  terminalA,
  terminalB,
  orientation = "vertical",
  wireStroke,
  textSize = 7,
  showTerminals = true,
  width = 82,
  height = 142,
  strokeWidth,
  leftLabel,
  rightLabel,
}: NormallyCloseContactProps) {
  const cableStroke = wireStroke ?? strokeWidth ?? 1.2;
  const textColor = "#111111";

  // IEC-style default terminal numbers for NC auxiliary contact
  const resolvedTerminalA = terminalA ?? leftLabel ?? "21";
  const resolvedTerminalB = terminalB ?? rightLabel ?? "22";

  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];

  const rotationCenterX = 10;
  const rotationCenterY = 25;

  if (orientation === "horizontal") {
    transformParts.push(`rotate(-90 ${rotationCenterX} ${rotationCenterY})`);
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      {label ? (
        <text
          x={rotationCenterX}
          y="63"
          textAnchor="middle"
          fontSize={textSize}
          fill={textColor}
          stroke="none"
        >
          {label}
        </text>
      ) : null}

      {/* Top wire and fixed contact */}
      <path d="M10 0v18h10" strokeWidth={cableStroke} fill="none" />

      {/* Moving contact arm */}
      {closed ? (
        // NC normal state: closed contact
        <path d="M17.5 15L10 35v15" strokeWidth={cableStroke} fill="none" />
      ) : (
        // Actuated/open state
        <path d="M4 15l6 20v15" strokeWidth={cableStroke} fill="none" />
      )}

      {showTerminals ? (
        <g fill={textColor} stroke="none" fontSize={textSize}>
          <text x="8" y="9" textAnchor="end">
            {resolvedTerminalA}
          </text>
          <text x="8" y="46.81" textAnchor="end">
            {resolvedTerminalB}
          </text>
        </g>
      ) : null}
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  const viewBox =
    orientation === "vertical" ? "-10 -10 41 71" : "-10 -10 71 41";

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={label || "Normally Close Contact"}
    >
      {symbol}
    </svg>
  );
}
