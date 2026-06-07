type ACMotor3P6TerminalProps = {
  x?: number;
  y?: number;
  scale?: number;
  label?: string;
  className?: string;
  standalone?: boolean;
  orientation?: "horizontal" | "vertical";
  showTerminalLabels?: boolean;
};

export default function ACMotor3P6Terminal({
  x = 0,
  y = 0,
  scale = 1,
  label = "3-Phase Motor - 6 Terminal",
  className = "",
  standalone = true,
  orientation = "horizontal",
  showTerminalLabels = true,
}: ACMotor3P6TerminalProps) {
  const captionColor = "#111111";
  const cableStroke = 0.5;
  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];

  if (orientation === "vertical") {
    transformParts.push("rotate(-90 29 30)");
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="none"
      stroke="#111111"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="29" cy="30.071" r="16" fill="white" strokeWidth={cableStroke} />
      <path
        d="M25.75 21.836h1.135l2.179 5.339 2.179-5.339h1.14v6.544h-.879v-2.548l.082-2.75-2.188 5.299h-.673l-2.184-5.285.087 2.737v2.548h-.879v-6.544z"
        fill="#111111"
        stroke="none"
      />
      <path d="M36.567 34.767c-4.687 6.903-4.687-6.903-9.375 0" strokeWidth={cableStroke} />
      <path
        d="M22.787 35.057v-.611h.573q.54-.008.849-.279.309-.271.309-.732 0-1.035-1.051-1.035-.494 0-.789.277-.295.277-.295.734h-.762q0-.7.521-1.163.521-.463 1.325-.463.849 0 1.331.441.482.441.482 1.226 0 .384-.253.744-.253.36-.69.538.494.154.764.51.27.356.27.87 0 .793-.527 1.258-.527.465-1.372.465-.845 0-1.374-.449-.529-.449-.529-1.185h.766q0 .465.309.744.309.279.828.279.552 0 .845-.283.293-.283.293-.813 0-.514-.321-.789-.321-.275-.927-.283h-.573z"
        fill="#111111"
        stroke="none"
      />
      <path d="M29.99995 59.999953v-13.75" strokeWidth={cableStroke} />
      <path d="M41.584 40.415l8.415 8.415v11.17" strokeWidth={cableStroke} />
      <path d="M17.495 41.495L10 48.99V60" strokeWidth={cableStroke} />
      <path d="M30.0006 14.0001V-.0969" strokeWidth={cableStroke} />
      <path d="M50.004 0v11.489l-8.7 8.7" strokeWidth={cableStroke} />
      <path d="M10 0v11.17l7.798 7.798" strokeWidth={cableStroke} />

      {showTerminalLabels ? (
        orientation === "vertical" ? (
          <>
            <text x="12" y="6" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              U1
            </text>
            <text x="29" y="2" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              V1
            </text>
            <text x="46" y="6" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              W1
            </text>
            <text x="12" y="56" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              U2
            </text>
            <text x="29" y="60" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              V2
            </text>
            <text x="46" y="56" textAnchor="middle" fontSize="0.5" fill="#111111" stroke="none">
              W2
            </text>
          </>
        ) : (
          <>
            <text x="8.004" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              U1
            </text>
            <text x="28.004" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              V1
            </text>
            <text x="48.004" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              W1
            </text>
            <text x="8.004" y="56.812" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              U2
            </text>
            <text x="28.004" y="56.812" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              V2
            </text>
            <text x="48.004" y="56.812" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
              W2
            </text>
          </>
        )
      ) : null}

      {standalone && label ? (
        <text x="29" y="72" textAnchor="middle" fontSize="0.5" fill={captionColor} stroke="none">
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
      viewBox={orientation === "vertical" ? "-10 -10 81 101" : "-10 -10 101 81"}
      className={`h-48 w-52 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
