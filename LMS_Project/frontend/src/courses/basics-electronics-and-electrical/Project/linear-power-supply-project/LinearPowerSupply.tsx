"use client";

import React from "react";

type BadgeTone = "neutral" | "active" | "fault";
type WireState = "active" | "inactive" | "fault";

type LinearPowerSupplyProps = {
  className?: string;
  inputOn?: boolean;
  regulatorOn?: boolean;
  ledOn?: boolean;
  diodeFault?: boolean;
  capacitorFault?: boolean;
  regulatorFault?: boolean;
  showLabels?: boolean;
  showFlow?: boolean;
  viewMode?: "fit" | "actual";
  highlightComponentKey?:
    | "source"
    | "transformer"
    | "d2"
    | "d3"
    | "capacitor"
    | "regulator"
    | "resistor"
    | "led";
  flowStateLabel?: string;
  componentStateBadges?: Array<{
    key: string;
    label: string;
    state: string;
    tone: BadgeTone;
  }>;
};

const STAGE = {
  width: 1200,
  height: 440,
  boardX: 16,
  boardY: 18,
  boardWidth: 1168,
  boardHeight: 404,
};

const COLORS = {
  wireColor: "#3f4a4f",
  symbolColor: "#3f4a4f",
  labelColor: "#2b2f33",
  activeLineColor: "#22c55e",
  inactiveLineColor: "#94a3b8",
  faultLineColor: "#ef4444",
  electronColor: "#38bdf8",
};

const STROKES = {
  wireStroke: 3,
  symbolStroke: 3,
  symbolTextSize: 18,
  electronRadius: 4,
  electronBlur: 2.4,
  electronStagger: [0, 0.45, 0.9, 1.35],
};

const { width, height, boardX, boardY, boardWidth, boardHeight } = STAGE;
const {
  wireColor,
  symbolColor,
  labelColor,
  activeLineColor,
  inactiveLineColor,
  faultLineColor,
  electronColor,
} = COLORS;
const { wireStroke, symbolStroke, symbolTextSize, electronRadius, electronBlur, electronStagger } = STROKES;

function resolveWireColor(state: WireState) {
  if (state === "fault") return faultLineColor;
  if (state === "active") return activeLineColor;
  return inactiveLineColor;
}

function ActivePath({ d, state }: { d: string; state: WireState }) {
  if (state === "inactive") return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={resolveWireColor(state)}
      strokeWidth={wireStroke + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.9}
    />
  );
}

