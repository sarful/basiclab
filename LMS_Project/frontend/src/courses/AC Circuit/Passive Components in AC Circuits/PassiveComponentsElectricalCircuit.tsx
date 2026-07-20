export default function PassiveComponentsElectricalCircuit() {
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

  const resistor = (
    x: number,
    y: number,
    width = 120,
    height = 18,
    direction: "horizontal" | "vertical" = "horizontal"
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

  const inductorHorizontal = (x: number, y: number, loops = 5, radius = 18) => {
    let d = `M ${x} ${y}`;
    for (let i = 0; i < loops; i++) {
      const start = x + i * 2 * radius;
      d += ` C ${start + radius * 0.2} ${y - 2 * radius}, ${
        start + radius * 1.8
      } ${y - 2 * radius}, ${start + 2 * radius} ${y}`;
    }
    return d;
  };

  const inductorVertical = (x: number, y: number, loops = 5, radius = 17) => {
    let d = `M ${x} ${y}`;
    for (let i = 0; i < loops; i++) {
      const start = y + i * 2 * radius;
      d += ` C ${x + 2 * radius} ${start + radius * 0.2}, ${
        x + 2 * radius
      } ${start + radius * 1.8}, ${x} ${start + 2 * radius}`;
    }
    return d;
  };

  const sinePath = () => `
    M 45 322
    C 60 282, 82 282, 97 322
    C 112 362, 134 362, 149 322
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
          <title id="title">Passive Components Used to Form an Electrical Circuit</title>
          <desc id="desc">
            A clean SVG circuit diagram showing passive components, including
            resistors, inductors, and capacitors, connected with an AC voltage
            source to form an electrical circuit.
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

          {/* AC source and left rail */}
          <line
            x1="90"
            y1="70"
            x2="90"
            y2="245"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="395"
            x2="90"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="90"
            cy="320"
            r="75"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <path
            d={sinePath()}
            fill="none"
            stroke="#2f67b2"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="25" y="375" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">0</tspan>
          </text>

          {/* Source current */}
          <line
            x1="60"
            y1="245"
            x2="60"
            y2="160"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="72" y="185" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">0</tspan>
          </text>

          {/* Top and bottom rails */}
          <line
            x1="90"
            y1="70"
            x2="305"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="485"
            y1="70"
            x2="675"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="675"
            y1="70"
            x2="675"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="465"
            x2="935"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top inductor L */}
          <path
            d={inductorHorizontal(305, 70, 5, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="385" y="35" style={smallTextStyle}>
            L
          </text>

          {/* Middle horizontal resistor and capacitor path */}
          <line
            x1="90"
            y1="165"
            x2="175"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(175, 165, 120, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="220" y="130" style={smallTextStyle}>
            R
          </text>

          <line
            x1="295"
            y1="165"
            x2="360"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="360" cy="165" r="5.5" fill="black" />

          <line
            x1="360"
            y1="165"
            x2="480"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Series capacitor on middle branch */}
          <line
            x1="480"
            y1="125"
            x2="480"
            y2="205"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="515"
            y1="125"
            x2="515"
            y2="205"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="515"
            y1="165"
            x2="675"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="495" y="235" style={smallTextStyle}>
            C
          </text>

          <circle cx="675" cy="165" r="5.5" fill="black" />

          {/* First vertical branch: R and L */}
          <line
            x1="360"
            y1="165"
            x2="360"
            y2="230"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(360, 230, 95, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="398" y="275" style={smallTextStyle}>
            R
          </text>

          <line
            x1="360"
            y1="325"
            x2="360"
            y2="350"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <path
            d={inductorVertical(360, 350, 3, 19)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="398" y="400" style={smallTextStyle}>
            L
          </text>

          <line
            x1="360"
            y1="464"
            x2="360"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx="360" cy="465" r="5.5" fill="black" />

          {/* Second vertical branch: R and C */}
          <line
            x1="675"
            y1="165"
            x2="675"
            y2="230"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(675, 230, 95, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="715" y="270" style={smallTextStyle}>
            R
          </text>

          <line
            x1="675"
            y1="325"
            x2="675"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="625"
            y1="355"
            x2="725"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="625"
            y1="390"
            x2="725"
            y2="390"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="675"
            y1="390"
            x2="675"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="715" y="385" style={smallTextStyle}>
            C
          </text>
          <circle cx="675" cy="465" r="5.5" fill="black" />

          {/* Right branch rail and junction */}
          <line
            x1="675"
            y1="165"
            x2="820"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx="820" cy="165" r="5.5" fill="black" />

          <line
            x1="820"
            y1="165"
            x2="935"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="935"
            y1="165"
            x2="935"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right vertical inductor */}
          <line
            x1="820"
            y1="165"
            x2="820"
            y2="260"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={inductorVertical(820, 260, 4, 17)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="820"
            y1="396"
            x2="820"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="858" y="335" style={smallTextStyle}>
            L
          </text>
          <circle cx="820" cy="465" r="5.5" fill="black" />

          {/* Right-side capacitor */}
          <line
            x1="935"
            y1="265"
            x2="935"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="890"
            y1="310"
            x2="980"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="890"
            y1="345"
            x2="980"
            y2="345"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="935"
            y1="345"
            x2="935"
            y2="465"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="985" y="340" style={smallTextStyle}>
            C
          </text>

          {/* Junction dots */}
          <circle cx="90" cy="70" r="4.5" fill="black" />
          <circle cx="90" cy="465" r="4.5" fill="black" />
          <circle cx="935" cy="165" r="4.5" fill="black" />
          <circle cx="935" cy="465" r="4.5" fill="black" />

          {/* Small clean component caption */}
          <text x="240" y="505" style={tinyTextStyle}>
            Passive components R, L, and C connected to form a practical electrical circuit
          </text>
        </svg>
      </div>
    </main>
  );
}
