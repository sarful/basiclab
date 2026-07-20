export default function PhasorDiagramACCapacitance() {
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

  const blue = "#2f67b2";
  const purple = "#7a35ad";
  const gray = "#e8e8e8";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-4xl bg-white">
        <svg
          viewBox="0 0 700 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Phasor Diagram for AC Capacitance</title>
          <desc id="desc">
            SVG phasor diagram showing capacitor current leading capacitor
            voltage by 90 degrees.
          </desc>

          <defs>
            <marker
              id="arrowBlack"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>

            <marker
              id="arrowBlue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={blue} />
            </marker>

            <marker
              id="arrowPurple"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={purple} />
            </marker>
          </defs>

          <rect width="700" height="560" fill="white" />

          {/* Axes */}
          <line
            x1="80"
            y1="500"
            x2="80"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrowBlack)"
          />
          <line
            x1="80"
            y1="500"
            x2="640"
            y2="500"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrowBlack)"
          />

          {/* Axis labels */}
          <text x="58" y="52" style={textStyle}>
            +j
          </text>
          <text x="616" y="532" style={textStyle}>
            −j
          </text>

          {/* 90 degree box */}
          <rect
            x="80"
            y="400"
            width="95"
            height="100"
            fill={gray}
            stroke="black"
            strokeWidth="1.5"
          />
          <text x="95" y="465" style={textStyle}>
            90°
          </text>

          {/* Capacitor current phasor Ic */}
          <line
            x1="80"
            y1="500"
            x2="80"
            y2="170"
            stroke={purple}
            strokeWidth="10"
            markerEnd="url(#arrowPurple)"
            strokeLinecap="round"
          />
          <text x="103" y="185" style={{ ...textStyle, fill: "black" }}>
            I<tspan baselineShift="sub" fontSize="18">c</tspan>
          </text>

          {/* Capacitor voltage phasor Vc */}
          <line
            x1="80"
            y1="500"
            x2="470"
            y2="500"
            stroke={blue}
            strokeWidth="10"
            markerEnd="url(#arrowBlue)"
            strokeLinecap="round"
          />
          <text x="395" y="475" style={{ ...textStyle, fill: "black" }}>
            V<tspan baselineShift="sub" fontSize="18">c</tspan>
          </text>

          {/* Rotation arrow and omega */}
          <path
            d="M 420 220 C 470 180, 520 200, 530 255"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlack)"
            strokeLinecap="round"
          />
          <text x="495" y="210" style={textStyle}>
            ω
          </text>

          {/* Small construction mark near arc */}
          <circle cx="507" cy="282" r="2.5" fill="black" />

          {/* Origin tick embellishment */}
          <line x1="72" y1="500" x2="88" y2="500" stroke="black" strokeWidth="2" />
          <line x1="80" y1="492" x2="80" y2="508" stroke="black" strokeWidth="2" />
        </svg>
      </div>
    </main>
  );
}
