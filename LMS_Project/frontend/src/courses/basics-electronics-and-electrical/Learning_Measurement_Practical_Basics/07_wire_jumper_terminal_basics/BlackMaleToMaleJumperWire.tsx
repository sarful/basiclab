"use client";

import { useId } from "react";

import { BlackMaleHousing, BlackMalePin } from "./components/JumperWireConnectorParts";
import JumperWireFrame from "./components/JumperWireFrame";
import {
  BlackJumperWireDefs,
  getBlackJumperWireRefs,
} from "./components/jumperWireDefs";

export default function BlackMaleToMaleJumperWire() {
  const idPrefix = useId().replace(/:/g, "");
  const refs = getBlackJumperWireRefs(idPrefix);

  return (
    <JumperWireFrame
      viewBox="0 0 1200 170"
      ariaLabel="Black male to male jumper wire"
    >
      <BlackJumperWireDefs idPrefix={idPrefix} />
      <rect x="0" y="0" width="1200" height="170" fill="#ffffff" />

      <path
        d="M260 86 C430 78, 650 83, 940 82"
        fill="none"
        stroke="#000"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.16"
      />
      <path
        d="M260 80 C430 72, 650 77, 940 76"
        fill="none"
        stroke={`url(#${refs.wire})`}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M270 74 C440 67, 650 71, 930 71"
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
      <BlackMaleHousing refs={refs} x={115} y={57} width={160} sleeveX={258} />

      <g filter={`url(#${refs.filter})`}>
        <rect x="930" y="56" width="175" height="43" rx="3" fill={`url(#${refs.housing})`} />
        <rect x="950" y="63" width="70" height="29" rx="2" fill="#2c2d34" />
        <rect x="1028" y="63" width="55" height="29" rx="2" fill="#111217" />
        <rect x="968" y="69" width="40" height="6" rx="2" fill="#5f626b" opacity="0.7" />
        <rect x="1045" y="70" width="20" height="14" rx="2" fill="#e5e7eb" />
        <rect x="925" y="62" width="18" height="31" rx="2" fill="#15161c" />
      </g>

      <BlackMalePin
        refs={refs}
        x1={1102}
        y1={78}
        x2={1165}
        y2={76}
        tipCx={1165}
        tipCy={76}
      />
    </JumperWireFrame>
  );
}
