export default function ACResistanceSinusoidalSupply() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 22,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 18,
    fill: "black",
  };

  const sinePath = () => `
    M 82 260
    C 98 220, 124 220, 140 260
    C 156 300, 182 300, 198 260
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">AC Resistance with a Sinusoidal Supply</title>
          <desc id="desc">
            SVG circuit diagram showing an AC sinusoidal voltage source connected
            through a switch to a pure resistance load, with current and voltage
            labels and Ohm law relations.
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

            <linearGradient id="resistorFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff7cf" />
              <stop offset="100%" stopColor="#f3d27c" />
            </linearGradient>
          </defs>

          <rect width="1000" height="520" fill="white" />

          {/* Left supply branch */}
          <line
            x1="110"
            y1="95"
            x2="110"
            y2="190"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="110"
            y1="330"
            x2="110"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* AC source */}
          <circle
            cx="110"
            cy="260"
            r="70"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <path
            d={sinePath()}
            fill="none"
            stroke="#2f67b2"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <text x="18" y="272" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">in</tspan>
          </text>

          {/* Top rail and switch */}
          <line
            x1="110"
            y1="95"
            x2="315"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="315"
            cy="95"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="425"
            cy="95"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="322"
            y1="93"
            x2="410"
            y2="48"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <path
            d="M 365 28 C 395 18, 425 32, 440 58"
            fill="none"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <text x="328" y="145" style={smallTextStyle}>
            switch
          </text>

          <line
            x1="432"
            y1="95"
            x2="645"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrow on top path */}
          <line
            x1="180"
            y1="62"
            x2="285"
            y2="62"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="215" y="42" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">R</tspan>
          </text>

          {/* Resistor branch */}
          <line
            x1="645"
            y1="95"
            x2="645"
            y2="170"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <rect
            x="610"
            y="170"
            width="70"
            height="145"
            fill="url(#resistorFill)"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="630" y="255" style={textStyle}>
            R
          </text>

          <line
            x1="645"
            y1="315"
            x2="645"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="645" cy="95" r="4.8" fill="black" />
          <circle cx="645" cy="430" r="4.8" fill="black" />

          {/* Bottom return rail */}
          <line
            x1="110"
            y1="430"
            x2="645"
            y2="430"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Voltage arrow across resistor */}
          <line
            x1="735"
            y1="315"
            x2="735"
            y2="170"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          <text x="755" y="250" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">R</tspan>
          </text>

          <text x="690" y="175" style={smallTextStyle}>
            +
          </text>
          <text x="692" y="320" style={smallTextStyle}>
            −
          </text>

          {/* Right equations */}
          <text x="820" y="80" style={textStyle}>
            I<tspan baselineShift="sub" fontSize="18">R</tspan> =
          </text>

          <text x="902" y="60" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">in</tspan>
          </text>
          <line
            x1="900"
            y1="72"
            x2="955"
            y2="72"
            stroke="black"
            strokeWidth="2"
          />
          <text x="918" y="108" style={textStyle}>
            R
          </text>

          <text x="820" y="178" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">R(t)</tspan> =
            I<tspan baselineShift="sub" fontSize="18">R(t)</tspan> · R
          </text>

          {/* Small node and polarity details */}
          <circle cx="110" cy="95" r="4.5" fill="black" />
          <circle cx="110" cy="430" r="4.5" fill="black" />

          <text x="96" y="174" style={smallTextStyle}>
            +
          </text>
          <text x="100" y="352" style={smallTextStyle}>
            −
          </text>

          {/* Caption */}
          <text x="235" y="485" style={tinyTextStyle}>
            Pure resistance circuit: current and voltage are in phase, because apparently resistors behave themselves.
          </text>
        </svg>
      </div>
    </main>
  );
}
