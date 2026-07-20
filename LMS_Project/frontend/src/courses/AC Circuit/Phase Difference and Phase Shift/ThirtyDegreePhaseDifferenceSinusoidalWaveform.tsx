export default function ThirtyDegreePhaseDifferenceSinusoidalWaveform() {
  const width = 1020;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const blueFill = "#dce8f6";
  const brown = "#8b3f36";
  const brownFill = "#e9c9c2";
  const gray = "#8a8a8a";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 15,
    fill: dark,
  };

  const plotLeft = 105;
  const plotTop = 55;
  const plotBottom = 485;
  const axisY = 255;

  const xMaxVoltage = 2 * Math.PI;
  const phi = Math.PI / 6; // 30 degrees
  const xMaxAxis = xMaxVoltage + phi;

  const plotRight = 920;
  const axisWidth = plotRight - plotLeft;

  const vAmp = 135;
  const iAmp = 98;

  const mapX = (theta: number) => plotLeft + (theta / xMaxAxis) * axisWidth;
  const mapYV = (value: number) => axisY - value * vAmp;
  const mapYI = (value: number) => axisY - value * iAmp;

  const buildPath = (
    fn: (theta: number) => number,
    mapY: (value: number) => number,
    start: number,
    end: number,
    steps = 420
  ) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapY(fn(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildAreaPath = (
    fn: (theta: number) => number,
    mapY: (value: number) => number,
    start: number,
    end: number,
    steps = 300
  ) => {
    let d = `M ${mapX(start).toFixed(2)} ${axisY.toFixed(2)} `;
    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapY(fn(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const vPath = buildPath((t) => Math.sin(t), mapYV, 0, xMaxVoltage);
  const iPath = buildPath((t) => Math.sin(t - phi), mapYI, 0, xMaxVoltage + phi);

  const vAreaPos = buildAreaPath((t) => Math.sin(t), mapYV, 0, Math.PI);
  const vAreaNeg = buildAreaPath((t) => Math.sin(t), mapYV, Math.PI, 2 * Math.PI);

  const iAreaPos = buildAreaPath((t) => Math.sin(t - phi), mapYI, phi, Math.PI + phi);
  const iAreaNeg = buildAreaPath((t) => Math.sin(t - phi), mapYI, Math.PI + phi, 2 * Math.PI + phi);

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
          <title id="title">30 Degree Phase Difference of a Sinusoidal Waveform</title>
          <desc id="desc">
            Textbook style graph showing two sinusoidal waveforms with a 30 degree phase difference.
            The voltage waveform leads and the current waveform lags by 30 degrees.
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
            x2={plotRight + 40}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Shaded waveform regions */}
          <path d={vAreaPos} fill={blueFill} opacity="0.92" />
          <path d={vAreaNeg} fill={blueFill} opacity="0.92" />
          <path d={iAreaPos} fill={brownFill} opacity="0.55" />
          <path d={iAreaNeg} fill={brownFill} opacity="0.55" />

          {/* Reference dashed lines */}
          <line
            x1={plotLeft}
            y1={mapYV(1)}
            x2={mapX(Math.PI / 2)}
            y2={mapYV(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYI(1)}
            x2={mapX(Math.PI / 2 + phi)}
            y2={mapYI(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYI(-1)}
            x2={mapX((3 * Math.PI) / 2 + phi)}
            y2={mapYI(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYV(-1)}
            x2={mapX((3 * Math.PI) / 2)}
            y2={mapYV(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Waveforms */}
          <path
            d={vPath}
            fill="none"
            stroke={blue}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={iPath}
            fill="none"
            stroke={brown}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin and end markers */}
          <circle cx={plotLeft} cy={axisY} r="5.5" fill="white" stroke={dark} strokeWidth="2" />
          <circle
            cx={mapX(0)}
            cy={mapYI(Math.sin(-phi))}
            r="5.5"
            fill="#9b9b9b"
            stroke={dark}
            strokeWidth="1.5"
          />
          <circle
            cx={mapX(2 * Math.PI + phi)}
            cy={axisY}
            r="5.5"
            fill="#9b9b9b"
            stroke={dark}
            strokeWidth="1.5"
          />

          {/* Tick marks */}
          {[Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI, 2 * Math.PI + phi].map((theta) => (
            <line
              key={theta}
              x1={mapX(theta)}
              y1={axisY - 8}
              x2={mapX(theta)}
              y2={axisY + 8}
              stroke={dark}
              strokeWidth="2"
            />
          ))}

          {/* Labels */}
          <text x={plotLeft - 22} y={axisY + 8} style={smallTextStyle}>0</text>
          <text x={plotRight + 14} y={axisY + 6} style={smallTextStyle}>θ = ωt</text>

          <text x={plotLeft - 72} y={mapYV(1) + 8} style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 68} y={mapYI(1) + 8} style={smallTextStyle}>
            +I<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 62} y={mapYI(-1) + 8} style={smallTextStyle}>
            -I<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 66} y={mapYV(-1) + 8} style={smallTextStyle}>
            -V<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>

          {/* Angle labels */}
          <text x={mapX(Math.PI / 2) - 18} y={axisY + 28} style={textStyle}>π</text>
          <text x={mapX(Math.PI / 2) - 4} y={axisY + 48} style={tinyTextStyle}>2</text>

          <text x={mapX(Math.PI) - 8} y={axisY + 28} style={smallTextStyle}>π</text>

          <text x={mapX((3 * Math.PI) / 2) - 18} y={axisY - 14} style={textStyle}>3π</text>
          <text x={mapX((3 * Math.PI) / 2) - 4} y={axisY - 34} style={tinyTextStyle}>2</text>

          <text x={mapX(2 * Math.PI) - 12} y={axisY - 14} style={smallTextStyle}>2π</text>

          <text x={mapX(2 * Math.PI + phi) - 22} y={axisY - 32} style={tinyTextStyle}>2π+ϕ</text>

          {/* Phase difference arrow near origin */}
          <line
            x1={mapX(0)}
            y1={axisY + 60}
            x2={mapX(phi)}
            y2={axisY + 60}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x={mapX(phi) / 2 + plotLeft / 2 - 15} y={axisY + 49} style={smallTextStyle}>
            ϕ = 30°
          </text>

          {/* Callouts */}
          <text x={330} y={70} style={smallTextStyle}>Voltage, (V)</text>
          <line
            x1={395}
            y1={76}
            x2={mapX(0.92)}
            y2={mapYV(Math.sin(0.92))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x={470} y={110} style={smallTextStyle}>Current, (I)</text>
          <line
            x1={535}
            y1={116}
            x2={mapX(1.35)}
            y2={mapYI(Math.sin(1.35 - phi))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Caption */}
          <text x={210} y={525} style={textStyle}>
            30° Phase Difference of a Sinusoidal Waveform
          </text>
        </svg>
      </div>
    </main>
  );
}
