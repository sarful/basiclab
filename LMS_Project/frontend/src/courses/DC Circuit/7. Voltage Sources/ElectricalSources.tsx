export default function ElectricalSources() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 22,
    fontWeight: "bold",
  };

  const sourceCircle = (cx: number, cy: number) => (
    <circle
      cx={cx}
      cy={cy}
      r="38"
      fill="white"
      stroke="black"
      strokeWidth={stroke}
    />
  );

  const sinePath = (
    startX: number,
    centerY: number,
    amplitude: number,
    wavelength: number,
    cycles: number
  ) => {
    let d = `M ${startX} ${centerY}`;
    const totalSteps = 160;
    const totalWidth = wavelength * cycles;

    for (let i = 0; i <= totalSteps; i += 1) {
      const x = startX + (totalWidth * i) / totalSteps;
      const angle = (2 * Math.PI * cycles * i) / totalSteps;
      const y = centerY - amplitude * Math.sin(angle);
      d += ` L ${x} ${y}`;
    }

    return d;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 760"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Electrical Sources</title>
          <desc id="desc">
            Black and white textbook style diagram of electrical sources:
            constant voltage source, alternating voltage source, and constant
            current source with their characteristic graphs.
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
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          <rect width="1000" height="760" fill="white" />

          {/* ================= CONSTANT VOLTAGE SOURCE ================= */}
          <g>
            {/* Left ANSI voltage source symbol */}
            <line
              x1="95"
              y1="118"
              x2="95"
              y2="58"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="194"
              x2="95"
              y2="254"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {sourceCircle(95, 156)}

            <text x="82" y="147" style={smallStyle}>
              +
            </text>
            <text x="84" y="178" style={smallStyle}>
              −
            </text>

            <text x="30" y="166" style={labelStyle}>
              Vₛ
            </text>

            <text x="170" y="164" style={labelStyle}>
              vₛ
            </text>

            {/* Small source terminal current and voltage directions */}
            <line
              x1="95"
              y1="40"
              x2="180"
              y2="40"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="128" y="28" style={smallStyle}>
              i
            </text>

            <line
              x1="150"
              y1="62"
              x2="185"
              y2="62"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="188" y="68" style={smallStyle}>
              v
            </text>

            <line
              x1="95"
              y1="274"
              x2="180"
              y2="274"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="128" y="262" style={smallStyle}>
              i
            </text>

            <line
              x1="150"
              y1="296"
              x2="185"
              y2="296"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="188" y="302" style={smallStyle}>
              v
            </text>

            {/* Right graph */}
            <text x="630" y="48" textAnchor="middle" style={titleStyle}>
              Constant Voltage Source
            </text>

            <line
              x1="480"
              y1="205"
              x2="880"
              y2="205"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />
            <line
              x1="500"
              y1="230"
              x2="500"
              y2="70"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <line
              x1="500"
              y1="110"
              x2="845"
              y2="110"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="500"
              y1="110"
              x2="500"
              y2="205"
              stroke="black"
              strokeWidth="1.8"
              strokeDasharray="7 7"
            />

            <text x="465" y="112" style={smallStyle}>
              Vₛ
            </text>
            <text x="455" y="210" style={smallStyle}>
              0
            </text>
            <text x="865" y="228" style={smallStyle}>
              i(A)
            </text>
            <text x="512" y="85" style={smallStyle}>
              v
            </text>
          </g>

          {/* Divider */}
          <line
            x1="40"
            y1="292"
            x2="960"
            y2="292"
            stroke="black"
            strokeWidth="1.2"
            strokeDasharray="8 8"
          />

          {/* ================= ALTERNATING VOLTAGE SOURCE ================= */}
          <g>
            {/* Left ANSI AC source symbol */}
            <line
              x1="95"
              y1="375"
              x2="95"
              y2="315"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="451"
              x2="95"
              y2="511"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {sourceCircle(95, 413)}

            <path
              d="M 65 413 C 75 388, 88 388, 95 413 C 105 438, 118 438, 128 413"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <text x="10" y="424" style={smallStyle}>
              vᵢₙ = Vₘ cos(ωt)
            </text>

            <text x="170" y="421" style={labelStyle}>
              v₀
            </text>

            <line
              x1="95"
              y1="300"
              x2="180"
              y2="300"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="128" y="288" style={smallStyle}>
              i(t)
            </text>

            <line
              x1="150"
              y1="322"
              x2="185"
              y2="322"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="188" y="328" style={smallStyle}>
              v
            </text>

            <line
              x1="95"
              y1="528"
              x2="180"
              y2="528"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="128" y="516" style={smallStyle}>
              i(t)
            </text>

            <line
              x1="150"
              y1="550"
              x2="185"
              y2="550"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="188" y="556" style={smallStyle}>
              v
            </text>

            {/* Right graph */}
            <text x="710" y="330" textAnchor="middle" style={titleStyle}>
              Alternating Voltage
            </text>
            <text x="710" y="356" textAnchor="middle" style={titleStyle}>
              Source
            </text>

            <line
              x1="470"
              y1="455"
              x2="885"
              y2="455"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />
            <line
              x1="500"
              y1="550"
              x2="500"
              y2="340"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <path
              d={sinePath(500, 455, 75, 120, 2.5)}
              fill="none"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="500"
              y1="380"
              x2="820"
              y2="380"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <line
              x1="500"
              y1="530"
              x2="820"
              y2="530"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            <line
              x1="620"
              y1="455"
              x2="620"
              y2="380"
              stroke="black"
              strokeWidth="1.7"
              strokeDasharray="6 6"
            />
            <line
              x1="740"
              y1="455"
              x2="740"
              y2="380"
              stroke="black"
              strokeWidth="1.7"
              strokeDasharray="6 6"
            />

            <text x="455" y="382" style={smallStyle}>
              +Vₘ
            </text>
            <text x="455" y="535" style={smallStyle}>
              −Vₘ
            </text>
            <text x="462" y="458" style={smallStyle}>
              0
            </text>
            <text x="610" y="478" style={smallStyle}>
              T
            </text>
            <text x="722" y="478" style={smallStyle}>
              2π/ω
            </text>
            <text x="865" y="480" style={smallStyle}>
              t
            </text>
            <text x="512" y="350" style={smallStyle}>
              v
            </text>
          </g>

          {/* Divider */}
          <line
            x1="40"
            y1="570"
            x2="960"
            y2="570"
            stroke="black"
            strokeWidth="1.2"
            strokeDasharray="8 8"
          />

          {/* ================= CONSTANT CURRENT SOURCE ================= */}
          <g>
            {/* Left ANSI current source symbol */}
            <line
              x1="95"
              y1="655"
              x2="95"
              y2="595"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="731"
              x2="95"
              y2="745"
              stroke="black"
              strokeWidth={stroke}
              strokeLinecap="round"
            />

            {sourceCircle(95, 693)}

            <line
              x1="95"
              y1="720"
              x2="95"
              y2="668"
              stroke="black"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />

            <text x="40" y="702" style={labelStyle}>
              iₛ
            </text>

            <text x="170" y="702" style={labelStyle}>
              v
            </text>

            <line
              x1="95"
              y1="580"
              x2="180"
              y2="580"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="128" y="568" style={smallStyle}>
              i(t)
            </text>

            <line
              x1="150"
              y1="602"
              x2="185"
              y2="602"
              stroke="black"
              strokeWidth="2.3"
              markerEnd="url(#arrow)"
            />
            <text x="188" y="608" style={smallStyle}>
              v
            </text>

            {/* Right graph */}
            <text x="665" y="606" textAnchor="middle" style={titleStyle}>
              Constant Current Source
            </text>

            <line
              x1="480"
              y1="725"
              x2="880"
              y2="725"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />
            <line
              x1="500"
              y1="738"
              x2="500"
              y2="620"
              stroke="black"
              strokeWidth={stroke}
              markerEnd="url(#arrow)"
            />

            <line
              x1="500"
              y1="650"
              x2="845"
              y2="650"
              stroke="black"
              strokeWidth={stroke}
            />

            <line
              x1="500"
              y1="650"
              x2="500"
              y2="725"
              stroke="black"
              strokeWidth="1.8"
              strokeDasharray="7 7"
            />

            <text x="468" y="654" style={smallStyle}>
              iₛ
            </text>
            <text x="455" y="730" style={smallStyle}>
              0
            </text>
            <text x="865" y="748" style={smallStyle}>
              v
            </text>
            <text x="512" y="632" style={smallStyle}>
              i
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
