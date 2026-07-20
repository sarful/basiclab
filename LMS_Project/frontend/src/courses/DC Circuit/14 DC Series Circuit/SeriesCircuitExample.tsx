export default function SeriesCircuitExample() {
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

  const valueStyle = {
    ...textStyle,
    fontSize: 21,
  };

  const resistor = (
    x: number,
    y: number,
    length = 140,
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 900 620"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Series Circuit Example</title>
          <desc id="desc">
            Black and white series circuit example using ANSI zigzag resistor
            symbols. A 24 volt source drives a series loop containing R1 = 6Ω,
            R2 = 12Ω, R3 = 20Ω, R4 = 8Ω, and R5 = 12Ω. Voltage drops across
            each resistor are labeled with polarity.
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

          <rect width="900" height="620" fill="white" />

          {/* Left source branch */}
          <line
            x1="120"
            y1="110"
            x2="120"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="85"
            y1="190"
            x2="155"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="98"
            y1="220"
            x2="142"
            y2="220"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="85"
            y1="250"
            x2="155"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="98"
            y1="280"
            x2="142"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="120"
            y1="280"
            x2="120"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="70" y="180" style={smallStyle}>
            +
          </text>
          <text x="72" y="292" style={smallStyle}>
            −
          </text>
          <text x="20" y="250" style={labelStyle}>
            Vₛ
          </text>
          <text x="18" y="282" style={valueStyle}>
            24V
          </text>

          {/* Current arrow on left side */}
          <line
            x1="88"
            y1="150"
            x2="88"
            y2="95"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="60" y="128" style={smallStyle}>
            I
          </text>

          {/* Top wire and R1, R2 */}
          <line
            x1="120"
            y1="110"
            x2="210"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(210, 110, 140, 16, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="350"
            y1="110"
            x2="410"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(410, 110, 140, 16, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="550"
            y1="110"
            x2="700"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right branch and R3 */}
          <line
            x1="700"
            y1="110"
            x2="700"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(700, 180, 170, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="700"
            y1="350"
            x2="700"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Bottom wire and R4, R5 */}
          <line
            x1="700"
            y1="520"
            x2="560"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(420, 520, 140, 16, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="420"
            y1="520"
            x2="340"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(200, 520, 140, 16, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="520"
            x2="120"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Labels for resistors */}
          <text x="270" y="52" textAnchor="middle" style={labelStyle}>
            R₁
          </text>
          <text x="270" y="86" textAnchor="middle" style={valueStyle}>
            6Ω
          </text>

          <text x="470" y="52" textAnchor="middle" style={labelStyle}>
            R₂
          </text>
          <text x="470" y="86" textAnchor="middle" style={valueStyle}>
            12Ω
          </text>

          <text x="744" y="250" style={labelStyle}>
            R₃ = 20Ω
          </text>

          <text x="270" y="472" textAnchor="middle" style={labelStyle}>
            R₄ = 8Ω
          </text>

          <text x="490" y="472" textAnchor="middle" style={labelStyle}>
            R₅ = 12Ω
          </text>

          {/* Polarity and voltage across R1 */}
          <text x="190" y="95" style={smallStyle}>
            +
          </text>
          <text x="360" y="95" style={smallStyle}>
            −
          </text>
          <line
            x1="205"
            y1="145"
            x2="345"
            y2="145"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="258" y="170" style={smallStyle}>
            Vᵣ₁
          </text>

          {/* Polarity and voltage across R2 */}
          <text x="390" y="95" style={smallStyle}>
            +
          </text>
          <text x="560" y="95" style={smallStyle}>
            −
          </text>
          <line
            x1="405"
            y1="145"
            x2="545"
            y2="145"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="458" y="170" style={smallStyle}>
            Vᵣ₂
          </text>

          {/* Polarity and voltage across R3 */}
          <text x="724" y="175" style={smallStyle}>
            +
          </text>
          <text x="724" y="365" style={smallStyle}>
            −
          </text>
          <line
            x1="760"
            y1="350"
            x2="760"
            y2="185"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="772" y="274" style={smallStyle}>
            Vᵣ₃
          </text>

          {/* Polarity and voltage across R4 */}
          <text x="352" y="540" style={smallStyle}>
            +
          </text>
          <text x="188" y="540" style={smallStyle}>
            −
          </text>
          <line
            x1="340"
            y1="556"
            x2="210"
            y2="556"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="252" y="586" style={smallStyle}>
            Vᵣ₄
          </text>

          {/* Polarity and voltage across R5 */}
          <text x="562" y="540" style={smallStyle}>
            +
          </text>
          <text x="408" y="540" style={smallStyle}>
            −
          </text>
          <line
            x1="550"
            y1="556"
            x2="430"
            y2="556"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
          <text x="468" y="586" style={smallStyle}>
            Vᵣ₅
          </text>
        </svg>
      </div>
    </main>
  );
}
