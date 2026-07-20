export default function NortonsEquivalentCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 18,
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
          <title id="title">Norton's Equivalent Circuit</title>
          <desc id="desc">
            Black and white Norton equivalent circuit showing a linear network
            with load RL at terminals A and B, equivalent to a current source
            Is in parallel with resistor Rs and load RL.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          <rect width="1200" height="420" fill="white" />

          {/* Left linear network block */}
          <rect
            x="20"
            y="55"
            width="300"
            height="260"
            rx="16"
            ry="16"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="170" y="105" textAnchor="middle" style={titleStyle}>
            A Linear
          </text>
          <text x="170" y="135" textAnchor="middle" style={titleStyle}>
            Network
          </text>
          <text x="170" y="165" textAnchor="middle" style={titleStyle}>
            containing
          </text>
          <text x="170" y="195" textAnchor="middle" style={titleStyle}>
            several energy
          </text>
          <text x="170" y="225" textAnchor="middle" style={titleStyle}>
            sources and
          </text>
          <text x="170" y="255" textAnchor="middle" style={titleStyle}>
            resistances
          </text>

          {/* Left side output terminals */}
          <line
            x1="320"
            y1="95"
            x2="455"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="320"
            y1="275"
            x2="455"
            y2="275"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Left RL branch */}
          <circle cx="455" cy="95" r="5" fill="black" />
          <circle cx="455" cy="275" r="5" fill="black" />
          <text x="475" y="100" style={labelStyle}>
            A
          </text>
          <text x="475" y="282" style={labelStyle}>
            B
          </text>

          <line
            x1="455"
            y1="95"
            x2="455"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <polyline
            points={resistor(455, 120, 110, 14, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="455"
            y1="230"
            x2="455"
            y2="275"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <text x="435" y="182" style={smallStyle}>
            Rₗ
          </text>

          {/* Equivalence sign */}
          <text x="555" y="190" style={{ ...labelStyle, fontSize: 34 }}>
            =
          </text>

          {/* Norton equivalent circuit */}
          {/* Top and bottom rails */}
          <line
            x1="690"
            y1="70"
            x2="1060"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="690"
            y1="315"
            x2="1060"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Left branch with current source */}
          <line
            x1="690"
            y1="70"
            x2="690"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="690"
            y1="260"
            x2="690"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="690"
            cy="165"
            r="42"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <circle
            cx="690"
            cy="205"
            r="42"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="625"
            y1="245"
            x2="625"
            y2="155"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="647" y="180" style={smallStyle}>
            Iₛ
          </text>

          {/* Center branch with Rs */}
          <circle cx="845" cy="70" r="4.5" fill="black" />
          <circle cx="845" cy="315" r="4.5" fill="black" />

          <line
            x1="845"
            y1="70"
            x2="845"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(845, 115, 120, 14, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="845"
            y1="235"
            x2="845"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="865" y="190" style={smallStyle}>
            Rₛ
          </text>

          {/* Right branch load RL with terminals A and B */}
          <circle cx="1060" cy="70" r="5" fill="black" />
          <circle cx="1060" cy="315" r="5" fill="black" />
          <text x="1080" y="76" style={labelStyle}>
            A
          </text>
          <text x="1080" y="322" style={labelStyle}>
            B
          </text>

          <line
            x1="1060"
            y1="70"
            x2="1060"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <polyline
            points={resistor(1060, 120, 110, 14, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="1060"
            y1="230"
            x2="1060"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="6 6"
          />
          <text x="1040" y="182" style={smallStyle}>
            Rₗ
          </text>
        </svg>
      </div>
    </main>
  );
}
