"use client";

import * as React from "react";
import {
  OptotransistorDCSwitchControlPanel,
  OptotransistorSwitchingPreview,
  toTimelineStep,
  type ControlMode,
} from "./OptotransistorDCSwitchControlPanel";

type PC817DCDCIsolatedCircuitProps = {
  title?: string;
  className?: string;
  showControls?: boolean;
};

type PC817DCDCIsolatedCircuitSvgProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  inputActive: boolean;
  lightActive: boolean;
  outputActive: boolean;
};

const VIEW_BOX = {
  width: 1664,
  height: 840,
} as const;

const STROKE = 4;
const FONT_FAMILY = "Arial, Helvetica, sans-serif";
const INPUT_CURRENT_DOT_PATHS = [
  "M154 264 L268 264",
  "M354 264 L470 264",
  "M554 264 L646 264 L646 312 L758 312 L758 430",
  "M758 486 L758 622 L718 622 L646 622 L646 674 L154 674",
] as const;
const OUTPUT_CURRENT_DOT_PATHS = [
  "M1488 264 L1192 264",
  "M1108 264 L1026 264 L1026 312 L954 312",
  "M954 622 L1026 622 L1026 669 L1150 669",
  "M1216 669 L1488 669",
] as const;

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
        points={[
          `${x},${y}`,
          `${x + 12},${y - 25}`,
          `${x + 24},${y + 25}`,
          `${x + 36},${y - 25}`,
          `${x + 48},${y + 25}`,
          `${x + 60},${y - 25}`,
          `${x + 72},${y + 25}`,
          `${x + 84},${y}`,
        ].join(" ")}
        className="wire"
      />

      <text x={x + 42} y={y - 84} className="txt label" textAnchor="middle">
        {label}
      </text>
      <text x={x + 42} y={y - 46} className="txt value" textAnchor="middle">
        {value}
      </text>
    </g>
  );
}

function Switch({
  x,
  y,
  active,
}: {
  x: number;
  y: number;
  active: boolean;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="white" stroke="currentColor" strokeWidth={STROKE} />
      <circle cx={x + 86} cy={y} r={10} fill="white" stroke="currentColor" strokeWidth={STROKE} />

      <line
        x1={x + 12}
        y1={active ? y : y - 8}
        x2={x + 78}
        y2={active ? y : y - 48}
        className="wire"
        stroke={active ? "#059669" : "currentColor"}
      />

      <text x={x + 36} y={y - 86} className="txt label" textAnchor="middle">
        SW1
      </text>
      <text x={x + 36} y={y - 48} className="txt value" textAnchor="middle">
        ON/OFF
      </text>
    </g>
  );
}

function Source5V() {
  return (
    <g>
      <text x={8} y={490} className="txt value">
        5V DC
      </text>
      <text x={20} y={532} className="txt value">
        Source
      </text>

      <text x={100} y={438} className="txt polarity">
        +
      </text>
      <text x={102} y={564} className="txt polarity">
        -
      </text>

      <line x1={154} y1={264} x2={154} y2={462} className="wire" />
      <line x1={154} y1={518} x2={154} y2={674} className="wire" />

      <line x1={121} y1={462} x2={187} y2={462} className="wire" />
      <line x1={133} y1={481} x2={175} y2={481} className="wire" />
      <line x1={121} y1={502} x2={187} y2={502} className="wire" />
    </g>
  );
}

function Source12V() {
  return (
    <g>
      <line x1={1488} y1={264} x2={1488} y2={462} className="wire" />
      <line x1={1488} y1={518} x2={1488} y2={669} className="wire" />

      <line x1={1454} y1={462} x2={1522} y2={462} className="wire" />
      <line x1={1467} y1={481} x2={1509} y2={481} className="wire" />
      <line x1={1454} y1={502} x2={1522} y2={502} className="wire" />

      <text x={1508} y={438} className="txt polarity">
        +
      </text>
      <text x={1510} y={564} className="txt polarity">
        -
      </text>

      <text x={1542} y={490} className="txt value">
        12V DC
      </text>
      <text x={1548} y={532} className="txt value">
        Source
      </text>
    </g>
  );
}

