import React from "react";

type SketchProps = {
  className?: string;
};

const VIEW_BOX = "0 0 1448 1086";

const BLACK = "#111111";
const DARK = "#222222";
const RED = "#e5252a";
const RED_DARK = "#9f151b";
const WHITE = "#ffffff";

const stroke = {
  thin: 2.5,
  base: 4,
  bold: 6,
  wire: 10,
};

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const DIGIT_SEGMENTS: Record<string, SegmentName[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "c", "d", "e"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

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

  const segmentPath: Record<SegmentName, string> = {
    a: "M14 0 H76 L86 10 L76 20 H14 L4 10 Z",
    b: "M88 15 L104 28 V73 L94 84 L78 73 V28 Z",
    c: "M88 91 L104 102 V148 L94 160 L78 148 V102 Z",
    d: "M14 155 H76 L86 165 L76 175 H14 L4 165 Z",
    e: "M0 91 L16 102 V148 L6 160 L-10 148 V102 Z",
    f: "M0 15 L16 28 V73 L6 84 L-10 73 V28 Z",
    g: "M14 78 H76 L86 88 L76 98 H14 L4 88 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={BLACK}>
      {active.map((name) => (
        <path key={name} d={segmentPath[name]} />
      ))}
    </g>
  );
}

function Label({
  x,
  y,
  children,
  size = 30,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily="Arial, Helvetica, sans-serif"
      fill={BLACK}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

function DcSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={BLACK} strokeWidth={3} strokeLinecap="round">
      <line x1={x - 15} y1={y} x2={x + 15} y2={y} />
      <line x1={x - 15} y1={y + 11} x2={x + 15} y2={y + 11} strokeDasharray="7 6" />
    </g>
  );
}

function Port({
  cx,
  cy,
  color = BLACK,
}: {
  cx: number;
  cy: number;
  color?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={29} fill={WHITE} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={18} fill={WHITE} stroke={BLACK} strokeWidth={4} />
    </g>
  );
}

function WirePath({
  d,
  color,
  dark,
  width = stroke.wire,
}: {
  d: string;
  color: string;
  dark: string;
  width?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={dark} strokeWidth={width + 4} opacity={0.55} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke={WHITE} strokeWidth={2} opacity={0.25} />
    </g>
  );
}

