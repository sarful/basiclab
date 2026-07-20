export default function InvertingOpAmpBasic() {
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
          <title id="title">Basic Inverting Operational Amplifier</title>
          <desc id="desc">
            Basic inverting operational amplifier circuit with input resistor,
            feedback resistor, grounded non-inverting input, and output voltage.
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

          {/* Input terminals */}
          <circle
            cx="80"
            cy="215"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="80"
            cy="330"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="15" y="255" style={textStyle}>
            Vin
          </text>

          <line
            x1="80"
            y1="338"
            x2="80"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input ground */}
          <line
            x1="50"
            y1="395"
            x2="110"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="60"
            y1="408"
            x2="100"
            y2="408"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="421"
            x2="90"
            y2="421"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Input wire and current */}
          <line
            x1="90"
            y1="215"
            x2="250"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="125"
            y1="185"
            x2="205"
            y2="185"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="145" y="166" style={smallTextStyle}>
            Iin
          </text>

          {/* Input resistor Rin */}
          <polyline
            points={resistor(250, 215, 125, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="290" y="178" style={smallTextStyle}>
            Rin
          </text>

          <line
            x1="375"
            y1="215"
            x2="455"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Summing node */}
          <circle cx="455" cy="215" r="7" fill="black" />

          {/* Op-amp body */}
          <polygon
            points="530,145 530,350 760,250"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="630" y="266" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="548" y="223" style={smallTextStyle}>
            −
          </text>

          <text x="548" y="317" style={smallTextStyle}>
            +
          </text>

          {/* Inverting input connection */}
          <line
            x1="455"
            y1="215"
            x2="530"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Non-inverting input to ground */}
          <line
            x1="530"
            y1="310"
            x2="455"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="455"
            y1="310"
            x2="455"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="425"
            y1="405"
            x2="485"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="435"
            y1="418"
            x2="475"
            y2="418"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="445"
            y1="431"
            x2="465"
            y2="431"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output wire */}
          <line
            x1="760"
            y1="250"
            x2="900"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="805" cy="250" r="5.5" fill="black" />

          <circle
            cx="900"
            cy="250"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="920" y="264" style={textStyle}>
            Vout
          </text>

          {/* Output reference ground */}
          <line
            x1="900"
            y1="260"
            x2="900"
            y2="390"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="870"
            y1="390"
            x2="930"
            y2="390"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="880"
            y1="403"
            x2="920"
            y2="403"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="890"
            y1="416"
            x2="910"
            y2="416"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback path */}
          <line
            x1="455"
            y1="215"
            x2="455"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="455"
            y1="85"
            x2="565"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="485"
            y1="60"
            x2="545"
            y2="60"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="505" y="42" style={smallTextStyle}>
            If
          </text>

          {/* Feedback resistor Rf */}
          <polyline
            points={resistor(565, 85, 130, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="620" y="50" style={smallTextStyle}>
            Rf
          </text>

          <line
            x1="695"
            y1="85"
            x2="805"
            y2="85"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="805"
            y1="85"
            x2="805"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
