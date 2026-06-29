export const multimeterSourceSize = {
  width: 558,
  height: 966,
} as const;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
};

export type Circle = {
  cx: number;
  cy: number;
  r: number;
};

export type Point = {
  x: number;
  y: number;
};

export type NormalizedPoint = {
  x: number;
  y: number;
};

function round(value: number) {
  return Number(value.toFixed(4));
}

export function pxX(value: number) {
  return round(value * multimeterSourceSize.width);
}

export function pxY(value: number) {
  return round(value * multimeterSourceSize.height);
}

export function point(x: number, y: number): Point {
  return { x: pxX(x), y: pxY(y) };
}

export function rect(
  x: number,
  y: number,
  width: number,
  height: number,
  rx = 0,
  ry = rx,
): Rect {
  return {
    x: pxX(x),
    y: pxY(y),
    width: pxX(width),
    height: pxY(height),
    rx: pxX(rx),
    ry: pxY(ry),
  };
}

export function circle(cx: number, cy: number, r: number): Circle {
  return {
    cx: pxX(cx),
    cy: pxY(cy),
    r: pxX(r),
  };
}

export function pointsToPath(points: Point[], close = false) {
  if (points.length === 0) return "";

  const [first, ...rest] = points;
  const start = `M ${first.x} ${first.y}`;
  const body = rest.map((item) => `L ${item.x} ${item.y}`).join(" ");

  return `${start}${body ? ` ${body}` : ""}${close ? " Z" : ""}`;
}

// Easy control variables for the Ω-range green guide line.
// Coordinates are normalized: x = 0 to 1, y = 0 to 1.
export const ohmGreenGuideControls = {
  startAt2000k: { x: 0.0914, y: 0.5549 },
  topAt200k: { x: 0.2885, y: 0.5362 },
  leftVerticalAt20k: { x: 0.2885, y: 0.69 },
  bottomLeft: { x: 0.36, y: 0.69 },
  bottomRight: { x: 0.47, y: 0.69 },
  endAt200: { x: 0.452, y: 0.61 },
} as const satisfies Record<string, NormalizedPoint>;

export const diodeRedGuideControls = {
  startLeftOfDiode: { x: 0.56, y: 0.748 },
  topNearDiode: { x: 0.635, y: 0.726 },
  rightLowerNearDiode: { x: 0.69, y: 0.79 },
  bottomLeftOfDiode: { x: 0.58, y: 0.79 },
} as const satisfies Record<string, NormalizedPoint>;

export const multimeterGeometry = {
  canvas: {
    ...multimeterSourceSize,
    viewBox: `0 0 ${multimeterSourceSize.width} ${multimeterSourceSize.height}`,
  },

  outerBody: rect(0.0448, 0.0248, 0.9122, 0.9607, 0.058, 0.058),
  innerBody: rect(0.0789, 0.0601, 0.8405, 0.9099, 0.034, 0.034),
  controlPanel: rect(0.0806, 0.2308, 0.8387, 0.7402, 0.004, 0.004),

  topPanel: rect(0.076, 0.0269, 0.8477, 0.1946, 0.038, 0.038),
  topPanelInner: rect(0.1039, 0.0424, 0.7939, 0.1677, 0.03, 0.03),
  displayBezel: rect(0.1344, 0.0745, 0.733, 0.1139, 0.008, 0.008),
  displayScreen: rect(0.1756, 0.0901, 0.6505, 0.0839, 0.002, 0.002),

  dial: {
    center: point(0.4973, 0.4948),
    outerRadius: pxX(0.3432),
    bezelRadius: pxX(0.3342),
    faceRadius: pxX(0.3082),
    capRadius: pxX(0.0242),
    capCenter: point(0.4176, 0.3416),
    pointerStart: point(0.405, 0.349),
    pointerEnd: point(0.592, 0.644),
    pointerWidth: pxX(0.042),
  },

  modeWindows: {
    offWindow: rect(0.4525, 0.2391, 0.1039, 0.0642, 0.012, 0.012),
    npnPnpBox: rect(0.0896, 0.6605, 0.2061, 0.1625, 0.012, 0.012),
    ohmBox: rect(0.2939, 0.765, 0.2876, 0.0994, 0.012, 0.012),
    diodeBox: rect(0.5681, 0.765, 0.1398, 0.0994, 0.012, 0.012),
    hfeBox: rect(0.6828, 0.647, 0.0789, 0.205, 0.012, 0.012),
  },

  transistorSocket: {
    outer: circle(0.1604, 0.7391, 0.061),
    inner: circle(0.1604, 0.7391, 0.0415),
  },

  probeJacks: {
    tenAmp: circle(0.8369, 0.7236, 0.0475),
    vmA: circle(0.8369, 0.8188, 0.0475),
    com: circle(0.8369, 0.912, 0.0475),
    innerRadius: pxX(0.0224),
  },

  warningArea: {
    top: point(0.52, 0.7805),
    bottom: point(0.52, 0.9109),
  },

  guidePaths: {
    leftUpperWhite: pointsToPath(
      [
        point(0.0914, 0.2453),
        point(0.4552, 0.2453),
        point(0.461, 0.2764),
        point(0.4588, 0.528),
        point(0.0851, 0.5518),
      ],
      false,
    ),

    rightUpperWhite: pointsToPath(
      [
        point(0.5735, 0.2443),
        point(0.8889, 0.2443),
        point(0.7258, 0.4296),
        point(0.6935, 0.619),
        point(0.5806, 0.7329),
      ],
      false,
    ),

    ohmGuidePath: pointsToPath(
      [
        point(
          ohmGreenGuideControls.startAt2000k.x,
          ohmGreenGuideControls.startAt2000k.y,
        ),
        point(
          ohmGreenGuideControls.topAt200k.x,
          ohmGreenGuideControls.topAt200k.y,
        ),
        point(
          ohmGreenGuideControls.leftVerticalAt20k.x,
          ohmGreenGuideControls.leftVerticalAt20k.y,
        ),
        point(
          ohmGreenGuideControls.bottomLeft.x,
          ohmGreenGuideControls.bottomLeft.y,
        ),
        point(
          ohmGreenGuideControls.bottomRight.x,
          ohmGreenGuideControls.bottomRight.y,
        ),
        point(
          ohmGreenGuideControls.endAt200.x,
          ohmGreenGuideControls.endAt200.y,
        ),
      ],
      false,
    ),

    leftGreen: "",

    rightGreen: "",

    rightRed: pointsToPath(
      [
        point(0.7366, 0.5714),
        point(0.9023, 0.6356),
        point(0.9023, 0.7008),
        point(0.8297, 0.7402),
      ],
      false,
    ),

    diodeGuidePath: pointsToPath(
      [
        point(
          diodeRedGuideControls.startLeftOfDiode.x,
          diodeRedGuideControls.startLeftOfDiode.y,
        ),
        point(
          diodeRedGuideControls.topNearDiode.x,
          diodeRedGuideControls.topNearDiode.y,
        ),
        point(
          diodeRedGuideControls.rightLowerNearDiode.x,
          diodeRedGuideControls.rightLowerNearDiode.y,
        ),
        point(
          diodeRedGuideControls.bottomLeftOfDiode.x,
          diodeRedGuideControls.bottomLeftOfDiode.y,
        ),
      ],
      false,
    ),

    bottomRed: "",
  },
} as const;

export type MultimeterGeometry = typeof multimeterGeometry;
