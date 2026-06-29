"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

/* ============================================================================
  WhatIsOptocouplerInteractive.tsx

  Updates included:
  - External output wire/load loop remains removed.
  - Output resistor remains removed.
  - Output current dots are corrected:
    Pin 4 collector terminal → phototransistor collector
    Phototransistor emitter → Pin 3 emitter terminal
  - Added DOT_PATH_OFFSET manual tuning architecture.
  - Added showDebugPaths prop for visual dot-path alignment guides.
  - Improved simulation step accuracy:
    Step 1: input current dots only
    Step 2: LED internal dots + LED glow
    Step 3: light arrows
    Step 4: output collector/emitter dots
============================================================================ */

/* ============================================================================
  Basic Types
============================================================================ */

type XY = {
  x: number;
  y: number;
};

type BoxTuning = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotate: number;
};

type OffsetTuning = {
  x: number;
  y: number;
};

type DebugTerminalKey =
  | "pin1Anode"
  | "pin2Cathode"
  | "ledAnode"
  | "ledCathode"
  | "opticalStart"
  | "opticalEnd"
  | "collector"
  | "emitter"
  | "pin4Collector"
  | "pin3Emitter";

type SimulationStep = 0 | 1 | 2 | 3;

type SvgIds = {
  pencilWobble: string;
  softShadow: string;
  graphiteHatch: string;
  darkHatch: string;
  fineDot: string;
  pinFill: string;
  caseFill: string;
  ledGlow: string;
  sensorGlow: string;
  arrow: string;
};

type VisualState = {
  isInputOn: boolean;
  isRunning: boolean;
  simulationStep: SimulationStep;
  inputCurrentActive: boolean;
  ledCurrentActive: boolean;
  lightActive: boolean;
  outputActive: boolean;
  ledGlowActive: boolean;
};

export type WhatIsOptocouplerInteractiveProps = {
  className?: string;
  showBackground?: boolean;
  showControls?: boolean;
  showTimeline?: boolean;
  showLabels?: boolean;
  showCurrentDots?: boolean;
  showDebugTerminals?: boolean;
  showDebugPaths?: boolean;
  initialRunning?: boolean;
  autoStart?: boolean;
  simulationSpeed?: number;
};

/* ============================================================================
  Required Global Architecture Constants
============================================================================ */

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1536,
  height: 1152,
};

const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  BASE_WIRE_WIDTH: 5,
  CIRCUIT_WIRE_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
  CURRENT_DOT_SCALE: 1,
  LABEL_SCALE: 1,
  DEBUG_TERMINAL_SCALE: 1,
};

const BASE_WIRE_WIDTH = SCALE.BASE_WIRE_WIDTH;

/* ============================================================================
  Color System
============================================================================ */

const COLOR = {
  ink: "#101010",
  darkInk: "#1f1f1f",
  graphite: "#777777",
  paper: "#ffffff",
  caseLight: "#f7f7f7",
  caseShade: "#d6d6d6",

  inputCurrent: "#ef4444",
  inputCurrentSoft: "#fecaca",
  inputCurrentDark: "#991b1b",

  ledOn: "#facc15",
  ledOnSoft: "#fef3c7",
  ledOnDark: "#854d0e",

  lightBeam: "#f59e0b",
  lightBeamSoft: "#fde68a",

  isolationTint: "#dbeafe",
  isolationStroke: "#64748b",

  outputCurrent: "#10b981",
  outputCurrentSoft: "#bbf7d0",
  outputCurrentDark: "#065f46",

  transistorActive: "#14b8a6",
  transistorSoft: "#ccfbf1",

  debug: "#dc2626",
  debugText: "#991b1b",

  debugPathInput: "#ef4444",
  debugPathLed: "#ca8a04",
  debugPathReturn: "#f97316",
  debugPathCollector: "#10b981",
  debugPathEmitter: "#065f46",
};

/* ============================================================================
  Required Tuning Variables

  Manual adjustment rule:
  x positive  = move right
  x negative  = move left
  y positive  = move down
  y negative  = move up
============================================================================ */

const COMPONENT_OFFSET = {
  // Move the whole drawing.
  fullCircuit: { x: 0, y: 0 },

  // Move external IC pins.
  externalPins: { x: 0, y: 0 },

  // Move main package/case.
  packageBody: { x: 0, y: 0 },
  leftWindow: { x: 0, y: 0 },
  rightWindow: { x: 0, y: 0 },
  isolationWall: { x: 0, y: 0 },

  // Move LED/input section.
  ledGroup: { x: 0, y: 0 },
  ledTerminals: { x: 0, y: 0 },

  // Move all optical arrows together.
  opticalArrows: { x: 0, y: 0 },

  // Move phototransistor/output section.
  phototransistorGroup: { x: 0, y: 0 },
  phototransistorEmitterArrow: { x: 0, y: 0 },

  // Global current-dot offset. Keep at zero for best alignment.
  // Use DOT_PATH_OFFSET below for individual dot-path tuning.
  currentDots: { x: 0, y: 0 },

  // Move labels/debug/pencil marks.
  labels: { x: 0, y: 0 },
  debugTerminals: { x: 0, y: 0 },
  debugPaths: { x: 0, y: 0 },
  pencilMarks: { x: 0, y: 0 },
} satisfies Record<string, OffsetTuning>;

const WIRE_OFFSET = {
  // IMPORTANT:
  // inputPositive wire is manually moved right by 20.
  // DOT_PATH_OFFSET.inputPositive must match this to keep dots on the wire.
  inputPositive: { x: 20, y: 0 },

  inputReturn: { x: 0, y: 0 },
  ledInternal: { x: 0, y: 0 },

  collectorWire: { x: 0, y: 0 },
  emitterWire: { x: 0, y: 0 },

  lightBeam: { x: 0, y: 0 },
} satisfies Record<string, OffsetTuning>;

const DOT_PATH_OFFSET = {
  // Move only the current-dot path, not the visible wire.
  // x positive  = move dot path right
  // x negative  = move dot path left
  // y positive  = move dot path down
  // y negative  = move dot path up

  // Matches WIRE_OFFSET.inputPositive so red dots sit exactly on moved wire.
  inputPositive: { x: 20, y: 0 },

  // LED internal dots.
  ledForward: { x: 0, y: 0 },

  // Input return dots.
  inputReturn: { x: 0, y: 0 },

  // Output collector dots: Pin 4 → phototransistor collector.
  collector: { x: 0, y: 0 },

  // Output emitter dots: phototransistor emitter → Pin 3.
  emitter: { x: 0, y: 0 },
} satisfies Record<string, OffsetTuning>;

const DEBUG_TERMINAL_OFFSET = {
  // Move only debug terminal dots/text, not real wires/components.
  // x positive  = move right
  // x negative  = move left
  // y positive  = move down
  // y negative  = move up
  pin1Anode: { x: 0, y: 0 },
  pin2Cathode: { x: 0, y: 0 },
  ledAnode: { x: 0, y: 0 },
  ledCathode: { x: 0, y: 0 },
  opticalStart: { x: 0, y: 0 },
  opticalEnd: { x: 0, y: 0 },
  collector: { x: 0, y: 0 },
  emitter: { x: 0, y: 0 },
  pin4Collector: { x: 0, y: 0 },
  pin3Emitter: { x: 0, y: 0 },
} satisfies Record<DebugTerminalKey, OffsetTuning>;

type WireOffsetKey = keyof typeof WIRE_OFFSET;
type DotPathKey = keyof typeof DOT_PATH_OFFSET;

type WireSegment = {
  id: string;
  d: string;
  offsetKey: WireOffsetKey;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  dashed?: boolean;
};

/* ============================================================================
  Required BASE_COMPONENT and COMPONENT
============================================================================ */

