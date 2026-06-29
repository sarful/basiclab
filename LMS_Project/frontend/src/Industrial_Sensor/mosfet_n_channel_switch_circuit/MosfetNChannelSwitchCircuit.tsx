"use client";

import BackgroundPixelGred from "../../library/background_pixel_gred";
import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import NChannelMosfetSymbol from "../../library/electronics-symbol-library/mosfets/NChannelMosfetSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";

const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 700;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  gateResistor: 1,
  switch: 1,
  ledResistor: 1,
  led: 1,
  mosfet: 1,
} as const;

const BASE_WIRE_WIDTH = 1.6;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  wire: "#111827",
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
  source: { x: 64, y: 210, width: 110, height: 150, rotate: 0 },
  gateResistor: { x: 340, y: 120, width: 150, height: 120, rotate: 90 },
  switch: { x: 340.5, y: 320, width: 190, height: 130, rotate: 90 },
  ledResistor: { x: 626, y: 28, width: 150, height: 120, rotate: 90 },
  led: { x: 634, y: 170, width: 130, height: 110, rotate: 90 },
  mosfet: { x: 500, y: 265, width: 190, height: 240, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  gateResistor: scaleComponent(
    BASE_COMPONENT.gateResistor,
    CIRCUIT_COMPONENT_SCALE.gateResistor,
  ),
  switch: scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
  ledResistor: scaleComponent(
    BASE_COMPONENT.ledResistor,
    CIRCUIT_COMPONENT_SCALE.ledResistor,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
  mosfet: scaleComponent(BASE_COMPONENT.mosfet, CIRCUIT_COMPONENT_SCALE.mosfet),
} as const;

const NODE = {
  positiveRailY: 96,
  negativeRailY: 580,

  sourceTerminalX: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,

  sourcePositiveTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + 35,
  },

  sourceNegativeTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + COMPONENT.source.height - 45,
  },

  ledResistorTerminalX: COMPONENT.ledResistor.x + 76.46,

  ledResistorTopTerminal: {
    x: COMPONENT.ledResistor.x + 76.46,
    y: COMPONENT.ledResistor.y + 90,
  },

  ledResistorBottomTerminal: {
    x: COMPONENT.ledResistor.x + 76.46,
    y: COMPONENT.ledResistor.y + 151.76,
  },

  ledTopTerminal: {
    x: COMPONENT.led.x + 86.45,
    y: COMPONENT.led.y + 80,
  },

  mosfetGate: {
    x: COMPONENT.mosfet.x + ((0 + 10) / 61) * COMPONENT.mosfet.width,
    y: COMPONENT.mosfet.y + ((25 + 10) / 71) * COMPONENT.mosfet.height,
  },

  mosfetSource: {
    x: COMPONENT.mosfet.x + ((30 + 10) / 61) * COMPONENT.mosfet.width,
    y: COMPONENT.mosfet.y + ((50 + 10) / 71) * COMPONENT.mosfet.height,
  },

  gateResistorTerminalX: COMPONENT.gateResistor.x + 76.46,

  gateResistorTopTerminal: {
    x: COMPONENT.gateResistor.x + 76.46,
    y: COMPONENT.gateResistor.y + 16.13,
  },

  switchTerminalX: COMPONENT.switch.x - 0.5,

  switchUpperTerminal: {
    x: COMPONENT.switch.x - 0.5,
    y: COMPONENT.switch.y + 150,
  },

  switchLowerTerminal: {
    x: COMPONENT.switch.x - 0.5,
    y: COMPONENT.switch.y + 62.1,
  },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourcePositiveDrop: [
    NODE.sourcePositiveTerminal,
    { x: NODE.sourceTerminalX, y: NODE.positiveRailY },
  ],

  positiveRail: [
    { x: NODE.sourceTerminalX, y: NODE.positiveRailY },
    { x: NODE.ledResistorTerminalX, y: NODE.positiveRailY },
  ],

  sourceNegativeDrop: [
    NODE.sourceNegativeTerminal,
    { x: NODE.sourceTerminalX, y: NODE.negativeRailY },
  ],

  negativeRail: [
    { x: NODE.sourceTerminalX, y: NODE.negativeRailY },
    { x: NODE.mosfetSource.x, y: NODE.negativeRailY },
  ],

  mosfetSourceReturn: [
    { x: NODE.mosfetSource.x + 1, y: NODE.mosfetSource.y - 90 },
    { x: NODE.mosfetSource.x + 1, y: NODE.negativeRailY },
  ],

  ledResistorFeed: [
    { x: NODE.ledResistorTerminalX, y: NODE.positiveRailY },
    NODE.ledResistorTopTerminal,
  ],

  ledResistorToLed: [NODE.ledResistorBottomTerminal, NODE.ledTopTerminal],

  gatePositiveFeed: [
    { x: NODE.gateResistorTerminalX - 77, y: NODE.positiveRailY },
    {
      x: NODE.gateResistorTerminalX - 77,
      y: NODE.gateResistorTopTerminal.y + 70,
    },
  ],

  switchToGateNodeVertical: [
    {
      x: NODE.switchTerminalX,
      y: NODE.switchLowerTerminal.y - 99,
    },
    {
      x: NODE.switchTerminalX,
      y: NODE.mosfetGate.y - 40,
    },
  ],

  switchToGateNodeHorizontal: [
    {
      x: NODE.switchTerminalX,
      y: NODE.mosfetGate.y - 63,
    },
    {
      x: NODE.gateResistorTerminalX + 130,
      y: NODE.mosfetGate.y - 63,
    },
  ],

  switchToNegativeRail: [
    {
      x: NODE.switchTerminalX,
      y: NODE.switchUpperTerminal.y,
    },
    {
      x: NODE.switchTerminalX,
      y: NODE.negativeRailY,
    },
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
        label="VDD source"
      />
    </svg>
  );
}

