export default function BatteryIVCharacteristics() {
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

  const tinyStyle = {
    ...textStyle,
    fontSize: 16,
  };

  const resistor = (x: number, y: number, length = 120, height = 16) => {
    const step = length / 8;

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
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 430"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Battery I-V Characteristics</title>
          <desc id="desc">
            Black and white battery I-V characteristics diagram showing a
            practical battery modeled as an ideal voltage source with internal
            resistance, and the voltage-current output characteristic.
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

          <rect width="1000" height="430" fill="white" />

          {/* ================= Battery equivalent model ================= */}
          <g>
            {/* Dashed battery box */}
            <rect
              x="30"
              y="60"
              width="370"
              height="300"
              fill="white"
              stroke="black"
              strokeWidth="2.5"
              strokeDasharray="9 8"
            />

            {/* Internal top wire and resistor */}
            <line
              x1="120"
              y1="115"
              x2="165"
              y2="115"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <polyline
              points={resistor(165, 115, 140, 16)}
              fill="none"
              stroke="black"
              strokeWidth={stroke}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <line
              x1="305"
              y1="115"
              x2="370"
              y2="115"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <text x="190" y="82" style={smallStyle}>
              Rᵢₙ = 2Ω
            </text>

            {/* Current arrow */}
            <line
              x1="105"
              y1="82"
              x2="190"
              y2="82"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="135" y="65" style={smallStyle}>
              i
            </text>

            {/* Ideal voltage source branch */}
            <line
              x1="120"
              y1="115"
              x2="120"
              y2="175"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <circle
              cx="120"
              cy="225"
              r="48"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="120"
              y1="273"
              x2="120"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            <text
              x="120"
              y="207"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ ...smallStyle, fontWeight: "bold" }}
            >
              +
            </text>

            <text
              x="120"
              y="247"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ ...smallStyle, fontWeight: "bold" }}
            >
              −
            </text>

            <text x="42" y="235" style={labelStyle}>
              Vs
            </text>

            <text x="150" y="235" style={smallStyle}>
              Vₛ = 150V
            </text>

            <text x="145" y="330" style={smallStyle}>
              Battery
            </text>

            {/* Bottom internal wire */}
            <line
              x1="120"
              y1="315"
              x2="370"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {/* Output terminals */}
            <circle
              cx="370"
              cy="115"
              r="5"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />

            <circle
              cx="370"
              cy="315"
              r="5"
              fill="white"
              stroke="black"
              strokeWidth={stroke}
            />

            <text x="392" y="118" style={smallStyle}>
              +
            </text>

            <text x="394" y="320" style={smallStyle}>
              −
            </text>

            <text x="390" y="220" style={labelStyle}>
              Vout
            </text>

            {/* Output voltage direction arrow */}
            <line
              x1="430"
              y1="135"
              x2="430"
              y2="295"
              stroke="black"
              strokeWidth="2.3"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
            />
          </g>

          {/* ================= I-V graph ================= */}
          <g>
            {/* Axes */}
            <line
              x1="520"
              y1="360"
              x2="950"
              y2="360"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <line
              x1="540"
              y1="380"
              x2="540"
              y2="40"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <text x="510" y="52" style={labelStyle}>
              Vₛ
            </text>

            <text x="920" y="392" style={smallStyle}>
              i(A)
            </text>

            <text x="515" y="382" style={smallStyle}>
              0
            </text>

            {/* Y-axis ticks and labels */}
            {[25, 50, 75, 100, 125, 150].map((value) => {
              const y = 360 - value * 2;
              return (
                <g key={value}>
                  <line
                    x1="528"
                    y1={y}
                    x2="540"
                    y2={y}
                    stroke="black"
                    strokeWidth="1.8"
                  />
                  <text x="480" y={y + 6} style={tinyStyle}>
                    {value}
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks and labels */}
            {[10, 20, 30, 40, 50, 60, 70].map((value) => {
              const x = 540 + value * 5.2;
              return (
                <g key={value}>
                  <line
                    x1={x}
                    y1="360"
                    x2={x}
                    y2="348"
                    stroke="black"
                    strokeWidth="1.8"
                  />
                  <text x={x - 10} y="386" style={tinyStyle}>
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Grid guide lines */}
            <line
              x1="540"
              y1="110"
              x2="800"
              y2="110"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="7 7"
            />
            <line
              x1="540"
              y1="160"
              x2="690"
              y2="160"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="7 7"
            />
            <line
              x1="644"
              y1="360"
              x2="644"
              y2="260"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="7 7"
            />
            <line
              x1="696"
              y1="360"
              x2="696"
              y2="160"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="7 7"
            />

            {/* Ideal voltage line */}
            <line
              x1="540"
              y1="60"
              x2="920"
              y2="60"
              stroke="black"
              strokeWidth={stroke}
            />

            <text x="760" y="72" style={smallStyle}>
              Ideal Voltage
            </text>

            {/* Practical battery output line */}
            <line
              x1="540"
              y1="60"
              x2="910"
              y2="360"
              stroke="black"
              strokeWidth={stroke}
            />

            <text x="720" y="220" style={smallStyle}>
              Slope = −Rᵢₙ
            </text>

            <text x="720" y="295" style={labelStyle}>
              Vout
            </text>

            {/* Axis labels and endpoint mark */}
            <text x="548" y="88" style={smallStyle}>
              Vₛ
            </text>

            <text x="885" y="340" style={smallStyle}>
              75
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
