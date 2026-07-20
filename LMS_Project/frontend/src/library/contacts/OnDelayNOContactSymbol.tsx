"use client";

export type OnDelayNOContactSymbolProps = {
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

export default function OnDelayNOContactSymbol({
  x = 0,
  y = 0,
  scale = 1,
  closed = false,
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
  width = 96,
  height = 142,
  strokeWidth,
  leftLabel,
  rightLabel,
}: OnDelayNOContactSymbolProps) {
  const cableStroke = wireStroke ?? strokeWidth ?? 1.2;
  const textColor = "#111111";

  // Timer relay NO contact default terminals
  const resolvedTerminalA = terminalA ?? leftLabel ?? "17";
  const resolvedTerminalB = terminalB ?? rightLabel ?? "18";

  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];

  const rotationCenterX = 20;
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

      {/* Top wire */}
      <path d="M20 0v15" strokeWidth={cableStroke} fill="none" />

      {/* NO moving contact arm */}
      {closed ? (
        // Timed/actuated state: contact is closed
        <path d="M20 15v35" strokeWidth={cableStroke} fill="none" />
      ) : (
        // Normal NO state: contact is open
        <path d="M15 15l5 20v15" strokeWidth={cableStroke} fill="none" />
      )}

      {/* On-delay marker */}
      {showDelayMark ? (
        <g strokeWidth={cableStroke} fill="none">
          <path d="M5.75 27H18" />
          <path d="M16.75 23h-11" />
          <path d="M10 30c-2.815-.249-5-2.374-5-4.976s2.185-4.726 5-4.975" />
        </g>
      ) : null}

      {showTerminals ? (
        <g fill={textColor} stroke="none" fontSize={textSize}>
          <text x="18" y="9" textAnchor="end">
            {resolvedTerminalA}
          </text>
          <text x="18" y="46.81" textAnchor="end">
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
    orientation === "vertical" ? "-10 -10 51 71" : "-10 -10 71 51";

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={label || "On Delay NO Contact"}
    >
      {symbol}
    </svg>
  );
}
