export default function InvertingOpAmpVirtualEarth() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 27,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 19,
    fill: "black",
  };

  const resistor = (x: number, y: number, width = 105, height = 17) => {
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
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Inverting Op-Amp with Virtual Earth</title>
          <desc id="desc">
            Black and white SVG circuit diagram of an inverting operational
            amplifier with virtual earth summing point, input resistor, feedback
            resistor, grounded non-inverting input, and output voltage
            reference.
          </desc>

          <rect width="1000" height="520" fill="white" />

          {/* Bottom 0V reference rail */}
          <line
            x1="55"
            y1="440"
            x2="920"
            y2="440"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="55"
            cy="440"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="920"
            cy="440"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="280" y="427" style={smallTextStyle}>
            0V
          </text>

          {/* Vin terminal and input reference */}
          <circle
            cx="55"
            cy="210"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="55"
            y1="440"
            x2="55"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="12" y="335" style={textStyle}>
            Vin
          </text>

          {/* Input wire and Rin */}
          <line
            x1="64"
            y1="210"
            x2="145"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="75" y="172" style={smallTextStyle}>
            Iin
          </text>

          <polyline
            points={resistor(145, 210, 120, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="177" y="175" style={smallTextStyle}>
            Rin
          </text>

          <line
            x1="265"
            y1="210"
            x2="350"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Virtual earth summing node */}
          <circle cx="350" cy="210" r="8" fill="black" />

          <text x="364" y="232" style={smallTextStyle}>
            x
          </text>

          <text x="285" y="267" style={smallTextStyle}>
            Vsum
          </text>

          <text x="102" y="62" style={smallTextStyle}>
            Virtual earth
          </text>

          <text x="100" y="88" style={smallTextStyle}>
            summing point
          </text>

          {/* Op-amp body */}
          <polygon
            points="490,150 490,370 730,260"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="592" y="272" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="506" y="217" style={smallTextStyle}>
            −
          </text>

          <text x="506" y="330" style={smallTextStyle}>
            +
          </text>

          {/* Inverting input connected to summing node */}
          <line
            x1="350"
            y1="210"
            x2="490"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Non-inverting input connected to ground */}
          <line
            x1="490"
            y1="320"
            x2="350"
            y2="320"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="350"
            y1="320"
            x2="350"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="405" y="306" style={smallTextStyle}>
            Vi
          </text>

          {/* Ground symbol */}
          <line
            x1="320"
            y1="405"
            x2="380"
            y2="405"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="330"
            y1="418"
            x2="370"
            y2="418"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="340"
            y1="431"
            x2="360"
            y2="431"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="350"
            y1="405"
            x2="350"
            y2="440"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="372" y="405" style={tinyTextStyle}>
            0V
          </text>

          {/* Output wire and terminal */}
          <line
            x1="730"
            y1="260"
            x2="920"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="810" cy="260" r="5.5" fill="black" />

          <circle
            cx="920"
            cy="260"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="790" y="243" style={smallTextStyle}>
            Iout
          </text>

          <text x="928" y="355" style={textStyle}>
            Vout
          </text>

          <line
            x1="920"
            y1="260"
            x2="920"
            y2="440"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback path with Rf */}
          <line
            x1="350"
            y1="210"
            x2="350"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="350"
            y1="95"
            x2="560"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(560, 95, 125, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="685"
            y1="95"
            x2="810"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="810"
            y1="95"
            x2="810"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="620" y="58" style={smallTextStyle}>
            Rf
          </text>

          <text x="460" y="57" style={smallTextStyle}>
            If
          </text>
        </svg>
      </div>
    </main>
  );
}
