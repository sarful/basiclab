"use client";

import { memo } from "react";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 250,
  height: 690,
};

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* =========================================================
   BASE STYLES
========================================================= */

const BASE_COMPONENT = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  bodyOuterFill: "#020303",
  bodySideDark: "#0b0f10",
  bodyRightDark: "#000000",
  bodyText: "#c9c4bd",
  highlight: "#f59e0b",
  label: "#333333",
  labelDark: "#111111",
  white: "#ffffff",
};

const NODE = {
  radius: 4,
  fill: "#111111",
};

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.wire,
  stroke: "#9e9991",
};

const PATH = {
  pinStroke: "#9e9991",
  pinHighlightStroke: COMPONENT.highlight,
  pinStrokeWidth: 1,
  pinHighlightStrokeWidth: 3,
};

const LABEL = {
  fontFamily: "Arial, Helvetica, sans-serif",
  bodyFontSize: 27,
  pinNumberFontSize: 28,
  pinLabelFontSize: 13,
};

/* =========================================================
   GEOMETRY
========================================================= */

type PinNumber = 1 | 2 | 3;

type PinConfig = {
  number: PinNumber;
  label: string;
  shortLabel: string;
  x: number;
};

type Transistor2N2222F759Props = {
  className?: string;
  partNumber?: string;
  secondLine?: string;
  batchCode?: string;
  showPinNumbers?: boolean;
  showPinLabels?: boolean;
  highlightedPin?: PinNumber;
  onPinClick?: (pin: PinNumber) => void;
};

const BODY = {
  x: 68,
  y: 18,
  width: 164,
  height: 170,
  radius: 3,
};

const INNER_BODY = {
  x: 86,
  y: 39,
  width: 128,
  height: 120,
  radius: 2,
};

const PRINT_TEXT = {
  x: 150,
  y1: 75,
  y2: 113,
  y3: 151,
};

const PINS: PinConfig[] = [
  { number: 1, label: "Emitter", shortLabel: "E", x: 100 },
  { number: 2, label: "Base", shortLabel: "B", x: 150 },
  { number: 3, label: "Collector", shortLabel: "C", x: 200 },
];

/* =========================================================
   PATH HELPERS
========================================================= */

function getPinBodyPath(x: number) {
  return `
    M ${x - 9} 188
    C ${x - 8} 285 ${x - 7} 425 ${x - 6} 550
    C ${x - 6} 602 ${x - 2} 617 ${x} 629
    C ${x + 2} 617 ${x + 6} 602 ${x + 6} 550
    C ${x + 7} 425 ${x + 8} 285 ${x + 9} 188
    Z
  `;
}

