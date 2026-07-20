export default function CapacitiveVoltageDivider() {
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
    fontSize: 18,
  };

  const capacitor = (
    x: number,
    y: number,
    plateHeight = 34,
    gap = 18,
    lead = 34,
    direction: "horizontal" | "vertical" = "horizontal"
  ) => {
    if (direction === "horizontal") {
      return (
        <g>
          <line
            x1={x}
            y1={y}
            x2={x + lead}
            y2={y}
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1={x + lead}
            y1={y - plateHeight / 2}
            x2={x + lead}
            y2={y + plateHeight / 2}
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1={x + lead + gap}
            y1={y - plateHeight / 2}
            x2={x + lead + gap}
            y2={y + plateHeight / 2}
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1={x + lead + gap}
            y1={y}
            x2={x + lead + gap + lead}
            y2={y}
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </g>
      );
    }

    return (
      <g>
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y + lead}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x - plateHeight / 2}
          y1={y + lead}
          x2={x + plateHeight / 2}
          y2={y + lead}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x - plateHeight / 2}
          y1={y + lead + gap}
          x2={x + plateHeight / 2}
          y2={y + lead + gap}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <line
          x1={x}
          y1={y + lead + gap}
          x2={x}
          y2={y + lead + gap + lead}
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </g>
    );
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
          <title id="title">Capacitive Voltage Divider</title>
          <desc id="desc">
            Black and white capacitive voltage divider circuit using ANSI
            capacitor symbols. An AC source on the left feeds two series
            capacitors C1 and C2, with the midpoint used as Vout. Voltage
            labels VC1 and VC2 are shown on the right.
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
            x1="120"
            y1="90"
            x2="120"
            y2="150"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle
            cx="120"
            cy="240"
            r="54"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <path
            d="M 86 240 C 98 212, 110 212, 120 240 C 130 268, 142 268, 154 240"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="120"
            y1="294"
            x2="120"
            y2="470"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Source labels */}
          <text x="18" y="218" style={smallStyle}>
            100V
          </text>
          <text x="18" y="244" style={smallStyle}>
            50Hz
          </text>
          <text x="35" y="280" style={labelStyle}>
            Vₛ
          </text>

          {/* Top and bottom rails */}
          <line
            x1="120"
            y1="90"
            x2="610"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="120"
            y1="470"
            x2="610"
            y2="470"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrow on top rail */}
          <line
            x1="300"
            y1="62"
            x2="420"
            y2="62"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="345" y="42" style={smallStyle}>
            Iᶜ
          </text>

          {/* Top and bottom connection nodes */}
          <circle cx="460" cy="90" r="5" fill="black" />
          <circle cx="460" cy="470" r="5" fill="black" />

          {/* Midpoint node and Vout line */}
          <circle cx="460" cy="280" r="5" fill="black" />
          <line
            x1="460"
            y1="280"
            x2="610"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />
          <text x="620" y="288" style={labelStyle}>
            Vout
          </text>

          {/* Capacitor C1 between top node and midpoint */}
          <g>
            {capacitor(460, 160, 36, 18, 24, "vertical")}
            <line
              x1="460"
              y1="238"
              x2="460"
              y2="280"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <text x="360" y="160" style={labelStyle}>
              C₁
            </text>
            <text x="346" y="192" style={smallStyle}>
              10µF
            </text>
          </g>

          {/* Capacitor C2 between midpoint and bottom node */}
          <g>
            {capacitor(460, 280, 36, 18, 24, "vertical")}
            <line
              x1="460"
              y1="358"
              x2="460"
              y2="470"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <text x="360" y="335" style={labelStyle}>
              C₂
            </text>
            <text x="346" y="367" style={smallStyle}>
              22µF
            </text>
          </g>

          {/* Right-side voltage references */}
          <line
            x1="660"
            y1="260"
            x2="660"
            y2="100"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="674" y="185" style={labelStyle}>
            Vᶜ₁
          </text>

          <line
            x1="660"
            y1="450"
            x2="660"
            y2="300"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="674" y="382" style={labelStyle}>
            Vᶜ₂
          </text>

          {/* Polarity indicators on right side */}
          <text x="646" y="98" style={smallStyle}>
            +
          </text>
          <text x="646" y="282" style={smallStyle}>
            −
          </text>
          <text x="646" y="282" style={smallStyle}>
            +
          </text>
          <text x="646" y="472" style={smallStyle}>
            −
          </text>
        </svg>
      </div>
    </main>
  );
}
