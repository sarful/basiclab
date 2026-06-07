"use client";

import type { WavePoint } from "./types";
import { ElectronFlow } from "./ElectronFlow";

export function BridgeCircuit({
  point,
  diodeDrop,
  showElectronFlow,
  electronFlowRate,
}: {
  point: WavePoint;
  diodeDrop: number;
  showElectronFlow: boolean;
  electronFlowRate: number;
}) {
  const positivePair = point.activeDiode === "D1D4";
  const negativePair = point.activeDiode === "D2D3";
  const activeColor = "#22c55e";
  const offColor = "#d9d9d9";
  const d2d4 = negativePair ? activeColor : offColor;
  const d1d3 = negativePair ? activeColor : offColor;
  const d1d4 = positivePair ? activeColor : offColor;
  const electronColor = point.ledBlown ? "#ef4444" : point.ledOn ? "#0ea5e9" : "#94a3b8";

  const positiveElectronPath = [
    { x: 40, y: 80 },
    { x: 200, y: 80 },
    { x: 300, y: 180 },
    { x: 380, y: 180 },
    { x: 440, y: 180 },
    { x: 440, y: 240 },
    { x: 440, y: 275 },
    { x: 440, y: 300 },
    { x: 380, y: 300 },
    { x: 120, y: 300 },
    { x: 120, y: 180 },
    { x: 200, y: 280 },
    { x: 40, y: 280 },
    { x: 40, y: 208 },
  ];

  const negativeElectronPath = [
    { x: 40, y: 280 },
    { x: 200, y: 280 },
    { x: 300, y: 180 },
    { x: 380, y: 180 },
    { x: 440, y: 180 },
    { x: 440, y: 240 },
    { x: 440, y: 275 },
    { x: 440, y: 300 },
    { x: 380, y: 300 },
    { x: 120, y: 300 },
    { x: 120, y: 180 },
    { x: 200, y: 80 },
    { x: 40, y: 80 },
    { x: 40, y: 152 },
  ];

  return (
    <svg viewBox="0 0 520 340" className="h-full w-full rounded-2xl bg-white">
      <rect width="520" height="340" fill="white" />

      <circle cx="40" cy="180" r="23" fill="#9ecae1" stroke="#d9d9d9" strokeWidth="2" />
      <path
        d="M20 180 C25 166 35 166 40 180 C45 194 55 194 60 180"
        stroke="#2563eb"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <line x1="40" y1="152" x2="40" y2="80" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="40" y1="208" x2="40" y2="280" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="40" y1="80" x2="200" y2="80" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="40" y1="280" x2="200" y2="280" stroke="#d9d9d9" strokeWidth="2" />

      <circle cx="200" cy="80" r="3" fill="#d9d9d9" />
      <circle cx="120" cy="180" r="3" fill="#d9d9d9" />
      <circle cx="200" cy="280" r="3" fill="#d9d9d9" />
      <circle cx="300" cy="180" r="3" fill="#d9d9d9" />

      <line x1="200" y1="80" x2="300" y2="180" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="300" y1="180" x2="200" y2="280" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="200" y1="280" x2="120" y2="180" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="120" y1="180" x2="200" y2="80" stroke="#d9d9d9" strokeWidth="2" />

      <g transform="translate(160 130) rotate(128)">
        <polygon points="-22,-14 -22,14 18,0" fill={d2d4} />
        <line x1="22" y1="-16" x2="22" y2="16" stroke={d2d4} strokeWidth="3" />
      </g>
      <text x="145" y="105" fill="#d9d9d9">
        D2
      </text>

      <g transform="translate(245 122) rotate(52)">
        <polygon points="-22,-14 -22,14 18,0" fill={d1d4} />
        <line x1="22" y1="-16" x2="22" y2="16" stroke={d1d4} strokeWidth="3" />
      </g>
      <text x="273" y="97" fill="#d9d9d9">
        D4
      </text>

      <g transform="translate(165 237) rotate(48)">
        <polygon points="-22,-14 -22,14 18,0" fill={d1d4} />
        <line x1="22" y1="-16" x2="22" y2="16" stroke={d1d4} strokeWidth="3" />
      </g>
      <text x="145" y="267" fill="#d9d9d9">
        D1
      </text>

      <g transform="translate(255 225) rotate(-48)">
        <polygon points="-22,-14 -22,14 18,0" fill={d1d3} />
        <line x1="22" y1="-16" x2="22" y2="16" stroke={d1d3} strokeWidth="3" />
      </g>
      <text x="286" y="255" fill="#d9d9d9">
        D3
      </text>

      <line x1="120" y1="180" x2="120" y2="300" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="120" y1="300" x2="380" y2="300" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="300" y1="180" x2="380" y2="180" stroke="#d9d9d9" strokeWidth="2" />
      <circle cx="380" cy="180" r="6" fill="#9ca3af" />
      <circle cx="380" cy="300" r="6" fill="#9ca3af" />

      <text x="360" y="195" fill="#d9d9d9">
        +V (DC)
      </text>
      <text x="360" y="300" fill="#d9d9d9">
        0V (DC)
      </text>

      <line x1="380" y1="180" x2="440" y2="180" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="440" y1="180" x2="440" y2="240" stroke="#d9d9d9" strokeWidth="2" />

      <line x1="440" y1="275" x2="440" y2="300" stroke="#d9d9d9" strokeWidth="2" />
      <line x1="440" y1="300" x2="380" y2="300" stroke="#d9d9d9" strokeWidth="2" />

      <polygon
        points="440,258 420,240 460,240"
        fill={point.ledBlown ? "#7f1d1d" : point.ledOn ? "#f59e0b" : "#d9d9d9"}
      />

      <line x1="420" y1="265" x2="460" y2="265" stroke="#d9d9d9" strokeWidth="3" />

      <line x1="450" y1="255" x2="465" y2="240" stroke="#facc15" strokeWidth="2" />
      <polygon points="465,240 459,243 463,247" fill="#facc15" />

      <line x1="430" y1="255" x2="415" y2="240" stroke="#facc15" strokeWidth="2" />
      <polygon points="415,240 421,243 417,247" fill="#facc15" />

      <text x="445" y="230" fill="#22c55e" fontSize="16" fontWeight="bold">
        +
      </text>
      <text x="445" y="300" fill="#ef4444" fontSize="16" fontWeight="bold">
        -
      </text>

      {point.ledOn && <circle cx="440" cy="255" r="6" fill="#facc15" opacity="0.25" />}

      <text x="470" y="255" fill="#d9d9d9">
        LED
      </text>

      <ElectronFlow
        active={showElectronFlow && positivePair && point.ledOn}
        path={positiveElectronPath}
        color={electronColor}
        count={point.ledBlown ? 7 : 5}
        speed={electronFlowRate}
      />
      <ElectronFlow
        active={showElectronFlow && negativePair && point.ledOn}
        path={negativeElectronPath}
        color={electronColor}
        count={point.ledBlown ? 7 : 5}
        speed={electronFlowRate}
      />
    </svg>
  );
}
