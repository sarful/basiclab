export default function RMSVoltageEquivalent() {
  const width = 1100;
  const height = 560;

  const blue = "#2f67b2";
  const lightBlue = "#dce8f6";
  const purple = "#8b65ad";
  const orange = "#d78a3b";
  const lightOrange = "#f5d2ad";
  const dark = "#222222";
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
    fontSize: 17,
    fill: dark,
  };

  const plotLeft = 70;
  const plotTop = 70;
  const plotWidth = 560;
  const axisY = 280;
  const axisBottom = 500;
  const amp = 145;
  const rmsAmp = 103;
  const xMax = 2 * Math.PI;

  const mapX = (t: number) => plotLeft + (t / xMax) * plotWidth;
  const mapY = (v: number) => axisY - v * amp;
  const mapYRms = (v: number) => axisY - v * rmsAmp;

  const buildPath = (
    fn: (t: number) => number,
    start = 0,
    end = xMax,
    steps = 320,
    mapper = mapY
  ) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = start + ((end - start) * i) / steps;
      const x = mapX(t);
      const y = mapper(fn(t));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildArea = (
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

  const sine = (t: number) => Math.sin(t);
  const rmsSine = (t: number) => Math.sin(t);

  const sinePath = buildPath(sine);
  const rmsPath = buildPath(rmsSine, 0, xMax, 320, mapYRms);
  const sineArea = buildArea(sine);

  const pi = Math.PI;
  const twoPi = 2 * Math.PI;

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
          <title id="title">RMS Voltage Equivalent</title>
          <desc id="desc">
            RMS voltage equivalent diagram comparing sinusoidal AC voltage with
            equivalent DC voltage.
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
              id="arrowOrange"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={orange} />
            </marker>

            <linearGradient id="acFill" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={lightBlue} stopOpacity="0.25" />
              <stop offset="45%" stopColor={lightBlue} stopOpacity="0.85" />
              <stop offset="100%" stopColor={lightBlue} stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="dcFill" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={lightOrange} stopOpacity="0.45" />
              <stop offset="50%" stopColor={lightOrange} stopOpacity="0.9" />
              <stop offset="100%" stopColor={lightOrange} stopOpacity="0.45" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* AC axes */}
          <line
            x1={plotLeft}
            y1={plotTop}
            x2={plotLeft}
            y2={axisBottom}
            stroke={dark}
            strokeWidth={stroke}
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotLeft + plotWidth + 55}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* AC waveform fill and curves */}
          <path d={sineArea} fill="url(#acFill)" />

          <path
            d={sinePath}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={rmsPath}
            fill="none"
            stroke={purple}
            strokeWidth="4"
            strokeDasharray="16 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Reference dashed horizontal voltage levels */}
          <line
            x1={plotLeft - 50}
            y1={mapY(1)}
            x2={mapX(pi / 2)}
            y2={mapY(1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft - 50}
            y1={mapYRms(1)}
            x2={mapX(pi / 2)}
            y2={mapYRms(1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft - 50}
            y1={mapY(-1)}
            x2={mapX((3 * pi) / 2)}
            y2={mapY(-1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={plotLeft - 50}
            y1={mapYRms(-1)}
            x2={mapX((3 * pi) / 2)}
            y2={mapYRms(-1)}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Vertical guide lines */}
          <line
            x1={mapX(pi / 2)}
            y1={mapY(1)}
            x2={mapX(pi / 2)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={mapX(pi)}
            y1={plotTop + 5}
            x2={mapX(pi)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <line
            x1={mapX(twoPi)}
            y1={plotTop + 5}
            x2={mapX(twoPi)}
            y2={axisY}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Y-axis labels */}
          <text x="8" y={mapY(1) - 6} style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="14">peak</tspan>
          </text>
          <text x="8" y={mapYRms(1) - 4} style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="14">rms</tspan>
          </text>
          <text x="8" y={mapYRms(1) + 22} style={smallTextStyle}>
            0.707
          </text>
          <text x="35" y={axisY + 8} style={smallTextStyle}>
            0
          </text>
          <text x="8" y={mapYRms(-1) + 8} style={smallTextStyle}>
            −V<tspan baselineShift="sub" fontSize="14">rms</tspan>
          </text>
          <text x="8" y={mapY(-1) + 8} style={smallTextStyle}>
            −V<tspan baselineShift="sub" fontSize="14">peak</tspan>
          </text>

          {/* AC labels */}
          <text x="350" y="93" style={textStyle}>
            AC Voltage
          </text>

          <text x={mapX(pi) - 20} y={axisY - 20} style={smallTextStyle}>
            180°
          </text>
          <text x={mapX(twoPi) - 20} y={axisY - 20} style={smallTextStyle}>
            360°
          </text>
          <text x={plotLeft + plotWidth + 20} y={axisY + 28} style={smallTextStyle}>
            time
          </text>

          {/* Half-cycle and full-cycle brackets */}
          <line
            x1={plotLeft + 20}
            y1="380"
            x2={mapX(pi) - 10}
            y2="380"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="195" y="365" style={smallTextStyle}>
            Half Cycle
          </text>

          <line
            x1={plotLeft + 20}
            y1="455"
            x2={mapX(twoPi) - 10}
            y2="455"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="270" y="440" style={smallTextStyle}>
            One Full Cycle
          </text>

          {/* DC voltage equivalent block */}
          <g transform="translate(735 85)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="310"
              stroke={dark}
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <line
              x1="0"
              y1="240"
              x2="310"
              y2="240"
              stroke={dark}
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <rect
              x="0"
              y="70"
              width="255"
              height="170"
              fill="url(#dcFill)"
              stroke="none"
            />

            <line
              x1="0"
              y1="70"
              x2="255"
              y2="70"
              stroke={orange}
              strokeWidth="7"
              strokeLinecap="round"
              markerEnd="url(#arrowOrange)"
            />

            <text x="85" y="50" style={textStyle}>
              DC Voltage
            </text>

            <text x="-58" y="82" style={smallTextStyle}>
              240V
            </text>

            <text x="255" y="272" style={smallTextStyle}>
              time
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
