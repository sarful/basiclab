export default function NonInvertingOpAmpFeedback() {
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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Non-Inverting Operational Amplifier</title>
          <desc id="desc">
            Clean black-and-white SVG diagram of a non-inverting operational
            amplifier with feedback resistor, ground resistor, input voltage,
            output voltage, and current labels without arrows.
          </desc>

          <rect width="1000" height="520" fill="white" />

          {/* Bottom 0V reference rail */}
          <line
            x1="80"
            y1="435"
            x2="890"
            y2="435"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="80"
            cy="435"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="890"
            cy="435"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="795" y="410" style={smallTextStyle}>
            0V
          </text>

          {/* Input terminal Vin */}
          <circle
            cx="80"
            cy="135"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="18" y="144" style={textStyle}>
            Vin
          </text>

          <line
            x1="89"
            y1="135"
            x2="350"
            y2="135"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="150" y="105" style={smallTextStyle}>
            Iin
          </text>

          {/* Op-amp body */}
          <polygon
            points="350,65 350,300 630,185"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="450" y="200" style={{ ...textStyle, fontSize: 46 }}>
            A
          </text>

          <text x="370" y="120" style={smallTextStyle}>
            +
          </text>

          <text x="370" y="245" style={smallTextStyle}>
            −
          </text>

          {/* Output wire */}
          <line
            x1="630"
            y1="185"
            x2="890"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="740" cy="185" r="5.5" fill="black" />

          <circle
            cx="890"
            cy="185"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="910" y="194" style={textStyle}>
            Vout
          </text>

          <text x="675" y="142" style={smallTextStyle}>
            Iout
          </text>

          {/* Output vertical reference line */}
          <line
            x1="890"
            y1="185"
            x2="890"
            y2="435"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Inverting input feedback node */}
          <line
            x1="350"
            y1="245"
            x2="260"
            y2="245"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="260"
            y1="245"
            x2="260"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="260" cy="245" r="5.5" fill="black" />

          <text x="200" y="255" style={textStyle}>
            V₁
          </text>

          {/* R2 resistor to ground */}
          <polyline
            points={resistor(260, 325, 90, 15, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="285" y="370" style={textStyle}>
            R₂
          </text>

          <line
            x1="260"
            y1="415"
            x2="260"
            y2="435"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Ground symbol under R2 */}
          <line
            x1="230"
            y1="435"
            x2="290"
            y2="435"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="240"
            y1="448"
            x2="280"
            y2="448"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="250"
            y1="461"
            x2="270"
            y2="461"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback resistor Rf */}
          <line
            x1="260"
            y1="325"
            x2="430"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(430, 325, 130, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="560"
            y1="325"
            x2="740"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="740"
            y1="325"
            x2="740"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="475" y="302" style={textStyle}>
            Rf
          </text>

          <text x="675" y="385" style={smallTextStyle}>
            If
          </text>
        </svg>
      </div>
    </main>
  );
}
