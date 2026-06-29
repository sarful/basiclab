"use client";

import BackgroundPixelGred from "../library/background_pixel_gred";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import PChannelMosfetSymbol from "../library/electronics-symbol-library/mosfets/PChannelMosfetSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";

const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 700;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  switch: 1,
  pullUpResistor: 1,
  ledResistor: 1,
  led: 1,
  transistor: 1,
} as const;

const BASE_WIRE_WIDTH = 1.6;
const CIRCUIT_WIRE_SCALE = 1;

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

const RIGHT_BRANCH_OFFSET_X = 40;

const BASE_COMPONENT = {
  source: { x: 64, y: 210, width: 110, height: 150, rotate: 0 },
  switch: { x: 340, y: 300, width: 190, height: 130, rotate: 90 },
  pullUpResistor: { x: 340, y: 20, width: 150, height: 180, rotate: 90 },
  ledResistor: {
    x: 580 + RIGHT_BRANCH_OFFSET_X,
    y: 20,
    width: 150,
    height: 120,
    rotate: 90,
  },
  led: {
    x: 443 + RIGHT_BRANCH_OFFSET_X,
    y: 230,
    width: 130,
    height: 110,
    rotate: -90,
  },
  transistor: { x: 0, y: 0, width: 200, height: 200, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const TRANSISTOR_EMITTER_TARGET = {
  x: 580 + RIGHT_BRANCH_OFFSET_X,
  y: 440,
} as const;

const TRANSISTOR_OFFSET = {
  emitterX: ((30 + 10) / 71) * BASE_COMPONENT.transistor.width,
  emitterY: ((60 + 10) / 81) * BASE_COMPONENT.transistor.height,
} as const;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),

  switch: scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),

  pullUpResistor: scaleComponent(
    BASE_COMPONENT.pullUpResistor,
    CIRCUIT_COMPONENT_SCALE.pullUpResistor,
  ),

  ledResistor: scaleComponent(
    BASE_COMPONENT.ledResistor,
    CIRCUIT_COMPONENT_SCALE.ledResistor,
  ),

  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),

  transistor: scaleComponent(
    {
      ...BASE_COMPONENT.transistor,
      x: TRANSISTOR_EMITTER_TARGET.x - TRANSISTOR_OFFSET.emitterX,
      y: TRANSISTOR_EMITTER_TARGET.y - TRANSISTOR_OFFSET.emitterY,
    },
    CIRCUIT_COMPONENT_SCALE.transistor,
  ),
} as const;

const NODE = {
  positiveRailY: 96,
  negativeRailY: 560,

  sourceTerminalX: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,

  sourcePositiveTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + 35,
  },

  sourceNegativeTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + COMPONENT.source.height - 45,
  },

  transistorBase: {
    x: COMPONENT.transistor.x + ((4 + 10) / 71) * COMPONENT.transistor.width,
    y:
      COMPONENT.transistor.y + ((30.5 + 10) / 81) * COMPONENT.transistor.height,
  },

  transistorCollector: {
    x: COMPONENT.transistor.x + ((10 + 10) / 71) * COMPONENT.transistor.width,
    y: COMPONENT.transistor.y + ((10 + 10) / 81) * COMPONENT.transistor.height,
  },

  transistorEmitter: {
    x: COMPONENT.transistor.x + ((30 + 10) / 71) * COMPONENT.transistor.width,
    y: COMPONENT.transistor.y + ((10 - 88) / 91) * COMPONENT.transistor.height,
  },

  ledTopTerminal: {
    x: COMPONENT.led.x + 86.45,
    y: COMPONENT.led.y,
  },

  ledBottomTerminal: {
    x: COMPONENT.led.x + 86.45,
    y: COMPONENT.led.y + 104.51,
  },

  ledResistorTerminalX: COMPONENT.ledResistor.x + 76.46,

  ledResistorTopTerminal: {
    x: COMPONENT.ledResistor.x + 76.46,
    y: COMPONENT.ledResistor.y + 16.13,
  },

  ledResistorBottomTerminal: {
    x: COMPONENT.ledResistor.x + 76.46,
    y: COMPONENT.ledResistor.y + 111.76,
  },

  pullUpTerminalX: COMPONENT.pullUpResistor.x,

  pullUpTopTerminal: {
    x: COMPONENT.pullUpResistor.x,
    y: COMPONENT.pullUpResistor.y + 130,
  },

  pullUpBottomTerminal: {
    x: COMPONENT.pullUpResistor.x,
    y: COMPONENT.pullUpResistor.y + 240,
  },

  buttonTerminalX: COMPONENT.switch.x,

  buttonUpperTerminal: {
    x: COMPONENT.switch.x,
    y: COMPONENT.switch.y + 150,
  },

  buttonLowerTerminal: {
    x: COMPONENT.switch.x,
    y: COMPONENT.switch.y + 62.1,
  },
} as const;

