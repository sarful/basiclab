export default function PhaseRelationshipSinusoidalWaveform() {
  const width = 1200;
  const height = 460;

  const dark = "#222222";
  const blue = "#2f67b2";
  const fillBlue = "#dce8f6";
  const goldBox = "#fff7df";
  const goldStroke = "#caa95a";
  const gray = "#8a8a8a";

  const stroke = 2.8;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 14,
    fill: dark,
  };

  const chartW = 315;
  const chartH = 235;
  const marginTop = 62;
  const lefts = [45, 440, 835];
  const axisY = 165;
  const amp = 86;

  const mapX = (left: number, theta: number) =>
    left + (theta / (2 * Math.PI)) * chartW;

  const mapY = (value: number) => axisY - value * amp;

  const buildWavePath = (
    left: number,
    phaseShift: number,
    start = 0,
    end = 2 * Math.PI,
    steps = 280
  ) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = start + ((end - start) * i) / steps;
      const x = mapX(left, t);
      const y = mapY(Math.sin(t + phaseShift));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildAreaPath = (
    left: number,
    phaseShift: number,
    start = 0,
    end = 2 * Math.PI,
    steps = 280
  ) => {
    let d = `M ${mapX(left, start).toFixed(2)} ${axisY.toFixed(2)} `;
    for (let i = 0; i <= steps; i++) {
      const t = start + ((end - start) * i) / steps;
      const x = mapX(left, t);
      const y = mapY(Math.sin(t + phaseShift));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${mapX(left, end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const titles = [
    "In phase (ϕ = 0°)",
    "Positive Phase (+ϕ)",
    "Negative Phase (+ϕ)",
  ];

  const equations = [
    "A(t) = Aₘ sin(ωt)",
    "A(t) = Aₘ sin(ωt+ϕ)",
    "A(t) = Aₘ sin(ωt-ϕ)",
  ];

  const phases = [0, Math.PI / 5, -Math.PI / 5];

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Phase Relationship of a Sinusoidal Waveform</title>
          <desc id="desc">
            Three sinusoidal waveform plots showing in-phase, positive phase,
            and negative phase relationships with their equations.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {lefts.map((left, idx) => {
            const phase = phases[idx];
            const right = left + chartW;
            const xPi = mapX(left, Math.PI);
            const x2Pi = mapX(left, 2 * Math.PI);
            const xMax = mapX(left, Math.PI / 2 - phase);
            const yMax = mapY(1);

            return (
              <g key={idx}>
                {/* Title */}
                <text x={left + 70} y={28} style={textStyle}>
                  {titles[idx]}
                </text>

                {/* Axes */}
                <line
                  x1={left}
                  y1={marginTop}
                  x2={left}
                  y2={marginTop + chartH}
                  stroke={dark}
                  strokeWidth={stroke}
                  markerEnd="url(#arrow)"
                />
                <line
                  x1={left}
                  y1={axisY}
                  x2={right + 22}
                  y2={axisY}
                  stroke={dark}
                  strokeWidth={stroke}
                  markerEnd="url(#arrow)"
                />

                {/* Shaded wave area */}
                <path
                  d={buildAreaPath(left, phase)}
                  fill={fillBlue}
                  opacity="0.9"
                />

                {/* Sine wave */}
                <path
                  d={buildWavePath(left, phase)}
                  fill="none"
                  stroke={blue}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Amplitude guide */}
                <line
                  x1={xMax}
                  y1={axisY}
                  x2={xMax}
                  y2={yMax}
                  stroke={gray}
                  strokeWidth="1.8"
                  strokeDasharray="8 7"
                />
                <text x={xMax - 10} y={yMax - 12} style={smallTextStyle}>
                  V<tspan baselineShift="sub" fontSize="12">m</tspan>
                </text>

                {/* Axis labels */}
                <text x={left - 18} y={axisY + 7} style={tinyTextStyle}>
                  0
                </text>
                <text x={right + 12} y={axisY + 23} style={smallTextStyle}>
                  t
                </text>
                <text x={right - 8} y={axisY - 14} style={smallTextStyle}>
                  ωt
                </text>

                {/* π label and 2π label */}
                <text x={xPi - 16} y={axisY + 26} style={tinyTextStyle}>
                  180°
                </text>
                <text x={xPi - 10} y={axisY + 45} style={tinyTextStyle}>
                  or π
                </text>

                {idx > 0 && (
                  <>
                    <text x={x2Pi - 45} y={axisY + 26} style={tinyTextStyle}>
                      360° or
                    </text>
                    <text x={x2Pi - 12} y={axisY + 45} style={tinyTextStyle}>
                      2π rad
                    </text>
                  </>
                )}

                {/* Phase annotation */}
                {idx === 0 && (
                  <>
                    <text x={left + 72} y={78} style={smallTextStyle}>
                      v<tspan baselineShift="sub" fontSize="12">m</tspan>
                    </text>
                    <path
                      d={`M ${left + 155} ${112} C ${left + 133} ${102}, ${left + 120} ${96}, ${left + 108} ${84}`}
                      fill="none"
                      stroke={dark}
                      strokeWidth="1.8"
                      markerEnd="url(#arrow)"
                    />
                    <text x={left + 163} y={105} style={smallTextStyle}>
                      (ϕ = 0)
                    </text>
                  </>
                )}

                {idx === 1 && (
                  <>
                    <line
                      x1={left}
                      y1={axisY}
                      x2={mapX(left, Math.PI / 5)}
                      y2={axisY}
                      stroke={dark}
                      strokeWidth="1.8"
                      markerStart="url(#arrow)"
                      markerEnd="url(#arrow)"
                    />
                    <text x={left + 40} y={axisY + 24} style={smallTextStyle}>
                      +ϕ
                    </text>
                    <text x={left + 95} y={axisY + 18} style={smallTextStyle}>
                      t = 0
                    </text>
                    <path
                      d={`M ${left + 160} ${96} C ${left + 185} ${96}, ${left + 202} ${110}, ${left + 214} ${126}`}
                      fill="none"
                      stroke={dark}
                      strokeWidth="1.8"
                      markerEnd="url(#arrow)"
                    />
                    <text x={left + 120} y={93} style={smallTextStyle}>
                      (ωt + ϕ)
                    </text>
                    <text x={left - 24} y={mapY(-Math.sin(Math.PI / 5)) + 6} style={tinyTextStyle}>
                      -A<tspan baselineShift="sub" fontSize="11">m</tspan>sinϕ
                    </text>
                  </>
                )}

                {idx === 2 && (
                  <>
                    <line
                      x1={left}
                      y1={axisY}
                      x2={mapX(left, Math.PI / 5)}
                      y2={axisY}
                      stroke={dark}
                      strokeWidth="1.8"
                      markerStart="url(#arrow)"
                      markerEnd="url(#arrow)"
                    />
                    <text x={left + 40} y={axisY + 24} style={smallTextStyle}>
                      -ϕ
                    </text>
                    <path
                      d={`M ${left + 176} ${104} C ${left + 197} ${102}, ${left + 212} ${112}, ${left + 222} ${128}`}
                      fill="none"
                      stroke={dark}
                      strokeWidth="1.8"
                      markerEnd="url(#arrow)"
                    />
                    <text x={left + 132} y={98} style={smallTextStyle}>
                      (ωt - ϕ)
                    </text>
                    <text x={left - 10} y={mapY(-Math.sin(Math.PI / 5)) - 10} style={tinyTextStyle}>
                      t = 0
                    </text>
                    <text x={left - 24} y={mapY(-Math.sin(Math.PI / 5)) + 12} style={tinyTextStyle}>
                      -A<tspan baselineShift="sub" fontSize="11">m</tspan>sinϕ
                    </text>
                  </>
                )}

                {/* Equation box */}
                <rect
                  x={left + 18}
                  y={360}
                  width={chartW - 36}
                  height={56}
                  fill={goldBox}
                  stroke={goldStroke}
                  strokeWidth="1.8"
                />
                <text x={left + 40} y={395} style={{ ...textStyle, fill: blue }}>
                  {equations[idx]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </main>
  );
}
