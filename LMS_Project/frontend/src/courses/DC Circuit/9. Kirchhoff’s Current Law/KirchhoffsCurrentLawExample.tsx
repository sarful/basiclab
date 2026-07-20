export default function KirchhoffsCurrentLawExample() {
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

  const resistor = (
    x,
    y,
    length = 130,
    height = 16,
    direction = "horizontal",
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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Kirchhoff&apos;s Current Law Example</title>
          <desc id="desc">
            Black and white Kirchhoff&apos;s Current Law example with resistor
            R1 of 4 ohms in series with two parallel resistors R2 of 6 ohms and
            R3 of 12 ohms, powered by a 12 volt source.
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

          {/* Left vertical wire */}
          <line
            x1="85"
            y1="130"
            x2="85"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top left wire to R1 */}
          <line
            x1="85"
            y1="130"
            x2="175"
            y2="130"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 */}
          <polyline
            points={resistor(175, 130, 150, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="220" y="95" style={labelStyle}>
            R₁ = 4Ω
          </text>

          {/* Wire to node B */}
          <line
            x1="325"
            y1="130"
            x2="430"
            y2="130"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Node B */}
          <circle cx="430" cy="130" r="5.5" fill="black" />

          <text x="415" y="118" style={labelStyle}>
            B
          </text>

          {/* Upper branch from B to C via R2 */}
          <line
            x1="430"
            y1="130"
            x2="430"
            y2="75"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="430"
            y1="75"
            x2="510"
            y2="75"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(510, 75, 145, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="655"
            y1="75"
            x2="740"
            y2="75"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Lower branch from B to D via R3 */}
          <line
            x1="430"
            y1="130"
            x2="430"
            y2="230"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="430"
            y1="230"
            x2="510"
            y2="230"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(510, 230, 145, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="655"
            y1="230"
            x2="740"
            y2="230"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right common vertical connection C-D */}
          <line
            x1="740"
            y1="75"
            x2="740"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="740" cy="75" r="5.5" fill="black" />
          <circle cx="740" cy="230" r="5.5" fill="black" />

          <text x="755" y="82" style={labelStyle}>
            C
          </text>

          <text x="755" y="237" style={labelStyle}>
            D
          </text>

          {/* Bottom return wire */}
          <line
            x1="740"
            y1="330"
            x2="740"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="740"
            y1="400"
            x2="85"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Battery / voltage source on bottom wire */}
          <line
            x1="405"
            y1="400"
            x2="440"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="440"
            y1="378"
            x2="440"
            y2="422"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="460"
            y1="388"
            x2="460"
            y2="412"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="480"
            y1="378"
            x2="480"
            y2="422"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="500"
            y1="388"
            x2="500"
            y2="412"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="500"
            y1="400"
            x2="740"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="438" y="372" style={smallStyle}>
            +
          </text>

          <text x="498" y="372" style={smallStyle}>
            −
          </text>

          <text x="450" y="440" style={labelStyle}>
            12V
          </text>

          {/* Node A label */}
          <text x="58" y="140" style={labelStyle}>
            A
          </text>

          {/* Current arrows and labels */}
          <line
            x1="105"
            y1="110"
            x2="165"
            y2="110"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="132" y="92" style={smallStyle}>
            I₁
          </text>

          <line
            x1="470"
            y1="55"
            x2="540"
            y2="55"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="495" y="37" style={smallStyle}>
            I₂
          </text>

          <line
            x1="470"
            y1="210"
            x2="540"
            y2="210"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="495" y="192" style={smallStyle}>
            I₃
          </text>

          <line
            x1="300"
            y1="378"
            x2="220"
            y2="378"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="255" y="360" style={smallStyle}>
            Iₜ
          </text>

          {/* Relation label */}
          <text x="560" y="42" style={smallStyle}>
            I₂ + I₃ = I₁
          </text>

          {/* Labels for R2 and R3 */}
          <text x="545" y="40" style={labelStyle}>
            R₂ = 6Ω
          </text>

          <text x="545" y="195" style={labelStyle}>
            R₃ = 12Ω
          </text>
        </svg>
      </div>
    </main>
  );
}
