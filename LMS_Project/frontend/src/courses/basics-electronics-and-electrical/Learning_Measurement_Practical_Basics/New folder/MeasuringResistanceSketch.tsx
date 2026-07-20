import React from "react";

type MeasuringResistanceSketchProps = {
  className?: string;
};

const VIEW_BOX = "0 0 1448 1086";

const COLORS = {
  black: "#111111",
  dark: "#222222",
  mid: "#4a4a4a",
  red: "#ff3a3a",
  redDark: "#cc2020",
  white: "#ffffff",
};

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const DIGIT_SEGMENTS: Record<string, SegmentName[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "d", "c"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

function Label({
  x,
  y,
  children,
  size = 26,
  anchor = "middle",
  weight = 500,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      fill={COLORS.black}
    >
      {children}
    </text>
  );
}

function SevenSegmentDigit({
  digit,
  x,
  y,
  scale = 1,
}: {
  digit: string;
  x: number;
  y: number;
  scale?: number;
}) {
  const active = DIGIT_SEGMENTS[digit] ?? [];

  const paths: Record<SegmentName, string> = {
    a: "M14 0 H76 L87 10 L76 20 H14 L3 10 Z",
    b: "M88 14 L105 28 V73 L94 85 L77 73 V28 Z",
    c: "M88 92 L105 105 V150 L94 162 L77 150 V105 Z",
    d: "M14 156 H76 L87 166 L76 176 H14 L3 166 Z",
    e: "M0 92 L17 105 V150 L6 162 L-11 150 V105 Z",
    f: "M0 14 L17 28 V73 L6 85 L-11 73 V28 Z",
    g: "M14 78 H76 L87 88 L76 98 H14 L3 88 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={COLORS.black}>
      {active.map((seg) => (
        <path key={seg} d={paths[seg]} />
      ))}
    </g>
  );
}

function DCSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={COLORS.black} strokeWidth={3} strokeLinecap="round">
      <line x1={0} y1={0} x2={28} y2={0} />
      <line x1={0} y1={10} x2={28} y2={10} strokeDasharray="7 5" />
    </g>
  );
}

function ACSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M ${x} ${y} C ${x + 8 * scale} ${y - 8 * scale}, ${x + 16 * scale} ${y + 8 * scale}, ${x + 24 * scale} ${y}
          S ${x + 40 * scale} ${y - 8 * scale}, ${x + 48 * scale} ${y}`}
      fill="none"
      stroke={COLORS.black}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function DiodeSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={COLORS.black} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={-20} y1={0} x2={-2} y2={0} />
      <path d="M-2 -14 L14 0 L-2 14 Z" fill={COLORS.black} />
      <line x1={16} y1={-16} x2={16} y2={16} />
    </g>
  );
}

function ContinuitySymbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={COLORS.black} strokeWidth={4} strokeLinecap="round">
      <circle cx={-22} cy={10} r={4} fill={COLORS.black} stroke="none" />
      <path d="M-6 4 C 6 -6, 6 -6, 14 10" />
      <path d="M6 -4 C 22 -18, 22 -18, 30 10" />
      <path d="M18 -12 C 38 -28, 38 -28, 46 10" />
    </g>
  );
}

function Port({
  cx,
  cy,
  strokeColor = COLORS.black,
}: {
  cx: number;
  cy: number;
  strokeColor?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={31} fill={COLORS.white} stroke={strokeColor} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={21} fill={COLORS.white} stroke={COLORS.black} strokeWidth={4} />
    </g>
  );
}

function Wire({
  d,
  color,
  dark,
  width = 10,
}: {
  d: string;
  color: string;
  dark: string;
  width?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={dark} strokeWidth={width + 3} opacity={0.55} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke={COLORS.white} strokeWidth={1.6} opacity={0.25} />
    </g>
  );
}

function MeterBody() {
  return (
    <g>
      {/* outer body */}
      <rect
        x={112}
        y={43}
        width={500}
        height={773}
        rx={48}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={5}
      />
      <rect
        x={146}
        y={77}
        width={433}
        height={690}
        rx={34}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />

      {/* display */}
      <rect
        x={159}
        y={95}
        width={397}
        height={160}
        rx={11}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />
      <rect
        x={166}
        y={102}
        width={383}
        height={146}
        rx={8}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={2.8}
      />

      {/* center lower panel split */}
      <path
        d="M146 312 C146 289, 161 276, 183 276 H542 C564 276, 579 289, 579 312"
        fill="none"
        stroke={COLORS.black}
        strokeWidth={3}
      />

      {/* LCD value 220 */}
      <SevenSegmentDigit digit="2" x={281} y={126} scale={0.68} />
      <SevenSegmentDigit digit="2" x={352} y={126} scale={0.68} />
      <SevenSegmentDigit digit="0" x={424} y={126} scale={0.68} />
      <Label x={520} y={208} size={42} weight={500}>
        Ω
      </Label>

      {/* top omega above dial */}
      <Label x={353} y={323} size={44}>
        Ω
      </Label>
      <circle cx={354} cy={349} r={6} fill={COLORS.black} />

      {/* selector dial */}
      <circle cx={354} cy={493} r={129} fill={COLORS.white} stroke={COLORS.black} strokeWidth={4} />
      <circle cx={354} cy={493} r={118} fill={COLORS.white} stroke={COLORS.black} strokeWidth={3} />

      {/* knob */}
      <g transform="rotate(15 354 493)">
        <rect
          x={334}
          y={381}
          width={40}
          height={232}
          rx={22}
          fill={COLORS.white}
          stroke={COLORS.black}
          strokeWidth={4}
        />
      </g>

      {/* knob slot / dark pointer mark */}
      <path
        d="M358 381 L373 385 L367 434 L349 429 Z"
        fill={COLORS.dark}
        stroke={COLORS.black}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {/* dial ticks */}
      <g stroke={COLORS.black} strokeWidth={3} strokeLinecap="round">
        <line x1={245} y1={406} x2={230} y2={394} />
        <line x1={219} y1={487} x2={201} y2={487} />
        <line x1={246} y1={570} x2={231} y2={582} />
        <line x1={463} y1={406} x2={478} y2={394} />
        <line x1={489} y1={487} x2={507} y2={487} />
        <line x1={461} y1={570} x2={476} y2={582} />
      </g>

      {/* left side labels */}
      <Label x={191} y={387} size={35}>
        V
      </Label>
      <DCSymbol x={205} y={372} scale={1.15} />

      <Label x={186} y={483} size={35}>
        V
      </Label>
      <ACSymbol x={201} y={468} scale={1.15} />

      <DiodeSymbol x={206} y={592} />

      {/* right side labels */}
      <Label x={495} y={389} size={35}>
        A
      </Label>
      <DCSymbol x={510} y={374} scale={1.15} />

      <Label x={512} y={485} size={35}>
        A
      </Label>
      <ACSymbol x={526} y={470} scale={1.1} />

      <ContinuitySymbol x={491} y={589} />

      {/* port labels */}
      <Label x={265} y={637} size={30}>
        COM
      </Label>
      <Label x={454} y={637} size={30}>
        V/Ω
      </Label>
    </g>
  );
}

function MeterPortsAndInsertedPlugs() {
  return (
    <g>
      <Port cx={266} cy={701} />
      <Port cx={453} cy={701} strokeColor={COLORS.redDark} />

      {/* black plug */}
      <g>
        <rect x={249} y={678} width={34} height={112} rx={10} fill={COLORS.dark} stroke={COLORS.black} strokeWidth={4} />
        <rect x={245} y={727} width={42} height={28} rx={6} fill={COLORS.dark} stroke={COLORS.black} strokeWidth={4} />
        <g stroke="#3b3b3b" strokeWidth={3.2} strokeLinecap="round">
          <line x1={248} y1={744} x2={284} y2={744} />
          <line x1={248} y1={754} x2={284} y2={754} />
          <line x1={248} y1={764} x2={284} y2={764} />
          <line x1={248} y1={774} x2={284} y2={774} />
        </g>
      </g>

      {/* red plug */}
      <g>
        <rect x={436} y={678} width={34} height={112} rx={10} fill={COLORS.red} stroke={COLORS.redDark} strokeWidth={4} />
        <rect x={432} y={727} width={42} height={28} rx={6} fill={COLORS.red} stroke={COLORS.redDark} strokeWidth={4} />
        <g stroke={COLORS.redDark} strokeWidth={3.2} strokeLinecap="round">
          <line x1={435} y1={744} x2={471} y2={744} />
          <line x1={435} y1={754} x2={471} y2={754} />
          <line x1={435} y1={764} x2={471} y2={764} />
          <line x1={435} y1={774} x2={471} y2={774} />
        </g>
      </g>
    </g>
  );
}

function LeadsAndProbes() {
  const blackCable =
    "M266 790 C266 875 295 925 360 956 C449 999 576 998 661 943 C727 900 759 803 794 719";
  const redCable =
    "M453 790 C459 875 518 939 642 976 C805 1024 1082 1024 1236 988 C1312 970 1331 902 1336 826 C1339 752 1323 695 1308 641";
  const probeLeadTopBlack = "M836 541 L879 401";
  const probeLeadTopRed = "M1293 540 L1263 400";

  return (
    <g>
      <Wire d={blackCable} color={COLORS.black} dark="#000000" width={10} />
      <Wire d={redCable} color={COLORS.red} dark={COLORS.redDark} width={10} />

      {/* black probe */}
      <g>
        <path
          d="M795 719 L835 540 C838 525 852 519 864 528 L887 544 C896 550 900 559 897 569 L856 721 C852 735 840 741 827 734 L805 723 C798 719 794 711 795 719 Z"
          fill={COLORS.dark}
          stroke={COLORS.black}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse cx={850} cy={536} rx={18} ry={10} fill={COLORS.dark} stroke={COLORS.black} strokeWidth={4} />
        <g stroke="#444" strokeWidth={3.2} strokeLinecap="round">
          <line x1={810} y1={637} x2={848} y2={653} />
          <line x1={808} y1={648} x2={846} y2={664} />
          <line x1={806} y1={659} x2={844} y2={675} />
          <line x1={804} y1={670} x2={842} y2={686} />
          <line x1={802} y1={681} x2={840} y2={697} />
        </g>
        <path d={probeLeadTopBlack} fill="none" stroke={COLORS.black} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* red probe */}
      <g>
        <path
          d="M1274 721 L1244 544 C1241 527 1250 517 1265 516 L1287 515 C1302 514 1312 522 1314 536 L1345 718 C1347 730 1340 742 1328 745 L1298 749 C1287 750 1277 740 1274 721 Z"
          fill={COLORS.red}
          stroke={COLORS.redDark}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse cx={1271} cy={534} rx={24} ry={11} fill={COLORS.red} stroke={COLORS.redDark} strokeWidth={4} />
        <g stroke={COLORS.redDark} strokeWidth={3.2} strokeLinecap="round">
          <line x1={1282} y1={636} x2={1321} y2={641} />
          <line x1={1281} y1={646} x2={1322} y2={651} />
          <line x1={1280} y1={656} x2={1323} y2={661} />
          <line x1={1279} y1={666} x2={1324} y2={671} />
          <line x1={1278} y1={676} x2={1325} y2={681} />
          <line x1={1277} y1={686} x2={1326} y2={691} />
        </g>
        <path d={probeLeadTopRed} fill="none" stroke={COLORS.black} strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  );
}

function ResistorFigure() {
  return (
    <g>
      {/* wire and leads */}
      <path d="M883 398 H987" fill="none" stroke={COLORS.black} strokeWidth={4} strokeLinecap="round" />
      <path d="M1172 398 H1277" fill="none" stroke={COLORS.black} strokeWidth={4} strokeLinecap="round" />

      {/* small diagonal needle connections */}
      <path d="M879 401 L857 465" fill="none" stroke="#666666" strokeWidth={3} strokeLinecap="round" />
      <path d="M1263 400 L1291 469" fill="none" stroke="#666666" strokeWidth={3} strokeLinecap="round" />

      {/* resistor body */}
      <rect
        x={987}
        y={357}
        width={185}
        height={83}
        rx={20}
        fill={COLORS.white}
        stroke={COLORS.black}
        strokeWidth={4}
      />

      {/* resistor end curves / caps */}
      <path d="M1011 357 V440" fill="none" stroke={COLORS.black} strokeWidth={2.5} />
      <path d="M1149 357 V440" fill="none" stroke={COLORS.black} strokeWidth={2.5} />

      {/* stripes */}
      <rect x={1035} y={365} width={16} height={67} fill={COLORS.black} />
      <rect x={1076} y={365} width={20} height={67} fill={COLORS.black} />
      <rect x={1120} y={365} width={16} height={67} fill={COLORS.black} />

      {/* leads touching body */}
      <line x1={987} y1={398} x2={958} y2={398} stroke={COLORS.black} strokeWidth={4} strokeLinecap="round" />
      <line x1={1172} y1={398} x2={1201} y2={398} stroke={COLORS.black} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

export default function MeasuringResistanceSketch({
  className = "",
}: MeasuringResistanceSketchProps) {
  return (
    <div className={`w-full bg-white p-4 ${className}`}>
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Digital multimeter measuring resistance of a resistor"
      >
        <rect x="0" y="0" width="1448" height="1086" fill={COLORS.white} />

        <MeterBody />
        <MeterPortsAndInsertedPlugs />
        <LeadsAndProbes />
        <ResistorFigure />
      </svg>
    </div>
  );
}