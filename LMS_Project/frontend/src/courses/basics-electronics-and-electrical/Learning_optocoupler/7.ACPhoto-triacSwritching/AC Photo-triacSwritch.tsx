"use client";

import * as React from "react";
import {
  ACPhotoTriacSwitchingControlPanel,
  ACPhotoTriacSwitchingPreview,
  toTimelineStep,
  type ControlMode,
} from "./ACPhotoTriacSwitchingControlPanel";

type CircuitProps = {
  title?: string;
  className?: string;
  showControls?: boolean;
};

type CircuitSvgProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  inputActive: boolean;
  triggerActive: boolean;
  loadActive: boolean;
};

const ADJUST = {
  photoTriac: {
    x: 690,
    y: 350,
    scale: 1.5,
  },

  opticalArrow: {
    startX: 660,
    endX: 700,
    y1: 410,
    y2: 437,
    strokeWidth: 1,
    headSize: 9,
  },

  bt136: {
    x: 1064,
    y: 350,
    scale: 1.5,
  },

  gateLabel: {
    x: 1018,
    y: 525,
  },

  bt136Label: {
    q1X: 1242,
    q1Y: 455,
    btX: 1220,
    btY: 495,
  },

  terminalLabel: {
    mt2X: 1210,
    mt2Y: 370,
    mt1X: 1210,
    mt1Y: 710,
  },

  pilotLight: {
    x: 1300,
    y: 105,
    scale: 1,
    labelX: 1200,
    labelY: 202,
    labelFontSize: 31,
  },

  acSource: {
    x: 1425,
    y: 452,
    scale: 1,
    terminalOffsetX: 10,
  },

  acText: {
    x: 1500,
    y1: 450,
    y2: 490,
    fontSize: 31,
  },

  outputRail: {
    bottomY: 742,
  },
};

function Resistor({
  x,
  y,
  label,
  value,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
}) {
  return (
    <g>
      <polyline
        points={`${x},${y} ${x + 10},${y - 25} ${x + 20},${y + 25} ${x + 30},${y - 25} ${x + 40},${y + 25} ${x + 50},${y - 25} ${x + 60},${y + 25} ${x + 70},${y}`}
        className="wire"
      />

      <text x={x + 28} y={y - 82} className="txt mid bold" textAnchor="middle">
        {label}
      </text>
      <text x={x + 35} y={y - 45} className="txt mid" textAnchor="middle">
        {value}
      </text>
    </g>
  );
}

function OpticalArrow({
  x1,
  x2,
  y,
  active,
  strokeWidth = 3,
  headSize = 9,
}: {
  x1: number;
  x2: number;
  y: number;
  active: boolean;
  strokeWidth?: number;
  headSize?: number;
}) {
  return (
    <g
      fill={active ? "#facc15" : "currentColor"}
      opacity={active ? 1 : 0.18}
      stroke={active ? "#facc15" : "currentColor"}
      strokeWidth={strokeWidth}
    >
      <line x1={x1} y1={y} x2={x2 - headSize} y2={y} strokeLinecap="square" />
      <polygon
        points={`
          ${x2},${y}
          ${x2 - headSize},${y - headSize / 2}
          ${x2 - headSize},${y + headSize / 2}
        `}
        stroke="none"
      />
    </g>
  );
}

function PhotoTriacSymbol({
  x,
  y,
  active,
  scale = 1,
}: {
  x: number;
  y: number;
  active: boolean;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {active && <circle cx="40" cy="55" r="54" fill="#fef3c7" opacity="0.6" />}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <line x1="40" y1="0" x2="40" y2="35" />
        <line x1="40" y1="75" x2="40" y2="110" />
        <line x1="12" y1="35" x2="68" y2="35" />
        <line x1="12" y1="75" x2="68" y2="75" />
      </g>

      <g fill={active ? "#f59e0b" : "currentColor"}>
        <polygon points="12,35 40,35 25,75" />
        <polygon points="40,75 55,35 68,75" />
      </g>
    </g>
  );
}

