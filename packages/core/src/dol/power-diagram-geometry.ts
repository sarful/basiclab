export const DOL_POWER_DIAGRAM_GEOMETRY = {
  stage: {
    width: 760,
    height: 956,
  },
  source: {
    startX: 68,
    railYs: [128, 162, 196] as const,
    labelsX: 26,
  },
  mccb: {
    phaseXs: [360, 410, 460] as const,
    x: 335,
    y: 232,
    scale: 2.5,
    topY: 232,
    bottomY: 357,
    leftLabelX: 248,
    rightLabelX: 490,
    labelY: 268,
  },
  contactor: {
    topY: 406,
    bottomY: 531,
    leftLabelX: 302,
    rightLabelX: 490,
    labelY: 446,
  },
  overload: {
    y: 576,
    leftLabelX: 286,
    rightLabelX: 490,
    labelY: 618,
  },
  motor: {
    centerX: 410,
    centerY: 798,
  },
} as const;
