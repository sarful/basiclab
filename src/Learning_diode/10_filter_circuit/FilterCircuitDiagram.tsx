"use client";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

export function FilterCircuitDiagram({
  point,
  filterEnabled,
  capacitorUf,
  electronFlowRate,
}: {
  point: WavePoint;
  filterEnabled: boolean;
  capacitorUf: number;
  electronFlowRate: number;
}) {
  const d1On = point.activeDiode === "D1";
  const d2On = point.activeDiode === "D2";
  const electronColor = point.ledBlown ? "#ef4444" : "#ff2bbd";
  const wireColor = "#94a3b8";
  const activeWire = "#2d55ff";

  const getWire = (active: boolean) => (active ? activeWire : wireColor);
  const symbolColor = "#1d3cff";
  const capColor = filterEnabled ? "#2d55ff" : "#94a3b8";
  const d1Active = d1On && point.diodeCurrent > 0.0005;
  const d2Active = d2On && point.diodeCurrent > 0.0005;
  const loadCurrent = point.filteredCurrent > 0.001;

  const d1Path = [
    { x: 248, y: 52 },
    { x: 312, y: 52 },
    { x: 344, y: 52 },
    { x: 392, y: 52 },
    { x: 430, y: 52 },
    { x: 430, y: 138 },
    { x: 475, y: 138 },
    { x: 475, y: 102 },
    { x: 602, y: 102 },
    { x: 602, y: 138 },
    { x: 602, y: 172 },
    { x: 602, y: 282 },
    { x: 475, y: 282 },
    { x: 285, y: 282 },
    { x: 285, y: 135 },
    { x: 248, y: 135 },
  ];

  const d2Path = [
    { x: 248, y: 218 },
    { x: 312, y: 218 },
    { x: 344, y: 218 },
    { x: 392, y: 218 },
    { x: 430, y: 218 },
    { x: 430, y: 138 },
    { x: 475, y: 138 },
    { x: 475, y: 102 },
    { x: 602, y: 102 },
    { x: 602, y: 138 },
    { x: 602, y: 172 },
    { x: 602, y: 282 },
    { x: 475, y: 282 },
    { x: 285, y: 282 },
    { x: 285, y: 135 },
    { x: 248, y: 135 },
  ];

  const capacitorChargePath = [
    { x: 475, y: 102 },
    { x: 505, y: 102 },
    { x: 505, y: 178 },
  ];

  const capacitorDischargePath = [
    { x: 505, y: 178 },
    { x: 505, y: 102 },
    { x: 602, y: 102 },
    { x: 602, y: 138 },
    { x: 602, y: 172 },
    { x: 602, y: 282 },
    { x: 505, y: 282 },
    { x: 505, y: 220 },
  ];

  return (
    <svg
      viewBox="0 0 650 330"
      className="h-full min-h-[320px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Center tapped full wave rectifier filter circuit reference style"
    >
      <rect x="0" y="0" width="650" height="330" fill="#ffffff" />

      <circle cx="112" cy="145" r="32" fill="white" stroke="#64748b" strokeWidth="3" />
      <path d="M84 145 C94 130 106 130 116 145 C126 160 138 160 148 145" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <text x="124" y="108" fill="#64748b" fontSize="15" fontWeight="900">Vac</text>
      <text x="56" y="152" fill="#64748b" fontSize="14" fontWeight="900">230V</text>

      <line x1="112" y1="113" x2="112" y2="40" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="112" y1="40" x2="172" y2="40" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="112" y1="177" x2="112" y2="240" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="112" y1="240" x2="172" y2="240" stroke={getWire(loadCurrent)} strokeWidth="3" />

      <path d="M172 40 C200 50 200 80 172 90 C200 100 200 130 172 140 C200 150 200 180 172 190 C200 200 200 230 172 240" fill="none" stroke="#64748b" strokeWidth="3" />
      <text x="155" y="260" fill="#64748b" fontSize="13" fontWeight="900">LP</text>

      <line x1="205" y1="38" x2="205" y2="214" stroke="#64748b" strokeWidth="3" />
      <line x1="213" y1="38" x2="213" y2="214" stroke="#64748b" strokeWidth="3" />
      <line x1="221" y1="38" x2="221" y2="214" stroke="#64748b" strokeWidth="3" />
      <text x="198" y="28" fill="#64748b" fontSize="18" fontWeight="900">TX1</text>

      <path d="M248 52 C226 60 226 80 248 88 C226 96 226 116 248 124" fill="none" stroke="#64748b" strokeWidth="3" />
      <path d="M248 146 C226 154 226 174 248 182 C226 190 226 210 248 218" fill="none" stroke="#64748b" strokeWidth="3" />
      <text x="253" y="96" fill="#64748b" fontSize="13" fontWeight="900">LS1</text>
      <text x="253" y="190" fill="#64748b" fontSize="13" fontWeight="900">LS2</text>

      <line x1="248" y1="52" x2="312" y2="52" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="248" y1="218" x2="312" y2="218" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="248" y1="135" x2="285" y2="135" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="285" y1="135" x2="285" y2="282" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <circle cx="248" cy="52" r="5" fill={wireColor} />
      <circle cx="248" cy="135" r="5" fill={wireColor} />
      <circle cx="248" cy="218" r="5" fill={wireColor} />
      <circle cx="285" cy="282" r="5" fill={wireColor} />
      <text x="86" y="275" fill="#64748b" fontSize="16" fontWeight="900">12-0-12 Center tapped</text>

      <line x1="312" y1="52" x2="344" y2="52" stroke={getWire(d1Active)} strokeWidth="3" />
      <polygon points="344,30 344,74 386,52" fill={d1Active ? "#22c55e" : symbolColor} />
      <line x1="392" y1="28" x2="392" y2="76" stroke={symbolColor} strokeWidth="4" />
      <line x1="392" y1="52" x2="430" y2="52" stroke={getWire(d1Active)} strokeWidth="3" />
      <circle cx="430" cy="52" r="5" fill={wireColor} />
      <text x="345" y="20" fill="#1e293b" fontSize="18" fontWeight="900">D1</text>

      <line x1="312" y1="218" x2="344" y2="218" stroke={getWire(d2Active)} strokeWidth="3" />
      <polygon points="344,196 344,240 386,218" fill={d2Active ? "#22c55e" : symbolColor} />
      <line x1="392" y1="194" x2="392" y2="242" stroke={symbolColor} strokeWidth="4" />
      <line x1="392" y1="218" x2="430" y2="218" stroke={getWire(d2Active)} strokeWidth="3" />
      <text x="344" y="260" fill="#1e293b" fontSize="18" fontWeight="900">D2</text>

      <line x1="430" y1="52" x2="430" y2="138" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="430" y1="218" x2="430" y2="138" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="430" y1="138" x2="475" y2="138" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <circle cx="430" cy="138" r="7" fill={wireColor} />
      <text x="342" y="153" fill="#1e293b" fontSize="13" fontWeight="900">+Vout</text>

      <line x1="475" y1="138" x2="475" y2="102" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="475" y1="102" x2="602" y2="102" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="475" y1="282" x2="602" y2="282" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="285" y1="282" x2="475" y2="282" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <circle cx="475" cy="138" r="6" fill={wireColor} />
      <circle cx="505" cy="102" r="6" fill={wireColor} />
      <circle cx="505" cy="282" r="6" fill={wireColor} />
      <circle cx="602" cy="102" r="5" fill={wireColor} />

      <line x1="505" y1="102" x2="505" y2="178" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="505" y1="220" x2="505" y2="282" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <line x1="482" y1="190" x2="528" y2="190" stroke={capColor} strokeWidth="4" />
      <line x1="482" y1="214" x2="528" y2="214" stroke={capColor} strokeWidth="4" />
      <path d="M482 223 C496 211 514 211 528 223" fill="none" stroke={capColor} strokeWidth="3" />
      <text x="535" y="220" fill="#64748b" fontSize="24" fontWeight="900">CL</text>
      <text x="532" y="245" fill="#64748b" fontSize="12" fontWeight="900">{capacitorUf}uF</text>
      {filterEnabled && point.capacitorCharging && (
        <circle cx="505" cy="160" r="7" fill={wireColor} />
      )}

      <line x1="602" y1="102" x2="602" y2="138" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <polygon points="588,138 616,138 602,168" fill={point.ledOn ? "#f59e0b" : symbolColor} />
      <line x1="588" y1="172" x2="616" y2="172" stroke={symbolColor} strokeWidth="4" />
      {point.ledOn && (
        <>
          <path d="M622 140 L640 122" stroke="#f59e0b" strokeWidth="3" />
          <path d="M622 160 L642 148" stroke="#f59e0b" strokeWidth="3" />
        </>
      )}
      <line x1="602" y1="172" x2="602" y2="282" stroke={getWire(loadCurrent)} strokeWidth="3" />
      <text x="620" y="190" fill="#64748b" fontSize="18" fontWeight="900">LED</text>

      <text x="335" y="310" fill="#1e293b" fontSize="12" fontWeight="900">
        {point.filteredVout.toFixed(2)}V | {(point.filteredCurrent * 1000).toFixed(2)}mA
      </text>
      <text x="335" y="328" fill="#1e293b" fontSize="12" fontWeight="900">
        D1: {d1Active ? "ACTIVE" : "OFF"} | D2: {d2Active ? "ACTIVE" : "OFF"}
      </text>

      <ElectronFlow active={d1Active} path={d1Path} color={electronColor} count={point.ledBlown ? 7 : 5} flowRate={electronFlowRate} />
      <ElectronFlow active={d2Active} path={d2Path} color={electronColor} count={point.ledBlown ? 7 : 5} flowRate={electronFlowRate} />
      <ElectronFlow active={filterEnabled && (point.capacitorCharging || point.capacitorCurrent > 0.001)} path={capacitorChargePath} color={electronColor} count={3} flowRate={electronFlowRate} />
      <ElectronFlow active={filterEnabled && !point.capacitorCharging && loadCurrent} path={capacitorDischargePath} color={electronColor} count={4} flowRate={electronFlowRate} />
    </svg>
  );
}
