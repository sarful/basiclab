export default function PhasorDiagramParallelRLC() {
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

  const blue = "#2f67b2";
  const purple = "#7a35ad";
  const orange = "#e67e22";
  const gray = "#e8e8e8";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1100 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Phasor Diagram for a Parallel RLC Circuit</title>
          <desc id="desc">
            Phasor diagram for a parallel RLC circuit showing resistor current,
            capacitor current, inductor current, voltage reference, and the
            resultant current relationship.
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

            <marker
              id="arrowOrange"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={orange} />
            </marker>
          </defs>

          <rect width="1100" height="560" fill="white" />

          {/* ================= Left diagram ================= */}
          <g transform="translate(45 40)">
            {/* Vertical current reference */}
            <line
              x1="0"
              y1="430"
              x2="0"
              y2="25"
              stroke={blue}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowBlue)"
            />
            <line
              x1="0"
              y1="80"
              x2="0"
              y2="495"
              stroke={blue}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowBlue)"
            />

            <text x="-24" y="18" style={smallTextStyle}>
              I<tspan baselineShift="sub" fontSize="15">C</tspan>
            </text>
            <text x="-22" y="525" style={smallTextStyle}>
              I<tspan baselineShift="sub" fontSize="15">L</tspan>
            </text>

            {/* Horizontal reference axis */}
            <line
              x1="0"
              y1="230"
              x2="370"
              y2="230"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* 90 degree label */}
            <rect
              x="0"
              y="150"
              width="72"
              height="80"
              fill={gray}
              stroke="black"
              strokeWidth="1.5"
            />
            <text x="14" y="202" style={smallTextStyle}>
              90°
            </text>

            {/* IR phasor */}
            <line
              x1="0"
              y1="230"
              x2="335"
              y2="230"
              stroke={blue}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowBlue)"
            />
            <text x="318" y="205" style={{ ...smallTextStyle, fill: "black" }}>
              I<tspan baselineShift="sub" fontSize="15">R</tspan>
            </text>

            {/* Voltage phasor */}
            <line
              x1="0"
              y1="230"
              x2="430"
              y2="230"
              stroke={purple}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowPurple)"
            />
            <text x="438" y="239" style={{ ...textStyle, fill: "black" }}>
              V
            </text>

            {/* Resultant current phasor */}
            <line
              x1="0"
              y1="230"
              x2="315"
              y2="420"
              stroke={orange}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowOrange)"
            />
            <text x="315" y="430" style={{ ...smallTextStyle, fill: "black" }}>
              I<tspan baselineShift="sub" fontSize="15">0</tspan>
            </text>

            {/* Dashed construction lines */}
            <line
              x1="315"
              y1="230"
              x2="315"
              y2="420"
              stroke="black"
              strokeWidth="2"
              strokeDasharray="10 8"
            />
            <line
              x1="0"
              y1="420"
              x2="315"
              y2="420"
              stroke="black"
              strokeWidth="2"
              strokeDasharray="10 8"
            />

            {/* Angle theta */}
            <path
              d="M 170 230 A 90 90 0 0 1 142 282"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              markerEnd="url(#arrowBlack)"
            />
            <text x="185" y="280" style={smallTextStyle}>
              θ
            </text>

            {/* Rotation arrow */}
            <path
              d="M 255 72 C 210 35, 165 42, 135 95"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#arrowBlack)"
            />
            <text x="245" y="86" style={smallTextStyle}>
              ω
            </text>
          </g>

          {/* Equals sign */}
          <text x="520" y="320" style={{ ...textStyle, fontSize: 46 }}>
            =
          </text>

          {/* ================= Right diagram ================= */}
          <g transform="translate(635 40)">
            {/* Horizontal reference axis */}
            <line
              x1="0"
              y1="230"
              x2="430"
              y2="230"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* IR phasor */}
            <line
              x1="0"
              y1="230"
              x2="390"
              y2="230"
              stroke={blue}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowBlue)"
            />
            <text x="365" y="205" style={{ ...smallTextStyle, fill: "black" }}>
              I<tspan baselineShift="sub" fontSize="15">R</tspan>
            </text>

            {/* Vertical resultant reactive current */}
            <line
              x1="0"
              y1="230"
              x2="0"
              y2="430"
              stroke={blue}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowBlue)"
            />
            <text x="-42" y="455" style={{ ...smallTextStyle, fill: "black" }}>
              I<tspan baselineShift="sub" fontSize="15">L</tspan> − I
              <tspan baselineShift="sub" fontSize="15">C</tspan>
            </text>

            {/* 90 degree box */}
            <rect
              x="0"
              y="230"
              width="72"
              height="80"
              fill={gray}
              stroke="black"
              strokeWidth="1.5"
            />
            <text x="14" y="282" style={smallTextStyle}>
              90°
            </text>

            {/* Resultant current phasor */}
            <line
              x1="0"
              y1="230"
              x2="390"
              y2="420"
              stroke={orange}
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#arrowOrange)"
            />

            <text
              x="185"
              y="356"
              style={{ ...smallTextStyle, fill: "black" }}
              transform="rotate(27 185 356)"
            >
              (I<tspan baselineShift="sub" fontSize="15">L</tspan> − I
              <tspan baselineShift="sub" fontSize="15">C</tspan>) + I
              <tspan baselineShift="sub" fontSize="15">R</tspan>
            </text>

            {/* Dashed construction lines */}
            <line
              x1="390"
              y1="230"
              x2="390"
              y2="420"
              stroke="black"
              strokeWidth="2"
              strokeDasharray="10 8"
            />
            <line
              x1="0"
              y1="420"
              x2="390"
              y2="420"
              stroke="black"
              strokeWidth="2"
              strokeDasharray="10 8"
            />

            <text x="386" y="445" style={{ ...smallTextStyle, fill: "black" }}>
              I<tspan baselineShift="sub" fontSize="15">0</tspan>
            </text>

            {/* Angle theta */}
            <path
              d="M 190 230 A 115 115 0 0 1 160 286"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              markerEnd="url(#arrowBlack)"
            />
            <text x="205" y="285" style={smallTextStyle}>
              θ
            </text>

            {/* Rotation arrow */}
            <path
              d="M 435 72 C 388 34, 340 42, 310 95"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#arrowBlack)"
            />
            <text x="425" y="86" style={smallTextStyle}>
              ω
            </text>
          </g>

          {/* Small explanatory label */}
          <text x="40" y="540" style={tinyTextStyle}>
            Parallel RLC phasor relationship: resistor current is in phase with voltage, while reactive currents are perpendicular.
          </text>
        </svg>
      </div>
    </main>
  );
}
