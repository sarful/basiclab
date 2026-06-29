"use client";

import React, { useMemo, useState } from "react";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 900 };

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

const BASE_COMPONENT = {
  stroke: "#111827",
  strokeWidth: 4 * SCALE.component,
  fill: "#ffffff",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  bg: "#f8fafc",
  panel: "#ffffff",
  panelStroke: "#cbd5e1",
  dark: "#111827",
  black: "#111111",
  gray: "#64748b",
  grid: "#e5e7eb",

  blue: "#2563eb",
  green: "#16a34a",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#7c3aed",
  yellow: "#facc15",
};

const NODE = {
  terminal: 10,
  small: 5,
};

const WIRE = {
  color: "#111827",
  width: BASE_WIRE_WIDTH * SCALE.wire,
  thin: 2 * SCALE.wire,
};

const PATH = {
  controlPanel: { x: 35, y: 35, width: 310, height: 820, rx: 18 },
  outputGraph: { x: 370, y: 35, width: 500, height: 395, rx: 18 },
  transferGraph: { x: 370, y: 460, width: 500, height: 395, rx: 18 },
  dashboard: { x: 895, y: 35, width: 270, height: 820, rx: 18 },

  outputPlot: { x: 430, y: 105, width: 380, height: 250 },
  transferPlot: { x: 430, y: 530, width: 380, height: 250 },
};

const LABEL = {
  fontFamily: "Arial, sans-serif",
  title: 22,
  heading: 16,
  normal: 13,
  small: 11,
};

/* =========================================================
   TYPES
========================================================= */

type JfetType = "N-Channel JFET" | "P-Channel JFET";
type GraphMode = "Both" | "Output" | "Transfer";
type RegionState = "Ohmic / Linear" | "Pinch-off" | "Saturation" | "Cutoff";

const GRAPH_MODES: GraphMode[] = ["Both", "Output", "Transfer"];

/* =========================================================
   LOGIC
========================================================= */

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function isN(type: JfetType) {
  return type === "N-Channel JFET";
}

function reverseGateAmount(type: JfetType, vgs: number) {
  return isN(type) ? Math.abs(Math.min(0, vgs)) : Math.max(0, vgs);
}

function channelWidth(type: JfetType, vgs: number, vgsOffAbs: number) {
  return clamp(1 - reverseGateAmount(type, vgs) / vgsOffAbs, 0, 1);
}

function shockleyId(type: JfetType, vgs: number, idss: number, vgsOffAbs: number) {
  const w = channelWidth(type, vgs, vgsOffAbs);
  return idss * w * w;
}

function pinchVoltage(type: JfetType, vgs: number, vgsOffAbs: number) {
  const reverse = reverseGateAmount(type, vgs);
  return clamp(vgsOffAbs - reverse, 0, vgsOffAbs);
}

function outputId(type: JfetType, vgs: number, vds: number, idss: number, vgsOffAbs: number) {
  const idsat = shockleyId(type, vgs, idss, vgsOffAbs);
  const vp = pinchVoltage(type, vgs, vgsOffAbs);

  if (idsat <= 0.01) return 0;
  if (vp <= 0.01) return 0;

  if (vds < vp) {
    const ratio = clamp(vds / vp, 0, 1);
    return idsat * (2 * ratio - ratio * ratio);
  }

  return idsat;
}

function getRegion(type: JfetType, vgs: number, vds: number, idss: number, vgsOffAbs: number): RegionState {
  const id = outputId(type, vgs, vds, idss, vgsOffAbs);
  const vp = pinchVoltage(type, vgs, vgsOffAbs);

  if (id <= 0.01 || channelWidth(type, vgs, vgsOffAbs) <= 0.02) return "Cutoff";
  if (vds < vp * 0.85) return "Ohmic / Linear";
  if (Math.abs(vds - vp) < 0.8) return "Pinch-off";
  return "Saturation";
}

