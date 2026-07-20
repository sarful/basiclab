import React from "react";

type AcVoltageSocketSketchProps = {
  className?: string;
};

const VIEW_BOX = "0 0 1448 1086";

const C = {
  white: "#ffffff",
  black: "#101010",
  dark: "#202020",
  dark2: "#333333",
  red: "#e31622",
  redDark: "#a70e17",
  soft: "#f8f8f8",
};

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEGMENTS: Record<string, Segment[]> = {
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
  size = 28,
  anchor = "middle",
  weight = 600,
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
      fill={C.black}
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

  const paths: Record<Segment, string> = {
    a: "M14 0 H75 L86 10 L75 20 H14 L3 10 Z",
    b: "M87 14 L104 27 V73 L93 84 L77 73 V27 Z",
    c: "M87 93 L104 106 V151 L93 162 L77 151 V106 Z",
    d: "M14 157 H75 L86 167 L75 177 H14 L3 167 Z",
    e: "M0 93 L17 106 V151 L6 162 L-10 151 V106 Z",
    f: "M0 14 L17 27 V73 L6 84 L-10 73 V27 Z",
    g: "M14 78 H75 L86 88 L75 98 H14 L3 88 Z",
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={C.black}>
      {active.map((seg) => (
        <path key={seg} d={paths[seg]} />
      ))}
    </g>
  );
}

function Wire({
  d,
  color,
  shadow,
  width = 9,
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
      <path d={d} stroke={C.white} strokeWidth={1.6} opacity={0.22} />
    </g>
  );
}

function ACSymbol({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 7 * scale} ${y - 9 * scale}, ${
        x + 17 * scale
      } ${y + 9 * scale}, ${x + 27 * scale} ${y} S${x + 46 * scale} ${
        y - 9 * scale
      }, ${x + 55 * scale} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function SmallTickGroup() {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={317} y1={351} x2={317} y2={366} />
      <line x1={265} y1={367} x2={277} y2={380} />
      <line x1={230} y1={404} x2={248} y2={404} />
      <line x1={215} y1={461} x2={231} y2={461} />
      <line x1={228} y1={518} x2={246} y2={518} />
      <line x1={384} y1={367} x2={372} y2={380} />
      <line x1={423} y1={404} x2={405} y2={404} />
      <line x1={436} y1={461} x2={419} y2={461} />
    </g>
  );
}

function MeterPort({
  cx,
  cy,
  filled,
  fill = C.white,
}: {
  cx: number;
  cy: number;
  filled?: boolean;
  fill?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={24} fill={C.white} stroke={C.black} strokeWidth={4} />
      <circle
        cx={cx}
        cy={cy}
        r={15}
        fill={filled ? fill : C.white}
        stroke={C.black}
        strokeWidth={4}
      />
    </g>
  );
}

function Multimeter() {
  return (
    <g>
      {/* Main body */}
      <rect
        x={136}
        y={88}
        width={378}
        height={657}
        rx={37}
        fill={C.white}
        stroke={C.black}
        strokeWidth={6}
      />

      {/* Inner face */}
      <rect
        x={166}
        y={124}
        width={317}
        height={586}
        rx={28}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      {/* LCD */}
      <rect
        x={190}
        y={148}
        width={271}
        height={120}
        rx={8}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />
      <rect
        x={197}
        y={157}
        width={256}
        height={101}
        rx={4}
        fill={C.white}
        stroke={C.black}
        strokeWidth={2.5}
      />

      {/* Display value: 230 */}
      <SevenSegmentDigit digit="2" x={258} y={161} scale={0.5} />
      <SevenSegmentDigit digit="3" x={325} y={161} scale={0.5} />
      <SevenSegmentDigit digit="0" x={389} y={161} scale={0.5} />

      {/* Small oval button */}
      <rect
        x={188}
        y={292}
        width={48}
        height={27}
        rx={12}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      {/* V~ label */}
      <Label x={383} y={318} size={35}>
        V~
      </Label>

      {/* Dial */}
      <circle cx={326} cy={462} r={98} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={326} cy={462} r={87} fill={C.white} stroke={C.black} strokeWidth={3} />

      <SmallTickGroup />

      {/* Dial selector */}
      <g transform="rotate(32 326 462)">
        <rect
          x={307}
          y={368}
          width={38}
          height={193}
          rx={20}
          fill={C.white}
          stroke={C.black}
          strokeWidth={5}
        />
      </g>
      <ellipse
        cx={366}
        cy={412}
        rx={6}
        ry={11}
        transform="rotate(32 366 412)"
        fill={C.white}
        stroke={C.black}
        strokeWidth={3}
      />

      {/* Bottom ports */}
      <MeterPort cx={212} cy={650} />
      <MeterPort cx={287} cy={650} filled fill={C.dark} />
      <MeterPort cx={363} cy={650} />
      <MeterPort cx={443} cy={650} filled fill={C.red} />

      {/* Black plug */}
      <g>
        <rect x={265} y={626} width={43} height={67} rx={9} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <rect x={273} y={684} width={26} height={48} rx={5} fill={C.dark} stroke={C.black} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={276} y1={692} x2={297} y2={692} />
          <line x1={278} y1={701} x2={295} y2={701} />
          <line x1={280} y1={711} x2={293} y2={711} />
        </g>
      </g>

      {/* Red plug */}
      <g>
        <rect x={424} y={626} width={41} height={67} rx={10} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <rect x={432} y={684} width={24} height={49} rx={5} fill={C.red} stroke={C.redDark} strokeWidth={4} />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={434} y1={692} x2={456} y2={692} />
          <line x1={436} y1={701} x2={454} y2={701} />
          <line x1={438} y1={711} x2={452} y2={711} />
        </g>
      </g>
    </g>
  );
}

