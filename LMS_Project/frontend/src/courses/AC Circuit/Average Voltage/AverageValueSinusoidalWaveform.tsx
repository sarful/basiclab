export default function AverageValueSinusoidalWaveform() {
  const width = 1000;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const lightBlue = "#dce8f6";
  const purple = "#8b65ad";
  const gray = "#777777";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: dark,
  };

  const plotLeft = 90;
  const plotRight = 920;
  const axisY = 270;
  const topY = 65;
  const bottomY = 500;
  const amp = 150;
  const avgRatio = 0.637;

  const xMax = 2 * Math.PI;
  const mapX = (theta: number) => plotLeft + (theta / xMax) * (plotRight - plotLeft);
  const mapY = (value: number) => axisY - value * amp;

  const buildSinePath = () => {
    let d = "";
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildAreaPath = (start: number, end: number) => {
    let d = `M ${mapX(start).toFixed(2)} ${axisY.toFixed(2)} `;
    const steps = 180;

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const pi = Math.PI;
  const twoPi = 2 * Math.PI;
  const pi2 = Math.PI / 2;
  const threePi2 = (3 * Math.PI) / 2;

  const positiveAvgY = mapY(avgRatio);
  const negativeAvgY = mapY(-avgRatio);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Average Value of a Sinusoidal Waveform</title>
          <desc id="desc">
            Graph showing positive and negative half-cycles of a sinusoidal
            waveform, with positive peak, negative peak, and average values.
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
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>

            <linearGradient id="positiveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lightBlue} stopOpacity="0.9" />
              <stop offset="100%" stopColor={lightBlue} stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="negativeFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lightBlue} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lightBlue} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Axes */}
          <line
            x1={plotLeft}
            y1={bottomY}
            x2={plotLeft}
            y2={topY}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotRight + 45}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <text x="34" y="42" style={textStyle}>
            Amplitude
          </text>

          <text x={plotRight + 20} y={axisY + 36} style={smallTextStyle}>
            θ
          </text>

          {/* Shaded half-cycle waveform areas */}
          <path d={buildAreaPath(0, pi)} fill="url(#positiveFill)" />
          <path d={buildAreaPath(pi, twoPi)} fill="url(#negativeFill)" />

          {/* Average value rectangles */}
          <rect
            x={plotLeft}
            y={positiveAvgY}
            width={mapX(pi) - plotLeft}
            height={axisY - positiveAvgY}
            fill={lightBlue}
            opacity="0.35"
            stroke="none"
          />

          <rect
            x={mapX(pi)}
            y={axisY}
            width={plotRight - mapX(pi)}
            height={negativeAvgY - axisY}
            fill={lightBlue}
            opacity="0.35"
            stroke="none"
          />

          {/* Sine wave */}
          <path
            d={buildSinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dashed average and peak guide lines */}
          <line
            x1={plotLeft - 45}
            y1={mapY(1)}
            x2={mapX(pi2)}
            y2={mapY(1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={plotLeft - 45}
            y1={positiveAvgY}
            x2={mapX(pi)}
            y2={positiveAvgY}
            stroke={purple}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={mapX(pi)}
            y1={negativeAvgY}
            x2={plotRight}
            y2={negativeAvgY}
            stroke={purple}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={mapX(threePi2)}
            y1={mapY(-1)}
            x2={plotRight}
            y2={mapY(-1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Vertical dashed peak lines */}
          <line
            x1={mapX(threePi2)}
            y1={axisY}
            x2={mapX(threePi2)}
            y2={mapY(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Corrected vertical peak guide overlay */}
          <line
            x1={mapX(pi2)}
            y1={axisY}
            x2={mapX(pi2)}
            y2={mapY(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Ordinate arrows inside waveform */}
          {Array.from({ length: 10 }, (_, index) => {
            const theta = ((index + 1) * pi) / 11;
            const x = mapX(theta);
            const y = mapY(Math.sin(theta));

            return (
              <line
                key={`pos-${index}`}
                x1={x}
                y1={axisY}
                x2={x}
                y2={y}
                stroke={dark}
                strokeWidth="1.8"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {Array.from({ length: 10 }, (_, index) => {
            const theta = pi + ((index + 1) * pi) / 11;
            const x = mapX(theta);
            const y = mapY(Math.sin(theta));

            return (
              <line
                key={`neg-${index}`}
                x1={x}
                y1={axisY}
                x2={x}
                y2={y}
                stroke={dark}
                strokeWidth="1.8"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Labels */}
          <text x={mapX(pi2) - 60} y={mapY(1) - 30} style={smallTextStyle}>
            Positive Peak, (+V<tspan baselineShift="sub" fontSize="14">p</tspan>)
          </text>

          <text x={mapX(threePi2) - 145} y={mapY(-1) + 82} style={smallTextStyle}>
            Negative Peak, (−V<tspan baselineShift="sub" fontSize="14">p</tspan>)
          </text>

          <text x={mapX(pi) + 25} y={positiveAvgY - 20} style={smallTextStyle}>
            Positive Average Value
          </text>

          <text x={mapX(pi) + 25} y={positiveAvgY + 8} style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="14">AV</tspan> = 0.637(+V
            <tspan baselineShift="sub" fontSize="14">p</tspan>)
          </text>

          <text x={mapX(pi) - 230} y={negativeAvgY - 22} style={smallTextStyle}>
            Negative Average Value
          </text>

          <text x={mapX(pi) - 230} y={negativeAvgY + 8} style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="14">AV</tspan> = 0.637(−V
            <tspan baselineShift="sub" fontSize="14">p</tspan>)
          </text>

          <text x={mapX(pi) + 210} y={axisY - 55} style={smallTextStyle}>
            Sine Wave
          </text>

          <line
            x1={mapX(pi) + 200}
            y1={axisY - 45}
            x2={mapX(1.28 * pi)}
            y2={mapY(Math.sin(1.28 * pi))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Axis labels and key angle labels */}
          <text x={plotLeft - 18} y={axisY + 10} style={smallTextStyle}>
            0
          </text>

          <text x={mapX(pi) - 8} y={axisY + 34} style={smallTextStyle}>
            π
          </text>

          <text x={mapX(twoPi) - 12} y={axisY + 34} style={smallTextStyle}>
            2π
          </text>

          <text x={plotLeft - 45} y={mapY(1) + 8} style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="14">p</tspan>
          </text>

          <text x={plotLeft - 45} y={mapY(-1) + 8} style={smallTextStyle}>
            −V<tspan baselineShift="sub" fontSize="14">p</tspan>
          </text>

          <text x={plotLeft - 72} y={positiveAvgY + 8} style={smallTextStyle}>
            0.637V<tspan baselineShift="sub" fontSize="14">p</tspan>
          </text>

          <text x={plotLeft - 84} y={negativeAvgY + 8} style={smallTextStyle}>
            −0.637V<tspan baselineShift="sub" fontSize="14">p</tspan>
          </text>

          {/* Positive and negative region outlines */}
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotLeft}
            y2={mapY(1)}
            stroke={dark}
            strokeWidth="2"
          />
          <line
            x1={mapX(pi)}
            y1={axisY}
            x2={mapX(pi)}
            y2={mapY(0)}
            stroke={dark}
            strokeWidth="2"
          />
          <line
            x1={plotRight}
            y1={axisY}
            x2={plotRight}
            y2={mapY(0)}
            stroke={dark}
            strokeWidth="2"
          />

          {/* Bottom baseline arrow */}
          <line
            x1={plotLeft}
            y1={bottomY - 20}
            x2={plotRight - 5}
            y2={bottomY - 20}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x="240" y={bottomY - 38} style={tinyTextStyle}>
            One complete cycle of a sinusoidal waveform
          </text>
        </svg>
      </div>
    </main>
  );
}
