export default function CurrentSourcesInSeries() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 19,
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 20,
    fontWeight: "bold",
  };

  const currentSourceVertical = (
    cx: number,
    cy: number,
    value: string,
    direction = "up"
  ) => {
    const startY = direction === "up" ? cy + 26 : cy - 26;
    const endY = direction === "up" ? cy - 26 : cy + 26;

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="38"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <line
          x1={cx}
          y1={startY}
          x2={cx}
          y2={endY}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />

        <text
          x={cx + 48}
          y={cy + 8}
          dominantBaseline="middle"
          style={labelStyle}
        >
          {value}
        </text>
      </g>
    );
  };

  const currentSourceHorizontal = (
    cx: number,
    cy: number,
    value: string,
    direction = "right"
  ) => {
    const startX = direction === "right" ? cx - 26 : cx + 26;
    const endX = direction === "right" ? cx + 26 : cx - 26;

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="38"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <line
          x1={startX}
          y1={cy}
          x2={endX}
          y2={cy}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />

        <text
          x={cx}
          y={cy + 62}
          textAnchor="middle"
          style={labelStyle}
        >
          {value}
        </text>
      </g>
    );
  };

  const circuitWithTwoSources = () => {
    const leftX = 80;
    const topY = 80;
    const bottomY = 300;
    const topSourceX = 250;
    const terminalX = 430;

    return (
      <g>
        <text x="250" y="38" textAnchor="middle" style={titleStyle}>
          Current Sources in Series
        </text>

        {/* Loop wires */}
        <line
          x1={leftX}
          y1={topY}
          x2={topSourceX - 38}
          y2={topY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={topSourceX + 38}
          y1={topY}
          x2={terminalX}
          y2={topY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY}
          x2={leftX}
          y2={topY + 70}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY + 146}
          x2={leftX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={bottomY}
          x2={terminalX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* ANSI current source symbols */}
        {currentSourceVertical(leftX, topY + 108, "5A", "up")}
        {currentSourceHorizontal(topSourceX, topY, "8A", "right")}

        {/* Output terminals */}
        <circle
          cx={terminalX}
          cy={topY}
          r="5.5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <circle
          cx={terminalX}
          cy={bottomY}
          r="5.5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <text x={terminalX + 22} y={topY + 8} style={labelStyle}>
          A
        </text>

        <text x={terminalX + 22} y={bottomY + 8} style={labelStyle}>
          B
        </text>

        {/* Output current reference */}
        <line
          x1={310}
          y1={topY - 28}
          x2={405}
          y2={topY - 28}
          stroke="black"
          strokeWidth="2.5"
          markerEnd="url(#arrow)"
        />

        <text x="350" y={topY - 48} style={smallStyle}>
          i
        </text>

        <text x="410" y={topY - 43} style={smallStyle}>
          +
        </text>

        {/* Output voltage reference */}
        <line
          x1={terminalX + 55}
          y1={topY + 35}
          x2={terminalX + 55}
          y2={bottomY - 35}
          stroke="black"
          strokeWidth="2.2"
          strokeDasharray="6 6"
          markerEnd="url(#arrow)"
        />

        <text x={terminalX + 70} y={topY + 58} style={smallStyle}>
          +
        </text>

        <text x={terminalX + 73} y={bottomY - 30} style={smallStyle}>
          −
        </text>

        <text
          x={terminalX + 82}
          y={(topY + bottomY) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={labelStyle}
        >
          v
        </text>

        <text
          x="250"
          y="365"
          textAnchor="middle"
          style={smallStyle}
        >
          Different current values in series are not normally valid
        </text>
      </g>
    );
  };

  const equivalentCircuit = () => {
    const leftX = 610;
    const topY = 80;
    const bottomY = 300;
    const terminalX = 890;

    return (
      <g>
        <text x="750" y="38" textAnchor="middle" style={titleStyle}>
          Series Current Source Condition
        </text>

        {/* Loop wires */}
        <line
          x1={leftX}
          y1={topY}
          x2={terminalX}
          y2={topY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY}
          x2={leftX}
          y2={topY + 70}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY + 146}
          x2={leftX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={bottomY}
          x2={terminalX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Single equivalent current source */}
        {currentSourceVertical(leftX, topY + 108, "5A", "up")}

        {/* Current note */}
        <text x="705" y="178" style={labelStyle}>
          i = 10A
        </text>
        <text x="730" y="212" style={labelStyle}>
          or
        </text>
        <text x="705" y="246" style={labelStyle}>
          i = 2A
        </text>

        {/* Output terminals */}
        <circle
          cx={terminalX}
          cy={topY}
          r="5.5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <circle
          cx={terminalX}
          cy={bottomY}
          r="5.5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <text x={terminalX + 22} y={topY + 8} style={labelStyle}>
          A
        </text>

        <text x={terminalX + 22} y={bottomY + 8} style={labelStyle}>
          B
        </text>

        {/* Output current reference */}
        <line
          x1={735}
          y1={topY - 28}
          x2={865}
          y2={topY - 28}
          stroke="black"
          strokeWidth="2.5"
          markerEnd="url(#arrow)"
        />

        <text x="790" y={topY - 48} style={smallStyle}>
          i
        </text>

        <text x="870" y={topY - 43} style={smallStyle}>
          +
        </text>

        {/* Output voltage reference */}
        <line
          x1={terminalX + 55}
          y1={topY + 35}
          x2={terminalX + 55}
          y2={bottomY - 35}
          stroke="black"
          strokeWidth="2.2"
          strokeDasharray="6 6"
          markerEnd="url(#arrow)"
        />

        <text x={terminalX + 70} y={topY + 58} style={smallStyle}>
          +
        </text>

        <text x={terminalX + 73} y={bottomY - 30} style={smallStyle}>
          −
        </text>

        <text
          x={terminalX + 82}
          y={(topY + bottomY) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={labelStyle}
        >
          v
        </text>

        <text
          x="750"
          y="365"
          textAnchor="middle"
          style={smallStyle}
        >
          Series current sources must force the same current
        </text>
      </g>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 420"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Current Sources in Series</title>
          <desc id="desc">
            Black and white circuit diagram showing ideal current sources in
            series using ANSI current source symbols, output terminals A and B,
            current direction, and voltage reference.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          <rect width="1000" height="420" fill="white" />

          {circuitWithTwoSources()}
          {equivalentCircuit()}
        </svg>
      </div>
    </main>
  );
}
