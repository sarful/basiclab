"use client";

import { motion } from "framer-motion";

import { AcFlowDots, FlowDots } from "./FlowDots";
import {
  AcLoadNetwork,
  AcOutputSource,
  DcLoadNetwork,
  DcOutputSource,
} from "./OutputNetworks";
import PhotoTriacSymbol from "./PhotoTriacSymbol";
import type { CouplerType } from "./types";

type OptocouplerSvgProps = {
  active: boolean;
  couplerType: CouplerType;
};

const VIEW_BOX = "0 0 1688 603";
const VIEW_BOX_WIDTH = 1688;
const VIEW_BOX_HEIGHT = 603;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  inputBattery: 1,
  switch: 1,
  optocouplerBox: 1,
  inputLed: 1,
  outputDevice: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  wire: "#000000",
  box: "#0d47a1",
  activeInput: "#2563eb",
  activeOutput: "#16a34a",
  photodiodeOutput: "#10b981",
  triacOutput: "#a855f7",
  ledFill: "#fbbf24",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  inputBattery: {
    x: 38,
    y: 112,
    width: 104,
    height: 360,
    rotate: 0,
  },

  switch: {
    x: 238,
    y: 44,
    width: 133,
    height: 80,
    rotate: 0,
  },

  optocouplerBox: {
    x: 582,
    y: 20,
    width: 457,
    height: 504,
    rotate: 0,
  },

  inputLed: {
    x: 708,
    y: 246,
    width: 66,
    height: 72,
    rotate: 0,
  },

  outputDevice: {
    x: 908,
    y: 112,
    width: 96,
    height: 360,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  inputBattery: scaleComponent(
    BASE_COMPONENT.inputBattery,
    CIRCUIT_COMPONENT_SCALE.inputBattery,
  ),
  switch: scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
  optocouplerBox: scaleComponent(
    BASE_COMPONENT.optocouplerBox,
    CIRCUIT_COMPONENT_SCALE.optocouplerBox,
  ),
  inputLed: scaleComponent(
    BASE_COMPONENT.inputLed,
    CIRCUIT_COMPONENT_SCALE.inputLed,
  ),
  outputDevice: scaleComponent(
    BASE_COMPONENT.outputDevice,
    CIRCUIT_COMPONENT_SCALE.outputDevice,
  ),
} as const;

