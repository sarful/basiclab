export default function SinusoidalWaveformConstruction() {
  const stroke = 3;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
    fontWeight: 600,
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 19,
    fill: "black",
  };

  const waveStroke = "#1f5fa8";
  const waveFill = "#dbe6f2";

  const sinePath =
    "M 520 270 C 565 110, 625 110, 670 270 C 715 430, 775 430, 820 270 C 865 110, 925 110, 970 270";

  const sineAreaPath = `${sinePath} L 970 270 L 520 270 Z`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1100 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Sinusoidal Waveform Construction</title>
          <desc id="desc">
            SVG diagram showing construction of a sinusoidal waveform from the
            projection of a rotating vector.
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

          <rect width="1100" height="560" fill="white" />

          <text x="550" y="45" textAnchor="middle" style={titleStyle}>
            Sinusoidal Waveform Construction
          </text>

          {/* Left construction circle */}
          <circle
            cx="250"
            cy="270"
            r="145"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Circle axes */}
          <line
            x1="80"
            y1="270"
            x2="420"
            y2="270"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1="250"
            y1="440"
            x2="250"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <text x="430" y="278" style={smallTextStyle}>
            x
          </text>

          <text x="258" y="108" style={smallTextStyle}>
            y
          </text>

          <text x="255" y="294" style={smallTextStyle}>
            O
          </text>

          {/* Rotating vector */}
          <line
            x1="250"
            y1="270"
            x2="342"
            y2="158"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <circle cx="342" cy="158" r="8" fill="black" />

          <text x="352" y="154" style={smallTextStyle}>
            P
          </text>

          <text x="298" y="202" style={textStyle}>
            R
          </text>

          {/* Angle arc */}
          <path
            d="M 300 270 A 50 50 0 0 1 282 232"
            fill="none"
            stroke="black"
            strokeWidth={2.5}
          />

          <text x="305" y="247" style={textStyle}>
            θ
          </text>

          {/* Projection from rotating point */}
          <line
            x1="342"
            y1="158"
            x2="342"
            y2="270"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="8 7"
          />

          <line
            x1="342"
            y1="158"
            x2="520"
            y2="158"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="8 7"
          />

          <circle
            cx="342"
            cy="270"
            r="5"
            fill="white"
            stroke="black"
            strokeWidth={2}
          />

          <text x="155" y="120" style={smallTextStyle}>
            Rotating vector
          </text>

          <text x="120" y="455" style={smallTextStyle}>
            One complete revolution = one cycle
          </text>

          {/* Right waveform axes */}
          <line
            x1="520"
            y1="270"
            x2="1015"
            y2="270"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1="520"
            y1="440"
            x2="520"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <text x="1022" y="278" style={smallTextStyle}>
            angle / time
          </text>

          <text x="528" y="108" style={smallTextStyle}>
            amplitude
          </text>

          <text x="492" y="278" style={smallTextStyle}>
            0
          </text>

          <text x="480" y="120" style={textStyle}>
            +V
          </text>

          <text x="484" y="430" style={textStyle}>
            −V
          </text>

          {/* Sine wave */}
          <path d={sineAreaPath} fill={waveFill} />
          <path
            d={sinePath}
            fill="none"
            stroke={waveStroke}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Projection point on waveform */}
          <circle cx="520" cy="158" r="7" fill="black" />

          <line
            x1="520"
            y1="158"
            x2="520"
            y2="270"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="8 7"
          />

          {/* Tick marks and angle labels */}
          {[
            { x: 520, label: "0" },
            { x: 632, label: "π/2" },
            { x: 745, label: "π" },
            { x: 858, label: "3π/2" },
            { x: 970, label: "2π" },
          ].map((tick) => (
            <g key={tick.label}>
              <line
                x1={tick.x}
                y1="260"
                x2={tick.x}
                y2="280"
                stroke="black"
                strokeWidth={2}
              />
              <text
                x={tick.x}
                y="305"
                textAnchor="middle"
                style={smallTextStyle}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Peak and valley guide lines */}
          <line
            x1="520"
            y1="110"
            x2="970"
            y2="110"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="8 7"
          />

          <line
            x1="520"
            y1="430"
            x2="970"
            y2="430"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="8 7"
          />

          <text x="650" y="92" style={smallTextStyle}>
            positive half cycle
          </text>

          <text x="735" y="462" style={smallTextStyle}>
            negative half cycle
          </text>

          {/* Direction label */}
          <path
            d="M 145 180 A 125 125 0 0 1 245 126"
            fill="none"
            stroke="black"
            strokeWidth={2.5}
            markerEnd="url(#arrow)"
          />

          <text x="110" y="170" style={smallTextStyle}>
            rotation
          </text>
        </svg>
      </div>
    </main>
  );
}
