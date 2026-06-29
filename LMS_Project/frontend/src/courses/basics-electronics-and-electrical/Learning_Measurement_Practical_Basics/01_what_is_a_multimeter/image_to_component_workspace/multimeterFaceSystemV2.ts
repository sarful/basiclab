import { multimeterGeometry } from "./multimeterGeometry";

const MICRO = "\u03bc";
const OMEGA = "\u03a9";

export type MultimeterFaceStopIdV2 =
  | "off"
  | "dcv_1000"
  | "dcv_200"
  | "dcv_20"
  | "dcv_2000m"
  | "dcv_200m"
  | "ohm_2000k"
  | "ohm_200k"
  | "ohm_20k"
  | "ohm_2000"
  | "ohm_200"
  | "diode"
  | "acv_750"
  | "acv_200"
  | "dca_200u"
  | "dca_2000u"
  | "dca_20m"
  | "dca_200m"
  | "dca_10a";

export type PointV2 = {
  x: number;
  y: number;
};

export type MultimeterFaceStopV2 = {
  angle: number;
  id: MultimeterFaceStopIdV2;
  labelAngle?: number;
  labelRadius?: number;
  labelSize?: number;
  legendText?: string;
  tickInnerRadius?: number;
  tickOuterRadius?: number;
  tone?: "neutral" | "green" | "red";
};

export type MultimeterFaceMajorLabelV2 = {
  angle: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  radius: number;
  size: number;
  text: string;
};

export const multimeterFaceCenterV2 = multimeterGeometry.dial.center;
export const multimeterFaceDotRadiusV2 =
  multimeterGeometry.dial.outerRadius * 1.02;

function roundSvg(value: number) {
  return Number(value.toFixed(4));
}

function buildAngleSeries(startAngle: number, endAngle: number, count: number) {
  if (count <= 1) return [startAngle];

  const step = (endAngle - startAngle) / (count - 1);

  return Array.from({ length: count }, (_, index) =>
    roundSvg(startAngle + step * index),
  );
}

export function pointOnDialV2(angle: number, radius: number): PointV2 {
  const radians = (angle * Math.PI) / 180;

  return {
    x: roundSvg(multimeterFaceCenterV2.x + Math.cos(radians) * radius),
    y: roundSvg(multimeterFaceCenterV2.y + Math.sin(radians) * radius),
  };
}

export const multimeterFaceMajorLabelsV2: MultimeterFaceMajorLabelV2[] = [
  { angle: -133, color: "#ff8a3d", radius: 250, size: 10, text: "DCV" },
  { angle: -88, color: "#ff5538", radius: 215, size: 10, text: "OFF" },
  { angle: -60, color: "#4da3ff", radius: 220, size: 10, text: "ACV" },
  { angle: -5, color: "#b06cff", radius: 220, size: 10, text: "DCA" },
  { angle: 115, color: "#ffd84a", radius: 246, size: 10, text: OMEGA },
  {
    angle: 60,
    color: "#ff69b4",
    offsetX: +50,
    offsetY: -50,
    radius: 242,
    size: 10,
    text: "10A",
  },
];

const globalStopAngles = buildAngleSeries(-165, 177, 19);

const multimeterFaceStopDefinitionsV2: MultimeterFaceStopV2[] = [
  {
    id: "dcv_1000",
    angle: globalStopAngles[3],
    labelAngle: globalStopAngles[3],
    legendText: "1000",
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  { id: "off", angle: globalStopAngles[4], tone: "red" },
  {
    id: "acv_750",
    angle: globalStopAngles[5],
    labelAngle: globalStopAngles[5],
    legendText: "750",
    labelRadius: 234,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dcv_200",
    angle: globalStopAngles[2],
    labelAngle: globalStopAngles[2],
    legendText: "200",
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "acv_200",
    angle: globalStopAngles[6],
    labelAngle: globalStopAngles[6],
    legendText: "200",
    labelRadius: 234,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dcv_20",
    angle: globalStopAngles[1],
    labelAngle: globalStopAngles[1],
    legendText: "20",
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_200u",
    angle: globalStopAngles[7],
    labelAngle: globalStopAngles[7],
    legendText: `200${MICRO}`,
    labelRadius: 238,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dcv_2000m",
    angle: globalStopAngles[0],
    labelAngle: globalStopAngles[0],
    legendText: "2000m",
    labelRadius: 222,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_2000u",
    angle: globalStopAngles[8],
    labelAngle: globalStopAngles[8],
    legendText: `2000${MICRO}`,
    labelRadius: 225,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dcv_200m",
    angle: globalStopAngles[18],
    labelAngle: globalStopAngles[18],
    legendText: "200m",
    labelRadius: 220,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_20m",
    angle: globalStopAngles[9],
    labelAngle: globalStopAngles[9],
    legendText: "20m",
    labelRadius: 220,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_2000k",
    angle: globalStopAngles[17],
    labelAngle: globalStopAngles[17],
    legendText: "2000k",
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dca_200m",
    angle: globalStopAngles[10],
    labelAngle: globalStopAngles[10],
    legendText: "200m",
    labelRadius: 238,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_200k",
    angle: globalStopAngles[16],
    labelAngle: globalStopAngles[16],
    legendText: "200k",
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_20k",
    angle: globalStopAngles[15],
    labelAngle: globalStopAngles[15],
    legendText: "20k",
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  { id: "dca_10a", angle: globalStopAngles[11], tone: "red" },
  {
    id: "ohm_2000",
    angle: globalStopAngles[14],
    labelAngle: globalStopAngles[14],
    legendText: "2000",
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_200",
    angle: globalStopAngles[13],
    labelAngle: globalStopAngles[13],
    legendText: "200",
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  { id: "diode", angle: globalStopAngles[12], tone: "red" },
];

export const multimeterFaceStopsV2: MultimeterFaceStopV2[] =
  multimeterFaceStopDefinitionsV2.map((stop): MultimeterFaceStopV2 => ({
  tickInnerRadius: multimeterGeometry.dial.outerRadius * 1.015,
  tickOuterRadius: multimeterGeometry.dial.outerRadius * 1.105,
  ...stop,
  }));

export const multimeterFaceDiodeV2 = {
  angle: globalStopAngles[12],
  color: "#22c55e",
  offsetX: 0,
  offsetY: -10,
  radius: 229,
} as const;
