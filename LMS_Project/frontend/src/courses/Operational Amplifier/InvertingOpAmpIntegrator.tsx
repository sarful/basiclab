export default function InvertingOpAmpIntegrator() {
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

  const resistor = (x: number, y: number, width = 115, height = 17) => {
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
          <title id="title">Inverting Op-Amp Integrator</title>
          <desc id="desc">
            Black and white SVG circuit diagram of an inverting operational
            amplifier integrator using input resistor Rin and feedback capacitor
            C.
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

          {/* Input voltage source */}
          <circle
            cx="85"
            cy="215"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="85"
            cy="295"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="15" y="226" style={textStyle}>
            Vin
          </text>

          <line
            x1="85"
            y1="305"
            x2="85"
            y2="370"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input ground */}
          <line
            x1="55"
            y1="370"
            x2="115"
            y2="370"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="65"
            y1="383"
            x2="105"
            y2="383"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="75"
            y1="396"
            x2="95"
            y2="396"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input wire and current */}
          <line
            x1="95"
            y1="215"
            x2="235"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="115"
            y1="185"
            x2="190"
            y2="185"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="115" y="165" style={smallTextStyle}>
            Iin
          </text>

          {/* Rin */}
          <polyline
            points={resistor(235, 215, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="275" y="180" style={smallTextStyle}>
            Rin
          </text>

          <line
            x1="355"
            y1="215"
            x2="430"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Summing node */}
          <circle cx="430" cy="215" r="7.5" fill="black" />

          <text x="445" y="198" style={smallTextStyle}>
            x
          </text>

          {/* Op-amp */}
          <polygon
            points="510,160 510,360 740,260"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="610" y="276" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="528" y="223" style={smallTextStyle}>
            −
          </text>

          <text x="528" y="318" style={smallTextStyle}>
            +
          </text>

          {/* Inverting input connection */}
          <line
            x1="430"
            y1="215"
            x2="510"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Non-inverting input to ground */}
          <line
            x1="510"
            y1="310"
            x2="430"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="430"
            y1="310"
            x2="430"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="400"
            y1="405"
            x2="460"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="410"
            y1="418"
            x2="450"
            y2="418"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="420"
            y1="431"
            x2="440"
            y2="431"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output wire */}
          <line
            x1="740"
            y1="260"
            x2="820"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="820" cy="260" r="5.5" fill="black" />

          {/* Feedback path */}
          <line
            x1="430"
            y1="215"
            x2="430"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="430"
            y1="85"
            x2="565"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback current */}
          <line
            x1="475"
            y1="62"
            x2="545"
            y2="62"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="500" y="43" style={smallTextStyle}>
            If
          </text>

          {/* Capacitor C */}
          <line
            x1="565"
            y1="55"
            x2="565"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="595"
            y1="55"
            x2="595"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="595"
            y1="85"
            x2="820"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="820"
            y1="85"
            x2="820"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="610" y="45" style={smallTextStyle}>
            C
          </text>

          <text x="568" y="145" style={smallTextStyle}>
            vc
          </text>

          {/* Output terminal and reference */}
          <line
            x1="820"
            y1="260"
            x2="900"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="900"
            cy="260"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="900"
            cy="335"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="925" y="275" style={textStyle}>
            Vout
          </text>

          <line
            x1="900"
            y1="345"
            x2="900"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output ground */}
          <line
            x1="870"
            y1="400"
            x2="930"
            y2="400"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="880"
            y1="413"
            x2="920"
            y2="413"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="890"
            y1="426"
            x2="910"
            y2="426"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
