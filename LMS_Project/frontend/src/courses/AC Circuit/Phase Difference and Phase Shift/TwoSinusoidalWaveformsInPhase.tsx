export default function TwoSinusoidalWaveformsInPhase() {
  const width = 980;
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

  const plotLeft = 110;
  const plotRight = 865;
  const plotTop = 55;
  const plotBottom = 485;
  const axisY = 255;
  const waveWidth = plotRight - plotLeft;

  const vAmp = 135;
  const iAmp = 100;
  const xMax = 2 * Math.PI;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * waveWidth;
  const mapYV = (value: number) => axisY - value * vAmp;
  const mapYI = (value: number) => axisY - value * iAmp;

  const buildPath = (
    ampMapper: (value: number) => number,
    start = 0,
    end = xMax,
    steps = 360
  ) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = ampMapper(Math.sin(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildAreaPath = (
    ampMapper: (value: number) => number,
    start = 0,
    end = xMax,
    steps = 360
  ) => {
    let d = `M ${mapX(start).toFixed(2)} ${axisY.toFixed(2)} `;
    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = ampMapper(Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const voltagePath = buildPath(mapYV);
  const currentPath = buildPath(mapYI);

  const voltageAreaPos = buildAreaPath(mapYV, 0, Math.PI);
  const voltageAreaNeg = buildAreaPath(mapYV, Math.PI, 2 * Math.PI);
  const currentAreaPos = buildAreaPath(mapYI, 0, Math.PI);
  const currentAreaNeg = buildAreaPath(mapYI, Math.PI, 2 * Math.PI);

  const pi2 = Math.PI / 2;
  const pi = Math.PI;
  const threePi2 = (3 * Math.PI) / 2;
  const twoPi = 2 * Math.PI;

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
          <title id="title">Two Sinusoidal Waveforms in Phase</title>
          <desc id="desc">
            A clean textbook-style SVG graph of two in-phase sinusoidal waveforms:
            voltage and current.
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
            x2={plotRight + 42}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Shaded waveform regions */}
          <path d={voltageAreaPos} fill={blueFill} opacity="0.9" />
          <path d={voltageAreaNeg} fill={blueFill} opacity="0.9" />
          <path d={currentAreaPos} fill={brownFill} opacity="0.55" />
          <path d={currentAreaNeg} fill={brownFill} opacity="0.55" />

          {/* Dashed reference lines */}
          <line
            x1={plotLeft}
            y1={mapYV(1)}
            x2={mapX(pi2)}
            y2={mapYV(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYI(1)}
            x2={mapX(pi2)}
            y2={mapYI(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYI(-1)}
            x2={mapX(threePi2)}
            y2={mapYI(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft}
            y1={mapYV(-1)}
            x2={mapX(threePi2)}
            y2={mapYV(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Vertical tick markers */}
          {[pi2, pi, threePi2, twoPi].map((theta) => (
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

          {/* Waveforms */}
          <path
            d={voltagePath}
            fill="none"
            stroke={blue}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={currentPath}
            fill="none"
            stroke={brown}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin point */}
          <circle cx={plotLeft} cy={axisY} r="5.5" fill="white" stroke={dark} strokeWidth="2" />
          <circle cx={plotRight} cy={axisY} r="5.5" fill="white" stroke={dark} strokeWidth="2" />

          {/* Axis labels */}
          <text x={plotLeft - 22} y={axisY + 8} style={smallTextStyle}>0</text>
          <text x={plotRight + 18} y={axisY + 6} style={smallTextStyle}>θ = ωt</text>

          {/* Y labels */}
          <text x={plotLeft - 68} y={mapYV(1) + 8} style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 68} y={mapYI(1) + 8} style={smallTextStyle}>
            +I<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 62} y={mapYI(-1) + 8} style={smallTextStyle}>
            -I<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>
          <text x={plotLeft - 62} y={mapYV(-1) + 8} style={smallTextStyle}>
            -V<tspan baselineShift="sub" fontSize="12">m</tspan>
          </text>

          {/* Angle labels */}
          <text x={mapX(pi2) - 18} y={axisY + 30} style={textStyle}>π</text>
          <text x={mapX(pi2) - 5} y={axisY + 52} style={tinyTextStyle}>2</text>

          <text x={mapX(pi) - 8} y={axisY + 30} style={smallTextStyle}>π</text>

          <text x={mapX(threePi2) - 18} y={axisY - 18} style={textStyle}>3π</text>
          <text x={mapX(threePi2) - 2} y={axisY - 40} style={tinyTextStyle}>2</text>

          <text x={mapX(twoPi) - 14} y={axisY - 16} style={smallTextStyle}>2π</text>

          {/* Curve callouts */}
          <text x={305} y={68} style={smallTextStyle}>
            Voltage, (V)
          </text>
          <line
            x1={360}
            y1={74}
            x2={mapX(0.9)}
            y2={mapYV(Math.sin(0.9))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x={470} y={102} style={smallTextStyle}>
            Current, (I)
          </text>
          <line
            x1={535}
            y1={108}
            x2={mapX(1.25)}
            y2={mapYI(Math.sin(1.25))}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Caption */}
          <text x={265} y={528} style={textStyle}>
            Two Sinusoidal Waveforms – “in-phase”
          </text>
        </svg>
      </div>
    </main>
  );
}
