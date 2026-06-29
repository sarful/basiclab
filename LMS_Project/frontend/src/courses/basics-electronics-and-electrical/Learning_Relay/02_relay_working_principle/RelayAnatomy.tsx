"use client";

import {
  DEFAULT_RELAY_LESSON_FOUR_CONTROLS,
  getRelayLessonFourDerivedState,
  type RelayLessonFourControls,
} from "./relayLessonFourShared";

export const VIEW_BOX = { x: 0, y: 0, width: 760, height: 520 };
export const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
};
export const BASE_WIRE_WIDTH = 2;
export const CIRCUIT_COMPONENT_SCALE = 1;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;
export const COMPONENT_OFFSET = {
  body: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  core: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  topPlate: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  armature: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  lShape: {
    off: { x: 0, y: 0 },
    on: { x: -20, y: 0 },
  },
  spring: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  labels: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  movingContact: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  field: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
};
export const FIELD_OFFSET = {
  off: { x: 0, y: 0 },
  on: { x: 0, y: 0 },
};
export const MANUAL_ADJUSTMENT_OFFSET = {
  contactLogic: {
    auto: { x: 0, y: 0 },
    nc: { x: 0, y: 0 },
    no: { x: 0, y: 0 },
  },
  coilFlow: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  magneticOuterFlow: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  magneticInnerFlow: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  contactFlowNc: {
    off: { x: 0, y: -50 },
    on: { x: 0, y: 0 },
  },
  contactFlowCom: {
    off: { x: 0, y: -40 },
    on: { x: 0, y: -45 },
  },
  contactFlowNo: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: -30 },
  },
};
export const FLOW_OFFSET = {
  coilLeadIn: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  coilLeadOut: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  contactNc: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  contactCom: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 0 },
  },
  contactNo: {
    off: { x: 0, y: 0 },
    on: { x: 0, y: 10 },
  },
};
export const WIRE_OFFSET = {
  arrows: { x: 0, y: 0 },
};
export const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };
export const NODE = {
  r: 4,
  fill: "#ef4444",
  stroke: "#ef4444",
  strokeWidth: 1,
};
export const WIRE = {
  color: "#374151",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
};
export const PATH = {
  stroke: "#374151",
  fill: "none",
  strokeWidth: WIRE.width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
export const LABEL = {
  main: "text-xl font-bold",
  small: "text-sm font-semibold",
};

export const BASE_COMPONENT = {
  colors: {
    metal: "#a7abb3",
    dark: "#303449",
    coil: "#f9d83a",
    terminal: "#ef6b5c",
    contact: "#f59e0b",
    label: "#374151",
    rod: "#555b66",
    current: "#2563eb",
    contactCurrent: "#22c55e",
  },
  coil: { x: 95, y: 130, width: 205, height: 235, lineCount: 36, lineGap: 6 },
  field: {
    center: { x: 205, y: 245 },
    rx: 150,
    ry: 122,
    ringGap: 10,
    bandCount: 14,
  },
  core: { x: 95, y: 90, width: 70, height: 27 },
  topPlate: { x: 70, y: 115, width: 260, height: 18 },
  armature: { x: 80, y: 56, width: 240, height: 7 },
  lShape: {
    x: 320,
    y: 56,
    topWidth: 56,
    downHeight: 180,
    thickness: 7,
    innerGap: 1,
  },
  pivot: { x: 320, y: 52, width: 10, height: 313, dotRadius: 4, dotY: 66 },
  base: { x: 35, y: 365, width: 540, height: 30 },
  spring: {
    off: {
      leftAnchor: { x: 320, y: 226 },
      rightAnchor: { x: 400, y: 228 },
      lead: 5,
      amplitude: 11,
      turns: 5,
    },
    on: {
      leftAnchor: { x: 330, y: 255 },
      rightAnchor: { x: 380, y: 252 },
      lead: 5,
      amplitude: 7,
      turns: 3,
    },
    turns: 4,
    strokeWidth: 2.5,
  },
  actuatorRod: {
    main: { x: 380, y: 215, width: 120, height: 16 },
    block: { x: 370, y: 205, width: 25, height: 36 },
  },
  fixedContacts: [
    { x: 460, y: 100, width: 7, height: 265 },
    { x: 495, y: 100, width: 7, height: 265 },
    { x: 530, y: 100, width: 7, height: 265 },
  ],
  movingContact: {
    offsetX: 0,
    offsetY: 0,
    left: { x1: 488, y1: 165, x2: 505, y2: 190, x3: 488, y3: 215 },
    right: { x1: 515, y1: 165, x2: 498, y2: 190, x3: 515, y3: 215 },
  },
};

type RelayAnatomySvgProps = {
  controls?: RelayLessonFourControls;
};

function createEllipseLoopPath(cx: number, cy: number, rx: number, ry: number) {
  return [
    `M ${cx - rx} ${cy}`,
    `a ${rx} ${ry} 0 1 0 ${rx * 2} 0`,
    `a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`,
  ].join(" ");
}

function createCoilFlowPath() {
  const { coil } = BASE_COMPONENT;
  const turns = 8;
  const topMargin = 18;
  const bottomMargin = 18;
  const usableHeight = coil.height - topMargin - bottomMargin;
  const segment = usableHeight / turns;
  const leftX = coil.x + 26;
  const rightX = coil.x + coil.width - 26;
  let d = `M ${leftX} ${coil.y + topMargin}`;

  for (let index = 0; index < turns; index += 1) {
    const y = coil.y + topMargin + segment * index;
    const nextY = y + segment;
    const toRight = index % 2 === 0;
    d += ` L ${toRight ? rightX : leftX} ${y}`;
    d += ` L ${toRight ? rightX : leftX} ${nextY}`;
  }

  return d;
}

function createContactConductionPath({
  activeContact,
  movingPadShift,
  contactOffset,
  commonOffset,
}: {
  activeContact: "NC" | "NO";
  movingPadShift: number;
  contactOffset: { x: number; y: number };
  commonOffset: { x: number; y: number };
}) {
  const commonTerminalX = 498 + commonOffset.x;
  const commonBottomY = 410 + commonOffset.y;
  const commonBridgeY = 214 + movingPadShift + commonOffset.y;
  const movingContactY = 190 + movingPadShift + commonOffset.y;

  if (activeContact === "NC") {
    const ncFixedX = 476 + contactOffset.x;
    const ncTerminalX = 463 + contactOffset.x;
    return [
      `M ${commonTerminalX} ${commonBottomY}`,
      `L ${commonTerminalX} ${commonBridgeY}`,
      `L ${commonTerminalX} ${movingContactY}`,
      `L ${ncFixedX} ${190 + contactOffset.y}`,
      `L ${ncTerminalX} ${190 + contactOffset.y}`,
      `L ${ncTerminalX} ${410 + contactOffset.y}`,
    ].join(" ");
  }

  const noFixedX = 515 + contactOffset.x;
  const noTerminalX = 535 + contactOffset.x;
  return [
    `M ${commonTerminalX} ${commonBottomY}`,
    `L ${commonTerminalX} ${commonBridgeY}`,
    `L ${noFixedX} ${190 + contactOffset.y}`,
    `L ${noTerminalX} ${190 + contactOffset.y}`,
    `L ${noTerminalX} ${410 + contactOffset.y}`,
  ].join(" ");
}

function FlowDots({
  path,
  color,
  count,
  duration,
  radius = 4,
  opacity = 1,
}: {
  path: string;
  color: string;
  count: number;
  duration: number;
  radius?: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }).map((_, index) => (
        <circle key={index} r={radius} fill={color}>
          <animateMotion
            dur={`${duration}s`}
            begin={`${(duration / count) * index}s`}
            repeatCount="indefinite"
            rotate="auto"
            path={path}
          />
        </circle>
      ))}
    </g>
  );
}

