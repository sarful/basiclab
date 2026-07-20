export default function PhaseRelationshipSinusoidalWaveform() {
  const axisStroke = 2.5;
  const waveStroke = 4;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
    fontWeight: 600,
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 21,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
    fill: "black",
  };

  const formulaStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "#1f5fa8",
  };

  const blue = "#1f5fa8";
  const fillBlue = "#dbe6f2";
  const formulaFill = "#fff5c8";

  const sinePath = (
    startX: number,
    midY: number,
    amp: number,
    period: number,
    phase = 0
  ) => {
    const x0 = startX + phase;
    const p = period;
    const a = amp;
    const y = midY;

    return `
      M ${x0} ${y}
      C ${x0 + p * 0.125} ${y - a}, ${x0 + p * 0.375} ${y - a}, ${
        x0 + p * 0.5
      } ${y}
      C ${x0 + p * 0.625} ${y + a}, ${x0 + p * 0.875} ${y + a}, ${
        x0 + p
      } ${y}
    `;
  };

  const areaPath = (
    startX: number,
    midY: number,
    amp: number,
    period: number,
    phase = 0
  ) => {
    const x0 = startX + phase;
    return `${sinePath(startX, midY, amp, period, phase)} L ${
      x0 + period
    } ${midY} L ${x0} ${midY} Z`;
  };

  const ArrowHead = ({
    x,
    y,
    direction,
  }: {
    x: number;
    y: number;
    direction: "right" | "left" | "up" | "down";
  }) => {
    let points = "";

    if (direction === "right") {
      points = `${x},${y} ${x - 12},${y - 6} ${x - 12},${y + 6}`;
    } else if (direction === "left") {
      points = `${x},${y} ${x + 12},${y - 6} ${x + 12},${y + 6}`;
    } else if (direction === "up") {
      points = `${x},${y} ${x - 6},${y + 12} ${x + 6},${y + 12}`;
    } else {
      points = `${x},${y} ${x - 6},${y - 12} ${x + 6},${y - 12}`;
    }

    return <polygon points={points} fill="white" stroke="black" strokeWidth="2" />;
  };

  const Axis = ({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    return (
      <>
        <line
          x1={x}
          y1={y - height}
          x2={x}
          y2={y + height}
          stroke="black"
          strokeWidth={axisStroke}
        />
        <line
          x1={x}
          y1={y}
          x2={x + width}
          y2={y}
          stroke="black"
          strokeWidth={axisStroke}
        />
        <ArrowHead x={x + width} y={y} direction="right" />

        <text x={x + width - 5} y={y - 15} style={smallTextStyle}>
          t
        </text>

        <text x={x - 25} y={y + 8} style={smallTextStyle}>
          0
        </text>

        <line
          x1={x - 7}
          y1={y - height + 20}
          x2={x + 7}
          y2={y - height + 20}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={x - 7}
          y1={y + height - 20}
          x2={x + 7}
          y2={y + height - 20}
          stroke="black"
          strokeWidth="2"
        />

        <text x={x + 55} y={y - height + 22} style={smallTextStyle}>
          Aₘ
        </text>
        <text x={x + 255} y={y + height - 6} style={smallTextStyle}>
          −Aₘ
        </text>
      </>
    );
  };

  const PhaseAngle = ({
    x1,
    x2,
    y,
    label,
  }: {
    x1: number;
    x2: number;
    y: number;
    label: string;
  }) => {
    return (
      <>
        <line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="black"
          strokeWidth="2"
        />
        <ArrowHead x={x1} y={y} direction="left" />
        <ArrowHead x={x2} y={y} direction="right" />
        <line x1={x1} y1={y - 8} x2={x1} y2={y + 8} stroke="black" strokeWidth="2" />
        <line x1={x2} y1={y - 8} x2={x2} y2={y + 8} stroke="black" strokeWidth="2" />
        <text x={(x1 + x2) / 2} y={y + 25} textAnchor="middle" style={smallTextStyle}>
          {label}
        </text>
      </>
    );
  };

  const Panel = ({
    x,
    title,
    formula,
    phase,
    phaseLabel,
    phaseType,
  }: {
    x: number;
    title: string;
    formula: string;
    phase: number;
    phaseLabel?: string;
    phaseType: "zero" | "positive" | "negative";
  }) => {
    const axisX = x + 65;
    const axisY = 165;
    const width = 320;
    const amp = 95;
    const period = 280;

    return (
      <g>
        <text x={x + 210} y="35" textAnchor="middle" style={titleStyle}>
          {title}
        </text>

        <Axis x={axisX} y={axisY} width={width} height={125} />

        <path d={areaPath(axisX, axisY, amp, period, phase)} fill={fillBlue} />
        <path
          d={sinePath(axisX, axisY, amp, period, phase)}
          fill="none"
          stroke={blue}
          strokeWidth={waveStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Reference vertical line through zero crossing */}
        <line
          x1={axisX + 140}
          y1={axisY - 115}
          x2={axisX + 140}
          y2={axisY + 115}
          stroke="black"
          strokeWidth="2"
          strokeDasharray="7 6"
        />

        {/* Amplitude arrow */}
        <line
          x1={axisX + 70}
          y1={axisY}
          x2={axisX + 70}
          y2={axisY - 95}
          stroke="black"
          strokeWidth="2"
        />
        <ArrowHead x={axisX + 70} y={axisY - 95} direction="up" />
        <text x={axisX + 86} y={axisY - 45} style={smallTextStyle}>
          Aₘ sin
        </text>

        {/* Angle / time notation */}
        <text x={axisX + 245} y={axisY - 55} style={smallTextStyle}>
          (ωt {phaseType === "positive" ? "+ φ" : phaseType === "negative" ? "− φ" : ""})
        </text>

        {phaseType === "zero" && (
          <>
            <line
              x1={axisX + 140}
              y1={axisY + 82}
              x2={axisX + 140}
              y2={axisY + 103}
              stroke="black"
              strokeWidth="2"
            />
            <text x={axisX + 128} y={axisY + 128} style={smallTextStyle}>
              0
            </text>
          </>
        )}

        {phaseType === "positive" && phaseLabel && (
          <>
            <PhaseAngle
              x1={axisX}
              x2={axisX + Math.abs(phase)}
              y={axisY + 100}
              label={phaseLabel}
            />
            <text x={axisX - 18} y={axisY + 128} style={smallTextStyle}>
              +φ
            </text>
          </>
        )}

        {phaseType === "negative" && phaseLabel && (
          <>
            <PhaseAngle
              x1={axisX}
              x2={axisX + Math.abs(phase)}
              y={axisY + 100}
              label={phaseLabel}
            />
            <text x={axisX - 18} y={axisY + 128} style={smallTextStyle}>
              −φ
            </text>
          </>
        )}

        {/* Formula box */}
        <rect
          x={x + 40}
          y="310"
          width="340"
          height="70"
          fill={formulaFill}
          stroke="black"
          strokeWidth="2"
        />
        <text x={x + 210} y="355" textAnchor="middle" style={formulaStyle}>
          {formula}
        </text>
      </g>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1200 410"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Phase Relationship of a Sinusoidal Waveform</title>
          <desc id="desc">
            Three sinusoidal waveform diagrams showing in-phase, positive
            phase, and negative phase relationships.
          </desc>

          <rect width="1200" height="410" fill="white" />

          <Panel
            x={0}
            title="In phase: (φ = 0°)"
            formula="A(t) = Aₘ sin(ωt)"
            phase={0}
            phaseType="zero"
          />

          <Panel
            x={400}
            title="Positive Phase: (+φ)"
            formula="A(t) = Aₘ sin(ωt+φ)"
            phase={-55}
            phaseLabel="φ"
            phaseType="positive"
          />

          <Panel
            x={800}
            title="Negative Phase: (−φ)"
            formula="A(t) = Aₘ sin(ωt−φ)"
            phase={55}
            phaseLabel="φ"
            phaseType="negative"
          />
        </svg>
      </div>
    </main>
  );
}