function PC817Body() {
  return (
    <g>
      <rect
        x={718}
        y={262}
        width={236}
        height={410}
        rx={8}
        fill="white"
        stroke="currentColor"
        strokeWidth={STROKE}
      />

      <text x={836} y={246} className="txt pcLabel" textAnchor="middle">
        PC817
      </text>

      <text x={676} y={302} className="txt pin">
        1
      </text>
      <text x={676} y={614} className="txt pin">
        2
      </text>
      <text x={974} y={302} className="txt pin">
        4
      </text>
      <text x={974} y={614} className="txt pin">
        3
      </text>
    </g>
  );
}

function InternalLED({ active }: { active: boolean }) {
  return (
    <g>
      {active && <circle cx={758} cy={458} r={86} fill="#fef3c7" opacity={0.7} />}

      {/* fixed pin-1 connection */}
      <line x1={718} y1={312} x2={758} y2={312} className="wire" />

      {/* LED vertical conductor */}
      <line x1={758} y1={312} x2={758} y2={430} className="wire" />
      <line x1={758} y1={486} x2={758} y2={622} className="wire" />

      {/* LED symbol */}
      <polygon points="734,430 782,430 758,486" fill={active ? "#f59e0b" : "currentColor"} />
      <line x1={734} y1={486} x2={782} y2={486} className="wire" />

      {/* fixed pin-2 connection */}
      <line x1={718} y1={622} x2={758} y2={622} className="wire" />
    </g>
  );
}

function OpticalArrows({ active }: { active: boolean }) {
  return (
    <g
      fill={active ? "#facc15" : "currentColor"}
      opacity={active ? 1 : 0.18}
      stroke={active ? "#facc15" : "currentColor"}
      strokeWidth={4}
      strokeLinecap="square"
    >
      <line x1={802} y1={452} x2={832} y2={452} />
      <polygon points="842,452 824,441 824,463" />

      <line x1={802} y1={476} x2={832} y2={476} />
      <polygon points="842,476 824,465 824,487" />
    </g>
  );
}

function PhotoTransistor({ active }: { active: boolean }) {
  return (
    <g>
      {active && <circle cx={888} cy={458} r={94} fill="#dcfce7" opacity={0.7} />}

      {/* fixed pin-4 connection */}
      <polyline points="954,312 918,312 918,370" className="wire" />

      {/* transistor body */}
      <line x1={866} y1={370} x2={866} y2={540} className="wire" />

      {/* collector */}
      <line x1={866} y1={418} x2={918} y2={370} className="wire" />

      {/* emitter */}
      <line x1={866} y1={494} x2={918} y2={546} className="wire" />

      {/* emitter arrow */}
      <polygon points="931,518 924,552 890,547" fill={active ? "#10b981" : "currentColor"} />

      {/* fixed pin-3 connection */}
      <polyline points="918,546 918,622 954,622" className="wire" />
    </g>
  );
}

