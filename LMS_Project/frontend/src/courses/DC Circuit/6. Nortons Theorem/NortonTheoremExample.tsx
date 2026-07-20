export default function NortonTheoremExample() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const headingStyle = {
    ...textStyle,
    fontSize: 26,
    fontWeight: "bold",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const resistor = (
    x: number,
    y: number,
    length = 120,
    height = 16,
    direction: "horizontal" | "vertical" = "horizontal"
  ) => {
    const step = length / 8;

    if (direction === "vertical") {
      return `
        ${x},${y}
        ${x},${y + step}
        ${x - height},${y + step * 2}
        ${x + height},${y + step * 3}
        ${x - height},${y + step * 4}
        ${x + height},${y + step * 5}
        ${x - height},${y + step * 6}
        ${x + height},${y + step * 7}
        ${x},${y + step * 8}
      `;
    }

    return `
      ${x},${y}
      ${x + step},${y}
      ${x + step * 2},${y - height}
      ${x + step * 3},${y + height}
      ${x + step * 4},${y - height}
      ${x + step * 5},${y + height}
      ${x + step * 6},${y - height}
      ${x + step * 7},${y + height}
      ${x + step * 8},${y}
    `;
  };

  const battery = (
    x: number,
    topY: number,
    voltage: string,
    label: string,
    side: "left" | "right"
  ) => {
    const textX = side === "left" ? x - 62 : x + 20;
    const labelX = side === "left" ? x - 48 : x + 18;

    return (
      <g>
        <line
          x1={x}
          y1={topY}
          x2={x}
          y2={topY + 78}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x - 36}
          y1={topY + 78}
          x2={x + 36}
          y2={topY + 78}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x - 22}
          y1={topY + 104}
          x2={x + 22}
          y2={topY + 104}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x}
          y1={topY + 104}
          x2={x}
          y2={topY + 260}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <text x={textX} y={topY + 64} style={smallStyle}>
          {voltage}
        </text>
        <text x={labelX} y={topY + 150} style={labelStyle}>
          {label}
        </text>
      </g>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 900"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Norton Theorem Example</title>
          <desc id="desc">
            Black and white Norton theorem example using ANSI zigzag resistor
            symbols. The top diagram shows the original circuit with a 40 ohm
            load between terminals A and B. The bottom diagram shows the load
            removed and terminals A and B short-circuited.
          </desc>

          <rect width="1000" height="900" fill="white" />

          {/* ================= TOP DIAGRAM ================= */}
          <text x="40" y="42" style={headingStyle}>
            Original Circuit
          </text>

          {/* Top horizontal network */}
          <line x1="70" y1="105" x2="210" y2="105" stroke="black" strokeWidth={stroke} />
          <polyline
            points={resistor(210, 105, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="330" y1="105" x2="500" y2="105" stroke="black" strokeWidth={stroke} />

          <polyline
            points={resistor(500, 105, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="620" y1="105" x2="860" y2="105" stroke="black" strokeWidth={stroke} />

          <text x="250" y="68" style={labelStyle}>10 Ω</text>
          <text x="540" y="68" style={labelStyle}>20 Ω</text>

          {/* Node A */}
          <circle cx="450" cy="105" r="5.5" fill="black" />
          <text x="440" y="82" style={labelStyle}>A</text>

          {/* Left and right source branches */}
          <line x1="70" y1="105" x2="70" y2="170" stroke="black" strokeWidth={stroke} />
          {battery(70, 170, "10V", "V₁", "left")}

          <line x1="860" y1="105" x2="860" y2="170" stroke="black" strokeWidth={stroke} />
          {battery(860, 170, "20V", "V₂", "right")}

          {/* Center load resistor 40Ω */}
          <line x1="450" y1="105" x2="450" y2="170" stroke="black" strokeWidth={stroke} />
          <polyline
            points={resistor(450, 170, 145, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="450" y1="315" x2="450" y2="375" stroke="black" strokeWidth={stroke} />
          <text x="485" y="250" style={labelStyle}>40 Ω</text>

          {/* Node B */}
          <circle cx="450" cy="375" r="5.5" fill="black" />
          <text x="465" y="386" style={labelStyle}>B</text>

          {/* ================ BOTTOM DIAGRAM ================ */}
          <text x="40" y="470" style={headingStyle}>
            Short-Circuit Across A-B
          </text>

          {/* Left and right shorted source branches */}
          <line x1="70" y1="535" x2="70" y2="820" stroke="black" strokeWidth={stroke} />
          <line x1="860" y1="535" x2="860" y2="820" stroke="black" strokeWidth={stroke} />

          {/* Sources on bottom figure */}
          <line x1="70" y1="620" x2="70" y2="698" stroke="black" strokeWidth={stroke} />
          <line x1="34" y1="698" x2="106" y2="698" stroke="black" strokeWidth={stroke} />
          <line x1="48" y1="724" x2="92" y2="724" stroke="black" strokeWidth={stroke} />
          <text x="20" y="684" style={smallStyle}>10V</text>

          <line x1="860" y1="620" x2="860" y2="698" stroke="black" strokeWidth={stroke} />
          <line x1="824" y1="698" x2="896" y2="698" stroke="black" strokeWidth={stroke} />
          <line x1="838" y1="724" x2="882" y2="724" stroke="black" strokeWidth={stroke} />
          <text x="880" y="684" style={smallStyle}>20V</text>

          {/* Bottom return wire */}
          <line x1="70" y1="820" x2="450" y2="820" stroke="black" strokeWidth={stroke} />
          <line x1="450" y1="820" x2="860" y2="820" stroke="black" strokeWidth={stroke} />

          {/* Top branch with two resistors */}
          <line x1="70" y1="535" x2="210" y2="535" stroke="black" strokeWidth={stroke} />
          <polyline
            points={resistor(210, 535, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="330" y1="535" x2="450" y2="535" stroke="black" strokeWidth={stroke} />

          <polyline
            points={resistor(500, 535, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="620" y1="535" x2="860" y2="535" stroke="black" strokeWidth={stroke} />

          <text x="250" y="498" style={labelStyle}>10 Ω</text>
          <text x="540" y="498" style={labelStyle}>20 Ω</text>

          {/* A and B nodes with short circuit */}
          <circle cx="450" cy="535" r="5.5" fill="black" />
          <circle cx="450" cy="820" r="5.5" fill="black" />
          <text x="440" y="512" style={labelStyle}>A</text>
          <text x="465" y="832" style={labelStyle}>B</text>

          <line x1="450" y1="535" x2="450" y2="820" stroke="black" strokeWidth="6" />

          <text x="470" y="675" style={smallStyle}>Short</text>
          <text x="470" y="700" style={smallStyle}>Circuit</text>
        </svg>
      </div>
    </main>
  );
}
