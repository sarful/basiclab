"use client";

import BackgroundPixelGred from "../library/background_pixel_gred";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import JFETNChannelSymbol from "../../../../library/electronics-symbol-library/jfets/JFETNChannelSymbol";

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
  source: {
    x: 64,
    y: 210,
    width: 110,
    height: 150,
    rotate: 0,
  },

  gateResistor: {
    x: 340,
    y: 120,
    width: 150,
    height: 120,
    rotate: 90,
  },

  switch: {
    x: 340.5,
    y: 320,
    width: 190,
    height: 130,
    rotate: 90,
  },

  ledResistor: {
    x: 626,
    y: 28,
    width: 150,
    height: 120,
    rotate: 90,
  },

  led: {
    x: 634,
    y: 170,
    width: 130,
    height: 110,
    rotate: 90,
  },

  mosfet: {
    x: 500,
    y: 265,
    width: 190,
    height: 240,
    rotate: 0,
  },
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

  sourceTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y,
  },

  sourcePositiveTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + 35,
  },

  sourceNegativeTerminal: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: COMPONENT.source.y + COMPONENT.source.height - 45,
  },

  sourcePositiveRailPoint: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: 96,
  },

  sourceNegativeRailPoint: {
    x: COMPONENT.source.x + (57 / 150) * COMPONENT.source.width,
    y: 580,
  },

  ledResistorTerminal: {
    x: COMPONENT.ledResistor.x + 76.46,
    y: 96,
  },

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

  ledBottomTerminal: {
    x: COMPONENT.led.x + 86.45,
    y: COMPONENT.led.y + 184.51,
  },

  mosfetGate: {
    x: COMPONENT.mosfet.x + ((0 + 10) / 61) * COMPONENT.mosfet.width,
    y: COMPONENT.mosfet.y + ((25 + 10) / 71) * COMPONENT.mosfet.height,
  },

  mosfetDrain: {
    x: COMPONENT.mosfet.x + ((30 + 10) / 61) * COMPONENT.mosfet.width,
    y: COMPONENT.mosfet.y + ((0 + 10) / 71) * COMPONENT.mosfet.height,
  },

  mosfetSource: {
    x: COMPONENT.mosfet.x + ((30 + 10) / 61) * COMPONENT.mosfet.width,
    y: COMPONENT.mosfet.y + ((50 + 10) / 71) * COMPONENT.mosfet.height,
  },

  gateResistorTerminal: {
    x: COMPONENT.gateResistor.x + 76.46,
    y: COMPONENT.gateResistor.y,
  },

  gateResistorTopTerminal: {
    x: COMPONENT.gateResistor.x + 76.46,
    y: COMPONENT.gateResistor.y + 16.13,
  },

  gateResistorBottomTerminal: {
    x: COMPONENT.gateResistor.x + 76.46,
    y: COMPONENT.gateResistor.y + 111.76,
  },

  switchTerminal: {
    x: COMPONENT.switch.x - 0.5,
    y: COMPONENT.switch.y,
  },

  switchUpperTerminal: {
    x: COMPONENT.switch.x - 0.5,
    y: COMPONENT.switch.y + 150 - 40,
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
    NODE.sourcePositiveRailPoint,
  ],

  positiveRail: [
    NODE.sourcePositiveRailPoint,
    { x: NODE.ledResistorTerminal.x, y: NODE.positiveRailY },
  ],

  sourceNegativeDrop: [
    NODE.sourceNegativeTerminal,
    NODE.sourceNegativeRailPoint,
  ],

  negativeRail: [
    NODE.sourceNegativeRailPoint,
    { x: NODE.mosfetSource.x, y: NODE.negativeRailY },
  ],

  mosfetSourceReturn: [
    { x: NODE.mosfetSource.x + 1, y: NODE.mosfetSource.y - 90 },
    { x: NODE.mosfetSource.x + 1, y: NODE.negativeRailY },
  ],

  ledResistorFeed: [
    { x: NODE.ledResistorTerminal.x, y: NODE.positiveRailY },
    NODE.ledResistorTopTerminal,
  ],

  ledResistorToLed: [NODE.ledResistorBottomTerminal, NODE.ledTopTerminal],

  switchToNegativeRail: [
    NODE.switchUpperTerminal,
    { x: NODE.switchTerminal.x, y: NODE.negativeRailY },
  ],
} as const;

const LABEL = {
  gateResistor: {
    name: {
      x: COMPONENT.gateResistor.x + 30,
      y: COMPONENT.gateResistor.y + 64,
    },
    value: {
      x: COMPONENT.gateResistor.x + 30,
      y: COMPONENT.gateResistor.y + 88,
    },
  },

  ledResistor: {
    name: { x: COMPONENT.ledResistor.x - 46, y: COMPONENT.ledResistor.y + 66 },
    value: { x: COMPONENT.ledResistor.x - 46, y: COMPONENT.ledResistor.y + 90 },
  },

  mosfet: {
    name: { x: COMPONENT.mosfet.x + 120, y: COMPONENT.mosfet.y + 208 },
    model: { x: COMPONENT.mosfet.x + 120, y: COMPONENT.mosfet.y + 232 },
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
        label="VDD source"
      />
    </svg>
  );
}

function GateResistorBlock() {
  return (
    <g>
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

      <text
        x={LABEL.gateResistor.name.x}
        y={LABEL.gateResistor.name.y}
        fontSize="18"
        fontWeight="700"
        fill={STYLE.text}
      >
        RG
      </text>

      <text
        x={LABEL.gateResistor.value.x}
        y={LABEL.gateResistor.value.y}
        fontSize="16"
        fontWeight="700"
        fill={STYLE.text}
      >
        1M
      </text>
    </g>
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
    <g>
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

      <text
        x={LABEL.ledResistor.name.x}
        y={LABEL.ledResistor.name.y}
        fontSize="18"
        fontWeight="700"
        fill={STYLE.text}
      >
        R_LED
      </text>

      <text
        x={LABEL.ledResistor.value.x}
        y={LABEL.ledResistor.value.y}
        fontSize="16"
        fontWeight="700"
        fill={STYLE.text}
      >
        330
      </text>
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
    <g>
      <svg
        x={COMPONENT.mosfet.x}
        y={COMPONENT.mosfet.y}
        width={COMPONENT.mosfet.width}
        height={COMPONENT.mosfet.height}
        viewBox={`0 0 ${COMPONENT.mosfet.width} ${COMPONENT.mosfet.height}`}
        overflow="visible"
      >
        <JFETNChannelSymbol
          width={COMPONENT.mosfet.width}
          height={COMPONENT.mosfet.height}
          label="Q1 N-Channel JFET"
        />
      </svg>

      <text
        x={LABEL.mosfet.name.x}
        y={LABEL.mosfet.name.y}
        fontSize="20"
        fontWeight="700"
        fill={STYLE.text}
      >
        Q1
      </text>

      <text
        x={LABEL.mosfet.model.x}
        y={LABEL.mosfet.model.y}
        fontSize="18"
        fontWeight="700"
        fill={STYLE.text}
      >
        JFET N
      </text>
    </g>
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
      <WirePath points={WIRE.switchToNegativeRail} />
    </g>
  );
}

export default function JfetNChannelSwitchCircuit() {
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
        aria-label="N-channel MOSFET switch circuit"
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
          showLabels={true}
          showBorder={true}
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