function regionColor(region: RegionState) {
  if (region === "Cutoff") return COMPONENT.red;
  if (region === "Pinch-off") return COMPONENT.orange;
  if (region === "Saturation") return COMPONENT.green;
  return COMPONENT.blue;
}

function graphPath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function Panel({ x, y, width, height, rx }: { x: number; y: number; width: number; height: number; rx: number }) {
  return <rect x={x} y={y} width={width} height={height} rx={rx} fill={COMPONENT.panel} stroke={COMPONENT.panelStroke} strokeWidth={3} />;
}

function Text({
  x,
  y,
  children,
  size = LABEL.normal,
  color = COMPONENT.black,
  weight = 400,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
}) {
  return <text x={x} y={y} fontFamily={LABEL.fontFamily} fontSize={size} fill={color} fontWeight={weight}>{children}</text>;
}

function Button({
  x,
  y,
  width,
  label,
  active,
  onClick,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={width} height={34} rx={9} fill={active ? COMPONENT.dark : "#ffffff"} stroke={active ? COMPONENT.dark : COMPONENT.panelStroke} strokeWidth={2} />
      <Text x={x + 12} y={y + 22} size={12} color={active ? "#ffffff" : COMPONENT.black} weight={700}>{label}</Text>
    </g>
  );
}

function Slider({
  x,
  y,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const w = 230;
  const knob = x + ((value - min) / (max - min)) * w;

  return (
    <g>
      <Text x={x} y={y - 8} size={11}>{label}: {value.toFixed(1)}{unit}</Text>
      <line x1={x} y1={y + 12} x2={x + w} y2={y + 12} stroke="#cbd5e1" strokeWidth={7} strokeLinecap="round" />
      <line x1={x} y1={y + 12} x2={knob} y2={y + 12} stroke={COMPONENT.blue} strokeWidth={7} strokeLinecap="round" />
      <circle cx={knob} cy={y + 12} r={10} fill={COMPONENT.blue} />
      <foreignObject x={x - 8} y={y - 6} width={w + 16} height={38}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-full cursor-pointer opacity-0"
        />
      </foreignObject>
    </g>
  );
}

function StatusCard({
  x,
  y,
  title,
  value,
  color,
}: {
  x: number;
  y: number;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={220} height={58} rx={12} fill="#ffffff" stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={x + 16} cy={y + 18} r={6} fill={color} />
      <Text x={x + 30} y={y + 22} size={11} color={COMPONENT.gray}>{title}</Text>
      <Text x={x + 16} y={y + 43} size={15} color={color} weight={700}>{value}</Text>
    </g>
  );
}

function PlotGrid({
  x,
  y,
  width,
  height,
  xLabel,
  yLabel,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill="#ffffff" stroke="#cbd5e1" strokeWidth={2} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <line x1={x} y1={y + i * (height / 5)} x2={x + width} y2={y + i * (height / 5)} stroke={COMPONENT.grid} />
          <line x1={x + i * (width / 5)} y1={y} x2={x + i * (width / 5)} y2={y + height} stroke={COMPONENT.grid} />
        </g>
      ))}
      <line x1={x} y1={y + height} x2={x + width} y2={y + height} stroke={COMPONENT.black} strokeWidth={2} />
      <line x1={x} y1={y} x2={x} y2={y + height} stroke={COMPONENT.black} strokeWidth={2} />
      <Text x={x + width - 55} y={y + height + 25} size={12}>{xLabel}</Text>
      <Text x={x - 45} y={y + 15} size={12}>{yLabel}</Text>
    </g>
  );
}

/* =========================================================
   GRAPH COMPONENTS
========================================================= */

