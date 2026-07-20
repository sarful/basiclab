export default function DifferentialOpAmp() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const resistor = (
    x: number,
    y: number,
    width = 110,
    height = 17,
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Differential Operational Amplifier</title>
          <desc id="desc">
            Black and white textbook SVG diagram of a differential operational
            amplifier using R1, R2, R3, and R4.
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

          <rect width="1000" height="520" fill="white" />

          {/* Bottom 0V rail */}
          <line
            x1="75"
            y1="445"
            x2="915"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="75"
            cy="445"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="915"
            cy="445"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="865" y="420" style={smallTextStyle}>
            0V
          </text>

          {/* Input voltage terminals */}
          <circle
            cx="75"
            cy="170"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="180"
            cy="280"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="75"
            y1="179"
            x2="75"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="180"
            y1="289"
            x2="180"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="18" y="178" style={textStyle}>
            V₁
          </text>

          <text x="112" y="292" style={textStyle}>
            V₂
          </text>

          {/* V1 path through R1 */}
          <line
            x1="84"
            y1="170"
            x2="255"
            y2="170"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="112"
            y1="145"
            x2="200"
            y2="145"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="145" y="127" style={smallTextStyle}>
            I₁
          </text>

          <polyline
            points={resistor(255, 170, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="295" y="137" style={smallTextStyle}>
            R1
          </text>

          <line
            x1="375"
            y1="170"
            x2="510"
            y2="170"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* V2 path through R2 */}
          <line
            x1="189"
            y1="280"
            x2="255"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="200"
            y1="255"
            x2="245"
            y2="255"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="208" y="238" style={smallTextStyle}>
            I₂
          </text>

          <polyline
            points={resistor(255, 280, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="295" y="247" style={smallTextStyle}>
            R2
          </text>

          <line
            x1="375"
            y1="280"
            x2="510"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input nodes */}
          <circle cx="510" cy="170" r="7" fill="black" />
          <circle cx="510" cy="280" r="7" fill="black" />

          <text x="525" y="158" style={smallTextStyle}>
            Va
          </text>

          <text x="525" y="300" style={smallTextStyle}>
            Vb
          </text>

          {/* Op-amp body */}
          <polygon
            points="585,120 585,345 815,235"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="675" y="252" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="603" y="183" style={smallTextStyle}>
            −
          </text>

          <text x="603" y="295" style={smallTextStyle}>
            +
          </text>

          {/* Connections into op-amp inputs */}
          <line
            x1="510"
            y1="170"
            x2="585"
            y2="170"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="510"
            y1="280"
            x2="585"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R4 from Vb to ground */}
          <line
            x1="510"
            y1="280"
            x2="510"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(510, 315, 90, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="540" y="365" style={smallTextStyle}>
            R4
          </text>

          <line
            x1="510"
            y1="405"
            x2="510"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Ground symbol */}
          <line
            x1="480"
            y1="405"
            x2="540"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="490"
            y1="418"
            x2="530"
            y2="418"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="500"
            y1="431"
            x2="520"
            y2="431"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output wire */}
          <line
            x1="815"
            y1="235"
            x2="915"
            y2="235"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="865" cy="235" r="5.5" fill="black" />

          <circle
            cx="915"
            cy="235"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="928" y="245" style={textStyle}>
            Vout
          </text>

          {/* Output vertical reference */}
          <line
            x1="915"
            y1="235"
            x2="915"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback path with R3 */}
          <line
            x1="510"
            y1="170"
            x2="510"
            y2="65"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="510"
            y1="65"
            x2="665"
            y2="65"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="545"
            y1="45"
            x2="620"
            y2="45"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="570" y="30" style={smallTextStyle}>
            I₃
          </text>

          <polyline
            points={resistor(665, 65, 125, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="705" y="32" style={smallTextStyle}>
            R3
          </text>

          <line
            x1="790"
            y1="65"
            x2="865"
            y2="65"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="865"
            y1="65"
            x2="865"
            y2="235"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