function ElectromagneticField({
  isCoilOn,
  intensity,
  outerFlowOffset,
  innerFlowOffset,
}: {
  isCoilOn: boolean;
  intensity: number;
  outerFlowOffset: { x: number; y: number };
  innerFlowOffset: { x: number; y: number };
}) {
  const field = BASE_COMPONENT.field;
  const offset = isCoilOn ? FIELD_OFFSET.on : FIELD_OFFSET.off;
  const activeOpacity = 0.16 + intensity * 0.2;
  const ringOpacity = isCoilOn ? activeOpacity : 0.06;
  const strokeColor = isCoilOn ? "#60a5fa" : "#cbd5e1";

  return (
    <g
      transform={`translate(${COMPONENT_OFFSET.field[isCoilOn ? "on" : "off"].x + offset.x}, ${COMPONENT_OFFSET.field[isCoilOn ? "on" : "off"].y + offset.y})`}
    >
      {Array.from({ length: field.bandCount }).map((_, index) => {
        const rx = field.rx - index * field.ringGap;
        const ry = field.ry - index * (field.ringGap - 2);
        return (
          <ellipse
            key={index}
            cx={field.center.x}
            cy={field.center.y}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isCoilOn ? 2.2 : 1.5}
            strokeDasharray={isCoilOn ? "10 10" : "6 12"}
            opacity={Math.max(0.04, ringOpacity - index * 0.025)}
          />
        );
      })}
      {isCoilOn ? (
        <>
          <ellipse
            cx={field.center.x}
            cy={field.center.y}
            rx={field.rx - 58}
            ry={field.ry - 46}
            fill="#93c5fd"
            opacity={0.08 + intensity * 0.08}
          />
          <FlowDots
            path={createEllipseLoopPath(
              field.center.x + outerFlowOffset.x,
              field.center.y + outerFlowOffset.y,
              field.rx - 16,
              field.ry - 10,
            )}
            color="#60a5fa"
            count={3}
            duration={4.8 - intensity * 1.6}
            radius={3}
            opacity={0.7}
          />
          <FlowDots
            path={createEllipseLoopPath(
              field.center.x + innerFlowOffset.x,
              field.center.y + innerFlowOffset.y,
              field.rx - 44,
              field.ry - 34,
            )}
            color="#38bdf8"
            count={2}
            duration={3.6 - intensity * 1.1}
            radius={2.6}
            opacity={0.62}
          />
        </>
      ) : null}
    </g>
  );
}

