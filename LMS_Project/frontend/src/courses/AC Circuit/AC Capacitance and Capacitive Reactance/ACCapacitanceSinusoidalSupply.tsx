export default function ACCapacitanceSinusoidalSupply() {
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
    M 122 255
    C 142 210, 172 210, 192 255
    C 212 300, 242 300, 262 255
  `;

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
          <title id="title">AC Capacitance with a Sinusoidal Supply</title>
          <desc id="desc">
            Clean black and white SVG circuit diagram showing an AC sinusoidal
            voltage source connected through a switch to a capacitor.
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

          {/* Left side with AC source */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="185"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="325"
            x2="100"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="100"
            cy="255"
            r="70"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <path
            d={sinePath()}
            fill="none"
            stroke="#5a84c9"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="18" y="265" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">in</tspan>
          </text>

          {/* Top and bottom wires */}
          <line
            x1="100"
            y1="90"
            x2="375"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="455"
            x2="820"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current arrow and label */}
          <line
            x1="180"
            y1="62"
            x2="300"
            y2="62"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="200" y="43" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="15">in</tspan>
          </text>

          {/* Switch */}
          <circle
            cx="375"
            cy="90"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <circle
            cx="485"
            cy="90"
            r="7"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />
          <line
            x1="383"
            y1="88"
            x2="468"
            y2="40"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d="M 400 35 C 425 18, 455 18, 485 34"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 395 55 C 420 38, 450 38, 480 52"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="366" y="135" style={smallTextStyle}>
            switch
          </text>

          {/* Wire to right side */}
          <line
            x1="492"
            y1="90"
            x2="820"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right vertical branch with capacitor */}
          <line
            x1="820"
            y1="90"
            x2="820"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="820"
            y1="335"
            x2="820"
            y2="455"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Capacitor plates */}
          <line
            x1="770"
            y1="215"
            x2="870"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="770"
            y1="255"
            x2="870"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="820"
            y1="175"
            x2="820"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="820"
            y1="255"
            x2="820"
            y2="335"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="820" cy="175" r="4.5" fill="black" />
          <circle cx="820" cy="335" r="4.5" fill="black" />

          {/* Capacitor label */}
          <text x="890" y="245" style={textStyle}>
            C
          </text>

          {/* Charge labels */}
          <text x="842" y="205" style={smallTextStyle}>
            q
          </text>
          <text x="842" y="282" style={smallTextStyle}>
            −q
          </text>

          {/* Capacitor voltage arrow */}
          <line
            x1="690"
            y1="180"
            x2="690"
            y2="305"
            stroke="black"
            strokeWidth="2.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="620" y="250" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="18">co</tspan>
          </text>

          {/* Small node marks on capacitor wire */}
          <circle cx="820" cy="90" r="4.5" fill="black" />
          <circle cx="820" cy="455" r="4.5" fill="black" />

          {/* Decorative current path hint on top */}
          <path
            d="M 420 26 C 445 5, 475 5, 500 26"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Subtle capacitor terminals emphasis */}
          <line
            x1="755"
            y1="215"
            x2="770"
            y2="215"
            stroke="black"
            strokeWidth={stroke}
          />
          <line
            x1="755"
            y1="255"
            x2="770"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Open space retained to match reference proportions */}
          <text x="835" y="125" style={tinyTextStyle}>
            .
          </text>
        </svg>
      </div>
    </main>
  );
}
