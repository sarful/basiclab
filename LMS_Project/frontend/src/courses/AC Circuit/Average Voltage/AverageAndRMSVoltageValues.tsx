export default function AverageAndRMSVoltageValues() {
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

  const plotLeft = 95;
  const plotRight = 915;
  const axisY = 280;
  const topY = 65;
  const bottomY = 510;
  const amp = 150;

  const xMax = 2 * Math.PI;
  const mapX = (theta: number) => plotLeft + (theta / xMax) * (plotRight - plotLeft);
  const mapY = (value: number) => axisY - value * amp;

  const sine = (theta: number) => Math.sin(theta);

  const buildSinePath = () => {
    let d = "";
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(sine(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildAreaPath = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(sine(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const pi = Math.PI;
  const pi2 = Math.PI / 2;
  const threePi2 = (3 * Math.PI) / 2;
  const twoPi = 2 * Math.PI;

  const rmsY = mapY(0.707);
  const avgY = mapY(0.637);
  const peakY = mapY(1);

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
          <title id="title">Average and RMS Voltage Values of a Sinusoidal Waveform</title>
          <desc id="desc">
            A sinusoidal waveform diagram showing peak voltage, RMS voltage,
            average voltage, one cycle, and a note box with RMS and average
            values.
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

            <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lightBlue} stopOpacity="0.9" />
              <stop offset="50%" stopColor={lightBlue} stopOpacity="0.45" />
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

          <text x="32" y="40" style={textStyle}>
            Voltage
          </text>

          <text x={plotRight + 20} y={axisY + 36} style={smallTextStyle}>
            θ
          </text>

          {/* Wave area and curve */}
          <path d={buildAreaPath()} fill="url(#waveFill)" />

          <path
            d={buildSinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal guide lines */}
          <line
            x1={plotLeft - 55}
            y1={peakY}
            x2={mapX(pi2)}
            y2={peakY}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={plotLeft - 55}
            y1={rmsY}
            x2={mapX(pi2)}
            y2={rmsY}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={plotLeft - 55}
            y1={avgY}
            x2={mapX(pi2)}
            y2={avgY}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Vertical dashed guides */}
          <line
            x1={mapX(pi2)}
            y1={peakY}
            x2={mapX(pi2)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={mapX(threePi2)}
            y1={axisY}
            x2={mapX(threePi2)}
            y2={mapY(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={plotRight}
            y1={axisY}
            x2={plotRight}
            y2={bottomY - 20}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Labels on y-axis */}
          <text x="14" y={peakY + 8} style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="14">p</tspan>
          </text>

          <text x="14" y={rmsY + 8} style={smallTextStyle}>
            70.7%
          </text>

          <text x="14" y={avgY + 8} style={smallTextStyle}>
            63.7%
          </text>

          <text x={plotLeft - 22} y={axisY + 9} style={smallTextStyle}>
            0
          </text>

          {/* Peak label */}
          <text x={mapX(pi2) - 55} y={peakY - 28} style={smallTextStyle}>
            Peak value, (V<tspan baselineShift="sub" fontSize="14">p</tspan>)
          </text>

          <line
            x1={mapX(pi2) + 65}
            y1={peakY - 18}
            x2={mapX(pi2) + 12}
            y2={peakY + 5}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* RMS / Average value box */}
          <rect
            x="520"
            y="120"
            width="330"
            height="115"
            rx="6"
            fill="white"
            stroke={purple}
            strokeWidth="2"
            strokeDasharray="8 6"
          />

          <text x="540" y="168" style={{ ...smallTextStyle, fill: blue }}>
            RMS value = 0.707Vp
          </text>

          <text x="540" y="205" style={{ ...smallTextStyle, fill: blue }}>
            Average value = 0.637Vp
          </text>

          {/* Sine wave callout */}
          <text x="405" y="415" style={smallTextStyle}>
            Sine Wave
          </text>

          <line
            x1="405"
            y1="400"
            x2={mapX(1.08 * pi)}
            y2={mapY(sine(1.08 * pi))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Angle labels */}
          <text x={mapX(pi) - 8} y={axisY - 18} style={smallTextStyle}>
            π
          </text>

          <text x={mapX(twoPi) - 16} y={axisY - 18} style={smallTextStyle}>
            2π
          </text>

          {/* One cycle bracket */}
          <line
            x1={plotLeft}
            y1={bottomY - 18}
            x2={plotRight}
            y2={bottomY - 18}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line
            x1={plotLeft}
            y1={axisY + 18}
            x2={plotLeft}
            y2={bottomY}
            stroke={dark}
            strokeWidth="1.8"
          />

          <line
            x1={plotRight}
            y1={axisY + 18}
            x2={plotRight}
            y2={bottomY}
            stroke={dark}
            strokeWidth="1.8"
          />

          <text x="420" y={bottomY - 38} style={smallTextStyle}>
            1 cycle
          </text>

          {/* Extra dashed line at negative peak */}
          <line
            x1={mapX(threePi2)}
            y1={mapY(-1)}
            x2={plotRight}
            y2={mapY(-1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Clean small labels on lower side */}
          <text x="740" y={mapY(-1) + 30} style={tinyTextStyle}>
            negative half-cycle
          </text>
        </svg>
      </div>
    </main>
  );
}
