export default function GraphOfSineWaveFunction() {
  const width = 1100;
  const height = 700;

  const dark = "#222222";
  const blue = "#2f67b2";
  const fillBlue = "#dce8f6";
  const gray = "#8a8a8a";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
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
  const plotRight = 965;
  const plotTop = 70;
  const plotBottom = 630;
  const axisY = 335;
  const plotWidth = plotRight - plotLeft;
  const amp = 210;
  const xMax = 2 * Math.PI;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * plotWidth;
  const mapY = (value: number) => axisY - value * amp;

  const buildWavePath = () => {
    let d = "";
    const steps = 420;

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
    const steps = 220;

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const sampleAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
  const samplePoints = sampleAngles.map((deg) => {
    const theta = (deg * Math.PI) / 180;
    return {
      deg,
      x: mapX(theta),
      y: mapY(Math.sin(theta)),
    };
  });

  const verticalGuides = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
  const pi = Math.PI;

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
          <title id="title">Graph of the Sine Wave Function</title>
          <desc id="desc">
            Clean textbook style graph of the sine wave function y of theta
            equals sine theta, marked every 30 degrees from 0 to 360 degrees,
            including amplitude reference values and periodic time T.
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
            x2={plotRight + 45}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Shaded areas */}
          <path d={buildAreaPath(0, pi)} fill={fillBlue} opacity="0.9" />
          <path d={buildAreaPath(pi, 2 * pi)} fill={fillBlue} opacity="0.9" />

          {/* Horizontal guide lines */}
          {[1, 0.866, 0.5, -0.5, -0.866, -1].map((v, i) => (
            <line
              key={i}
              x1={plotLeft}
              y1={mapY(v)}
              x2={plotRight}
              y2={mapY(v)}
              stroke={gray}
              strokeWidth="1.8"
              strokeDasharray="10 8"
            />
          ))}

          {/* Vertical guide lines */}
          {verticalGuides.map((deg) => {
            const theta = (deg * Math.PI) / 180;
            const x = mapX(theta);
            let y1 = axisY;
            let y2 = mapY(Math.sin(theta));

            if (deg === 180 || deg === 360) {
              y1 = plotTop + 10;
              y2 = plotBottom - 5;
            }

            return (
              <line
                key={deg}
                x1={x}
                y1={Math.min(y1, y2)}
                x2={x}
                y2={Math.max(y1, y2)}
                stroke={gray}
                strokeWidth="1.8"
                strokeDasharray="10 8"
              />
            );
          })}

          {/* Sine wave */}
          <path
            d={buildWavePath()}
            fill="none"
            stroke={blue}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sample points */}
          {samplePoints.map((p) => (
            <circle
              key={p.deg}
              cx={p.x}
              cy={p.y}
              r="5.5"
              fill="#8f8f8f"
              stroke="black"
              strokeWidth="1.5"
            />
          ))}

          {/* Labels */}
          <text x="42" y="52" style={textStyle}>
            y(t) = sin(θ)
          </text>

          <text x={plotRight + 12} y={axisY - 10} style={smallTextStyle}>
            x-axis
          </text>
          <text x={plotRight + 12} y={axisY + 20} style={smallTextStyle}>
            degrees
          </text>

          {/* Y-axis labels */}
          <text x={plotLeft - 26} y={axisY + 8} style={smallTextStyle}>
            0
          </text>
          <text x={plotLeft - 40} y={mapY(0.5) + 8} style={smallTextStyle}>
            0.5
          </text>
          <text x={plotLeft - 68} y={mapY(0.866) + 8} style={smallTextStyle}>
            0.866
          </text>
          <text x={plotLeft - 24} y={mapY(1) + 8} style={smallTextStyle}>
            1
          </text>

          <text x={plotLeft - 45} y={mapY(-0.5) + 8} style={smallTextStyle}>
            -0.5
          </text>
          <text x={plotLeft - 73} y={mapY(-0.866) + 8} style={smallTextStyle}>
            -0.866
          </text>
          <text x={plotLeft - 30} y={mapY(-1) + 8} style={smallTextStyle}>
            -1
          </text>

          {/* Degree labels */}
          {sampleAngles.map((deg) => {
            const theta = (deg * Math.PI) / 180;
            const x = mapX(theta);

            let y = axisY + 34;
            if (deg >= 210) y = axisY - 18;
            if (deg === 180) y = axisY + 34;

            let label = `${deg}°`;
            if (deg === 0) return null;

            return (
              <text
                key={deg}
                x={deg === 360 ? x - 18 : x - 18}
                y={y}
                style={smallTextStyle}
              >
                {label}
              </text>
            );
          })}

          {/* Little theta / j indicator near origin */}
          <line
            x1={plotLeft + 12}
            y1={axisY + 82}
            x2={plotLeft + 70}
            y2={axisY + 82}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1={plotLeft + 12}
            y1={axisY + 82}
            x2={plotLeft + 12}
            y2={axisY + 28}
            stroke={dark}
            strokeWidth="2"
          />
          <text x={plotLeft + 24} y={axisY + 70} style={smallTextStyle}>
            θ
          </text>
          <text x={plotLeft + 33} y={axisY + 92} style={smallTextStyle}>
            j
          </text>

          {/* Periodic time bracket */}
          <line
            x1={plotLeft + 15}
            y1={plotBottom - 10}
            x2={plotRight - 15}
            y2={plotBottom - 10}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text
            x={(plotLeft + plotRight) / 2 - 120}
            y={plotBottom - 22}
            style={textStyle}
          >
            Periodic Time (T)
          </text>

          {/* Small caption on axis origin */}
          <text x={plotLeft - 22} y={axisY + 24} style={tinyTextStyle}>
            0
          </text>
        </svg>
      </div>
    </main>
  );
}