function WallSocket() {
  return (
    <g>
      {/* Outer outlet plate */}
      <rect
        x={852}
        y={268}
        width={386}
        height={365}
        rx={23}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      {/* Inner square */}
      <rect
        x={900}
        y={318}
        width={292}
        height={271}
        rx={13}
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      {/* Round socket face */}
      <circle cx={1045} cy={459} r={114} fill={C.white} stroke={C.black} strokeWidth={4} />

      {/* Top notch */}
      <path
        d="M1032 341 H1058 V368 H1032 Z"
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M1040 341 V361 H1050 V341" fill="none" stroke={C.black} strokeWidth={3} />

      {/* Bottom notch */}
      <path
        d="M1032 543 H1058 V571 H1032 Z"
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M1040 571 V551 H1050 V571" fill="none" stroke={C.black} strokeWidth={3} />

      {/* Socket holes */}
      <circle cx={981} cy={457} r={16} fill={C.white} stroke={C.black} strokeWidth={4} />
      <circle cx={1110} cy={457} r={16} fill={C.white} stroke={C.black} strokeWidth={4} />

      {/* Probe metal tips inside holes */}
      <path
        d="M981 457 L960 528"
        fill="none"
        stroke={C.black}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M1110 457 L1136 527"
        fill="none"
        stroke={C.black}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M981 457 L964 513"
        fill="none"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path
        d="M1110 457 L1130 514"
        fill="none"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
    </g>
  );
}

function ProbesAndWires() {
  const blackWire =
    "M287 733 C288 834 344 918 445 949 C557 984 718 958 784 848 C827 777 850 707 883 638";
  const redWire =
    "M444 733 C448 823 510 908 654 958 C823 1017 1099 1020 1194 966 C1261 928 1247 845 1218 738";

  return (
    <g>
      <Wire d={blackWire} color={C.black} shadow="#000000" width={8} />
      <Wire d={redWire} color={C.red} shadow={C.redDark} width={8} />

      {/* Black probe */}
      <g>
        <path
          d="M875 553 L926 575 L868 734 C862 749 847 754 836 744 L821 732 C815 727 813 719 816 711 Z"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect
          x={847}
          y={540}
          width={55}
          height={41}
          rx={7}
          transform="rotate(19 874 560)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />
        <ellipse
          cx={884}
          cy={704}
          rx={30}
          ry={8}
          transform="rotate(18 884 704)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />
        <rect
          x={851}
          y={714}
          width={28}
          height={36}
          rx={5}
          transform="rotate(18 865 732)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
      </g>

      {/* Red probe */}
      <g>
        <path
          d="M1136 527 L1178 514 L1235 699 C1240 715 1234 727 1221 731 L1205 736 C1192 740 1183 733 1178 718 Z"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect
          x={1131}
          y={523}
          width={47}
          height={43}
          rx={7}
          transform="rotate(-15 1154 544)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />
        <ellipse
          cx={1200}
          cy={704}
          rx={30}
          ry={8}
          transform="rotate(-15 1200 704)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />
        <rect
          x={1202}
          y={714}
          width={27}
          height={40}
          rx={5}
          transform="rotate(-15 1215 734)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
      </g>
    </g>
  );
}

export default function AcVoltageSocketSketch({
  className = "",
}: AcVoltageSocketSketchProps) {
  return (
    <div className={`w-full bg-white p-4 ${className}`}>
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Digital multimeter measuring AC voltage from wall socket"
      >
        <rect width="1448" height="1086" fill={C.white} />

        <Multimeter />
        <WallSocket />
        <ProbesAndWires />
      </svg>
    </div>
  );
}