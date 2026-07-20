export default function InvertingSummingAmplifier() {
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

  const resistor = (x: number, y: number, width = 95, height = 18) => {
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
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Inverting Summing Amplifier Circuit</title>
          <desc id="desc">
            Inverting summing amplifier circuit using an operational amplifier,
            three input resistors, feedback resistor, virtual earth summing
            point, and output voltage reference.
          </desc>

          <rect width="1000" height="520" fill="white" />

          {/* Bottom reference rail */}
          <line
            x1="45"
            y1="445"
            x2="930"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle
            cx="60"
            cy="445"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="910"
            cy="445"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="75" y="477" style={smallTextStyle}>
            0V
          </text>

          {/* Input source terminals */}
          <circle
            cx="60"
            cy="95"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="100"
            cy="210"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <circle
            cx="140"
            cy="315"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="8" y="103" style={textStyle}>
            V₁
          </text>

          <text x="62" y="218" style={textStyle}>
            V₂
          </text>

          <text x="103" y="323" style={textStyle}>
            V₃
          </text>

          {/* Input branch wires before Rin */}
          <line
            x1="69"
            y1="95"
            x2="220"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="109"
            y1="210"
            x2="220"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="149"
            y1="315"
            x2="220"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Current labels only, arrows removed as requested */}
          <text x="145" y="78" style={smallTextStyle}>
            I₁
          </text>

          <text x="168" y="193" style={smallTextStyle}>
            I₂
          </text>

          <text x="176" y="298" style={smallTextStyle}>
            I₃
          </text>

          {/* Input resistors Rin */}
          <polyline
            points={resistor(220, 95)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polyline
            points={resistor(220, 210)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polyline
            points={resistor(220, 315)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text x="252" y="62" style={smallTextStyle}>
            Rin
          </text>

          <text x="252" y="177" style={smallTextStyle}>
            Rin
          </text>

          <text x="252" y="282" style={smallTextStyle}>
            Rin
          </text>

          {/* Wires after Rin joining common summing node */}
          <line
            x1="315"
            y1="95"
            x2="450"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="315"
            y1="210"
            x2="450"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="315"
            y1="315"
            x2="450"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="450"
            y1="75"
            x2="450"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Junction dots */}
          <circle cx="450" cy="95" r="5.5" fill="black" />
          <circle cx="450" cy="210" r="8" fill="black" />
          <circle cx="450" cy="315" r="5.5" fill="black" />

          <text x="465" y="235" style={smallTextStyle}>
            x
          </text>

          {/* Virtual earth summing point label */}
          <text x="260" y="363" style={smallTextStyle}>
            Virtual earth
          </text>

          <text x="264" y="390" style={smallTextStyle}>
            summing point
          </text>

          {/* Op-amp body */}
          <polygon
            points="520,150 520,350 740,250"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <text x="623" y="264" style={{ ...textStyle, fontSize: 44 }}>
            A
          </text>

          <text x="540" y="218" style={smallTextStyle}>
            −
          </text>

          <text x="540" y="303" style={smallTextStyle}>
            +
          </text>

          {/* Inverting input connected to summing node */}
          <line
            x1="450"
            y1="210"
            x2="520"
            y2="210"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Non-inverting input to ground */}
          <line
            x1="520"
            y1="290"
            x2="485"
            y2="290"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="485"
            y1="290"
            x2="485"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Ground symbol */}
          <line
            x1="455"
            y1="360"
            x2="515"
            y2="360"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="465"
            y1="373"
            x2="505"
            y2="373"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="475"
            y1="386"
            x2="495"
            y2="386"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="502" y="398" style={smallTextStyle}>
            0V
          </text>

          {/* Feedback path with Rf */}
          <line
            x1="450"
            y1="75"
            x2="575"
            y2="75"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <polyline
            points={resistor(575, 75, 115, 18)}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="690"
            y1="75"
            x2="800"
            y2="75"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="800"
            y1="75"
            x2="800"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="625" y="42" style={smallTextStyle}>
            Rf
          </text>

          <text x="530" y="37" style={smallTextStyle}>
            If
          </text>

          {/* Output wire and terminal */}
          <line
            x1="740"
            y1="250"
            x2="910"
            y2="250"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <circle cx="800" cy="250" r="5.5" fill="black" />

          <circle
            cx="910"
            cy="250"
            r="9"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          {/* Output reference line */}
          <line
            x1="910"
            y1="250"
            x2="910"
            y2="445"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text x="923" y="350" style={textStyle}>
            Vout
          </text>
        </svg>
      </div>
    </main>
  );
}
