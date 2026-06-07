import React from "react";

/**
 * Editable JSX/SVG recreation of the uploaded Power Circuit Diagram of
 * Automatic Star/Delta Starter for 3-phase motor.
 *
 * Includes grid, pixel numbers, axis names, wire gaps, editable wires,
 * terminals, MCCB, contactors, overloads, and motor terminal blocks.
 */
export default function StarDeltaPowerCircuitDiagramV2({
  width = 600,
  height = 650,
  className = "",
}) {
  const black = "#111111";
  const grey = "#777777";
  const blue = "#1d22ff";
  const green = "#08a82f";
  const red = "#ff1717";
  const orange = "#d97010";
  const purple = "#9a00ff";

  const gridXNumbers = Array.from({ length: 13 }, (_, i) => i * 50);
  const gridYNumbers = Array.from({ length: 14 }, (_, i) => i * 50);

  const wire = {
    stroke: black,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };

  const greyWire = {
    stroke: grey,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };

  const orangeWire = {
    stroke: orange,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };

  const terminal = (cx, cy, color = black, r = 5) => (
    <circle cx={cx} cy={cy} r={r} fill={color} stroke={color} strokeWidth="1" />
  );

  const greenTerminal = (cx, cy) => terminal(cx, cy, green, 5);
  const blackTerminal = (cx, cy) => terminal(cx, cy, black, 5);
  const orangeTerminal = (cx, cy) => terminal(cx, cy, orange, 5);

  const contactorPole = (x, y, topLabel, bottomLabel) => (
    <g>
      <text x={x - 2} y={y - 13} fontSize="15" fontWeight="700" fill={black}>{topLabel}</text>
      {greenTerminal(x, y)}
      <line x1={x - 6} y1={y + 42} x2={x + 10} y2={y + 6} stroke={green} strokeWidth="4" strokeLinecap="round" />
      {greenTerminal(x, y + 45)}
      <text x={x - 2} y={y + 70} fontSize="15" fontWeight="700" fill={black}>{bottomLabel}</text>
    </g>
  );

  const overloadPole = (x, y, topLabel, bottomLabel) => (
    <g>
      <text x={x - 3} y={y - 9} fontSize="15" fontWeight="700" fill={black}>{topLabel}</text>
      <path d={`M${x - 13} ${y} H${x + 8} V${y + 10} H${x - 6} V${y + 24} H${x + 9}`} fill="none" stroke={red} strokeWidth="3" />
      <text x={x - 3} y={y + 47} fontSize="15" fontWeight="700" fill={black}>{bottomLabel}</text>
    </g>
  );

  const coilBox = (x, y, label, caption1, caption2) => (
    <g>
      <text x={x - 28} y={y + 15} fontSize="20" fontWeight="900" fill={black}>{label}</text>
      <rect x={x} y={y} width="18" height="18" fill="#eaffea" stroke={green} strokeWidth="3" />
      <line x1={x + 3} y1={y + 16} x2={x + 15} y2={y + 3} stroke={green} strokeWidth="3" />
      <text x={x - 46} y={y + 47} fontSize="18" fontWeight="900" fill={blue}>{caption1}</text>
      {caption2 && <text x={x - 16} y={y + 72} fontSize="18" fontWeight="900" fill={blue}>{caption2}</text>}
    </g>
  );

  const motorTerminalBox = (x, y, top, middle, bottom) => (
    <g>
      <rect x={x} y={y} width="22" height="20" fill="white" stroke={black} strokeWidth="1" />
      <text x={x + 11} y={y + 14} fontSize="10" fontWeight="700" textAnchor="middle" fill={black}>{top}</text>
      <rect x={x} y={y + 20} width="22" height="20" fill="white" stroke={black} strokeWidth="1" />
      <text x={x + 11} y={y + 34} fontSize="10" fontWeight="700" textAnchor="middle" fill={black}>{middle}</text>
      <rect x={x} y={y + 40} width="22" height="20" fill="white" stroke={black} strokeWidth="1" />
      <text x={x + 11} y={y + 54} fontSize="10" fontWeight="700" textAnchor="middle" fill={black}>{bottom}</text>
    </g>
  );

  return (
    <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <svg
        width={width}
        height={height}
        viewBox="0 0 600 650"
        className={`max-w-full h-auto rounded-xl shadow-lg bg-white ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Power circuit diagram of automatic star delta starter for 3 phase motor"
      >
        <defs>
          <pattern id="smallGridPowerV2" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e8e8e8" strokeWidth="0.6" />
          </pattern>
          <pattern id="gridPowerV2" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGridPowerV2)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cfcfcf" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="600" height="650" fill="#ffffff" />
        <rect width="600" height="650" fill="url(#gridPowerV2)" />

        {/* Pixel number guide */}
        <g fontSize="9" fontWeight="700" fill="#9a9a9a" pointerEvents="none">
          {gridXNumbers.map((x) => (
            <text key={`x-${x}`} x={x + 2} y="11">{x}</text>
          ))}
          {gridYNumbers.map((y) => (
            <text key={`y-${y}`} x="2" y={y + 11}>{y}</text>
          ))}
        </g>

        {/* Axis names */}
        <g fontSize="14" fontWeight="900" fill="#555555" pointerEvents="none">
          <text x="540" y="28">X Axis</text>
          <text x="24" y="610" transform="rotate(-90 24 610)">Y Axis</text>
        </g>

        {/* Three-phase supply */}
        <text x="24" y="126" fontSize="20" fontWeight="900" fill={black}>L1</text>
        <text x="24" y="148" fontSize="20" fontWeight="900" fill={black}>L2</text>
        <text x="24" y="171" fontSize="20" fontWeight="900" fill={black}>L3</text>
        <line x1="53" y1="119" x2="560" y2="119" {...orangeWire} />
        <line x1="53" y1="141" x2="560" y2="141" {...wire} />
        <line x1="53" y1="164" x2="560" y2="164" {...greyWire} />

        {/* 3P MCCB label */}
        <text x="32" y="227" fontSize="18" fontWeight="900" fill={black}>3P MCCB</text>

        {/* MCCB input drops */}
        <line x1="124" y1="119" x2="124" y2="198" {...orangeWire} />
        <line x1="150" y1="141" x2="150" y2="198" {...wire} />
        <line x1="177" y1="164" x2="177" y2="198" {...greyWire} />
        {blackTerminal(124, 119)}
        {blackTerminal(150, 141)}
        {blackTerminal(177, 164)}

        {/* 3P MCCB poles */}
        <g>
          <text x="128" y="193" fontSize="14" fontWeight="700" fill={black}>1</text>
          <text x="154" y="193" fontSize="14" fontWeight="700" fill={black}>3</text>
          <text x="182" y="193" fontSize="14" fontWeight="700" fill={black}>5</text>

          {orangeTerminal(124, 198)}
          {orangeTerminal(150, 198)}
          {orangeTerminal(177, 198)}

          <line x1="124" y1="242" x2="136" y2="204" stroke={orange} strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="242" x2="162" y2="204" stroke={orange} strokeWidth="3" strokeLinecap="round" />
          <line x1="177" y1="242" x2="189" y2="204" stroke={orange} strokeWidth="3" strokeLinecap="round" />

          {orangeTerminal(124, 242)}
          {orangeTerminal(150, 242)}
          {orangeTerminal(177, 242)}

          <text x="128" y="257" fontSize="14" fontWeight="700" fill={black}>2</text>
          <text x="154" y="257" fontSize="14" fontWeight="700" fill={black}>4</text>
          <text x="182" y="257" fontSize="14" fontWeight="700" fill={black}>6</text>
        </g>

        {/* MCCB output to main contactor K1 */}
        <line x1="124" y1="242" x2="124" y2="306" {...orangeWire} />
        <line x1="150" y1="242" x2="150" y2="306" {...wire} />
        <line x1="177" y1="242" x2="177" y2="306" {...greyWire} />
        {blackTerminal(124, 306)}
        {blackTerminal(150, 287)}
        {blackTerminal(177, 270)}

        {/* K1 main contactor */}
        {coilBox(82, 357, "K1", "MAIN")}
        {/* K1 horizontal green wire with gaps at terminals */}
        <path d="M100 366 H116" stroke={green} strokeWidth="3" fill="none" />
        <path d="M132 366 H142" stroke={green} strokeWidth="3" fill="none" />
        <path d="M158 366 H169" stroke={green} strokeWidth="3" fill="none" />
        {contactorPole(124, 343, "1", "2")}
        {contactorPole(150, 343, "3", "4")}
        {contactorPole(177, 343, "5", "6")}
        {/* K1 input vertical wires with gaps at top terminals */}
        <line x1="124" y1="306" x2="124" y2="338" {...orangeWire} />
        <line x1="150" y1="287" x2="150" y2="338" {...wire} />
        <line x1="177" y1="270" x2="177" y2="338" {...greyWire} />

        {/* O/L 1 */}
        <text x="55" y="530" fontSize="20" fontWeight="900" fill={black}>O/L 1</text>
        <rect x="107" y="505" width="83" height="34" fill="none" stroke={red} strokeWidth="3" />
        {overloadPole(124, 505, "1", "2")}
        {overloadPole(151, 505, "3", "4")}
        {overloadPole(178, 505, "5", "6")}
        {/* K1 output to O/L1 wires with gaps at bottom terminals */}
        <line x1="124" y1="393" x2="124" y2="505" {...orangeWire} />
        <line x1="150" y1="393" x2="150" y2="505" {...wire} />
        <line x1="177" y1="393" x2="177" y2="505" {...greyWire} />

        {/* Motor */}
        <circle cx="253" cy="598" r="41" fill="#ffffff" stroke={purple} strokeWidth="3" />
        <text x="253" y="582" fontSize="18" fontWeight="900" textAnchor="middle" fill={black}>3-Φ</text>
        <text x="253" y="605" fontSize="18" fontWeight="900" textAnchor="middle" fill={black}>Motor</text>
        <text x="253" y="628" fontSize="18" fontWeight="900" textAnchor="middle" fill={black}>M</text>
        {motorTerminalBox(181, 577, "W1", "V1", "U1")}
        {motorTerminalBox(303, 577, "W2", "U2", "V2")}

        {/* O/L1 to motor left terminals */}
        <line x1="124" y1="539" x2="124" y2="617" {...orangeWire} />
        <line x1="150" y1="539" x2="150" y2="599" {...wire} />
        <line x1="177" y1="539" x2="177" y2="581" {...greyWire} />
        <line x1="124" y1="617" x2="181" y2="617" {...orangeWire} />
        <line x1="150" y1="599" x2="181" y2="599" {...wire} />
        <line x1="177" y1="581" x2="181" y2="581" {...greyWire} />

        {/* K2 Delta contactor */}
        {coilBox(285, 357, "K2", "DELTA", "( Δ )")}
        {/* K2 horizontal green wire with gaps at terminals */}
        <path d="M303 366 H320" stroke={green} strokeWidth="3" fill="none" />
        <path d="M336 366 H347" stroke={green} strokeWidth="3" fill="none" />
        <path d="M363 366 H374" stroke={green} strokeWidth="3" fill="none" />
        {contactorPole(328, 343, "1", "2")}
        {contactorPole(355, 343, "3", "4")}
        {contactorPole(382, 343, "5", "6")}

        {/* O/L 2 */}
        <text x="257" y="530" fontSize="20" fontWeight="900" fill={black}>O/L 2</text>
        <rect x="312" y="505" width="83" height="34" fill="none" stroke={red} strokeWidth="3" />
        {overloadPole(329, 505, "1", "2")}
        {overloadPole(356, 505, "3", "4")}
        {overloadPole(383, 505, "5", "6")}
        {/* K2 output to O/L2 wires with gaps at bottom terminals */}
        <line x1="328" y1="393" x2="328" y2="505" {...orangeWire} />
        <line x1="355" y1="393" x2="355" y2="505" {...wire} />
        <line x1="382" y1="393" x2="382" y2="505" {...greyWire} />

        {/* O/L2 to motor right terminals */}
        <line x1="328" y1="539" x2="328" y2="582" {...orangeWire} />
        <line x1="355" y1="539" x2="355" y2="600" {...wire} />
        <line x1="382" y1="539" x2="382" y2="617" {...greyWire} />
        <line x1="325" y1="582" x2="328" y2="582" {...orangeWire} />
        <line x1="325" y1="600" x2="355" y2="600" {...wire} />
        <line x1="325" y1="617" x2="382" y2="617" {...greyWire} />

        {/* MCCB output branch to K2 / K3 */}
        {/* MCCB output branch to K2 with gaps at top terminals */}
        <path d="M177 270 H381 V338" {...greyWire} />
        <path d="M150 287 H355 V338" {...wire} />
        <path d="M124 306 H328 V338" {...orangeWire} />

        {/* Delta cross connections */}
        {blackTerminal(328, 442)}
        {blackTerminal(355, 458)}
        {blackTerminal(382, 477)}
        {/* Delta cross connections: vertical K3 section removed so K3 has gaps like K1 and K2 */}
        <path d="M328 442 H506" {...orangeWire} />
        <path d="M355 458 H532" {...wire} />
        <path d="M382 477 H558" {...greyWire} />

        {/* K3 Star contactor */}
        {coilBox(465, 357, "K3", "STAR", "( Y )")}
        {/* K3 horizontal green wire with gaps like K1 and K2 */}
        <path d="M483 366 H498" stroke={green} strokeWidth="3" fill="none" />
        <path d="M514 366 H524" stroke={green} strokeWidth="3" fill="none" />
        <path d="M540 366 H550" stroke={green} strokeWidth="3" fill="none" />
        {contactorPole(506, 343, "1", "2")}
        {contactorPole(532, 343, "3", "4")}
        {contactorPole(558, 343, "5", "6")}
        <path d="M506 270 H558" {...wire} />
        {blackTerminal(532, 270)}
        {/* K3 input vertical wires with gaps before top terminals */}
        <line x1="506" y1="270" x2="506" y2="338" {...orangeWire} />
        <line x1="532" y1="270" x2="532" y2="338" {...wire} />
        <line x1="558" y1="270" x2="558" y2="338" {...greyWire} />

        {/* Star/Delta lower return links */}
        {/* Star/Delta lower return links with gaps after K3 bottom terminals */}
        <path d="M506 393 V442 H328" {...orangeWire} />
        <path d="M532 393 V458 H355" {...wire} />
        <path d="M558 393 V477 H382" {...greyWire} />
      </svg>
    </div>
  );
}
