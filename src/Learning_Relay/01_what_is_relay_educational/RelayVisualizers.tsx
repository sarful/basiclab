"use client";

import { motion } from "framer-motion";

import ElectromagneticField from "./ElectromagneticField";
import { AcFlowDots, FlowDots } from "./FlowDots";
import { getSpdtRelayState } from "./logic";
import type { RelayType } from "./types";

function SpstRelaySymbol({ energized }: { energized: boolean }) {
  return (
    <g transform="translate(450 220) scale(1.15)">
      <text
        x="164.5"
        y="42"
        fill="#252d4d"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="20"
        textAnchor="middle"
      >
        SPST
      </text>

      <g stroke="#252d4d" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="54" width="314" height="157" rx="3" fill="white" strokeWidth="5" />
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
        <ElectromagneticField cx={86} cy={132} active={energized} scale={0.42} />
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
            fill="#f97316"
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </g>

      <g
        fill="#343b5b"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="24"
        textAnchor="middle"
      >
        <text x="86" y="19">Coil</text>
        <text x="242" y="49">NO</text>
        <text x="86" y="262">Coil</text>
        <text x="242" y="262">COM</text>
      </g>
    </g>
  );
}

function RelaySpstMergedCircuit({ energized }: { energized: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 650"
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

      <line x1="120" y1="230" x2="120" y2="500" stroke="#111827" strokeWidth="6" />
      <line x1="86" y1="310" x2="154" y2="310" stroke="#111827" strokeWidth="9" />
      <line x1="96" y1="360" x2="144" y2="360" stroke="#111827" strokeWidth="6" />
      <text x="52" y="302" fontSize="42" fontWeight="900">+</text>
      <text x="58" y="385" fontSize="42" fontWeight="900">-</text>
      <text x="76" y="200" fontSize="26" fontWeight="900" fill="#2563eb">12V DC</text>

      <line x1="120" y1="230" x2="320" y2="230" stroke="#111827" strokeWidth="6" />
      <circle cx="320" cy="230" r="12" fill="white" stroke="#111827" strokeWidth="5" />
      <circle cx="430" cy="230" r="12" fill="white" stroke="#111827" strokeWidth="5" />
      <motion.line
        x1="332"
        y1="230"
        x2={energized ? "430" : "405"}
        y2={energized ? "230" : "185"}
        stroke="#111827"
        strokeWidth="7"
        strokeLinecap="round"
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
      />

      <line x1="442" y1="230" x2="549" y2="230" stroke="#111827" strokeWidth="6" />
      <line x1="549" y1="230" x2="549" y2="248" stroke="#111827" strokeWidth="6" />
      <SpstRelaySymbol energized={energized} />
      <line x1="549" y1="496" x2="549" y2="500" stroke="#111827" strokeWidth="6" />
      <line x1="549" y1="500" x2="120" y2="500" stroke="#111827" strokeWidth="6" />

      <circle cx="900" cy="500" r="36" fill="white" stroke="#111827" strokeWidth="5" />
      <path
        d="M875 505 C882 470,890 470,898 505 C906 540,914 540,923 505"
        fill="none"
        stroke="#111827"
        strokeWidth="4"
      />
      <text x="880" y="555" fontSize="20" fontWeight="900">AC Source</text>

      <line x1="728" y1="496" x2="728" y2="500" stroke="#111827" strokeWidth="6" />
      <line x1="728" y1="500" x2="864" y2="500" stroke="#111827" strokeWidth="6" />
      <line x1="728" y1="232" x2="1030" y2="232" stroke="#111827" strokeWidth="6" />

      <motion.circle
        cx="1070"
        cy="232"
        r="55"
        fill="#facc15"
        animate={{ opacity: energized ? [0.08, 0.35, 0.08] : 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <circle
        cx="1070"
        cy="232"
        r="40"
        fill={energized ? "#fef3c7" : "white"}
        stroke="#111827"
        strokeWidth="5"
      />
      <line x1="1045" y1="207" x2="1095" y2="257" stroke="#111827" strokeWidth="4" />
      <line x1="1095" y1="207" x2="1045" y2="257" stroke="#111827" strokeWidth="4" />
      <text x="1035" y="160" fontSize="28" fontWeight="900">Load</text>
      <line x1="1110" y1="232" x2="1110" y2="500" stroke="#111827" strokeWidth="6" />
      <line x1="1110" y1="500" x2="936" y2="500" stroke="#111827" strokeWidth="6" />

      <FlowDots
        path="M120 310 V230 H320 H430 H549 V248"
        active={energized}
        color="#2563eb"
        count={14}
        duration={2.2}
      />
      <FlowDots
        path="M728 496 V500 H864"
        active={energized}
        color="#f97316"
        count={8}
        duration={1.5}
      />
      <FlowDots
        path="M728 232 H1110 V500 H936"
        active={energized}
        color="#f97316"
        count={16}
        duration={2}
      />
    </svg>
  );
}

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

      <g stroke="#303346" fill="none" strokeLinecap="round" strokeLinejoin="round">
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

        <rect x="511" y="330" width="312" height="157" rx="3" fill="white" strokeWidth="5" />
        <motion.rect
          x="542"
          y="377"
          width="96"
          height="63"
          rx="3"
          fill={relay.coilEnergized ? "#dbeafe" : "white"}
          strokeWidth="5"
          animate={{ opacity: relay.coilEnergized ? [0.75, 1, 0.75] : 1 }}
          transition={{ duration: 1, repeat: relay.coilEnergized ? Infinity : 0 }}
        />
        <ElectromagneticField cx={590} cy={410} active={relay.coilEnergized} scale={0.65} />
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
          transition={{ duration: 0.8, repeat: relay.coilEnergized ? Infinity : 0 }}
        />

        <line x1="697" y1="330" x2="697" y2="365" strokeWidth="5" />
        <polyline points="697,365 707,354 717,365" strokeWidth="7" />
        <line x1="747" y1="456" x2="747" y2="582" strokeWidth="5" />
        <circle cx="747" cy="456" r="8" fill={relay.contactState === "NC" ? "#f97316" : "white"} strokeWidth="5" />
        <line x1="792" y1="330" x2="792" y2="360" strokeWidth="5" />
        <circle cx="792" cy="360" r="8" fill={relay.contactState === "NO" ? "#f97316" : "white"} strokeWidth="5" />
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
            stroke="#f97316"
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
          fill="#facc15"
          stroke="none"
          animate={{ opacity: relay.lampOn ? [0.08, 0.32, 0.08] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <circle
          cx="792"
          cy="194"
          r="40"
          fill={relay.lampOn ? "#fef3c7" : "white"}
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
        color="#2563eb"
        count={16}
        duration={2.6}
      />
      <AcFlowDots
        path="M1003 342 V93 H792 V154 M792 234 V330 V360 H792 L747 456 V582 H1003 V423"
        active={relay.lampOn}
        color="#f97316"
        count={18}
        duration={1.7}
      />

      <g fill="#303346" fontFamily="Arial, Helvetica, sans-serif" fontWeight="400">
        <text x="114" y="386" fontSize="27">DC</text>
        <text x="114" y="408" fontSize="27">power</text>
        <text x="114" y="430" fontSize="27">supply</text>
        <text x="530" y="316" fontSize="27">Coil</text>
        <text x="530" y="510" fontSize="27">Coil</text>
        <text x="655" y="316" fontSize="27">NC</text>
        <text x="747" y="316" fontSize="27">NO</text>
        <text x="753" y="512" fontSize="27">COM</text>
        <text x="821" y="140" fontSize="29">AC</text>
        <text x="821" y="165" fontSize="29">Lamp</text>
        <text x="1050" y="374" fontSize="27">AC</text>
        <text x="1050" y="396" fontSize="27">power</text>
        <text x="1050" y="418" fontSize="27">supply</text>
      </g>

      <text
        x="560"
        y="595"
        textAnchor="middle"
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={relay.lampOn ? "#16a34a" : "#64748b"}
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

      <g fill="#343b5b" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700">
        <text x="209" y="20" textAnchor="middle" fontSize="26">Coil</text>
        <text x="317" y="20" textAnchor="middle" fontSize="26">NC1</text>
        <text x="410" y="20" textAnchor="middle" fontSize="26">NO1</text>
        <text x="480" y="20" textAnchor="middle" fontSize="26">NC2</text>
        <text x="574" y="20" textAnchor="middle" fontSize="26">NO2</text>
        <text x="209" y="264" textAnchor="middle" fontSize="26">Coil</text>
        <text x="364" y="268" textAnchor="middle" fontSize="26">COM1</text>
        <text x="525" y="268" textAnchor="middle" fontSize="26">COM2</text>
        <text x="62" y="142" textAnchor="middle" fontSize="22">DC Source</text>
        <text x="72" y="91" textAnchor="middle" fontSize="20">+</text>
        <text x="72" y="196" textAnchor="middle" fontSize="24">-</text>
        <text x="236" y="55" textAnchor="middle" fontSize="18">A1</text>
        <text x="205" y="292" textAnchor="middle" fontSize="18">A2</text>
        <text x="684" y="126" textAnchor="middle" fontSize="20">Load</text>
        <text x="684" y="232" textAnchor="middle" fontSize="20">AC Source</text>
      </g>

      <g stroke="#252d4d" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="131" y="59" width="480" height="157" rx="4" fill="white" strokeWidth="5" />

        <line x1="208" y1="30" x2="208" y2="246" strokeWidth="5" />
        <line x1="317" y1="30" x2="317" y2="99" strokeWidth="5" />
        <line x1="411" y1="30" x2="411" y2="99" strokeWidth="5" />
        <line x1="480" y1="30" x2="480" y2="99" strokeWidth="5" />
        <line x1="574" y1="30" x2="574" y2="99" strokeWidth="5" />
        <line x1="364" y1="186" x2="364" y2="246" strokeWidth="5" />
        <line x1="525" y1="186" x2="525" y2="246" strokeWidth="5" />

        <motion.rect
          x="161"
          y="108"
          width="96"
          height="62"
          rx="3"
          fill={energized ? "#dbeafe" : "none"}
          strokeWidth="5"
          animate={{ opacity: energized ? [0.7, 1, 0.7] : 1 }}
          transition={{ duration: 1, repeat: energized ? Infinity : 0 }}
        />
        <line x1="209" y1="108" x2="257" y2="108" strokeWidth="5" />
        <ElectromagneticField cx={209} cy={139} active={energized} scale={0.48} />
        <line x1="193" y1="170" x2="241" y2="108" strokeWidth="5" />

        <motion.line
          x1="259"
          y1="138"
          x2="495"
          y2="138"
          strokeWidth="5"
          strokeDasharray="8 8"
          animate={{ opacity: energized ? [0.35, 1, 0.35] : 0.6 }}
          transition={{ duration: 0.8, repeat: energized ? Infinity : 0 }}
        />

        <motion.line
          x1="364"
          y1="186"
          x2={energized ? "411" : "333"}
          y2={energized ? "83" : "83"}
          strokeWidth="8"
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        />
        <motion.line
          x1="525"
          y1="186"
          x2={energized ? "574" : "494"}
          y2={energized ? "83" : "83"}
          strokeWidth="8"
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        />

        <polyline points="317,84 325,98 337,92 333,82" fill="none" strokeWidth="5" />
        <polyline points="411,82 395,90 411,98" fill="none" strokeWidth="4" />
        <polyline points="480,84 488,98 500,92 496,82" fill="none" strokeWidth="5" />
        <polyline points="574,82 558,90 574,98" fill="none" strokeWidth="4" />

        <line x1="70" y1="36" x2="70" y2="254" strokeWidth="5" />
        <circle cx="70" cy="36" r="4" fill="#252d4d" stroke="none" />
        <line x1="70" y1="36" x2="112" y2="36" strokeWidth="5" />
        <circle cx="112" cy="36" r="4" fill="#252d4d" stroke="none" />
        <motion.line
          x1="116"
          y1="36"
          x2={energized ? "166" : "154"}
          y2={energized ? "36" : "24"}
          strokeWidth="5"
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        />
        <circle cx="166" cy="36" r="4" fill="#252d4d" stroke="none" />
        <line x1="166" y1="36" x2="208" y2="36" strokeWidth="5" />
        <line x1="70" y1="254" x2="208" y2="254" strokeWidth="5" />
        <line x1="208" y1="246" x2="208" y2="254" strokeWidth="5" />

        <line x1="70" y1="105" x2="70" y2="123" strokeWidth="5" />
        <line x1="70" y1="154" x2="70" y2="172" strokeWidth="5" />
        <line x1="56" y1="123" x2="84" y2="123" strokeWidth="5" />
        <line x1="62" y1="154" x2="78" y2="154" strokeWidth="5" />

        <line x1="574" y1="30" x2="684" y2="30" strokeWidth="5" />
        <line x1="684" y1="30" x2="684" y2="78" strokeWidth="5" />
        <motion.rect
          x="654"
          y="78"
          width="60"
          height="32"
          rx="3"
          fill={energized ? "#fef3c7" : "none"}
          strokeWidth="5"
          animate={{ opacity: energized ? [0.8, 1, 0.8] : 1 }}
          transition={{ duration: 1, repeat: energized ? Infinity : 0 }}
        />
        <line x1="684" y1="110" x2="684" y2="155" strokeWidth="5" />
        <circle cx="684" cy="180" r="25" fill="none" strokeWidth="5" />
        <path
          d="M664 180 C672 166,680 166,684 180 S696 194,704 180"
          fill="none"
          strokeWidth="4"
        />
        <line x1="684" y1="205" x2="684" y2="246" strokeWidth="5" />
        <line x1="684" y1="246" x2="525" y2="246" strokeWidth="5" />
      </g>

      <FlowDots
        path="M70 36 H112 H166 H208 V246 H70 V36"
        active={energized}
        color="#2563eb"
        count={12}
        duration={2.1}
      />
      <FlowDots
        path="M525 246 H684 V205 M684 155 V30 H574"
        active={energized}
        color="#f97316"
        count={12}
        duration={1.8}
      />
    </svg>
  );
}

function PlaceholderRelay({ relayType }: { relayType: RelayType }) {
  return (
    <svg viewBox="0 0 1200 650" className="h-auto w-full bg-white" shapeRendering="geometricPrecision">
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
        fill="#64748b"
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
  if (relayType === "SPST") {
    return <RelaySpstMergedCircuit energized={energized} />;
  }

  if (relayType === "SPDT") {
    return <RelaySpdtMergedCircuit energized={energized} />;
  }

  if (relayType === "DPDT") {
    return <DpdtRelayMergedCircuit energized={energized} />;
  }

  return <PlaceholderRelay relayType={relayType} />;
}