function MultimeterBody() {
  return (
    <g>
      {/* Outer casing */}
      <rect
        x={121}
        y={49}
        width={452}
        height={754}
        rx={38}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={5}
      />

      <rect
        x={144}
        y={72}
        width={406}
        height={707}
        rx={26}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />

      {/* LCD area */}
      <rect
        x={176}
        y={106}
        width={342}
        height={147}
        rx={11}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <rect
        x={185}
        y={116}
        width={324}
        height={126}
        rx={7}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={3}
      />

      {/* Display digits */}
      <SevenSegmentDigit digit="1" x={267} y={136} scale={0.58} />
      <SevenSegmentDigit digit="2" x={328} y={136} scale={0.58} />
      <circle cx={405} cy={230} r={7} fill={BLACK} />
      <SevenSegmentDigit digit="4" x={424} y={136} scale={0.58} />
      <SevenSegmentDigit digit="5" x={486} y={136} scale={0.58} />

      {/* Dial labels */}
      <Label x={213} y={316} size={33}>V</Label>
      <DcSymbol x={213} y={340} />

      <Label x={345} y={305} size={34}>Ω</Label>
      <line x1={345} y1={327} x2={345} y2={339} stroke={BLACK} strokeWidth={3} />

      <Label x={463} y={325} size={34}>V</Label>
      <path
        d="M443 351 C452 340, 462 363, 472 351 S492 340, 500 351"
        fill="none"
        stroke={BLACK}
        strokeWidth={3}
      />

      <Label x={184} y={408} size={32}>A</Label>
      <DcSymbol x={184} y={431} />

      <Label x={184} y={506} size={32}>A</Label>
      <path
        d="M166 529 C176 517, 188 541, 199 529 S218 517, 228 529"
        fill="none"
        stroke={BLACK}
        strokeWidth={3}
      />

      <Label x={477} y={568} size={30}>OFF</Label>

      {/* Diode mark */}
      <g transform="translate(491 411)" stroke={BLACK} strokeWidth={4} fill="none">
        <path d="M-16 0 H20" />
        <path d="M-6 -15 L10 0 L-6 15 Z" fill={BLACK} />
        <path d="M22 -18 V18" />
      </g>

      {/* Continuity mark */}
      <g transform="translate(508 503)" fill="none" stroke={BLACK} strokeWidth={4} strokeLinecap="round">
        <path d="M-15 -12 C-4 -5, -4 5, -15 12" />
        <path d="M-4 -20 C13 -8, 13 8, -4 20" />
        <circle cx={-25} cy={0} r={3} fill={BLACK} />
      </g>

      {/* Dial ring */}
      <circle cx={346} cy={456} r={119} fill={WHITE} stroke={BLACK} strokeWidth={4} />
      <circle cx={346} cy={456} r={109} fill={WHITE} stroke={BLACK} strokeWidth={3} />

      {/* Dial ticks */}
      <g stroke={BLACK} strokeWidth={3} strokeLinecap="round">
        <line x1={260} y1={353} x2={268} y2={366} />
        <line x1={193} y1={421} x2={207} y2={425} />
        <line x1={193} y1={520} x2={207} y2={515} />
        <line x1={432} y1={356} x2={424} y2={369} />
        <line x1={489} y1={418} x2={475} y2={422} />
        <line x1={491} y1={497} x2={478} y2={492} />
        <line x1={440} y1={584} x2={430} y2={572} />
      </g>

      {/* Knob */}
      <g transform="rotate(-36 346 456)">
        <rect
          x={326}
          y={338}
          width={41}
          height={236}
          rx={22}
          fill={WHITE}
          stroke={BLACK}
          strokeWidth={4}
        />
      </g>

      {/* Pointer triangle */}
      <path d="M284 379 L304 389 L288 403 Z" fill={BLACK} />

      {/* Port labels */}
      <Label x={241} y={652} size={28}>COM</Label>
      <Label x={457} y={652} size={28}>V/Ω</Label>
    </g>
  );
}

function Battery() {
  return (
    <g>
      {/* Battery body */}
      <rect
        x={896}
        y={694}
        width={322}
        height={246}
        rx={8}
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
      />
      <path d="M896 773 H1218" stroke={BLACK} strokeWidth={4} />

      {/* Top lip */}
      <path
        d="M910 693 L926 665 H1188 L1210 693 Z"
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Terminals */}
      <g>
        <rect x={941} y={671} width={43} height={38} rx={8} fill={WHITE} stroke={BLACK} strokeWidth={4} />
        <ellipse cx={962.5} cy={672} rx={22} ry={7} fill={WHITE} stroke={BLACK} strokeWidth={3} />
      </g>

      <g>
        <rect x={1133} y={671} width={43} height={38} rx={8} fill={WHITE} stroke={BLACK} strokeWidth={4} />
        <ellipse cx={1154.5} cy={672} rx={22} ry={7} fill={WHITE} stroke={BLACK} strokeWidth={3} />
      </g>

      {/* Signs */}
      <Label x={960} y={745} size={42}>−</Label>
      <Label x={1158} y={747} size={42}>+</Label>
    </g>
  );
}

function Wires() {
  const blackWire =
    "M244 729 C242 800 244 850 274 890 C333 966 514 994 626 894 C690 837 678 740 728 655";

  const blackLeadToBattery =
    "M825 477 C874 438 931 460 936 523 C939 563 941 604 947 646";

  const redWire =
    "M455 729 C455 820 511 905 640 954 C780 1008 1067 1013 1234 960 C1320 932 1327 817 1296 678 C1277 589 1240 512 1186 505 C1154 501 1139 532 1144 583 C1148 626 1150 647 1153 673";

  return (
    <g>
      <WirePath d={blackWire} color={BLACK} dark="#000000" width={10} />
      <WirePath d={blackLeadToBattery} color={BLACK} dark="#000000" width={9} />
      <WirePath d={redWire} color={RED} dark={RED_DARK} width={10} />
    </g>
  );
}

