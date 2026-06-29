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
} from "./mosfetSimulatorConstants";
import {
  clamp,
  getStateColor,
  getThermalColor,
} from "./mosfetSimulatorLogic";
import type { FlowMode, LoadType, MosfetState } from "./mosfetSimulatorTypes";

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
      <text
        x={cx - 13}
        y={cy + 11}
        fontSize={LABEL.meterSize}
        fontFamily={LABEL.fontFamily}
        fill={color}
      >
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
      style={{
        transition: "stroke 250ms ease, opacity 250ms ease, stroke-width 250ms ease",
      }}
    />
  );
}

export function TopGateSlider({
  gateVoltage,
  thresholdVoltage,
  mosfetState,
  onChange,
}: {
  gateVoltage: number;
  thresholdVoltage: number;
  mosfetState: MosfetState;
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
      <line
        {...SLIDER.rail}
        stroke={COMPONENT.gray}
        strokeWidth={WIRE.thick}
        strokeLinecap="round"
      />
      <line
        x1={SLIDER.rail.x1}
        y1={SLIDER.rail.y1}
        x2={knobCx}
        y2={SLIDER.rail.y1}
        stroke={getStateColor(mosfetState)}
        strokeWidth={WIRE.thick}
        strokeLinecap="round"
      />
      <line
        x1={thresholdX}
        y1="72"
        x2={thresholdX}
        y2="108"
        stroke={COMPONENT.red}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle
        cx={knobCx}
        cy={SLIDER.knob.cy}
        r={SLIDER.knob.r}
        fill="#3d7fe8"
        stroke={COMPONENT.blueStroke}
        strokeWidth={3}
      />
      <circle {...SLIDER.plus} fill="#fff" stroke={COMPONENT.red} strokeWidth={4} />
      <text x="717" y="104" fontSize="40" fill={COMPONENT.red}>
        +
      </text>
      <text
        x={SLIDER.vgs.x}
        y={SLIDER.vgs.y}
        fontSize="18"
        fontFamily={LABEL.fontFamily}
        fill={getStateColor(mosfetState)}
      >
        VGS {gateVoltage.toFixed(1)}V
      </text>
      <foreignObject x="448" y="68" width="245" height="45">
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={gateVoltage}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-10 w-full cursor-pointer opacity-0"
        />
      </foreignObject>
    </g>
  );
}

function ElectricFieldLines({ strength }: { strength: number }) {
  const count = Math.max(0, Math.round(strength * 10));

  return (
    <g opacity={0.2 + strength * 0.75}>
      {Array.from({ length: count }).map((_, index) => {
        const x = 365 + index * 44;
        return (
          <path
            key={index}
            d={`M${x} 335 C${x - 14} 352 ${x - 10} 374 ${x} 398`}
            stroke={COMPONENT.red}
            strokeWidth={1.2 + strength * 2.2}
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#fieldArrow)"
            style={{
              animation: `fieldPulse ${1.4 - strength * 0.5}s ease-in-out ${index * 0.08}s infinite`,
            }}
          />
        );
      })}
    </g>
  );
}

function DensityMap({ strength }: { strength: number }) {
  if (strength <= 0.01) {
    return null;
  }

  return (
    <g opacity={0.15 + strength * 0.75}>
      {Array.from({ length: 34 }).map((_, index) => {
        const x = 365 + (index % 17) * 27;
        const y = 365 + Math.floor(index / 17) * 23;
        return (
          <circle key={index} cx={x} cy={y} r={2 + strength * 3} fill={COMPONENT.blue} />
        );
      })}
    </g>
  );
}

function FlowParticles({
  strength,
  isPlaying,
  flowMode,
  conventional = false,
  speed,
}: {
  strength: number;
  isPlaying: boolean;
  flowMode: FlowMode;
  conventional?: boolean;
  speed: number;
}) {
  const allowed =
    flowMode === "Both" || flowMode === (conventional ? "Conventional" : "Electron");
  const active = strength > 0.03 && allowed;
  const duration = `${(2.2 - strength * 1.25) / speed}s`;
  const opacity = active ? 0.2 + strength * 0.8 : 0;

  const data = conventional
    ? [
        [790, 412],
        [710, 418],
        [630, 415],
        [550, 420],
        [470, 414],
        [390, 418],
      ]
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
            animation:
              isPlaying && active
                ? `${conventional ? "currentFlowDrainToSource" : "electronFlowSourceToDrain"} ${duration} linear ${index * 0.08}s infinite`
                : "none",
          }}
        />
      ))}
    </g>
  );
}

function Hotspot({ junctionTemp, power }: { junctionTemp: number; power: number }) {
  const color = getThermalColor(junctionTemp);
  const opacity = clamp(power * 12, 0.05, 0.8);

  return (
    <g opacity={opacity}>
      <circle cx="760" cy="380" r={28 + power * 120} fill={color} />
      <circle cx="760" cy="380" r={12 + power * 50} fill={color} opacity="0.8" />
    </g>
  );
}

