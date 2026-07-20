export default function SingleCoilMagneticField() {
  const stroke = 2.5;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "black",
    fontWeight: 600,
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

  const arrowHead = (
    x: number,
    y: number,
    dir: "right" | "left" | "up" | "down",
  ) => {
    if (dir === "right")
      return `${x},${y} ${x - 10},${y - 5} ${x - 10},${y + 5}`;
    if (dir === "left")
      return `${x},${y} ${x + 10},${y - 5} ${x + 10},${y + 5}`;
    if (dir === "up") return `${x},${y} ${x - 5},${y + 10} ${x + 5},${y + 10}`;
    return `${x},${y} ${x - 5},${y - 10} ${x + 5},${y - 10}`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1200 480"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Single Coil within a Magnetic Field</title>
          <desc id="desc">
            Educational SVG illustration showing a single rotating coil between
            magnetic poles and the corresponding generated sinusoidal waveform
            over one cycle.
          </desc>

          <defs>
            <linearGradient id="northGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9b2ab" />
              <stop offset="100%" stopColor="#a9564d" />
            </linearGradient>

            <linearGradient id="southGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eef4fc" />
              <stop offset="100%" stopColor="#b8c9e4" />
            </linearGradient>

            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfe7f3" />
              <stop offset="100%" stopColor="#bfc8d6" />
            </linearGradient>
          </defs>

          <rect width="1200" height="480" fill="white" />

          {/* ================= LEFT MAGNET + LARGE COIL ================= */}
          {/* North pole */}
          <path
            d="M 20 20 L 220 20 L 220 145 Q 120 85 20 145 Z"
            fill="url(#northGrad)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="120" y="70" textAnchor="middle" style={titleStyle}>
            N
          </text>

          {/* South pole */}
          <path
            d="M 20 455 L 220 455 L 220 320 Q 120 380 20 320 Z"
            fill="url(#southGrad)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="120" y="410" textAnchor="middle" style={titleStyle}>
            S
          </text>

          {/* Large rotating circle */}
          <circle
            cx="120"
            cy="220"
            r="110"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="10 8"
          />

          {/* Coil axis / conductors */}
          <line
            x1="70"
            y1="315"
            x2="175"
            y2="135"
            stroke="black"
            strokeWidth={5}
            strokeLinecap="round"
          />

          <circle
            cx="70"
            cy="315"
            r="20"
            fill="#f0c7a0"
            stroke="black"
            strokeWidth={stroke}
          />
          <circle
            cx="175"
            cy="135"
            r="20"
            fill="#f2d2b6"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="105"
            cy="225"
            r="18"
            fill="#808080"
            opacity="0.8"
            stroke="black"
            strokeWidth={1.5}
          />

          {/* Rotation arrows */}
          <path
            d="M 45 150 A 95 95 0 0 1 78 118"
            fill="none"
            stroke="black"
            strokeWidth={2}
          />
          <polygon points={arrowHead(78, 118, "right")} fill="black" />

          <path
            d="M 168 310 A 95 95 0 0 1 145 335"
            fill="none"
            stroke="black"
            strokeWidth={2}
          />
          <polygon points={arrowHead(145, 335, "left")} fill="black" />

          {/* Theta marking */}
          <path
            d="M 132 190 A 42 42 0 0 1 162 234"
            fill="none"
            stroke="#7a33aa"
            strokeWidth={3}
          />
          <text x="170" y="195" style={{ ...textStyle, fill: "#7a33aa" }}>
            θ
          </text>

          <text x="165" y="292" style={{ ...smallTextStyle, fill: "#7a33aa" }}>
            ω
          </text>

          {/* Dotted link to center illustration */}
          <line
            x1="225"
            y1="140"
            x2="440"
            y2="140"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="10 8"
          />

          {/* Small dots / ellipsis */}
          <circle cx="255" cy="220" r="2.5" fill="black" />
          <circle cx="270" cy="220" r="2.5" fill="black" />
          <circle cx="285" cy="220" r="2.5" fill="black" />

          {/* ================= CENTER POSITION DIAGRAM ================= */}
          <circle
            cx="495"
            cy="220"
            r="85"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="10 8"
          />

          <line
            x1="495"
            y1="220"
            x2="566"
            y2="125"
            stroke="black"
            strokeWidth={4}
            strokeLinecap="round"
          />

          <circle cx="495" cy="220" r="5" fill="black" />
          <circle
            cx="566"
            cy="125"
            r="12"
            fill="#e8b7b7"
            stroke="black"
            strokeWidth={1.5}
          />

          <path
            d="M 476 205 A 35 35 0 0 1 518 180"
            fill="none"
            stroke="#7a33aa"
            strokeWidth={3}
          />
          <text x="525" y="190" style={{ ...smallTextStyle, fill: "#7a33aa" }}>
            θ
          </text>

          <path
            d="M 448 160 A 70 70 0 0 1 530 145"
            fill="none"
            stroke="black"
            strokeWidth={2}
          />
          <polygon points={arrowHead(530, 145, "right")} fill="black" />

          <path
            d="M 548 265 A 70 70 0 0 1 525 290"
            fill="none"
            stroke="black"
            strokeWidth={2}
          />
          <polygon points={arrowHead(525, 290, "left")} fill="black" />

          <text
            x="585"
            y="175"
            style={tinyTextStyle}
            transform="rotate(-55 585 175)"
          >
            Rotating coil
          </text>

          <line
            x1="580"
            y1="140"
            x2="585"
            y2="140"
            stroke="black"
            strokeWidth={2}
          />

          {/* Reference line from center to graph */}
          <line
            x1="580"
            y1="140"
            x2="710"
            y2="140"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="10 8"
          />

          {/* ================= RIGHT SINE WAVE GRAPH ================= */}
          {/* Axes */}
          <line
            x1="710"
            y1="60"
            x2="710"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
          />
          <line
            x1="710"
            y1="220"
            x2="1150"
            y2="220"
            stroke="black"
            strokeWidth={stroke}
          />
          <polygon
            points={arrowHead(1150, 220, "right")}
            fill="white"
            stroke="black"
            strokeWidth={2}
          />
          <polygon
            points={arrowHead(710, 60, "up")}
            fill="white"
            stroke="black"
            strokeWidth={2}
          />

          {/* Sine wave filled area */}
          <path
            d="
              M 710 220
              C 745 110, 785 95, 815 145
              C 845 190, 875 250, 915 350
              C 945 410, 980 350, 1015 260
              C 1050 180, 1090 165, 1140 220
              L 1140 220
              L 710 220 Z
            "
            fill="url(#waveGrad)"
            opacity="0.95"
          />

          <path
            d="
              M 710 220
              C 745 110, 785 95, 815 145
              C 845 190, 875 250, 915 350
              C 945 410, 980 350, 1015 260
              C 1050 180, 1090 165, 1140 220
            "
            fill="none"
            stroke="#4a76b9"
            strokeWidth={5}
            strokeLinecap="round"
          />

          {/* Dashed -Vm line */}
          <line
            x1="710"
            y1="345"
            x2="1140"
            y2="345"
            stroke="black"
            strokeWidth={2}
            strokeDasharray="10 8"
          />

          {/* Ticks and labels */}
          {[
            { x: 760, label: "θ" },
            { x: 840, label: "π/2" },
            { x: 940, label: "π" },
            { x: 1040, label: "3π/2" },
            { x: 1130, label: "2π" },
          ].map((tick) => (
            <g key={tick.label}>
              <line
                x1={tick.x}
                y1={212}
                x2={tick.x}
                y2={228}
                stroke="black"
                strokeWidth={2}
              />
              <text
                x={tick.x}
                y={245}
                textAnchor="middle"
                style={smallTextStyle}
              >
                {tick.label}
              </text>
            </g>
          ))}

          <text x="695" y="228" style={smallTextStyle}>
            0
          </text>

          <text x="665" y="85" style={textStyle}>
            +Vm
          </text>

          <text x="670" y="352" style={textStyle}>
            −Vm
          </text>

          <text x="807" y="35" style={titleStyle}>
            1 Cycle
          </text>

          <path d="M 835 45 L 895 45" stroke="black" strokeWidth={2} />
          <line
            x1="835"
            y1="40"
            x2="835"
            y2="50"
            stroke="black"
            strokeWidth={2}
          />
          <line
            x1="895"
            y1="40"
            x2="895"
            y2="50"
            stroke="black"
            strokeWidth={2}
          />

          <text x="1130" y="206" style={smallTextStyle}>
            time
          </text>
          <text x="1126" y="248" style={smallTextStyle}>
            e(t)
          </text>

          {/* Bottom title */}
          <text x="730" y="425" style={titleStyle}>
            Instantaneous Values
          </text>
        </svg>
      </div>
    </main>
  );
}
