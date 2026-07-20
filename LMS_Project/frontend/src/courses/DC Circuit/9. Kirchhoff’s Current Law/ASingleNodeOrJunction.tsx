export default function ASingleNodeOrJunction() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  } as const;

  const labelStyle = {
    ...textStyle,
    fontSize: 24,
  } as const;

  const smallStyle = {
    ...textStyle,
    fontSize: 18,
  } as const;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-3xl bg-white">
        <svg
          viewBox="0 0 700 340"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">A Single Node or Junction</title>
          <desc id="desc">
            Black and white textbook style SVG diagram of a single electrical
            node or junction. Current I1 enters from the left, current I2
            enters from below, and current I3 equals I1 plus I2 leaving to the
            right.
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

          <rect width="700" height="340" fill="white" />

          {/* Title */}
          <text x="110" y="42" style={labelStyle}>
            Junction
          </text>

          {/* Main node wires */}
          <line
            x1="40"
            y1="150"
            x2="280"
            y2="150"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="280"
            y1="150"
            x2="620"
            y2="150"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="280"
            y1="150"
            x2="280"
            y2="290"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Node dot */}
          <circle cx="280" cy="150" r="6.5" fill="black" />

          {/* Current arrows */}
          <line
            x1="55"
            y1="178"
            x2="155"
            y2="178"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="12" y="184" style={smallStyle}>
            I₁
          </text>

          <line
            x1="252"
            y1="255"
            x2="252"
            y2="185"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="206" y="228" style={smallStyle}>
            I₂
          </text>

          <line
            x1="395"
            y1="122"
            x2="560"
            y2="122"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />
          <text x="360" y="98" style={smallStyle}>
            I₃ = I₁ + I₂
          </text>
        </svg>
      </div>
    </main>
  );
}
