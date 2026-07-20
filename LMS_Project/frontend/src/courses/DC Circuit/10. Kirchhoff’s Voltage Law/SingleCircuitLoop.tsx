export default function SingleCircuitLoop() {
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

  const titleStyle = {
    ...textStyle,
    fontSize: 22,
    fontWeight: "bold",
  };

  const resistor = (
    x,
    y,
    length = 140,
    height = 18,
    direction = "horizontal"
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
      <div className="w-full max-w-4xl bg-white">
        <svg
          viewBox="0 0 760 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Single Circuit Loop</title>
          <desc id="desc">
            Black and white single closed circuit loop using ANSI zigzag
            resistor symbols, one voltage source, two resistors, current
            direction arrows, and loop-current direction.
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

          <rect width="760" height="520" fill="white" />

          {/* Heading */}
          <text x="380" y="34" textAnchor="middle" style={titleStyle}>
            Single Circuit Loop
          </text>

          {/* Main rectangular loop wires */}
          <line
            x1="110"
            y1="100"
            x2="255"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="395"
            y1="100"
            x2="620"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="620"
            y1="100"
            x2="620"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="620"
            y1="315"
            x2="620"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="620"
            y1="415"
            x2="110"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="110"
            y1="415"
            x2="110"
            y2="300"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="110"
            y1="180"
            x2="110"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top resistor R1 */}
          <polyline
            points={resistor(255, 100, 140, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="315" y="58" textAnchor="middle" style={labelStyle}>
            R₁
          </text>

          {/* Right resistor R2 */}
          <polyline
            points={resistor(620, 175, 140, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="668" y="255" style={labelStyle}>
            R₂
          </text>

          {/* Left voltage source / battery */}
          <line
            x1="72"
            y1="180"
            x2="148"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="87"
            y1="210"
            x2="133"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="72"
            y1="240"
            x2="148"
            y2="240"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="87"
            y1="270"
            x2="133"
            y2="270"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="110"
            y1="180"
            x2="110"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="270"
            x2="110"
            y2="300"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="56" y="188" style={smallStyle}>
            +
          </text>
          <text x="58" y="278" style={smallStyle}>
            −
          </text>
          <text x="28" y="238" style={labelStyle}>
            Vₛ
          </text>

          {/* Polarity across R1 */}
          <text x="220" y="82" style={smallStyle}>
            +
          </text>
          <text x="420" y="82" style={smallStyle}>
            −
          </text>

          {/* Polarity across R2 */}
          <text x="650" y="170" style={smallStyle}>
            +
          </text>
          <text x="650" y="330" style={smallStyle}>
            −
          </text>

          {/* Top current direction arrow */}
          <line
            x1="150"
            y1="72"
            x2="230"
            y2="72"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="186" y="54" style={smallStyle}>
            i
          </text>

          {/* Current arrow after R1 */}
          <line
            x1="410"
            y1="150"
            x2="525"
            y2="150"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="462" y="134" style={smallStyle}>
            I
          </text>

          {/* Right current label */}
          <line
            x1="655"
            y1="160"
            x2="655"
            y2="220"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="670" y="157" style={smallStyle}>
            I₂
          </text>

          {/* Large clockwise loop arrow */}
          <path
            d="M 260 285
               C 260 190, 500 190, 500 285
               C 500 365, 260 365, 260 285"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text
            x="380"
            y="305"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ ...labelStyle, fontSize: 30 }}
          >
            Loop
          </text>

          <text x="355" y="245" style={labelStyle}>
            I
          </text>

          {/* Node dots */}
          <circle cx="110" cy="100" r="4.5" fill="black" />
          <circle cx="620" cy="100" r="4.5" fill="black" />
          <circle cx="620" cy="415" r="4.5" fill="black" />
          <circle cx="110" cy="415" r="4.5" fill="black" />
        </svg>
      </div>
    </main>
  );
}
