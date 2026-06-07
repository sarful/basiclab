"use client";

import { motion } from "framer-motion";

import { AcFlowDots, FlowDots } from "./FlowDots";
import {
  AcLoadNetwork,
  AcOutputSource,
  DcLoadNetwork,
  DcOutputSource,
} from "./OutputNetworks";
import PhotoTriacSymbol from "./PhotoTriacSymbol";
import type { CouplerType } from "./types";

type OptocouplerSvgProps = {
  active: boolean;
  couplerType: CouplerType;
};

export default function OptocouplerSvg({
  active,
  couplerType,
}: OptocouplerSvgProps) {
  const isTriac = couplerType === "PhotoTRIAC";

  return (
    <svg
      viewBox="0 0 1688 603"
      className="h-auto w-full"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="Optocoupler switching circuit schematic"
    >
      <rect width="1688" height="603" fill="#ffffff" />

      <line x1="80" y1="112" x2="80" y2="471" stroke="black" strokeWidth="5" />
      <line x1="38" y1="352" x2="98" y2="352" stroke="black" strokeWidth="9" />
      <line x1="50" y1="378" x2="92" y2="378" stroke="black" strokeWidth="6" />
      <text x="26" y="326" fontSize="46" fontFamily="Arial">+</text>
      <text x="28" y="437" fontSize="46" fontFamily="Arial">-</text>

      <line x1="80" y1="112" x2="238" y2="112" stroke="black" strokeWidth="5" />
      <circle cx="238" cy="112" r="11" fill="#ffffff" stroke="black" strokeWidth="5" />
      <circle cx="342" cy="112" r="11" fill="#ffffff" stroke="black" strokeWidth="5" />
      <motion.line
        x1="248"
        y1="106"
        x2={active ? "342" : "371"}
        y2={active ? "112" : "44"}
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />

      <line x1="353" y1="112" x2="741" y2="112" stroke="black" strokeWidth="5" />
      <circle cx="518" cy="112" r="12" fill="black" />

      <rect x="582" y="20" width="457" height="504" fill="none" stroke="#0d47a1" strokeWidth="5" />
      <line x1="810" y1="22" x2="810" y2="520" stroke="black" strokeWidth="4" strokeDasharray="32 14" />

      <line x1="741" y1="112" x2="741" y2="246" stroke="black" strokeWidth="5" />
      <motion.polygon
        points="708,246 774,246 741,308"
        fill={active ? "#fbbf24" : "none"}
        stroke="black"
        strokeWidth="6"
        animate={{ opacity: active ? [0.7, 1, 0.7] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <line x1="708" y1="318" x2="774" y2="318" stroke="black" strokeWidth="6" />
      <line x1="741" y1="318" x2="741" y2="472" stroke="black" strokeWidth="5" />

      <motion.g
        animate={{ opacity: active ? [0.3, 1, 0.3] : 0.15 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <line x1="761" y1="287" x2="812" y2="254" stroke="black" strokeWidth="5" />
        <polygon points="801,248 821,253 807,265" fill="black" />
        <line x1="779" y1="313" x2="830" y2="280" stroke="black" strokeWidth="5" />
        <polygon points="819,274 839,279 825,291" fill="black" />
      </motion.g>

      {couplerType === "Phototransistor" && (
        <g>
          <line x1="917" y1="224" x2="917" y2="346" stroke="black" strokeWidth="8" />
          <line x1="917" y1="254" x2="956" y2="224" stroke="black" strokeWidth="7" />
          <line x1="917" y1="318" x2="959" y2="359" stroke="black" strokeWidth="7" />
          <polygon points="944,336 966,357 941,362" fill="black" />
          <line x1="956" y1="224" x2="956" y2="112" stroke="black" strokeWidth="5" />
          <line x1="959" y1="359" x2="959" y2="472" stroke="black" strokeWidth="5" />
        </g>
      )}

      {couplerType === "Photodiode" && (
        <g>
          <line x1="956" y1="112" x2="956" y2="220" stroke="black" strokeWidth="5" />
          <polygon points="908,220 1004,220 956,310" fill="none" stroke="black" strokeWidth="6" />
          <line x1="908" y1="320" x2="1004" y2="320" stroke="black" strokeWidth="6" />
          <line x1="956" y1="320" x2="959" y2="472" stroke="black" strokeWidth="5" />
          <motion.g
            animate={{ opacity: active ? [0.3, 1, 0.3] : 0.15 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <line x1="850" y1="255" x2="902" y2="235" stroke="black" strokeWidth="5" />
            <polygon points="893,227 912,231 898,246" fill="black" />
            <line x1="855" y1="305" x2="905" y2="288" stroke="black" strokeWidth="5" />
            <polygon points="896,280 915,284 901,299" fill="black" />
          </motion.g>
        </g>
      )}

      {isTriac && <PhotoTriacSymbol />}

      {isTriac ? <AcOutputSource /> : <DcOutputSource />}
      {isTriac ? (
        <AcLoadNetwork active={active} />
      ) : (
        <DcLoadNetwork active={active} />
      )}

      <line x1="80" y1="472" x2="741" y2="472" stroke="black" strokeWidth="5" />
      <circle cx="518" cy="472" r="12" fill="black" />

      <FlowDots
        path="M80 112 H741 V472 H80 V112"
        active={active}
        color="#2563eb"
        count={14}
        duration={2.6}
      />
      {couplerType === "Phototransistor" && (
        <FlowDots
          path="M1537 112 H956 V224 L917 254 V318 L959 359 V472 H1537 V112"
          active={active}
          color="#16a34a"
          count={18}
          duration={3.2}
        />
      )}
      {couplerType === "Photodiode" && (
        <FlowDots
          path="M1537 112 H956 V220 L908 220 L956 310 V472 H1537 V112"
          active={active}
          color="#10b981"
          count={15}
          duration={3.1}
        />
      )}
      {couplerType === "PhotoTRIAC" && (
        <AcFlowDots
          path="M1465 214 V112 H956 V194 M956 332 V472 H1240 M1360 472 H1465 V370"
          active={active}
          color="#a855f7"
          count={9}
        />
      )}

      <text x="220" y="397" fontSize="56" fontFamily="Arial">INPUT</text>
      {isTriac ? (
        <text x="1540" y="366" fontSize="52" fontFamily="Arial">AC</text>
      ) : (
        <text x="1607" y="366" fontSize="56" fontFamily="Arial">Vcc</text>
      )}
      <text x="505" y="179" fontSize="64" fontFamily="Arial">1</text>
      <text x="505" y="432" fontSize="64" fontFamily="Arial">2</text>
      <text x="1060" y="179" fontSize="64" fontFamily="Arial">3</text>
      <text x="1068" y="432" fontSize="64" fontFamily="Arial">4</text>
    </svg>
  );
}
