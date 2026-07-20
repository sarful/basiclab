export default function ThreePhasePhasorDiagrams() {
  const stroke = 2.5;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fontWeight: 600,
    fill: "black",
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 15,
    fill: "black",
  };

  const cx = 340;
  const cy = 340;
  const r = 210;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  const polar = (angleDeg: number, radius: number) => {
    const a = degToRad(angleDeg);
    return {
      x: cx + radius * Math.cos(a),
      y: cy - radius * Math.sin(a),
    };
  };

  const ArrowHead = ({
    x,
    y,
    angle,
    color,
    size = 18,
  }: {
    x: number;
    y: number;
    angle: number;
    color: string;
    size?: number;
  }) => {
    const a = degToRad(angle);
    const backX = x - size * Math.cos(a);
    const backY = y + size * Math.sin(a);

    const leftA = degToRad(angle + 150);
    const rightA = degToRad(angle - 150);

    const x2 = x + size * 0.7 * Math.cos(leftA);
    const y2 = y - size * 0.7 * Math.sin(leftA);
    const x3 = x + size * 0.7 * Math.cos(rightA);
    const y3 = y - size * 0.7 * Math.sin(rightA);

    return (
      <polygon
        points={`${x},${y} ${x2},${y2} ${x3},${y3}`}
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
    );
  };

  const Phasor = ({
    angle,
    color,
    length,
    label,
    subLabel,
    labelDx = 0,
    labelDy = 0,
  }: {
    angle: number;
    color: string;
    length: number;
    label: string;
    subLabel: string;
    labelDx?: number;
    labelDy?: number;
  }) => {
    const end = polar(angle, length);
    return (
      <>
        <line
          x1={cx}
          y1={cy}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <ArrowHead x={end.x} y={end.y} angle={angle} color={color} size={22} />
        <text
          x={end.x + labelDx}
          y={end.y + labelDy}
          style={{ ...textStyle, fill: color }}
        >
          {label}
        </text>
        <text
          x={end.x + labelDx}
          y={end.y + labelDy + 24}
          style={{ ...smallTextStyle, fill: color }}
        >
          {subLabel}
        </text>
      </>
    );
  };

  const ArcArrow = ({
    startAngle,
    endAngle,
    radius,
    label,
    labelX,
    labelY,
  }: {
    startAngle: number;
    endAngle: number;
    radius: number;
    label: string;
    labelX: number;
    labelY: number;
  }) => {
    const start = polar(startAngle, radius);
    const end = polar(endAngle, radius);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle > startAngle ? 0 : 1;

    const tangentAngle = endAngle + (sweep ? -90 : 90);

    return (
      <>
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`}
          fill="none"
          stroke="black"
          strokeWidth="2.2"
        />
        <ArrowHead x={end.x} y={end.y} angle={tangentAngle} color="black" size={12} />
        <text x={labelX} y={labelY} style={textStyle}>
          {label}
        </text>
      </>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 820 760"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Three-phase Phasor Diagrams</title>
          <desc id="desc">
            Three-phase phasor diagram showing red, blue, and yellow phase
            vectors separated by 120 degrees and the direction of rotation.
          </desc>

          <rect width="820" height="760" fill="white" />

          <text x="410" y="42" textAnchor="middle" style={titleStyle}>
            Three-phase Phasor Diagrams
          </text>

          {/* Origin */}
          <circle cx={cx} cy={cy} r="6" fill="white" stroke="black" strokeWidth={stroke} />
          <text x={cx - 18} y={cy - 12} style={smallTextStyle}>
            0
          </text>

          {/* Phasors */}
          <Phasor
            angle={0}
            color="#d61f1f"
            length={250}
            label="Red"
            subLabel="eᵣ"
            labelDx={18}
            labelDy={-6}
          />

          <Phasor
            angle={120}
            color="#2563eb"
            length={250}
            label="Blue"
            subLabel="eᵦ"
            labelDx={-28}
            labelDy={-12}
          />

          <Phasor
            angle={240}
            color="#e0b400"
            length={250}
            label="Yellow"
            subLabel="eᵧ"
            labelDx={-10}
            labelDy={30}
          />

          {/* Inner angle arcs */}
          <ArcArrow
            startAngle={0}
            endAngle={120}
            radius={95}
            label="120°"
            labelX={410}
            labelY={260}
          />

          <ArcArrow
            startAngle={120}
            endAngle={240}
            radius={115}
            label="120°"
            labelX={130}
            labelY={555}
          />

          <ArcArrow
            startAngle={240}
            endAngle={360}
            radius={95}
            label="120°"
            labelX={408}
            labelY={470}
          />

          {/* Small center annotations */}
          <text x={cx + 22} y={cy - 20} style={tinyTextStyle}>
            θ₀
          </text>
          <text x={cx + 34} y={cy + 4} style={tinyTextStyle}>
            sin
          </text>
          <text x={cx - 24} y={cy + 28} style={tinyTextStyle}>
            θ₀
          </text>
          <text x={cx - 10} y={cy + 50} style={tinyTextStyle}>
            sin
          </text>

          {/* Direction of rotation curved arrow */}
          <path
            d="M 580 110 A 110 110 0 0 1 665 245"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />
          <ArrowHead x={580} y={110} angle={145} color="black" size={15} />
          <text x="610" y="88" style={textStyle}>
            Clock
          </text>
          <text x="495" y="160" style={textStyle}>
            Direction
          </text>
          <text x="498" y="188" style={textStyle}>
            of rotation
          </text>
          <text x="615" y="120" style={textStyle}>
            ω
          </text>

          {/* Subtle guide circle around center for layout resemblance */}
          <circle
            cx={cx}
            cy={cy}
            r="7"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </main>
  );
}
