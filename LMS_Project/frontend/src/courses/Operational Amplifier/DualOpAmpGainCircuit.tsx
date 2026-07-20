export default function DualOpAmpGainCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 21,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const resistor = (
    x: number,
    y: number,
    width = 95,
    height = 15,
    direction: "horizontal" | "vertical" = "horizontal",
  ) => {
    const step = width / 8;

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

  const sineWave = (x: number, y: number, width = 80, height = 28) => {
    return `
      M ${x} ${y}
      C ${x + width * 0.15} ${y - height}, ${x + width * 0.35} ${
        y - height
      }, ${x + width * 0.5} ${y}
      C ${x + width * 0.65} ${y + height}, ${x + width * 0.85} ${
        y + height
      }, ${x + width} ${y}
    `;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1200 620"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Dual Op-Amp Gain Circuit</title>
          <desc id="desc">
            Black and white SVG circuit diagram with two operational amplifiers,
            feedback resistors, output resistor, sinusoidal signal labels, and
            gain equations.
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

          <rect width="1200" height="620" fill="white" />

          {/* Input source */}
          <circle
            cx="55"
            cy="330"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="15" y="365" style={textStyle}>
            Vₙᵢ
          </text>

          <line
            x1="65"
            y1="330"
            x2="120"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="120"
            y1="330"
            x2="120"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="120"
            y1="210"
            x2="165"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 input resistor */}
          <polyline
            points={resistor(165, 210, 105, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="200" y="165" style={smallTextStyle}>
            R1
          </text>

          <line
            x1="270"
            y1="210"
            x2="325"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="325" cy="210" r="5.5" fill="black" />

          {/* Upper op-amp A1 */}
          <polygon
            points="360,135 360,285 510,210"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="415" y="222" style={{ ...textStyle, fontSize: 28 }}>
            A₁
          </text>

          <text x="374" y="181" style={smallTextStyle}>
            −
          </text>

          <text x="374" y="248" style={smallTextStyle}>
            +
          </text>

          <line
            x1="325"
            y1="210"
            x2="360"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* A1 non-inverting grounded */}
          <line
            x1="360"
            y1="250"
            x2="320"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="320"
            y1="250"
            x2="320"
            y2="300"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="295"
            y1="300"
            x2="345"
            y2="300"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="303"
            y1="312"
            x2="337"
            y2="312"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="312"
            y1="324"
            x2="328"
            y2="324"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Upper output */}
          <line
            x1="510"
            y1="210"
            x2="555"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="210"
            x2="555"
            y2="245"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="555" cy="210" r="5.5" fill="black" />

          {/* R2 feedback path */}
          <line
            x1="325"
            y1="210"
            x2="325"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="325"
            y1="90"
            x2="395"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(395, 90, 100, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="430" y="55" style={smallTextStyle}>
            R2
          </text>

          <line
            x1="495"
            y1="90"
            x2="555"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="90"
            x2="555"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Lower op-amp A2 */}
          <polygon
            points="360,380 360,530 510,455"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="415" y="468" style={{ ...textStyle, fontSize: 28 }}>
            A₂
          </text>

          <text x="374" y="425" style={smallTextStyle}>
            +
          </text>

          <text x="374" y="493" style={smallTextStyle}>
            −
          </text>

          {/* A2 positive input from Vin branch */}
          <line
            x1="120"
            y1="330"
            x2="120"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="120"
            y1="420"
            x2="360"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* A2 feedback / R3 path */}
          <line
            x1="510"
            y1="455"
            x2="555"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="455"
            x2="555"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="360"
            y1="490"
            x2="325"
            y2="490"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="325"
            y1="490"
            x2="325"
            y2="565"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="325"
            y1="565"
            x2="390"
            y2="565"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(390, 565, 105, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="430" y="545" style={smallTextStyle}>
            R3
          </text>

          <line
            x1="495"
            y1="565"
            x2="555"
            y2="565"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="565"
            x2="555"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R4 to ground */}
          <line
            x1="325"
            y1="490"
            x2="260"
            y2="490"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(260, 490, 90, 15, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="220" y="540" style={smallTextStyle}>
            R4
          </text>

          <line
            x1="260"
            y1="580"
            x2="260"
            y2="595"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="235"
            y1="595"
            x2="285"
            y2="595"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="243"
            y1="607"
            x2="277"
            y2="607"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="252"
            y1="619"
            x2="268"
            y2="619"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Central output resistor R5 */}
          <line
            x1="555"
            y1="245"
            x2="620"
            y2="245"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="405"
            x2="620"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(620, 245, 160, 15, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="645" y="330" style={smallTextStyle}>
            R5
          </text>

          <text x="675" y="300" style={smallTextStyle}>
            Vout
          </text>

          <line
            x1="615"
            y1="260"
            x2="615"
            y2="385"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <circle cx="620" cy="245" r="5.5" fill="black" />
          <circle cx="620" cy="405" r="5.5" fill="black" />

          {/* Waveform section */}
          <line
            x1="720"
            y1="95"
            x2="825"
            y2="95"
            stroke="black"
            strokeWidth="2"
          />

          <path
            d={sineWave(720, 95, 105, 30)}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          <text x="735" y="55" style={smallTextStyle}>
            A₁VIN
          </text>

          <text x="745" y="150" style={smallTextStyle}>
            Vout
          </text>

          <line
            x1="720"
            y1="260"
            x2="825"
            y2="260"
            stroke="black"
            strokeWidth="2"
          />

          <path
            d={sineWave(720, 260, 105, 46)}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          <text x="735" y="220" style={smallTextStyle}>
            AₜVIN
          </text>

          <line
            x1="720"
            y1="425"
            x2="825"
            y2="425"
            stroke="black"
            strokeWidth="2"
          />

          <path
            d={sineWave(720, 425, 105, 26)}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          <text x="748" y="385" style={smallTextStyle}>
            Vin
          </text>

          <text x="735" y="485" style={smallTextStyle}>
            A₂VIN
          </text>

          <circle
            cx="705"
            cy="215"
            r="11"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="705"
            cy="385"
            r="11"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Equation box */}
          <rect
            x="900"
            y="170"
            width="260"
            height="300"
            rx="16"
            ry="16"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="10 8"
          />

          <text x="955" y="230" style={smallTextStyle}>
            A₁ = − R₂
          </text>

          <line
            x1="1038"
            y1="222"
            x2="1085"
            y2="222"
            stroke="black"
            strokeWidth="2"
          />

          <text x="1047" y="252" style={smallTextStyle}>
            R₁
          </text>

          <text x="955" y="300" style={smallTextStyle}>
            A₂ = 1 + R₃
          </text>

          <line
            x1="1068"
            y1="292"
            x2="1115"
            y2="292"
            stroke="black"
            strokeWidth="2"
          />

          <text x="1078" y="322" style={smallTextStyle}>
            R₄
          </text>

          <text x="955" y="370" style={smallTextStyle}>
            Aₜ = A₁ − A₂
          </text>

          <text x="950" y="430" style={smallTextStyle}>
            VOUT = 4(Aₜ VIN)
          </text>
        </svg>
      </div>
    </main>
  );
}
