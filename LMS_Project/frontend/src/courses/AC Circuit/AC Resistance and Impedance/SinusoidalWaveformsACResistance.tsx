export default function SinusoidalWaveformsACResistance() {
  const width = 1000;
  const height = 640;

  const dark = "#222222";
  const blue = "#2f67b2";
  const purple = "#7a35ad";
  const fillBlue = "#dce8f6";
  const fillPurple = "#d9c7e8";
  const gray = "#8a8a8a";

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

  const plotLeft = 82;
  const plotRight = 835;
  const axisY = 300;
  const plotTop = 55;
  const plotBottom = 545;
  const plotWidth = plotRight - plotLeft;

  const xMax = 2 * Math.PI;
  const voltageAmp = 210;
  const currentAmp = 130;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * plotWidth;
  const mapYVoltage = (value: number) => axisY - value * voltageAmp;
  const mapYCurrent = (value: number) => axisY - value * currentAmp;

  const buildWavePath = (
    mapper: (value: number) => number,
    start = 0,
    end = xMax,
    steps = 420
  ) => {
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapper(Math.sin(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildAreaPath = (
    mapper: (value: number) => number,
    start = 0,
    end = xMax,
    steps = 420
  ) => {
    let d = `M ${mapX(start).toFixed(2)} ${axisY.toFixed(2)} `;

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapper(Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const voltagePath = buildWavePath(mapYVoltage);
  const currentPath = buildWavePath(mapYCurrent);

  const voltageAreaPositive = buildAreaPath(mapYVoltage, 0, Math.PI);
  const voltageAreaNegative = buildAreaPath(mapYVoltage, Math.PI, 2 * Math.PI);
  const currentAreaPositive = buildAreaPath(mapYCurrent, 0, Math.PI);
  const currentAreaNegative = buildAreaPath(mapYCurrent, Math.PI, 2 * Math.PI);

  const pi2 = Math.PI / 2;
  const pi = Math.PI;
  const threePi2 = (3 * Math.PI) / 2;
  const twoPi = 2 * Math.PI;

  const ticks = [
    { theta: pi2, topLabel: "π", bottomLabel: "2", yOffset: 42 },
    { theta: pi, topLabel: "π", bottomLabel: "", yOffset: -18 },
    { theta: threePi2, topLabel: "3π", bottomLabel: "2", yOffset: -18 },
    { theta: twoPi, topLabel: "2π", bottomLabel: "", yOffset: -18 },
  ];

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
          <title id="title">Sinusoidal Waveforms for AC Resistance</title>
          <desc id="desc">
            Sinusoidal voltage and current waveforms for a pure AC resistance.
            The voltage and current are in phase, with voltage shown larger than
            current.
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

            <linearGradient id="blueArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={fillBlue} stopOpacity="0.9" />
              <stop offset="50%" stopColor={fillBlue} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fillBlue} stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="purpleArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={fillPurple} stopOpacity="0.7" />
              <stop offset="50%" stopColor={fillPurple} stopOpacity="0.35" />
              <stop offset="100%" stopColor={fillPurple} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Axes */}
          <line
            x1={plotLeft}
            y1={plotBottom}
            x2={plotLeft}
            y2={plotTop}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotRight + 42}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Shaded waveform areas */}
          <path d={voltageAreaPositive} fill="url(#blueArea)" />
          <path d={voltageAreaNegative} fill="url(#blueArea)" />
          <path d={currentAreaPositive} fill="url(#purpleArea)" />
          <path d={currentAreaNegative} fill="url(#purpleArea)" />

          {/* Horizontal reference guides */}
          <line
            x1={plotLeft}
            y1={mapYVoltage(1)}
            x2={mapX(pi2)}
            y2={mapYVoltage(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYCurrent(1)}
            x2={mapX(pi2)}
            y2={mapYCurrent(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYCurrent(-1)}
            x2={mapX(threePi2)}
            y2={mapYCurrent(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYVoltage(-1)}
            x2={mapX(threePi2)}
            y2={mapYVoltage(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Vertical guide at the final cycle end */}
          <line
            x1={plotRight}
            y1={axisY}
            x2={plotRight}
            y2={plotBottom - 15}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Waveform curves */}
          <path
            d={voltagePath}
            fill="none"
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={currentPath}
            fill="none"
            stroke={purple}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin */}
          <text x={plotLeft - 28} y={axisY + 8} style={textStyle}>
            0
          </text>

          {/* Y-axis labels */}
          <text x={plotLeft - 70} y={mapYVoltage(1) + 8} style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">R</tspan>
          </text>
          <text x={plotLeft - 66} y={mapYCurrent(1) + 8} style={textStyle}>
            I<tspan baselineShift="sub" fontSize="17">R</tspan>
          </text>

          {/* X-axis labels */}
          {ticks.map((tick) => {
            const x = mapX(tick.theta);

            return (
              <g key={tick.theta}>
                <line
                  x1={x}
                  y1={axisY - 8}
                  x2={x}
                  y2={axisY + 8}
                  stroke={dark}
                  strokeWidth="2"
                />
                <text
                  x={x - (tick.topLabel.length > 1 ? 18 : 8)}
                  y={axisY + tick.yOffset}
                  style={textStyle}
                >
                  {tick.topLabel}
                </text>
                {tick.bottomLabel && (
                  <text
                    x={x - 5}
                    y={axisY + tick.yOffset + 26}
                    style={tinyTextStyle}
                  >
                    {tick.bottomLabel}
                  </text>
                )}
              </g>
            );
          })}

          <text x={plotRight + 25} y={axisY + 38} style={textStyle}>
            θ(ωt)
          </text>

          {/* Equation labels */}
          <rect
            x="505"
            y="22"
            width="360"
            height="60"
            fill="white"
            stroke={blue}
            strokeWidth="2"
          />
          <text x="525" y="60" style={{ ...textStyle, fill: blue }}>
            V<tspan baselineShift="sub" fontSize="17">R(t)</tspan>
            <tspan> = R.I</tspan>
            <tspan baselineShift="sub" fontSize="17">m</tspan>
            <tspan>sin(ωt)</tspan>
          </text>

          <rect
            x="505"
            y="112"
            width="360"
            height="60"
            fill="white"
            stroke={purple}
            strokeWidth="2"
          />
          <text x="555" y="150" style={{ ...textStyle, fill: purple }}>
            I<tspan baselineShift="sub" fontSize="17">R(t)</tspan>
            <tspan> = I</tspan>
            <tspan baselineShift="sub" fontSize="17">m</tspan>
            <tspan>sin(ωt)</tspan>
          </text>

          {/* Callout arrows */}
          <line
            x1="510"
            y1="74"
            x2={mapX(0.55 * Math.PI)}
            y2={mapYVoltage(Math.sin(0.55 * Math.PI))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="510"
            y1="160"
            x2={mapX(0.62 * Math.PI)}
            y2={mapYCurrent(Math.sin(0.62 * Math.PI))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Period bracket */}
          <line
            x1={plotLeft + 8}
            y1={plotBottom - 10}
            x2={plotRight - 8}
            y2={plotBottom - 10}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotLeft}
            y2={plotBottom + 5}
            stroke={dark}
            strokeWidth="2"
          />
          <line
            x1={plotRight}
            y1={axisY}
            x2={plotRight}
            y2={plotBottom + 5}
            stroke={dark}
            strokeWidth="2"
          />

          <text x={plotLeft + 340} y={plotBottom + 42} style={textStyle}>
            T =
          </text>
          <text x={plotLeft + 405} y={plotBottom + 30} style={textStyle}>
            1
          </text>
          <line
            x1={plotLeft + 398}
            y1={plotBottom + 37}
            x2={plotLeft + 430}
            y2={plotBottom + 37}
            stroke={dark}
            strokeWidth="2"
          />
          <text x={plotLeft + 407} y={plotBottom + 62} style={textStyle}>
            f
          </text>

          <text x={plotLeft + 220} y="605" style={smallTextStyle}>
            Sinusoidal waveforms for a pure AC resistance: voltage and current are in phase.
          </text>
        </svg>
      </div>
    </main>
  );
}