const BASE_COMPONENT = {
  fullCircuit: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: SCALE.CIRCUIT_CANVAS_SCALE,
    rotate: 0,
  },

  externalPins: {
    x: 0,
    y: 0,
    width: 1536,
    height: 1152,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  packageBody: {
    x: 0,
    y: 0,
    width: 1536,
    height: 1152,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  leftWindow: {
    x: 0,
    y: 0,
    width: 420,
    height: 520,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  rightWindow: {
    x: 0,
    y: 0,
    width: 420,
    height: 520,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  isolationWall: {
    x: 0,
    y: 0,
    width: 60,
    height: 515,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  ledGroup: {
    x: 0,
    y: 0,
    width: 360,
    height: 360,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  ledTerminals: {
    x: 0,
    y: 0,
    width: 120,
    height: 320,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  opticalArrows: {
    x: 0,
    y: 0,
    width: 320,
    height: 180,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  phototransistorGroup: {
    x: 0,
    y: 0,
    width: 420,
    height: 420,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  phototransistorEmitterArrow: {
    x: 0,
    y: -25,
    width: 80,
    height: 80,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },

  currentDots: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: SCALE.CURRENT_DOT_SCALE,
    rotate: 0,
  },

  labels: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: SCALE.LABEL_SCALE,
    rotate: 0,
  },

  debugTerminals: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: SCALE.DEBUG_TERMINAL_SCALE,
    rotate: 0,
  },

  debugPaths: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: 1,
    rotate: 0,
  },

  pencilMarks: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: SCALE.CIRCUIT_COMPONENT_SCALE,
    rotate: 0,
  },
} satisfies Record<string, BoxTuning>;

const COMPONENT = {
  fullCircuit: applyComponentOffset(BASE_COMPONENT.fullCircuit, COMPONENT_OFFSET.fullCircuit),
  externalPins: applyComponentOffset(BASE_COMPONENT.externalPins, COMPONENT_OFFSET.externalPins),
  packageBody: applyComponentOffset(BASE_COMPONENT.packageBody, COMPONENT_OFFSET.packageBody),
  leftWindow: applyComponentOffset(BASE_COMPONENT.leftWindow, COMPONENT_OFFSET.leftWindow),
  rightWindow: applyComponentOffset(BASE_COMPONENT.rightWindow, COMPONENT_OFFSET.rightWindow),
  isolationWall: applyComponentOffset(BASE_COMPONENT.isolationWall, COMPONENT_OFFSET.isolationWall),
  ledGroup: applyComponentOffset(BASE_COMPONENT.ledGroup, COMPONENT_OFFSET.ledGroup),
  ledTerminals: applyComponentOffset(BASE_COMPONENT.ledTerminals, COMPONENT_OFFSET.ledTerminals),
  opticalArrows: applyComponentOffset(BASE_COMPONENT.opticalArrows, COMPONENT_OFFSET.opticalArrows),
  phototransistorGroup: applyComponentOffset(
    BASE_COMPONENT.phototransistorGroup,
    COMPONENT_OFFSET.phototransistorGroup
  ),
  phototransistorEmitterArrow: applyComponentOffset(
    BASE_COMPONENT.phototransistorEmitterArrow,
    COMPONENT_OFFSET.phototransistorEmitterArrow
  ),
  currentDots: applyComponentOffset(BASE_COMPONENT.currentDots, COMPONENT_OFFSET.currentDots),
  labels: applyComponentOffset(BASE_COMPONENT.labels, COMPONENT_OFFSET.labels),
  debugTerminals: applyComponentOffset(
    BASE_COMPONENT.debugTerminals,
    COMPONENT_OFFSET.debugTerminals
  ),
  debugPaths: applyComponentOffset(BASE_COMPONENT.debugPaths, COMPONENT_OFFSET.debugPaths),
  pencilMarks: applyComponentOffset(BASE_COMPONENT.pencilMarks, COMPONENT_OFFSET.pencilMarks),
} satisfies Record<keyof typeof BASE_COMPONENT, BoxTuning>;

/* ============================================================================
  Required NODE Constants
============================================================================ */

const NODE = {
  pin1Anode: { x: 300, y: 438 },
  pin2Cathode: { x: 300, y: 682 },

  ledAnode: { x: 515, y: 536 },
  ledCathode: { x: 516, y: 598 },
  ledChipCenter: { x: 574, y: 556 },

  opticalStart: { x: 612, y: 548 },
  opticalEnd: { x: 884, y: 558 },

  collector: { x: 965, y: 523 },
  emitter: { x: 965, y: 625 },

  pin4Collector: { x: 1189, y: 425 },
  pin3Emitter: { x: 1189, y: 714 },
} satisfies Record<string, XY>;

/* ============================================================================
  Required WIRE Constants and Structured Wire Segments
============================================================================ */

const WIRE = {
  baseWidth: BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE,
  activeWidth: 9 * SCALE.CIRCUIT_WIRE_SCALE,
  pencilOverlayWidthRatio: 0.45,
  pencilOverlayOpacity: 0.18,
  terminalStrokeWidth: 4,
  dotRadius: 8,
  dotShadowRadius: 14,

  segments: {
    inputPositive: {
      id: "input-positive-wire",
      offsetKey: "inputPositive",
      d: "M356 438 L418 438 L418 458 Q418 470 432 470 L462 470 L462 536 L515 536",
    },

    inputReturn: {
      id: "input-return-wire",
      offsetKey: "inputReturn",
      d: "M356 682 L416 682 L416 651 Q416 641 430 641 L462 641 L462 598 L516 598",
    },

    collectorWire: {
      id: "collector-wire",
      offsetKey: "collectorWire",
      d: "M965 523 L1052 455 L1052 425 L1189 425",
    },

    emitterWire: {
      id: "emitter-wire",
      offsetKey: "emitterWire",
      d: "M965 625 L1050 690 L1050 714 L1189 714",
    },
  } satisfies Record<string, WireSegment>,
};

/* ============================================================================
  Required PATH Constants
============================================================================ */

const PATH = {
  externalPins: {
    leftUpper:
      "M55 424 L200 424 Q214 424 218 410 L247 410 Q266 409 268 388 L295 386 L296 435 L267 436 Q253 436 246 451 L221 451 Q214 453 207 464 L55 464 Q48 462 49 444 L49 435 Q49 425 55 424 Z",
    leftUpperHighlight: "M61 444 L202 444",

    leftLower:
      "M55 682 L202 682 Q215 682 219 664 L246 664 Q265 664 267 642 L300 642 L300 696 L267 696 Q252 696 246 711 L218 711 Q211 712 204 723 L55 723 Q48 721 48 703 L48 692 Q48 684 55 682 Z",
    leftLowerHighlight: "M60 703 L202 703",

    leftVerticalLower:
      "M210 721 L210 955 Q210 964 221 964 L226 964 Q236 964 236 954 L236 723",

    rightUpper:
      "M1242 385 L1270 386 Q1273 410 1294 410 L1320 410 Q1325 424 1342 424 L1485 424 Q1495 424 1497 436 L1497 448 Q1496 463 1485 464 L1336 464 Q1328 455 1320 452 L1294 452 Q1283 436 1268 436 L1241 435 Z",
    rightUpperHighlight: "M1337 444 L1484 444",

    rightLower:
      "M1242 642 L1271 642 Q1274 664 1294 664 L1320 664 Q1324 681 1340 682 L1486 682 Q1495 683 1497 695 L1497 706 Q1495 722 1486 723 L1338 723 Q1329 713 1321 711 L1294 711 Q1282 696 1268 696 L1241 695 Z",
    rightLowerHighlight: "M1336 704 L1485 704",

    rightVerticalLower:
      "M1334 721 L1334 955 Q1334 965 1345 965 L1352 965 Q1362 965 1362 955 L1362 724",
  },

  packageBody: {
    outer:
      "M344 258 L1235 258 L1262 320 L1264 814 Q1263 842 1235 842 L333 842 Q306 838 304 812 L298 322 Z",
    topCover:
      "M316 259 L371 184 L397 171 L1213 171 L1238 186 L1272 257 L1235 258 L344 258 Z",
    topHatch: "M342 258 L1234 258 L1256 318 L318 318 Z",
    leftBevel: "M316 259 L371 184 L397 171 L349 270 L317 318 Z",
    rightBevel: "M1213 171 L1238 186 L1272 257 L1256 318 L1235 258 Z",

    leftDarkBlock: "M304 318 L392 318 L392 810 L318 810 Q303 804 303 785 Z",
    rightDarkBlock: "M1167 318 L1257 318 L1260 791 Q1259 810 1240 814 L1167 810 Z",

    leftInnerBase:
      "M391 291 L735 291 Q762 291 764 322 L764 806 L394 806 Q370 804 370 777 L370 322 Q371 294 391 291 Z",
    rightInnerBase:
      "M835 291 L1170 291 Q1197 292 1198 322 L1198 777 Q1197 804 1170 806 L835 806 Q810 806 808 777 L808 322 Q810 295 835 291 Z",

    leftWindow:
      "M451 293 L716 293 Q747 294 748 326 L748 753 Q748 785 716 785 L454 785 Q421 784 421 751 L421 326 Q421 295 451 293 Z",
    rightWindow:
      "M864 294 L1138 294 Q1166 295 1168 326 L1168 753 Q1168 784 1138 785 L865 785 Q834 784 833 753 L833 326 Q834 296 864 294 Z",

    leftWindowShade:
      "M421 326 Q421 295 451 293 L454 785 Q421 784 421 751 Z",
    rightWindowShadeLeft:
      "M833 326 Q834 296 864 294 L865 785 Q834 784 833 753 Z",
    rightWindowShadeRight:
      "M1138 294 Q1166 295 1168 326 L1168 753 Q1168 784 1138 785 Z",

    isolationWall: "M748 291 L808 291 L808 806 L748 806 Z",
    isolationWallTexture: "M762 319 L795 319 L795 786 L762 786 Z",

    bottomBase:
      "M322 806 L1240 806 L1235 842 L333 842 Q306 838 304 812 Z",
  },

  led: {
    topTerminal: "M300 422 L356 422 L356 455 L300 455 Z",
    bottomTerminal: "M300 666 L356 666 L356 699 L300 699 Z",

    base: "M512 592 L622 592 L632 625 L502 625 Z",
    platform: "M526 560 L608 560 L608 596 L526 596 Z",
    dome:
      "M532 558 L532 505 Q532 461 572 461 Q612 461 612 506 L612 558 Z",
    reflection: "M544 506 Q572 488 602 506",
    chip: "M562 537 L586 537 L586 576 L562 576 Z",
    leftLeg: "M552 590 L552 566 L562 566",
    rightLeg: "M596 590 L596 566 L586 566",

    pencilRayTop: "M630 520 C665 495 690 480 724 472",
    pencilRayMiddle: "M640 548 C679 538 704 535 730 532",
    pencilRayBottom: "M628 573 C667 590 696 604 725 630",
  },

  lightBeams: [
    "M611 507 L735 515",
    "M612 548 L735 555",
    "M611 588 L735 603",
    "M755 514 L884 522",
    "M756 554 L884 558",
    "M756 604 L884 618",
  ],

  phototransistor: {
    sensorPlate: "M929 479 L967 479 L963 662 L928 662 Z",
    sensorInner: "M940 492 L957 492 L954 648 L938 648",

    collectorTerminal: "M1189 410 L1236 410 L1236 444 L1189 444 Z",
    emitterTerminal: "M1189 699 L1236 699 L1236 733 L1189 733 Z",

    emitterArrow: "M1028 673 L1048 714 L1006 704 Z",

    collectorTerminalHighlight: "M1157 422 L1193 422",
    emitterTerminalHighlight: "M1157 716 L1193 716",
  },

  dotPath: {
    inputPositive:
      "M60 444 L202 444 L247 444 L300 438 L356 438 L418 438 L418 458 Q418 470 432 470 L462 470 L462 536 L515 536",

    ledForward:
      "M515 536 L552 536 L562 537 L562 576 L552 590 L596 590 L586 576 L586 537 L608 560 L516 598",

    inputReturn:
      "M516 598 L462 598 L462 641 L430 641 Q416 641 416 651 L416 682 L356 682 L300 682 L202 703 L60 703",

    // Correct output flow after external output/load wire removal:
    // Pin 4 collector terminal → phototransistor collector
    collector:
      "M1189 425 L1052 425 L1052 455 L965 523",

    // Phototransistor emitter → Pin 3 emitter terminal
    emitter:
      "M965 625 L1050 690 L1050 714 L1189 714",
  } satisfies Record<DotPathKey, string>,

  pencilMarks: {
    caseLeft: "M360 345 C420 330 475 326 535 332",
    caseRight: "M875 341 C940 328 1015 330 1108 338",
    floorLeft: "M440 760 C520 792 640 795 721 764",
    floorRight: "M842 765 C935 802 1052 801 1135 763",
    topLeft: "M368 189 L319 258",
    topRight: "M1212 176 L1248 256",
    topLine: "M334 259 L1252 259",
    ledSpark1: "M620 455 L632 431",
    ledSpark2: "M645 472 L669 448",
    ledSpark3: "M650 505 L686 492",
  },
};

/* ============================================================================
  Required LABEL Constants
============================================================================ */

const LABEL = {
  style: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontSize: 28,
    smallFontSize: 24,
    debugFontSize: 18,
    fill: "#151515",
    mutedFill: "#5d5d5d",
  },

  position: {
    inputCurrent: { x: 190, y: 352 },
    ledOn: { x: 525, y: 430 },
    lightTransfer: { x: 635, y: 468 },
    phototransistorOn: { x: 845, y: 430 },
    outputCurrent: { x: 1110, y: 780 },
  },

  debugPathPosition: {
    inputPositive: { x: 380, y: 410 },
    ledForward: { x: 535, y: 675 },
    inputReturn: { x: 380, y: 730 },
    collector: { x: 1035, y: 390 },
    emitter: { x: 1035, y: 760 },
  } satisfies Record<DotPathKey, XY>,
};

/* ============================================================================
  Simulation Constants
============================================================================ */

const SIMULATION = {
  cycleDurationMs: 5200,
  minSpeed: 0.4,
  maxSpeed: 3,
  speedStep: 0.1,
  defaultSpeed: 1,
  steps: [
    {
      id: 0,
      name: "Step 1: Input current flows",
      shortName: "Input",
    },
    {
      id: 1,
      name: "Step 2: LED turns ON",
      shortName: "LED ON",
    },
    {
      id: 2,
      name: "Step 3: Light crosses the isolation gap",
      shortName: "Light",
    },
    {
      id: 3,
      name: "Step 4: Phototransistor turns ON and output current flows",
      shortName: "Output",
    },
  ] as const,
};

const ANIMATION = {
  dotCountInput: 4,
  dotCountLed: 3,
  dotCountOutput: 4,
  dotDurationBaseSec: 1.35,
  lightPulseDurationBaseSec: 1.15,
  glowPulseDurationBaseSec: 1.5,
  dashArray: "26 18",
  dashOffsetFrom: 120,
  dashOffsetTo: 0,
};

const GLOW = {
  led: {
    cx: 575,
    cy: 540,
    r: 132,
    opacity: 0.72,
  },
  sensor: {
    cx: 955,
    cy: 575,
    rx: 112,
    ry: 150,
    opacity: 0.45,
  },
};

/* ============================================================================
  Tailwind Layout Styles
============================================================================ */

const CONTROL_STYLE = {
  wrapper:
    "mt-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm",
  row: "grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center",
  button:
    "rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 active:scale-[0.98]",
  buttonActive:
    "rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]",
  buttonDanger:
    "rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-red-700 active:scale-[0.98]",
  speedWrapper: "col-span-2 flex items-center gap-3 sm:col-span-1",
  range: "h-2 w-full cursor-pointer accent-neutral-900 sm:w-44",
  label: "text-sm font-medium text-neutral-700",
  stepBadge:
    "col-span-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 sm:col-span-1",

  timelineWrapper:
    "mt-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm",
  timelineTop:
    "mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  timelineText: "text-sm font-medium text-neutral-800",
  timelineState:
    "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700",
  timelineTrack: "relative h-3 overflow-hidden rounded-full bg-neutral-200",
  timelineFill: "h-full rounded-full transition-[width]",
  markerRow: "mt-3 grid grid-cols-4 gap-2",
  marker:
    "flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-center text-[11px] font-medium text-neutral-500",
  markerActive:
    "flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center text-[11px] font-medium",
  markerDot: "h-2 w-2 rounded-full bg-current",
};

/* ============================================================================
  Helper Functions
============================================================================ */

function applyComponentOffset(component: BoxTuning, offset: OffsetTuning): BoxTuning {
  return {
    ...component,
    x: component.x + offset.x,
    y: component.y + offset.y,
  };
}

function svgTranslate(x: number, y: number): string {
  return `translate(${x} ${y})`;
}

function svgScale(scale: number): string {
  return `scale(${scale})`;
}

function svgRotate(deg: number, cx = 0, cy = 0): string {
  return `rotate(${deg} ${cx} ${cy})`;
}

function componentTransform(component: BoxTuning): string {
  const cx = component.width / 2;
  const cy = component.height / 2;

  return [
    svgTranslate(component.x, component.y),
    svgRotate(component.rotate, cx, cy),
    svgScale(component.scale),
  ].join(" ");
}

function offsetTransform(offset: OffsetTuning): string {
  return svgTranslate(offset.x, offset.y);
}

function dotPathTransform(pathKey: DotPathKey): string {
  return [
    componentTransform(COMPONENT.currentDots),
    offsetTransform(DOT_PATH_OFFSET[pathKey]),
  ].join(" ");
}

function withDebugOffset(key: DebugTerminalKey, point: XY): XY {
  const offset = DEBUG_TERMINAL_OFFSET[key];

  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function urlOf(id: string): string {
  return `url(#${id})`;
}

function safeSpeed(value: number): number {
  if (!Number.isFinite(value)) return SIMULATION.defaultSpeed;
  return Math.max(SIMULATION.minSpeed, Math.min(SIMULATION.maxSpeed, value));
}

function animationDuration(baseSeconds: number, speed: number): string {
  return `${baseSeconds / safeSpeed(speed)}s`;
}

function toStep(value: number): SimulationStep {
  return Math.max(0, Math.min(3, Math.floor(value))) as SimulationStep;
}

function stepColor(step: SimulationStep): string {
  if (step === 0) return COLOR.inputCurrent;
  if (step === 1) return COLOR.ledOn;
  if (step === 2) return COLOR.lightBeam;
  return COLOR.outputCurrent;
}

function createSvgIds(baseId: string): SvgIds {
  return {
    pencilWobble: `${baseId}-pencil-wobble`,
    softShadow: `${baseId}-soft-shadow`,
    graphiteHatch: `${baseId}-graphite-hatch`,
    darkHatch: `${baseId}-dark-hatch`,
    fineDot: `${baseId}-fine-dot`,
    pinFill: `${baseId}-pin-fill`,
    caseFill: `${baseId}-case-fill`,
    ledGlow: `${baseId}-led-glow`,
    sensorGlow: `${baseId}-sensor-glow`,
    arrow: `${baseId}-arrow`,
  };
}

/* ============================================================================
  SVG Definitions
============================================================================ */

function SvgDefs({ ids }: { ids: SvgIds }) {
  return (
    <defs>
      <filter id={ids.pencilWobble} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012"
          numOctaves="2"
          seed="8"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id={ids.softShadow} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="5"
          stdDeviation="6"
          floodColor="#000000"
          floodOpacity="0.12"
        />
      </filter>

      <pattern
        id={ids.graphiteHatch}
        patternUnits="userSpaceOnUse"
        width="18"
        height="18"
        patternTransform="rotate(25)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="18"
          stroke="#6f6f6f"
          strokeWidth="1.4"
          opacity="0.35"
        />
      </pattern>

      <pattern
        id={ids.darkHatch}
        patternUnits="userSpaceOnUse"
        width="14"
        height="14"
        patternTransform="rotate(8)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="14"
          stroke="#202020"
          strokeWidth="2"
          opacity="0.42"
        />
      </pattern>

      <pattern id={ids.fineDot} patternUnits="userSpaceOnUse" width="10" height="10">
        <circle cx="2" cy="3" r="1" fill="#686868" opacity="0.28" />
        <circle cx="8" cy="7" r="0.8" fill="#686868" opacity="0.22" />
      </pattern>

      <linearGradient id={ids.pinFill} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ededed" />
        <stop offset="45%" stopColor="#bdbdbd" />
        <stop offset="100%" stopColor="#f7f7f7" />
      </linearGradient>

      <linearGradient id={ids.caseFill} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fafafa" />
        <stop offset="55%" stopColor="#f1f1f1" />
        <stop offset="100%" stopColor="#dddddd" />
      </linearGradient>

      <radialGradient id={ids.ledGlow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={COLOR.ledOnSoft} stopOpacity="0.95" />
        <stop offset="45%" stopColor={COLOR.ledOn} stopOpacity="0.5" />
        <stop offset="100%" stopColor={COLOR.ledOn} stopOpacity="0" />
      </radialGradient>

      <radialGradient id={ids.sensorGlow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={COLOR.transistorSoft} stopOpacity="0.65" />
        <stop offset="55%" stopColor={COLOR.transistorActive} stopOpacity="0.25" />
        <stop offset="100%" stopColor={COLOR.transistorActive} stopOpacity="0" />
      </radialGradient>

      <marker
        id={ids.arrow}
        viewBox="0 0 12 12"
        refX="10"
        refY="6"
        markerWidth="10"
        markerHeight="10"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 12 6 L 0 12 z" fill={COLOR.ink} />
      </marker>
    </defs>
  );
}

/* ============================================================================
  Reusable SVG Primitives
============================================================================ */

function SketchPath({
  d,
  stroke = COLOR.ink,
  strokeWidth = WIRE.baseWidth,
  fill = "none",
  opacity = 1,
  markerEnd,
}: {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  markerEnd?: string;
}) {
  if (!d) return null;

  return (
    <>
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        markerEnd={markerEnd}
      />
      <path
        d={d}
        fill="none"
        stroke="#000"
        strokeWidth={Math.max(1, strokeWidth * WIRE.pencilOverlayWidthRatio)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={WIRE.pencilOverlayOpacity}
        transform="translate(2 -1)"
      />
    </>
  );
}

function PencilShade({
  d,
  ids,
  opacity = 0.45,
}: {
  d: string;
  ids: SvgIds;
  opacity?: number;
}) {
  return <path d={d} fill={urlOf(ids.graphiteHatch)} stroke="none" opacity={opacity} />;
}

function WirePath({
  segment,
  active = false,
  activeColor = COLOR.ledOn,
  speed,
}: {
  segment: WireSegment;
  active?: boolean;
  activeColor?: string;
  speed: number;
}) {
  if (!segment.d) return null;

  const offset = WIRE_OFFSET[segment.offsetKey];

  return (
    <g transform={offsetTransform(offset)}>
      {active && (
        <path
          d={segment.d}
          fill="none"
          stroke={activeColor}
          strokeWidth={WIRE.activeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35}
        >
          <animate
            attributeName="opacity"
            values="0.16;0.38;0.16"
            dur={animationDuration(ANIMATION.glowPulseDurationBaseSec, speed)}
            repeatCount="indefinite"
          />
        </path>
      )}

      <SketchPath
        d={segment.d}
        stroke={segment.stroke ?? COLOR.ink}
        strokeWidth={segment.strokeWidth ?? WIRE.baseWidth}
        opacity={segment.opacity ?? 1}
      />
    </g>
  );
}

function AnimatedDots({
  active,
  pathKey,
  speed,
  count,
  color,
  glowColor,
  radius = WIRE.dotRadius,
  glowOpacity = 0.22,
}: {
  active: boolean;
  pathKey: DotPathKey;
  speed: number;
  count: number;
  color: string;
  glowColor: string;
  radius?: number;
  glowOpacity?: number;
}) {
  if (!active) return null;

  const pathD = PATH.dotPath[pathKey];
  const duration = ANIMATION.dotDurationBaseSec / safeSpeed(speed);
  const delayStep = duration / count;

  return (
    <g pointerEvents="none" transform={dotPathTransform(pathKey)}>
      {Array.from({ length: count }).map((_, index) => (
        <g key={`${pathKey}-${index}`}>
          <circle r={WIRE.dotShadowRadius} fill={glowColor} opacity={glowOpacity}>
            <animateMotion
              path={pathD}
              dur={`${duration}s`}
              begin={`${index * delayStep}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle
            r={radius}
            fill={color}
            stroke={COLOR.paper}
            strokeWidth="2"
            opacity="0.95"
          >
            <animateMotion
              path={pathD}
              dur={`${duration}s`}
              begin={`${index * delayStep}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </g>
  );
}

function PulsingLightBeam({
  d,
  ids,
  active,
  speed,
  delay = 0,
}: {
  d: string;
  ids: SvgIds;
  active: boolean;
  speed: number;
  delay?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? COLOR.lightBeam : COLOR.ink}
      strokeWidth={active ? 7 : 4}
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd={urlOf(ids.arrow)}
      opacity={active ? 0.85 : 0.75}
      strokeDasharray={active ? ANIMATION.dashArray : undefined}
    >
      {active && (
        <>
          <animate
            attributeName="stroke-dashoffset"
            from={ANIMATION.dashOffsetFrom}
            to={ANIMATION.dashOffsetTo}
            dur={animationDuration(ANIMATION.lightPulseDurationBaseSec, speed)}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.32;0.95;0.42"
            dur={animationDuration(ANIMATION.lightPulseDurationBaseSec, speed)}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </>
      )}
    </path>
  );
}

/* ============================================================================
  Reusable Circuit Blocks
============================================================================ */

function ExternalPins({ ids }: { ids: SvgIds }) {
  return (
    <g transform={componentTransform(COMPONENT.externalPins)} filter={urlOf(ids.pencilWobble)}>
      <path
        d={PATH.externalPins.leftUpper}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.externalPins.leftUpperHighlight}
        stroke="#555"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />

      <path
        d={PATH.externalPins.leftLower}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.externalPins.leftLowerHighlight}
        stroke="#555"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />

      <path
        d={PATH.externalPins.leftVerticalLower}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />

      <path
        d={PATH.externalPins.rightUpper}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.externalPins.rightUpperHighlight}
        stroke="#555"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />

      <path
        d={PATH.externalPins.rightLower}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.externalPins.rightLowerHighlight}
        stroke="#555"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />

      <path
        d={PATH.externalPins.rightVerticalLower}
        fill={urlOf(ids.pinFill)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </g>
  );
}

function PackageBody({ ids }: { ids: SvgIds }) {
  return (
    <g transform={componentTransform(COMPONENT.packageBody)} filter={urlOf(ids.pencilWobble)}>
      <path
        d={PATH.packageBody.outer}
        fill={urlOf(ids.caseFill)}
        stroke={COLOR.ink}
        strokeWidth={7}
        strokeLinejoin="round"
        filter={urlOf(ids.softShadow)}
      />

      <path
        d={PATH.packageBody.topCover}
        fill="#fbfbfb"
        stroke={COLOR.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />

      <path
        d={PATH.packageBody.topHatch}
        fill={urlOf(ids.graphiteHatch)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity="0.78"
      />

      <path
        d={PATH.packageBody.leftBevel}
        fill="#eeeeee"
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.packageBody.rightBevel}
        fill="#eeeeee"
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />

      <path
        d={PATH.packageBody.leftDarkBlock}
        fill={urlOf(ids.darkHatch)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity="0.82"
      />
      <path
        d={PATH.packageBody.rightDarkBlock}
        fill={urlOf(ids.darkHatch)}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity="0.82"
      />

      <path
        d={PATH.packageBody.leftInnerBase}
        fill={COLOR.caseLight}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.packageBody.rightInnerBase}
        fill={COLOR.caseLight}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />

      <g transform={componentTransform(COMPONENT.leftWindow)}>
        <path
          d={PATH.packageBody.leftWindow}
          fill="#fbfbfb"
          stroke={COLOR.ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <PencilShade ids={ids} d={PATH.packageBody.leftWindowShade} opacity={0.55} />
      </g>

      <g transform={componentTransform(COMPONENT.rightWindow)}>
        <path
          d={PATH.packageBody.rightWindow}
          fill="#fbfbfb"
          stroke={COLOR.ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <PencilShade ids={ids} d={PATH.packageBody.rightWindowShadeLeft} opacity={0.45} />
        <PencilShade ids={ids} d={PATH.packageBody.rightWindowShadeRight} opacity={0.5} />
      </g>

      <g transform={componentTransform(COMPONENT.isolationWall)}>
        <path
          d={PATH.packageBody.isolationWall}
          fill={COLOR.isolationTint}
          stroke={COLOR.isolationStroke}
          strokeWidth={4}
        />
        <path
          d={PATH.packageBody.isolationWallTexture}
          fill={urlOf(ids.fineDot)}
          opacity="0.65"
        />
      </g>

      <path
        d={PATH.packageBody.bottomBase}
        fill={COLOR.caseShade}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity="0.6"
      />
    </g>
  );
}

function LedInputBlock({
  ids,
  visualState,
  speed,
}: {
  ids: SvgIds;
  visualState: VisualState;
  speed: number;
}) {
  const inputWireActive = visualState.inputCurrentActive;
  const inputTerminalActive = visualState.inputCurrentActive || visualState.ledCurrentActive;
  const ledActive = visualState.ledGlowActive;

  return (
    <g transform={componentTransform(COMPONENT.ledGroup)} filter={urlOf(ids.pencilWobble)}>
      {ledActive && (
        <circle
          cx={GLOW.led.cx}
          cy={GLOW.led.cy}
          r={GLOW.led.r}
          fill={urlOf(ids.ledGlow)}
          opacity={GLOW.led.opacity}
        >
          {visualState.isRunning && (
            <animate
              attributeName="opacity"
              values={`${GLOW.led.opacity * 0.45};${GLOW.led.opacity};${GLOW.led.opacity * 0.45}`}
              dur={animationDuration(ANIMATION.glowPulseDurationBaseSec, speed)}
              repeatCount="indefinite"
            />
          )}
        </circle>
      )}

      <g transform={componentTransform(COMPONENT.ledTerminals)}>
        <path
          d={PATH.led.topTerminal}
          fill={inputTerminalActive ? COLOR.inputCurrentDark : COLOR.darkInk}
          stroke={COLOR.ink}
          strokeWidth={4}
        />
        <path
          d={PATH.led.bottomTerminal}
          fill={inputTerminalActive ? COLOR.inputCurrentDark : COLOR.darkInk}
          stroke={COLOR.ink}
          strokeWidth={4}
        />
      </g>

      <WirePath
        segment={WIRE.segments.inputPositive}
        active={inputWireActive}
        activeColor={COLOR.inputCurrent}
        speed={speed}
      />
      <WirePath
        segment={WIRE.segments.inputReturn}
        active={inputWireActive}
        activeColor={COLOR.inputCurrent}
        speed={speed}
      />

      <path
        d={PATH.led.base}
        fill={ledActive ? COLOR.ledOnSoft : "#d8d8d8"}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.led.platform}
        fill={ledActive ? "#fff7cc" : "#efefef"}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.led.dome}
        fill={ledActive ? "#fff9db" : "#fafafa"}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />

      <path
        d={PATH.led.reflection}
        fill="none"
        stroke={ledActive ? COLOR.ledOnDark : "#b7b7b7"}
        strokeWidth="4"
        strokeLinecap="round"
        opacity={ledActive ? 0.68 : 1}
      />
      <path
        d={PATH.led.chip}
        fill={ledActive ? COLOR.ledOnDark : "#1a1a1a"}
        stroke={COLOR.ink}
        strokeWidth={4}
      />

      <path
        d={PATH.led.leftLeg}
        fill="none"
        stroke={COLOR.ink}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d={PATH.led.rightLeg}
        fill="none"
        stroke={COLOR.ink}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {[PATH.led.pencilRayTop, PATH.led.pencilRayMiddle, PATH.led.pencilRayBottom].map(
        (ray, index) => (
          <path
            key={ray}
            d={ray}
            fill="none"
            stroke={ledActive ? COLOR.lightBeam : COLOR.graphite}
            strokeWidth={ledActive ? 4 : 2}
            strokeLinecap="round"
            opacity={ledActive ? 0.68 - index * 0.06 : 0.45 - index * 0.04}
          />
        )
      )}

      <g transform={componentTransform(COMPONENT.opticalArrows)}>
        {PATH.lightBeams.slice(0, 3).map((beam, index) => (
          <PulsingLightBeam
            key={beam}
            d={beam}
            ids={ids}
            active={visualState.lightActive}
            speed={speed}
            delay={index * 0.1}
          />
        ))}
      </g>
    </g>
  );
}

function OpticalBeamBlock({
  ids,
  active,
  speed,
}: {
  ids: SvgIds;
  active: boolean;
  speed: number;
}) {
  return (
    <g
      transform={componentTransform(COMPONENT.opticalArrows)}
      filter={urlOf(ids.pencilWobble)}
    >
      {PATH.lightBeams.slice(3).map((beam, index) => (
        <PulsingLightBeam
          key={beam}
          d={beam}
          ids={ids}
          active={active}
          speed={speed}
          delay={index * 0.15}
        />
      ))}
    </g>
  );
}

function PhototransistorOutputBlock({
  ids,
  visualState,
  speed,
}: {
  ids: SvgIds;
  visualState: VisualState;
  speed: number;
}) {
  const active = visualState.outputActive;

  return (
    <g
      transform={componentTransform(COMPONENT.phototransistorGroup)}
      filter={urlOf(ids.pencilWobble)}
    >
      {active && (
        <ellipse
          cx={GLOW.sensor.cx}
          cy={GLOW.sensor.cy}
          rx={GLOW.sensor.rx}
          ry={GLOW.sensor.ry}
          fill={urlOf(ids.sensorGlow)}
          opacity={GLOW.sensor.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${GLOW.sensor.opacity * 0.45};${GLOW.sensor.opacity};${GLOW.sensor.opacity * 0.45}`}
            dur={animationDuration(ANIMATION.glowPulseDurationBaseSec, speed)}
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      <path
        d={PATH.phototransistor.sensorPlate}
        fill={active ? COLOR.transistorSoft : "#e2e2e2"}
        stroke={COLOR.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d={PATH.phototransistor.sensorInner}
        fill="none"
        stroke={active ? COLOR.transistorActive : COLOR.graphite}
        strokeWidth={active ? 4 : 2}
        opacity={active ? 0.75 : 0.45}
      />

      <WirePath
        segment={WIRE.segments.collectorWire}
        active={active}
        activeColor={COLOR.outputCurrent}
        speed={speed}
      />
      <WirePath
        segment={WIRE.segments.emitterWire}
        active={active}
        activeColor={COLOR.outputCurrentDark}
        speed={speed}
      />

      <path
        d={PATH.phototransistor.collectorTerminal}
        fill={active ? COLOR.outputCurrentDark : COLOR.darkInk}
        stroke={COLOR.ink}
        strokeWidth={4}
      />
      <path
        d={PATH.phototransistor.emitterTerminal}
        fill={active ? COLOR.outputCurrentDark : COLOR.darkInk}
        stroke={COLOR.ink}
        strokeWidth={4}
      />

      <g transform={componentTransform(COMPONENT.phototransistorEmitterArrow)}>
        <path
          d={PATH.phototransistor.emitterArrow}
          fill={active ? COLOR.outputCurrent : COLOR.ink}
          stroke={COLOR.ink}
          strokeWidth="2"
          opacity={active ? 0.95 : 1}
        />
      </g>

      <path
        d={PATH.phototransistor.collectorTerminalHighlight}
        stroke="#f1f1f1"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d={PATH.phototransistor.emitterTerminalHighlight}
        stroke="#f1f1f1"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
}

function CurrentDotLayer({
  visualState,
  showCurrentDots,
  speed,
}: {
  visualState: VisualState;
  showCurrentDots: boolean;
  speed: number;
}) {
  if (!showCurrentDots || !visualState.isInputOn) return null;

  return (
    <g>
      {/* Step 1 only: input current wires */}
      <AnimatedDots
        active={visualState.inputCurrentActive}
        pathKey="inputPositive"
        speed={speed}
        count={ANIMATION.dotCountInput}
        color={COLOR.inputCurrent}
        glowColor={COLOR.inputCurrentSoft}
        glowOpacity={0.22}
      />

      <AnimatedDots
        active={visualState.inputCurrentActive}
        pathKey="inputReturn"
        speed={speed}
        count={ANIMATION.dotCountInput}
        color={COLOR.inputCurrent}
        glowColor={COLOR.inputCurrentSoft}
        glowOpacity={0.2}
      />

      {/* Step 2 only: LED internal current */}
      <AnimatedDots
        active={visualState.ledCurrentActive}
        pathKey="ledForward"
        speed={speed}
        count={ANIMATION.dotCountLed}
        color={COLOR.ledOnDark}
        glowColor={COLOR.ledOn}
        radius={7}
        glowOpacity={0.25}
      />

      {/* Step 4 only: output collector/emitter current */}
      <AnimatedDots
        active={visualState.outputActive}
        pathKey="collector"
        speed={speed}
        count={ANIMATION.dotCountOutput}
        color={COLOR.outputCurrent}
        glowColor={COLOR.outputCurrentSoft}
        glowOpacity={0.24}
      />

      <AnimatedDots
        active={visualState.outputActive}
        pathKey="emitter"
        speed={speed}
        count={ANIMATION.dotCountOutput}
        color={COLOR.outputCurrentDark}
        glowColor={COLOR.outputCurrentSoft}
        radius={7}
        glowOpacity={0.18}
      />
    </g>
  );
}

function DebugPathLayer({
  showDebugPaths,
}: {
  showDebugPaths: boolean;
}) {
  if (!showDebugPaths) return null;

  const guides: Array<{
    key: DotPathKey;
    label: string;
    color: string;
  }> = [
    {
      key: "inputPositive",
      label: "inputPositive path",
      color: COLOR.debugPathInput,
    },
    {
      key: "ledForward",
      label: "ledForward path",
      color: COLOR.debugPathLed,
    },
    {
      key: "inputReturn",
      label: "inputReturn path",
      color: COLOR.debugPathReturn,
    },
    {
      key: "collector",
      label: "collector path",
      color: COLOR.debugPathCollector,
    },
    {
      key: "emitter",
      label: "emitter path",
      color: COLOR.debugPathEmitter,
    },
  ];

  return (
    <g
      transform={componentTransform(COMPONENT.debugPaths)}
      fontFamily={LABEL.style.fontFamily}
      pointerEvents="none"
    >
      {guides.map((guide) => {
        const labelPoint = LABEL.debugPathPosition[guide.key];

        return (
          <g key={guide.key} transform={dotPathTransform(guide.key)}>
            <path
              d={PATH.dotPath[guide.key]}
              fill="none"
              stroke={guide.color}
              strokeWidth={3}
              strokeDasharray="10 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.75}
            />
            <circle
              cx={labelPoint.x}
              cy={labelPoint.y - 7}
              r={5}
              fill={guide.color}
              opacity={0.95}
            />
            <text
              x={labelPoint.x + 10}
              y={labelPoint.y}
              fontSize={LABEL.style.debugFontSize}
              fill={guide.color}
              fontWeight={700}
            >
              {guide.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function LabelLayer({
  showLabels,
  visualState,
}: {
  showLabels: boolean;
  visualState: VisualState;
}) {
  if (!showLabels) return null;

  return (
    <g
      transform={componentTransform(COMPONENT.labels)}
      fontFamily={LABEL.style.fontFamily}
      pointerEvents="none"
    >
      <text
        x={LABEL.position.inputCurrent.x}
        y={LABEL.position.inputCurrent.y}
        fontSize={LABEL.style.fontSize}
        fill={visualState.inputCurrentActive ? COLOR.inputCurrentDark : LABEL.style.mutedFill}
      >
        Input current
      </text>

      <text
        x={LABEL.position.ledOn.x}
        y={LABEL.position.ledOn.y}
        fontSize={LABEL.style.fontSize}
        fill={visualState.ledCurrentActive ? COLOR.ledOnDark : LABEL.style.mutedFill}
      >
        LED ON
      </text>

      <text
        x={LABEL.position.lightTransfer.x}
        y={LABEL.position.lightTransfer.y}
        fontSize={LABEL.style.smallFontSize}
        fill={visualState.lightActive ? COLOR.lightBeam : LABEL.style.mutedFill}
      >
        Light transfer
      </text>

      <text
        x={LABEL.position.phototransistorOn.x}
        y={LABEL.position.phototransistorOn.y}
        fontSize={LABEL.style.smallFontSize}
        fill={visualState.outputActive ? COLOR.outputCurrentDark : LABEL.style.mutedFill}
      >
        Phototransistor ON
      </text>

      <text
        x={LABEL.position.outputCurrent.x}
        y={LABEL.position.outputCurrent.y}
        fontSize={LABEL.style.smallFontSize}
        fill={visualState.outputActive ? COLOR.outputCurrentDark : LABEL.style.mutedFill}
      >
        Output current
      </text>
    </g>
  );
}

function DebugTerminalLayer({
  showDebugTerminals,
}: {
  showDebugTerminals: boolean;
}) {
  if (!showDebugTerminals) return null;

  const terminals: Array<{
    key: DebugTerminalKey;
    label: string;
    point: XY;
  }> = [
    { key: "pin1Anode", label: "Pin 1 Anode", point: NODE.pin1Anode },
    { key: "pin2Cathode", label: "Pin 2 Cathode", point: NODE.pin2Cathode },
    { key: "ledAnode", label: "LED Anode", point: NODE.ledAnode },
    { key: "ledCathode", label: "LED Cathode", point: NODE.ledCathode },
    { key: "opticalStart", label: "Beam Start", point: NODE.opticalStart },
    { key: "opticalEnd", label: "Beam End", point: NODE.opticalEnd },
    { key: "collector", label: "PT Collector", point: NODE.collector },
    { key: "emitter", label: "PT Emitter", point: NODE.emitter },
    { key: "pin4Collector", label: "Pin 4 Collector", point: NODE.pin4Collector },
    { key: "pin3Emitter", label: "Pin 3 Emitter", point: NODE.pin3Emitter },
  ];

  return (
    <g
      transform={componentTransform(COMPONENT.debugTerminals)}
      fontFamily={LABEL.style.fontFamily}
      pointerEvents="none"
    >
      {terminals.map((terminal) => {
        const point = withDebugOffset(terminal.key, terminal.point);

        return (
          <g key={terminal.key}>
            <circle
              cx={point.x}
              cy={point.y}
              r={9}
              fill={COLOR.debug}
              stroke={COLOR.paper}
              strokeWidth={3}
              opacity={0.95}
            />
            <text
              x={point.x + 13}
              y={point.y - 11}
              fontSize={18}
              fill={COLOR.debugText}
              fontWeight={700}
            >
              {terminal.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function PencilMarks({ ids }: { ids: SvgIds }) {
  return (
    <g
      transform={componentTransform(COMPONENT.pencilMarks)}
      filter={urlOf(ids.pencilWobble)}
      opacity="0.45"
    >
      <path d={PATH.pencilMarks.caseLeft} stroke="#7d7d7d" strokeWidth="2" fill="none" opacity="0.25" />
      <path d={PATH.pencilMarks.caseRight} stroke="#7d7d7d" strokeWidth="2" fill="none" opacity="0.22" />
      <path d={PATH.pencilMarks.floorLeft} stroke="#707070" strokeWidth="2" fill="none" opacity="0.2" />
      <path d={PATH.pencilMarks.floorRight} stroke="#707070" strokeWidth="2" fill="none" opacity="0.22" />

      <path d={PATH.pencilMarks.topLeft} stroke="#444" strokeWidth="2" fill="none" opacity="0.32" />
      <path d={PATH.pencilMarks.topRight} stroke="#444" strokeWidth="2" fill="none" opacity="0.32" />
      <path d={PATH.pencilMarks.topLine} stroke="#4d4d4d" strokeWidth="2" fill="none" opacity="0.26" />

      <path d={PATH.pencilMarks.ledSpark1} stroke={COLOR.lightBeam} strokeWidth="2" fill="none" opacity="0.38" />
      <path d={PATH.pencilMarks.ledSpark2} stroke={COLOR.lightBeam} strokeWidth="2" fill="none" opacity="0.32" />
      <path d={PATH.pencilMarks.ledSpark3} stroke={COLOR.lightBeam} strokeWidth="2" fill="none" opacity="0.28" />
    </g>
  );
}

/* ============================================================================
  UI Blocks
============================================================================ */

function TimelineBar({
  showTimeline,
  timelineProgress,
  simulationStep,
  stepName,
  isInputOn,
}: {
  showTimeline: boolean;
  timelineProgress: number;
  simulationStep: SimulationStep;
  stepName: string;
  isInputOn: boolean;
}) {
  if (!showTimeline) return null;

  return (
    <div className={CONTROL_STYLE.timelineWrapper}>
      <div className={CONTROL_STYLE.timelineTop}>
        <div className={CONTROL_STYLE.timelineText}>
          {isInputOn ? stepName : "Input OFF: no LED light, no output current"}
        </div>

        <div className={CONTROL_STYLE.timelineState}>
          {isInputOn ? `Active: ${SIMULATION.steps[simulationStep].shortName}` : "OFF state"}
        </div>
      </div>

      <div className={CONTROL_STYLE.timelineTrack}>
        <div
          className={CONTROL_STYLE.timelineFill}
          style={{
            width: `${Math.round(timelineProgress * 100)}%`,
            background: isInputOn ? stepColor(simulationStep) : COLOR.ink,
          }}
        />
      </div>

      <div className={CONTROL_STYLE.markerRow}>
        {SIMULATION.steps.map((step) => {
          const isActive = isInputOn && simulationStep === step.id;
          const color = stepColor(step.id);

          return (
            <div
              key={step.id}
              className={isActive ? CONTROL_STYLE.markerActive : CONTROL_STYLE.marker}
              style={
                isActive
                  ? {
                      background: color,
                      borderColor: color,
                      color: step.id === 1 ? "#422006" : COLOR.paper,
                    }
                  : undefined
              }
            >
              <span className={CONTROL_STYLE.markerDot} />
              <span>{step.shortName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ControlPanel({
  showControls,
  isRunning,
  isInputOn,
  speed,
  stepName,
  simulationStep,
  onToggleRunning,
  onToggleInput,
  onReset,
  onSpeedChange,
}: {
  showControls: boolean;
  isRunning: boolean;
  isInputOn: boolean;
  speed: number;
  stepName: string;
  simulationStep: SimulationStep;
  onToggleRunning: () => void;
  onToggleInput: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
}) {
  if (!showControls) return null;

  const activeStepColor = stepColor(simulationStep);

  return (
    <div className={CONTROL_STYLE.wrapper}>
      <div className={CONTROL_STYLE.row}>
        <button
          type="button"
          onClick={onToggleRunning}
          className={isRunning ? CONTROL_STYLE.buttonActive : CONTROL_STYLE.button}
          aria-pressed={isRunning}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          type="button"
          onClick={onToggleInput}
          className={isInputOn ? CONTROL_STYLE.buttonActive : CONTROL_STYLE.button}
          aria-pressed={isInputOn}
          style={
            isInputOn
              ? {
                  background: COLOR.inputCurrent,
                  borderColor: COLOR.inputCurrent,
                }
              : undefined
          }
        >
          {isInputOn ? "Input ON" : "Input OFF"}
        </button>

        <button type="button" onClick={onReset} className={CONTROL_STYLE.buttonDanger}>
          Reset
        </button>

        <div
          className={CONTROL_STYLE.stepBadge}
          style={
            isInputOn
              ? {
                  borderColor: activeStepColor,
                  background: `${activeStepColor}22`,
                }
              : undefined
          }
        >
          {isInputOn ? stepName : "Input OFF"}
        </div>

        <label className={CONTROL_STYLE.speedWrapper}>
          <span className={CONTROL_STYLE.label}>Speed</span>
          <input
            type="range"
            min={SIMULATION.minSpeed}
            max={SIMULATION.maxSpeed}
            step={SIMULATION.speedStep}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.currentTarget.value))}
            className={CONTROL_STYLE.range}
          />
          <span className="w-10 text-sm font-medium text-neutral-700">
            {speed.toFixed(1)}x
          </span>
        </label>
      </div>
    </div>
  );
}

/* ============================================================================
  Main Component
============================================================================ */

export default function WhatIsOptocouplerInteractive({
  className = "",
  showBackground = true,
  showControls = true,
  showTimeline = true,
  showLabels = false,
  showCurrentDots = true,
  showDebugTerminals = false,
  showDebugPaths = false,
  initialRunning = false,
  autoStart = false,
  simulationSpeed = SIMULATION.defaultSpeed,
}: WhatIsOptocouplerInteractiveProps) {
  const reactId = useId();

  const safeBaseId = useMemo(
    () => `what-is-optocoupler-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactId]
  );

  const ids = useMemo(() => createSvgIds(safeBaseId), [safeBaseId]);

  const [isRunning, setIsRunning] = useState<boolean>(() => autoStart || initialRunning);
  const [isInputOn, setIsInputOn] = useState<boolean>(() => autoStart || initialRunning);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>(0);
  const [timelineProgress, setTimelineProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(() => safeSpeed(simulationSpeed));

  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    progressRef.current = timelineProgress;
  }, [timelineProgress]);

  useEffect(() => {
    setSpeed(safeSpeed(simulationSpeed));
  }, [simulationSpeed]);

  useEffect(() => {
    if (!isInputOn) {
      setTimelineProgress(0);
      setSimulationStep(0);
      progressRef.current = 0;
    }
  }, [isInputOn]);

  useEffect(() => {
    if (!isRunning || !isInputOn) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const duration = SIMULATION.cycleDurationMs / safeSpeed(speed);
    const startTime = performance.now() - progressRef.current * duration;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = (((elapsed % duration) + duration) % duration) / duration;
      const nextStep = toStep(progress * SIMULATION.steps.length);

      setTimelineProgress(progress);
      setSimulationStep(nextStep);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, isInputOn, speed]);

  const visualState: VisualState = useMemo(() => {
    const inputCurrentActive = isInputOn && isRunning && simulationStep === 0;
    const ledCurrentActive = isInputOn && isRunning && simulationStep === 1;
    const lightActive = isInputOn && isRunning && simulationStep === 2;
    const outputActive = isInputOn && isRunning && simulationStep === 3;

    return {
      isInputOn,
      isRunning,
      simulationStep,
      inputCurrentActive,
      ledCurrentActive,
      lightActive,
      outputActive,
      ledGlowActive: ledCurrentActive,
    };
  }, [isInputOn, isRunning, simulationStep]);

  const currentStepName = isInputOn
    ? SIMULATION.steps[simulationStep].name
    : "Input OFF";

  const handleToggleRunning = () => {
    setIsRunning((current) => {
      const nextValue = !current;

      if (nextValue && !isInputOn) {
        setIsInputOn(true);
      }

      return nextValue;
    });
  };

  const handleToggleInput = () => {
    setIsInputOn((current) => !current);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsInputOn(false);
    setSimulationStep(0);
    setTimelineProgress(0);
    progressRef.current = 0;
  };

  const handleSpeedChange = (value: number) => {
    setSpeed(safeSpeed(value));
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Interactive hand drawn optocoupler working simulation"
          xmlns="http://www.w3.org/2000/svg"
        >
          <SvgDefs ids={ids} />

          {showBackground && (
            <rect
              x={VIEW_BOX.x}
              y={VIEW_BOX.y}
              width={VIEW_BOX.width}
              height={VIEW_BOX.height}
              fill={COLOR.paper}
            />
          )}

          <g transform={componentTransform(COMPONENT.fullCircuit)}>
            <ExternalPins ids={ids} />
            <PackageBody ids={ids} />

            <LedInputBlock
              ids={ids}
              visualState={visualState}
              speed={speed}
            />

            <OpticalBeamBlock
              ids={ids}
              active={visualState.lightActive}
              speed={speed}
            />

            <PhototransistorOutputBlock
              ids={ids}
              visualState={visualState}
              speed={speed}
            />

            <DebugPathLayer showDebugPaths={showDebugPaths} />

            <CurrentDotLayer
              visualState={visualState}
              showCurrentDots={showCurrentDots}
              speed={speed}
            />

            <LabelLayer
              showLabels={showLabels}
              visualState={visualState}
            />

            <DebugTerminalLayer showDebugTerminals={showDebugTerminals} />

            <PencilMarks ids={ids} />
          </g>
        </svg>
      </div>

      <TimelineBar
        showTimeline={showTimeline}
        timelineProgress={timelineProgress}
        simulationStep={simulationStep}
        stepName={currentStepName}
        isInputOn={isInputOn}
      />

      <ControlPanel
        showControls={showControls}
        isRunning={isRunning}
        isInputOn={isInputOn}
        speed={speed}
        stepName={currentStepName}
        simulationStep={simulationStep}
        onToggleRunning={handleToggleRunning}
        onToggleInput={handleToggleInput}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
}