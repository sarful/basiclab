export default function PhasorDiagramSinusoidalWaveform() {
  const stroke = 2.5;

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
    fontSize: 15,
    fill: "black",
  };

  const ArrowHead = ({
    x,
    y,
    direction,
    fill = "black",
  }: {
    x: number;
    y: number;
    direction: "right" | "left" | "up" | "down";
    fill?: string;
  }) => {
    let points = "";

    if (direction === "right") {
      points = `${x},${y} ${x - 12},${y - 7} ${x - 12},${y + 7}`;
    } else if (direction === "left") {
      points = `${x},${y} ${x + 12},${y - 7} ${x + 12},${y + 7}`;
    } else if (direction === "up") {
      points = `${x},${y} ${x - 7},${y + 12} ${x + 7},${y + 12}`;
    } else {
      points = `${x},${y} ${x - 7},${y - 12} ${x + 7},${y - 12}`;
    }

    return <polygon points={points} fill={fill} stroke={fill} strokeWidth="1.5" />;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 900 360"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Phasor Diagram of a Sinusoidal Waveform</title>
          <desc id="desc">
            A phasor diagram showing a voltage phasor along the reference axis,
            a lagging current phasor at 60 degrees below the reference axis,
            the phase angle phi, and the angular velocity omega.
          </desc>

          <rect width="900" height="360" fill="white" />

          <text x="450" y="32" textAnchor="middle" style={titleStyle}>
            Phasor Diagram of a Sinusoidal Waveform
          </text>

          {/* Origin */}
          <circle cx="90" cy="170" r="7" fill="white" stroke="black" strokeWidth={stroke} />
          <text x="75" y="158" style={textStyle}>
            0
          </text>

          {/* Reference axis */}
          <line
            x1="90"
            y1="170"
            x2="660"
            y2="170"
            stroke="black"
            strokeWidth={stroke}
          />
          <ArrowHead x={660} y={170} direction="right" />

          <text x="690" y="160" style={textStyle}>
            Reference
          </text>
          <text x="742" y="188" style={textStyle}>
            axis
          </text>

          {/* Voltage phasor */}
          <line
            x1="90"
            y1="170"
            x2="500"
            y2="170"
            stroke="#2c67b7"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ArrowHead x={500} y={170} direction="right" fill="#2c67b7" />

          <text x="240" y="148" style={{ ...textStyle, fill: "#2c67b7" }}>
            V = Vₘ sin(ωt)
          </text>

          {/* Current phasor */}
          <line
            x1="90"
            y1="170"
            x2="475"
            y2="300"
            stroke="#8b3a35"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <polygon
            points="475,300 457,287 452,306"
            fill="#8b3a35"
            stroke="#8b3a35"
            strokeWidth="1.5"
          />

          <text x="360" y="325" style={{ ...textStyle, fill: "#8b3a35" }}>
            I = Iₘ sin(ωt - φ)
          </text>

          {/* Lagging axis label */}
          <text x="145" y="285" style={smallTextStyle}>
            Lagging
          </text>
          <text x="165" y="309" style={smallTextStyle}>
            axis
          </text>

          {/* Phase angle arc */}
          <path
            d="M 230 170 A 140 140 0 0 1 197 291"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="262" y="228" style={textStyle}>
            ϕ
          </text>
          <text x="290" y="228" style={smallTextStyle}>
            (60°)
          </text>

          {/* Small guide along current vector */}
          <line
            x1="90"
            y1="170"
            x2="197"
            y2="291"
            stroke="black"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />

          {/* Angular velocity omega curved arrow */}
          <path
            d="M 555 92 A 95 95 0 0 1 470 40"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
          />
          <ArrowHead x={470} y={40} direction="left" />
          <text x="560" y="82" style={textStyle}>
            ω
          </text>

          {/* Small construction line near omega */}
          <line
            x1="560"
            y1="92"
            x2="540"
            y2="120"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </main>
  );
}
