export default function DisplacementSingleCoilMagneticField() {
  const width = 1100;
  const height = 560;

  const dark = "#222222";
  const blue = "#2f67b2";
  const orange = "#d69a63";
  const red = "#c7706c";
  const paleBlue = "#dce8f6";
  const gray = "#777777";

  const stroke = 3;

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 26,
    fill: dark,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: dark,
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: dark,
  };

  const sinePath = () => {
    const left = 675;
    const axisY = 255;
    const amp = 92;
    const plotWidth = 340;
    const steps = 260;
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const t = (2 * Math.PI * i) / steps;
      const x = left + (t / (2 * Math.PI)) * plotWidth;
      const y = axisY - Math.sin(t) * amp;
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    return d.trim();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Displacement of a Single Coil within a Magnetic Field</title>
          <desc id="desc">
            SVG educational diagram showing a single rotating coil inside a
            magnetic field and the corresponding instantaneous sinusoidal
            voltage waveform.
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
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={dark} />
            </marker>

            <linearGradient id="northPole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d98d85" />
              <stop offset="100%" stopColor="#f4d2ce" />
            </linearGradient>

            <linearGradient id="southPole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eef5fb" />
              <stop offset="100%" stopColor="#cfe0ef" />
            </linearGradient>

            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={paleBlue} stopOpacity="0.9" />
              <stop offset="50%" stopColor={paleBlue} stopOpacity="0.45" />
              <stop offset="100%" stopColor={paleBlue} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <rect width={width} height={height} fill="white" />

          {/* Magnetic poles */}
          <rect
            x="20"
            y="15"
            width="205"
            height="125"
            fill="url(#northPole)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="112" y="82" textAnchor="middle" style={textStyle}>
            N
          </text>

          <rect
            x="20"
            y="365"
            width="205"
            height="125"
            fill="url(#southPole)"
            stroke="black"
            strokeWidth={stroke}
          />
          <text x="112" y="430" textAnchor="middle" style={textStyle}>
            S
          </text>

          {/* Rotating coil in magnetic field */}
          <circle
            cx="122"
            cy="250"
            r="125"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="10 8"
          />
          <ellipse
            cx="122"
            cy="250"
            rx="78"
            ry="118"
            fill="none"
            stroke="black"
            strokeWidth="2.4"
            strokeDasharray="9 8"
            transform="rotate(45 122 250)"
          />

          {/* Coil shaft and coil sides */}
          <line
            x1="58"
            y1="318"
            x2="188"
            y2="182"
            stroke="black"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="338"
            x2="205"
            y2="202"
            stroke="#444"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="58" cy="318" r="19" fill={orange} stroke="black" strokeWidth={stroke} />
          <circle cx="188" cy="182" r="19" fill={orange} stroke="black" strokeWidth={stroke} />

          {/* Small angle mark inside coil */}
          <path
            d="M 132 250 A 48 48 0 0 1 165 218"
            fill="none"
            stroke={blue}
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="145" y="235" style={{ ...smallTextStyle, fill: blue }}>
            θ
          </text>

          {/* Dashed linkage to generator position */}
          <line
            x1="188"
            y1="182"
            x2="500"
            y2="182"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="14 10"
          />
          <line
            x1="58"
            y1="318"
            x2="500"
            y2="318"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="14 10"
          />

          {/* Middle rotating coil position */}
          <circle
            cx="470"
            cy="250"
            r="96"
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeDasharray="16 12"
          />
          <ellipse
            cx="470"
            cy="250"
            rx="44"
            ry="90"
            fill="none"
            stroke="black"
            strokeWidth="2.4"
            strokeDasharray="10 8"
            transform="rotate(28 470 250)"
          />
          <line
            x1="430"
            y1="305"
            x2="520"
            y2="175"
            stroke="black"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text
            x="455"
            y="263"
            style={{ ...smallTextStyle, fill: blue }}
            transform="rotate(-55 455 263)"
          >
            e = sinθ
          </text>
          <path
            d="M 495 250 A 42 42 0 0 1 525 222"
            fill="none"
            stroke={blue}
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <text x="518" y="246" style={{ ...smallTextStyle, fill: blue }}>
            θ
          </text>

          {/* Waveform plot frame */}
          <line
            x1="650"
            y1="65"
            x2="650"
            y2="445"
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />
          <line
            x1="650"
            y1="255"
            x2="1040"
            y2="255"
            stroke={dark}
            strokeWidth={stroke}
            markerEnd="url(#arrow)"
          />

          {/* Shaded sine wave area */}
          <path
            d="M 675 255 L 675 255 C 720 110, 805 110, 850 255 C 895 400, 980 400, 1015 255 L 1015 255 L 675 255 Z"
            fill="url(#waveFill)"
          />

          <path
            d={sinePath()}
            fill="none"
            stroke={blue}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Waveform guides */}
          <line
            x1="675"
            y1="162"
            x2="1015"
            y2="162"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />
          <line
            x1="675"
            y1="348"
            x2="1015"
            y2="348"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />
          <line
            x1="760"
            y1="65"
            x2="760"
            y2="445"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />
          <line
            x1="845"
            y1="65"
            x2="845"
            y2="445"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />
          <line
            x1="930"
            y1="65"
            x2="930"
            y2="445"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />
          <line
            x1="1015"
            y1="65"
            x2="1015"
            y2="445"
            stroke={gray}
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          {/* Waveform labels */}
          <text x="608" y="153" style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="14">m</tspan>
          </text>
          <text x="612" y="355" style={smallTextStyle}>
            −V<tspan baselineShift="sub" fontSize="14">m</tspan>
          </text>
          <text x="630" y="263" style={smallTextStyle}>
            0
          </text>

          <text x="703" y="278" style={smallTextStyle}>
            θ
          </text>
          <text x="750" y="300" style={smallTextStyle}>
            π/2
          </text>
          <text x="835" y="300" style={smallTextStyle}>
            π
          </text>
          <text x="914" y="300" style={smallTextStyle}>
            3π/2
          </text>
          <text x="1004" y="300" style={smallTextStyle}>
            2π
          </text>

          <text x="1027" y="278" style={smallTextStyle}>
            time
          </text>
          <text x="1027" y="305" style={smallTextStyle}>
            t(s)
          </text>

          {/* One-cycle bracket */}
          <line
            x1="675"
            y1="80"
            x2="1015"
            y2="80"
            stroke={dark}
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <line x1="675" y1="62" x2="675" y2="98" stroke={dark} strokeWidth="2" />
          <line x1="1015" y1="62" x2="1015" y2="98" stroke={dark} strokeWidth="2" />
          <text x="795" y="58" style={smallTextStyle}>
            1 Cycle
          </text>

          {/* Output line and instantaneous value mark */}
          <line
            x1="630"
            y1="180"
            x2="650"
            y2="180"
            stroke={dark}
            strokeWidth={stroke}
          />
          <text x="555" y="185" style={smallTextStyle}>
            +V<tspan baselineShift="sub" fontSize="14">m</tspan>
          </text>

          <text x="760" y="495" style={textStyle}>
            Instantaneous Value
          </text>
          <line
            x1="760"
            y1="505"
            x2="995"
            y2="505"
            stroke={dark}
            strokeWidth="2"
          />

          {/* Small axis labels near rotating middle coil */}
          <text x="505" y="185" style={tinyTextStyle}>
            zero
          </text>
          <text x="512" y="324" style={tinyTextStyle}>
            max
          </text>
        </svg>
      </div>
    </main>
  );
}
