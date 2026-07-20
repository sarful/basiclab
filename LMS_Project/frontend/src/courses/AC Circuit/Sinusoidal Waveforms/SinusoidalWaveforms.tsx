export default function SinusoidalWaveforms() {
  const width = 1100;
  const height = 700;

  const dark = "#222222";
  const blue = "#2f67b2";
  const fillBlue = "#dce8f6";
  const gray = "#8a8a8a";
  const purple = "#7a35ad";

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

  const plotLeft = 80;
  const plotRight = 1010;
  const plotTop = 65;
  const plotBottom = 620;
  const axisY = 335;
  const amplitude = 210;
  const xMax = 2 * Math.PI;

  const mapX = (theta: number) => plotLeft + (theta / xMax) * (plotRight - plotLeft);
  const mapY = (value: number) => axisY - value * amplitude;

  const buildSinePath = () => {
    let d = "";
    const steps = 480;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildAreaPath = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 480;

    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const fractionTicks = [
    { label: "π/6", theta: Math.PI / 6 },
    { label: "π/3", theta: Math.PI / 3 },
    { label: "π/2", theta: Math.PI / 2 },
    { label: "2π/3", theta: (2 * Math.PI) / 3 },
    { label: "5π/6", theta: (5 * Math.PI) / 6 },
    { label: "π", theta: Math.PI },
    { label: "7π/6", theta: (7 * Math.PI) / 6 },
    { label: "4π/3", theta: (4 * Math.PI) / 3 },
    { label: "3π/2", theta: (3 * Math.PI) / 2 },
    { label: "5π/3", theta: (5 * Math.PI) / 3 },
    { label: "11π/6", theta: (11 * Math.PI) / 6 },
    { label: "2π", theta: 2 * Math.PI },
  ];

  const instantPoints = [
    Math.PI / 4,
    Math.PI / 3,
    Math.PI / 2,
    (2 * Math.PI) / 3,
    (3 * Math.PI) / 2,
  ];

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
          <title id="title">Sinusoidal Waveforms</title>
          <desc id="desc">
            Textbook-style SVG graph of a sinusoidal waveform showing amplitude,
            instantaneous values, angular labels, periodic time, and the
            equation A(t) equals Am sine omega t.
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
              <stop offset="0%" stopColor={fillBlue} stopOpacity="0.9" />
              <stop offset="50%" stopColor={fillBlue} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fillBlue} stopOpacity="0.9" />
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
            x2={plotRight + 45}
            y2={axisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          <text
            x="20"
            y="355"
            style={textStyle}
            transform="rotate(-90 20 355)"
          >
            Amplitude
          </text>

          <text x={plotRight + 20} y={axisY + 38} style={smallTextStyle}>
            ωt (rad)
          </text>

          {/* Wave area and curve */}
          <path d={buildAreaPath()} fill="url(#waveFill)" />

          <path
            d={buildSinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal guide lines */}
          <line
            x1={plotLeft}
            y1={mapY(1)}
            x2={plotRight}
            y2={mapY(1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={plotLeft}
            y1={mapY(0.866)}
            x2={plotRight}
            y2={mapY(0.866)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          <line
            x1={plotLeft}
            y1={mapY(-1)}
            x2={plotRight}
            y2={mapY(-1)}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Vertical guide lines */}
          {fractionTicks.map((tick) => (
            <line
              key={`guide-${tick.label}`}
              x1={mapX(tick.theta)}
              y1={plotTop + 20}
              x2={mapX(tick.theta)}
              y2={plotBottom - 15}
              stroke={gray}
              strokeWidth="1.8"
              strokeDasharray="9 8"
              opacity="0.85"
            />
          ))}

          {/* Instantaneous values */}
          {instantPoints.map((theta, index) => {
            const y = mapY(Math.sin(theta));
            const x = mapX(theta);

            return (
              <g key={`instant-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="5.5"
                  fill="#9d9d9d"
                  stroke="black"
                  strokeWidth="1.5"
                />
                <line
                  x1={x}
                  y1={axisY}
                  x2={x}
                  y2={y}
                  stroke={dark}
                  strokeWidth="2.2"
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}

          <text x={mapX(Math.PI / 2) - 90} y={mapY(1) - 50} style={textStyle}>
            Instantaneous Values
          </text>

          <line
            x1={mapX(Math.PI / 2) - 20}
            y1={mapY(1) - 30}
            x2={mapX(Math.PI / 2)}
            y2={mapY(1) - 5}
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Amplitude arrows */}
          <line
            x1={mapX(Math.PI / 2) - 18}
            y1={axisY}
            x2={mapX(Math.PI / 2) - 18}
            y2={mapY(1)}
            stroke={dark}
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x={mapX(Math.PI / 2) - 70} y={mapY(0.5)} style={smallTextStyle}>
            +Amax
          </text>

          <line
            x1={mapX((3 * Math.PI) / 2)}
            y1={axisY}
            x2={mapX((3 * Math.PI) / 2)}
            y2={mapY(-1)}
            stroke={dark}
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x={mapX((3 * Math.PI) / 2) - 52} y={mapY(-0.5)} style={smallTextStyle}>
            -Amax
          </text>

          {/* Labels on Y-axis */}
          <text x={plotLeft - 45} y={mapY(1) + 8} style={smallTextStyle}>
            +1
          </text>

          <text x={plotLeft - 70} y={mapY(0.866) + 8} style={smallTextStyle}>
            0.866
          </text>

          <text x={plotLeft - 25} y={axisY + 8} style={smallTextStyle}>
            0
          </text>

          <text x={plotLeft - 45} y={mapY(-1) + 8} style={smallTextStyle}>
            -1
          </text>

          {/* X-axis fraction labels */}
          {fractionTicks.map((tick) => {
            let y = axisY + 38;
            if (tick.theta > Math.PI) y = axisY - 18;
            if (tick.theta === Math.PI) y = axisY + 38;

            return (
              <text
                key={`label-${tick.label}`}
                x={mapX(tick.theta) - 18}
                y={y}
                style={tinyTextStyle}
              >
                {tick.label}
              </text>
            );
          })}

          <text x={plotLeft - 15} y={axisY + 35} style={tinyTextStyle}>
            0
          </text>

          {/* Equation callout box */}
          <rect
            x="600"
            y="225"
            width="285"
            height="62"
            rx="4"
            fill="white"
            stroke={purple}
            strokeWidth="2"
          />

          <text x="620" y="265" style={{ ...textStyle, fill: blue }}>
            A<tspan baselineShift="sub" fontSize="18">(t)</tspan>
            <tspan> = A</tspan>
            <tspan baselineShift="sub" fontSize="18">m</tspan>
            <tspan> sin (ωt)</tspan>
          </text>

          <line
            x1="600"
            y1="255"
            x2={mapX(1.05 * Math.PI)}
            y2={mapY(Math.sin(1.05 * Math.PI))}
            stroke={blue}
            strokeWidth="2.5"
            markerEnd="url(#arrowBlue)"
          />

          {/* Top-right amplitude notation */}
          <line
            x1="1015"
            y1={mapY(1)}
            x2="1015"
            y2={mapY(-1)}
            stroke={dark}
            strokeWidth="2.3"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="1035" y={mapY(0.78)} style={smallTextStyle}>
            A<tspan baselineShift="sub" fontSize="14">p-p</tspan>
          </text>
          <text x="1035" y={mapY(0.55)} style={smallTextStyle}>
            =
          </text>
          <text x="1035" y={mapY(0.32)} style={smallTextStyle}>
            2A
            <tspan baselineShift="sub" fontSize="14">m</tspan>
          </text>

          {/* Lower captions */}
          <text x="185" y="520" style={{ ...textStyle, fill: blue }}>
            Sinusoidal Waveform
          </text>
          <line
            x1="185"
            y1="528"
            x2="455"
            y2="528"
            stroke={blue}
            strokeWidth="2"
          />

          <line
            x1={plotLeft + 15}
            y1={plotBottom - 18}
            x2={plotRight - 15}
            y2={plotBottom - 18}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          <text x="350" y={plotBottom - 36} style={textStyle}>
            Periodic Time (T)
          </text>

          {/* Period / phase annotation near origin */}
          <line
            x1={plotLeft + 8}
            y1={axisY + 70}
            x2={mapX(Math.PI / 6) - 8}
            y2={axisY + 70}
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x={plotLeft + 38} y={axisY + 58} style={smallTextStyle}>
            θ
          </text>
        </svg>
      </div>
    </main>
  );
}
