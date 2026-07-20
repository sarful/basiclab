export default function SinusoidalWaveformConstruction() {
  const width = 1100;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const orange = "#f28c28";
  const green = "#7a9a3a";
  const purple = "#8b65ad";
  const red = "#cc2f2f";
  const paleBlue = "#dce8f6";
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

  const waveLeft = 520;
  const waveRight = 1040;
  const waveAxisY = 270;
  const waveAmp = 105;
  const waveWidth = waveRight - waveLeft;

  const mapX = (degrees: number) => waveLeft + (degrees / 360) * waveWidth;
  const mapY = (degrees: number) =>
    waveAxisY - Math.sin((degrees * Math.PI) / 180) * waveAmp;

  const buildSinePath = () => {
    let d = "";
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const deg = i;
      const x = mapX(deg);
      const y = mapY(deg);
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  const buildWaveArea = () => {
    let d = `M ${waveLeft} ${waveAxisY} `;

    for (let i = 0; i <= 360; i++) {
      d += `L ${mapX(i).toFixed(2)} ${mapY(i).toFixed(2)} `;
    }

    d += `L ${waveRight} ${waveAxisY} Z`;
    return d;
  };

  const coilPoints = [
    { label: "A", deg: 0, color: blue },
    { label: "B", deg: 45, color: orange },
    { label: "C", deg: 90, color: green },
    { label: "D", deg: 135, color: purple },
    { label: "E", deg: 180, color: blue },
    { label: "F", deg: 225, color: orange },
    { label: "G", deg: 270, color: green },
    { label: "H", deg: 315, color: purple },
  ];

  const coilCenterX = 185;
  const coilCenterY = 255;
  const coilRadius = 108;

  const pointOnCoil = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: coilCenterX + Math.cos(rad) * coilRadius,
      y: coilCenterY - Math.sin(rad) * coilRadius,
    };
  };

  const degreeMarks = [0, 45, 90, 135, 180, 225, 270, 315, 360];

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
          <title id="title">Sinusoidal Waveform Construction</title>
          <desc id="desc">
            A textbook-style SVG diagram showing the construction of a
            sinusoidal waveform from the displacement of a rotating coil in a
            magnetic field.
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

            <linearGradient id="northPole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d98d85" />
              <stop offset="100%" stopColor="#f4d2ce" />
            </linearGradient>

            <linearGradient id="southPole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#edf5fb" />
              <stop offset="100%" stopColor="#cfe0ef" />
            </linearGradient>

            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={paleBlue} stopOpacity="0.88" />
              <stop offset="50%" stopColor={paleBlue} stopOpacity="0.42" />
              <stop offset="100%" stopColor={paleBlue} stopOpacity="0.88" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Magnetic field poles */}
          <rect
            x="60"
            y="5"
            width="255"
            height="120"
            fill="url(#northPole)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="187" y="78" textAnchor="middle" style={textStyle}>
            N
          </text>

          <rect
            x="60"
            y="385"
            width="255"
            height="125"
            fill="url(#southPole)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="187" y="456" textAnchor="middle" style={textStyle}>
            S
          </text>

          {/* Rotating coil diagram */}
          <circle
            cx={coilCenterX}
            cy={coilCenterY}
            r={coilRadius}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="10 8"
          />
          <circle
            cx={coilCenterX}
            cy={coilCenterY}
            r="70"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Radial lines */}
          {coilPoints.map((point) => {
            const p = pointOnCoil(point.deg);
            return (
              <line
                key={`radius-${point.label}`}
                x1={coilCenterX}
                y1={coilCenterY}
                x2={p.x}
                y2={p.y}
                stroke="black"
                strokeWidth="2"
              />
            );
          })}

          {/* Coil points */}
          {coilPoints.map((point) => {
            const p = pointOnCoil(point.deg);
            return (
              <g key={point.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="19"
                  fill={point.color}
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={p.y + 7}
                  textAnchor="middle"
                  style={{ ...smallTextStyle, fill: "black" }}
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Coil cross and angle */}
          <line
            x1={coilCenterX - 88}
            y1={coilCenterY}
            x2={coilCenterX + 88}
            y2={coilCenterY}
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={coilCenterX}
            y1={coilCenterY - 88}
            x2={coilCenterX}
            y2={coilCenterY + 88}
            stroke="black"
            strokeWidth="2"
          />
          <path
            d={`M ${coilCenterX + 44} ${coilCenterY} A 44 44 0 0 0 ${
              coilCenterX + 31
            } ${coilCenterY - 31}`}
            fill="none"
            stroke={blue}
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x={coilCenterX + 25} y={coilCenterY - 8} style={{ ...smallTextStyle, fill: blue }}>
            θ
          </text>

          {/* Degree labels around coil */}
          <text x="282" y="270" style={tinyTextStyle}>0°/360°</text>
          <text x="255" y="162" style={tinyTextStyle}>45°</text>
          <text x="170" y="135" style={tinyTextStyle}>90°</text>
          <text x="72" y="162" style={tinyTextStyle}>135°</text>
          <text x="40" y="270" style={tinyTextStyle}>180°</text>
          <text x="75" y="367" style={tinyTextStyle}>225°</text>
          <text x="170" y="388" style={tinyTextStyle}>270°</text>
          <text x="255" y="367" style={tinyTextStyle}>315°</text>

          {/* Projection dashed lines from coil to graph */}
          {[90, 45, 0, 315, 270].map((deg) => {
            const p = pointOnCoil(deg);
            return (
              <line
                key={`projection-${deg}`}
                x1={p.x}
                y1={p.y}
                x2={waveLeft}
                y2={mapY(deg)}
                stroke="black"
                strokeWidth="1.8"
                strokeDasharray="13 9"
              />
            );
          })}

          {/* Waveform axes */}
          <line
            x1={waveLeft}
            y1="80"
            x2={waveLeft}
            y2="440"
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />
          <line
            x1={waveLeft}
            y1={waveAxisY}
            x2={waveRight + 45}
            y2={waveAxisY}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Wave fill and curve */}
          <path d={buildWaveArea()} fill="url(#waveFill)" />
          <path
            d={buildSinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal guide lines */}
          <line
            x1={waveLeft - 55}
            y1={mapY(90)}
            x2={waveRight}
            y2={mapY(90)}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={waveLeft - 55}
            y1={mapY(270)}
            x2={waveRight}
            y2={mapY(270)}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={waveLeft - 55}
            y1={mapY(225)}
            x2={waveRight}
            y2={mapY(225)}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Vertical guide lines and labels */}
          {degreeMarks.map((deg) => (
            <g key={`degree-${deg}`}>
              <line
                x1={mapX(deg)}
                y1="85"
                x2={mapX(deg)}
                y2="438"
                stroke={gray}
                strokeWidth="1.8"
                strokeDasharray="8 8"
              />
              <text
                x={mapX(deg) - (deg === 360 ? 26 : 16)}
                y={waveAxisY + 33}
                style={smallTextStyle}
              >
                {deg === 0 ? "0" : `${deg}°`}
              </text>
            </g>
          ))}

          {/* Point labels on sine wave */}
          {coilPoints.concat([{ label: "A", deg: 360, color: blue }]).map((point) => (
            <text
              key={`wave-${point.label}-${point.deg}`}
              x={mapX(point.deg) - 7}
              y={mapY(point.deg) - 12}
              style={{ ...smallTextStyle, fill: dark }}
            >
              {point.label}
            </text>
          ))}

          {/* Colored instantaneous value arrows */}
          {[45, 90, 135, 225, 270, 315].map((deg) => {
            const y = mapY(deg);
            const color =
              deg === 45 || deg === 225
                ? orange
                : deg === 90 || deg === 270
                ? green
                : purple;

            return (
              <line
                key={`instant-${deg}`}
                x1={mapX(deg)}
                y1={waveAxisY}
                x2={mapX(deg)}
                y2={y}
                stroke={color}
                strokeWidth="5"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Waveform labels */}
          <text x={waveLeft - 78} y={mapY(90) + 8} style={smallTextStyle}>
            100V
          </text>
          <text x={waveLeft - 82} y={mapY(270) + 8} style={smallTextStyle}>
            −100V
          </text>
          <text x={waveLeft - 22} y={waveAxisY + 8} style={smallTextStyle}>
            0
          </text>
          <text x={waveLeft - 12} y="75" style={smallTextStyle}>
            e
          </text>
          <text x={waveRight + 20} y={waveAxisY + 30} style={smallTextStyle}>
            θ
          </text>

          {/* One-cycle bracket */}
          <line
            x1={waveLeft}
            y1="80"
            x2={waveRight}
            y2="80"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <line x1={waveLeft} y1="62" x2={waveLeft} y2="98" stroke={dark} strokeWidth="2" />
          <line x1={waveRight} y1="62" x2={waveRight} y2="98" stroke={dark} strokeWidth="2" />
          <text x={waveLeft + 210} y="55" style={smallTextStyle}>
            1 Cycle
          </text>

          {/* Baseline title */}
          <text x="595" y="500" style={textStyle}>
            Sinusoidal Waveform Construction
          </text>
        </svg>
      </div>
    </main>
  );
}
