export default function ComplexNumbersSPlane() {
  const width = 900;
  const height = 700;

  const dark = "#222222";
  const blue = "#2f67b2";
  const gray = "#8a8a8a";
  const lightGray = "#e6e6e6";

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

  const origin = { x: 120, y: 560 };
  const scale = 58;

  const xPos = (value: number) => origin.x + value * scale;
  const yPos = (value: number) => origin.y - value * scale;

  const zPoint = { x: xPos(6), y: yPos(4) };

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
          <title id="title">Complex Numbers Using the Complex or s-plane</title>
          <desc id="desc">
            Complex plane diagram showing the complex number Z equals 6 plus j4,
            with real and imaginary axes, projection lines, and phase angle.
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
              id="arrowBlue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={blue} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Light grid, because apparently even numbers need graph paper */}
          {Array.from({ length: 11 }, (_, index) => {
            const x = xPos(index);
            return (
              <line
                key={`grid-x-${index}`}
                x1={x}
                y1={yPos(9)}
                x2={x}
                y2={yPos(-1)}
                stroke={lightGray}
                strokeWidth="1"
                opacity="0.65"
              />
            );
          })}

          {Array.from({ length: 11 }, (_, index) => {
            const y = yPos(index - 1);
            return (
              <line
                key={`grid-y-${index}`}
                x1={xPos(-1)}
                y1={y}
                x2={xPos(9)}
                y2={y}
                stroke={lightGray}
                strokeWidth="1"
                opacity="0.65"
              />
            );
          })}

          {/* Axes */}
          <line
            x1={xPos(-1)}
            y1={origin.y}
            x2={xPos(9.6)}
            y2={origin.y}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />

          <line
            x1={origin.x}
            y1={yPos(-1)}
            x2={origin.x}
            y2={yPos(9.6)}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />

          {/* Axis tick marks and numbers */}
          {Array.from({ length: 10 }, (_, value) => (
            <g key={`x-tick-${value}`}>
              <line
                x1={xPos(value)}
                y1={origin.y - 8}
                x2={xPos(value)}
                y2={origin.y + 8}
                stroke={dark}
                strokeWidth="2"
              />
              <text x={xPos(value) - 7} y={origin.y + 34} style={smallTextStyle}>
                {value}
              </text>
            </g>
          ))}

          {Array.from({ length: 10 }, (_, value) => (
            <g key={`y-tick-${value}`}>
              <line
                x1={origin.x - 8}
                y1={yPos(value)}
                x2={origin.x + 8}
                y2={yPos(value)}
                stroke={dark}
                strokeWidth="2"
              />
              <text x={origin.x - 36} y={yPos(value) + 7} style={smallTextStyle}>
                {value}
              </text>
            </g>
          ))}

          <text x={xPos(-1) - 9} y={origin.y + 34} style={smallTextStyle}>
            -1
          </text>
          <text x={origin.x - 42} y={yPos(-1) + 7} style={smallTextStyle}>
            -1
          </text>

          {/* Axis labels */}
          <text x={xPos(9.1)} y={origin.y - 16} style={textStyle}>
            +σ
          </text>
          <text x={origin.x + 14} y={yPos(9.45)} style={textStyle}>
            +j
          </text>

          <text x={xPos(3.1)} y={650} style={textStyle}>
            Positive Real Axis
          </text>

          <text
            x="32"
            y="430"
            style={textStyle}
            transform="rotate(-90 32 430)"
          >
            Positive Imaginary Axis
          </text>

          {/* Complex number vector */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={zPoint.x}
            y2={zPoint.y}
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />

          {/* Projection lines for 6 and j4 */}
          <line
            x1={zPoint.x}
            y1={zPoint.y}
            x2={zPoint.x}
            y2={origin.y}
            stroke={dark}
            strokeWidth="2.5"
            strokeDasharray="12 9"
          />

          <line
            x1={origin.x}
            y1={zPoint.y}
            x2={zPoint.x}
            y2={zPoint.y}
            stroke={dark}
            strokeWidth="2.5"
            strokeDasharray="12 9"
          />

          {/* Z point */}
          <circle
            cx={zPoint.x}
            cy={zPoint.y}
            r="10"
            fill="white"
            stroke={dark}
            strokeWidth={stroke}
          />

          <text x={zPoint.x + 38} y={zPoint.y - 18} style={{ ...textStyle, fill: blue }}>
            Z = 6 + j4
          </text>

          {/* +6 horizontal component */}
          <line
            x1={origin.x + 65}
            y1={zPoint.y - 35}
            x2={zPoint.x - 25}
            y2={zPoint.y - 35}
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <text x={xPos(3.0)} y={zPoint.y - 55} style={smallTextStyle}>
            +6
          </text>

          {/* +j4 vertical component */}
          <line
            x1={zPoint.x + 52}
            y1={origin.y - 10}
            x2={zPoint.x + 52}
            y2={zPoint.y + 10}
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <text x={zPoint.x + 70} y={yPos(2.25)} style={smallTextStyle}>
            +j4
          </text>

          {/* Angle theta */}
          <path
            d={`M ${origin.x + 165} ${origin.y} A 165 165 0 0 0 ${
              origin.x + 136
            } ${origin.y - 94}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <text x={origin.x + 210} y={origin.y - 72} style={textStyle}>
            θ
          </text>

          <text x={origin.x + 245} y={origin.y - 24} style={smallTextStyle}>
            V
          </text>

          {/* Small dashed angle construction */}
          <line
            x1={origin.x + 125}
            y1={origin.y}
            x2={origin.x + 165}
            y2={origin.y - 110}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          {/* Main vector label */}
          <text
            x={origin.x + 235}
            y={origin.y - 165}
            style={{ ...smallTextStyle, fill: dark }}
            transform={`rotate(-34 ${origin.x + 235} ${origin.y - 165})`}
          >
            Complex vector
          </text>

          {/* Caption */}
          <text x="182" y="54" style={textStyle}>
            Complex Numbers using the Complex or s-plane
          </text>
        </svg>
      </div>
    </main>
  );
}
