export default function ImpedanceTriangle() {
  const width = 1000;
  const height = 560;

  const dark = "#222222";
  const orange = "#c87923";
  const blue = "#2f67b2";
  const green = "#8aa54a";
  const fillGreen = "#dfe6d2";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: dark,
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Impedance Triangle</title>
          <desc id="desc">
            SVG diagram of an impedance triangle showing resistance, reactance,
            impedance, phase angle phi, and common trigonometric relationships.
          </desc>

          <defs>
            <marker
              id="arrowDark"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
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
              id="arrowGreen"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={green} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Triangle fill */}
          <polygon
            points="90,470 540,470 540,120"
            fill={fillGreen}
            stroke="none"
          />

          {/* Base: Resistance R */}
          <line
            x1="90"
            y1="470"
            x2="548"
            y2="470"
            stroke={blue}
            strokeWidth={stroke}
            markerEnd="url(#arrowBlue)"
          />

          {/* Vertical: Reactance X */}
          <line
            x1="540"
            y1="470"
            x2="540"
            y2="110"
            stroke={green}
            strokeWidth={stroke}
            markerEnd="url(#arrowGreen)"
          />

          {/* Hypotenuse: Impedance Z */}
          <line
            x1="90"
            y1="470"
            x2="548"
            y2="112"
            stroke={orange}
            strokeWidth={stroke}
            markerEnd="url(#arrowOrange)"
          />

          {/* Right-angle mark */}
          <path
            d="M 490 470 L 490 420 L 540 420"
            fill="none"
            stroke={green}
            strokeWidth="3"
          />

          {/* Angle phi arc */}
          <path
            d="M 205 470 A 115 115 0 0 0 195 398"
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <text x="165" y="405" style={textStyle}>
            ϕ
          </text>

          {/* Main labels */}
          <text
            x="214"
            y="300"
            style={{ ...smallTextStyle, fill: dark }}
            transform="rotate(-38 214 300)"
          >
            Impedance, Z
          </text>

          <text x="232" y="505" style={{ ...smallTextStyle, fill: dark }}>
            Resistance, R
          </text>

          <text
            x="595"
            y="330"
            style={{ ...smallTextStyle, fill: dark }}
            transform="rotate(-90 595 330)"
          >
            Reactance, X
          </text>

          {/* Formula labels near triangle */}
          <text x="52" y="102" style={textStyle}>
            Z² = R² + X²
          </text>

          <text x="572" y="278" style={textStyle}>
            X = Z sinϕ
          </text>

          <text x="430" y="520" style={textStyle}>
            R = Z cosϕ
          </text>

          {/* Complex form and trig relations */}
          <text x="695" y="112" style={textStyle}>
            Z = R + jX (Ω)
          </text>

          <text x="695" y="175" style={smallTextStyle}>
            cosϕ =
          </text>
          <line x1="790" y1="164" x2="842" y2="164" stroke={dark} strokeWidth="2" />
          <text x="810" y="154" style={smallTextStyle}>R</text>
          <text x="810" y="193" style={smallTextStyle}>Z</text>

          <text x="695" y="252" style={smallTextStyle}>
            sinϕ =
          </text>
          <line x1="790" y1="241" x2="842" y2="241" stroke={dark} strokeWidth="2" />
          <text x="810" y="231" style={smallTextStyle}>X</text>
          <text x="810" y="270" style={smallTextStyle}>Z</text>

          <text x="695" y="329" style={smallTextStyle}>
            tanϕ =
          </text>
          <line x1="790" y1="318" x2="842" y2="318" stroke={dark} strokeWidth="2" />
          <text x="810" y="308" style={smallTextStyle}>X</text>
          <text x="810" y="347" style={smallTextStyle}>R</text>

          {/* Small guide arrows and annotations similar to textbook style */}
          <line
            x1="305"
            y1="260"
            x2="235"
            y2="315"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          <line
            x1="662"
            y1="265"
            x2="610"
            y2="265"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          <line
            x1="500"
            y1="515"
            x2="468"
            y2="485"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          {/* Clean caption */}
          <text x="90" y="548" style={tinyTextStyle}>
            Impedance triangle showing the relationship between resistance, reactance, and impedance in an AC circuit.
          </text>
        </svg>
      </div>
    </main>
  );
}
