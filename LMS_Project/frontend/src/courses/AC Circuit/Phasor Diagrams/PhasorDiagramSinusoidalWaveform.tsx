export default function PhasorDiagramSinusoidalWaveform() {
  const width = 1000;
  const height = 420;

  const dark = "#222222";
  const blue = "#2f67b2";
  const red = "#8b3f36";
  const gray = "#8a8a8a";
  const lightFill = "#f4f0f0";

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
    fontSize: 15,
    fill: dark,
  };

  const cx = 120;
  const cy = 240;
  const refLen = 620;
  const phasorVLen = 420;
  const phasorILen = 360;
  const phiDeg = 60;

  const polarPoint = (x: number, y: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: x + r * Math.cos(rad),
      y: y - r * Math.sin(rad),
    };
  };

  const vTip = polarPoint(cx, cy, phasorVLen, 0);
  const iTip = polarPoint(cx, cy, phasorILen, -phiDeg);
  const arcR = 118;
  const arcEnd = polarPoint(cx, cy, arcR, -phiDeg);

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
          <title id="title">Phasor Diagram of a Sinusoidal Waveform</title>
          <desc id="desc">
            Clean textbook style phasor diagram showing the reference axis,
            voltage phasor on the reference axis, current phasor lagging by
            sixty degrees, phase angle phi, and direction of rotation omega.
          </desc>

          <defs>
            <marker
              id="arrowDark"
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
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={blue} />
            </marker>

            <marker
              id="arrowRed"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={red} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Reference axis */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + refLen}
            y2={cy}
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrowDark)"
          />

          {/* Origin */}
          <circle cx={cx} cy={cy} r="8" fill="white" stroke={dark} strokeWidth="2.5" />
          <text x={cx - 28} y={cy - 8} style={smallTextStyle}>0</text>

          {/* Voltage phasor */}
          <line
            x1={cx}
            y1={cy}
            x2={vTip.x}
            y2={vTip.y}
            stroke={blue}
            strokeWidth="6"
            markerEnd="url(#arrowBlue)"
          />

          {/* Current phasor */}
          <line
            x1={cx}
            y1={cy}
            x2={iTip.x}
            y2={iTip.y}
            stroke={red}
            strokeWidth="6"
            markerEnd="url(#arrowRed)"
          />

          {/* Filled phase wedge */}
          <path
            d={`M ${cx} ${cy} L ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y} Z`}
            fill={lightFill}
            stroke="none"
            opacity="0.9"
          />

          {/* Angle arc */}
          <path
            d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
          />

          <text x={cx + 98} y={cy + 42} style={textStyle}>ϕ</text>
          <text x={cx + 172} y={cy + 34} style={smallTextStyle}>(60°)</text>

          {/* Rotation arrow */}
          <path
            d="M 650 95 C 670 52, 734 46, 758 106"
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <text x="736" y="78" style={textStyle}>ω</text>

          {/* Labels */}
          <text x={cx + 265} y={cy - 20} style={smallTextStyle}>
            V = V<tspan baselineShift="sub" fontSize="12">m</tspan> sin(ωt)
          </text>

          <text
            x={cx + 235}
            y={cy + 98}
            style={smallTextStyle}
            transform={`rotate(-24 ${cx + 235} ${cy + 98})`}
          >
            I = I<tspan baselineShift="sub" fontSize="12">m</tspan> sin(ωt − ϕ)
          </text>

          <text x={cx + refLen + 28} y={cy - 12} style={smallTextStyle}>
            Reference
          </text>
          <text x={cx + refLen + 28} y={cy + 16} style={smallTextStyle}>
            axis
          </text>

          <text x="128" y="340" style={smallTextStyle}>Lagging</text>
          <text x="104" y="366" style={smallTextStyle}>axis</text>

          {/* Small guide on lagging direction */}
          <line
            x1={cx + 18}
            y1={cy + 10}
            x2={cx + 92}
            y2={cy + 126}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          {/* Decorative small caption line to mimic textbook balance */}
          <line
            x1="108"
            y1="378"
            x2="180"
            y2="378"
            stroke={dark}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </main>
  );
}