function DebugDot({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle
        cx={x + DEBUG_TERMINAL_OFFSET.x}
        cy={y + DEBUG_TERMINAL_OFFSET.y}
        r={NODE.r}
        fill={NODE.fill}
        stroke={NODE.stroke}
        strokeWidth={NODE.strokeWidth}
      />
      <text
        x={x + DEBUG_TERMINAL_OFFSET.x + 8}
        y={y + DEBUG_TERMINAL_OFFSET.y - 8}
        className="fill-red-600 text-[10px] font-bold"
      >
        {label}
      </text>
    </g>
  );
}

export default function RelayAnatomySvg({
  controls = DEFAULT_RELAY_LESSON_FOUR_CONTROLS,
}: RelayAnatomySvgProps) {
  const cfg = BASE_COMPONENT;
  const l = cfg.lShape;
  const mc = cfg.movingContact;
  const derived = getRelayLessonFourDerivedState(controls);
  const conditionKey = controls.isCoilEnergized ? "on" : "off";
  const bodyOffset = COMPONENT_OFFSET.body[conditionKey];
  const coreOffset = COMPONENT_OFFSET.core[conditionKey];
  const topPlateOffset = COMPONENT_OFFSET.topPlate[conditionKey];
  const armatureOffset = COMPONENT_OFFSET.armature[conditionKey];
  const lShapeOffset = COMPONENT_OFFSET.lShape[conditionKey];
  const springOffset = COMPONENT_OFFSET.spring[conditionKey];
  const labelOffset = COMPONENT_OFFSET.labels[conditionKey];
  const movingContactOffset = COMPONENT_OFFSET.movingContact[conditionKey];
  const contactLogicOffset =
    MANUAL_ADJUSTMENT_OFFSET.contactLogic[controls.contactMode];
  const travelProgress = derived.effectiveArmatureProgress;
  const showOffPadCondition = derived.activeContact === "NC";
  const showOnPadCondition = derived.activeContact === "NO";
  const armatureShift = travelProgress * 24;
  const armatureDrop = travelProgress * 4;
  const movingPadShift = travelProgress * 34;
  const springLeft = {
    x:
      cfg.spring.off.leftAnchor.x +
      (cfg.spring.on.leftAnchor.x - cfg.spring.off.leftAnchor.x) *
        travelProgress +
      springOffset.x,
    y:
      cfg.spring.off.leftAnchor.y +
      (cfg.spring.on.leftAnchor.y - cfg.spring.off.leftAnchor.y) *
        travelProgress +
      springOffset.y,
  };
  const springRight = {
    x:
      cfg.spring.off.rightAnchor.x +
      (cfg.spring.on.rightAnchor.x - cfg.spring.off.rightAnchor.x) *
        travelProgress +
      springOffset.x,
    y:
      cfg.spring.off.rightAnchor.y +
      (cfg.spring.on.rightAnchor.y - cfg.spring.off.rightAnchor.y) *
        travelProgress +
      springOffset.y,
  };
  const springLead =
    cfg.spring.off.lead +
    (cfg.spring.on.lead - cfg.spring.off.lead) * travelProgress;
  const springAmplitude =
    cfg.spring.off.amplitude +
    (cfg.spring.on.amplitude - cfg.spring.off.amplitude) * travelProgress;
  const springTurns = controls.isCoilEnergized
    ? cfg.spring.on.turns
    : cfg.spring.off.turns;
  const coilFill = controls.isCoilEnergized ? "#fde047" : cfg.colors.coil;
  const fieldIntensity = controls.isCoilEnergized ? travelProgress : 0.15;
  const noColor =
    derived.activeContact === "NO" ? "#22c55e" : cfg.colors.contact;
  const ncColor =
    derived.activeContact === "NC" ? "#ef4444" : cfg.colors.contact;
  const coilFlowPath = createCoilFlowPath();
  const coilLeadInOffset = FLOW_OFFSET.coilLeadIn[conditionKey];
  const coilLeadOutOffset = FLOW_OFFSET.coilLeadOut[conditionKey];
  const coilFlowOffset = MANUAL_ADJUSTMENT_OFFSET.coilFlow[conditionKey];
  const magneticOuterFlowOffset =
    MANUAL_ADJUSTMENT_OFFSET.magneticOuterFlow[conditionKey];
  const magneticInnerFlowOffset =
    MANUAL_ADJUSTMENT_OFFSET.magneticInnerFlow[conditionKey];
  const commonFlowOffset = {
    x:
      FLOW_OFFSET.contactCom[conditionKey].x +
      MANUAL_ADJUSTMENT_OFFSET.contactFlowCom[conditionKey].x +
      contactLogicOffset.x,
    y:
      FLOW_OFFSET.contactCom[conditionKey].y +
      MANUAL_ADJUSTMENT_OFFSET.contactFlowCom[conditionKey].y +
      contactLogicOffset.y,
  };
  const contactFlowOffset =
    derived.activeContact === "NC"
      ? {
          x:
            FLOW_OFFSET.contactNc[conditionKey].x +
            MANUAL_ADJUSTMENT_OFFSET.contactFlowNc[conditionKey].x +
            contactLogicOffset.x,
          y:
            FLOW_OFFSET.contactNc[conditionKey].y +
            MANUAL_ADJUSTMENT_OFFSET.contactFlowNc[conditionKey].y +
            contactLogicOffset.y,
        }
      : {
          x:
            FLOW_OFFSET.contactNo[conditionKey].x +
            MANUAL_ADJUSTMENT_OFFSET.contactFlowNo[conditionKey].x +
            contactLogicOffset.x,
          y:
            FLOW_OFFSET.contactNo[conditionKey].y +
            MANUAL_ADJUSTMENT_OFFSET.contactFlowNo[conditionKey].y +
            contactLogicOffset.y,
        };
  const leftCoilLeadPath = `M ${97 + coilLeadInOffset.x} ${395 + coilLeadInOffset.y} L ${97 + coilLeadInOffset.x} ${372 + coilLeadInOffset.y} L ${125 + coilLeadInOffset.x} ${372 + coilLeadInOffset.y} L ${125 + coilLeadInOffset.x} ${350 + coilLeadInOffset.y}`;
  const rightCoilLeadPath = `M ${250 + coilLeadOutOffset.x} ${395 + coilLeadOutOffset.y} L ${250 + coilLeadOutOffset.x} ${372 + coilLeadOutOffset.y} L ${270 + coilLeadOutOffset.x} ${372 + coilLeadOutOffset.y} L ${270 + coilLeadOutOffset.x} ${350 + coilLeadOutOffset.y}`;
  const activeContactPath = createContactConductionPath({
    activeContact: derived.activeContact,
    movingPadShift,
    contactOffset: contactFlowOffset,
    commonOffset: commonFlowOffset,
  });

  return (
    <div className="w-full bg-white p-4">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="h-auto w-full max-w-4xl"
        role="img"
        aria-label="Relay anatomy diagram"
        style={{
          transform: `scale(${SCALE.CIRCUIT_CANVAS_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 Z" fill={cfg.colors.label} />
          </marker>
        </defs>

        <rect width="760" height="520" fill="white" />

        <g transform={`translate(${bodyOffset.x}, ${bodyOffset.y})`}>
          <ElectromagneticField
            isCoilOn={controls.isCoilEnergized}
            intensity={fieldIntensity}
            outerFlowOffset={magneticOuterFlowOffset}
            innerFlowOffset={magneticInnerFlowOffset}
          />

          {/* Relay Coil */}
          <rect
            x={cfg.coil.x}
            y={cfg.coil.y}
            width={cfg.coil.width}
            height={cfg.coil.height}
            fill={coilFill}
            stroke="#111827"
            strokeWidth="1"
          />

          {/* Coil Winding Lines */}
          {Array.from({ length: cfg.coil.lineCount }).map((_, i) => (
            <line
              key={i}
              x1={cfg.coil.x}
              y1={cfg.coil.y + 7 + i * cfg.coil.lineGap}
              x2={cfg.coil.x + cfg.coil.width}
              y2={cfg.coil.y + 7 + i * cfg.coil.lineGap}
              stroke={cfg.colors.label}
              strokeWidth="1"
            />
          ))}

          <path d={leftCoilLeadPath} {...PATH} />
          <path d={rightCoilLeadPath} {...PATH} />
          {controls.isCoilEnergized ? (
            <>
              <FlowDots
                path={leftCoilLeadPath}
                color={cfg.colors.current}
                count={2}
                duration={1.8}
                radius={3}
                opacity={0.9}
              />
              <FlowDots
                path={`M ${95 + 26 + coilFlowOffset.x} ${130 + 18 + coilFlowOffset.y}${coilFlowPath.slice(
                  coilFlowPath.indexOf("L"),
                )}`}
                color={cfg.colors.current}
                count={5}
                duration={3.2}
                radius={3.2}
                opacity={0.88}
              />
              <FlowDots
                path={rightCoilLeadPath}
                color={cfg.colors.current}
                count={2}
                duration={1.8}
                radius={3}
                opacity={0.9}
              />
            </>
          ) : null}

          {/* Core and Magnetic Plate */}
          <rect
            x={cfg.core.x + coreOffset.x}
            y={cfg.core.y + coreOffset.y}
            width={cfg.core.width}
            height={cfg.core.height}
            fill={cfg.colors.metal}
          />
          <rect
            x={cfg.topPlate.x + topPlateOffset.x}
            y={cfg.topPlate.y + topPlateOffset.y}
            width={cfg.topPlate.width}
            height={cfg.topPlate.height}
            fill="black"
          />

          {/* Armature */}
          <rect
            x={cfg.armature.x + armatureShift + armatureOffset.x}
            y={cfg.armature.y + armatureDrop + armatureOffset.y}
            width={cfg.armature.width}
            height={cfg.armature.height}
            fill={cfg.colors.metal}
          />

          {/* L-Shape Armature Extension */}
          <path
            d={`
            M${l.x + armatureShift + lShapeOffset.x} ${l.y + lShapeOffset.y}
            H${l.x + l.topWidth + armatureShift + lShapeOffset.x}
            V${l.y + l.downHeight + armatureDrop + lShapeOffset.y}
            H${l.x + l.topWidth - l.thickness + armatureShift + lShapeOffset.x}
            V${l.y + l.thickness + l.innerGap + armatureDrop + lShapeOffset.y}
            H${l.x + armatureShift + lShapeOffset.x}
            Z
          `}
            fill={cfg.colors.metal}
          />

          {/* Pivot Support */}
          <rect
            x={cfg.pivot.x}
            y={cfg.pivot.y}
            width={cfg.pivot.width}
            height={cfg.pivot.height}
            fill={cfg.colors.dark}
          />
          <circle
            cx={cfg.pivot.x + cfg.pivot.width / 2}
            cy={cfg.pivot.dotY}
            r={cfg.pivot.dotRadius}
            fill={cfg.colors.terminal}
          />

          {/* Relay Base */}
          <rect {...cfg.base} fill="black" />

          {/* External Terminals */}
          <rect
            x="92"
            y="395"
            width="10"
            height="45"
            fill={cfg.colors.terminal}
          />
          <rect
            x="245"
            y="395"
            width="10"
            height="45"
            fill={cfg.colors.terminal}
          />
          <rect
            x="458"
            y="395"
            width="10"
            height="45"
            fill={cfg.colors.terminal}
          />
          <rect
            x="493"
            y="395"
            width="10"
            height="45"
            fill={cfg.colors.terminal}
          />
          <rect
            x="530"
            y="395"
            width="10"
            height="45"
            fill={cfg.colors.terminal}
          />

          {/* Return Spring */}
          <path
            d={createReturnSpringPath({
              start: springLeft,
              end: springRight,
              lead: springLead,
              amplitude: springAmplitude,
              turns: springTurns,
            })}
            fill="none"
            stroke={cfg.colors.dark}
            strokeWidth={cfg.spring.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Actuator Rod */}
          <rect
            x={cfg.actuatorRod.main.x}
            y={cfg.actuatorRod.main.y + movingPadShift}
            width={cfg.actuatorRod.main.width}
            height={cfg.actuatorRod.main.height}
            fill={cfg.colors.rod}
          />
          <rect
            x={cfg.actuatorRod.block.x}
            y={cfg.actuatorRod.block.y + movingPadShift}
            width={cfg.actuatorRod.block.width}
            height={cfg.actuatorRod.block.height}
            fill={cfg.colors.rod}
          />

          {/* Fixed Contacts */}
          {cfg.fixedContacts.map((contact, index) => (
            <rect key={index} {...contact} fill={cfg.colors.metal} />
          ))}

          {showOffPadCondition ? (
            <g
              transform={`translate(${mc.offsetX - 20 + movingContactOffset.x + contactLogicOffset.x} ${mc.offsetY - 50 + movingPadShift + movingContactOffset.y + contactLogicOffset.y})`}
            >
              <path
                d={`M${mc.left.x1} ${mc.left.y1} L${mc.left.x2} ${mc.left.y2} L${mc.left.x3} ${mc.left.y3} Z`}
                fill={ncColor}
              />
              <path
                d={`M${mc.right.x1} ${mc.right.y1} L${mc.right.x2} ${mc.right.y2} L${mc.right.x3} ${mc.right.y3} Z`}
                fill={noColor}
              />
            </g>
          ) : null}

          {showOnPadCondition ? (
            <g
              transform={`translate(${mc.offsetX + 15 + movingContactOffset.x + contactLogicOffset.x} ${mc.offsetY - 50 + movingPadShift + movingContactOffset.y + contactLogicOffset.y})`}
            >
              <path
                d={`M${mc.left.x1} ${mc.left.y1} L${mc.left.x2} ${mc.left.y2} L${mc.left.x3} ${mc.left.y3} Z`}
                fill={noColor}
              />
              <path
                d={`M${mc.right.x1} ${mc.right.y1} L${mc.right.x2} ${mc.right.y2} L${mc.right.x3} ${mc.right.y3} Z`}
                fill={noColor}
              />
            </g>
          ) : null}

          {derived.activeContact === "NC" || derived.activeContact === "NO" ? (
            <FlowDots
              path={activeContactPath}
              color={cfg.colors.contactCurrent}
              count={3}
              duration={2.1}
              radius={3.1}
              opacity={0.85}
            />
          ) : null}

          {/* Component Labels */}
          {controls.showLabels ? (
            <g transform={`translate(${labelOffset.x}, ${labelOffset.y})`}>
              <TextArrow
                text="Core"
                x={20}
                y={85}
                tx={100 + coreOffset.x + bodyOffset.x}
                ty={105 + coreOffset.y + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text="Coil"
                x={20}
                y={250}
                tx={95 + bodyOffset.x}
                ty={255 + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text={
                  controls.isCoilEnergized
                    ? "Electromagnetic field"
                    : "Weak magnetic field"
                }
                x={34}
                y={118}
                tx={190 + bodyOffset.x}
                ty={170 + bodyOffset.y}
                color={controls.isCoilEnergized ? "#2563eb" : "#94a3b8"}
              />
              <TextArrow
                text="Armature"
                x={120}
                y={35}
                tx={150 + armatureShift + armatureOffset.x + bodyOffset.x}
                ty={58 + armatureDrop + armatureOffset.y + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text="Return Spring"
                x={350}
                y={295}
                tx={(springLeft.x + springRight.x) / 2 + bodyOffset.x}
                ty={(springLeft.y + springRight.y) / 2 + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text="Fixed contacts"
                x={455}
                y={35}
                tx={476 + bodyOffset.x}
                ty={100 + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text="Moving contact"
                x={590}
                y={90}
                tx={505 + movingContactOffset.x + bodyOffset.x}
                ty={190 + movingPadShift + movingContactOffset.y + bodyOffset.y}
                color={cfg.colors.label}
              />
              <TextArrow
                text="NC"
                x={420}
                y={455}
                tx={463}
                ty={395}
                color={
                  derived.activeContact === "NC" ? "#ef4444" : cfg.colors.label
                }
              />
              <TextArrow
                text="COM"
                x={485}
                y={455}
                tx={498}
                ty={395}
                color={cfg.colors.label}
              />
              <TextArrow
                text="NO"
                x={555}
                y={455}
                tx={535}
                ty={395}
                color={
                  derived.activeContact === "NO" ? "#22c55e" : cfg.colors.label
                }
              />
            </g>
          ) : null}

          {controls.showDebugDots ? (
            <g>
              <DebugDot
                x={100 + coreOffset.x + bodyOffset.x}
                y={105 + coreOffset.y + bodyOffset.y}
                label="CORE"
              />
              <DebugDot
                x={150 + armatureShift + armatureOffset.x + bodyOffset.x}
                y={58 + armatureDrop + armatureOffset.y + bodyOffset.y}
                label="ARMATURE"
              />
              <DebugDot
                x={springLeft.x + bodyOffset.x}
                y={springLeft.y + bodyOffset.y}
                label="SPRING-L"
              />
              <DebugDot
                x={springRight.x + bodyOffset.x}
                y={springRight.y + bodyOffset.y}
                label="SPRING-R"
              />
              <DebugDot x={463} y={395} label="NC" />
              <DebugDot x={498} y={395} label="COM" />
              <DebugDot x={535} y={395} label="NO" />
            </g>
          ) : null}
        </g>
      </svg>
    </div>
  );
}

function createReturnSpringPath({
  start,
  end,
  lead,
  amplitude,
  turns,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  lead: number;
  amplitude: number;
  turns: number;
}) {
  const usableWidth = Math.max(8, end.x - start.x - lead * 2);
  const segment = usableWidth / (turns * 2);
  let cursorX = start.x;
  const midY = start.y;
  let d = `M${start.x} ${start.y} L${start.x + lead} ${start.y}`;

  cursorX += lead;

  for (let i = 0; i < turns * 2; i++) {
    const nextX = cursorX + segment;
    const nextY = i % 2 === 0 ? midY - amplitude : midY + amplitude;
    d += ` L${nextX} ${nextY}`;
    cursorX = nextX;
  }

  d += ` L${end.x - lead} ${midY} L${end.x} ${end.y}`;
  return d;
}

function TextArrow({
  text,
  x,
  y,
  tx,
  ty,
  color,
}: {
  text: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
}) {
  return (
    <g>
      <text x={x} y={y} className="text-xl font-bold" fill={color}>
        {text}
      </text>
      <line
        x1={x + 45}
        y1={y + 6}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
    </g>
  );
}