const NODE_EXTRA = {
  baseNode: {
    x: NODE.pullUpTerminalX,
    y: NODE.transistorBase.y,
  },

  loadReturnX: NODE.ledResistorTerminalX - 77,

  collectorLoadX: NODE.transistorCollector.x + 57,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourcePositiveDrop: [
    NODE.sourcePositiveTerminal,
    { x: NODE.sourceTerminalX, y: NODE.positiveRailY },
  ],

  positiveRailToEmitter: [
    { x: NODE.sourceTerminalX, y: NODE.positiveRailY },
    { x: NODE.transistorEmitter.x, y: NODE.positiveRailY },
    NODE.transistorEmitter,
  ],

  sourceNegativeDrop: [
    NODE.sourceNegativeTerminal,
    { x: NODE.sourceTerminalX, y: NODE.negativeRailY },
  ],

  negativeRail: [
    { x: NODE.sourceTerminalX, y: NODE.negativeRailY },
    { x: NODE_EXTRA.loadReturnX, y: NODE.negativeRailY },
  ],

  loadReturnDrop: [
    {
      x: NODE_EXTRA.loadReturnX,
      y: NODE.ledResistorBottomTerminal.y + 300,
    },
    { x: NODE_EXTRA.loadReturnX, y: NODE.negativeRailY },
  ],

  collectorToLedLower: [
    {
      x: NODE_EXTRA.collectorLoadX,
      y: NODE.transistorCollector.y - 5,
    },
    {
      x: NODE_EXTRA.collectorLoadX,
      y: NODE.ledBottomTerminal.y - 70,
    },
  ],

  collectorToLedUpper: [
    {
      x: NODE_EXTRA.collectorLoadX,
      y: NODE.transistorCollector.y - 120,
    },
    {
      x: NODE_EXTRA.collectorLoadX,
      y: NODE.ledBottomTerminal.y - 180,
    },
  ],

  pullUpToPositiveRail: [
    NODE.pullUpTopTerminal,
    { x: NODE.pullUpTerminalX, y: NODE.positiveRailY },
  ],

  pullUpToBaseNode: [
    NODE.pullUpBottomTerminal,
    { x: NODE.pullUpTerminalX, y: NODE_EXTRA.baseNode.y },
  ],

  baseNodeToTransistor: [
    NODE_EXTRA.baseNode,
    { x: NODE.transistorBase.x, y: NODE_EXTRA.baseNode.y },
  ],

  buttonToBaseNode: [
    NODE.buttonLowerTerminal,
    {
      x: NODE.buttonTerminalX,
      y: NODE_EXTRA.baseNode.y + 40,
    },
  ],

  buttonToNegativeRail: [
    NODE.buttonUpperTerminal,
    { x: NODE.buttonTerminalX, y: NODE.negativeRailY },
  ],
} as const;

