"use client";

import React from "react";

import {
  BODY_PARTICLES,
  COMPONENT,
  ELECTRONS,
  LABEL,
  MAIN,
  MOSFET_LOGIC,
  NODE,
  PATH,
  SLIDER,
  WIRE,
} from "./enhancementMosfetConstants";
import { clamp, getStateColor, getThermalColor } from "./enhancementMosfetLogic";
import type { FlowMode, LearningMode, RegionState } from "./enhancementMosfetTypes";

type PanelProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
};

export function SvgPanel({ x, y, width, height, rx }: PanelProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      fill={COMPONENT.panel}
      stroke={COMPONENT.panelStroke}
      strokeWidth={3}
    />
  );
}

export function Meter({
  cx,
  cy,
  label,
  color,
}: {
  cx: number;
  cy: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={29} fill="#fff" stroke={color} strokeWidth={4} />
      <text x={cx - 13} y={cy + 11} fontSize={LABEL.meterSize} fontFamily={LABEL.fontFamily} fill={color}>
        {label}
      </text>
    </g>
  );
}

function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={WIRE.color} strokeWidth={WIRE.width} strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + 30} />
      <line x1={x - 30} y1={y + 30} x2={x + 30} y2={y + 30} />
      <line x1={x - 20} y1={y + 45} x2={x + 20} y2={y + 45} />
      <line x1={x - 10} y1={y + 60} x2={x + 10} y2={y + 60} />
    </g>
  );
}

export function ActiveWire({
  d,
  active,
  strength,
  color,
}: {
  d: string;
  active: boolean;
  strength: number;
  color: string;
}) {
  return (
    <path
      d={d}
      stroke={active ? color : WIRE.color}
      strokeWidth={active ? WIRE.active : WIRE.width}
      opacity={active ? 0.35 + strength * 0.65 : 1}
      fill="none"
      strokeLinecap="round"
      style={{ transition: "stroke 250ms ease, opacity 250ms ease, stroke-width 250ms ease" }}
    />
  );
}

