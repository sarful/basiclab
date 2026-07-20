export default function PowerTriangleOfACCircuit() {
  const width = 900;
  const height = 560;

  const dark = "#222222";
  const orange = "#c87923";
  const blue = "#2f67b2";
  const green = "#7f9c3d";
  const fillColor = "#e7e4eb";
  const accentPurple = "#9b84c9";

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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Power Triangle of an AC Circuit</title>
          <desc id="desc">
            A clean textbook-style SVG diagram of the power triangle of an AC
            circuit, showing real power, reactive power, apparent power, and
            phase angle phi.
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

          {/* Main triangle */}
          <polygon
            points="95,450 575,450 575,120"
            fill={fillColor}
            stroke="none"
          />

          {/* Base: real power */}
          <line
            x1="95"
            y1="450"
            x2="585"
            y2="450"
            stroke={blue}
            strokeWidth={stroke}
            markerEnd="url(#arrowBlue)"
          />

          {/* Vertical: reactive power */}
          <line
            x1="575"
            y1="450"
            x2="575"
            y2="108"
            stroke={green}
            strokeWidth={stroke}
            markerEnd="url(#arrowGreen)"
          />

          {/* Hypotenuse: apparent power */}
          <line
            x1="95"
            y1="450"
            x2="585"
            y2="110"
            stroke={orange}
            strokeWidth={stroke}
            markerEnd="url(#arrowOrange)"
          />

          {/* Right-angle square */}
          <path
            d="M 525 450 L 525 400 L 575 400"
            fill="none"
            stroke={accentPurple}
            strokeWidth="3"
          />

          {/* Phi angle */}
          <path
            d="M 205 450 A 110 110 0 0 0 194 383"
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <text x="170" y="392" style={textStyle}>
            ϕ
          </text>

          {/* Formulas and labels */}
          <text x="42" y="95" style={textStyle}>
            S² = P² + Q²
          </text>

          <text
            x="200"
            y="312"
            style={{ ...smallTextStyle, fill: dark }}
            transform="rotate(-34 200 312)"
          >
            Apparent power, S = VI
          </text>

          <text x="210" y="490" style={smallTextStyle}>
            Real Power, P = VI cosϕ
          </text>

          <text x="620" y="270" style={smallTextStyle}>
            Reactive Power
          </text>
          <text x="620" y="300" style={smallTextStyle}>
            Q = VI sinϕ
          </text>

          {/* Small guide arrows like reference */}
          <line
            x1="620"
            y1="285"
            x2="593"
            y2="285"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          <line
            x1="285"
            y1="300"
            x2="242"
            y2="334"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          {/* Decorative top cap and right cap to resemble reference */}
          <line
            x1="575"
            y1="120"
            x2="622"
            y2="120"
            stroke={dark}
            strokeWidth="2"
          />
          <line
            x1="575"
            y1="450"
            x2="622"
            y2="450"
            stroke={dark}
            strokeWidth="2"
          />

          {/* Caption */}
          <text x="95" y="535" style={tinyTextStyle}>
            Power triangle showing the relationship among apparent power, real power, and reactive power in an AC circuit.
          </text>
        </svg>
      </div>
    </main>
  );
}