const LABEL = {
  pullUp: {
    name: {
      x: COMPONENT.pullUpResistor.x + 34,
      y: COMPONENT.pullUpResistor.y + 62,
    },
    value: {
      x: COMPONENT.pullUpResistor.x + 34,
      y: COMPONENT.pullUpResistor.y + 88,
    },
  },

  ledResistor: {
    name: {
      x: COMPONENT.ledResistor.x + 36,
      y: COMPONENT.ledResistor.y + 64,
    },
    value: {
      x: COMPONENT.ledResistor.x + 36,
      y: COMPONENT.ledResistor.y + 88,
    },
  },

  transistor: {
    name: {
      x: COMPONENT.transistor.x + 144,
      y: COMPONENT.transistor.y + 102,
    },
    model: {
      x: COMPONENT.transistor.x + 144,
      y: COMPONENT.transistor.y + 126,
    },
  },
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
        label="Vcc source"
      />
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
        transform={`translate(${component.width / 2} ${
          component.height / 2
        }) rotate(${component.rotate})`}
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

function TransistorBlock() {
  return (
    <g>
      <svg
        x={COMPONENT.transistor.x}
        y={COMPONENT.transistor.y}
        width={COMPONENT.transistor.width}
        height={COMPONENT.transistor.height}
        viewBox={`0 0 ${COMPONENT.transistor.width} ${COMPONENT.transistor.height}`}
        overflow="visible"
      >
        <PChannelMosfetSymbol
          width={COMPONENT.transistor.width}
          height={COMPONENT.transistor.height}
          label="Q1 PNP transistor"
        />
      </svg>

      <text
        x={LABEL.transistor.name.x}
        y={LABEL.transistor.name.y}
        fontSize="20"
        fontWeight="700"
        fill={STYLE.text}
      >
        Q1
      </text>

      <text
        x={LABEL.transistor.model.x}
        y={LABEL.transistor.model.y}
        fontSize="18"
        fontWeight="700"
        fill={STYLE.text}
      >
        PNP
      </text>
    </g>
  );
}

function TextLabels() {
  return (
    <g
      fill={STYLE.text}
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
    >
      <text x={LABEL.pullUp.name.x} y={LABEL.pullUp.name.y} fontSize="18">
        RPU
      </text>
      <text x={LABEL.pullUp.value.x} y={LABEL.pullUp.value.y} fontSize="16">
        100kΩ
      </text>

      <text
        x={LABEL.ledResistor.name.x}
        y={LABEL.ledResistor.name.y}
        fontSize="18"
      >
        R_LED
      </text>
      <text
        x={LABEL.ledResistor.value.x}
        y={LABEL.ledResistor.value.y}
        fontSize="16"
      >
        330Ω
      </text>
    </g>
  );
}

function WireLayer() {
  return (
    <g>
      <WirePath points={WIRE.sourcePositiveDrop} />
      <WirePath points={WIRE.positiveRailToEmitter} />
      <WirePath points={WIRE.sourceNegativeDrop} />
      <WirePath points={WIRE.negativeRail} />
      <WirePath points={WIRE.loadReturnDrop} />
      <WirePath points={WIRE.collectorToLedLower} />
      <WirePath points={WIRE.collectorToLedUpper} />
      <WirePath points={WIRE.pullUpToPositiveRail} />
      <WirePath points={WIRE.pullUpToBaseNode} />
      <WirePath points={WIRE.baseNodeToTransistor} />
      <WirePath points={WIRE.buttonToBaseNode} />
      <WirePath points={WIRE.buttonToNegativeRail} />
    </g>
  );
}

export default function PnpTransistorSwitchingCircuit() {
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
        aria-label="PNP transistor switching circuit"
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

          <SwitchBlock />

          <RotatedResistorBlock
            component={COMPONENT.pullUpResistor}
            label="RPU"
          />

          <RotatedResistorBlock
            component={COMPONENT.ledResistor}
            label="RLED"
          />

          <LedBlock />

          <TransistorBlock />

          <TextLabels />
        </g>
      </svg>
    </div>
  );
}
