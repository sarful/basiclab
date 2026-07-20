export default function ComplexNumbersSPlane() {
  const axisStroke = 2.5;
  const gridStroke = 1.2;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fontWeight: 600,
    fill: "black",
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 23,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const blueTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "#1f5fa8",
    fontWeight: 600,
  };

  const originX = 95;
  const originY = 445;
  const scale = 55;

  const pointX = originX + 6 * scale;
  const pointY = originY - 4 * scale;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 720 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Complex Numbers using the Complex or s-plane</title>
          <desc id="desc">
            Complex plane or s-plane diagram showing the complex number
            Z = 6 + j4 as a vector with real and imaginary components.
          </desc>

          <defs>
            <marker
              id="arrow"
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
              id="blueArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="9"
              markerHeight="9"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#1f5fa8" />
            </marker>
          </defs>

          <rect width="720" height="560" fill="white" />

          <text x="360" y="36" textAnchor="middle" style={titleStyle}>
            Complex Numbers using the Complex or s-plane
          </text>

          {/* Light tick/grid marks */}
          {Array.from({ length: 10 }, (_, index) => {
            const x = originX + index * scale;
            return (
              <g key={`x-grid-${index}`}>
                <line
                  x1={x}
                  y1={originY - 8}
                  x2={x}
                  y2={originY + 8}
                  stroke="black"
                  strokeWidth={gridStroke}
                />
                <text
                  x={x}
                  y={originY + 34}
                  textAnchor="middle"
                  style={smallTextStyle}
                >
                  {index}
                </text>
              </g>
            );
          })}

          {Array.from({ length: 10 }, (_, index) => {
            const y = originY - index * scale;
            return (
              <g key={`y-grid-${index}`}>
                <line
                  x1={originX - 8}
                  y1={y}
                  x2={originX + 8}
                  y2={y}
                  stroke="black"
                  strokeWidth={gridStroke}
                />
                <text
                  x={originX - 24}
                  y={y + 6}
                  textAnchor="end"
                  style={smallTextStyle}
                >
                  {index}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1="30"
            y1={originY}
            x2="665"
            y2={originY}
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1={originX}
            y1="50"
            x2={originX}
            y2="505"
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          {/* Negative axis arrows */}
          <line
            x1={originX}
            y1={originY}
            x2="35"
            y2={originY}
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1={originX}
            y1={originY}
            x2={originX}
            y2="515"
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          {/* Axis labels */}
          <text x="350" y="530" textAnchor="middle" style={textStyle}>
            Positive Real Axis
          </text>

          <text
            x="25"
            y="275"
            textAnchor="middle"
            style={textStyle}
            transform="rotate(-90 25 275)"
          >
            Positive Imaginary Axis
          </text>

          <text x="675" y={originY + 8} style={textStyle}>
            +σ
          </text>

          <text x="18" y={originY + 8} style={textStyle}>
            −σ
          </text>

          <text x={originX - 12} y="38" style={textStyle}>
            +j
          </text>

          <text x={originX - 12} y="540" style={textStyle}>
            −j
          </text>

          {/* Main complex vector */}
          <line
            x1={originX}
            y1={originY}
            x2={pointX}
            y2={pointY}
            stroke="#1f5fa8"
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#blueArrow)"
          />

          {/* Projection lines */}
          <line
            x1={pointX}
            y1={pointY}
            x2={pointX}
            y2={originY}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="9 7"
          />

          <line
            x1={originX}
            y1={pointY}
            x2={pointX}
            y2={pointY}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="9 7"
          />

          {/* Point marker */}
          <circle
            cx={pointX}
            cy={pointY}
            r="9"
            fill="white"
            stroke="black"
            strokeWidth="2.5"
          />

          {/* Component arrows and labels */}
          <line
            x1={originX + 45}
            y1={pointY - 55}
            x2={pointX - 25}
            y2={pointY - 55}
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <text
            x={(originX + pointX) / 2}
            y={pointY - 70}
            textAnchor="middle"
            style={textStyle}
          >
            +6
          </text>

          <line
            x1={pointX + 48}
            y1={originY - 20}
            x2={pointX + 48}
            y2={pointY + 10}
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <text x={pointX + 62} y={(pointY + originY) / 2 + 8} style={textStyle}>
            +4
          </text>

          {/* Complex number label */}
          <text x={pointX + 32} y={pointY - 10} style={blueTextStyle}>
            Z = 6 + j4
          </text>

          {/* Angle theta */}
          <path
            d={`M ${originX + 110} ${originY} A 110 110 0 0 0 ${originX + 93} ${
              originY - 58
            }`}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          <text x={originX + 125} y={originY - 42} style={textStyle}>
            θ
          </text>

          {/* Vector label */}
          <text
            x={originX + 210}
            y={originY - 93}
            style={{ ...textStyle, fill: "#1f5fa8" }}
            transform={`rotate(-34 ${originX + 210} ${originY - 93})`}
          >
            V
          </text>

          {/* Origin label */}
          <text x={originX - 28} y={originY + 32} style={smallTextStyle}>
            0
          </text>

          {/* Subtle coordinate labels */}
          <text x={pointX - 7} y={originY + 34} textAnchor="middle" style={smallTextStyle}>
            6
          </text>

          <text x={originX - 24} y={pointY + 6} textAnchor="end" style={smallTextStyle}>
            4
          </text>
        </svg>
      </div>
    </main>
  );
}