function OutputCharacteristicsGraph({
  type,
  vgs,
  vds,
  idss,
  vgsOffAbs,
}: {
  type: JfetType;
  vgs: number;
  vds: number;
  idss: number;
  vgsOffAbs: number;
}) {
  const { x, y, width, height } = PATH.outputPlot;
  const vgsCurves = isN(type)
    ? [0, -1, -2, -3, -4, -5, -6, -7, -8].filter((v) => Math.abs(v) <= vgsOffAbs)
    : [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((v) => Math.abs(v) <= vgsOffAbs);

  const maxVds = 20;
  const maxId = Math.max(10, idss);
  const liveId = outputId(type, vgs, vds, idss, vgsOffAbs);
  const liveX = x + (vds / maxVds) * width;
  const liveY = y + height - (liveId / maxId) * height;
  const liveRegion = getRegion(type, vgs, vds, idss, vgsOffAbs);

  return (
    <g>
      <Panel {...PATH.outputGraph} />
      <Text x={400} y={70} size={20} weight={700}>Output Characteristics</Text>
      <Text x={400} y={92} size={12} color={COMPONENT.gray}>ID vs VDS with multiple VGS curves</Text>

      <PlotGrid x={x} y={y} width={width} height={height} xLabel="VDS" yLabel="ID" />

      <rect x={x} y={y + height - 58} width={width * 0.23} height={58} fill={COMPONENT.blue} opacity={0.08} />
      <Text x={x + 10} y={y + height - 35} size={11} color={COMPONENT.blue}>Ohmic / Linear</Text>

      <rect x={x + width * 0.23} y={y} width={width * 0.77} height={height} fill={COMPONENT.green} opacity={0.05} />
      <Text x={x + width * 0.55} y={y + 24} size={11} color={COMPONENT.green}>Saturation</Text>

      {vgsCurves.map((curveVgs, index) => {
        const points: [number, number][] = Array.from({ length: 70 }, (_, i) => {
          const vd = (i / 69) * maxVds;
          const id = outputId(type, curveVgs, vd, idss, vgsOffAbs);
          return [x + (vd / maxVds) * width, y + height - (id / maxId) * height];
        });
        const color = index === 0 ? COMPONENT.blue : `hsl(${220 + index * 18}, 70%, 45%)`;

        return (
          <g key={curveVgs}>
            <path d={graphPath(points)} fill="none" stroke={color} strokeWidth={2.5} />
            <Text x={x + width + 8} y={(points[points.length - 1][1] || y) + 4} size={10} color={color}>
              {curveVgs}V
            </Text>
          </g>
        );
      })}

      <circle cx={liveX} cy={liveY} r={7} fill={COMPONENT.orange} stroke={COMPONENT.black} strokeWidth={2} />
      <Text x={liveX + 10} y={liveY - 10} size={11} color={regionColor(liveRegion)}>Q Point</Text>

      <Text x={x} y={y + height + 48} size={12} color={COMPONENT.blue}>Blue area: Ohmic / Linear</Text>
      <Text x={x + 190} y={y + height + 48} size={12} color={COMPONENT.green}>Flat area: Saturation</Text>
    </g>
  );
}

function TransferCharacteristicsGraph({
  type,
  vgs,
  vds,
  idss,
  vgsOffAbs,
}: {
  type: JfetType;
  vgs: number;
  vds: number;
  idss: number;
  vgsOffAbs: number;
}) {
  const { x, y, width, height } = PATH.transferPlot;
  const maxId = Math.max(10, idss);
  const minVgs = isN(type) ? -vgsOffAbs : 0;
  const maxVgs = isN(type) ? 0 : vgsOffAbs;

  const curve: [number, number][] = Array.from({ length: 80 }, (_, i) => {
    const vg = minVgs + (i / 79) * (maxVgs - minVgs);
    const id = shockleyId(type, vg, idss, vgsOffAbs);
    return [x + ((vg - minVgs) / (maxVgs - minVgs)) * width, y + height - (id / maxId) * height];
  });

  const liveId = shockleyId(type, vgs, idss, vgsOffAbs);
  const liveX = x + ((vgs - minVgs) / (maxVgs - minVgs)) * width;
  const liveY = y + height - (liveId / maxId) * height;
  const offX = isN(type) ? x : x + width;

  return (
    <g>
      <Panel {...PATH.transferGraph} />
      <Text x={400} y={495} size={20} weight={700}>Transfer Characteristics</Text>
      <Text x={400} y={517} size={12} color={COMPONENT.gray}>ID vs VGS using Shockley curve</Text>

      <PlotGrid x={x} y={y} width={width} height={height} xLabel="VGS" yLabel="ID" />

      <path d={graphPath(curve)} fill="none" stroke={COMPONENT.purple} strokeWidth={4} />

      <line x1={offX} y1={y} x2={offX} y2={y + height} stroke={COMPONENT.red} strokeWidth={3} strokeDasharray="8 7" />
      <Text x={offX - 30} y={y + height + 40} size={11} color={COMPONENT.red}>VGS(off)</Text>

      <circle cx={liveX} cy={liveY} r={7} fill={COMPONENT.orange} stroke={COMPONENT.black} strokeWidth={2} />
      <Text x={liveX + 10} y={liveY - 10} size={11} color={COMPONENT.orange}>Operating Point</Text>

      <Text x={x} y={y + height + 58} size={12}>ID = IDSS × (1 − VGS/VGS(off))²</Text>
    </g>
  );
}

/* =========================================================
   PANELS
========================================================= */

function ControlPanel({
  type,
  setType,
  vgs,
  setVgs,
  vds,
  setVds,
  idss,
  setIdss,
  vgsOffAbs,
  setVgsOffAbs,
  graphMode,
  setGraphMode,
}: {
  type: JfetType;
  setType: (v: JfetType) => void;
  vgs: number;
  setVgs: (v: number) => void;
  vds: number;
  setVds: (v: number) => void;
  idss: number;
  setIdss: (v: number) => void;
  vgsOffAbs: number;
  setVgsOffAbs: (v: number) => void;
  graphMode: GraphMode;
  setGraphMode: (v: GraphMode) => void;
}) {
  const minVgs = isN(type) ? -vgsOffAbs : 0;
  const maxVgs = isN(type) ? 0 : vgsOffAbs;

  return (
    <g>
      <Panel {...PATH.controlPanel} />
      <Text x={60} y={75} size={22} weight={700}>JFET Lab Controls</Text>
      <Text x={60} y={100} size={12} color={COMPONENT.gray}>Characteristics & transfer curve</Text>

      <Text x={60} y={140} size={14} weight={700}>JFET Type</Text>
      <Button x={60} y={155} width={120} label="N-Channel" active={type === "N-Channel JFET"} onClick={() => { setType("N-Channel JFET"); setVgs(0); }} />
      <Button x={190} y={155} width={120} label="P-Channel" active={type === "P-Channel JFET"} onClick={() => { setType("P-Channel JFET"); setVgs(0); }} />

      <Slider x={60} y={240} label="VGS" value={vgs} min={minVgs} max={maxVgs} step={0.1} unit="V" onChange={setVgs} />
      <Slider x={60} y={315} label="VDS" value={vds} min={0} max={20} step={0.1} unit="V" onChange={setVds} />
      <Slider x={60} y={390} label="IDSS" value={idss} min={5} max={50} step={1} unit="mA" onChange={setIdss} />
      <Slider x={60} y={465} label="VGS(off)" value={vgsOffAbs} min={2} max={8} step={0.1} unit="V" onChange={setVgsOffAbs} />

      <Text x={60} y={545} size={14} weight={700}>Graph Mode</Text>
      {GRAPH_MODES.map((mode, i) => (
        <Button
          key={mode}
          x={60}
          y={565 + i * 44}
          width={230}
          label={mode}
          active={graphMode === mode}
          onClick={() => setGraphMode(mode)}
        />
      ))}

      <rect x="60" y="730" width="230" height="80" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={80} y={760} size={14} weight={700}>Next Module</Text>
      <Text x={80} y={785} size={12}>JFET amplifier lab</Text>
    </g>
  );
}

function DashboardPanel({
  type,
  vgs,
  vds,
  idss,
  vgsOffAbs,
}: {
  type: JfetType;
  vgs: number;
  vds: number;
  idss: number;
  vgsOffAbs: number;
}) {
  const id = outputId(type, vgs, vds, idss, vgsOffAbs);
  const width = channelWidth(type, vgs, vgsOffAbs);
  const region = getRegion(type, vgs, vds, idss, vgsOffAbs);
  const offText = isN(type) ? `-${vgsOffAbs.toFixed(1)}V` : `+${vgsOffAbs.toFixed(1)}V`;

  return (
    <g>
      <Panel {...PATH.dashboard} />
      <rect x="925" y="65" width="210" height="36" rx="12" fill={COMPONENT.dark} />
      <Text x={945} y={88} size={16} color="#ffffff" weight={700}>SCADA Dashboard</Text>

      <StatusCard x={920} y={130} title="JFET Type" value={type} color={isN(type) ? COMPONENT.green : COMPONENT.orange} />
      <StatusCard x={920} y={205} title="VGS" value={`${vgs.toFixed(1)}V`} color={COMPONENT.blue} />
      <StatusCard x={920} y={280} title="VDS" value={`${vds.toFixed(1)}V`} color={COMPONENT.orange} />
      <StatusCard x={920} y={355} title="IDSS" value={`${idss.toFixed(0)}mA`} color={COMPONENT.green} />
      <StatusCard x={920} y={430} title="VGS(off)" value={offText} color={COMPONENT.red} />
      <StatusCard x={920} y={505} title="ID" value={`${id.toFixed(2)}mA`} color={regionColor(region)} />
      <StatusCard x={920} y={580} title="Region" value={region} color={regionColor(region)} />
      <StatusCard x={920} y={655} title="Channel Width" value={`${Math.round(width * 100)}%`} color={COMPONENT.purple} />

      <rect x="920" y="755" width="220" height="55" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={940} y={780} size={13} weight={700}>Operating Region</Text>
      <circle cx="940" cy="800" r={7} fill={regionColor(region)} />
      <Text x={955} y={805} size={12}>{region}</Text>
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function JfetConstructionSimulator() {
  const [type, setType] = useState<JfetType>("N-Channel JFET");
  const [vgs, setVgs] = useState(0);
  const [vds, setVds] = useState(6);
  const [idss, setIdss] = useState(25);
  const [vgsOffAbs, setVgsOffAbs] = useState(4);
  const [graphMode, setGraphMode] = useState<GraphMode>("Both");

  return (
    <div className="w-full min-h-screen bg-slate-100 p-2 sm:p-4 flex items-center justify-center overflow-x-auto">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="w-full min-w-[980px] max-w-7xl h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.bg} />

        <ControlPanel
          type={type}
          setType={setType}
          vgs={vgs}
          setVgs={setVgs}
          vds={vds}
          setVds={setVds}
          idss={idss}
          setIdss={setIdss}
          vgsOffAbs={vgsOffAbs}
          setVgsOffAbs={setVgsOffAbs}
          graphMode={graphMode}
          setGraphMode={setGraphMode}
        />

        {(graphMode === "Both" || graphMode === "Output") && (
          <OutputCharacteristicsGraph
            type={type}
            vgs={vgs}
            vds={vds}
            idss={idss}
            vgsOffAbs={vgsOffAbs}
          />
        )}

        {(graphMode === "Both" || graphMode === "Transfer") && (
          <TransferCharacteristicsGraph
            type={type}
            vgs={vgs}
            vds={vds}
            idss={idss}
            vgsOffAbs={vgsOffAbs}
          />
        )}

        <DashboardPanel
          type={type}
          vgs={vgs}
          vds={vds}
          idss={idss}
          vgsOffAbs={vgsOffAbs}
        />
      </svg>
    </div>
  );
}