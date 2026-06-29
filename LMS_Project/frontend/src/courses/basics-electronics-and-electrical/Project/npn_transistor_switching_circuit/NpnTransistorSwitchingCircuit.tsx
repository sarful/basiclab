"use client";

import { formatNumber } from "../../Learning_transistor/04_transistor_types_interactive_simulation/logic";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import NPNTransistorSymbol from "../library/electronics-symbol-library/transistors/NPNTransistorSymbol";

const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 700;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const STYLE = {
  wire: "#111827",
  text: "#111827",
  boardBorder: "#dbe3ef",
  background: "#ffffff",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type NpnTransistorSwitchingCircuitProps = {
  batteryVoltage?: number;
  rbOhms?: number;
  rpdOhms?: number;
  rLedOhms?: number;
  ledBrightness?: number;
  basePathActive?: boolean;
  loadPathActive?: boolean;
};

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function formatOhmsCompact(value: number) {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 1)}kOhm`;
  }

  return `${formatNumber(value, 0)}Ohm`;
}

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

const BASE_COMPONENT = {
  source: { x: 58, y: 210, width: 110, height: 150, rotate: 0 },
  ledResistor: { x: 650, y: 40, width: 170, height: 130, rotate: 90 },
  led: { x: 658, y: 145, width: 130, height: 110, rotate: 90 },
  transistor: { x: 0, y: 0, width: 180, height: 200, rotate: 0 },
  button: { x: 300, y: 40, width: 190, height: 130, rotate: 90 },
  baseResistor: { x: 300, y: 150, width: 150, height: 120, rotate: 90 },
  pullDownResistor: { x: 400, y: 320, width: 150, height: 120, rotate: 90 },
} as const satisfies Record<string, ComponentBox>;

const TRANSISTOR_COLLECTOR_TARGET = { x: 649, y: 280 } as const;

const TRANSISTOR_OFFSET = {
  collectorX: ((30 + 10) / 71) * BASE_COMPONENT.transistor.width,
  collectorY: ((0 + 10) / 81) * BASE_COMPONENT.transistor.height,
} as const;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, 1),
  ledResistor: scaleComponent(BASE_COMPONENT.ledResistor, 1),
  led: scaleComponent(BASE_COMPONENT.led, 1),
  transistor: scaleComponent(
    {
      ...BASE_COMPONENT.transistor,
      x: TRANSISTOR_COLLECTOR_TARGET.x - TRANSISTOR_OFFSET.collectorX,
      y: TRANSISTOR_COLLECTOR_TARGET.y - TRANSISTOR_OFFSET.collectorY,
    },
    1,
  ),
  button: scaleComponent(BASE_COMPONENT.button, 1),
  baseResistor: scaleComponent(BASE_COMPONENT.baseResistor, 1),
  pullDownResistor: scaleComponent(BASE_COMPONENT.pullDownResistor, 1),
} as const;

const NODE = {
  positiveRailY: 100,
  positiveRailEndX: 650,
  negativeRailY: 530,
  sourcePositiveTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + (39 / 160) * COMPONENT.source.height,
  },
  sourceNegativeTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + (125 / 190) * COMPONENT.source.height,
  },
  ledResistorTerminal1: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.ledResistor.y + 110,
  },
  ledResistorTerminal2: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.ledResistor.y + 100,
  },
  ledAnode: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.led.y,
  },
  ledCathode: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.led.y + 78,
  },
  transistorCollector: TRANSISTOR_COLLECTOR_TARGET,
  transistorBase: {
    x: COMPONENT.transistor.x + ((3 + 10) / 71) * COMPONENT.transistor.width,
    y: COMPONENT.transistor.y + ((30 + 10) / 80) * COMPONENT.transistor.height,
  },
  transistorEmitter: {
    x: COMPONENT.transistor.x + ((30 + 10) / 71) * COMPONENT.transistor.width,
    y: COMPONENT.transistor.y + ((60 + 10) / 81) * COMPONENT.transistor.height,
  },
  buttonUpperTerminal: {
    x: COMPONENT.button.x,
    y: COMPONENT.button.y + 105,
  },
  buttonLowerTerminal: {
    x: COMPONENT.button.x,
    y: COMPONENT.button.y + 155,
  },
  buttonOutputStub: {
    x: COMPONENT.button.x,
    y: COMPONENT.button.y + 195,
  },
  baseResistorTerminal1: {
    x: COMPONENT.baseResistor.x,
    y: COMPONENT.baseResistor.y + 102,
  },
  baseResistorTerminal2: {
    x: COMPONENT.baseResistor.x,
    y: COMPONENT.baseResistor.y + 160,
  },
  baseNode: {
    x: 370,
    y: COMPONENT.transistor.y + ((30 + 10) / 80) * COMPONENT.transistor.height,
  },
  pullDownTop: {
    x: COMPONENT.pullDownResistor.x,
    y: COMPONENT.pullDownResistor.y + 109,
  },
  pullDownBottom: {
    x: COMPONENT.pullDownResistor.x,
    y: COMPONENT.pullDownResistor.y + 160,
  },
} as const;

const WIRE = {
  width: 1.5,
  sourcePositiveDrop: [
    NODE.sourcePositiveTerminal,
    { x: NODE.sourcePositiveTerminal.x, y: NODE.positiveRailY },
  ],
  positiveRail: [
    { x: NODE.sourcePositiveTerminal.x, y: NODE.positiveRailY },
    { x: NODE.positiveRailEndX, y: NODE.positiveRailY },
    { x: NODE.ledResistorTerminal1.x, y: NODE.positiveRailY },
    NODE.ledResistorTerminal1,
  ],
  ledResistorToLed: [NODE.ledResistorTerminal2, NODE.ledAnode],
  ledToCollector: [NODE.ledCathode, NODE.transistorCollector],
  buttonPositiveFeed: [
    { x: NODE.buttonUpperTerminal.x, y: NODE.positiveRailY },
    NODE.buttonUpperTerminal,
  ],
  buttonToBaseResistor: [
    NODE.buttonLowerTerminal,
    NODE.buttonOutputStub,
    { x: NODE.baseResistorTerminal1.x, y: NODE.buttonOutputStub.y },
    NODE.baseResistorTerminal1,
  ],
  baseResistorToBaseNode: [
    NODE.baseResistorTerminal2,
    { x: NODE.baseResistorTerminal2.x, y: NODE.baseNode.y },
    NODE.baseNode,
    { x: NODE.transistorBase.x, y: NODE.baseNode.y },
  ],
  pullDownBranch: [
    NODE.baseNode,
    { x: NODE.pullDownTop.x, y: NODE.baseNode.y },
    NODE.pullDownTop,
  ],
  sourceNegativeDrop: [
    NODE.sourceNegativeTerminal,
    { x: NODE.sourceNegativeTerminal.x, y: NODE.negativeRailY },
  ],
  negativeRail: [
    { x: NODE.sourceNegativeTerminal.x, y: NODE.negativeRailY },
    { x: NODE.transistorEmitter.x, y: NODE.negativeRailY },
    NODE.transistorEmitter,
  ],
  pullDownReturn: [
    NODE.pullDownBottom,
    { x: NODE.pullDownBottom.x, y: NODE.negativeRailY },
  ],
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function ActiveCurrentPath({
  points,
  active,
  color,
}: {
  points: readonly Point[];
  active: boolean;
  color: string;
}) {
  if (!active) return null;

  return (
    <path
      d={pathD(points)}
      stroke={color}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="10 8"
      opacity={0.95}
    />
  );
}

function SourceBlock() {
  return (
    <svg
      x={COMPONENT.source.x}
      y={COMPONENT.source.y}
      width={COMPONENT.source.width}
      height={COMPONENT.source.height}
      viewBox={`0 0 ${COMPONENT.source.width} ${COMPONENT.source.height}`}
      overflow="visible"
    >
      <DCVoltageSourceV1Symbol
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        label="Vcc DC source"
      />
    </svg>
  );
}

function RotatedResistorBlock({
  component,
  label,
}: {
  component: ComponentBox;
  label: string;
}) {
  return (
    <svg
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      viewBox={`0 0 ${component.width} ${component.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${component.width / 2} ${component.height / 2}) rotate(${component.rotate})`}
      >
        <ResistorSymbol
          width={component.height}
          height={component.width}
          label={label}
        />
      </g>
    </svg>
  );
}

function ButtonBlock() {
  return (
    <svg
      x={COMPONENT.button.x}
      y={COMPONENT.button.y}
      width={COMPONENT.button.width}
      height={COMPONENT.button.height}
      viewBox={`0 0 ${COMPONENT.button.width} ${COMPONENT.button.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.button.width / 2} ${COMPONENT.button.height / 2}) rotate(${COMPONENT.button.rotate})`}
      >
        <SPSTSwitchSymbol
          width={COMPONENT.button.height}
          height={COMPONENT.button.width}
          label="Button"
        />
      </g>
    </svg>
  );
}

function LedGlow({ ledBrightness }: { ledBrightness: number }) {
  if (ledBrightness <= 0) return null;

  const opacity = ledBrightness / 100;
  const centerX = COMPONENT.led.x + COMPONENT.led.width / 2;
  const centerY = COMPONENT.led.y + COMPONENT.led.height / 2;

  return (
    <g>
      <circle
        cx={centerX}
        cy={centerY}
        r={42}
        fill={`rgba(251, 191, 36, ${0.16 * opacity})`}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={28}
        fill={`rgba(250, 204, 21, ${0.24 * opacity})`}
      />
    </g>
  );
}

function LedBlock() {
  return (
    <svg
      x={COMPONENT.led.x}
      y={COMPONENT.led.y}
      width={COMPONENT.led.width}
      height={COMPONENT.led.height}
      viewBox={`0 0 ${COMPONENT.led.width} ${COMPONENT.led.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.led.width / 2} ${COMPONENT.led.height / 2}) rotate(${COMPONENT.led.rotate})`}
      >
        <LEDSymbol
          width={COMPONENT.led.height}
          height={COMPONENT.led.width}
          label="LED"
        />
      </g>
    </svg>
  );
}

function TransistorBlock() {
  return (
    <svg
      x={COMPONENT.transistor.x}
      y={COMPONENT.transistor.y}
      width={COMPONENT.transistor.width}
      height={COMPONENT.transistor.height}
      viewBox={`0 0 ${COMPONENT.transistor.width} ${COMPONENT.transistor.height}`}
      overflow="visible"
    >
      <NPNTransistorSymbol
        width={COMPONENT.transistor.width}
        height={COMPONENT.transistor.height}
        label="Q1 2N3904"
      />
    </svg>
  );
}

function DynamicTextLabels({
  batteryVoltage,
  rbOhms,
  rpdOhms,
  rLedOhms,
}: {
  batteryVoltage: number;
  rbOhms: number;
  rpdOhms: number;
  rLedOhms: number;
}) {
  return (
    <g
      fill={STYLE.text}
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      textAnchor="start"
    >
      <text x={COMPONENT.source.x + 18} y={COMPONENT.source.y + 14} fontSize="18">
        {formatNumber(batteryVoltage, 1)}V
      </text>

      <text x={COMPONENT.ledResistor.x + 34} y={COMPONENT.ledResistor.y + 68} fontSize="18">
        R_LED
      </text>
      <text x={COMPONENT.ledResistor.x + 34} y={COMPONENT.ledResistor.y + 92} fontSize="16">
        {formatOhmsCompact(rLedOhms)}
      </text>

      <text x={COMPONENT.baseResistor.x + 30} y={COMPONENT.baseResistor.y + 64} fontSize="18">
        RB
      </text>
      <text x={COMPONENT.baseResistor.x + 30} y={COMPONENT.baseResistor.y + 88} fontSize="16">
        {formatOhmsCompact(rbOhms)}
      </text>

      <text x={COMPONENT.pullDownResistor.x + 44} y={COMPONENT.pullDownResistor.y + 54} fontSize="18">
        RPD
      </text>
      <text x={COMPONENT.pullDownResistor.x + 44} y={COMPONENT.pullDownResistor.y + 82} fontSize="16">
        {formatOhmsCompact(rpdOhms)}
      </text>
    </g>
  );
}

function WireLayer() {
  return (
    <g>
      <WirePath points={WIRE.sourcePositiveDrop} />
      <WirePath points={WIRE.positiveRail} />
      <WirePath points={WIRE.ledResistorToLed} />
      <WirePath points={WIRE.ledToCollector} />
      <WirePath points={WIRE.buttonPositiveFeed} />
      <WirePath points={WIRE.buttonToBaseResistor} />
      <WirePath points={WIRE.baseResistorToBaseNode} />
      <WirePath points={WIRE.pullDownBranch} />
      <WirePath points={WIRE.sourceNegativeDrop} />
      <WirePath points={WIRE.negativeRail} />
      <WirePath points={WIRE.pullDownReturn} />
    </g>
  );
}

function CurrentFlowOverlay({
  basePathActive,
  loadPathActive,
}: {
  basePathActive: boolean;
  loadPathActive: boolean;
}) {
  const transistorConduction = [
    NODE.transistorCollector,
    {
      x: COMPONENT.transistor.x + 88,
      y: COMPONENT.transistor.y + 132,
    },
    NODE.transistorEmitter,
  ] as const;

  const baseFlow = [
    ...WIRE.buttonPositiveFeed,
    ...WIRE.buttonToBaseResistor.slice(1),
    ...WIRE.baseResistorToBaseNode,
    NODE.transistorBase,
    {
      x: COMPONENT.transistor.x + 90,
      y: COMPONENT.transistor.y + 134,
    },
    NODE.transistorEmitter,
  ] as const;

  const loadFlow = [
    ...WIRE.sourcePositiveDrop,
    ...WIRE.positiveRail.slice(1),
    ...WIRE.ledResistorToLed,
    ...WIRE.ledToCollector,
    ...transistorConduction.slice(1),
    { x: NODE.transistorEmitter.x, y: NODE.negativeRailY },
    { x: NODE.sourceNegativeTerminal.x, y: NODE.negativeRailY },
  ] as const;

  return (
    <g>
      <ActiveCurrentPath points={baseFlow} active={basePathActive} color="#2563eb" />
      <ActiveCurrentPath points={loadFlow} active={loadPathActive} color="#f97316" />
    </g>
  );
}

export default function NpnTransistorSwitchingCircuit({
  batteryVoltage = 5,
  rbOhms = 10000,
  rpdOhms = 100000,
  rLedOhms = 1000,
  ledBrightness = 0,
  basePathActive = false,
  loadPathActive = false,
}: NpnTransistorSwitchingCircuitProps) {
  return (
    <div
      style={{
        background: STYLE.background,
        borderRadius: 24,
        border: `1px solid ${STYLE.boardBorder}`,
        padding: 16,
        minHeight: VIEW_BOX_HEIGHT,
        width: "100%",
      }}
    >
      <svg
        width={VIEW_BOX_WIDTH}
        height={VIEW_BOX_HEIGHT}
        viewBox={VIEW_BOX}
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="NPN transistor switching circuit with 5V DC source and power rails"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${VIEW_BOX_WIDTH}px`,
          height: "auto",
          margin: "0 auto",
        }}
      >
        <WireLayer />
        <CurrentFlowOverlay
          basePathActive={basePathActive}
          loadPathActive={loadPathActive}
        />

        <SourceBlock />

        <RotatedResistorBlock component={COMPONENT.ledResistor} label="Resistor" />
        <LedGlow ledBrightness={ledBrightness} />
        <LedBlock />
        <TransistorBlock />
        <ButtonBlock />
        <RotatedResistorBlock component={COMPONENT.baseResistor} label="Base resistor" />
        <RotatedResistorBlock component={COMPONENT.pullDownResistor} label="Pull-down resistor" />

        <DynamicTextLabels
          batteryVoltage={batteryVoltage}
          rbOhms={rbOhms}
          rpdOhms={rpdOhms}
          rLedOhms={rLedOhms}
        />
      </svg>
    </div>
  );
}