function BT136TriacSymbol({
  x,
  y,
  active,
  scale = 1,
}: {
  x: number;
  y: number;
  active: boolean;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {active && <circle cx="90" cy="76" r="72" fill="#dcfce7" opacity="0.62" />}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <line x1="90" y1="0" x2="90" y2="40" />
        <line x1="58" y1="40" x2="125" y2="40" />
        <line x1="90" y1="98" x2="90" y2="155" />
        <line x1="56" y1="98" x2="125" y2="98" />
        <polyline points="0,132 30,132 48,98 90,98" />
      </g>

      <g fill={active ? "#10b981" : "currentColor"}>
        <polygon points="66,55 90,55 78,98" />
        <polygon points="92,98 108,55 124,98" />
      </g>
    </g>
  );
}

function Battery5V() {
  return (
    <g>
      <text x="112" y="405" className="txt big">
        +
      </text>
      <text x="116" y="530" className="txt big">
        −
      </text>

      <text x="5" y="490" className="txt big">
        5V DC
      </text>

      <line x1="100" y1="225" x2="100" y2="450" className="wire" />
      <line x1="100" y1="520" x2="100" y2="715" className="wire" />

      <line x1="73" y1="450" x2="130" y2="450" className="wire" />
      <line x1="84" y1="470" x2="119" y2="470" className="wire" />
      <line x1="73" y1="492" x2="130" y2="492" className="wire" />
    </g>
  );
}

function PilotLight({
  x,
  y,
  scale,
  active,
}: {
  x: number;
  y: number;
  scale: number;
  active: boolean;
}) {
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {active && <circle cx="0" cy="0" r="76" fill="#bbf7d0" opacity="0.55" />}
        <circle
          cx="0"
          cy="0"
          r="52"
          fill={active ? "#dcfce7" : "white"}
          stroke="currentColor"
          strokeWidth="4"
        />

        <line x1="-37" y1="-37" x2="37" y2="37" className="wire" />
        <line x1="37" y1="-37" x2="-37" y2="37" className="wire" />

        <line x1="0" y1="-65" x2="0" y2="-81" className="wire" />
        <line x1="-44" y1="-50" x2="-54" y2="-65" className="wire" />
        <line x1="44" y1="-50" x2="56" y2="-65" className="wire" />
      </g>

      <text
        x={ADJUST.pilotLight.labelX}
        y={ADJUST.pilotLight.labelY}
        className="txt"
        fontSize={ADJUST.pilotLight.labelFontSize}
      >
        PILOT LIGHT
      </text>
    </g>
  );
}

function ACSource({
  x,
  y,
  scale,
}: {
  x: number;
  y: number;
  scale: number;
}) {
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <circle cx="0" cy="0" r="56" fill="white" stroke="currentColor" strokeWidth="4" />

        <path
          d="M-37 0 C-27 -37 -5 -37 3 0 C13 38 35 38 45 0"
          className="wire"
        />
      </g>

      <text
        x={ADJUST.acText.x}
        y={ADJUST.acText.y1}
        className="txt"
        fontSize={ADJUST.acText.fontSize}
      >
        110/220V AC
      </text>
      <text
        x={ADJUST.acText.x + 23}
        y={ADJUST.acText.y2}
        className="txt"
        fontSize={ADJUST.acText.fontSize}
      >
        50/60Hz
      </text>
    </g>
  );
}

function ActivePath({ d, color }: { d: string; color: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.42}
    />
  );
}

function CurrentDots({
  active,
  paths,
  color,
  duration = 1.9,
}: {
  active: boolean;
  paths: readonly string[];
  color: string;
  duration?: number;
}) {
  if (!active) return null;

  return (
    <g pointerEvents="none">
      {paths.map((path, pathIndex) =>
        Array.from({ length: 4 }).map((_, dotIndex) => (
          <circle
            key={`${pathIndex}-${dotIndex}`}
            r={7}
            fill={color}
            stroke="white"
            strokeWidth={3}
          >
            <animateMotion
              dur={`${duration}s`}
              path={path}
              begin={`${(dotIndex * duration) / 4 + pathIndex * 0.08}s`}
              repeatCount="indefinite"
              rotate="auto"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={`${duration}s`}
              begin={`${(dotIndex * duration) / 4 + pathIndex * 0.08}s`}
              repeatCount="indefinite"
            />
          </circle>
        )),
      )}
    </g>
  );
}

