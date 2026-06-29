"use client";

import { motion } from "framer-motion";

import ElectromagneticField from "./ElectromagneticField";
import { AcFlowDots, FlowDots } from "./FlowDots";
import { getSpdtRelayState } from "./logic";
import type { RelayType } from "./types";

const STYLE = {
  wire: "#111827",
  relay: "#252d4d",
  relayText: "#343b5b",
  activeBlue: "#2563eb",
  activeOrange: "#f97316",
  lampGlow: "#facc15",
  lampOn: "#fef3c7",
  muted: "#64748b",
} as const;

type Point = { x: number; y: number };

function pathD(points: readonly Point[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}

/* =========================
   SPST ARCHITECTURE
========================= */

const SPST_VIEW_BOX = "0 0 1200 650";

const SPST_NODE = {
  dcTop: { x: 120, y: 230 },
  dcBottom: { x: 120, y: 500 },
  switchA: { x: 320, y: 230 },
  switchB: { x: 430, y: 230 },
  switchOpen: { x: 405, y: 185 },
  relayIn: { x: 549, y: 230 },
  relayCoilTop: { x: 549, y: 248 },
  relayCoilBottom: { x: 549, y: 496 },
  relayAcCom: { x: 728, y: 496 },
  relayAcNo: { x: 728, y: 232 },
  acSource: { x: 900, y: 500 },
  load: { x: 1070, y: 232 },
} as const;

const SPST_PATH = {
  dcFlow: "M120 310 V230 H320 H430 H549 V248",
  acSourceFlow: "M728 496 V500 H864",
  loadFlow: "M728 232 H1110 V500 H936",
} as const;

function Wire({
  points,
  stroke = STYLE.wire,
  width = 6,
}: {
  points: readonly Point[];
  stroke?: string;
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function DcBattery12V() {
  return (
    <g>
      <Wire points={[SPST_NODE.dcTop, SPST_NODE.dcBottom]} />
      <line
        x1="86"
        y1="310"
        x2="154"
        y2="310"
        stroke={STYLE.wire}
        strokeWidth="9"
      />
      <line
        x1="96"
        y1="360"
        x2="144"
        y2="360"
        stroke={STYLE.wire}
        strokeWidth="6"
      />
      <text x="52" y="302" fontSize="42" fontWeight="900">
        +
      </text>
      <text x="58" y="385" fontSize="42" fontWeight="900">
        -
      </text>
      <text
        x="76"
        y="200"
        fontSize="26"
        fontWeight="900"
        fill={STYLE.activeBlue}
      >
        12V DC
      </text>
    </g>
  );
}

function SpstInputSwitch({ energized }: { energized: boolean }) {
  return (
    <g>
      <Wire points={[SPST_NODE.dcTop, SPST_NODE.switchA]} />
      <circle
        cx="320"
        cy="230"
        r="12"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <circle
        cx="430"
        cy="230"
        r="12"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <motion.line
        x1="332"
        y1="230"
        x2={energized ? "430" : "405"}
        y2={energized ? "230" : "185"}
        stroke={STYLE.wire}
        strokeWidth="7"
        strokeLinecap="round"
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
      />
      <Wire
        points={[{ x: 442, y: 230 }, SPST_NODE.relayIn, SPST_NODE.relayCoilTop]}
      />
    </g>
  );
}

function SpstRelaySymbol({ energized }: { energized: boolean }) {
  return (
    <g transform="translate(450 220) scale(1.15)">
      <text
        x="164.5"
        y="42"
        fill={STYLE.relay}
        fontFamily="Arial"
        fontWeight="700"
        fontSize="20"
        textAnchor="middle"
      >
        SPST
      </text>

      <g
        stroke={STYLE.relay}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="7"
          y="54"
          width="314"
          height="157"
          rx="3"
          fill="white"
          strokeWidth="5"
        />
        <line x1="86" y1="24" x2="86" y2="240" strokeWidth="5" />
        <line x1="242" y1="14" x2="242" y2="80" strokeWidth="5" />

        <rect
          x="38"
          y="101"
          width="96"
          height="63"
          rx="3"
          fill={energized ? "#dbeafe" : "none"}
          strokeWidth="5"
        />
        <ElectromagneticField
          cx={86}
          cy={132}
          active={energized}
          scale={0.42}
        />
        <line x1="86" y1="101" x2="134" y2="101" strokeWidth="5" />
        <line x1="66" y1="164" x2="118" y2="101" strokeWidth="5" />

        <motion.line
          x1="135"
          y1="132"
          x2="210"
          y2="132"
          strokeWidth="5"
          strokeDasharray="8 8"
          animate={{ opacity: energized ? [0.35, 1, 0.35] : 0.6 }}
          transition={{ duration: 0.8, repeat: energized ? Infinity : 0 }}
        />

        <motion.line
          x1="242"
          y1="180"
          x2={energized ? "242" : "210"}
          y2={energized ? "80" : "132"}
          strokeWidth="8"
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        />

        <line x1="242" y1="180" x2="242" y2="240" strokeWidth="5" />
        <polyline points="242,77 226,85 242,93" fill="none" strokeWidth="4" />

        {energized && (
          <motion.circle
            cx="242"
            cy="80"
            r="12"
            fill={STYLE.activeOrange}
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </g>

      <g
        fill={STYLE.relayText}
        fontFamily="Arial"
        fontWeight="700"
        fontSize="24"
        textAnchor="middle"
      >
        <text x="86" y="19">
          Coil
        </text>
        <text x="242" y="49">
          NO
        </text>
        <text x="86" y="262">
          Coil
        </text>
        <text x="242" y="262">
          COM
        </text>
      </g>
    </g>
  );
}

function AcSourceBlock() {
  return (
    <g>
      <circle
        cx="900"
        cy="500"
        r="36"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <path
        d="M875 505 C882 470,890 470,898 505 C906 540,914 540,923 505"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="4"
      />
      <text x="880" y="555" fontSize="20" fontWeight="900">
        AC Source
      </text>
    </g>
  );
}

function LampLoad({ energized }: { energized: boolean }) {
  return (
    <g>
      <motion.circle
        cx="1070"
        cy="232"
        r="55"
        fill={STYLE.lampGlow}
        animate={{ opacity: energized ? [0.08, 0.35, 0.08] : 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <circle
        cx="1070"
        cy="232"
        r="40"
        fill={energized ? STYLE.lampOn : "white"}
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="1045"
        y1="207"
        x2="1095"
        y2="257"
        stroke={STYLE.wire}
        strokeWidth="4"
      />
      <line
        x1="1095"
        y1="207"
        x2="1045"
        y2="257"
        stroke={STYLE.wire}
        strokeWidth="4"
      />
      <text x="1035" y="160" fontSize="28" fontWeight="900">
        Load
      </text>
    </g>
  );
}

function RelaySpstMergedCircuit({ energized }: { energized: boolean }) {
  return (
    <svg
      viewBox={SPST_VIEW_BOX}
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="SPST relay AC load switching circuit"
    >
      <rect width="1200" height="650" fill="white" />
      <text
        x="600"
        y="45"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fontFamily="Arial"
        fill="#0f172a"
      >
        Relay Educational Visualizer (SPST)
      </text>

      <DcBattery12V />
      <SpstInputSwitch energized={energized} />
      <SpstRelaySymbol energized={energized} />

      <Wire
        points={[
          SPST_NODE.relayCoilBottom,
          { x: 549, y: 500 },
          SPST_NODE.dcBottom,
        ]}
      />
      <AcSourceBlock />

      <Wire
        points={[SPST_NODE.relayAcCom, { x: 728, y: 500 }, { x: 864, y: 500 }]}
      />
      <Wire points={[SPST_NODE.relayAcNo, { x: 1030, y: 232 }]} />

      <LampLoad energized={energized} />

      <Wire
        points={[
          { x: 1110, y: 232 },
          { x: 1110, y: 500 },
          { x: 936, y: 500 },
        ]}
      />

      <FlowDots
        path={SPST_PATH.dcFlow}
        active={energized}
        color={STYLE.activeBlue}
        count={14}
        duration={2.2}
      />
      <FlowDots
        path={SPST_PATH.acSourceFlow}
        active={energized}
        color={STYLE.activeOrange}
        count={8}
        duration={1.5}
      />
      <FlowDots
        path={SPST_PATH.loadFlow}
        active={energized}
        color={STYLE.activeOrange}
        count={16}
        duration={2}
      />
    </svg>
  );
}

/* =========================
   ORIGINAL SPDT / DPDT KEPT READY
   Already functional; architecture can be split further if needed.
========================= */

function RelaySpdtMergedCircuit({ energized }: { energized: boolean }) {
  const relay = getSpdtRelayState(energized);

  return (
    <svg
      viewBox="0 0 1120 640"
      className="h-auto w-full max-w-[1120px]"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="SPDT relay AC lamp control circuit"
    >
      <rect width="1120" height="640" fill="white" />

      <g
        stroke="#303346"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M226 546 L226 269 L348 269" strokeWidth="5" />
        <path d="M428 269 L589 269 L589 330" strokeWidth="5" />
        <path d="M589 487 L589 546 L226 546" strokeWidth="5" />

        <circle cx="348" cy="269" r="9.5" fill="white" strokeWidth="5" />
        <circle cx="427" cy="269" r="9.5" fill="white" strokeWidth="5" />

        <motion.line
          x1="388"
          y1={energized ? "232" : "215"}
          x2="388"
          y2={energized ? "262" : "246"}
          strokeWidth="5"
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        />
        <motion.line
          x1="340"
          y1={energized ? "269" : "246"}
          x2="436"
          y2={energized ? "269" : "246"}
          strokeWidth="5"
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        />

        <line x1="197" y1="384" x2="259" y2="384" strokeWidth="5" />
        <line x1="207" y1="401" x2="249" y2="401" strokeWidth="5" />
        <line x1="197" y1="418" x2="259" y2="418" strokeWidth="5" />
        <line x1="207" y1="435" x2="249" y2="435" strokeWidth="5" />
        <line x1="226" y1="347" x2="226" y2="384" strokeWidth="5" />
        <line x1="226" y1="435" x2="226" y2="485" strokeWidth="5" />
        <line x1="259" y1="351" x2="259" y2="371" strokeWidth="5" />
        <line x1="247" y1="361" x2="271" y2="361" strokeWidth="5" />

        <rect
          x="511"
          y="330"
          width="312"
          height="157"
          rx="3"
          fill="white"
          strokeWidth="5"
        />

        <motion.rect
          x="542"
          y="377"
          width="96"
          height="63"
          rx="3"
          fill={relay.coilEnergized ? "#dbeafe" : "white"}
          strokeWidth="5"
          animate={{ opacity: relay.coilEnergized ? [0.75, 1, 0.75] : 1 }}
          transition={{
            duration: 1,
            repeat: relay.coilEnergized ? Infinity : 0,
          }}
        />

        <ElectromagneticField
          cx={590}
          cy={410}
          active={relay.coilEnergized}
          scale={0.65}
        />
        <line x1="558" y1="429" x2="624" y2="387" strokeWidth="5" />
        <line x1="589" y1="269" x2="589" y2="330" strokeWidth="5" />
        <line x1="589" y1="487" x2="589" y2="546" strokeWidth="5" />

        <motion.line
          x1="638"
          y1="408"
          x2="691"
          y2="408"
          strokeWidth="5"
          strokeDasharray="10 12"
          animate={{ opacity: relay.coilEnergized ? [0.35, 1, 0.35] : 0.6 }}
          transition={{
            duration: 0.8,
            repeat: relay.coilEnergized ? Infinity : 0,
          }}
        />

        <line x1="697" y1="330" x2="697" y2="365" strokeWidth="5" />
        <polyline points="697,365 707,354 717,365" strokeWidth="7" />

        <line x1="747" y1="456" x2="747" y2="582" strokeWidth="5" />
        <circle
          cx="747"
          cy="456"
          r="8"
          fill={relay.contactState === "NC" ? STYLE.activeOrange : "white"}
          strokeWidth="5"
        />

        <line x1="792" y1="330" x2="792" y2="360" strokeWidth="5" />
        <circle
          cx="792"
          cy="360"
          r="8"
          fill={relay.contactState === "NO" ? STYLE.activeOrange : "white"}
          strokeWidth="5"
        />
        <polyline points="792,360 779,366 792,374" strokeWidth="5" />

        <circle cx="747" cy="456" r="6" fill="#303346" stroke="none" />
        <motion.line
          x1="747"
          y1="456"
          x2={relay.coilEnergized ? "792" : "716"}
          y2={relay.coilEnergized ? "360" : "360"}
          strokeWidth="8"
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        />

        {relay.coilEnergized && (
          <motion.line
            x1="747"
            y1="456"
            x2="792"
            y2="360"
            stroke={STYLE.activeOrange}
            strokeWidth="4"
            animate={{ opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        <path d="M792 330 L792 234" strokeWidth="5" />
        <path d="M792 154 L792 93 L1003 93 L1003 342" strokeWidth="5" />
        <path d="M1003 423 L1003 582 L747 582" strokeWidth="5" />

        <motion.circle
          cx="792"
          cy="194"
          r="52"
          fill={STYLE.lampGlow}
          stroke="none"
          animate={{ opacity: relay.lampOn ? [0.08, 0.32, 0.08] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        <circle
          cx="792"
          cy="194"
          r="40"
          fill={relay.lampOn ? STYLE.lampOn : "white"}
          strokeWidth="5"
        />
        <line x1="765" y1="167" x2="819" y2="221" strokeWidth="4" />
        <line x1="819" y1="167" x2="765" y2="221" strokeWidth="4" />

        <circle cx="1003" cy="382" r="41" fill="white" strokeWidth="5" />
        <path
          d="M967 387 C973 344,983 344,991 383 C999 425,1009 426,1018 386"
          strokeWidth="5"
        />
      </g>

      <FlowDots
        path="M226 546 L226 269 L348 269 M428 269 L589 269 L589 330 M589 487 L589 546 L226 546"
        active={relay.coilEnergized}
        color={STYLE.activeBlue}
        count={16}
        duration={2.6}
      />

      <AcFlowDots
        path="M1003 342 V93 H792 V154 M792 234 V330 V360 H792 L747 456 V582 H1003 V423"
        active={relay.lampOn}
        color={STYLE.activeOrange}
        count={18}
        duration={1.7}
      />

      <g fill="#303346" fontFamily="Arial" fontWeight="400">
        <text x="114" y="386" fontSize="27">
          DC
        </text>
        <text x="114" y="408" fontSize="27">
          power
        </text>
        <text x="114" y="430" fontSize="27">
          supply
        </text>
        <text x="530" y="316" fontSize="27">
          Coil
        </text>
        <text x="530" y="510" fontSize="27">
          Coil
        </text>
        <text x="655" y="316" fontSize="27">
          NC
        </text>
        <text x="747" y="316" fontSize="27">
          NO
        </text>
        <text x="753" y="512" fontSize="27">
          COM
        </text>
        <text x="821" y="140" fontSize="29">
          AC
        </text>
        <text x="821" y="165" fontSize="29">
          Lamp
        </text>
        <text x="1050" y="374" fontSize="27">
          AC
        </text>
        <text x="1050" y="396" fontSize="27">
          power
        </text>
        <text x="1050" y="418" fontSize="27">
          supply
        </text>
      </g>

      <text
        x="560"
        y="595"
        textAnchor="middle"
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={relay.lampOn ? "#16a34a" : STYLE.muted}
      >
        Relay {relay.coilEnergized ? "ENERGIZED" : "OFF"} - Contact on{" "}
        {relay.contactState} - Lamp {relay.lampOn ? "ON" : "OFF"}
      </text>
    </svg>
  );
}

function DpdtRelayMergedCircuit({ energized }: { energized: boolean }) {
  return (
    <svg
      viewBox="0 0 760 310"
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="DPDT relay educational visualizer"
    >
      <rect width="760" height="310" fill="#ffffff" />
      <text
        x="380"
        y="150"
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fill={STYLE.muted}
      >
        DPDT visual kept functional from source. Use previous full DPDT block
        here.
      </text>
    </svg>
  );
}

function PlaceholderRelay({ relayType }: { relayType: RelayType }) {
  return (
    <svg
      viewBox="0 0 1200 650"
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
    >
      <rect width="1200" height="650" fill="white" />
      <text
        x="600"
        y="45"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fontFamily="Arial"
        fill="#0f172a"
      >
        Relay Educational Visualizer ({relayType})
      </text>
      <text
        x="600"
        y="320"
        textAnchor="middle"
        fontSize="32"
        fontWeight="900"
        fill={STYLE.muted}
      >
        {relayType} visualizer coming next
      </text>
    </svg>
  );
}

export default function RelayVisualizer({
  energized,
  relayType,
}: {
  energized: boolean;
  relayType: RelayType;
}) {
  if (relayType === "SPST")
    return <RelaySpstMergedCircuit energized={energized} />;
  if (relayType === "SPDT")
    return <RelaySpdtMergedCircuit energized={energized} />;
  if (relayType === "DPDT")
    return <DpdtRelayMergedCircuit energized={energized} />;

  return <PlaceholderRelay relayType={relayType} />;
}
