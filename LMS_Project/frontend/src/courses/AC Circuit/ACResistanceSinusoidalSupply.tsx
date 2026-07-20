export default function ACResistanceSinusoidalSupply() {
  const stroke = 3;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fontWeight: 600,
    fill: "black",
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 21,
    fill: "black",
  };

  const blue = "#1f5fa8";
  const resistorFill = "#fff0b8";

  const ArrowHead = ({
    x,
    y,
    direction,
    fill = "black",
  }: {
    x: number;
    y: number;
    direction: "right" | "left" | "up" | "down";
    fill?: string;
  }) => {
    let points = "";

    if (direction === "right") {
      points = `${x},${y} ${x - 12},${y - 7} ${x - 12},${y + 7}`;
    } else if (direction === "left") {
      points = `${x},${y} ${x + 12},${y - 7} ${x + 12},${y + 7}`;
    } else if (direction === "up") {
      points = `${x},${y} ${x - 7},${y + 12} ${x + 7},${y + 12}`;
    } else {
      points = `${x},${y} ${x - 7},${y - 12} ${x + 7},${y - 12}`;
    }

    return <polygon points={points} fill={fill} stroke={fill} strokeWidth="1.5" />;
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
          <title id="title">AC Resistance with a Sinusoidal Supply</title>
          <desc id="desc">
            AC resistive circuit with sinusoidal voltage source, switch, resistor,
            current direction, voltage across the resistor, and Ohm&apos;s law equations.
          </desc>

          <rect width="1000" height="520" fill="white" />

          <text x="500" y="38" textAnchor="middle" style={titleStyle}>
            AC Resistance with a Sinusoidal Supply
          </text>

          {/* Main circuit wires */}
          <line
            x1="130"
            y1="115"
            x2="300"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="440"
            y1="115"
            x2="660"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="660"
            y1="115"
            x2="660"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="660"
            y1="340"
            x2="660"
            y2="425"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="660"
            y1="425"
            x2="130"
            y2="425"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="130"
            y1="425"
            x2="130"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="130"
            y1="175"
            x2="130"
            y2="115"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Sinusoidal AC source */}
          <circle
            cx="130"
            cy="245"
            r="70"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
          />

          <path
            d="
              M 78 245
              C 95 195, 118 195, 130 245
              C 142 295, 165 295, 182 245
            "
            fill="none"
            stroke={blue}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="30" y="255" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">in</tspan>
          </text>

          {/* Current arrow and label */}
          <line
            x1="205"
            y1="92"
            x2="275"
            y2="92"
            stroke="black"
            strokeWidth="2.5"
          />
          <ArrowHead x={275} y={92} direction="right" />
          <text x="220" y="75" style={smallTextStyle}>
            I<tspan baselineShift="sub" fontSize="14">R</tspan>
          </text>

          {/* Switch */}
          <circle cx="300" cy="115" r="8" fill="white" stroke="black" strokeWidth={stroke} />
          <circle cx="440" cy="115" r="8" fill="white" stroke="black" strokeWidth={stroke} />

          <line
            x1="312"
            y1="109"
            x2="405"
            y2="80"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <path
            d="M 420 70 A 55 55 0 0 1 475 118"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          <ArrowHead x={475} y={118} direction="down" />

          <text x="350" y="155" textAnchor="middle" style={smallTextStyle}>
            switch
          </text>

          {/* Resistor block */}
          <rect
            x="620"
            y="180"
            width="80"
            height="160"
            fill={resistorFill}
            stroke="black"
            strokeWidth={stroke}
          />

          <text x="648" y="270" style={textStyle}>
            R
          </text>

          {/* Connection dots on resistor */}
          <circle cx="660" cy="180" r="5.5" fill="black" />
          <circle cx="660" cy="340" r="5.5" fill="black" />

          {/* Voltage across resistor arrow */}
          <line
            x1="745"
            y1="330"
            x2="745"
            y2="190"
            stroke="black"
            strokeWidth="2.5"
          />
          <ArrowHead x={745} y={190} direction="up" />

          <text x="768" y="267" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">R</tspan>
          </text>

          {/* Polarity marks */}
          <text x="685" y="170" style={textStyle}>
            +
          </text>
          <text x="688" y="356" style={textStyle}>
            −
          </text>

          {/* Equation section */}
          <text x="815" y="105" style={textStyle}>
            I<tspan baselineShift="sub" fontSize="17">R</tspan> =
          </text>

          <text x="895" y="88" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">R</tspan>
          </text>

          <line
            x1="885"
            y1="102"
            x2="940"
            y2="102"
            stroke="black"
            strokeWidth="2"
          />

          <text x="904" y="132" style={textStyle}>
            R
          </text>

          <text x="815" y="195" style={textStyle}>
            V<tspan baselineShift="sub" fontSize="17">R(t)</tspan> =
            I<tspan baselineShift="sub" fontSize="17">R</tspan> · R
          </text>

          <text x="815" y="250" style={smallTextStyle}>
            Pure resistance:
          </text>

          <text x="815" y="285" style={smallTextStyle}>
            voltage and current are in phase
          </text>

          {/* Small waveform note */}
          <path
            d="
              M 818 355
              C 835 318, 858 318, 875 355
              C 892 392, 915 392, 932 355
            "
            fill="none"
            stroke={blue}
            strokeWidth="4"
            strokeLinecap="round"
          />

          <text x="815" y="425" style={smallTextStyle}>
            v<tspan baselineShift="sub" fontSize="14">R</tspan>(t) = V
            <tspan baselineShift="sub" fontSize="14">m</tspan> sin(ωt)
          </text>
        </svg>
      </div>
    </main>
  );
}