function getPinHighlightPath(x: number) {
  return `M ${x - 2} 196 C ${x - 1} 330 ${x - 1} 480 ${x - 1} 602`;
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgDefinitions() {
  return (
    <defs>
      <linearGradient id="bodyOuter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050708" />
        <stop offset="45%" stopColor="#24292b" />
        <stop offset="100%" stopColor="#030404" />
      </linearGradient>

      <linearGradient id="bodyInner" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2c3436" />
        <stop offset="48%" stopColor="#111616" />
        <stop offset="100%" stopColor="#020303" />
      </linearGradient>

      <linearGradient id="pinMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#817d77" />
        <stop offset="22%" stopColor="#d0ccc4" />
        <stop offset="50%" stopColor="#fffaf0" />
        <stop offset="76%" stopColor="#b6b1a9" />
        <stop offset="100%" stopColor="#77736e" />
      </linearGradient>

      <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.3" />
      </filter>

      <filter id="softBlur">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
  );
}

function TransistorBody() {
  return (
    <g filter="url(#dropShadow)">
      <rect
        x={BODY.x}
        y={BODY.y}
        width={BODY.width}
        height={BODY.height}
        rx={BODY.radius}
        fill={COMPONENT.bodyOuterFill}
      />

      <rect
        x={BODY.x + 9}
        y={BODY.y + 10}
        width={146}
        height={145}
        rx={3}
        fill="url(#bodyOuter)"
      />

      <rect
        x={INNER_BODY.x}
        y={INNER_BODY.y}
        width={INNER_BODY.width}
        height={INNER_BODY.height}
        rx={INNER_BODY.radius}
        fill="url(#bodyInner)"
      />

      <ellipse
        cx={150}
        cy={56}
        rx={64}
        ry={18}
        fill={COMPONENT.white}
        opacity={0.12}
        filter="url(#softBlur)"
      />

      <rect
        x={69}
        y={20}
        width={10}
        height={166}
        fill={COMPONENT.bodySideDark}
        opacity={0.9}
      />
      <rect
        x={222}
        y={20}
        width={10}
        height={166}
        fill={COMPONENT.bodyRightDark}
        opacity={0.7}
      />
    </g>
  );
}

function BodyMarking({
  partNumber,
  secondLine,
  batchCode,
}: {
  partNumber: string;
  secondLine: string;
  batchCode: string;
}) {
  return (
    <g
      fontFamily={LABEL.fontFamily}
      fontWeight={500}
      textAnchor="middle"
      fill={COMPONENT.bodyText}
      opacity={0.9}
    >
      <text x={PRINT_TEXT.x} y={PRINT_TEXT.y1} fontSize={LABEL.bodyFontSize}>
        {partNumber}
      </text>
      <text x={PRINT_TEXT.x} y={PRINT_TEXT.y2} fontSize={LABEL.bodyFontSize}>
        {secondLine}
      </text>
      <text x={PRINT_TEXT.x} y={PRINT_TEXT.y3} fontSize={LABEL.bodyFontSize}>
        {batchCode}
      </text>
    </g>
  );
}

function TransistorPin({
  pin,
  isActive,
  onPinClick,
}: {
  pin: PinConfig;
  isActive: boolean;
  onPinClick?: (pin: PinNumber) => void;
}) {
  return (
    <g
      onClick={() => onPinClick?.(pin.number)}
      className={onPinClick ? "cursor-pointer" : undefined}
    >
      <path
        d={getPinBodyPath(pin.x)}
        fill="url(#pinMetal)"
        stroke={isActive ? PATH.pinHighlightStroke : PATH.pinStroke}
        strokeWidth={
          isActive ? PATH.pinHighlightStrokeWidth : PATH.pinStrokeWidth
        }
        {...BASE_COMPONENT}
      />

      <path
        d={getPinHighlightPath(pin.x)}
        stroke={COMPONENT.white}
        strokeWidth={2}
        opacity={0.45}
        fill="none"
        {...BASE_COMPONENT}
      />
    </g>
  );
}

function PinLabel({
  pin,
  isActive,
  showPinNumbers,
  showPinLabels,
}: {
  pin: PinConfig;
  isActive: boolean;
  showPinNumbers: boolean;
  showPinLabels: boolean;
}) {
  return (
    <g textAnchor="middle" fontFamily={LABEL.fontFamily}>
      {showPinNumbers && (
        <text
          x={pin.x}
          y={655}
          fontSize={LABEL.pinNumberFontSize}
          fill={COMPONENT.labelDark}
        >
          {pin.number}
        </text>
      )}

      {showPinLabels && (
        <text
          x={pin.x}
          y={678}
          fontSize={LABEL.pinLabelFontSize}
          fontWeight={700}
          fill={isActive ? COMPONENT.highlight : COMPONENT.label}
        >
          {pin.label} ({pin.shortLabel})
        </text>
      )}
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Transistor2N2222F759 = memo(function Transistor2N2222F759({
  className = "",
  partNumber = "2N",
  secondLine = "2222F",
  batchCode = "759",
  showPinNumbers = true,
  showPinLabels = true,
  highlightedPin,
  onPinClick,
}: Transistor2N2222F759Props) {
  return (
    <section
      className={`flex w-full items-center justify-center bg-white p-8 ${className}`}
    >
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        role="img"
        aria-label="2N2222F 759 transistor with emitter base collector pin labels"
        className="h-auto w-full max-w-[320px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SvgDefinitions />

        <TransistorBody />

        <BodyMarking
          partNumber={partNumber}
          secondLine={secondLine}
          batchCode={batchCode}
        />

        {PINS.map((pin) => (
          <TransistorPin
            key={`pin-${pin.number}`}
            pin={pin}
            isActive={highlightedPin === pin.number}
            onPinClick={onPinClick}
          />
        ))}

        {PINS.map((pin) => (
          <PinLabel
            key={`label-${pin.number}`}
            pin={pin}
            isActive={highlightedPin === pin.number}
            showPinNumbers={showPinNumbers}
            showPinLabels={showPinLabels}
          />
        ))}
      </svg>
    </section>
  );
});

export default Transistor2N2222F759;