function GateResistorBlock() {
  return (
    <svg
      x={COMPONENT.gateResistor.x}
      y={COMPONENT.gateResistor.y}
      width={COMPONENT.gateResistor.width}
      height={COMPONENT.gateResistor.height}
      viewBox={`0 0 ${COMPONENT.gateResistor.width} ${COMPONENT.gateResistor.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.gateResistor.width / 2} ${
          COMPONENT.gateResistor.height / 2
        }) rotate(${COMPONENT.gateResistor.rotate})`}
      >
        <ResistorSymbol
          width={COMPONENT.gateResistor.height}
          height={COMPONENT.gateResistor.width}
          label="RG"
        />
      </g>
    </svg>
  );
}

function SwitchBlock() {
  return (
    <svg
      x={COMPONENT.switch.x}
      y={COMPONENT.switch.y}
      width={COMPONENT.switch.width}
      height={COMPONENT.switch.height}
      viewBox={`0 0 ${COMPONENT.switch.width} ${COMPONENT.switch.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.switch.width / 2} ${
          COMPONENT.switch.height / 2
        }) rotate(${COMPONENT.switch.rotate})`}
      >
        <SPSTSwitchSymbol
          width={COMPONENT.switch.height}
          height={COMPONENT.switch.width}
          label="SW1"
        />
      </g>
    </svg>
  );
}

function LedResistorBlock() {
  return (
    <svg
      x={COMPONENT.ledResistor.x}
      y={COMPONENT.ledResistor.y}
      width={COMPONENT.ledResistor.width}
      height={COMPONENT.ledResistor.height}
      viewBox={`0 0 ${COMPONENT.ledResistor.width} ${COMPONENT.ledResistor.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.ledResistor.width / 2} ${
          COMPONENT.ledResistor.height / 2
        }) rotate(${COMPONENT.ledResistor.rotate})`}
      >
        <ResistorSymbol
          width={COMPONENT.ledResistor.height}
          height={COMPONENT.ledResistor.width}
          label="RLED"
        />
      </g>
    </svg>
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
        transform={`translate(${COMPONENT.led.width / 2} ${
          COMPONENT.led.height / 2
        }) rotate(${COMPONENT.led.rotate})`}
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

function MosfetBlock() {
  return (
    <svg
      x={COMPONENT.mosfet.x}
      y={COMPONENT.mosfet.y}
      width={COMPONENT.mosfet.width}
      height={COMPONENT.mosfet.height}
      viewBox={`0 0 ${COMPONENT.mosfet.width} ${COMPONENT.mosfet.height}`}
      overflow="visible"
    >
      <NChannelMosfetSymbol
        width={COMPONENT.mosfet.width}
        height={COMPONENT.mosfet.height}
        label="Q1 P-Channel MOSFET"
      />
    </svg>
  );
}

function WireLayer() {
  return (
    <g>
      <WirePath points={WIRE.sourcePositiveDrop} />
      <WirePath points={WIRE.positiveRail} />
      <WirePath points={WIRE.sourceNegativeDrop} />
      <WirePath points={WIRE.negativeRail} />
      <WirePath points={WIRE.mosfetSourceReturn} />
      <WirePath points={WIRE.ledResistorFeed} />
      <WirePath points={WIRE.ledResistorToLed} />
      <WirePath points={WIRE.gatePositiveFeed} />
      <WirePath points={WIRE.switchToGateNodeVertical} />
      <WirePath points={WIRE.switchToGateNodeHorizontal} />
      <WirePath points={WIRE.switchToNegativeRail} />
    </g>
  );
}

export default function MosfetPChannelSwitchCircuit() {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

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
        aria-label="MOSFET P channel switch circuit"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${VIEW_BOX_WIDTH}px`,
          height: "auto",
          margin: "0 auto",
        }}
      >
        <BackgroundPixelGred
          width={VIEW_BOX_WIDTH}
          height={VIEW_BOX_HEIGHT}
          backgroundColor={STYLE.background}
          minor={20}
          major={100}
          showLabels
          showBorder
          borderColor={STYLE.boardBorder}
          borderStrokeWidth={1}
        />

        <g transform={canvasTransform}>
          <WireLayer />
          <SourceBlock />
          <GateResistorBlock />
          <SwitchBlock />
          <LedResistorBlock />
          <LedBlock />
          <MosfetBlock />
        </g>
      </svg>
    </div>
  );
}
