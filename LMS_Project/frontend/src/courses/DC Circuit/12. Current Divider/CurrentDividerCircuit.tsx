export default function CurrentDividerCircuit() {
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

  const resistorLabelStyle = {
    ...textStyle,
    fontSize: 26,
  };

  const resistor = (
    x: number,
    y: number,
    length = 160,
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
      <div className="w-full max-w-4xl bg-white">
        <svg
          viewBox="0 0 760 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Current Divider Circuit</title>
          <desc id="desc">
            Black and white current divider circuit with a source voltage Vg on
            the left, total current IT entering a parallel network of R1 and R2,
            branch currents IR1 and IR2 flowing downward through the resistors,
            and total current IT returning on the bottom conductor.
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

          {/* Left source terminals */}
          <circle
            cx="70"
            cy="70"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <circle
            cx="70"
            cy="450"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="94" y="82" style={labelStyle}>
            A
          </text>
          <text x="94" y="455" style={labelStyle}>
            B
          </text>

          {/* Source branch */}
          <line
            x1="70"
            y1="80"
            x2="70"
            y2="440"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="16" y="86" style={smallStyle}>
            +
          </text>
          <text x="18" y="446" style={smallStyle}>
            −
          </text>
          <text x="22" y="270" style={labelStyle}>
            Vg
          </text>

          {/* Top rail */}
          <line
            x1="80"
            y1="70"
            x2="550"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Bottom rail */}
          <line
            x1="550"
            y1="450"
            x2="80"
            y2="450"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Main top and bottom junction nodes */}
          <circle cx="310" cy="70" r="5.5" fill="black" />
          <circle cx="310" cy="450" r="5.5" fill="black" />

          {/* Top current IT */}
          <line
            x1="150"
            y1="40"
            x2="240"
            y2="40"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="176" y="24" style={smallStyle}>
            Iₜ
          </text>

          {/* Bottom return IT */}
          <line
            x1="250"
            y1="478"
            x2="150"
            y2="478"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="182" y="504" style={smallStyle}>
            Iₜ
          </text>

          {/* Small current direction arrows on top rail */}
          <line
            x1="350"
            y1="40"
            x2="420"
            y2="40"
            stroke="black"
            strokeWidth="2.1"
            markerEnd="url(#arrow)"
          />
          <line
            x1="485"
            y1="40"
            x2="550"
            y2="40"
            stroke="black"
            strokeWidth="2.1"
            markerEnd="url(#arrow)"
          />

          {/* Small current direction arrow on bottom rail */}
          <line
            x1="470"
            y1="478"
            x2="390"
            y2="478"
            stroke="black"
            strokeWidth="2.1"
            markerEnd="url(#arrow)"
          />

          {/* Branch 1 top lead */}
          <line
            x1="310"
            y1="70"
            x2="310"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(310, 110, 170, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="310"
            y1="280"
            x2="310"
            y2="450"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="340" y="255" style={resistorLabelStyle}>
            R₁
          </text>

          {/* Branch 2 top lead */}
          <line
            x1="500"
            y1="70"
            x2="500"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(500, 110, 170, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="500"
            y1="280"
            x2="500"
            y2="450"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="530" y="255" style={resistorLabelStyle}>
            R₂
          </text>

          {/* Top and bottom connection dots for R2 branch */}
          <circle cx="500" cy="70" r="4.8" fill="black" />
          <circle cx="500" cy="450" r="4.8" fill="black" />

          {/* Branch current arrows */}
          <line
            x1="260"
            y1="115"
            x2="260"
            y2="220"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="232" y="103" style={smallStyle}>
            Iᵣ₁
          </text>

          <line
            x1="450"
            y1="115"
            x2="450"
            y2="220"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="422" y="103" style={smallStyle}>
            Iᵣ₂
          </text>
        </svg>
      </div>
    </main>
  );
}
