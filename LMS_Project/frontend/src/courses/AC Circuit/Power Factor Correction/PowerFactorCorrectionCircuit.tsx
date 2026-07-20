export default function PowerFactorCorrectionCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 21,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
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

  const inductor = (x: number, y: number, loops = 4, radius = 24) => {
    let d = `M ${x} ${y}`;

    for (let i = 0; i < loops; i++) {
      const start = x + i * 2 * radius;
      d += ` C ${start + radius * 0.2} ${y - 2 * radius}, ${
        start + radius * 1.8
      } ${y - 2 * radius}, ${start + 2 * radius} ${y}`;
    }

    return d;
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
          <title id="title">Power Factor Correction Circuit</title>
          <desc id="desc">
            SVG circuit diagram showing a power factor correction circuit with
            resistor, inductor, capacitor, AC supply voltage, and line current.
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

          {/* Left and right main vertical rails */}
          <line
            x1="115"
            y1="120"
            x2="115"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="885"
            y1="120"
            x2="885"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top branch wires */}
          <line
            x1="115"
            y1="120"
            x2="270"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Series resistor */}
          <polyline
            points={resistor(270, 120, 160, 25)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="430"
            y1="120"
            x2="560"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Series inductor */}
          <path
            d={inductor(560, 120, 4, 28)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="784"
            y1="120"
            x2="885"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top component labels */}
          <text x="298" y="52" style={textStyle}>
            R = 10Ω
          </text>

          <text x="620" y="52" style={textStyle}>
            L = 46mH
          </text>

          {/* Polarity marks across resistor and inductor */}
          <text x="245" y="158" style={smallTextStyle}>
            +
          </text>
          <text x="442" y="158" style={smallTextStyle}>
            −
          </text>
          <text x="532" y="158" style={smallTextStyle}>
            +
          </text>
          <text x="795" y="158" style={smallTextStyle}>
            −
          </text>

          {/* Middle capacitor branch */}
          <line
            x1="115"
            y1="285"
            x2="495"
            y2="285"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="505"
            y1="235"
            x2="505"
            y2="335"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="535"
            y1="235"
            x2="535"
            y2="335"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="545"
            y1="285"
            x2="885"
            y2="285"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="455" y="228" style={textStyle}>
            C = 93uF
          </text>

          {/* Main connection nodes */}
          <circle cx="115" cy="285" r="6" fill="black" />
          <circle cx="885" cy="285" r="6" fill="black" />

          {/* Bottom supply reference line */}
          <line
            x1="115"
            y1="395"
            x2="885"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="390" y="440" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">S</tspan> = 100V&nbsp;&nbsp;60Hz
          </text>

          <text x="125" y="432" style={textStyle}>
            +
          </text>

          <text x="845" y="432" style={textStyle}>
            −
          </text>

          {/* Current arrow on left side */}
          <line
            x1="90"
            y1="395"
            x2="90"
            y2="325"
            stroke="black"
            strokeWidth="2.8"
            markerEnd="url(#arrow)"
          />

          <text x="18" y="332" style={textStyle}>
            I =
          </text>
          <text x="18" y="370" style={textStyle}>
            2.63A
          </text>

          {/* Small supply terminal lines similar to reference */}
          <line
            x1="115"
            y1="395"
            x2="115"
            y2="470"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="885"
            y1="395"
            x2="885"
            y2="470"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Small labels for capacitor polarity */}
          <text x="488" y="360" style={tinyTextStyle}>
            +
          </text>
          <text x="545" y="360" style={tinyTextStyle}>
            −
          </text>

          {/* Tiny caption */}
          <text x="240" y="500" style={tinyTextStyle}>
            Power factor correction: capacitor connected in parallel with the load branch.
          </text>
        </svg>
      </div>
    </main>
  );
}