function ProbesAndPorts() {
  return (
    <g>
      {/* Multimeter ports */}
      <Port cx={244} cy={704} color={BLACK} />
      <Port cx={351} cy={704} color={BLACK} />
      <Port cx={455} cy={704} color={RED} />

      {/* Plug bodies */}
      <g>
        <rect x={229} y={704} width={31} height={60} rx={8} fill={DARK} stroke={BLACK} strokeWidth={3} />
        <rect x={225} y={741} width={39} height={28} rx={4} fill={DARK} stroke={BLACK} strokeWidth={3} />
        <line x1={230} y1={755} x2={260} y2={755} stroke={BLACK} strokeWidth={3} />
        <line x1={230} y1={763} x2={260} y2={763} stroke={BLACK} strokeWidth={3} />
      </g>

      <g>
        <rect x={440} y={704} width={31} height={60} rx={8} fill={RED} stroke={RED_DARK} strokeWidth={3} />
        <rect x={436} y={741} width={39} height={28} rx={4} fill={RED} stroke={RED_DARK} strokeWidth={3} />
        <line x1={441} y1={755} x2={471} y2={755} stroke={RED_DARK} strokeWidth={3} />
        <line x1={441} y1={763} x2={471} y2={763} stroke={RED_DARK} strokeWidth={3} />
      </g>

      {/* Black handheld probe */}
      <g>
        <path
          d="M719 653 L817 475 C824 462 839 463 845 474 L748 660 C741 674 724 670 719 653 Z"
          fill={DARK}
          stroke={BLACK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M810 485 L835 500"
          stroke={BLACK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <g stroke="#444" strokeWidth={3} strokeLinecap="round">
          <line x1={776} y1={548} x2={807} y2={567} />
          <line x1={768} y1={562} x2={799} y2={581} />
          <line x1={760} y1={576} x2={791} y2={595} />
          <line x1={752} y1={590} x2={783} y2={609} />
        </g>
      </g>

      {/* Black vertical probe into negative terminal */}
      <g>
        <rect x={935} y={522} width={27} height={126} rx={8} fill={DARK} stroke={BLACK} strokeWidth={4} />
        <rect x={930} y={627} width={38} height={9} rx={4} fill={DARK} stroke={BLACK} strokeWidth={4} />
        <path d="M949 648 V681" stroke={BLACK} strokeWidth={8} strokeLinecap="round" />
        <path d="M949 648 V681" stroke={WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      </g>

      {/* Red probe */}
      <g>
        <rect x={1140} y={515} width={29} height={129} rx={8} fill={RED} stroke={RED_DARK} strokeWidth={4} />
        <path
          d="M1136 646 L1173 646 L1163 674 L1146 674 Z"
          fill={RED}
          stroke={RED_DARK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect x={1126} y={611} width={58} height={10} rx={5} fill={RED} stroke={RED_DARK} strokeWidth={4} />
        <path d="M1155 674 V705" stroke={BLACK} strokeWidth={8} strokeLinecap="round" />
        <path d="M1155 674 V705" stroke={WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        <g stroke={RED_DARK} strokeWidth={3} strokeLinecap="round">
          <line x1={1144} y1={535} x2={1165} y2={535} />
          <line x1={1142} y1={548} x2={1166} y2={548} />
          <line x1={1142} y1={561} x2={1167} y2={561} />
          <line x1={1142} y1={574} x2={1167} y2={574} />
        </g>
      </g>
    </g>
  );
}

export default function MeasuringVoltageSketch({ className = "" }: SketchProps) {
  return (
    <div className={`w-full bg-white p-4 ${className}`}>
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Digital multimeter measuring DC voltage from a battery"
      >
        <rect width="1448" height="1086" fill={WHITE} />

        <MultimeterBody />
        <Wires />
        <Battery />
        <ProbesAndPorts />
      </svg>
    </div>
  );
}