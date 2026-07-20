export default function WaveformsDueToHarmonics() {
  const width = 1000;
  const height = 820;

  const dark = "#222222";
  const blue = "#2f67b2";
  const red = "#d81e1e";
  const cyan = "#55b6c7";
  const purple = "#7a35ad";
  const gray = "#777777";

  const stroke = 2.6;

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

  const leftX = 55;
  const rightX = 555;
  const chartW = 390;
  const chartH = 135;
  const rowGap = 55;
  const topY = 55;

  const yCenters = [topY + 55, topY + 55 + (chartH + rowGap), topY + 55 + 2 * (chartH + rowGap), topY + 55 + 3 * (chartH + rowGap)];

  const mapX = (x0: number, t: number) => x0 + (t / (2 * Math.PI)) * chartW;

  const buildWavePath = (
    x0: number,
    y0: number,
    fn: (t: number) => number,
    amp = 52,
    steps = 260
  ) => {
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const t = (2 * Math.PI * i) / steps;
      const x = mapX(x0, t);
      const y = y0 - fn(t) * amp;
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const Axis = ({ x, y }: { x: number; y: number }) => (
    <g>
      <line
        x1={x}
        y1={y - chartH / 2}
        x2={x}
        y2={y + chartH / 2}
        stroke={dark}
        strokeWidth={stroke}
      />
      <line
        x1={x}
        y1={y}
        x2={x + chartW + 28}
        y2={y}
        stroke={dark}
        strokeWidth={stroke}
        markerEnd="url(#arrowBlack)"
      />
      <text x={x + chartW + 20} y={y - 10} style={smallTextStyle}>
        θ
      </text>
    </g>
  );

  const RotationArrow = ({ x, y }: { x: number; y: number }) => (
    <g>
      <path
        d={`M ${x} ${y} C ${x + 35} ${y - 35}, ${x + 80} ${y - 25}, ${x + 85} ${y + 35}`}
        fill="none"
        stroke={dark}
        strokeWidth="2"
        markerEnd="url(#arrowBlack)"
      />
      <text x={x + 85} y={y + 18} style={smallTextStyle}>
        ω
      </text>
    </g>
  );

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
          <title id="title">Waveforms Due To Harmonics</title>
          <desc id="desc">
            Educational waveform diagram showing fundamental and harmonic
            sinusoidal waveforms on the left, and complex waveforms produced by
            combining harmonics on the right.
          </desc>

          <defs>
            <marker
              id="arrowBlack"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* ================= Left column: harmonic components ================= */}
          <g>
            {/* Fundamental */}
            <Axis x={leftX} y={yCenters[0]} />
            <path
              d={buildWavePath(leftX, yCenters[0], (t) => Math.sin(t), 55)}
              fill="none"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={leftX + 235} y={yCenters[0] - 82} style={smallTextStyle}>
              Fundamental
            </text>
            <text x={leftX + 235} y={yCenters[0] - 58} style={smallTextStyle}>
              1st Harmonic
            </text>
            <text x={leftX + chartW + 3} y={yCenters[0] + 48} style={tinyTextStyle}>
              π
            </text>

            {/* Second harmonic */}
            <Axis x={leftX} y={yCenters[1]} />
            <path
              d={buildWavePath(leftX, yCenters[1], (t) => Math.sin(2 * t), 55)}
              fill="none"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={leftX + 235} y={yCenters[1] - 73} style={smallTextStyle}>
              2nd Harmonic
            </text>
            <text x={leftX + chartW - 6} y={yCenters[1] + 48} style={tinyTextStyle}>
              2π
            </text>

            {/* Third harmonic */}
            <Axis x={leftX} y={yCenters[2]} />
            <path
              d={buildWavePath(leftX, yCenters[2], (t) => Math.sin(3 * t), 55)}
              fill="none"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={leftX + 235} y={yCenters[2] - 73} style={smallTextStyle}>
              3rd Harmonic
            </text>
            <text x={leftX + chartW - 6} y={yCenters[2] + 48} style={tinyTextStyle}>
              3π
            </text>

            {/* Fourth harmonic */}
            <Axis x={leftX} y={yCenters[3]} />
            <path
              d={buildWavePath(leftX, yCenters[3], (t) => Math.sin(4 * t), 55)}
              fill="none"
              stroke={blue}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={leftX + 235} y={yCenters[3] - 73} style={smallTextStyle}>
              4th Harmonic
            </text>
            <text x={leftX + chartW - 6} y={yCenters[3] + 48} style={tinyTextStyle}>
              4π
            </text>

            <text x={leftX + 95} y="790" style={textStyle}>
              Harmonic Waveforms
            </text>
          </g>

          {/* ================= Right column: complex waveforms ================= */}
          <g>
            {/* Row 1: output waveform */}
            <Axis x={rightX} y={yCenters[0]} />
            <path
              d={buildWavePath(rightX, yCenters[0], (t) => Math.sin(t), 55)}
              fill="none"
              stroke={red}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={rightX + 260} y={yCenters[0] + 72} style={smallTextStyle}>
              Output
            </text>
            <text x={rightX + 260} y={yCenters[0] + 96} style={smallTextStyle}>
              Waveform
            </text>

            {/* Row 2: fundamental + 2nd harmonic */}
            <Axis x={rightX} y={yCenters[1]} />
            <path
              d={buildWavePath(rightX, yCenters[1], (t) => Math.sin(t), 45)}
              fill="none"
              stroke={purple}
              strokeWidth="3"
              strokeDasharray="14 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[1], (t) => Math.sin(2 * t), 47)}
              fill="none"
              stroke={cyan}
              strokeWidth="3"
              strokeDasharray="12 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[1], (t) => 0.7 * Math.sin(t) + 0.42 * Math.sin(2 * t), 55)}
              fill="none"
              stroke={red}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text x={rightX + 205} y={yCenters[1] + 82} style={smallTextStyle}>
              Fundamental
            </text>
            <line
              x1={rightX + 238}
              y1={yCenters[1] + 61}
              x2={rightX + 290}
              y2={yCenters[1] + 20}
              stroke={dark}
              strokeWidth="1.8"
              markerEnd="url(#arrowBlack)"
            />
            <text x={rightX + 310} y={yCenters[1] - 22} style={smallTextStyle}>
              Output
            </text>
            <text x={rightX + 310} y={yCenters[1] + 2} style={smallTextStyle}>
              Waveform
            </text>

            {/* Row 3: fundamental + 3rd harmonic */}
            <Axis x={rightX} y={yCenters[2]} />
            <path
              d={buildWavePath(rightX, yCenters[2], (t) => Math.sin(t), 45)}
              fill="none"
              stroke={purple}
              strokeWidth="3"
              strokeDasharray="14 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[2], (t) => Math.sin(3 * t), 47)}
              fill="none"
              stroke={cyan}
              strokeWidth="3"
              strokeDasharray="12 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[2], (t) => 0.72 * Math.sin(t) + 0.34 * Math.sin(3 * t), 55)}
              fill="none"
              stroke={red}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text x={rightX + 78} y={yCenters[2] + 92} style={smallTextStyle}>
              Harmonic
            </text>
            <line
              x1={rightX + 115}
              y1={yCenters[2] + 70}
              x2={rightX + 110}
              y2={yCenters[2] + 25}
              stroke={dark}
              strokeWidth="1.8"
              markerEnd="url(#arrowBlack)"
            />

            {/* Row 4: complex waveform with several harmonic components */}
            <Axis x={rightX} y={yCenters[3]} />
            <path
              d={buildWavePath(rightX, yCenters[3], (t) => Math.sin(t), 44)}
              fill="none"
              stroke={purple}
              strokeWidth="3"
              strokeDasharray="14 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[3], (t) => Math.sin(3 * t), 45)}
              fill="none"
              stroke={cyan}
              strokeWidth="3"
              strokeDasharray="12 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(rightX, yCenters[3], (t) => Math.sin(4 * t), 34)}
              fill="none"
              stroke={cyan}
              strokeWidth="2.8"
              strokeDasharray="7 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildWavePath(
                rightX,
                yCenters[3],
                (t) => 0.62 * Math.sin(t) + 0.28 * Math.sin(3 * t) + 0.18 * Math.sin(4 * t),
                60
              )}
              fill="none"
              stroke={red}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text x={rightX + 75} y={yCenters[3] - 65} style={smallTextStyle}>
              Harmonic
            </text>
            <line
              x1={rightX + 110}
              y1={yCenters[3] - 48}
              x2={rightX + 95}
              y2={yCenters[3] - 15}
              stroke={dark}
              strokeWidth="1.8"
              markerEnd="url(#arrowBlack)"
            />

            <text x={rightX + 105} y="790" style={textStyle}>
              Complex Waveform
            </text>
          </g>

          {/* Small divider illusion, because apparently diagrams enjoy being split into kingdoms */}
          <line
            x1="500"
            y1="35"
            x2="500"
            y2="760"
            stroke="none"
          />
        </svg>
      </div>
    </main>
  );
}
