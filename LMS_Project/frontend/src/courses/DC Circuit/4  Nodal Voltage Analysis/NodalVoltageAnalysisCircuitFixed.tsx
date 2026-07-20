export default function NodalVoltageAnalysisCircuitFixed() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 26,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 22,
  };

  const valueStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const resistor = (
    x: number,
    y: number,
    length = 120,
    height = 17,
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
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Nodal Voltage Analysis Circuit With Return Wire</title>
          <desc id="desc">
            Black and white nodal voltage analysis circuit with Va, Vb, Vc, D,
            10V and 20V voltage sources, three ANSI zigzag resistors, current
            arrows, and the missing bottom return wire connected.
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

          <rect width="1000" height="560" fill="white" />

          {/* Main top nodes */}
          <circle cx="90" cy="110" r="6" fill="black" />
          <circle cx="500" cy="110" r="6" fill="black" />
          <circle cx="850" cy="110" r="6" fill="black" />
          <circle cx="500" cy="430" r="6" fill="black" />

          {/* Node labels */}
          <text x="42" y="82" style={labelStyle}>
            Va
          </text>
          <text x="455" y="82" style={labelStyle}>
            Vb
          </text>
          <text x="820" y="82" style={labelStyle}>
            Vc
          </text>
          <text x="476" y="470" style={labelStyle}>
            D
          </text>

          {/* Top branch: Va to Vb through 10 ohm */}
          <line
            x1="90"
            y1="110"
            x2="245"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(245, 110, 180, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="425"
            y1="110"
            x2="500"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="315" y="50" style={labelStyle}>
            10 Ω
          </text>

          {/* Top branch: Vb to Vc through 20 ohm */}
          <line
            x1="500"
            y1="110"
            x2="575"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(575, 110, 180, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="755"
            y1="110"
            x2="850"
            y2="110"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="660" y="50" style={labelStyle}>
            20 Ω
          </text>

          {/* Left 10V source */}
          <line
            x1="90"
            y1="110"
            x2="90"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="52"
            y1="185"
            x2="128"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="67"
            y1="215"
            x2="113"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="90"
            y1="215"
            x2="90"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="20" y="170" style={valueStyle}>
            10V
          </text>

          <text x="22" y="275" style={labelStyle}>
            V₁
          </text>

          {/* Right 20V source */}
          <line
            x1="850"
            y1="110"
            x2="850"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="812"
            y1="185"
            x2="888"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="827"
            y1="215"
            x2="873"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="850"
            y1="215"
            x2="850"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="874" y="170" style={valueStyle}>
            20V
          </text>

          <text x="872" y="275" style={labelStyle}>
            V₂
          </text>

          {/* Central branch: Vb to D through 40 ohm */}
          <line
            x1="500"
            y1="110"
            x2="500"
            y2="205"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(500, 205, 170, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1="500"
            y1="375"
            x2="500"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="560" y="295" style={labelStyle}>
            40 Ω
          </text>

          {/* Corrected bottom return wire */}
          <line
            x1="90"
            y1="430"
            x2="500"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="500"
            y1="430"
            x2="850"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrows */}
          <line
            x1="135"
            y1="75"
            x2="205"
            y2="75"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="155" y="52" style={smallStyle}>
            I₁
          </text>

          <line
            x1="815"
            y1="75"
            x2="745"
            y2="75"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="775" y="52" style={smallStyle}>
            I₂
          </text>

          <line
            x1="465"
            y1="350"
            x2="465"
            y2="405"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="420" y="405" style={smallStyle}>
            I₀
          </text>
        </svg>
      </div>
    </main>
  );
}
