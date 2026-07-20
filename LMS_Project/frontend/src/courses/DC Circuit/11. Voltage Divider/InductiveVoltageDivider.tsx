export default function InductiveVoltageDivider() {
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

  const verticalInductor = (
    cx: number,
    startY: number,
    turns = 4,
    radius = 16,
    spacing = 24
  ) => {
    const arcs = [];
    for (let i = 0; i < turns; i += 1) {
      const y = startY + i * spacing;
      arcs.push(
        <path
          key={i}
          d={`M ${cx} ${y} C ${cx + radius} ${y}, ${cx + radius} ${y + spacing}, ${cx} ${y + spacing}`}
          fill="none"
          stroke="black"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      );
    }
    return <g>{arcs}</g>;
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
          <title id="title">Inductive Voltage Divider</title>
          <desc id="desc">
            Black and white inductive voltage divider circuit using ANSI-style
            inductor symbols. An AC source on the left feeds two series
            inductors L1 and L2, with the midpoint used as Vout. Voltage labels
            VL1 and VL2 are shown on the right.
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
            36V
          </text>
          <text x="18" y="244" style={smallStyle}>
            20Hz
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
          <text x="344" y="42" style={smallStyle}>
            Iₗ
          </text>

          {/* Top and bottom nodes */}
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

          {/* L1 */}
          <line
            x1="460"
            y1="90"
            x2="460"
            y2="120"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {verticalInductor(460, 120, 4, 18, 24)}
          <line
            x1="460"
            y1="216"
            x2="460"
            y2="280"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="356" y="158" style={labelStyle}>
            L₁
          </text>
          <text x="330" y="190" style={smallStyle}>
            10mH
          </text>

          {/* L2 */}
          <line
            x1="460"
            y1="280"
            x2="460"
            y2="310"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {verticalInductor(460, 310, 4, 18, 24)}
          <line
            x1="460"
            y1="406"
            x2="460"
            y2="470"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="356" y="348" style={labelStyle}>
            L₂
          </text>
          <text x="330" y="380" style={smallStyle}>
            20mH
          </text>

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
            Vₗ₁
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
            Vₗ₂
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