export function MainMosfetStructure({
  channelStrength,
  mosfetState,
  junctionTemp,
  power,
  flowMode,
  isPlaying,
  speed,
}: {
  channelStrength: number;
  mosfetState: MosfetState;
  junctionTemp: number;
  power: number;
  flowMode: FlowMode;
  isPlaying: boolean;
  speed: number;
}) {
  const showChannel = channelStrength > 0.03;
  const isSaturation = mosfetState === "SATURATION";
  const channelOpacity = showChannel ? 0.12 + channelStrength * 0.88 : 0;
  const channelStrokeWidth = showChannel ? 1.2 + channelStrength * 7 : 0;
  const pinchOpacity = isSaturation ? 0.25 + channelStrength * 0.7 : 0;

  return (
    <g>
      <rect
        {...PATH.body}
        fill={COMPONENT.semiconductor}
        stroke={COMPONENT.black}
        strokeWidth={4}
      />
      <path
        d={PATH.sourceRegion}
        fill={COMPONENT.nRegion}
        stroke={COMPONENT.nRegionStroke}
        strokeWidth={2}
      />
      <path
        d={PATH.drainRegion}
        fill={COMPONENT.nRegion}
        stroke={COMPONENT.nRegionStroke}
        strokeWidth={2}
      />

      <text x="230" y="385" fontSize={LABEL.regionSize} fill="#156b20">
        N+
      </text>
      <text x="907" y="385" fontSize={LABEL.regionSize} fill="#156b20">
        N+
      </text>

      <rect
        {...MAIN.oxide}
        fill={COMPONENT.oxide}
        stroke={COMPONENT.oxideStroke}
        strokeWidth={2}
      />
      <rect {...MAIN.gate} fill={COMPONENT.dark} stroke={COMPONENT.black} strokeWidth={3} />
      <rect {...MAIN.gatePin} fill={COMPONENT.black} />

      <rect {...MAIN.sourceTerminal} rx={3} fill={COMPONENT.black} />
      <rect {...MAIN.drainTerminal} rx={3} fill={COMPONENT.black} />

      <Hotspot junctionTemp={junctionTemp} power={power} />
      <ElectricFieldLines strength={channelStrength} />

      <path
        d={PATH.channel}
        fill={COMPONENT.channel}
        stroke={COMPONENT.channelStroke}
        strokeWidth={channelStrokeWidth}
        opacity={channelOpacity}
        style={{ transition: "opacity 350ms ease, stroke-width 350ms ease" }}
      />

      <DensityMap strength={channelStrength} />

      <path
        d={PATH.pinchOff}
        fill={COMPONENT.semiconductor}
        stroke={COMPONENT.red}
        strokeWidth={3 + channelStrength * 2}
        opacity={pinchOpacity}
        style={{ transition: "opacity 350ms ease" }}
      />

      <FlowParticles
        strength={channelStrength}
        isPlaying={isPlaying}
        flowMode={flowMode}
        speed={speed}
      />
      <FlowParticles
        strength={channelStrength}
        isPlaying={isPlaying}
        flowMode={flowMode}
        conventional
        speed={speed}
      />

      {BODY_PARTICLES.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={NODE.small}
          fill="#fff5dd"
          stroke={COMPONENT.gray}
          strokeWidth={3}
          opacity={0.55 + channelStrength * 0.3}
        />
      ))}

      <path d="M225 550 l20 -25" stroke={COMPONENT.black} strokeWidth={4} markerEnd="url(#arrow)" />
      <rect x={PATH.body.x} y={600} width={PATH.body.width} height={20} fill={COMPONENT.metal} />
      <Ground {...MAIN.ground} />
    </g>
  );
}

export function LoadVisualizer({ type, current }: { type: LoadType; current: number }) {
  const intensity = clamp(current * 8, 0, 1);

  return (
    <g transform="translate(930 500)">
      <rect x="0" y="0" width="115" height="70" rx="10" fill="#fff" stroke={COMPONENT.lightGray} strokeWidth="2" />
      <text x="12" y="18" fontSize="13" fontFamily={LABEL.fontFamily} fill={COMPONENT.black}>
        {type}
      </text>

      {type === "LED" ? (
        <>
          <circle cx="57" cy="42" r="14" fill={COMPONENT.red} opacity={0.2 + intensity * 0.8} />
          <path d="M45 42 H69" stroke={COMPONENT.black} strokeWidth="3" />
        </>
      ) : null}

      {type === "Motor" ? (
        <>
          <circle cx="57" cy="42" r="18" fill="#f8fafc" stroke={COMPONENT.black} strokeWidth="3" />
          <path
            d="M57 24 V60 M39 42 H75"
            stroke={COMPONENT.blue}
            strokeWidth="4"
            style={{
              animation: intensity > 0.05 ? `spin ${1.2 - intensity * 0.8}s linear infinite` : "none",
              transformOrigin: "57px 42px",
            }}
          />
        </>
      ) : null}

      {type === "Lamp" ? (
        <>
          <circle cx="57" cy="42" r="18" fill={COMPONENT.orange} opacity={0.15 + intensity * 0.85} stroke={COMPONENT.black} strokeWidth="2" />
          <path d="M47 44 C52 30 62 30 67 44" stroke={COMPONENT.black} strokeWidth="2" fill="none" />
        </>
      ) : null}

      {type === "Resistor" ? (
        <path
          d="M25 42 h12 l8 -12 l12 24 l12 -24 l8 12 h12"
          fill="none"
          stroke={COMPONENT.black}
          strokeWidth="3"
        />
      ) : null}
    </g>
  );
}

export function MosfetSvgDefinitions() {
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
