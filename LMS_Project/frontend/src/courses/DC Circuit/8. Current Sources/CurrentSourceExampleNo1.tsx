export default function CurrentSourceExampleNo1() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  } as const;

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  } as const;

  const smallStyle = {
    ...textStyle,
    fontSize: 19,
  } as const;

  const formulaStyle = {
    ...textStyle,
    fontSize: 28,
  } as const;

  const currentSource = (
    cx: number,
    cy: number,
    value: string,
    direction: "up" | "down" = "up"
  ) => {
    const startY = direction === "up" ? cy + 28 : cy - 28;
    const endY = direction === "up" ? cy - 28 : cy + 28;

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="38"
          fill="white"
          stroke="black"
          strokeWidth={stroke}
        />
        <line
          x1={cx}
          y1={startY}
          x2={cx}
          y2={endY}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
        <text
          x={cx + 46}
          y={cy + 8}
          dominantBaseline="middle"
          style={labelStyle}
        >
          {value}
        </text>
      </g>
    );
  };

  const resistor = (x: number, y: number, length = 140, height = 16) => {
    const step = length / 8;
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
          viewBox="0 0 1200 460"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Current Source Example Number 1</title>
          <desc id="desc">
            Black and white circuit diagram with two parallel current sources
            of 250 mA and 150 mA feeding a 20 ohm resistor, along with current,
            voltage, and power calculations.
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

          <rect width="1200" height="460" fill="white" />

          {/* Left circuit block */}
          <g>
            {/* top wire */}
            <line
              x1="70"
              y1="80"
              x2="525"
              y2="80"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* vertical branches */}
            <line
              x1="70"
              y1="80"
              x2="70"
              y2="135"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="70"
              y1="211"
              x2="70"
              y2="330"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="300"
              y1="80"
              x2="300"
              y2="135"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="300"
              y1="211"
              x2="300"
              y2="330"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="525"
              y1="80"
              x2="525"
              y2="120"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* bottom wire */}
            <line
              x1="70"
              y1="330"
              x2="525"
              y2="330"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* sources */}
            {currentSource(70, 173, "250mA", "up")}
            {currentSource(300, 173, "150mA", "up")}

            {/* resistor load */}
            <polyline
              points={resistor(525, 120, 140, 16)}
              fill="none"
              stroke="black"
              strokeWidth={stroke}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="525"
              y1="260"
              x2="525"
              y2="330"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <text x="555" y="210" style={labelStyle}>
              20Ω
            </text>

            {/* current arrows on top */}
            <line
              x1="145"
              y1="52"
              x2="235"
              y2="52"
              stroke="black"
              strokeWidth="2.4"
              markerEnd="url(#arrow)"
            />
            <text x="168" y="34" style={smallStyle}>
              I₁
            </text>

            <line
              x1="375"
              y1="52"
              x2="470"
              y2="52"
              stroke="black"
              strokeWidth="2.4"
              markerEnd="url(#arrow)"
            />
            <text x="400" y="34" style={smallStyle}>
              I₂
            </text>

            <line
              x1="455"
              y1="36"
              x2="575"
              y2="36"
              stroke="black"
              strokeWidth="2.4"
              markerEnd="url(#arrow)"
            />
            <text x="488" y="18" style={smallStyle}>
              Iₜ = 0.4A
            </text>

            {/* output polarity */}
            <text x="547" y="92" style={smallStyle}>
              +
            </text>
            <text x="548" y="323" style={smallStyle}>
              −
            </text>

            {/* small loop arrows */}
            <path
              d="M 95 120 C 155 120, 185 150, 185 230"
              fill="none"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text x="55" y="120" style={smallStyle}>
              Δ I₀
            </text>

            <path
              d="M 325 120 C 385 120, 415 150, 415 230"
              fill="none"
              stroke="none"
            />
            <path
              d="M 325 120 C 385 120, 415 150, 415 230"
              fill="none"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text x="285" y="120" style={smallStyle}>
              Δ I₀
            </text>

            {/* resistor power/voltage block label omitted in ref, keep clean */}
          </g>

          {/* Formula block */}
          <g>
            <text x="700" y="120" style={formulaStyle}>
              Iₜ = I₁ + I₂ = 0.25 + 0.15 = 0.4A
            </text>

            <text x="700" y="200" style={formulaStyle}>
              Vᵣ = Iₜ × R = 0.4 × 20 = 8V
            </text>

            <text x="700" y="280" style={formulaStyle}>
              Pᵣ = Iₜ² × R = 0.4² × 20 = 3.2W
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
