export default function KirchhoffsCircuitLawSimpleExample() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 26,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 22,
  };

  const tinyStyle = {
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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Kirchhoff Circuit Law Simple Example</title>
          <desc id="desc">
            Black and white Kirchhoff circuit law example using ANSI zigzag
            resistor symbols. The circuit contains two voltage sources, R1,
            R2, R3, and branch currents I1, I2, and I3.
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

          <line x1="90" y1="120" x2="230" y2="120" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="350" y1="120" x2="500" y2="120" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="500" y1="120" x2="650" y2="120" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="770" y1="120" x2="910" y2="120" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <line x1="90" y1="120" x2="90" y2="400" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="910" y1="120" x2="910" y2="400" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="90" y1="400" x2="500" y2="400" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="500" y1="400" x2="910" y2="400" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <line x1="50" y1="230" x2="130" y2="230" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="65" y1="255" x2="115" y2="255" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="50" y1="280" x2="130" y2="280" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="65" y1="305" x2="115" y2="305" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <text x="20" y="220" style={smallStyle}>10V</text>
          <text x="24" y="315" style={labelStyle}>V₁</text>

          <line x1="870" y1="230" x2="950" y2="230" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="885" y1="255" x2="935" y2="255" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="870" y1="280" x2="950" y2="280" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="885" y1="305" x2="935" y2="305" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <text x="895" y="220" style={smallStyle}>20V</text>
          <text x="895" y="315" style={labelStyle}>V₂</text>

          <polyline
            points={resistor(230, 120, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="280" y="72" style={labelStyle}>R₁</text>
          <text x="270" y="106" style={tinyStyle}>10 Ω</text>

          <polyline
            points={resistor(650, 120, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="700" y="72" style={labelStyle}>R₂</text>
          <text x="690" y="106" style={tinyStyle}>20 Ω</text>

          <line x1="500" y1="120" x2="500" y2="195" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <polyline
            points={resistor(500, 195, 145, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line x1="500" y1="340" x2="500" y2="400" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          <text x="535" y="255" style={labelStyle}>R₃</text>
          <text x="535" y="292" style={tinyStyle}>40 Ω</text>

          <line
            x1="130"
            y1="90"
            x2="205"
            y2="90"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="145" y="65" style={smallStyle}>I₁</text>

          <line
            x1="875"
            y1="90"
            x2="800"
            y2="90"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="825" y="65" style={smallStyle}>I₂</text>

          <line
            x1="470"
            y1="340"
            x2="470"
            y2="380"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="430" y="375" style={smallStyle}>I₃</text>

          <text x="535" y="385" style={smallStyle}>
            I₃ = −(I₁ + I₂)
          </text>
        </svg>
      </div>
    </main>
  );
}
