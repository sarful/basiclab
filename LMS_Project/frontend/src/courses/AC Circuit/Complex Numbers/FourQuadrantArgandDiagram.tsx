export default function FourQuadrantArgandDiagram() {
  const axisStroke = 2.5;
  const gridStroke = 1.4;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fontWeight: 600,
    fill: "black",
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: "black",
  };

  const originX = 440;
  const originY = 300;
  const scale = 34;

  const toX = (v: number) => originX + v * scale;
  const toY = (v: number) => originY - v * scale;

  const points = [
    { re: -7, im: 6, label: "−7 + j6", dx: -38, dy: -18 },
    { re: 6, im: 4, label: "6 + j4", dx: -10, dy: -18 },
    { re: -2, im: -3, label: "−2 − j3", dx: -28, dy: 22 },
    { re: 5, im: -6, label: "5 − j6", dx: 14, dy: 10 },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 900 760"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Four Quadrant Argand Diagram</title>
          <desc id="desc">
            Four quadrant Argand diagram with real and imaginary axes and
            example complex numbers plotted in each quadrant.
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
          </defs>

          <rect width="900" height="760" fill="white" />

          <text x="450" y="34" textAnchor="middle" style={titleStyle}>
            Four Quadrant Argand Diagram
          </text>

          {/* Main axes */}
          <line
            x1="60"
            y1={originY}
            x2="835"
            y2={originY}
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />
          <line
            x1={originX}
            y1="675"
            x2={originX}
            y2="70"
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          {/* Negative direction arrows */}
          <line
            x1={originX}
            y1={originY}
            x2="70"
            y2={originY}
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />
          <line
            x1={originX}
            y1={originY}
            x2={originX}
            y2="685"
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          {/* Tick marks and numbers on x-axis */}
          {Array.from({ length: 17 }, (_, i) => i - 8).map((v) => (
            <g key={`x-${v}`}>
              <line
                x1={toX(v)}
                y1={originY - 7}
                x2={toX(v)}
                y2={originY + 7}
                stroke="black"
                strokeWidth={gridStroke}
              />
              {v !== 0 && (
                <text
                  x={toX(v)}
                  y={originY + 28}
                  textAnchor="middle"
                  style={tinyTextStyle}
                >
                  {v}
                </text>
              )}
            </g>
          ))}

          {/* Tick marks and numbers on y-axis */}
          {Array.from({ length: 19 }, (_, i) => i - 9).map((v) => (
            <g key={`y-${v}`}>
              <line
                x1={originX - 7}
                y1={toY(v)}
                x2={originX + 7}
                y2={toY(v)}
                stroke="black"
                strokeWidth={gridStroke}
              />
              {v !== 0 && (
                <text
                  x={originX - 16}
                  y={toY(v) + 6}
                  textAnchor="end"
                  style={tinyTextStyle}
                >
                  {v}
                </text>
              )}
            </g>
          ))}

          {/* Origin */}
          <text x={originX - 14} y={originY + 22} textAnchor="end" style={tinyTextStyle}>
            0
          </text>

          {/* Axis labels */}
          <text x="515" y="74" style={textStyle}>
            Positive Imaginary Axis
          </text>
          <text x={originX - 8} y="100" style={textStyle}>
            +j
          </text>

          <text x="28" y="270" style={textStyle}>
            Negative Real Axis
          </text>
          <text x="690" y="270" style={textStyle}>
            Positive Real Axis
          </text>
          <text x="843" y={originY + 8} style={textStyle}>
            +1
          </text>

          <text x="350" y="730" style={textStyle}>
            Negative Imaginary Axis
          </text>
          <text x={originX - 7} y="705" style={textStyle}>
            −j
          </text>

          {/* Quadrant labels */}
          <text x="170" y="140" style={textStyle}>
            2nd Quadrant Area
          </text>
          <text x="525" y="140" style={textStyle}>
            1st Quadrant Area
          </text>
          <text x="160" y="650" style={textStyle}>
            3rd Quadrant Area
          </text>
          <text x="525" y="650" style={textStyle}>
            4th Quadrant Area
          </text>

          {/* Plotted points with dashed projections */}
          {points.map((p, idx) => (
            <g key={idx}>
              <line
                x1={toX(p.re)}
                y1={originY}
                x2={toX(p.re)}
                y2={toY(p.im)}
                stroke="black"
                strokeWidth="2"
                strokeDasharray="10 7"
              />
              <line
                x1={originX}
                y1={toY(p.im)}
                x2={toX(p.re)}
                y2={toY(p.im)}
                stroke="black"
                strokeWidth="2"
                strokeDasharray="10 7"
              />
              <circle
                cx={toX(p.re)}
                cy={toY(p.im)}
                r="9"
                fill="white"
                stroke="black"
                strokeWidth="2.5"
              />
              <text x={toX(p.re) + p.dx} y={toY(p.im) + p.dy} style={textStyle}>
                {p.label}
              </text>
            </g>
          ))}

          {/* Small x-axis labels for i and -i like reference vibe */}
          <text x={toX(-7)} y={originY + 18} style={tinyTextStyle}>
            −7
          </text>
          <text x={toX(6)} y={originY + 18} style={tinyTextStyle}>
            6
          </text>
          <text x={toX(5)} y={originY + 18} style={tinyTextStyle}>
            5
          </text>
          <text x={toX(-2)} y={originY + 18} style={tinyTextStyle}>
            −2
          </text>
        </svg>
      </div>
    </main>
  );
}
