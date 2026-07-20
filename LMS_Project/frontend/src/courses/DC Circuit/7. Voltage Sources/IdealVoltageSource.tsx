export default function IdealVoltageSource() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 23,
    fontWeight: "bold",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 22,
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
        x2={x + 88}
        y2={y}
        stroke="black"
        strokeWidth="2.4"
        markerEnd="url(#arrow)"
      />
      <text x={x + 35} y={y - 15} style={smallStyle}>
        i
      </text>
      <line
        x1={x + 92}
        y1={y + 8}
        x2={x + 122}
        y2={y + 8}
        stroke="black"
        strokeWidth="2.2"
        strokeDasharray="5 5"
        markerEnd="url(#arrow)"
      />
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
          <title id="title">Ideal Voltage Source</title>
          <desc id="desc">
            Black and white diagram of independent ideal voltage sources and
            their voltage-current characteristic. The diagram includes general,
            battery, and generator voltage source symbols using ANSI style.
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
              id="lightHatch"
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
          </defs>

          <rect width="1100" height="430" fill="white" />

          {/* Title */}
          <text x="270" y="40" textAnchor="middle" style={titleStyle}>
            Independent Voltage Sources
          </text>

          {/* ================= General voltage source ================= */}
          <g>
            {sourceCurrentArrow(55, 92)}

            <line
              x1="100"
              y1="112"
              x2="100"
              y2="160"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="205"
              r="45"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />
            <line
              x1="100"
              y1="250"
              x2="100"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <text x="90" y="193" style={smallStyle}>
              +
            </text>
            <text x="93" y="226" style={smallStyle}>
              −
            </text>

            <text x="35" y="215" style={labelStyle}>
              Vₛ
            </text>
            <text x="70" y="362" style={labelStyle}>
              General
            </text>
          </g>

          {/* ================= Battery voltage source ================= */}
          <g>
            {sourceCurrentArrow(310, 92)}

            <line
              x1="355"
              y1="112"
              x2="355"
              y2="165"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="318"
              y1="165"
              x2="392"
              y2="165"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="334"
              y1="195"
              x2="376"
              y2="195"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="318"
              y1="225"
              x2="392"
              y2="225"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="334"
              y1="255"
              x2="376"
              y2="255"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <line
              x1="355"
              y1="255"
              x2="355"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <text x="287" y="215" style={labelStyle}>
              Vₛ
            </text>
            <text x="327" y="362" style={labelStyle}>
              Battery
            </text>
          </g>

          {/* ================= Generator voltage source ================= */}
          <g>
            {sourceCurrentArrow(565, 92)}

            <line
              x1="610"
              y1="112"
              x2="610"
              y2="160"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <circle
              cx="610"
              cy="205"
              r="45"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />
            <line
              x1="610"
              y1="250"
              x2="610"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <path
              d="M 580 205 C 590 180, 603 180, 610 205 C 620 230, 633 230, 640 205"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <text x="545" y="215" style={labelStyle}>
              Vₛ
            </text>
            <text x="567" y="362" style={labelStyle}>
              Generator
            </text>
          </g>

          {/* ================= Ideal voltage source characteristic graph ================= */}
          <g>
            {/* Graph frame */}
            <line
              x1="780"
              y1="335"
              x2="1060"
              y2="335"
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

            <text x="806" y="58" style={labelStyle}>
              i
            </text>
            <text x="1060" y="360" style={labelStyle}>
              v
            </text>
            <text x="793" y="344" style={smallStyle}>
              0
            </text>

            {/* Shaded regions in black and white hatch */}
            <rect
              x="870"
              y="70"
              width="170"
              height="135"
              fill="url(#lightHatch)"
              stroke="none"
            />
            <rect
              x="870"
              y="335"
              width="170"
              height="-130"
              fill="white"
              stroke="none"
            />
            <rect
              x="870"
              y="205"
              width="170"
              height="130"
              fill="url(#lightHatch)"
              stroke="none"
              opacity="0.45"
            />

            {/* Constant voltage vertical characteristic */}
            <line
              x1="870"
              y1="70"
              x2="870"
              y2="335"
              stroke="black"
              strokeWidth="5"
            />

            {/* Axis center line */}
            <line
              x1="820"
              y1="205"
              x2="1040"
              y2="205"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />

            {/* Positive and negative current references */}
            <text x="785" y="88" style={smallStyle}>
              +i
            </text>
            <text x="785" y="322" style={smallStyle}>
              −i
            </text>

            <text x="893" y="115" style={labelStyle}>
              Delivers
            </text>
            <text x="908" y="145" style={labelStyle}>
              Power
            </text>

            <text x="900" y="275" style={labelStyle}>
              Absorbs
            </text>
            <text x="908" y="305" style={labelStyle}>
              Power
            </text>

            <line
              x1="886"
              y1="226"
              x2="900"
              y2="240"
              stroke="black"
              strokeWidth="2"
            />
            <text x="902" y="252" style={smallStyle}>
              Vₛ
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