function OutputLED({ active }: { active: boolean }) {
  return (
    <g>
      {active && <circle cx={1188} cy={669} r={86} fill="#bbf7d0" opacity={0.65} />}

      <polygon
        points="1150,630 1208,669 1150,708"
        fill={active ? "#00b050" : "white"}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
      />

      <line x1={1216} y1={638} x2={1216} y2={700} className="wire" />

      <g
        stroke="#00b050"
        strokeWidth={4}
        fill="#00b050"
        opacity={active ? 1 : 0.18}
        strokeLinecap="square"
      >
        <line x1={1191} y1={616} x2={1223} y2={584} />
        <polygon points="1223,584 1218,603 1204,589" />

        <line x1={1215} y1={624} x2={1248} y2={592} />
        <polygon points="1248,592 1243,611 1228,598" />
      </g>

      <text x={1192} y={748} className="txt ledLabel" textAnchor="middle">
        LED2
      </text>
      <text x={1192} y={784} className="txt ledValue" textAnchor="middle">
        Output Indicator
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
      opacity={0.45}
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
            r={8}
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

function PC817DCDCIsolatedCircuitSvg({
  title = "PC817 isolated 5V DC control to 12V DC output indicator circuit",
  className = "w-full h-auto text-black",
  inputActive,
  lightActive,
  outputActive,
  ...props
}: PC817DCDCIsolatedCircuitSvgProps) {
  const titleId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      className={className}
      role="img"
      aria-labelledby={titleId}
      shapeRendering="geometricPrecision"
      {...props}
    >
      <title id={titleId}>{title}</title>

      <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill="white" />

      <defs>
        <style>
          {`
            .wire {
              fill: none;
              stroke: currentColor;
              stroke-width: ${STROKE};
              stroke-linecap: square;
              stroke-linejoin: miter;
            }

            .txt {
              fill: currentColor;
              font-family: ${FONT_FAMILY};
            }

            .label {
              font-size: 31px;
              font-weight: 700;
            }

            .value {
              font-size: 31px;
              font-weight: 400;
            }

            .polarity {
              font-size: 34px;
              font-weight: 700;
            }

            .pin {
              font-size: 31px;
              font-weight: 700;
            }

            .pcLabel {
              font-size: 35px;
              font-weight: 700;
            }

            .ledLabel {
              font-size: 31px;
              font-weight: 700;
            }

            .ledValue {
              font-size: 28px;
              font-weight: 400;
            }
          `}
        </style>
      </defs>

      {/* Left source */}
      <Source5V />

      {inputActive && (
        <ActivePath
          d="M154 264 L268 264 M354 264 L470 264 M554 264 L646 264 L646 312 L718 312 M718 622 L646 622 L646 674 L154 674"
          color="#f59e0b"
        />
      )}

      {outputActive && (
        <ActivePath
          d="M1488 264 L1192 264 M1108 264 L1026 264 L1026 312 L954 312 M954 622 L1026 622 L1026 669 L1150 669 M1216 669 L1488 669"
          color="#10b981"
        />
      )}

      {/* input wire to switch */}
      <polyline points="154,264 268,264" className="wire" />

      {/* switch */}
      <Switch x={268} y={264} active={inputActive} />

      {/* switch to resistor */}
      <line x1={354} y1={264} x2={470} y2={264} className="wire" />

      {/* R1 */}
      <Resistor x={470} y={264} label="R1" value="220 ohm" />

      {/* resistor to pin 1 */}
      <polyline points="554,264 646,264 646,312 718,312" className="wire" />

      {/* bottom return to pin 2 */}
      <polyline points="154,674 646,674 646,622 718,622" className="wire" />

      {/* PC817 package and internals */}
      <PC817Body />
      <InternalLED active={inputActive} />
      <OpticalArrows active={lightActive} />
      <PhotoTransistor active={outputActive} />

      {/* pin 4 to R4 */}
      <polyline points="954,312 1026,312 1026,264 1108,264" className="wire" />

      {/* R4 */}
      <Resistor x={1108} y={264} label="R4" value="1k ohm" />

      {/* R4 to 12V positive */}
      <polyline points="1192,264 1488,264" className="wire" />

      {/* pin 3 to LED */}
      <polyline points="954,622 1026,622 1026,669 1150,669" className="wire" />

      {/* output LED */}
      <OutputLED active={outputActive} />

      {/* LED to 12V negative return */}
      <polyline points="1216,669 1488,669" className="wire" />

      {/* right source */}
      <Source12V />

      <CurrentDots
        active={inputActive}
        paths={INPUT_CURRENT_DOT_PATHS}
        color="#f59e0b"
      />
      <CurrentDots
        active={outputActive}
        paths={OUTPUT_CURRENT_DOT_PATHS}
        color="#10b981"
        duration={2.1}
      />
    </svg>
  );
}

export default function PC817DCDCIsolatedCircuit({
  className = "",
  showControls = true,
  title,
}: PC817DCDCIsolatedCircuitProps) {
  const [controlMode, setControlMode] = React.useState<ControlMode>("onOff");
  const [inputEnabled, setInputEnabled] = React.useState(false);
  const [timelineProgress, setTimelineProgress] = React.useState(0);

  const timelineStep = toTimelineStep(timelineProgress);
  const previewOn = controlMode === "timeline" && inputEnabled;
  const inputActive = controlMode === "timeline" ? previewOn && timelineStep >= 1 : inputEnabled;
  const lightActive = controlMode === "timeline" ? previewOn && timelineStep >= 2 : inputEnabled;
  const outputActive = controlMode === "timeline" ? previewOn && timelineStep >= 3 : inputEnabled;

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
          <OptotransistorDCSwitchControlPanel
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
        <OptotransistorSwitchingPreview
          timelineProgress={timelineProgress}
          timelineStep={timelineStep}
          onTimelineChange={handleTimelineChange}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
          <PC817DCDCIsolatedCircuitSvg
            title={title}
            inputActive={inputActive}
            lightActive={lightActive}
            outputActive={outputActive}
            className="h-auto w-full text-black"
          />
        </div>
      </div>
    </div>
  );
}
