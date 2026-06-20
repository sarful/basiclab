"use client";

import type { ElectronicsSymbolProps } from "../shared";

type SPDTSymbolProps = ElectronicsSymbolProps & {
  relayEnergized?: boolean;
  energized?: boolean;
  active?: boolean;
  showContactLabels?: boolean;
  noLabel?: string;
  comLabel?: string;
  ncLabel?: string;
  activeStroke?: string;
  idleStroke?: string;
};

const FRAME_STROKE = "#374151";
const CONTACT_COM = { x: 156, y: 40 };
const CONTACT_NC = { x: 146, y: 103 };
const CONTACT_NO = { x: 188, y: 103 };
const CONTACT_LABELS = {
  com: { x: 169, y: 32 },
  nc: { x: 129, y: 96 },
  no: { x: 196, y: 96 },
} as const;

export default function SPDTSymbol({
  className = "",
  label = "SPDT Relay",
  width = 260,
  height = 180,
  relayEnergized = false,
  energized,
  active,
  showContactLabels = false,
  noLabel = "NO",
  comLabel = "COM",
  ncLabel = "NC",
  activeStroke = "#10b981",
  idleStroke = "#94a3b8",
}: SPDTSymbolProps) {
  const isEnergized = Boolean(relayEnergized || energized || active);
  const armEnd = isEnergized
    ? { x: CONTACT_NO.x - 4, y: CONTACT_NO.y - 6 }
    : { x: CONTACT_NC.x + 4, y: CONTACT_NC.y - 6 };
  const armStroke = isEnergized ? activeStroke : idleStroke;
  const noStroke = isEnergized ? activeStroke : FRAME_STROKE;
  const ncStroke = isEnergized ? FRAME_STROKE : idleStroke;
  const ariaLabel = `${label} ${isEnergized ? "COM to NO" : "COM to NC"}`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 180"
      role="img"
      aria-label={ariaLabel}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="98"
        y="28"
        width="105"
        height="88"
        fill="#ffffff"
        stroke={FRAME_STROKE}
        strokeWidth="2"
      />

      <line
        x1="117"
        y1="22"
        x2="117"
        y2="123"
        stroke={FRAME_STROKE}
        strokeWidth="2"
        strokeLinecap="square"
      />

      <path
        d="M117 39
           C132 39 132 53 117 53
           C102 53 102 46 117 46
           C132 46 132 60 117 60
           C102 60 102 68 117 68
           C132 68 132 82 117 82
           C102 82 102 75 117 75
           C132 75 132 89 117 89
           C102 89 102 97 117 97"
        stroke={FRAME_STROKE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1={CONTACT_COM.x}
        y1="22"
        x2={CONTACT_COM.x}
        y2={CONTACT_COM.y}
        stroke={FRAME_STROKE}
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx={CONTACT_COM.x}
        cy={CONTACT_COM.y}
        r="5"
        fill="#ffffff"
        stroke={FRAME_STROKE}
        strokeWidth="2"
      />

      <line
        x1={CONTACT_NC.x}
        y1="104"
        x2={CONTACT_NC.x}
        y2="123"
        stroke={FRAME_STROKE}
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx={CONTACT_NC.x}
        cy={CONTACT_NC.y}
        r="5"
        fill="#ffffff"
        stroke={ncStroke}
        strokeWidth="2"
      />

      <line
        x1={CONTACT_NO.x}
        y1="104"
        x2={CONTACT_NO.x}
        y2="123"
        stroke={FRAME_STROKE}
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx={CONTACT_NO.x}
        cy={CONTACT_NO.y}
        r="5"
        fill="#ffffff"
        stroke={noStroke}
        strokeWidth="2"
      />

      <line
        x1={CONTACT_COM.x}
        y1={CONTACT_COM.y}
        x2={armEnd.x}
        y2={armEnd.y}
        stroke={armStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <path
        d="M134 71H156"
        stroke={FRAME_STROKE}
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <path
        d="M169 84L155 80M169 84L157 95"
        stroke={FRAME_STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M146 60C160 60 171 55 181 47"
        stroke={FRAME_STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {showContactLabels ? (
        <>
          <text
            x={CONTACT_LABELS.com.x}
            y={CONTACT_LABELS.com.y}
            fontSize="8"
            fontWeight="700"
            fill={FRAME_STROKE}
          >
            {comLabel}
          </text>
          <text
            x={CONTACT_LABELS.nc.x}
            y={CONTACT_LABELS.nc.y}
            fontSize="8"
            fontWeight="700"
            fill={isEnergized ? "#94a3b8" : idleStroke}
          >
            {ncLabel}
          </text>
          <text
            x={CONTACT_LABELS.no.x}
            y={CONTACT_LABELS.no.y}
            fontSize="8"
            fontWeight="700"
            fill={isEnergized ? activeStroke : "#94a3b8"}
          >
            {noLabel}
          </text>
        </>
      ) : null}
    </svg>
  );
}
