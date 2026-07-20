export default function TheveninsTheoremEquivalentCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 18,
  };

  const resistor = (
    x: number,
    y: number,
    length = 110,
    height = 14,
    direction: "horizontal" | "vertical" = "horizontal"
  ) => {
    const step = length / 8;

    if (direction === "horizontal") {
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
    }

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
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1200 420"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Thevenin&apos;s Theorem Equivalent Circuit</title>
          <desc id="desc">
            Black and white Thevenin equivalent circuit diagram showing a linear
            network with terminals A and B and load RL, equivalent to a voltage
            source Vs in series with resistor Rs supplying load RL.
          </desc>

          <rect width="1200" height="420" fill="white" />

          {/* Left linear network block */}
          <rect
            x="20"
            y="70"
            width="300"
            height="220"
            rx="16"
            ry="16"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="170" y="120" textAnchor="middle" style={titleStyle}>
            A Linear
          </text>
          <text x="170" y="155" textAnchor="middle" style={titleStyle}>
            Network
          </text>
          <text x="170" y="190" textAnchor="middle" style={titleStyle}>
            Containing
          </text>
          <text x="170" y="225" textAnchor="middle" style={titleStyle}>
            Several emf&apos;s
          </text>
          <text x="170" y="260" textAnchor="middle" style={titleStyle}>
            and
          </text>
          <text x="170" y="295" textAnchor="middle" style={titleStyle}>
            Resistances
          </text>

          {/* Left side terminals and load RL */}
          <line
            x1="320"
            y1="110"
            x2="460"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="320"
            y1="250"
            x2="460"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="460" cy="110" r="5" fill="black" />
          <circle cx="460" cy="250" r="5" fill="black" />

          <text x="475" y="104" style={labelStyle}>
            A
          </text>
          <text x="475" y="258" style={labelStyle}>
            B
          </text>

          <line
            x1="460"
            y1="110"
            x2="460"
            y2="140"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <polyline
            points={resistor(460, 140, 100, 14, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="460"
            y1="240"
            x2="460"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <text x="442" y="190" style={smallStyle}>
            Rₗ
          </text>

          {/* Equivalence mark */}
          <text x="555" y="188" style={{ ...labelStyle, fontSize: 34 }}>
            =
          </text>

          {/* Right equivalent circuit */}
          {/* Left vertical branch with source Vs */}
          <line
            x1="685"
            y1="70"
            x2="685"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Source symbol */}
          <line
            x1="630"
            y1="182"
            x2="740"
            y2="182"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="648"
            y1="208"
            x2="722"
            y2="208"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="645" y="176" style={smallStyle}>
            Vₛ
          </text>

          {/* Top branch with Rs */}
          <line
            x1="685"
            y1="70"
            x2="810"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(810, 70, 140, 14)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="950"
            y1="70"
            x2="1040"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="868" y="48" style={smallStyle}>
            Rₛ
          </text>

          {/* Right load branch RL */}
          <circle cx="1040" cy="70" r="5" fill="black" />
          <circle cx="1040" cy="330" r="5" fill="black" />
          <text x="1060" y="76" style={labelStyle}>
            A
          </text>
          <text x="1060" y="338" style={labelStyle}>
            B
          </text>

          <line
            x1="1040"
            y1="70"
            x2="1040"
            y2="140"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <polyline
            points={resistor(1040, 140, 100, 14, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="1040"
            y1="240"
            x2="1040"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <text x="1020" y="190" style={smallStyle}>
            Rₗ
          </text>

          {/* Bottom branch */}
          <line
            x1="685"
            y1="330"
            x2="1040"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
