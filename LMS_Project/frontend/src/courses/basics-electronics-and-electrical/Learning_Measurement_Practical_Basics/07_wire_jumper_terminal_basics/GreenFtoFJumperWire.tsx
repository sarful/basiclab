"use client";

import { useId } from "react";

import {
  GreenFemaleConnectorLeft,
  GreenFemaleConnectorRight,
} from "./components/JumperWireConnectorParts";
import JumperWireFrame from "./components/JumperWireFrame";
import {
  getGreenJumperWireRefs,
  GreenJumperWireDefs,
} from "./components/jumperWireDefs";

export default function GreenJumperWire() {
  const idPrefix = useId().replace(/:/g, "");
  const refs = getGreenJumperWireRefs(idPrefix);

  return (
    <JumperWireFrame
      viewBox="0 0 1200 160"
      ariaLabel="Green female to female jumper wire"
    >
      <GreenJumperWireDefs idPrefix={idPrefix} />

      <path
        d="M260 72 C420 78, 600 70, 760 73 C850 75, 900 82, 965 82"
        fill="none"
        stroke="#0b5f37"
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M260 68 C420 74, 600 66, 760 69 C850 71, 900 78, 965 78"
        fill="none"
        stroke={`url(#${refs.wire})`}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M270 60 C430 66, 610 58, 955 70"
        fill="none"
        stroke="#7be3a8"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />

      <GreenFemaleConnectorLeft refs={refs} />
      <GreenFemaleConnectorRight refs={refs} />
    </JumperWireFrame>
  );
}
