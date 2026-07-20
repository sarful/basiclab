export default function VoltageSourcesInParallel() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 26,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 21,
  };

  const sourceStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const voltageSource = (cx: number, cy: number, labelX: number) => (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="42"
        fill="white"
        stroke="black"
        strokeWidth={stroke}
      />

      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ ...sourceStyle, fontWeight: "bold" }}
      >
        +
      </text>

      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ ...sourceStyle, fontWeight: "bold" }}
      >
        −
      </text>

      <text
        x={labelX}
        y={cy + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        style={smallStyle}
      >
        10V
      </text>
    </g>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-3xl bg-white">
        <svg
          viewBox="0 0 700 420"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Voltage Sources in Parallel</title>
          <desc id="desc">
            Black and white circuit diagram showing two ideal 10 volt voltage
            sources connected in parallel between terminals A and B using ANSI
            style voltage source symbols.
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
          </defs>

          <rect width="700" height="420" fill="white" />

          {/* Main parallel rails */}
          <line
            x1="70"
            y1="70"
            x2="540"
            y2="70"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="70"
            y1="330"
            x2="540"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Left vertical connection */}
          <line
            x1="70"
            y1="70"
            x2="70"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* First voltage source branch */}
          <line
            x1="70"
            y1="70"
            x2="70"
            y2="158"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {voltageSource(70, 200, 145)}

          <line
            x1="70"
            y1="242"
            x2="70"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Second voltage source branch */}
          <line
            x1="300"
            y1="70"
            x2="300"
            y2="158"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {voltageSource(300, 200, 375)}

          <line
            x1="300"
            y1="242"
            x2="300"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Junction dots */}
          <circle cx="70" cy="70" r="5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="70" cy="330" r="5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="300" cy="70" r="5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="300" cy="330" r="5" fill="white" stroke="black" strokeWidth={stroke} />

          {/* Right output terminals A and B */}
          <circle cx="540" cy="70" r="6" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="540" cy="330" r="6" fill="white" stroke="black" strokeWidth={stroke} />

          <text x="575" y="80" style={labelStyle}>
            A
          </text>

          <text x="575" y="340" style={labelStyle}>
            B
          </text>

          {/* Current reference arrows */}
          <line
            x1="420"
            y1="45"
            x2="520"
            y2="45"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="530" y="53" style={smallStyle}>
            i
          </text>

          <line
            x1="420"
            y1="355"
            x2="520"
            y2="355"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="530" y="363" style={smallStyle}>
            i
          </text>

          {/* Voltage reference at output */}
          <line
            x1="620"
            y1="90"
            x2="620"
            y2="310"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <text x="635" y="120" style={smallStyle}>
            +
          </text>

          <text x="638" y="315" style={smallStyle}>
            −
          </text>

          <text
            x="650"
            y="205"
            textAnchor="middle"
            dominantBaseline="middle"
            style={smallStyle}
          >
            10V
          </text>
        </svg>
      </div>
    </main>
  );
}
