export default function PhasorAdditionTwoRotatingPhasors() {
  const width = 1000;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const orange = "#e67e22";
  const gray = "#777777";

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
  const resultantTip = { x: 870, y: 95 };

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
          <title id="title">Phasor Addition of Two Rotating Phasors</title>
          <desc id="desc">
            SVG phasor diagram showing the addition of two rotating phasors,
            V1 and V2, forming the resultant phasor VR equals V1 plus V2.
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
          <text x={origin.x - 28} y={origin.y + 10} style={smallTextStyle}>
            0
          </text>

          {/* V2 phasor */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={v2Tip.x}
            y2={v2Tip.y}
            stroke={orange}
            strokeWidth="6"
            markerEnd="url(#arrowOrange)"
            strokeLinecap="round"
          />

          <text x="315" y="468" style={{ ...textStyle, fill: dark }}>
            V<tspan baselineShift="sub" fontSize="16">2</tspan> = 30V
          </text>

          <text x="686" y="412" style={{ ...smallTextStyle, fill: dark }}>
            V<tspan baselineShift="sub" fontSize="12">2</tspan> sin(ωt)
          </text>

          {/* V1 phasor */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={v1Tip.x}
            y2={v1Tip.y}
            stroke={orange}
            strokeWidth="6"
            markerEnd="url(#arrowOrange)"
            strokeLinecap="round"
          />

          <text x="72" y="164" style={{ ...textStyle, fill: dark }}>
            V<tspan baselineShift="sub" fontSize="16">1</tspan> = 20V
          </text>

          <text
            x="160"
            y="225"
            style={{ ...smallTextStyle, fill: dark }}
            transform="rotate(-61 160 225)"
          >
            V<tspan baselineShift="sub" fontSize="12">1</tspan> sin(ωt + θ)
          </text>

          {/* Resultant phasor */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={resultantTip.x}
            y2={resultantTip.y}
            stroke={blue}
            strokeWidth="7"
            markerEnd="url(#arrowBlue)"
            strokeLinecap="round"
          />

          <text
            x="430"
            y="285"
            style={{ ...textStyle, fill: dark }}
            transform="rotate(-23 430 285)"
          >
            V<tspan baselineShift="sub" fontSize="16">R</tspan> = V
            <tspan baselineShift="sub" fontSize="16">1</tspan> + V
            <tspan baselineShift="sub" fontSize="16">2</tspan>
          </text>

          {/* Construction lines */}
          <line
            x1={v1Tip.x}
            y1={v1Tip.y}
            x2={resultantTip.x}
            y2={resultantTip.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="18 13"
          />

          <line
            x1={v2Tip.x}
            y1={v2Tip.y}
            x2={resultantTip.x}
            y2={resultantTip.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="18 13"
          />

          <line
            x1={v1Tip.x}
            y1={v1Tip.y}
            x2={v1Tip.x + 62}
            y2={v1Tip.y}
            stroke={dark}
            strokeWidth="2.4"
            strokeDasharray="15 11"
          />

          <line
            x1={v2Tip.x}
            y1={v2Tip.y}
            x2={v2Tip.x}
            y2={v2Tip.y - 50}
            stroke={dark}
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Small plus sign at top construction line */}
          <line x1="426" y1="86" x2="426" y2="115" stroke={dark} strokeWidth="3" />
          <line x1="411" y1="101" x2="441" y2="101" stroke={dark} strokeWidth="3" />

          {/* Phase angle phi */}
          <path
            d={`M ${origin.x + 160} ${origin.y} A 160 160 0 0 0 ${origin.x + 80} ${origin.y - 138}`}
            fill="none"
            stroke={dark}
            strokeWidth="2.5"
            markerEnd="url(#arrowDark)"
          />

          <text x="205" y="315" style={textStyle}>
            ϕ = 60°
          </text>

          <line
            x1={origin.x + 86}
            y1={origin.y - 60}
            x2={origin.x + 145}
            y2={origin.y - 108}
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          {/* Angle label near V1 */}
          <path
            d={`M ${origin.x + 50} ${origin.y - 88} A 95 95 0 0 1 ${origin.x + 100} ${origin.y - 115}`}
            fill="none"
            stroke={dark}
            strokeWidth="2"
            markerEnd="url(#arrowDark)"
          />

          {/* Vertical value mark near V2 */}
          <line
            x1="420"
            y1="430"
            x2="420"
            y2="468"
            stroke={dark}
            strokeWidth="2"
          />
          <line
            x1="422"
            y1="430"
            x2="422"
            y2="468"
            stroke={dark}
            strokeWidth="2"
          />

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

          {/* Small right-side reference tick */}
          <line
            x1="868"
            y1="95"
            x2="910"
            y2="73"
            stroke={dark}
            strokeWidth="2"
          />

          {/* Caption */}
          <text x="215" y="530" style={textStyle}>
            Phasor Addition of Two Rotating Phasors
          </text>

          {/* Tiny note, because even vectors apparently need paperwork */}
          <text x="640" y="505" style={tinyTextStyle}>
            Resultant phasor is obtained by vector addition.
          </text>
        </svg>
      </div>
    </main>
  );
}
