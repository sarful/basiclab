export default function VoltageDividerCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 28,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 22,
  };

  const resistor = (
    x: number,
    y: number,
    length = 150,
    height = 18,
    direction: "horizontal" | "vertical" = "vertical"
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl bg-white">
        <svg
          viewBox="0 0 420 760"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Voltage Divider Circuit</title>
          <desc id="desc">
            Black and white voltage divider circuit using ANSI zigzag resistor
            symbols, showing source voltage Vs, two series resistors R1 and R2,
            midpoint output node Vg, current I, and voltage drops VP1 and VP2.
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

          <rect width="420" height="760" fill="white" />

          {/* Top terminal and label */}
          <circle
            cx="120"
            cy="70"
            r="11"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="40" y="80" style={labelStyle}>
            Vₛ
          </text>

          {/* Main vertical divider wire */}
          <line
            x1="120"
            y1="81"
            x2="120"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 */}
          <polyline
            points={resistor(120, 120, 150, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="42" y="200" style={labelStyle}>
            R₁
          </text>

          {/* Mid node */}
          <circle cx="120" cy="270" r="5.5" fill="black" />
          <text x="265" y="280" style={labelStyle}>
            Vg
          </text>

          {/* R2 */}
          <line
            x1="120"
            y1="270"
            x2="120"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(120, 310, 150, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="42" y="390" style={labelStyle}>
            R₂
          </text>

          {/* Bottom wire and return */}
          <line
            x1="120"
            y1="460"
            x2="120"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="120"
            y1="520"
            x2="70"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="520"
            x2="70"
            y2="560"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="560"
            x2="120"
            y2="560"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx="120" cy="560" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />

          {/* Current arrows on the left */}
          <line
            x1="18"
            y1="170"
            x2="18"
            y2="250"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="4" y="214" style={smallStyle}>
            I
          </text>

          <line
            x1="18"
            y1="360"
            x2="18"
            y2="440"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="4" y="404" style={smallStyle}>
            I
          </text>

          {/* Voltage across R1 */}
          <text x="200" y="95" style={smallStyle}>
            +
          </text>
          <text x="198" y="275" style={smallStyle}>
            −
          </text>
          <line
            x1="220"
            y1="255"
            x2="220"
            y2="120"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="238" y="190" style={labelStyle}>
            Vₚ₁
          </text>

          {/* Voltage across R2 */}
          <text x="200" y="290" style={smallStyle}>
            +
          </text>
          <text x="198" y="542" style={smallStyle}>
            −
          </text>
          <line
            x1="220"
            y1="522"
            x2="220"
            y2="310"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="238" y="425" style={labelStyle}>
            Vₚ₂
          </text>
        </svg>
      </div>
    </main>
  );
}