function MOC3063BT136CircuitSvg({
  title = "MOC3063 BT136 5V DC to AC Pilot Light Switching Circuit",
  className = "w-full h-auto text-black",
  inputActive,
  triggerActive,
  loadActive,
  ...props
}: CircuitSvgProps) {
  const titleId = React.useId();

  const MOC = {
    x: 572,
    y: 217,
    w: 244,
    h: 450,
    pin6Y: 268,
    pin4Y: 620,
  };

  const MAIN_TRIAC = {
    x: ADJUST.bt136.x,
    y: ADJUST.bt136.y,
    scale: ADJUST.bt136.scale,

    mtX: ADJUST.bt136.x + 90 * ADJUST.bt136.scale,
    topTerminalY: ADJUST.bt136.y,
    gateLeadX: ADJUST.bt136.x,
    gateLeadY: ADJUST.bt136.y + 132 * ADJUST.bt136.scale,
    lowerEndY: ADJUST.bt136.y + 155 * ADJUST.bt136.scale,
  };

  const PHOTO_TRIAC = {
    topX: ADJUST.photoTriac.x + 40 * ADJUST.photoTriac.scale,
    topY: ADJUST.photoTriac.y,
    bottomX: ADJUST.photoTriac.x + 40 * ADJUST.photoTriac.scale,
    bottomY: ADJUST.photoTriac.y + 110 * ADJUST.photoTriac.scale,
  };

  const PILOT = {
    x: ADJUST.pilotLight.x,
    y: ADJUST.pilotLight.y,
    scale: ADJUST.pilotLight.scale,
    r: 52 * ADJUST.pilotLight.scale,
  };

  const AC = {
    x: ADJUST.acSource.x,
    y: ADJUST.acSource.y,
    scale: ADJUST.acSource.scale,
    r: 56 * ADJUST.acSource.scale,
    terminalX: ADJUST.acSource.x + ADJUST.acSource.terminalOffsetX,
  };

  const RAIL = {
    topY: PILOT.y,
    bottomY: ADJUST.outputRail.bottomY,
  };

  const inputDotPaths = [
    "M100 225 L190 225",
    "M288 225 L380 225",
    "M450 225 L512 225 L512 263 L620 263 L620 390",
    "M620 455 L620 620 L508 620 L508 715 L100 715",
  ] as const;
  const triggerDotPaths = [
    `M${MOC.x + MOC.w} ${MOC.pin6Y} L${MAIN_TRIAC.mtX} ${MOC.pin6Y}`,
    `M${MOC.x + MOC.w} ${MOC.pin4Y} L900 620`,
    `M970 620 L1030 620 L${MAIN_TRIAC.gateLeadX} ${MAIN_TRIAC.gateLeadY}`,
  ] as const;
  const acDotPaths = [
    `M${AC.terminalX} ${RAIL.topY} L${AC.x} ${RAIL.topY} L${PILOT.x + PILOT.r} ${RAIL.topY}`,
    `M${PILOT.x - PILOT.r} ${RAIL.topY} L${MAIN_TRIAC.mtX} ${RAIL.topY} L${MAIN_TRIAC.mtX} ${MAIN_TRIAC.topTerminalY}`,
    `M${MAIN_TRIAC.mtX} ${MAIN_TRIAC.lowerEndY} L${MAIN_TRIAC.mtX} ${RAIL.bottomY} L${AC.terminalX} ${RAIL.bottomY}`,
  ] as const;

  return (
    <svg
      viewBox="0 0 1800 830"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby={titleId}
      shapeRendering="geometricPrecision"
      {...props}
    >
      <title id={titleId}>{title}</title>

      <rect width="1800" height="830" fill="white" />

      <defs>
        <style>{`
          .wire {
            fill: none;
            stroke: currentColor;
            stroke-width: 4;
            stroke-linecap: square;
            stroke-linejoin: miter;
          }

          .thin-wire {
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: square;
            stroke-linejoin: miter;
          }

          .txt {
            fill: currentColor;
            font-family: Arial, Helvetica, sans-serif;
          }

          .bold {
            font-weight: 700;
          }

          .big {
            font-size: 31px;
          }

          .mid {
            font-size: 28px;
          }

          .small {
            font-size: 24px;
          }
        `}</style>
      </defs>

      <Battery5V />

      {inputActive && (
        <ActivePath
          d="M100 225 L190 225 M288 225 L512 225 L512 263 L620 263 L620 390 M620 455 L620 620 L508 620 L508 715 L100 715"
          color="#f59e0b"
        />
      )}
      {triggerActive && (
        <ActivePath
          d={`M${MOC.x + MOC.w} ${MOC.pin6Y} L${MAIN_TRIAC.mtX} ${MOC.pin6Y} M${MOC.x + MOC.w} ${MOC.pin4Y} L900 620 M970 620 L1030 620 L${MAIN_TRIAC.gateLeadX} ${MAIN_TRIAC.gateLeadY}`}
          color="#a855f7"
        />
      )}
      {loadActive && (
        <ActivePath
          d={`M${AC.terminalX} ${RAIL.topY} L${AC.x} ${RAIL.topY} L${PILOT.x + PILOT.r} ${RAIL.topY} M${PILOT.x - PILOT.r} ${RAIL.topY} L${MAIN_TRIAC.mtX} ${RAIL.topY} L${MAIN_TRIAC.mtX} ${MAIN_TRIAC.topTerminalY} M${MAIN_TRIAC.mtX} ${MAIN_TRIAC.lowerEndY} L${MAIN_TRIAC.mtX} ${RAIL.bottomY} L${AC.terminalX} ${RAIL.bottomY}`}
          color="#10b981"
        />
      )}

      {/* SW1 */}
      <polyline points="100,225 190,225" className="wire" />
      <circle cx="192" cy="225" r="10" fill="white" stroke="currentColor" strokeWidth="4" />
      <circle cx="278" cy="225" r="10" fill="white" stroke="currentColor" strokeWidth="4" />
      <line
        x1="202"
        y1={inputActive ? 225 : 218}
        x2="265"
        y2={inputActive ? 225 : 178}
        className="wire"
        stroke={inputActive ? "#059669" : "currentColor"}
      />

      <text x="197" y="105" className="txt mid bold">
        SW1
      </text>
      <text x="178" y="145" className="txt mid">
        ON/OFF
      </text>

      {/* R1 */}
      <line x1="288" y1="225" x2="380" y2="225" className="wire" />
      <Resistor x={380} y={225} label="R1" value="240Ω" />
      <line x1="450" y1="225" x2="512" y2="225" className="wire" />

      {/* MOC3063 body */}
      <rect
        x={MOC.x}
        y={MOC.y}
        width={MOC.w}
        height={MOC.h}
        rx="8"
        fill="white"
        stroke="currentColor"
        strokeWidth="4"
      />

      <text x="680" y="155" className="txt big">
        U1
      </text>
      <text x="632" y="195" className="txt big">
        MOC3063
      </text>

      {/* MOC3063 pin labels */}
      <text x="535" y="249" className="txt big">
        1
      </text>
      <text x="535" y="606" className="txt big">
        2
      </text>
      <text x="842" y="254" className="txt big">
        6
      </text>
      <text x="842" y="606" className="txt big">
        4
      </text>

      {/* MOC input-side wiring */}
      <polyline points="512,225 512,263 620,263 620,390" className="wire" />
      <polyline points="100,715 508,715 508,620 620,620 620,455" className="wire" />

      {/* MOC internal input LED */}
      {inputActive && <circle cx="620" cy="422" r="84" fill="#fef3c7" opacity="0.65" />}
      <polygon points="595,390 645,390 620,455" fill={inputActive ? "#f59e0b" : "currentColor"} />
      <line x1="595" y1="455" x2="645" y2="455" className="wire" />

      {/* Optical arrows */}
      <OpticalArrow
        x1={ADJUST.opticalArrow.startX}
        x2={ADJUST.opticalArrow.endX}
        y={ADJUST.opticalArrow.y1}
        active={triggerActive}
        strokeWidth={ADJUST.opticalArrow.strokeWidth}
        headSize={ADJUST.opticalArrow.headSize}
      />
      <OpticalArrow
        x1={ADJUST.opticalArrow.startX}
        x2={ADJUST.opticalArrow.endX}
        y={ADJUST.opticalArrow.y2}
        active={triggerActive}
        strokeWidth={ADJUST.opticalArrow.strokeWidth}
        headSize={ADJUST.opticalArrow.headSize}
      />

      {/* PhotoTRIAC */}
      <PhotoTriacSymbol
        x={ADJUST.photoTriac.x}
        y={ADJUST.photoTriac.y}
        active={triggerActive}
        scale={ADJUST.photoTriac.scale}
      />

      {/* PhotoTRIAC pin 6 and pin 4 connections */}
      <polyline
        points={`${PHOTO_TRIAC.topX},${PHOTO_TRIAC.topY} ${PHOTO_TRIAC.topX},${MOC.pin6Y} ${
          MOC.x + MOC.w
        },${MOC.pin6Y}`}
        className="wire"
      />
      <polyline
        points={`${PHOTO_TRIAC.bottomX},${PHOTO_TRIAC.bottomY} ${PHOTO_TRIAC.bottomX},${MOC.pin4Y} ${
          MOC.x + MOC.w
        },${MOC.pin4Y}`}
        className="wire"
      />

      {/* Pin 6 wire follows moved/scaled BT136 */}
      <polyline
        points={`${MOC.x + MOC.w},${MOC.pin6Y} ${MAIN_TRIAC.mtX},${MOC.pin6Y}`}
        className="wire"
      />

      {/* Pin 4 to R2 */}
      <line x1={MOC.x + MOC.w} y1={MOC.pin4Y} x2="900" y2="620" className="wire" />

      {/* R2 */}
      <Resistor x={900} y={620} label="R2" value="330Ω" />

      {/* Gate wire */}
      <polyline
        points={`970,620 1030,620 ${MAIN_TRIAC.gateLeadX},${MAIN_TRIAC.gateLeadY}`}
        className="wire"
      />

      <text x={ADJUST.gateLabel.x} y={ADJUST.gateLabel.y} className="txt mid bold">
        G
      </text>

      {/* BT136 */}
      <BT136TriacSymbol
        x={MAIN_TRIAC.x}
        y={MAIN_TRIAC.y}
        active={loadActive}
        scale={MAIN_TRIAC.scale}
      />

      <text x={ADJUST.bt136Label.q1X} y={ADJUST.bt136Label.q1Y} className="txt big">
        Q1
      </text>
      <text x={ADJUST.bt136Label.btX} y={ADJUST.bt136Label.btY} className="txt big">
        BT136
      </text>

      <text x={ADJUST.terminalLabel.mt2X} y={ADJUST.terminalLabel.mt2Y} className="txt big">
        MT2
      </text>
      <text x={ADJUST.terminalLabel.mt1X} y={ADJUST.terminalLabel.mt1Y} className="txt big">
        MT1
      </text>

      {/* Top output rail: follows BT136 and PILOT LIGHT */}
      <polyline
        points={`${MAIN_TRIAC.mtX},${MAIN_TRIAC.topTerminalY} ${MAIN_TRIAC.mtX},${RAIL.topY} ${
          PILOT.x - PILOT.r
        },${RAIL.topY}`}
        className="wire"
      />

      {/* L rail: follows PILOT LIGHT and AC source rail */}
      <polyline
        points={`${PILOT.x + PILOT.r},${RAIL.topY} ${AC.x},${RAIL.topY} ${AC.terminalX},${RAIL.topY}`}
        className="wire"
      />

      {/* Lower output rail: follows BT136 and AC/N rail */}
      <polyline
        points={`${MAIN_TRIAC.mtX},${MAIN_TRIAC.lowerEndY} ${MAIN_TRIAC.mtX},${RAIL.bottomY} ${AC.terminalX},${RAIL.bottomY}`}
        className="wire"
      />

      {/* AC vertical rail: follows moved/scaled AC source */}
      <polyline points={`${AC.x},${RAIL.topY} ${AC.x},${AC.y - AC.r}`} className="wire" />
      <polyline points={`${AC.x},${AC.y + AC.r} ${AC.x},${RAIL.bottomY}`} className="wire" />

      {/* Pilot light rendered after wires to hide wire under bulb */}
      <PilotLight x={PILOT.x} y={PILOT.y} scale={PILOT.scale} active={loadActive} />

      {/* L terminal */}
      <circle cx={AC.x} cy={RAIL.topY} r="9" fill="currentColor" />
      <circle cx={AC.terminalX} cy={RAIL.topY} r="10" fill="white" stroke="currentColor" strokeWidth="4" />
      <text x={AC.terminalX + 33} y={RAIL.topY + 18} className="txt big">
        L
      </text>

      {/* N terminal */}
      <circle cx={AC.x} cy={RAIL.bottomY} r="9" fill="currentColor" />
      <circle cx={AC.terminalX} cy={RAIL.bottomY} r="10" fill="white" stroke="currentColor" strokeWidth="4" />
      <text x={AC.terminalX + 33} y={RAIL.bottomY + 18} className="txt big">
        N
      </text>

      {/* AC source rendered after wires to hide rail behind source circle */}
      <ACSource x={AC.x} y={AC.y} scale={AC.scale} />

      <CurrentDots active={inputActive} paths={inputDotPaths} color="#f59e0b" />
      <CurrentDots active={triggerActive} paths={triggerDotPaths} color="#a855f7" duration={2} />
      <CurrentDots active={loadActive} paths={acDotPaths} color="#10b981" duration={1.45} />
    </svg>
  );
}

