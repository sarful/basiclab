export default function SinusoidalWaveformsACInductance() {
  const width = 1000;
  const height = 600;

  const plotLeft = 40;
  const plotRight = 960;
  const axisY = 320;
  const yTop = 80;
  const yBottom = 560;

  const xMax = (5 * Math.PI) / 2;

  const blue = "#2f67b2";
  const purple = "#7a35ad";
  const dark = "#222222";
  const gray = "#8f8f8f";

  const mapX = (t: number) => plotLeft + (t / xMax) * (plotRight - plotLeft);
  const mapY = (v: number) => axisY - v * 150;

  const buildWavePath = (
    fn: (t: number) => number,
    start = 0,
    end = xMax,
    steps = 320
  ) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = start + ((end - start) * i) / steps;
      const x = mapX(t);
      const y = mapY(fn(t));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildAreaPath = (
    fn: (t: number) => number,
    start = 0,
    end = xMax,
    steps = 320
  ) => {
    let d = `M ${mapX(start).toFixed(2)} ${axisY.toFixed(2)} `;
    for (let i = 0; i <= steps; i++) {
      const t = start + ((end - start) * i) / steps;
      const x = mapX(t);
      const y = mapY(fn(t));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${mapX(end).toFixed(2)} ${axisY.toFixed(2)} Z`;
    return d;
  };

  const iWave = (t: number) => 0.62 * Math.sin(t);
  const vWave = (t: number) => Math.sin(t + Math.PI / 2);

  const vPath = buildWavePath(vWave);
  const iPath = buildWavePath(iWave);
  const vArea = buildAreaPath(vWave);
  const iArea = buildAreaPath(iWave);

  const pi2 = Math.PI / 2;
  const pi = Math.PI;
  const threePi2 = (3 * Math.PI) / 2;
  const twoPi = 2 * Math.PI;
  const fivePi2 = (5 * Math.PI) / 2;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl rounded bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Sinusoidal Waveforms for AC Inductance</title>
          <desc id="desc">
            A plot of sinusoidal waveforms for AC inductance showing inductor
            voltage leading inductor current by 90 degrees.
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill={dark} />
            </marker>

            <marker
              id="arrowGray"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={gray} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Axes */}
          <line
            x1={plotLeft}
            y1={yBottom}
            x2={plotLeft}
            y2={yTop}
            stroke={dark}
            strokeWidth="3"
          />
          <line
            x1={plotLeft}
            y1={axisY}
            x2={975}
            y2={axisY}
            stroke={dark}
            strokeWidth="3"
            markerEnd="url(#arrowBlack)"
          />

          {/* Shaded areas */}
          <path d={vArea} fill={blue} opacity="0.18" />
          <path d={iArea} fill={purple} opacity="0.18" />

          {/* Dashed guide lines */}
          <line
            x1={mapX(pi)}
            y1={axisY}
            x2={mapX(pi)}
            y2={mapY(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={mapX(threePi2)}
            y1={axisY}
            x2={mapX(threePi2)}
            y2={mapY(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={mapX(fivePi2)}
            y1={axisY}
            x2={mapX(fivePi2)}
            y2={mapY(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Waveforms */}
          <path
            d={vPath}
            fill="none"
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={iPath}
            fill="none"
            stroke={purple}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Equation labels */}
          <rect x="585" y="28" width="275" height="54" fill="white" stroke={blue} strokeWidth="1.5" />
          <text x="605" y="63" fontFamily="Times New Roman, serif" fontSize="28" fill={blue}>
            V<tspan baselineShift="sub" fontSize="18">L(t)</tspan>
            <tspan> = V</tspan>
            <tspan baselineShift="sub" fontSize="18">m</tspan>
            <tspan> sin(ωt + 90°)</tspan>
          </text>

          <rect x="760" y="88" width="230" height="50" fill="white" stroke={purple} strokeWidth="1.5" />
          <text x="780" y="121" fontFamily="Times New Roman, serif" fontSize="26" fill={purple}>
            I<tspan baselineShift="sub" fontSize="18">L(t)</tspan>
            <tspan> = I</tspan>
            <tspan baselineShift="sub" fontSize="18">m</tspan>
            <tspan> sin(ωt)</tspan>
          </text>

          {/* Callout arrows */}
          <line
            x1="700"
            y1="82"
            x2="120"
            y2="135"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowBlack)"
          />
          <line
            x1="790"
            y1="138"
            x2="270"
            y2="165"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowBlack)"
          />

          {/* X-axis labels */}
          <text x={plotLeft - 12} y={axisY + 10} fontFamily="Times New Roman, serif" fontSize="26" fill={dark}>
            0
          </text>

          <text
            x={mapX(pi2) - 28}
            y={axisY + 46}
            fontFamily="Times New Roman, serif"
            fontSize="24"
            fill={dark}
          >
            π
          </text>
          <text
            x={mapX(pi2) - 20}
            y={axisY + 72}
            fontFamily="Times New Roman, serif"
            fontSize="20"
            fill={dark}
          >
            2
          </text>
          <text
            x={mapX(pi2) + 14}
            y={axisY + 60}
            fontFamily="Times New Roman, serif"
            fontSize="22"
            fill={dark}
          >
            or 90°
          </text>

          <text
            x={mapX(pi) - 8}
            y={axisY - 14}
            fontFamily="Times New Roman, serif"
            fontSize="28"
            fill={dark}
          >
            π
          </text>

          <text
            x={mapX(threePi2) - 18}
            y={axisY - 50}
            fontFamily="Times New Roman, serif"
            fontSize="24"
            fill={dark}
          >
            3π
          </text>
          <text
            x={mapX(threePi2) - 6}
            y={axisY - 22}
            fontFamily="Times New Roman, serif"
            fontSize="20"
            fill={dark}
          >
            2
          </text>

          <text
            x={mapX(twoPi) - 12}
            y={axisY - 14}
            fontFamily="Times New Roman, serif"
            fontSize="28"
            fill={dark}
          >
            2π
          </text>

          <text
            x={mapX(fivePi2) - 18}
            y={axisY - 50}
            fontFamily="Times New Roman, serif"
            fontSize="24"
            fill={dark}
          >
            5π
          </text>
          <text
            x={mapX(fivePi2) - 6}
            y={axisY - 22}
            fontFamily="Times New Roman, serif"
            fontSize="20"
            fill={dark}
          >
            2
          </text>

          <text x="915" y="352" fontFamily="Times New Roman, serif" fontSize="28" fill={dark}>
            θ(ωt)
          </text>

          {/* Phase-shift annotation */}
          <line
            x1={mapX(0.05)}
            y1="430"
            x2={mapX(pi2) - 8}
            y2="430"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrowGray)"
            markerEnd="url(#arrowGray)"
          />
          <line
            x1={mapX(0.05)}
            y1="410"
            x2={mapX(pi2) - 8}
            y2="410"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrowGray)"
            markerEnd="url(#arrowGray)"
          />
          <text x="58" y="388" fontFamily="Times New Roman, serif" fontSize="26" fill={dark}>
            π
          </text>
          <text x="67" y="414" fontFamily="Times New Roman, serif" fontSize="20" fill={dark}>
            2
          </text>
          <text x="92" y="404" fontFamily="Times New Roman, serif" fontSize="22" fill={dark}>
            or 90°
          </text>
        </svg>
      </div>
    </main>
  );
}
