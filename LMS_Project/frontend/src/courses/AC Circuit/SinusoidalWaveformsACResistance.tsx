export default function SinusoidalWaveformsACResistance() {
  const axisStroke = 2.5;
  const waveStroke = 5;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fontWeight: 600,
    fill: "black",
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 19,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: "black",
  };

  const blueStroke = "#2f67ad";
  const blueFill = "#dce8f6";
  const purpleStroke = "#7534ad";
  const purpleFill = "#d8cbe7";
  const labelBlue = "#2f67ad";
  const labelPurple = "#7534ad";

  const ArrowHead = ({
    x,
    y,
    direction,
    fill = "white",
    stroke = "black",
  }: {
    x: number;
    y: number;
    direction: "right" | "left" | "up" | "down";
    fill?: string;
    stroke?: string;
  }) => {
    let points = "";

    if (direction === "right") {
      points = `${x},${y} ${x - 12},${y - 7} ${x - 12},${y + 7}`;
    } else if (direction === "left") {
      points = `${x},${y} ${x + 12},${y - 7} ${x + 12},${y + 7}`;
    } else if (direction === "up") {
      points = `${x},${y} ${x - 7},${y + 12} ${x + 7},${y + 12}`;
    } else {
      points = `${x},${y} ${x - 7},${y - 12} ${x + 7},${y - 12}`;
    }

    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1.6" />;
  };

  const x0 = 80;
  const y0 = 245;
  const startX = 82;
  const cycle = 630;
  const vrAmp = 155;
  const irAmp = 95;

  const sinePath = (amp: number) => `
    M ${startX} ${y0}
    C ${startX + cycle * 0.125} ${y0 - amp},
      ${startX + cycle * 0.375} ${y0 - amp},
      ${startX + cycle * 0.5} ${y0}
    C ${startX + cycle * 0.625} ${y0 + amp},
      ${startX + cycle * 0.875} ${y0 + amp},
      ${startX + cycle} ${y0}
  `;

  const areaPath = (amp: number) => `
    ${sinePath(amp)}
    L ${startX + cycle} ${y0}
    L ${startX} ${y0}
    Z
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 980 620"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Sinusoidal Waveforms for AC Resistance</title>
          <desc id="desc">
            Voltage and current sinusoidal waveforms for a pure AC resistance.
            The voltage waveform has greater amplitude than the current waveform,
            and both are in phase.
          </desc>

          <rect width="980" height="620" fill="white" />

          <text x="490" y="42" textAnchor="middle" style={titleStyle}>
            Sinusoidal Waveforms for AC Resistance
          </text>

          {/* Axes */}
          <line x1={x0} y1="65" x2={x0} y2="535" stroke="black" strokeWidth={axisStroke} />
          <ArrowHead x={x0} y={65} direction="up" fill="white" stroke="black" />

          <line x1={x0} y1={y0} x2="885" y2={y0} stroke="black" strokeWidth={axisStroke} />
          <ArrowHead x={885} y={y0} direction="right" fill="white" stroke="black" />

          {/* Top reference lines */}
          <line x1={x0} y1={y0 - vrAmp} x2="390" y2={y0 - vrAmp} stroke="black" strokeWidth="2" strokeDasharray="9 7" />
          <line x1={x0} y1={y0 - irAmp} x2="255" y2={y0 - irAmp} stroke="black" strokeWidth="2" strokeDasharray="9 7" />

          {/* Tick labels on vertical axis */}
          <text x="42" y={y0 - vrAmp + 8} style={smallTextStyle}>V<tspan baselineShift="sub" fontSize="14">R</tspan></text>
          <text x="42" y={y0 - irAmp + 8} style={smallTextStyle}>I<tspan baselineShift="sub" fontSize="14">R</tspan></text>
          <text x="52" y={y0 + 8} style={smallTextStyle}>0</text>

          {/* Waveform areas */}
          <path d={areaPath(vrAmp)} fill={blueFill} opacity="0.96" />
          <path d={areaPath(irAmp)} fill={purpleFill} opacity="0.78" />

          {/* Waveform strokes */}
          <path
            d={sinePath(vrAmp)}
            fill="none"
            stroke={blueStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={sinePath(irAmp)}
            fill="none"
            stroke={purpleStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Zero crossing markers */}
          <circle cx={startX} cy={y0} r="4.5" fill="white" stroke="black" strokeWidth="1.8" />
          <circle cx={startX + cycle} cy={y0} r="4.5" fill="white" stroke="black" strokeWidth="1.8" />

          {/* X-axis ticks and labels */}
          {[
            { x: startX + cycle * 0.25, label: "π/2", y: y0 + 32 },
            { x: startX + cycle * 0.5, label: "π", y: y0 - 18 },
            { x: startX + cycle * 0.75, label: "3π/2", y: y0 - 18 },
            { x: startX + cycle, label: "2π", y: y0 - 18 },
          ].map((tick) => (
            <g key={tick.label}>
              <line x1={tick.x} y1={y0 - 9} x2={tick.x} y2={y0 + 9} stroke="black" strokeWidth="2" />
              <text x={tick.x} y={tick.y} textAnchor="middle" style={textStyle}>
                {tick.label}
              </text>
            </g>
          ))}

          {/* Right-side axis label */}
          <text x="897" y={y0 + 8} style={smallTextStyle}>
            θ(rad)
          </text>

          {/* Formula boxes */}
          <rect x="500" y="74" width="360" height="58" fill="#eef2f7" stroke="black" strokeWidth="1.5" />
          <text x="522" y="111" style={{ ...textStyle, fill: labelBlue }}>
            V<tspan baselineShift="sub" fontSize="16">R(t)</tspan> = R·I
            <tspan baselineShift="sub" fontSize="16">m</tspan>sin(ωt)
          </text>

          <rect x="500" y="155" width="360" height="58" fill="#efeaf4" stroke="black" strokeWidth="1.5" />
          <text x="522" y="192" style={{ ...textStyle, fill: labelPurple }}>
            I<tspan baselineShift="sub" fontSize="16">R(t)</tspan> = I
            <tspan baselineShift="sub" fontSize="16">m</tspan>sin(ωt)
          </text>

          {/* Leader arrows to waveforms */}
          <line x1="500" y1="104" x2="300" y2="145" stroke="black" strokeWidth="2" markerEnd="url(#arrowHead)" />
          <line x1="500" y1="184" x2="330" y2="205" stroke="black" strokeWidth="2" markerEnd="url(#arrowHead2)" />

          <defs>
            <marker
              id="arrowHead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
            <marker
              id="arrowHead2"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          {/* Dashed line at 2π */}
          <line
            x1={startX + cycle}
            y1={y0}
            x2={startX + cycle}
            y2="465"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="9 7"
          />

          {/* Bottom period arrow */}
          <line x1={82} y1="500" x2={startX + cycle} y2="500" stroke="black" strokeWidth="2" />
          <ArrowHead x={82} y={500} direction="left" fill="white" stroke="black" />
          <ArrowHead x={startX + cycle} y={500} direction="right" fill="white" stroke="black" />

          <text x="395" y="545" textAnchor="middle" style={textStyle}>
            T = <tspan fontStyle="italic">1</tspan>
          </text>
          <text x="455" y="565" textAnchor="middle" style={smallTextStyle}>
            f
          </text>
        </svg>
      </div>
    </main>
  );
}
