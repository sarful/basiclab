export default function PhasorDiagramsSinusoidalWaveform() {
  const width = 1200;
  const height = 620;

  const dark = "#222222";
  const blue = "#2f67b2";
  const fillBlue = "#dce8f6";
  const brown = "#8b3f36";
  const lightPurple = "#ebe5f3";
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
    fontSize: 14,
    fill: dark,
  };

  const phCx = 240;
  const phCy = 310;
  const phR = 150;

  const plotLeft = 520;
  const plotRight = 1110;
  const axisY = 310;
  const plotTop = 85;
  const plotBottom = 555;
  const plotWidth = plotRight - plotLeft;
  const amp = 155;

  const phiDeg = 30;
  const phi = (phiDeg * Math.PI) / 180;
  const xMax = 2 * Math.PI;

  const polarPoint = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const mapX = (theta: number) => plotLeft + (theta / xMax) * plotWidth;
  const mapY = (value: number) => axisY - value * amp;

  const buildWavePath = () => {
    let d = "";
    const steps = 420;
    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta + phi));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d.trim();
  };

  const buildAreaPath = () => {
    let d = `M ${plotLeft} ${axisY} `;
    const steps = 420;
    for (let i = 0; i <= steps; i++) {
      const theta = (xMax * i) / steps;
      const x = mapX(theta);
      const y = mapY(Math.sin(theta + phi));
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${plotRight} ${axisY} Z`;
    return d;
  };

  const tip = polarPoint(phCx, phCy, phR, phiDeg);
  const amplitudeAtZero = Math.sin(phi);

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
          <title id="title">Phasor Diagrams for a Sinusoidal Waveform</title>
          <desc id="desc">
            Textbook style SVG showing a rotating phasor on the left and the
            corresponding phase-shifted sinusoidal waveform in the time domain on the right.
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
              id="arrowBrown"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={brown} />
            </marker>
            <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={fillBlue} stopOpacity="0.9" />
              <stop offset="50%" stopColor={fillBlue} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fillBlue} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* ===== Left: phasor diagram ===== */}
          <g>
            {/* top rotation arc */}
            <path
              d="M 145 110 A 145 145 0 0 1 335 110"
              fill="none"
              stroke="#b7a6c8"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 145 110 A 145 145 0 0 1 335 110"
              fill="none"
              stroke={dark}
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text x="165" y="45" style={textStyle}>
              Phasor rotation
            </text>
            <text x="205" y="74" style={smallTextStyle}>
              ω radians
            </text>

            {/* circle */}
            <circle
              cx={phCx}
              cy={phCy}
              r={phR}
              fill={lightPurple}
              stroke="black"
              strokeWidth={stroke}
            />

            {/* axes */}
            <line x1={phCx - phR} y1={phCy} x2={phCx + phR} y2={phCy} stroke={dark} strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1={phCx} y1={phCy + phR} x2={phCx} y2={phCy - phR} stroke={dark} strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />

            {/* radial spokes every 30 degrees */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
              const p = polarPoint(phCx, phCy, phR, deg);
              return (
                <line
                  key={deg}
                  x1={phCx}
                  y1={phCy}
                  x2={p.x}
                  y2={p.y}
                  stroke={deg === phiDeg ? brown : dark}
                  strokeWidth={deg === phiDeg ? 4 : 1.8}
                />
              );
            })}

            {/* degree labels */}
            {[
              { d: 0, label: "0°" },
              { d: 30, label: "30°" },
              { d: 60, label: "60°" },
              { d: 90, label: "90°" },
              { d: 120, label: "120°" },
              { d: 180, label: "180°" },
              { d: 210, label: "210°" },
              { d: 240, label: "240°" },
              { d: 270, label: "270°" },
              { d: 300, label: "300°" },
              { d: 330, label: "330°" },
              { d: 360, label: "360°" },
            ].map((item) => {
              const p = polarPoint(phCx, phCy, phR + 24, item.d === 360 ? 0 : item.d);
              return (
                <text
                  key={item.label}
                  x={p.x - 14}
                  y={p.y + 5}
                  style={tinyTextStyle}
                >
                  {item.label}
                </text>
              );
            })}

            {/* highlighted phasor and angle */}
            <line
              x1={phCx}
              y1={phCy}
              x2={tip.x}
              y2={tip.y}
              stroke={brown}
              strokeWidth="5"
              markerEnd="url(#arrowBrown)"
            />

            <path
              d={`M ${phCx + 44} ${phCy} A 44 44 0 0 0 ${phCx + 38} ${phCy - 22}`}
              fill="none"
              stroke={brown}
              strokeWidth="2.5"
              markerEnd="url(#arrowBrown)"
            />
            <text x={phCx + 50} y={phCy - 16} style={{ ...smallTextStyle, fill: brown }}>
              ϕ
            </text>

            {/* center label */}
            <text x={phCx - 9} y={phCy + 8} style={smallTextStyle}>A</text>

            <text x="132" y="520" style={textStyle}>
              Rotating Phasor
            </text>
          </g>

          {/* ===== Link to waveform ===== */}
          <line
            x1={tip.x}
            y1={tip.y}
            x2={plotLeft}
            y2={tip.y}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={phCx + phR}
            y1={phCy}
            x2={plotLeft}
            y2={axisY}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={phCx}
            y1={phCy - phR}
            x2={plotLeft}
            y2={mapY(1)}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={phCx}
            y1={phCy + phR}
            x2={plotLeft}
            y2={mapY(-1)}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* ===== Right: waveform ===== */}
          <g>
            {/* axes */}
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
              x2={plotRight + 40}
              y2={axisY}
              stroke={dark}
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            {/* fill and waveform */}
            <path d={buildAreaPath()} fill="url(#waveFill)" />
            <path
              d={buildWavePath()}
              fill="none"
              stroke={blue}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* guides */}
            {[30,60,90,120,150,180,210,270,330].map((deg) => (
              <line
                key={`vg-${deg}`}
                x1={mapX((deg * Math.PI) / 180)}
                y1={plotTop + 18}
                x2={mapX((deg * Math.PI) / 180)}
                y2={plotBottom - 20}
                stroke={gray}
                strokeWidth="1.8"
                strokeDasharray="8 8"
              />
            ))}

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
              y1={mapY(-1)}
              x2={plotRight}
              y2={mapY(-1)}
              stroke={gray}
              strokeWidth="2"
              strokeDasharray="10 8"
            />

            {/* labels */}
            <text x={plotLeft - 16} y={axisY + 7} style={smallTextStyle}>0</text>
            <text x={plotLeft - 70} y={mapY(1) + 8} style={smallTextStyle}>
              +A<tspan baselineShift="sub" fontSize="12">m</tspan>
            </text>
            <text x={plotLeft - 64} y={mapY(-1) + 8} style={smallTextStyle}>
              -A<tspan baselineShift="sub" fontSize="12">m</tspan>
            </text>

            <text x={plotRight + 20} y={axisY + 6} style={smallTextStyle}>θ</text>

            {/* x labels */}
            {[
              {deg:30,label:"30°"},
              {deg:60,label:"60°"},
              {deg:90,label:"90°"},
              {deg:120,label:"120°"},
              {deg:180,label:"180°"},
              {deg:210,label:"210°"},
              {deg:270,label:"270°"},
              {deg:330,label:"330°"},
            ].map((t) => (
              <text
                key={t.label}
                x={mapX((t.deg * Math.PI)/180) - 16}
                y={t.deg > 180 ? axisY + 30 : axisY + 30}
                style={tinyTextStyle}
              >
                {t.label}
              </text>
            ))}

            {/* initial phase marker */}
            <line
              x1={plotLeft}
              y1={axisY + 48}
              x2={mapX(phi)}
              y2={axisY + 48}
              stroke={brown}
              strokeWidth="2"
              markerStart="url(#arrowBrown)"
              markerEnd="url(#arrowBrown)"
            />
            <text x={plotLeft + 22} y={axisY + 38} style={{ ...smallTextStyle, fill: brown }}>
              30°
            </text>

            {/* equation box */}
            <rect
              x="780"
              y="86"
              width="280"
              height="58"
              fill="#fff7df"
              stroke="#caa95a"
              strokeWidth="2"
            />
            <text x="798" y="123" style={{ ...textStyle, fill: blue }}>
              A<tspan baselineShift="sub" fontSize="16">(t)</tspan>
              <tspan> = A</tspan>
              <tspan baselineShift="sub" fontSize="16">m</tspan>
              <tspan> sin(ωt + ϕ)</tspan>
            </text>

            <line
              x1="820"
              y1="145"
              x2={mapX(Math.PI/2 - phi)}
              y2={mapY(1)}
              stroke={dark}
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />

            {/* caption */}
            <text x="615" y="520" style={textStyle}>
              Sinusoidal Waveform in
            </text>
            <text x="645" y="548" style={textStyle}>
              the Time Domain
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
