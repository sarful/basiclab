export default function SuperpositionCircuit() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 19,
  };

  const valueStyle = {
    ...textStyle,
    fontSize: 21,
  };

  const resistor = (
    x,
    y,
    length = 130,
    height = 16,
    direction = "horizontal"
  ) => {
    const step = length / 8;

    if (direction === "vertical") {
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
    }

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
          <title id="title">Superposition Circuit</title>
          <desc id="desc">
            Black and white superposition theorem circuit using ANSI zigzag
            resistor symbols. The circuit contains R1, R2, R3, a current source,
            and a voltage source.
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

          {/* Left branch and R1 */}
          <line
            x1="150"
            y1="95"
            x2="150"
            y2="145"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(150, 145, 150, 17, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="150"
            y1="295"
            x2="150"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="190" y="218" style={labelStyle}>
            R₁
          </text>
          <text x="190" y="252" style={valueStyle}>
            2Ω
          </text>

          {/* Voltage across R1 */}
          <line
            x1="82"
            y1="292"
            x2="82"
            y2="150"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="52" y="148" style={smallStyle}>
            +
          </text>
          <text x="54" y="304" style={smallStyle}>
            −
          </text>
          <text x="40" y="232" style={labelStyle}>
            Vᴿ₁
          </text>

          {/* Top wire to R2 */}
          <line
            x1="150"
            y1="95"
            x2="300"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R2 */}
          <polyline
            points={resistor(300, 95, 160, 17, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="360" y="55" textAnchor="middle" style={labelStyle}>
            R₂
          </text>
          <text x="360" y="88" textAnchor="middle" style={valueStyle}>
            3Ω
          </text>

          <line
            x1="460"
            y1="95"
            x2="540"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Central top node */}
          <circle cx="540" cy="95" r="5.5" fill="black" />

          {/* R3 */}
          <line
            x1="540"
            y1="95"
            x2="650"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(650, 95, 160, 17, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="710" y="55" textAnchor="middle" style={labelStyle}>
            R₃
          </text>
          <text x="710" y="88" textAnchor="middle" style={valueStyle}>
            5Ω
          </text>

          <line
            x1="810"
            y1="95"
            x2="900"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right voltage source branch */}
          <line
            x1="900"
            y1="95"
            x2="900"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="862"
            y1="175"
            x2="938"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="877"
            y1="202"
            x2="923"
            y2="202"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="900"
            y1="202"
            x2="900"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="930" y="178" style={smallStyle}>
            +
          </text>
          <text x="930" y="216" style={smallStyle}>
            −
          </text>
          <text x="925" y="205" style={labelStyle}>
            20V
          </text>
          <text x="925" y="255" style={labelStyle}>
            V₁
          </text>

          {/* Bottom return wire */}
          <line
            x1="900"
            y1="415"
            x2="540"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="540"
            y1="415"
            x2="150"
            y2="415"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current source in middle */}
          <line
            x1="540"
            y1="415"
            x2="540"
            y2="320"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="540"
            cy="270"
            r="42"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="540"
            y1="296"
            x2="540"
            y2="244"
            stroke="black"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />

          <line
            x1="540"
            y1="228"
            x2="540"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="574" y="278" style={labelStyle}>
            8A
          </text>

          {/* Current arrow I1 on top right branch */}
          <line
            x1="885"
            y1="65"
            x2="800"
            y2="65"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="832" y="46" style={smallStyle}>
            I₁
          </text>

          {/* Current-source direction label */}
          <text x="565" y="235" style={smallStyle}>
            I₂
          </text>

          {/* Polarity and reference marks */}
          <text x="518" y="82" style={smallStyle}>
            +
          </text>
          <text x="872" y="82" style={smallStyle}>
            −
          </text>

          {/* Ground/reference line label */}
          <text x="525" y="450" style={smallStyle}>
            0V reference
          </text>

          {/* Small open terminals/junctions */}
          <circle cx="150" cy="95" r="4.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="900" cy="95" r="4.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="150" cy="415" r="4.5" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="900" cy="415" r="4.5" fill="white" stroke="black" strokeWidth={stroke} />
        </svg>
      </div>
    </main>
  );
}
