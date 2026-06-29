"use client";

import BackgroundPixelGred from "../../../../library/background_pixel_gred";
import DiodeZenerSymbol from "../../../../library/electronics-symbol-library/diodes/DiodeZenerSymbol";
import ResistorSymbol from "../../../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../../../library/electronics-symbol-library/sources/BatterySymbol";
import VoltmeterSymbol from "../../../../library/meters/VoltmeterSymbol";

import type {
  FlowMode,
  ZenerBiasMode,
  ZenerBreakdownState,
} from "./zenerBreakdownTypes";

type Offset = {
  x: number;
  y: number;
};

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const VIEW_BOX = {
  width: 980,
  height: 470,
} as const;

const COMPONENT_OFFSET = {
  battery: { x: 0, y: 0 },
  resistor: { x: 0, y: 0 },
  zener: { x: -110, y: 80 },
  voltmeter: { x: -130, y: 40 },
  sourceLabel: { x: 0, y: 0 },
  zenerLabel: { x: -190, y: 40 },
  outputLabel: { x: -90, y: 50 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  topRail: { x: 0, y: 0 },
  bottomRail: { x: 0, y: 0 },
  rightRail: { x: 0, y: 0 },
  leftRail: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  batteryPositive: { x: 17, y: 20 },
  batteryNegative: { x: 17, y: -30 },
  resistorLeft: { x: 10, y: 0 },
  resistorRight: { x: -10, y: 0 },
  zenerTop: { x: -48, y: -40 },
  zenerBottom: { x: -48, y: -60 },
  voltmeterTop: { x: 0, y: 10 },
  voltmeterBottom: { x: 0, y: -10 },
} as const satisfies Record<string, Offset>;

const BASE_COMPONENT = {
  battery: { x: 44, y: 182, width: 108, height: 140 },
  resistor: { x: 286, y: 86, width: 174, height: 92 },
  zener: { x: 596, y: 144, width: 128, height: 224 },
  voltmeter: { x: 822, y: 136, width: 86, height: 150 },
} as const;

const COMPONENT = {
  battery: {
    ...BASE_COMPONENT.battery,
    x: BASE_COMPONENT.battery.x + COMPONENT_OFFSET.battery.x,
    y: BASE_COMPONENT.battery.y + COMPONENT_OFFSET.battery.y,
  },
  resistor: {
    ...BASE_COMPONENT.resistor,
    x: BASE_COMPONENT.resistor.x + COMPONENT_OFFSET.resistor.x,
    y: BASE_COMPONENT.resistor.y + COMPONENT_OFFSET.resistor.y,
  },
  zener: {
    ...BASE_COMPONENT.zener,
    x: BASE_COMPONENT.zener.x + COMPONENT_OFFSET.zener.x,
    y: BASE_COMPONENT.zener.y + COMPONENT_OFFSET.zener.y,
  },
  voltmeter: {
    ...BASE_COMPONENT.voltmeter,
    x: BASE_COMPONENT.voltmeter.x + COMPONENT_OFFSET.voltmeter.x,
    y: BASE_COMPONENT.voltmeter.y + COMPONENT_OFFSET.voltmeter.y,
  },
} as const;

const LABEL = {
  batteryTitle: { x: 108, y: 214 },
  batteryValue: { x: 108, y: 248 },
  resistorName: { x: 374, y: 70 },
  resistorValue: { x: 374, y: 109 },
  zenerCaption: { x: 548, y: 196 },
  zenerName: { x: 724, y: 194 },
  zenerValue: { x: 724, y: 234 },
  outputValue: { x: 910, y: 196 },
  voltmeterLabel: { x: 865, y: 306 },
  sourcePolarity: { x: 74, y: 170 },
  outputPolarity: { x: 920, y: 170 },
} as const;

const SCHEMATIC = {
  topY: 74 + WIRE_OFFSET.topRail.y,
  bottomY: 394 + WIRE_OFFSET.bottomRail.y,
  leftX: 36 + WIRE_OFFSET.leftRail.x,
  rightX: 930 + WIRE_OFFSET.rightRail.x,
} as const;

const NODE = {
  batteryPositive: {
    x: COMPONENT.battery.x + 38 + DEBUG_TERMINAL_OFFSET.batteryPositive.x,
    y: COMPONENT.battery.y + 10 + DEBUG_TERMINAL_OFFSET.batteryPositive.y,
  },
  batteryNegative: {
    x: COMPONENT.battery.x + 38 + DEBUG_TERMINAL_OFFSET.batteryNegative.x,
    y:
      COMPONENT.battery.y +
      COMPONENT.battery.height -
      10 +
      DEBUG_TERMINAL_OFFSET.batteryNegative.y,
  },
  resistorLeft: {
    x: COMPONENT.resistor.x + 18 + DEBUG_TERMINAL_OFFSET.resistorLeft.x,
    y:
      COMPONENT.resistor.y +
      COMPONENT.resistor.height / 2 +
      DEBUG_TERMINAL_OFFSET.resistorLeft.y,
  },
  resistorRight: {
    x:
      COMPONENT.resistor.x +
      COMPONENT.resistor.width -
      18 +
      DEBUG_TERMINAL_OFFSET.resistorRight.x,
    y:
      COMPONENT.resistor.y +
      COMPONENT.resistor.height / 2 +
      DEBUG_TERMINAL_OFFSET.resistorRight.y,
  },
  zenerTop: {
    x:
      COMPONENT.zener.x +
      COMPONENT.zener.width / 2 +
      DEBUG_TERMINAL_OFFSET.zenerTop.x,
    y: COMPONENT.zener.y + 20 + DEBUG_TERMINAL_OFFSET.zenerTop.y,
  },
  zenerBottom: {
    x:
      COMPONENT.zener.x +
      COMPONENT.zener.width / 2 +
      DEBUG_TERMINAL_OFFSET.zenerBottom.x,
    y:
      COMPONENT.zener.y +
      COMPONENT.zener.height -
      20 +
      DEBUG_TERMINAL_OFFSET.zenerBottom.y,
  },
  voltmeterTop: {
    x:
      COMPONENT.voltmeter.x +
      COMPONENT.voltmeter.width / 2 +
      DEBUG_TERMINAL_OFFSET.voltmeterTop.x,
    y: COMPONENT.voltmeter.y + 10 + DEBUG_TERMINAL_OFFSET.voltmeterTop.y,
  },
  voltmeterBottom: {
    x:
      COMPONENT.voltmeter.x +
      COMPONENT.voltmeter.width / 2 +
      DEBUG_TERMINAL_OFFSET.voltmeterBottom.x,
    y:
      COMPONENT.voltmeter.y +
      COMPONENT.voltmeter.height -
      10 +
      DEBUG_TERMINAL_OFFSET.voltmeterBottom.y,
  },
  topJunction: {
    x: COMPONENT.zener.x + 2,
    y: SCHEMATIC.topY,
  },
  bottomJunction: {
    x: COMPONENT.zener.x + 2,
    y: SCHEMATIC.bottomY,
  },
  topRightCorner: {
    x: SCHEMATIC.rightX,
    y: SCHEMATIC.topY,
  },
  bottomRightCorner: {
    x: SCHEMATIC.rightX,
    y: SCHEMATIC.bottomY,
  },
  topLeftCorner: {
    x: SCHEMATIC.leftX,
    y: SCHEMATIC.topY,
  },
  bottomLeftCorner: {
    x: SCHEMATIC.leftX,
    y: SCHEMATIC.bottomY,
  },
} as const;

const WIRE_STYLE = {
  rail: "#1d4ed8",
  branch: "#dc2626",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const FLOW_STYLE = {
  conventional: {
    color: "#f59e0b",
    glow: "#fcd34d",
  },
  electron: {
    color: "#2563eb",
    glow: "#93c5fd",
  },
} as const;

function DebugDot({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="5" fill="#ef4444" />
      <text x={x + 8} y={y - 8} fontSize="12" fontWeight="700" fill="#ef4444">
        {label}
      </text>
    </g>
  );
}

function linePath(...points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function reversePath(points: Array<{ x: number; y: number }>) {
  return [...points].reverse();
}

function FlowDots({
  active,
  color,
  duration,
  path,
}: {
  active: boolean;
  color: string;
  duration: number;
  path: string;
}) {
  if (!active) return null;

  return (
    <>
      {[0, 0.9, 1.8, 2.7].map((delay, index) => (
        <circle key={index} r="4.5" fill={color} opacity="0.95">
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ))}
    </>
  );
}

const SHOW_DEBUG_TERMINAL_DOTS = true;

export default function ZenerBreakdownCanvas({
  biasMode,
  flowMode,
  state,
  supplyVoltage,
  zenerVoltage,
}: {
  biasMode: ZenerBiasMode;
  flowMode: FlowMode;
  state: ZenerBreakdownState;
  supplyVoltage: number;
  zenerVoltage: number;
}) {
  const currentLoopPoints = [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.resistorLeft.y },
    NODE.resistorLeft,
    NODE.resistorRight,
    { x: NODE.zenerTop.x, y: NODE.resistorRight.y },
    NODE.zenerTop,
    NODE.zenerBottom,
    { x: NODE.batteryNegative.x, y: NODE.zenerBottom.y },
    NODE.batteryNegative,
  ];

  const conventionalFlowPath = linePath(...currentLoopPoints);
  const electronFlowPath = linePath(...reversePath(currentLoopPoints));
  const flowPath =
    flowMode === "electron" ? electronFlowPath : conventionalFlowPath;
  const flowColor =
    flowMode === "electron"
      ? FLOW_STYLE.electron.color
      : FLOW_STYLE.conventional.color;
  const flowGlow =
    flowMode === "electron"
      ? FLOW_STYLE.electron.glow
      : FLOW_STYLE.conventional.glow;
  const isCurrentActive = state.active || state.seriesCurrentMA > 0.15;
  const flowDuration = flowMode === "electron" ? 3.8 : 3.2;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-700">
            Simulation Canvas
          </p>
          <h3 className="text-2xl font-black text-slate-950">
            Zener Regulator Circuit
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            The circuit now shows the real shunt regulator path so reverse
            breakdown and forward clamp behavior can be compared from one
            layout.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
            state.active
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {state.regulationStatus}
        </span>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
        <div
          className="relative mx-auto w-full"
          style={{
            aspectRatio: `${VIEW_BOX.width} / ${VIEW_BOX.height}`,
            maxWidth: `${VIEW_BOX.width}px`,
            transform: `scale(${CIRCUIT_CANVAS_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Zener diode regulator component placement"
          >
            <BackgroundPixelGred
              width={VIEW_BOX.width}
              height={VIEW_BOX.height}
              minor={20}
              major={100}
              backgroundColor="#ffffff"
              minorStroke="#e8eef7"
              majorStroke="#cdd9ea"
              showLabels
              showBorder
              borderColor="#d9e2ef"
            />

            <defs>
              <filter
                id="zenerFlowGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={linePath(
                NODE.batteryPositive,
                { x: NODE.batteryPositive.x, y: NODE.resistorLeft.y },
                NODE.resistorLeft,
              )}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePath(
                NODE.resistorRight,
                { x: NODE.zenerTop.x, y: NODE.resistorRight.y },
                { x: NODE.voltmeterTop.x, y: NODE.resistorRight.y },
              )}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePath(
                { x: NODE.zenerTop.x, y: NODE.resistorRight.y },
                NODE.zenerTop,
              )}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePath(
                { x: NODE.voltmeterTop.x, y: NODE.resistorRight.y },
                NODE.voltmeterTop,
              )}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePath(NODE.zenerBottom, {
                x: NODE.zenerBottom.x,
                y: NODE.voltmeterBottom.y,
              })}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePath(
                NODE.voltmeterBottom,
                { x: NODE.voltmeterBottom.x, y: NODE.zenerBottom.y },
                { x: NODE.batteryNegative.x, y: NODE.zenerBottom.y },
                NODE.batteryNegative,
              )}
              fill="none"
              stroke="#111111"
              strokeWidth={WIRE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g filter="url(#zenerFlowGlow)">
              <FlowDots
                active={isCurrentActive}
                color={flowGlow}
                duration={flowDuration}
                path={flowPath}
              />
              <FlowDots
                active={isCurrentActive}
                color={flowColor}
                duration={flowDuration}
                path={flowPath}
              />
            </g>

            <text
              x={LABEL.batteryTitle.x + COMPONENT_OFFSET.sourceLabel.x}
              y={LABEL.batteryTitle.y + COMPONENT_OFFSET.sourceLabel.y}
              textAnchor="start"
              fontSize="22"
              fontWeight="800"
              fill="#7f1d1d"
            >
              BT1
            </text>
            <text
              x={LABEL.batteryValue.x + COMPONENT_OFFSET.sourceLabel.x}
              y={LABEL.batteryValue.y + COMPONENT_OFFSET.sourceLabel.y}
              textAnchor="start"
              fontSize="22"
              fontWeight="700"
              fill="#7f1d1d"
            >
              Battery {supplyVoltage.toFixed(1)}V
            </text>

            <text
              x={LABEL.resistorName.x}
              y={LABEL.resistorName.y}
              textAnchor="middle"
              fontSize="24"
              fontWeight="800"
              fill="#7f1d1d"
            >
              33Ω
            </text>
            <text
              x={LABEL.resistorValue.x}
              y={LABEL.resistorValue.y}
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill="#1d4ed8"
            >
              Rs
            </text>

            <text
              x={LABEL.zenerCaption.x + COMPONENT_OFFSET.zenerLabel.x}
              y={LABEL.zenerCaption.y + COMPONENT_OFFSET.zenerLabel.y}
              textAnchor="end"
              fontSize="20"
              fontStyle="italic"
              fontWeight="700"
              fill="#1d4ed8"
            >
              {/* zener diode */}
            </text>
            <text
              x={LABEL.zenerName.x + COMPONENT_OFFSET.zenerLabel.x}
              y={LABEL.zenerName.y + COMPONENT_OFFSET.zenerLabel.y}
              textAnchor="start"
              fontSize="22"
              fontWeight="800"
              fill="#7f1d1d"
            >
              Z1
            </text>
            <text
              x={LABEL.zenerValue.x + COMPONENT_OFFSET.zenerLabel.x}
              y={LABEL.zenerValue.y + COMPONENT_OFFSET.zenerLabel.y}
              textAnchor="start"
              fontSize="26"
              fontWeight="700"
              fill="#7f1d1d"
            >
              {zenerVoltage.toFixed(1)}V / 1W
            </text>

            <text
              x={LABEL.outputPolarity.x + COMPONENT_OFFSET.outputLabel.x}
              y={LABEL.outputPolarity.y + COMPONENT_OFFSET.outputLabel.y}
              textAnchor="middle"
              fontSize="34"
              fontWeight="900"
              fill="#1d4ed8"
            >
              +
            </text>
            <text
              x={LABEL.outputValue.x + COMPONENT_OFFSET.outputLabel.x}
              y={LABEL.outputValue.y + COMPONENT_OFFSET.outputLabel.y}
              textAnchor="middle"
              fontSize="28"
              fontWeight="800"
              fill="#1d4ed8"
            >
              {state.outputVoltage.toFixed(2)}V
            </text>

            {SHOW_DEBUG_TERMINAL_DOTS ? (
              <>
                <DebugDot
                  x={NODE.batteryPositive.x}
                  y={NODE.batteryPositive.y}
                  label="BAT+"
                />
                <DebugDot
                  x={NODE.batteryNegative.x}
                  y={NODE.batteryNegative.y}
                  label="BAT-"
                />
                <DebugDot
                  x={NODE.resistorLeft.x}
                  y={NODE.resistorLeft.y}
                  label="RS-L"
                />
                <DebugDot
                  x={NODE.resistorRight.x}
                  y={NODE.resistorRight.y}
                  label="RS-R"
                />
                <DebugDot x={NODE.zenerTop.x} y={NODE.zenerTop.y} label="Z-T" />
                <DebugDot
                  x={NODE.zenerBottom.x}
                  y={NODE.zenerBottom.y}
                  label="Z-B"
                />
                <DebugDot
                  x={NODE.voltmeterTop.x}
                  y={NODE.voltmeterTop.y}
                  label="VM+"
                />
                <DebugDot
                  x={NODE.voltmeterBottom.x}
                  y={NODE.voltmeterBottom.y}
                  label="VM-"
                />
              </>
            ) : null}
          </svg>

          <div
            className="absolute"
            style={{
              left: COMPONENT.battery.x,
              top: COMPONENT.battery.y,
              width: COMPONENT.battery.width,
              height: COMPONENT.battery.height,
            }}
          >
            <BatterySymbol
              width={COMPONENT.battery.width}
              height={COMPONENT.battery.height}
            />
          </div>

          <div
            className="absolute"
            style={{
              left: COMPONENT.resistor.x,
              top: COMPONENT.resistor.y,
              width: COMPONENT.resistor.width,
              height: COMPONENT.resistor.height,
              transform: `scale(${CIRCUIT_COMPONENT_SCALE})`,
              transformOrigin: "center",
            }}
          >
            <ResistorSymbol
              width={COMPONENT.resistor.width}
              height={COMPONENT.resistor.height}
              showTerminalLabels={false}
            />
          </div>

          <div
            className="absolute"
            style={{
              left: COMPONENT.zener.x,
              top: COMPONENT.zener.y,
              width: COMPONENT.zener.width,
              height: COMPONENT.zener.height,
              transform: `rotate(-90deg) scale(${CIRCUIT_COMPONENT_SCALE})`,
              transformOrigin: "center",
            }}
          >
            <DiodeZenerSymbol
              width={COMPONENT.zener.height}
              height={COMPONENT.zener.width}
              label="Zener diode"
            />
          </div>

          <div
            className="absolute"
            style={{
              left: COMPONENT.voltmeter.x,
              top: COMPONENT.voltmeter.y,
              width: COMPONENT.voltmeter.width,
              height: COMPONENT.voltmeter.height,
              transform: `scale(${CIRCUIT_COMPONENT_SCALE})`,
              transformOrigin: "center",
            }}
          >
            <VoltmeterSymbol
              width={COMPONENT.voltmeter.width}
              height={COMPONENT.voltmeter.height}
              label="Output voltmeter"
            />
          </div>

          <div
            className="pointer-events-none absolute text-center text-sm font-bold text-slate-700"
            style={{
              left: LABEL.voltmeterLabel.x - 60,
              top: LABEL.voltmeterLabel.y,
              width: 120,
            }}
          >
            Voltmeter
          </div>

          <div className="pointer-events-none absolute right-6 top-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
              Placement Status
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900">
              {biasMode === "reverse" ? "Reverse bias" : "Forward bias"} |{" "}
              {flowMode === "electron" ? "Electron flow" : "Conventional flow"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Source Block
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            Battery source drives the regulator through the series path
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Series Element
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            Rs limits branch current before the output node
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Clamp Element
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            {biasMode === "reverse"
              ? "Zener branch clamps the node once output reaches the selected Vz"
              : "Forward-biased zener branch acts like a normal diode clamp near 0.72V"}
          </div>
        </div>
      </div>
    </section>
  );
}