export function IndustrialSlider({
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
  onChange: (value: number) => void;
}) {
  const railW = 300;
  const knobX = x + ((value - min) / (max - min)) * railW;

  return (
    <g>
      <text x={x} y={y - 8} fontSize={LABEL.small} fontFamily={LABEL.fontFamily} fill={COMPONENT.black}>
        {label}: {value.toFixed(step < 1 ? 1 : 0)}
        {unit}
      </text>
      <line x1={x} y1={y + 12} x2={x + railW} y2={y + 12} stroke="#cfcfcf" strokeWidth={6} strokeLinecap="round" />
      <line x1={x} y1={y + 12} x2={knobX} y2={y + 12} stroke={COMPONENT.blue} strokeWidth={6} strokeLinecap="round" />
      <circle cx={knobX} cy={y + 12} r={11} fill="#3d7fe8" stroke={COMPONENT.blueStroke} strokeWidth={3} />
      <foreignObject x={x - 8} y={y - 5} width={railW + 18} height={35}>
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

export function SelectBox({
  x,
  y,
  label,
  value,
  options,
  onChange,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: any) => void;
}) {
  return (
    <foreignObject x={x} y={y} width={170} height={42}>
      <label className="block text-[11px] font-medium text-gray-900">
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-6 w-full rounded border border-gray-300 bg-white px-1 text-[11px]"
        >
          {options.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </foreignObject>
  );
}

export function TopGateSlider({
  gateVoltage,
  thresholdVoltage,
  regionState,
  onChange,
}: {
  gateVoltage: number;
  thresholdVoltage: number;
  regionState: RegionState;
  onChange: (value: number) => void;
}) {
  const railLength = SLIDER.rail.x2 - SLIDER.rail.x1;
  const knobCx = SLIDER.rail.x1 + (gateVoltage / MOSFET_LOGIC.maxGateVoltage) * railLength;
  const thresholdX =
    SLIDER.rail.x1 +
    (thresholdVoltage / MOSFET_LOGIC.maxGateVoltage) * railLength;

  return (
    <g>
      <rect {...SLIDER.panel} fill="#fff" stroke={COMPONENT.lightGray} strokeWidth={3} />
      <circle {...SLIDER.minus} fill="#fff" stroke={COMPONENT.blueStroke} strokeWidth={4} />
      <text x="398" y="103" fontSize="40" fill={COMPONENT.blueStroke}>
        -
      </text>

      <line {...SLIDER.rail} stroke={COMPONENT.gray} strokeWidth={WIRE.thick} strokeLinecap="round" />
      <line
        x1={SLIDER.rail.x1}
        y1={SLIDER.rail.y1}
        x2={knobCx}
        y2={SLIDER.rail.y1}
        stroke={getStateColor(regionState)}
        strokeWidth={WIRE.thick}
        strokeLinecap="round"
      />
      <line x1={thresholdX} y1="72" x2={thresholdX} y2="108" stroke={COMPONENT.red} strokeWidth={3} strokeLinecap="round" />
      <circle cx={knobCx} cy={SLIDER.knob.cy} r={SLIDER.knob.r} fill="#3d7fe8" stroke={COMPONENT.blueStroke} strokeWidth={3} />

      <circle {...SLIDER.plus} fill="#fff" stroke={COMPONENT.red} strokeWidth={4} />
      <text x="717" y="104" fontSize="40" fill={COMPONENT.red}>
        +
      </text>

      <text x={SLIDER.vgs.x} y={SLIDER.vgs.y} fontSize="18" fontFamily={LABEL.fontFamily} fill={getStateColor(regionState)}>
        VGS {gateVoltage.toFixed(1)}V
      </text>

      <foreignObject x="448" y="68" width="245" height="45">
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={gateVoltage}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-10 w-full cursor-pointer opacity-0"
        />
      </foreignObject>
    </g>
  );
}

function ElectricFieldLines({
  strength,
  gateVoltage,
}: {
  strength: number;
  gateVoltage: number;
}) {
  const fieldDensity = Math.round((gateVoltage / MOSFET_LOGIC.maxGateVoltage) * 11);

  return (
    <g opacity={0.15 + gateVoltage * 0.075}>
      {Array.from({ length: fieldDensity }).map((_, i) => {
        const x = 350 + i * 45;
        return (
          <path
            key={i}
            d={`M${x} 335 C${x - 14} 352 ${x - 10} 374 ${x} 398`}
            stroke={COMPONENT.red}
            strokeWidth={1.2 + strength * 2.2}
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#fieldArrow)"
            style={{
              animationName: "fieldPulse",
              animationDuration: `${1.4 - strength * 0.5}s`,
              animationTimingFunction: "ease-in-out",
              animationDelay: `${i * 0.08}s`,
              animationIterationCount: "infinite",
            }}
          />
        );
      })}
    </g>
  );
}

function DensityMap({ strength }: { strength: number }) {
  if (strength <= 0.01) return null;

  return (
    <g opacity={0.15 + strength * 0.75}>
      {Array.from({ length: 34 }).map((_, i) => {
        const x = 365 + (i % 17) * 27;
        const y = 365 + Math.floor(i / 17) * 23;
        return <circle key={i} cx={x} cy={y} r={2 + strength * 3} fill={COMPONENT.blue} />;
      })}
    </g>
  );
}

function StageChannel({
  regionState,
  channelStrength,
}: {
  regionState: RegionState;
  channelStrength: number;
}) {
  const common = {
    d: PATH.channel,
    fill: COMPONENT.channel,
    stroke: COMPONENT.channelStroke,
    style: { transition: "opacity 350ms ease, stroke-width 350ms ease" },
  };

  if (regionState === "OFF") return null;

  if (regionState === "THRESHOLD") {
    return <path {...common} strokeWidth={2} opacity={0.28} strokeDasharray="10 10" />;
  }

  if (regionState === "CHANNEL FORMATION") {
    return (
      <path
        {...common}
        strokeWidth={2.5 + channelStrength * 3}
        opacity={0.35 + channelStrength * 0.4}
      />
    );
  }

  return (
    <path
      {...common}
      strokeWidth={3.5 + channelStrength * 6}
      opacity={0.4 + channelStrength * 0.6}
    />
  );
}

function SvgLabels({ advanced }: { advanced: boolean }) {
  return (
    <g fontFamily={LABEL.fontFamily} fontSize="13" fill="#111827">
      <text x="195" y="302">Source</text>
      <text x="525" y="286">Gate</text>
      <text x="1000" y="302">Drain</text>
      {advanced ? (
        <>
          <text x="515" y="350" fill={COMPONENT.oxideStroke}>
            Oxide
          </text>
          <text x="520" y="575">P-substrate</text>
          <text x="500" y="425" fill={COMPONENT.channelStroke}>
            Inversion channel
          </text>
        </>
      ) : null}
    </g>
  );
}

function FlowParticles({
  strength,
  isRunning,
  flowMode,
  conventional = false,
}: {
  strength: number;
  isRunning: boolean;
  flowMode: FlowMode;
  conventional?: boolean;
}) {
  const allowed =
    flowMode === "Both" || flowMode === (conventional ? "Conventional" : "Electron");
  const active = strength > 0.03 && allowed;
  const duration = `${2.2 - strength * 1.25}s`;
  const opacity = active ? 0.2 + strength * 0.8 : 0;

  const data = conventional
    ? [[790, 412], [710, 418], [630, 415], [550, 420], [470, 414], [390, 418]]
    : ELECTRONS;

  return (
    <g>
      {data.map(([x, y], index) => (
        <line
          key={`${conventional ? "c" : "e"}-${index}`}
          x1={x}
          y1={y}
          x2={x + (conventional ? -12 : 12)}
          y2={y}
          stroke={conventional ? COMPONENT.orange : COMPONENT.blue}
          strokeWidth={conventional ? 2.5 : 3}
          strokeLinecap="round"
          opacity={opacity}
          markerEnd={conventional ? "url(#currentArrow)" : "url(#electronArrow)"}
          style={{
            animationName:
              isRunning && active
                ? conventional
                  ? "currentFlowDrainToSource"
                  : "electronFlowSourceToDrain"
                : "none",
            animationDuration: isRunning && active ? duration : undefined,
            animationTimingFunction: isRunning && active ? "linear" : undefined,
            animationDelay: isRunning && active ? `${index * 0.08}s` : undefined,
            animationIterationCount: isRunning && active ? "infinite" : undefined,
          }}
        />
      ))}
    </g>
  );
}

export function MainMosfetStructure({
  channelStrength,
  regionState,
  gateVoltage,
  junctionTemp,
  power,
  flowMode,
  isRunning,
  learningMode,
}: {
  channelStrength: number;
  regionState: RegionState;
  gateVoltage: number;
  junctionTemp: number;
  power: number;
  flowMode: FlowMode;
  isRunning: boolean;
  learningMode: LearningMode;
}) {
  const isSaturation = regionState === "SATURATION REGION";
  const pinchOpacity = isSaturation ? 0.3 + channelStrength * 0.7 : 0;
  const thermalColor = getThermalColor(junctionTemp);

  return (
    <g>
      <rect {...PATH.body} fill={COMPONENT.semiconductor} stroke={COMPONENT.black} strokeWidth={4} />
      <path d={PATH.sourceRegion} fill={COMPONENT.nRegion} stroke={COMPONENT.nRegionStroke} strokeWidth={2} />
      <path d={PATH.drainRegion} fill={COMPONENT.nRegion} stroke={COMPONENT.nRegionStroke} strokeWidth={2} />

      <text x="230" y="385" fontSize={LABEL.regionSize} fill="#156b20">
        N+
      </text>
      <text x="907" y="385" fontSize={LABEL.regionSize} fill="#156b20">
        N+
      </text>

      <rect {...MAIN.oxide} fill={COMPONENT.oxide} stroke={COMPONENT.oxideStroke} strokeWidth={2} />
      <rect {...MAIN.gate} fill={COMPONENT.dark} stroke={COMPONENT.black} strokeWidth={3} />
      <rect {...MAIN.gatePin} fill={COMPONENT.black} />

      <rect {...MAIN.sourceTerminal} rx={3} fill={COMPONENT.black} />
      <rect {...MAIN.drainTerminal} rx={3} fill={COMPONENT.black} />

      <g opacity={clamp(power * 12, 0.04, 0.75)}>
        <circle cx="760" cy="380" r={28 + power * 120} fill={thermalColor} />
        <circle cx="760" cy="380" r={12 + power * 50} fill={thermalColor} opacity="0.8" />
      </g>

      <ElectricFieldLines strength={channelStrength} gateVoltage={gateVoltage} />
      <StageChannel regionState={regionState} channelStrength={channelStrength} />

      {learningMode === "Advanced" ? <DensityMap strength={channelStrength} /> : null}

      <path
        d={PATH.pinchOff}
        fill={COMPONENT.semiconductor}
        stroke={COMPONENT.red}
        strokeWidth={3 + channelStrength * 2}
        opacity={pinchOpacity}
        style={{ transition: "opacity 350ms ease" }}
      />

      <FlowParticles strength={channelStrength} isRunning={isRunning} flowMode={flowMode} />
      <FlowParticles strength={channelStrength} isRunning={isRunning} flowMode={flowMode} conventional />

      {BODY_PARTICLES.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={NODE.small} fill="#fff5dd" stroke={COMPONENT.gray} strokeWidth={3} opacity={0.55 + channelStrength * 0.3} />
      ))}

      <SvgLabels advanced={learningMode === "Advanced"} />

      <path d="M225 550 l20 -25" stroke={COMPONENT.black} strokeWidth={4} markerEnd="url(#arrow)" />
      <rect x={PATH.body.x} y={600} width={PATH.body.width} height={20} fill={COMPONENT.metal} />
      <Ground {...MAIN.ground} />
    </g>
  );
}

export function EnhancementMosfetSvgDefinitions() {
  return (
    <>
      <style>{`
        @keyframes electronFlowSourceToDrain {
          0% { transform: translateX(-40px); }
          100% { transform: translateX(95px); }
        }
        @keyframes currentFlowDrainToSource {
          0% { transform: translateX(45px); }
          100% { transform: translateX(-95px); }
        }
        @keyframes fieldPulse {
          0%,100% { opacity: .35; }
          50% { opacity: 1; }
        }
      `}</style>

      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 Z" fill={COMPONENT.black} />
        </marker>
        <marker id="electronArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.blue} />
        </marker>
        <marker id="currentArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.orange} />
        </marker>
        <marker id="fieldArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.red} />
        </marker>
      </defs>
    </>
  );
}
