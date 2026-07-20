export default function OhmsLawPieChart() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const center = 350;
  const outerRadius = 250;
  const innerRadius = 90;

  const polarPoint = (angleDeg: number, radius: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    };
  };

  const radialLine = (angleDeg: number) => {
    const inner = polarPoint(angleDeg, innerRadius);
    const outer = polarPoint(angleDeg, outerRadius);

    return (
      <line
        key={angleDeg}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="black"
        strokeWidth="1.8"
      />
    );
  };

  const labelAt = (
    text: string,
    angleDeg: number,
    radius: number,
    size = 26,
    weight = "normal"
  ) => {
    const point = polarPoint(angleDeg, radius);

    return (
      <text
        key={`${text}-${angleDeg}-${radius}`}
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ ...textStyle, fontSize: size, fontWeight: weight }}
      >
        {text}
      </text>
    );
  };

  const outerLabels = [
    { text: "P/V", angle: 315 },
    { text: "√P/R", angle: 345 },
    { text: "V/R", angle: 285 },

    { text: "√P×R", angle: 15 },
    { text: "P/I", angle: 45 },
    { text: "I×R", angle: 75 },

    { text: "V/I", angle: 105 },
    { text: "V²/P", angle: 135 },
    { text: "P/I²", angle: 165 },

    { text: "V×I", angle: 255 },
    { text: "I²×R", angle: 225 },
    { text: "V²/R", angle: 195 },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-3xl bg-white">
        <svg
          viewBox="0 0 700 700"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Ohms Law Pie Chart</title>
          <desc id="desc">
            Black and white Ohms Law pie chart showing formulas for amps,
            volts, ohms, and watts.
          </desc>

          <rect width="700" height="700" fill="white" />

          {/* Formula wheel */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Outer formula dividers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            radialLine
          )}

          {/* Main inner dividers */}
          <line
            x1={center}
            y1={center - innerRadius}
            x2={center}
            y2={center + innerRadius}
            stroke="black"
            strokeWidth={stroke}
          />
          <line
            x1={center - innerRadius}
            y1={center}
            x2={center + innerRadius}
            y2={center}
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Outer formula labels */}
          {outerLabels.map((item) => labelAt(item.text, item.angle, 180, 24))}

          {/* Inner quadrant labels */}
          {labelAt("Amps", 315, 48, 18)}
          {labelAt("I", 315, 70, 34, "bold")}

          {labelAt("Volts", 45, 48, 18)}
          {labelAt("V", 45, 70, 34, "bold")}

          {labelAt("Ohms", 135, 48, 18)}
          {labelAt("R", 135, 70, 34, "bold")}

          {labelAt("Power", 225, 48, 18)}
          {labelAt("P", 225, 70, 34, "bold")}

          {/* Outside meaning labels */}
          <text x="42" y="55" style={{ ...textStyle, fontSize: 24 }}>
            I = Amps
          </text>
          <text x="505" y="55" style={{ ...textStyle, fontSize: 24 }}>
            V = Volts
          </text>
          <text x="42" y="655" style={{ ...textStyle, fontSize: 24 }}>
            P = Watts
          </text>
          <text x="505" y="655" style={{ ...textStyle, fontSize: 24 }}>
            R = Ohms
          </text>
        </svg>
      </div>
    </main>
  );
}
