import type { CSSProperties } from "react";

export default function KirchhoffsCircuitLawExampleNo1() {
  const stroke = 3;

  const textStyle: CSSProperties = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle: CSSProperties = {
    ...textStyle,
    fontSize: 26,
  };

  const smallStyle: CSSProperties = {
    ...textStyle,
    fontSize: 22,
  };

  const tinyStyle: CSSProperties = {
    ...textStyle,
    fontSize: 19,
  };

  const resistor = (
    x: number,
    y: number,
    length = 120,
    height = 17,
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
          viewBox="0 0 1000 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Kirchhoff&apos;s Circuit Law Example Number 1</title>
          <desc id="desc">
            Black and white Kirchhoff circuit law example with two voltage
            sources, three ANSI zigzag resistors, two mesh-current loops, and
            one outer loop-current path.
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

          <rect width="1000" height="560" fill="white" />

          {/* Main rectangular circuit wires */}
          <line x1="95" y1="135" x2="250" y2="135" stroke="black" strokeWidth={stroke} />
          <line x1="370" y1="135" x2="500" y2="135" stroke="black" strokeWidth={stroke} />
          <line x1="500" y1="135" x2="630" y2="135" stroke="black" strokeWidth={stroke} />
          <line x1="750" y1="135" x2="905" y2="135" stroke="black" strokeWidth={stroke} />

          <line x1="95" y1="135" x2="95" y2="410" stroke="black" strokeWidth={stroke} />
          <line x1="905" y1="135" x2="905" y2="410" stroke="black" strokeWidth={stroke} />
          <line x1="95" y1="410" x2="500" y2="410" stroke="black" strokeWidth={stroke} />
          <line x1="500" y1="410" x2="905" y2="410" stroke="black" strokeWidth={stroke} />

          {/* Left voltage source V1 */}
          <line x1="55" y1="250" x2="135" y2="250" stroke="black" strokeWidth={stroke} />
          <line x1="70" y1="275" x2="120" y2="275" stroke="black" strokeWidth={stroke} />
          <line x1="55" y1="300" x2="135" y2="300" stroke="black" strokeWidth={stroke} />
          <line x1="70" y1="325" x2="120" y2="325" stroke="black" strokeWidth={stroke} />

          <text x="30" y="230" style={smallStyle}>
            10V
          </text>
          <text x="25" y="330" style={labelStyle}>
            V₁
          </text>

          {/* Right voltage source V2 */}
          <line x1="865" y1="250" x2="945" y2="250" stroke="black" strokeWidth={stroke} />
          <line x1="880" y1="275" x2="930" y2="275" stroke="black" strokeWidth={stroke} />
          <line x1="865" y1="300" x2="945" y2="300" stroke="black" strokeWidth={stroke} />
          <line x1="880" y1="325" x2="930" y2="325" stroke="black" strokeWidth={stroke} />

          <text x="915" y="230" style={smallStyle}>
            20V
          </text>
          <text x="915" y="330" style={labelStyle}>
            V₂
          </text>

          {/* R1 resistor */}
          <polyline
            points={resistor(250, 135, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="295" y="92" style={labelStyle}>
            R₁
          </text>
          <text x="283" y="122" style={tinyStyle}>
            10 Ω
          </text>

          {/* R2 resistor */}
          <polyline
            points={resistor(630, 135, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="675" y="92" style={labelStyle}>
            R₂
          </text>
          <text x="663" y="122" style={tinyStyle}>
            20 Ω
          </text>

          {/* Central branch R3 */}
          <line x1="500" y1="135" x2="500" y2="210" stroke="black" strokeWidth={stroke} />

          <polyline
            points={resistor(500, 210, 140, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line x1="500" y1="350" x2="500" y2="410" stroke="black" strokeWidth={stroke} />

          <text x="540" y="275" style={labelStyle}>
            R₃
          </text>
          <text x="540" y="310" style={tinyStyle}>
            40 Ω
          </text>

          {/* Nodes A and B */}
          <circle cx="500" cy="135" r="7" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="500" cy="410" r="7" fill="white" stroke="black" strokeWidth={stroke} />

          <text x="485" y="88" style={labelStyle}>
            A
          </text>
          <text x="485" y="460" style={labelStyle}>
            B
          </text>

          {/* Current arrows and labels */}
          <line
            x1="150"
            y1="105"
            x2="210"
            y2="105"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="150" y="88" style={smallStyle}>
            I₁
          </text>

          <line
            x1="850"
            y1="105"
            x2="790"
            y2="105"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="825" y="88" style={smallStyle}>
            I₂
          </text>

          <line
            x1="470"
            y1="352"
            x2="470"
            y2="390"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="430" y="385" style={smallStyle}>
            I₃
          </text>

          {/* Left mesh current loop */}
          <path
            d="M 240 285 A 120 120 0 1 1 390 330"
            fill="none"
            stroke="black"
            strokeWidth="2.8"
            markerEnd="url(#arrow)"
          />
          <text x="295" y="300" style={{ ...labelStyle, fontSize: 36 }}>
            1
          </text>

          {/* Right mesh current loop */}
          <path
            d="M 610 330 A 120 120 0 1 1 760 285"
            fill="none"
            stroke="black"
            strokeWidth="2.8"
            markerEnd="url(#arrow)"
          />
          <text x="685" y="300" style={{ ...labelStyle, fontSize: 36 }}>
            2
          </text>

          {/* Outer loop path and current 3 */}
          <path
            d="M 235 25 H 850 Q 965 25 965 140 V 460 Q 965 530 880 530 H 650"
            fill="none"
            stroke="black"
            strokeWidth="2.8"
            markerEnd="url(#arrow)"
          />
          <text x="735" y="505" style={{ ...labelStyle, fontSize: 36 }}>
            3
          </text>
        </svg>
      </div>
    </main>
  );
}
