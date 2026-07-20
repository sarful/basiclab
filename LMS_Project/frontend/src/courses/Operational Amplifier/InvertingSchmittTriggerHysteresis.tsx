export default function InvertingSchmittTriggerHysteresis() {
  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 17,
    fill: "black",
  };

  const resistor = (x: number, y: number, width = 100, height = 15) => {
    const step = width / 8;

    return `
      ${x},${y}
      ${x + step},${y}
      ${x + step * 2},${y - height}
      ${x + step * 3},${y + height}
      ${x + step * 4},${y - height}
      ${x + step * 5},${y + height}
      ${x + step * 6},${y - height}
      ${x + step * 7},${y + height}
      ${x + step * 8},${y}
    `;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1200 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Inverting Schmitt Trigger with Hysteresis</title>
          <desc id="desc">
            Black and white SVG diagram of an op-amp Schmitt trigger circuit
            with feedback and hysteresis transfer characteristic.
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

          <rect width="1200" height="520" fill="white" />

          {/* Left circuit: input Vin */}
          <circle
            cx="70"
            cy="135"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="15" y="144" style={smallTextStyle}>
            Vin
          </text>

          <line
            x1="79"
            y1="135"
            x2="330"
            y2="135"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Reference input source */}
          <circle
            cx="70"
            cy="255"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="12" y="265" style={smallTextStyle}>
            VREF
          </text>

          <line
            x1="79"
            y1="255"
            x2="135"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* R1 */}
          <polyline
            points={resistor(135, 255, 110, 15)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="175" y="225" style={smallTextStyle}>
            R1
          </text>

          <line
            x1="245"
            y1="255"
            x2="330"
            y2="255"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="330" cy="255" r="6" fill="black" />

          {/* Op-amp body */}
          <polygon
            points="330,80 330,310 560,195"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="420" y="210" style={{ ...textStyle, fontSize: 42 }}>
            A
          </text>

          <text x="350" y="142" style={smallTextStyle}>
            −
          </text>

          <text x="350" y="263" style={smallTextStyle}>
            +
          </text>

          {/* Output node */}
          <line
            x1="560"
            y1="195"
            x2="690"
            y2="195"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="615" cy="195" r="5.5" fill="black" />

          <circle
            cx="690"
            cy="195"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="704" y="205" style={smallTextStyle}>
            Vout
          </text>

          {/* Output reference terminals and ground */}
          <circle
            cx="690"
            cy="295"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="690"
            y1="303"
            x2="690"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="660"
            y1="360"
            x2="720"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="670"
            y1="373"
            x2="710"
            y2="373"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="680"
            y1="386"
            x2="700"
            y2="386"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Feedback resistor R2 from output to positive input node */}
          <line
            x1="330"
            y1="255"
            x2="330"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="330"
            y1="360"
            x2="415"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(415, 360, 125, 16)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="465" y="335" style={smallTextStyle}>
            R2
          </text>

          <line
            x1="540"
            y1="360"
            x2="615"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="615"
            y1="360"
            x2="615"
            y2="195"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Saturation labels near output */}
          <text x="510" y="90" style={smallTextStyle}>
            +Vsat
          </text>

          <text x="510" y="310" style={smallTextStyle}>
            −Vsat
          </text>

          <line
            x1="502"
            y1="102"
            x2="502"
            y2="125"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <line
            x1="502"
            y1="285"
            x2="502"
            y2="260"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Small ground reference on far left */}
          <circle
            cx="70"
            cy="345"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <line
            x1="70"
            y1="353"
            x2="70"
            y2="390"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="40"
            y1="390"
            x2="100"
            y2="390"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="403"
            x2="90"
            y2="403"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <line
            x1="60"
            y1="416"
            x2="80"
            y2="416"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Right side hysteresis graph */}
          <line
            x1="850"
            y1="390"
            x2="850"
            y2="90"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <line
            x1="775"
            y1="240"
            x2="1120"
            y2="240"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <text x="870" y="72" style={smallTextStyle}>
            Vout
          </text>

          <text x="1125" y="250" style={smallTextStyle}>
            Vin
          </text>

          {/* Saturation levels */}
          <line
            x1="850"
            y1="125"
            x2="1030"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="850"
            y1="350"
            x2="1030"
            y2="350"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="770" y="132" style={tinyTextStyle}>
            Vsat+
          </text>

          <text x="770" y="356" style={tinyTextStyle}>
            Vsat−
          </text>

          {/* Threshold vertical dashed lines */}
          <line
            x1="850"
            y1="125"
            x2="850"
            y2="390"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          <line
            x1="1030"
            y1="125"
            x2="1030"
            y2="390"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          <text x="810" y="415" style={tinyTextStyle}>
            VTL
          </text>

          <text x="1000" y="415" style={tinyTextStyle}>
            VTH
          </text>

          {/* Hysteresis rectangular loop */}
          <line
            x1="850"
            y1="125"
            x2="1030"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <line
            x1="1030"
            y1="125"
            x2="1030"
            y2="350"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <line
            x1="1030"
            y1="350"
            x2="850"
            y2="350"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          <line
            x1="850"
            y1="350"
            x2="850"
            y2="125"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          {/* Inner red-style arrows converted to black */}
          <line
            x1="920"
            y1="180"
            x2="990"
            y2="180"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <line
            x1="990"
            y1="310"
            x2="920"
            y2="310"
            stroke="black"
            strokeWidth="2.4"
            markerEnd="url(#arrow)"
          />

          <line
            x1="790"
            y1="125"
            x2="830"
            y2="125"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <line
            x1="790"
            y1="350"
            x2="830"
            y2="350"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <line
            x1="1090"
            y1="125"
            x2="1050"
            y2="125"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          <line
            x1="1090"
            y1="350"
            x2="1050"
            y2="350"
            stroke="black"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />

          {/* Hysteresis label */}
          <text x="1015" y="85" style={tinyTextStyle}>
            Hysteresis
          </text>

          <line
            x1="1095"
            y1="92"
            x2="1038"
            y2="145"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        </svg>
      </div>
    </main>
  );
}
