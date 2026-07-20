export default function DifferenceSineCosineWave() {
  const axisStroke = 2.5;
  const waveStroke = 5;

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

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: "black",
  };

  const blueStroke = "#1f5fa8";
  const blueFill = "#dbe6f2";
  const brownStroke = "#7b332d";
  const brownFill = "#e5c4bf";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Difference Between a Sine Wave and a Cosine Wave</title>
          <desc id="desc">
            SVG diagram comparing sine and cosine waveforms, showing that
            cosine leads sine by ninety degrees.
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

          <rect width="1000" height="520" fill="white" />

          <text x="500" y="40" textAnchor="middle" style={titleStyle}>
            Difference Between a Sine Wave and a Cosine Wave
          </text>

          {/* Axes */}
          <line
            x1="55"
            y1="270"
            x2="940"
            y2="270"
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1="220"
            y1="35"
            x2="220"
            y2="470"
            stroke="black"
            strokeWidth={axisStroke}
          />

          <text x="948" y="278" style={smallTextStyle}>
            θ = ωt
          </text>

          {/* Vertical guide at the sine start */}
          <line
            x1="220"
            y1="55"
            x2="220"
            y2="455"
            stroke="black"
            strokeWidth="2"
          />

          {/* Cosine wave fill and stroke: cos(ωt), leads sine by 90° */}
          <path
            d="
              M 55 270
              C 95 165, 150 70, 220 70
              C 315 70, 385 270, 470 270
              C 555 270, 625 470, 720 470
              C 790 470, 850 375, 900 270
              L 900 270
              L 55 270
              Z
            "
            fill={brownFill}
            opacity="0.82"
          />

          <path
            d="
              M 55 270
              C 95 165, 150 70, 220 70
              C 315 70, 385 270, 470 270
              C 555 270, 625 470, 720 470
              C 790 470, 850 375, 900 270
            "
            fill="none"
            stroke={brownStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sine wave fill and stroke: sin(ωt) */}
          <path
            d="
              M 220 270
              C 290 70, 405 70, 470 270
              C 535 470, 655 470, 720 270
              C 790 70, 850 145, 900 270
              L 900 270
              L 220 270
              Z
            "
            fill={blueFill}
            opacity="0.95"
          />

          <path
            d="
              M 220 270
              C 290 70, 405 70, 470 270
              C 535 470, 655 470, 720 270
              C 790 70, 850 145, 900 270
            "
            fill="none"
            stroke={blueStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Axis crossing dots */}
          <circle cx="55" cy="270" r="5" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="220" cy="270" r="5" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="470" cy="270" r="5" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="720" cy="270" r="5" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="900" cy="270" r="5" fill="white" stroke="black" strokeWidth="2" />

          {/* Tick marks and labels */}
          <g>
            <line x1="55" y1="258" x2="55" y2="282" stroke="black" strokeWidth="2" />
            <text x="55" y="245" textAnchor="middle" style={textStyle}>
              π/2
            </text>
          </g>

          <g>
            <line x1="220" y1="258" x2="220" y2="282" stroke="black" strokeWidth="2" />
            <text x="220" y="300" textAnchor="middle" style={textStyle}>
              0
            </text>
          </g>

          <g>
            <line x1="365" y1="258" x2="365" y2="282" stroke="black" strokeWidth="2" />
            <text x="365" y="245" textAnchor="middle" style={textStyle}>
              π/2
            </text>
          </g>

          <g>
            <line x1="470" y1="258" x2="470" y2="282" stroke="black" strokeWidth="2" />
            <text x="470" y="245" textAnchor="middle" style={textStyle}>
              π
            </text>
          </g>

          <g>
            <line x1="720" y1="258" x2="720" y2="282" stroke="black" strokeWidth="2" />
            <text x="720" y="245" textAnchor="middle" style={textStyle}>
              3π/2
            </text>
          </g>

          <g>
            <line x1="900" y1="258" x2="900" y2="282" stroke="black" strokeWidth="2" />
            <text x="900" y="245" textAnchor="middle" style={textStyle}>
              2π
            </text>
          </g>

          {/* Labels */}
          <text x="360" y="82" style={smallTextStyle}>
            cos(ωt)
          </text>
          <line
            x1="410"
            y1="88"
            x2="292"
            y2="92"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x="525" y="82" style={smallTextStyle}>
            sin(ωt)
          </text>
          <line
            x1="550"
            y1="88"
            x2="445"
            y2="128"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* 90 degree phase difference marker */}
          <line
            x1="55"
            y1="405"
            x2="220"
            y2="405"
            stroke="black"
            strokeWidth="2.2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line x1="55" y1="392" x2="55" y2="418" stroke="black" strokeWidth="2" />
          <line x1="220" y1="392" x2="220" y2="418" stroke="black" strokeWidth="2" />

          <text x="95" y="438" style={smallTextStyle}>
            φ = 90°
          </text>

          {/* Reference labels */}
          <text x="38" y="286" textAnchor="end" style={smallTextStyle}>
            0
          </text>

          <text x="220" y="492" textAnchor="middle" style={tinyTextStyle}>
            sine wave starts at zero
          </text>

          <text x="140" y="56" textAnchor="middle" style={tinyTextStyle}>
            cosine wave leads by 90°
          </text>
        </svg>
      </div>
    </main>
  );
}
