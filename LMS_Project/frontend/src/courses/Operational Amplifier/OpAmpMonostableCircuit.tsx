export default function OpAmpMonostableCircuit() {
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

  const resistor = (
    x: number,
    y: number,
    width = 95,
    height = 15,
    direction: "horizontal" | "vertical" = "horizontal",
  ) => {
    const step = width / 8;

    if (direction === "horizontal") {
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
    }

    return `
      ${x},${y}
      ${x},${y + step}
      ${x - height},${y + step * 2}
      ${x + height},${y + step * 3}
      ${x - height},${y + step * 4}
      ${x + height},${y + step * 5}
      ${x - height},${y + step * 6}
      ${x + height},${y + step * 7}
      ${x},${y + step * 8}
    `;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 900 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Op-Amp Monostable Circuit</title>
          <desc id="desc">
            Clean black-and-white SVG diagram of an op-amp monostable circuit
            with input, op-amp, feedback divider, output voltage, and beta
            feedback path.
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

          <rect width="900" height="520" fill="white" />

          {/* Input terminal */}
          <circle
            cx="70"
            cy="115"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="20" y="105" style={smallTextStyle}>
            Vin
          </text>

          <line
            x1="80"
            y1="115"
            x2="205"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Op-amp body */}
          <polygon
            points="205,45 205,250 455,150"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="280" y="170" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="225" y="95" style={smallTextStyle}>
            +
          </text>

          <text x="225" y="205" style={smallTextStyle}>
            −
          </text>

          {/* Input connection to non-inverting input */}
          <line
            x1="205"
            y1="115"
            x2="235"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Output wire */}
          <line
            x1="455"
            y1="150"
            x2="760"
            y2="150"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="585" cy="150" r="6" fill="black" />

          <circle
            cx="760"
            cy="150"
            r="10"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="625" y="125" style={smallTextStyle}>
            Vout
          </text>

          {/* Output saturation labels */}
          <text x="395" y="55" style={smallTextStyle}>
            +Voz
          </text>

          <text x="395" y="260" style={smallTextStyle}>
            −Voz
          </text>

          {/* Feedback divider R2 and R1 */}
          <line
            x1="585"
            y1="150"
            x2="585"
            y2="195"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(585, 195, 95, 15, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="625" y="245" style={smallTextStyle}>
            R₂
          </text>

          <line
            x1="585"
            y1="290"
            x2="585"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="585" cy="325" r="6" fill="black" />

          <polyline
            points={resistor(585, 325, 95, 15, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="625" y="375" style={smallTextStyle}>
            R₁
          </text>

          <line
            x1="585"
            y1="420"
            x2="585"
            y2="450"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Ground under R1 */}
          <line
            x1="555"
            y1="450"
            x2="615"
            y2="450"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="565"
            y1="463"
            x2="605"
            y2="463"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="575"
            y1="476"
            x2="595"
            y2="476"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback path to inverting input */}
          <line
            x1="585"
            y1="325"
            x2="145"
            y2="325"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="145"
            y1="325"
            x2="145"
            y2="200"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="145"
            y1="200"
            x2="205"
            y2="200"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Beta feedback arrow */}
          <line
            x1="380"
            y1="360"
            x2="230"
            y2="360"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="395" y="367" style={smallTextStyle}>
            β
          </text>
        </svg>
      </div>
    </main>
  );
}
