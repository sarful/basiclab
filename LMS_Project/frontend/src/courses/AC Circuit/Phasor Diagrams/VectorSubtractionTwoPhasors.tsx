export default function VectorSubtractionTwoPhasors() {
  const width = 1000;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const orange = "#e67e22";
  const gray = "#777777";
  const lightAngle = "#f4efe8";

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

  const origin = { x: 70, y: 430 };
  const v2Tip = { x: 650, y: 430 };
  const v1Tip = { x: 255, y: 95 };
  const topRight = { x: 870, y: 95 };

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
          <title id="title">Vector Subtraction of Two Phasors</title>
          <desc id="desc">
            Textbook-style phasor diagram showing the vector subtraction of two
            phasors, where the resultant vector is VR equals V1 minus V2.
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
              id="arrowOrange"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={orange} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Origin */}
          <circle
            cx={origin.x}
            cy={origin.y}
            r="7"
            fill="white"
            stroke={dark}
            strokeWidth="2.5"
          />
          <text x={origin.x - 32} y={origin.y + 10} style={smallTextStyle}>
            0
          </text>

          {/* V2 reference phasor */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={v2Tip.x}
            y2={v2Tip.y}
            stroke={orange}
            strokeWidth="6"
            strokeLinecap="round"
            markerEnd="url(#arrowOrange)"
          />

          <text x="410" y="468" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="16">2</tspan> sin(ωt)
          </text>

          {/* V1 phasor */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={v1Tip.x}
            y2={v1Tip.y}
            stroke={orange}
            strokeWidth="6"
            strokeLinecap="round"
            markerEnd="url(#arrowOrange)"
          />

          <text x="195" y="62" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="16">1</tspan> sin(ωt + θ)
          </text>

          <text
            x="130"
            y="265"
            style={smallTextStyle}
            transform="rotate(-61 130 265)"
          >
            V<tspan baselineShift="sub" fontSize="12">1</tspan>
          </text>

          {/* Resultant subtraction vector from V2 tip to V1 tip */}
          <line
            x1={v2Tip.x}
            y1={v2Tip.y}
            x2={v1Tip.x}
            y2={v1Tip.y}
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />

          <text
            x="415"
            y="255"
            style={textStyle}
            transform="rotate(-140 415 255)"
          >
            V<tspan baselineShift="sub" fontSize="16">R</tspan> = V
            <tspan baselineShift="sub" fontSize="16">1</tspan> − V
            <tspan baselineShift="sub" fontSize="16">2</tspan>
          </text>

          {/* Construction lines */}
          <line
            x1={v1Tip.x}
            y1={v1Tip.y}
            x2={topRight.x}
            y2={topRight.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="18 13"
          />

          <line
            x1={v2Tip.x}
            y1={v2Tip.y}
            x2={topRight.x}
            y2={topRight.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="18 13"
          />

          {/* Small construction plus sign at top */}
          <line x1="430" y1="83" x2="430" y2="115" stroke={dark} strokeWidth="3" />
          <line x1="414" y1="99" x2="446" y2="99" stroke={dark} strokeWidth="3" />

          {/* Small axis mark on V2 */}
          <line x1="420" y1="410" x2="420" y2="450" stroke={dark} strokeWidth="3" />

          {/* Angle area */}
          <path
            d={`M ${origin.x + 115} ${origin.y} A 115 115 0 0 0 ${
              origin.x + 58
            } ${origin.y - 99} L ${origin.x} ${origin.y} Z`}
            fill={lightAngle}
            opacity="0.9"
            stroke="none"
          />

          <path
            d={`M ${origin.x + 125} ${origin.y} A 125 125 0 0 0 ${
              origin.x + 64
            } ${origin.y - 108}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <text x="165" y="352" style={textStyle}>
            ϕ
          </text>

          {/* Right angle / subtraction construction guide */}
          <line
            x1={v2Tip.x}
            y1={v2Tip.y}
            x2={v2Tip.x + 35}
            y2={v2Tip.y - 52}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          <text
            x="690"
            y="285"
            style={smallTextStyle}
            transform="rotate(-58 690 285)"
          >
            −V<tspan baselineShift="sub" fontSize="12">2</tspan>
          </text>

          {/* Rotation arrow */}
          <path
            d="M 850 55 C 880 8, 942 24, 952 90"
            fill="none"
            stroke={dark}
            strokeWidth="2.6"
            markerEnd="url(#arrowDark)"
          />
          <text x="925" y="62" style={textStyle}>
            ω
          </text>

          {/* Top-right small reference tick */}
          <line
            x1="868"
            y1="95"
            x2="910"
            y2="73"
            stroke={dark}
            strokeWidth="2"
          />

          {/* Caption */}
          <text x="235" y="525" style={textStyle}>
            Vector Subtraction of Two Phasors
          </text>

          <text x="610" y="505" style={tinyTextStyle}>
            Resultant vector is drawn from the tip of V₂ to the tip of V₁.
          </text>
        </svg>
      </div>
    </main>
  );
}
