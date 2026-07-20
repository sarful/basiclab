export default function ACWaveformsPureCapacitor() {
  const width = 1000;
  const height = 620;

  const dark = "#222222";
  const blue = "#2f67b2";
  const red = "#b03a2e";
  const purple = "#7a35ad";
  const lightPurple = "#eadff4";
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

  const plotLeft = 70;
  const plotRight = 930;
  const axisY = 300;
  const topY = 70;
  const bottomY = 550;
  const plotWidth = plotRight - plotLeft;
  const xMax = 2 * Math.PI;

  const waveAmp = 150;
  const currentAmp = 85;
  const powerAmp = 185;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * plotWidth;
  const mapY = (value: number, amp = waveAmp) => axisY - value * amp;

  const buildPath = (
    fn: (theta: number) => number,
    amp = waveAmp,
    start = 0,
    end = xMax,
    steps = 420
  ) => {
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapY(fn(theta), amp);
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildPowerArea = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 420;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const power = Math.sin(theta) * Math.sin(theta + Math.PI / 2);
      const x = mapX(theta);
      const y = mapY(power, powerAmp);
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const voltagePath = buildPath((theta) => Math.sin(theta), waveAmp);
  const currentPath = buildPath(
    (theta) => Math.sin(theta + Math.PI / 2),
    currentAmp
  );
  const powerPath = buildPath(
    (theta) => Math.sin(theta) * Math.sin(theta + Math.PI / 2),
    powerAmp
  );

  const pi = Math.PI;
  const pi2 = Math.PI / 2;
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
          <title id="title">AC Waveforms for a Pure Capacitor</title>
          <desc id="desc">
            AC voltage, current, and power waveforms for a pure capacitor.
            Current leads voltage by 90 degrees, and instantaneous power
            alternates between positive and negative half-cycles.
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

            <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lightPurple} stopOpacity="0.85" />
              <stop offset="50%" stopColor={lightPurple} stopOpacity="0.28" />
              <stop offset="100%" stopColor={lightPurple} stopOpacity="0.85" />
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

          <text x="28" y="50" style={textStyle}>
            p, v, i
          </text>

          <text x={plotRight + 25} y={axisY + 38} style={smallTextStyle}>
            ωt
          </text>

          {/* Instantaneous power shaded region */}
          <path d={buildPowerArea()} fill="url(#powerFill)" />

          {/* Waveforms */}
          <path
            d={powerPath}
            fill="none"
            stroke={purple}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={voltagePath}
            fill="none"
            stroke={blue}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={currentPath}
            fill="none"
            stroke={red}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Average power zero line */}
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotRight}
            y2={axisY}
            stroke={dark}
            strokeWidth="2.5"
          />

          <text x={plotRight - 125} y={axisY - 20} style={smallTextStyle}>
            Average
          </text>
          <text x={plotRight - 118} y={axisY + 8} style={smallTextStyle}>
            power
          </text>

          {/* Vertical angle guide lines */}
          {[pi2, pi, threePi2, twoPi].map((theta) => (
            <line
              key={theta}
              x1={mapX(theta)}
              y1={topY + 20}
              x2={mapX(theta)}
              y2={bottomY - 35}
              stroke={gray}
              strokeWidth="2"
              strokeDasharray="9 8"
            />
          ))}

          {/* Power region signs */}
          <text x={mapX(0.24 * Math.PI)} y={mapY(0.82, powerAmp)} style={textStyle}>
            +
          </text>
          <text x={mapX(1.24 * Math.PI)} y={mapY(0.82, powerAmp)} style={textStyle}>
            +
          </text>

          <text x={mapX(0.74 * Math.PI)} y={mapY(-0.72, powerAmp)} style={textStyle}>
            −
          </text>
          <text x={mapX(1.74 * Math.PI)} y={mapY(-0.72, powerAmp)} style={textStyle}>
            −
          </text>

          {/* Waveform labels */}
          <text
            x={mapX(0.28 * Math.PI)}
            y={mapY(0.88, waveAmp) - 10}
            style={{ ...smallTextStyle, fill: blue }}
          >
            v
          </text>

          <text
            x={mapX(0.96 * Math.PI)}
            y={mapY(0.66, currentAmp) - 12}
            style={{ ...smallTextStyle, fill: red }}
          >
            i
          </text>

          <text
            x={mapX(0.32 * Math.PI)}
            y={mapY(0.95, powerAmp) - 20}
            style={smallTextStyle}
          >
            Power
          </text>
          <text
            x={mapX(0.32 * Math.PI)}
            y={mapY(0.95, powerAmp) + 8}
            style={smallTextStyle}
          >
            Consumed
          </text>

          <line
            x1={mapX(0.32 * Math.PI) + 68}
            y1={mapY(0.86, powerAmp)}
            x2={mapX(0.18 * Math.PI)}
            y2={mapY(0.72, powerAmp)}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text
            x={mapX(0.88 * Math.PI)}
            y={mapY(-0.95, powerAmp) + 40}
            style={smallTextStyle}
          >
            Power
          </text>
          <text
            x={mapX(0.88 * Math.PI)}
            y={mapY(-0.95, powerAmp) + 68}
            style={smallTextStyle}
          >
            Returned
          </text>

          <line
            x1={mapX(0.88 * Math.PI) + 75}
            y1={mapY(-0.82, powerAmp) + 48}
            x2={mapX(0.75 * Math.PI)}
            y2={mapY(-0.82, powerAmp)}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Angle labels */}
          <text x={mapX(pi2) - 18} y={axisY + 34} style={smallTextStyle}>
            90°
          </text>

          <text x={mapX(pi) - 22} y={axisY + 34} style={smallTextStyle}>
            180°
          </text>

          <text x={mapX(threePi2) - 24} y={axisY + 34} style={smallTextStyle}>
            270°
          </text>

          <text x={mapX(twoPi) - 22} y={axisY + 34} style={smallTextStyle}>
            360°
          </text>

          <text x={plotLeft - 20} y={axisY + 9} style={smallTextStyle}>
            0
          </text>

          {/* 90 degree phase lead annotation */}
          <line
            x1={plotLeft + 20}
            y1={axisY + 42}
            x2={mapX(pi2) - 12}
            y2={axisY + 42}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x={plotLeft + 70} y={axisY + 70} style={tinyTextStyle}>
            current leads voltage by 90°
          </text>

          {/* Equation block */}
          <text x="155" y="485" style={smallTextStyle}>
            v = V<tspan baselineShift="sub" fontSize="14">m</tspan> sinθ
          </text>

          <text x="155" y="515" style={smallTextStyle}>
            i = I<tspan baselineShift="sub" fontSize="14">m</tspan> sin(θ + 90°)
          </text>

          <text x="155" y="545" style={smallTextStyle}>
            p = vi
          </text>

          {/* Cycle bracket */}
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

          <text x={mapX(Math.PI) - 38} y={bottomY - 36} style={tinyTextStyle}>
            one full cycle
          </text>
        </svg>
      </div>
    </main>
  );
}
