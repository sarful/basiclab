export default function SeriesResistanceCapacitanceCircuit() {
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

  const resistor = (x: number, y: number, width = 120, height = 18) => {
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

  const sineWave = () => `
    M 408 378
    C 420 358, 436 358, 448 378
    C 460 398, 476 398, 488 378
  `;

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
          <title id="title">Series Resistance-Capacitance Circuit</title>
          <desc id="desc">
            Black and white SVG diagram of a series RC circuit with resistor R,
            capacitor C, current I, voltage drops Vr and Vc, and total voltage V.
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

          {/* Outer circuit loop */}
          <line
            x1="70"
            y1="125"
            x2="160"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(160, 125, 160, 20)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="320"
            y1="125"
            x2="610"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Capacitor C in top branch */}
          <line
            x1="610"
            y1="70"
            x2="610"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="650"
            y1="70"
            x2="650"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="650"
            y1="125"
            x2="890"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="70"
            y1="125"
            x2="70"
            y2="378"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="890"
            y1="125"
            x2="890"
            y2="378"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="70"
            y1="378"
            x2="360"
            y2="378"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="536"
            y1="378"
            x2="890"
            y2="378"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* AC source in lower branch */}
          <circle cx="388" cy="378" r="8" fill="black" />
          <circle cx="508" cy="378" r="8" fill="black" />

          <path
            d={sineWave()}
            fill="none"
            stroke="#2f67b2"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrow on left branch */}
          <line
            x1="40"
            y1="320"
            x2="40"
            y2="155"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="18" y="245" style={textStyle}>
            I
          </text>

          {/* Resistor label */}
          <text x="235" y="52" style={textStyle}>
            R
          </text>

          {/* Capacitor label */}
          <text x="625" y="52" style={textStyle}>
            C
          </text>

          {/* Vr reference lines */}
          <line
            x1="175"
            y1="145"
            x2="175"
            y2="310"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="350"
            y1="145"
            x2="350"
            y2="310"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="190"
            y1="235"
            x2="340"
            y2="235"
            stroke="black"
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="248" y="205" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          {/* Vc reference lines */}
          <line
            x1="575"
            y1="145"
            x2="575"
            y2="310"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="695"
            y1="145"
            x2="695"
            y2="310"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="590"
            y1="235"
            x2="685"
            y2="235"
            stroke="black"
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="612" y="205" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">C</tspan>
          </text>

          {/* Total voltage V reference lines */}
          <line
            x1="180"
            y1="250"
            x2="180"
            y2="310"
            stroke="black"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="690"
            y1="250"
            x2="690"
            y2="310"
            stroke="black"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <line
            x1="190"
            y1="315"
            x2="685"
            y2="315"
            stroke="black"
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="442" y="292" style={textStyle}>
            V
          </text>
        </svg>
      </div>
    </main>
  );
}
