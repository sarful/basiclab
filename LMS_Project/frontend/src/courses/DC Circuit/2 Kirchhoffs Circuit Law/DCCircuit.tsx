import type { CSSProperties } from "react";

export default function DCCircuit() {
  const stroke = 3;

  const textStyle: CSSProperties = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle: CSSProperties = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle: CSSProperties = {
    ...textStyle,
    fontSize: 20,
  };

  const resistor = (
    x: number,
    y: number,
    length = 110,
    height = 16,
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
          viewBox="0 0 1000 620"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">DC Circuit</title>
          <desc id="desc">
            Black and white DC resistor circuit using ANSI zigzag resistor
            symbols, a DC voltage source, branch label, nodes, and loop current.
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

          <rect width="1000" height="620" fill="white" />

          {/* DC voltage source on the left */}
          <line
            x1="70"
            y1="185"
            x2="70"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="40"
            y1="275"
            x2="100"
            y2="275"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="52"
            y1="300"
            x2="88"
            y2="300"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="40"
            y1="405"
            x2="100"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="52"
            y1="430"
            x2="88"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="35" y="165" style={labelStyle}>
            +
          </text>
          <text x="42" y="505" style={labelStyle}>
            −
          </text>
          <text x="22" y="380" style={labelStyle}>
            V
          </text>

          {/* Top left branch with R1 */}
          <line
            x1="70"
            y1="185"
            x2="150"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(150, 185, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="270"
            y1="185"
            x2="340"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="190" y="145" style={labelStyle}>
            R₁
          </text>

          {/* Upper-left node */}
          <circle cx="340" cy="185" r="8" fill="black" />

          {/* R2 vertical branch */}
          <line
            x1="340"
            y1="185"
            x2="340"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(340, 260, 150, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="340"
            y1="410"
            x2="340"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="285" y="360" style={labelStyle}>
            R₂
          </text>

          {/* Bottom-left node */}
          <circle
            cx="340"
            cy="555"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* R3 branch between top nodes */}
          <line
            x1="340"
            y1="185"
            x2="405"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(405, 185, 150, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="555"
            y1="185"
            x2="610"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="470" y="145" style={labelStyle}>
            R₃
          </text>

          <text x="420" y="250" style={smallStyle}>
            Branch
          </text>

          <line
            x1="365"
            y1="220"
            x2="585"
            y2="220"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* Upper-right node */}
          <circle cx="610" cy="185" r="8" fill="black" />

          {/* Node label with arrows */}
          <text x="455" y="50" style={labelStyle}>
            Nodes
          </text>

          <line
            x1="475"
            y1="65"
            x2="355"
            y2="165"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <line
            x1="535"
            y1="65"
            x2="595"
            y2="165"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* R4 vertical branch */}
          <line
            x1="610"
            y1="185"
            x2="610"
            y2="265"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(610, 265, 150, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="610"
            y1="415"
            x2="610"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="560" y="360" style={labelStyle}>
            R₄
          </text>

          {/* Bottom-center node */}
          <circle
            cx="610"
            cy="555"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Bottom R5 branch */}
          <line
            x1="70"
            y1="555"
            x2="340"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="340"
            y1="555"
            x2="405"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(405, 555, 150, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="555"
            y1="555"
            x2="610"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="470" y="520" style={labelStyle}>
            R₅
          </text>

          {/* Top-right R7 branch */}
          <line
            x1="610"
            y1="185"
            x2="700"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(700, 185, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="820"
            y1="185"
            x2="925"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="740" y="145" style={labelStyle}>
            R₇
          </text>

          {/* Right side R8 branch */}
          <line
            x1="925"
            y1="185"
            x2="925"
            y2="270"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(925, 270, 150, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="925"
            y1="420"
            x2="925"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="925"
            y1="555"
            x2="610"
            y2="555"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="880" y="360" style={labelStyle}>
            R₈
          </text>

          {/* Loop current arrow */}
          <rect
            x="705"
            y="265"
            width="140"
            height="210"
            rx="55"
            ry="55"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          <line
            x1="705"
            y1="392"
            x2="705"
            y2="330"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="735" y="375" style={labelStyle}>
            Loop
          </text>
        </svg>
      </div>
    </main>
  );
}
