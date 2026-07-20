export default function ParallelOpposingCurrentSources() {
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
    fontSize: 18,
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 21,
    fontWeight: "bold",
  };

  const currentSource = (
    cx: number,
    cy: number,
    direction: "up" | "down",
    value: string
  ) => {
    const arrowStartY = direction === "up" ? cy + 26 : cy - 26;
    const arrowEndY = direction === "up" ? cy - 26 : cy + 26;

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
          y1={arrowStartY}
          x2={cx}
          y2={arrowEndY}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />

        <text
          x={cx + 48}
          y={cy + 8}
          textAnchor="start"
          dominantBaseline="middle"
          style={labelStyle}
        >
          {value}
        </text>
      </g>
    );
  };

  const circuit = (
    offsetX: number,
    topCurrent: string,
    leftSource: string,
    rightSource: string,
    leftDirection: "up" | "down",
    rightDirection: "up" | "down",
    caption: string
  ) => {
    const topY = 70;
    const bottomY = 300;
    const leftX = offsetX + 70;
    const rightSourceX = offsetX + 240;
    const terminalX = offsetX + 430;

    return (
      <g>
        {/* Top and bottom rails */}
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
          y1={bottomY}
          x2={terminalX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Vertical source branches */}
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
          x1={rightSourceX}
          y1={topY}
          x2={rightSourceX}
          y2={topY + 70}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <line
          x1={rightSourceX}
          y1={topY + 146}
          x2={rightSourceX}
          y2={bottomY}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Current source symbols */}
        {currentSource(leftX, topY + 108, leftDirection, leftSource)}
        {currentSource(rightSourceX, topY + 108, rightDirection, rightSource)}

        {/* Terminal A and B */}
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

        {/* Output current arrow */}
        <line
          x1={offsetX + 270}
          y1={topY - 28}
          x2={offsetX + 405}
          y2={topY - 28}
          stroke="black"
          strokeWidth="2.5"
          markerEnd="url(#arrow)"
        />

        <text
          x={offsetX + 340}
          y={topY - 48}
          textAnchor="middle"
          style={smallStyle}
        >
          i = {topCurrent}
        </text>

        {/* Small voltage reference at output */}
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

        <text x={terminalX + 68} y={topY + 55} style={smallStyle}>
          +
        </text>

        <text x={terminalX + 71} y={bottomY - 30} style={smallStyle}>
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

        {/* Internal reference arrows I1 and I2 */}
        <path
          d={`M ${leftX + 65} ${topY + 80} C ${leftX + 125} ${
            topY + 80
          }, ${leftX + 125} ${bottomY - 80}, ${leftX + 65} ${bottomY - 80}`}
          fill="none"
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        <text x={leftX + 78} y={topY + 95} style={smallStyle}>
          I₁
        </text>

        <path
          d={`M ${rightSourceX - 65} ${bottomY - 80} C ${rightSourceX - 125} ${
            bottomY - 80
          }, ${rightSourceX - 125} ${topY + 80}, ${rightSourceX - 65} ${
            topY + 80
          }`}
          fill="none"
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        <text x={rightSourceX - 118} y={topY + 95} style={smallStyle}>
          I₂
        </text>

        <text
          x={offsetX + 235}
          y={360}
          textAnchor="middle"
          style={titleStyle}
        >
          {caption}
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
          <title id="title">Parallel Opposing Current Sources</title>
          <desc id="desc">
            Black and white circuit diagram showing opposing ideal current
            sources connected in parallel using ANSI current source symbols.
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

          {circuit(
            20,
            "3A",
            "8A",
            "5A",
            "up",
            "down",
            "8A − 5A = 3A"
          )}

          {circuit(
            520,
            "2A",
            "5A",
            "3A",
            "up",
            "down",
            "5A − 3A = 2A"
          )}

          <text
            x="250"
            y="390"
            textAnchor="middle"
            style={{ ...smallStyle, fontWeight: "bold" }}
          >
            Parallel Opposing Current Sources
          </text>

          <text
            x="750"
            y="390"
            textAnchor="middle"
            style={{ ...smallStyle, fontWeight: "bold" }}
          >
            Parallel Opposing Current Sources
          </text>
        </svg>
      </div>
    </main>
  );
}
