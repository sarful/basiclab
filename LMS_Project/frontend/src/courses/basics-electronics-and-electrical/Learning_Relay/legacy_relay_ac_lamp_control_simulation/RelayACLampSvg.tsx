"use client";

import { motion } from "framer-motion";

import { AcFlowDots, FlowDots } from "./FlowDots";
import type { RelayState } from "./types";

type RelayACLampSvgProps = {
  pressed: boolean;
  relay: RelayState;
};

const VIEW_BOX = "0 0 1120 640";

const STYLE = {
  wire: "#303346",
  activeBlue: "#2563eb",
  activeOrange: "#f97316",
  lampGlow: "#facc15",
  lampOn: "#fef3c7",
  coilOn: "#dbeafe",
  text: "#303346",
  muted: "#64748b",
  success: "#16a34a",
} as const;

const WIRE_WIDTH = 5;

const NODE = {
  dcStart: { x: 226, y: 546 },
  dcTop: { x: 226, y: 269 },
  switchLeft: { x: 348, y: 269 },
  switchRight: { x: 428, y: 269 },
  coilTop: { x: 589, y: 330 },
  coilBottom: { x: 589, y: 487 },
  dcReturn: { x: 589, y: 546 },

  com: { x: 747, y: 456 },
  nc: { x: 716, y: 360 },
  no: { x: 792, y: 360 },

  lampTop: { x: 792, y: 154 },
  lampBottom: { x: 792, y: 234 },
  acTop: { x: 1003, y: 93 },
  acMidTop: { x: 1003, y: 342 },
  acMidBottom: { x: 1003, y: 423 },
  acBottom: { x: 1003, y: 582 },
} as const;

const PATH = {
  coilFlow:
    "M226 546 L226 269 L348 269 M428 269 L589 269 L589 330 M589 487 L589 546 L226 546",

  acLampFlow:
    "M1003 342 V93 H792 V154 M792 234 V330 V360 H792 L747 456 V582 H1003 V423",
} as const;

