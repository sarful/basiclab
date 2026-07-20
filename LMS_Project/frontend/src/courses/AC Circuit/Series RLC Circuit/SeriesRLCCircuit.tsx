export default function SeriesRLCCircuit() {
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

  const resistor = (x: number, y: number, width = 150, height = 18) => {
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

  const inductorPath = (x: number, y: number, loops = 5, r = 24) => {
    let d = `M ${x} ${y}`;
    for (let i = 0; i < loops; i++) {
      const start = x + i * 2 * r;
      d += ` C ${start + r * 0.2} ${y - 2 * r}, ${start + r * 1.8} ${y - 2 * r}, ${start + 2 * r} ${y}`;
    }
    return d;
  };

  const sineWave = () => `
    M 466 382
    C 478 362, 492 362, 504 382
    C 516 402, 530 402, 542 382
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
          <title id="title">Series RLC Circuit</title>
          <desc id="desc">
            Black and white SVG diagram of a series RLC circuit with resistor,
            inductor, capacitor, source voltage, current, and labeled voltage drops.
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

          {/* Outer loop */}
          <line x1="0" y1="100" x2="130" y2="100" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          {/* Resistor R */}
          <polyline
            points={resistor(130, 100, 150, 20)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="195" y="35" style={textStyle}>R</text>

          <line x1="280" y1="100" x2="410" y2="100" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          {/* Inductor L */}
          <path
            d={inductorPath(410, 100, 5, 24)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="560" y="35" style={textStyle}>L</text>

          <line x1="650" y1="100" x2="790" y2="100" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          {/* Capacitor C */}
          <line x1="790" y1="55" x2="790" y2="145" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="825" y1="55" x2="825" y2="145" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <text x="794" y="35" style={textStyle}>C</text>

          <line x1="825" y1="100" x2="965" y2="100" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="965" y1="100" x2="965" y2="430" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="965" y1="430" x2="0" y2="430" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="0" y1="430" x2="0" y2="100" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          {/* Source in bottom branch */}
          <circle cx="504" cy="382" r="42" fill="white" stroke="black" strokeWidth={stroke} />
          <path
            d={sineWave()}
            fill="none"
            stroke="#2f67b2"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="482" y="474" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">i</tspan>
          </text>

          {/* Bottom branch wires around source */}
          <line x1="0" y1="430" x2="462" y2="430" stroke="black" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="546" y1="430" x2="965" y2="430" stroke="black" strokeWidth={stroke} strokeLinecap="round" />

          {/* Current arrow and label */}
          <line
            x1="300"
            y1="380"
            x2="135"
            y2="380"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="130" y="363" style={smallTextStyle}>
            i(t) = I<tspan baselineShift="sub" fontSize="15">m</tspan> sin(ωt)
          </text>

          {/* VR guides and arrow */}
          <line x1="110" y1="115" x2="110" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="300" y1="115" x2="300" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line
            x1="122"
            y1="225"
            x2="290"
            y2="225"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="188" y="193" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          {/* VL guides and arrow */}
          <line x1="402" y1="115" x2="402" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="640" y1="115" x2="640" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line
            x1="414"
            y1="225"
            x2="628"
            y2="225"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="500" y="193" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">L</tspan>
          </text>

          {/* VC guides and arrow */}
          <line x1="744" y1="115" x2="744" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="860" y1="115" x2="860" y2="235" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line
            x1="756"
            y1="225"
            x2="848"
            y2="225"
            stroke="black"
            strokeWidth="2.4"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="784" y="193" style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="15">C</tspan>
          </text>
        </svg>
      </div>
    </main>
  );
}
