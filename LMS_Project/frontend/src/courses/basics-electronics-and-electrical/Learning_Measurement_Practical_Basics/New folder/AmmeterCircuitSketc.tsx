import React from "react";

type AmmeterCircuitSketchProps = {
  className?: string;
};

const VIEW_BOX = "0 0 1448 1086";

const C = {
  white: "#ffffff",
  black: "#111111",
  dark: "#222222",
  mid: "#444444",
  light: "#f7f7f7",
  red: "#ef2a2a",
  redDark: "#b4141b",
};

type SegmentName = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEGMENTS: Record<string, SegmentName[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

function Label({
  x,
  y,
  children,
  size = 30,
  anchor = "middle",
  weight = 600,
  fill = C.black,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  fill?: string;
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
      fill={fill}
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
  const active = SEGMENTS[digit] ?? [];

  const paths: Record<SegmentName, string> = {
    a: "M15 0 H76 L88 11 L76 22 H15 L3 11 Z",
    b: "M90 15 L108 29 V78 L96 91 L78 78 V29 Z",
    c: "M90 100 L108 113 V161 L96 174 L78 161 V113 Z",
    d: "M15 167 H76 L88 178 L76 189 H15 L3 178 Z",
    e: "M0 100 L18 113 V161 L6 174 L-12 161 V113 Z",
    f: "M0 15 L18 29 V78 L6 91 L-12 78 V29 Z",
    g: "M15 83 H76 L88 94 L76 105 H15 L3 94 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={C.black}>
      {active.map((seg) => (
        <path key={seg} d={paths[seg]} />
      ))}
    </g>
  );
}

function DCSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    >
      <line x1={0} y1={0} x2={48} y2={0} />
      <line x1={0} y1={14} x2={48} y2={14} strokeDasharray="11 8" />
    </g>
  );
}

function ACSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 10 * scale} ${y - 12 * scale}, ${
        x + 22 * scale
      } ${y + 12 * scale}, ${x + 34 * scale} ${y} S${x + 56 * scale} ${
        y - 12 * scale
      }, ${x + 68 * scale} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function DiodeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <line x1={-28} y1={0} x2={-5} y2={0} />
      <path d="M-5 -17 L18 0 L-5 17 Z" fill={C.black} />
      <line x1={23} y1={-21} x2={23} y2={21} />
      <line x1={23} y1={0} x2={45} y2={0} />
    </g>
  );
}

function ContinuityIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
    >
      <circle cx={-22} cy={9} r={5} fill={C.black} stroke="none" />
      <path d="M-4 2 C10 -10 10 -10 20 9" />
      <path d="M10 -8 C32 -25 32 -25 44 9" />
    </g>
  );
}

function GroundIcon({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={x} y1={y - 20} x2={x} y2={y} />
      <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
      <line x1={x - 12} y1={y + 9} x2={x + 12} y2={y + 9} />
      <line x1={x - 6} y1={y + 18} x2={x + 6} y2={y + 18} />
    </g>
  );
}

function Wire({
  d,
  color,
  shadow,
  width = 8,
}: {
  d: string;
  color: string;
  shadow: string;
  width?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadow} strokeWidth={width + 4} opacity={0.55} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke={C.white} strokeWidth={1.5} opacity={0.25} />
    </g>
  );
}

function Port({
  cx,
  cy,
  color = C.black,
}: {
  cx: number;
  cy: number;
  color?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={31} fill={C.white} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={19} fill={C.white} stroke={C.black} strokeWidth={5} />
    </g>
  );
}