function ElectronFlow({
  path,
  active,
  fault = false,
  duration = 2.4,
  staggerOffset = 0,
}: {
  path: string;
  active: boolean;
  fault?: boolean;
  duration?: number;
  staggerOffset?: number;
}) {
  if (!active) return null;

  return (
    <>
      {electronStagger.map((begin) => (
        <circle
          key={`${path}-${begin}-${staggerOffset}`}
          r={electronRadius}
          fill={fault ? "#f87171" : electronColor}
          filter="url(#electron-glow-linear-psu)"
        >
          <animateMotion
            path={path}
            dur={`${duration}s`}
            begin={`${begin + staggerOffset}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </circle>
      ))}
    </>
  );
}

function BackgroundPixelGrid({ width, height }: { width: number; height: number }) {
  return (
    <g opacity={0.28}>
      <rect x={0} y={0} width={width} height={height} rx={18} fill="#ffffff" />
      <path
        d={`M 0 0 H ${width} V ${height} H 0 Z`}
        fill="none"
        stroke="#e5edf5"
        strokeWidth={1}
      />
      {Array.from({ length: Math.floor(width / 20) + 1 }).map((_, index) => (
        <line
          key={`v-${index}`}
          x1={index * 20}
          y1={0}
          x2={index * 20}
          y2={height}
          stroke="#edf3f9"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: Math.floor(height / 20) + 1 }).map((_, index) => (
        <line
          key={`h-${index}`}
          x1={0}
          y1={index * 20}
          x2={width}
          y2={index * 20}
          stroke="#edf3f9"
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

function HighlightBox({
  x,
  y,
  w,
  h,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  active: boolean;
}) {
  if (!active) return null;

  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill="#dbeafe"
      fillOpacity={0.32}
      stroke="#60a5fa"
      strokeWidth={1.3}
      strokeDasharray="7 5"
    />
  );
}

function Junction({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} fill={symbolColor} />;
}

function Diode({ x, y, label, part }: { x: number; y: number; label: string; part: string }) {
  return (
    <g>
      <polygon points={`${x},${y - 22} ${x},${y + 22} ${x + 36},${y}`} fill={symbolColor} />
      <line
        x1={x + 36}
        y1={y - 24}
        x2={x + 36}
        y2={y + 24}
        stroke={symbolColor}
        strokeWidth={symbolStroke}
        strokeLinecap="round"
      />
      <text x={x + 18} y={y + 62} textAnchor="middle" fontSize={21} fontWeight={800} fill={labelColor}>
        {label}
      </text>
      <text x={x + 18} y={y + 86} textAnchor="middle" fontSize={21} fontWeight={800} fill={labelColor}>
        {part}
      </text>
    </g>
  );
}

function Transformer({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={symbolColor} strokeWidth={symbolStroke} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={x - 108} y={y - 70} width={108} height={140} fill="none" />
      <path d={`M ${x - 4} ${y - 34} C ${x + 24} ${y - 34}, ${x + 24} ${y + 34}, ${x - 4} ${y + 34}`} />
      <path d={`M ${x + 30} ${y - 34} C ${x + 2} ${y - 34}, ${x + 2} ${y + 34}, ${x + 30} ${y + 34}`} />
      <line x1={x + 48} y1={y - 52} x2={x + 48} y2={y + 52} />
      <line x1={x + 62} y1={y - 52} x2={x + 62} y2={y + 52} />
      <path d={`M ${x + 88} ${y - 40} C ${x + 60} ${y - 40}, ${x + 60} ${y + 40}, ${x + 88} ${y + 40}`} />
      <path d={`M ${x + 122} ${y - 40} C ${x + 94} ${y - 40}, ${x + 94} ${y + 40}, ${x + 122} ${y + 40}`} />
      <circle cx={x - 10} cy={y - 24} r={4} fill={symbolColor} stroke="none" />
      <circle cx={x + 128} cy={y - 42} r={4} fill={symbolColor} stroke="none" />
      <text x={x - 60} y={y - 10} fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>I1</text>
      <text x={x - 60} y={y + 16} fontSize={21} fontWeight={800} stroke="none" fill={labelColor}>sine</text>
      <text x={x - 60} y={y + 42} fontSize={21} fontWeight={800} stroke="none" fill={labelColor}>1 kHz</text>
      <text x={x - 2} y={y + 102} fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>XFMR1</text>
      <circle cx={x - 104} cy={y} r={36} />
      <path d={`M ${x - 132} ${y + 2} C ${x - 122} ${y - 36}, ${x - 112} ${y + 34}, ${x - 98} ${y - 2} C ${x - 88} ${y - 28}, ${x - 82} ${y + 22}, ${x - 70} ${y + 2}`} />
      <path d={`M ${x - 104} ${y + 44} V ${y + 28} M ${x - 113} ${y + 36} L ${x - 104} ${y + 48} L ${x - 95} ${y + 36}`} />
    </g>
  );
}

function Capacitor({ x, topY, bottomY }: { x: number; topY: number; bottomY: number }) {
  const midY = (topY + bottomY) / 2;
  return (
    <g stroke={symbolColor} strokeWidth={symbolStroke} fill="none" strokeLinecap="round">
      <line x1={x} y1={topY} x2={x} y2={midY - 56} />
      <line x1={x} y1={midY + 30} x2={x} y2={bottomY} />
      <line x1={x - 34} y1={midY - 42} x2={x + 34} y2={midY - 42} />
      <path d={`M ${x - 34} ${midY + 8} Q ${x} ${midY + 25}, ${x + 34} ${midY + 8}`} />
      <text x={x - 36} y={midY - 46} fontSize={24} fontWeight={500} stroke="none" fill={labelColor}>+</text>
      <text x={x + 44} y={midY - 38} fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>C2</text>
      <text x={x + 44} y={midY - 14} fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>450 µF</text>
    </g>
  );
}

function Regulator7805({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={104} height={88} fill="#ffffff" stroke={symbolColor} strokeWidth={symbolStroke} />
      <text x={x + 52} y={y - 36} textAnchor="middle" fontSize={23} fontWeight={800} fill={labelColor}>U1</text>
      <text x={x + 52} y={y - 10} textAnchor="middle" fontSize={23} fontWeight={800} fill={labelColor}>7805</text>
      <text x={x + 16} y={y + 42} fontSize={18} fontStyle="italic" fontWeight={700} fill={labelColor}>IN</text>
      <text x={x + 60} y={y + 42} fontSize={18} fontStyle="italic" fontWeight={700} fill={labelColor}>OUT</text>
      <text x={x + 52} y={y + 82} textAnchor="middle" fontSize={18} fontStyle="italic" fontWeight={700} fill={labelColor}>GND</text>
    </g>
  );
}

function Resistor({ x, y }: { x: number; y: number }) {
  const points = [
    [x, y], [x + 10, y - 16], [x + 22, y + 16], [x + 34, y - 16],
    [x + 46, y + 16], [x + 58, y - 16], [x + 70, y + 16], [x + 82, y],
  ];
  return (
    <g stroke={symbolColor} strokeWidth={symbolStroke} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points.map((p) => p.join(",")).join(" ")} />
      <text x={x + 38} y={y + 54} textAnchor="middle" fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>R1</text>
      <text x={x + 38} y={y + 80} textAnchor="middle" fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>100 Ω</text>
    </g>
  );
}

function Led({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={symbolColor} strokeWidth={symbolStroke} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points={`${x - 26},${y - 22} ${x - 26},${y + 22} ${x + 10},${y}`} fill={symbolColor} stroke="none" />
      <line x1={x + 10} y1={y - 24} x2={x + 10} y2={y + 24} />
      <path d={`M ${x + 38} ${y - 36} L ${x + 62} ${y - 12} M ${x + 54} ${y - 12} L ${x + 64} ${y - 10} L ${x + 62} ${y - 20}`} />
      <path d={`M ${x + 28} ${y - 14} L ${x + 52} ${y + 10} M ${x + 44} ${y + 10} L ${x + 54} ${y + 12} L ${x + 52} ${y + 2}`} />
      <text x={x - 76} y={y + 18} textAnchor="middle" fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>D4</text>
      <text x={x - 76} y={y + 46} textAnchor="middle" fontSize={22} fontWeight={800} stroke="none" fill={labelColor}>LTL-307EE</text>
    </g>
  );
}

export default function LinearPowerSupply({
  className = "",
  inputOn = true,
  regulatorOn = true,
  ledOn = true,
  diodeFault = false,
  capacitorFault = false,
  regulatorFault = false,
  showLabels = true,
  showFlow = true,
  viewMode = "fit",
  highlightComponentKey = "regulator",
  flowStateLabel = "5V DC Output",
  componentStateBadges = [],
}: LinearPowerSupplyProps) {
  const rectifierState: WireState = inputOn && !diodeFault ? "active" : diodeFault ? "fault" : "inactive";
  const filterState: WireState = rectifierState === "active" && !capacitorFault ? "active" : capacitorFault ? "fault" : "inactive";
  const regulatedState: WireState = filterState === "active" && regulatorOn && !regulatorFault ? "active" : regulatorFault ? "fault" : "inactive";
  const ledState: WireState = regulatedState === "active" && ledOn ? "active" : "inactive";

  const topY = 96;
  const returnY = 304;
  const ctY = 164;
  const upperSecY = 88;
  const lowerSecY = 354;
  const bridgeX = 382;
  const filterX = 560;
  const regX = 750;
  const regY = 62;
  const resistorX = 1040;
  const ledX = 1140;
  const ledY = 202;

  const upperRectifierPath = `M 250 ${upperSecY} H 330 V ${topY} H ${bridgeX - 32} M ${bridgeX + 8} ${topY} H ${filterX}`;
  const lowerRectifierPath = `M 250 ${lowerSecY} H 330 V 360 H ${bridgeX - 32} M ${bridgeX + 8} 360 V ${returnY} H ${filterX}`;
  const dcPositivePath = `M ${filterX} ${topY} H ${regX}`;
  const regulatorOutPath = `M ${regX + 104} ${topY} H ${resistorX}`;
  const resistorToLedPath = `M ${resistorX + 82} ${topY} H 1148 V ${ledY - 22}`;
  const ledReturnPath = `M ${ledX + 10} ${ledY + 24} V ${returnY} H ${filterX}`;
  const returnBusPath = `M ${filterX} ${returnY} H 250 V ${ctY} H 188`;
  const regulatorGroundPath = `M ${regX + 52} ${regY + 88} V ${returnY}`;
  const capacitorPath = `M ${filterX} ${topY} V ${returnY}`;
  const fullOutputPath = `${regulatorOutPath} ${resistorToLedPath}`;
  const returnFlowPath = `M ${ledX + 10} ${ledY + 24} V ${returnY} H ${filterX} H 250 V ${ctY} H 188`;

  const badgeAnchors: Record<string, { x: number; y: number; width: number; height: number }> = {
    source: { x: 62, y: 50, width: 92, height: 28 },
    transformer: { x: 194, y: 214, width: 112, height: 28 },
    d2: { x: 372, y: 36, width: 84, height: 28 },
    d3: { x: 372, y: 316, width: 84, height: 28 },
    capacitor: { x: 590, y: 182, width: 104, height: 28 },
    regulator: { x: 770, y: 18, width: 112, height: 28 },
    resistor: { x: 1032, y: 146, width: 92, height: 28 },
    led: { x: 1060, y: 236, width: 112, height: 28 },
  };

  const toneStyles: Record<BadgeTone, { fill: string; stroke: string; text: string }> = {
    neutral: { fill: "#f8fbff", stroke: "#dbe3ee", text: "#335075" },
    active: { fill: "#f0fdf4", stroke: "#bbf7d0", text: "#166534" },
    fault: { fill: "#fef2f2", stroke: "#fecaca", text: "#b91c1c" },
  };

  return (
    <div className={`linear-power-supply-layout ${className}`}>
      <div className={`linear-power-supply-shell ${viewMode === "actual" ? "is-actual-scale" : ""}`}>
        <div className={`linear-power-supply-scroll ${viewMode === "actual" ? "is-scrollable" : ""}`}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="linear-power-supply-svg"
            style={viewMode === "actual" ? { width: `${width}px`, maxWidth: "none" } : undefined}
            role="img"
            aria-label="Linear 5V power supply circuit with transformer, rectifier, capacitor filter, 7805 regulator and LED load"
          >
            <defs>
              <filter id="electron-glow-linear-psu" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation={electronBlur} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${boardX}, ${boardY})`}>
              <BackgroundPixelGrid width={boardWidth} height={boardHeight} />

              <HighlightBox x={20} y={112} w={110} h={150} active={highlightComponentKey === "source"} />
              <HighlightBox x={132} y={78} w={138} h={300} active={highlightComponentKey === "transformer"} />
              <HighlightBox x={360} y={56} w={74} h={72} active={highlightComponentKey === "d2"} />
              <HighlightBox x={360} y={320} w={74} h={72} active={highlightComponentKey === "d3"} />
              <HighlightBox x={520} y={142} w={124} h={154} active={highlightComponentKey === "capacitor"} />
              <HighlightBox x={724} y={18} w={154} h={148} active={highlightComponentKey === "regulator"} />
              <HighlightBox x={1010} y={60} w={126} h={92} active={highlightComponentKey === "resistor"} />
              <HighlightBox x={1054} y={164} w={118} h={108} active={highlightComponentKey === "led"} />

              {componentStateBadges.map((badge) => {
                const anchor = badgeAnchors[badge.key];
                if (!anchor) return null;
                const tone = toneStyles[badge.tone];
                return (
                  <g key={`badge-${badge.key}`} transform={`translate(${anchor.x}, ${anchor.y})`}>
                    <rect width={anchor.width} height={anchor.height} rx={14} fill={tone.fill} stroke={tone.stroke} />
                    <text x={10} y={12} fontSize={8.5} fontWeight={800} fill={tone.text} letterSpacing="0.06em">
                      {badge.label}
                    </text>
                    <text x={10} y={22} fontSize={8.5} fontWeight={800} fill="#0f172a">
                      {badge.state}
                    </text>
                  </g>
                );
              })}

              <ActivePath d={upperRectifierPath} state={rectifierState} />
              <ActivePath d={lowerRectifierPath} state={rectifierState} />
              <ActivePath d={dcPositivePath} state={filterState} />
              <ActivePath d={capacitorPath} state={filterState} />
              <ActivePath d={regulatorGroundPath} state={regulatedState} />
              <ActivePath d={fullOutputPath} state={ledState} />
              <ActivePath d={ledReturnPath} state={ledState} />
              <ActivePath d={returnBusPath} state={filterState} />

              {showFlow ? (
                <>
                  <ElectronFlow path={upperRectifierPath} active={rectifierState === "active"} fault={rectifierState === "fault"} duration={2.2} />
                  <ElectronFlow path={lowerRectifierPath} active={rectifierState === "active"} fault={rectifierState === "fault"} duration={2.4} staggerOffset={0.18} />
                  <ElectronFlow path={dcPositivePath} active={filterState === "active"} fault={filterState === "fault"} duration={2.0} />
                  <ElectronFlow path={capacitorPath} active={filterState === "active"} fault={filterState === "fault"} duration={1.8} staggerOffset={0.12} />
                  <ElectronFlow path={fullOutputPath} active={ledState === "active"} duration={2.5} />
                  <ElectronFlow path={returnFlowPath} active={ledState === "active"} duration={3.0} staggerOffset={0.35} />
                </>
              ) : null}

              <Transformer x={160} y={238} />

              <line x1={268} y1={upperSecY} x2={330} y2={upperSecY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={330} y1={upperSecY} x2={330} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={330} y1={topY} x2={bridgeX - 32} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <Diode x={bridgeX - 32} y={topY} label="D2" part="1N4148" />
              <line x1={bridgeX + 8} y1={topY} x2={filterX} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              <line x1={268} y1={ctY} x2={330} y2={ctY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={330} y1={ctY} x2={330} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              <line x1={268} y1={lowerSecY} x2={330} y2={lowerSecY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={330} y1={lowerSecY} x2={330} y2={360} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={330} y1={360} x2={bridgeX - 32} y2={360} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <Diode x={bridgeX - 32} y={360} label="D3" part="1N4148" />
              <line x1={bridgeX + 8} y1={360} x2={bridgeX + 8} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={bridgeX + 8} y1={returnY} x2={filterX} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              <line x1={330} y1={returnY} x2={520} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <path d={`M 520 ${returnY} C 512 ${returnY}, 512 ${returnY - 20}, 520 ${returnY - 20}`} stroke={symbolColor} strokeWidth={symbolStroke} fill="none" />
              <line x1={520} y1={returnY - 20} x2={520} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              <Junction x={520} y={topY} />
              <Junction x={filterX} y={topY} />
              <Junction x={filterX} y={returnY} />

              <Capacitor x={filterX} topY={topY} bottomY={returnY} />

              <line x1={filterX} y1={topY} x2={regX} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <Regulator7805 x={regX} y={regY} />
              <line x1={regX + 52} y1={regY + 88} x2={regX + 52} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <Junction x={regX + 52} y={returnY} />
              <line x1={regX + 104} y1={topY} x2={resistorX} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              <Resistor x={resistorX} y={topY} />
              <line x1={resistorX + 82} y1={topY} x2={1148} y2={topY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={1148} y1={topY} x2={1148} y2={ledY - 22} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <Led x={ledX} y={ledY} />
              <line x1={ledX + 10} y1={ledY + 24} x2={ledX + 10} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />
              <line x1={ledX + 10} y1={returnY} x2={filterX} y2={returnY} stroke={wireColor} strokeWidth={wireStroke} strokeLinecap="round" />

              {showLabels ? (
                <text x={regX + 68} y={returnY + 36} fontSize={13} fontWeight={800} fill={labelColor}>
                  {flowStateLabel}
                </text>
              ) : null}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
