export default function FindingRMSValueGraphicalMethod() {
  const width = 900;
  const height = 620;

  const stroke = 3;
  const dark = "#222222";
  const blue = "#2f67b2";
  const lightBlue = "#dce8f6";
  const gray = "#777777";

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

  const plotLeft = 55;
  const plotRight = 760;
  const axisY = 410;
  const peakY = 145;
  const plotWidth = plotRight - plotLeft;
  const amplitude = axisY - peakY;

  const mapX = (theta: number) => plotLeft + (theta / Math.PI) * plotWidth;
  const mapY = (value: number) => axisY - value * amplitude;

  const sineValue = (theta: number) => Math.sin(theta);

  const buildSinePath = () => {
    let d = "";
    const steps = 220;

    for (let i = 0; i <= steps; i++) {
      const theta = (Math.PI * i) / steps;
      const x = mapX(theta);
      const y = mapY(sineValue(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildAreaPath = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 220;

    for (let i = 0; i <= steps; i++) {
      const theta = (Math.PI * i) / steps;
      const x = mapX(theta);
      const y = mapY(sineValue(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const ordinates = Array.from({ length: 12 }, (_, index) => {
    const n = index + 1;
    const theta = (Math.PI * n) / 13;
    return {
      n,
      x: mapX(theta),
      y: mapY(sineValue(theta)),
    };
  });

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
          <title id="title">Finding the RMS Value Using the Graphical Method</title>
          <desc id="desc">
            Graphical method for finding RMS value using equally spaced
            mid-ordinates of a positive half-cycle sinusoidal waveform.
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

            <marker
              id="arrowBlue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={blue} />
            </marker>

            <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lightBlue} stopOpacity="0.85" />
              <stop offset="100%" stopColor={lightBlue} stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Axes */}
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotLeft}
            y2="75"
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <line
            x1={plotLeft}
            y1={axisY}
            x2="840"
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <text x="8" y="74" style={textStyle}>
            Voltage
          </text>

          <text x="812" y="437" style={smallTextStyle}>
            time
          </text>

          {/* Shaded half-cycle area */}
          <path d={buildAreaPath()} fill="url(#waveFill)" />

          {/* Sine curve */}
          <path
            d={buildSinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Equally spaced mid-ordinates */}
          {ordinates.map(({ n, x, y }) => (
            <g key={n}>
              <line
                x1={x}
                y1={axisY}
                x2={x}
                y2={y}
                stroke={dark}
                strokeWidth="2"
                opacity="0.85"
                markerEnd="url(#arrow)"
              />

              <text
                x={x - 15}
                y={y - 16}
                style={tinyTextStyle}
              >
                V<tspan baselineShift="sub" fontSize="12">{n}</tspan>
              </text>
            </g>
          ))}

          {/* Vertical separators at beginning and end of half-cycle */}
          <line
            x1={plotLeft}
            y1="105"
            x2={plotLeft}
            y2={axisY}
            stroke={dark}
            strokeWidth="2"
          />

          <line
            x1={plotRight}
            y1="105"
            x2={plotRight}
            y2={axisY}
            stroke={dark}
            strokeWidth="2"
          />

          {/* Peak label */}
          <line
            x1={mapX(Math.PI / 2)}
            y1={peakY}
            x2={mapX(Math.PI / 2)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <text x={mapX(Math.PI / 2) - 22} y={peakY - 28} style={smallTextStyle}>
            V<tspan baselineShift="sub" fontSize="14">m</tspan>
          </text>

          {/* Equally spaced mid-ordinates callout */}
          <text x="575" y="88" style={smallTextStyle}>
            Equally Spaced
          </text>
          <text x="575" y="114" style={smallTextStyle}>
            Mid-ordinates
          </text>

          <line
            x1="575"
            y1="122"
            x2="500"
            y2="170"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* 180/n interval indicator */}
          <line
            x1={mapX(Math.PI / 4)}
            y1={axisY + 45}
            x2={mapX(Math.PI / 4) + plotWidth / 13}
            y2={axisY + 45}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line
            x1={mapX(Math.PI / 4)}
            y1={axisY}
            x2={mapX(Math.PI / 4)}
            y2={axisY + 65}
            stroke={dark}
            strokeWidth="1.8"
          />

          <line
            x1={mapX(Math.PI / 4) + plotWidth / 13}
            y1={axisY}
            x2={mapX(Math.PI / 4) + plotWidth / 13}
            y2={axisY + 65}
            stroke={dark}
            strokeWidth="1.8"
          />

          <text x={mapX(Math.PI / 4) + 12} y={axisY + 84} style={smallTextStyle}>
            180°/n
          </text>

          {/* Positive half-cycle bracket */}
          <line
            x1={plotLeft}
            y1={axisY + 125}
            x2={plotRight}
            y2={axisY + 125}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line
            x1={plotLeft}
            y1={axisY + 18}
            x2={plotLeft}
            y2={axisY + 140}
            stroke={dark}
            strokeWidth="1.8"
          />

          <line
            x1={plotRight}
            y1={axisY + 18}
            x2={plotRight}
            y2={axisY + 140}
            stroke={dark}
            strokeWidth="1.8"
          />

          <text x="215" y={axisY + 108} style={smallTextStyle}>
            Positive Half Cycle representing 180°
          </text>

          {/* Axis baseline labels */}
          <text x={plotLeft - 16} y={axisY + 26} style={smallTextStyle}>
            0
          </text>

          <text x={plotRight - 8} y={axisY + 26} style={smallTextStyle}>
            π
          </text>

          {/* Small arrow showing positive direction of the waveform area */}
          <line
            x1="170"
            y1="388"
            x2="260"
            y2="388"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Clean bottom guide */}
          <line
            x1={plotLeft}
            y1={axisY + 95}
            x2={plotRight}
            y2={axisY + 95}
            stroke={dark}
            strokeWidth="1.6"
            strokeDasharray="8 8"
            opacity="0.7"
          />
        </svg>
      </div>
    </main>
  );
}
