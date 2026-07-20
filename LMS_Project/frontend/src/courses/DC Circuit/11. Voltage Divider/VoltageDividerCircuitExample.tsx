export default function VoltageDividerCircuitExample() {
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
    fontSize: 20,
  };

  const valueStyle = {
    ...textStyle,
    fontSize: 22,
  };

  const resistor = (
    x: number,
    y: number,
    length = 150,
    height = 18,
    direction: "horizontal" | "vertical" = "horizontal"
  ) => {
    const step = length / 8;

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
      <div className="w-full max-w-4xl bg-white">
        <svg
          viewBox="0 0 760 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Voltage Divider Circuit Example</title>
          <desc id="desc">
            Black and white voltage divider example showing a 36 volt source,
            three series resistors R1 equal to 6 kilo-ohms, R2 equal to 12
            kilo-ohms, and R3 equal to 18 kilo-ohms, current I equal to 1
            milliampere, and voltage drops of 6 volts, 12 volts, and 18 volts.
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

          <rect width="760" height="560" fill="white" />

          {/* Left source branch */}
          <line
            x1="140"
            y1="120"
            x2="140"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="210"
            x2="170"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="122"
            y1="238"
            x2="158"
            y2="238"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="140"
            y1="238"
            x2="140"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Top wire and R1 */}
          <line
            x1="140"
            y1="120"
            x2="250"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(250, 120, 170, 18, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="420"
            y1="120"
            x2="610"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right branch and R2 */}
          <line
            x1="610"
            y1="120"
            x2="610"
            y2="160"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(610, 160, 180, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="610"
            y1="340"
            x2="610"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Bottom wire and R3 */}
          <line
            x1="610"
            y1="420"
            x2="420"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(250, 420, 170, 18, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1="250"
            y1="420"
            x2="140"
            y2="420"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Labels for source and current */}
          <text x="20" y="245" style={labelStyle}>
            Vₛ = 36V
          </text>
          <text x="104" y="198" style={smallStyle}>
            +
          </text>
          <text x="104" y="250" style={smallStyle}>
            −
          </text>

          <line
            x1="200"
            y1="92"
            x2="285"
            y2="92"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="188" y="73" style={smallStyle}>
            I = 1mA
          </text>

          {/* R1 labels and voltage */}
          <text x="310" y="42" textAnchor="middle" style={labelStyle}>
            R₁
          </text>
          <text x="336" y="88" textAnchor="middle" style={valueStyle}>
            6V
          </text>
          <text x="336" y="148" textAnchor="middle" style={smallStyle}>
            R₁ = 6kΩ
          </text>
          <text x="232" y="104" style={smallStyle}>
            +A
          </text>
          <text x="438" y="104" style={smallStyle}>
            −
          </text>
          <line
            x1="292"
            y1="62"
            x2="388"
            y2="62"
            stroke="black"
            strokeWidth="2.3"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* R2 labels and voltage */}
          <text x="666" y="255" style={labelStyle}>
            R₂
          </text>
          <text x="540" y="255" style={labelStyle}>
            A
          </text>
          <text x="662" y="286" style={valueStyle}>
            12V
          </text>
          <text x="525" y="255" style={smallStyle}>
            +
          </text>
          <text x="525" y="320" style={smallStyle}>
            v
          </text>
          <text x="629" y="160" style={smallStyle}>
            +
          </text>
          <text x="629" y="340" style={smallStyle}>
            −
          </text>
          <text x="530" y="346" style={smallStyle}>
            V
          </text>
          <text x="552" y="346" style={smallStyle}>
            R₂
          </text>
          <text x="545" y="220" style={smallStyle}>
            I
          </text>
          <line
            x1="565"
            y1="205"
            x2="565"
            y2="310"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="545" y="255" style={smallStyle}>
            I
          </text>
          <text x="520" y="240" style={smallStyle}>
            V
          </text>
          <text x="540" y="240" style={smallStyle}>
            R₂
          </text>

          {/* R3 labels and voltage */}
          <text x="332" y="380" textAnchor="middle" style={labelStyle}>
            R₃ = 18kΩ
          </text>
          <text x="332" y="462" textAnchor="middle" style={valueStyle}>
            18V
          </text>
          <text x="226" y="438" style={smallStyle}>
            −
          </text>
          <text x="440" y="438" style={smallStyle}>
            +
          </text>
          <line
            x1="260"
            y1="474"
            x2="404"
            y2="474"
            stroke="black"
            strokeWidth="2.3"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* Small current arrow inside loop near R1/R2 */}
          <line
            x1="420"
            y1="168"
            x2="520"
            y2="168"
            stroke="black"
            strokeWidth="2.3"
            markerEnd="url(#arrow)"
          />
          <text x="466" y="151" style={smallStyle}>
            I
          </text>
        </svg>
      </div>
    </main>
  );
}