function Multimeter() {
  return (
    <g>
      {/* Main case */}
      <rect
        x={62}
        y={45}
        width={467}
        height={898}
        rx={46}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />

      {/* Inner case */}
      <rect
        x={83}
        y={67}
        width={425}
        height={854}
        rx={31}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3.8}
      />

      {/* LCD */}
      <rect
        x={105}
        y={99}
        width={375}
        height={166}
        rx={14}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4.5}
      />
      <rect
        x={115}
        y={109}
        width={355}
        height={145}
        rx={7}
        fill={C.white}
        stroke={C.black}
        strokeWidth={2.5}
      />

      {/* LCD value 0.50 A */}
      <SevenSegmentDigit digit="0" x={190} y={127} scale={0.72} />
      <circle cx={252} cy={223} r={7} fill={C.black} />
      <SevenSegmentDigit digit="5" x={281} y={127} scale={0.72} />
      <SevenSegmentDigit digit="0" x={355} y={127} scale={0.72} />
      <Label x={443} y={206} size={48} weight={500}>
        A
      </Label>

      {/* Divider below LCD */}
      <line x1={83} y1={286} x2={508} y2={286} stroke={C.black} strokeWidth={3} />

      {/* Dial labels */}
      <Label x={294} y={320} size={31}>OFF</Label>
      <line x1={294} y1={337} x2={294} y2={359} stroke={C.black} strokeWidth={4} />

      <Label x={132} y={345} size={34}>V</Label>
      <DCSymbol x={153} y={333} scale={0.72} />

      <Label x={443} y={345} size={34}>V</Label>
      <ACSymbol x={464} y={333} scale={0.72} />

      <Label x={116} y={450} size={37}>Ω</Label>
      <ContinuityIcon x={112} y={527} />
      <DiodeIcon x={132} y={608} />

      <Label x={450} y={438} size={28} fill={C.red}>
        A
      </Label>
      <DCSymbol x={467} y={427} scale={0.7} />
      <g stroke={C.red} strokeWidth={3} strokeLinecap="round">
        <line x1={467} y1={427} x2={502} y2={427} />
        <line x1={467} y1={438} x2={502} y2={438} strokeDasharray="8 6" />
      </g>

      <Label x={442} y={535} size={27}>mA</Label>
      <DCSymbol x={475} y={524} scale={0.65} />

      <Label x={441} y={610} size={27}>10A</Label>
      <DCSymbol x={480} y={599} scale={0.65} />

      {/* Dial rings */}
      <circle cx={293} cy={499} r={143} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={293} cy={499} r={130} fill={C.white} stroke={C.black} strokeWidth={3} />

      {/* Ticks */}
      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={190} y1={371} x2={207} y2={391} />
        <line x1={153} y1={459} x2={177} y2={465} />
        <line x1={142} y1={534} x2={166} y2={528} />
        <line x1={168} y1={598} x2={189} y2={585} />
        <line x1={398} y1={371} x2={381} y2={391} />
        <line x1={432} y1={445} x2={410} y2={456} />
        <line x1={428} y1={539} x2={404} y2={532} />
        <line x1={399} y1={601} x2={381} y2={582} />
      </g>

      {/* Dial pointer knob */}
      <g transform="rotate(63 293 499)">
        <rect
          x={270}
          y={356}
          width={45}
          height={286}
          rx={24}
          fill={C.white}
          stroke={C.black}
          strokeWidth={5}
        />
      </g>
      <path d="M378 455 L423 441 L397 481 Z" fill={C.black} />

      {/* Bottom ports */}
      <Label x={150} y={735} size={28}>10A</Label>
      <Port cx={150} cy={790} />

      <Label x={293} y={735} size={31}>COM</Label>
      <Port cx={293} cy={790} />

      <Label x={428} y={735} size={28}>mA</Label>
      <Port cx={428} cy={790} color={C.redDark} />

      <GroundIcon x={242} y={865} />

      <Label x={150} y={840} size={20}>FUSED</Label>
      <Label x={150} y={866} size={18}>10A MAX</Label>

      <Label x={428} y={840} size={20}>FUSED</Label>
      <Label x={428} y={866} size={18}>200mA MAX</Label>
    </g>
  );
}

function Plugs() {
  return (
    <g>
      {/* COM black plug */}
      <g>
        <rect x={274} y={780} width={38} height={78} rx={10} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={266} y={832} width={54} height={34} rx={6} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={279} y1={843} x2={310} y2={843} />
          <line x1={281} y1={854} x2={308} y2={854} />
          <line x1={283} y1={865} x2={306} y2={865} />
          <line x1={285} y1={876} x2={304} y2={876} />
        </g>
      </g>

      {/* red mA plug */}
      <g transform="rotate(-39 428 790)">
        <rect x={409} y={769} width={41} height={77} rx={10} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <rect x={401} y={822} width={57} height={33} rx={6} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <g stroke={C.redDark} strokeWidth={4} strokeLinecap="round">
          <line x1={413} y1={834} x2={447} y2={834} />
          <line x1={416} y1={845} x2={444} y2={845} />
          <line x1={419} y1={856} x2={441} y2={856} />
          <line x1={422} y1={867} x2={438} y2={867} />
        </g>
      </g>
    </g>
  );
}

