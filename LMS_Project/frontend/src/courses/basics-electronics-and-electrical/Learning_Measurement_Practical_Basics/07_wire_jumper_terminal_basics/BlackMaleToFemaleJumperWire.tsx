"use client";

import { useId } from "react";

import {
  BlackFemaleHousing,
  BlackMaleHousing,
  BlackMalePin,
} from "./components/JumperWireConnectorParts";
import JumperWireFrame from "./components/JumperWireFrame";
import {
  BlackJumperWireDefs,
  getBlackJumperWireRefs,
} from "./components/jumperWireDefs";

export default function BlackMaleToFemaleJumperWire() {
  const idPrefix = useId().replace(/:/g, "");
  const refs = getBlackJumperWireRefs(idPrefix);

  return (
    <JumperWireFrame
      viewBox="0 0 1200 170"
      ariaLabel="Black male to female jumper wire"
    >
      <BlackJumperWireDefs idPrefix={idPrefix} />
      <rect x="0" y="0" width="1200" height="170" fill="#ffffff" />

      <path
        d="M275 86 C455 78, 665 83, 940 82"
        fill="none"
        stroke="#000"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.16"
      />
      <path
        d="M275 80 C455 72, 665 77, 940 76"
        fill="none"
        stroke={`url(#${refs.wire})`}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M285 74 C465 67, 665 71, 930 71"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      <BlackMalePin
        refs={refs}
        x1={45}
        y1={83}
        x2={118}
        y2={78}
        tipCx={45}
        tipCy={83}
      />
      <BlackMaleHousing refs={refs} x={115} y={57} width={165} sleeveX={263} />
      <BlackFemaleHousing refs={refs} />
    </JumperWireFrame>
  );
}
