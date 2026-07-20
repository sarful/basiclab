export default function KirchhoffsCurrentLaw() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 28,
    fontWeight: "bold",
  };

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  };

  const smallStyle = {
    ...textStyle,
    fontSize: 20,
  };

  const equationStyle = {
    ...textStyle,
    fontSize: 30,
    fontWeight: "bold",
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Kirchhoff&apos;s Current Law</title>
          <desc id="desc">
            Black and white Kirchhoff&apos;s Current Law diagram showing a
            circuit node with incoming and outgoing currents and the equation
            I1 plus I2 plus I3 minus I4 plus I5 equals zero.
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

          <rect width="1000" height="520" fill="white" />

          {/* Left explanation */}
          <text x="40" y="170" style={labelStyle}>
            Currents Entering the Node
          </text>

          <text x="390" y="170" textAnchor="middle" style={labelStyle}>
            =
          </text>

          <text x="430" y="170" style={labelStyle}>
            I₁ + I₂ + I₃
          </text>

          <text x="40" y="240" style={labelStyle}>
            Currents Leaving the Node
          </text>

          <text x="390" y="240" textAnchor="middle" style={labelStyle}>
            =
          </text>

          <text x="430" y="240" style={labelStyle}>
            I₄ + I₅
          </text>

          {/* Main node label */}
          <text x="575" y="70" style={titleStyle}>
            Node
          </text>

          <line
            x1="625"
            y1="82"
            x2="675"
            y2="145"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Conductors label */}
          <text x="760" y="63" style={smallStyle}>
            Conductors
          </text>

          <text x="785" y="88" style={smallStyle}>
            or Lines
          </text>

          <line
            x1="790"
            y1="105"
            x2="720"
            y2="175"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Central node */}
          <circle
            cx="700"
            cy="225"
            r="34"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle cx="700" cy="225" r="10" fill="black" />

          {/* Conductor lines */}
          <line
            x1="700"
            y1="225"
            x2="700"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="700"
            y1="225"
            x2="875"
            y2="145"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="700"
            y1="225"
            x2="865"
            y2="305"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="700"
            y1="225"
            x2="690"
            y2="365"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="700"
            y1="225"
            x2="545"
            y2="225"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrows */}
          <line
            x1="700"
            y1="105"
            x2="700"
            y2="185"
            stroke="black"
            strokeWidth="2.6"
            markerEnd="url(#arrow)"
          />

          <line
            x1="855"
            y1="155"
            x2="735"
            y2="210"
            stroke="black"
            strokeWidth="2.6"
            markerEnd="url(#arrow)"
          />

          <line
            x1="845"
            y1="295"
            x2="735"
            y2="242"
            stroke="black"
            strokeWidth="2.6"
            markerEnd="url(#arrow)"
          />

          <line
            x1="695"
            y1="260"
            x2="690"
            y2="350"
            stroke="black"
            strokeWidth="2.6"
            markerEnd="url(#arrow)"
          />

          <line
            x1="665"
            y1="225"
            x2="555"
            y2="225"
            stroke="black"
            strokeWidth="2.6"
            markerEnd="url(#arrow)"
          />

          {/* Current labels */}
          <text x="720" y="130" style={labelStyle}>
            I₁
          </text>

          <text x="820" y="212" style={labelStyle}>
            I₂
          </text>

          <text x="812" y="295" style={labelStyle}>
            I₃
          </text>

          <text x="715" y="345" style={labelStyle}>
            I₄
          </text>

          <text x="575" y="205" style={labelStyle}>
            I₅
          </text>

          {/* Equation */}
          <text
            x="500"
            y="455"
            textAnchor="start"
            dominantBaseline="middle"
            style={equationStyle}
          >
            I₁ + I₂ + I₃ − (I₄ + I₅) = 0
          </text>
        </svg>
      </div>
    </main>
  );
}
