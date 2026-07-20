export default function IdealCurrentSource() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 24,
    fontWeight: "bold",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 23,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 18,
  };

  const sourceCurrentArrow = (x: number, y: number) => (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + 95}
        y2={y}
        stroke="black"
        strokeWidth="2.4"
        markerEnd="url(#arrow)"
      />
      <text x={x + 38} y={y - 15} style={smallStyle}>
        i
      </text>

      <line
        x1={x + 105}
        y1={y + 13}
        x2={x + 145}
        y2={y + 13}
        stroke="black"
        strokeWidth="2.2"
        strokeDasharray="5 5"
        markerEnd="url(#arrow)"
      />
      <text x={x + 150} y={y + 20} style={smallStyle}>
        v
      </text>
    </g>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1100 430"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Ideal Current Source</title>
          <desc id="desc">
            Black and white diagram of independent current sources and ideal
            current-source voltage-current characteristic.
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

            <pattern
              id="hatch"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="black"
                strokeWidth="0.7"
              />
            </pattern>

            <pattern
              id="lightHatch"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="12"
                stroke="black"
                strokeWidth="0.55"
              />
            </pattern>
          </defs>

          <rect width="1100" height="430" fill="white" />

          {/* Title */}
          <text x="330" y="42" textAnchor="middle" style={titleStyle}>
            Independent Current Sources
          </text>

          {/* ================= General current source ================= */}
          <g>
            {sourceCurrentArrow(70, 92)}

            <line
              x1="120"
              y1="125"
              x2="120"
              y2="170"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <circle
              cx="120"
              cy="215"
              r="45"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="120"
              y1="260"
              x2="120"
              y2="320"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="120"
              y1="240"
              x2="120"
              y2="190"
              stroke="black"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />

            <text x="50" y="225" style={labelStyle}>
              Iₛ
            </text>

            <text x="205" y="224" style={labelStyle}>
              v
            </text>

            <text x="84" y="372" style={labelStyle}>
              General
            </text>
          </g>

          {/* ================= Generator current source ================= */}
          <g>
            {sourceCurrentArrow(365, 92)}

            <line
              x1="420"
              y1="125"
              x2="420"
              y2="165"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <circle
              cx="420"
              cy="215"
              r="45"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="420"
              y1="265"
              x2="420"
              y2="320"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* Generator winding style */}
            <path
              d="M 393 220 C 393 190, 410 190, 410 220 C 410 250, 427 250, 427 220 C 427 190, 444 190, 444 220"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <line
              x1="464"
              y1="245"
              x2="464"
              y2="185"
              stroke="black"
              strokeWidth="2.5"
              markerEnd="url(#arrow)"
            />

            <text x="345" y="225" style={labelStyle}>
              Iₛ
            </text>

            <text x="512" y="224" style={labelStyle}>
              v
            </text>

            <text x="378" y="372" style={labelStyle}>
              Generator
            </text>
          </g>

          {/* ================= Ideal current source characteristic ================= */}
          <g>
            {/* Graph axes */}
            <line
              x1="655"
              y1="330"
              x2="1035"
              y2="330"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <line
              x1="820"
              y1="360"
              x2="820"
              y2="65"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <text x="805" y="58" style={labelStyle}>
              i
            </text>
            <text x="1035" y="355" style={labelStyle}>
              v
            </text>
            <text x="802" y="354" style={smallStyle}>
              0
            </text>

            {/* Power regions */}
            <rect
              x="660"
              y="150"
              width="160"
              height="135"
              fill="url(#hatch)"
              stroke="black"
              strokeWidth="1.5"
            />

            <rect
              x="820"
              y="150"
              width="170"
              height="135"
              fill="url(#lightHatch)"
              stroke="black"
              strokeWidth="1.5"
            />

            {/* Ideal current source horizontal line */}
            <line
              x1="660"
              y1="150"
              x2="990"
              y2="150"
              stroke="black"
              strokeWidth="5"
            />

            {/* Center horizontal axis line */}
            <line
              x1="660"
              y1="285"
              x2="990"
              y2="285"
              stroke="black"
              strokeWidth="2"
            />

            {/* Vertical reference from Is line to axis */}
            <line
              x1="820"
              y1="150"
              x2="820"
              y2="285"
              stroke="black"
              strokeWidth="2"
            />

            <text x="790" y="140" style={smallStyle}>
              +iₛ
            </text>

            <text x="790" y="310" style={smallStyle}>
              0
            </text>

            <text x="693" y="200" style={labelStyle}>
              Absorbs
            </text>
            <text x="712" y="230" style={labelStyle}>
              Power
            </text>

            <text x="875" y="200" style={labelStyle}>
              Delivers
            </text>
            <text x="895" y="230" style={labelStyle}>
              Power
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
