export default function PolarFormComplexNumber() {
  const width = 900;
  const height = 560;

  const dark = "#222222";
  const blue = "#2b6de5";
  const purple = "#7a35ad";
  const green = "#8aa54a";
  const orange = "#e67e22";
  const gray = "#8a8a8a";
  const paleGreen = "#eef3e5";

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

  const origin = { x: 90, y: 430 };
  const xEnd = { x: 650, y: 430 };
  const tip = { x: 650, y: 110 };

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
          <title id="title">Polar Form Representation of a Complex Number</title>
          <desc id="desc">
            A clean SVG diagram showing polar form representation of a complex
            number with magnitude A, angle theta, real component x, and
            imaginary component jy.
          </desc>

          <defs>
            <marker
              id="arrowDark"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>

            <marker
              id="arrowPurple"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={purple} />
            </marker>

            <marker
              id="arrowGreen"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={green} />
            </marker>

            <marker
              id="arrowOrange"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={orange} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Light triangle fill */}
          <polygon
            points={`${origin.x},${origin.y} ${xEnd.x},${xEnd.y} ${tip.x},${tip.y}`}
            fill={paleGreen}
            opacity="0.6"
            stroke="none"
          />

          {/* Dashed construction rectangle */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={origin.x}
            y2={tip.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="12 9"
          />
          <line
            x1={origin.x}
            y1={tip.y}
            x2={tip.x}
            y2={tip.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="12 9"
          />
          <line
            x1={tip.x}
            y1={tip.y}
            x2={tip.x}
            y2={origin.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="12 9"
          />

          {/* Real component x */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={xEnd.x}
            y2={xEnd.y}
            stroke={green}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowGreen)"
          />

          {/* Imaginary component jy */}
          <line
            x1={xEnd.x}
            y1={origin.y}
            x2={tip.x}
            y2={tip.y}
            stroke={orange}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowOrange)"
          />

          {/* Resultant vector A */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={tip.x}
            y2={tip.y}
            stroke={purple}
            strokeWidth="8"
            strokeLinecap="round"
            markerEnd="url(#arrowPurple)"
          />

          {/* Origin and tip points */}
          <circle cx={origin.x} cy={origin.y} r="7" fill="white" stroke={dark} strokeWidth="2.5" />
          <circle cx={tip.x} cy={tip.y} r="7" fill="white" stroke={dark} strokeWidth="2.5" />

          {/* Axes-like lower and left guide marks */}
          <line
            x1={origin.x - 5}
            y1={origin.y}
            x2={origin.x + 20}
            y2={origin.y}
            stroke={dark}
            strokeWidth={stroke}
          />
          <line
            x1={origin.x}
            y1={origin.y - 5}
            x2={origin.x}
            y2={origin.y + 20}
            stroke={dark}
            strokeWidth={stroke}
          />

          {/* Angle theta */}
          <path
            d={`M ${origin.x + 190} ${origin.y} A 190 190 0 0 0 ${origin.x + 154} ${
              origin.y - 112
            }`}
            fill="none"
            stroke={dark}
            strokeWidth="2.8"
            markerEnd="url(#arrowDark)"
          />
          <text x={origin.x + 190} y={origin.y - 80} style={textStyle}>
            θ
          </text>

          {/* Small diagonal label guide */}
          <line
            x1="300"
            y1="300"
            x2="340"
            y2="260"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          {/* Labels */}
          <text
            x="330"
            y="260"
            style={{ ...textStyle, fill: purple }}
            transform="rotate(-30 330 260)"
          >
            A
          </text>

          <text x="330" y="468" style={{ ...textStyle, fill: green }}>
            x
          </text>

          <text x="685" y="285" style={{ ...textStyle, fill: orange }}>
            jy
          </text>

          <text x="650" y="92" style={{ ...textStyle, fill: blue }}>
            Z = A∠θ
          </text>

          <text x="50" y="455" style={smallTextStyle}>
            0
          </text>

          {/* Measurement brackets */}
          <line
            x1={origin.x}
            y1="482"
            x2={xEnd.x}
            y2="482"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />
          <line x1={origin.x} y1="465" x2={origin.x} y2="500" stroke={dark} strokeWidth="2" />
          <line x1={xEnd.x} y1="465" x2={xEnd.x} y2="500" stroke={dark} strokeWidth="2" />
          <text x="355" y="520" style={smallTextStyle}>
            real component
          </text>

          <line
            x1="715"
            y1={origin.y}
            x2="715"
            y2={tip.y}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />
          <line x1="695" y1={origin.y} x2="735" y2={origin.y} stroke={dark} strokeWidth="2" />
          <line x1="695" y1={tip.y} x2="735" y2={tip.y} stroke={dark} strokeWidth="2" />
          <text
            x="760"
            y="305"
            style={smallTextStyle}
            transform="rotate(-90 760 305)"
          >
            imaginary component
          </text>

          {/* Caption */}
          <text x="170" y="48" style={textStyle}>
            Polar Form Representation of a Complex Number
          </text>

          <text x="130" y="548" style={tinyTextStyle}>
            A complex number can be written in polar form using its magnitude A and phase angle θ.
          </text>
        </svg>
      </div>
    </main>
  );
}