const NODE = {
  batteryTop: { x: 80, y: 112 },
  batteryBottom: { x: 80, y: 472 },
  batteryPlusPlateLeft: { x: 38, y: 352 },
  batteryPlusPlateRight: { x: 98, y: 352 },
  batteryMinusPlateLeft: { x: 50, y: 378 },
  batteryMinusPlateRight: { x: 92, y: 378 },

  switchLeftContact: { x: 238, y: 112 },
  switchRightContact: { x: 342, y: 112 },
  switchOpenEnd: { x: 371, y: 44 },
  switchArmStart: { x: 248, y: 106 },

  inputTopNode: { x: 518, y: 112 },
  inputBottomNode: { x: 518, y: 472 },

  ledTop: { x: 741, y: 246 },
  ledBottom: { x: 741, y: 318 },
  ledReturn: { x: 741, y: 472 },

  isolationX: 810,

  transistorBase: { x: 917, y: 224 },
  transistorMid: { x: 917, y: 254 },
  transistorLow: { x: 917, y: 318 },
  transistorEmitter: { x: 959, y: 359 },
  transistorCollector: { x: 956, y: 224 },
  outputTop: { x: 956, y: 112 },
  outputBottom: { x: 959, y: 472 },

  photodiodeTop: { x: 956, y: 220 },
  photodiodeBottom: { x: 956, y: 320 },

  outputSupplyTop: { x: 1537, y: 112 },
  outputSupplyBottom: { x: 1537, y: 472 },

  acTop: { x: 1465, y: 112 },
  acInputTop: { x: 1465, y: 214 },
  acBottom: { x: 1465, y: 472 },
  acInputBottom: { x: 1465, y: 370 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryVertical: [NODE.batteryTop, NODE.batteryBottom],
  inputTopToSwitch: [NODE.batteryTop, NODE.switchLeftContact],
  switchToOptoInput: [
    NODE.switchRightContact,
    { x: 353, y: 112 },
    { x: 741, y: 112 },
  ],
  ledTopDrop: [{ x: 741, y: 112 }, NODE.ledTop],
  ledBottomDrop: [NODE.ledBottom, NODE.ledReturn],
  inputReturn: [NODE.batteryBottom, NODE.ledReturn],

  transistorBody: [
    { x: 917, y: 224 },
    { x: 917, y: 346 },
  ],

  transistorCollectorLead: [NODE.transistorCollector, NODE.outputTop],

  transistorEmitterLead: [NODE.transistorEmitter, NODE.outputBottom],

  photodiodeTopLead: [NODE.outputTop, NODE.photodiodeTop],

  photodiodeBottomLead: [NODE.photodiodeBottom, NODE.outputBottom],
} as const;

const PATH = {
  inputFlow: "M80 112 H741 V472 H80 V112",

  transistorFlow: "M1537 112 H956 V224 L917 254 V318 L959 359 V472 H1537 V112",

  photodiodeFlow: "M1537 112 H956 V220 L908 220 L956 310 V472 H1537 V112",

  triacFlow:
    "M1465 214 V112 H956 V194 M956 332 V472 H1240 M1360 472 H1465 V370",
} as const;

const LABEL = {
  input: { x: 220, y: 397 },
  outputAc: { x: 1540, y: 366 },
  outputDc: { x: 1607, y: 366 },
  plus: { x: 26, y: 326 },
  minus: { x: 28, y: 437 },
  pin1: { x: 505, y: 179 },
  pin2: { x: 505, y: 432 },
  pin3: { x: 1060, y: 179 },
  pin4: { x: 1068, y: 432 },
} as const;

function WirePath({
  points,
  width = WIRE.width,
}: {
  points: readonly Point[];
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function InputBattery() {
  return (
    <g>
      <WirePath points={WIRE.batteryVertical} />

      <line
        x1={NODE.batteryPlusPlateLeft.x}
        y1={NODE.batteryPlusPlateLeft.y}
        x2={NODE.batteryPlusPlateRight.x}
        y2={NODE.batteryPlusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="9"
      />

      <line
        x1={NODE.batteryMinusPlateLeft.x}
        y1={NODE.batteryMinusPlateLeft.y}
        x2={NODE.batteryMinusPlateRight.x}
        y2={NODE.batteryMinusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <text x={LABEL.plus.x} y={LABEL.plus.y} fontSize="46" fontFamily="Arial">
        +
      </text>

      <text
        x={LABEL.minus.x}
        y={LABEL.minus.y}
        fontSize="46"
        fontFamily="Arial"
      >
        -
      </text>
    </g>
  );
}

function InputSwitch({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.inputTopToSwitch} />

      <circle
        cx={NODE.switchLeftContact.x}
        cy={NODE.switchLeftContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <circle
        cx={NODE.switchRightContact.x}
        cy={NODE.switchRightContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.line
        x1={NODE.switchArmStart.x}
        y1={NODE.switchArmStart.y}
        x2={active ? NODE.switchRightContact.x : NODE.switchOpenEnd.x}
        y2={active ? NODE.switchRightContact.y : NODE.switchOpenEnd.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />

      <WirePath points={WIRE.switchToOptoInput} />

      <circle
        cx={NODE.inputTopNode.x}
        cy={NODE.inputTopNode.y}
        r="12"
        fill="black"
      />
    </g>
  );
}

function OptocouplerFrame() {
  return (
    <g>
      <rect
        x={COMPONENT.optocouplerBox.x}
        y={COMPONENT.optocouplerBox.y}
        width={COMPONENT.optocouplerBox.width}
        height={COMPONENT.optocouplerBox.height}
        fill="none"
        stroke={STYLE.box}
        strokeWidth="5"
      />

      <line
        x1={NODE.isolationX}
        y1="22"
        x2={NODE.isolationX}
        y2="520"
        stroke={STYLE.wire}
        strokeWidth="4"
        strokeDasharray="32 14"
      />
    </g>
  );
}

function InputLed({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.ledTopDrop} />

      <motion.polygon
        points="708,246 774,246 741,308"
        fill={active ? STYLE.ledFill : "none"}
        stroke={STYLE.wire}
        strokeWidth="6"
        animate={{ opacity: active ? [0.7, 1, 0.7] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      <line
        x1="708"
        y1="318"
        x2="774"
        y2="318"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <WirePath points={WIRE.ledBottomDrop} />

      <motion.g
        animate={{ opacity: active ? [0.3, 1, 0.3] : 0.15 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <line
          x1="761"
          y1="287"
          x2="812"
          y2="254"
          stroke={STYLE.wire}
          strokeWidth="5"
        />
        <polygon points="801,248 821,253 807,265" fill={STYLE.wire} />

        <line
          x1="779"
          y1="313"
          x2="830"
          y2="280"
          stroke={STYLE.wire}
          strokeWidth="5"
        />
        <polygon points="819,274 839,279 825,291" fill={STYLE.wire} />
      </motion.g>
    </g>
  );
}

function PhototransistorOutput() {
  return (
    <g>
      <line
        x1="917"
        y1="224"
        x2="917"
        y2="346"
        stroke={STYLE.wire}
        strokeWidth="8"
      />
      <line
        x1="917"
        y1="254"
        x2="956"
        y2="224"
        stroke={STYLE.wire}
        strokeWidth="7"
      />
      <line
        x1="917"
        y1="318"
        x2="959"
        y2="359"
        stroke={STYLE.wire}
        strokeWidth="7"
      />
      <polygon points="944,336 966,357 941,362" fill={STYLE.wire} />
      <WirePath points={WIRE.transistorCollectorLead} />
      <WirePath points={WIRE.transistorEmitterLead} />
    </g>
  );
}

function PhotodiodeOutput({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.photodiodeTopLead} />

      <polygon
        points="908,220 1004,220 956,310"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <line
        x1="908"
        y1="320"
        x2="1004"
        y2="320"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <WirePath points={WIRE.photodiodeBottomLead} />

      <motion.g
        animate={{ opacity: active ? [0.3, 1, 0.3] : 0.15 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <line
          x1="850"
          y1="255"
          x2="902"
          y2="235"
          stroke={STYLE.wire}
          strokeWidth="5"
        />
        <polygon points="893,227 912,231 898,246" fill={STYLE.wire} />

        <line
          x1="855"
          y1="305"
          x2="905"
          y2="288"
          stroke={STYLE.wire}
          strokeWidth="5"
        />
        <polygon points="896,280 915,284 901,299" fill={STYLE.wire} />
      </motion.g>
    </g>
  );
}

function OutputDevice({
  active,
  couplerType,
}: {
  active: boolean;
  couplerType: CouplerType;
}) {
  if (couplerType === "Phototransistor") return <PhototransistorOutput />;
  if (couplerType === "Photodiode") return <PhotodiodeOutput active={active} />;
  return <PhotoTriacSymbol />;
}

function OutputNetwork({
  active,
  isTriac,
}: {
  active: boolean;
  isTriac: boolean;
}) {
  return (
    <>
      {isTriac ? <AcOutputSource /> : <DcOutputSource />}
      {isTriac ? (
        <AcLoadNetwork active={active} />
      ) : (
        <DcLoadNetwork active={active} />
      )}
    </>
  );
}

function FlowLayer({
  active,
  couplerType,
}: {
  active: boolean;
  couplerType: CouplerType;
}) {
  return (
    <>
      <FlowDots
        path={PATH.inputFlow}
        active={active}
        color={STYLE.activeInput}
        count={14}
        duration={2.6}
      />

      {couplerType === "Phototransistor" && (
        <FlowDots
          path={PATH.transistorFlow}
          active={active}
          color={STYLE.activeOutput}
          count={18}
          duration={3.2}
        />
      )}

      {couplerType === "Photodiode" && (
        <FlowDots
          path={PATH.photodiodeFlow}
          active={active}
          color={STYLE.photodiodeOutput}
          count={15}
          duration={3.1}
        />
      )}

      {couplerType === "PhotoTRIAC" && (
        <AcFlowDots
          path={PATH.triacFlow}
          active={active}
          color={STYLE.triacOutput}
          count={9}
        />
      )}
    </>
  );
}

function PinLabels({ isTriac }: { isTriac: boolean }) {
  return (
    <g>
      <text
        x={LABEL.input.x}
        y={LABEL.input.y}
        fontSize="56"
        fontFamily="Arial"
      >
        INPUT
      </text>

      {isTriac ? (
        <text
          x={LABEL.outputAc.x}
          y={LABEL.outputAc.y}
          fontSize="52"
          fontFamily="Arial"
        >
          AC
        </text>
      ) : (
        <text
          x={LABEL.outputDc.x}
          y={LABEL.outputDc.y}
          fontSize="56"
          fontFamily="Arial"
        >
          Vcc
        </text>
      )}

      <text x={LABEL.pin1.x} y={LABEL.pin1.y} fontSize="64" fontFamily="Arial">
        1
      </text>

      <text x={LABEL.pin2.x} y={LABEL.pin2.y} fontSize="64" fontFamily="Arial">
        2
      </text>

      <text x={LABEL.pin3.x} y={LABEL.pin3.y} fontSize="64" fontFamily="Arial">
        3
      </text>

      <text x={LABEL.pin4.x} y={LABEL.pin4.y} fontSize="64" fontFamily="Arial">
        4
      </text>
    </g>
  );
}

export default function OptocouplerSvg({
  active,
  couplerType,
}: OptocouplerSvgProps) {
  const isTriac = couplerType === "PhotoTRIAC";
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-auto w-full"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="Optocoupler switching circuit schematic"
    >
      <rect width="1688" height="603" fill="#ffffff" />

      <g transform={canvasTransform}>
        <InputBattery />

        <InputSwitch active={active} />

        <OptocouplerFrame />

        <InputLed active={active} />

        <OutputDevice active={active} couplerType={couplerType} />

        <OutputNetwork active={active} isTriac={isTriac} />

        <WirePath points={WIRE.inputReturn} />

        <circle
          cx={NODE.inputBottomNode.x}
          cy={NODE.inputBottomNode.y}
          r="12"
          fill="black"
        />

        <FlowLayer active={active} couplerType={couplerType} />

        <PinLabels isTriac={isTriac} />
      </g>
    </svg>
  );
}
