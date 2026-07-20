export default function TwoSinusoidalWaveformsInPhase() {
  const axisStroke = 2.5;
  const waveStroke = 4;

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

  const blueStroke = "#3f73b9";
  const blueFill = "#d9e6f7";
  const brownStroke = "#7f332d";
  const brownFill = "#d6b0aa";

  const ArrowHead = ({
    x,
    y,
    direction,
    fill = "white",
  }: {
    x: number;
    y: number;
    direction: "right" | "left" | "up" | "down";
    fill?: string;
  }) => {
    let points = "";

    if (direction === "right") {
      points = `${x},${y} ${x - 11},${y - 6} ${x - 11},${y + 6}`;
    } else if (direction === "left") {
      points = `${x},${y} ${x + 11},${y - 6} ${x + 11},${y + 6}`;
    } else if (direction === "up") {
      points = `${x},${y} ${x - 6},${y + 11} ${x + 6},${y + 11}`;
    } else {
      points = `${x},${y} ${x - 6},${y - 11} ${x + 6},${y - 11}`;
    }

    return <polygon points={points} fill={fill} stroke="black" strokeWidth="2" />;
  };

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
          <title id="title">Two Sinusoidal Waveforms In Phase</title>
          <desc id="desc">
            Two sinusoidal waveforms in phase, showing voltage and current with
            different amplitudes, plotted against omega t.
          </desc>

          <rect width="1000" height="520" fill="white" />

          {/* Axes */}
          <line
            x1="90"
            y1="40"
            x2="90"
            y2="470"
            stroke="black"
            strokeWidth={axisStroke}
          />
          <line
            x1="90"
            y1="255"
            x2="935"
            y2="255"
            stroke="black"
            strokeWidth={axisStroke}
          />
          <ArrowHead x={935} y={255} direction="right" />

          <text x="950" y="262" style={smallTextStyle}>
            θ = ωt
          </text>

          {/* Dashed amplitude guides */}
          <line
            x1="90"
            y1="70"
            x2="810"
            y2="70"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1="90"
            y1="120"
            x2="740"
            y2="120"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1="90"
            y1="390"
            x2="740"
            y2="390"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1="90"
            y1="440"
            x2="810"
            y2="440"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Axis labels */}
          <text x="25" y="79" style={smallTextStyle}>
            +Vₘ
          </text>
          <text x="25" y="129" style={smallTextStyle}>
            +Iₘ
          </text>
          <text x="45" y="262" style={smallTextStyle}>
            0
          </text>
          <text x="30" y="399" style={smallTextStyle}>
            -Iₘ
          </text>
          <text x="25" y="449" style={smallTextStyle}>
            -Vₘ
          </text>

          {/* Waveform fills */}
          <path
            d="
              M 100 255
              C 170 40, 290 40, 400 255
              C 510 470, 630 470, 740 255
              C 740 255, 100 255, 100 255 Z
            "
            fill={blueFill}
            opacity="0.95"
          />

          <path
            d="
              M 100 255
              C 170 105, 290 105, 400 255
              C 510 405, 630 405, 740 255
              C 740 255, 100 255, 100 255 Z
            "
            fill={brownFill}
            opacity="0.75"
          />

          {/* Voltage waveform */}
          <path
            d="
              M 100 255
              C 170 40, 290 40, 400 255
              C 510 470, 630 470, 740 255
            "
            fill="none"
            stroke={blueStroke}
            strokeWidth={waveStroke + 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current waveform */}
          <path
            d="
              M 100 255
              C 170 105, 290 105, 400 255
              C 510 405, 630 405, 740 255
            "
            fill="none"
            stroke={brownStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin and endpoint markers */}
          <circle cx="100" cy="255" r="6" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="740" cy="255" r="6" fill="white" stroke="black" strokeWidth="2" />

          {/* Tick marks and phase labels */}
          {[
            { x: 180, label: "π/2" },
            { x: 400, label: "π" },
            { x: 620, label: "3π/2" },
            { x: 740, label: "2π" },
          ].map((tick) => (
            <g key={tick.label}>
              <line
                x1={tick.x}
                y1="245"
                x2={tick.x}
                y2="265"
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={tick.x}
                y="285"
                textAnchor="middle"
                style={textStyle}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Labels with leader arrows */}
          <text x="305" y="55" style={textStyle}>
            Voltage (V)
          </text>
          <line
            x1="332"
            y1="63"
            x2="280"
            y2="92"
            stroke="black"
            strokeWidth="2"
          />
          <ArrowHead x={280} y={92} direction="down" fill="black" />

          <text x="430" y="115" style={textStyle}>
            Current (I)
          </text>
          <line
            x1="450"
            y1="124"
            x2="360"
            y2="190"
            stroke="black"
            strokeWidth="2"
          />
          <ArrowHead x={360} y={190} direction="down" fill="black" />

          {/* In-phase indication */}
          <text x="248" y="205" style={textStyle}>
            π
          </text>
          <text x="262" y="175" style={tinyTextStyle}>
            2
          </text>

          {/* Optional title */}
          <text x="500" y="500" textAnchor="middle" style={titleStyle}>
            Two Sinusoidal Waveforms – In Phase
          </text>
        </svg>
      </div>
    </main>
  );
}
