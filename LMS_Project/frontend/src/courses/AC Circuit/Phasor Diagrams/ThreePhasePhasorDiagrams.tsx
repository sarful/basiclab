export default function ThreePhasePhasorDiagrams() {
  const width = 900;
  const height = 720;

  const dark = "#222222";
  const red = "#d92323";
  const blue = "#2f67b2";
  const yellow = "#e1c61a";
  const gray = "#777777";
  const lightGray = "#f1f1f1";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
    fill: dark,
  };

  const cx = 320;
  const cy = 365;
  const r = 245;

  const point = (angleDeg: number, radius = r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  const redTip = point(0);
  const blueTip = point(120);
  const yellowTip = point(240);

  const arcPath = (startDeg: number, endDeg: number, radius: number) => {
    const start = point(startDeg, radius);
    const end = point(endDeg, radius);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    const sweep = endDeg > startDeg ? 0 : 1;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Three-phase Phasor Diagrams</title>
          <desc id="desc">
            A three-phase phasor diagram showing red, blue, and yellow phase
            phasors separated by 120 degrees with clockwise direction of rotation.
          </desc>

          <defs>
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
              id="arrowYellow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={yellow} />
            </marker>

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
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Light construction circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={lightGray}
            strokeWidth="2"
            strokeDasharray="9 9"
          />

          {/* Reference axes */}
          <line
            x1={cx - 280}
            y1={cy}
            x2={cx + 330}
            y2={cy}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <line
            x1={cx}
            y1={cy - 285}
            x2={cx}
            y2={cy + 285}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Three phase phasors */}
          <line
            x1={cx}
            y1={cy}
            x2={redTip.x}
            y2={redTip.y}
            stroke={red}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowRed)"
          />

          <line
            x1={cx}
            y1={cy}
            x2={blueTip.x}
            y2={blueTip.y}
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />

          <line
            x1={cx}
            y1={cy}
            x2={yellowTip.x}
            y2={yellowTip.y}
            stroke={yellow}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowYellow)"
          />

          {/* Center point */}
          <circle cx={cx} cy={cy} r="8" fill="white" stroke={dark} strokeWidth="2.5" />

          {/* 120 degree arcs */}
          <path
            d={arcPath(0, 120, 100)}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <path
            d={arcPath(120, 240, 125)}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />
          <path
            d={arcPath(240, 360, 95)}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <text x={cx + 70} y={cy - 112} style={smallTextStyle}>
            120°
          </text>
          <text x={cx - 212} y={cy + 12} style={smallTextStyle}>
            120°
          </text>
          <text x={cx + 28} y={cy + 125} style={smallTextStyle}>
            120°
          </text>

          {/* Phase labels */}
          <text x={redTip.x - 15} y={redTip.y - 32} style={{ ...textStyle, fill: red }}>
            Red
          </text>
          <text x={redTip.x + 15} y={redTip.y + 22} style={{ ...smallTextStyle, fill: red }}>
            ωt
          </text>

          <text x={blueTip.x - 95} y={blueTip.y - 28} style={{ ...textStyle, fill: blue }}>
            Blue
          </text>
          <text x={blueTip.x - 14} y={blueTip.y + 45} style={{ ...smallTextStyle, fill: blue }}>
            ωt
          </text>

          <text x={yellowTip.x - 20} y={yellowTip.y + 65} style={{ ...textStyle, fill: "#8c7600" }}>
            Yellow
          </text>
          <text x={yellowTip.x + 5} y={yellowTip.y - 28} style={{ ...smallTextStyle, fill: "#8c7600" }}>
            ωt
          </text>

          {/* Current labels near phasors */}
          <text x={cx + 138} y={cy - 18} style={{ ...smallTextStyle, fill: red }}>
            I<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          <text x={cx - 112} y={cy - 118} style={{ ...smallTextStyle, fill: blue }}>
            I<tspan baselineShift="sub" fontSize="15">B</tspan>
          </text>

          <text x={cx - 105} y={cy + 145} style={{ ...smallTextStyle, fill: "#8c7600" }}>
            I<tspan baselineShift="sub" fontSize="15">Y</tspan>
          </text>

          {/* Direction of rotation */}
          <path
            d="M 622 105 C 675 55, 765 80, 790 158"
            fill="none"
            stroke={dark}
            strokeWidth="2.8"
            markerEnd="url(#arrowDark)"
          />
          <text x="655" y="190" style={textStyle}>
            Direction
          </text>
          <text x="662" y="222" style={textStyle}>
            of Rotation
          </text>
          <text x="800" y="135" style={textStyle}>
            ω
          </text>

          {/* Small phase-sequence note */}
          <rect
            x="570"
            y="470"
            width="255"
            height="95"
            rx="8"
            fill="white"
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <text x="590" y="505" style={tinyTextStyle}>
            Balanced three-phase phasors
          </text>
          <text x="590" y="532" style={tinyTextStyle}>
            are separated by 120°.
          </text>

          {/* Caption */}
          <text x="215" y="665" style={textStyle}>
            Three-phase Phasor Diagrams
          </text>
        </svg>
      </div>
    </main>
  );
}
