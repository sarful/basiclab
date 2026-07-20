export default function PowerTriangleACCircuit() {
  const width = 900;
  const height = 620;

  const stroke = 3;
  const dark = "#222222";
  const fillBlue = "#d9e4ef";

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 21,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
    fill: dark,
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
          <title id="title">Power Triangle for an AC Circuit</title>
          <desc id="desc">
            SVG diagram of the power triangle for an AC circuit showing active
            power P on the horizontal axis, reactive power Q on the vertical
            axis, apparent power S on the hypotenuse, and the phase angle phi.
          </desc>

          <defs>
            <marker
              id="arrowBlack"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Triangle fill */}
          <polygon
            points="85,530 760,530 760,110"
            fill={fillBlue}
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          {/* Base and vertical arrows */}
          <line
            x1="85"
            y1="530"
            x2="770"
            y2="530"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrowBlack)"
          />
          <line
            x1="760"
            y1="530"
            x2="760"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrowBlack)"
          />

          {/* Hypotenuse arrow */}
          <line
            x1="85"
            y1="530"
            x2="775"
            y2="100"
            stroke="black"
            strokeWidth={stroke}
            markerEnd="url(#arrowBlack)"
          />

          {/* Angle arc at origin */}
          <path
            d="M 220 530 A 135 135 0 0 0 198 455"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlack)"
          />
          <text x="150" y="485" style={textStyle}>
            ϕ
          </text>

          {/* Small right angle mark on top-right corner */}
          <path
            d="M 760 160 L 720 160 L 720 120"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />

          {/* Angle hint text on top-right */}
          <text x="785" y="138" style={tinyTextStyle}>
            90° − ϕ
          </text>
          <text x="787" y="166" style={tinyTextStyle}>
            or
          </text>
          <text x="785" y="194" style={tinyTextStyle}>
            θ
          </text>

          {/* Labels on triangle sides */}
          <text
            x="380"
            y="332"
            style={smallTextStyle}
            transform="rotate(-32 380 332)"
          >
            Apparent Power, S = VI
          </text>

          <text x="250" y="575" style={smallTextStyle}>
            Active Power, P = VI cosϕ
          </text>

          <text
            x="812"
            y="430"
            style={smallTextStyle}
            transform="rotate(-90 812 430)"
          >
            Reactive Power, Q = VI sinϕ
          </text>

          {/* Formula box */}
          <rect
            x="370"
            y="365"
            width="250"
            height="92"
            fill="white"
            stroke="black"
            strokeWidth="1.8"
          />
          <text x="395" y="420" style={{ ...textStyle, fontSize: 24 }}>
            S = √(P² + Q²)
          </text>

          {/* Tiny dimension/guide arrow near hypotenuse */}
          <line
            x1="210"
            y1="420"
            x2="300"
            y2="315"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowBlack)"
          />

          {/* Small direction arrows on vertical and horizontal sides */}
          <line
            x1="742"
            y1="500"
            x2="742"
            y2="250"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowBlack)"
          />
          <line
            x1="110"
            y1="515"
            x2="420"
            y2="515"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowBlack)"
          />
        </svg>
      </div>
    </main>
  );
}
