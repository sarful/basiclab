export default function ACWaveformsPureResistor() {
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

  const amp = 150;
  const powerAmp = 185;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * plotWidth;
  const mapY = (value: number) => axisY - value * amp;
  const mapPowerY = (value: number) => axisY - value * powerAmp;

  const buildPath = (
    fn: (theta: number) => number,
    mapper: (value: number) => number,
    start = 0,
    end = xMax,
    steps = 420
  ) => {
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const theta = start + ((end - start) * i) / steps;
      const x = mapX(theta);
      const y = mapper(fn(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildPowerArea = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 420;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapPowerY(Math.sin(theta) * Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const voltagePath = buildPath((theta) => Math.sin(theta), mapY);
  const currentPath = buildPath((theta) => 0.62 * Math.sin(theta), mapY);
  const powerPath = buildPath(
    (theta) => Math.sin(theta) * Math.sin(theta),
    mapPowerY
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
          <title id="title">AC Waveforms for a Pure Resistor</title>
          <desc id="desc">
            AC voltage, current, and power waveforms for a pure resistor.
            Voltage and current are in phase, while instantaneous power remains
            positive and has twice the frequency.
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
              <stop offset="0%" stopColor={lightPurple} stopOpacity="0.9" />
              <stop offset="100%" stopColor={lightPurple} stopOpacity="0.25" />
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

          {/* Power shaded area and curve */}
          <path d={buildPowerArea()} fill="url(#powerFill)" />

          <path
            d={powerPath}
            fill="none"
            stroke={purple}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Voltage and current curves */}
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

          {/* Average power line */}
          <line
            x1={plotLeft}
            y1={mapPowerY(0.5)}
            x2={plotRight}
            y2={mapPowerY(0.5)}
            stroke={dark}
            strokeWidth="2.5"
            strokeDasharray="10 8"
          />

          <text x={plotRight - 130} y={mapPowerY(0.5) - 16} style={smallTextStyle}>
            Average
          </text>
          <text x={plotRight - 125} y={mapPowerY(0.5) + 10} style={smallTextStyle}>
            power
          </text>

          {/* Vertical dashed guides */}
          <line
            x1={mapX(pi2)}
            y1={topY + 20}
            x2={mapX(pi2)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={mapX(pi)}
            y1={topY + 20}
            x2={mapX(pi)}
            y2={bottomY - 35}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={mapX(threePi2)}
            y1={topY + 20}
            x2={mapX(threePi2)}
            y2={bottomY - 35}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <line
            x1={mapX(twoPi)}
            y1={topY + 20}
            x2={mapX(twoPi)}
            y2={bottomY - 35}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Plus/minus markings on positive power humps */}
          <text x={mapX(pi2) - 18} y={mapPowerY(0.95)} style={textStyle}>
            +
          </text>
          <text x={mapX(threePi2) - 18} y={mapPowerY(0.95)} style={textStyle}>
            +
          </text>

          <text x={mapX(pi2) - 23} y={axisY + 26} style={smallTextStyle}>
            −
          </text>
          <text x={mapX(threePi2) - 23} y={axisY + 26} style={smallTextStyle}>
            −
          </text>

          {/* Labels */}
          <text x={mapX(pi2) + 95} y={mapPowerY(0.95) - 18} style={smallTextStyle}>
            Power
          </text>
          <text x={mapX(pi2) + 90} y={mapPowerY(0.95) + 8} style={smallTextStyle}>
            Consumed
          </text>
          <line
            x1={mapX(pi2) + 75}
            y1={mapPowerY(0.92) - 5}
            x2={mapX(pi2) + 12}
            y2={mapPowerY(0.98)}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x={mapX(threePi2) + 85} y={mapPowerY(0.95) - 10} style={smallTextStyle}>
            Real power
          </text>

          <line
            x1={mapX(threePi2) + 72}
            y1={mapPowerY(0.92)}
            x2={mapX(threePi2) + 8}
            y2={mapPowerY(0.98)}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x={mapX(0.28 * Math.PI)} y={mapY(0.9)} style={{ ...smallTextStyle, fill: blue }}>
            v
          </text>

          <text x={mapX(0.43 * Math.PI)} y={mapY(0.46)} style={{ ...smallTextStyle, fill: red }}>
            i
          </text>

          {/* Angle labels */}
          <text x={mapX(pi2) - 20} y={axisY + 34} style={smallTextStyle}>
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

          {/* Equation block */}
          <text x="155" y="475" style={smallTextStyle}>
            v = V<tspan baselineShift="sub" fontSize="14">m</tspan> sinθ
          </text>

          <text x="155" y="505" style={smallTextStyle}>
            i = I<tspan baselineShift="sub" fontSize="14">m</tspan> sinθ
          </text>

          <text x="155" y="535" style={smallTextStyle}>
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
