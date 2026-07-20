export default function ReactivePowerPintAnalogy() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: "black",
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 900 560"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Analogy of Reactive Power with a Pint Glass</title>
          <desc id="desc">
            Educational SVG diagram comparing apparent power, active power, and
            reactive power to the total volume, useful liquid, and foam in a
            pint glass.
          </desc>

          <defs>
            <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="liquidFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4cf4a" />
              <stop offset="50%" stopColor="#d89a10" />
              <stop offset="100%" stopColor="#a96f00" />
            </linearGradient>

            <linearGradient id="foamFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ececec" />
            </linearGradient>

            <clipPath id="glassClip">
              <path d="M 150 55 C 145 145, 155 300, 185 485 C 190 515, 350 515, 355 485 C 385 300, 395 145, 390 55 Z" />
            </clipPath>

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

          <rect width="900" height="560" fill="white" />

          {/* Pint glass outline */}
          <path
            d="M 150 55 C 145 145, 155 300, 185 485 C 190 515, 350 515, 355 485 C 385 300, 395 145, 390 55 Z"
            fill="#f9f9f9"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Liquid and foam clipped inside glass */}
          <g clipPath="url(#glassClip)">
            <rect x="135" y="175" width="275" height="335" fill="url(#liquidFill)" />
            <rect x="135" y="55" width="275" height="120" fill="url(#foamFill)" />

            {/* Slight curved liquid boundary */}
            <path
              d="M 135 176 C 190 160, 250 190, 310 174 C 350 164, 380 168, 410 176 L 410 195 L 135 195 Z"
              fill="#f7d95a"
              opacity="0.65"
            />

            {/* Foam bubbles */}
            <circle cx="185" cy="85" r="14" fill="white" opacity="0.95" />
            <circle cx="220" cy="105" r="18" fill="white" opacity="0.9" />
            <circle cx="270" cy="82" r="16" fill="white" opacity="0.95" />
            <circle cx="320" cy="112" r="20" fill="white" opacity="0.92" />
            <circle cx="355" cy="78" r="13" fill="white" opacity="0.9" />

            {/* Glass highlight */}
            <path
              d="M 180 85 C 168 190, 182 325, 210 455"
              fill="none"
              stroke="url(#glassShine)"
              strokeWidth="32"
              strokeLinecap="round"
              opacity="0.65"
            />
          </g>

          {/* Top and bottom glass ellipses */}
          <ellipse
            cx="270"
            cy="55"
            rx="120"
            ry="18"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
          />
          <ellipse
            cx="270"
            cy="505"
            rx="90"
            ry="18"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Section guide lines from glass to labels */}
          <line
            x1="405"
            y1="55"
            x2="710"
            y2="55"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1="405"
            y1="175"
            x2="710"
            y2="175"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1="405"
            y1="505"
            x2="710"
            y2="505"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Reactive power dimension */}
          <line
            x1="465"
            y1="55"
            x2="465"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="495" y="95" style={smallTextStyle}>
            Reactive
          </text>
          <text x="495" y="123" style={smallTextStyle}>
            Power, (VAr)
          </text>

          {/* Active power dimension */}
          <line
            x1="465"
            y1="175"
            x2="465"
            y2="505"
            stroke="black"
            strokeWidth={stroke}
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="505" y="305" style={smallTextStyle}>
            Active or Real
          </text>
          <text x="505" y="333" style={smallTextStyle}>
            Power, (W)
          </text>

          {/* Apparent power dimension */}
          <line
            x1="765"
            y1="55"
            x2="765"
            y2="505"
            stroke="black"
            strokeWidth={stroke}
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text x="795" y="245" style={smallTextStyle}>
            Apparent
          </text>
          <text x="795" y="273" style={smallTextStyle}>
            Power, (VA)
          </text>

          {/* Explanatory labels */}
          <text x="125" y="540" style={textStyle}>
            Pint Glass Power Analogy
          </text>

          <text x="135" y="160" style={tinyTextStyle}>
            foam = unusable reactive part
          </text>

          <text x="135" y="340" style={tinyTextStyle}>
            liquid = useful real power
          </text>

          {/* Small formula note */}
          <rect
            x="545"
            y="405"
            width="260"
            height="72"
            rx="8"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <text x="565" y="435" style={tinyTextStyle}>
            Apparent Power combines
          </text>
          <text x="565" y="462" style={tinyTextStyle}>
            real power and reactive power.
          </text>
        </svg>
      </div>
    </main>
  );
}
