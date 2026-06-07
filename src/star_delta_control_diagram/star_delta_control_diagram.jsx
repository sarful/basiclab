
/**
 * Editable JSX/SVG recreation of the uploaded Automatic Star/Delta Starter
 * control circuit diagram.
 */
export default function StarDeltaControlDiagram({
  width = 600,
  height = 700,
  className = "",
}) {
  const blue = "#1d22ff";
  const red = "#ff1717";
  const black = "#111111";
  const gridXNumbers = Array.from({ length: 13 }, (_, i) => i * 50);
  const gridYNumbers = Array.from({ length: 15 }, (_, i) => i * 50);

  const stroke = {
    stroke: black,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };

  const blueStroke = {
    stroke: blue,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const terminal = (cx, cy) => (
    <circle cx={cx} cy={cy} r="5" fill="white" stroke={blue} strokeWidth="2" />
  );

  const coil = (x, y, label, fill = "#e8efff") => (
    <g>
      <rect x={x} y={y} width="39" height="20" fill={fill} stroke={blue} strokeWidth="3" />
      <text x={x + 19.5} y={y + 15} fontSize="15" fontWeight="800" textAnchor="middle" fill="#12a20f">
        {label}
      </text>
      <text x={x + 30} y={y - 5} fontSize="14" fontWeight="700" fill={black}>A1</text>
      <text x={x + 30} y={y + 35} fontSize="14" fontWeight="700" fill={black}>A2</text>
    </g>
  );

  const labelBox = (x, y, text) => (
    <g>
      <rect x={x} y={y} width={text === "MAIN" ? 56 : text === "TIMER" ? 62 : 57} height="28" fill="black" />
      <text
        x={x + (text === "MAIN" ? 28 : text === "TIMER" ? 31 : 28.5)}
        y={y + 20}
        fontSize="17"
        fontWeight="900"
        textAnchor="middle"
        fill="white"
      >
        {text}
      </text>
    </g>
  );

  return (
    <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <svg
        width={width}
        height={height}
        viewBox="0 0 600 700"
        className={`max-w-full h-auto rounded-xl shadow-lg bg-white ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Automatic Star Delta Starter control circuit diagram"
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e8e8e8" strokeWidth="0.6" />
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cfcfcf" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="600" height="700" fill="#ffffff" />
        <rect width="600" height="700" fill="url(#grid)" />

        {/* Pixel number guide */}
        <g fontSize="9" fontWeight="700" fill="#9a9a9a" pointerEvents="none">
          {gridXNumbers.map((x) => (
            <text key={`x-${x}`} x={x + 2} y="11">
              {x}
            </text>
          ))}
          {gridYNumbers.map((y) => (
            <text key={`y-${y}`} x="2" y={y + 11}>
              {y}
            </text>
          ))}
        </g>

        {/* Axis names */}
        <g fontSize="14" fontWeight="900" fill="#555555" pointerEvents="none">
          <text x="540" y="28">X Axis</text>
          <text x="24" y="660" transform="rotate(-90 24 660)">Y Axis</text>
        </g>

        {/* Supply lines */}
        <text x="18" y="119" fontSize="19" fontWeight="900" fill={black}>N</text>
        <text x="18" y="149" fontSize="19" fontWeight="900" fill={black}>L</text>
        {/* Supply lines with wire gaps at MCB contacts */}
        <line x1="40" y1="112" x2="63" y2="112" {...stroke} />
        <line x1="104" y1="112" x2="573" y2="112" {...stroke} />
        <line x1="40" y1="143" x2="63" y2="143" {...stroke} />
        <line x1="104" y1="143" x2="126" y2="143" {...stroke} />
        <line x1="573" y1="112" x2="573" y2="649" {...stroke} />

        {/* MCB switch */}
        <g>
          {terminal(68, 112)}
          {terminal(99, 112)}
          <line x1="71" y1="106" x2="91" y2="101" {...blueStroke} />
          <line x1="84" y1="106" x2="84" y2="136" stroke={blue} strokeWidth="2" strokeDasharray="3 3" />

          {terminal(68, 143)}
          {terminal(99, 143)}
          <line x1="71" y1="136" x2="91" y2="130" {...blueStroke} />
          <text x="66" y="166" fontSize="16" fontWeight="900" fill={red}>MCB</text>
        </g>

        {/* Left vertical ladder */}
        {/* Left bus with gaps at contact terminals 13-14, 95-96, 11-12 */}
        <path d="M126 143 V200" {...stroke} />
        <path d="M126 232 V280" {...stroke} />
        <path d="M126 312 V356" {...stroke} />
        <path d="M126 388 V650 H573" {...stroke} />
        <path d="M126 178 H188 V200" {...stroke} />
        <path d="M126 232 H188" {...stroke} />

        {/* ON push button */}
        <g>
          <text x="60" y="221" fontSize="16" fontWeight="900" fill={red}>ON</text>
          <line x1="95" y1="211" x2="95" y2="231" {...blueStroke} />
          <line x1="102" y1="211" x2="102" y2="231" {...blueStroke} />
          <line x1="109" y1="218" x2="126" y2="232" {...blueStroke} />
          <text x="130" y="194" fontSize="13" fontWeight="700" fill={black}>13</text>
          {terminal(126, 200)}
          <line x1="125" y1="199" x2="139" y2="182" {...blueStroke} />
          {terminal(126, 232)}
          <text x="128" y="251" fontSize="13" fontWeight="700" fill={black}>14</text>
        </g>

        {/* K1 auxiliary contact */}
        <g>
          <text x="159" y="221" fontSize="14" fontWeight="900" fill={red}>K1</text>
          <text x="192" y="194" fontSize="13" fontWeight="700" fill={black}>13</text>
          {terminal(188, 200)}
          <line x1="187" y1="199" x2="202" y2="182" {...blueStroke} />
          {terminal(188, 232)}
          <text x="190" y="251" fontSize="13" fontWeight="700" fill={black}>14</text>
        </g>

        {/* Overload and OFF push button */}
        <g>
          <text x="61" y="303" fontSize="16" fontWeight="900" fill={red}>O/L</text>
          <line x1="99" y1="291" x2="99" y2="309" {...blueStroke} />
          <line x1="105" y1="296" x2="111" y2="296" {...blueStroke} />
          <line x1="105" y1="303" x2="111" y2="303" {...blueStroke} />
          <text x="117" y="287" fontSize="13" fontWeight="700" fill={black}>95</text>
          {terminal(126, 280)}
          <line x1="126" y1="312" x2="140" y2="282" {...blueStroke} />
          {terminal(126, 312)}
          <text x="126" y="334" fontSize="13" fontWeight="700" fill={black}>96</text>
        </g>

        <g>
          <text x="62" y="378" fontSize="16" fontWeight="900" fill={red}>OFF</text>
          <line x1="99" y1="369" x2="99" y2="388" {...blueStroke} />
          <line x1="104" y1="369" x2="104" y2="388" {...blueStroke} />
          <line x1="112" y1="356" x2="132" y2="356" {...blueStroke} />
          <text x="126" y="351" fontSize="13" fontWeight="700" fill={black}>11</text>
          {terminal(126, 356)}
          <line x1="126" y1="388" x2="140" y2="356" {...blueStroke} />
          {terminal(126, 388)}
          <text x="126" y="408" fontSize="13" fontWeight="700" fill={black}>12</text>
        </g>

        {/* Main horizontal control rail */}
        <line x1="126" y1="410" x2="523" y2="410" {...stroke} />

        {/* Coils */}
        {coil(106, 527, "K1")}
        <g>
          <rect x="213" y="527" width="40" height="20" fill="#e8efff" stroke={blue} strokeWidth="3" />
          <line x1="219" y1="528" x2="247" y2="547" stroke={blue} strokeWidth="3" />
          <line x1="247" y1="528" x2="219" y2="547" stroke={blue} strokeWidth="3" />
          <text x="270" y="522" fontSize="14" fontWeight="700" fill={black}>A1</text>
          <text x="270" y="562" fontSize="14" fontWeight="700" fill={black}>A2</text>
          <text x="231" y="543" fontSize="15" fontWeight="800" textAnchor="middle" fill="#12a20f">T1</text>
        </g>
        {coil(319, 527, "K3")}
        {coil(437, 527, "K2")}

        {/* Bottom drops to coils */}
        <line x1="126" y1="410" x2="126" y2="527" {...stroke} />
        <line x1="126" y1="547" x2="126" y2="650" {...stroke} />
        <line x1="233" y1="410" x2="233" y2="527" {...stroke} />
        <line x1="233" y1="547" x2="233" y2="570" {...stroke} />
        {/* Connect T1 A2 to K3 A2 */}
        <line x1="233" y1="570" x2="339" y2="570" {...stroke} />
        {/* Delta line with gaps at timer contact 55-56 and interlock contact 11-12 */}
        <line x1="339" y1="410" x2="339" y2="439" {...stroke} />
        <line x1="339" y1="472" x2="339" y2="527" {...stroke} />
        <line x1="339" y1="547" x2="339" y2="594" {...stroke} />
        <line x1="339" y1="628" x2="339" y2="650" {...stroke} />
        {/* Star line with gaps at timer contact 67-68 and interlock contact 11-12 */}
        <line x1="457" y1="410" x2="457" y2="439" {...stroke} />
        <line x1="457" y1="472" x2="457" y2="527" {...stroke} />
        <line x1="457" y1="547" x2="457" y2="594" {...stroke} />
        <line x1="457" y1="628" x2="457" y2="650" {...stroke} />

        {/* Timer contacts */}
        <g>
          <text x="299" y="459" fontSize="16" fontWeight="900" fill={red}>T</text>
          {terminal(320, 456)}
          <path d="M334 430 V452 H320" {...blueStroke} />
          <text x="349" y="431" fontSize="13" fontWeight="700" fill={black}>55</text>
          {terminal(339, 439)}
          <line x1="339" y1="472" x2="353" y2="440" {...blueStroke} />
          {terminal(339, 472)}
          <text x="347" y="493" fontSize="13" fontWeight="700" fill={black}>56</text>
        </g>

        <g>
          <text x="408" y="460" fontSize="16" fontWeight="900" fill={red}>T</text>
          {terminal(431, 456)}
          <path d="M446 428 V452 H431" {...blueStroke} />
          <text x="464" y="431" fontSize="13" fontWeight="700" fill={black}>67</text>
          {terminal(457, 439)}
          <line x1="457" y1="472" x2="444" y2="438" {...blueStroke} />
          {terminal(457, 472)}
          <text x="459" y="493" fontSize="13" fontWeight="700" fill={black}>68</text>
        </g>

        {/* K2 auxiliary contact on right */}
        <g>
          <text x="492" y="459" fontSize="14" fontWeight="900" fill={red}>K2</text>
          <text x="524" y="431" fontSize="13" fontWeight="700" fill={black}>13</text>
          {terminal(523, 439)}
          <line x1="523" y1="472" x2="537" y2="439" {...blueStroke} />
          {terminal(523, 472)}
          <text x="525" y="493" fontSize="13" fontWeight="700" fill={black}>14</text>
          <path d="M523 410 V439 M523 472 V501 H457" {...stroke} />
        </g>

        {/* Interlock NC contacts above star/delta coils */}
        <g>
          <text x="309" y="616" fontSize="14" fontWeight="900" fill={red}>K2</text>
          <text x="337" y="592" fontSize="13" fontWeight="700" fill={black}>11</text>
          {terminal(339, 594)}
          <line x1="339" y1="629" x2="354" y2="596" {...blueStroke} />
          {terminal(339, 628)}
          <text x="341" y="649" fontSize="13" fontWeight="700" fill={black}>12</text>
        </g>

        <g>
          <text x="429" y="616" fontSize="14" fontWeight="900" fill={red}>K3</text>
          <text x="456" y="592" fontSize="13" fontWeight="700" fill={black}>11</text>
          {terminal(457, 594)}
          <line x1="457" y1="628" x2="472" y2="596" {...blueStroke} />
          {terminal(457, 628)}
          <text x="459" y="649" fontSize="13" fontWeight="700" fill={black}>12</text>
        </g>

        {/* Labels */}
        {labelBox(100, 659, "MAIN")}
        {labelBox(206, 659, "TIMER")}
        {labelBox(312, 659, "DELTA")}
        {labelBox(430, 659, "STAR")}
      </svg>
    </div>
  );
}