function Battery9V() {
  return (
    <g>
      {/* battery terminals */}
      <rect x={969} y={109} width={40} height={25} rx={4} fill={C.white} stroke={C.black} strokeWidth={4} />
      <rect x={1110} y={109} width={40} height={25} rx={4} fill={C.white} stroke={C.black} strokeWidth={4} />

      <Label x={990} y={68} size={42}>+</Label>
      <Label x={1130} y={68} size={42}>−</Label>

      {/* battery body */}
      <rect
        x={950}
        y={132}
        width={218}
        height={310}
        rx={7}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      <Label x={1059} y={259} size={58} weight={500}>9V</Label>

      <line x1={1013} y1={304} x2={1106} y2={304} stroke={C.black} strokeWidth={4} />
      <line x1={1014} y1={330} x2={1037} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />
      <line x1={1052} y1={330} x2={1074} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />
      <line x1={1089} y1={330} x2={1112} y2={330} stroke={C.black} strokeWidth={4} strokeLinecap="round" />

      {/* top negative wire leaving battery */}
      <path
        d="M1150 134 H1339 C1372 134 1387 156 1387 190 V552"
        fill="none"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Lamp() {
  return (
    <g>
      {/* vertical black wire through lamp */}
      <path
        d="M1387 552 V1004 C1387 1023 1370 1035 1348 1035 H720"
        fill="none"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* bulb circle */}
      <circle cx={1385} cy={610} r={53} fill={C.white} stroke={C.black} strokeWidth={4} />
      <line x1={1349} y1={573} x2={1421} y2={646} stroke={C.black} strokeWidth={4} />
      <line x1={1420} y1={574} x2={1349} y2={646} stroke={C.black} strokeWidth={4} />

      {/* light rays */}
      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={1320} y1={596} x2={1291} y2={589} />
        <line x1={1452} y1={596} x2={1481} y2={589} />
        <line x1={1317} y1={666} x2={1297} y2={689} />
        <line x1={1454} y1={666} x2={1476} y2={689} />
        <line x1={1326} y1={540} x2={1309} y2={518} />
        <line x1={1445} y1={540} x2={1462} y2={518} />
      </g>
    </g>
  );
}

function CircuitWires() {
  const redWire =
    "M463 824 C520 888 627 900 654 806 V213 C654 162 691 140 731 140 H776";

  const blackWire =
    "M294 866 C294 953 337 1036 385 1036 H640";

  return (
    <g>
      <Wire d={redWire} color={C.red} shadow={C.redDark} width={8} />
      <Wire d={blackWire} color={C.black} shadow="#000000" width={7} />

      {/* red top connector near battery plus */}
      <g>
        <path
          d="M776 140 H928"
          stroke={C.redDark}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <rect x={775} y={124} width={112} height={34} rx={7} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <rect x={844} y={116} width={43} height={50} rx={7} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <rect x={888} y={122} width={17} height={38} rx={5} fill={C.white} stroke={C.redDark} strokeWidth={4} />
        <g stroke={C.redDark} strokeWidth={4} strokeLinecap="round">
          <line x1={785} y1={130} x2={785} y2={151} />
          <line x1={797} y1={126} x2={797} y2={154} />
          <line x1={810} y1={126} x2={810} y2={154} />
          <line x1={823} y1={124} x2={823} y2={156} />
          <line x1={836} y1={120} x2={836} y2={160} />
          <line x1={855} y1={120} x2={855} y2={163} />
          <line x1={867} y1={120} x2={867} y2={163} />
        </g>
      </g>

      {/* black bottom connector */}
      <g>
        <rect x={630} y={1018} width={94} height={35} rx={5} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={628} y={1020} width={16} height={31} rx={4} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={645} y={1018} width={14} height={35} rx={3} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={662} y={1018} width={14} height={35} rx={3} fill={C.dark} stroke={C.black} strokeWidth={4} />
      </g>
    </g>
  );
}

export default function AmmeterCircuitSketch({
  className = "",
}: AmmeterCircuitSketchProps) {
  return (
    <div className={`w-full bg-white p-4 ${className}`}>
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Digital multimeter measuring current in a 9V battery and lamp circuit"
      >
        <rect width="1448" height="1086" fill={C.white} />

        <Multimeter />
        <CircuitWires />
        <Plugs />
        <Battery9V />
        <Lamp />
      </svg>
    </div>
  );
}