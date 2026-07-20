export default function ParallelRLCCircuit() {
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

  const resistorVertical = (x: number, y: number, height = 150, width = 22) => {
    const step = height / 8;
    return `
      ${x},${y}
      ${x},${y + step}
      ${x - width},${y + step * 2}
      ${x + width},${y + step * 3}
      ${x - width},${y + step * 4}
      ${x + width},${y + step * 5}
      ${x - width},${y + step * 6}
      ${x + width},${y + step * 7}
      ${x},${y + step * 8}
    `;
  };

  const inductorVertical = (x: number, y: number, loops = 5, radius = 22) => {
    let d = `M ${x} ${y}`;
    for (let i = 0; i < loops; i++) {
      const startY = y + i * 2 * radius;
      d += ` C ${x + 2 * radius} ${startY + radius * 0.2}, ${
        x + 2 * radius
      } ${startY + radius * 1.8}, ${x} ${startY + 2 * radius}`;
    }
    return d;
  };

  const sinePath = () => `
    M 82 285
    C 96 250, 118 250, 132 285
    C 146 320, 168 320, 182 285
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
          <title id="title">Parallel RLC Circuit</title>
          <desc id="desc">
            Clean SVG diagram of a parallel RLC circuit with an AC voltage
            source, resistor, inductor, capacitor, branch currents, and branch
            voltage labels.
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

          {/* Source side */}
          <line
            x1="110"
            y1="80"
            x2="110"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="360"
            x2="110"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="110"
            cy="285"
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

          <text x="18" y="235" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">0</tspan>
          </text>

          {/* Source voltage direction */}
          <line
            x1="210"
            y1="380"
            x2="210"
            y2="195"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="82" y="190" style={smallTextStyle}>
            +
          </text>
          <text x="95" y="425" style={smallTextStyle}>
            −
          </text>

          {/* Rails */}
          <line
            x1="110"
            y1="80"
            x2="900"
            y2="80"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="445"
            x2="900"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="900"
            y1="80"
            x2="900"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Ground at source bottom */}
          <line
            x1="80"
            y1="445"
            x2="140"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="458"
            x2="130"
            y2="458"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="471"
            x2="120"
            y2="471"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Supply current on top rail */}
          <line
            x1="230"
            y1="55"
            x2="340"
            y2="55"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="260" y="36" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">0</tspan>
          </text>

          {/* Resistor branch */}
          <line
            x1="470"
            y1="80"
            x2="470"
            y2="155"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistorVertical(470, 155, 155, 22)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="470"
            y1="310"
            x2="470"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="470" cy="80" r="5.5" fill="black" />
          <circle cx="470" cy="445" r="5.5" fill="black" />

          <text x="535" y="270" style={textStyle}>
            R
          </text>

          <line
            x1="445"
            y1="130"
            x2="445"
            y2="225"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="420" y="150" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          <text x="405" y="160" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          {/* Inductor branch */}
          <line
            x1="680"
            y1="80"
            x2="680"
            y2="140"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={inductorVertical(680, 140, 5, 22)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="680"
            y1="360"
            x2="680"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="680" cy="80" r="9" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="680" cy="445" r="5.5" fill="black" />

          <text x="755" y="285" style={textStyle}>
            L
          </text>

          <text x="705" y="58" style={textStyle}>
            A
          </text>

          <line
            x1="650"
            y1="130"
            x2="650"
            y2="225"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="622" y="150" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">L</tspan>
          </text>

          <text x="620" y="160" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">L</tspan>
          </text>

          {/* Capacitor branch */}
          <line
            x1="900"
            y1="80"
            x2="900"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="850"
            y1="250"
            x2="950"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="850"
            y1="290"
            x2="950"
            y2="290"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="900"
            y1="210"
            x2="900"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="900"
            y1="290"
            x2="900"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="900" cy="80" r="5.5" fill="black" />
          <circle cx="900" cy="445" r="5.5" fill="black" />

          <text x="965" y="285" style={textStyle}>
            C
          </text>

          <line
            x1="875"
            y1="130"
            x2="875"
            y2="225"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="848" y="150" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">C</tspan>
          </text>

          <text x="842" y="160" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">C</tspan>
          </text>
        </svg>
      </div>
    </main>
  );
}
