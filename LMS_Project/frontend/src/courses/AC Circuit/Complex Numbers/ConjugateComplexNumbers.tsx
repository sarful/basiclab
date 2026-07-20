export default function ConjugateComplexNumbers() {
  const width = 900;
  const height = 700;

  const dark = "#222222";
  const blue = "#2f67b2";
  const gray = "#8a8a8a";
  const lightGray = "#e9e9e9";

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

  const origin = { x: 160, y: 350 };
  const scale = 58;

  const xPos = (value: number) => origin.x + value * scale;
  const yPos = (value: number) => origin.y - value * scale;

  const upperPoint = { x: xPos(6), y: yPos(4) };
  const lowerPoint = { x: xPos(6), y: yPos(-4) };

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
          <title id="title">Conjugate Complex Numbers</title>
          <desc id="desc">
            Complex plane diagram showing a complex number A equals 6 plus j4
            and its conjugate A bar equals 6 minus j4, reflected across the
            positive real axis.
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

          {/* Light grid */}
          {Array.from({ length: 11 }, (_, index) => {
            const x = xPos(index - 1);
            return (
              <line
                key={`grid-x-${index}`}
                x1={x}
                y1={yPos(6.5)}
                x2={x}
                y2={yPos(-6.5)}
                stroke={lightGray}
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}

          {Array.from({ length: 15 }, (_, index) => {
            const yValue = index - 7;
            const y = yPos(yValue);
            return (
              <line
                key={`grid-y-${index}`}
                x1={xPos(-1)}
                y1={y}
                x2={xPos(9.8)}
                y2={y}
                stroke={lightGray}
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}

          {/* Axes */}
          <line
            x1={xPos(-1)}
            y1={origin.y}
            x2={xPos(10)}
            y2={origin.y}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />

          <line
            x1={origin.x}
            y1={yPos(-6.5)}
            x2={origin.x}
            y2={yPos(6.5)}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrowDark)"
            markerEnd="url(#arrowDark)"
          />

          {/* Tick marks and labels on real axis */}
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

          <text x={xPos(-1) - 9} y={origin.y + 34} style={smallTextStyle}>
            -1
          </text>

          {/* Tick marks and labels on imaginary axis */}
          {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((value) => (
            <g key={`y-tick-${value}`}>
              <line
                x1={origin.x - 8}
                y1={yPos(value)}
                x2={origin.x + 8}
                y2={yPos(value)}
                stroke={dark}
                strokeWidth="2"
              />
              <text x={origin.x - 38} y={yPos(value) + 7} style={smallTextStyle}>
                {value}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={xPos(9.5)} y={origin.y - 18} style={textStyle}>
            +σ
          </text>
          <text x={origin.x + 14} y={yPos(6.45)} style={textStyle}>
            +j
          </text>
          <text x={origin.x + 14} y={yPos(-6.55)} style={textStyle}>
            −j
          </text>

          {/* Real axis label */}
          <text x={xPos(3.25)} y={origin.y + 72} style={textStyle}>
            Positive real axis
          </text>

          {/* Upper complex number vector */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={upperPoint.x}
            y2={upperPoint.y}
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />

          {/* Lower conjugate vector */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={lowerPoint.x}
            y2={lowerPoint.y}
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />

          {/* Projection / symmetry guides */}
          <line
            x1={upperPoint.x}
            y1={upperPoint.y}
            x2={upperPoint.x}
            y2={lowerPoint.y}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={origin.x}
            y1={upperPoint.y}
            x2={upperPoint.x}
            y2={upperPoint.y}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={origin.x}
            y1={lowerPoint.y}
            x2={lowerPoint.x}
            y2={lowerPoint.y}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Labels for vectors */}
          <text x={upperPoint.x - 30} y={upperPoint.y - 32} style={{ ...textStyle, fill: blue }}>
            A = 6 + j4
          </text>

          <text x={lowerPoint.x - 30} y={lowerPoint.y + 54} style={{ ...textStyle, fill: blue }}>
            Ā = 6 − j4
          </text>

          <text x={xPos(2.35)} y={yPos(-3.2)} style={smallTextStyle}>
            conjugate
          </text>

          {/* Angle theta */}
          <path
            d={`M ${origin.x + 150} ${origin.y} A 150 150 0 0 0 ${
              origin.x + 125
            } ${origin.y - 82}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <path
            d={`M ${origin.x + 150} ${origin.y} A 150 150 0 0 1 ${
              origin.x + 125
            } ${origin.y + 82}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <text x={origin.x + 172} y={origin.y - 72} style={textStyle}>
            +θ
          </text>
          <text x={origin.x + 172} y={origin.y + 88} style={textStyle}>
            −θ
          </text>

          {/* Origin label */}
          <text x={origin.x - 36} y={origin.y + 32} style={smallTextStyle}>
            0
          </text>

          {/* Small labels near tips */}
          <circle cx={upperPoint.x} cy={upperPoint.y} r="5" fill="white" stroke={dark} strokeWidth="2" />
          <circle cx={lowerPoint.x} cy={lowerPoint.y} r="5" fill="white" stroke={dark} strokeWidth="2" />

          {/* Caption */}
          <text x="220" y="55" style={textStyle}>
            Conjugate Complex Numbers
          </text>

          <text x="235" y="650" style={tinyTextStyle}>
            The conjugate has the same real part and the opposite imaginary part. Humanity survived this revelation.
          </text>
        </svg>
      </div>
    </main>
  );
}
