export default function DCParallelCircuitDiagram() {
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

  const tinyStyle = {
    ...textStyle,
    fontSize: 16,
  };

  const resistor = (
    x,
    y,
    length = 120,
    height = 15,
    direction = "vertical"
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
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">DC Parallel Circuit Diagram</title>
          <desc id="desc">
            Black and white DC parallel circuit diagram using ANSI zigzag
            resistor symbols. A 24 volt DC source supplies four parallel
            resistors with branch currents I1, I2, I3, and I4.
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

          <rect width="1000" height="560" fill="white" />

          {/* Supply terminals */}
          <circle cx="90" cy="90" r="9" fill="black" />
          <circle cx="90" cy="455" r="9" fill="black" />

          <text x="78" y="58" style={labelStyle}>
            A
          </text>
          <text x="78" y="497" style={labelStyle}>
            B
          </text>

          {/* Battery / DC source */}
          <line
            x1="90"
            y1="90"
            x2="90"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="50"
            y1="210"
            x2="130"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="65"
            y1="240"
            x2="115"
            y2="240"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="50"
            y1="295"
            x2="130"
            y2="295"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="65"
            y1="325"
            x2="115"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="90"
            y1="325"
            x2="90"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="22" y="276" style={labelStyle}>
            24v
          </text>

          {/* Source voltage reference */}
          <line
            x1="155"
            y1="370"
            x2="155"
            y2="205"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="170" y="290" style={labelStyle}>
            Vs
          </text>

          <text x="44" y="198" style={smallStyle}>
            +
          </text>
          <text x="48" y="342" style={smallStyle}>
            −
          </text>

          {/* Top and bottom rails */}
          <line
            x1="90"
            y1="90"
            x2="900"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="90"
            y1="455"
            x2="900"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Total current arrow */}
          <line
            x1="155"
            y1="70"
            x2="250"
            y2="70"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="182" y="48" style={labelStyle}>
            Iₜ
          </text>

          {/* Common connection ovals */}
          <ellipse
            cx="575"
            cy="60"
            rx="375"
            ry="35"
            fill="none"
            stroke="black"
            strokeWidth="1.6"
            strokeDasharray="12 9"
          />
          <text x="500" y="24" style={smallStyle}>
            common connection
          </text>

          <ellipse
            cx="575"
            cy="485"
            rx="375"
            ry="35"
            fill="none"
            stroke="black"
            strokeWidth="1.6"
            strokeDasharray="12 9"
          />
          <text x="500" y="535" style={smallStyle}>
            common connection
          </text>

          {/* Top rail node numbers */}
          {[
            [300, "1"],
            [500, "2"],
            [700, "3"],
            [900, "4"],
          ].map(([x, label]) => (
            <g key={label}>
              <circle cx={x} cy="90" r="6" fill="black" />
              <text x={x - 9} y="70" style={smallStyle}>
                {label}
              </text>
            </g>
          ))}

          {/* Bottom rail node numbers */}
          {[
            [300, "5"],
            [500, "6"],
            [700, "7"],
            [900, "8"],
          ].map(([x, label]) => (
            <g key={label}>
              <circle cx={x} cy="455" r="6" fill="black" />
              <text x={x - 9} y="487" style={smallStyle}>
                {label}
              </text>
            </g>
          ))}

          {/* Resistor branches */}
          {[
            {
              x: 300,
              r: "R₁",
              value: "10Ω",
              current: "I₁",
            },
            {
              x: 500,
              r: "R₂",
              value: "20Ω",
              current: "I₂",
            },
            {
              x: 700,
              r: "R₃",
              value: "30Ω",
              current: "I₃",
            },
            {
              x: 900,
              r: "R₄",
              value: "40Ω",
              current: "I₄",
            },
          ].map((branch) => (
            <g key={branch.r}>
              <line
                x1={branch.x}
                y1="90"
                x2={branch.x}
                y2="155"
                stroke="black"
                strokeWidth={stroke}
                strokeLinecap="round"
              />

              <polyline
                points={resistor(branch.x, 155, 170, 17, "vertical")}
                fill="none"
                stroke="black"
                strokeWidth={stroke}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              <line
                x1={branch.x}
                y1="325"
                x2={branch.x}
                y2="455"
                stroke="black"
                strokeWidth={stroke}
                strokeLinecap="round"
              />

              {/* Branch current arrow */}
              <line
                x1={branch.x + 28}
                y1="120"
                x2={branch.x + 28}
                y2="190"
                stroke="black"
                strokeWidth="2.2"
                markerEnd="url(#arrow)"
              />
              <text x={branch.x + 42} y="138" style={smallStyle}>
                {branch.current}
              </text>

              {/* Voltage polarity */}
              <text x={branch.x + 18} y="150" style={smallStyle}>
                +
              </text>
              <text x={branch.x + 20} y="365" style={smallStyle}>
                −
              </text>

              {/* Resistor labels */}
              <text x={branch.x + 45} y="255" style={labelStyle}>
                {branch.r}
              </text>
              <text x={branch.x + 45} y="288" style={smallStyle}>
                {branch.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </main>
  );
}
