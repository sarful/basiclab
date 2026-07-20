export default function TappingPointsInVoltageDividerNetwork() {
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
    fontSize: 20,
  };

  const resistorLabelStyle = {
    ...textStyle,
    fontSize: 22,
  };

  const resistor = (
    x: number,
    y: number,
    length = 110,
    height = 16,
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
      <div className="w-full max-w-3xl bg-white">
        <svg
          viewBox="0 0 520 980"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Tapping Points in a Voltage Divider Network</title>
          <desc id="desc">
            Black and white voltage divider network with source Vs on the left,
            upward current I, and a resistor ladder on the right with tapping
            points A, B, C, D, and E. Voltage sections VAB, VBC, VCD, and VDE
            are shown on the right.
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

          <rect width="520" height="980" fill="white" />

          {/* Top wire */}
          <line
            x1="90"
            y1="70"
            x2="235"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Left branch above source */}
          <line
            x1="90"
            y1="70"
            x2="90"
            y2="320"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Source on left branch */}
          <line
            x1="60"
            y1="320"
            x2="120"
            y2="320"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="72"
            y1="350"
            x2="108"
            y2="350"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Left branch below source */}
          <line
            x1="90"
            y1="350"
            x2="90"
            y2="900"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Bottom wire */}
          <line
            x1="90"
            y1="900"
            x2="235"
            y2="900"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Source label and polarity */}
          <text x="16" y="337" style={labelStyle}>
            Vₛ
          </text>
          <text x="48" y="312" style={smallStyle}>
            +
          </text>
          <text x="50" y="372" style={smallStyle}>
            −
          </text>

          {/* Current arrow on left branch */}
          <line
            x1="58"
            y1="250"
            x2="58"
            y2="170"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="40" y="216" style={smallStyle}>
            I
          </text>

          {/* Resistor ladder trunk connections */}
          <line
            x1="235"
            y1="70"
            x2="235"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 */}
          <polyline
            points={resistor(235, 120, 110, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="285" y="180" style={resistorLabelStyle}>
            R₁
          </text>
          <text x="278" y="212" style={resistorLabelStyle}>
            8.0kΩ
          </text>

          <line
            x1="235"
            y1="230"
            x2="235"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R2 */}
          <polyline
            points={resistor(235, 280, 110, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="285" y="340" style={resistorLabelStyle}>
            R₂
          </text>
          <text x="278" y="372" style={resistorLabelStyle}>
            4.0kΩ
          </text>

          <line
            x1="235"
            y1="390"
            x2="235"
            y2="440"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R3 */}
          <polyline
            points={resistor(235, 440, 110, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="285" y="500" style={resistorLabelStyle}>
            R₃
          </text>
          <text x="278" y="532" style={resistorLabelStyle}>
            2.0kΩ
          </text>

          <line
            x1="235"
            y1="550"
            x2="235"
            y2="600"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R4 */}
          <polyline
            points={resistor(235, 600, 110, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="285" y="660" style={resistorLabelStyle}>
            R₄
          </text>
          <text x="278" y="692" style={resistorLabelStyle}>
            1.0kΩ
          </text>

          <line
            x1="235"
            y1="710"
            x2="235"
            y2="900"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Node circles */}
          <circle cx="235" cy="70" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="235" cy="230" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="235" cy="390" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="235" cy="550" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="235" cy="710" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="235" cy="900" r="5.5" fill="white" stroke="black" strokeWidth={stroke} />

          {/* Tapping arrows to the right */}
          {[
            [70, "A"],
            [230, "B"],
            [390, "C"],
            [550, "D"],
            [900, "E"],
          ].map(([y, label], idx) => (
            <g key={idx}>
              <line
                x1="235"
                y1={y as number}
                x2="405"
                y2={y as number}
                stroke="black"
                strokeWidth={stroke}
                strokeLinecap="round"
                markerEnd="url(#arrow)"
              />
              <text x="425" y={(y as number) + 8} style={labelStyle}>
                {label as string}
              </text>
            </g>
          ))}

          {/* Voltage arrows on right */}
          <line
            x1="395"
            y1="220"
            x2="395"
            y2="80"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="410" y="155" style={labelStyle}>
            Vₐᵦ
          </text>

          <line
            x1="395"
            y1="380"
            x2="395"
            y2="240"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="410" y="315" style={labelStyle}>
            Vᵦᶜ
          </text>

          <line
            x1="395"
            y1="540"
            x2="395"
            y2="400"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="410" y="475" style={labelStyle}>
            Vᶜᵈ
          </text>

          <line
            x1="395"
            y1="890"
            x2="395"
            y2="560"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="410" y="730" style={labelStyle}>
            Vᵈᵉ
          </text>
        </svg>
      </div>
    </main>
  );
}