export default function MOC3063BT136Circuit({
  className = "",
  showControls = true,
  title,
}: CircuitProps) {
  const [controlMode, setControlMode] = React.useState<ControlMode>("onOff");
  const [inputEnabled, setInputEnabled] = React.useState(false);
  const [timelineProgress, setTimelineProgress] = React.useState(0);

  const timelineStep = toTimelineStep(timelineProgress);
  const previewOn = controlMode === "timeline" && inputEnabled;
  const inputActive = controlMode === "timeline" ? previewOn && timelineStep >= 1 : inputEnabled;
  const triggerActive = controlMode === "timeline" ? previewOn && timelineStep >= 2 : inputEnabled;
  const loadActive = controlMode === "timeline" ? previewOn && timelineStep >= 3 : inputEnabled;

  const handleControlModeChange = (mode: ControlMode) => {
    setControlMode(mode);

    if (mode === "timeline") {
      setInputEnabled(true);
    }
  };

  const handleToggleInput = () => {
    setControlMode("onOff");
    setInputEnabled((current) => !current);
  };

  const handleReset = () => {
    setControlMode("onOff");
    setInputEnabled(false);
    setTimelineProgress(0);
  };

  const handleTimelineChange = (value: number) => {
    setControlMode("timeline");
    setInputEnabled(true);
    setTimelineProgress(Math.min(0.999, Math.max(0, value)));
  };

  return (
    <div
      className={`grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)] ${className}`}
    >
      {showControls && (
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <ACPhotoTriacSwitchingControlPanel
            controlMode={controlMode}
            inputEnabled={inputEnabled}
            timelineStep={timelineStep}
            onControlModeChange={handleControlModeChange}
            onToggleInput={handleToggleInput}
            onReset={handleReset}
          />
        </aside>
      )}

      <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <ACPhotoTriacSwitchingPreview
          timelineProgress={timelineProgress}
          timelineStep={timelineStep}
          onTimelineChange={handleTimelineChange}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
          <MOC3063BT136CircuitSvg
            title={title}
            inputActive={inputActive}
            triggerActive={triggerActive}
            loadActive={loadActive}
            className="h-auto w-full text-black"
          />
        </div>
      </div>
    </div>
  );
}
