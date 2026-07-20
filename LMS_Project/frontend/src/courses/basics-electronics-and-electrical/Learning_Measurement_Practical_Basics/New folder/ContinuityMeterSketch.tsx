import React from "react";

type ContinuityMeterSketchProps = {
  className?: string;
};

const VIEW_BOX = "0 0 1448 1086";

const C = {
  black: "#101010",
  dark: "#222222",
  dark2: "#333333",
  grey: "#dfe3dc",
  white: "#ffffff",
  red: "#ff3333",
  redDark: "#ba1717",
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
  size = 30,
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

  const path: Record<Segment, string> = {
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
        <path key={seg} d={path[seg]} />
      ))}
    </g>
  );
}

function ContinuityIcon({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
    >
      <circle cx={0} cy={22} r={7} fill={C.black} stroke="none" />
      <path d="M24 6 C42 24 42 24 24 42" />
      <path d="M45 -6 C72 22 72 22 45 50" />
      <path d="M68 -18 C104 22 104 22 68 62" />
    </g>
  );
}

function ACSymbol({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} C${x + 11} ${y - 12}, ${x + 23} ${y + 12}, ${
        x + 35
      } ${y} S${x + 57} ${y - 12}, ${x + 68} ${y}`}
      fill="none"
      stroke={C.black}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

function DCSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + 48} y2={y} />
      <line
        x1={x}
        y1={y + 13}
        x2={x + 48}
        y2={y + 13}
        strokeDasharray="11 8"
      />
    </g>
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
      <line x1={-26} y1={0} x2={-4} y2={0} />
      <path d="M-4 -17 L17 0 L-4 17 Z" fill={C.black} />
      <line x1={22} y1={-20} x2={22} y2={20} />
      <line x1={22} y1={0} x2={45} y2={0} />
    </g>
  );
}

function CapacitorIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={C.black}
      strokeWidth={5}
      strokeLinecap="round"
      fill="none"
    >
      <line x1={-45} y1={0} x2={-13} y2={0} />
      <line x1={13} y1={0} x2={45} y2={0} />
      <line x1={-13} y1={-20} x2={-13} y2={20} />
      <line x1={13} y1={-20} x2={13} y2={20} />
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
      <circle cx={cx} cy={cy} r={35} fill={C.white} stroke={color} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={27} fill={C.white} stroke={C.black} strokeWidth={4} />
    </g>
  );
}

function Wire({
  d,
  color,
  shadow,
  width = 12,
}: {
  d: string;
  color: string;
  shadow: string;
  width?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shadow} strokeWidth={width + 5} opacity={0.6} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke={C.white} strokeWidth={2} opacity={0.24} />
    </g>
  );
}

function MeterBody() {
  return (
    <g>
      {/* outer meter body */}
      <path
        d="
          M122 34
          H570
          C610 34 633 63 633 106
          V267
          C633 288 624 308 624 328
          V805
          C624 850 595 873 552 873
          H125
          C86 873 62 845 62 806
          V699
          C62 681 67 663 67 646
          V355
          C67 332 62 311 62 288
          V105
          C62 64 84 34 122 34
          Z
        "
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />

      {/* side grip notches */}
      <g fill={C.white} stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <path d="M64 346 H81 V385 H65" />
        <path d="M64 389 H82 V461 H65" />
        <path d="M64 462 H82 V509 H65" />
        <path d="M64 510 H82 V624 H65" />
        <path d="M629 340 H616 V383 H629" />
        <path d="M629 386 H616 V456 H629" />
        <path d="M629 458 H616 V504 H629" />
        <path d="M629 506 H616 V626 H629" />
      </g>

      {/* inner face */}
      <path
        d="
          M132 56
          H549
          C580 56 603 81 603 118
          V802
          C603 829 584 847 555 847
          H130
          C102 847 84 828 84 801
          V118
          C84 82 104 56 132 56
          Z
        "
        fill={C.white}
        stroke={C.black}
        strokeWidth={4}
      />

      {/* LCD outer */}
      <rect
        x={132}
        y={99}
        width={440}
        height={167}
        rx={12}
        fill={C.white}
        stroke={C.black}
        strokeWidth={5}
      />

      {/* LCD inner */}
      <rect
        x={145}
        y={111}
        width={414}
        height={139}
        rx={6}
        fill={C.grey}
        stroke={C.black}
        strokeWidth={3}
      />

      {/* Display content */}
      <ContinuityIcon x={185} y={160} scale={0.82} />
      <SevenSegmentDigit digit="0" x={370} y={128} scale={0.7} />
      <circle cx={457} cy={222} r={7} fill={C.black} />
      <SevenSegmentDigit digit="0" x={470} y={128} scale={0.7} />
      <Label x={529} y={221} size={41} weight={500}>
        Ω
      </Label>

      {/* dial labels */}
      <Label x={354} y={320} size={31}>OFF</Label>
      <line x1={354} y1={337} x2={354} y2={358} stroke={C.black} strokeWidth={4} />

      <Label x={176} y={345} size={34}>V</Label>
      <ACSymbol x={161} y={371} />

      <Label x={166} y={444} size={34}>V</Label>
      <DCSymbol x={136} y={466} />

      <ContinuityIcon x={162} y={570} scale={0.82} />

      <Label x={502} y={362} size={42}>Ω</Label>
      <DiodeIcon x={543} y={461} />
      <CapacitorIcon x={542} y={572} />

      {/* dial ring */}
      <circle cx={353} cy={498} r={137} fill={C.white} stroke={C.black} strokeWidth={5} />
      <circle cx={353} cy={498} r={126} fill={C.white} stroke={C.black} strokeWidth={3} />

      {/* dial ticks */}
      <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
        <line x1={260} y1={365} x2={271} y2={386} />
        <line x1={205} y1={430} x2={225} y2={441} />
        <line x1={190} y1={512} x2={211} y2={510} />
        <line x1={441} y1={365} x2={429} y2={386} />
        <line x1={502} y1={426} x2={481} y2={438} />
        <line x1={514} y1={510} x2={493} y2={508} />
      </g>

      {/* knob */}
      <g transform="rotate(44 353 498)">
        <rect
          x={331}
          y={371}
          width={44}
          height={253}
          rx={23}
          fill={C.white}
          stroke={C.black}
          strokeWidth={5}
        />
      </g>

      {/* knob black pointer dot */}
      <circle cx={414} cy={421} r={13} fill={C.black} />

      {/* port labels */}
      <Label x={228} y={692} size={30}>COM</Label>
      <Label x={479} y={692} size={30}>V/Ω</Label>
    </g>
  );
}

function MeterPortsAndPlugs() {
  return (
    <g>
      <Port cx={227} cy={743} color={C.black} />
      <Port cx={478} cy={743} color={C.black} />

      {/* COM plug */}
      <g>
        <rect
          x={203}
          y={722}
          width={48}
          height={121}
          rx={14}
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <path
          d="M203 782 H251 V850 H210 C206 830 203 807 203 782 Z"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={216} y1={792} x2={235} y2={792} />
          <line x1={216} y1={809} x2={237} y2={809} />
          <line x1={217} y1={826} x2={238} y2={826} />
        </g>
        <line x1={220} y1={779} x2={236} y2={779} stroke="#555" strokeWidth={2} />
      </g>

      {/* red V/Ω plug */}
      <g>
        <rect
          x={454}
          y={722}
          width={48}
          height={121}
          rx={14}
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
        <path
          d="M454 782 H502 V850 H462 C458 830 454 807 454 782 Z"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />
        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={467} y1={792} x2={486} y2={792} />
          <line x1={467} y1={809} x2={488} y2={809} />
          <line x1={468} y1={826} x2={489} y2={826} />
        </g>
        <line x1={471} y1={779} x2={486} y2={779} stroke={C.redDark} strokeWidth={2} />
      </g>
    </g>
  );
}

function WiresAndProbes() {
  const blackWire =
    "M227 846 C230 914 269 981 343 1015 C426 1053 536 1047 606 1002 C670 961 690 883 727 798";

  const redWire =
    "M478 846 C482 914 530 977 620 1010 C747 1056 1102 1050 1260 1022 C1353 1005 1410 943 1409 881 C1408 840 1382 811 1357 781";

  const topProbeWire =
    "M884 403 C968 378 1125 377 1207 403";

  return (
    <g>
      {/* bottom cables */}
      <Wire d={blackWire} color={C.black} shadow="#000000" width={12} />
      <Wire d={redWire} color={C.red} shadow={C.redDark} width={12} />

      {/* top touching wire */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={topProbeWire} stroke="#000000" strokeWidth={14} opacity={0.65} />
        <path d={topProbeWire} stroke={C.dark} strokeWidth={9} />
        <path d="M885 413 C970 390 1123 389 1205 413" stroke="#666" strokeWidth={2} opacity={0.45} />
      </g>

      {/* black probe */}
      <g>
        <path
          d="M727 798 L835 478 C842 458 859 455 874 469 L886 481 C895 491 897 505 891 520 L786 824 C781 838 768 846 754 839 L734 830 C724 825 722 811 727 798 Z"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        <path
          d="M840 473 L879 402"
          fill="none"
          stroke={C.black}
          strokeWidth={5}
          strokeLinecap="round"
        />

        <path
          d="M879 402 L890 414"
          fill="none"
          stroke={C.black}
          strokeWidth={5}
          strokeLinecap="round"
        />

        <rect
          x={754}
          y={817}
          width={38}
          height={64}
          rx={6}
          transform="rotate(17 773 849)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={4}
        />

        <ellipse
          cx={830}
          cy={560}
          rx={22}
          ry={10}
          transform="rotate(17 830 560)"
          fill={C.dark}
          stroke={C.black}
          strokeWidth={5}
        />

        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={777} y1={591} x2={817} y2={602} />
          <line x1={772} y1={604} x2={814} y2={616} />
          <line x1={768} y1={618} x2={810} y2={630} />
          <line x1={764} y1={632} x2={806} y2={644} />
          <line x1={760} y1={646} x2={802} y2={658} />
          <line x1={756} y1={660} x2={798} y2={672} />
        </g>

        <path
          d="M759 576 L698 779"
          stroke="#666"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.55}
        />
      </g>

      {/* red probe */}
      <g>
        <path
          d="M1358 780 L1215 510 C1207 493 1212 477 1227 470 L1247 461 C1262 454 1276 461 1284 477 L1400 740 C1406 755 1402 768 1387 775 L1370 783 C1365 786 1361 785 1358 780 Z"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        <path
          d="M1213 505 L1207 403"
          fill="none"
          stroke={C.black}
          strokeWidth={5}
          strokeLinecap="round"
        />

        <path
          d="M1207 403 L1196 416"
          fill="none"
          stroke={C.black}
          strokeWidth={5}
          strokeLinecap="round"
        />

        <ellipse
          cx={1272}
          cy={561}
          rx={35}
          ry={16}
          transform="rotate(25 1272 561)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={5}
        />

        <rect
          x={1340}
          y={793}
          width={39}
          height={63}
          rx={6}
          transform="rotate(-12 1359 824)"
          fill={C.red}
          stroke={C.redDark}
          strokeWidth={4}
        />

        <g stroke={C.black} strokeWidth={4} strokeLinecap="round">
          <line x1={1264} y1={600} x2={1305} y2={614} />
          <line x1={1268} y1={614} x2={1311} y2={628} />
          <line x1={1273} y1={628} x2={1317} y2={642} />
          <line x1={1278} y1={642} x2={1323} y2={656} />
          <line x1={1284} y1={656} x2={1329} y2={670} />
          <line x1={1290} y1={670} x2={1335} y2={684} />
          <line x1={1296} y1={684} x2={1341} y2={698} />
        </g>

        <path
          d="M1236 498 L1369 757"
          stroke="#ff7777"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.5}
        />
      </g>
    </g>
  );
}

export default function ContinuityMeterSketch({
  className = "",
}: ContinuityMeterSketchProps) {
  return (
    <div className={`w-full bg-white p-4 ${className}`}>
      <svg
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Digital multimeter continuity test sketch"
      >
        <rect width="1448" height="1086" fill={C.white} />

        <MeterBody />
        <MeterPortsAndPlugs />
        <WiresAndProbes />
      </svg>
    </div>
  );
}