export default function GraphicalAdditionSubtraction() {
  const axisStroke = 2.4;
  const gridStroke = 1.4;

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

  const blue = "#2f67ad";
  const purple = "#9b4fd8";

  const ArrowHead = ({
    x,
    y,
    angle,
    color = "black",
    size = 13,
  }: {
    x: number;
    y: number;
    angle: number;
    color?: string;
    size?: number;
  }) => {
    const rad = (angle * Math.PI) / 180;
    const left = rad + (150 * Math.PI) / 180;
    const right = rad - (150 * Math.PI) / 180;

    const x2 = x + size * Math.cos(left);
    const y2 = y + size * Math.sin(left);
    const x3 = x + size * Math.cos(right);
    const y3 = y + size * Math.sin(right);

    return (
      <polygon
        points={`${x},${y} ${x2},${y2} ${x3},${y3}`}
        fill={color}
        stroke={color}
        strokeWidth="1.3"
      />
    );
  };

  const Axis = ({
    ox,
    oy,
    scale,
    xMin,
    xMax,
    yMin,
    yMax,
    width,
    height,
  }: {
    ox: number;
    oy: number;
    scale: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    width: number;
    height: number;
  }) => {
    const toX = (x: number) => ox + x * scale;
    const toY = (y: number) => oy - y * scale;

    return (
      <>
        {/* axes */}
        <line
          x1={ox - width}
          y1={oy}
          x2={ox + width}
          y2={oy}
          stroke="black"
          strokeWidth={axisStroke}
        />
        <ArrowHead x={ox + width} y={oy} angle={0} />

        <line
          x1={ox}
          y1={oy + height}
          x2={ox}
          y2={oy - height}
          stroke="black"
          strokeWidth={axisStroke}
        />
        <ArrowHead x={ox} y={oy - height} angle={-90} />
        <ArrowHead x={ox} y={oy + height} angle={90} />

        {/* ticks on real axis */}
        {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map((v) => (
          <g key={`x-${ox}-${v}`}>
            <line
              x1={toX(v)}
              y1={oy - 7}
              x2={toX(v)}
              y2={oy + 7}
              stroke="black"
              strokeWidth={gridStroke}
            />
            {v !== 0 && (
              <text x={toX(v)} y={oy + 25} textAnchor="middle" style={tinyTextStyle}>
                {v}
              </text>
            )}
          </g>
        ))}

        {/* ticks on imaginary axis */}
        {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((v) => (
          <g key={`y-${ox}-${v}`}>
            <line
              x1={ox - 7}
              y1={toY(v)}
              x2={ox + 7}
              y2={toY(v)}
              stroke="black"
              strokeWidth={gridStroke}
            />
            {v !== 0 && (
              <text x={ox - 15} y={toY(v) + 5} textAnchor="end" style={tinyTextStyle}>
                {v}
              </text>
            )}
          </g>
        ))}

        <text x={ox - 16} y={oy + 22} style={tinyTextStyle}>
          0
        </text>
        <text x={ox - 14} y={oy - height - 12} style={textStyle}>
          +j
        </text>
        <text x={ox - 11} y={oy + height + 28} style={textStyle}>
          −j
        </text>
      </>
    );
  };

  const Vector = ({
    x1,
    y1,
    x2,
    y2,
    ox,
    oy,
    scale,
    color,
    label,
    labelDx = 0,
    labelDy = 0,
    strokeWidth = 4,
    dashed = false,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    ox: number;
    oy: number;
    scale: number;
    color: string;
    label?: string;
    labelDx?: number;
    labelDy?: number;
    strokeWidth?: number;
    dashed?: boolean;
  }) => {
    const sx = ox + x1 * scale;
    const sy = oy - y1 * scale;
    const ex = ox + x2 * scale;
    const ey = oy - y2 * scale;
    const angle = (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;

    return (
      <>
        <line
          x1={sx}
          y1={sy}
          x2={ex}
          y2={ey}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashed ? "8 7" : undefined}
        />
        <ArrowHead x={ex} y={ey} angle={angle} color={color} size={14} />
        {label && (
          <text x={ex + labelDx} y={ey + labelDy} style={{ ...textStyle, fill: color }}>
            {label}
          </text>
        )}
      </>
    );
  };

  const GuideLine = ({
    x1,
    y1,
    x2,
    y2,
    ox,
    oy,
    scale,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    ox: number;
    oy: number;
    scale: number;
  }) => (
    <line
      x1={ox + x1 * scale}
      y1={oy - y1 * scale}
      x2={ox + x2 * scale}
      y2={oy - y2 * scale}
      stroke="black"
      strokeWidth="2"
      strokeDasharray="8 7"
    />
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1200 600"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Graphical Representation of Addition and Subtraction</title>
          <desc id="desc">
            Two complex-plane diagrams showing graphical addition A plus B and
            subtraction A minus B using vector arrows.
          </desc>

          <rect width="1200" height="600" fill="white" />

          <text x="600" y="36" textAnchor="middle" style={titleStyle}>
            Graphical Representation of Addition and Subtraction
          </text>

          {/* ================= Left panel: Addition ================= */}
          <g>
            <Axis
              ox={200}
              oy={350}
              scale={38}
              xMin={-2}
              xMax={7}
              yMin={-6}
              yMax={6}
              width={240}
              height={260}
            />

            {/* A = 4 + j1 */}
            <Vector
              x1={0}
              y1={0}
              x2={4}
              y2={1}
              ox={200}
              oy={350}
              scale={38}
              color={blue}
              label="A"
              labelDx={8}
              labelDy={-6}
            />

            {/* B = 2 + j3 */}
            <Vector
              x1={0}
              y1={0}
              x2={2}
              y2={3}
              ox={200}
              oy={350}
              scale={38}
              color={blue}
              label="B"
              labelDx={-28}
              labelDy={-12}
            />

            {/* B translated to head of A */}
            <Vector
              x1={4}
              y1={1}
              x2={6}
              y2={4}
              ox={200}
              oy={350}
              scale={38}
              color={purple}
              strokeWidth={3.5}
            />

            {/* A translated to head of B, light construction */}
            <Vector
              x1={2}
              y1={3}
              x2={6}
              y2={4}
              ox={200}
              oy={350}
              scale={38}
              color={purple}
              strokeWidth={3}
              dashed
            />

            {/* Resultant */}
            <Vector
              x1={0}
              y1={0}
              x2={6}
              y2={4}
              ox={200}
              oy={350}
              scale={38}
              color={purple}
              label="A+B = 6 + j4"
              labelDx={-58}
              labelDy={-24}
              strokeWidth={4.2}
            />

            <text x="350" y="90" textAnchor="middle" style={textStyle}>
              (addition)
            </text>

            {/* angle mark */}
            <path
              d="M 292 350 A 90 90 0 0 0 275 310"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <text x="302" y="325" style={smallTextStyle}>
              θ
            </text>
          </g>

          {/* ================= Right panel: Subtraction ================= */}
          <g>
            <Axis
              ox={780}
              oy={350}
              scale={38}
              xMin={-4}
              xMax={7}
              yMin={-6}
              yMax={6}
              width={270}
              height={260}
            />

            {/* A = 4 + j1 */}
            <Vector
              x1={0}
              y1={0}
              x2={4}
              y2={1}
              ox={780}
              oy={350}
              scale={38}
              color={blue}
              label="A"
              labelDx={-5}
              labelDy={-18}
            />

            {/* B shown as comparison vector, drawn into 3rd quadrant like reference */}
            <Vector
              x1={0}
              y1={0}
              x2={-2}
              y2={-3}
              ox={780}
              oy={350}
              scale={38}
              color={blue}
              label="B"
              labelDx={-20}
              labelDy={22}
            />

            <text x={780 - 2 * 38 - 12} y={350 + 3 * 38 + 40} style={smallTextStyle}>
              (compared)
            </text>

            {/* Result A - B = 2 - j2 */}
            <Vector
              x1={0}
              y1={0}
              x2={2}
              y2={-2}
              ox={780}
              oy={350}
              scale={38}
              color={purple}
              label="A−B = 2−j2"
              labelDx={8}
              labelDy={20}
              strokeWidth={4.2}
            />

            {/* Subtraction construction line from A to result */}
            <GuideLine x1={4} y1={1} x2={2} y2={-2} ox={780} oy={350} scale={38} />

            <text x="930" y="535" textAnchor="middle" style={smallTextStyle}>
              (subtraction)
            </text>
          </g>
        </svg>
      </div>
    </main>
  );
}
