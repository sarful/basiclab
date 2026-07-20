export default function FindEquivalentResistance() {
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

  const noteStyle = {
    ...textStyle,
    fontSize: 18,
  };

  const resistor = (
    x: number,
    y: number,
    length = 120,
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

  const battery = (x: number, y: number, label: string, voltage: string) => (
    <g>
      <line
        x1={x}
        y1={y - 82}
        x2={x}
        y2={y - 20}
        stroke="black"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={x - 38}
        y1={y - 20}
        x2={x + 38}
        y2={y - 20}
        stroke="black"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={x - 23}
        y1={y + 5}
        x2={x + 23}
        y2={y + 5}
        stroke="black"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={x}
        y1={y + 5}
        x2={x}
        y2={y + 92}
        stroke="black"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <text x={x - 62} y={y - 55} style={smallStyle}>
        {voltage}
      </text>
      <text x={x - 48} y={y + 62} style={labelStyle}>
        {label}
      </text>
    </g>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 780"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Find the Equivalent Resistance</title>
          <desc id="desc">
            Black and white Thevenin equivalent resistance diagram using ANSI
            zigzag resistor symbols. The upper circuit shows the original
            network, and the lower circuit shows the sources removed for
            finding equivalent resistance between A and B.
          </desc>

          <rect width="1000" height="780" fill="white" />

          {/* ===================== ORIGINAL CIRCUIT ===================== */}
          <text x="40" y="45" style={{ ...labelStyle, fontWeight: "bold" }}>
            Original Circuit
          </text>

          {/* Top wires */}
          <line
            x1="70"
            y1="105"
            x2="230"
            y2="105"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="350"
            y1="105"
            x2="500"
            y2="105"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="500"
            y1="105"
            x2="650"
            y2="105"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="770"
            y1="105"
            x2="900"
            y2="105"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 */}
          <polyline
            points={resistor(230, 105, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="280" y="63" style={labelStyle}>
            10 Ω
          </text>

          {/* R2 */}
          <polyline
            points={resistor(650, 105, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="700" y="63" style={labelStyle}>
            20 Ω
          </text>

          {/* A node */}
          <circle cx="500" cy="105" r="6" fill="black" />
          <text x="482" y="82" style={labelStyle}>
            A
          </text>

          {/* Left source branch */}
          <line
            x1="70"
            y1="105"
            x2="70"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {battery(70, 250, "V₁", "10V")}

          {/* Right source branch */}
          <line
            x1="900"
            y1="105"
            x2="900"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {battery(900, 250, "V₂", "20V")}

          {/* Central 40 ohm branch */}
          <line
            x1="500"
            y1="105"
            x2="500"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(500, 180, 145, 16, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="500"
            y1="325"
            x2="500"
            y2="380"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="545" y="260" style={labelStyle}>
            40 Ω
          </text>

          {/* B terminal */}
          <circle cx="500" cy="380" r="5" fill="black" />
          <text x="515" y="390" style={labelStyle}>
            B
          </text>

          {/* ===================== EQUIVALENT RESISTANCE CIRCUIT ===================== */}
          <text x="40" y="455" style={{ ...labelStyle, fontWeight: "bold" }}>
            Sources Removed
          </text>

          {/* Shorted source sides */}
          <line
            x1="70"
            y1="520"
            x2="70"
            y2="710"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="900"
            y1="520"
            x2="900"
            y2="710"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Bottom return wire */}
          <line
            x1="70"
            y1="710"
            x2="500"
            y2="710"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="500"
            y1="710"
            x2="900"
            y2="710"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top equivalent network */}
          <line
            x1="70"
            y1="520"
            x2="230"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(230, 520, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="350"
            y1="520"
            x2="500"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="500"
            y1="520"
            x2="650"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(650, 520, 120, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="770"
            y1="520"
            x2="900"
            y2="520"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="280" y="482" style={labelStyle}>
            10 Ω
          </text>
          <text x="700" y="482" style={labelStyle}>
            20 Ω
          </text>

          {/* A and B terminals for equivalent resistance */}
          <circle cx="500" cy="520" r="6" fill="black" />
          <line
            x1="500"
            y1="520"
            x2="500"
            y2="590"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx="500" cy="710" r="6" fill="black" />
          <text x="482" y="498" style={labelStyle}>
            A
          </text>
          <text x="482" y="755" style={labelStyle}>
            B
          </text>

          {/* Removed 40 ohm resistor notice */}
          <text
            x="500"
            y="625"
            textAnchor="middle"
            style={noteStyle}
          >
            Resistance
          </text>
          <text
            x="500"
            y="650"
            textAnchor="middle"
            style={noteStyle}
          >
            Removed
          </text>

          {/* Red marks in the reference are represented as black open terminals */}
          <circle cx="70" cy="615" r="6" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="900" cy="615" r="6" fill="white" stroke="black" strokeWidth={stroke} />
        </svg>
      </div>
    </main>
  );
}
