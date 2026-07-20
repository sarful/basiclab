export default function VoltageSourcesInSeries() {
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
    fontSize: 18,
    fontWeight: "bold",
  };

  const voltageSource = (
    cx: number,
    cy: number,
    polarity: "plusTop" | "plusRight" | "plusLeft"
  ) => {
    let plusX = cx;
    let plusY = cy - 13;
    let minusX = cx;
    let minusY = cy + 16;

    if (polarity === "plusRight") {
      plusX = cx + 16;
      plusY = cy;
      minusX = cx - 16;
      minusY = cy;
    }

    if (polarity === "plusLeft") {
      plusX = cx - 16;
      plusY = cy;
      minusX = cx + 16;
      minusY = cy;
    }

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="34"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />
        <text
          x={plusX}
          y={plusY}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ ...smallStyle, fontWeight: "bold" }}
        >
          +
        </text>
        <text
          x={minusX}
          y={minusY}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ ...smallStyle, fontWeight: "bold" }}
        >
          −
        </text>
      </g>
    );
  };

  const seriesCircuit = (
    offsetX: number,
    mode: "aiding" | "opposing",
    resultVoltage: string,
    equation: string,
    subtitle: string
  ) => {
    const topY = 85;
    const bottomY = 285;
    const leftX = offsetX + 55;
    const rightX = offsetX + 390;

    return (
      <g>
        {/* Main loop wires */}
        <line
          x1={leftX}
          y1={topY}
          x2={leftX + 115}
          y2={topY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX + 235}
          y1={topY}
          x2={rightX}
          y2={topY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={bottomY}
          x2={rightX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY}
          x2={leftX}
          y2={topY + 60}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={leftX}
          y1={topY + 128}
          x2={leftX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Left 10V source */}
        {voltageSource(leftX, topY + 94, "plusTop")}
        <text x={leftX + 42} y={topY + 105} style={labelStyle}>
          10V
        </text>

        {/* Top 5V source */}
        {voltageSource(
          leftX + 175,
          topY,
          mode === "aiding" ? "plusRight" : "plusLeft"
        )}
        <text
          x={leftX + 175}
          y={topY - 47}
          textAnchor="middle"
          style={labelStyle}
        >
          5V
        </text>

        {/* Output terminals */}
        <circle
          cx={rightX}
          cy={topY}
          r="5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />
        <circle
          cx={rightX}
          cy={bottomY}
          r="5"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />

        <text x={rightX + 22} y={topY + 8} style={labelStyle}>
          A
        </text>
        <text x={rightX + 22} y={bottomY + 8} style={labelStyle}>
          B
        </text>

        {/* Current arrow */}
        <line
          x1={leftX - 38}
          y1={topY + 150}
          x2={leftX - 38}
          y2={topY + 74}
          stroke="black"
          strokeWidth="2.4"
          markerEnd="url(#arrow)"
        />

        <text x={leftX - 58} y={topY + 118} style={smallStyle}>
          i
        </text>

        {/* Output voltage reference */}
        <line
          x1={rightX + 55}
          y1={topY + 30}
          x2={rightX + 55}
          y2={bottomY - 30}
          stroke="black"
          strokeWidth="2.2"
          strokeDasharray="5 5"
          markerEnd="url(#arrow)"
        />

        <text x={rightX + 70} y={topY + 58} style={smallStyle}>
          +
        </text>
        <text x={rightX + 73} y={bottomY - 27} style={smallStyle}>
          −
        </text>
        <text
          x={rightX + 75}
          y={(topY + bottomY) / 2 + 8}
          textAnchor="middle"
          style={labelStyle}
        >
          {resultVoltage}
        </text>

        {/* Equation and subtitle */}
        <text
          x={offsetX + 220}
          y={bottomY - 35}
          textAnchor="middle"
          style={labelStyle}
        >
          {equation}
        </text>

        <text
          x={offsetX + 220}
          y={bottomY + 50}
          textAnchor="middle"
          style={titleStyle}
        >
          {subtitle}
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
          <title id="title">Voltage Sources in Series</title>
          <desc id="desc">
            Black and white diagram showing ideal voltage sources connected in
            series aiding and series opposing arrangements using ANSI-style
            voltage source symbols.
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

          {seriesCircuit(
            20,
            "aiding",
            "15V",
            "10V + 5V = 15V",
            "Series Aiding Voltage Sources"
          )}

          {seriesCircuit(
            525,
            "opposing",
            "5V",
            "10V + (−5V) = 5V",
            "Series Opposing Voltage Sources"
          )}

          <text
            x="240"
            y="390"
            textAnchor="middle"
            style={{ ...smallStyle, fontWeight: "bold" }}
          >
            Voltage Addition
          </text>

          <text
            x="745"
            y="390"
            textAnchor="middle"
            style={{ ...smallStyle, fontWeight: "bold" }}
          >
            Voltage Subtraction
          </text>
        </svg>
      </div>
    </main>
  );
}