function WirePath({ d, width = WIRE_WIDTH }: { d: string; width?: number }) {
  return (
    <path
      d={d}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function DcSupplyAndPushSwitch({ pressed }: { pressed: boolean }) {
  return (
    <g>
      <WirePath d="M226 546 L226 269 L348 269" />
      <WirePath d="M428 269 L589 269 L589 330" />
      <WirePath d="M589 487 L589 546 L226 546" />

      <circle
        cx="348"
        cy="269"
        r="9.5"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <circle
        cx="427"
        cy="269"
        r="9.5"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.line
        x1="388"
        y1={pressed ? "232" : "215"}
        x2="388"
        y2={pressed ? "262" : "246"}
        stroke={STYLE.wire}
        strokeWidth="5"
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      />

      <motion.line
        x1="340"
        y1={pressed ? "269" : "246"}
        x2="436"
        y2={pressed ? "269" : "246"}
        stroke={STYLE.wire}
        strokeWidth="5"
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      />

      <line
        x1="197"
        y1="384"
        x2="259"
        y2="384"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="207"
        y1="401"
        x2="249"
        y2="401"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="197"
        y1="418"
        x2="259"
        y2="418"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="207"
        y1="435"
        x2="249"
        y2="435"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="226"
        y1="347"
        x2="226"
        y2="384"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="226"
        y1="435"
        x2="226"
        y2="485"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <line
        x1="259"
        y1="351"
        x2="259"
        y2="371"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="247"
        y1="361"
        x2="271"
        y2="361"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
    </g>
  );
}

function RelayBody({ relay }: { relay: RelayState }) {
  return (
    <g>
      <rect
        x="511"
        y="330"
        width="312"
        height="157"
        rx="3"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.rect
        x="542"
        y="377"
        width="96"
        height="63"
        rx="3"
        fill={relay.coilEnergized ? STYLE.coilOn : "white"}
        stroke={STYLE.wire}
        strokeWidth="5"
        animate={{ opacity: relay.coilEnergized ? [0.75, 1, 0.75] : 1 }}
        transition={{ duration: 1, repeat: relay.coilEnergized ? Infinity : 0 }}
      />

      <line
        x1="558"
        y1="429"
        x2="624"
        y2="387"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="589"
        y1="269"
        x2="589"
        y2="330"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <line
        x1="589"
        y1="487"
        x2="589"
        y2="546"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.line
        x1="638"
        y1="408"
        x2="691"
        y2="408"
        stroke={STYLE.wire}
        strokeWidth="5"
        strokeDasharray="10 12"
        animate={{ opacity: relay.coilEnergized ? [0.35, 1, 0.35] : 0.6 }}
        transition={{
          duration: 0.8,
          repeat: relay.coilEnergized ? Infinity : 0,
        }}
      />
    </g>
  );
}

function SpdtContact({ relay }: { relay: RelayState }) {
  return (
    <g>
      <line
        x1="697"
        y1="330"
        x2="697"
        y2="365"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <polyline
        points="697,365 707,354 717,365"
        stroke={STYLE.wire}
        strokeWidth="7"
        fill="none"
      />

      <line
        x1="747"
        y1="456"
        x2="747"
        y2="582"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <circle
        cx="747"
        cy="456"
        r="8"
        fill={relay.contactState === "NC" ? STYLE.activeOrange : "white"}
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <line
        x1="792"
        y1="330"
        x2="792"
        y2="360"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <circle
        cx="792"
        cy="360"
        r="8"
        fill={relay.contactState === "NO" ? STYLE.activeOrange : "white"}
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <polyline
        points="792,360 779,366 792,374"
        stroke={STYLE.wire}
        strokeWidth="5"
        fill="none"
      />

      <circle cx="747" cy="456" r="6" fill={STYLE.wire} />

      <motion.line
        x1="747"
        y1="456"
        x2={relay.coilEnergized ? NODE.no.x : NODE.nc.x}
        y2="360"
        stroke={STYLE.wire}
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
    </g>
  );
}

function AcLampAndSource({ lampOn }: { lampOn: boolean }) {
  return (
    <g>
      <WirePath d="M792 330 L792 234" />
      <WirePath d="M792 154 L792 93 L1003 93 L1003 342" />
      <WirePath d="M1003 423 L1003 582 L747 582" />

      <motion.circle
        cx="792"
        cy="194"
        r="52"
        fill={STYLE.lampGlow}
        stroke="none"
        animate={{ opacity: lampOn ? [0.08, 0.32, 0.08] : 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      <circle
        cx="792"
        cy="194"
        r="40"
        fill={lampOn ? STYLE.lampOn : "white"}
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <line
        x1="765"
        y1="167"
        x2="819"
        y2="221"
        stroke={STYLE.wire}
        strokeWidth="4"
      />
      <line
        x1="819"
        y1="167"
        x2="765"
        y2="221"
        stroke={STYLE.wire}
        strokeWidth="4"
      />

      <circle
        cx="1003"
        cy="382"
        r="41"
        fill="white"
        stroke={STYLE.wire}
        strokeWidth="5"
      />
      <path
        d="M967 387 C973 344, 983 344, 991 383 C999 425, 1009 426, 1018 386"
        stroke={STYLE.wire}
        strokeWidth="5"
        fill="none"
      />
    </g>
  );
}

function FlowLayer({ relay }: { relay: RelayState }) {
  return (
    <>
      <FlowDots
        path={PATH.coilFlow}
        active={relay.coilEnergized}
        color={STYLE.activeBlue}
        count={16}
        duration={2.6}
      />

      <AcFlowDots
        path={PATH.acLampFlow}
        active={relay.lampOn}
        color={STYLE.activeOrange}
        count={18}
        duration={1.7}
      />
    </>
  );
}

function Labels({ relay }: { relay: RelayState }) {
  return (
    <g
      fill={STYLE.text}
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="400"
    >
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

      <text
        x="560"
        y="595"
        textAnchor="middle"
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={relay.lampOn ? STYLE.success : STYLE.muted}
      >
        Relay {relay.coilEnergized ? "ENERGIZED" : "OFF"} - Contact on{" "}
        {relay.contactState} - Lamp {relay.lampOn ? "ON" : "OFF"}
      </text>
    </g>
  );
}

export default function RelayACLampSvg({
  pressed,
  relay,
}: RelayACLampSvgProps) {
  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-auto w-full max-w-[1120px]"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="Relay AC lamp control circuit"
    >
      <rect width="1120" height="640" fill="white" />

      <DcSupplyAndPushSwitch pressed={pressed} />
      <RelayBody relay={relay} />
      <SpdtContact relay={relay} />
      <AcLampAndSource lampOn={relay.lampOn} />
      <FlowLayer relay={relay} />
      <Labels relay={relay} />
    </svg>
  );
}
