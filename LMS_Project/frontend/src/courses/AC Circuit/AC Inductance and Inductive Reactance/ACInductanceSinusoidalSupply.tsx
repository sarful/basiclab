export default function ACInductanceSinusoidalSupply() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const coilPath = () => {
    const startX = 720;
    const startY = 135;
    const radius = 24;
    const gap = 38;

    return `
      M ${startX} ${startY}
      C ${startX + radius} ${startY}, ${startX + radius} ${startY + gap}, ${startX} ${
        startY + gap
      }
      C ${startX - radius} ${startY + gap}, ${startX - radius} ${startY + gap * 2}, ${startX} ${
        startY + gap * 2
      }
      C ${startX + radius} ${startY + gap * 2}, ${startX + radius} ${
        startY + gap * 3
      }, ${startX} ${startY + gap * 3}
      C ${startX - radius} ${startY + gap * 3}, ${startX - radius} ${
        startY + gap * 4
      }, ${startX} ${startY + gap * 4}
      C ${startX + radius} ${startY + gap * 4}, ${startX + radius} ${
        startY + gap * 5
      }, ${startX} ${startY + gap * 5}
    `;
  };

  const sinePath = () => `
    M 122 255
    C 142 210, 172 210, 192 255
    C 212 300, 242 300, 262 255
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">AC Inductance with a Sinusoidal Supply</title>
          <desc id="desc">
            Clean black and white SVG circuit diagram showing an AC sinusoidal
            voltage source connected through a switch to an inductor.
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

          <rect width="1000" height="520" fill="white" />

          {/* Left vertical circuit side */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="100"
            y1="325"
            x2="100"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* AC voltage source */}
          <circle
            cx="100"
            cy="255"
            r="70"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <path
            d={sinePath()}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="18" y="265" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">in</tspan>
          </text>

          {/* Top and bottom rails */}
          <line
            x1="100"
            y1="90"
            x2="380"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="100"
            y1="455"
            x2="690"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current label and direction */}
          <line
            x1="185"
            y1="62"
            x2="295"
            y2="62"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="205" y="43" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">L</tspan>
          </text>

          {/* Open switch */}
          <circle
            cx="380"
            cy="90"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="485"
            cy="90"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="388"
            y1="88"
            x2="470"
            y2="42"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <path
            d="M 405 36 C 428 18, 458 18, 485 34"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M 400 55 C 425 35, 455 35, 482 52"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <text x="378" y="135" style={smallTextStyle}>
            switch
          </text>

          {/* Wire from switch to inductor */}
          <line
            x1="492"
            y1="90"
            x2="720"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="720"
            y1="90"
            x2="720"
            y2="135"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Inductor */}
          <path
            d={coilPath()}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="720"
            y1="325"
            x2="720"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="690"
            y1="455"
            x2="720"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="775" y="120" style={textStyle}>
            L
          </text>

          {/* Inductor voltage arrow */}
          <line
            x1="635"
            y1="145"
            x2="635"
            y2="320"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="585" y="275" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">L</tspan>
          </text>

          <text x="650" y="145" style={smallTextStyle}>
            +
          </text>

          <text x="650" y="325" style={smallTextStyle}>
            −
          </text>

          {/* Magnetic flux dashed outlines */}
          <ellipse
            cx="735"
            cy="230"
            rx="66"
            ry="145"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeDasharray="10 9"
          />

          <ellipse
            cx="735"
            cy="230"
            rx="47"
            ry="123"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          <ellipse
            cx="735"
            cy="230"
            rx="31"
            ry="100"
            fill="none"
            stroke="black"
            strokeWidth="1.8"
            strokeDasharray="7 7"
          />

          {/* Magnetic flux curved arrow */}
          <path
            d="M 858 110 C 928 175, 928 300, 858 372"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <text x="925" y="255" style={textStyle}>
            Φ
          </text>

          {/* Connection terminals */}
          <circle cx="100" cy="90" r="4.5" fill="black" />
          <circle cx="100" cy="455" r="4.5" fill="black" />
          <circle cx="720" cy="90" r="4.5" fill="black" />
          <circle cx="720" cy="455" r="4.5" fill="black" />

          {/* Small label near bottom of inductor */}
          <text x="735" y="420" style={tinyTextStyle}>
            inductance
          </text>
        </svg>
      </div>
    </main>
  );
}
