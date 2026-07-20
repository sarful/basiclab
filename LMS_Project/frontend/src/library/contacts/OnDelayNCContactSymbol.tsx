"use client";

export type OnDelayNCContactSymbolProps = {
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
  showDelayMark?: boolean;
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export default function OnDelayNCContactSymbol({
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
  showDelayMark = true,
  width = 82,
  height = 142,
  strokeWidth,
  leftLabel,
  rightLabel,
}: OnDelayNCContactSymbolProps) {
  const cableStroke = wireStroke ?? strokeWidth ?? 1.2;
  const textColor = "#111111";

  // Timer relay NC contact default terminals
  const resolvedTerminalA = terminalA ?? leftLabel ?? "15";
  const resolvedTerminalB = terminalB ?? rightLabel ?? "16";

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

      {/* NC moving contact arm */}
      {closed ? (
        // Normal NC state: contact is closed
        <path d="M17.5 15L10 35v15" strokeWidth={cableStroke} fill="none" />
      ) : (
        // Actuated/timed state: contact is open
        <path d="M4 15l6 20v15" strokeWidth={cableStroke} fill="none" />
      )}

      {/* On-delay marker */}
      {showDelayMark ? (
        <g strokeWidth={cableStroke} fill="none">
          <path d="M0.5 27H13" />
          <path d="M14.5 23H0.5" />
          <path d="M4.5 30A4.99 4.99 0 0 1 0 25.025a4.99 4.99 0 0 1 4.5-4.975" />
        </g>
      ) : null}

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
      aria-label={label || "On Delay NC Contact"}
    >
      {symbol}
    </svg>
  );
}
