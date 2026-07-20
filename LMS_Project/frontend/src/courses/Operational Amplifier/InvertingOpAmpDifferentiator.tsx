export default function InvertingOpAmpDifferentiator() {
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

  const resistor = (x: number, y: number, width = 120, height = 17) => {
    const step = width / 8;

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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Inverting Op-Amp Differentiator</title>
          <desc id="desc">
            Black and white SVG circuit diagram of an inverting operational
            amplifier differentiator using an input capacitor and feedback
            resistor.
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

          {/* Input voltage source terminals */}
          <circle
            cx="80"
            cy="220"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="80"
            cy="290"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="15" y="232" style={textStyle}>
            Vin
          </text>

          <line
            x1="80"
            y1="298"
            x2="80"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input ground */}
          <line
            x1="50"
            y1="360"
            x2="110"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="60"
            y1="373"
            x2="100"
            y2="373"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="386"
            x2="90"
            y2="386"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input wire */}
          <line
            x1="90"
            y1="220"
            x2="285"
            y2="220"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input current arrow */}
          <line
            x1="115"
            y1="190"
            x2="210"
            y2="190"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="120" y="170" style={smallTextStyle}>
            Iin
          </text>

          {/* Input capacitor C */}
          <line
            x1="285"
            y1="180"
            x2="285"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="320"
            y1="180"
            x2="320"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="290" y="155" style={smallTextStyle}>
            C
          </text>

          <text x="285" y="300" style={smallTextStyle}>
            Vc
          </text>

          <line
            x1="320"
            y1="220"
            x2="440"
            y2="220"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Summing node */}
          <circle cx="440" cy="220" r="7.5" fill="black" />

          <text x="455" y="203" style={smallTextStyle}>
            x
          </text>

          {/* Op-amp body */}
          <polygon
            points="520,150 520,355 750,255"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="620" y="270" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="538" y="228" style={smallTextStyle}>
            −
          </text>

          <text x="538" y="322" style={smallTextStyle}>
            +
          </text>

          {/* Inverting input connection */}
          <line
            x1="440"
            y1="220"
            x2="520"
            y2="220"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Non-inverting input to ground */}
          <line
            x1="520"
            y1="315"
            x2="440"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="440"
            y1="315"
            x2="440"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="410"
            y1="405"
            x2="470"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="420"
            y1="418"
            x2="460"
            y2="418"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="430"
            y1="431"
            x2="450"
            y2="431"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output wire */}
          <line
            x1="750"
            y1="255"
            x2="900"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="805" cy="255" r="5.5" fill="black" />

          <circle
            cx="900"
            cy="255"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="920" y="268" style={textStyle}>
            Vout
          </text>

          {/* Output ground reference */}
          <circle
            cx="900"
            cy="330"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="900"
            y1="338"
            x2="900"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="870"
            y1="395"
            x2="930"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="880"
            y1="408"
            x2="920"
            y2="408"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="890"
            y1="421"
            x2="910"
            y2="421"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback path */}
          <line
            x1="440"
            y1="220"
            x2="440"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="440"
            y1="90"
            x2="555"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback current arrow */}
          <line
            x1="470"
            y1="65"
            x2="540"
            y2="65"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="495" y="45" style={smallTextStyle}>
            If
          </text>

          {/* Feedback resistor Rf */}
          <polyline
            points={resistor(555, 90, 130, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="610" y="55" style={smallTextStyle}>
            Rf
          </text>

          <line
            x1="685"
            y1="90"
            x2="805"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="805"
            y1="90"
            x2="805"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
