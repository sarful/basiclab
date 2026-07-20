export default function OhmsLawExampleNo1() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 28,
  };

  const smallLabelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const resistor = (x: number, y: number, width = 160, height = 22) => {
    const step = width / 8;

    return `
      ${x},${y}
      ${x + step},${y}
      ${x + step * 2},${y - height}
      ${x + step * 3},${y + height}
      ${x + step * 4},${y - height}
      ${x + step * 5},${y + height}
      ${x + step * 6},${y - height}
      ${x + step * 7},${y + height}
      ${x + step * 8},${y}
    `;
  };

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
          <title id="title">Ohms Law Example Number 1</title>
          <desc id="desc">
            Black and white Ohms Law example circuit using ANSI style battery
            and zigzag resistor symbols. The circuit shows V equals 24 volts,
            I equals 2 amps, R equals 12 ohms, and P equals 48 watts.
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

          {/* Top and bottom wires */}
          <line
            x1="210"
            y1="105"
            x2="720"
            y2="105"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="210"
            y1="415"
            x2="720"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current direction on top wire */}
          <line
            x1="420"
            y1="80"
            x2="330"
            y2="80"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="360" y="56" style={labelStyle}>
            I = 2A
          </text>

          {/* Left side battery branch */}
          <line
            x1="210"
            y1="105"
            x2="210"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="210"
            y1="355"
            x2="210"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* ANSI battery symbol */}
          <line
            x1="155"
            y1="165"
            x2="265"
            y2="165"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="175"
            y1="190"
            x2="245"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="155"
            y1="330"
            x2="265"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="175"
            y1="355"
            x2="245"
            y2="355"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="210"
            y1="190"
            x2="210"
            y2="330"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Battery polarity */}
          <text x="150" y="150" style={smallLabelStyle}>
            +
          </text>

          <text x="152" y="375" style={smallLabelStyle}>
            −
          </text>

          {/* Voltage label */}
          <text x="45" y="250" style={labelStyle}>
            V = 24V
          </text>

          {/* Right side ANSI zigzag resistor branch */}
          <line
            x1="720"
            y1="105"
            x2="720"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(720, 180, 160, 22)}
            transform="rotate(90 720 180)"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="720"
            y1="340"
            x2="720"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Resistor labels */}
          <text x="790" y="245" style={labelStyle}>
            R = 12Ω
          </text>

          <text x="790" y="310" style={labelStyle}>
            P = 48W
          </text>
        </svg>
      </div>
    </main>
  );
}
