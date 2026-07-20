export default function SeriesResistanceInductanceCircuit() {
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

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const resistor = (x: number, y: number, width = 150, height = 24) => {
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

  const inductor = (x: number, y: number, loops = 5, radius = 24) => {
    let d = `M ${x} ${y}`;

    for (let i = 0; i < loops; i++) {
      const start = x + i * 2 * radius;
      d += ` C ${start + radius * 0.2} ${y - radius * 2}, ${
        start + radius * 1.8
      } ${y - radius * 2}, ${start + radius * 2} ${y}`;
    }

    return d;
  };

  const sinePath = () => `
    M 420 360
    C 434 330, 456 330, 470 360
    C 484 390, 506 390, 520 360
  `;

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
          <title id="title">Series Resistance-Inductance Circuit</title>
          <desc id="desc">
            A clean SVG diagram of a series resistance-inductance circuit with
            resistor R, inductor L, source voltage V, current I, and voltage
            drops VR and VL.
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

          {/* Main outer loop */}
          <line
            x1="70"
            y1="115"
            x2="185"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Resistor R */}
          <polyline
            points={resistor(185, 115, 160, 25)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="255" y="55" style={textStyle}>
            R
          </text>

          <line
            x1="345"
            y1="115"
            x2="535"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Inductor L */}
          <path
            d={inductor(535, 115, 5, 25)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="650" y="55" style={textStyle}>
            L
          </text>

          <line
            x1="785"
            y1="115"
            x2="920"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="920"
            y1="115"
            x2="920"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="70"
            y1="355"
            x2="385"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="555"
            y1="355"
            x2="920"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="70"
            y1="115"
            x2="70"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* AC voltage source in bottom branch */}
          <circle
            cx="470"
            cy="355"
            r="42"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <path
            d={sinePath()}
            fill="none"
            stroke="#2f67b2"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          <circle
            cx="385"
            cy="355"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="555"
            cy="355"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="460" y="318" style={textStyle}>
            V
          </text>

          {/* Current arrow on left side */}
          <line
            x1="35"
            y1="310"
            x2="35"
            y2="175"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="10" y="245" style={textStyle}>
            I
          </text>

          {/* VR voltage indicator */}
          <line
            x1="170"
            y1="140"
            x2="170"
            y2="250"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="365"
            y1="140"
            x2="365"
            y2="250"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="182"
            y1="230"
            x2="355"
            y2="230"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="248" y="205" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          {/* VL voltage indicator */}
          <line
            x1="510"
            y1="140"
            x2="510"
            y2="250"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="805"
            y1="140"
            x2="805"
            y2="250"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="522"
            y1="230"
            x2="795"
            y2="230"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="638" y="205" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">L</tspan>
          </text>

          {/* Bottom source polarity and neat terminal marks */}
          <text x="370" y="395" style={smallTextStyle}>
            −
          </text>
          <text x="565" y="395" style={smallTextStyle}>
            +
          </text>

          {/* Junction dots */}
          <circle cx="70" cy="115" r="4.5" fill="black" />
          <circle cx="70" cy="355" r="4.5" fill="black" />
          <circle cx="920" cy="115" r="4.5" fill="black" />
          <circle cx="920" cy="355" r="4.5" fill="black" />

          {/* Bottom caption */}
          <text x="245" y="485" style={tinyTextStyle}>
            Series R-L circuit: resistance and inductance connected in series with an AC voltage source.
          </text>
        </svg>
      </div>
    </main>
  );
}
