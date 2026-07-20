export default function RLCVoltageVectorDiagrams() {
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

  const blue = "#2f67b2";
  const purple = "#7a35ad";
  const gray = "#e8e8e8";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1200 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">RLC Voltage Vector Diagrams</title>
          <desc id="desc">
            Voltage vector diagrams for resistance, inductance, and capacitance.
            The resistor voltage is in phase with current, the inductor voltage
            leads by 90 degrees, and the capacitor voltage lags by 90 degrees.
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
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>

            <marker
              id="arrowBlue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={blue} />
            </marker>

            <marker
              id="arrowPurple"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={purple} />
            </marker>
          </defs>

          <rect width="1200" height="520" fill="white" />

          {/* -------- Left panel: Resistance -------- */}
          <line x1="90" y1="105" x2="90" y2="360" stroke="black" strokeWidth={stroke} />
          <line x1="90" y1="255" x2="420" y2="255" stroke="black" strokeWidth={stroke} />

          {/* I phasor */}
          <line
            x1="90"
            y1="255"
            x2="235"
            y2="255"
            stroke={purple}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowPurple)"
          />
          <text x="205" y="325" style={{ ...textStyle, fill: purple }}>
            I
          </text>

          {/* VR phasor */}
          <line
            x1="90"
            y1="255"
            x2="310"
            y2="255"
            stroke={blue}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />
          <text x="265" y="325" style={{ ...textStyle, fill: blue }}>
            V<tspan baselineShift="sub" fontSize="18">R</tspan>
          </text>

          {/* Rotation arrow */}
          <path
            d="M 270 95 C 230 60, 205 60, 175 105"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlack)"
            strokeLinecap="round"
          />
          <text x="255" y="110" style={smallTextStyle}>ω</text>

          <text x="165" y="430" style={smallTextStyle}>Resistance</text>
          <text x="145" y="458" style={smallTextStyle}>( In phase )</text>

          {/* -------- Middle panel: Inductance -------- */}
          <line x1="515" y1="80" x2="515" y2="360" stroke="black" strokeWidth={stroke} />
          <line x1="515" y1="255" x2="810" y2="255" stroke="black" strokeWidth={stroke} />

          {/* 90 degree box */}
          <rect x="515" y="175" width="85" height="80" fill={gray} stroke="black" strokeWidth="1.5" />
          <text x="535" y="228" style={textStyle}>90°</text>

          {/* I phasor */}
          <line
            x1="515"
            y1="255"
            x2="690"
            y2="255"
            stroke={purple}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowPurple)"
          />
          <text x="645" y="325" style={{ ...textStyle, fill: purple }}>
            I
          </text>

          {/* VL phasor */}
          <line
            x1="515"
            y1="255"
            x2="515"
            y2="55"
            stroke={blue}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />
          <text x="488" y="38" style={{ ...textStyle, fill: blue }}>
            V<tspan baselineShift="sub" fontSize="18">L</tspan>
          </text>

          {/* Rotation arrow */}
          <path
            d="M 705 95 C 665 60, 640 60, 610 105"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlack)"
            strokeLinecap="round"
          />
          <text x="690" y="110" style={smallTextStyle}>ω</text>

          <text x="565" y="430" style={smallTextStyle}>Inductance</text>
          <text x="575" y="458" style={smallTextStyle}>( +90° )</text>

          {/* -------- Right panel: Capacitance -------- */}
          <line x1="865" y1="105" x2="865" y2="360" stroke="black" strokeWidth={stroke} />
          <line x1="865" y1="255" x2="1160" y2="255" stroke="black" strokeWidth={stroke} />

          {/* 90 degree box */}
          <rect x="865" y="255" width="85" height="80" fill={gray} stroke="black" strokeWidth="1.5" />
          <text x="885" y="308" style={textStyle}>90°</text>

          {/* I phasor */}
          <line
            x1="865"
            y1="255"
            x2="1075"
            y2="255"
            stroke={purple}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowPurple)"
          />
          <text x="1030" y="325" style={{ ...textStyle, fill: purple }}>
            I
          </text>

          {/* VC phasor */}
          <line
            x1="865"
            y1="255"
            x2="865"
            y2="455"
            stroke={blue}
            strokeWidth="10"
            strokeLinecap="round"
            markerEnd="url(#arrowBlue)"
          />
          <text x="838" y="470" style={{ ...textStyle, fill: blue }}>
            V<tspan baselineShift="sub" fontSize="18">C</tspan>
          </text>

          {/* Rotation arrow */}
          <path
            d="M 1060 95 C 1020 60, 995 60, 965 105"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlack)"
            strokeLinecap="round"
          />
          <text x="1045" y="110" style={smallTextStyle}>ω</text>

          <text x="930" y="430" style={smallTextStyle}>Capacitance</text>
          <text x="955" y="458" style={smallTextStyle}>( −90° )</text>
        </svg>
      </div>
    </main>
  );
}
